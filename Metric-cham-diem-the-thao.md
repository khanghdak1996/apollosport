# Đề xuất Metric chấm điểm thể thao cho phong trào tập luyện

*Phạm vi: chạy bộ/đi bộ/đạp xe, gym/tập tạ, yoga/thể dục nhẹ — nhập liệu 100% thủ công, dùng cho leaderboard nội bộ.*

## TL;DR

Thay "Nhẹ/Vừa/Nặng" mơ hồ bằng **hai lớp dữ liệu người dùng có thể tự trả lời chính xác**: (1) một **mốc đo được** riêng cho từng môn (pace, tốc độ, mức tạ...) để suy ra MET, và (2) thang **RPE (Borg CR-10, thang 1–10 "How was your workout?")** kèm neo mô tả rõ + talk test để chấm cường độ cảm nhận. Điểm cuối = **MET-phút** (chuẩn khoa học, công bằng giữa các môn) đối chiếu với RPE để chống khai gian.

## 1. Vì sao "Nhẹ/Vừa/Nặng" hiện tại có vấn đề

"Nhẹ/Vừa/Nặng" không neo vào bất cứ điều gì người dùng cảm nhận được cụ thể — mỗi người hiểu "Nặng" khác nhau, và nó không cho phép so sánh công bằng giữa chạy bộ, gym, yoga. Câu hỏi kiểu "nhịp tim trung bình bao nhiêu" thất bại vì không ai đeo máy đo, nhưng câu hỏi **"bạn chạy tốc độ khoảng bao nhiêu"** hoặc **"bạn có thể nói chuyện được không khi tập"** thì ai cũng trả lời được ngay lập tức.

## 2. Hai nền tảng khoa học dùng làm gốc

**MET (Metabolic Equivalent of Task)** — *Compendium of Physical Activities* (bản cập nhật 2024, ~1.114 hoạt động) gán một hệ số tiêu hao năng lượng cụ thể cho từng hoạt động *theo mức độ đo được* (tốc độ, loại bài tập), không phải theo cảm tính. Đây cũng là nền tảng WHO và bảng hỏi IPAQ dùng để tính khối lượng vận động: 1 phút vận động ở mức 8 MET ≈ 2 phút ở mức 4 MET. WHO khuyến nghị 600–1500+ MET-phút/tuần là mức "đạt chuẩn" đến "cao".

**Session-RPE (phương pháp Foster)** — người tập tự chấm cường độ toàn buổi tập trên thang Borg CR-10 (0–10) ngay sau khi tập, nhân với thời lượng (phút) ra "training load". Đây là phương pháp được kiểm chứng rộng rãi trong khoa học thể thao như một cách thay thế hợp lệ cho máy đo nhịp tim, và đặc biệt phù hợp cho *sức mạnh/kháng lực* nơi MET kém chính xác.

Hai phương pháp này **bù trừ cho nhau**: MET khách quan nhưng cứng nhắc theo môn; RPE chủ quan nhưng công bằng theo nỗ lực cá nhân (người mới tập đi bộ nhanh ở RPE 6 nên được ghi nhận ngang người giỏi chạy ở RPE 6).

## 3. Thang RPE chuẩn hoá (thay cho Nhẹ/Vừa/Nặng)

Hiển thị cho người dùng bảng này ngay khi họ chọn mức độ, kèm câu hỏi tự kiểm tra bằng "talk test" (dựa theo hướng dẫn ACSM):

| RPE | Mô tả cảm nhận | Talk test (tự kiểm tra) |
|---|---|---|
| 1–2 | Cực nhẹ, gần như nghỉ ngơi | Hát được thoải mái |
| 3–4 | Nhẹ, thở đều | Nói chuyện bình thường, không đứt hơi |
| 5–6 | Vừa, bắt đầu thở gấp | Nói được câu dài nhưng không hát được |
| 7–8 | Nặng, thở gấp rõ | Chỉ nói được câu ngắn, phải ngắt hơi |
| 9–10 | Kiệt sức, gắng sức tối đa | Gần như không nói được, chỉ vài từ |

Người dùng chỉ cần trả lời 1 câu duy nhất sau buổi tập: **"Buổi tập này nặng cỡ nào, từ 1 đến 10?"** — không cần nhớ số liệu sinh lý nào cả.

## 4. Mốc đo được theo từng môn (thay thế "Nhẹ/Vừa/Nặng" bằng lựa chọn cụ thể)

Thay vì hỏi cường độ trừu tượng, hỏi **một con số hoặc lựa chọn mà người tập luôn biết** ngay sau buổi tập. Hệ thống tự tra MET từ lựa chọn đó.

### 4.1 Đi bộ / Chạy bộ

| Lựa chọn người dùng chọn | MET |
|---|---|
| Đi bộ thong thả (< 4,8 km/h) | 2,8 |
| Đi bộ nhanh (4,8–6,4 km/h) | 3,5 |
| Đi bộ rất nhanh / leo dốc | 6,0 |
| Chạy chậm (~8 km/h) | 8,3 |
| Chạy vừa (~9,7 km/h) | 9,8 |
| Chạy nhanh (~11,3 km/h) | 11,0 |
| Chạy rất nhanh (~12,9 km/h trở lên) | 12,8+ |

*Input thực tế:* nếu app có quãng đường + thời gian (tự nhập, không cần GPS) → tự tính pace → tự chọn đúng mức. Nếu không, cho người dùng chọn 1 trong các mức trên bằng mô tả "tôi chạy khoảng bao lâu 1km".

### 4.2 Đạp xe

| Lựa chọn | MET |
|---|---|
| Đạp nhàn nhã, dạo phố (< 16 km/h) | 4,0 |
| Đạp vừa sức (16–19 km/h) | 6,8 |
| Đạp nhanh (19–22 km/h) | 8,0 |
| Đạp rất nhanh / có dốc (22–25 km/h) | 10,0 |
| Đạp đua / tập luyện cường độ cao (> 25 km/h) | 12,0 |

### 4.3 Gym / Tập tạ (kháng lực)

MET cho gym kém chính xác hơn (phụ thuộc thời gian nghỉ giữa set), nên **dùng RPE làm trục chính**, MET chỉ là hệ số quy đổi tối thiểu:

| Loại buổi tập | MET tham chiếu | Input đề xuất |
|---|---|---|
| Tập nhẹ, tạ nhẹ, nhiều nghỉ | 3,5 | RPE 1–10 do người dùng chọn |
| Tập tạ thông thường (bodybuilding, tách nhóm cơ) | 5,0–6,0 | + optional: số set × số rep × mức tạ (kg) nếu muốn chính xác hơn |
| Circuit training / HIIT tạ, ít nghỉ | 8,0 | |

Nếu muốn chính xác hơn cho dân tập gym nghiêm túc, công thức volume load chuẩn khoa học thể thao là:

> **Training Load = Số set × Số rep × Mức tạ (kg) × RPE**

Có thể cho đây là trường **tuỳ chọn (optional)** — ai không nhớ số tạ vẫn chấm điểm được bằng RPE × thời lượng, ai nhập được số tạ thì được cộng thêm độ chính xác/điểm thưởng.

### 4.4 Yoga / Thể dục nhẹ / Phục hồi

| Loại | MET |
|---|---|
| Yoga phục hồi, thiền, giãn cơ nhẹ | 2,3 |
| Yoga Hatha / cơ bản | 2,5 |
| Yoga Vinyasa / Power yoga | 4,0 |
| Thể dục nhẹ tại nhà (giãn cơ + vận động nhẹ) | 3,0 |

Vì mục tiêu yoga thường là đều đặn chứ không phải cường độ, có thể **không nhân RPE** cho nhóm này (hoặc dùng RPE chỉ để loại trừ gian lận — không cho RPE > 6 với hoạt động yoga phục hồi).

## 5. Công thức tính điểm thống nhất (fairness cho leaderboard)

```
Điểm buổi tập = MET (theo mốc đã chọn) × Thời lượng (giờ) × 10
```

Dùng hệ số ×10 để ra số điểm "đẹp" (theo đúng cách WHO/IPAQ tính MET-phút, chia lại theo giờ cho gọn). Ví dụ: chạy 30 phút ở mức 9,8 MET = 9,8 × 0,5 × 10 = **49 điểm**. Đạp xe nhàn nhã 30 phút = 4,0 × 0,5 × 10 = **20 điểm**. Yoga 45 phút Hatha = 2,5 × 0,75 × 10 ≈ **19 điểm**.

**RPE dùng làm lớp kiểm tra chéo, không nhân trực tiếp vào công thức chính** (tránh double-count) — trừ trường hợp gym/tạ, nơi MET không đủ tin cậy nên RPE thay thế hoàn toàn vai trò của MET:

```
Điểm buổi gym = Thời lượng (phút) × RPE (1–10) × hệ số quy đổi (ví dụ 1,5)
```

Hệ số quy đổi cần hiệu chỉnh để điểm gym tương đương công bằng với điểm cardio ở cùng mức nỗ lực cảm nhận (RPE) — gợi ý: chạy thử với vài buổi mẫu, so sánh điểm ra, chỉnh hệ số cho khớp.

## 6. Chống gian lận / khai điểm ảo

- **Đối chiếu RPE với mốc đã chọn**: nếu người dùng chọn "chạy rất nhanh" nhưng RPE tự chấm chỉ 2/10 → cảnh báo, có thể yêu cầu xác nhận lại hoặc tự động hạ về mức RPE thấp hơn tương ứng.
- **Giới hạn điểm/ngày hoặc điểm/tuần**: theo chuẩn WHO, trên 1.500–3.000 MET-phút/tuần được xem là mức rất cao; có thể áp dụng "giảm dần lợi suất điểm" (diminishing return) sau ngưỡng này để tránh 1 người report 10 buổi/ngày phá leaderboard.
- **Giới hạn thời lượng hợp lý theo môn** (ví dụ: 1 buổi gym tối đa tính 150 phút, chạy bộ tối đa tính 240 phút/buổi) để chặn nhập khống thời gian.

## 7. Đề xuất form nhập liệu cụ thể (UI)

| Bước | Trường nhập | Ghi chú |
|---|---|---|
| 1 | Chọn môn (Chạy/Đi bộ, Đạp xe, Gym, Yoga) | |
| 2 | Chọn mốc cường độ **theo mô tả đo được** của môn đó (bảng mục 4) | Không hỏi "Nhẹ/Vừa/Nặng" nữa |
| 3 | Nhập thời lượng buổi tập (phút) | Bắt buộc |
| 4 (optional, Gym) | Số set / số rep / mức tạ trung bình | Không bắt buộc, cộng điểm thưởng độ chi tiết |
| 5 | Chấm RPE 1–10 kèm bảng mô tả + talk test (mục 3) | Bắt buộc, dùng làm lớp đối chiếu |
| 6 | Hệ thống tự tính điểm + hiển thị "MET tương đương" để người dùng hiểu vì sao ra điểm đó | Minh bạch, tăng tin cậy leaderboard |

## 8. Lộ trình nâng cấp sau này

Khi có thêm dữ liệu thiết bị (điện thoại GPS, đồng hồ đeo tay), có thể tự động hoá bước 2–3 (tính pace/tốc độ thật thay vì tự chọn) và bổ sung nhịp tim để tính TRIMP — nhưng khung điểm ở trên **không cần đổi**, vì MET-phút và RPE vẫn là đơn vị gốc, chỉ là nguồn nhập liệu chính xác hơn.

## Nguồn tham khảo

- [2024 Adult Compendium of Physical Activities](https://pacompendium.com/)
- [Session-RPE Method for Training Load Monitoring: Validity, Ecological Usefulness, and Influencing Factors (Frontiers/PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5673663/)
- [Training load quantification of resistance training (Sets×Reps×Weight×RPE)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5901652/)
- [WHO Guidelines on Physical Activity and Sedentary Behaviour](https://www.ncbi.nlm.nih.gov/books/NBK566046/)
- [Scoring the International Physical Activity Questionnaire (IPAQ)](https://ugc.futurelearn.com/uploads/files/bc/c5/bcc53b14-ec1e-4d90-88e3-1568682f32ae/IPAQ_PDF.pdf)
- [The Talk Test Explained: How To Gauge Effort Without Gadgets](https://marathonhandbook.com/talk-test/)
- [Monitoring Your Exercise Intensity — ACSM's Health & Fitness Journal](https://journals.lww.com/acsm-healthfitness/fulltext/2015/07000/monitoring_your_exercise_intensity.3.aspx)

---

# Vòng 2 — Mở rộng sang các môn khác + Đơn giản hoá luồng nhập liệu

*Cập nhật sau phản hồi của Khang: (1) áp dụng framework cho nhiều môn hơn, không chỉ 3 nhóm ban đầu; (2) v1 có N bảng mốc cường độ khác nhau cho N môn → flow khó hiểu, cần 1 luồng nhất quán; (3) RPE không cần cứng 10 mức, có thể rút gọn miễn còn rõ ràng và bao phủ đủ range.*

## 9. Vấn đề của thiết kế v1

Nhìn lại mục 4: mỗi môn có một bảng mốc cường độ riêng (pace cho chạy, tốc độ cho đạp xe, loại bài cho yoga...). Nếu mở rộng sang bóng đá, cầu lông, bóng rổ, tennis, bơi, võ, nhảy dây, leo núi, khiêu vũ... thì phải tạo thêm N bảng nữa — mỗi môn một kiểu câu hỏi khác nhau. Đó chính là lý do flow "khó hiểu": người dùng phải học lại cách trả lời mỗi lần đổi môn.

**Insight từ phản hồi của Khang:** trừ gym (có rep/kg đo được) và nhóm có pace (chạy/đi bộ/đạp xe), *tất cả các môn còn lại về bản chất chỉ đo được qua cảm nhận cường độ của người tập* — không có proxy khách quan nào mà ai cũng nhớ và tự báo cáo chính xác được (không ai nhớ "mình vừa chạy hết mấy km/h khi đá bóng"). Vậy nên thay vì thiết kế theo **môn**, nên thiết kế theo **kiểu input (pattern)** — chỉ có 3 pattern, dùng chung cho toàn bộ môn thể thao.

## 10. Thiết kế lại: 3 input pattern dùng chung cho mọi môn

| Pattern | Áp dụng cho | Field bắt buộc | Field tuỳ chọn (tăng độ chính xác) |
|---|---|---|---|
| **A — Có pace đo được** | Chạy, đi bộ, đạp xe, bơi (nếu biết pace) | Thời lượng + RPE | Mốc tốc độ/pace (nếu nhớ) |
| **B — Chỉ đo được qua cảm nhận** | Bóng đá, cầu lông, bóng rổ, tennis, bơi (nếu không nhớ pace), võ/boxing, nhảy dây, leo núi/hiking, khiêu vũ, HIIT, yoga... | Thời lượng + RPE | — |
| **C — Có khối lượng tập** | Gym/tạ | Thời lượng + RPE | Set × Rep × Kg (nếu nhớ) |

Điểm mấu chốt: **cả 3 pattern đều bắt buộc đúng 2 field giống hệt nhau — Thời lượng và RPE** — dùng chung 1 component UI. Field thứ 3 chỉ là "bonus" tuỳ môn, không bắt buộc, không làm người dùng bối rối vì nó luôn đứng sau, có ghi rõ "không bắt buộc — nhập nếu bạn nhớ".

## 11. Rút gọn thang RPE: 10 → 5 mức, vẫn phủ đủ toàn bộ range

Search cho thấy nhiều app tiêu dùng (Peloton, Apple Fitness, các app effort-rating phổ biến) và cả nghiên cứu về "facial RPE scale" đều dùng bản rút gọn 5 mức mô tả bằng lời thay vì con số 1-10 trần trụi — lý do là số càng nhiều, người dùng phổ thông càng khó phân biệt được mức 6 khác mức 7 chỗ nào. 5 mức dưới đây gộp cặp đôi từ thang Borg CR-10 gốc, vẫn giữ được toàn bộ dải cường độ:

| Mức | Tên hiển thị | Mô tả / talk test | Tương đương CR-10 | Index nội suy |
|---|---|---|---|---|
| 1 | **Rất nhẹ** | Thở đều, hát được thoải mái | 1–2 | 0,00 |
| 2 | **Nhẹ** | Nói chuyện bình thường, chưa ra mồ hôi nhiều | 3–4 | 0,25 |
| 3 | **Vừa** | Nói được câu dài nhưng không hát được, bắt đầu thở gấp | 5–6 | 0,50 |
| 4 | **Nặng** | Chỉ nói được câu ngắn, thở gấp rõ, mồ hôi nhiều | 7–8 | 0,75 |
| 5 | **Gắng sức tối đa** | Gần như không nói được, kiệt sức sau buổi tập | 9–10 | 1,00 |

Đây vẫn là bản 1 câu hỏi duy nhất: **"Buổi tập này nặng cỡ nào?"** — chỉ khác là người dùng chọn 1 trong 5 mô tả thay vì tự ước lượng con số 1-10. *Index nội suy* (cột cuối) dùng để tính điểm ở mục 12, người dùng không nhìn thấy con số này.

Nếu sau này thấy 5 mức chưa đủ mịn (ví dụ dân tập lâu năm muốn phân biệt rõ hơn), có thể mở rộng lên 7 mức bám theo đúng 7 mốc neo lời gốc của thang Borg 6–20 (rất rất nhẹ / rất nhẹ / khá nhẹ / hơi nặng / nặng / rất nặng / rất rất nặng) — nhưng khuyến nghị bắt đầu với 5 mức vì dễ chọn trên mobile (radio button/slider 5 nấc) và đã đủ độ phân giải cho mục đích leaderboard.

## 12. Công thức thống nhất — dùng được cho mọi môn, mọi pattern

```
Điểm = MET hiệu dụng × Thời lượng (giờ) × 10
```

**MET hiệu dụng** được xác định theo 1 trong 3 cách, ưu tiên độ chính xác giảm dần tuỳ dữ liệu người dùng nhập:

1. **Nếu có mốc pace/tốc độ (Pattern A, field bonus)** → tra thẳng bảng MET theo pace ở mục 4.1/4.2 → chính xác nhất, không cần dùng RPE để tính (RPE lúc này chỉ làm lớp đối chiếu chống gian lận như mục 6).
2. **Nếu không có pace, chỉ có RPE (Pattern A khi quên pace, và toàn bộ Pattern B)** → nội suy tuyến tính giữa MET thấp nhất và MET cao nhất hợp lý của môn đó, theo *index* ở bảng mục 11:

   ```
   MET hiệu dụng = MET_min(môn) + index × (MET_max(môn) − MET_min(môn))
   ```
3. **Gym (Pattern C) khi có Set×Rep×Kg** → dùng công thức Load riêng (mục 4.3: Set × Rep × Kg × RPE) rồi quy đổi về cùng thang điểm bằng hệ số hiệu chỉnh k (cần hiệu chỉnh thử để một buổi gym RPE-Vừa 60 phút ra điểm tương đương một buổi RPE-Vừa 60 phút tính theo công thức 2). Nếu không nhập Set×Rep×Kg, gym cũng rơi về công thức 2 như mọi môn Pattern B, dùng MET_min/MET_max riêng của gym.

Cách này giúp **một công thức duy nhất áp dụng cho toàn bộ app**, còn field bonus theo môn chỉ làm công thức chính xác hơn chứ không đổi bản chất cách tính — đây là phần giúp flow nhất quán, dễ hiểu.

## 13. Bảng MET_min / MET_max tham chiếu cho Pattern B (backend, người dùng không thấy trực tiếp)

Số liệu tham khảo/ước lượng dựa trên Compendium of Physical Activities — cần rà lại mã hoạt động chính xác trước khi hard-code, nhưng đủ dùng làm baseline khởi điểm:

| Môn | MET_min (mức 1 – rất nhẹ) | MET_max (mức 5 – gắng sức tối đa) |
|---|---|---|
| Bóng đá (giao lưu → thi đấu) | 5,0 | 10,0 |
| Cầu lông | 4,5 | 9,0 |
| Bóng rổ | 4,5 | 8,5 |
| Tennis | 5,0 | 8,0 |
| Bơi lội (không rõ pace) | 4,0 | 10,0 |
| Nhảy dây | 8,0 | 12,3 |
| Võ thuật / boxing tập luyện | 5,0 | 10,3 |
| Leo núi / hiking | 4,0 | 7,8 |
| Khiêu vũ | 3,0 | 7,8 |
| HIIT / circuit training | 6,0 | 10,0 |
| Yoga | 2,0 | 4,0 |
| Gym (fallback không có volume) | 3,5 | 6,5 |

*Ví dụ:* đá bóng giao lưu 60 phút, tự chấm RPE "Vừa" (index 0,5) → MET hiệu dụng = 5,0 + 0,5×(10,0−5,0) = 7,5 → Điểm = 7,5 × 1 × 10 = **75 điểm**.

## 14. Luồng nhập liệu rút gọn (thay thế bảng ở mục 7)

| Bước | Field | Bắt buộc? | Ghi chú |
|---|---|---|---|
| 1 | Chọn môn thể thao | Có | Danh sách môn, kể cả nhóm mới thêm |
| 2 | Nhập thời lượng (phút) | Có | Giống nhau cho mọi môn |
| 3 | Chọn mức RPE (5 mô tả, mục 11) (Câu hỏi nên là: "Nhìn lại cả buổi tập, mức độ nặng trung bình là bao nhiêu?")| Có | Cùng 1 UI component cho mọi môn — đây là điểm khác biệt lớn nhất so với v1 |
| 4 | Field bonus theo môn (pace cho cardio / set-rep-kg cho gym) | Không | Chỉ hiện thêm 1 field phụ, có ghi chú "không bắt buộc" |
| 5 | Hệ thống hiển thị điểm + "MET tương đương" để minh bạch | — | Giữ như v1 |

So với v1, **bước 2 (chọn môn) không còn kéo theo một bảng mốc riêng phải học lại** — mọi môn dùng chung bước Thời lượng + RPE, chỉ khác nhau ở việc có thêm 1 field bonus hay không.

## Nguồn tham khảo bổ sung (Vòng 2)

- [Sports – Compendium of Physical Activities](https://pacompendium.com/sports/)
- [Validity and Reliability of Facial Rating of Perceived Exertion Scales for Training Load Monitoring (RPE 5-point vs 10-point)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10125113/)
- [RPE Defined: How Rate of Perceived Exertion Improves Exercise — GoodRx](https://www.goodrx.com/well-being/movement-exercise/rate-of-perceived-exertion)

---

# Vòng 3 — CHỐT: Spec kỹ thuật để triển khai

*Bản tổng hợp cuối, viết cho mục đích đưa qua Claude Code implement. Không lặp lại phần giải thích/lý do (đã có ở Vòng 1–2 phía trên), chỉ chốt lại thứ cần build.*

## 16. Data model đề xuất

**`sports`** — danh mục môn thể thao

| field | type | ghi chú |
|---|---|---|
| id | string | vd `running`, `soccer`, `gym` |
| name | string | tên hiển thị |
| category | enum | `pace` \| `rpe_only` \| `gym` |
| met_min | float | dùng khi category = `rpe_only` hoặc `gym` (fallback) |
| met_max | float | dùng khi category = `rpe_only` hoặc `gym` (fallback) |

**`pace_bands`** — chỉ áp dụng cho môn category = `pace` (chạy, đi bộ, đạp xe, bơi)

| field | type | ghi chú |
|---|---|---|
| id | string | |
| sport_id | FK → sports | |
| label | string | mô tả hiển thị, vd "Chạy vừa (~9,7 km/h)" |
| met_value | float | |
| sort_order | int | để hiển thị đúng thứ tự nhẹ → nặng |

**`rpe_levels`** — bảng tĩnh, dùng chung cho mọi môn, không đổi theo sport

| level | label | description | talk_test | interpolation_index | rpe_raw_for_gym |
|---|---|---|---|---|---|
| 1 | Rất nhẹ | Thở đều, gần như nghỉ | Hát được thoải mái | 0,00 | 1,5 |
| 2 | Nhẹ | Thở đều, chưa ra mồ hôi nhiều | Nói chuyện bình thường | 0,25 | 3,5 |
| 3 | Vừa | Bắt đầu thở gấp | Nói câu dài, không hát được | 0,50 | 5,5 |
| 4 | Nặng | Thở gấp rõ, mồ hôi nhiều | Chỉ nói câu ngắn | 0,75 | 7,5 |
| 5 | Gắng sức tối đa | Kiệt sức sau buổi tập | Gần như không nói được | 1,00 | 9,5 |

**`workout_sessions`** — dữ liệu người dùng nhập

| field | type | bắt buộc | ghi chú |
|---|---|---|---|
| id | string | | |
| user_id | FK | có | |
| sport_id | FK → sports | có | |
| duration_minutes | int | có | |
| rpe_level | int (1–5) | có | |
| pace_band_id | FK → pace_bands, nullable | không | chỉ hiện field này nếu sport.category = `pace` |
| gym_sets | int, nullable | không | chỉ hiện nếu sport.category = `gym` |
| gym_reps | int, nullable | không | |
| gym_weight_kg | float, nullable | không | |
| computed_met | float | tự tính | lưu lại để hiển thị "MET tương đương" |
| computed_points | float | tự tính | |
| created_at | datetime | | |

## 17. Công thức tính điểm (pseudocode)

```
function calculatePoints(session, sport, rpeLevel):
    if sport.category == "pace" and session.pace_band_id is not null:
        met = PaceBand.get(session.pace_band_id).met_value

    elif sport.category == "gym" and session.gym_sets is not null and session.gym_reps is not null and session.gym_weight_kg is not null:
        load = session.gym_sets * session.gym_reps * session.gym_weight_kg * rpeLevel.rpe_raw_for_gym
        met = convertLoadToMet(load, session.duration_minutes)   // xem 17.1, cần calibrate hệ số k

    else:
        // fallback dùng cho: pace-sport không nhớ pace, mọi sport rpe_only, gym không nhớ volume
        met = sport.met_min + rpeLevel.interpolation_index * (sport.met_max - sport.met_min)

    points = met * (session.duration_minutes / 60) * 10
    return round(points, 0)
```

### 17.1 Calibrate `convertLoadToMet` cho gym

Chưa có hệ số chính xác — cần làm trước khi launch:

1. Lấy vài buổi gym mẫu thực tế (vd 60 phút, RPE "Vừa", set×rep×kg cụ thể).
2. Tính điểm bằng nhánh fallback (met_min/met_max của gym = 3,5–6,5, RPE "Vừa" → met = 5,0 → điểm = 50).
3. Chỉnh hệ số `k` trong `convertLoadToMet(load, duration) = (load * k) / duration` (hoặc công thức tương đương) sao cho buổi mẫu ở bước 1 ra điểm ≈ 50 (khớp với bước 2).
4. Việc này đảm bảo user nhập volume chi tiết không bị lệch điểm quá xa so với user chỉ chọn RPE.

## 18. Bảng `sports` khởi tạo (seed data)

| id | name | category | met_min | met_max |
|---|---|---|---|---|
| running | Chạy bộ | pace | — | — |
| walking | Đi bộ | pace | — | — |
| cycling | Đạp xe | pace | — | — |
| swimming | Bơi lội | pace* | 4,0 | 10,0 |
| gym | Gym / Tập tạ | gym | 3,5 | 6,5 |
| yoga | Yoga | rpe_only | 2,0 | 4,0 |
| soccer | Bóng đá | rpe_only | 5,0 | 10,0 |
| badminton | Cầu lông | rpe_only | 4,5 | 9,0 |
| basketball | Bóng rổ | rpe_only | 4,5 | 8,5 |
| tennis | Tennis | rpe_only | 5,0 | 8,0 |
| jump_rope | Nhảy dây | rpe_only | 8,0 | 12,3 |
| martial_arts | Võ thuật / Boxing | rpe_only | 5,0 | 10,3 |
| hiking | Leo núi / Hiking | rpe_only | 4,0 | 7,8 |
| dancing | Khiêu vũ | rpe_only | 3,0 | 7,8 |
| hiit | HIIT / Circuit | rpe_only | 6,0 | 10,0 |

*`swimming` để category `pace` nếu build được pace_bands riêng (chưa liệt kê ở Vòng 1); nếu chưa kịp, tạm để `rpe_only` với met_min/met_max đã cho ở trên và bổ sung pace_bands sau.

**`pace_bands` seed data** (từ mục 4.1–4.2, Vòng 1):

| sport_id | label | met_value |
|---|---|---|
| walking | Đi bộ thong thả (< 4,8 km/h) | 2,8 |
| walking | Đi bộ nhanh (4,8–6,4 km/h) | 3,5 |
| walking | Đi bộ rất nhanh / leo dốc | 6,0 |
| running | Chạy chậm (~8 km/h) | 8,3 |
| running | Chạy vừa (~9,7 km/h) | 9,8 |
| running | Chạy nhanh (~11,3 km/h) | 11,0 |
| running | Chạy rất nhanh (≥12,9 km/h) | 12,8 |
| cycling | Đạp nhàn nhã (< 16 km/h) | 4,0 |
| cycling | Đạp vừa sức (16–19 km/h) | 6,8 |
| cycling | Đạp nhanh (19–22 km/h) | 8,0 |
| cycling | Đạp rất nhanh / có dốc (22–25 km/h) | 10,0 |
| cycling | Đạp đua / cường độ cao (>25 km/h) | 12,0 |

## 19. Luồng UI (final, xem thêm mục 14)

1. Chọn môn (`sports.name`).
2. Nhập thời lượng (phút).
3. Chọn RPE — luôn hiển thị đúng 5 lựa chọn ở bảng `rpe_levels`, cùng 1 component cho mọi môn.
4. Nếu `sport.category == "pace"` → hiện thêm dropdown chọn `pace_band` (không bắt buộc).
   Nếu `sport.category == "gym"` → hiện thêm 3 field set / rep / kg (không bắt buộc).
   Nếu `sport.category == "rpe_only"` → không có field 4.
5. Submit → chạy `calculatePoints()` → lưu `computed_met`, `computed_points` → hiển thị điểm + MET tương đương cho user.

## 20. Việc cần làm trước khi launch (checklist)

- [ ] Rà lại `met_min`/`met_max` ở bảng mục 18 với đúng mã hoạt động trong Compendium 2024 (số hiện tại là ước lượng tham khảo, không phải tra trực tiếp từng mã).
- [ ] Build `pace_bands` riêng cho `swimming` nếu muốn category = `pace` thay vì `rpe_only`.
- [ ] Calibrate hệ số `k` cho gym theo hướng dẫn mục 17.1.
- [ ] Áp dụng giới hạn chống gian lận (mục 6, Vòng 1): trần thời lượng/buổi theo môn, giảm dần lợi suất điểm sau ~3.000 MET-phút/tuần, cảnh báo nếu `pace_band` và `rpe_level` lệch nhau quá xa.
- [ ] User-test bảng 5 mức RPE với vài người dùng thật trước khi launch toàn app — kiểm tra xem mô tả có đủ rõ để tự chọn nhanh không.
