import { html } from '../html.js';
import { C, r, ACC } from './theme.js';

    export const Wrap = ({ children, cx }) => html`
  <div class="slide-up" style=${{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg1, color: C.txt1, maxWidth: 500, margin: '0 auto', boxShadow: '0 0 30px rgba(0,0,0,0.06)', borderLeft: `1px solid ${C.bdr}`, borderRight: `1px solid ${C.bdr}`, position: 'relative', ...cx }}>
    ${children}
  </div>`;

    export const Card = ({ children, cx, onClick }) => html`
  <div onClick=${onClick} class="card-hover" style=${{ background: C.bg2, borderRadius: r.lg, padding: '16px 18px', marginBottom: 12, border: `1px solid ${C.bdr}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', ...cx }}>${children}</div>`;

    export const Empty = ({ icon, msg, sub }) => html`
  <${Card} cx=${{ textAlign: 'center', padding: '40px 20px', borderStyle: 'dashed' }}>
    <div style=${{ fontSize: 48, marginBottom: 12, animation: 'pulseGlow 2s infinite ease-in-out', display: 'inline-block' }}>${icon}</div>
    <p style=${{ margin: '0 0 6px', color: C.txt1, fontSize: 15, fontWeight: 400 }}>${msg}</p>
    ${sub && html`<p style=${{ margin: 0, color: C.txt2, fontSize: 13 }}>${sub}</p>`}
  </${Card}>`;

    export const Label = ({ t, mt = 0 }) => html`
  <p style=${{ margin: `${mt}px 0 10px`, fontSize: 11, fontWeight: 500, color: C.txt3, letterSpacing: '0.09em', textTransform: 'sentence-case', display: 'flex', alignItems: 'center', gap: 6 }}>
    <span style=${{ width: 4, height: 12, background: ACC, borderRadius: 2 }}/>${t}
  </p>`;

    export const Btn = ({ children, onClick, cx, variant = 'primary' }) => {
      const vs = {
        primary: { background: ACC, color: '#fff', border: 'none', padding: '10px 18px', boxShadow: `0 3px 8px var(--accent-glow)` },
        ghost: { background: C.bg2, color: C.txt1, border: `1px solid ${C.bdr}`, padding: '9px 14px' },
        danger: { background: C.redBg, color: C.red, border: 'none', padding: '7px 12px' },
        icon: { background: 'transparent', color: C.txt2, border: `1px solid ${C.bdr}`, padding: '7px 12px' },
      };
      return html`<button onClick=${onClick} class="btn-action" style=${{ borderRadius: r.md, cursor: 'pointer', fontWeight: 400, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, ...vs[variant], ...cx }}>${children}</button>`;
    };
