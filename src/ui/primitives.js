// src/ui/primitives.js — bản redesign. Thay toàn bộ file cũ.
import { html } from '../html.js';
import { C, r, F, T, SHADOW, BRAND } from './theme.js';
import { SportIcon } from './sportIcons.js';

export const Wrap = ({ children, cx }) => html`
  <div class="slide-up" style=${{ fontFamily: F.body, height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg1, color: C.txt1, maxWidth: 500, margin: '0 auto', boxShadow: '0 0 30px rgba(18,57,94,.06)', borderLeft: `1px solid ${C.bdr}`, borderRight: `1px solid ${C.bdr}`, position: 'relative', ...cx }}>
    ${children}
  </div>`;

export const Card = ({ children, cx, onClick }) => html`
  <div onClick=${onClick} class="card-hover" style=${{ background: C.bg2, borderRadius: r.xl, padding: '14px 16px', marginBottom: 12, border: `1px solid ${C.bdr}`, boxShadow: SHADOW.card, ...cx }}>${children}</div>`;

// Tiêu đề nhóm — in hoa condensed, KHÔNG có vạch màu như bản cũ.
export const Section = ({ t, note, right, mt = 16 }) => html`
  <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: `${mt}px 2px 9px` }}>
    <p style=${{ margin: 0, ...T.section }}>${t}${note ? html`<span style=${{ fontFamily: F.body, fontSize: 11, fontWeight: 500, letterSpacing: 0, textTransform: 'none', color: C.txt5 }}> · ${note}</span>` : ''}</p>
    ${right}
  </div>`;

export const Label = ({ t, mt = 0 }) => html`
  <p style=${{ margin: `${mt}px 0 8px 2px`, ...T.label }}>${t}</p>`;

// Dải 3 ô số liệu có vách ngăn — thay 3 thẻ trắng rời ở Trang chủ.
export const StatStrip = ({ items }) => html`
  <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, display: 'flex' }}>
    ${items.map((s, i) => html`
      <div key=${i} style=${{ flex: 1, padding: '14px 6px', textAlign: 'center', borderLeft: i ? `1px solid ${C.bdr2}` : 'none', minWidth: 0 }}>
        <p style=${{ margin: 0, ...T.num, fontSize: 26, lineHeight: 1, color: C.txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${s.v}</p>
        <p style=${{ margin: '4px 0 0', fontSize: 10.5, letterSpacing: '.1em', fontWeight: 600, color: C.txt3, textTransform: 'uppercase' }}>${s.l}</p>
      </div>`)}
  </div>`;

// LƯU Ý: icon giờ là KEY (vd "trophy"), không phải emoji.
export const Empty = ({ icon = 'other', msg, sub }) => html`
  <${Card} cx=${{ textAlign: 'center', padding: '38px 20px', borderStyle: 'dashed', borderColor: '#C7D8E6' }}>
    <div style=${{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><${SportIcon} k=${icon} size=${30} color=${C.txt5} sw=${1.6}/></div>
    <p style=${{ margin: '0 0 6px', color: C.txt1, fontSize: 15, fontWeight: 600 }}>${msg}</p>
    ${sub ? html`<p style=${{ margin: 0, ...T.lead, textAlign: 'center' }}>${sub}</p>` : ''}
  </${Card}>`;

export const Btn = ({ children, onClick, cx, variant = 'primary' }) => {
  const vs = {
    primary: { background: BRAND.blue, color: '#fff', border: 'none', padding: '14px 18px', fontFamily: F.display, fontWeight: 700, fontSize: 17, letterSpacing: '.09em', textTransform: 'uppercase', boxShadow: '0 6px 16px rgba(37,118,185,.28)' },
    compact: { background: BRAND.blue, color: '#fff', border: 'none', padding: '10px 20px', fontFamily: F.display, fontWeight: 700, fontSize: 15, letterSpacing: '.08em', textTransform: 'uppercase' },
    ghost: { background: C.bg2, color: C.txt2, border: `1px solid ${C.bdr}`, padding: '12px 14px', fontWeight: 600, fontSize: 13.5 },
    warn: { background: BRAND.yellow, color: C.txt1, border: 'none', padding: '10px 16px', fontWeight: 700, fontSize: 13 },
    danger: { background: C.redBg, color: C.red, border: 'none', padding: '9px 14px', fontWeight: 600, fontSize: 13 },
    icon: { background: C.bg1, color: C.txt2, border: 'none', padding: 0, width: 36, height: 36, borderRadius: '50%' },
  };
  return html`<button onClick=${onClick} class="btn-action" style=${{ borderRadius: r.md, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...vs[variant], ...cx }}>${children}</button>`;
};
