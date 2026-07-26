// Id kỳ cho bảng xếp hạng. Nhận date dạng 'YYYY-MM-DD' (giờ local).
import { p2 } from './format.js';

// ISO week: tuần bắt đầu thứ Hai, tuần chứa thứ Năm đầu tiên là tuần 1.
export function isoWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = (d.getDay() + 6) % 7;          // 0 = thứ Hai
  d.setDate(d.getDate() - day + 3);          // dời tới thứ Năm của tuần này
  const year = d.getFullYear();
  const firstThu = new Date(year, 0, 4);
  const firstDay = (firstThu.getDay() + 6) % 7;
  firstThu.setDate(firstThu.getDate() - firstDay + 3);
  const week = 1 + Math.round((d - firstThu) / (7 * 86400000));
  return { year, week };
}

// 'w-2026-W29'
export function weekId(dateStr) {
  const { year, week } = isoWeek(dateStr);
  return `w-${year}-W${p2(week)}`;
}

// 'm-2026-07'
export function monthId(dateStr) {
  return `m-${dateStr.slice(0, 7)}`;
}
