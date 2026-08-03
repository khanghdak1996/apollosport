// Thư viện dùng chung cho gửi push (FCM HTTP v1) + đọc Firestore qua REST.
// KHÔNG phải endpoint — thư mục tiền tố "_" nên Vercel không route, chỉ cho import.
// Dependency-free: ký JWT service account bằng `crypto` có sẵn (không cần firebase-admin).
// Env cần (đặt trên Vercel, KHÔNG commit): FIREBASE_PROJECT_ID, FIREBASE_SA_CLIENT_EMAIL,
// FIREBASE_SA_PRIVATE_KEY. Xem PUSH-SETUP.md.
const crypto = require('crypto');

const PID = process.env.FIREBASE_PROJECT_ID || 'apollo-sport-social';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents`;
const FCM_URL = `https://fcm.googleapis.com/v1/projects/${PID}/messages:send`;
const SCOPES = 'https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/datastore';

let _tok = { value: null, exp: 0 };

// OAuth access token từ service account (cache tới gần hết hạn).
async function getAccessToken() {
  if (_tok.value && Date.now() < _tok.exp - 60000) return _tok.value;
  const email = process.env.FIREBASE_SA_CLIENT_EMAIL;
  const key = (process.env.FIREBASE_SA_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!email || !key) throw new Error('Thiếu FIREBASE_SA_CLIENT_EMAIL / FIREBASE_SA_PRIVATE_KEY');

  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' +
    b64({ iss: email, scope: SCOPES, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const sig = crypto.createSign('RSA-SHA256').update(unsigned).sign(key).toString('base64url');
  const jwt = `${unsigned}.${sig}`;

  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('OAuth thất bại: ' + JSON.stringify(j));
  _tok = { value: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
  return _tok.value;
}

// ── Firestore REST: unwrap kiểu giá trị Firestore → JS thường ──
function val(v) {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('mapValue' in v) return unwrap(v.mapValue.fields || {});
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(val);
  if ('timestampValue' in v) return v.timestampValue;
  return null; // nullValue & khác
}
function unwrap(fields) { const o = {}; for (const k in fields) o[k] = val(fields[k]); return o; }

// Đọc 1 document. Trả object fields (đã unwrap) hoặc null nếu 404.
async function fsGet(path, at) {
  const r = await fetch(`${FS_BASE}/${path}`, { headers: { Authorization: `Bearer ${at}` } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`fsGet ${path} → ${r.status}`);
  return unwrap((await r.json()).fields || {});
}

// Liệt kê document id trong 1 subcollection (chỉ cần id — vd uid thành viên). Có phân trang.
async function fsListIds(parentPath, coll, at, cap = 1000) {
  const ids = [];
  let pageToken = '';
  do {
    const u = new URL(`${FS_BASE}/${parentPath}/${coll}`);
    u.searchParams.set('pageSize', '300');
    u.searchParams.set('mask.fieldPaths', '__name__'); // chỉ lấy tên, khỏi tải field
    if (pageToken) u.searchParams.set('pageToken', pageToken);
    const r = await fetch(u, { headers: { Authorization: `Bearer ${at}` } });
    if (!r.ok) break;
    const j = await r.json();
    for (const d of j.documents || []) ids.push(d.name.split('/').pop());
    pageToken = j.nextPageToken || '';
  } while (pageToken && ids.length < cap);
  return ids;
}

// Gom tất cả FCM token của 1 tập uid (đọc users/{uid}/private/push.tokens map).
async function tokensForUsers(uids, at) {
  const out = new Set();
  await Promise.all([...new Set(uids)].filter(Boolean).map(async (uid) => {
    try {
      const d = await fsGet(`users/${uid}/private/push`, at);
      const tokens = d && d.tokens;
      if (tokens && typeof tokens === 'object') for (const tk of Object.keys(tokens)) out.add(tk);
    } catch { /* bỏ qua user lỗi */ }
  }));
  return [...out];
}

// Gửi tới 1 token. webpush.notification để trình duyệt tự hiện kể cả khi app đóng;
// fcm_options.link xử lý click. Trả 'ok' | 'stale' (token chết) | 'err'.
async function sendToToken(token, msg, at) {
  const url = msg.url || '/';
  const body = {
    message: {
      token,
      data: { url, tag: msg.tag || '' },
      webpush: {
        notification: { title: msg.title, body: msg.body || '', icon: '/assets/icon-192.png', badge: '/assets/icon-192.png', tag: msg.tag || undefined },
        fcm_options: { link: url },
      },
    },
  };
  const r = await fetch(FCM_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${at}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (r.ok) return 'ok';
  const txt = await r.text().catch(() => '');
  // Token không còn hợp lệ → nên dọn (chặng sau). UNREGISTERED / NOT_FOUND / INVALID_ARGUMENT.
  if (r.status === 404 || /UNREGISTERED|NOT_FOUND/.test(txt)) return 'stale';
  console.error('FCM send error', r.status, txt.slice(0, 300));
  return 'err';
}

// Gửi tới nhiều token song song. Trả { sent, stale }.
async function sendToTokens(tokens, msg, at) {
  let sent = 0, stale = 0;
  await Promise.all(tokens.map(async (tk) => {
    const s = await sendToToken(tk, msg, at).catch(() => 'err');
    if (s === 'ok') sent++; else if (s === 'stale') stale++;
  }));
  return { sent, stale };
}

module.exports = { getAccessToken, fsGet, fsListIds, tokensForUsers, sendToTokens };
