// Audit công thức chấm điểm leaderboard — dùng CHÍNH các hàm trong src/domain (không chép
// hằng số) nên luôn khớp với app. In bảng giải mã + đối chiếu các môn, hoặc chấm 1 buổi tuỳ ý.
//
//   node tools/audit-score/audit.mjs                      # báo cáo đầy đủ
//   node tools/audit-score/audit.mjs gym  9462 78 3       # gym: <volume_kg> <phút> <rpe>
//   node tools/audit-score/audit.mjs swim 900  66 3       # bơi: <mét>       <phút> <rpe>
//   node tools/audit-score/audit.mjs run  10   60 3       # pace: <km>       <phút> <rpe>
//   node tools/audit-score/audit.mjs yoga -    45 2       # rpe_only: '-'    <phút> <rpe>
//
// App là no-build (preact nạp qua importmap trên trình duyệt, không có ở node). Hai shim dưới
// đây cho phép import domain trong node — công thức (effectiveMet/computePoints) KHÔNG dùng
// preact/localStorage lúc chạy, chúng chỉ bị kéo vào gián tiếp qua i18n.js.
import { registerHooks } from 'node:module';

// localStorage stub: i18n.js đọc lúc nạp module (đã try/catch, nhưng stub để về 'vi').
// defineProperty (không ĐỌC globalThis.localStorage) để khỏi kích hoạt warning experimental của node.
Object.defineProperty(globalThis, 'localStorage', {
  value: { getItem: () => null, setItem: () => {} }, configurable: true, writable: true,
});

// Stub 'preact/hooks' bằng no-op (i18n.js import ở top-level).
const PREACT_STUB = 'data:text/javascript,' + encodeURIComponent(
  'export const useState=()=>[0,()=>{}];export const useEffect=()=>{};export const useRef=()=>({current:null});export default {};'
);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'preact/hooks' || specifier === 'preact')
      return { url: PREACT_STUB, shortCircuit: true };
    return nextResolve(specifier, context);
  },
});

const { effectiveMet, computePoints, activeMinutes } = await import('../../src/domain/session.js');
const { actOf, metForSpeed, rpeOf } = await import('../../src/domain/activities.js');

// Dựng object session tối thiểu mà effectiveMet/computePoints cần.
//   pace (không bơi): metric = distanceKm | bơi: metric = distanceM | gym: metric = totalVol
function mk(type, metric, durationMin, rpe) {
  const a = actOf(type), detail = { rpe };
  if (a.category === 'pace') detail[type === 'swim' ? 'distanceM' : 'distanceKm'] = metric;
  else if (a.category === 'gym') detail.totalVol = metric;
  return { type, durationMin, detail };
}

function decode(label, type, metric, durationMin, rpe) {
  const s = mk(type, metric, durationMin, rpe);
  const a = actOf(type), met = effectiveMet(s), p = computePoints(s), min = activeMinutes(s);
  let why = '';
  if (a.category === 'pace') {
    const km = type === 'swim' ? metric / 1000 : metric;
    const kmh = km > 0 ? km / (min / 60) : 0;
    why = `${kmh.toFixed(2)} km/h → MET nền ${metForSpeed(type, kmh)} × RPE${rpe} (×${rpeOf(rpe).factor})`;
  } else if (a.category === 'gym') {
    // Probe qua chính hàm thật: gấp đôi volume mà MET không đổi ⇒ đang chạm trần.
    const capped = effectiveMet(mk(type, metric * 2, durationMin, rpe)) === met;
    why = `vol ${metric}kg × gymRaw ${rpeOf(rpe).gymRaw}${capped ? ' — CHẠM TRẦN' : ''}`;
  } else {
    why = `nội suy metMin ${a.metMin}↔metMax ${a.metMax} theo RPE${rpe} (index ${rpeOf(rpe).index})`;
  }
  console.log(`${label.padEnd(24)} | ${String(min).padStart(3)}p | MET ${met.toFixed(2).padStart(5)} | ${String(p).padStart(3)} điểm | ${why}`);
}

// ── Chấm 1 buổi tuỳ ý từ CLI ────────────────────────────────────────────────
const [, , type, metricArg, minArg, rpeArg] = process.argv;
if (type) {
  const metric = metricArg === '-' ? 0 : parseFloat(metricArg);
  decode(`${type}`, type, metric, parseFloat(minArg), parseInt(rpeArg) || 3);
  process.exit(0);
}

// ── Báo cáo đầy đủ ──────────────────────────────────────────────────────────
console.log('═══ 2 CA THAM CHIẾU ═══');
decode('Bơi 900m/66p RPE3', 'swim', 900, 66, 3);
decode('Gym Push 9462kg/78p', 'gym', 9462, 78, 3);

console.log('\n═══ BƠI — độ phân biệt theo pace (RPE3) ═══');
for (const [nm, m, min] of [['900m/66p rất chậm',900,66],['1000m/40p',1000,40],['1500m/45p',1500,45],['2000m/45p',2000,45],['2000m/38p nhanh',2000,38]])
  decode(nm, 'swim', m, min, 3);

console.log('\n═══ GYM — độ nhạy theo volume (78p, RPE3) ═══');
for (const v of [3000, 6000, 9462, 14000]) decode(`${v}kg`, 'gym', v, 78, 3);

console.log('\n═══ ĐỐI CHIẾU 60 PHÚT, RPE tương ứng ═══');
decode('Chạy 10km RPE3', 'run', 10, 60, 3);
decode('Đạp 20km RPE3', 'cycle', 20, 60, 3);
decode('Bơi 1500m RPE3', 'swim', 1500, 60, 3);
decode('Bóng đá RPE4', 'football', 0, 60, 4);
decode('Cầu lông RPE4', 'badminton', 0, 60, 4);
decode('Yoga RPE2', 'yoga', 0, 60, 2);
decode('Gym 6000kg RPE3', 'gym', 6000, 60, 3);
