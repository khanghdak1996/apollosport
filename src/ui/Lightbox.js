import { Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';

// Ảnh buổi tập có thể BẤM để xem full màn hình (không cắt). Dùng ở bảng tin & chi tiết buổi.
// `style` áp cho ảnh thu nhỏ trong thẻ (thường crop 4/3); khi mở lightbox thì ảnh hiện
// nguyên khung (object-fit: contain). Bấm nền hoặc nút ×, hoặc phím Esc để đóng.
export function PhotoView({ src, style, alt = '' }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  if (!src) return null;

  return html`<${Fragment}>
    <img src=${src} alt=${alt} loading="lazy" onClick=${() => setOpen(true)} style=${{ cursor: 'zoom-in', ...style }}/>
    ${open && html`
      <div onClick=${() => setOpen(false)} style=${{
        position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.93)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 12, WebkitTapHighlightColor: 'transparent',
      }}>
        <img src=${src} alt=${alt} onClick=${e => e.stopPropagation()} style=${{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }}/>
        <button onClick=${() => setOpen(false)} aria-label="Đóng" style=${{
          position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 12px)', right: 16,
          width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,.18)', color: '#fff', fontSize: 24, lineHeight: 1,
        }}>×</button>
      </div>`}
  </${Fragment}>`;
}
