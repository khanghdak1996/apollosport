import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { Empty } from '../ui/primitives.js';
import { listCompanyGoals } from '../data/repo-goals.js';
import { t } from '../i18n.js';
import { GoalCard } from './GoalCard.js';
import { GoalForm } from './GoalForm.js';

export function GoalsScreen({ me, mySessions, isAdmin, onBack }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const g = await listCompanyGoals();
    g.sort((a, b) => (b.createdAt?.seconds || 9e15) - (a.createdAt?.seconds || 9e15)); // mới trước; vừa tạo (chưa có ts) lên đầu
    setGoals(g); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.bg2, borderBottom: `1px solid ${C.bdr}`, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <p style=${{ flex: 1, margin: 0, ...T.h2 }}>${t('goals.title')}</p>
        ${isAdmin ? html`
          <button onClick=${() => setCreating(true)} class="btn-action" style=${{ background: BRAND.blue, border: 'none', borderRadius: r.md, padding: '9px 16px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, whiteSpace: 'nowrap' }}>
            <${SportIcon} k="plus" size=${13} color="#fff" sw=${2.4}/>${t('common.create')}
          </button>` : ''}
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style=${{ display: 'flex', gap: 12, background: BRAND.babyBlue, borderRadius: r.lg, padding: '14px 16px', marginBottom: 16 }}>
          <${SportIcon} k="target" size=${20} color="#2E5A80" sw=${1.9} cx=${{ flexShrink: 0, marginTop: 1 }}/>
          <p style=${{ margin: 0, fontFamily: F.serif, fontSize: 12.5, lineHeight: 1.6, color: '#2E5A80' }}>
            ${t('goals.intro')}
          </p>
        </div>
        ${loading
          ? html`<p style=${{ textAlign: 'center', color: C.txt4, fontSize: 13, padding: 30 }}>${t('common.loading')}</p>`
          : goals.length === 0
            ? html`<${Empty} icon="target" msg=${t('goals.emptyMsg')} sub=${t('goals.emptySub')}/>`
            : goals.map(g => html`<${GoalCard} key=${g.id} goal=${g} me=${me} mySessions=${mySessions} canContribute=${true} isAdmin=${isAdmin} onDeleted=${() => setGoals(gs => gs.filter(x => x.id !== g.id))}/>`)}
      </div>

      ${creating && html`<${GoalForm} scope="company" me=${me} onClose=${() => setCreating(false)} onCreated=${() => { setCreating(false); load(); }}/>`}
    </div>`;
}
