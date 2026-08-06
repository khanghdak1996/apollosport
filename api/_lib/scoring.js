// Chấm điểm xếp hạng SERVER-AUTHORITATIVE (thay cho Cloud Function — Firestore ở asia-southeast3
// không deploy được CF trigger). Chạy trên Vercel serverless qua service account (bỏ qua rules).
//
// Vì sao: client bị firestore.rules cấm ghi leaderboard/totals (create/update:false). Chỉ đây
// (service account) cộng dồn từ buổi tập THẬT rồi ghi. Điểm gym phụ thuộc cân nặng riêng tư (DOTS)
// không lưu trong doc → server CỘNG DỒN `session.points` đã đóng băng (rules đã chặn trần points
// ≤ activeMinutes×3 để buổi giả không mang điểm phi lý).
//
// Logic PORT từ: src/data/repo-sessions.js (recomputePeriodEntry), src/domain/period.js, streak.js.
const { fsGet, fsQuery, fsPatch, fsDelete } = require('./fcm.js');

const DAY_MIN_CAP = 120; // phút tối đa tính xếp hạng mỗi ngày (khớp client cũ)

// ── Kỳ (port src/domain/period.js) — chỉ phụ thuộc chuỗi 'YYYY-MM-DD' ──
const p2 = (n) => String(n).padStart(2, '0');
function isoWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day + 3);
  const year = d.getFullYear();
  const firstThu = new Date(year, 0, 4);
  const firstDay = (firstThu.getDay() + 6) % 7;
  firstThu.setDate(firstThu.getDate() - firstDay + 3);
  const week = 1 + Math.round((d - firstThu) / (7 * 86400000));
  return { year, week };
}
const weekId = (dateStr) => { const { year, week } = isoWeek(dateStr); return `w-${year}-W${p2(week)}`; };
const monthId = (dateStr) => `m-${dateStr.slice(0, 7)}`;

// ── Streak hiện tại (port computeStreak, chỉ .current) ──
const DAY = 86400000;
const dayStr = (d) => { const x = d instanceof Date ? d : new Date(d); return `${x.getFullYear()}-${p2(x.getMonth() + 1)}-${p2(x.getDate())}`; };
const shift = (ds, n) => dayStr(new Date(new Date(ds + 'T00:00:00').getTime() + n * DAY));
function currentStreak(dates, today = dayStr(new Date())) {
  const set = new Set(dates);
  let cur = set.has(today) ? today : shift(today, -1);
  let n = 0;
  while (set.has(cur)) { n++; cur = shift(cur, -1); }
  return n;
}

// ── Tổng hợp 1 entry của kỳ từ buổi 'company' (khớp recomputePeriodEntry) ──
function aggregate(sessions, inPeriod) {
  const counted = sessions.filter((s) =>
    (s.visibility ?? 'company') === 'company' && (s.activeMinutes || 0) >= 5 && s.date && inPeriod(s.date));
  if (counted.length === 0) return null;
  const byDay = {};
  let points = 0, volumeKg = 0;
  for (const s of counted) {
    points += s.points || 0;
    volumeKg += (s.type === 'gym') ? Math.round((s.detail && s.detail.totalVol) || 0) : 0;
    byDay[s.date] = (byDay[s.date] || 0) + (s.activeMinutes || 0);
  }
  const minutes = Object.values(byDay).reduce((t, m) => t + Math.min(m, DAY_MIN_CAP), 0);
  return { points, volumeKg, minutes, sessions: Object.keys(byDay).length };
}

// Đọc toàn bộ buổi tập của 1 user (mọi visibility) qua REST.
async function sessionsOf(uid, at) {
  return fsQuery({
    from: [{ collectionId: 'sessions' }],
    where: { fieldFilter: { field: { fieldPath: 'authorUid' }, op: 'EQUAL', value: { stringValue: uid } } },
    limit: 2000,
  }, at);
}

// Tính lại totals + entry leaderboard tuần/tháng của 1 user từ buổi thật. Idempotent.
// extraDates: ngày của buổi VỪA đổi (client gửi lên) — để ghé cả kỳ nay dù kỳ đó đã hết buổi,
// nhờ vậy xoá được entry mồ côi khi user xoá buổi cuối của kỳ.
async function recomputeUser(uid, at, extraDates = []) {
  const u = (await fsGet(`users/${uid}`, at)) || {};
  const optOut = !!(u.prefs && u.prefs.optOutLeaderboard);
  const sessions = await sessionsOf(uid, at);

  // totals: đếm MỌI buổi (gồm riêng tư), khớp saveSession cũ.
  const totals = sessions.reduce((t, s) => ({
    sessions: t.sessions + 1,
    minutes: t.minutes + (s.activeMinutes || 0),
    points: t.points + (s.points || 0),
    volumeKg: t.volumeKg + (s.type === 'gym' ? Math.round((s.detail && s.detail.totalVol) || 0) : 0),
  }), { sessions: 0, minutes: 0, points: 0, volumeKg: 0 });
  await fsPatch(`users/${uid}`, { totals }, at);

  const streakNow = currentStreak(sessions.map((s) => s.date).filter(Boolean));

  // Kỳ cần cập nhật = mọi tuần/tháng có buổi 'company'. (Kỳ mất sạch buổi → entry được xoá ở
  // lần recompute do buổi cuối bị xoá kích hoạt; xem note bên dưới về entry mồ côi.)
  const periods = new Map();
  const addP = (pid, inPeriod) => { if (!periods.has(pid)) periods.set(pid, inPeriod); };
  for (const s of sessions) {
    if (!s.date || (s.visibility ?? 'company') !== 'company') continue;
    const w = weekId(s.date), m = monthId(s.date);
    addP(w, (d) => weekId(d) === w);
    addP(m, (d) => monthId(d) === m);
  }
  for (const dt of extraDates) {
    if (!dt) continue;
    const w = weekId(dt), m = monthId(dt);
    addP(w, (d) => weekId(d) === w);
    addP(m, (d) => monthId(d) === m);
  }
  for (const [pid, inPeriod] of periods) {
    const agg = optOut ? null : aggregate(sessions, inPeriod);
    const ref = `leaderboard/${pid}/entries/${uid}`;
    if (!agg) { await fsDelete(ref, at); continue; }
    await fsPatch(ref, {
      uid, name: u.name || '', photoURL: u.photoURL || null, dept: u.dept || '',
      sessions: agg.sessions, minutes: agg.minutes, points: agg.points, volumeKg: agg.volumeKg,
      longestStreakInPeriod: streakNow, updatedAt: Date.now(),
    }, at);
  }
  return { periods: periods.size, sessions: sessions.length };
}

// Danh sách mọi authorUid (cho backfill admin). Đọc nhẹ.
async function allAuthorUids(at) {
  const rows = await fsQuery({ from: [{ collectionId: 'sessions' }], select: { fields: [{ fieldPath: 'authorUid' }] }, limit: 20000 }, at);
  return [...new Set(rows.map((r) => r.authorUid).filter(Boolean))];
}

module.exports = { recomputeUser, allAuthorUids, weekId, monthId };
