import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r } from '../ui/theme.js';
import { Wrap } from '../ui/primitives.js';
import { signIn } from '../auth.js';
import { ALLOWED_DOMAINS } from '../config.js';

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
    <${Wrap} cx=${{ alignItems: 'center', justifyContent: 'center', padding: 28, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', position: 'relative' }}>
      <div style=${{ position: 'absolute', width: 150, height: 150, background: '#0084ff', filter: 'blur(80px)', opacity: 0.1, top: '20%', left: '10%', pointerEvents: 'none' }}/>
      <div style=${{ position: 'absolute', width: 150, height: 150, background: '#22c55e', filter: 'blur(80px)', opacity: 0.1, bottom: '25%', right: '10%', pointerEvents: 'none' }}/>

      <div class="scale-in" style=${{ textAlign: 'center', width: '100%', maxWidth: 360, zIndex: 1 }}>
        <div style=${{ fontSize: 52, marginBottom: 15, animation: 'pulseGlow 2.5s infinite ease-in-out', display: 'inline-block', background: 'rgba(0,0,0,0.03)', width: 90, height: 90, lineHeight: '90px', borderRadius: '50%' }}>🏃</div>
        <h1 style=${{ margin: '0 0 8px', fontSize: 34, fontWeight: 600, letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #0f172a, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Apollo Sport</h1>
        <p style=${{ margin: '0 0 40px', color: C.txt2, fontSize: 15.5, fontWeight: 400, lineHeight: 1.5 }}>Cùng đồng nghiệp xây thói quen vận động — chia sẻ thành quả, giữ chuỗi, tiếp lửa cho nhau.</p>

        <button onClick=${go} disabled=${busy} class="btn-action" style=${{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.md, padding: '14px 18px',
          fontSize: 15, fontWeight: 500, color: C.txt1, cursor: busy ? 'default' : 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)', opacity: busy ? 0.6 : 1,
        }}>
          <${GoogleMark}/> ${busy ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
        </button>

        <p style=${{ margin: '16px 0 0', color: C.txt3, fontSize: 12.5 }}>Chỉ dành cho tài khoản <b style=${{ color: C.txt2 }}>@${ALLOWED_DOMAINS[0]}</b></p>

        ${error && html`
          <div style=${{ marginTop: 18, background: C.redBg, border: '1px solid #fecaca', borderRadius: r.md, padding: '10px 14px', fontSize: 13, color: '#991b1b', lineHeight: 1.4 }}>${error}</div>
        `}
      </div>
    </${Wrap}>`;
}
