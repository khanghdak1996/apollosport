// Đoạn thay cho function TabBar trong app.js (khoảng dòng 69–83).
// Khác bản cũ: nhãn dùng Barlow Semi Condensed IN HOA, icon lấy từ sportIcons.
//
// Thêm import ở đầu app.js nếu chưa có:
//   import { SportIcon } from './ui/sportIcons.js';
//   import { F, BRAND } from './ui/theme.js';

function TabBar({ tab, onTab }) {
  const items = [
    { id: 'home', l: 'TRANG CHỦ', k: 'home' },
    { id: 'feed', l: 'BẢNG TIN', k: 'journal' },
    { id: 'rank', l: 'XẾP HẠNG', k: 'trophy' },
    { id: 'me', l: 'CÁ NHÂN', k: 'user' },
  ];
  return html`
    <nav style=${{ display: 'flex', borderTop: `1px solid ${C.bdr}`, background: '#fff', flexShrink: 0, paddingBottom: 'env(safe-area-inset-bottom)' }}>
      ${items.map(t => {
        const on = tab === t.id;
        return html`
          <button key=${t.id} onClick=${() => onTab(t.id)} class="btn-action" style=${{
            flex: 1, padding: '11px 0 9px', border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            color: on ? BRAND.blue : '#9DB4C9', transition: 'color .2s',
          }}>
            <${SportIcon} k=${t.k} size=${22} color=${on ? BRAND.blue : '#9DB4C9'} sw=${on ? 2 : 1.7}/>
            <span style=${{ fontFamily: F.display, fontSize: 11, fontWeight: 600, letterSpacing: '.07em' }}>${t.l}</span>
          </button>`;
      })}
    </nav>`;
}
