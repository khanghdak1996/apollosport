// Cấu hình cấp ứng dụng.
// Chỉ tài khoản Google thuộc các domain này mới đăng nhập được (khớp với firestore.rules).
// Thêm domain = thêm 1 phần tử. Rules cũng phải cập nhật tương ứng nếu đổi.
export const ALLOWED_DOMAINS = ['apollo.edu.vn'];

export const emailAllowed = (email) =>
  !!email && ALLOWED_DOMAINS.some(d => email.toLowerCase().endsWith('@' + d));

// ── Thông báo đẩy (Web Push qua Firebase Cloud Messaging) ───────────────────
// VAPID_PUBLIC_KEY: lấy ở Firebase Console → Project settings → Cloud Messaging
// → "Web Push certificates" → Generate key pair → dán KHOÁ CÔNG KHAI vào đây.
// Đây là khoá PUBLIC (giống Firebase web apiKey) nên commit được, không phải bí mật.
// Bỏ trống = tính năng push tắt (toggle sẽ báo chưa cấu hình). Xem PUSH-SETUP.md.
export const PUSH = {
  vapidKey: '',
  // Endpoint serverless gửi push (chặng 2). Cùng domain nên để đường dẫn tương đối.
  notifyEndpoint: '/api/notify',
};

export const pushConfigured = () => !!PUSH.vapidKey;
