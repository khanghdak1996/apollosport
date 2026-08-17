// Kho HƯỚNG DẪN tập luyện (nội dung TĨNH, dạng bài viết tham khảo).
// Đây là FORMAT chuẩn — nội dung thật đổ thêm sau, chỉ cần thêm object vào GUIDES.
// Không dùng Firestore: import thẳng như EX/ACTIVITIES.
//
// Mỗi guide:
//   id       : khoá duy nhất (kebab-case)
//   scope    : 'sport'    → bài tổng quan cho 1 môn
//              'exercise' → hướng dẫn 1 bài tập cụ thể (gym)
//   sport    : id khớp ACTIVITIES ('gym'|'run'|...) → lấy emoji/màu/label qua actOf()
//   exId     : id khớp EX (src/domain/exercises.js) khi scope==='exercise', ngược lại null
//   title, level('Cơ bản'|'Trung cấp'|'Nâng cao'), summary
//   muscles  : nhóm cơ tác động (chuỗi ngắn, tùy chọn)
//   equipment: dụng cụ cần (tùy chọn)
//   ytQuery  : truy vấn tìm video YouTube (tiếng Anh cho kết quả tốt). Bỏ trống nếu không cần nút video.
//   media    : [{ type:'image'|'video', src, caption }] — ẢNH ĐẦU BÀI. ĐỂ TRỐNG bây giờ; UI có placeholder.
//   steps    : [{ text, media? }] — các bước ĐÁNH SỐ để làm theo; mỗi bước có thể kèm 1 ảnh (để trống lúc này).
//   mistakes : [string] — lỗi thường gặp (người mới rất cần).
//   sections : [{ heading, body }] — đoạn văn giải thích thêm (tùy chọn).
//   tips     : [string], safety: [string] — callout mẹo / an toàn (tùy chọn).

import { EX } from './exercises.js';
import { EXDB } from '../data/exercises-db.js';
import { INSTRUCTIONS_VI } from '../data/instructions-vi.js';
import { vMuscles, vEquip, vLevel, eMuscles, eEquip, eLevel } from './fitness-vocab.js';
import { GUIDES_EN } from './guides-en.js';
import { getLang } from '../i18n.js';

// true khi giao diện đang ở tiếng Anh → builder/localize dùng nội dung EN.
const isEN = () => getLang() === 'en';

// URL tìm video hướng dẫn trên YouTube từ một truy vấn.
export const ytSearchUrl = query => `https://www.youtube.com/results?search_query=${encodeURIComponent(query).replace(/%20/g, '+')}`;

export const GUIDES = [
  {
    id: 'run-getting-started',
    scope: 'sport',
    sport: 'run',
    exId: null,
    title: 'Bắt đầu chạy bộ an toàn',
    level: 'Cơ bản',
    summary: 'Cách bắt đầu chạy từ số 0 mà không đau gối hay bỏ cuộc sau một tuần.',
    ytQuery: 'running for beginners guide',
    media: [],
    steps: [
      { text: 'Khởi động 5 phút: đi bộ nhanh và xoay nhẹ cổ chân, gối, hông cho cơ thể ấm lên.' },
      { text: 'Chạy xen kẽ đi bộ: chạy 1 phút rồi đi bộ 2 phút, lặp lại 6–8 lần. Đừng cố chạy liền một mạch.' },
      { text: 'Giữ tốc độ vẫn nói chuyện được. Nếu thở dốc, hụt hơi là bạn đang chạy quá nhanh — chậm lại.' },
      { text: 'Kết thúc bằng 5 phút đi bộ chậm và giãn nhẹ bắp chân, đùi để bớt mỏi hôm sau.' },
    ],
    mistakes: [
      'Tuần đầu chạy quá nhanh, quá xa → đau gối, nản và bỏ cuộc.',
      'Không khởi động → dễ căng cơ.',
      'Đi giày đế cứng, không phải giày chạy → hại chân.',
    ],
    sections: [
      { heading: 'Tập mấy buổi một tuần?', body: 'Người mới nên chạy 3 buổi/tuần, xen kẽ ngày nghỉ để cơ thể hồi phục. Mỗi tuần tăng dần thời gian chạy trong mỗi lần một chút.' },
    ],
    tips: ['Chọn giày chạy vừa chân, có đệm êm.', 'Uống đủ nước, tránh nắng gắt buổi trưa.'],
    safety: ['Đau nhói ở gối hoặc cổ chân → dừng lại, không cố.'],
  },
  {
    id: 'run-form',
    scope: 'sport',
    sport: 'run',
    exId: null,
    title: 'Chạy đúng tư thế, đỡ mệt đỡ chấn thương',
    level: 'Cơ bản',
    summary: 'Sửa vài lỗi tư thế nhỏ để chạy nhẹ hơn, bền hơn và ít đau gối, đau lưng.',
    ytQuery: 'proper running form for beginners',
    media: [],
    steps: [
      { text: 'Giữ thân trên thẳng, hơi đổ người về trước từ cổ chân (không gập ở eo). Mắt nhìn xa 10–20m.' },
      { text: 'Vai thả lỏng, khuỷu tay gập khoảng 90 độ, đánh tay nhẹ tới–lui theo thân, không vắt ngang ngực.' },
      { text: 'Tiếp đất bằng giữa bàn chân ngay dưới hông, đừng với chân ra xa phía trước (kiểu đó vô tình "phanh" lại mỗi bước).' },
      { text: 'Bước ngắn và nhanh: nhắm khoảng 170–180 bước/phút. Đếm số bước trong 15 giây rồi nhân 4 để ước lượng.' },
      { text: 'Thở đều bằng cả mũi và miệng, hít sâu xuống bụng. Hụt hơi thì chậm lại, đừng gắng.' },
    ],
    mistakes: [
      'Sải chân quá dài, gót đập mạnh xuống trước → lực dội ngược lên gối, mau mỏi.',
      'Gồng vai, nắm chặt bàn tay → tốn sức, mỏi cổ vai gáy.',
      'Cúi nhìn chân khi chạy → gập cổ và lưng, thở khó.',
      'Chạy bằng mũi chân suốt cả buổi → căng bắp chân, đau gân gót.',
    ],
    sections: [
      { heading: 'Cadence là gì, sao lại quan trọng?', body: 'Cadence là số bước chân mỗi phút. Bước ngắn và nhanh (170–180) giúp chân tiếp đất gần trọng tâm, giảm lực dội lên gối và hông — cách đơn giản nhất để chạy êm hơn mà chưa cần chạy nhanh hơn.' },
    ],
    tips: [
      'Nhờ ai đó quay 10 giây từ ngang người để tự soi tư thế.',
      'Thử chạy theo nhịp một bài nhạc khoảng 175 BPM để quen cadence.',
    ],
    safety: ['Đau gối hoặc gân gót kéo dài sau khi chạy → giảm quãng và xem lại cách tiếp đất.'],
  },
  {
    id: 'run-first-5k',
    scope: 'sport',
    sport: 'run',
    exId: null,
    title: 'Lộ trình chạy 5K đầu tiên',
    level: 'Trung cấp',
    summary: 'Kế hoạch 8 tuần đưa bạn từ chạy–đi xen kẽ đến chạy liền 5km, không đốt cháy giai đoạn.',
    ytQuery: 'couch to 5k running plan for beginners',
    media: [],
    steps: [
      { text: 'Tuần 1–2: chạy 1 phút / đi bộ 2 phút, lặp 8 lần. Tập 3 buổi, cách ngày.' },
      { text: 'Tuần 3–4: chạy 2 phút / đi bộ 1 phút, lặp 7–8 lần. Vẫn 3 buổi/tuần.' },
      { text: 'Tuần 5–6: chạy 5 phút / đi bộ 1 phút, lặp 4–5 lần. Bắt đầu quen chạy liền mạch.' },
      { text: 'Tuần 7: chạy liền 20–25 phút, chỉ đi bộ khi thật cần. Giữ tốc độ vẫn nói chuyện được.' },
      { text: 'Tuần 8: chạy liền 5km (người mới thường mất 30–35 phút). Đừng lo tốc độ — mục tiêu là về đích.' },
    ],
    mistakes: [
      'Nhảy cóc giai đoạn vì thấy khỏe → dễ đau ống chân, gối rồi phải nghỉ dài.',
      'Buổi nào cũng cố chạy nhanh hơn → không kịp hồi phục, càng tập càng đuối.',
      'Bỏ ngày nghỉ giữa các buổi → chân không phục hồi, tăng nguy cơ chấn thương.',
    ],
    sections: [
      { heading: 'Nếu tuần này thấy quá sức?', body: 'Cứ lặp lại đúng tuần đó thêm một tuần nữa rồi mới tiến lên. Lộ trình 8 tuần chỉ là gợi ý — tiến theo cơ thể bạn, không theo lịch. Kiên trì quan trọng hơn nhanh.' },
      { heading: 'Tập mấy buổi một tuần?', body: '3 buổi chạy, xen kẽ ngày nghỉ hoặc đi bộ nhẹ. Ngày nghỉ chính là lúc cơ thể khỏe lên — đừng bỏ.' },
    ],
    tips: [
      'Ghi lại mỗi buổi trong app để thấy tiến bộ và giữ động lực.',
      'Khởi động 5 phút đi bộ nhanh trước mỗi buổi, giãn nhẹ chân sau khi chạy.',
    ],
    safety: [
      'Đau nhói (khác với mỏi cơ thông thường) → nghỉ vài ngày, đừng cố chạy tiếp.',
      'Đi giày chạy có đệm; thay giày khi đế đã mòn.',
    ],
  },
  {
    id: 'gym-newbie',
    scope: 'sport',
    sport: 'gym',
    exId: null,
    title: 'Nhập môn phòng gym',
    level: 'Cơ bản',
    summary: 'Buổi đầu tới phòng gym nên làm gì, tập ra sao để an toàn và tiến bộ.',
    ytQuery: 'gym workout for beginners',
    media: [],
    steps: [
      { text: 'Khởi động 5–10 phút (đi bộ nhanh, xoay khớp) trước khi vào bài chính.' },
      { text: 'Tuần đầu tập với mức tạ NHẸ để quen động tác. Kỹ thuật đúng quan trọng hơn nâng nặng.' },
      { text: 'Mỗi bài làm 3 hiệp × 8–12 nhịp, nghỉ 60–90 giây giữa các hiệp.' },
      { text: 'Ghi lại mức tạ mỗi buổi (app này lo giúp bạn) để lần sau tăng dần một chút.' },
    ],
    mistakes: [
      'Ham tạ nặng ngay từ đầu → sai tư thế, dễ chấn thương.',
      'Chỉ tập một nhóm cơ yêu thích → mất cân đối. Người mới nên tập toàn thân.',
      'Bỏ khởi động.',
    ],
    sections: [
      { heading: 'Nên tập kiểu gì?', body: 'Người mới nên tập TOÀN THÂN mỗi buổi (một bài đẩy, một bài kéo, một bài chân) thay vì chia nhỏ từng nhóm cơ. 3 buổi/tuần là đủ để tiến bộ.' },
    ],
    tips: ['Nhờ huấn luyện viên phòng gym xem giúp tư thế vài buổi đầu.'],
    safety: ['Luôn có người bảo hộ (spotter) khi đẩy tạ nặng.', 'Không nín thở khi gắng sức — thở ra lúc đẩy.'],
  },
  {
    id: 'ex-incline-bench',
    scope: 'exercise',
    sport: 'gym',
    exId: 'incline-bench',
    title: 'Đẩy ngực trên (Incline Bench Press)',
    level: 'Cơ bản',
    summary: 'Bài đẩy tạ trên ghế nghiêng để phát triển phần ngực trên. Hướng dẫn từng bước cho người mới.',
    muscles: 'Ngực trên, vai trước, tay sau (cơ tam đầu)',
    equipment: 'Ghế nghiêng + thanh đòn (hoặc tạ đôi)',
    ytQuery: 'how to do incline bench press',
    media: [],
    sections: [
      { heading: 'Bài này tập gì?', body: 'Đây là bài đẩy tạ khi nằm trên ghế dựng hơi nghiêng (không nằm phẳng). Vì ghế nghiêng nên phần ngực TRÊN (gần xương đòn) làm việc nhiều hơn, giúp ngực đầy và cân đối hơn.' },
    ],
    steps: [
      { text: 'Chỉnh lưng ghế nghiêng khoảng 30 độ — hơi dốc thôi. Dốc quá cao sẽ thành tập vai.' },
      { text: 'Nằm lên ghế, hai chân đạp chắc xuống sàn. Giữ mông và lưng trên luôn chạm ghế.' },
      { text: 'Nắm đòn rộng hơn vai một chút, cổ tay thẳng.' },
      { text: 'Nhấc tạ khỏi giá, đưa thẳng lên trên ngực — điểm bắt đầu.' },
      { text: 'Hít vào, hạ tạ từ từ chạm nhẹ ngực trên. Khuỷu tay hơi khép, đừng xoè ngang.' },
      { text: 'Thở ra, đẩy tạ lên về điểm bắt đầu. Kiểm soát tốc độ, không thả rơi. Lặp lại.' },
    ],
    mistakes: [
      'Dựng ghế quá cao → dồn lực sang vai, dễ đau vai và không vào ngực.',
      'Xoè khuỷu tay vuông góc với thân → hại vai. Giữ khuỷu hơi khép (khoảng 45 độ).',
      'Nảy tạ trên ngực để lấy đà → mất tác dụng và dễ chấn thương.',
      'Cong lưng lên quá nhiều để đẩy nặng hơn → giữ lưng trên và mông chạm ghế.',
    ],
    tips: [
      'Người mới: tập với thanh đòn không hoặc tạ thật nhẹ vài buổi để quen động tác.',
      'Mỗi hiệp 8–12 nhịp, làm 3 hiệp, nghỉ 60–90 giây.',
    ],
    safety: [
      'Luôn có người bảo hộ khi đẩy nặng, hoặc dùng máy Smith nếu tập một mình.',
      'Không nín thở gắng sức — thở ra khi đẩy tạ lên.',
      'Đau nhói ở vai → giảm độ nghiêng ghế hoặc giảm mức tạ.',
    ],
  },

  // ── ĐI BỘ ───────────────────────────────────────────────
  {
    id: 'walk-daily',
    scope: 'sport',
    sport: 'walk',
    exId: null,
    title: 'Đi bộ mỗi ngày cho người mới',
    level: 'Cơ bản',
    summary: 'Biến đi bộ thành thói quen bền vững — bắt đầu nhẹ, tăng dần, không đau chân.',
    ytQuery: 'walking for beginners proper technique',
    media: [],
    steps: [
      { text: 'Bắt đầu từ mốc hiện tại: 10–15 phút mỗi ngày là đủ cho tuần đầu. Đừng ép 10.000 bước ngay.' },
      { text: 'Đứng thẳng, mắt nhìn xa khoảng 10m, vai thả lỏng, đánh tay tự nhiên theo bước chân.' },
      { text: 'Tiếp đất bằng gót rồi đẩy qua mũi chân. Bước vừa phải, đừng cố sải dài.' },
      { text: 'Mỗi tuần tăng thêm 5 phút hoặc khoảng 1.000 bước cho tới khi đạt mục tiêu bạn muốn.' },
    ],
    mistakes: [
      'Ngày đầu đi quá lâu → đau ống chân, bắp chân rồi nản, bỏ cuộc.',
      'Vừa đi vừa cúi nhìn điện thoại → mỏi cổ, sai tư thế.',
      'Đi giày cứng, không vừa chân → phồng rộp, đau gót.',
    ],
    sections: [
      { heading: 'Đi mấy buổi một tuần?', body: 'Đi bộ nhẹ có thể tập gần như hằng ngày vì ít gây quá tải. Người mới nhắm 5–7 buổi/tuần, mỗi buổi 15–30 phút, rồi tăng dần thời lượng thay vì tăng tốc độ.' },
    ],
    tips: [
      'Chọn giày thể thao có đệm, vừa chân.',
      'Rủ bạn cùng đi hoặc nghe podcast để duy trì đều đặn hơn.',
    ],
    safety: [
      'Đau nhói ở gối, ống chân hay gót → nghỉ, giảm quãng, đừng cố.',
      'Uống đủ nước, tránh nắng gắt buổi trưa.',
    ],
  },
  {
    id: 'walk-brisk',
    scope: 'sport',
    sport: 'walk',
    exId: null,
    title: 'Đi bộ nhanh đốt mỡ (power walking)',
    level: 'Cơ bản',
    summary: 'Cách đi nhanh đúng kỹ thuật để đốt nhiều calo hơn mà không cần chạy.',
    ytQuery: 'power walking technique for fat loss',
    media: [],
    steps: [
      { text: 'Khởi động 3–5 phút bằng cách đi bộ thong thả cho nóng người.' },
      { text: 'Tăng nhịp bước (bước nhanh hơn) thay vì sải dài hơn — đó là chìa khóa để đi nhanh mà không đau hông.' },
      { text: 'Gập khuỷu tay 90 độ và vung tay chủ động; tay càng nhanh thì chân càng theo nhanh.' },
      { text: 'Giữ cường độ ở mức "nói được nhưng không hát được" trong 20–30 phút.' },
      { text: 'Hạ nhiệt 3–5 phút đi chậm lại rồi giãn nhẹ bắp chân, đùi sau.' },
    ],
    mistakes: [
      'Sải bước quá dài để đi nhanh → căng hông, gót đập mạnh, đau khớp.',
      'Khoanh tay hoặc để tay im → mất một nửa lực đẩy, khó lên nhịp.',
      'Đi nhanh nhưng gù lưng, chúi người → mỏi lưng dưới.',
    ],
    sections: [
      { heading: 'Làm sao biết đủ nhanh?', body: 'Dùng phép thử câu nói: nếu vẫn nói được vài câu ngắn nhưng không thể hát trọn một câu, bạn đang ở đúng vùng đốt mỡ. Nếu vẫn buôn chuyện thoải mái thì hãy tăng nhịp bước.' },
    ],
    tips: [
      'Chọn đường bằng phẳng, thoáng để giữ nhịp đều.',
      'Thêm một đoạn dốc nhẹ để tăng cường độ mà không cần chạy.',
    ],
    safety: [
      'Đau cẳng chân trước (shin splints) → giảm tốc, kiểm tra giày và bước ngắn lại.',
    ],
  },
  {
    id: 'walk-10k',
    scope: 'sport',
    sport: 'walk',
    exId: null,
    title: 'Chinh phục 10.000 bước mỗi ngày',
    level: 'Cơ bản',
    summary: 'Cách chèn bước đi vào ngày bận rộn để đạt mốc 10.000 bước mà không cần tập riêng.',
    ytQuery: '10000 steps a day tips',
    media: [],
    steps: [
      { text: 'Đo mốc hiện tại trong 3 ngày (app hoặc điện thoại đếm giúp). Đó là điểm xuất phát của bạn.' },
      { text: 'Mỗi tuần tăng khoảng 1.000 bước/ngày so với mốc cũ, thay vì nhảy thẳng lên 10.000.' },
      { text: 'Chèn bước vào việc thường ngày: đi cầu thang, đỗ xe xa hơn, đi bộ khi nghe điện thoại.' },
      { text: 'Đặt 2–3 lần "đi dạo 10 phút" trong ngày (sáng, trưa, tối) — cộng lại đã được nhiều nghìn bước.' },
    ],
    mistakes: [
      'Ép đạt 10.000 bước ngay từ hôm đầu → đau chân, hôm sau ngại đi.',
      'Chỉ trông vào một buổi đi bộ dài → bỏ một buổi là hụt cả ngày. Rải đều dễ giữ hơn.',
      'Coi 10.000 là con số bắt buộc — với nhiều người 7.000–8.000 bước/ngày đã rất tốt.',
    ],
    sections: [
      { heading: 'Nhất định phải đủ 10.000?', body: 'Không. 10.000 chỉ là con số dễ nhớ, không phải ngưỡng thần kỳ. Nghiên cứu cho thấy lợi ích tăng rõ ngay từ 6.000–8.000 bước/ngày. Quan trọng là nhiều hơn hôm qua và duy trì đều.' },
    ],
    tips: [
      'Đặt nhắc "đứng dậy đi 5 phút" mỗi giờ nếu ngồi làm việc lâu.',
      'Đi bộ sau bữa ăn 10–15 phút vừa lợi tiêu hóa vừa gom bước.',
    ],
    safety: ['Tăng bước từ từ; đau gối hay bàn chân → chững lại một tuần rồi mới tăng tiếp.'],
  },

  // ── ĐẠP XE ──────────────────────────────────────────────
  {
    id: 'cycle-start',
    scope: 'sport',
    sport: 'cycle',
    exId: null,
    title: 'Bắt đầu đạp xe an toàn',
    level: 'Cơ bản',
    summary: 'Chỉnh xe vừa người và đạp đúng cách để không đau gối, đau lưng ngay buổi đầu.',
    ytQuery: 'cycling for beginners bike setup and technique',
    media: [],
    steps: [
      { text: 'Chỉnh độ cao yên: khi đạp tới điểm thấp nhất, đầu gối chỉ hơi cong (không duỗi thẳng cứng, cũng không gập gắt).' },
      { text: 'Đội mũ bảo hiểm vừa đầu và cài quai trước mỗi lần đi — kể cả đạp gần.' },
      { text: 'Giữ lưng thẳng tự nhiên, khuỷu tay hơi chùng, tay nắm nhẹ ghi-đông, vai thả lỏng.' },
      { text: 'Đạp guồng chân nhẹ và nhanh (khoảng 70–90 vòng/phút) thay vì gồng đạp số nặng.' },
      { text: 'Về số nhẹ trước khi lên dốc; về số nặng dần khi xuống dốc hoặc muốn nhanh hơn.' },
    ],
    mistakes: [
      'Để yên quá thấp → gối gập nhiều, đau mặt trước gối.',
      'Cắm cúi đạp số nặng để đi nhanh → mỏi gối, mau đuối. Guồng nhẹ bền hơn.',
      'Ghì chặt ghi-đông, khóa khuỷu tay → xóc dồn hết lên vai và cổ tay.',
      'Quên kiểm tra phanh và lốp trước khi xuất phát.',
    ],
    sections: [
      { heading: 'Cadence (guồng chân) là gì?', body: 'Là số vòng đạp mỗi phút. Người mới nên giữ guồng nhẹ và đều (70–90 vòng/phút) thay vì đạp ì số nặng. Guồng nhẹ đỡ hại gối và giữ sức cho quãng dài hơn.' },
    ],
    tips: [
      'Tập ở nơi vắng để quen sang số và phanh trước khi ra đường đông.',
      'Mang theo nước và bơm mini hoặc bộ vá cho quãng dài.',
    ],
    safety: [
      'Luôn đội mũ bảo hiểm; đi đúng làn, ra hiệu tay khi rẽ.',
      'Bóp cả hai phanh nhịp nhàng, tránh bóp gắt phanh trước dễ lộn xe.',
    ],
  },
  {
    id: 'cycle-first-ride',
    scope: 'sport',
    sport: 'cycle',
    exId: null,
    title: 'Buổi đạp xe dài đầu tiên (20–30km)',
    level: 'Trung cấp',
    summary: 'Cách phân sức, ăn uống và giữ an toàn để hoàn thành cung đường dài đầu tiên.',
    ytQuery: 'first long bike ride tips beginner',
    media: [],
    steps: [
      { text: 'Chọn cung đường bằng phẳng, ít xe cho lần đầu. Ước lượng thời gian ~1.5–2 giờ.' },
      { text: '20 phút đầu đạp thong thả cho chân nóng lên, đừng bung sức ngay.' },
      { text: 'Giữ guồng chân đều; lên dốc thì về số nhẹ và ngồi đạp thay vì đứng gồng.' },
      { text: 'Uống vài ngụm nước mỗi 15–20 phút, đừng đợi khát mới uống.' },
      { text: 'Với quãng trên 1 giờ, ăn nhẹ (chuối, bánh) khoảng giữa đường để không bị "tụt đường".' },
    ],
    mistakes: [
      'Đạp quá mạnh 10km đầu → cạn sức nửa đường còn lại.',
      'Quên uống nước và ăn nhẹ → hoa mắt, chuột rút, mất sức đột ngột.',
      'Không kiểm tra xe trước khi đi → xịt lốp giữa đường không có đồ vá.',
    ],
    sections: [
      { heading: 'Đi một mình hay theo nhóm?', body: 'Đi nhóm an toàn và vui hơn cho lần đầu: có người hỗ trợ khi hỏng xe, và bám theo người trước giúp đỡ tốn sức. Nếu đi một mình, hãy báo lộ trình cho người thân và mang điện thoại đủ pin.' },
    ],
    tips: [
      'Kiểm tra lốp, phanh, sên trước khi khởi hành.',
      'Mặc đồ thoáng, có thể đeo găng để đỡ tê tay quãng dài.',
    ],
    safety: [
      'Đội mũ bảo hiểm; bật đèn nếu trời tối hoặc sương.',
      'Chuột rút hay chóng mặt → tấp vào lề nghỉ, uống nước, đừng cố.',
    ],
  },

  // ── BƠI ─────────────────────────────────────────────────
  {
    id: 'swim-basics',
    scope: 'sport',
    sport: 'swim',
    exId: null,
    title: 'Làm quen với nước & thở dưới nước',
    level: 'Cơ bản',
    summary: 'Bước đầu tiên cho người sợ nước: nổi được, thở được và thấy thoải mái dưới nước.',
    ytQuery: 'swimming basics for beginners breathing and floating',
    media: [],
    steps: [
      { text: 'Bắt đầu ở khu nước nông tới ngực. Bám thành bể, tập úp mặt xuống nước và thở ra từ từ bằng mũi/miệng.' },
      { text: 'Tập nín nhẹ rồi thở ra thành bọt dưới nước, ngẩng lên hít vào. Lặp lại tới khi thấy quen.' },
      { text: 'Tập nổi sấp: bám thành, duỗi người, thả lỏng và để mặt trong nước — cơ thể tự nổi khi bạn thư giãn.' },
      { text: 'Bám phao hoặc thành bể, tập đạp chân thẳng nhẹ từ hông (không gập gối nhiều), bàn chân duỗi.' },
      { text: 'Ghép lại: đẩy nhẹ khỏi thành, lướt sấp và đạp chân vài mét, thở ra dưới nước.' },
    ],
    mistakes: [
      'Nín thở và căng cứng người → càng dễ chìm và hoảng. Bí quyết là thả lỏng và thở ra đều.',
      'Ngẩng đầu quá cao để thở → hông tụt xuống, chân chìm, tốn sức.',
      'Đạp chân bằng cách co gối như đạp xe → nước cản, không tiến. Đạp thẳng từ hông.',
    ],
    sections: [
      { heading: 'Sợ nước thì bắt đầu sao?', body: 'Đừng vội tập bơi. Cứ dành vài buổi đầu chỉ để quen thở ra dưới nước và nổi thư giãn ở chỗ nông. Khi cơ thể tin rằng "thả lỏng thì nổi", nỗi sợ giảm hẳn và các bước sau dễ hơn nhiều.' },
    ],
    tips: [
      'Dùng kính bơi để nhìn rõ dưới nước — bớt sợ hơn nhiều.',
      'Tập ở nơi có nhân viên cứu hộ hoặc người bơi giỏi đi cùng.',
    ],
    safety: [
      'Luôn tập ở khu nước nông vừa tầm đứng khi mới bắt đầu.',
      'Không bơi một mình; không xuống nước khi quá mệt hoặc vừa ăn no.',
    ],
  },
  {
    id: 'swim-freestyle',
    scope: 'sport',
    sport: 'swim',
    exId: null,
    title: 'Bơi sải cơ bản',
    level: 'Trung cấp',
    summary: 'Ghép tay, chân và nhịp thở nghiêng để bơi sải trơn tru những mét đầu tiên.',
    ytQuery: 'freestyle swimming technique for beginners',
    media: [],
    steps: [
      { text: 'Lướt sấp, người duỗi thẳng, đầu nhìn thẳng xuống đáy bể (không ngẩng), đạp chân thẳng nhẹ từ hông.' },
      { text: 'Quạt một tay: đưa tay ra trước, "bắt nước" rồi kéo dọc thân về đùi, tay kia duỗi thẳng chờ.' },
      { text: 'Xoay nhẹ cả thân theo tay để tay vươn dài hơn — sức đến từ xoay hông, không chỉ từ vai.' },
      { text: 'Thở nghiêng: khi một tay kéo về sau, xoay mặt sang bên đó vừa đủ để miệng ra khỏi mặt nước hít vào, rồi úp mặt lại thở ra.' },
      { text: 'Bắt đầu thở 1 nhịp mỗi 3 lần quạt tay (đổi bên) để cân đối; bơi từng đoạn ngắn rồi nghỉ.' },
    ],
    mistakes: [
      'Nhấc cả đầu lên phía trước để thở → hông và chân chìm, mất đà. Chỉ xoay mặt sang bên.',
      'Quạt tay bằng sức vai mà không xoay thân → nhanh mỏi, sải ngắn.',
      'Nín thở khi mặt dưới nước → hụt hơi sau vài nhịp. Phải thở ra đều dưới nước.',
      'Đạp chân gập gối lớn → nước cản mạnh. Giữ chân gần thẳng, cổ chân thả lỏng.',
    ],
    sections: [
      { heading: 'Tập theo thứ tự nào cho nhanh?', body: 'Tách nhỏ rồi ghép: buổi tập chân (bám phao) → tập quạt một tay → tập xoay người thở nghiêng → cuối cùng mới ghép cả ba. Đừng cố hoàn hảo cả bài ngay; sửa từng phần dễ tiến hơn.' },
    ],
    tips: [
      'Dùng phao kẹp chân hoặc ván bơi để tập riêng tay và chân.',
      'Bơi chậm và dài hơi còn hơn bơi nhanh mà loạn nhịp thở.',
    ],
    safety: [
      'Bơi theo làn, nghỉ ở thành bể khi hụt hơi.',
      'Chóng mặt hoặc tức ngực → lên bờ nghỉ, không cố bơi tiếp.',
    ],
  },
  {
    id: 'swim-laps',
    scope: 'sport',
    sport: 'swim',
    exId: null,
    title: 'Bơi được nhiều vòng hơn mà không hụt hơi',
    level: 'Cơ bản',
    summary: 'Cách chia quãng nghỉ và giữ nhịp để bơi bền, tăng dần số vòng mỗi buổi.',
    ytQuery: 'swimming endurance tips for beginners intervals',
    media: [],
    steps: [
      { text: 'Khởi động 2–3 vòng bơi thật chậm, thả lỏng cho quen nước và nhịp thở.' },
      { text: 'Bơi theo quãng nghỉ (interval): bơi 1 vòng rồi nghỉ ở thành 20–30 giây, lặp lại. Nghỉ đủ để tim dịu lại.' },
      { text: 'Giữ tốc độ đều và chậm hơn bạn nghĩ — bơi bền là bơi thư giãn, không phải bơi gắng.' },
      { text: 'Mỗi buổi cố thêm 1 vòng hoặc rút ngắn thời gian nghỉ một chút so với buổi trước.' },
      { text: 'Kết thúc bằng 1–2 vòng bơi thật chậm để hạ nhiệt.' },
    ],
    mistakes: [
      'Bơi hết sức ngay vòng đầu → hụt hơi, phải nghỉ dài, tưởng mình "yếu".',
      'Nghỉ quá lâu hoặc quá ngắn giữa các vòng → hoặc nguội người, hoặc chưa kịp hồi.',
      'Chỉ chú tâm bơi nhanh mà bỏ nhịp thở đều → nhanh đuối.',
    ],
    sections: [
      { heading: 'Tập mấy buổi một tuần?', body: '2–3 buổi/tuần, cách ngày, là đủ để sức bền lên đều. Mỗi buổi tăng nhẹ tổng số vòng thay vì tăng tốc độ. Sức bền trong nước tiến khá nhanh nếu bạn giữ nhịp thở thoải mái.' },
    ],
    tips: [
      'Đếm vòng bằng mốc dễ nhớ, hoặc ghi lại trong app sau buổi bơi.',
      'Thở đều theo nhịp cố định (ví dụ 3 nhịp quạt/1 lần thở) giúp bơi ổn định hơn.',
    ],
    safety: [
      'Bơi ở làn phù hợp trình độ; nghỉ ngay khi thấy hụt hơi hay hoa mắt.',
      'Không bơi một mình ở nơi không có cứu hộ.',
    ],
  },

  // ── YOGA ────────────────────────────────────────────────
  {
    id: 'yoga-start',
    scope: 'sport',
    sport: 'yoga',
    exId: null,
    title: 'Buổi yoga đầu tiên tại nhà',
    level: 'Cơ bản',
    summary: 'Cần gì, thở ra sao và vài tư thế nền để có buổi yoga đầu tiên nhẹ nhàng, không đau.',
    ytQuery: 'yoga for complete beginners at home',
    media: [],
    steps: [
      { text: 'Chuẩn bị một tấm thảm (hoặc mặt phẳng êm), mặc đồ co giãn, chọn góc yên tĩnh đủ để duỗi tay chân.' },
      { text: 'Ngồi thẳng lưng, tập thở bằng bụng: hít vào bụng phình, thở ra bụng xẹp, chậm và đều trong 1–2 phút.' },
      { text: 'Tư thế Con mèo – Con bò: quỳ chống tay, hít vào võng lưng ngẩng đầu, thở ra cong lưng cúi đầu. Lặp 8–10 nhịp cho ấm cột sống.' },
      { text: 'Tư thế Chó úp mặt: chống tay và chân, đẩy hông lên cao thành hình chữ V ngược, gối hơi cong nếu căng. Giữ 3–5 nhịp thở.' },
      { text: 'Tư thế Chiến binh II: bước chân rộng, xoay bàn chân trước, chùng gối trước, hai tay dang ngang. Giữ 3–5 nhịp mỗi bên.' },
      { text: 'Kết thúc bằng tư thế Em bé: quỳ gập người, trán chạm thảm, tay duỗi trước, thở sâu 5–10 nhịp để thư giãn.' },
    ],
    mistakes: [
      'Cố ép mình vào tư thế sâu như video → căng quá mức, đau và dễ nản. Yoga là giãn dễ chịu, không phải đau.',
      'Nín thở khi giữ tư thế → mất tác dụng thư giãn. Luôn thở đều, chậm.',
      'Bỏ qua khởi động cột sống (mèo–bò) → vào tư thế sâu ngay dễ căng lưng.',
    ],
    sections: [
      { heading: 'Không dẻo có tập được không?', body: 'Được, và đó chính là lý do nên tập. Dẻo dai là kết quả của yoga chứ không phải điều kiện để bắt đầu. Cứ giữ gối hơi cong, vào tư thế ở mức bạn thấy dễ chịu; sau vài tuần cơ thể sẽ mềm ra rõ rệt.' },
    ],
    tips: [
      'Tập theo hơi thở: mỗi động tác gắn với một nhịp hít hoặc thở.',
      '10–15 phút mỗi ngày tốt hơn 1 buổi dài mỗi tuần.',
    ],
    safety: [
      'Đau nhói ở khớp (khác với cảm giác căng cơ dễ chịu) → lùi ra khỏi tư thế ngay.',
      'Có vấn đề cột sống, huyết áp hay đang mang thai → hỏi ý kiến bác sĩ trước.',
    ],
  },
  {
    id: 'yoga-desk',
    scope: 'sport',
    sport: 'yoga',
    exId: null,
    title: 'Yoga cho dân văn phòng (mỏi cổ, đau lưng)',
    level: 'Cơ bản',
    summary: 'Chuỗi giãn ngắn giải tỏa cổ, vai và lưng dưới sau nhiều giờ ngồi máy tính.',
    ytQuery: 'yoga stretches for office workers neck and back',
    media: [],
    steps: [
      { text: 'Giãn cổ: ngồi thẳng, nghiêng đầu sang một bên cho tai gần vai, giữ 20–30 giây rồi đổi bên. Không giật mạnh.' },
      { text: 'Xoay vai: cuộn vai ra sau 10 vòng rồi ra trước 10 vòng để thả lỏng cổ vai gáy.' },
      { text: 'Giãn ngực – vai: đan tay sau lưng, duỗi thẳng và nhẹ nhàng nâng lên, mở ngực, giữ 20–30 giây (chống lại tư thế gù khi ngồi).' },
      { text: 'Vặn cột sống khi ngồi: ngồi thẳng, xoay thân sang một bên tay vịn ghế, giữ 20–30 giây mỗi bên để thư giãn lưng.' },
      { text: 'Giãn lưng dưới & hông: đứng dậy, đặt một cổ chân lên gối kia thành số 4, hơi chùng gối trụ để giãn mông–hông, giữ 20–30 giây mỗi bên.' },
    ],
    mistakes: [
      'Giật hoặc bật nảy khi giãn → dễ căng cơ. Vào chậm và giữ yên.',
      'Nín thở khi giãn → cơ khó thả lỏng. Thở ra sâu khi vào sâu hơn.',
      'Chỉ giãn khi đã đau nặng → nên giãn ngắn vài lần trong ngày để phòng trước.',
    ],
    sections: [
      { heading: 'Nên tập lúc nào?', body: 'Rải 1–2 lần mỗi ngày làm việc, mỗi lần 3–5 phút — giữa buổi sáng và giữa buổi chiều là lúc cổ vai bắt đầu mỏi. Đặt nhắc trên điện thoại để không quên. Đều đặn quan trọng hơn tập lâu.' },
    ],
    tips: [
      'Kết hợp với việc đứng dậy đi lại vài phút mỗi giờ.',
      'Chỉnh màn hình ngang tầm mắt để bớt chúi cổ ngay từ đầu.',
    ],
    safety: ['Đau lan xuống tay hoặc tê bì kéo dài → ngừng và đi khám, đừng tự giãn mạnh.'],
  },
  {
    id: 'yoga-flexibility',
    scope: 'sport',
    sport: 'yoga',
    exId: null,
    title: 'Yoga tăng dẻo dai',
    level: 'Cơ bản',
    summary: 'Chuỗi giãn gân kheo, hông và cột sống giúp cơ thể mềm mại hơn theo thời gian.',
    ytQuery: 'yoga for flexibility beginners hamstrings hips',
    media: [],
    steps: [
      { text: 'Khởi động mèo–bò 8–10 nhịp và vài vòng chó úp mặt cho cơ thể ấm — đừng giãn sâu khi cơ còn nguội.' },
      { text: 'Gập người trước (đứng hoặc ngồi): gối hơi cong, thả thân xuống theo hơi thở để giãn gân kheo. Giữ 5–8 nhịp thở.' },
      { text: 'Tư thế Bồ câu (giãn hông): một chân gập trước, chân kia duỗi sau, hạ thân xuống nhẹ nhàng. Giữ 5–8 nhịp mỗi bên.' },
      { text: 'Vặn cột sống khi nằm: nằm ngửa, gập một gối và đưa chéo sang bên kia, hai vai vẫn chạm sàn. Giữ 5–8 nhịp mỗi bên.' },
      { text: 'Kết thúc tư thế Em bé và nằm thư giãn 1–2 phút, thở đều.' },
    ],
    mistakes: [
      'Nóng vội ép sâu để "nhanh dẻo" → căng cơ, phản tác dụng và dễ chấn thương.',
      'Giữ tư thế mà nín thở → cơ không giãn được. Thở ra để lún sâu thêm chút mỗi nhịp.',
      'Giãn khi cơ còn lạnh → dễ rách nhẹ sợi cơ. Luôn khởi động trước.',
    ],
    sections: [
      { heading: 'Bao lâu thì dẻo hơn?', body: 'Dẻo dai tiến chậm nhưng chắc: tập 3–4 buổi/tuần, mỗi tư thế giữ 30–60 giây, sau 3–4 tuần bạn sẽ thấy khác biệt rõ. Đều đặn và kiên nhẫn quan trọng hơn ép sâu trong một buổi.' },
    ],
    tips: [
      'Giãn sau khi tập môn khác (chạy, gym) khi cơ đang ấm là hiệu quả nhất.',
      'Dùng dây tập hoặc khăn hỗ trợ nếu tay chưa với tới chân.',
    ],
    safety: ['Cảm giác đúng là căng dễ chịu; đau nhói hay run cơ mạnh là dấu hiệu quá sức, hãy lùi lại.'],
  },

  // ── CẦU LÔNG ────────────────────────────────────────────
  {
    id: 'badminton-start',
    scope: 'sport',
    sport: 'badminton',
    exId: null,
    title: 'Nhập môn cầu lông',
    level: 'Cơ bản',
    summary: 'Cách cầm vợt, đứng thủ và giao cầu đúng để chơi được ngay buổi đầu.',
    ytQuery: 'badminton basics for beginners grip and footwork',
    media: [],
    steps: [
      { text: 'Cầm vợt kiểu bắt tay (forehand grip): nắm cán như đang bắt tay ai đó, các ngón thả lỏng, không ghì chặt.' },
      { text: 'Tư thế chờ cầu: chân rộng bằng vai, hơi khuỵu gối, trọng tâm dồn nửa trước bàn chân, vợt để trước người sẵn sàng.' },
      { text: 'Di chuyển bằng bước đệm (bước nhỏ) rồi bước dài về phía cầu, đánh xong quay ngay về giữa sân.' },
      { text: 'Giao cầu thấp: thả cầu và đẩy vợt nhẹ cho cầu bay sát mép lưới sang ô chéo, tiếp xúc cầu dưới thắt lưng.' },
      { text: 'Giao cầu cao: vung vợt mạnh hơn cho cầu bay cao và sâu về cuối sân đối phương (hợp đánh đơn).' },
    ],
    mistakes: [
      'Nắm vợt quá chặt cả trận → cứng cổ tay, đánh không "phất" và mau mỏi.',
      'Đánh xong đứng yên tại chỗ → không kịp về giữa sân, bị đối thủ kéo chạy.',
      'Vung cả cánh tay mà quên gập cổ tay → mất lực và độ chính xác.',
      'Đứng thẳng chân, trọng tâm cao → phản ứng chậm với cầu.',
    ],
    sections: [
      { heading: 'Vì sao phải về giữa sân?', body: 'Điểm giữa sân (hơi lệch sau) là vị trí đến được mọi góc nhanh nhất. Thói quen đánh xong lập tức quay về giữa giúp bạn luôn sẵn sàng cho cú tiếp theo — đây là thứ phân biệt người mới với người chơi có nền.' },
    ],
    tips: [
      'Tập vẩy cổ tay với cầu treo hoặc đánh nhẹ vào tường để quen lực.',
      'Đi giày cầu lông (đế bám, ôm chân) thay vì giày chạy để đổi hướng an toàn.',
    ],
    safety: [
      'Khởi động cổ tay, vai và cổ chân kỹ — cầu lông đổi hướng nhiều, dễ lật cổ chân.',
      'Đau vai khi đập cầu → giảm cường độ, xem lại kỹ thuật vung tay.',
    ],
  },
  {
    id: 'badminton-strokes',
    scope: 'sport',
    sport: 'badminton',
    exId: null,
    title: 'Các cú đánh nền tảng',
    level: 'Cơ bản',
    summary: 'Ba cú cơ bản — phông cao, bỏ nhỏ và đập cầu — đủ để bạn chơi được các pha qua lại.',
    ytQuery: 'badminton basic strokes clear drop smash',
    media: [],
    steps: [
      { text: 'Cú phông cao (clear): đánh cầu bay cao và sâu về cuối sân đối phương để đẩy họ ra xa và có thời gian về vị trí.' },
      { text: 'Đánh cầu trên cao: vươn tay chạm cầu ở điểm cao nhất phía trước trán, xoay thân và vẩy cổ tay lúc tiếp xúc.' },
      { text: 'Cú bỏ nhỏ (drop): cùng động tác vung như phông cao nhưng giảm lực ở phút chót, cho cầu rơi sát lưới bên kia.' },
      { text: 'Cú đập cầu (smash): tiếp xúc cầu ở điểm cao, đánh chúc xuống mạnh và dứt khoát khi cầu đang ở trên cao trước mặt.' },
      { text: 'Luân phiên tập từng cú với bạn đánh cùng: 10 quả phông, 10 quả bỏ nhỏ, rồi mới tập smash.' },
    ],
    mistakes: [
      'Cú nào cũng đập hết sức → mất sức nhanh và dễ hỏng cầu. Biết khi nào phông, khi nào bỏ nhỏ mới quan trọng.',
      'Tiếp xúc cầu quá thấp hoặc sau đầu → mất lực và khó điều hướng.',
      'Dùng cùng một động tác vung lộ liễu → đối thủ đoán được ý đồ.',
    ],
    sections: [
      { heading: 'Nên tập cú nào trước?', body: 'Ưu tiên cú phông cao và bỏ nhỏ trước — chúng giúp bạn duy trì pha cầu và điều đối thủ chạy. Smash trông "ngầu" nhưng tốn sức và dễ hụt; hãy để dành khi đã vững hai cú kia và cầu ở đúng thế trên cao.' },
    ],
    tips: [
      'Che ý đồ bằng cách vào cú phông và bỏ nhỏ với động tác vung giống nhau.',
      'Tập với tường hoặc bạn đánh đều để làm quen điểm tiếp xúc.',
    ],
    safety: ['Cú smash và với cầu qua đầu dễ căng vai — khởi động vai kỹ và đừng tập quá nhiều smash lúc mới bắt đầu.'],
  },

  // ── PICKLEBALL ──────────────────────────────────────────
  {
    id: 'pickleball-start',
    scope: 'sport',
    sport: 'pickleball',
    exId: null,
    title: 'Pickleball cho người mới',
    level: 'Cơ bản',
    summary: 'Nắm luật cơ bản, cách cầm vợt và vùng cấm để vào sân chơi được ngay.',
    ytQuery: 'pickleball rules and basics for beginners',
    media: [],
    steps: [
      { text: 'Cầm vợt kiểu bắt tay (continental) — dùng được cho cả thuận tay và trái tay, tay nắm thả lỏng.' },
      { text: 'Giao bóng: đứng sau vạch cuối sân, đánh bóng dưới thắt lưng theo đường vòng lên, bóng bay chéo sang ô giao bên kia.' },
      { text: 'Nhớ luật nảy 2 lần (double bounce): bóng phải nảy 1 lần bên nhận và 1 lần bên giao rồi mới được đánh bóng trên không (volley).' },
      { text: 'Không đánh volley khi đang đứng trong "kitchen" (vùng cấm 2.13m sát lưới) — đây là lỗi phổ biến nhất của người mới.' },
      { text: 'Sau vài nhịp đầu, tiến lên đứng gần vạch kitchen cùng đồng đội — vị trí tốt nhất để kiểm soát bóng.' },
    ],
    mistakes: [
      'Bước vào kitchen rồi đánh volley → mất điểm oan. Chỉ vào kitchen khi bóng đã nảy.',
      'Quên luật nảy 2 lần, vội bắt volley ngay sau khi giao → phạm luật.',
      'Đứng lì ở cuối sân → bị đối thủ khống chế lưới. Hãy tiến lên vạch kitchen.',
      'Đánh quá mạnh mọi quả → bóng bay dài ra ngoài. Pickleball ăn nhau ở kiểm soát, không phải lực.',
    ],
    sections: [
      { heading: '"Kitchen" là gì?', body: 'Kitchen (vùng không volley) là vạch 2.13m tính từ lưới về mỗi bên. Trong vùng này bạn không được đánh bóng trên không; phải để bóng nảy trước. Luật này khiến pickleball thiên về đặt bóng khéo hơn là đập mạnh — và đó là lý do người mới cũng chơi vui được ngay.' },
    ],
    tips: [
      'Chơi đôi để dễ làm quen luật và đỡ phải chạy nhiều.',
      'Tập giao bóng chéo qua lưới vài chục quả trước khi vào trận.',
    ],
    safety: [
      'Khởi động cổ chân, gối và vai; sân nhỏ nhưng đổi hướng nhiều.',
      'Không lùi giật lùi để đỡ bóng bổng (dễ ngã ngửa) — xoay người chạy lùi.',
    ],
  },
  {
    id: 'pickleball-tips',
    scope: 'sport',
    sport: 'pickleball',
    exId: null,
    title: 'Mẹo cho trận đấu đầu tiên',
    level: 'Cơ bản',
    summary: 'Vài chiến thuật đơn giản giúp bạn chơi khôn hơn và ghi điểm ngay từ trận đầu.',
    ytQuery: 'pickleball strategy tips for beginners dinking',
    media: [],
    steps: [
      { text: 'Ưu tiên đưa bóng vào sân an toàn hơn là đánh thắng điểm ngay — phần lớn điểm đến từ lỗi của đối thủ.' },
      { text: 'Tập cú dink: đánh nhẹ cho bóng rơi vào kitchen bên kia, buộc đối thủ phải đỡ bóng thấp thay vì đập.' },
      { text: 'Sau khi giao/nhận, tiến nhanh lên vạch kitchen cùng đồng đội và giữ hàng ngang với nhau.' },
      { text: 'Nhắm đánh vào giữa hai đối thủ hoặc vào chân người yếu hơn để họ lúng túng.' },
      { text: 'Với cú thứ ba, thử "third-shot drop": đánh bóng vòng cung rơi mềm vào kitchen để có thời gian lên lưới.' },
    ],
    mistakes: [
      'Cố đập thắng điểm mọi quả → tự đánh hỏng nhiều hơn ăn điểm.',
      'Hai người trong đội đứng lệch nhau (một trên một dưới) → hở khoảng trống giữa sân.',
      'Đứng yên cuối sân sau khi giao → không kiểm soát được lưới.',
    ],
    sections: [
      { heading: 'Vì sao dink lại lợi hại?', body: 'Cú dink nhẹ rơi vào kitchen khiến đối thủ không thể đập (vì bóng thấp và gần lưới), buộc họ đỡ nhẹ lại. Ai kiên nhẫn dink tốt hơn thường thắng — đây là kỹ năng đáng tập nhất cho người mới muốn tiến bộ nhanh.' },
    ],
    tips: [
      'Giao tiếp với đồng đội: hô "của tôi" / "của bạn" để tránh cả hai cùng đỡ hoặc cùng bỏ.',
      'Giữ vợt sẵn ngang ngực để phản ứng nhanh ở lưới.',
    ],
    safety: ['Ở lưới bóng đến nhanh — đeo kính bảo vệ mắt nếu có, và đừng đứng quá sát đồng đội để tránh va vợt.'],
  },

  // ── TENNIS ──────────────────────────────────────────────
  {
    id: 'tennis-start',
    scope: 'sport',
    sport: 'tennis',
    exId: null,
    title: 'Nhập môn tennis',
    level: 'Cơ bản',
    summary: 'Cách cầm vợt, đứng chuẩn và đánh cú thuận tay đầu tiên qua lưới.',
    ytQuery: 'tennis basics for beginners forehand grip',
    media: [],
    steps: [
      { text: 'Cầm vợt kiểu Eastern cho cú thuận tay: đặt lòng bàn tay áp vào mặt vợt rồi trượt xuống nắm cán — như bắt tay với cây vợt.' },
      { text: 'Tư thế sẵn sàng: chân rộng hơn vai, khuỵu gối nhẹ, tay không thuận đỡ cổ vợt, trọng tâm ở nửa trước bàn chân.' },
      { text: 'Vào cú thuận tay: xoay vai và hông lấy đà (đưa vợt ra sau), bước chân trước lên.' },
      { text: 'Đánh bóng ở điểm ngang hông và phía trước thân, vung vợt từ thấp lên cao rồi kết thúc vợt qua vai bên kia.' },
      { text: 'Tập bắt đầu bằng đánh bóng do bạn tự thả nảy, rồi mới sang bóng do người khác đưa sang.' },
    ],
    mistakes: [
      'Đánh bóng quá gần thân hoặc trễ (bóng đã qua người) → mất lực và không điều được hướng.',
      'Chỉ vung tay, không xoay thân → bóng yếu, mau mỏi vai.',
      'Đứng thẳng chân, đợi bóng thay vì bước đến đón bóng.',
      'Nắm vợt cứng và siết chặt → cổ tay không linh hoạt, dễ đau khuỷu.',
    ],
    sections: [
      { heading: 'Nên tập gì trước tiên?', body: 'Dành phần lớn thời gian đầu cho cú thuận tay và di chuyển chân. Đừng vội tập giao bóng mạnh hay trái tay hai tay. Đánh được 10 quả thuận tay ổn định qua lưới đã là nền tảng vững để mọi cú khác dễ hơn.' },
    ],
    tips: [
      'Tập đánh vào tường để có nhiều lần chạm bóng trong thời gian ngắn.',
      'Chuẩn bị vợt sớm (đưa ra sau ngay khi thấy bóng) là bí quyết đánh kịp.',
    ],
    safety: [
      'Khởi động vai, khuỷu và cổ tay; đau khuỷu ("tennis elbow") thường do kỹ thuật sai hoặc vợt quá căng.',
      'Đi giày tennis đế bám để đổi hướng và phanh an toàn.',
    ],
  },
  {
    id: 'tennis-rally',
    scope: 'sport',
    sport: 'tennis',
    exId: null,
    title: 'Đánh bền bóng qua lại (rally)',
    level: 'Cơ bản',
    summary: 'Ưu tiên độ ổn định hơn lực để giữ bóng trong sân và kéo dài pha đánh.',
    ytQuery: 'tennis rally consistency drills for beginners',
    media: [],
    steps: [
      { text: 'Đặt mục tiêu: đưa bóng qua lưới và vào sân đều đặn, chưa cần đánh mạnh hay đánh thắng.' },
      { text: 'Đánh bóng vòng cung qua lưới (cao hơn lưới 1–2m) để có biên độ an toàn, bóng vẫn rơi trong sân.' },
      { text: 'Sau mỗi cú, di chuyển ngay về giữa sân (gần vạch cuối) để sẵn sàng đón bóng tiếp theo.' },
      { text: 'Xoay thân đón bóng và chuẩn bị vợt sớm; đánh ở phía trước thân, kết thúc vợt trọn vẹn.' },
      { text: 'Thử thách: cùng bạn giữ bóng qua lại 10 lần liên tiếp không rớt, rồi nâng dần lên 20.' },
    ],
    mistakes: [
      'Đánh sát mép lưới để "chắc ăn" → dễ chạm lưới. Đánh cao hơn lưới an toàn hơn nhiều.',
      'Đứng yên ngắm cú vừa đánh → không kịp về vị trí cho cú sau.',
      'Cố đập mạnh mỗi quả → tỉ lệ hỏng cao, rally đứt liên tục.',
    ],
    sections: [
      { heading: 'Vì sao ổn định lại thắng?', body: 'Ở trình độ mới chơi, phần lớn điểm đến từ lỗi tự đánh hỏng chứ không phải cú winner. Người đưa được nhiều bóng vào sân hơn gần như luôn thắng. Tập giữ rally dài rèn đúng thứ quan trọng nhất: sự ổn định và di chuyển.' },
    ],
    tips: [
      'Đếm số lần chạm bóng trong một rally để tự đo tiến bộ.',
      'Thở ra mỗi khi đánh bóng giúp giữ nhịp và bớt căng cứng.',
    ],
    safety: ['Di chuyển nhiều dễ mỏi chân — khởi động và giãn cơ đùi, bắp chân trước và sau buổi tập.'],
  },

  // ── BÓNG ĐÁ ─────────────────────────────────────────────
  {
    id: 'football-warmup',
    scope: 'sport',
    sport: 'football',
    exId: null,
    title: 'Khởi động & giữ chân không chấn thương khi đá phủi',
    level: 'Cơ bản',
    summary: 'Đá phủi cuối tuần dễ chấn thương nếu vào sân nguội — đây là cách khởi động đúng.',
    ytQuery: 'football warm up routine to prevent injury',
    media: [],
    steps: [
      { text: 'Chạy bộ nhẹ quanh sân 3–5 phút cho nóng người trước khi đụng tới bóng.' },
      { text: 'Khởi động động: nâng cao gối, đá gót chạm mông, bước lunge, xoay hông — mỗi động tác 20–30 giây.' },
      { text: 'Xoay kỹ cổ chân và gối theo cả hai chiều — đây là hai khớp dễ chấn thương nhất khi đá bóng.' },
      { text: 'Chạy tăng tốc nhẹ vài lần (70–80% sức) để cơ quen với chạy nước rút trước khi vào trận.' },
      { text: 'Tâng bóng và chuyền nhẹ với đồng đội vài phút để làm quen cảm giác bóng.' },
    ],
    mistakes: [
      'Vào sân đá ngay khi cơ còn nguội → căng cơ đùi sau, chuột rút, thậm chí rách cơ.',
      'Chỉ giãn tĩnh (ngồi ép dẻo) trước khi đá → nên khởi động động, giãn tĩnh để dành sau trận.',
      'Bỏ qua khởi động cổ chân → dễ lật cổ chân khi tranh chấp hoặc đổi hướng.',
      'Đi sai giày với mặt sân (giày đinh dài trên sân cứng) → trơn trượt, hại gối.',
    ],
    sections: [
      { heading: 'Vì sao khởi động động, không phải ngồi ép dẻo?', body: 'Trước vận động mạnh, cơ thể cần được "đánh thức" bằng các động tác chuyển động (khởi động động) để tăng nhiệt và máu tới cơ. Ngồi ép giãn tĩnh lúc cơ nguội có thể làm cơ yếu tạm thời và tăng nguy cơ căng cơ. Để dành giãn tĩnh cho lúc hạ nhiệt sau trận.' },
    ],
    tips: [
      'Bù nước trước, trong và sau trận; trận dài thì nghỉ uống nước giữa hiệp.',
      'Mang giày phù hợp mặt sân (cỏ tự nhiên, cỏ nhân tạo hay sân xi măng).',
    ],
    safety: [
      'Đau nhói bắp đùi sau khi bứt tốc → dừng ngay, rất có thể là căng cơ, cố tiếp sẽ nặng hơn.',
      'Bong gân cổ chân → chườm lạnh, kê cao chân và nghỉ, đừng cố đá tiếp.',
    ],
  },
  {
    id: 'football-skills',
    scope: 'sport',
    sport: 'football',
    exId: null,
    title: 'Kỹ năng nền: khống bóng, chuyền, sút',
    level: 'Cơ bản',
    summary: 'Ba kỹ năng cốt lõi để chơi tự tin hơn trong các trận đá phủi.',
    ytQuery: 'football basic skills passing first touch shooting',
    media: [],
    steps: [
      { text: 'Chuyền má trong: dùng phần lòng bàn chân (má trong) chạm giữa bóng, mặt bàn chân hướng thẳng vào người nhận. Đây là cú chuyền chính xác nhất.' },
      { text: 'Khống bóng (first touch): khi bóng đến, đưa chân đón nhẹ và "hãm" bóng lại gần người thay vì để bóng bật xa.' },
      { text: 'Rê bóng: đẩy bóng bằng mu ngoài/má trong với những chạm nhẹ, giữ bóng trong tầm kiểm soát, mắt ngẩng quan sát.' },
      { text: 'Sút bóng: chân trụ đặt cạnh bóng, sút bằng mu bàn chân (phần buộc dây giày) vào giữa bóng, vung chân theo hướng muốn bóng đi.' },
      { text: 'Tập lặp lại với tường hoặc bạn: 20 cú chuyền má trong, 20 lần khống bóng, rồi tập sút vào mục tiêu.' },
    ],
    mistakes: [
      'Chuyền bằng mũi bàn chân → bóng đi lệch và khó kiểm soát lực.',
      'Đón bóng bằng chân cứng đơ → bóng bật xa, mất quyền kiểm soát.',
      'Cắm mặt nhìn bóng khi rê → không thấy đồng đội và đối thủ.',
      'Sút bằng mũi chân để "cho mạnh" → thiếu chính xác và dễ đau ngón.',
    ],
    sections: [
      { heading: 'Nên tập kỹ năng nào trước?', body: 'Chuyền và khống bóng (first touch) là hai kỹ năng dùng nhiều nhất trong mọi trận. Một cú khống bóng gọn giúp bạn có thời gian xử lý; một đường chuyền chính xác giữ được bóng cho đội. Sút mạnh trông hấp dẫn nhưng ít dùng hơn — hãy xây nền từ chuyền và khống trước.' },
    ],
    tips: [
      'Tập với tường là cách rèn chuyền và khống bóng hiệu quả khi luyện một mình.',
      'Luyện cả hai chân — chỉ cần chân yếu chuyền được ngắn cũng đã lợi hại.',
    ],
    safety: ['Tập sút mạnh khi cơ đã nóng; khởi động hông và đùi trước để tránh căng cơ khi vung chân.'],
  },

  // ── BÓNG RỔ ─────────────────────────────────────────────
  {
    id: 'basketball-start',
    scope: 'sport',
    sport: 'basketball',
    exId: null,
    title: 'Nhập môn bóng rổ',
    level: 'Cơ bản',
    summary: 'Dẫn bóng, chuyền và ném rổ cơ bản để chơi được những trận đầu tiên.',
    ytQuery: 'basketball fundamentals for beginners dribbling shooting',
    media: [],
    steps: [
      { text: 'Dẫn bóng bằng đầu ngón tay (không phải lòng bàn tay), đập bóng thấp ngang hông, mắt ngẩng nhìn sân chứ không nhìn bóng.' },
      { text: 'Tư thế phòng thủ: khuỵu gối, hạ trọng tâm, hai tay dang, di chuyển bằng bước trượt ngang (không bắt chéo chân).' },
      { text: 'Chuyền ngực: cầm bóng ngang ngực, đẩy thẳng bằng cả hai tay tới ngực đồng đội, kết thúc lòng bàn tay hướng ra ngoài.' },
      { text: 'Ném rổ theo nguyên tắc BEEF: Balance (thăng bằng chân), Eyes (mắt nhắm vành rổ), Elbow (khuỷu tay thẳng dưới bóng), Follow-through (vẩy cổ tay theo sau).' },
      { text: 'Tập ném gần rổ trước (dưới bảng), thành thạo rồi mới lùi dần ra xa.' },
    ],
    mistakes: [
      'Dẫn bóng bằng lòng bàn tay và đập quá cao → dễ bị cướp bóng, khó kiểm soát.',
      'Cúi nhìn bóng khi dẫn → không quan sát được đồng đội và đối thủ.',
      'Ném bằng lực cả cánh tay đưa ngang → bóng đi thẳng đơ, thiếu vòng cung. Dùng cổ tay tạo độ xoáy và vòng cung.',
      'Phòng thủ bằng cách bắt chéo chân → mất thăng bằng, dễ bị vượt qua.',
    ],
    sections: [
      { heading: 'Tập gì trước cho nhanh chơi được?', body: 'Ưu tiên dẫn bóng ngẩng đầu và ném rổ gần. Dẫn bóng mà vẫn quan sát được sân là kỹ năng nền cho mọi pha xử lý; ném gần rổ thành thạo xây sự tự tin trước khi ném xa. Chuyền ngực chính xác giúp cả đội giữ bóng — ba thứ này đủ để nhập cuộc.' },
    ],
    tips: [
      'Tập dẫn bóng bằng cả hai tay — tay yếu dẫn được sẽ khó bị bắt bài.',
      'Ném rổ với nhịp đều: chân – tay – cổ tay thành một chuyển động liền mạch.',
    ],
    safety: [
      'Khởi động cổ chân và gối kỹ; bóng rổ dừng–bứt và bật nhảy nhiều.',
      'Tiếp đất bằng cả hai chân khuỵu gối nhẹ để giảm lực dồn lên gối.',
    ],
  },
  {
    id: 'basketball-fitness',
    scope: 'sport',
    sport: 'basketball',
    exId: null,
    title: 'Khởi động & bảo vệ cổ chân, gối',
    level: 'Cơ bản',
    summary: 'Bóng rổ nhiều pha bật nhảy và đổi hướng — khởi động đúng để tránh lật cổ chân, đau gối.',
    ytQuery: 'basketball warm up and ankle injury prevention',
    media: [],
    steps: [
      { text: 'Chạy nhẹ quanh sân 3–5 phút, rồi khởi động động: nâng cao gối, đá gót chạm mông, bước trượt ngang phòng thủ.' },
      { text: 'Xoay và làm nóng cổ chân, gối kỹ theo cả hai chiều — hai khớp dễ chấn thương nhất môn này.' },
      { text: 'Tập bật nhảy nhẹ và tiếp đất đúng: nhún nhảy tại chỗ, tiếp đất bằng cả hai chân, khuỵu gối để "hấp thụ" lực.' },
      { text: 'Chạy tăng tốc và dừng đột ngột vài lần ở cường độ vừa để cơ quen với nhịp dừng–bứt của trận đấu.' },
      { text: 'Sau trận, hạ nhiệt bằng đi bộ và giãn tĩnh bắp chân, đùi trước, đùi sau.' },
    ],
    mistakes: [
      'Vào sân bật nhảy tranh bóng ngay khi chưa khởi động → dễ lật cổ chân, đau gân gót.',
      'Tiếp đất bằng một chân hoặc chân thẳng cứng → dồn lực lên gối và cổ chân.',
      'Bỏ qua làm nóng cổ chân → tranh chấp hoặc đổi hướng là lật ngay.',
    ],
    sections: [
      { heading: 'Vì sao cổ chân hay chấn thương nhất?', body: 'Bóng rổ liên tục đổi hướng, bật nhảy và tiếp đất — thường là đáp xuống chân người khác. Cổ chân chịu lực xoắn lớn nên rất dễ lật. Làm nóng kỹ, mang giày cổ cao ôm chân và tập tiếp đất bằng hai chân là ba cách phòng ngừa hiệu quả nhất.' },
    ],
    tips: [
      'Đi giày bóng rổ cổ cao, đế bám tốt để đỡ cổ chân.',
      'Nếu từng lật cổ chân, cân nhắc băng hoặc đeo bảo vệ cổ chân khi chơi.',
    ],
    safety: [
      'Lật cổ chân → dừng chơi ngay, chườm lạnh và kê cao chân; đừng cố "đi cho hết đau".',
      'Đau gối âm ỉ kéo dài sau khi chơi → giảm cường độ và xem lại cách tiếp đất.',
    ],
  },
];

// ── Ảnh minh hoạ + nguồn tham khảo cho bài viết tay ──────
// Ảnh HERO 1 tấm/môn (giấy phép mở: Wikimedia Commons — CC0/PD/CC-BY/CC-BY-SA).
// URL đã kiểm tra tải được (image/jpeg). Không nhúng ảnh có bản quyền từ báo/blog.
const SPORT_HERO = {
  run:        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Runner_in_the_Autumn_Leaves_%2810959033655%29.jpg/1280px-Runner_in_the_Autumn_Leaves_%2810959033655%29.jpg',
  walk:       'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Moscow%2C_Kosmodamianskaya_Embankment%2C_walking_Sept_2025_01.jpg/1280px-Moscow%2C_Kosmodamianskaya_Embankment%2C_walking_Sept_2025_01.jpg',
  cycle:      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Cyclists_on_their_exclusive_lane_along_Commonwealth_Avenue%2C_Quezon_City_on_September_6%2C_2022.jpg/1280px-Cyclists_on_their_exclusive_lane_along_Commonwealth_Avenue%2C_Quezon_City_on_September_6%2C_2022.jpg',
  swim:       'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/U.S._Navy_retired_Parachute_Rigger_3rd_Class_Michael_Johnson_works_out_with_the_freestyle_stroke_during_Wounded_Warriors_swim_practice_at_Scott_Pool_121114-F-ZB240-0745.jpg/1280px-thumbnail.jpg',
  yoga:       'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Woman_practicing_yoga_at_home_with_laptop_and_weights.jpg/1280px-Woman_practicing_yoga_at_home_with_laptop_and_weights.jpg',
  badminton:  'https://upload.wikimedia.org/wikipedia/commons/0/0f/Badminton_Racket.jpg',
  pickleball: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Marlo_Sport_-_Pickleball.jpg/1280px-Marlo_Sport_-_Pickleball.jpg',
  tennis:     'https://upload.wikimedia.org/wikipedia/commons/9/99/Tennis_forehand_by_random_dave.jpeg',
  football:   'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/FIFA_World_Cup_2018_-_Kazan_Arena_-_soccer_player_with_a_ball.jpg/1280px-FIFA_World_Cup_2018_-_Kazan_Arena_-_soccer_player_with_a_ball.jpg',
  basketball: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Girl_Nyakasura_School_exploring_the_fun_in_basketball.jpg/1280px-Girl_Nyakasura_School_exploring_the_fun_in_basketball.jpg',
};

// Nguồn tham khảo uy tín (đã kiểm HTTP 200) — hiển thị link "Đọc thêm" ở cuối bài.
const SPORT_SOURCE = {
  run:        { url: 'https://www.nhs.uk/live-well/exercise/running-and-aerobic-exercises/get-running-with-couch-to-5k/', name: 'NHS – Couch to 5K (UK)' },
  walk:       { url: 'https://www.nhs.uk/live-well/exercise/walking-for-health/', name: 'NHS – Walking for health (UK)' },
  cycle:      { url: 'https://www.nhs.uk/live-well/exercise/cycling-for-beginners/', name: 'NHS – Cycling for beginners (UK)' },
  swim:       { url: 'https://www.nhs.uk/live-well/exercise/swimming-for-fitness/', name: 'NHS – Swimming for fitness (UK)' },
  yoga:       { url: 'https://www.nhs.uk/live-well/exercise/guide-to-yoga/', name: 'NHS – A guide to yoga (UK)' },
  badminton:  { url: 'https://en.wikipedia.org/wiki/Badminton', name: 'Wikipedia – Badminton' },
  pickleball: { url: 'https://usapickleball.org/what-is-pickleball/how-to-play/', name: 'USA Pickleball – How to play' },
  tennis:     { url: 'https://www.lta.org.uk/play/ways-to-play/', name: 'LTA – Ways to play tennis' },
  football:   { url: 'https://en.wikipedia.org/wiki/Association_football', name: 'Wikipedia – Association football' },
  basketball: { url: 'https://jr.nba.com/', name: 'Jr. NBA' },
};

// Ghi đè nguồn theo từng bài khi cần khác với mặc định của môn.
const SOURCE_OVERRIDE = {
  'run-form': { url: 'https://www.nhs.uk/live-well/exercise/running-and-aerobic-exercises/', name: 'NHS – Running & aerobic exercise (UK)' },
};

// Đổ ảnh hero + nguồn vào các bài chưa có (không ghi đè bài đã tự khai báo media/nguồn riêng).
GUIDES.forEach(g => {
  if ((!g.media || !g.media.length) && SPORT_HERO[g.sport]) g.media = [{ type: 'image', src: SPORT_HERO[g.sport] }];
  const s = SOURCE_OVERRIDE[g.id] || SPORT_SOURCE[g.sport];
  if (s && !g.sourceUrl) { g.sourceUrl = s.url; g.sourceName = s.name; }
});

// ── Tra cứu ─────────────────────────────────────────────
const exById = Object.fromEntries(EX.map(e => [e.id, e]));

const GENERIC_SAFETY = [
  'Khởi động kỹ trước khi tập.',
  'Bắt đầu với mức tạ nhẹ để làm quen động tác.',
  'Dừng lại nếu thấy đau bất thường.',
];

const GENERIC_SAFETY_EN = [
  'Warm up properly before you start.',
  'Begin with a light weight to learn the movement.',
  'Stop if you feel any unusual pain.',
];

// Guide dựng từ thư viện free-exercise-db (nếu bài có trong EXDB): ảnh thật + nhóm cơ + các bước.
// EN → dùng các bước gốc tiếng Anh của EXDB; VI → dùng INSTRUCTIONS_VI nếu có, ngược lại giữ EN.
const libraryGuide = exId => {
  const d = EXDB[exId];
  const ex = exById[exId];
  if (!d || !ex) return null;
  const en = isEN();
  const allMuscles = [...(d.primaryMuscles || []), ...(d.secondaryMuscles || [])];
  const vi = INSTRUCTIONS_VI[exId];
  // EN: luôn dùng bước tiếng Anh gốc. VI: ưu tiên bản dịch, thiếu thì fallback EN (đánh dấu lang).
  const steps = en
    ? (d.instructions || []).map(text => ({ text }))
    : (vi ? vi.map(text => ({ text })) : (d.instructions || []).map(text => ({ text, lang: 'en' })));
  return {
    id: 'lib-' + exId,
    scope: 'exercise',
    sport: 'gym',
    exId,
    title: ex.name,
    level: (en ? eLevel(d.level) : vLevel(d.level)) || (en ? 'Beginner' : 'Cơ bản'),
    summary: en
      ? `How to do ${ex.name} — target muscles, step-by-step and a video.`
      : `Hướng dẫn động tác ${ex.name} — nhóm cơ, các bước và video.`,
    muscles: en ? eMuscles(allMuscles) : vMuscles(allMuscles),
    equipment: en ? eEquip(d.equipment) : vEquip(d.equipment),
    ytQuery: `how to do ${ex.name}`,
    media: (d.images || []).map(src => ({ type: 'image', src })),
    steps,
    mistakes: [],
    sections: [],
    tips: [],
    safety: en ? GENERIC_SAFETY_EN : GENERIC_SAFETY,
    source: 'free-exercise-db',
  };
};

// Guide tự sinh cho bài KHÔNG có trong thư viện: vẫn có tên + nhóm cơ + nút video + lưu ý chung.
// Nhờ đó mọi bài gym đều có "📖 Hướng dẫn" để bấm ngay.
const autoExerciseGuide = exId => {
  const ex = exById[exId];
  if (!ex) return null;
  const en = isEN();
  return {
    id: 'auto-' + exId,
    auto: true,
    scope: 'exercise',
    sport: 'gym',
    exId,
    title: ex.name,
    level: en ? 'Beginner' : 'Cơ bản',
    summary: en
      ? `Watch a video guide for ${ex.name}.`
      : `Xem video hướng dẫn động tác ${ex.name}.`,
    muscles: en ? '' : ex.g, // ex.g là nhãn nhóm cơ tiếng Việt → bỏ trống ở EN thay vì hiện lẫn VN
    equipment: '',
    ytQuery: `how to do ${ex.name}`,
    media: [],
    steps: [],
    mistakes: [],
    sections: [],
    tips: [],
    safety: en ? GENERIC_SAFETY_EN : GENERIC_SAFETY,
  };
};

// Áp bản dịch tiếng Anh (GUIDES_EN, tra theo id) lên bài viết tay khi giao diện đang ở EN.
// Bài dựng động (library/auto) đã tự sinh đúng ngôn ngữ nên không có bản EN → giữ nguyên.
const localize = g => {
  if (!g) return g;
  const en = isEN() && GUIDES_EN[g.id];
  return en ? { ...g, ...en } : g;
};

// Danh sách bài VIẾT TAY (dùng cho màn duyệt — không đổ hàng trăm bài library/auto).
export const richGuides = () => GUIDES.map(localize);
export const allGuides = () => GUIDES.map(localize);
export const guideById = id => localize(GUIDES.find(g => g.id === id) || null);
export const guidesForSport = sport => GUIDES.filter(g => g.sport === sport).map(localize);
// Ưu tiên: bài viết tay → thư viện (ảnh thật) → auto stub. Mọi bài gym đều có hướng dẫn.
export const guideForExercise = exId =>
  localize(GUIDES.find(g => g.scope === 'exercise' && g.exId === exId)) || libraryGuide(exId) || autoExerciseGuide(exId);

// Nhãn nhóm cơ (EX.g là tiếng Việt) sang tiếng Anh cho "Kho bài tập gym".
const GYM_GROUP_EN = {
  'Ngực': 'Chest', 'Chân': 'Legs', 'Lưng': 'Back', 'Mông': 'Glutes',
  'Vai': 'Shoulders', 'Tay': 'Arms', 'Bụng': 'Abs',
};

// Kho bài tập gym: toàn bộ EX gom theo nhóm cơ (giữ thứ tự xuất hiện), nhãn nhóm dịch theo ngôn ngữ.
// Mỗi item chỉ cần { id, name } — GymLibrary mở guideForExercise(id) khi bấm.
export const gymLibrary = () => {
  const en = isEN();
  const groups = [];
  EX.forEach(e => {
    let grp = groups.find(x => x.key === e.g);
    if (!grp) { grp = { key: e.g, label: en ? (GYM_GROUP_EN[e.g] || e.g) : e.g, items: [] }; groups.push(grp); }
    grp.items.push({ id: e.id, name: e.name });
  });
  return groups;
};

// Tổng số động tác trong kho (cho phụ đề thẻ "folder").
export const gymExerciseCount = () => EX.length;
