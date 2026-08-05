# Đề xuất giới thiệu Apollo Sport — gửi Internal Comms

**Người chuẩn bị:** Khang Hoàng (khang.hoangdanganh@apollo.edu.vn)
**Ngày:** 2026-08-03
**Trạng thái hiện tại:** đang test nội bộ với một nhóm nhỏ thân quen. Gửi tài liệu này để Internal Comms nắm bối cảnh và cho ý kiến về bước tiếp theo.

> Đây là bản nháp — các chỗ `[điền ...]` cần bạn tự điền số liệu/quyết định trước khi gửi.

---

## Tóm tắt trong 30 giây

**Apollo Sport** là một PWA (web app cài như app) do mình tự làm ngoài giờ, giúp đồng nghiệp ghi lại buổi tập, chia sẻ lên bảng tin nội bộ, giữ chuỗi thói quen, thi đua bảng xếp hạng theo phòng ban, lập CLB theo môn thể thao. Đăng nhập khoá theo email công ty (`@apollo.edu.vn`). Đang test với nhóm nhỏ, kết quả bước đầu tích cực — muốn xin ý kiến Internal Comms về việc mở rộng ra toàn công ty.

---

## 1. Vấn đề & bối cảnh

- Công ty chưa có công cụ nào khuyến khích nhân viên vận động và tạo kết nối xã hội quanh việc tập luyện.
- Mình tự làm dự án này ngoài giờ (không phải công việc được giao), xuất phát từ nhu cầu cá nhân, sau đó mở rộng thành công cụ dùng chung.
- Hiện tại **toàn bộ hạ tầng (GitHub, Vercel, Firebase) đứng tên cá nhân mình** — nói rõ để tránh hiểu lầm về quyền sở hữu khi bàn bước tiếp theo.

## 2. Đã test đến đâu

- Đang ở giai đoạn đầu: test với **4–5 đồng nghiệp thân quen**, mới bắt đầu nên **chưa có tổng hợp feedback chính thức**.
- Chưa ghi nhận lỗi nghiêm trọng nào chặn luồng dùng chính.
- Mục đích gửi tài liệu này ở giai đoạn sớm là để xin định hướng của Internal Comms trước, tránh mở rộng test/đầu tư thêm công sức theo hướng không phù hợp.

## 3. Tính năng chính

- **Ghi buổi tập đa môn**: gym (chương trình + set), chạy/đi bộ/đạp/bơi/leo núi, yoga, các môn bóng — mỗi môn quy đổi ra điểm chung để so sánh công bằng.
- **Bảng tin công ty**: đăng bài, thả tim, bình luận.
- **Chuỗi ngày (streak) + huy hiệu + màn mừng** — tạo động lực duy trì thói quen.
- **Bảng xếp hạng** theo công ty/phòng ban (tuần & tháng).
- **Câu lạc bộ** theo môn/sở thích, mời thành viên, feed riêng.
- **Mục tiêu chung** — cả nhóm/công ty cùng góp về một con số (không đối đầu).
- **Kho hướng dẫn** tập luyện từng môn (ảnh + video + dịch tiếng Việt).
- **Trợ lý AI** tư vấn tập luyện & dinh dưỡng (chat popup).

## 4. Dữ liệu thu thập & quyền riêng tư

- Chỉ đăng nhập được bằng email `@apollo.edu.vn` (khoá cứng ở cả tầng ứng dụng lẫn tầng bảo mật server).
- Dữ liệu thu thập: buổi tập (thời lượng, loại môn), ảnh đính kèm (tuỳ chọn), tương tác xã hội (like/comment). **Cân nặng/số đo cơ thể luôn ở chế độ riêng tư**, người dùng có thể ẩn khỏi bảng xếp hạng, và tự xoá tài khoản bất cứ lúc nào.
- Đã rà bảo mật Firestore/Storage rules: khoá theo domain công ty + quyền sở hữu dữ liệu (người khác không đọc/sửa được dữ liệu riêng tư của người khác).
- Trợ lý AI không lưu lịch sử chat lâu dài (chỉ trong phiên làm việc).

## 5. Hạ tầng & chi phí hiện tại

| Hạng mục | Hiện trạng | Ai đang trả |
|---|---|---|
| Hosting (Vercel) | `[điền: free/paid plan]` | Khang (cá nhân) |
| Firebase (Auth/Firestore/Storage) | Gói Blaze (trả theo dùng), đã bật budget alert | Khang (cá nhân) |
| Trợ lý AI (OpenAI API) | Đang dùng, **chưa đặt giới hạn ngân sách chính thức** | Khang (cá nhân) |

→ Hiện tại **toàn bộ chi phí đang do mình (Khang) tự trả**. Ở quy mô 4-5 người test thì không đáng kể, nhưng nếu launch toàn công ty thì cần công ty/Internal Comms xác nhận có nhận chuyển thành ngân sách chính thức không — đặc biệt OpenAI vì chi phí tăng theo số người dùng chatbot. Con số chi phí cụ thể sẽ cập nhật sau.

## 6. Vai trò & đề xuất sở hữu

- **Mình (Khang)**: người xây dựng app, đề xuất giữ vai trò **product support** — hỗ trợ kỹ thuật, sửa lỗi, vận hành hạ tầng.
- **Đề xuất Internal Comms là chủ sở hữu chính thức** khi app launch ra toàn công ty — phụ trách truyền thông, quyết định phạm vi/thời điểm launch, là đầu mối nếu cần kéo thêm IT Security/HR/Legal vào review.
- Cần bàn thêm: có nên thêm Internal Comms làm co-owner ở các tài khoản hạ tầng (Firebase/Vercel/GitHub) để tránh rủi ro phụ thuộc vào một người không.

## 7. Mình cần gì từ Internal Comms

1. Xem qua app (đề xuất demo trực tiếp 15–20 phút thay vì chỉ đọc tài liệu).
2. Cho ý kiến: có nên launch ra toàn công ty không, và có cần kéo thêm bên nào vào review (IT Security, HR, Legal)?
3. Nếu đồng ý, cùng lên kế hoạch launch cụ thể (thời điểm, kênh thông báo, có gắn sự kiện ra mắt không) — mình có sẵn kế hoạch chi tiết theo từng giai đoạn (`KE-HOACH-LAUNCH.md`) để tham khảo.

## 8. Câu hỏi mở cần Internal Comms quyết định

- App có bắt buộc dùng không, hay hoàn toàn tự nguyện?
- Có cần thông báo/xin phép gì thêm về việc thu thập dữ liệu nhân viên không (theo quy định nội bộ công ty)?
- Ngân sách vận hành (Firebase, OpenAI) nên được duyệt/theo dõi ở đâu?
