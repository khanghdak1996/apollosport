// Huy hiệu. Đánh giá thuần: nhận trạng thái user + buổi tập vừa lưu, trả về danh sách
// id huy hiệu MỚI mở khoá (chưa có trong owned).
import { actOf, ACTIVITIES, actLabel } from './activities.js';
import { t } from '../i18n.js';

// Nhãn/mô tả huy hiệu theo ngôn ngữ hiện hành (fallback về chuỗi VI trong BADGES).
const badgeOr = (key, fb) => { const v = t(key); return v === key ? fb : v; };
export const badgeLabel = id => {
  const b = BADGES[id]; if (!b) return id;
  if (b.activity) return t('badge.firstSport.label', { sport: actLabel(b.activity) });
  return badgeOr('badge.' + id + '.label', b.label);
};
export const badgeDesc = id => {
  const b = BADGES[id]; if (!b) return '';
  if (b.activity) return t('badge.firstSport.desc', { sport: actLabel(b.activity) });
  return badgeOr('badge.' + id + '.desc', b.desc);
};

export const BADGES = {
  first:       { id: 'first',    icon: '🎉', label: 'Buổi đầu tiên',   desc: 'Ghi lại buổi tập đầu tiên' },
  streak3:     { id: 'streak3',  icon: '🔥', label: 'Chuỗi 3 ngày',    desc: 'Tập 3 ngày liên tiếp' },
  streak7:     { id: 'streak7',  icon: '🔥', label: 'Chuỗi 7 ngày',    desc: 'Tập 7 ngày liên tiếp' },
  streak30:    { id: 'streak30', icon: '⚡', label: 'Chuỗi 30 ngày',   desc: 'Tập 30 ngày liên tiếp' },
  streak100:   { id: 'streak100',icon: '💎', label: 'Chuỗi 100 ngày',  desc: 'Tập 100 ngày liên tiếp' },
  comeback:    { id: 'comeback', icon: '🌱', label: 'Trở lại',         desc: 'Quay lại tập sau khi nghỉ' },
  // huy hiệu "lần đầu mỗi môn" sinh động theo registry, id dạng first-<activity>
  ...Object.fromEntries(ACTIVITIES.map(a => [
    `first-${a.id}`,
    { id: `first-${a.id}`, icon: '🏅', label: `Lần đầu ${a.label}`, desc: `Thử ${a.label} lần đầu`, activity: a.id },
  ])),
};

const STREAK_TIERS = [
  { n: 100, id: 'streak100' },
  { n: 30,  id: 'streak30' },
  { n: 7,   id: 'streak7' },
  { n: 3,   id: 'streak3' },
];

// owned: string[] id đã có. streakCurrent: số ngày chuỗi sau khi lưu.
// triedTypes: Set/array các type user từng tập (kể cả buổi này). totalSessions: tổng buổi.
export function evaluateBadges({ owned = [], streakCurrent = 0, session, triedTypes = [], totalSessions = 0 }) {
  const have = new Set(owned);
  const earned = [];
  const add = id => { if (id && !have.has(id)) { have.add(id); earned.push(id); } };

  if (totalSessions >= 1) add('first');

  for (const t of STREAK_TIERS) {
    if (streakCurrent >= t.n) { add(t.id); break; } // chỉ trao mốc cao nhất đạt được lần này
  }

  if (session?.type) {
    const first = `first-${actOf(session.type).id}`;
    // nếu type này chỉ mới xuất hiện đúng 1 lần (buổi hiện tại) -> lần đầu
    const count = triedTypes.filter(x => x === session.type).length;
    if (count <= 1) add(first);
  }

  return earned;
}
