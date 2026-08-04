// Suy dẫn thuần từ một session (mọi type). Feed/lịch/streak/xếp hạng chỉ đọc các
// field cấp trên + hàm ở đây, không cần biết cấu trúc gym bên trong detail.
import { actOf, fieldsOf, rpeOf, rpeLabel, actLabel, actVerb, metForSpeed, dotsCoeff } from './activities.js';
import { t } from '../i18n.js';
import { uid } from './format.js';
import { tVol } from './stats.js';

// Phút vận động dùng để chấm điểm: chặn [0,180] để không thưởng việc tập quá sức
// và tránh timer quên tắt.
export const activeMinutes = s => Math.min(180, Math.max(0, Math.round(s.durationMin || 0)));

// Gym: quy đổi volume load (set×rep×kg × RPE × hệ số DOTS) → MET. GYM_MET_CAP giữ gym
// không vượt cardio tối đa (chạy nhanh ~12.8).
// GYM_K neo 2026-08 (chặng DOTS): chọn để NAM 70kg (hệ số DOTS ~0.7512) giữ NGUYÊN điểm
// như trước chặng DOTS (K cũ 0.011): 0.011 / 0.7512 ≈ 0.0146. Nhờ vậy nhóm nam ~70kg
// (đa số hiện tại) không xáo trộn, còn người nhẹ hơn / nữ được hệ số cao hơn → điểm tăng
// đúng phần bất công cũ. Median ~6000kg/60p/RPE3 nam 70kg ≈ 6.0 MET (ngang cardio vừa),
// chỉ leg-day cực nặng mới chạm trần. Xem thêm activities.js dotsCoeff.
const GYM_K = 0.0146;
const GYM_MET_CAP = 11;
// Hệ số DOTS "trung tính" khi buổi tập chưa có cân nặng+giới (session cũ, hoặc user chưa
// backfill). = DOTS của nam 70kg (~0.751) → nhân GYM_K 0.0146 ≈ 0.011 (K trước chặng DOTS),
// nên buổi thiếu dữ liệu chấm y như hệ cũ, không thổi phồng. Người nhập đủ dữ liệu (nhất là
// nữ / người nhẹ) mới lệch khỏi mốc này theo hướng công bằng hơn.
const NEUTRAL_DOTS = dotsCoeff(70, 'male');

// MET hiệu dụng của 1 session — nền tảng chấm điểm, thống nhất cho mọi môn.
//   pace     : MET nền theo tốc độ (quãng đường + thời lượng) × hệ số RPE (0.8–1.2).
//   gym      : suy từ volume load × RPE (clamp về [metMin, GYM_MET_CAP]).
//   rpe_only : nội suy tuyến tính metMin↔metMax theo index của mức RPE.
export const effectiveMet = s => {
  const a = actOf(s.type);
  const rpe = rpeOf(s.detail?.rpe);
  if (a.category === 'pace') {
    const km = s.type === 'swim'
      ? (parseFloat(s.detail?.distanceM) || 0) / 1000
      : (parseFloat(s.detail?.distanceKm) || 0);
    const kmh = km > 0 ? km / (activeMinutes(s) / 60) : 0;
    return metForSpeed(s.type, kmh) * rpe.factor;
  }
  if (a.category === 'gym') {
    // dots = hệ số DOTS (cân nặng+giới), CHỈ có trên object chấm điểm tạm lúc dựng/preview —
    // KHÔNG lưu vào doc (cân nặng là dữ liệu riêng tư, buổi tập hiển thị cho công ty; hệ số
    // này suy ngược ra cân nặng được). Thiếu → NEUTRAL_DOTS (chấm như hệ cũ, không hồi tố).
    const coeff = s.detail?.dots ?? NEUTRAL_DOTS;
    const load = (s.detail?.totalVol || 0) * rpe.gymRaw * coeff;
    const met = load * GYM_K / Math.max(1, activeMinutes(s));
    return Math.min(GYM_MET_CAP, Math.max(a.metMin || 0, met));
  }
  const lo = a.metMin || 0;
  const hi = a.metMax || lo;
  return lo + rpe.index * (hi - lo);
};

// Điểm buổi tập = MET hiệu dụng × thời lượng (giờ) × 10 (chuẩn MET-phút của WHO/IPAQ,
// chia lại theo giờ ×10 cho số điểm gọn). Trục duy nhất so sánh công bằng mọi môn.
export const computePoints = s =>
  Math.round(effectiveMet(s) * (activeMinutes(s) / 60) * 10);

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
    { icon: 'flame', v: Math.round(d.totalVol || 0), u: 'kg',   l: t('stat.volume') },
    { icon: 'check', v: d.totalSets || 0,            u: 'sets', l: t('stat.sets') },
    { icon: 'clock', v: s.durationMin || 0,          u: t('unit.min'), l: t('stat.duration') },
  ];
  if (s.type === 'swim' && d.distanceM) return [
    { icon: 'route', v: d.distanceM,        u: 'm',     l: t('stat.distance') },
    { icon: 'clock', v: s.durationMin || 0, u: t('unit.min'),  l: t('stat.duration') },
    { icon: 'wave',  v: pace100Label(s),    u: '/100m', l: t('stat.pace') },
  ];
  if (s.type === 'cycle' && d.distanceKm) return [
    { icon: 'route', v: d.distanceKm,       u: 'km',   l: t('stat.distance') },
    { icon: 'clock', v: s.durationMin || 0, u: t('unit.min'), l: t('stat.duration') },
    { icon: 'gauge', v: speedKmh(s),        u: 'km/h', l: t('stat.avgSpeed') },
  ];
  if (actOf(s.type).kind === 'distance' && d.distanceKm) return [
    { icon: 'route', v: d.distanceKm,       u: 'km',   l: t('stat.distance') },
    { icon: 'clock', v: s.durationMin || 0, u: t('unit.min'), l: t('stat.duration') },
    { icon: 'bolt',  v: paceLabel(s),       u: '/km',  l: t('stat.pace') },
  ];
  return [
    { icon: 'clock', v: s.durationMin || 0,      u: t('unit.min'), l: t('stat.duration') },
    { icon: 'bolt',  v: rpeLabel(d.rpe),          u: '',     l: t('stat.effort') },
    { icon: 'star',  v: s.points || 0,           u: t('unit.points'), l: t('stat.points') },
  ];
};

// Câu tiêu đề feed: "<tên> đã chạy · 8.2 km" ...
export const headline = s => {
  const vb = actVerb(s.type);
  const a = actOf(s.type);
  const d = s.detail || {};
  if (s.type === 'gym') return `${vb} ${s.title || actLabel('gym')}`;
  if (s.type === 'swim' && d.distanceM) return `${vb} ${d.distanceM} m`;
  if (a.kind === 'distance' && d.distanceKm) return `${vb} ${d.distanceKm} km`;
  return `${vb} ${s.durationMin || 0} ${t('unit.min')}`;
};

// Cân nặng+giới → hệ số DOTS cho gym; thiếu một trong hai → null (chấm coeff 1 = tuyệt đối cũ).
export const gymDotsFor = body => (body?.weightKg > 0 && body?.sex) ? dotsCoeff(body.weightKg, body.sex) : null;

// Bổ sung các field dẫn xuất + thông tin tác giả để tạo doc hoàn chỉnh (khớp firestore.rules).
// gymDots (nếu có) chỉ dùng để CHẤM ĐIỂM buổi gym, KHÔNG lưu vào doc (bảo mật cân nặng — xem
// effectiveMet). Điểm chốt một lần ở đây rồi đóng băng vào s.points; không tính lại về sau.
export function finalizeSession(base, author, streakAtPost = 0, gymDots = null) {
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
  // Object chấm điểm tạm có detail.dots; s trả về KHÔNG chứa dots.
  const scoreView = gymDots != null ? { ...s, detail: { ...s.detail, dots: gymDots } } : s;
  s.points = computePoints(scoreView);
  return s;
}

// Dựng session gym từ workout đang tập + meta (title/note/photo/date/visibility/durationMin).
// body = { weightKg, sex } của tác giả để chấm điểm theo DOTS (không lưu vào doc). Thiếu → tuyệt đối cũ.
export function buildGymSession(active, meta, author, streakAtPost = 0, body = null) {
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
    detail: { progId: active.progId, progName: active.progName, dayName: active.dayName, totalVol, totalSets, exs, rpe: parseInt(meta.rpe) || 3 },
  };
  return finalizeSession(base, author, streakAtPost, gymDotsFor(body));
}

// Gom các ô nhập của form thành object detail SẠCH (bỏ ô rỗng, ép kiểu theo field).
// Ô `pace` là dẫn xuất (chỉ hiển thị) nên không lưu; durationMin nằm ở cấp trên.
function collectDetail(type, vals) {
  const detail = {};
  for (const f of fieldsOf(type)) {
    if (f.type === 'pace' || f.k === 'durationMin') continue;
    const raw = vals[f.k];
    // RPE bắt buộc: rỗng → mặc định mức def (Vừa).
    if (f.type === 'rpe') { detail.rpe = parseInt(raw) || f.def || 3; continue; }
    if (raw == null || raw === '') continue;
    if (f.type === 'number' || f.type === 'counter') {
      const n = parseFloat(raw);
      if (!isNaN(n)) detail[f.k] = n;
    } else {
      detail[f.k] = raw;
    }
  }
  if (detail.rpe == null) detail.rpe = 3;
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
