// src/screens/GuidesScreen.js — Kho hướng dẫn, bản redesign. THAY TOÀN BỘ file cũ.
import { html } from '../html.js';
import { C, r, F, T, BRAND, sportColor, sportTint } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { Empty } from '../ui/primitives.js';
import { actOf, actLabel } from '../domain/activities.js';
import { t } from '../i18n.js';

export function GuidesScreen({ guides = [], onOpen, onBack }) {
  // Nhóm theo môn, giữ thứ tự xuất hiện.
  const groups = [];
  guides.forEach(g => {
    let grp = groups.find(x => x.sport === g.sport);
    if (!grp) { grp = { sport: g.sport, items: [] }; groups.push(grp); }
    grp.items.push(g);
  });

  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px 14px', background: C.bg2, borderBottom: `1px solid ${C.bdr}`, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, ...T.h2 }}>${t('guides.title')}</p>
          <p style=${{ margin: '1px 0 0', fontFamily: F.serif, fontStyle: 'italic', fontSize: 11.5, color: C.txt3, whiteSpace: 'nowrap' }}>${t('guides.subtitle')}</p>
        </div>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '16px 16px 40px' }}>
        ${groups.length === 0
          ? html`<${Empty} icon="book" msg=${t('guides.emptyMsg')} sub=${t('guides.emptySub')}/>`
          : groups.map(grp => {
            const a = actOf(grp.sport);
            return html`
              <div key=${grp.sport} style=${{ marginBottom: 20 }}>
                <div style=${{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                  <span style=${{ width: 28, height: 28, borderRadius: 9, background: sportTint(a.iconKey), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <${SportIcon} k=${a.iconKey} size=${17} color=${sportColor(a.iconKey)}/>
                  </span>
                  <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 15, letterSpacing: '.08em', color: C.txt1, textTransform: 'uppercase' }}>${actLabel(grp.sport)}</p>
                </div>
                ${grp.items.map(g => html`
                  <div key=${g.id} onClick=${() => onOpen(g)} class="card-hover" style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '14px 16px', marginBottom: 9, cursor: 'pointer' }}>
                    <div style=${{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style=${{ flex: 1, fontSize: 15, fontWeight: 700, color: C.txt1, minWidth: 0 }}>${g.title}</span>
                      ${g.level ? html`<span style=${{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', color: BRAND.blue, background: C.bg3, borderRadius: 20, padding: '4px 10px', flexShrink: 0, whiteSpace: 'nowrap' }}>${g.level}</span>` : ''}
                    </div>
                    <p style=${{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: C.txt3 }}>${g.summary}</p>
                  </div>`)}
              </div>`;
          })}
      </div>
    </div>`;
}
