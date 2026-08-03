// src/ui/theme.js — Apollo Sport, bản redesign theo Apollo Brand Book V9
// Thay TOÀN BỘ file cũ bằng file này. Các key cũ (bg1, bg2, txt1...) được giữ
// nguyên tên nên mọi màn hình hiện tại vẫn chạy — chỉ đổi giá trị màu.

// ── Palette brand (Apollo Brand Book V9, tỉ lệ 40/20/16/8/8/8) ───────────────
export const BRAND = {
  blue: '#2576B9',        // Apollo Blue  — màu chủ đạo, ~40%
  babyBlue: '#BCD9F2',    // Baby Blue    — mảng nền phụ, ~20%
  white: '#FFFFFF',       //               ~16%
  yellow: '#FFD95C',      // Yellow       — việc gấp / hạng 1, ~8%
  red: '#EB4754',         // Red          — tim, cảnh báo, ~8%
  pink: '#EB9CC4',        // Pink         — nhãn môn (gym, yoga), ~8%
};

export const C = {
  // nền & khung
  bg1: '#F2F6FA',   // nền màn hình
  bg2: '#FFFFFF',   // nền thẻ
  bg3: '#E7F1FB',   // nền nhấn nhạt (tint xanh)
  bdr: '#DDE8F2',   // viền thẻ
  bdr2: '#EDF3F9',  // vạch chia trong thẻ (hairline)

  // chữ — thang 5 bậc
  txt1: '#12395E',  // tiêu đề, số
  txt2: '#5B7896',  // body phụ
  txt3: '#7E9AB5',  // nhãn
  txt4: '#94AABF',  // meta, timestamp
  txt5: '#B7C6D4',  // placeholder, mũi chevron

  // trạng thái
  green: '#1F8A55', greenBg: '#E9F7EF', greenBdr: '#BCE7D2',
  red: '#EB4754', redBg: '#FDECEE', redBdr: '#F8C9CE', redInk: '#C22E3B',
  yellow: '#FFD95C', yellowBg: '#FFF6DA', yellowInk: '#C9A21B', yellowDeep: '#8A6D0F',
  pink: '#EB9CC4', pinkBg: '#FBEBF3',

  // trên nền xanh đậm
  onBlue: '#FFFFFF', onBlueDim: '#BCD9F2', onBlueVeil: 'rgba(255,255,255,.16)',
};

export const r = { sm: '9px', md: '12px', lg: '16px', xl: '18px', xxl: '20px', pill: '22px' };

// ── Typography ──────────────────────────────────────────────────────────────
// display: tiêu đề & con số — LUÔN in hoa, letter-spacing dương
// body:    chữ thường
// serif:   câu dẫn dắt / ghi chú, thường in nghiêng
export const F = {
  display: "'Barlow Semi Condensed',system-ui,sans-serif",
  body: "'Barlow',system-ui,sans-serif",
  serif: "'Baskerville BT','Libre Baskerville',Georgia,serif",
};

// Preset dùng trực tiếp trong style object
export const T = {
  h1: { fontFamily: F.display, fontWeight: 700, fontSize: 26, letterSpacing: '.03em', textTransform: 'uppercase' },
  h2: { fontFamily: F.display, fontWeight: 700, fontSize: 21, letterSpacing: '.03em', textTransform: 'uppercase' },
  section: { fontFamily: F.display, fontWeight: 700, fontSize: 14, letterSpacing: '.1em', textTransform: 'uppercase' },
  label: { fontSize: 11, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: C.txt4 },
  num: { fontFamily: F.display, fontWeight: 700, letterSpacing: '.01em' }, // đặt fontSize khi dùng
  lead: { fontFamily: F.serif, fontStyle: 'italic', fontSize: 12, lineHeight: 1.55, color: C.txt3 },
  body: { fontFamily: F.body, fontSize: 14, lineHeight: 1.5 },
};

// ── Màu nhấn theo người dùng ────────────────────────────────────────────────
export const ACC = 'var(--accent)';

// Màu theo môn — dùng cho chấm lịch, nhãn, vòng viền avatar
export const SPORT_COLOR = {
  strength: BRAND.pink, gym: BRAND.pink, yoga: BRAND.pink,
  run: BRAND.blue, walk: BRAND.blue, bike: '#7FB4DC', swim: BRAND.blue,
  football: BRAND.red, basketball: BRAND.red,
  badminton: '#E7C24A', tennis: '#E7C24A', pickleball: '#E7C24A',
  hike: C.txt2, other: C.txt2,
};
export const sportColor = (k) => SPORT_COLOR[k] || BRAND.blue;
export const sportTint = (k) => {
  const c = sportColor(k);
  if (c === BRAND.pink) return C.pinkBg;
  if (c === BRAND.red) return C.redBg;
  if (c === '#E7C24A') return C.yellowBg;
  if (c === C.txt2) return C.bg1;
  return C.bg3;
};

export const SHADOW = {
  card: '0 2px 8px rgba(18,57,94,.04)',
  raised: '0 4px 14px rgba(37,118,185,.12)',
  fab: '0 8px 20px rgba(37,118,185,.4)',
  float: '0 12px 30px rgba(18,57,94,.14)',
};
