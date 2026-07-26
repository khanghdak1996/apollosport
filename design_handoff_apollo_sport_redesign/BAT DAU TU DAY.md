# BẮT ĐẦU TỪ ĐÂY

Bạn **không cần tự copy file nào**. Làm đúng 3 việc dưới, Claude Code lo phần còn lại.

---

## Việc 1 — Đặt thư mục này vào trong repo

Giải nén file zip ra, bạn sẽ được một thư mục tên:

    design_handoff_apollo_sport_redesign

Kéo **cả thư mục đó** vào thư mục gốc của repo — tức là chỗ đang có file `index.html`
và thư mục `src`. Sau khi kéo xong, repo của bạn trông như thế này:

    gymgym-main/
    ├── index.html
    ├── src/
    ├── firebase/
    └── design_handoff_apollo_sport_redesign/   ← vừa thêm vào

Chỉ cần kéo vào là xong. Không mở, không sửa gì bên trong.

---

## Việc 2 — Mở Claude Code ở đúng thư mục repo

Mở Terminal, `cd` vào thư mục repo rồi chạy `claude`:

    cd đường/dẫn/tới/gymgym-main
    claude

> Mẹo: không cần tự gõ đường dẫn. Gõ `cd ` (có dấu cách ở cuối), rồi **kéo thư mục
> repo từ Finder/Explorer thả vào cửa sổ Terminal** — đường dẫn tự hiện ra. Bấm Enter.

---

## Việc 3 — Dán nguyên đoạn dưới đây vào Claude Code

Copy toàn bộ khối này, dán vào Claude Code, bấm Enter:

```
Trong repo này có thư mục design_handoff_apollo_sport_redesign/ — đây là bộ bàn giao
thiết kế lại giao diện cho app Apollo Sport.

Hãy làm theo thứ tự sau:

1. Tạo nhánh git mới tên "redesign" trước khi sửa bất cứ gì.
2. Đọc design_handoff_apollo_sport_redesign/README.md từ đầu đến cuối trước khi sửa gì.
3. Thực hiện Bước 1 đến Bước 3 trong README (font, design token, bộ icon). Lưu ý:
   - Thư mục fonts/ ở gốc repo hiện CHƯA CÓ, hãy tự tạo mới.
   - Nếu đường dẫn font trong fonts.css không khớp với cách repo này serve file tĩnh,
     hãy tự sửa đường dẫn cho đúng.
4. Sau khi xong Bước 1–3, DỪNG LẠI và báo tôi. Tôi sẽ mở app kiểm tra màu và font
   trước khi đi tiếp.
5. Khi tôi xác nhận ổn, làm tiếp Bước 4 — sửa layout từng màn theo mục "Screens"
   trong README. Làm TỪNG MÀN MỘT, mỗi màn xong thì báo tôi kiểm tra rồi mới sang màn kế.
   Thứ tự: Trang chủ → Bảng tin → Xếp hạng → Cá nhân → Ghi buổi tập → các màn còn lại.

Nguyên tắc bắt buộc:
- CHỈ đổi phần hiển thị. Không đổi data model, không đổi Firestore rules, không đổi
  cách tính điểm MET, không đổi luồng điều hướng 4 tab.
- Giữ nguyên toàn bộ chữ tiếng Việt hiện có, trừ những chỗ README ghi rõ nội dung mới.
- Repo này KHÔNG có build step (Preact + htm qua importmap). Không thêm npm package,
  không thêm bundler, không đổi sang JSX.
- File "Apollo Sport.dc.html" trong thư mục bàn giao là bản thiết kế tham chiếu.
  Trong đó có 4 khối: CHỈ làm theo turn 2 và turn 3. Turn 0 là giao diện cũ, turn 1 là
  bản nháp — bỏ qua cả hai.
- Nếu có chỗ nào trong README mâu thuẫn với code thực tế, hỏi tôi thay vì tự đoán.

Bắt đầu bằng việc đọc README và tóm tắt lại cho tôi bạn định làm gì.
```

---

## Vài điều nên biết trước

**Việc này không làm một lần là xong.** Bước 1–3 nhanh (khoảng 30–45 phút) và đổi diện mạo
rõ rệt ngay: toàn bộ màu sang xanh Apollo, chữ sang bộ font brand, emoji biến thành icon
vẽ riêng. Bước 4 (sửa layout từng màn) là phần dài — làm rải ra nhiều buổi, mỗi buổi 1–2 màn.

**Nếu Claude Code làm sai màn nào**, cứ nói thẳng bằng tiếng Việt, ví dụ:
"màn Trang chủ khối streak chưa đủ to, xem lại mục 3. Trang chủ trong README".
README có ghi số đo cụ thể nên nó sửa được.

**Muốn xem thiết kế đích trông thế nào**: mở file "Apollo Sport.dc.html" bằng browser
(kéo file vào cửa sổ Chrome). Cuộn tới khối ghi **turn 2** — đó là bản chốt.

**Nếu không thích kết quả**: vì đã làm trên nhánh riêng, nói với Claude Code
"quay lại nhánh main" là mọi thứ trở về như cũ.
