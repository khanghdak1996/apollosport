// Id kỳ (tuần/tháng) tồn tại HAI bản: client `src/domain/period.js` và bản port sang server
// `api/_lib/scoring.js`. Bảng xếp hạng do server ghi, UI đọc theo id client tính ra —
// hai bản lệch nhau một ngày là điểm "biến mất" khỏi bảng. Test này khoá chặt điều đó.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { isoWeek, weekId, monthId } from '../src/domain/period.js';

const require = createRequire(import.meta.url);
const server = require('../api/_lib/scoring.js');

test('isoWeek: tuần chứa thứ Năm đầu tiên là tuần 1', () => {
  // 2026-01-01 là thứ Năm -> tuần 1 của 2026.
  assert.deepEqual(isoWeek('2026-01-01'), { year: 2026, week: 1 });
  // 2025-12-29 là thứ Hai cùng tuần đó -> vẫn thuộc tuần 1 của 2026, không phải 2025.
  assert.deepEqual(isoWeek('2025-12-29'), { year: 2026, week: 1 });
});

test('weekId: định dạng w-YYYY-Www, số tuần luôn 2 chữ số', () => {
  assert.equal(weekId('2026-01-01'), 'w-2026-W01');
  assert.equal(weekId('2026-07-15'), 'w-2026-W29');
});

test('monthId: định dạng m-YYYY-MM', () => {
  assert.equal(monthId('2026-07-15'), 'm-2026-07');
  assert.equal(monthId('2026-12-31'), 'm-2026-12');
});

test('client và server sinh cùng một id kỳ cho mọi ngày trong 3 năm', () => {
  const d = new Date('2024-01-01T00:00:00');
  const end = new Date('2027-01-01T00:00:00');
  let n = 0;
  while (d < end) {
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    assert.equal(server.weekId(ds), weekId(ds), `lệch weekId tại ${ds}`);
    assert.equal(server.monthId(ds), monthId(ds), `lệch monthId tại ${ds}`);
    d.setDate(d.getDate() + 1);
    n++;
  }
  assert.ok(n > 1000, 'phải quét đủ số ngày');
});
