# Apollo Sport — Handoff cho phiên làm việc mới

> Dán file này (hoặc phần liên quan) vào chat mới để có ngữ cảnh. Cập nhật: 2026-07-28.

## 1. Dự án là gì
- App **PWA thể thao nội bộ Apollo**: đồng nghiệp ghi buổi tập (gym & nhiều môn), bảng tin, bảng xếp hạng, nhóm/CLB, mục tiêu, huy hiệu, chuỗi ngày.
- **Stack:** Preact + htm (template literals, KHÔNG JSX) + Firebase (Auth/Firestore/Storage). **Không có build step, không có `package.json`** — chạy ES modules trực tiếp, thư viện nạp qua importmap CDN trong `index.html` (esm.sh cho preact/htm, gstatic cho firebase).
- Ngôn ngữ UI: tiếng Việt.

## 2. Hạ tầng / liên kết
- **GitHub:** https://github.com/khanghdak1996/apollosport (nhánh `main`).
- **Vercel (production):** https://apollosport.vercel.app — auto-deploy từ `main`, Framework Preset = **Other**, KHÔNG build command. Cấu hình proxy trong `vercel.json`.
- **Firebase project:** `apollo-sport-social` (Auth Google, Firestore, Storage). Config nằm trong `src/firebase.js` (apiKey public, bình thường với Firebase web).
- **Google Cloud** = cùng project `apollo-sport-social` (Firebase project chính là GCP project).

## 3. Đăng nhập & PWA (phần vừa xử lý — QUAN TRỌNG)
Bối cảnh: muốn dùng standalone PWA nhưng Google login bằng popup không chạy trong app đã cài; iOS còn bị cô lập storage khi auth ở domain khác.

Đã cấu hình **auth cùng-domain** để signInWithRedirect chạy được trên iOS PWA:
- `src/auth.js`: dùng `signInWithRedirect` khi là **in-app webview HOẶC standalone PWA**, còn lại dùng popup. Có `consumeRedirect()` chạy lúc khởi động để bắt kết quả.
- `src/firebase.js`: **production đặt `authDomain = 'apollosport.vercel.app'`**; localhost giữ `apollo-sport-social.firebaseapp.com`.
- `vercel.json`: proxy `/__/auth/*` → `https://apollo-sport-social.firebaseapp.com/__/auth/*`.
- **Google Cloud Console → APIs & Services → Credentials → OAuth client "Web client (auto created by Google Service)"** đã thêm:
  - Authorized JavaScript origins: `https://apollosport.vercel.app`
  - Authorized redirect URIs: `https://apollosport.vercel.app/__/auth/handler`
- **Firebase Console → Authentication → Settings → Authorized domains** có `apollosport.vercel.app`.
- `manifest.webmanifest` (`display: standalone`) + icon `assets/icon-192.png` / `assets/icon-512.png` (tạo từ logo Apollo bằng `sips`) + `apple-touch-icon` trong `index.html`.
- **Cài PWA:** Android/Chrome = menu → Install app. iOS = **Safari** → Share → Add to Home Screen (xoá bản cũ trước khi thêm lại để nhận code/manifest mới).

Giới hạn đăng nhập: chỉ email **@apollo.edu.vn** (`src/config.js` `ALLOWED_DOMAINS`), provider gắn `hd=apollo.edu.vn`.

## 4. Kiến trúc code (thư mục `src/`)
- `main.js` → render `<GymPair/>`; `app.js` (~1700 dòng) = component gốc + nhiều màn inline (ActiveWorkout, SaveWorkout, CreateProg, PickEx, SessDetail, ProgressTab, CelebrationModal…), router thủ công bằng state `tab` + `pg`/`pgCtx`.
- `screens/` — các màn tách file (SignIn, Onboarding, HomeTab, CalendarTab, FeedTab, LeaderboardTab, ProfileScreen, Settings, Clubs*, Goals*, Guides*, Comments, PostCard…).
- `ui/` — theme (tokens màu `C`/`BRAND`/`F`/`T`, `ACC`), primitives (`Wrap/Card/Btn/Label`…), icons, sportIcons, sound, fonts.css.
- `domain/` — logic thuần: `activities`, `session` (build/điểm), `stats`, `streak`, `badges`, `exercises` (EX ~112 bài), `guides`+`fitness-vocab`, `format`, `period`.
- `data/` — `local.js` (localStorage cache), `photos.js` (upload ảnh), và các `repo-*.js` gọi Firestore (users/sessions/social/leaderboard/clubs/goals/posts/private), `departments.js`, `instructions-vi.js`, `exercises-db.js` (auto-gen, 2.3k dòng), **`cloud.js` = lớp cũ đã chết**.
- `tools/build-exercise-db.mjs` — script dev sinh `exercises-db.js`.
- `firebase/` — `firestore.rules`, `firestore.indexes.json`, `storage.rules`, `firebase.json`, `.firebaserc` (default project).

Mô hình dữ liệu **local-first**: mỗi mutation `setState` + `localStorage`, rồi `await repo.*()` lên cloud; lỗi cloud chỉ hiện banner.

## 5. Quyền admin
- Lưu ở Firestore collection **`admins/{uid}`** (một doc/uid), set TAY qua Console. Admin là **cộng thêm** (vẫn là user bình thường). Bật "Chế độ quản trị" trong Cài đặt để xoá bài/bình luận vi phạm.
- Admin hiện tại = chủ dự án (khang.hoangdanganh@apollo.edu.vn). Khi xoá dữ liệu test thì **giữ collection `admins` + tài khoản Auth của mình** để uid không đổi.

## 6. Lệnh hay dùng
Deploy rules/indexes/storage (đã có `.firebaserc` nên khỏi `--project`):
```bash
cd "/Users/hoangdanganhkhang/Documents/Apollo Sport/firebase"
firebase deploy --only firestore:rules,firestore:indexes,storage
```
Chạy thử local (auth localhost dùng authDomain firebaseapp.com):
```bash
cd "/Users/hoangdanganhkhang/Documents/Apollo Sport"
python3 -m http.server 8137   # mở http://localhost:8137
```
Xoá dữ liệu test (GIỮ `admins`):
```bash
cd "/Users/hoangdanganhkhang/Documents/Apollo Sport/firebase"
firebase firestore:delete users --recursive --force
firebase firestore:delete sessions --recursive --force
firebase firestore:delete leaderboard --recursive --force
firebase firestore:delete clubs --recursive --force
firebase firestore:delete goals --recursive --force
# ĐỪNG chạy --all-collections (sẽ xoá cả admins)
```

## 7. Việc đã làm gần đây (commit mới → cũ)
- `7456e62` auth same-domain qua Vercel proxy để signInWithRedirect chạy trên iOS PWA.
- `7fd47dc` PWA: manifest + icon standalone, redirect khi standalone.
- `309c14f` Onboarding: dropdown Phòng ban/Trung tâm từ DEPARTMENTS, bỏ ô Cơ sở & emoji.
- `1bec82a` chỉnh size/vị trí logo SignIn (bạn tự sửa trên GitHub).
- `3c0696a` thêm `.firebaserc` + `.vercelignore`.
- Trong `db047f7` đã kèm: gộp logic lặp trong `app.js` (`points7d`, `VisibilityButtons`, `PhotoPicker`), leaderboard hiển thị **top 50** (không realtime, load khi mở tab), xoá `domain/constants.js` (đã dời `REST_PRESETS` vào app.js) + xoá 4 ảnh nặng không dùng.

## 8. Còn tồn / nên làm sau
- [ ] **Review bảo mật `firestore.rules` + `storage.rules`** trước khi mở rộng người dùng (chủ dự án đã hẹn làm sau).
- [ ] Xác nhận iOS standalone login đã ổn sau khi thêm OAuth redirect URI (đã xong bước config; cần test lại). Nếu còn "missing initial state"/lặp: chỉnh thêm `auth.js` (thứ tự `getRedirectResult` / `browserPopupRedirectResolver`).
- [ ] Dọn dead code còn lại: `data/cloud.js` + `fbDb/fbStorage/fbReady`, và vài dead export/unused import (Hero, Pill, SportChip, ACCENTS ở theme.js, topEntries, historyOf, removeMyGoalProgress, các *_VI thừa…).
- [ ] Lịch sử git còn ~5MB ảnh đã xoá (clone nặng hơn) — dọn bằng filter-repo/BFG nếu cần (rewrite history, làm khi chưa ai clone).
- [ ] Icon PWA hiện là logo trên nền trắng — có thể thay bằng icon vuông chuẩn (192/512, maskable) đẹp hơn.

## 9. Lưu ý làm việc
- App không có test tự động; verify bằng `node --check <file>` cho cú pháp và mở static server xem console lỗi. Login Google thật không test được ở máy dev — phải test trên bản Vercel.
- Sửa xong thường: commit + push `main` → Vercel auto-deploy. Nếu sửa trực tiếp trên GitHub thì nhớ `git pull --rebase` trước khi push từ máy.
- Style code: theo lối htm template literals sẵn có, tiếng Việt trong UI & comment.
