import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, ACC } from '../ui/theme.js';
import { Wrap, Empty } from '../ui/primitives.js';
import { Icons } from '../ui/icons.js';
import { listCompanyGoals } from '../data/repo-goals.js';
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
    <${Wrap}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>
        <h2 style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: C.txt1, flex: 1 }}>Mục tiêu chung</h2>
        ${isAdmin && html`<button onClick=${() => setCreating(true)} class="btn-action" style=${{ background: ACC, border: 'none', borderRadius: 18, height: 34, padding: '0 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>＋ Tạo</button>`}
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '16px', WebkitOverflowScrolling: 'touch' }}>
        <p style=${{ margin: '0 0 12px', fontSize: 12.5, color: C.txt3, lineHeight: 1.5 }}>Phong trào toàn công ty do ban lãnh đạo phát động — <strong>mọi người tự động đóng góp</strong> khi tập đúng môn. Không xếp hạng, chỉ cùng nhau về đích 🤝</p>
        ${loading
          ? html`<p style=${{ textAlign: 'center', color: C.txt3, fontSize: 13, padding: 30 }}>Đang tải...</p>`
          : goals.length === 0
            ? html`<${Empty} icon="target" msg="Chưa có mục tiêu chung nào" sub="Tạo mục tiêu đầu tiên để cả công ty cùng phấn đấu!"/>`
            : goals.map(g => html`<${GoalCard} key=${g.id} goal=${g} me=${me} mySessions=${mySessions} canContribute=${true} isAdmin=${isAdmin} onDeleted=${() => setGoals(gs => gs.filter(x => x.id !== g.id))}/>`)}
      </div>

      ${creating && html`<${GoalForm} scope="company" me=${me} onClose=${() => setCreating(false)} onCreated=${() => { setCreating(false); load(); }}/>`}
    </${Wrap}>`;
}
