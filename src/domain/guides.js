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
import { vMuscles, vEquip, vLevel } from './fitness-vocab.js';

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
];

// ── Tra cứu ─────────────────────────────────────────────
const exById = Object.fromEntries(EX.map(e => [e.id, e]));

const GENERIC_SAFETY = [
  'Khởi động kỹ trước khi tập.',
  'Bắt đầu với mức tạ nhẹ để làm quen động tác.',
  'Dừng lại nếu thấy đau bất thường.',
];

// Guide dựng từ thư viện free-exercise-db (nếu bài có trong EXDB): ảnh thật + nhóm cơ VN + các bước.
// Instructions mặc định tiếng Anh (cờ lang:'en'); nếu có bản dịch trong INSTRUCTIONS_VI → dùng VN.
const libraryGuide = exId => {
  const d = EXDB[exId];
  const ex = exById[exId];
  if (!d || !ex) return null;
  const vi = INSTRUCTIONS_VI[exId];
  const steps = vi ? vi.map(text => ({ text })) : (d.instructions || []).map(text => ({ text, lang: 'en' }));
  const muscles = vMuscles([...(d.primaryMuscles || []), ...(d.secondaryMuscles || [])]);
  return {
    id: 'lib-' + exId,
    scope: 'exercise',
    sport: 'gym',
    exId,
    title: ex.name,
    level: vLevel(d.level) || 'Cơ bản',
    summary: `Hướng dẫn động tác ${ex.name} — nhóm cơ, các bước và video.`,
    muscles,
    equipment: vEquip(d.equipment),
    ytQuery: `how to do ${ex.name}`,
    media: (d.images || []).map(src => ({ type: 'image', src })),
    steps,
    mistakes: [],
    sections: [],
    tips: [],
    safety: GENERIC_SAFETY,
    source: 'free-exercise-db',
  };
};

// Guide tự sinh cho bài KHÔNG có trong thư viện: vẫn có tên + nhóm cơ + nút video + lưu ý chung.
// Nhờ đó mọi bài gym đều có "📖 Hướng dẫn" để bấm ngay.
const autoExerciseGuide = exId => {
  const ex = exById[exId];
  if (!ex) return null;
  return {
    id: 'auto-' + exId,
    auto: true,
    scope: 'exercise',
    sport: 'gym',
    exId,
    title: ex.name,
    level: 'Cơ bản',
    summary: `Xem video hướng dẫn động tác ${ex.name}.`,
    muscles: ex.g,
    equipment: '',
    ytQuery: `how to do ${ex.name}`,
    media: [],
    steps: [],
    mistakes: [],
    sections: [],
    tips: [],
    safety: GENERIC_SAFETY,
  };
};

// Danh sách bài VIẾT TAY (dùng cho màn duyệt — không đổ hàng trăm bài library/auto).
export const richGuides = () => GUIDES;
export const allGuides = () => GUIDES;
export const guideById = id => GUIDES.find(g => g.id === id) || null;
export const guidesForSport = sport => GUIDES.filter(g => g.sport === sport);
// Ưu tiên: bài viết tay → thư viện (ảnh thật) → auto stub. Mọi bài gym đều có hướng dẫn.
export const guideForExercise = exId =>
  GUIDES.find(g => g.scope === 'exercise' && g.exId === exId) || libraryGuide(exId) || autoExerciseGuide(exId);
