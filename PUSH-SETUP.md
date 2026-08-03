# Thông báo đẩy (Web Push / FCM) — hướng dẫn cấu hình

App đẩy thông báo qua **Firebase Cloud Messaging (FCM)**. Làm theo 2 chặng.

## Chặng 1 — ĐÃ code xong (client). Bạn cần làm 1 bước console:

**Lấy VAPID public key rồi dán vào code:**
1. Firebase Console → ⚙️ **Project settings** → tab **Cloud Messaging**.
2. Mục **Web Push certificates** → **Generate key pair**.
3. Copy chuỗi **Key pair** (public key, bắt đầu bằng `B...`).
4. Mở [`src/config.js`](src/config.js), dán vào `PUSH.vapidKey`:
   ```js
   export const PUSH = { vapidKey: 'BX...dán vào đây...', notifyEndpoint: '/api/notify' };
   ```
   > Đây là khoá **public** (giống Firebase web apiKey) — commit bình thường, không phải bí mật.
5. Commit + push → Vercel deploy.

**Kiểm thử chặng 1 (phải trên bản Vercel HTTPS, không chạy localhost http được):**
- Mở https://apollosport.vercel.app → đăng nhập → **Cài đặt** → bật **Thông báo đẩy** → trình duyệt hỏi quyền → **Cho phép**.
- Kiểm tra Firestore: `users/{uid}/private/push` xuất hiện doc có map `tokens` chứa 1 token → OK, thiết bị đã đăng ký.
- iOS: **bắt buộc** cài PWA (Safari → Share → Add to Home Screen) và iOS ≥ 16.4 mới bật được. Chrome/Android & desktop thì chạy thẳng.

### Đã dựng ở chặng 1
- `firebase-messaging-sw.js` (gốc site) — service worker nhận push nền + xử lý click.
- `src/data/push.js` — xin quyền, lấy/gỡ token, lưu `users/{uid}/private/push`, handler foreground.
- Toggle **Thông báo đẩy** trong Cài đặt; `fb/messaging` thêm vào importmap; gọi `initForeground()` lúc mở app.
- Lưu token dùng `private/` subcollection (rules sẵn có: chỉ chủ đọc/ghi; server đọc bằng service account).

---

## Chặng 2 — ĐÃ code (server gửi push). Bạn chỉ cần đặt env + deploy.

**Đã dựng:**
- `api/_lib/fcm.js` — mint OAuth từ service account (ký JWT bằng `crypto`), đọc Firestore REST, gửi FCM v1. Dependency-free, KHÔNG bị Vercel route (thư mục `_`).
- `api/notify.js` — verify token người gọi (như `api/chat.js`), **soạn nội dung ở server** theo loại, tra token người nhận qua service account rồi gửi. Các loại: `reaction`, `comment`, `clubInvite`, `clubPost`, `goalPost`.
- Trigger client (fire-and-forget `notifyServer`): thả tim & bình luận (`repo-social.js`), mời CLB (`repo-clubs.js`), thông báo CLB/mục tiêu (`repo-posts.js`).
- Đồng hồ nghỉ gym hết giờ → `notifyLocal` (thông báo **cục bộ**, không qua server) khi app ở nền.
- ❌ Bỏ nhắc "mất chuỗi" (không dùng cron) theo yêu cầu → **không đụng `vercel.json`**.

**Việc bạn cần làm để kích hoạt:**
1. **Service account:** Firebase Console → Project settings → **Service accounts** → **Generate new private key** → tải file JSON.
2. Thêm biến môi trường trên **Vercel** (Settings → Environment Variables) — **KHÔNG commit**:
   - `FIREBASE_PROJECT_ID` = `apollo-sport-social`
   - `FIREBASE_SA_CLIENT_EMAIL` = trường `client_email` trong JSON
   - `FIREBASE_SA_PRIVATE_KEY` = trường `private_key` (dán nguyên cả `-----BEGIN...-----`, giữ các `\n`; Vercel cho dán multiline)
3. Deploy lại (đổi env cần redeploy). FCM gửi push **miễn phí** — KHÔNG cần Blaze.

**Kiểm thử chặng 2:** máy A đăng nhập user A (đã bật push), máy/tab B là user B → B thả tim/bình luận bài của A → A nhận thông báo. Chưa đặt env thì `/api/notify` trả 500 "chưa cấu hình service account" (client nuốt lỗi, app vẫn chạy bình thường).

**Còn để lại (TODO nhỏ):** chưa dọn token chết phía server (token gỡ app trả 'stale' — mới đếm, chưa xoá khỏi Firestore). Deep-link mở đúng bài/nhóm chưa làm (noti mở về trang chủ) vì app điều hướng bằng state, chưa có route URL.
