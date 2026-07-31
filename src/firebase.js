import { initializeApp } from 'fb/app';
import { getFirestore, connectFirestoreEmulator } from 'fb/firestore';
import { getAuth, onAuthStateChanged, connectAuthEmulator } from 'fb/auth';
import { getStorage, connectStorageEmulator } from 'fb/storage';

// Production dùng CHÍNH domain app làm authDomain (proxy /__/auth/* -> firebaseapp.com khai
// báo trong vercel.json). Cần cho signInWithRedirect trong standalone PWA trên iOS: Safari
// cô lập storage khi trang auth ở domain khác -> mất phiên -> lặp lại màn đăng nhập.
// Localhost giữ authDomain mặc định của Firebase (không có proxy khi chạy máy).
const AUTH_DOMAIN = ['localhost', '127.0.0.1'].includes(location.hostname)
  ? 'apollo-sport-social.firebaseapp.com'
  : 'apollosport.vercel.app';

const firebaseConfig = {
  apiKey: "AIzaSyBUUbB149e2J_mZHulhbcYtXyUy2JbhN0k",
  authDomain: AUTH_DOMAIN,
  projectId: "apollo-sport-social",
  storageBucket: "apollo-sport-social.firebasestorage.app",
  messagingSenderId: "368506443580",
  appId: "1:368506443580:web:a553f151fe5894a1a3f039",
  measurementId: "G-RMX3YR931J"
};

export let auth = null, db = null, storage = null, fbInitError = null;

// AN TOÀN PRODUCTION: localhost MẶC ĐỊNH dùng emulator để việc dev/test KHÔNG bao giờ
// đụng vào cloud thật (đã có người dùng thật). Muốn test trên cloud thật ở localhost
// (vd: kiểm tra Google đăng nhập thật), cố ý bật cờ: thêm ?real vào URL hoặc đặt
// localStorage.useRealCloud='1'. Bản deploy (không phải localhost) LUÔN dùng cloud thật.
export const useRealCloud = () =>
  localStorage.getItem('useRealCloud') === '1' || location.search.includes('real');

export const useEmulator = () =>
  ['localhost', '127.0.0.1'].includes(location.hostname) && !useRealCloud();

let cloudErrorHandler = null;
export const setCloudErrorHandler = (fn) => { cloudErrorHandler = fn; };
export const reportCloudError = (ctx, e) => {
  console.warn(ctx, e);
  if (cloudErrorHandler) cloudErrorHandler(`${ctx}: ${e?.code || e?.message || e}`);
};

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  if (useEmulator()) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    console.info('[firebase] EMULATOR cục bộ — dữ liệu test KHÔNG đụng cloud thật. (Cần chạy: firebase emulators:start)');
  } else if (['localhost', '127.0.0.1'].includes(location.hostname)) {
    console.warn('[firebase] ⚠️ localhost đang nối CLOUD THẬT (?real). Mọi thao tác ghi vào dữ liệu người dùng thật!');
  }
} catch (e) {
  fbInitError = `Khởi tạo Firebase thất bại: ${e?.code || e?.message || e}`;
  console.warn('Firebase init failed, app will run local-only', e);
}

// Alias tương thích ngược cho lớp data cũ (data/cloud.js). fbReady resolve khi đã có user.
export const fbDb = db;
export const fbStorage = storage;
export const fbReady = new Promise((resolve) => {
  if (!auth) return resolve(false);
  const unsub = onAuthStateChanged(auth, (u) => { if (u) { unsub(); resolve(true); } });
});
