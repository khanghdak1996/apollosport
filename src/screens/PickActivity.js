import { html } from '../html.js';
import { C, r, F, T, BRAND, sportColor, sportTint } from '../ui/theme.js';
import { Wrap } from '../ui/primitives.js';
import { SportIcon } from '../ui/sportIcons.js';
import { ACTIVITIES, actOf } from '../domain/activities.js';

// Chọn môn để ghi. gym -> mở chương trình; môn khác -> form LogActivity.
export function PickActivity({ onClose, onGym, onActivity, recentTypes = [] }) {
  const pick = id => (id === 'gym' ? onGym() : onActivity(id));
  // "Bạn hay tập" = tối đa 3 môn gần đây (recentTypes đã theo thứ tự dùng nhiều).
  const favs = recentTypes.map(id => actOf(id)).filter(Boolean).slice(0, 3);

  return html`
    <${Wrap}>
      <div style=${{ padding: '12px 16px', borderBottom: `1px solid ${C.bdr}`, background: C.bg2, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onClose} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, ...T.h2 }}>BẠN VỪA TẬP GÌ?</p>
          <p style=${{ margin: '1px 0 0', fontFamily: F.serif, fontStyle: 'italic', fontSize: 12.5, color: C.txt3 }}>Ghi lại để giữ chuỗi và cộng điểm.</p>
        </div>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '18px 16px 80px', WebkitOverflowScrolling: 'touch' }}>
        ${favs.length > 0 && html`
          <p style=${{ margin: '0 2px 9px', ...T.section }}>BẠN HAY TẬP</p>
          <div style=${{ display: 'grid', gridTemplateColumns: `repeat(${favs.length}, 1fr)`, gap: 10, marginBottom: 22 }}>
            ${favs.map(a => html`
              <button key=${a.id} onClick=${() => pick(a.id)} class="btn-action card-hover" style=${{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, padding: '18px 6px',
                borderRadius: r.lg, border: 'none', background: BRAND.blue, cursor: 'pointer',
              }}>
                <span style=${{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <${SportIcon} k=${a.iconKey} size=${24} color="#fff"/>
                </span>
                <span style=${{ fontSize: 12.5, fontWeight: 600, color: '#fff', textAlign: 'center' }}>${a.label}</span>
              </button>`)}
          </div>`}

        <p style=${{ margin: '0 2px 9px', ...T.section }}>TẤT CẢ MÔN</p>
        <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          ${ACTIVITIES.map(a => html`
            <button key=${a.id} onClick=${() => pick(a.id)} class="btn-action card-hover" style=${{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, padding: '18px 6px',
              borderRadius: r.lg, border: `1px solid ${C.bdr}`, background: C.bg2, cursor: 'pointer',
            }}>
              <span style=${{ width: 44, height: 44, borderRadius: 12, background: sportTint(a.iconKey), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <${SportIcon} k=${a.iconKey} size=${24} color=${sportColor(a.iconKey)}/>
              </span>
              <span style=${{ fontSize: 12.5, fontWeight: 500, color: C.txt1, textAlign: 'center' }}>${a.label}</span>
            </button>`)}
        </div>
      </div>
    </${Wrap}>`;
}
