// Vercel serverless — gửi thông báo đẩy (FCM). Client gọi sau khi thả tim / bình luận /
// mời CLB / đăng thông báo nhóm-mục tiêu. NỘI DUNG soạn ở SERVER (client chỉ gửi loại + id)
// để không cho gửi thông báo tuỳ ý. Verify Firebase ID token như api/chat.js.
//
// CHỐNG GIẢ MẠO (không tin client):
//  1) TÊN người gửi lấy từ users/{caller}.name theo uid đăng nhập — KHÔNG dùng actorName body.
//  2) reaction/comment phải TỒN TẠI thật trong Firestore (đúng của caller) mới gửi — chống bịa
//     "X đã thả tim" khi không hề thả. preview bình luận lấy từ chính doc, không tin body.
//  3) Cooldown per (caller, mục tiêu) chống spam đẩy do bật/tắt tim liên tục.
// Người nhận + token đọc bằng service account (bỏ qua rules). Xem api/_lib/fcm.js + PUSH-SETUP.md.
const { getAccessToken, fsGet, fsListIds, fsPatch, tokensForUsers, sendToTokens } = require('./_lib/fcm.js');

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyBUUbB149e2J_mZHulhbcYtXyUy2JbhN0k';
const ALLOWED_DOMAIN = 'apollo.edu.vn';
const ALLOWED_ORIGINS = [
  'https://apollosport.vercel.app',
  'http://localhost:8137', 'http://127.0.0.1:8137',
  'http://localhost:8146', 'http://127.0.0.1:8146',
];
const COOLDOWN_MS = 4000; // khoảng nghỉ tối thiểu giữa 2 push cùng mục tiêu từ 1 người

function send(res, status, obj) { res.status(status).json(obj); }
const clip = (s, n) => (typeof s === 'string' ? s : '').replace(/\s+/g, ' ').trim().slice(0, n);

// Cho phép gửi push cho (caller, tag) này không? Ghi mốc thời gian để chặn spam bật/tắt.
// Fail-open: lỗi đọc/ghi mốc KHÔNG được chặn thông báo thật (ưu tiên khả dụng).
async function rateOk(caller, tag, at) {
  if (!tag) return true;
  const id = `${caller}_${tag}`.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 200);
  try {
    const d = await fsGet(`notifyRate/${id}`, at);
    const last = (d && Number(d.at)) || 0;
    if (Date.now() - last < COOLDOWN_MS) return false;
    await fsPatch(`notifyRate/${id}`, { at: Date.now() }, at);
    return true;
  } catch { return true; }
}

// Xây "job" push theo loại: trả { uids:[người nhận], title, body, url, tag } hoặc null.
// caller = uid người gọi (server-verified). actor = TÊN THẬT theo users/{caller}.name. at = access token.
async function buildJob(type, b, caller, actor, at) {
  const url = '/';
  switch (type) {
    case 'reaction':
    case 'comment': {
      if (!b.sessionId) return null;
      const s = await fsGet(`sessions/${b.sessionId}`, at);
      if (!s || !s.authorUid || s.authorUid === caller) return null; // không tự báo mình
      const what = clip(s.title, 40) || 'buổi tập';
      if (type === 'reaction') {
        // Phải có doc reaction thật của caller trên bài này (reactions/{caller}).
        const r = await fsGet(`sessions/${b.sessionId}/reactions/${caller}`, at);
        if (!r || r.uid !== caller) return null;
        return { uids: [s.authorUid], title: `${actor} đã thả tim`, body: `bài "${what}" của bạn`, url, tag: `react:${b.sessionId}` };
      }
      // comment: phải có doc bình luận thật của caller (client gửi kèm commentId). preview lấy từ doc.
      if (!b.commentId) return null;
      const c = await fsGet(`sessions/${b.sessionId}/comments/${b.commentId}`, at);
      if (!c || c.uid !== caller) return null;
      const preview = clip(c.text, 80);
      return { uids: [s.authorUid], title: `${actor} đã bình luận`, body: preview || `bài "${what}" của bạn`, url, tag: `cmt:${b.sessionId}` };
    }
    case 'clubInvite': {
      if (!b.clubId || !b.toUid || b.toUid === caller) return null;
      const club = await fsGet(`clubs/${b.clubId}`, at);
      if (!club || club.ownerUid !== caller) return null; // chỉ chủ nhóm được mời
      return { uids: [b.toUid], title: 'Lời mời câu lạc bộ', body: `${actor} mời bạn vào CLB ${clip(club.name, 50)}`, url, tag: `invite:${b.clubId}` };
    }
    case 'clubPost': {
      if (!b.id) return null;
      const club = await fsGet(`clubs/${b.id}`, at);
      if (!club || club.ownerUid !== caller) return null; // chỉ chủ nhóm đăng
      const uids = (await fsListIds(`clubs/${b.id}`, 'members', at)).filter(u => u !== caller);
      if (!uids.length) return null;
      return { uids, title: `CLB ${clip(club.name, 50)}`, body: clip(b.preview, 90) || 'có thông báo mới', url, tag: `clubpost:${b.id}` };
    }
    case 'goalPost': {
      if (!b.id) return null;
      const goal = await fsGet(`goals/${b.id}`, at);
      if (!goal) return null;
      if (goal.creatorUid !== caller) return null; // chỉ người tạo mục tiêu đăng
      const uids = (await fsListIds(`goals/${b.id}`, 'progress', at)).filter(u => u !== caller);
      if (!uids.length) return null;
      return { uids, title: `Mục tiêu: ${clip(goal.title, 50)}`, body: clip(b.preview, 90) || 'có thông báo mới', url, tag: `goalpost:${b.id}` };
    }
    default: return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return send(res, 403, { error: 'Origin không được phép' });

  if (!process.env.FIREBASE_SA_CLIENT_EMAIL || !process.env.FIREBASE_SA_PRIVATE_KEY) {
    return send(res, 500, { error: 'Chưa cấu hình service account trên server' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return send(res, 400, { error: 'Body không hợp lệ' }); } }
  body = body || {};

  // Verify token (inline — Identity Toolkit, đọc body 1 lần).
  let caller;
  try {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: body.idToken }),
    });
    const u = r.ok && ((await r.json()).users || [])[0];
    const email = (u && u.email || '').toLowerCase();
    if (!u || u.emailVerified !== true || !email.endsWith('@' + ALLOWED_DOMAIN)) {
      return send(res, 401, { error: 'Chưa đăng nhập hoặc tài khoản không hợp lệ' });
    }
    caller = u.localId;
  } catch { return send(res, 401, { error: 'Xác thực thất bại' }); }

  try {
    const at = await getAccessToken();
    // TÊN người gửi lấy từ hồ sơ theo uid đăng nhập (chống giả mạo tên qua body).
    const callerDoc = await fsGet(`users/${caller}`, at);
    const actor = clip(callerDoc && callerDoc.name, 40) || 'Ai đó';

    const job = await buildJob(body.type, body, caller, actor, at);
    if (!job || !job.uids.length) return send(res, 200, { sent: 0 });

    // Chống spam: cùng người + cùng mục tiêu trong cooldown → bỏ qua (đã có push gần đây).
    if (!(await rateOk(caller, job.tag, at))) return send(res, 200, { sent: 0, throttled: true });

    const tokens = await tokensForUsers(job.uids, at);
    if (!tokens.length) return send(res, 200, { sent: 0 });

    const { sent, stale } = await sendToTokens(tokens, job, at);
    return send(res, 200, { sent, stale });
  } catch (e) {
    console.error('notify exception', e);
    return send(res, 502, { error: 'Gửi thông báo thất bại' });
  }
};
