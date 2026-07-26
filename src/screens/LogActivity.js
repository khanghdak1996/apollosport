import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Wrap, Btn, Label } from '../ui/primitives.js';
import { Icons } from '../ui/icons.js';
import { actOf, fieldsOf } from '../domain/activities.js';

const mmss = minutes => {
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

// Giá trị hiển thị cho ô `pace` (tự tính, không lưu trực tiếp).
const paceDisplay = (mode, vals) => {
  const dur = parseFloat(vals.durationMin) || 0;
  if (mode === '100m') {
    const m = parseFloat(vals.distanceM) || 0;
    return (m > 0 && dur > 0) ? `${mmss(dur / (m / 100))} /100m` : '—';
  }
  const km = parseFloat(vals.distanceKm) || 0;
  if (mode === 'kmh') return (km > 0 && dur > 0) ? `${Math.round((km / (dur / 60)) * 10) / 10} km/h` : '—';
  return (km > 0 && dur > 0) ? `${mmss(dur / km)} /km` : '—';
};

// Form ghi buổi tập cho môn ngoài gym (theo fields riêng của môn — "mức Vừa").
// onSave(input) -> parent lo build + upload ảnh + lưu.
export function LogActivity({ type, defaultVisibility = 'company', onBack, onSave, hasGuide = false, onOpenGuide }) {
  const a = actOf(type);
  const fields = fieldsOf(type);
  const primary = fields.filter(f => !f.adv);
  const advanced = fields.filter(f => f.adv);
  const hasMore = advanced.length > 0 || a.laps;

  const initVals = {};
  fields.forEach(f => {
    if (f.type === 'pace') return;
    initVals[f.k] = (f.type === 'seg' || f.type === 'select') ? (f.def ?? f.opts[0])
      : f.type === 'counter' ? (f.def ?? 0) : '';
  });

  const [title, setTitle] = useState('');
  const [vals, setVals] = useState(initVals);
  const [laps, setLaps] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [note, setNote] = useState('');
  const [visibility, setVisibility] = useState(defaultVisibility);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setVals(o => ({ ...o, [k]: v }));
  const bump = (k, d, f) => setVals(o => {
    const next = Math.max(0, Math.min(f.max ?? 99, (parseFloat(o[k]) || 0) + d));
    return { ...o, [k]: next };
  });
  const durOk = parseFloat(vals.durationMin) > 0;

  const pickPhoto = e => {
    const f = e.target.files[0];
    if (!f) return;
    setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f));
  };

  const addLap = () => setLaps(l => [...l, { dist: '', time: '' }]);
  const setLap = (i, k, v) => setLaps(l => l.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const delLap = i => setLaps(l => l.filter((_, j) => j !== i));

  const submit = async () => {
    if (!durOk || saving) return;
    setSaving(true);
    try {
      const cleanLaps = laps
        .filter(x => x.dist !== '' || x.time !== '')
        .map((x, i) => ({ n: i + 1, dist: parseFloat(x.dist) || 0, time: x.time || '' }));
      await onSave({
        type,
        title: title.trim() || a.label,
        note: note.trim(),
        durationMin: parseFloat(vals.durationMin) || 0,
        vals,
        laps: cleanLaps,
        visibility,
        photoFile,
      });
    } finally { setSaving(false); }
  };

  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 15, color: C.txt1, background: '#fff' };

  const renderField = f => html`
    <div key=${f.k} style=${{ marginBottom: 16 }}>
      <${Label} t=${f.label}/>
      ${f.type === 'pace'
        ? html`<div style=${{ ...inputStyle, background: C.bg3, color: C.txt2, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style=${{ fontSize: 13 }}>⚡ tự tính:</span>
            <strong style=${{ color: ACC }}>${paceDisplay(f.mode, vals)}</strong>
          </div>`
        : (f.type === 'seg' || f.type === 'select')
          ? html`<div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              ${f.opts.map(o => html`
                <button key=${o} onClick=${() => set(f.k, o)} class="btn-action" style=${{
                  flex: f.type === 'seg' ? 1 : '0 0 auto', padding: '10px 14px', borderRadius: r.md, cursor: 'pointer', fontSize: 14, fontWeight: 500,
                  border: `1px solid ${vals[f.k] === o ? ACC : C.bdr}`,
                  background: vals[f.k] === o ? 'var(--accent-glow)' : '#fff',
                  color: vals[f.k] === o ? ACC : C.txt2,
                }}>${o}</button>`)}
            </div>`
          : f.type === 'counter'
            ? html`<div style=${{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick=${() => bump(f.k, -1, f)} class="btn-action" style=${{ width: 44, height: 44, borderRadius: r.md, border: `1px solid ${C.bdr}`, background: '#fff', fontSize: 22, color: C.txt2, cursor: 'pointer' }}>−</button>
                <span style=${{ minWidth: 40, textAlign: 'center', fontSize: 22, fontWeight: 600, color: C.txt1 }}>${vals[f.k] || 0}</span>
                <button onClick=${() => bump(f.k, 1, f)} class="btn-action" style=${{ width: 44, height: 44, borderRadius: r.md, border: `1px solid ${ACC}`, background: 'var(--accent-glow)', fontSize: 22, color: ACC, cursor: 'pointer' }}>＋</button>
              </div>`
            : f.type === 'time'
              ? html`<input inputMode="numeric" value=${vals[f.k]} onInput=${e => set(f.k, e.target.value)} placeholder="mm:ss" style=${inputStyle}/>`
              : html`<input type="number" inputMode="decimal" value=${vals[f.k]} onInput=${e => set(f.k, e.target.value)} placeholder=${f.required ? 'Bắt buộc' : (f.unit || 'Tuỳ chọn')} style=${inputStyle}/>`}
    </div>`;

  return html`
    <${Wrap}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>
        <h2 style=${{ flex: 1, margin: 0, fontSize: 17, fontWeight: 600, color: C.txt1 }}>${a.emoji} ${a.label}</h2>
        <${Btn} onClick=${submit} cx=${{ opacity: (!durOk || saving) ? 0.5 : 1, pointerEvents: (!durOk || saving) ? 'none' : 'auto' }}>${saving ? 'Đang lưu...' : 'Lưu'}</${Btn}>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '18px 16px', WebkitOverflowScrolling: 'touch' }}>
        <input value=${title} onInput=${e => setTitle(e.target.value)} placeholder=${'Tiêu đề (VD: ' + a.label + ' sáng)'} style=${{ width: '100%', boxSizing: 'border-box', border: 'none', background: 'transparent', fontSize: 22, fontWeight: 600, color: C.txt1, letterSpacing: '-0.02em', marginBottom: 18, padding: 0 }}/>

        ${hasGuide && onOpenGuide && html`
          <button onClick=${onOpenGuide} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', cursor: 'pointer', background: 'var(--accent-glow)', border: 'none', borderRadius: r.md, padding: '10px 14px', marginBottom: 18 }}>
            <span style=${{ fontSize: 18 }}>📖</span>
            <span style=${{ flex: 1, fontSize: 13, fontWeight: 500, color: ACC }}>Hướng dẫn ${a.label.toLowerCase()} cho người mới</span>
            <span style=${{ color: ACC, fontSize: 16 }}>›</span>
          </button>`}

        ${primary.map(renderField)}

        ${hasMore && html`
          <button onClick=${() => setShowMore(s => !s)} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: ACC, fontSize: 13.5, fontWeight: 500, cursor: 'pointer', padding: '4px 0', marginBottom: 8 }}>
            ${showMore ? 'Ẩn bớt ▴' : 'Thêm chi tiết ▾'}
          </button>`}

        ${showMore && html`
          <div>
            ${advanced.map(renderField)}
            ${a.laps && html`
              <div style=${{ marginBottom: 16 }}>
                <${Label} t="Chia chặng / lap (tuỳ chọn)"/>
                ${laps.map((lp, i) => html`
                  <div key=${i} style=${{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style=${{ width: 24, fontSize: 12, color: C.txt3, flexShrink: 0 }}>#${i + 1}</span>
                    <input type="number" inputMode="decimal" value=${lp.dist} onInput=${e => setLap(i, 'dist', e.target.value)} placeholder=${type === 'swim' ? 'm' : 'km'} style=${{ ...inputStyle, flex: 1 }}/>
                    <input inputMode="numeric" value=${lp.time} onInput=${e => setLap(i, 'time', e.target.value)} placeholder="mm:ss" style=${{ ...inputStyle, flex: 1 }}/>
                    <button onClick=${() => delLap(i)} class="btn-action" style=${{ width: 36, height: 36, borderRadius: r.md, border: `1px solid ${C.bdr}`, background: '#fff', color: C.txt3, cursor: 'pointer', flexShrink: 0 }}>✕</button>
                  </div>`)}
                <button onClick=${addLap} class="btn-action" style=${{ width: '100%', padding: '10px', borderRadius: r.md, border: `1.5px dashed ${C.bdr2}`, background: 'transparent', color: C.txt2, fontSize: 13.5, cursor: 'pointer' }}>＋ Thêm chặng</button>
              </div>`}
          </div>`}

        <${Label} t="Ghi chú" mt=${4}/>
        <textarea value=${note} onInput=${e => setNote(e.target.value)} placeholder="Cảm giác hôm nay thế nào?" rows=${2} style=${{ ...inputStyle, resize: 'none' }}/>

        <label style=${{ display: 'block', cursor: 'pointer', margin: '16px 0' }}>
          <input type="file" accept="image/*" style=${{ display: 'none' }} onChange=${pickPhoto}/>
          ${photoPreview
            ? html`<img src=${photoPreview} style=${{ width: '100%', borderRadius: r.lg, aspectRatio: '4/3', objectFit: 'cover' }}/>`
            : html`<div style=${{ padding: '18px', borderRadius: r.lg, border: `1.5px dashed ${C.bdr2}`, textAlign: 'center', color: C.txt3, fontSize: 13 }}>＋ Thêm ảnh (tuỳ chọn)</div>`}
        </label>
        <p style=${{ margin: '0 0 16px', fontSize: 11.5, color: C.txt3 }}>Ảnh sẽ hiển thị với toàn bộ đồng nghiệp.</p>

        <${Label} t="Hiển thị"/>
        <div style=${{ display: 'flex', gap: 8 }}>
          ${[{ v: 'company', l: '🌏 Đồng nghiệp' }, { v: 'private', l: '🔒 Chỉ mình tôi' }].map(o => html`
            <button key=${o.v} onClick=${() => setVisibility(o.v)} class="btn-action" style=${{
              flex: 1, padding: '11px', borderRadius: r.md, cursor: 'pointer', fontSize: 13.5, fontWeight: 500,
              border: `1px solid ${visibility === o.v ? ACC : C.bdr}`,
              background: visibility === o.v ? 'var(--accent-glow)' : '#fff',
              color: visibility === o.v ? ACC : C.txt2,
            }}>${o.l}</button>`)}
        </div>
      </div>
    </${Wrap}>`;
}
