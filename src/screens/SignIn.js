import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, BRAND } from '../ui/theme.js';
import { Wrap } from '../ui/primitives.js';
import { SportIcon } from '../ui/sportIcons.js';
import { signIn } from '../auth.js';
import { ALLOWED_DOMAINS } from '../config.js';
import { getLang, setLang, SUPPORTED } from '../i18n.js';

// Logo Google đa sắc (inline SVG).
const GoogleMark = () => html`
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>`;

export function SignIn() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const go = async () => {
    setError(null); setBusy(true);
    try {
      await signIn(); // thành công -> onAuthStateChanged ở App tự chuyển màn
    } catch (e) {
      setError(e?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      setBusy(false);
    }
  };

  return html`
    <${Wrap} cx=${{ background: '#fff', overflow: 'hidden' }}>
      <!-- Chọn ngôn ngữ góc trên trái (chưa đăng nhập vẫn đổi được, lưu localStorage) -->
      <div style=${{ position: 'absolute', top: 'calc(14px + env(safe-area-inset-top))', left: 14, zIndex: 3, display: 'flex', gap: 4, background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.pill, padding: 3 }}>
        ${SUPPORTED.map(l => html`
          <button key=${l} onClick=${() => setLang(l)} class="btn-action" style=${{
      padding: '4px 12px', borderRadius: r.pill, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
      background: l === getLang() ? BRAND.blue : 'transparent', color: l === getLang() ? '#fff' : C.txt3,
    }}>${l.toUpperCase()}</button>`)}
      </div>

      <!-- 2 vòng tròn trang trí brand -->
      <div style=${{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: BRAND.babyBlue, opacity: 0.55, top: -90, right: -70, pointerEvents: 'none' }}/>
      <div style=${{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: C.bg3, top: 150, left: -110, pointerEvents: 'none' }}/>

      <!-- Logo Apollo English góc trên phải -->
      <img src="./assets/apollo-logo.png" alt="Apollo English" style=${{ position: 'absolute', top: 'calc(10px + env(safe-area-inset-top))', right: 1, width: 144, height: 'auto', zIndex: 2, pointerEvents: 'none' }}/>

      <div style=${{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px', position: 'relative', zIndex: 1 }}>
        <div class="scale-in" style=${{ width: '100%', maxWidth: 340, textAlign: 'center' }}>
          <div style=${{ width: 76, height: 76, borderRadius: 24, background: BRAND.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 10px 26px rgba(37,118,185,.32)' }}>
            <${SportIcon} k="run" size=${38} color="#fff" sw=${1.9}/>
          </div>

          <p style=${{ margin: '0 0 14px', fontFamily: F.display, fontWeight: 700, fontSize: 52, lineHeight: .95, letterSpacing: '.02em', color: BRAND.blue, textTransform: 'uppercase' }}>Apollo<br/>Social Sport</p>

          <p style=${{ margin: '0 0 34px', fontFamily: F.serif, fontSize: 15, lineHeight: 1.6, color: C.txt2 }}>
            Cùng đồng nghiệp xây thói quen vận động — chia sẻ thành quả, giữ chuỗi, tiếp lửa cho nhau.
          </p>

          <button onClick=${go} disabled=${busy} class="btn-action" style=${{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: 15, padding: 15,
      fontSize: 15, fontWeight: 600, color: C.txt1, cursor: busy ? 'default' : 'pointer',
      boxShadow: '0 8px 24px rgba(37,118,185,.1)', opacity: busy ? 0.6 : 1,
    }}>
            <${GoogleMark}/> ${busy ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
          </button>

          <p style=${{ margin: '16px 0 0', color: C.txt4, fontSize: 12.5 }}>Chỉ dành cho tài khoản <b style=${{ color: C.txt2 }}>@${ALLOWED_DOMAINS[0]}</b></p>

          ${error && html`
            <div style=${{ marginTop: 18, background: C.redBg, border: `1px solid ${C.redBdr}`, borderRadius: r.md, padding: '10px 14px', fontSize: 13, color: C.redInk, lineHeight: 1.4 }}>${error}</div>`}
        </div>
      </div>

      <p style=${{ margin: 0, padding: '0 20px calc(22px + env(safe-area-inset-bottom))', textAlign: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: '.22em', textTransform: 'uppercase', color: '#2476b9', position: 'relative', zIndex: 1 }}>
        Where the best become better
      </p>
    </${Wrap}>`;
}
