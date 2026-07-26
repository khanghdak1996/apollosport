import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Wrap, Empty } from '../ui/primitives.js';
import { Icons } from '../ui/icons.js';
import { actOf } from '../domain/activities.js';
import { richGuides } from '../domain/guides.js';

// Danh sách bài hướng dẫn tập luyện (tĩnh). Nhóm theo môn. onOpen(guide) mở bài chi tiết.
export function GuidesScreen({ onBack, onOpen }) {
  const guides = richGuides();
  // Gom theo môn, giữ thứ tự xuất hiện.
  const groups = [];
  guides.forEach(g => {
    let grp = groups.find(x => x.sport === g.sport);
    if (!grp) { grp = { sport: g.sport, items: [] }; groups.push(grp); }
    grp.items.push(g);
  });

  return html`
    <${Wrap}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>
        <h2 style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: C.txt1, letterSpacing: '-0.01em' }}>📖 Hướng dẫn tập luyện</h2>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: 16, WebkitOverflowScrolling: 'touch' }}>
        ${guides.length === 0
      ? html`<${Empty} icon="book" msg="Chưa có bài hướng dẫn" sub="Nội dung sẽ được bổ sung"/>`
      : groups.map(grp => {
        const a = actOf(grp.sport);
        return html`
            <div key=${grp.sport} style=${{ marginBottom: 22 }}>
              <div style=${{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style=${{ fontSize: 18 }}>${a.emoji}</span>
                <h3 style=${{ margin: 0, fontSize: 14, fontWeight: 600, color: C.txt1 }}>${a.label}</h3>
              </div>
              ${grp.items.map(g => html`
                <button key=${g.id} onClick=${() => onOpen(g)} class="btn-action card-hover" style=${{
            display: 'block', width: '100%', textAlign: 'left', marginBottom: 10, cursor: 'pointer',
            background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.lg, padding: '14px 16px',
          }}>
                  <div style=${{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style=${{ flex: 1, fontSize: 15, fontWeight: 600, color: C.txt1 }}>${g.title}</span>
                    <span style=${{ fontSize: 10.5, fontWeight: 500, color: ACC, background: 'var(--accent-glow)', borderRadius: 20, padding: '3px 9px', flexShrink: 0 }}>${g.level}</span>
                  </div>
                  <p style=${{ margin: 0, fontSize: 12.5, color: C.txt2, lineHeight: 1.5 }}>${g.summary}</p>
                </button>`)}
            </div>`;
      })}
      </div>
    </${Wrap}>`;
}
