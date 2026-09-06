# Apollo Sport — luật của project

Mạng xã hội tập luyện nội bộ (`@apollo.edu.vn`). Preact + htm, **không có bước build**, Firebase, deploy Vercel tự động từ `main`.

## Mục tiêu sản phẩm (chốt ngày 6/9/2026)

- **Mục tiêu:** nhân viên Apollo vận động nhiều hơn. App chỉ là công cụ.
- **Thành công sau 3 tháng công bố:** nhiều người tập **đều đặn** — một tỉ lệ đáng kể nhân viên ghi ít nhất 1 buổi/tuần trong 4 tuần liên tiếp.
- **Quy mô dự kiến:** 50–200 nhân viên. Hiện mới 3 người dùng, **chưa công bố**.
- Thước đo này CỐ Ý không phải: tổng số buổi tập toàn công ty, số lượt đăng nhập, hay số bài đăng — đó là các con số dễ đẹp mà không chứng minh được ai khoẻ hơn.
- Khi cân nhắc thêm/bớt tính năng, hỏi: nó phục vụ sự **đều đặn** của người ít vận động nhất, hay chỉ phục vụ người đã chăm sẵn?


## Ràng buộc kiến trúc — đừng phá

- **Không thêm bundler, không thêm bước build cho frontend.** `index.html` nạp Preact/htm qua **import map**. Thêm Vite/webpack/npm script build là đi ngược thiết kế.
- **`src/` là ESM**, `api/` là **CommonJS dependency-free** (Vercel serverless, chỉ dùng module có sẵn của Node như `crypto`). Không đưa `package.json` vào thư mục gốc — sẽ làm Vercel phát sinh bước `npm install` và đổi pipeline deploy đang chạy ổn.
- `src/package.json` (`{"type":"module"}`) chỉ để **Node hiểu src là ESM khi chạy test**. Trình duyệt không fetch file này; nó nằm trong `.vercelignore`.
- **Điểm số là server-authoritative.** `firestore.rules` cấm client ghi `totals`/leaderboard. Chỉ `recomputeUser` trong `api/_lib/scoring.js` (service account) được ghi. Muốn cộng điểm ở bất cứ đâu khác → sai chỗ.
- `recomputeUser` **tính lại từ đầu**, không cộng dồn: nó chạy sau mỗi lần lưu/xoá buổi tập và mỗi lần đăng nhập. Mọi điểm không xuất phát từ buổi tập thật sẽ bị xoá ở lần chạy kế tiếp nếu không được cộng lại bên trong chính hàm này.
- `src/domain/period.js` và `api/_lib/scoring.js` chứa **hai bản cùng một logic id kỳ** (client/server). Sửa một bên phải sửa bên kia — `test/period.test.mjs` khoá chặt điều này.
- Cân nặng / số đo là **dữ liệu riêng tư**, không được lộ ra feed hay bảng xếp hạng.

## Lệnh

```bash
# Test (JS thuần ở src/domain + api/_lib)
node --import ./test/support/register.mjs --test test/*.test.mjs

# Chạy local (frontend). Trợ lý AI cần /api/chat nên phải dùng `vercel dev` mới test được chat.
python3 -m http.server 8146

# Deploy security rules & indexes
cd firebase && firebase deploy --only firestore:rules,storage:rules,firestore:indexes --project apollo-sport-social
```

## Test

- Không có npm, không có node_modules. `test/support/register.mjs` thay `preact/hooks` bằng stub và shim `localStorage`, nhờ đó code viết cho trình duyệt chạy được trong Node.
- Test file đặt ở `test/`, đuôi `.test.mjs`.
- Ưu tiên test logic thuần: `src/domain/` và `api/_lib/scoring.js`. Hàm nào gọi mạng/Firestore thì **tách phần tính toán ra module thuần** rồi test phần đó, đừng mock Firestore.
- Mọi hàm phụ thuộc ngày tháng phải nhận `today` làm tham số để test không phụ thuộc ngày chạy.

## Quy ước

- **Commit bằng tiếng Việt**, theo dạng `feat(scope): mô tả` / `fix(...)` / `refactor(...)` / `chore(...)`.
- Comment trong code viết tiếng Việt, giải thích **vì sao** chứ không mô tả lại code.
- Không commit tài liệu kế hoạch nội bộ (đã từng gỡ ở commit `4ba880f`).
- `main` = production. Feature làm ở nhánh riêng, merge qua PR.
