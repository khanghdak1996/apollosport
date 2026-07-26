# Apollo Sport 🏃

Mạng xã hội tập luyện **nội bộ công ty** — mở rộng từ app gym cá nhân "GymPair" thành nền tảng đa môn cho nhân viên: ghi lại mọi môn thể thao, chia sẻ lên bảng tin công ty, giữ chuỗi, sưu tầm huy hiệu và cùng nhau về đích qua các mục tiêu chung.

> Đăng nhập Google khoá theo domain công ty (`@apollo.edu.vn`). Toàn bộ dữ liệu đồng bộ qua Firebase.

## 🚀 Tính năng chính
- **Ghi mọi môn:** gym (chương trình + set builder), chạy/đi bộ/đạp/bơi/leo núi (quãng đường, pace, lap), yoga, bóng đá/rổ/cầu lông/tennis/pickleball… Mỗi môn có ô nhập riêng, quy đổi ra **điểm** chung (theo MET) để so sánh công bằng.
- **Bảng tin công ty:** thả tim + bình luận; sửa/xoá bài & bình luận của mình.
- **Chuỗi (streak) + Huy hiệu + Màn mừng:** động viên duy trì thói quen; cảnh báo khi sắp mất chuỗi.
- **Bảng xếp hạng** công ty / phòng ban theo điểm (tuần & tháng).
- **Tiến bộ cá nhân:** kỷ lục (PR) đa môn (xa nhất, tổng tuần cao nhất, buổi dài nhất…) + mục tiêu tuần (số buổi / số phút).
- **Câu lạc bộ:** nhóm theo môn/sở thích (công khai hoặc cần duyệt), mời thành viên theo tên/email, feed riêng theo môn của nhóm.
- **Mục tiêu chung (Group Goal):** hợp tác — cả nhóm/công ty cùng góp về một con số chung, có bảng đóng góp (không xếp hạng đối đầu).
- **Feed thông báo:** chủ nhóm / người tạo mục tiêu đăng cập nhật cho mọi người đọc.
- **Kho hướng dẫn:** hướng dẫn từng môn & bài tập (thư viện [free-exercise-db](https://github.com/yuhonas/free-exercise-db), ảnh thật + bước dịch tiếng Việt + video YouTube).
- **Quản trị (admin):** chế độ kiểm duyệt để gỡ nội dung vi phạm.
- **Riêng tư:** cân nặng/số đo luôn riêng tư; tuỳ chọn ẩn khỏi bảng xếp hạng; xoá tài khoản.

## 🧱 Công nghệ
- **Preact 10 + htm** qua import map — **không có bước build**.
- **Firebase 10.14.1** — Auth (Google) · Firestore · Storage.
- Firebase project: `apollo-sport-social`.

## 💻 Chạy local
Ứng dụng dùng ES modules nên **KHÔNG mở trực tiếp `file://`** được (bị CORS chặn) — phải chạy qua một web server tĩnh:

```bash
python3 -m http.server 8000
```

Rồi mở `http://localhost:8000`.

## ☁️ Triển khai
- **Firebase Hosting** hoặc **GitHub Pages** (host tĩnh, không cần backend riêng).
- Cấu hình Firebase đã nhúng sẵn trong `src/firebase.js`.
- Deploy security rules & indexes:

```bash
cd firebase && firebase deploy --only firestore:rules,storage:rules,firestore:indexes --project apollo-sport-social
```

## 📂 Cấu trúc
```
index.html              # style + import map + nạp src/main.js
src/
  app.js                # component UI cốt lõi + GymPair root (state/routing)
  main.js firebase.js auth.js html.js config.js
  ui/                   # theme, icons, primitives, sound
  domain/               # activities, session, stats, streak, badges, guides, ...
  data/                 # repo-* (sessions, social, users, clubs, goals, posts), photos, local
  screens/              # Feed, Leaderboard, Profile, Settings, Clubs, Goals, Guides, ...
tools/                  # build-exercise-db.mjs (dev: sinh thư viện bài tập)
firebase/               # firestore.rules, storage.rules, indexes, firebase.json
```

> Ghi chú phát triển & lộ trình chi tiết: xem `HANDOFF.md`.
