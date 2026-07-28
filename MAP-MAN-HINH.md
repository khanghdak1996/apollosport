# Bản đồ màn hình — Apollo Social Sport Club

Mục đích: để khi cần chỉnh màn nào, bạn gọi đúng **tên file** cho nhanh.
Cột "Cách đi đến" mô tả thao tác trong app để tới màn đó.

Ký hiệu:
- **[screen]** = file riêng trong `src/screens/`.
- **[app.js]** = hàm component nằm trong `src/app.js` (chưa tách file riêng).
- `pg` = trang chồng (push, có nút back); `tab` = 1 trong 4 tab ở thanh dưới.

---

## 1. Xác thực & khởi tạo

| Tên file | Màn | Cách đi đến |
|---|---|---|
| `src/screens/SignIn.js` **[screen]** | Đăng nhập (logo, wordmark APOLLO, nút Google) | Hiện khi chưa đăng nhập |
| `src/screens/Onboarding.js` **[screen]** | Nhập tên/phòng ban/môn hay tập lần đầu | Hiện ngay sau lần đăng nhập đầu (khi `prefs.onboarded` chưa bật) |

## 2. Bốn tab chính (thanh dưới) — `TabBar` **[app.js]**

| Tên file | Màn | Cách đi đến |
|---|---|---|
| `src/screens/HomeTab.js` **[screen]** | **Trang chủ** — chuỗi ngày, mục tiêu tuần, buổi gần đây | Tab "Trang chủ" (`tab==='home'`) |
| `src/screens/FeedTab.js` **[screen]** | **Bảng tin** — feed buổi tập đồng nghiệp | Tab "Bảng tin" (`tab==='feed'`) |
| `src/screens/LeaderboardTab.js` **[screen]** | **Xếp hạng** — bảng điểm tuần/tháng, top 3 | Tab "Xếp hạng" (`tab==='rank'`) |
| `src/screens/CalendarTab.js` **[screen]** | **Cá nhân** — lịch chấm màu, phân bổ môn, cân nặng, 3 link (CLB/Mục tiêu/Hướng dẫn), nút bánh răng | Tab "Cá nhân" (`tab==='me'`) |
| `ProgressTab` **[app.js]** | Phần "mục tiêu tuần + tiến bộ từng môn/bài" (bản `slim`) nằm **dưới** tab Cá nhân | Cuộn xuống trong tab Cá nhân |

## 3. Ghi buổi tập (luồng log)

| Tên file | Màn | Cách đi đến |
|---|---|---|
| `src/screens/PickActivity.js` **[screen]** | **Chọn môn** (BẠN HAY TẬP + tất cả môn) | Bấm **nút + (FAB)** giữa thanh dưới |
| `src/screens/LogActivity.js` **[screen]** | **Ghi buổi** môn ngoài gym (chạy/bơi/yoga…) | Chọn môn ≠ gym ở PickActivity |
| `ActiveWorkout` **[app.js]** | **Đang tập gym** (đồng hồ, set, nghỉ) | Chọn "Tập gym" ở PickActivity → bắt đầu chương trình |
| `SaveWorkout` **[app.js]** | **Lưu buổi gym** (tên, ảnh, thời lượng, hiển thị) | Sau khi bấm "Xong" ở ActiveWorkout (`pg==='save-workout'`) |
| `CelebrationModal` **[app.js]** | **Chúc mừng** (confetti, PR, huy hiệu) | Tự hiện sau khi lưu xong 1 buổi tập |
| `ProgsTab` **[app.js]** | **Chương trình tập** (danh sách program gym) | PickActivity → "Tập gym" (`pg==='progs'`), hoặc HomeTab → quản lý chương trình |
| `CreateProg` **[app.js]** | **Tạo/sửa chương trình** gym | Trong ProgsTab → tạo/sửa (`pg==='create-prog'`) |
| `PickEx` **[app.js]** | **Chọn bài tập** thêm vào chương trình | Trong CreateProg → thêm bài (`pg==='pick-ex'`) |

## 4. Chi tiết buổi tập & tương tác

| Tên file | Màn | Cách đi đến |
|---|---|---|
| `SessDetail` **[app.js]** | **Chi tiết buổi tập** (+ nút Sửa: tiêu đề/ghi chú/ảnh/hiển thị) | Bấm 1 buổi ở Trang chủ "Gần đây", Bảng tin, Hồ sơ, hay feed CLB (`pg==='sess-detail'`) |
| `src/screens/PostCard.js` **[screen]** | Thẻ 1 bài trong feed (avatar, số liệu, tim/bình luận) | Hiển thị trong Bảng tin & feed CLB |
| `src/screens/CommentsSheet.js` **[screen]** | **Bình luận** 1 bài | Bấm icon bình luận trên 1 bài (`pg==='comments'`) |
| `src/screens/ProfileScreen.js` **[screen]** | **Hồ sơ 1 người** (của mình hoặc đồng nghiệp) | Bấm avatar/tên ở Bảng tin, Xếp hạng, thành viên CLB (`pg==='user-profile'`) |

## 5. Câu lạc bộ & Mục tiêu chung

| Tên file | Màn | Cách đi đến |
|---|---|---|
| `src/screens/ClubsScreen.js` **[screen]** | **Danh sách CLB** + tạo nhóm | Tab Cá nhân → link "Câu lạc bộ" (`pg==='clubs'`) |
| `src/screens/ClubDetail.js` **[screen]** | **Chi tiết CLB** (thành viên, quản lý, mục tiêu nhóm, feed hoạt động) | Bấm 1 CLB ở ClubsScreen (`pg==='club-detail'`) |
| `src/screens/GoalsScreen.js` **[screen]** | **Mục tiêu toàn công ty** (danh sách) | Tab Cá nhân → link "Mục tiêu chung" (`pg==='goals'`) |
| `src/screens/GoalCard.js` **[screen]** | Thẻ 1 mục tiêu (vòng tiến độ 96px, góp nhiều nhất) | Hiển thị trong GoalsScreen & ClubDetail |
| `src/screens/GoalForm.js` **[screen]** | **Tạo mục tiêu** (công ty hoặc nhóm) | Nút "＋ Tạo" trong GoalsScreen / ClubDetail |
| `src/screens/AnnouncementFeed.js` **[screen]** | Khối **thông báo** (text + ảnh) gắn trong CLB / mục tiêu | Nằm trong ClubDetail & GoalCard |

## 6. Kho hướng dẫn

| Tên file | Màn | Cách đi đến |
|---|---|---|
| `src/screens/GuidesScreen.js` **[screen]** | **Kho hướng dẫn** (nhóm theo môn) | Tab Cá nhân → link "Hướng dẫn" (`pg==='guides'`) |
| `src/screens/GuideDetail.js` **[screen]** | **Hướng dẫn chi tiết** (ảnh, video, các bước, lỗi/mẹo/an toàn) | Bấm 1 bài ở GuidesScreen, hoặc nút "Hướng dẫn" trong LogActivity (`pg==='guide-detail'`) |

## 7. Cài đặt

| Tên file | Màn | Cách đi đến |
|---|---|---|
| `src/screens/Settings.js` **[screen]** | **Cài đặt** (hồ sơ, quyền riêng tư, admin, đăng xuất/xoá) | Bấm **avatar ở Trang chủ**, hoặc nút bánh răng ở tab Cá nhân (`pg==='settings'`) |

## 8. Thành phần con (không phải màn độc lập) — `src/app.js`

| Hàm | Vai trò |
|---|---|
| `TabBar` | Thanh 4 tab dưới cùng |
| `ResumeBar` | Dải "tiếp tục buổi tập đang dở" |
| `ExThumb` | Ô icon 1 bài tập (dùng trong PickEx) |
| `BarChart` | Biểu đồ cột (thống kê) |
| `DeltaBadge` | Nhãn ▲▼ thay đổi so kỳ trước |
| `SegToggle` | Nút gạt 2 lựa chọn (vd Theo bài / Theo buổi) |
| `GymPair` | Component gốc của app (state điều phối toàn bộ) |

---

## Ghi chú
- Đổi tab = state `tab` (`home`/`feed`/`rank`/`me`); mở trang chồng = state `pg`.
- Nhiều màn "chi tiết" (SessDetail, ActiveWorkout, SaveWorkout, Celebrate, các Tab, program) hiện **vẫn nằm trong `app.js`**, chưa tách file riêng — nếu muốn tách để dễ gọi tên, nói mình làm.
