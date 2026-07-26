import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { actOf } from '../domain/activities.js';
import { goalContribution } from '../domain/stats.js';
import { getGoalProgress, setMyGoalProgress, deleteGoal } from '../data/repo-goals.js';
import { AnnouncementFeed } from './AnnouncementFeed.js';

const METRIC = { sessions: { u: 'buổi', l: 'Số buổi' }, minutes: { u: 'phút', l: 'Số phút' }, distanceKm: { u: 'km', l: 'Quãng đường' } };

function fDate(s) { const [y, m, d] = (s || '').split('-'); return d ? `${d}/${m}` : s; }

// Thẻ 1 mục tiêu chung: tính lại đóng góp của mình từ sessions, cộng tổng nhóm, hiện thanh tiến độ.
export function GoalCard({ goal, me, mySessions, canContribute = true, isAdmin, onDeleted }) {
  const [progress, setProgress] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const m = METRIC[goal.metric] || METRIC.sessions;
  const a = goal.sport ? actOf(goal.sport) : null;
  const today = new Date().toISOString().split('T')[0];
  const status = today < goal.startDate ? { t: 'Sắp diễn ra', c: C.txt3 } : today > goal.endDate ? { t: 'Đã kết thúc', c: C.txt3 } : { t: 'Đang diễn ra', c: '#22c55e' };
  const canDelete = goal.creatorUid === me.uid || isAdmin;

  const withMine = (list, val) => [...list.filter(p => p.uid !== me.uid), { uid: me.uid, name: me.name || 'Bạn', value: val }];

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await getGoalProgress(goal.id);
      const myVal = goalContribution(mySessions || [], goal);
      const hadDoc = list.some(p => p.uid === me.uid);
      let merged = list;
      // Tự động: mọi người được phép đóng góp (mục tiêu công ty = ai cũng; nhóm = thành viên).
      if (canContribute && (myVal > 0 || hadDoc)) {
        setMyGoalProgress(goal.id, me, myVal).catch(() => { });
        merged = withMine(list, myVal);
      }
      if (alive) { setProgress(merged); setLoaded(true); }
    })();
    return () => { alive = false; };
  }, [goal.id]);

  const total = progress.reduce((t, p) => t + (p.value || 0), 0);
  const totalR = goal.metric === 'distanceKm' ? Math.round(total * 10) / 10 : Math.round(total);
  const mine = progress.find(p => p.uid === me.uid)?.value || 0;
  const pctv = goal.target > 0 ? Math.min(100, Math.round((total / goal.target) * 100)) : 0;
  const reached = total >= goal.target;
  const top = [...progress].filter(p => p.value > 0).sort((x, y) => y.value - x.value).slice(0, 5);

  const del = async () => {
    if (!window.confirm('Xoá mục tiêu này? Không thể hoàn tác.')) return;
    await deleteGoal(goal.id); onDeleted && onDeleted(goal.id);
  };

  return html`
    <div style=${{ background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.lg, padding: '16px', marginBottom: 12 }}>
      <div style=${{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, fontSize: 15, fontWeight: 600, color: C.txt1 }}>${reached ? '🎉 ' : '🎯 '}${goal.title}</p>
          <p style=${{ margin: '3px 0 0', fontSize: 11.5, color: C.txt3 }}>
            <span style=${{ color: status.c, fontWeight: 500 }}>${status.t}</span> · ${fDate(goal.startDate)}–${fDate(goal.endDate)} · ${a ? `${a.emoji} ${a.label}` : m.l}
          </p>
        </div>
        ${canDelete && html`<button onClick=${del} class="btn-action" title="Xoá" style=${{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.txt3, fontSize: 16, flexShrink: 0, padding: 0 }}>🗑</button>`}
      </div>

      <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style=${{ fontSize: 20, fontWeight: 700, color: reached ? '#22c55e' : ACC }}>${totalR}<span style=${{ fontSize: 12, fontWeight: 500, color: C.txt3 }}> / ${goal.target} ${m.u}</span></span>
        <span style=${{ fontSize: 12, fontWeight: 600, color: reached ? '#22c55e' : C.txt2 }}>${pctv}%</span>
      </div>
      <div style=${{ height: 10, borderRadius: 5, background: C.bg3, overflow: 'hidden' }}>
        <div style=${{ height: '100%', width: `${pctv}%`, background: reached ? '#22c55e' : ACC, borderRadius: 5, transition: 'width .4s' }}/>
      </div>

      <div style=${{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, color: C.txt3 }}>
        <span>Đóng góp của bạn: <strong style=${{ color: C.txt1 }}>${goal.metric === 'distanceKm' ? Math.round(mine * 10) / 10 : Math.round(mine)} ${m.u}</strong></span>
        <span>${progress.filter(p => p.value > 0).length} người tham gia</span>
      </div>

      ${loaded && top.length > 0 && html`
        <div style=${{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.bdr}` }}>
          <p style=${{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: C.txt3 }}>Góp nhiều nhất</p>
          ${top.map(p => html`
            <div key=${p.uid} style=${{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '3px 0', color: C.txt2 }}>
              <span style=${{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${p.uid === me.uid ? 'Bạn' : p.name || '—'}</span>
              <strong style=${{ color: C.txt1, flexShrink: 0, marginLeft: 8 }}>${goal.metric === 'distanceKm' ? Math.round(p.value * 10) / 10 : Math.round(p.value)} ${m.u}</strong>
            </div>`)}
        </div>`}
      ${!canContribute && html`<p style=${{ margin: '10px 0 0', fontSize: 11, color: C.txt3, fontStyle: 'italic' }}>Tham gia nhóm để đóng góp vào mục tiêu này.</p>`}

      <div style=${{ marginTop: 14 }}>
        <${AnnouncementFeed} parent=${['goals', goal.id]} canPost=${goal.creatorUid === me.uid || isAdmin} me=${me} isAdmin=${isAdmin}/>
      </div>
    </div>`;
}
