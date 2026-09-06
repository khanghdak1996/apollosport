// Stub thay cho 'preact' / 'preact/hooks' KHI CHẠY TEST.
// Vì sao cần: app no-build nạp Preact qua import map trong index.html, không có node_modules.
// src/i18n.js import 'preact/hooks' ở top-level, nên mọi module domain (qua format.js) kéo theo nó.
// Test cho logic thuần không dùng hook, nên stub rỗng là đủ — và giữ repo dependency-free.
export const useState = (v) => [typeof v === 'function' ? v() : v, () => {}];
export const useEffect = () => {};
export const useRef = (v) => ({ current: v });
export const useMemo = (f) => f();
export const useCallback = (f) => f;
export const h = () => null;
export const render = () => {};
export const Fragment = 'Fragment';
export default { h, render, Fragment };
