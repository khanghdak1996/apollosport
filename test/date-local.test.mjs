// "Hôm nay" phải luôn là hôm nay THEO GIỜ NGƯỜI DÙNG.
// Việt Nam là UTC+7, nên khung 0h–7h sáng là chỗ mọi lỗi lệch ngày lộ ra:
// dùng giờ UTC ở đó sẽ ra ngày hôm trước. Múi giờ được ghim ở test/support/register.mjs.
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { startOfWeek, currentWeekActivity } from '../src/domain/stats.js';
import { buildActivitySession } from '../src/domain/session.js';

// 2026-09-06 03:10 giờ Việt Nam — cùng khoảnh khắc là 2026-09-05 20:10 giờ UTC.
const SANG_SOM_CN = Date.parse('2026-09-05T20:10:00Z');
// 2026-09-07 05:00 giờ Việt Nam (thứ Hai) — giờ UTC vẫn đang là Chủ nhật 06/09.
const SANG_SOM_T2 = Date.parse('2026-09-06T22:00:00Z');

const withClock = (epoch, fn) => {
  mock.timers.enable({ apis: ['Date'], now: epoch });
  try { return fn(); } finally { mock.timers.reset(); }
};

const author = { uid: 'u1', name: 'Minh', photoURL: null, dept: 'Marketing' };

test('startOfWeek: thứ Hai trả về chính ngày đó', () => {
  assert.equal(startOfWeek('2026-09-07'), '2026-09-07');
});

test('startOfWeek: Chủ nhật trả về thứ Hai đầu tuần đó', () => {
  assert.equal(startOfWeek('2026-09-13'), '2026-09-07');
});

test('startOfWeek: giữa tuần trả về thứ Hai đầu tuần', () => {
  assert.equal(startOfWeek('2026-09-10'), '2026-09-07');
});

test('buổi tập ghi lúc 3h10 sáng mang ngày hôm đó, không phải hôm trước', () => {
  const s = withClock(SANG_SOM_CN, () =>
    buildActivitySession({ type: 'walk', durationMin: 30, vals: { distanceKm: 2.5 } }, author));
  assert.equal(s.date, '2026-09-06');
});

// Sáng sớm thứ Hai là lúc "tuần này" vừa mới bắt đầu — nếu app còn tưởng đang là Chủ nhật
// thì mục tiêu tuần vừa bỏ sót buổi hôm nay, vừa còn đếm buổi của tuần trước.
test('mục tiêu tuần: sáng sớm thứ Hai đã tính buổi tập của chính hôm đó', () => {
  const week = withClock(SANG_SOM_T2, () =>
    currentWeekActivity([{ date: '2026-09-07', activeMinutes: 30, points: 18 }]));
  assert.equal(week.count, 1);
});

test('mục tiêu tuần: sáng sớm thứ Hai KHÔNG còn đếm buổi của Chủ nhật tuần trước', () => {
  const week = withClock(SANG_SOM_T2, () =>
    currentWeekActivity([{ date: '2026-09-06', activeMinutes: 30, points: 18 }]));
  assert.equal(week.count, 0, 'Chủ nhật 06/09 thuộc tuần trước, không được tính sang tuần mới');
});

test('buổi tập buổi chiều vẫn mang đúng ngày', () => {
  const s = withClock(Date.parse('2026-09-06T09:30:00Z'), () => // 16h30 giờ VN
    buildActivitySession({ type: 'walk', durationMin: 30, vals: { distanceKm: 2 } }, author));
  assert.equal(s.date, '2026-09-06');
});

test('ngày do người dùng tự chọn được giữ nguyên, không bị dịch', () => {
  const s = withClock(SANG_SOM_CN, () =>
    buildActivitySession({ type: 'walk', durationMin: 30, date: '2026-08-20', vals: { distanceKm: 2 } }, author));
  assert.equal(s.date, '2026-08-20');
});
