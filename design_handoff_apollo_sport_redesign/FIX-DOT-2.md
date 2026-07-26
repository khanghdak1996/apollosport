# ĐỌC FILE NÀY TRƯỚC

Gói này giờ có **code thật, chạy được ngay** cho toàn bộ 13 màn — không còn là mô tả bằng lời.
Copy đè lên file cũ là xong, không cần diễn giải lại.

## Vì sao đợt trước ra "gần giống concept"

1. `src/ui/primitives.js` và `src/ui/sportIcons.js` bị **lỗi ký tự escape** (viết `\${...}`
   thay vì `${...}`) → không chạy được, nên đã bị viết lại theo cảm tính. **Nay đã sửa.**
2. README chỉ **mô tả layout bằng lời văn** → mỗi lần đọc lại ra một kết quả khác.
   **Nay đã có code thật cho tất cả các màn.**

---

## Danh sách file

### Nền tảng — làm trước tiên
| File | Việc |
|---|---|
| `src/ui/theme.js` | thay toàn bộ |
| `src/ui/primitives.js` | thay toàn bộ (**bản đã sửa lỗi escape**) |
| `src/ui/sportIcons.js` | thay toàn bộ (**bản đã sửa lỗi escape**) |
| `src/ui/fonts.css` | thêm mới |
| `fonts/*.ttf` | copy vào `fonts/` ở gốc repo (**thư mục này chưa có, phải tạo mới**) |
| `index-head-changes.html` | hướng dẫn sửa `<head>` của `index.html` |

### Màn hình — code hoàn chỉnh
| File | Việc |
|---|---|
| `src/screens/HomeTab.js` | MỚI — xoá hàm `HomeTab` trong `app.js`, import từ đây |
| `src/screens/CalendarTab.js` | MỚI — xoá hàm `CalendarTab` trong `app.js`, import từ đây |
| `src/screens/Celebrate.js` | MỚI — thay khối chúc mừng đang có trong `app.js` |
| `src/screens/ClubScreen.js` | MỚI (export cả `Contributors` dùng lại được) |
| `src/screens/GoalsScreen.js` | MỚI (export cả `Ring` dùng lại được) |
| `src/screens/LeaderboardTab.js` | thay toàn bộ |
| `src/screens/PostCard.js` | thay toàn bộ |
| `src/screens/LogActivity.js` | thay toàn bộ |
| `src/screens/Settings.js` | thay toàn bộ |
| `src/screens/GuidesScreen.js` | thay toàn bộ |
| `src/screens/GuideDetail.js` | thay toàn bộ |
| `snippets/TabBar.js` | đoạn thay cho hàm `TabBar` trong `app.js` |

Props và tên hàm giữ nguyên như bản cũ → chỗ gọi phần lớn không phải sửa.
Vài màn nhận thêm props tuỳ chọn (ghi rõ trong comment đầu mỗi file).

---

## Dán đoạn này vào Claude Code

```
Trong repo có thư mục design_handoff_apollo_sport_redesign/.
Đọc file FIX-DOT-2.md trong đó trước, rồi làm theo thứ tự sau.

Trước hết: tạo nhánh git mới tên "redesign".

BƯỚC A — nền tảng:
  1. Tạo thư mục fonts/ ở gốc repo (chưa có), copy 2 file .ttf từ thư mục bàn giao vào.
  2. Ghi đè src/ui/theme.js, src/ui/primitives.js, src/ui/sportIcons.js.
     Copy src/ui/fonts.css vào src/ui/.
  3. Sửa <head> của index.html theo index-head-changes.html. Nếu đường dẫn font
     không khớp cách repo serve file tĩnh, tự sửa cho đúng.
  4. Sửa mọi chỗ gọi <Empty icon="..."/>: tham số icon giờ là KEY chữ
     (vd "trophy", "people", "gym"), KHÔNG còn là emoji.
  5. Chạy app, sửa hết lỗi console. BÁO TÔI để tôi xem trước khi đi tiếp.

BƯỚC B — từng màn, mỗi lần MỘT màn, xong thì báo tôi kiểm tra rồi mới sang màn kế:
  Thứ tự: HomeTab → TabBar → PostCard → LeaderboardTab → LogActivity →
          CalendarTab → Celebrate → Settings → ClubScreen → GoalsScreen →
          GuidesScreen → GuideDetail
  Với mỗi màn: copy file từ thư mục bàn giao vào src/screens/, rồi nối dây
  (import, xoá hàm cũ trong app.js nếu có, truyền props còn thiếu).

QUY TẮC QUAN TRỌNG:
- Các file trong thư mục bàn giao là code HOÀN CHỈNH. KHÔNG được viết lại theo ý mình,
  KHÔNG "cải tiến", KHÔNG đổi màu/cỡ chữ/spacing. Chỉ sửa khi có lỗi chạy thật.
- Không đổi data model, không đổi Firestore rules, không đổi cách tính điểm MET,
  không đổi luồng 4 tab.
- Không thêm npm package, không thêm build step. Repo dùng Preact + htm qua importmap.
- Nếu một màn cần props mà app.js chưa có sẵn dữ liệu, hỏi tôi thay vì tự bịa.
```

---

## Nếu vẫn thấy chưa giống

Mở `Apollo Sport.dc.html` bằng Chrome, cuộn tới khối **turn 2**, chụp màn hình màn đang
lệch, đưa ảnh cho Claude Code kèm câu: "màn này trong app đang khác thiết kế, sửa cho khớp".
So ảnh dễ hơn so chữ nhiều.

## Chưa có trong đợt này

**F6 — Bảng vinh danh + huy hiệu cấp độ + khung viền avatar theo cấp.** Chỗ cắm đã chuẩn bị:
avatar ở header Cá nhân và hạng 1 trên bục đều đã có viền vàng. Cần chốt hệ cấp độ có mấy
bậc và mốc điểm mỗi bậc thì mới thiết kế được bộ khung viền.
