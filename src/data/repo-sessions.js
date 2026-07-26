import {
  writeBatch, doc, deleteDoc, updateDoc, collection, query, where, orderBy, limit,
  startAfter, getDocs, onSnapshot, increment, serverTimestamp,
} from 'fb/firestore';
import { db, reportCloudError } from '../firebase.js';
import { advanceStreak, computeStreak, dayStr } from '../domain/streak.js';
import { weekId, monthId } from '../domain/period.js';

const PAGE = 15;
const DAY_MIN_CAP = 120; // phút tối đa tính điểm/xếp hạng mỗi ngày

const sid = (uid, id) => `${uid}_${id}`;

// Lưu 1 batch: session + tổng/streak trên user + entry tuần & tháng cho leaderboard.
// me: { uid, name, photoURL, dept, streak, prefs }. dayCtx: { alreadyCountedToday, minutesToday }.
// Trả streak mới để cập nhật userDoc cục bộ.
export async function saveSession(session, me, dayCtx = {}) {
  const b = writeBatch(db);
  b.set(doc(db, 'sessions', sid(me.uid, session.id)), session);

  const st = advanceStreak(me.streak, session.date);
  const volKg = session.type === 'gym' ? Math.round(session.detail?.totalVol || 0) : 0;

  b.set(doc(db, 'users', me.uid), {
    streak: st,
    lastActiveAt: serverTimestamp(),
    totals: {
      sessions: increment(1),
      minutes: increment(session.activeMinutes),
      points: increment(session.points),
      volumeKg: increment(volKg),
    },
  }, { merge: true });

  const counted = session.visibility === 'company' && session.activeMinutes >= 5;
  if (counted && !me.prefs?.optOutLeaderboard) {
    const addSession = dayCtx.alreadyCountedToday ? 0 : 1;
    const capMin = Math.max(0, Math.min(session.activeMinutes, DAY_MIN_CAP - (dayCtx.minutesToday || 0)));
    for (const pid of [weekId(session.date), monthId(session.date)]) {
      b.set(doc(db, 'leaderboard', pid, 'entries', me.uid), {
        uid: me.uid, name: me.name, photoURL: me.photoURL || null, dept: me.dept || '',
        sessions: increment(addSession),
        minutes: increment(capMin),
        points: increment(session.points),
        volumeKg: increment(volKg),
        longestStreakInPeriod: st.current,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  }

  await b.commit();
  return st;
}

export async function deleteSession(uid, id) {
  try { await deleteDoc(doc(db, 'sessions', sid(uid, id))); }
  catch (e) { reportCloudError('Xoá buổi tập trên cloud thất bại', e); }
}

// KIỂM DUYỆT (admin): gỡ bài vi phạm của NGƯỜI KHÁC. Chỉ xoá doc session —
// KHÔNG hoàn nguyên số liệu/streak/leaderboard của tác giả (client không có dữ liệu
// buổi tập của họ để tính lại; chấp nhận lệch nhỏ, reconcile sau bằng Cloud Function).
// Rules cho phép admin delete mọi session. Ảnh xoá best-effort ở tầng gọi.
export async function adminDeleteSession(session) {
  await deleteDoc(doc(db, 'sessions', sid(session.authorUid, session.id)));
}

// Sửa nội dung mô tả của buổi tập (title/note/ảnh). CỐ Ý không đụng điểm/streak/leaderboard/totals
// để không cộng trùng — sửa chữ/ảnh nhật ký không làm thay đổi thứ hạng. Rules cho chủ bài update
// mọi field trừ authorUid/loggedAt/date/counters, nên merge các field này là hợp lệ.
export async function updateSessionContent(uid, id, patch) {
  const data = { title: patch.title || '', note: patch.note || '' };
  if ('photoUrl' in patch) data.photoUrl = patch.photoUrl || null;
  await updateDoc(doc(db, 'sessions', sid(uid, id)), data);
}

// Tính lại entry leaderboard của MỘT kỳ từ các buổi tập cục bộ còn lại (sau khi xoá 1 bài).
// Khớp công thức tổng hợp ở saveSession: điểm cộng dồn, phút cap 120/ngày, sessions = số NGÀY có tập.
function recomputePeriodEntry(remaining, inPeriod) {
  const counted = remaining.filter(s =>
    (s.visibility ?? 'company') === 'company' && (s.activeMinutes || 0) >= 5 && inPeriod(s.date));
  if (counted.length === 0) return null;
  const byDay = {};
  let points = 0, volumeKg = 0;
  for (const s of counted) {
    points += s.points || 0;
    volumeKg += (s.type === 'gym') ? Math.round(s.detail?.totalVol || s.totalVol || 0) : 0;
    byDay[s.date] = (byDay[s.date] || 0) + (s.activeMinutes || 0);
  }
  const minutes = Object.values(byDay).reduce((t, m) => t + Math.min(m, DAY_MIN_CAP), 0);
  return { points, volumeKg, minutes, sessions: Object.keys(byDay).length };
}

// Xoá 1 buổi tập KÈM hoàn nguyên số liệu (cho trường hợp đăng nhầm / test).
// - Xoá doc + giảm totals của user (điểm/phút/buổi/volume).
// - Tính lại streak từ các buổi còn lại (giống nút "Tính lại chuỗi").
// - Tính lại entry leaderboard tuần & tháng của bài bị xoá từ các buổi còn lại (self-correcting).
// remaining = danh sách buổi tập CỤC BỘ đã bỏ bài này (bản mirror có totalVol top-level).
// Trả streak mới để cập nhật userDoc cục bộ. Lưu ý: KHÔNG hoàn nguyên PR (giữ nguyên) và huy hiệu.
export async function deleteSessionWithStats(session, me, remaining) {
  const b = writeBatch(db);
  b.delete(doc(db, 'sessions', sid(me.uid, session.id)));

  const st = computeStreak(remaining.map(s => s.date).filter(Boolean));
  const volKg = session.type === 'gym' ? Math.round(session.detail?.totalVol || session.totalVol || 0) : 0;
  b.set(doc(db, 'users', me.uid), {
    streak: { current: st.current, longest: st.longest, lastDate: st.lastDate },
    lastActiveAt: serverTimestamp(),
    totals: {
      sessions: increment(-1),
      minutes: increment(-(session.activeMinutes || 0)),
      points: increment(-(session.points || 0)),
      volumeKg: increment(-volKg),
    },
  }, { merge: true });

  if (!me.prefs?.optOutLeaderboard) {
    const periods = [
      [weekId(session.date), d => weekId(d) === weekId(session.date)],
      [monthId(session.date), d => monthId(d) === monthId(session.date)],
    ];
    for (const [pid, inPeriod] of periods) {
      const ref = doc(db, 'leaderboard', pid, 'entries', me.uid);
      const agg = recomputePeriodEntry(remaining, inPeriod);
      if (!agg) { b.delete(ref); continue; }
      b.set(ref, {
        uid: me.uid, name: me.name, photoURL: me.photoURL || null, dept: me.dept || '',
        sessions: agg.sessions, minutes: agg.minutes, points: agg.points, volumeKg: agg.volumeKg,
        longestStreakInPeriod: st.current, updatedAt: serverTimestamp(),
      });
    }
  }

  await b.commit();
  return st;
}

// 1 trang feed công ty (mỗi trang PAGE docs). typeFilter: id môn hoặc null.
export async function feedPage(cursor = null, typeFilter = null) {
  const parts = [collection(db, 'sessions'), where('visibility', '==', 'company')];
  if (typeFilter) parts.push(where('type', '==', typeFilter));
  parts.push(orderBy('loggedAt', 'desc'), limit(PAGE));
  if (cursor) parts.push(startAfter(cursor));
  const snap = await getDocs(query(...parts));
  return {
    items: snap.docs.map(d => d.data()),
    cursor: snap.docs[snap.docs.length - 1] || null,
    done: snap.docs.length < PAGE,
  };
}

// Lắng nghe bài mới hơn mốc đã có (đầu feed) — hẹp, có limit.
export function listenNewPosts(sinceLoggedAt, cb) {
  return onSnapshot(
    query(collection(db, 'sessions'),
      where('visibility', '==', 'company'),
      where('loggedAt', '>', sinceLoggedAt),
      orderBy('loggedAt', 'desc'), limit(20)),
    snap => cb(snap.docs.map(d => d.data())),
    e => reportCloudError('Không tải được bảng tin', e)
  );
}

// Lịch sử của 1 người. isSelf=true -> lấy cả buổi riêng tư; xem người khác -> chỉ 'company'
// (rules chặn đọc buổi private của người khác, nên query phải lọc visibility).
export async function historyOf(uid, { cursor = null, isSelf = false } = {}) {
  const parts = [collection(db, 'sessions'), where('authorUid', '==', uid)];
  if (!isSelf) parts.push(where('visibility', '==', 'company'));
  parts.push(orderBy('loggedAt', 'desc'), limit(PAGE));
  if (cursor) parts.push(startAfter(cursor));
  const snap = await getDocs(query(...parts));
  return {
    items: snap.docs.map(d => d.data()),
    cursor: snap.docs[snap.docs.length - 1] || null,
    done: snap.docs.length < PAGE,
  };
}

// Toàn bộ buổi tập của 1 người (cap 400, đủ cho tính kỷ lục cá nhân trên hồ sơ).
// isSelf=true → cả buổi riêng tư; xem người khác → chỉ 'company' (khớp rules).
export async function allSessionsOf(uid, { isSelf = false } = {}) {
  const parts = [collection(db, 'sessions'), where('authorUid', '==', uid)];
  if (!isSelf) parts.push(where('visibility', '==', 'company'));
  parts.push(orderBy('loggedAt', 'desc'), limit(400));
  const snap = await getDocs(query(...parts));
  return snap.docs.map(d => d.data());
}

// Xoá toàn bộ buổi tập của mình (khi xoá tài khoản). Best-effort, theo trang.
export async function deleteAllMySessions(uid) {
  let more = true;
  while (more) {
    const snap = await getDocs(query(collection(db, 'sessions'), where('authorUid', '==', uid), limit(200)));
    if (snap.empty) break;
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref).catch(() => {})));
    more = snap.docs.length === 200;
  }
}

// Bối cảnh ngày (để cap sessions/minutes) tính từ cache session cục bộ của chính mình.
export function dayContext(localSessions, date = dayStr(new Date())) {
  const today = localSessions.filter(s => s.date === date && (s.visibility ?? 'company') === 'company');
  const minutesToday = today.reduce((t, s) => t + (s.activeMinutes || 0), 0);
  return { alreadyCountedToday: today.length > 0, minutesToday };
}
