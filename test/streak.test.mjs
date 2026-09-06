// Chuỗi ngày tập — logic tinh vi nhất ở tầng domain client: 3 hàm phải khớp nhau.
// Mọi test truyền `today` tường minh để không phụ thuộc ngày chạy test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeStreak, advanceStreak, liveStreak } from '../src/domain/streak.js';

test('computeStreak: tập liên tục tới hôm nay', () => {
  const r = computeStreak(['2026-01-05', '2026-01-06', '2026-01-07'], '2026-01-07');
  assert.equal(r.current, 3);
  assert.equal(r.longest, 3);
  assert.equal(r.lastDate, '2026-01-07');
  assert.equal(r.atRisk, false);
});

test('computeStreak: sống nhờ hôm qua thì atRisk = true', () => {
  const r = computeStreak(['2026-01-05', '2026-01-06', '2026-01-07'], '2026-01-08');
  assert.equal(r.current, 3, 'ân hạn 1 ngày: chuỗi chưa đứt');
  assert.equal(r.atRisk, true);
});

test('computeStreak: nghỉ 2 ngày là đứt chuỗi', () => {
  const r = computeStreak(['2026-01-05', '2026-01-06', '2026-01-07'], '2026-01-09');
  assert.equal(r.current, 0);
  assert.equal(r.atRisk, false, 'đã đứt thì không còn cảnh báo');
  assert.equal(r.longest, 3, 'kỷ lục cũ vẫn giữ');
});

test('computeStreak: longest tính cả đoạn đã đứt trong quá khứ', () => {
  const r = computeStreak(['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-06'], '2026-01-06');
  assert.equal(r.current, 1);
  assert.equal(r.longest, 3);
});

test('computeStreak: không có buổi nào', () => {
  const r = computeStreak([], '2026-01-07');
  assert.deepEqual(r, { current: 0, longest: 0, lastDate: null, atRisk: false });
});

test('computeStreak: trùng ngày không cộng đôi', () => {
  const r = computeStreak(['2026-01-06', '2026-01-06', '2026-01-07'], '2026-01-07');
  assert.equal(r.current, 2);
});

test('advanceStreak: buổi thứ hai trong cùng ngày không tăng chuỗi', () => {
  const prev = { current: 3, longest: 5, lastDate: '2026-01-07' };
  assert.equal(advanceStreak(prev, '2026-01-07'), prev);
});

test('advanceStreak: log lùi ngày không tăng chuỗi', () => {
  const prev = { current: 3, longest: 5, lastDate: '2026-01-07' };
  assert.equal(advanceStreak(prev, '2026-01-05'), prev);
});

test('advanceStreak: ngày kế tiếp thì cộng 1', () => {
  const r = advanceStreak({ current: 3, longest: 5, lastDate: '2026-01-07' }, '2026-01-08');
  assert.deepEqual(r, { current: 4, longest: 5, lastDate: '2026-01-08' });
});

test('advanceStreak: cách quãng thì reset về 1, giữ kỷ lục', () => {
  const r = advanceStreak({ current: 3, longest: 5, lastDate: '2026-01-07' }, '2026-01-10');
  assert.deepEqual(r, { current: 1, longest: 5, lastDate: '2026-01-10' });
});

test('advanceStreak: buổi đầu tiên của người dùng mới', () => {
  assert.deepEqual(advanceStreak(undefined, '2026-01-07'), {
    current: 1, longest: 1, lastDate: '2026-01-07',
  });
});

test('advanceStreak: vượt kỷ lục cũ thì longest tăng theo', () => {
  const r = advanceStreak({ current: 5, longest: 5, lastDate: '2026-01-07' }, '2026-01-08');
  assert.equal(r.longest, 6);
});

test('liveStreak: chưa từng tập', () => {
  assert.deepEqual(liveStreak(null, '2026-01-07'), { current: 0, atRisk: false });
});

test('liveStreak: đã tập hôm nay', () => {
  const r = liveStreak({ current: 4, longest: 9, lastDate: '2026-01-07' }, '2026-01-07');
  assert.equal(r.current, 4);
  assert.equal(r.atRisk, false);
});

test('liveStreak: mới tập hôm qua — còn sống nhưng cảnh báo', () => {
  const r = liveStreak({ current: 4, longest: 9, lastDate: '2026-01-06' }, '2026-01-07');
  assert.equal(r.current, 4);
  assert.equal(r.atRisk, true);
});

test('liveStreak: nghỉ 2 ngày — hao mòn về 0 lúc đọc, kỷ lục vẫn còn', () => {
  const r = liveStreak({ current: 4, longest: 9, lastDate: '2026-01-05' }, '2026-01-07');
  assert.equal(r.current, 0);
  assert.equal(r.atRisk, false);
  assert.equal(r.longest, 9);
});
