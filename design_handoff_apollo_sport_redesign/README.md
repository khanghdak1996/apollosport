# Handoff: Apollo Sport — redesign giao diện theo Apollo Brand Book V9

## Overview
Thiết kế lại toàn bộ lớp visual của **Apollo Sport** — mạng xã hội tập luyện nội bộ
(@apollo.edu.vn), Preact + htm + Firebase, không build step. Giữ nguyên 100% kiến trúc
thông tin đã có: 4 tab (Trang chủ · Bảng tin · Xếp hạng · Cá nhân), FAB ghi buổi tập,
registry đa môn theo `kind` (strength / distance / session), hệ điểm MET.
Không đổi luồng, không đổi data model, không đổi Firestore rules.

## About the Design Files
File `Apollo Sport.dc.html` trong gói này là **bản thiết kế tham chiếu viết bằng HTML** —
prototype tĩnh mô tả diện mạo mong muốn, **không phải code để copy nguyên vào app**.
Việc cần làm: dựng lại các màn đó **trong chính codebase Preact + htm hiện tại**,
dùng `html\`\`` tagged template và style object như các file `src/screens/*.js` đang viết.

Mở file bằng cách kéo vào browser. Cấu trúc: 4 khối (turn), **mới nhất ở trên**:
- **turn 3** — Đăng nhập · Onboarding · Đang tập gym · Kho hướng dẫn · Hướng dẫn chi tiết · Cài đặt
- **turn 2** — Trang chủ · Chọn môn · Ghi buổi tập · Bảng tin · Xếp hạng · Cá nhân · CLB · Mục tiêu chung · Chúc mừng ← **bản chốt**
- **turn 1** — 2 phương án khám phá (1a xanh đậm / 1b Baby Blue). Đã chốt 1a, riêng bảng xếp hạng lấy bục vinh danh của 1b. *Chỉ để tham khảo lịch sử.*
- **turn 0** — dựng lại giao diện CŨ để so sánh. *Không implement.*

**Chỉ implement turn 2 và turn 3.**

## Fidelity
**High-fidelity.** Màu, font, cỡ chữ, spacing, bo góc trong prototype là giá trị chốt —
lấy đúng. Ba file trong `src/` của gói này đã viết sẵn ở dạng production, thả thẳng vào repo.

---

## Cách áp dụng — 4 bước, theo thứ tự

> **Không phải người viết code?** Đừng làm 4 bước này bằng tay — mở file **BAT DAU TU DAY.md**
> trong thư mục này, nó chỉ cách giao toàn bộ việc cho Claude Code.

### Bước 1 · Font (5 phút)
1. Tạo thư mục `fonts/` ở gốc repo (hiện chưa có — tạo mới), rồi copy `fonts/Baskerville-Regular.ttf` và `fonts/Baskerville-Italic.ttf` vào đó.
2. Copy `src/ui/fonts.css` vào `src/ui/`.
3. Sửa `<head>` của `index.html` theo `index-head-changes.html`.

Bộ chữ: **Barlow Semi Condensed** (tiêu đề & con số, luôn in hoa) + **Barlow** (body) +
**Baskerville BT** (câu dẫn, in nghiêng). Blauer Nue — font gốc brand — có sẵn đường dẫn
comment trong `fonts.css` nếu sau này muốn đổi; đã thử và chọn Barlow Semi Condensed
vì rõ hơn ở cỡ nhỏ trên mobile.

### Bước 2 · Token (10 phút) — đây là bước đổi diện mạo nhiều nhất
Thay **toàn bộ** `src/ui/theme.js` bằng file trong gói. Mọi key cũ (`bg1`, `bg2`, `txt1`,
`bdr`...) giữ nguyên tên, chỉ đổi giá trị → 20 màn hình hiện tại tự đổi màu, không sửa gì thêm.
File mới bổ sung: `BRAND`, `F` (font stack), `T` (preset chữ), `SPORT_COLOR`, `SHADOW`, `ACCENTS`.

### Bước 3 · Icon (30 phút) — bỏ hết emoji
Thêm `src/ui/sportIcons.js`. Sau đó thay mọi emoji bằng `<SportIcon k="..."/>`:

| Chỗ sửa | Cũ | Mới |
|---|---|---|
| `domain/activities.js` | field `emoji: '🏊'` | thêm `iconKey: 'swim'` cạnh nó (giữ `emoji` để không vỡ chỗ khác, xoá sau) |
| `screens/PickActivity.js` | `\${a.emoji}` | `<\${SportIcon} k=\${a.iconKey} size=\${20} color=\${sportColor(a.iconKey)}/>` |
| `screens/PostCard.js` | emoji môn + 🤍/💬 + 📏⏱⚡ | `SportIcon` với `k='heart'`, `'comment'`, `'bolt'` |
| `screens/FeedTab.js` | chip filter có emoji | `SportIcon` size 15 |
| `screens/LeaderboardTab.js` | 🥇🥈🥉 🏢 👥 | số hạng trong ô vuông bo góc (xem dưới) + `k='people'` |
| `app.js` HomeTab | 🔥 trong banner streak | `k='flame'`, màu `#FFD95C` |
| `app.js` CalendarTab | 🗑️ ⚙️ | `k='warn'`, icon bánh răng có trong `SPORT_PATHS` |
| `app.js` Celebrate | ✅ 🏆 | `k='check'`, `k='medal'` |

Ánh xạ `kind` → `iconKey`: strength→`gym`, run→`run`, walk→`walk`, bike→`bike`,
swim→`swim`, hike→`hike`, yoga→`yoga`, football/basketball→`ball`,
badminton/tennis/pickleball→`racket`, other→`other`.

### Bước 4 · Layout từng màn (phần lớn công việc)
Thay `src/ui/primitives.js` bằng file trong gói (giữ API cũ + thêm `Section`,
`StatStrip`, `Hero`, `Pill`), rồi sửa từng màn theo mục **Screens** dưới.

---

## Design Tokens

### Màu — palette Apollo Brand Book (tỉ lệ 40/20/16/8/8/8)
| Vai trò | Hex | Ghi chú |
|---|---|---|
| Apollo Blue | `#2576B9` | chủ đạo ~40% — khối streak, nút chính, tab active, số nhấn |
| Baby Blue | `#BCD9F2` | ~20% — mảng nền phụ, khối thông tin, viền avatar |
| Trắng | `#FFFFFF` | ~16% — nền thẻ |
| Yellow | `#FFD95C` | ~8% — CHỈ dùng cho việc gấp: cảnh báo mất streak, hạng 1, huy hiệu mới |
| Red | `#EB4754` | ~8% — tim, nút video, xoá tài khoản, lỗi thường gặp |
| Pink | `#EB9CC4` | ~8% — nhãn môn gym & yoga |

### Nền & khung
`#F2F6FA` nền màn · `#FFFFFF` thẻ · `#E7F1FB` tint nhấn · `#DDE8F2` viền thẻ · `#EDF3F9` vạch chia trong thẻ

### Chữ — thang 5 bậc
`#12395E` tiêu đề/số · `#5B7896` body phụ · `#7E9AB5` nhãn · `#94AABF` meta · `#B7C6D4` placeholder

### Trạng thái
xanh lá `#1F8A55` / nền `#E9F7EF` / viền `#BCE7D2` — set đã xong, "Đang diễn ra"
đỏ `#EB4754` / nền `#FDECEE` / viền `#F8C9CE` / chữ `#C22E3B`
vàng nền `#FFF6DA` / chữ `#C9A21B` · `#8A6D0F`
hồng nền `#FBEBF3`

### Màu theo môn (chấm lịch, nhãn, viền avatar)
gym/yoga `#EB9CC4` · chạy/đi bộ/bơi `#2576B9` · đạp xe `#7FB4DC` · bóng `#EB4754` · cầu lông/tennis/pickleball `#E7C24A` · leo núi/khác `#5B7896`

### Typography
| Cấp | Font | Cỡ / weight / letter-spacing |
|---|---|---|
| Tiêu đề màn | Barlow Semi Condensed 700 | 26px / .03em / **UPPERCASE** |
| Tiêu đề phụ | Barlow Semi Condensed 700 | 20–21px / .03em / UPPERCASE |
| Tiêu đề nhóm | Barlow Semi Condensed 700 | 14px / .1em / UPPERCASE |
| Số lớn (streak) | Barlow Semi Condensed 700 | 76px / line-height 1 |
| Số vừa (thống kê) | Barlow Semi Condensed 700 | 24–34px / line-height 1 |
| Số nhỏ (trong list) | Barlow Semi Condensed 700 | 15–19px |
| Nhãn ô nhập | Barlow 700 | 11px / .09em / UPPERCASE / `#94AABF` |
| Body | Barlow 400–600 | 13.5–15px / line-height 1.5 |
| Câu dẫn | Baskerville BT *italic* | 12–14px / line-height 1.6 / `#5B7896` |
| Tagline chân màn | Baskerville BT | 11px / .22em / UPPERCASE / `#B7C6D4` |

**Quy tắc:** Barlow Semi Condensed **luôn** in hoa + letter-spacing dương. Không bao giờ
dùng nó cho chữ thường. Baskerville chỉ cho câu dẫn dắt / ghi chú — không cho nhãn UI.

### Bo góc & đổ bóng
`9px` chip nhỏ · `12px` nút, ô nhập · `16px` khối phụ · `18px` thẻ (mặc định) · `20px` khối hero · `22px` pill · `50%` avatar
`card: 0 2px 8px rgba(18,57,94,.04)` · `raised: 0 4px 14px rgba(37,118,185,.12)` · `fab: 0 8px 20px rgba(37,118,185,.4)` · `float: 0 12px 30px rgba(18,57,94,.14)`

### Spacing
padding màn `16px` ngang · padding thẻ `14px 16px` · gap thẻ `10–12px` · gap nhóm `16–22px`
padding đáy vùng cuộn **`80px`** để không bị FAB đè.

---

## Screens

Mỗi màn dưới ghi: file cần sửa → thay đổi cụ thể. Đo chi tiết lấy trong prototype
(mở DevTools, inspect trực tiếp).

### 1. Đăng nhập — `src/screens/SignIn.js` (prototype 3a)
Nền trắng, 2 vòng tròn trang trí: `#BCD9F2` opacity .55 ở góc trên phải (280px, top -90 right -70),
`#E7F1FB` bên trái (220px, top 150 left -110). Logo: ô vuông 76px bo 24px nền `#2576B9`,
icon `run` trắng 38px. Wordmark "APOLLO / SPORT" — Semi Condensed 700, 52px, line-height .95,
màu `#2576B9`. Câu dẫn Baskerville 15px. Nút Google: trắng, viền `#DDE8F2`, bo 15px,
padding 15px, shadow `0 8px 24px rgba(37,118,185,.1)`, logo Google 4 màu gốc. Dưới nút:
"Chỉ dành cho tài khoản **@apollo.edu.vn**" 12.5px `#94AABF`.
Chân màn: `WHERE THE BEST BECOME BETTER` — Baskerville 11px, letter-spacing .22em, `#B7C6D4`
(tagline chính thức trong brand book, đặt nhẹ ở chân mọi ấn phẩm).

### 2. Onboarding — `src/screens/Onboarding.js` (prototype 3b)
Tiêu đề "CHÀO MỪNG / ĐẾN APOLLO SPORT" Semi Condensed 34px line-height 1.05.
3 ô nhập gộp trong **một** thẻ trắng, phân cách bằng `#EDF3F9` (không phải 3 thẻ rời).
Chọn môn: chip bọc dòng, chip đã chọn nền `#2576B9` chữ trắng, chưa chọn nền trắng viền `#DDE8F2`.
Khối riêng tư: nền `#BCD9F2` bo 16, icon `lock`, chữ Baskerville `#2E5A80`.
Nút BẮT ĐẦU dính đáy trong thanh trắng viền trên.

### 3. Trang chủ — `app.js` › HomeTab (prototype 2a) ★ đổi nhiều nhất
- **Bỏ** hero ảnh + nút Đăng xuất. Thay bằng thanh trên: wordmark "APOLLO SPORT"
  (Semi Condensed 700, 17px, .14em, `#2576B9`) + avatar 34px viền 2px `#2576B9`.
- **Khối streak** = nhân vật chính, nền `#2576B9` bo 20px:
  nhãn "CHUỖI LIÊN TIẾP" 12px .16em `#BCD9F2`; số **76px** Semi Condensed 700 trắng,
  chữ "NGÀY" 24px cạnh; icon `flame` 34px `#FFD95C` góc phải.
- **7 vạch tuần** trong khối streak: 7 cột gap 6px, mỗi cột nhãn T2…CN 10px `#BCD9F2`
  + vạch cao 5px bo 3px — có tập `#FFD95C`, không tập `rgba(255,255,255,.28)`.
- **Cảnh báo streak gộp vào trong khối streak** (không còn banner cam riêng ở đầu màn):
  dải `#FFD95C` bo 12px, icon `clock`, chữ 12.5px 600 `#12395E`,
  copy: "Còn 9 tiếng để giữ chuỗi — tập hôm nay nhé!"
- **3 thẻ trắng rời → 1 dải `StatStrip`**: Buổi tuần / Phút / Điểm, vách `#EDF3F9`, số 26px.
- **Thẻ mục tiêu tuần** (mới): tiêu đề nhóm + "14/3 buổi", thanh tiến độ cao 7px
  (nền `#E7F1FB`, fill `#2576B9`), câu Baskerville italic bên dưới.
- **"Gần đây"**: 3 thẻ rời → **1 thẻ** nhiều dòng, mỗi dòng: ô icon môn 34px bo 10px
  (tint theo môn) + tên + meta `#7E9AB5` + số nhấn `#2576B9` phải. Vạch chia `#EDF3F9`.
- FAB 58px `#2576B9`, icon `+` trắng stroke 2.2, bottom 80 right 18.
- Tab bar: icon 22px, nhãn Semi Condensed 11px .07em UPPERCASE, active `#2576B9` / thường `#9DB4C9`.
- **Padding đáy vùng cuộn 80px.**

### 4. Chọn môn — `src/screens/PickActivity.js` (prototype 2b)
Header có câu dẫn Baskerville. **Thêm nhóm "BẠN HAY TẬP"**: 3 ô lớn nền `#2576B9`,
icon trong ô `rgba(255,255,255,.18)` bo 12px, chữ trắng — lấy từ `user.favSports` hoặc
3 môn ghi nhiều nhất 30 ngày. Dưới là "TẤT CẢ MÔN" grid 3 cột, ô trắng viền `#DDE8F2` bo 16px,
icon trong ô tint theo môn.

### 5. Ghi buổi tập — `src/screens/LogActivity.js` (prototype 2c)
- Header: nút back + ô icon môn + tên môn Semi Condensed 20px + nút LƯU (in hoa Semi Condensed).
- Tiêu đề buổi tập = ô nhập lớn không viền, 20px 600, placeholder `#B7C6D4`.
- **Các ô số gộp vào 1 thẻ**, mỗi dòng: nhãn + hint trái, **số 30px Semi Condensed** phải.
  Cách này đọc nhanh hơn nhiều so với ô input viền đầy đủ.
- Giá trị tự tính (pace, km/h): chip `#E7F1FB` + icon `bolt`, không cho sửa.
- Địa điểm / cường độ: nút chia đều, chọn = nền `#2576B9` chữ trắng (không phải viền + tint).
- **MỚI — ô quy đổi điểm**: nền `#BCD9F2` bo 16px, "BUỔI NÀY ĐƯỢC" + công thức
  ("60 phút × cường độ vừa") Baskerville, số điểm 34px phải. Tính live từ MET × phút.
  *Mục đích: người dùng thấy công sức quy ra gì trước khi bấm Lưu.*
- Ô thêm ảnh: dashed `#C7D8E6` bo 18px, icon `photo`.
- **MỚI — chọn phạm vi**: 2 nút "Đồng nghiệp" (`globe`) / "Chỉ mình tôi" (`lock`).

### 6. Bảng tin — `src/screens/FeedTab.js` + `PostCard.js` (prototype 2d)
Header trắng có viền dưới, tiêu đề "BẢNG TIN" Semi Condensed 26px. Chip filter: active
nền `#E7F1FB` chữ + viền `#2576B9`; icon 15px thay emoji.
Thẻ bài: bo 18px padding `14px 16px`. Avatar 40px **viền 2px theo màu môn**.
Dòng đầu: tên **700** + hành động `#5B7896`. Meta 11px `#94AABF` gồm phòng ban · giờ
(+ "chuỗi N ngày" nếu có — tăng động lực).
Hàng số liệu dưới vạch `#EDF3F9`: số Semi Condensed 15px `#12395E` + đơn vị 12.5px `#7E9AB5`.
Tim & bình luận **dồn phải cùng hàng số liệu** (không còn 2 nút to chia đôi thẻ) —
icon `heart` `#EB4754`, `comment` `#2576B9`, kèm số đếm.

### 7. Xếp hạng — `src/screens/LeaderboardTab.js` (prototype 2e)
- Header nền `#2576B9`: tiêu đề 26px + câu dẫn Baskerville `#BCD9F2`
  ("Điểm quy đổi theo cường độ — công bằng giữa mọi môn.")
- Tab Toàn công ty / Phòng ban: track `rgba(255,255,255,.16)`, active nền trắng chữ `#2576B9`.
- Tuần / Tháng: **tab gạch chân** (không phải segmented thứ hai) — active chữ trắng 700
  + gạch dưới 2px `#FFD95C`. Sửa được 2 hàng segmented xếp chồng ở bản cũ.
- **Bục vinh danh top 3** ngay trong vùng xanh: 3 cột, cột giữa cao & rộng hơn (flex 1.15),
  hạng 1 có icon `crown` `#FFD95C` trên đầu + avatar 58px viền 3px `#FFD95C` + điểm 28px `#2576B9`;
  hạng 2 & 3 avatar 46px viền trắng, điểm 21px. Bục = nền trắng bo `12px 12px 0 0`,
  **chiều cao khác nhau** theo hạng (1: padding `13px 0 16px`, 2: `9px 0 12px`, 3: `7px 0 10px`).
- Hạng 4+ trong 1 thẻ trắng, mỗi dòng: số hạng 26px Semi Condensed + avatar 34px + tên + điểm 19px.
- Ghi chú cuối Baskerville 11.5px, canh giữa.

### 8. Cá nhân — `app.js` › CalendarTab (prototype 2f)
- **Header nền `#2576B9`**: avatar 56px viền 3px `#FFD95C` (khung theo cấp — xem F6),
  tên 17px 700, meta "`phòng ban` · hạng N tuần này" `#BCD9F2`, nút bánh răng
  `rgba(255,255,255,.18)`. 3 ô số liệu `rgba(255,255,255,.14)` bo 14px.
- 3 link CLB / Mục tiêu chung / Hướng dẫn: ô icon 38px bo 12px, tint riêng
  (`#E7F1FB` / `#FFF6DA` / `#FBEBF3`), chevron `#B7C6D4`.
- **Lịch**: ô ngày bo 11px, ngày có tập nền `#E7F1FB` chữ 700, hôm nay viền 1.5px `#2576B9`,
  **chấm 4px màu theo môn** dưới số ngày (nhiều môn = nhiều chấm).
- **MỚI — "PHÂN BỔ THEO MÔN · 90 ngày"**: mỗi môn 1 dòng = icon + tên + meta + điểm
  + thanh ngang màu theo môn (chuẩn hoá theo môn cao nhất = 100%).
  *Gộp từ 2 thẻ rời ở bản cũ, và trả lời được câu "mình đang nghiêng về môn nào".*
- **Cân nặng**: số 34px + sparkline 8 cột `#BCD9F2` + nút "Ghi". Nhãn ghi rõ
  "· chỉ mình bạn thấy". **Bỏ** nút "Xoá lịch sử" khỏi màn này → chuyển vào Cài đặt.
- **Padding đáy 80px.**

### 9. Câu lạc bộ (prototype 2g)
Header `#2576B9`: ô icon 56px bo 16px nền `#FFD95C` (icon môn màu `#12395E`),
tên CLB Semi Condensed 24px, meta, chồng avatar (margin-left -10px, viền 2px màu nền).
Thẻ mục tiêu nhóm: badge "Đang diễn ra" `#E9F7EF`/`#1F8A55`, số lớn 34px + "/1.000 km"
+ % phải, thanh 9px, rồi khối "GÓP NHIỀU NHẤT" (avatar + tên + thanh + số).
Thông báo chủ nhóm: dải `#BCD9F2` + icon `bell`.

### 10. Mục tiêu chung (prototype 2h)
Khối giải thích `#BCD9F2` đặt trên cùng (Baskerville) — nói rõ "tự động góp, không xếp hạng".
Thẻ chính bo 20px shadow `raised`: badge trạng thái + khoảng ngày, tên mục tiêu
Semi Condensed 26px 2 dòng, **vòng tiến độ 96px** (track `#EDF3F9`, fill `#2576B9` stroke 10,
stroke-linecap round, rotate -90) + 2 số bên phải, rồi "GÓP NHIỀU NHẤT".

### 11. Chúc mừng — `app.js` › Celebrate (prototype 2i)
Full-screen nền `#2576B9`. 14 mảnh confetti 8×12px bo 2px, màu luân phiên
`#FFD95C`/`#BCD9F2`/`#EB9CC4`/trắng/`#EB4754`, rải trong 24% trên màn, rotate lệch nhau.
Vòng 96px `#FFD95C` + `check` `#12395E` 46px stroke 2.4. Tiêu đề "XONG BUỔI / ĐẠP XE!"
Semi Condensed **46px** line-height 1. Câu Baskerville `#BCD9F2`.
3 ô số liệu `rgba(255,255,255,.14)` bo 16px. Nếu có huy hiệu mới: dải `#FFD95C` + icon `medal`.
2 nút: **"CHIA SẺ LÊN BẢNG TIN"** nền trắng chữ `#2576B9` (đẩy tương tác — nút chính)
+ "Để sau" dạng text `#BCD9F2`.

### 12. Đang tập gym — `app.js` › ActiveWorkout (prototype 3c)
- Header `#2576B9` (dễ đọc ngoài nắng): tên program 11px `#BCD9F2` + tên buổi 22px;
  đồng hồ 28px `font-variant-numeric: tabular-nums` + volume; hàng dưới: preset nghỉ
  (60s/90s/2:00/3:00 — active nền trắng chữ `#2576B9`) + nút Huỷ / "✓ Xong" `#FFD95C`.
  **Cả 6 chip phải có `white-space: nowrap`.**
- Mỗi bài tập = 1 thẻ trắng: ô icon + tên **`#2576B9` 15px 700** + "Lần trước: …" `#94AABF`
  + nút "Hướng dẫn" (mở kho hướng dẫn đúng bài).
- Grid set `22px 1fr 1fr 54px 42px` gap 8px, header cột KG/REPS/RPE 10px `#B7C6D4`.
  Ô nhập bo 12px, cao `11px` padding dọc, **15px 600 canh giữa** (bản cũ chữ nhỏ, khó bấm khi mỏi).
  Set xong: nền `#E9F7EF` chữ `#1F8A55` viền `#BCE7D2`, nút ✓ 42px cùng tint.
- **Đồng hồ nghỉ nổi** đáy màn: nền `rgba(255,255,255,.96)` bo 18px shadow `float`,
  **vòng đếm ngược 54px** (track `#EDF3F9`, fill `#2576B9` stroke 5, rotate -90) + số giây giữa vòng,
  "THỜI GIAN NGHỈ" + "Tiếp tục sau 1:02", nút −15s / +15s.

### 13. Kho hướng dẫn — `src/screens/GuidesScreen.js` (prototype 3d)
Nhóm theo môn: ô icon 28px bo 9px + tên môn Semi Condensed 15px .08em.
Thẻ bài: tên 15px 700 + badge cấp độ (`#E7F1FB`/`#2576B9`, **`nowrap`**) + mô tả 12.5px `#7E9AB5`.

### 14. Hướng dẫn chi tiết — `src/screens/GuideDetail.js` (prototype 3e)
Badge cấp độ → tiêu đề Semi Condensed 30px → mô tả Baskerville 14px → chip nhóm cơ / dụng cụ.
**Nút video nền `#EB4754`** (đỏ Apollo, không dùng đỏ YouTube) + icon `video` + icon link ngoài.
Ảnh minh hoạ 150px bo 18px — khi chưa có ảnh dùng ô kẻ sọc `#E7F1FB`/`#DDEAF7` 135°.
Các bước: số trong vòng tròn 26px `#2576B9` chữ trắng + nội dung 14px line-height 1.6.
"LỖI THƯỜNG GẶP" nền `#FDECEE` viền `#F8C9CE` chữ `#8C2A34`, tiêu đề `#C22E3B`.
"MẸO" nền `#FFF6DA` chữ `#6B5510`, tiêu đề `#8A6D0F`. Cuối: dòng credit free-exercise-db 11px.

### 15. Cài đặt — `src/screens/Settings.js` (prototype 3f)
4 nhóm có tiêu đề: HỒ SƠ (3 ô trong 1 thẻ + nút Lưu) · QUYỀN RIÊNG TƯ (3 toggle) ·
CHUỖI TẬP (tính lại) · TÀI KHOẢN (đăng xuất / xoá).
Toggle 46×28px bo 14px, bật `#2576B9` núm phải (left 21px), tắt `#C4D3E0` núm trái (left 3px),
núm 22px trắng shadow `0 1px 3px rgba(0,0,0,.2)`.
"Xoá tài khoản" chữ `#EB4754` + icon `warn` + mô tả rõ hậu quả.
Chân màn: dòng Baskerville trấn an về quyền riêng tư cân nặng.

---

## Interactions & Behavior
Giữ nguyên toàn bộ hành vi hiện có. Bổ sung / điều chỉnh:
- **Điểm live** ở màn ghi buổi tập: recompute mỗi lần đổi phút hoặc cường độ.
- **Chia sẻ lên bảng tin** ở màn Chúc mừng: post buổi tập vừa lưu lên feed.
- **Nhấn giữ** `.btn-action:active { transform: scale(.96) }` — giữ nguyên.
- Confetti: giữ `confettiFall 2.8s linear`.
- **Không thêm animation mới.** Trên mobile Việt Nam nhiều máy tầm trung, ưu tiên mượt.

## State Management
Không phát sinh state mới ngoài:
- `sharePending` (bool) ở Celebrate — đã chia sẻ lên feed chưa.
- `visibility` ('team' | 'private') ở LogActivity — nếu quyết định làm phạm vi từng buổi;
  cần thêm field `visibility` vào doc workout + cập nhật Firestore rules & query feed.
  **Nếu chưa muốn mở rộng data model thì bỏ 2 nút này, các phần khác không phụ thuộc.**

## Assets
- **Font**: Barlow + Barlow Semi Condensed (Google Fonts, CDN) · Baskerville BT (2 file .ttf, kèm trong gói) · Blauer Nue .otf (bạn đã gửi, chưa dùng — có sẵn đường dẫn comment).
- **Icon**: toàn bộ tự vẽ trong `src/ui/sportIcons.js`, không phụ thuộc thư viện ngoài. Không cần asset ảnh.
- **Ảnh minh hoạ bài tập**: giữ nguồn free-exercise-db (public domain) như hiện tại.
- **Ảnh `workout_hero.png` không còn dùng** — hero ảnh ở Trang chủ đã bị thay bằng khối streak.

## Files
| Trong gói | Đích trong repo | Việc |
|---|---|---|
| `src/ui/theme.js` | `src/ui/theme.js` | **thay toàn bộ** |
| `src/ui/primitives.js` | `src/ui/primitives.js` | **thay toàn bộ** |
| `src/ui/sportIcons.js` | `src/ui/sportIcons.js` | thêm mới |
| `src/ui/fonts.css` | `src/ui/fonts.css` | thêm mới |
| `fonts/*.ttf` | `fonts/` | copy |
| `index-head-changes.html` | — | hướng dẫn sửa `<head>` |
| `Apollo Sport.dc.html` | — | thiết kế tham chiếu, mở bằng browser |

## Chưa có trong đợt này
**F6 — Bảng vinh danh + huy hiệu cấp độ + khung viền avatar theo cấp.** Chỗ cắm đã chuẩn bị:
avatar ở header Cá nhân đã có viền `#FFD95C`, hạng 1 trên bục cũng vậy. Cần chốt hệ cấp độ
có mấy bậc và mốc điểm mỗi bậc thì mới thiết kế được bộ khung viền.
