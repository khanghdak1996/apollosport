import {
  GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  setPersistence, browserLocalPersistence, onAuthStateChanged, signOut,
} from 'fb/auth';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'fb/firestore';
import { auth, db, reportCloudError } from './firebase.js';
import { ALLOWED_DOMAINS, emailAllowed } from './config.js';
import { deleteAllMySessions } from './data/repo-sessions.js';
import { removeMyEntries } from './data/repo-leaderboard.js';
import { t } from './i18n.js';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ hd: ALLOWED_DOMAINS[0], prompt: 'select_account' });

// iOS in-app webview (Facebook/Zalo/Instagram...) chặn popup -> dùng redirect.
const isInAppWebview = () => {
  const ua = navigator.userAgent || '';
  return /(FBAN|FBAV|Instagram|Line|Zalo|Twitter)/i.test(ua)
      || (/iPhone|iPad|iPod/i.test(ua) && !/Safari/i.test(ua));
};

// App đã cài (standalone PWA) không mở được cửa sổ popup -> phải dùng redirect.
const isStandalonePWA = () =>
  (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches)
  || window.navigator.standalone === true;

const ACCENTS = ['#0084ff', '#6366f1', '#db2777', '#f97316', '#06b6d4', '#22c55e', '#a855f7', '#ef4444', '#0ea5e9', '#eab308'];
export const pickAccent = (uid) => {
  let h = 0;
  for (let i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
};

// Đăng nhập Google. Ném lỗi (tiếng Việt) nếu email không thuộc domain công ty.
export async function signIn() {
  await setPersistence(auth, browserLocalPersistence);
  if (isInAppWebview() || isStandalonePWA()) {
    await signInWithRedirect(auth, provider);
    return null; // trang sẽ reload; kết quả xử lý ở consumeRedirect()
  }
  const cred = await signInWithPopup(auth, provider);
  return await gate(cred.user);
}

// Gọi 1 lần lúc khởi động để bắt kết quả redirect (nếu có).
export async function consumeRedirect() {
  try {
    const res = await getRedirectResult(auth);
    if (res?.user) return await gate(res.user);
  } catch (e) { /* bỏ qua nếu không có redirect */ }
  return null;
}

async function gate(user) {
  if (!emailAllowed(user.email)) {
    await signOut(auth);
    throw new Error(`Chỉ tài khoản @${ALLOWED_DOMAINS[0]} mới được sử dụng ứng dụng này.`);
  }
  return user;
}

export const watchAuth = (cb) => onAuthStateChanged(auth, cb);
export const signOutUser = () => signOut(auth);

// Xoá tài khoản: dữ liệu tập + entry xếp hạng + cân nặng riêng tư + hồ sơ, rồi xoá auth.
// Best-effort (không có Cloud Function). Ảnh trong Storage để dọn sau bằng lifecycle rule.
export async function deleteMyAccount(uid) {
  try { await deleteAllMySessions(uid); } catch (e) { reportCloudError(t('err.deleteSessions'), e); }
  try { await removeMyEntries(uid); } catch (e) { /* bỏ qua */ }
  try { await deleteDoc(doc(db, 'users', uid, 'private', 'weights')); } catch (e) { /* có thể không tồn tại */ }
  try { await deleteDoc(doc(db, 'users', uid)); } catch (e) { reportCloudError(t('err.deleteProfile'), e); }
  try { await auth.currentUser?.delete(); }
  catch (e) { await signOut(auth); throw new Error(t('err.reauth')); }
}

// Tạo/đồng bộ users/{uid}. Trả { doc, firstLogin }.
export async function ensureUserDoc(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  const name = user.displayName || user.email.split('@')[0];
  if (!snap.exists()) {
    const fresh = {
      uid: user.uid, email: user.email, name,
      photoURL: user.photoURL || null,
      dept: '', center: '', title: '',
      accent: pickAccent(user.uid),
      prefs: { defaultVisibility: 'company', optOutLeaderboard: false, hideWeight: true, onboarded: false },
      streak: { current: 0, longest: 0, lastDate: null },
      badges: [],
      totals: { sessions: 0, minutes: 0, points: 0, volumeKg: 0 },
      createdAt: serverTimestamp(), lastActiveAt: serverTimestamp(),
    };
    await setDoc(ref, fresh);
    return { doc: fresh, firstLogin: true };
  }
  // đồng bộ tên/ảnh Google + lastActive
  await setDoc(ref, { name, photoURL: user.photoURL || null, lastActiveAt: serverTimestamp() }, { merge: true });
  return { doc: { ...snap.data(), name, photoURL: user.photoURL || null }, firstLogin: false };
}
