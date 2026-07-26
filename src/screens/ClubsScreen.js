import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Wrap, Empty, Btn } from '../ui/primitives.js';
import { Icons } from '../ui/icons.js';
import { ACTIVITIES, actOf } from '../domain/activities.js';
import { listClubs, myClubIds, createClub } from '../data/repo-clubs.js';

export function ClubsScreen({ me, onBack, onOpenClub }) {
  const [clubs, setClubs] = useState([]);
  const [mine, setMine] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  // form
  const [name, setName] = useState('');
  const [sport, setSport] = useState('run');
  const [visibility, setVisibility] = useState('public');
  const [desc, setDesc] = useState('');

  const load = async () => {
    setLoading(true);
    const [list, ids] = await Promise.all([listClubs(), myClubIds(me.uid)]);
    setClubs(list); setMine(ids); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const id = await createClub({ name, sport, desc, coverEmoji: actOf(sport).emoji, visibility }, me);
      setCreating(false); setName(''); setDesc(''); setSport('run'); setVisibility('public');
      onOpenClub(id);
    } catch (e) { setSaving(false); }
    setSaving(false);
  };

  const myClubs = clubs.filter(c => mine.has(c.id));
  const otherClubs = clubs.filter(c => !mine.has(c.id));

  const clubCard = (c) => {
    const a = actOf(c.sport);
    const joined = mine.has(c.id);
    return html`
      <div key=${c.id} onClick=${() => onOpenClub(c.id)} class="card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.lg, padding: '13px 15px', marginBottom: 10, cursor: 'pointer' }}>
        <div style=${{ width: 44, height: 44, borderRadius: 12, background: a.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>${c.coverEmoji || a.emoji}</div>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${c.name}</p>
          <p style=${{ margin: '2px 0 0', fontSize: 11.5, color: C.txt3 }}>${a.label} · ${c.memberCount || 0} thành viên${c.visibility === 'invite' ? ' · 🔒 riêng' : ''}</p>
        </div>
        ${joined && html`<span style=${{ fontSize: 11, fontWeight: 600, color: ACC, background: 'var(--accent-glow)', borderRadius: 12, padding: '3px 9px', flexShrink: 0 }}>Đã vào</span>`}
        <span style=${{ color: C.txt3, fontSize: 18, flexShrink: 0 }}>›</span>
      </div>`;
  };

  return html`
    <${Wrap}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>
        <h2 style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: C.txt1, flex: 1 }}>Câu lạc bộ</h2>
        <button onClick=${() => setCreating(true)} class="btn-action" style=${{ background: ACC, border: 'none', borderRadius: 18, height: 34, padding: '0 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>＋ Tạo nhóm</button>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '16px', WebkitOverflowScrolling: 'touch' }}>
        ${loading
          ? html`<p style=${{ textAlign: 'center', color: C.txt3, fontSize: 13, padding: 30 }}>Đang tải...</p>`
          : html`
            ${myClubs.length > 0 && html`
              <p style=${{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Nhóm của bạn</p>
              ${myClubs.map(clubCard)}
              <div style=${{ height: 12 }}/>`}
            <p style=${{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>${otherClubs.length > 0 ? 'Khám phá nhóm' : ''}</p>
            ${otherClubs.map(clubCard)}
            ${clubs.length === 0 && html`<${Empty} icon="people" msg="Chưa có câu lạc bộ nào" sub="Tạo nhóm đầu tiên để rủ đồng nghiệp cùng môn!"/>`}`}
      </div>

      ${creating && html`
        <div style=${{ position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick=${() => !saving && setCreating(false)}>
          <div onClick=${e => e.stopPropagation()} style=${{ width: '100%', background: C.bg1, borderRadius: '20px 20px 0 0', padding: '18px 16px calc(18px + env(safe-area-inset-bottom))', maxHeight: '88%', overflowY: 'auto' }}>
            <h3 style=${{ margin: '0 0 16px', fontSize: 18, fontWeight: 600, color: C.txt1 }}>Tạo câu lạc bộ</h3>

            <p style=${{ margin: '0 0 5px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Tên nhóm</p>
            <input value=${name} onInput=${e => setName(e.target.value)} maxLength=${60} placeholder="VD: CLB Chạy bộ Apollo" style=${{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14.5, marginBottom: 14, background: '#fff', color: C.txt1 }}/>

            <p style=${{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Môn</p>
            <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              ${ACTIVITIES.map(a => html`
                <button key=${a.id} onClick=${() => setSport(a.id)} class="btn-action" style=${{ padding: '7px 12px', borderRadius: 18, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, border: `1px solid ${sport === a.id ? ACC : C.bdr}`, background: sport === a.id ? 'var(--accent-glow)' : '#fff', color: sport === a.id ? ACC : C.txt2 }}>${a.emoji} ${a.label}</button>`)}
            </div>

            <p style=${{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Quyền tham gia</p>
            <div style=${{ display: 'flex', gap: 8, marginBottom: 14 }}>
              ${[{ v: 'public', l: '🌐 Công khai', s: 'Ai cũng vào được' }, { v: 'invite', l: '🔒 Cần duyệt', s: 'Chủ nhóm duyệt' }].map(o => html`
                <button key=${o.v} onClick=${() => setVisibility(o.v)} class="btn-action" style=${{ flex: 1, textAlign: 'left', padding: '10px 12px', borderRadius: r.md, cursor: 'pointer', border: `1px solid ${visibility === o.v ? ACC : C.bdr}`, background: visibility === o.v ? 'var(--accent-glow)' : '#fff' }}>
                  <p style=${{ margin: 0, fontSize: 13, fontWeight: 600, color: visibility === o.v ? ACC : C.txt1 }}>${o.l}</p>
                  <p style=${{ margin: '2px 0 0', fontSize: 11, color: C.txt3 }}>${o.s}</p>
                </button>`)}
            </div>

            <p style=${{ margin: '0 0 5px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Mô tả (tuỳ chọn)</p>
            <textarea value=${desc} onInput=${e => setDesc(e.target.value)} rows=${2} maxLength=${300} placeholder="Nhóm này về điều gì?" style=${{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14, marginBottom: 16, resize: 'vertical', fontFamily: 'inherit', background: '#fff', color: C.txt1 }}/>

            <div style=${{ display: 'flex', gap: 8 }}>
              <button onClick=${() => setCreating(false)} class="btn-action" style=${{ flex: 1, padding: '11px', borderRadius: r.md, border: `1px solid ${C.bdr}`, background: '#fff', color: C.txt2, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Huỷ</button>
              <${Btn} onClick=${submit} cx=${{ flex: 1, opacity: (!name.trim() || saving) ? 0.5 : 1, pointerEvents: (!name.trim() || saving) ? 'none' : 'auto' }}>${saving ? 'Đang tạo...' : 'Tạo nhóm'}</${Btn}>
            </div>
          </div>
        </div>`}
    </${Wrap}>`;
}
