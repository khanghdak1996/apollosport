// Logic chuỗi ngày tập (streak). Tách từ IIFE cũ trong CalendarTab, giữ đúng hành vi:
// chuỗi còn sống nếu tập HÔM NAY hoặc HÔM QUA (một ngày ân hạn).
import { p2 } from './format.js';

const DAY = 86400000;

export const dayStr = d => {
  const x = d instanceof Date ? d : new Date(d);
  return `${x.getFullYear()}-${p2(x.getMonth() + 1)}-${p2(x.getDate())}`;
};

const shift = (ds, n) => dayStr(new Date(new Date(ds + 'T00:00:00').getTime() + n * DAY));

// Tính lại đầy đủ từ danh sách ngày ('YYYY-MM-DD'). Dùng ở CalendarTab và nút "Tính lại chuỗi".
export function computeStreak(dates, today = dayStr(new Date())) {
  const set = new Set(dates);
  let cur = set.has(today) ? today : shift(today, -1);
  let current = 0;
  while (set.has(cur)) { current++; cur = shift(cur, -1); }

  const sorted = [...set].sort();
  let longest = 0, run = 0, prev = null;
  for (const d of sorted) {
    run = (prev && shift(prev, 1) === d) ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  const last = sorted[sorted.length - 1] || null;
  return {
    current,
    longest: Math.max(longest, current),
    lastDate: last,
    atRisk: current > 0 && !set.has(today), // sống nhờ hôm qua -> tập hôm nay kẻo mất
  };
}

// Cập nhật tăng dần lúc lưu buổi tập: O(1), không cần đọc lại lịch sử.
export function advanceStreak(prev = { current: 0, longest: 0, lastDate: null }, date) {
  if (prev.lastDate === date) return prev;                 // buổi thứ 2 cùng ngày
  if (prev.lastDate && date < prev.lastDate) return prev;  // log lùi ngày -> bỏ qua
  const contiguous = prev.lastDate && shift(prev.lastDate, 1) === date;
  const current = contiguous ? (prev.current || 0) + 1 : 1;
  return { current, longest: Math.max(prev.longest || 0, current), lastDate: date };
}

// Giải mã lúc đọc: streak.current lưu chỉ tăng khi ghi, nên feed/leaderboard/profile
// phải "hao mòn" khi đọc dựa trên khoảng cách ngày. Thuần, không tốn query.
export function liveStreak(stored, today = dayStr(new Date())) {
  if (!stored || !stored.lastDate) return { ...stored, current: 0, atRisk: false };
  const gap = Math.round((new Date(today + 'T00:00:00') - new Date(stored.lastDate + 'T00:00:00')) / DAY);
  if (gap <= 0) return { ...stored, atRisk: false };  // đã tập hôm nay
  if (gap === 1) return { ...stored, atRisk: true };  // còn sống nhờ hôm qua
  return { ...stored, current: 0, atRisk: false };    // đã đứt
}
