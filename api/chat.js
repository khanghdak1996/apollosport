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

Vai trò & phạm vi:
- Tư vấn chung về tập luyện (gym, chạy bộ, đạp xe, bơi, yoga, các môn thể thao), kỹ thuật cơ bản, lên lịch tập, khởi động/giãn cơ, phục hồi, và dinh dưỡng lành mạnh cho người tập.
- Trả lời NGẮN GỌN, thân thiện, dễ hiểu, bằng TIẾNG VIỆT. Ưu tiên gợi ý thực tế, có thể áp dụng ngay. Dùng gạch đầu dòng khi liệt kê.

Giới hạn an toàn (quan trọng):
- KHÔNG chẩn đoán bệnh, KHÔNG kê đơn thuốc, KHÔNG đưa phác đồ điều trị y tế. Nếu người dùng mô tả chấn thương nặng, đau bất thường, hay dấu hiệu bệnh lý, hãy khuyên họ gặp bác sĩ / chuyên gia y tế.
- Không đưa lời khuyên giảm cân cực đoan, nhịn ăn hại sức khoẻ, hay dùng chất cấm/doping.
- Nếu câu hỏi nằm ngoài chủ đề tập luyện & dinh dưỡng, hãy lịch sự nói rằng bạn chỉ hỗ trợ về tập luyện và dinh dưỡng.`;

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
