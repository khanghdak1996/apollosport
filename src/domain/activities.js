import { t } from '../i18n.js';
// Registry đa môn thể thao.
// kind      quyết định form nào render (strength dùng luồng gym cũ; distance/session dùng LogActivity).
// category  quyết định CÁCH tính MET để chấm điểm (xem domain/session.js effectiveMet):
//   pace      – MET nền tra từ TỐC ĐỘ (quãng đường bắt buộc + thời lượng → speedBands),
//               rồi × hệ số RPE (0.8–1.2) để thưởng nỗ lực cá nhân.
//   rpe_only  – MET nội suy tuyến tính giữa metMin↔metMax theo mức RPE (index).
//   gym       – MET suy từ volume load (set×rep×kg) × RPE (metMin/metMax chỉ để clamp).
// metMin/metMax = dải MET của môn, rà với Compendium 2024 (2026-08): metMin ~ biến thể nhẹ/xã giao,
// metMax ~ biến thể thi đấu/gắng sức; RPE nội suy giữa hai đầu. Pickleball chưa có mã Compendium → ước lượng.
// speedBands = ngưỡng tốc độ km/h → MET cho môn category=pace ([[maxKmh, met], …], phần tử cuối Infinity).
// fields = ô nhập RIÊNG cho môn đó. Không có fields → dùng FIELDS[kind] mặc định.
// Thêm môn mới = thêm 1 dòng ở đây, không phải đổi schema hay rules.

// ── Thang RPE 5 mức (Borg CR-10 rút gọn) — dùng CHUNG cho mọi môn ───────────
// index  = hệ số nội suy MET (0→metMin, 1→metMax) cho môn rpe_only.
// factor = hệ số điều chỉnh MET nền theo nỗ lực cho môn pace (±20%).
// gymRaw = giá trị RPE thô nhân vào volume load cho gym.
// Nhãn/mô tả (label/desc) tách sang i18n: rpeLabel(level)/rpeDesc(level) → khóa 'rpe.N.*'.
export const RPE_LEVELS = [
  { level: 1, index: 0.00, factor: 0.8, gymRaw: 1.5 },
  { level: 2, index: 0.25, factor: 0.9, gymRaw: 3.5 },
  { level: 3, index: 0.50, factor: 1.0, gymRaw: 5.5 },
  { level: 4, index: 0.75, factor: 1.1, gymRaw: 7.5 },
  { level: 5, index: 1.00, factor: 1.2, gymRaw: 9.5 },
];
const RPE_MAP = Object.fromEntries(RPE_LEVELS.map(x => [x.level, x]));
// Mức RPE của 1 session; thiếu/không hợp lệ → mặc định Vừa (level 3).
export const rpeOf = level => RPE_MAP[level] || RPE_MAP[3];
// Nhãn/mô tả RPE đa ngôn ngữ (đọc theo ngôn ngữ hiện hành).
export const rpeLabel = level => t('rpe.' + rpeOf(level).level + '.label');
export const rpeDesc = level => t('rpe.' + rpeOf(level).level + '.desc');

// ── Hệ số DOTS (chuẩn hoá tạ theo cân nặng + giới) ──────────────────────────
// Chấm gym bằng volume TUYỆT ĐỐI thiên vị người nặng/khoẻ (thường là nam): nam 70kg
// đương nhiên nâng tổng tạ nhiều hơn nữ 55kg. Chỉ chia cho cân nặng (linear/allometric)
// vẫn ưu ái nam vì nam khoẻ hơn TRÊN MỖI KG (nam bench 1×BW dễ hơn nữ bench 1×BW). DOTS —
// đa thức bậc 4 với hằng số riêng nam/nữ, chuẩn powerlifting hiện đại thay Wilks — bù đúng
// cả cỡ người lẫn phần sức/kg theo giới, nên hai người "khó ngang nhau" ra hệ số gần nhau.
// Ta dùng nó THUẦN như hệ số nhân vào volume load cho gym (xem session.js effectiveMet).
const DOTS_M = [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093];
const DOTS_F = [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706];
// Hệ số DOTS theo cân nặng (kg) + giới ('female' → nữ, còn lại → nam). Kẹp cân nặng vào
// dải hợp lệ của công thức [40,210] để tránh mẫu số âm ở biên.
export const dotsCoeff = (bwKg, sex) => {
  const c = sex === 'female' ? DOTS_F : DOTS_M;
  const bw = Math.min(210, Math.max(40, bwKg || 0));
  return 500 / (c[0] + c[1] * bw + c[2] * bw ** 2 + c[3] * bw ** 3 + c[4] * bw ** 4);
};

// ── Ô nhập dùng lại ─────────────────────────────────────────────
// type: number | seg | select | counter | time | pace | rpe
//   number   – ô số (unit hiển thị hậu tố)
//   seg      – nhóm nút chọn 1 (ít lựa chọn)
//   select   – chip chọn 1 (nhiều lựa chọn, tự xuống dòng)
//   counter  – bộ đếm ± (số hiệp/ván/lap)
//   time     – mm:ss (lưu chuỗi)
//   pace     – CHỈ hiển thị, tự tính từ quãng đường + thời lượng (mode: km|kmh|100m)
//   rpe      – 5 thẻ chọn mức gắng sức (RPE_LEVELS), lưu level 1–5
// adv: true → ô nâng cao, ẩn dưới "Thêm chi tiết ▾".
const DUR = { k: 'durationMin', label: 'Thời lượng (phút)', type: 'number', required: true };
const RPE = { k: 'rpe', label: 'Mức độ gắng sức', type: 'rpe', def: 3, required: true };
const DIST_KM = { k: 'distanceKm', label: 'Quãng đường (km)', type: 'number', unit: 'km', required: true };

// Ngưỡng tốc độ (km/h) → MET nền cho môn pace. Duyệt tới ngưỡng đầu tiên mà kmh < maxKmh.
// Bơi: km/h tính theo TỔNG thời lượng buổi (gồm nghỉ giữa set) nên thấp hơn pace bơi thuần
// nhiều — vì vậy ngưỡng đặt thấp để bám phân bố thật (recreational total-time ~0.8–2.6 km/h),
// đồng thời nghỉ nhiều = buổi nhẹ hơn nên tốc độ thấp cũng phản ánh đúng nỗ lực. MET neo
// Compendium 2024: leisurely 6.0, freestyle chậm 5.8 → vừa ~8.0 → nhanh 9.8, breaststroke
// training 10.3. Calibrate 2026-08 (cũ [2.0→6.0, 3.0→8.3] khiến MỌI người bơi có nghỉ dồn
// về sàn 6.0, không phân biệt được). ~1.4 km/h≈4:17/100m, 2.0≈3:00, 2.6≈2:18.
const SPEED_BANDS = {
  walk:  [[4.8, 2.8], [6.4, 3.5], [Infinity, 6.0]],
  run:   [[8.85, 8.3], [10.5, 9.8], [12.1, 11.0], [Infinity, 12.8]],
  cycle: [[16, 4.0], [19, 6.8], [22, 8.0], [25, 10.0], [Infinity, 12.0]],
  swim:  [[1.4, 6.0], [2.0, 7.0], [2.6, 8.3], [Infinity, 10.0]],
};

// MET nền theo tốc độ (km/h) của môn pace. kmh<=0 hoặc không có bands → metMin.
export const metForSpeed = (sportId, kmh) => {
  const a = actOf(sportId);
  const bands = a.speedBands;
  if (!bands || !(kmh > 0)) return a.metMin || 0;
  for (const [maxKmh, met] of bands) if (kmh < maxKmh) return met;
  return bands[bands.length - 1][1];
};

export const ACTIVITIES = [
  { id: 'gym', emoji: '🏋️',        label: 'Tập gym',    icon: 'dumbbell', iconKey: 'gym', kind: 'strength', category: 'gym', metMin: 3.5, metMax: 6.5, color: '#6366f1', verb: 'đã hoàn thành buổi' },

  { id: 'run', emoji: '🏃', label: 'Chạy bộ', icon: 'run', iconKey: 'run', kind: 'distance', category: 'pace', metMin: 8.3, metMax: 12.8, speedBands: SPEED_BANDS.run, color: '#f97316', verb: 'đã chạy', laps: true, fields: [
    DUR,
    DIST_KM,
    { k: '_pace', label: 'Pace', type: 'pace', mode: 'km' },
    RPE,
    { k: 'elevM', label: 'Độ cao (m)', type: 'number', unit: 'm', adv: true },
    { k: 'hrAvg', label: 'Nhịp tim TB (bpm)', type: 'number', unit: 'bpm', adv: true },
  ] },

  { id: 'walk', emoji: '🚶', label: 'Đi bộ', icon: 'walk', iconKey: 'walk', kind: 'distance', category: 'pace', metMin: 2.8, metMax: 6.0, speedBands: SPEED_BANDS.walk, color: '#84cc16', verb: 'đã đi bộ', fields: [
    DUR,
    DIST_KM,
    { k: '_pace', label: 'Pace', type: 'pace', mode: 'km' },
    RPE,
    { k: 'stepK', label: 'Số bước (nghìn)', type: 'number', unit: 'k', adv: true },
  ] },

  { id: 'cycle', emoji: '🚴', label: 'Đạp xe', icon: 'bike', iconKey: 'bike', kind: 'distance', category: 'pace', metMin: 4.0, metMax: 12.0, speedBands: SPEED_BANDS.cycle, color: '#06b6d4', verb: 'đã đạp xe', laps: true, fields: [
    DUR,
    DIST_KM,
    { k: '_speed', label: 'Tốc độ TB', type: 'pace', mode: 'kmh' },
    { k: 'place', label: 'Địa điểm', type: 'seg', opts: ['Trong nhà', 'Ngoài trời'], def: 'Ngoài trời' },
    RPE,
    { k: 'elevM', label: 'Độ cao (m)', type: 'number', unit: 'm', adv: true },
  ] },

  { id: 'swim', emoji: '🏊', label: 'Bơi', icon: 'swim', iconKey: 'swim', kind: 'distance', category: 'pace', metMin: 6.0, metMax: 10.0, speedBands: SPEED_BANDS.swim, color: '#0ea5e9', verb: 'đã bơi', laps: true, fields: [
    DUR,
    { k: 'poolLen', label: 'Chiều dài bể', type: 'seg', opts: ['25m', '50m'], def: '25m' },
    { k: 'distanceM', label: 'Quãng đường (m)', type: 'number', unit: 'm', required: true },
    { k: '_pace100', label: 'Pace /100m', type: 'pace', mode: '100m' },
    RPE,
  ] },

  { id: 'hiking', emoji: '🥾', label: 'Leo núi', icon: 'mountain', iconKey: 'hike', kind: 'distance', category: 'rpe_only', metMin: 4.0, metMax: 7.8, color: '#78716c', verb: 'đã leo núi', fields: [
    DUR,
    { k: 'distanceKm', label: 'Quãng đường (km)', type: 'number', unit: 'km' },
    { k: 'elevGainM', label: 'Độ cao leo (m)', type: 'number', unit: 'm' },
    RPE,
  ] },

  { id: 'yoga', emoji: '🧘', label: 'Yoga', icon: 'yoga', iconKey: 'yoga', kind: 'session', category: 'rpe_only', metMin: 2.0, metMax: 4.0, color: '#a855f7', verb: 'đã tập yoga', fields: [
    DUR,
    RPE,
    { k: 'goal', label: 'Mục tiêu', type: 'select', opts: ['Thư giãn', 'Dẻo dai', 'Sức mạnh', 'Thăng bằng'], def: 'Thư giãn', adv: true },
  ] },

  { id: 'football', emoji: '⚽', label: 'Bóng đá', icon: 'ball', iconKey: 'ball', kind: 'session', category: 'rpe_only', metMin: 6.0, metMax: 10.0, color: '#22c55e', verb: 'đã chơi bóng đá', fields: [
    DUR,
    { k: 'periods', label: 'Số hiệp', type: 'counter', def: 0, max: 20 },
    RPE,
  ] },

  { id: 'basketball', emoji: '🏀', label: 'Bóng rổ', icon: 'ball', iconKey: 'ball', kind: 'session', category: 'rpe_only', metMin: 5.0, metMax: 8.0, color: '#ef4444', verb: 'đã chơi bóng rổ', fields: [
    DUR,
    { k: 'periods', label: 'Số hiệp', type: 'counter', def: 0, max: 20 },
    RPE,
  ] },

  { id: 'badminton', emoji: '🏸', label: 'Cầu lông', icon: 'racket', iconKey: 'racket', kind: 'session', category: 'rpe_only', metMin: 5.5, metMax: 9.0, color: '#eab308', verb: 'đã chơi cầu lông', fields: [
    DUR,
    { k: 'games', label: 'Số ván', type: 'counter', def: 0, max: 30 },
    RPE,
  ] },

  { id: 'tennis', emoji: '🎾', label: 'Tennis', icon: 'racket', iconKey: 'racket', kind: 'session', category: 'rpe_only', metMin: 5.0, metMax: 8.0, color: '#f59e0b', verb: 'đã chơi tennis', fields: [
    DUR,
    { k: 'games', label: 'Số ván (set)', type: 'counter', def: 0, max: 30 },
    RPE,
  ] },

  { id: 'pickleball', emoji: '🥒', label: 'Pickleball', icon: 'racket', iconKey: 'racket', kind: 'session', category: 'rpe_only', metMin: 4.5, metMax: 7.0, color: '#14b8a6', verb: 'đã chơi pickleball', fields: [
    DUR,
    { k: 'games', label: 'Số ván', type: 'counter', def: 0, max: 30 },
    RPE,
  ] },

  { id: 'other', emoji: '✨', label: 'Khác', icon: 'spark', iconKey: 'other', kind: 'session', category: 'rpe_only', metMin: 3.0, metMax: 6.0, color: '#64748b', verb: 'đã tập' },
];

export const ACT = Object.fromEntries(ACTIVITIES.map(a => [a.id, a]));

export const actOf = id => ACT[id] || ACT.other;

// Nhãn/động từ môn + nhãn ô nhập theo ngôn ngữ hiện hành. Thiếu khóa i18n → dùng
// chuỗi VI trong registry làm fallback (không bao giờ vỡ). Dùng cho HIỂN THỊ;
// tên buổi lưu mặc định vẫn dùng a.label (VI) cho dữ liệu ổn định.
const orFallback = (key, fb) => { const v = t(key); return v === key ? fb : v; };
export const actLabel = id => { const a = actOf(id); return orFallback('sport.' + a.id + '.label', a.label); };
export const actVerb = id => { const a = actOf(id); return orFallback('sport.' + a.id + '.verb', a.verb); };
export const flabel = f => (f && f.k) ? orFallback('field.' + f.k, f.label || '') : (f?.label || '');

// Định nghĩa input mặc định theo kind (dự phòng cho môn chưa khai báo fields riêng).
export const FIELDS = {
  distance: [
    DUR,
    { k: 'distanceKm', label: 'Quãng đường (km)', type: 'number', unit: 'km' },
    { k: '_pace', label: 'Pace', type: 'pace', mode: 'km' },
    RPE,
  ],
  session: [DUR, RPE],
  strength: null, // gym dùng luồng ActiveWorkout riêng
};

// Danh sách ô nhập đã phân giải cho 1 môn (fields riêng > FIELDS[kind] > session).
export const fieldsOf = type => {
  const a = actOf(type);
  return a.fields || FIELDS[a.kind] || FIELDS.session;
};
