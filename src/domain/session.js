// Suy dẫn thuần từ một session (mọi type). Feed/lịch/streak/xếp hạng chỉ đọc các
// field cấp trên + hàm ở đây, không cần biết cấu trúc gym bên trong detail.
import { actOf, fieldsOf } from './activities.js';
import { uid } from './format.js';
import { tVol } from './stats.js';

// Phút vận động dùng để chấm điểm: chặn [0,180] để không thưởng việc tập quá sức
// và tránh timer quên tắt.
export const activeMinutes = s => Math.min(180, Math.max(0, Math.round(s.durationMin || 0)));

const INTENSITY_K = { 'nhẹ': 0.8, 'vừa': 1.0, 'mạnh': 1.2 };

// Điểm quy đổi chung giữa mọi môn. ~1 điểm / phút vận động cường độ vừa.
// Đây là trục duy nhất so sánh được gym với chạy/yoga (kg vô nghĩa với các môn kia).
export const computePoints = s => {
  const a = actOf(s.type);
  const k = INTENSITY_K[s.detail?.intensity] ?? 1.0;
  return Math.round(activeMinutes(s) * a.met * k / 5);
};

// Pace phút/km cho môn distance.
export const paceMinPerKm = detail => {
  const km = parseFloat(detail?.distanceKm) || 0;
  const min = parseFloat(detail?.durationMin ?? detail?.durationMinFallback) || 0;
  return km > 0 && min > 0 ? min / km : 0;
};

const mmss = minutes => {
  const m = Math.floor(minutes);
  const sec = Math.round((minutes - m) * 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

export const paceLabel = s => {
  const km = parseFloat(s.detail?.distanceKm) || 0;
  if (!km || !s.durationMin) return '—';
  return mmss(s.durationMin / km);
};

// Pace phút/100m cho bơi.
export const pace100Label = s => {
  const m = parseFloat(s.detail?.distanceM) || 0;
  if (!m || !s.durationMin) return '—';
  return mmss(s.durationMin / (m / 100));
};

// Tốc độ trung bình km/h cho đạp xe.
export const speedKmh = s => {
  const km = parseFloat(s.detail?.distanceKm) || 0;
  if (!km || !s.durationMin) return 0;
  return Math.round((km / (s.durationMin / 60)) * 10) / 10;
};

// Footer chỉ số cho feed/card — khác nhau theo môn. Trả [{icon, v, u, l}] (l = nhãn cho SessDetail).
export const summaryStats = s => {
  const d = s.detail || {};
  if (s.type === 'gym') return [
    { icon: 'flame', v: Math.round(d.totalVol || 0), u: 'kg',   l: 'Tổng volume' },
    { icon: 'check', v: d.totalSets || 0,            u: 'sets', l: 'Tổng set' },
    { icon: 'clock', v: s.durationMin || 0,          u: 'phút', l: 'Thời lượng' },
  ];
  if (s.type === 'swim' && d.distanceM) return [
    { icon: 'route', v: d.distanceM,        u: 'm',     l: 'Quãng đường' },
    { icon: 'clock', v: s.durationMin || 0, u: 'phút',  l: 'Thời lượng' },
    { icon: 'wave',  v: pace100Label(s),    u: '/100m', l: 'Pace' },
  ];
  if (s.type === 'cycle' && d.distanceKm) return [
    { icon: 'route', v: d.distanceKm,       u: 'km',   l: 'Quãng đường' },
    { icon: 'clock', v: s.durationMin || 0, u: 'phút', l: 'Thời lượng' },
    { icon: 'gauge', v: speedKmh(s),        u: 'km/h', l: 'Tốc độ TB' },
  ];
  if (actOf(s.type).kind === 'distance' && d.distanceKm) return [
    { icon: 'route', v: d.distanceKm,       u: 'km',   l: 'Quãng đường' },
    { icon: 'clock', v: s.durationMin || 0, u: 'phút', l: 'Thời lượng' },
    { icon: 'bolt',  v: paceLabel(s),       u: '/km',  l: 'Pace' },
  ];
  return [
    { icon: 'clock', v: s.durationMin || 0,   u: 'phút', l: 'Thời lượng' },
    { icon: 'bolt',  v: d.intensity || 'vừa', u: '',     l: 'Cường độ' },
    { icon: 'star',  v: s.points || 0,        u: 'điểm', l: 'Điểm' },
  ];
};

// Câu tiêu đề feed: "<tên> đã chạy · 8.2 km" ...
export const headline = s => {
  const a = actOf(s.type);
  const d = s.detail || {};
  if (s.type === 'gym') return `${a.verb} ${s.title || 'gym'}`;
  if (s.type === 'swim' && d.distanceM) return `${a.verb} ${d.distanceM} m`;
  if (a.kind === 'distance' && d.distanceKm) return `${a.verb} ${d.distanceKm} km`;
  return `${a.verb} ${s.durationMin || 0} phút`;
};

// Bổ sung các field dẫn xuất + thông tin tác giả để tạo doc hoàn chỉnh (khớp firestore.rules).
export function finalizeSession(base, author, streakAtPost = 0) {
  const s = {
    ...base,
    authorUid: author.uid,
    authorName: author.name,
    authorPhoto: author.photoURL || null,
    dept: author.dept || '',
    activeMinutes: 0, points: 0,
    streakAtPost,
    reactionCount: 0, commentCount: 0,
    schemaV: 1,
  };
  s.activeMinutes = activeMinutes(s);
  s.points = computePoints(s);
  return s;
}

// Dựng session gym từ workout đang tập + meta (title/note/photo/date/visibility/durationMin).
export function buildGymSession(active, meta, author, streakAtPost = 0) {
  const now = Date.now();
  const start = active.startTime;
  const rawMin = meta.durationMin != null ? meta.durationMin : Math.round((now - start) / 60000);
  const durationMin = Math.min(1440, Math.max(0, Math.round(rawMin)));
  const exs = active.exs || [];
  const totalVol = tVol(exs);
  const totalSets = exs.reduce((t, e) => t + e.sets.filter(x => x.done).length, 0);
  const date = meta.date || new Date(start).toISOString().split('T')[0];
  const base = {
    id: active.id,
    type: 'gym',
    title: meta.title || active.dayName,
    note: meta.note || '',
    photoUrl: meta.photoUrl || null,
    date, startTime: start, endTime: now, loggedAt: meta.loggedAt || now,
    durationMin,
    visibility: meta.visibility || 'company',
    detail: { progId: active.progId, progName: active.progName, dayName: active.dayName, totalVol, totalSets, exs },
  };
  return finalizeSession(base, author, streakAtPost);
}

// Gom các ô nhập của form thành object detail SẠCH (bỏ ô rỗng, ép kiểu theo field).
// Ô `pace` là dẫn xuất (chỉ hiển thị) nên không lưu; durationMin nằm ở cấp trên.
function collectDetail(type, vals) {
  const detail = {};
  for (const f of fieldsOf(type)) {
    if (f.type === 'pace' || f.k === 'durationMin') continue;
    const raw = vals[f.k];
    if (raw == null || raw === '') { if (f.k === 'intensity') detail.intensity = f.def || 'vừa'; continue; }
    if (f.type === 'number' || f.type === 'counter') {
      const n = parseFloat(raw);
      if (!isNaN(n)) detail[f.k] = n;
    } else {
      detail[f.k] = raw;
    }
  }
  if (detail.intensity == null) detail.intensity = 'vừa';
  return detail;
}

// Dựng session môn khác từ form LogActivity.
export function buildActivitySession(input, author, streakAtPost = 0) {
  const now = Date.now();
  const durationMin = Math.min(1440, Math.max(0, Math.round(input.durationMin || 0)));
  const a = actOf(input.type);
  const detail = collectDetail(input.type, input.vals || input);
  const km = parseFloat(detail.distanceKm);
  if (!isNaN(km) && km > 0 && durationMin > 0) detail.paceMinPerKm = durationMin / km;
  if (Array.isArray(input.laps) && input.laps.length) detail.laps = input.laps;
  const date = input.date || new Date(now).toISOString().split('T')[0];
  const base = {
    id: uid(),
    type: input.type,
    title: input.title || a.label,
    note: input.note || '',
    photoUrl: input.photoUrl || null,
    date, startTime: now - durationMin * 60000, endTime: now, loggedAt: now,
    durationMin,
    visibility: input.visibility || 'company',
    detail,
  };
  return finalizeSession(base, author, streakAtPost);
}
