// Tạo dữ liệu giả cho GIẢ LẬP Firebase — để xem app trông thế nào khi đã có đồng nghiệp dùng.
// Dùng khi đánh giá trải nghiệm: bảng tin có bài, bảng xếp hạng có người, CLB có nhóm.
//
// Chạy:  node tools/seed-demo-data.mjs
// Yêu cầu: `firebase emulators:start` đang chạy (cần Java trên PATH:
//          export PATH="/opt/homebrew/opt/openjdk/bin:$PATH")
//
// ┌─ CHỐT AN TOÀN ────────────────────────────────────────────────────────────┐
// │ Script CHỈ chạy khi đích đến là giả lập trên máy (127.0.0.1 / localhost). │
// │ Trỏ vào bất cứ đâu khác là dừng ngay — không có đường nào chạm dữ liệu    │
// │ thật của đồng nghiệp.                                                     │
// └───────────────────────────────────────────────────────────────────────────┘

const HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const PROJECT = 'apollo-sport-social';

if (!/^(127\.0\.0\.1|localhost|\[::1\]):\d+$/.test(HOST)) {
  console.error(`\n✖ TỪ CHỐI CHẠY: đích đến "${HOST}" không phải giả lập trên máy.`);
  console.error('  Script này chỉ được phép ghi vào 127.0.0.1 / localhost.');
  console.error('  Nếu bạn định ghi vào Firestore thật — đừng. Dữ liệu người dùng thật không phải chỗ để thử.\n');
  process.exit(1);
}

const BASE = `http://${HOST}/v1/projects/${PROJECT}/databases/(default)/documents`;

// ── Chuyển giá trị JS sang định dạng typed của Firestore REST ──
function val(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  if (typeof v === 'string') return { stringValue: v };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(val) } };
  return { mapValue: { fields: fields(v) } };
}
const fields = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, val(v)]));

let written = 0;
// PATCH KHÔNG kèm updateMask sẽ THAY THẾ cả document (xoá field không gửi lên).
// Truyền `only` để chỉ ghi đè đúng field đó — dùng khi cập nhật một phần doc đã có.
async function put(path, data, only = null) {
  const mask = only ? '?' + only.map((f) => `updateMask.fieldPaths=${f}`).join('&') : '';
  const res = await fetch(`${BASE}/${path}${mask}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
    body: JSON.stringify({ fields: fields(data) }),
  });
  if (!res.ok) throw new Error(`${path} → ${res.status} ${await res.text()}`);
  written++;
}

// ── Ngày & kỳ (khớp src/domain/period.js) ──
const p2 = (n) => String(n).padStart(2, '0');
const dayStr = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return dayStr(d); };
function isoWeek(ds) {
  const d = new Date(ds + 'T00:00:00');
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 3);
  const year = d.getFullYear();
  const firstThu = new Date(year, 0, 4);
  firstThu.setDate(firstThu.getDate() - ((firstThu.getDay() + 6) % 7) + 3);
  return { year, week: 1 + Math.round((d - firstThu) / (7 * 86400000)) };
}
const weekId = (ds) => { const { year, week } = isoWeek(ds); return `w-${year}-W${p2(week)}`; };
const monthId = (ds) => `m-${ds.slice(0, 7)}`;

// ── Đồng nghiệp ảo ──
// Cố ý trải rộng mức độ vận động: vài người rất chăm, phần lớn vừa phải, vài người
// mới tập lác đác — để bảng xếp hạng phản ánh một công ty thật, không phải toàn người khoẻ.
const PEOPLE = [
  { uid: 'demo-01', name: 'Trần Thu Hà', dept: 'Academic', gender: 'female', level: 'cao' },
  { uid: 'demo-02', name: 'Lê Quốc Anh', dept: 'Sales', gender: 'male', level: 'cao' },
  { uid: 'demo-03', name: 'Phạm Mỹ Linh', dept: 'Marketing', gender: 'female', level: 'vua' },
  { uid: 'demo-04', name: 'Đỗ Hoàng Nam', dept: 'IT', gender: 'male', level: 'vua' },
  { uid: 'demo-05', name: 'Vũ Thanh Trúc', dept: 'HR', gender: 'female', level: 'vua' },
  { uid: 'demo-06', name: 'Bùi Đức Thắng', dept: 'Sales', gender: 'male', level: 'vua' },
  { uid: 'demo-07', name: 'Ngô Kim Chi', dept: 'Academic', gender: 'female', level: 'thap' },
  { uid: 'demo-08', name: 'Hoàng Việt Dũng', dept: 'IT', gender: 'male', level: 'thap' },
  { uid: 'demo-09', name: 'Đặng Ngọc Mai', dept: 'Marketing', gender: 'female', level: 'thap' },
  { uid: 'demo-10', name: 'Lý Tuấn Kiệt', dept: 'Operations', gender: 'male', level: 'thap' },
  { uid: 'demo-11', name: 'Nguyễn Bảo Châu', dept: 'HR', gender: 'female', level: 'moi' },
  { uid: 'demo-12', name: 'Trịnh Gia Huy', dept: 'Operations', gender: 'male', level: 'moi' },
];

// Số buổi trong 21 ngày gần nhất theo mức độ.
const SESSIONS_BY_LEVEL = { cao: 14, vua: 8, thap: 4, moi: 1 };

// MET xấp xỉ theo môn (khớp tinh thần src/domain/activities.js — đủ để UI trông thật).
const ACTS = [
  { type: 'run', label: 'Chạy bộ', met: 9.0, km: 5.2, min: 32 },
  { type: 'walk', label: 'Đi bộ', met: 3.5, km: 3.0, min: 35 },
  { type: 'gym', label: 'Tập gym', met: 5.0, km: 0, min: 55 },
  { type: 'cycle', label: 'Đạp xe', met: 7.5, km: 14, min: 45 },
  { type: 'swim', label: 'Bơi', met: 8.0, km: 1.2, min: 40 },
  { type: 'yoga', label: 'Yoga', met: 3.0, km: 0, min: 50 },
  { type: 'badminton', label: 'Cầu lông', met: 5.5, km: 0, min: 60 },
];

const NOTES = [
  'Sáng nay dậy sớm được, thấy tỉnh cả ngày.',
  'Trời mát, chạy thấy nhẹ hơn hẳn tuần trước.',
  'Rủ được đồng nghiệp đi cùng, vui hơn tập một mình.',
  'Hôm nay hơi mệt nên giảm cường độ, miễn là không bỏ buổi.',
  '',
  '',
];

// Sinh ngẫu nhiên nhưng CỐ ĐỊNH theo uid — chạy lại cho ra cùng dữ liệu, dễ so sánh ảnh chụp.
function rng(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return () => { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff; };
}

async function main() {
  console.log(`→ Ghi vào giả lập tại ${HOST} (project ${PROJECT})\n`);

  const agg = new Map(); // `${uid}|${pid}` → { sessions, minutes, points, volumeKg }
  const bump = (uid, pid, s) => {
    const k = `${uid}|${pid}`;
    const a = agg.get(k) || { sessions: 0, minutes: 0, points: 0, volumeKg: 0 };
    a.sessions++; a.minutes += s.activeMinutes; a.points += s.points;
    agg.set(k, a);
  };

  const feedSessions = [];

  for (const p of PEOPLE) {
    const rand = rng(p.uid);
    const n = SESSIONS_BY_LEVEL[p.level];
    const dates = new Set();
    while (dates.size < n) dates.add(Math.floor(rand() * 21));

    let totals = { sessions: 0, minutes: 0, points: 0, volumeKg: 0 };

    for (const ago of [...dates].sort((a, b) => a - b)) {
      const a = ACTS[Math.floor(rand() * ACTS.length)];
      const date = daysAgo(ago);
      const min = Math.round(a.min * (0.8 + rand() * 0.4));
      const points = Math.round(a.met * (min / 60) * 10);
      const id = `s${ago}-${Math.floor(rand() * 100000)}`;
      const ts = Date.now() - ago * 86400000;

      // UI đọc `durationMin` và `detail.*` (xem summaryStats trong src/domain/session.js) —
      // KHÔNG phải activeMinutes. Ghi sai chỗ thì bảng tin hiện "0 phút".
      const km = a.km ? Math.round(a.km * (0.8 + rand() * 0.4) * 10) / 10 : 0;
      const detail =
        a.type === 'gym' ? { totalVol: 2400 + Math.round(rand() * 1800), totalSets: 12 + Math.floor(rand() * 8) }
        : a.type === 'swim' ? { distanceM: Math.round(km * 1000) }
        : km ? { distanceKm: km }
        : {};

      const s = {
        id, type: a.type, date,
        authorUid: p.uid, authorName: p.name, authorPhoto: null, dept: p.dept,
        durationMin: min, activeMinutes: min, points,
        rpe: 3, title: '', note: NOTES[(ago + p.uid.length) % NOTES.length],
        visibility: 'company', photoUrl: null,
        startTime: ts - min * 60000, endTime: ts, loggedAt: ts,
        streakAtPost: 0, reactionCount: 0, commentCount: 0, schemaV: 1,
        detail,
      };

      await put(`sessions/${p.uid}_${id}`, s);
      bump(p.uid, weekId(date), s);
      bump(p.uid, monthId(date), s);
      totals.sessions++; totals.minutes += min; totals.points += points;
      if (ago <= 3) feedSessions.push({ sid: `${p.uid}_${id}`, author: p });
    }

    await put(`users/${p.uid}`, {
      uid: p.uid, email: `${p.uid}@apollo.edu.vn`, name: p.name,
      photoURL: null, dept: p.dept, center: '', title: '', gender: p.gender,
      accent: '#0084ff',
      prefs: { defaultVisibility: 'company', optOutLeaderboard: false, hideWeight: true, onboarded: true },
      streak: { current: p.level === 'cao' ? 6 : p.level === 'vua' ? 2 : 0, longest: 9, lastDate: daysAgo(p.level === 'cao' ? 0 : 3) },
      badges: [], totals,
      createdAt: new Date(Date.now() - 40 * 86400000),
      lastActiveAt: new Date(),
    });
    console.log(`  ${p.name.padEnd(20)} ${String(totals.sessions).padStart(2)} buổi · ${String(totals.points).padStart(3)} điểm`);
  }

  // ── Bảng xếp hạng: ghi entry cho mọi người, gồm cả tài khoản thật đang đăng nhập ──
  for (const [k, a] of agg) {
    const [uid, pid] = k.split('|');
    const p = PEOPLE.find((x) => x.uid === uid);
    await put(`leaderboard/${pid}/entries/${uid}`, {
      uid, name: p.name, photoURL: null, dept: p.dept,
      sessions: a.sessions, minutes: a.minutes, points: a.points, volumeKg: 0,
      longestStreakInPeriod: 0, updatedAt: Date.now(),
    });
  }

  // ── Tim + bình luận trên vài bài gần đây (bảng tin trông có tương tác) ──
  const REPLIES = [
    'Ngưỡng mộ quá, tuần nào cũng đều 💪',
    'Hôm nào rủ mình đi với nhé!',
    'Pace này ngon đấy 👏',
  ];
  for (let i = 0; i < Math.min(6, feedSessions.length); i++) {
    const { sid } = feedSessions[i];
    const fans = PEOPLE.filter((x) => x.uid !== feedSessions[i].author.uid).slice(i, i + 2 + (i % 3));
    for (const f of fans) {
      await put(`sessions/${sid}/reactions/${f.uid}`, { uid: f.uid, kind: 'heart', at: new Date() });
      await put(`users/${f.uid}/reacted/${sid}`, { at: new Date(), kind: 'heart' });
    }
    await put(`sessions/${sid}`, { reactionCount: fans.length }, ['reactionCount']);
    if (i % 2 === 0) {
      const c = PEOPLE[(i + 3) % PEOPLE.length];
      await put(`sessions/${sid}/comments/c${i}`, {
        uid: c.uid, name: c.name, photoURL: null,
        text: REPLIES[i % REPLIES.length], createdAt: new Date(),
      });
    }
  }

  // ── Câu lạc bộ ──
  const CLUBS = [
    { id: 'run-demo01', name: 'Apollo Runners', sport: 'run', desc: 'Chạy bộ sáng thứ 3 & thứ 5 quanh hồ.', coverEmoji: '🏃', owner: PEOPLE[0] },
    { id: 'badminton-demo02', name: 'Cầu lông chiều thứ 6', sport: 'badminton', desc: 'Sân gần văn phòng, ai cũng chơi được.', coverEmoji: '🏸', owner: PEOPLE[1] },
  ];
  for (const c of CLUBS) {
    const members = PEOPLE.slice(0, c.sport === 'run' ? 6 : 4);
    await put(`clubs/${c.id}`, {
      id: c.id, name: c.name, sport: c.sport, desc: c.desc, coverEmoji: c.coverEmoji,
      ownerUid: c.owner.uid, ownerName: c.owner.name, visibility: 'public',
      memberCount: members.length, createdAt: new Date(Date.now() - 20 * 86400000),
    });
    for (const m of members) {
      await put(`clubs/${c.id}/members/${m.uid}`, {
        uid: m.uid, name: m.name, photoURL: null,
        role: m.uid === c.owner.uid ? 'owner' : 'member', joinedAt: new Date(),
      });
    }
  }

  // ── Mục tiêu chung toàn công ty ──
  const goalId = 'g-demo01';
  await put(`goals/${goalId}`, {
    id: goalId, title: 'Cả công ty đi bộ 1000 km trong tháng 9',
    scope: 'company', clubId: null, clubName: null,
    metric: 'distance', sport: 'walk', target: 1000,
    startDate: daysAgo(20), endDate: daysAgo(-10),
    creatorUid: PEOPLE[4].uid, creatorName: PEOPLE[4].name,
    createdAt: new Date(Date.now() - 20 * 86400000),
  });
  for (const p of PEOPLE.slice(0, 8)) {
    await put(`goals/${goalId}/progress/${p.uid}`, {
      uid: p.uid, name: p.name,
      value: Math.round(20 + rng(p.uid)() * 60), updatedAt: new Date(),
    });
  }

  console.log(`\n✔ Xong — đã ghi ${written} bản ghi vào giả lập.`);
  console.log('  Mở lại http://localhost:8146 để xem.\n');
}

main().catch((e) => { console.error('\n✖ Lỗi:', e.message, '\n'); process.exit(1); });
