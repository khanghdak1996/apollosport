import {
  writeBatch, doc, deleteDoc, updateDoc, collection, query, where, orderBy, limit,
  startAfter, getDocs, onSnapshot, serverTimestamp,
} from 'fb/firestore';
import { db, reportCloudError } from '../firebase.js';
import { t } from '../i18n.js';
import { advanceStreak, computeStreak, dayStr } from '../domain/streak.js';
import { requestRescore } from './score.js';

const PAGE = 15;

const sid = (uid, id) => `${uid}_${id}`;

// Lưu buổi tập + cập nhật streak cục bộ trên user doc. totals + entry leaderboard KHÔNG ghi ở
// client nữa — Cloud Function onSessionWrite tính lại từ buổi tập THẬT (server-authoritative,
// chống bịa điểm qua F12). dayCtx giữ cho tương thích chữ ký gọi (không còn dùng).
// me: { uid, name, photoURL, dept, streak, prefs }. Trả streak mới để cập nhật userDoc cục bộ.
export async function saveSession(session, me, dayCtx = {}) {
  const b = writeBatch(db);
  b.set(doc(db, 'sessions', sid(me.uid, session.id)), session);

  const st = advanceStreak(me.streak, session.date);
  b.set(doc(db, 'users', me.uid), {
    streak: st,
    lastActiveAt: serverTimestamp(),
  }, { merge: true });

  await b.commit();
  requestRescore([session.date]); // server tính lại totals + leaderboard từ buổi thật (fire-and-forget)
  return st;
}

export async function deleteSession(uid, id) {
  try { await deleteDoc(doc(db, 'sessions', sid(uid, id))); }
  catch (e) { reportCloudError(t('err.deleteCloudSession'), e); }
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

// F5 — Đổi công khai/riêng tư của MỘT buổi đã đăng. Chỉ ghi field visibility; entry leaderboard
// (chỉ tính 'company') do Cloud Function tính lại. allSessions giữ cho tương thích (không dùng).
export async function updateSessionVisibility(session, visibility, me, allSessions) {
  await updateDoc(doc(db, 'sessions', sid(me.uid, session.id)), { visibility });
  requestRescore([session.date]); // leaderboard chỉ tính 'company' → đổi visibility phải tính lại
}

// Xoá 1 buổi tập KÈM tính lại streak cục bộ (cho trường hợp đăng nhầm / test).
// totals + entry leaderboard do Cloud Function tính lại từ buổi còn lại (server-authoritative).
// remaining = danh sách buổi tập CỤC BỘ đã bỏ bài này. Trả streak mới để cập nhật userDoc cục bộ.
export async function deleteSessionWithStats(session, me, remaining) {
  const b = writeBatch(db);
  b.delete(doc(db, 'sessions', sid(me.uid, session.id)));

  const st = computeStreak(remaining.map(s => s.date).filter(Boolean));
  b.set(doc(db, 'users', me.uid), {
    streak: { current: st.current, longest: st.longest, lastDate: st.lastDate },
    lastActiveAt: serverTimestamp(),
  }, { merge: true });

  await b.commit();
  requestRescore([session.date]); // xoá buổi → server tính lại (kèm date để xoá entry mồ côi nếu kỳ hết buổi)
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
    e => reportCloudError(t('err.loadFeed'), e)
  );
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
