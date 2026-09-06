// Môi trường chạy test cho code vốn viết cho TRÌNH DUYỆT (app no-build, nạp Preact qua import map).
// Nạp bằng:  node --import ./test/support/register.mjs --test test/*.test.mjs
import { registerHooks } from 'node:module';

// Ghim múi giờ Việt Nam. App có nhiều logic phụ thuộc "hôm nay", và UTC+7 là chỗ
// lộ ra lỗi lệch ngày — test phải chạy ra cùng kết quả trên mọi máy.
process.env.TZ = 'Asia/Ho_Chi_Minh';

const STUB = new URL('./preact-stub.mjs', import.meta.url).href;

// 'preact' / 'preact/hooks' không có trong node_modules (repo cố ý dependency-free) → trỏ về stub.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'preact' || specifier.startsWith('preact/')) {
      return { url: STUB, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

// src/i18n.js đọc localStorage lúc nạp module (đã bọc try/catch, nhưng Node cảnh báo ồn).
// Shim in-memory: test luôn khởi động ở ngôn ngữ mặc định 'vi'.
const store = new Map();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  },
});
