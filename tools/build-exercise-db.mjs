// Dev-time script: khớp 112 bài EX của app với free-exercise-db (Unlicense/public domain),
// xuất src/data/exercises-db.js (module JS, import đồng bộ). Chạy lại khi muốn cập nhật.
//
//   node tools/build-exercise-db.mjs            # cần exdb.json cạnh script hoặc tải sẵn
//
// Nguồn dữ liệu: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json
// Ảnh: https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/<path>
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMG_BASE = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/';

// exdb.json: tải trước và đặt cạnh script (tools/exdb.json) hoặc ở CWD.
const dbPath = [path.join(__dirname, 'exdb.json'), path.join(process.cwd(), 'exdb.json')].find(p => fs.existsSync(p));
if (!dbPath) { console.error('Thiếu exdb.json. Tải: curl -sL -o tools/exdb.json https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'); process.exit(1); }
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const byId = Object.fromEntries(db.map(x => [x.id, x]));
const { EX } = await import('file://' + path.join(ROOT, 'src/domain/exercises.js'));

// Bảng khớp curate tay: EX.id -> free-exercise-db id. Bỏ dòng nào không chắc → rơi về auto-YouTube.
const MAP = {
  // Ngực
  'bench-press': 'Barbell_Bench_Press_-_Medium_Grip',
  'incline-bench': 'Barbell_Incline_Bench_Press_-_Medium_Grip',
  'decline-bench': 'Decline_Barbell_Bench_Press',
  'dumbbell-press': 'Dumbbell_Bench_Press',
  'incline-db-press': 'Incline_Dumbbell_Press',
  'cable-fly': 'Cable_Crossover',
  'low-cable-fly': 'Low_Cable_Crossover',
  'dumbbell-fly': 'Dumbbell_Flyes',
  'pec-deck': 'Butterfly',
  'chest-dip': 'Dips_-_Chest_Version',
  'machine-chest': 'Leverage_Chest_Press',
  'push-up': 'Pushups',
  // Chân
  'squat': 'Barbell_Squat',
  'leg-press': 'Leg_Press',
  'rdl': 'Romanian_Deadlift',
  'leg-curl': 'Lying_Leg_Curls',
  'seated-leg-curl': 'Seated_Leg_Curl',
  'leg-ext': 'Leg_Extensions',
  'calf-raise': 'Standing_Calf_Raises',
  'seated-calf': 'Seated_Calf_Raise',
  'bulgarian-split': 'Split_Squat_with_Dumbbells',
  'hack-squat': 'Hack_Squat',
  'goblet-squat': 'Goblet_Squat',
  'sumo-squat': 'Plie_Dumbbell_Squat',
  'walking-lunge': 'Bodyweight_Walking_Lunge',
  'leg-press-calf': 'Calf_Press_On_The_Leg_Press_Machine',
  'sissy-squat': 'Weighted_Sissy_Squat',
  'back-squat': 'Barbell_Squat',
  'front-squat': 'Front_Barbell_Squat',
  'single-leg-ext': 'Single-Leg_Leg_Extension',
  'swiss-ball-leg-curl': 'Ball_Leg_Curl',
  // Lưng
  'deadlift': 'Barbell_Deadlift',
  'barbell-row': 'Bent_Over_Barbell_Row',
  'lat-pull': 'Wide-Grip_Lat_Pulldown',
  'pull-up': 'Pullups',
  'chin-up': 'Chin-Up',
  'seated-row': 'Seated_Cable_Rows',
  't-bar-row': 'T-Bar_Row_with_Handle',
  'single-arm-row': 'One-Arm_Dumbbell_Row',
  'straight-arm-pull': 'Straight-Arm_Pulldown',
  'rack-pull': 'Rack_Pulls',
  'hyperextension': 'Hyperextensions_Back_Extensions',
  'chest-supported-row': 'Reverse_Grip_Bent-Over_Rows',
  'machine-high-row': 'Leverage_High_Row',
  'neutral-grip-pulldown': 'V-Bar_Pulldown',
  'cable-pullover': 'Straight-Arm_Dumbbell_Pullover',
  'barbell-shrug': 'Barbell_Shrug',
  // Vai
  'ohp': 'Standing_Military_Press',
  'db-shoulder-press': 'Dumbbell_Shoulder_Press',
  'arnold-press': 'Arnold_Dumbbell_Press',
  'lateral-raise': 'Side_Lateral_Raise',
  'cable-lateral-raise': 'Cable_Seated_Lateral_Raise',
  'face-pull': 'Face_Pull',
  'front-raise': 'Front_Dumbbell_Raise',
  'reverse-fly': 'Reverse_Flyes',
  'upright-row': 'Upright_Barbell_Row',
  'machine-shoulder': 'Machine_Shoulder_Military_Press',
  'rear-delt-fly': 'Cable_Rear_Delt_Fly',
  'military-press': 'Standing_Military_Press',
  'cable-reverse-fly': 'Cable_Rear_Delt_Fly',
  // Tay
  'bicep-curl': 'Barbell_Curl',
  'db-curl': 'Dumbbell_Bicep_Curl',
  'hammer-curl': 'Alternate_Hammer_Curl',
  'preacher-curl': 'Preacher_Curl',
  'concentration-curl': 'Concentration_Curls',
  'incline-db-curl': 'Incline_Dumbbell_Curl',
  'ez-bar-curl': 'EZ-Bar_Curl',
  'reverse-curl': 'Reverse_Barbell_Curl',
  'cable-curl': 'Standing_Biceps_Cable_Curl',
  'tricep-push': 'Triceps_Pushdown',
  'skull-crusher': 'EZ-Bar_Skullcrusher',
  'overhead-tricep': 'Standing_Dumbbell_Triceps_Extension',
  'close-grip-bench': 'Close-Grip_Barbell_Bench_Press',
  'tricep-kickback': 'Tricep_Dumbbell_Kickback',
  'cable-overhead-tricep': 'Cable_Rope_Overhead_Triceps_Extension',
  'single-arm-cable-curl': 'Standing_One-Arm_Cable_Curl',
  // Mông
  'hip-thrust': 'Barbell_Hip_Thrust',
  'glute-bridge': 'Barbell_Glute_Bridge',
  'cable-kickback': 'One-Legged_Cable_Kickback',
  'donkey-kick': 'Glute_Kickback',
  'sumo-deadlift': 'Sumo_Deadlift',
  'step-up': 'Dumbbell_Step_Ups',
  'abductor': 'Thigh_Abductor',
  'adductor': 'Thigh_Adductor',
  'cable-pull-through': 'Pull_Through',
  // Bụng
  'plank': 'Plank',
  'side-plank': 'Side_Bridge',
  'crunch': 'Crunches',
  'cable-crunch': 'Cable_Crunch',
  'hanging-leg-raise': 'Hanging_Leg_Raise',
  'ab-wheel': 'Barbell_Ab_Rollout',
  'russian-twist': 'Russian_Twist',
  'sit-up': 'Sit-Up',
  'bicycle-crunch': 'Air_Bike',
  'leg-raise': 'Flat_Bench_Lying_Leg_Raise',
  'toe-touch': 'Toe_Touchers',
};

const out = {};
const invalid = [], unmatched = [];
for (const ex of EX) {
  const libId = MAP[ex.id];
  if (!libId) { unmatched.push(ex.id); continue; }
  const e = byId[libId];
  if (!e) { invalid.push(`${ex.id} -> ${libId} (KHÔNG tồn tại)`); continue; }
  out[ex.id] = {
    libId,
    instructions: e.instructions,
    images: (e.images || []).map(p => IMG_BASE + p),
    primaryMuscles: e.primaryMuscles || [],
    secondaryMuscles: e.secondaryMuscles || [],
    equipment: e.equipment || '',
    level: e.level || '',
    force: e.force || '',
    mechanic: e.mechanic || '',
  };
}

const banner = `// TỰ SINH bởi tools/build-exercise-db.mjs — KHÔNG sửa tay.\n// Nguồn: free-exercise-db (Unlicense/public domain). Ảnh: jsDelivr CDN.\n`;
fs.writeFileSync(path.join(ROOT, 'src/data/exercises-db.js'), banner + 'export const EXDB = ' + JSON.stringify(out, null, 2) + ';\n');

console.log('Matched & valid :', Object.keys(out).length, '/', EX.length);
console.log('Invalid ids     :', invalid.length);
invalid.forEach(x => console.log('   x', x));
console.log('Unmatched (auto):', unmatched.length, '->', unmatched.join(', '));
