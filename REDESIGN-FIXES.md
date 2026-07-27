# Apollo Sport — Backlog sửa sau redesign

Danh sách việc còn lại sau khi redesign 12 màn (nhánh `redesign`).
Mỗi mục có mã (F1, F2…). Khi muốn làm mục nào, nhắn ví dụ: **"làm F4"** hoặc **"làm F4, F7"**.
Cột *Nguyên nhân/Hướng* là phân tích của mình, có thể điều chỉnh khi bắt tay làm.

Trạng thái: ☐ chưa làm · ☑ xong

---

## A. Bug chức năng / mất dữ liệu (ưu tiên cao)

### ☐ F1 — Chế độ admin không kích hoạt
- **Hiện tượng:** bật toggle "Chế độ quản trị" trong Cài đặt nhưng chức năng kiểm duyệt không bật.
- **File:** `src/screens/Settings.js`, chỗ gọi Settings trong `src/app.js`.
- **Nguyên nhân:** toggle admin nằm ở nhóm "Quyền riêng tư" (không có nút lưu riêng); giá trị chỉ được `setAdminMode` khi bấm "Lưu hồ sơ" ở nhóm khác → bật toggle xong không có gì xảy ra. Ngoài ra `adminMode` là state phiên (reset khi reload).
- **Hướng:** cho toggle admin gọi `setAdminMode` ngay khi bấm (áp dụng tức thì), không chờ "Lưu hồ sơ". Cân nhắc hiện lại thanh "Đang ở chế độ quản trị" như bản cũ.

### ☐ F2 — GuideDetail mất dữ liệu (ảnh, video, các bước)
- **Hiện tượng:** màn hướng dẫn chi tiết không hiện ảnh, nút YouTube, và các bước thực hiện.
- **File:** `src/screens/GuideDetail.js` (đọc sai tên field so với `src/domain/guides.js`).
- **Nguyên nhân (khớp field sai):**
  - Bước: dữ liệu là `guide.steps = [{text}]` nhưng UI render `${s}` (cả object) → mất. Phải render `s.text`.
  - Video: dữ liệu có `guide.ytQuery` (từ khoá tìm) chứ không có `guide.videoUrl` → nút video không hiện. Phải dựng URL `https://www.youtube.com/results?search_query=<ytQuery>` (hoặc theo cách bản cũ).
  - Ảnh: dữ liệu là `guide.media = [{type:'image',src}]` chứ không có `guide.imageUrl` → luôn ra placeholder. Phải lấy `media.find(m=>m.type==='image')?.src`.
  - **Mất hẳn:** `guide.sections = [{heading,body}]` và `guide.safety = [..]` không được render trong bản redesign (bản cũ có). Cần thêm lại.
- **Ưu tiên:** cao (mất nội dung học tập).

### ☐ F3 — Mục tiêu tuần lệch giữa Trang chủ và Cá nhân
- **Hiện tượng:** Trang chủ hiện "8", Cá nhân hiện "2/3" cho cùng một người. Cần track đúng theo tuần bắt đầu Thứ 2.
- **File:** `src/screens/HomeTab.js` (thẻ MỤC TIÊU TUẦN) vs `ProgressTab` trong `src/app.js` (dùng `currentWeekActivity`).
- **Nguyên nhân:** HomeTab đếm số buổi trong **7 ngày trượt** (`last7.length`); ProgressTab đếm theo **tuần lịch bắt đầu Thứ 2** (`currentWeekActivity`). Hai cách cho số khác nhau.
- **Hướng:** HomeTab dùng cùng `currentWeekActivity(sessions).count` (Thứ 2 → CN) cho cả số buổi và 7 vạch tuần; goal lấy `userDoc.goals.sessionsPerWeek`. Thống nhất một nguồn.

### ☐ F4 — CLB lấy log all-time thay vì từ ngày tạo nhóm
- **Hiện tượng:** feed CLB hiện cả buổi tập trước khi CLB được tạo.
- **File:** `clubFeedPage` trong `src/data/repo-clubs.js`, dùng ở `src/screens/ClubDetail.js`.
- **Hướng:** lọc feed từ `club.createdAt` trở đi (thêm điều kiện thời gian vào query hoặc lọc client). Cần xác nhận `club` có field ngày tạo.

---

## B. Tính năng mới / đổi hành vi

### ☐ F5 — Chọn public/private ở màn Chúc mừng + sửa lại sau khi đăng
- **Hiện tượng:** màn Celebrate (sau buổi gym) không cho chọn công khai/riêng tư; muốn cho phép đổi public↔private sau khi đăng.
- **File:** `CelebrationModal` trong `src/app.js`; sửa visibility sau khi đăng → `SessDetail` (mở qua `openSess`) + repo cập nhật `visibility`.
- **Ghi chú:** LogActivity (môn ngoài gym) đã có chọn visibility; buổi gym thì chưa. Đây là phần "per-workout visibility" đã hoãn trước đó — giờ làm. Cần: nút chọn ở Celebrate + lưu `visibility` vào doc buổi tập + cho sửa trong chi tiết buổi.

### ☐ F6 — Announcement CLB & Mục tiêu công ty: thêm ảnh + sửa announcement
- **Hiện tượng:** cần thêm ảnh vào thông báo (CLB + mục tiêu công ty) và cho phép chỉnh sửa announcement trong CLB.
- **File:** `src/screens/AnnouncementFeed.js` (+ repo lưu ảnh/announcement).
- **Hướng:** thêm upload ảnh (dùng `compressImage`/`uploadSessionPhoto` hoặc tương tự) + nút sửa cho người có quyền (chủ nhóm/admin).

### ☐ F7 — Bỏ "Tính lại chuỗi"
- **Hiện tượng:** người dùng không hiểu chức năng → bỏ.
- **File:** `src/screens/Settings.js` (nhóm "Chuỗi tập"), có thể gỡ luôn wiring `recomputeStreak` trong `src/app.js`.
- **Hướng:** xoá nhóm "Chuỗi tập" khỏi Cài đặt. Đơn giản, ưu tiên nhanh.

---

## C. Restyle còn thiếu

### ☐ F8 — Màn đăng nhập (SignIn) chưa restyle sâu
- **File:** `src/screens/SignIn.js`. Theo README screen 1 (logo ô vuông, wordmark APOLLO/SPORT, nút Google, tagline chân màn).

### ☐ F9 — Màn chọn môn (PickActivity) còn icon cũ
- **File:** `src/screens/PickActivity.js`. Thay emoji → `SportIcon` theo `iconKey`; thêm nhóm "BẠN HAY TẬP" (README screen 4).

### ☐ F10 — Màn danh sách CLB (ClubsScreen) chưa restyle sâu
- **File:** `src/screens/ClubsScreen.js`. Mới ăn màu nền tảng; cần dựng lại theo phong cách redesign (header, thẻ CLB icon vẽ).

### ☐ F11 — ProgressTab (phần chia nhiều môn / tiến bộ từng bài ở tab Cá nhân) chưa restyle
- **File:** `ProgressTab` trong `src/app.js` (phần `slim` đang render dưới CalendarTab: mục tiêu tuần + drilldown từng môn/bài vẫn theme cũ).
- **Hướng:** restyle goalCard + phần view-tabs/drilldown theo hệ token mới.

### ☐ F12 — Emoji sót trong section phụ ClubDetail + GoalCard/GoalForm chưa restyle sâu
- **File:** `src/screens/ClubDetail.js` (vd "🎯 Mục tiêu nhóm", "Hoạt động của nhóm · <emoji>"), `src/screens/GoalCard.js`, `src/screens/GoalForm.js`.
- **Hướng:** thay emoji → SportIcon; restyle thẻ mục tiêu (vòng tiến độ `Ring`, thanh %, "Góp nhiều nhất") theo README screen 9–10.

---

## Ghi chú kỹ thuật chung
- Tất cả trên nhánh git `redesign`; `main` là bản gốc trước redesign. Không thích → `git checkout main`.
- Repo Preact + htm qua importmap, KHÔNG build step. Không thêm npm package.
- Xem thiết kế đích: mở `design_handoff_apollo_sport_redesign/Apollo Sport.dc.html` (khối **turn 2/3**).
- Verify mỗi màn: `node --check <file>` + chạy `python3 -m http.server 8000` rồi mở app, hoặc render-test component vào div ẩn.
