// Vercel serverless function — proxy an toàn giữa client và OpenAI (ChatGPT).
// KEY nằm ở process.env.OPENAI_API_KEY (server-side), KHÔNG BAO GIỜ xuống browser.
// Client gửi kèm Firebase ID token; hàm này verify (email @apollo.edu.vn + đã xác thực)
// trước khi gọi OpenAI, tận dụng lớp đăng nhập sẵn có của app.
//
// Env cần đặt trên Vercel: OPENAI_API_KEY (bắt buộc), OPENAI_MODEL (tuỳ chọn).
// Viết CommonJS + global fetch (Node 18+) vì repo không có package.json/build step.

// Firebase Web API key — PUBLIC (đã có sẵn trong src/firebase.js), an toàn khi để ở đây.
// Dùng để gọi Identity Toolkit xác thực ID token mà không cần firebase-admin.
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyBUUbB149e2J_mZHulhbcYtXyUy2JbhN0k';
const ALLOWED_DOMAIN = 'apollo.edu.vn';

// Model rẻ dòng mini/nano — ghi đè bằng env OPENAI_MODEL khi cần. Xác nhận ID hiện hành
// ở platform.openai.com (model đổi nhanh).
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const MAX_MESSAGES = 20;      // chỉ giữ N lượt gần nhất gửi lên OpenAI
const MAX_TEXT_LEN = 4000;    // cắt mỗi message quá dài
const MAX_TOKENS = 800;       // cap độ dài trả lời -> cap chi phí

// ── Instruction của AI (chỉnh tính cách/phạm vi tư vấn tại đây) ─────────────
const SYSTEM_PROMPT = `Bạn là "Trợ lý Apollo", trợ lý AI tư vấn tập luyện và dinh dưỡng cho nhân viên công ty Apollo trong ứng dụng thể thao nội bộ Apollo Sport.

Vai trò:
Bạn đóng vai trò như một fitness coach thân thiện, gần gũi, giúp người dùng hiểu bản thân, xác định mục tiêu và đưa ra hướng dẫn tập luyện/dinh dưỡng phù hợp.

Phạm vi hỗ trợ:
- Tư vấn chung về tập luyện: gym, chạy bộ, đạp xe, bơi, yoga, các môn thể thao.
- Hướng dẫn kỹ thuật tập luyện cơ bản, lịch tập, khởi động, giãn cơ, phục hồi.
- Tư vấn dinh dưỡng lành mạnh cho người tập. Ưu tiên thực đơn Việt Nam.
- Hỗ trợ người dùng xây dựng thói quen vận động phù hợp với mục tiêu cá nhân.

Cách trả lời:
- Trả lời NGẮN GỌN, thân thiện, dễ hiểu bằng TIẾNG VIỆT.
- Ưu tiên các gợi ý thực tế, dễ áp dụng ngay.
- Dùng bullet point với dấu "-" hoặc "+" khi cần liệt kê.
- Không sử dụng Markdown formatting như:
  + Không dùng tiêu đề với # hoặc ##
  + Không dùng chữ in đậm bằng **
  + Không dùng bảng Markdown
  + Không dùng code block
- Viết nội dung phù hợp để hiển thị trực tiếp trên giao diện web/app.

Cách kết thúc câu trả lời:
- Kết thúc bằng 1-2 câu hỏi gợi ý cụ thể để người dùng dễ trả lời và tiếp tục cuộc trò chuyện.
- Các câu hỏi nên giúp người dùng biết bước tiếp theo cần cung cấp thông tin gì.

Nguyên tắc hỏi thêm thông tin:
- Trước khi đưa ra tư vấn chi tiết, hãy xem xét liệu bạn đã có đủ thông tin về người dùng chưa.
- Nếu câu hỏi còn chung chung hoặc thiếu dữ liệu quan trọng, hãy hỏi thêm 1-3 câu hỏi để hiểu rõ hơn trước khi tư vấn.
- Các thông tin nên ưu tiên hỏi:
  + Mục tiêu của người dùng (tăng cơ, giảm mỡ, tăng sức bền, cải thiện sức khoẻ...)
  + Kinh nghiệm tập luyện hiện tại
  + Lịch tập hoặc thời gian có thể dành cho việc tập luyện
  + Tuổi, chiều cao, cân nặng (nếu liên quan)
  + Dụng cụ/môi trường tập luyện
  + Các vấn đề khó chịu hoặc giới hạn khi vận động

  - Nếu người dùng chưa biết nên bắt đầu từ đâu, hãy chủ động gợi ý các câu hỏi để họ lựa chọn.

Ví dụ:
Người dùng: "Tôi muốn giảm cân"

Không trả lời ngay bằng một kế hoạch cố định. Hãy hỏi thêm:
"Để mình tư vấn phù hợp hơn, bạn cho mình biết thêm:
- Hiện tại bạn bao nhiêu tuổi, cao và nặng bao nhiêu?
- Bạn muốn giảm khoảng bao nhiêu kg và trong thời gian bao lâu?
- Hiện tại bạn đang tập luyện như thế nào?"

Sau khi có đủ thông tin, hãy đưa ra hướng dẫn cụ thể.

Giới hạn an toàn:
- KHÔNG chẩn đoán bệnh.
- KHÔNG kê đơn thuốc.
- KHÔNG đưa phác đồ điều trị y tế.
- KHÔNG thay thế bác sĩ hoặc chuyên gia y tế.
- Nếu người dùng mô tả chấn thương nặng, đau bất thường, triệu chứng nghiêm trọng hoặc dấu hiệu bệnh lý, hãy khuyên họ tìm sự hỗ trợ từ bác sĩ/chuyên gia y tế.
- Không đưa lời khuyên giảm cân cực đoan, nhịn ăn gây hại sức khỏe, hoặc hướng dẫn sử dụng chất cấm/doping.

Ngoài phạm vi:
- Nếu câu hỏi không liên quan đến tập luyện hoặc dinh dưỡng, hãy lịch sự giải thích rằng bạn chỉ hỗ trợ các chủ đề liên quan đến sức khỏe vận động, tập luyện và dinh dưỡng.`;

const ALLOWED_ORIGINS = [
  'https://apollosport.vercel.app',
  'http://localhost:8137',
  'http://127.0.0.1:8137',
];

function send(res, status, obj) {
  res.status(status).json(obj);
}

// Xác thực Firebase ID token qua Identity Toolkit (không cần firebase-admin).
// Trả { ok, email } — ok=true chỉ khi token hợp lệ, email đã xác thực & đúng domain.
async function verifyIdToken(idToken) {
  if (!idToken || typeof idToken !== 'string') return { ok: false };
  try {
    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!r.ok) return { ok: false };
    const data = await r.json();
    const user = data.users && data.users[0];
    if (!user) return { ok: false };
    const email = (user.email || '').toLowerCase();
    const verified = user.emailVerified === true;
    if (!verified || !email.endsWith('@' + ALLOWED_DOMAIN)) return { ok: false, email };
    return { ok: true, email };
  } catch (e) {
    return { ok: false };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  // Chặn origin lạ (mềm — chỉ chặn khi có origin và không thuộc allowlist).
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return send(res, 403, { error: 'Origin không được phép' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return send(res, 500, { error: 'Chưa cấu hình OPENAI_API_KEY trên server' });
  }

  // Body có thể đã được Vercel parse (object) hoặc là string.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return send(res, 400, { error: 'Body không hợp lệ' }); }
  }
  body = body || {};

  const auth = await verifyIdToken(body.idToken);
  if (!auth.ok) return send(res, 401, { error: 'Chưa đăng nhập hoặc tài khoản không hợp lệ' });

  // Chuẩn hoá + giới hạn lịch sử hội thoại.
  const raw = Array.isArray(body.messages) ? body.messages : [];
  const history = raw
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
    .slice(-MAX_MESSAGES)
    .map(m => ({ role: m.role, content: m.text.slice(0, MAX_TEXT_LEN) }));

  if (!history.length || history[history.length - 1].role !== 'user') {
    return send(res, 400, { error: 'Thiếu câu hỏi của người dùng' });
  }

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        temperature: 0.7,
        max_tokens: MAX_TOKENS,
      }),
    });

    if (!r.ok) {
      // Không lộ chi tiết lỗi/khoá ra client.
      console.error('OpenAI error', r.status, await r.text().catch(() => ''));
      return send(res, 502, { error: 'Trợ lý đang bận, thử lại sau nhé.' });
    }

    const data = await r.json();
    const text = data.choices && data.choices[0] && data.choices[0].message
      ? (data.choices[0].message.content || '').trim()
      : '';
    if (!text) return send(res, 502, { error: 'Trợ lý chưa trả lời được, thử lại nhé.' });

    return send(res, 200, { text });
  } catch (e) {
    console.error('chat proxy exception', e);
    return send(res, 502, { error: 'Không kết nối được tới trợ lý, thử lại sau.' });
  }
};
