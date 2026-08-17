// src/screens/GymLibrary.js — Kho hướng dẫn bài tập gym: toàn bộ động tác gom theo nhóm cơ.
// Mở từ thẻ "folder" ở section Gym trong màn Hướng dẫn tập luyện. Bấm 1 bài → GuideDetail.
import { html } from '../html.js';
import { C, r, F, BRAND, sportColor, sportTint } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { Empty } from '../ui/primitives.js';
import { t } from '../i18n.js';

export function GymLibrary({ groups = [], onOpen, onBack }) {
  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px 14px', background: C.bg2, borderBottom: `1px solid ${C.bdr}`, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <span style=${{ width: 30, height: 30, borderRadius: 9, background: sportTint('gym'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <${SportIcon} k="gym" size=${17} color=${sportColor('gym')}/>
        </span>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 18, letterSpacing: '.05em', color: C.txt1, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${t('gymlib.title')}</p>
          <p style=${{ margin: '1px 0 0', fontFamily: F.serif, fontStyle: 'italic', fontSize: 11.5, color: C.txt3, whiteSpace: 'nowrap' }}>${t('gymlib.subtitle')}</p>
        </div>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '16px 16px 40px' }}>
        ${groups.length === 0
          ? html`<${Empty} icon="gym" msg=${t('gymlib.emptyMsg')} sub=${t('gymlib.emptySub')}/>`
          : groups.map(grp => html`
            <div key=${grp.key} style=${{ marginBottom: 20 }}>
              <div style=${{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 15, letterSpacing: '.08em', color: C.txt1, textTransform: 'uppercase' }}>${grp.label}</p>
                <span style=${{ fontSize: 11.5, color: C.txt4, whiteSpace: 'nowrap' }}>${t('gymlib.count', { n: grp.items.length })}</span>
              </div>
              ${grp.items.map(ex => html`
                <div key=${ex.id} onClick=${() => onOpen(ex.id)} class="card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 10, background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '13px 15px', marginBottom: 8, cursor: 'pointer' }}>
                  <span style=${{ flex: 1, fontSize: 14.5, fontWeight: 600, color: C.txt1, minWidth: 0 }}>${ex.name}</span>
                  <${SportIcon} k="chevronR" size=${16} color=${C.txt3} sw=${2}/>
                </div>`)}
            </div>`)}
      </div>
    </div>`;
}
