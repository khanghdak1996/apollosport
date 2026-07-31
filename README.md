# Apollo Sport 🏃

Mạng xã hội tập luyện **nội bộ công ty** — mở rộng từ app gym cá nhân "GymPair" thành nền tảng đa môn cho nhân viên: ghi lại mọi môn thể thao, chia sẻ lên bảng tin công ty, giữ chuỗi, sưu tầm huy hiệu và cùng nhau về đích qua các mục tiêu chung.

> Đăng nhập Google khoá theo domain công ty (`@apollo.edu.vn`). Toàn bộ dữ liệu đồng bộ qua Firebase.

## 🚀 Tính năng chính
- **Ghi mọi môn:** gym (chương trình + set builder), chạy/đi bộ/đạp/bơi/leo núi (quãng đường, pace, lap), yoga, bóng đá/rổ/cầu lông/tennis/pickleball… Mỗi môn có ô nhập riêng, quy đổi ra **điểm** chung để so sánh công bằng.
- **Chấm điểm khoa học (MET × giờ × 10):** cường độ đo bằng thang **RPE 5 mức** (kèm "talk test"). Môn có tốc độ (chạy/đi/đạp/bơi) tự tính MET từ **quãng đường + thời lượng**, RPE điều chỉnh ±20% để ghi nhận nỗ lực cá nhân; môn đồng đội/yoga nội suy MET theo RPE; gym tính theo khối lượng (set×rep×kg) × RPE. Xem chi tiết ở `Metric-cham-diem-the-thao.md`.
- **🤖 Trợ lý AI (tư vấn tập luyện & dinh dưỡng):** bong bóng chat popup, hỏi đáp tiếng Việt qua OpenAI. Key API **giữ ở server** (Vercel serverless `api/chat.js`), xác thực bằng Firebase token — không lộ ra client. History chỉ trong phiên (không lưu).
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
- **Preact 10 + htm** qua import map — **không có bước build** cho frontend.
- **Firebase 10.14.1** — Auth (Google) · Firestore · Storage. Project: `apollo-sport-social`.
- **Vercel serverless function** (`api/chat.js`) làm proxy an toàn cho **OpenAI** (trợ lý AI) — dependency-free, không cần `package.json`.

## 💻 Chạy local
Ứng dụng dùng ES modules nên **KHÔNG mở trực tiếp `file://`** được (bị CORS chặn) — phải chạy qua một web server tĩnh:

```bash
python3 -m http.server 8000
```

Rồi mở `http://localhost:8000`.

> ⚠️ Trợ lý AI cần serverless `/api/chat` nên **`python http.server` không chạy được phần chat**. Muốn test chat tại máy: dùng `vercel dev` (có file `.env` với `OPENAI_API_KEY`), hoặc test thẳng trên bản Vercel.

## ☁️ Triển khai
- **Production: Vercel** (auto-deploy từ nhánh `main`) — https://apollosport.vercel.app. Framework Preset = **Other**, không build command. `vercel.json` cấu hình proxy `/__/auth/*`; thư mục `api/` được Vercel tự nhận là serverless function.
- **Biến môi trường (Vercel → Settings → Environment Variables):**
  - `OPENAI_API_KEY` — **bắt buộc** để trợ lý AI hoạt động (giữ bí mật, chỉ ở server).
  - `OPENAI_MODEL` — tuỳ chọn (mặc định `gpt-4o-mini`).
- Cấu hình Firebase (web) đã nhúng sẵn trong `src/firebase.js` (apiKey web là public, bình thường với Firebase).
- Deploy security rules & indexes:

```bash
cd firebase && firebase deploy --only firestore:rules,storage:rules,firestore:indexes --project apollo-sport-social
```

## 📂 Cấu trúc
```
index.html              # style + import map + nạp src/main.js
api/
  chat.js               # Vercel serverless: proxy OpenAI (giữ key) + verify Firebase token
src/
  app.js                # component UI cốt lõi + GymPair root (state/routing) + bong bóng chat
  main.js firebase.js auth.js html.js config.js
  ui/                   # theme, icons, primitives, sound
  domain/               # activities (registry môn + RPE), session (chấm điểm), stats, streak, badges, guides, ...
  data/                 # repo-* (sessions, social, users, clubs, goals, posts), chat-ai, photos, local
  screens/              # Feed, Leaderboard, Profile, Settings, Clubs, Goals, Guides, ChatBot, ...
tools/                  # build-exercise-db.mjs (dev: sinh thư viện bài tập)
firebase/               # firestore.rules, storage.rules, indexes, firebase.json
```

> Ghi chú phát triển & lộ trình chi tiết: xem `HANDOFF.md` (log đầy đủ) và `CHAT-HANDOFF.md` (ngữ cảnh cô đọng cho phiên mới).
