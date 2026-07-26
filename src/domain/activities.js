// Registry đa môn thể thao.
// kind quyết định form nào render (strength dùng luồng gym cũ; distance/session dùng LogActivity).
// met = chỉ số vận động (MET) dùng để quy đổi ra điểm chung giữa các môn.
// fields = ô nhập RIÊNG cho môn đó (mức Vừa). Không có fields → dùng FIELDS[kind] mặc định.
// Thêm môn mới = thêm 1 dòng ở đây, không phải đổi schema hay rules.

// ── Ô nhập dùng lại ─────────────────────────────────────────────
// type: number | seg | select | counter | time | pace
//   number  – ô số (unit hiển thị hậu tố)
//   seg     – nhóm nút chọn 1 (ít lựa chọn)
//   select  – chip chọn 1 (nhiều lựa chọn, tự xuống dòng)
//   counter – bộ đếm ± (số hiệp/ván/lap)
//   time    – mm:ss (lưu chuỗi)
//   pace    – CHỈ hiển thị, tự tính từ quãng đường + thời lượng (mode: km|kmh|100m)
// adv: true → ô nâng cao, ẩn dưới "Thêm chi tiết ▾".
const DUR = { k: 'durationMin', label: 'Thời lượng (phút)', type: 'number', required: true };
const INTENSITY = { k: 'intensity', label: 'Cường độ', type: 'seg', opts: ['nhẹ', 'vừa', 'mạnh'], def: 'vừa' };

export const ACTIVITIES = [
  { id: 'gym', emoji: '🏋️',        label: 'Tập gym',    icon: 'dumbbell', iconKey: 'gym', kind: 'strength', met: 5.0, color: '#6366f1', verb: 'đã hoàn thành buổi' },

  { id: 'run', emoji: '🏃', label: 'Chạy bộ', icon: 'run', iconKey: 'run', kind: 'distance', met: 9.0, color: '#f97316', verb: 'đã chạy', laps: true, fields: [
    DUR,
    { k: 'distanceKm', label: 'Quãng đường (km)', type: 'number', unit: 'km' },
    { k: '_pace', label: 'Pace', type: 'pace', mode: 'km' },
    INTENSITY,
    { k: 'elevM', label: 'Độ cao (m)', type: 'number', unit: 'm', adv: true },
    { k: 'hrAvg', label: 'Nhịp tim TB (bpm)', type: 'number', unit: 'bpm', adv: true },
  ] },

  { id: 'walk', emoji: '🚶', label: 'Đi bộ', icon: 'walk', iconKey: 'walk', kind: 'distance', met: 3.5, color: '#84cc16', verb: 'đã đi bộ', fields: [
    DUR,
    { k: 'distanceKm', label: 'Quãng đường (km)', type: 'number', unit: 'km' },
    { k: '_pace', label: 'Pace', type: 'pace', mode: 'km' },
    INTENSITY,
    { k: 'stepK', label: 'Số bước (nghìn)', type: 'number', unit: 'k', adv: true },
  ] },

  { id: 'cycle', emoji: '🚴', label: 'Đạp xe', icon: 'bike', iconKey: 'bike', kind: 'distance', met: 7.5, color: '#06b6d4', verb: 'đã đạp xe', laps: true, fields: [
    DUR,
    { k: 'distanceKm', label: 'Quãng đường (km)', type: 'number', unit: 'km' },
    { k: '_speed', label: 'Tốc độ TB', type: 'pace', mode: 'kmh' },
    { k: 'place', label: 'Địa điểm', type: 'seg', opts: ['Trong nhà', 'Ngoài trời'], def: 'Ngoài trời' },
    INTENSITY,
    { k: 'elevM', label: 'Độ cao (m)', type: 'number', unit: 'm', adv: true },
  ] },

  { id: 'swim', emoji: '🏊', label: 'Bơi', icon: 'swim', iconKey: 'swim', kind: 'distance', met: 7.0, color: '#0ea5e9', verb: 'đã bơi', laps: true, fields: [
    DUR,
    { k: 'stroke', label: 'Kiểu bơi', type: 'select', opts: ['Tự do', 'Ếch', 'Ngửa', 'Bướm', 'Hỗn hợp'], def: 'Tự do' },
    { k: 'poolLen', label: 'Chiều dài bể', type: 'seg', opts: ['25m', '50m'], def: '25m' },
    { k: 'distanceM', label: 'Quãng đường (m)', type: 'number', unit: 'm' },
    { k: '_pace100', label: 'Pace /100m', type: 'pace', mode: '100m' },
    INTENSITY,
  ] },

  { id: 'hiking', emoji: '🥾', label: 'Leo núi', icon: 'mountain', iconKey: 'hike', kind: 'distance', met: 6.0, color: '#78716c', verb: 'đã leo núi', fields: [
    DUR,
    { k: 'distanceKm', label: 'Quãng đường (km)', type: 'number', unit: 'km' },
    { k: 'elevGainM', label: 'Độ cao leo (m)', type: 'number', unit: 'm' },
    INTENSITY,
  ] },

  { id: 'yoga', emoji: '🧘', label: 'Yoga', icon: 'yoga', iconKey: 'yoga', kind: 'session', met: 3.0, color: '#a855f7', verb: 'đã tập yoga', fields: [
    DUR,
    { k: 'style', label: 'Trường phái', type: 'select', opts: ['Hatha', 'Vinyasa', 'Yin', 'Power'], def: 'Hatha' },
    INTENSITY,
    { k: 'goal', label: 'Mục tiêu', type: 'select', opts: ['Thư giãn', 'Dẻo dai', 'Sức mạnh', 'Thăng bằng'], def: 'Thư giãn', adv: true },
  ] },

  { id: 'football', emoji: '⚽', label: 'Bóng đá', icon: 'ball', iconKey: 'ball', kind: 'session', met: 8.0, color: '#22c55e', verb: 'đã chơi bóng đá', fields: [
    DUR,
    { k: 'periods', label: 'Số hiệp', type: 'counter', def: 0, max: 20 },
    INTENSITY,
  ] },

  { id: 'basketball', emoji: '🏀', label: 'Bóng rổ', icon: 'ball', iconKey: 'ball', kind: 'session', met: 6.5, color: '#ef4444', verb: 'đã chơi bóng rổ', fields: [
    DUR,
    { k: 'periods', label: 'Số hiệp', type: 'counter', def: 0, max: 20 },
    INTENSITY,
  ] },

  { id: 'badminton', emoji: '🏸', label: 'Cầu lông', icon: 'racket', iconKey: 'racket', kind: 'session', met: 5.5, color: '#eab308', verb: 'đã chơi cầu lông', fields: [
    DUR,
    { k: 'games', label: 'Số ván', type: 'counter', def: 0, max: 30 },
    INTENSITY,
  ] },

  { id: 'tennis', emoji: '🎾', label: 'Tennis', icon: 'racket', iconKey: 'racket', kind: 'session', met: 7.3, color: '#f59e0b', verb: 'đã chơi tennis', fields: [
    DUR,
    { k: 'games', label: 'Số ván (set)', type: 'counter', def: 0, max: 30 },
    INTENSITY,
  ] },

  { id: 'pickleball', emoji: '🥒', label: 'Pickleball', icon: 'racket', iconKey: 'racket', kind: 'session', met: 5.0, color: '#14b8a6', verb: 'đã chơi pickleball', fields: [
    DUR,
    { k: 'games', label: 'Số ván', type: 'counter', def: 0, max: 30 },
    INTENSITY,
  ] },

  { id: 'other', emoji: '✨', label: 'Khác', icon: 'spark', iconKey: 'other', kind: 'session', met: 4.0, color: '#64748b', verb: 'đã tập' },
];

export const ACT = Object.fromEntries(ACTIVITIES.map(a => [a.id, a]));

export const actOf = id => ACT[id] || ACT.other;

// Định nghĩa input mặc định theo kind (dự phòng cho môn chưa khai báo fields riêng).
export const FIELDS = {
  distance: [
    DUR,
    { k: 'distanceKm', label: 'Quãng đường (km)', type: 'number', unit: 'km' },
    { k: '_pace', label: 'Pace', type: 'pace', mode: 'km' },
    INTENSITY,
  ],
  session: [DUR, INTENSITY],
  strength: null, // gym dùng luồng ActiveWorkout riêng
};

// Danh sách ô nhập đã phân giải cho 1 môn (fields riêng > FIELDS[kind] > session).
export const fieldsOf = type => {
  const a = actOf(type);
  return a.fields || FIELDS[a.kind] || FIELDS.session;
};
