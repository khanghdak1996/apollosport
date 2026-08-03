// Thông báo đẩy phía client (Firebase Cloud Messaging).
// Luồng: đăng ký service worker (/firebase-messaging-sw.js) → xin quyền Notification →
// getToken(vapidKey) → lưu token vào users/{uid}/private/push (rules: chỉ chủ đọc/ghi;
// server dùng service account bỏ qua rules để đọc token mà gửi push ở chặng 2).
// Token lưu dạng map { tokens: { <token>: {at, ua} } } để thêm/gỡ từng thiết bị dễ dàng.
import { getMessaging, getToken, deleteToken, onMessage, isSupported } from 'fb/messaging';
import { doc, setDoc, updateDoc, deleteField } from 'fb/firestore';
import { db, auth, reportCloudError } from '../firebase.js';
import { PUSH, pushConfigured } from '../config.js';

// Nhờ server gửi push (thả tim/bình luận/CLB/mục tiêu). Fire-and-forget: KHÔNG chặn UI,
// KHÔNG ném lỗi. Nội dung do server soạn — client chỉ gửi loại + id + tên người thao tác.
export async function notifyServer(payload) {
  try {
    if (!pushConfigured()) return;
    const u = auth?.currentUser;
    if (!u) return;
    const idToken = await u.getIdToken();
    fetch(PUSH.notifyEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, ...payload }),
      keepalive: true,
    }).catch(() => {});
  } catch { /* im lặng */ }
}

// Thông báo CỤC BỘ (không qua server) — vd đồng hồ nghỉ gym hết giờ khi app ở nền.
// Chỉ hiện nếu đã cấp quyền; ưu tiên qua service worker (ổn trên mobile).
export function notifyLocal(title, body = '') {
  try {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    const opt = { body, icon: '/assets/icon-192.png', badge: '/assets/icon-192.png', tag: 'rest-timer', data: { url: '/' } };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => reg.showNotification(title, opt)).catch(() => { try { new Notification(title, opt); } catch {} });
    } else { new Notification(title, opt); }
  } catch { /* im lặng */ }
}

const SW_URL = '/firebase-messaging-sw.js';
const LS_TOKEN = 'push:token';   // token hiện tại của thiết bị này (để gỡ khi tắt)
const LS_ON = 'push:on';         // '1' nếu người dùng đã bật ở thiết bị này

let _messaging = null;
async function messaging() {
  if (_messaging) return _messaging;
  if (!(await isSupported())) return null;
  try { _messaging = getMessaging(); } catch { _messaging = null; }
  return _messaging;
}

// Trình duyệt có hỗ trợ push không (Notification + SW + FCM). iOS chỉ hỗ trợ khi đã
// "Add to Home Screen" và iOS ≥ 16.4.
export async function pushSupported() {
  return typeof Notification !== 'undefined'
    && 'serviceWorker' in navigator
    && (await isSupported().catch(() => false));
}

// Trạng thái để vẽ toggle: 'unconfigured' | 'unsupported' | 'denied' | 'on' | 'off'.
export async function pushStatus() {
  if (!pushConfigured()) return 'unconfigured';
  if (!(await pushSupported())) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  return (Notification.permission === 'granted' && localStorage.getItem(LS_ON) === '1') ? 'on' : 'off';
}

async function pushDocRef() {
  const uid = auth?.currentUser?.uid;
  return uid ? doc(db, 'users', uid, 'private', 'push') : null;
}

// Bật: trả { ok, reason }. reason ∈ unconfigured|unsupported|denied|error khi ok=false.
export async function enablePush() {
  if (!pushConfigured()) return { ok: false, reason: 'unconfigured' };
  if (!(await pushSupported())) return { ok: false, reason: 'unsupported' };
  try {
    const reg = await navigator.serviceWorker.register(SW_URL);
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return { ok: false, reason: 'denied' };

    const m = await messaging();
    if (!m) return { ok: false, reason: 'unsupported' };
    const token = await getToken(m, { vapidKey: PUSH.vapidKey, serviceWorkerRegistration: reg });
    if (!token) return { ok: false, reason: 'error' };

    const ref = await pushDocRef();
    if (ref) {
      await setDoc(ref, { tokens: { [token]: { at: Date.now(), ua: (navigator.userAgent || '').slice(0, 120) } } }, { merge: true });
    }
    localStorage.setItem(LS_TOKEN, token);
    localStorage.setItem(LS_ON, '1');
    initForeground();
    return { ok: true };
  } catch (e) {
    reportCloudError('Bật thông báo đẩy thất bại', e);
    return { ok: false, reason: 'error' };
  }
}

// Tắt ở thiết bị này: xoá token khỏi FCM + khỏi Firestore + cờ local.
export async function disablePush() {
  const token = localStorage.getItem(LS_TOKEN);
  try {
    const m = await messaging();
    if (m) await deleteToken(m).catch(() => {});
    const ref = await pushDocRef();
    if (ref && token) await updateDoc(ref, { [`tokens.${token}`]: deleteField() }).catch(() => {});
  } catch (e) {
    reportCloudError('Tắt thông báo đẩy thất bại', e);
  } finally {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_ON);
  }
  return { ok: true };
}

// Message khi app đang MỞ (foreground). SW chỉ chạy khi app nền, nên tự hiện ở đây.
let _fgBound = false;
export async function initForeground() {
  if (_fgBound) return;
  if (Notification?.permission !== 'granted' || localStorage.getItem(LS_ON) !== '1') return;
  const m = await messaging();
  if (!m) return;
  _fgBound = true;
  onMessage(m, (payload) => {
    const n = payload?.notification || {};
    const d = payload?.data || {};
    const title = n.title || d.title;
    if (!title) return;
    navigator.serviceWorker.ready.then(reg => reg.showNotification(title, {
      body: n.body || d.body || '', icon: '/assets/icon-192.png', badge: '/assets/icon-192.png',
      tag: d.tag || undefined, data: { url: d.url || '/' },
    })).catch(() => {});
  });
}
