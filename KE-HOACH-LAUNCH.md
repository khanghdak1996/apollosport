# Kế hoạch launch Apollo Sport — từ test thân quen đến toàn công ty

> Cập nhật: 2026-08-03. Bối cảnh: app do 1 người tự làm ngoài giờ, chưa có phòng ban nào chính thức biết/đứng tên. Đang ở **Phase 1** (đã gửi cho nhóm thân quen test).

## TL;DR

Hướng bạn hình dung — **alpha nhỏ → bàn giao Internal Comms → review → launch toàn công ty → feedback** — về cơ bản đúng, đó chính xác là mô hình rollout chuẩn (closed alpha → stakeholder buy-in → broad launch → iterate). Cập nhật 2026-08-03 — 3 việc đặt ra ban đầu, tình trạng hiện tại:

1. **Đóng gói app thành đề xuất cho Internal Comms** — xem file `DE-XUAT-INTERNAL-COMMS.md` (vừa soạn xong, sẵn để gửi/trình bày).
2. **Rà 2 giới hạn hạ tầng** — Firebase billing ✅ ổn (Blaze + budget alert). OAuth consent Google ⚠️ cần sửa 2 điểm trước khi launch rộng (chi tiết ở Phase 3).
3. **Chốt owner lâu dài** — đã chốt: **Internal Comms sẽ là chủ sở hữu chính thức** khi launch toàn công ty; **bạn (Khang) giữ vai trò product support** (người hiểu app nhất, hỗ trợ kỹ thuật/vận hành). Cần nói rõ điều này với Internal Comms ngay từ Phase 2 — đừng để mặc định họ nghĩ bạn tiếp tục ôm hết một mình.

Chi tiết từng phase ở dưới.

---

## Tổng quan lộ trình

| Phase | Tên | Ai chủ trì | Trạng thái |
|---|---|---|---|
| 1 | Closed alpha — nhóm thân quen | Bạn | **Đang chạy** |
| 2 | Đóng gói & bàn giao cho Internal Comms | Bạn | Kế tiếp |
| 3 | Dọn kỹ thuật launch-readiness | Bạn | Làm song song Phase 2 |
| 4 | Internal Comms review & duyệt | Internal Comms | Chờ Phase 2 xong |
| 5 | Lên kế hoạch launch toàn công ty | Internal Comms (bạn hỗ trợ kỹ thuật) | Chờ Phase 4 |
| 6 | Launch day & hypercare | Cả hai | Chờ Phase 5 |
| 7 | Feedback loop & bảo trì lâu dài | Cần chốt owner | Sau launch |

---

## Phase 1 — Closed alpha (đang chạy)

**Mục tiêu:** tìm bug ở luồng chính, xác nhận app dùng được thật (không chỉ chạy được), thu cảm nhận thô.

**Việc cần làm:**
- Theo dõi feedback trực tiếp từ nhóm test (đã có file `THONG-BAO-TEST-NOI-BO.md`).
- Sửa nhanh các lỗi chặn luồng (đăng nhập, ghi buổi tập, bảng tin).
- Ghi lại feedback lặp lại nhiều lần — đây sẽ là bằng chứng thuyết phục Internal Comms ở Phase 2 ("đã có N người test, phản hồi tích cực").

**Exit criteria (đủ điều kiện qua Phase 2):**
- Không còn crash / lỗi chặn luồng chính.
- Ít nhất vài người dùng thật sự quay lại dùng nhiều lần (không chỉ mở thử 1 lần rồi bỏ).
- Bạn tự tin về giá trị cốt lõi của app (không cần hoàn hảo).

**Thời gian gợi ý:** 1–2 tuần.

---

## Phase 2 — Đóng gói & bàn giao cho Internal Comms

Đây là bước dễ bị đánh giá thấp nhất. Internal Comms không tự nhiên hiểu app của bạn — họ cần một **đề xuất gọn, trả lời trước các câu họ sẽ hỏi**, thay vì bạn ngồi giải thích miệng.

> ✅ Đã soạn sẵn: `DE-XUAT-INTERNAL-COMMS.md` — file "đóng gói" theo đúng cấu trúc dưới đây, sẵn để gửi hoặc dùng làm sườn demo trực tiếp.

**Chuẩn bị 1 tài liệu/one-pager ngắn gồm:**
- App là gì, giải quyết vấn đề gì (đồng nghiệp giữ thói quen vận động, gắn kết team).
- Đã test với ai, bao lâu, kết quả/phản hồi thế nào (lấy từ Phase 1).
- Tính năng chính (ghi buổi tập, bảng tin, xếp hạng, CLB, mục tiêu chung, trợ lý AI).
- **Dữ liệu thu thập gì** — đây gần như chắc chắn Internal Comms/HR sẽ hỏi: buổi tập, ảnh, cân nặng/số đo (riêng tư), tương tác xã hội. Nói rõ cân nặng luôn private, có tuỳ chọn ẩn khỏi bảng xếp hạng.
- **Chi phí vận hành hiện tại & dự kiến khi scale**: Vercel, Firebase, OpenAI API — ai đang trả, có cần công ty duyệt ngân sách không.
- **Bạn đang đứng vai trò gì** — người tự làm ngoài giờ, không phải dự án được giao — nói thẳng luôn, tránh hiểu lầm sau này về trách nhiệm/ownership.
- Đề xuất rõ: bạn muốn Internal Comms làm gì (review nội dung/thương hiệu? duyệt launch? giới thiệu thêm cho IT Security/HR?).

**Gợi ý thêm:** xin 1 buổi demo trực tiếp 15-20 phút thay vì chỉ gửi tài liệu — dự án tự phát thường thuyết phục hơn nhiều khi người ta thấy app chạy thật.

**Exit criteria:** Internal Comms hiểu rõ app, biết bước tiếp theo là gì (tự duyệt, hay kéo thêm IT/HR/Legal vào).

---

## Phase 3 — Dọn kỹ thuật launch-readiness (làm song song Phase 2)

Làm trước hoặc trong lúc chờ Internal Comms, để khi họ hỏi/duyệt thì bạn đã sẵn sàng, không bị động.

**Việc bắt buộc trước khi mở rộng ra nhiều người hơn nhóm thân quen:**

- [x] **Firebase billing** — đã xác nhận đang ở gói **Blaze (pay-as-you-go)**, có sẵn 1 budget alert. Không cần làm gì thêm cho mục này. *(kiểm tra 2026-08-03)*
- [x] **OAuth consent screen của Google** — đã sửa xong 2026-08-03: đổi **User type từ External → Internal** (chỉ user Google Workspace `apollo.edu.vn` đăng nhập được, không giới hạn số user, không cần Google verify app) và đổi **App name từ `project-368506443580` → "Apollo Sport"** (nhân viên sẽ thấy đúng tên app khi đăng nhập, không còn tên ID lạ).
- [ ] **Đặt usage/budget limit cho OpenAI API** (đã ghi trong `THONG-BAO-TEST-NOI-BO.md`) — quan trọng hơn nữa khi số người dùng tăng.
- [ ] Rà lại `firestore.rules` / `storage.rules` lần cuối (đã kiểm tra sơ bộ — khoá theo domain + quyền sở hữu khá chặt, nhưng đáng để nhìn lại sau khi có feedback thật từ Phase 1).
- [ ] Xác nhận đăng nhập PWA trên iOS ổn định (mục còn tồn trong `HANDOFF.md`).

**Nên làm nếu có thời gian (không chặn launch):**
- [ ] Calibrate `GYM_K` để điểm gym công bằng hơn với cardio.
- [ ] Dọn dead code (`data/cloud.js`, export thừa) — không ảnh hưởng người dùng, chỉ giúp bảo trì dễ hơn.
- [ ] Icon PWA đẹp hơn (hiện là logo nền trắng).

**Exit criteria:** tất cả mục "bắt buộc" ở trên đã xong hoặc có kế hoạch rõ ràng để xong trước Phase 6.

---

## Phase 4 — Internal Comms review & duyệt

**Việc của họ (bạn hỗ trợ khi được hỏi):**
- Xem xét nội dung, thương hiệu, tên gọi có cần chỉnh không.
- Quyết định có cần kéo thêm bên nào vào (IT Security duyệt hạ tầng, HR vì liên quan dữ liệu nhân viên, Legal nếu công ty có quy định riêng về app nội bộ/dữ liệu cá nhân).
- **Owner đã đề xuất: Internal Comms sở hữu chính thức, bạn giữ vai trò product support.** Cần thống nhất với họ cụ thể việc này kéo theo gì — ví dụ tài khoản hạ tầng (GitHub, Vercel, Firebase) hiện đứng tên cá nhân bạn, có cần chuyển quyền quản trị/thêm Internal Comms làm co-owner không, để tránh rủi ro "một người nghỉ là mất quyền truy cập".

**Exit criteria:** có "đèn xanh" chính thức + biết rõ ai launch, launch như thế nào.

---

## Phase 5 — Lên kế hoạch launch toàn công ty

Do Internal Comms chủ trì (họ có kinh nghiệm truyền thông nội bộ), bạn hỗ trợ phần kỹ thuật/nội dung sản phẩm. Các quyết định cần thống nhất:

- **Launch 1 lần hay theo đợt** (ví dụ theo phòng ban, để tránh tải đột ngột và dễ xử lý bug theo từng nhóm nhỏ).
- **Kênh thông báo**: email công ty, Slack/Teams, bảng tin nội bộ, có cần poster/video ngắn không.
- **Có nên gắn 1 sự kiện/thử thách ra mắt** (vd "thử thách 30 ngày vận động") để tăng tỷ lệ dùng thật thay vì chỉ tải về rồi quên — nhiều app nội bộ chết vì launch xong không ai quay lại.
- **Kênh support/báo lỗi chính thức** khi launch rộng (không thể xử lý feedback thủ công qua tin nhắn cá nhân như giai đoạn alpha nữa).
- Đảm bảo Phase 3 đã xong hết (đặc biệt OAuth mode + Firebase billing) trước khi chốt ngày launch.

**Exit criteria:** có ngày launch cụ thể, kênh thông báo, kênh support đã sẵn sàng.

---

## Phase 6 — Launch day & hypercare

- Theo dõi sát 1–2 tuần đầu: lỗi phát sinh, tải hệ thống, chi phí OpenAI/Firebase có tăng bất thường không.
- Phản hồi nhanh các lỗi nghiêm trọng — uy tín ban đầu quyết định nhiều đến việc mọi người có quay lại dùng tiếp hay không.
- Theo dõi số liệu dùng thực tế (bao nhiêu người đăng nhập, bao nhiêu người log buổi tập, tỷ lệ quay lại).

---

## Phase 7 — Feedback loop & bảo trì lâu dài

- Khảo sát ngắn sau 2–4 tuần dùng thật (không chỉ chờ người ta chủ động góp ý).
- Gộp feedback + các mục "còn tồn" trong `HANDOFF.md` thành roadmap cải tiến.
- **Mô hình bảo trì đã định hướng**: Internal Comms sở hữu, bạn là product support kỹ thuật. Vẫn nên chốt cụ thể với họ ở Phase 4: bạn support bao nhiêu thời gian/tuần là hợp lý, có được công nhận chính thức (không phải "ngoài giờ vô hạn") không — tránh việc dự án "thành công quá" lại dồn hết tải lên một mình bạn dù đã có owner khác trên danh nghĩa.

---

## Việc cần chuẩn bị trả lời khi làm việc với Internal Comms

- App thu thập dữ liệu gì, ai xem được, có riêng tư không?
- Ai chịu trách nhiệm nếu có sự cố (mất dữ liệu, lộ thông tin)?
- Chi phí vận hành bao nhiêu, ai trả, có cần ngân sách công ty không?
- Có bắt buộc dùng không, hay tự nguyện?
- Nếu bạn nghỉ/bận, ai duy trì app?
