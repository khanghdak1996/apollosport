import { html } from '../html.js';
import { C, r } from '../ui/theme.js';
import { Wrap } from '../ui/primitives.js';
import { Icons } from '../ui/icons.js';
import { ACTIVITIES } from '../domain/activities.js';

// Chọn môn để ghi. gym -> mở chương trình; môn khác -> form LogActivity.
export function PickActivity({ onClose, onGym, onActivity, recentTypes = [] }) {
  const ordered = [...ACTIVITIES].sort((a, b) => {
    const ra = recentTypes.includes(a.id) ? 0 : 1;
    const rb = recentTypes.includes(b.id) ? 0 : 1;
    return ra - rb;
  });
  return html`
    <${Wrap}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onClose} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>
        <h2 style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: C.txt1, letterSpacing: '-0.01em' }}>Bạn vừa tập gì?</h2>
      </div>
      <div style=${{ flex: 1, overflowY: 'auto', padding: 16, WebkitOverflowScrolling: 'touch' }}>
        <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          ${ordered.map(a => html`
            <button key=${a.id} onClick=${() => a.id === 'gym' ? onGym() : onActivity(a.id)} class="btn-action card-hover" style=${{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '18px 6px',
              borderRadius: r.lg, border: `1px solid ${C.bdr}`, background: '#fff', cursor: 'pointer',
            }}>
              <span style=${{ fontSize: 30, lineHeight: 1 }}>${a.emoji}</span>
              <span style=${{ fontSize: 12.5, fontWeight: 500, color: C.txt1, textAlign: 'center' }}>${a.label}</span>
            </button>`)}
        </div>
      </div>
    </${Wrap}>`;
}
