import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Wrap, Btn, Label } from '../ui/primitives.js';
import { ACTIVITIES, actLabel } from '../domain/activities.js';
import { DEPARTMENTS } from '../data/departments.js';
import { t } from '../i18n.js';

const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 15, color: C.txt1, background: '#fff' };

// Dropdown chọn Phòng ban / Trung tâm từ DEPARTMENTS (gõ để lọc) — cùng nguồn với Cài đặt.
function DeptSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();
  const shown = ql ? DEPARTMENTS.filter(o => o.toLowerCase().includes(ql)) : DEPARTMENTS;
  return html`
    <div style=${{ position: 'relative' }}>
      <input value=${open ? q : (value || '')}
        onFocus=${() => { setOpen(true); setQ(''); }}
        onBlur=${() => setTimeout(() => setOpen(false), 120)}
        onInput=${e => setQ(e.target.value)}
        placeholder=${t('ob.deptPlaceholder')} style=${inputStyle}/>
      ${open && html`
        <div style=${{ position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 30, marginTop: 6, background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.md, boxShadow: '0 12px 30px rgba(18,57,94,.16)', maxHeight: 240, overflowY: 'auto' }}>
          ${shown.length
      ? shown.map((o, i) => html`<div key=${o} onMouseDown=${() => { onChange(o); setOpen(false); setQ(''); }} style=${{ padding: '11px 14px', fontSize: 14, color: o === value ? ACC : C.txt1, fontWeight: o === value ? 700 : 500, cursor: 'pointer', borderTop: i ? `1px solid ${C.bdr2}` : 'none' }}>${o}</div>`)
      : html`<div style=${{ padding: '12px 14px', fontSize: 13, color: C.txt3 }}>${t('common.notFound', { q })}</div>`}
        </div>`}
    </div>`;
}

export function Onboarding({ initialName = '', onDone }) {
  const [name, setName] = useState(initialName);
  const [dept, setDept] = useState('');
  const [sports, setSports] = useState([]);
  const [busy, setBusy] = useState(false);

  const toggle = (id) => setSports(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const submit = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    try { await onDone({ name: name.trim(), dept: dept.trim(), center: '', sports }); }
    finally { setBusy(false); }
  };

  return html`
    <${Wrap}>
      <div style=${{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '26px 18px 32px' }}>
        <h1 style=${{ margin: '0 0 6px', fontSize: 26, fontWeight: 600, color: C.txt1, letterSpacing: '-0.02em' }}>${t('ob.welcome')}</h1>
        <p style=${{ margin: '0 0 24px', color: C.txt2, fontSize: 14.5, lineHeight: 1.5 }}>${t('ob.intro')}</p>

        <${Label} t=${t('ob.name')}/>
        <input value=${name} onInput=${e => setName(e.target.value)} placeholder=${t('ob.namePlaceholder')} style=${inputStyle}/>

        <${Label} t=${t('ob.dept')} mt=${18}/>
        <${DeptSelect} value=${dept} onChange=${setDept}/>

        <${Label} t=${t('ob.sports')} mt=${18}/>
        <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          ${ACTIVITIES.filter(a => a.id !== 'other').map(a => {
      const on = sports.includes(a.id);
      return html`
              <button key=${a.id} onClick=${() => toggle(a.id)} class="btn-action" style=${{
          padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 500,
          border: `1px solid ${on ? a.color : C.bdr}`,
          background: on ? a.color + '1A' : '#fff', color: on ? a.color : C.txt2,
        }}>${actLabel(a.id)}</button>`;
    })}
        </div>

        <div style=${{ marginTop: 26, background: C.bg3, borderRadius: r.md, padding: '14px 16px', fontSize: 13, color: C.txt2, lineHeight: 1.55 }}>
          <b style=${{ color: C.txt1 }}>${t('ob.privacyTitle')}</b> ${t('ob.privacyBody')}
        </div>
      </div>

      <div style=${{ borderTop: `1px solid ${C.bdr}`, padding: '14px 18px', background: '#fff', paddingBottom: 'calc(14px + env(safe-area-inset-bottom))' }}>
        <${Btn} onClick=${submit} cx=${{ width: '100%', padding: '14px', fontSize: 15, opacity: (!name.trim() || busy) ? 0.5 : 1, pointerEvents: (!name.trim() || busy) ? 'none' : 'auto' }}>
          ${busy ? t('ob.saving') : t('ob.start')}
        </${Btn}>
      </div>
    </${Wrap}>`;
}
