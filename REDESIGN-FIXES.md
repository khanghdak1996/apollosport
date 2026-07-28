# Apollo Sport — Backlog sửa sau redesign

> ## ✅ HOÀN TẤT (2026-07-28) — F1–F12 + mục D (bug sau kiểm thử) đều ☑.
> Commit `76b165c` trên nhánh `redesign`. **Còn ngỏ duy nhất:** F6 cần chạy
> `cd firebase && firebase deploy --only storage` (user tự deploy) để upload ảnh announcement hoạt động.
> File này giữ lại làm nhật ký what/why từng mục.

Danh sách việc sau khi redesign 12 màn (nhánh `redesign`).
Mỗi mục có mã (F1, F2…). Cột *Nguyên nhân/Hướng* là phân tích ban đầu; phần **> XONG** dưới mỗi mục là cách đã sửa.

Trạng thái: ☐ chưa làm · ☑ xong

---

## A. Bug chức năng / mất dữ liệu (ưu tiên cao)

### ☑ F1 — Chế độ admin không kích hoạt
> **XONG:** toggle "Chế độ quản trị" gọi `onToggleModerating` → `setAdminMode` NGAY khi bấm (Settings.js), app.js truyền prop. Không chờ "Lưu hồ sơ" nữa. (adminMode vẫn là state phiên — reset khi reload, đúng ý bảo mật.)
- **Hiện tượng:** bật toggle "Chế độ quản trị" trong Cài đặt nhưng chức năng kiểm duyệt không bật.
- **File:** `src/screens/Settings.js`, chỗ gọi Settings trong `src/app.js`.
- **Nguyên nhân:** toggle admin nằm ở nhóm "Quyền riêng tư" (không có nút lưu riêng); giá trị chỉ được `setAdminMode` khi bấm "Lưu hồ sơ" ở nhóm khác → bật toggle xong không có gì xảy ra. Ngoài ra `adminMode` là state phiên (reset khi reload).
- **Hướng:** cho toggle admin gọi `setAdminMode` ngay khi bấm (áp dụng tức thì), không chờ "Lưu hồ sơ". Cân nhắc hiện lại thanh "Đang ở chế độ quản trị" như bản cũ.

### ☑ F2 — GuideDetail mất dữ liệu (ảnh, video, các bước)
> **XONG (render-verify):** khớp lại schema `guides.js` — steps render `s.text`, video dựng từ `ytQuery` qua `ytSearchUrl()`, ảnh lấy `media.find(type==='image').src`, thêm lại `sections[{heading,body}]` và `safety[]`. Test render bài `ex-incline-bench`: đủ 6 bước + video URL đúng + "Bài này tập gì?" + "An toàn".
- **Hiện tượng:** màn hướng dẫn chi tiết không hiện ảnh, nút YouTube, và các bước thực hiện.
- **File:** `src/screens/GuideDetail.js` (đọc sai tên field so với `src/domain/guides.js`).
- **Nguyên nhân (khớp field sai):**
  - Bước: dữ liệu là `guide.steps = [{text}]` nhưng UI render `${s}` (cả object) → mất. Phải render `s.text`.
  - Video: dữ liệu có `guide.ytQuery` (từ khoá tìm) chứ không có `guide.videoUrl` → nút video không hiện. Phải dựng URL `https://www.youtube.com/results?search_query=<ytQuery>` (hoặc theo cách bản cũ).
  - Ảnh: dữ liệu là `guide.media = [{type:'image',src}]` chứ không có `guide.imageUrl` → luôn ra placeholder. Phải lấy `media.find(m=>m.type==='image')?.src`.
  - **Mất hẳn:** `guide.sections = [{heading,body}]` và `guide.safety = [..]` không được render trong bản redesign (bản cũ có). Cần thêm lại.
- **Ưu tiên:** cao (mất nội dung học tập).

### ☑ F3 — Mục tiêu tuần lệch giữa Trang chủ và Cá nhân
> **XONG:** HomeTab bỏ đếm 7-ngày-trượt (`last7`), dùng `currentWeekActivity(sessions)` (tuần Thứ 2→CN) cho cả số buổi + số phút — CÙNG nguồn với ProgressTab. 7 vạch tuần vốn đã Mon-based nên giờ khớp.
- **Hiện tượng:** Trang chủ hiện "8", Cá nhân hiện "2/3" cho cùng một người. Cần track đúng theo tuần bắt đầu Thứ 2.
- **File:** `src/screens/HomeTab.js` (thẻ MỤC TIÊU TUẦN) vs `ProgressTab` trong `src/app.js` (dùng `currentWeekActivity`).
- **Nguyên nhân:** HomeTab đếm số buổi trong **7 ngày trượt** (`last7.length`); ProgressTab đếm theo **tuần lịch bắt đầu Thứ 2** (`currentWeekActivity`). Hai cách cho số khác nhau.
- **Hướng:** HomeTab dùng cùng `currentWeekActivity(sessions).count` (Thứ 2 → CN) cho cả số buổi và 7 vạch tuần; goal lấy `userDoc.goals.sessionsPerWeek`. Thống nhất một nguồn.

### ☑ F4 — CLB lấy log all-time thay vì từ ngày tạo nhóm
> **XONG:** `clubFeedPage(cursor, sport, memberSet, since)` thêm tham số `since`; thêm `where('loggedAt','>=',since)` (range trên cùng field orderBy → khớp index sẵn có). ClubDetail truyền ngày tạo nhóm ở cả load đầu lẫn trang kế.
> **SỬA LỖI (sau kiểm thử):** `loggedAt` lưu dạng **số ms** còn `createdAt` là **Timestamp** → Firestore so sánh số≥timestamp luôn false ⇒ feed trống. Fix: truyền `createdAt.toMillis()` (helper `sinceMs` trong ClubDetail). Giữ nguyên query theo môn+thành viên (feed = đúng môn nhóm, hợp lý hơn bỏ lọc môn).
- **Hiện tượng:** feed CLB hiện cả buổi tập trước khi CLB được tạo.
- **File:** `clubFeedPage` trong `src/data/repo-clubs.js`, dùng ở `src/screens/ClubDetail.js`.
- **Hướng:** lọc feed từ `club.createdAt` trở đi (thêm điều kiện thời gian vào query hoặc lọc client). Cần xác nhận `club` có field ngày tạo.

---

## B. Tính năng mới / đổi hành vi

### ☑ F5 — Chọn public/private ở màn Chúc mừng + sửa lại sau khi đăng
> **XONG (phần sửa-sau-đăng):** thêm chọn 🌏/🔒 trong panel SỬA của `SessDetail` (app.js). Handler `changeVisibility` cập nhật cục bộ (optimistic) + gọi repo `updateSessionVisibility` (mới, repo-sessions.js) để **reconcile leaderboard tuần & tháng** (totals đếm mọi buổi nên không đổi; chỉ entry company-only cần tính lại — dùng lại `recomputePeriodEntry`). Rules cho chủ bài đổi visibility (đã kiểm).
> **Lưu ý:** việc CHỌN visibility LÚC ĐĂNG vốn đã có sẵn ở cả LogActivity và SaveWorkout (buổi gym chọn ngay trước màn Chúc mừng). KHÔNG thêm toggle vào màn Celebrate để tránh trùng + giữ quyết định "Celebrate chỉ restyle". Nếu muốn có luôn ở Celebrate, nói mình thêm.
- **Hiện tượng:** màn Celebrate (sau buổi gym) không cho chọn công khai/riêng tư; muốn cho phép đổi public↔private sau khi đăng.
- **File:** `CelebrationModal` trong `src/app.js`; sửa visibility sau khi đăng → `SessDetail` (mở qua `openSess`) + repo cập nhật `visibility`.
- **Ghi chú:** LogActivity (môn ngoài gym) đã có chọn visibility; buổi gym thì chưa. Đây là phần "per-workout visibility" đã hoãn trước đó — giờ làm. Cần: nút chọn ở Celebrate + lưu `visibility` vào doc buổi tập + cho sửa trong chi tiết buổi.

### ☑ F6 — Announcement CLB & Mục tiêu công ty: thêm ảnh + sửa announcement
> **XONG (hướng "chỉ ảnh, sửa = xoá+tạo lại" — user chốt):**
> - **Ảnh:** thêm path `announcements/{uid}/{file}` vào `storage.rules`; helper `uploadAnnouncementPhoto`/`deleteAnnouncementPhoto` (photos.js). `addAnnouncement` mint id TRƯỚC → upload → setDoc 1 lần (rules chỉ có create/delete, KHÔNG update). Lưu `imageId` để xoá đúng ảnh, tránh mồ côi.
> - **Sửa:** `editAnnouncement` = tạo bản mới (tạo TRƯỚC, xoá SAU) → không cần update-rule; ảnh cũ dọn best-effort khi đổi/bỏ ảnh. UI AnnouncementFeed: picker ảnh khi đăng, hiện ảnh, nút Sửa (text + giữ/thay/gỡ ảnh).
> - Firestore giữ nguyên rule (vẫn bắt buộc text>0 → luôn có text kèm ảnh).
> - **⚠️ CẦN DEPLOY:** `firebase.json` nằm trong thư mục `firebase/` → phải `cd firebase` trước:
>   `cd firebase && firebase deploy --only storage` (project: `apollo-sport-social`). Chưa deploy thì upload ảnh bị từ chối (text-only vẫn chạy).
> - Verify: render AnnouncementFeed (port sạch) — compose có "📷 Thêm ảnh" + file input OK.
- **Hiện tượng:** cần thêm ảnh vào thông báo (CLB + mục tiêu công ty) và cho phép chỉnh sửa announcement trong CLB.
- **File:** `src/screens/AnnouncementFeed.js` (+ repo lưu ảnh/announcement).
- **Hướng:** thêm upload ảnh (dùng `compressImage`/`uploadSessionPhoto` hoặc tương tự) + nút sửa cho người có quyền (chủ nhóm/admin).

### ☑ F7 — Bỏ "Tính lại chuỗi"
> **XONG:** xoá nhóm "Chuỗi tập" + prop `onRecalcStreak` khỏi Settings.js; gỡ hàm `recomputeStreak` + wiring trong app.js; bỏ import `computeStreak` thừa. `advanceStreak`/`liveStreak` vẫn dùng.
- **Hiện tượng:** người dùng không hiểu chức năng → bỏ.
- **File:** `src/screens/Settings.js` (nhóm "Chuỗi tập"), có thể gỡ luôn wiring `recomputeStreak` trong `src/app.js`.
- **Hướng:** xoá nhóm "Chuỗi tập" khỏi Cài đặt. Đơn giản, ưu tiên nhanh.

---

## C. Restyle còn thiếu

### ☑ F8 — Màn đăng nhập (SignIn) chưa restyle sâu
> **XONG (render-verify):** logo ô vuông 76px bo 24 nền xanh + icon `run` trắng; wordmark "APOLLO / SPORT" Semi Condensed 52px xanh; câu dẫn Baskerville; nút Google bo 15px shadow brand; tagline chân màn "WHERE THE BEST BECOME BETTER" .22em; 2 vòng tròn trang trí. `src/screens/SignIn.js`.

### ☑ F9 — Màn chọn môn (PickActivity) còn icon cũ
> **XONG (render-verify):** header display + câu dẫn Baskerville; nhóm "BẠN HAY TẬP" (tối đa 3 môn từ `recentTypes`) = ô xanh icon trắng; "TẤT CẢ MÔN" grid 3 cột ô trắng, `SportIcon` tint theo môn. `src/screens/PickActivity.js`.

### ☑ F10 — Màn danh sách CLB (ClubsScreen) chưa restyle sâu
> **XONG (render-verify):** header display "CÂU LẠC BỘ" + nút "＋ Tạo nhóm"; thẻ CLB dùng `SportIcon` tint theo môn + "Đã vào" pill + chevron; sheet Tạo: label in hoa, chip môn `SportIcon` (chọn=xanh), quyền tham gia globe/lock. `src/screens/ClubsScreen.js`.

### ☑ F11 — ProgressTab (phần chia nhiều môn / tiến bộ từng bài ở tab Cá nhân) chưa restyle
> **XONG:** view-tabs dùng `SportIcon` thay emoji, active = nền `bg3` chữ+viền xanh (bỏ accent-glow); goalCard bỏ 💪/✅ (thay `check` xanh lá), thanh xanh brand + green, nút xanh; header drilldown distance/session dùng `SportIcon` + tên môn Semi Condensed. `ProgressTab` trong `src/app.js`.

### ☑ F12 — Emoji sót trong section phụ ClubDetail + GoalCard/GoalForm chưa restyle sâu
> **XONG:** ClubDetail — 🎯→`SportIcon target`, "Hoạt động nhóm · <emoji>"→`SportIcon`, cổng vào 🌐/🔒→globe/lock. GoalCard (render-verify) — **vòng tiến độ 96px** (Ring SVG), badge trạng thái, title Semi Condensed, số 30px, "GÓP NHIỀU NHẤT" xếp hạng, bỏ 🎯/🎉/🗑. GoalForm (render-verify) — label in hoa, chip môn/metric `SportIcon` chọn=xanh. `ClubDetail.js`, `GoalCard.js`, `GoalForm.js`.

---

## Ghi chú kỹ thuật chung
- Tất cả trên nhánh git `redesign`; `main` là bản gốc trước redesign. Không thích → `git checkout main`.
- Repo Preact + htm qua importmap, KHÔNG build step. Không thêm npm package.
- Xem thiết kế đích: mở `design_handoff_apollo_sport_redesign/Apollo Sport.dc.html` (khối **turn 2/3**).
- Verify mỗi màn: `node --check <file>` + chạy `python3 -m http.server 8000` rồi mở app, hoặc render-test component vào div ẩn.

---

## D. Bug phát hiện khi kiểm thử (sau A+B+C) — ĐÃ SỬA

- ☑ **B1 — Deploy F6 lỗi "could not locate firebase.json":** config nằm trong `firebase/` → `cd firebase && firebase deploy --only storage`.
- ☑ **B2 — Feed CLB trống:** `loggedAt` (số ms) vs `createdAt` (Timestamp) không so sánh được → truyền `createdAt.toMillis()`. `ClubDetail.js` + `repo-clubs.js`.
- ☑ **B3 — Icon màn chi tiết/sửa buổi tập còn emoji:** `SessDetail` (trong `app.js`) — stat cells, close/edit/trash, camera, ghi chú, globe/lock → `SportIcon` (thêm key `close` vào `sportIcons.js`).
- ☑ **B4 — Avatar Trang chủ bấm vào là đăng xuất:** đổi `onSwitch` từ `signOutUser()` → `setPg('settings')` (mở Cài đặt; đăng xuất vẫn nằm trong đó). `app.js`.
- ☑ **B5 — GuideDetail chỉ hiện 0.jpg:** free-exercise-db có 2 ảnh (đầu/cuối) → hiện HẾT (grid 2 cột, nhãn "Bắt đầu"/"Kết thúc"). `GuideDetail.js`.
- ☑ **Tài liệu:** thêm `MAP-MAN-HINH.md` (bảng tên file ↔ màn ↔ cách đi đến).

### Còn để ngỏ (nếu muốn làm tiếp)
- `SaveWorkout` (màn Lưu buổi gym) vẫn còn emoji 📷/🌏/🔒 giống SessDetail cũ — chưa đổi (user mới chỉ flag màn chi tiết). Nói nếu muốn đồng bộ.
