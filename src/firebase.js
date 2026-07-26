import { initializeApp } from 'fb/app';
import { getFirestore, connectFirestoreEmulator } from 'fb/firestore';
import { getAuth, onAuthStateChanged, connectAuthEmulator } from 'fb/auth';
import { getStorage, connectStorageEmulator } from 'fb/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBUUbB149e2J_mZHulhbcYtXyUy2JbhN0k",
  authDomain: "apollo-sport-social.firebaseapp.com",
  projectId: "apollo-sport-social",
  storageBucket: "apollo-sport-social.firebasestorage.app",
  messagingSenderId: "368506443580",
  appId: "1:368506443580:web:a553f151fe5894a1a3f039",
  measurementId: "G-RMX3YR931J"
};

export let auth = null, db = null, storage = null, fbInitError = null;

// Chạy emulator khi ở localhost VÀ bật cờ (localStorage.useEmulator='1' hoặc ?emu ở URL).
// Mặc định: dùng project thật ngay cả trên localhost, để test Google đăng nhập thật.
export const useEmulator = () =>
  ['localhost', '127.0.0.1'].includes(location.hostname)
  && (localStorage.getItem('useEmulator') === '1' || location.search.includes('emu'));

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
    console.info('[firebase] dùng emulator cục bộ');
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
