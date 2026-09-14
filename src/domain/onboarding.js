// Luật ô bắt buộc ở màn chào mừng. Để riêng ngoài component vì đây là thứ hỏng âm thầm:
// thêm ô bắt buộc mà quên đưa vào danh sách thì nút vẫn sáng và hồ sơ thiếu dữ liệu.
//
// Vì sao từng ô bắt buộc:
// - name        : tên hiển thị cho đồng nghiệp thấy trong bảng tin và xếp hạng.
// - gender      : hệ số DOTS chấm điểm gym công bằng giữa nam và nữ.
// - weightKg    : cùng hệ số DOTS — không có thì điểm gym không so được công bằng.
// - goalSessions: người dùng tự đặt vạch đích. Trước đây app áp cứng 3 buổi/tuần cho tất cả,
//                 kể cả người chưa từng tập — họ trượt ngay tuần đầu và học được cảm giác
//                 không đạt. Bắt chọn để con số đó là của họ, không phải do app gán.
//
// Phòng ban KHÔNG bắt buộc: ai chưa biết chọn gì vẫn phải vào được app.

export const REQUIRED_ONBOARDING = ['name', 'gender', 'weightKg', 'goalSessions'];

const IS_FILLED = {
  name: v => String(v || '').trim().length > 0,
  gender: v => !!v,
  weightKg: v => Number(v) > 0,
  goalSessions: v => Number(v) > 0,
};

// Trả về danh sách khoá ô còn thiếu, theo đúng thứ tự hiện trên màn hình.
// Rỗng = điền đủ, cho phép bấm "Bắt đầu".
export function missingOnboardingFields(fields = {}) {
  return REQUIRED_ONBOARDING.filter(k => !IS_FILLED[k](fields[k]));
}
