// Dịch từ vựng thể hình (từ free-exercise-db) sang tiếng Việt phổ thông.
// Tập giá trị cố định & nhỏ (17 nhóm cơ, 12 dụng cụ, 3 trình độ...) — dịch một lần.

export const MUSCLE_VI = {
  abdominals: 'cơ bụng',
  abductors: 'cơ dạng hông (mặt ngoài đùi)',
  adductors: 'cơ khép hông (mặt trong đùi)',
  biceps: 'cơ tay trước (bắp tay trước)',
  calves: 'bắp chân',
  chest: 'ngực',
  forearms: 'cẳng tay',
  glutes: 'cơ mông',
  hamstrings: 'đùi sau',
  lats: 'cơ xô (lưng bên)',
  'lower back': 'lưng dưới',
  'middle back': 'lưng giữa',
  neck: 'cổ',
  quadriceps: 'đùi trước',
  shoulders: 'vai',
  traps: 'cơ thang (vai gáy)',
  triceps: 'cơ tay sau (bắp tay sau)',
};

export const EQUIP_VI = {
  'body only': 'tay không (không dụng cụ)',
  barbell: 'thanh đòn (tạ đòn)',
  dumbbell: 'tạ đôi',
  cable: 'máy cáp',
  machine: 'máy tập',
  kettlebells: 'tạ ấm',
  bands: 'dây kháng lực',
  'e-z curl bar': 'thanh đòn chữ W (EZ)',
  'exercise ball': 'bóng tập',
  'medicine ball': 'bóng tạ',
  'foam roll': 'con lăn xốp',
  other: 'khác',
};

export const LEVEL_VI = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  expert: 'Nâng cao',
};

export const FORCE_VI = { pull: 'kéo', push: 'đẩy', static: 'tĩnh (giữ)' };
export const MECHANIC_VI = { compound: 'đa khớp', isolation: 'cô lập (1 nhóm cơ)' };

// Nhãn tiếng Anh gọn cho cùng tập giá trị (free-exercise-db dùng key tiếng Anh thường).
// Chế độ EN dùng bảng này để hiện nhãn đẹp thay vì key thô ('body only' → 'Bodyweight').
export const MUSCLE_EN = {
  abdominals: 'Abs',
  abductors: 'Abductors (outer thigh)',
  adductors: 'Adductors (inner thigh)',
  biceps: 'Biceps',
  calves: 'Calves',
  chest: 'Chest',
  forearms: 'Forearms',
  glutes: 'Glutes',
  hamstrings: 'Hamstrings',
  lats: 'Lats',
  'lower back': 'Lower back',
  'middle back': 'Middle back',
  neck: 'Neck',
  quadriceps: 'Quads',
  shoulders: 'Shoulders',
  traps: 'Traps',
  triceps: 'Triceps',
};

export const EQUIP_EN = {
  'body only': 'Bodyweight (no equipment)',
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  cable: 'Cable machine',
  machine: 'Machine',
  kettlebells: 'Kettlebell',
  bands: 'Resistance band',
  'e-z curl bar': 'EZ curl bar',
  'exercise ball': 'Exercise ball',
  'medicine ball': 'Medicine ball',
  'foam roll': 'Foam roller',
  other: 'Other',
};

export const LEVEL_EN = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  expert: 'Advanced',
};

// Chuẩn hoá 1 chữ đầu viết hoa cho nhãn EN chưa có trong map (fallback).
const capFirst = s => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : s);

// Helpers — luôn trả tiếng Việt, fallback về nguyên gốc nếu chưa có trong map.
export const vMuscle = m => MUSCLE_VI[m] || m;
export const vMuscles = (list = []) => list.map(vMuscle).join(', ');
export const vEquip = e => EQUIP_VI[e] || e;
export const vLevel = l => LEVEL_VI[l] || l;
export const vForce = f => FORCE_VI[f] || f;
export const vMechanic = m => MECHANIC_VI[m] || m;

// Helpers EN — nhãn tiếng Anh đẹp, fallback viết hoa chữ đầu của key gốc.
export const eMuscle = m => MUSCLE_EN[m] || capFirst(m);
export const eMuscles = (list = []) => list.map(eMuscle).join(', ');
export const eEquip = e => EQUIP_EN[e] || capFirst(e);
export const eLevel = l => LEVEL_EN[l] || capFirst(l);
