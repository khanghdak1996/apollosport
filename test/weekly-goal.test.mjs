// Chuẩn hoá mục tiêu tuần. Giá trị đến từ ô người dùng gõ (màn Tiến bộ) và từ nút chọn
// nhanh ở màn chào mừng — hai nơi phải cho ra cùng một kết quả, nên dùng chung một hàm.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampWeeklyGoal, WEEKLY_GOAL_MAX } from '../src/domain/stats.js';

test('số buổi hợp lệ giữ nguyên', () => {
  assert.equal(clampWeeklyGoal(3), 3);
  assert.equal(clampWeeklyGoal('5'), 5);
});

test('bỏ trống hoặc không phải số thì thành 0 (coi như chưa đặt mục tiêu)', () => {
  assert.equal(clampWeeklyGoal(''), 0);
  assert.equal(clampWeeklyGoal(undefined), 0);
  assert.equal(clampWeeklyGoal(null), 0);
  assert.equal(clampWeeklyGoal('abc'), 0);
});

test('số âm bị kéo về 0', () => {
  assert.equal(clampWeeklyGoal(-5), 0);
  assert.equal(clampWeeklyGoal('-1'), 0);
});

test('số buổi vô lý bị chặn trần', () => {
  assert.equal(clampWeeklyGoal(999), WEEKLY_GOAL_MAX.sessions);
  assert.equal(WEEKLY_GOAL_MAX.sessions, 21, 'tối đa 3 buổi/ngày trong 7 ngày');
});

test('số thập phân lấy phần nguyên', () => {
  assert.equal(clampWeeklyGoal('3.7'), 3);
});

test('mục tiêu số phút dùng trần riêng', () => {
  assert.equal(clampWeeklyGoal(500, 'minutes'), 500);
  assert.equal(clampWeeklyGoal(999999, 'minutes'), WEEKLY_GOAL_MAX.minutes);
});
