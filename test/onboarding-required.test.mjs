// Luật "ô nào bắt buộc ở màn chào mừng". Tách khỏi component vì đây là thứ dễ hỏng âm thầm:
// thêm một ô bắt buộc mà quên đưa vào danh sách thì nút vẫn sáng, người dùng vẫn qua được,
// và hồ sơ thiếu dữ liệu mà không ai biết.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { missingOnboardingFields, REQUIRED_ONBOARDING } from '../src/domain/onboarding.js';

const day = { name: 'Trần Bình An', gender: 'male', weightKg: 68, goalSessions: 3 };

test('điền đủ thì không thiếu ô nào', () => {
  assert.deepEqual(missingOnboardingFields(day), []);
});

test('bốn ô bắt buộc: tên, giới tính, cân nặng, mục tiêu tuần', () => {
  assert.deepEqual(REQUIRED_ONBOARDING, ['name', 'gender', 'weightKg', 'goalSessions']);
  assert.deepEqual(missingOnboardingFields({}), REQUIRED_ONBOARDING);
});

test('tên chỉ có khoảng trắng vẫn tính là thiếu', () => {
  assert.deepEqual(missingOnboardingFields({ ...day, name: '   ' }), ['name']);
});

test('cân nặng bằng 0 hoặc âm là thiếu', () => {
  assert.deepEqual(missingOnboardingFields({ ...day, weightKg: 0 }), ['weightKg']);
  assert.deepEqual(missingOnboardingFields({ ...day, weightKg: -5 }), ['weightKg']);
});

test('mục tiêu tuần chưa chọn là thiếu — không còn cho bỏ qua', () => {
  assert.deepEqual(missingOnboardingFields({ ...day, goalSessions: 0 }), ['goalSessions']);
});

test('phòng ban KHÔNG bắt buộc', () => {
  assert.deepEqual(missingOnboardingFields({ ...day, dept: '' }), []);
});

test('thiếu nhiều ô thì trả về theo đúng thứ tự hiện trên màn hình', () => {
  assert.deepEqual(
    missingOnboardingFields({ name: 'An', gender: '', weightKg: 0, goalSessions: 0 }),
    ['gender', 'weightKg', 'goalSessions'],
  );
});
