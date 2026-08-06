// Vercel serverless — chấm điểm xếp hạng SERVER-AUTHORITATIVE. Client gọi sau khi lưu/xoá/đổi
// visibility buổi tập; server đọc buổi THẬT của người gọi rồi ghi lại totals + entry leaderboard
// (client bị firestore.rules cấm ghi trực tiếp). Verify Firebase ID token như api/notify.js.
//
// Body: { idToken, dates?: ['YYYY-MM-DD'], all?: true }.
//  - Mặc định: tính lại cho CHÍNH người gọi (uid từ token). `dates` = ngày buổi vừa đổi (để xoá
//    entry mồ côi khi xoá buổi cuối của kỳ).
//  - all=true: backfill TOÀN BỘ user — chỉ app-admin (admins/{uid}) gọi được (chạy 1 lần sau deploy).
const { getAccessToken, fsGet } = require('./_lib/fcm.js');
const { recomputeUser, allAuthorUids } = require('./_lib/scoring.js');

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyBUUbB149e2J_mZHulhbcYtXyUy2JbhN0k';
const ALLOWED_DOMAIN = 'apollo.edu.vn';
const ALLOWED_ORIGINS = [
  'https://apollosport.vercel.app',
  'http://localhost:8137', 'http://127.0.0.1:8137',
  'http://localhost:8146', 'http://127.0.0.1:8146',
];

function send(res, status, obj) { res.status(status).json(obj); }

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

  // Verify token (Identity Toolkit, khoá @apollo.edu.vn + email_verified) — như api/notify.js.
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

    if (body.all === true) {
      const adminDoc = await fsGet(`admins/${caller}`, at);
      if (!adminDoc) return send(res, 403, { error: 'Chỉ admin được backfill toàn bộ' });
      const uids = await allAuthorUids(at);
      for (const uid of uids) await recomputeUser(uid, at);
      return send(res, 200, { ok: true, users: uids.length });
    }

    const dates = Array.isArray(body.dates) ? body.dates.filter((d) => typeof d === 'string').slice(0, 8) : [];
    const out = await recomputeUser(caller, at, dates);
    return send(res, 200, { ok: true, ...out });
  } catch (e) {
    console.error('score exception', e);
    return send(res, 502, { error: 'Chấm điểm thất bại' });
  }
};
