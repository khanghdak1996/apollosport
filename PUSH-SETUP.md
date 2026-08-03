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

## Chặng 2 — CHƯA code (server gửi push). Cần khi muốn thực sự đẩy thông báo.

**Sẽ dựng:**
- `api/notify.js` — Vercel serverless: verify token người gọi (như `api/chat.js`), tra token người nhận qua Firestore REST, gửi FCM HTTP v1. Dependency-free (ký JWT service account bằng `crypto` có sẵn).
- `api/cron-streak.js` — Vercel Cron (chạy ~19:00 mỗi ngày): tìm ai còn chuỗi mà chưa tập hôm nay → nhắc "sắp mất chuỗi".
- Nối trigger trong `src/data/repo-social.js`: sau khi thả tim / bình luận thành công → gọi `/api/notify` (fire-and-forget) báo chủ bài.
- `vercel.json`: thêm lịch cron.

**Prerequisite bạn làm trước khi code chặng 2:**
1. **Service account:** Firebase Console → Project settings → **Service accounts** → **Generate new private key** → tải file JSON.
2. Thêm biến môi trường trên **Vercel** (Settings → Environment Variables) — **KHÔNG commit**:
   - `FIREBASE_PROJECT_ID` = `apollo-sport-social`
   - `FIREBASE_SA_CLIENT_EMAIL` = trường `client_email` trong JSON
   - `FIREBASE_SA_PRIVATE_KEY` = trường `private_key` (giữ nguyên các `\n`; Vercel cho dán multiline)
   - `CRON_SECRET` = một chuỗi ngẫu nhiên (bảo vệ endpoint cron)
3. FCM gửi push **miễn phí** — KHÔNG cần bật Blaze/Cloud Functions vì trigger chạy trên Vercel serverless sẵn có.

Xong prerequisite thì báo mình để code chặng 2.
