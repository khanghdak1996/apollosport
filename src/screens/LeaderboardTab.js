// src/screens/LeaderboardTab.js — bản redesign. THAY TOÀN BỘ file cũ.
// Khác bản cũ: header nền xanh đậm, tab Tuần/Tháng dạng gạch chân (không phải
// segmented thứ hai xếp chồng), và BỤC VINH DANH top 3 ngay trong vùng xanh.
import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND, SHADOW } from '../ui/theme.js';
import { Empty } from '../ui/primitives.js';
import { SportIcon } from '../ui/sportIcons.js';
import { periodId, allEntries } from '../data/repo-leaderboard.js';

function Ava({ row, size, ring, ringW = 2 }) {
  const st = { width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `${ringW}px solid ${ring}`, flexShrink: 0 };
  if (row && row.photoURL) return html`<img src=${row.photoURL} style=${st}/>`;
  return html`<div style=${{ ...st, background: BRAND.babyBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.4, color: BRAND.blue }}>${((row && row.name) || '?').charAt(0).toUpperCase()}</div>`;
}

export function LeaderboardTab({ me, onOpenProfile }) {
  const [scope, setScope] = useState('company');
  const [range, setRange] = useState('week');
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

  const TOP_N = 50; // chỉ hiển thị top 50; nếu bạn ngoài top 50 thì hiện thẻ hạng riêng bên dưới
  const mine = rows.find(r => r.uid === me.uid);
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3, TOP_N);
  const meInList = rows.slice(0, TOP_N).some(r => r.uid === me.uid);

  // Bục: cột giữa = hạng 1, cao & rộng hơn (flex 1.15).
  const step = (row, rank) => {
    if (!row) return html`<div style=${{ flex: rank === 1 ? 1.15 : 1 }}/>`;
    const first = rank === 1;
    const pad = first ? '13px 0 16px' : rank === 2 ? '9px 0 12px' : '7px 0 10px';
    return html`
      <div onClick=${() => onOpenProfile && onOpenProfile(row.uid)} style=${{ flex: first ? 1.15 : 1, textAlign: 'center', cursor: 'pointer', minWidth: 0 }}>
        ${first ? html`<div style=${{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}><${SportIcon} k="crown" size=${22} color=${BRAND.yellow} sw=${2}/></div>` : ''}
        <div style=${{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <${Ava} row=${row} size=${first ? 58 : 46} ring=${first ? BRAND.yellow : '#fff'} ringW=${first ? 3 : 2}/>
        </div>
        <p style=${{ margin: 0, fontSize: first ? 11.5 : 11, fontWeight: first ? 700 : 600, color: first ? '#fff' : '#EAF3FB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          ${row.uid === me.uid ? 'Bạn' : row.name}
        </p>
        <div style=${{ background: '#fff', borderRadius: '12px 12px 0 0', padding: pad, marginTop: 7 }}>
          <p style=${{ margin: 0, ...T.num, fontSize: first ? 28 : rank === 2 ? 21 : 20, lineHeight: 1, color: first ? BRAND.blue : C.txt1 }}>${row.points || 0}</p>
          <p style=${{ margin: '2px 0 0', fontSize: 10, letterSpacing: '.1em', color: C.txt4 }}>HẠNG ${rank}</p>
        </div>
      </div>`;
  };

  const rowView = (row, highlight) => html`
    <div key=${row.uid} onClick=${() => onOpenProfile && onOpenProfile(row.uid)} class="card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: `1px solid ${C.bdr2}`, cursor: 'pointer', background: highlight ? C.bg3 : 'transparent' }}>
      <span style=${{ width: 26, textAlign: 'center', ...T.num, fontSize: 16, color: C.txt2 }}>${row.rank}</span>
      <${Ava} row=${row} size=${34} ring=${C.bdr}/>
      <div style=${{ flex: 1, minWidth: 0 }}>
        <p style=${{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${row.name}${row.uid === me.uid ? ' (bạn)' : ''}</p>
        <p style=${{ margin: '1px 0 0', fontSize: 11, color: C.txt4 }}>${row.dept || '—'} · ${row.sessions || 0} buổi · ${row.minutes || 0} phút</p>
      </div>
      <p style=${{ margin: 0, ...T.num, fontSize: 19, color: C.txt1 }}>${row.points || 0}</p>
    </div>`;

  const segTop = (val, label, iconKey) => html`
    <button onClick=${() => setScope(val)} class="btn-action" style=${{
      flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '8px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600, border: 'none',
      background: scope === val ? '#fff' : 'transparent', color: scope === val ? BRAND.blue : '#DCEAF7',
    }}><${SportIcon} k=${iconKey} size=${15} color=${scope === val ? BRAND.blue : '#DCEAF7'}/>${label}</button>`;

  const tabRange = (val, label) => html`
    <button onClick=${() => setRange(val)} class="btn-action" style=${{
      background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 0 3px', fontSize: 13,
      fontWeight: range === val ? 700 : 500, color: range === val ? '#fff' : BRAND.babyBlue,
      borderBottom: range === val ? `2px solid ${BRAND.yellow}` : '2px solid transparent',
    }}>${label}</button>`;

  const empty = scope === 'dept' && !me.dept;

  return html`
    <div class="fade-in">
      <div style=${{ background: BRAND.blue, padding: '18px 18px 0', color: '#fff' }}>
        <p style=${{ margin: '0 0 3px', ...T.h1 }}>BẢNG XẾP HẠNG</p>
        <p style=${{ margin: '0 0 12px', fontFamily: F.serif, fontStyle: 'italic', fontSize: 12, color: BRAND.babyBlue }}>Điểm quy đổi theo cường độ — công bằng giữa mọi môn.</p>

        <div style=${{ display: 'flex', background: 'rgba(255,255,255,.16)', borderRadius: r.md, padding: 3, marginBottom: 10 }}>
          ${segTop('company', 'Toàn công ty', 'globe')}
          ${segTop('dept', 'Phòng ban', 'people')}
        </div>
        <div style=${{ display: 'flex', gap: 16, padding: '0 4px 14px' }}>
          ${tabRange('week', 'Tuần này')}
          ${tabRange('month', 'Tháng này')}
        </div>

        ${!empty && !loading && podium.length > 0 ? html`
          <div style=${{ display: 'flex', alignItems: 'flex-end', gap: 10, padding: '0 4px' }}>
            ${step(podium[1], 2)}
            ${step(podium[0], 1)}
            ${step(podium[2], 3)}
          </div>` : html`<div style=${{ height: 8 }}/>`}
      </div>

      <div style=${{ padding: '14px 16px 80px' }}>
        ${empty
          ? html`<${Empty} icon="people" msg="Bạn chưa có phòng ban" sub="Cập nhật phòng ban trong Cài đặt để xem bảng này"/>`
          : loading
            ? html`<p style=${{ textAlign: 'center', color: C.txt4, fontSize: 13, padding: 30 }}>Đang tải...</p>`
            : rows.length === 0
              ? html`<${Empty} icon="trophy" msg="Chưa có ai trong kỳ này" sub="Ghi buổi tập đầu tiên để dẫn đầu!"/>`
              : html`
                ${rest.length > 0 ? html`
                  <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, overflow: 'hidden' }}>
                    ${rest.map(row => rowView(row, row.uid === me.uid))}
                  </div>` : ''}
                ${mine && !meInList ? html`
                  <div style=${{ marginTop: 12, background: C.bg2, border: `2px solid ${BRAND.blue}`, borderRadius: r.xl, overflow: 'hidden', boxShadow: SHADOW.raised }}>
                    ${rowView(mine, false)}
                  </div>` : ''}`}

        <p style=${{ margin: '14px 6px 0', fontFamily: F.serif, fontSize: 11.5, lineHeight: 1.6, color: C.txt3, textAlign: 'center' }}>
          Bảng làm mới mỗi tuần. Bạn có thể tắt tham gia trong Cài đặt.
        </p>
      </div>
    </div>`;
}
