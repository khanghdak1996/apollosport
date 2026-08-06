import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';

// Tải động 1 màn hình lớn KHI CẦN (không gói vào initial load của app). Hiện fallback tới khi nạp
// xong; cache theo loader để mở lại là hiện ngay. loader PHẢI ổn định (khai báo ở module scope) —
// nếu truyền hàm inline mới mỗi render sẽ nạp lại liên tục.
const cache = new Map(); // loader -> Component

export function LazyScreen({ loader, name, fallback = null, ...props }) {
  const [Comp, setComp] = useState(() => cache.get(loader) || null);
  useEffect(() => {
    const cached = cache.get(loader);
    if (cached) { setComp(() => cached); return; }
    let alive = true;
    loader().then((m) => {
      const C = m[name] || m.default;
      if (C) cache.set(loader, C);
      if (alive && C) setComp(() => C);
    }).catch(() => { /* lỗi mạng: giữ fallback, thử lại khi mở lại */ });
    return () => { alive = false; };
  }, [loader]);
  return Comp ? html`<${Comp} ...${props}/>` : fallback;
}
