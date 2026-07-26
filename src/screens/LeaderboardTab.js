import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Empty } from '../ui/primitives.js';
import { periodId, allEntries } from '../data/repo-leaderboard.js';

const MEDAL = ['🥇', '🥈', '🥉'];

export function LeaderboardTab({ me, onOpenProfile }) {
  const [scope, setScope] = useState('company'); // company | dept
  const [range, setRange] = useState('week');     // week | month
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const pid = periodId(range === 'month' ? 'month' : 'week');
    allEntries(pid, { dept: scope === 'dept' ? (me.dept || '') : null }).then(r => {
      if (alive) { setRows(r); setLoading(false); }
    });
    return () => { alive = false; };
  }, [scope, range, me.dept]);

  const mine = rows.find(r => r.uid === me.uid);
  const top = rows.slice(0, 10);
  const meInTop = top.some(r => r.uid === me.uid);

  const seg = (val, cur, set, label) => html`
    <button onClick=${() => set(val)} class="btn-action" style=${{
      flex: 1, padding: '9px', borderRadius: r.md, cursor: 'pointer', fontSize: 13, fontWeight: 500,
      border: 'none', background: cur === val ? '#fff' : 'transparent',
      color: cur === val ? ACC : C.txt2, boxShadow: cur === val ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
    }}>${label}</button>`;

  const rowView = (r, highlight) => html`
    <div key=${r.uid} onClick=${() => onOpenProfile && onOpenProfile(r.uid)} class="card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: highlight ? 'var(--accent-glow)' : '#fff', borderRadius: r.md, border: `1px solid ${highlight ? ACC : C.bdr}`, marginBottom: 8, cursor: 'pointer' }}>
      <span style=${{ width: 26, textAlign: 'center', fontSize: r.rank <= 3 ? 18 : 13, fontWeight: 600, color: r.rank <= 3 ? C.txt1 : C.txt3 }}>${MEDAL[r.rank - 1] || r.rank}</span>
      ${r.photoURL
        ? html`<img src=${r.photoURL} style=${{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}/>`
        : html`<div style=${{ width: 34, height: 34, borderRadius: '50%', background: C.bg3, color: C.txt2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>${(r.name || '?').charAt(0).toUpperCase()}</div>`}
      <div style=${{ flex: 1, minWidth: 0 }}>
        <p style=${{ margin: 0, fontSize: 14, fontWeight: 600, color: C.txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${r.name}${r.uid === me.uid ? ' (bạn)' : ''}</p>
        <p style=${{ margin: 0, fontSize: 11, color: C.txt3 }}>${r.dept || '—'} · ${r.sessions || 0} buổi · ${r.minutes || 0} phút</p>
      </div>
      <div style=${{ textAlign: 'right', flexShrink: 0 }}>
        <p style=${{ margin: 0, fontSize: 16, fontWeight: 700, color: ACC }}>${r.points || 0}</p>
        <p style=${{ margin: 0, fontSize: 10, color: C.txt3 }}>điểm</p>
      </div>
    </div>`;

  return html`
    <div class="fade-in" style=${{ padding: '18px 16px' }}>
      <h2 style=${{ margin: '0 0 14px', fontSize: 24, fontWeight: 600, color: C.txt1, letterSpacing: '-0.02em' }}>Bảng xếp hạng</h2>

      <div style=${{ display: 'flex', gap: 6, background: C.bg3, borderRadius: r.md, padding: 4, marginBottom: 8 }}>
        ${seg('company', scope, setScope, '🏢 Toàn công ty')}
        ${seg('dept', scope, setScope, '👥 Phòng ban')}
      </div>
      <div style=${{ display: 'flex', gap: 6, background: C.bg3, borderRadius: r.md, padding: 4, marginBottom: 18 }}>
        ${seg('week', range, setRange, 'Tuần này')}
        ${seg('month', range, setRange, 'Tháng này')}
      </div>

      ${scope === 'dept' && !me.dept
        ? html`<${Empty} icon="people" msg="Bạn chưa có phòng ban" sub="Cập nhật phòng ban trong Cài đặt để xem bảng này"/>`
        : loading
          ? html`<p style=${{ textAlign: 'center', color: C.txt3, fontSize: 13, padding: 30 }}>Đang tải...</p>`
          : rows.length === 0
            ? html`<${Empty} icon="trophy" msg="Chưa có ai trong kỳ này" sub="Ghi buổi tập đầu tiên để dẫn đầu!"/>`
            : html`
              ${top.map(r => rowView(r, r.uid === me.uid))}
              ${mine && !meInTop && html`
                <div style=${{ borderTop: `1px dashed ${C.bdr}`, marginTop: 10, paddingTop: 12 }}>
                  <p style=${{ margin: '0 0 8px', fontSize: 11, color: C.txt3, textAlign: 'center' }}>Hạng của bạn</p>
                  ${rowView(mine, true)}
                </div>`}`}

      <p style=${{ margin: '16px 4px 0', fontSize: 11.5, color: C.txt3, lineHeight: 1.5, textAlign: 'center' }}>Điểm quy đổi theo cường độ vận động, công bằng giữa các môn. Bảng làm mới mỗi tuần. Bạn có thể tắt tham gia trong Cài đặt.</p>
    </div>`;
}
