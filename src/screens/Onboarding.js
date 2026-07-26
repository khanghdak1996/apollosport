import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Wrap, Btn, Label } from '../ui/primitives.js';
import { ACTIVITIES } from '../domain/activities.js';

export function Onboarding({ initialName = '', onDone }) {
  const [name, setName] = useState(initialName);
  const [dept, setDept] = useState('');
  const [center, setCenter] = useState('');
  const [sports, setSports] = useState([]);
  const [busy, setBusy] = useState(false);

  const toggle = (id) => setSports(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const submit = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    try { await onDone({ name: name.trim(), dept: dept.trim(), center: center.trim(), sports }); }
    finally { setBusy(false); }
  };

  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 15, color: C.txt1, background: '#fff' };

  return html`
    <${Wrap}>
      <div style=${{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '26px 18px 32px' }}>
        <h1 style=${{ margin: '0 0 6px', fontSize: 26, fontWeight: 600, color: C.txt1, letterSpacing: '-0.02em' }}>Chào mừng! 👋</h1>
        <p style=${{ margin: '0 0 24px', color: C.txt2, fontSize: 14.5, lineHeight: 1.5 }}>Vài thông tin để bắt đầu. Bạn có thể đổi lại bất cứ lúc nào trong Cài đặt.</p>

        <${Label} t="Tên hiển thị"/>
        <input value=${name} onInput=${e => setName(e.target.value)} placeholder="Tên của bạn" style=${inputStyle}/>

        <${Label} t="Phòng ban / Bộ phận" mt=${18}/>
        <input value=${dept} onInput=${e => setDept(e.target.value)} placeholder="VD: Kỹ thuật, Marketing..." style=${inputStyle}/>

        <${Label} t="Trung tâm / Cơ sở" mt=${18}/>
        <input value=${center} onInput=${e => setCenter(e.target.value)} placeholder="VD: Hà Nội, HCM..." style=${inputStyle}/>

        <${Label} t="Môn bạn hay tập (tuỳ chọn)" mt=${18}/>
        <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          ${ACTIVITIES.filter(a => a.id !== 'other').map(a => {
            const on = sports.includes(a.id);
            return html`
              <button key=${a.id} onClick=${() => toggle(a.id)} class="btn-action" style=${{
                padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                border: `1px solid ${on ? a.color : C.bdr}`,
                background: on ? a.color + '1A' : '#fff', color: on ? a.color : C.txt2,
              }}>${a.label}</button>`;
          })}
        </div>

        <div style=${{ marginTop: 26, background: C.bg3, borderRadius: r.md, padding: '14px 16px', fontSize: 13, color: C.txt2, lineHeight: 1.55 }}>
          🔒 <b style=${{ color: C.txt1 }}>Riêng tư:</b> Cân nặng và số đo của bạn <b>luôn riêng tư</b>, không ai thấy. Buổi tập của bạn sẽ hiển thị với đồng nghiệp trong bảng tin — bạn có thể đặt riêng tư từng buổi bất cứ lúc nào.
        </div>
      </div>

      <div style=${{ borderTop: `1px solid ${C.bdr}`, padding: '14px 18px', background: '#fff', paddingBottom: 'calc(14px + env(safe-area-inset-bottom))' }}>
        <${Btn} onClick=${submit} cx=${{ width: '100%', padding: '14px', fontSize: 15, opacity: (!name.trim() || busy) ? 0.5 : 1, pointerEvents: (!name.trim() || busy) ? 'none' : 'auto' }}>
          ${busy ? 'Đang lưu...' : 'Bắt đầu'}
        </${Btn}>
      </div>
    </${Wrap}>`;
}
