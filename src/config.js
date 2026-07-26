// Cấu hình cấp ứng dụng.
// Chỉ tài khoản Google thuộc các domain này mới đăng nhập được (khớp với firestore.rules).
// Thêm domain = thêm 1 phần tử. Rules cũng phải cập nhật tương ứng nếu đổi.
export const ALLOWED_DOMAINS = ['apollo.edu.vn'];

export const emailAllowed = (email) =>
  !!email && ALLOWED_DOMAINS.some(d => email.toLowerCase().endsWith('@' + d));
