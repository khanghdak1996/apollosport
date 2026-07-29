import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND, sportColor, sportTint } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { actOf, fieldsOf, rpeOf, RPE_LEVELS } from '../domain/activities.js';
import { computePoints, effectiveMet } from '../domain/session.js';

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
// Bản redesign: header xanh + ô icon môn, các ô số gộp trong 1 thẻ, có ô QUY ĐỔI ĐIỂM live.
// GIỮ NGUYÊN registry fieldsOf → mọi môn vẫn có ô nhập riêng.
// onSave(input) -> parent lo build + upload ảnh + lưu.
export function LogActivity({ type, defaultVisibility = 'company', onBack, onSave, hasGuide = false, onOpenGuide }) {
  const a = actOf(type);
  const key = a.iconKey;
  const fields = fieldsOf(type);
  const primary = fields.filter(f => !f.adv);
  const advanced = fields.filter(f => f.adv);
  const hasMore = advanced.length > 0 || a.laps;

  const initVals = {};
  fields.forEach(f => {
    if (f.type === 'pace') return;
    initVals[f.k] = (f.type === 'seg' || f.type === 'select') ? (f.def ?? f.opts[0])
      : f.type === 'counter' ? (f.def ?? 0)
      : f.type === 'rpe' ? (f.def ?? 3)       // RPE bắt buộc, mặc định Vừa
      : '';                                    // number/time bắt đầu rỗng
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
  const durMin = parseFloat(vals.durationMin) || 0;
  // Đủ điều kiện Lưu: mọi field bắt buộc (thời lượng, quãng đường với môn pace…) phải có số hợp lệ > 0.
  const canSave = fields.every(f => {
    if (!f.required) return true;
    if (f.type === 'rpe') return (parseInt(vals[f.k]) || 0) > 0;
    if (f.type === 'number') return (parseFloat(vals[f.k]) || 0) > 0;
    return vals[f.k] != null && vals[f.k] !== '';
  });

  // Điểm quy đổi live — dùng đúng công thức computePoints (MET hiệu dụng × giờ × 10).
  const liveSession = { type, durationMin: durMin, detail: { ...vals, rpe: vals.rpe } };
  const livePoints = computePoints(liveSession);
  const liveMet = Math.round(effectiveMet(liveSession) * 10) / 10;
  const effortLabel = rpeOf(vals.rpe).label;
  // Dòng phụ ô điểm: "<phút> phút · [tốc độ/pace ·] <mức RPE> · ~<MET> MET".
  const paceField = fields.find(f => f.type === 'pace');
  const paceStr = paceField ? paceDisplay(paceField.mode, vals) : '—';
  const liveSubtitle = `${Math.round(durMin)} phút${paceStr && paceStr !== '—' ? ` · ${paceStr}` : ''} · ${effortLabel} · ~${liveMet} MET`;

  const pickPhoto = e => {
    const f = e.target.files[0];
    if (!f) return;
    setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f));
  };

  const addLap = () => setLaps(l => [...l, { dist: '', time: '' }]);
  const setLap = (i, k, v) => setLaps(l => l.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const delLap = i => setLaps(l => l.filter((_, j) => j !== i));

  const submit = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const cleanLaps = laps
        .filter(x => x.dist !== '' || x.time !== '')
        .map((x, i) => ({ n: i + 1, dist: parseFloat(x.dist) || 0, time: x.time || '' }));
      await onSave({
        type,
        title: title.trim() || a.label,
        note: note.trim(),
        durationMin: durMin,
        vals,
        laps: cleanLaps,
        visibility,
        photoFile,
      });
    } finally { setSaving(false); }
  };

  // ── Một dòng trong thẻ nhập ─────────────────────────────────────────────
  const numInput = { border: 'none', background: 'transparent', textAlign: 'right', fontFamily: F.display, fontWeight: 700, fontSize: 24, color: C.txt1, width: 130, padding: 0, letterSpacing: '.01em' };
  const rowWrap = (i, children) => html`<div style=${{ padding: '12px 0', borderTop: i ? `1px solid ${C.bdr2}` : 'none' }}>${children}</div>`;

  const renderRow = (f, i) => {
    if (f.type === 'pace') {
      return rowWrap(i, html`
        <div style=${{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style=${{ flex: 1, minWidth: 0 }}><p style=${{ margin: 0, ...T.label }}>${f.label}</p></div>
          <span style=${{ display: 'inline-flex', alignItems: 'center', gap: 5, background: C.bg3, borderRadius: 9, padding: '6px 10px', color: BRAND.blue, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap' }}>
            <${SportIcon} k="bolt" size=${14} color=${BRAND.blue}/>${paceDisplay(f.mode, vals)}
          </span>
        </div>`);
    }
    if (f.type === 'rpe') {
      return rowWrap(i, html`
        <p style=${{ margin: '0 0 8px', ...T.label }}>${f.label}</p>
        <div style=${{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          ${RPE_LEVELS.map(lv => {
            const on = (parseInt(vals[f.k]) || f.def) === lv.level;
            return html`<button key=${lv.level} onClick=${() => set(f.k, lv.level)} class="btn-action" style=${{
              display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', padding: '10px 12px', borderRadius: r.md, cursor: 'pointer',
              border: on ? 'none' : `1px solid ${C.bdr}`, background: on ? BRAND.blue : '#fff',
            }}>
              <span style=${{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: on ? 'rgba(255,255,255,.25)' : C.bg3, color: on ? '#fff' : C.txt3 }}>${lv.level}</span>
              <span style=${{ flex: 1, minWidth: 0 }}>
                <span style=${{ display: 'block', fontSize: 13.5, fontWeight: 700, color: on ? '#fff' : C.txt1 }}>${lv.label}</span>
                <span style=${{ display: 'block', fontSize: 11.5, color: on ? 'rgba(255,255,255,.85)' : C.txt3 }}>${lv.desc}</span>
              </span>
            </button>`;
          })}
        </div>`);
    }
    if (f.type === 'seg' || f.type === 'select') {
      return rowWrap(i, html`
        <p style=${{ margin: '0 0 8px', ...T.label }}>${f.label}</p>
        <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          ${f.opts.map(o => {
            const on = vals[f.k] === o;
            return html`<button key=${o} onClick=${() => set(f.k, o)} class="btn-action" style=${{
              flex: f.type === 'seg' ? 1 : '0 0 auto', padding: '9px 14px', borderRadius: r.md, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap',
              border: on ? 'none' : `1px solid ${C.bdr}`, background: on ? BRAND.blue : '#fff', color: on ? '#fff' : C.txt2,
            }}>${o}</button>`;
          })}
        </div>`);
    }
    if (f.type === 'counter') {
      return rowWrap(i, html`
        <div style=${{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <p style=${{ margin: 0, flex: 1, ...T.label }}>${f.label}</p>
          <button onClick=${() => bump(f.k, -1, f)} class="btn-action" style=${{ width: 38, height: 38, borderRadius: r.md, border: `1px solid ${C.bdr}`, background: '#fff', fontSize: 20, color: C.txt2, cursor: 'pointer' }}>−</button>
          <span style=${{ minWidth: 30, textAlign: 'center', fontFamily: F.display, fontWeight: 700, fontSize: 22, color: C.txt1 }}>${vals[f.k] || 0}</span>
          <button onClick=${() => bump(f.k, 1, f)} class="btn-action" style=${{ width: 38, height: 38, borderRadius: r.md, border: 'none', background: BRAND.blue, fontSize: 20, color: '#fff', cursor: 'pointer' }}>＋</button>
        </div>`);
    }
    // number | time — nhãn + hint trái, số condensed phải
    return rowWrap(i, html`
      <div style=${{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, ...T.label }}>${f.label}</p>
          ${f.required ? html`<p style=${{ margin: '2px 0 0', fontSize: 11, color: C.txt5 }}>Bắt buộc</p>` : ''}
        </div>
        ${f.type === 'time'
          ? html`<input inputMode="numeric" value=${vals[f.k]} onInput=${e => set(f.k, e.target.value)} placeholder="0:00" style=${numInput}/>`
          : html`<input type="number" inputMode="decimal" value=${vals[f.k]} onInput=${e => set(f.k, e.target.value)} placeholder="0" style=${numInput}/>`}
        ${f.unit ? html`<span style=${{ fontSize: 12.5, color: C.txt3, flexShrink: 0, width: 28 }}>${f.unit}</span>` : ''}
      </div>`);
  };

  const card = children => html`<div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '2px 16px', marginBottom: 14 }}>${children}</div>`;
  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 15, color: C.txt1, background: '#fff' };

  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style=${{ padding: '12px 16px', borderBottom: `1px solid ${C.bdr}`, background: C.bg2, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ background: C.bg1, border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/></button>
        <span style=${{ width: 34, height: 34, borderRadius: 10, background: sportTint(key), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><${SportIcon} k=${key} size=${19} color=${sportColor(key)}/></span>
        <p style=${{ flex: 1, margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 20, letterSpacing: '.03em', color: C.txt1, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${a.label}</p>
        <button onClick=${submit} class="btn-action" style=${{ background: BRAND.blue, border: 'none', borderRadius: r.md, padding: '10px 18px', fontFamily: F.display, fontWeight: 700, fontSize: 15, letterSpacing: '.08em', color: '#fff', cursor: 'pointer', textTransform: 'uppercase', flexShrink: 0, opacity: (!canSave || saving) ? 0.5 : 1, pointerEvents: (!canSave || saving) ? 'none' : 'auto' }}>${saving ? '…' : 'Lưu'}</button>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '16px 16px 40px', WebkitOverflowScrolling: 'touch' }}>
        <input value=${title} onInput=${e => setTitle(e.target.value)} placeholder=${'Tiêu đề (VD: ' + a.label + ' sáng)'} style=${{ width: '100%', boxSizing: 'border-box', border: 'none', background: 'transparent', fontSize: 20, fontWeight: 600, color: C.txt1, marginBottom: 14, padding: 0 }}/>

        ${hasGuide && onOpenGuide && html`
          <button onClick=${onOpenGuide} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', cursor: 'pointer', background: C.bg3, border: 'none', borderRadius: r.md, padding: '11px 14px', marginBottom: 14 }}>
            <${SportIcon} k="book" size=${17} color=${BRAND.blue}/>
            <span style=${{ flex: 1, fontSize: 13, fontWeight: 600, color: BRAND.blue }}>Hướng dẫn ${a.label.toLowerCase()} cho người mới</span>
            <${SportIcon} k="chevronR" size=${15} color=${BRAND.blue} sw=${2}/>
          </button>`}

        ${card(primary.map(renderRow))}

        ${hasMore && html`
          <button onClick=${() => setShowMore(s => !s)} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: BRAND.blue, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: '0 0 12px' }}>
            ${showMore ? 'Ẩn bớt ▴' : 'Thêm chi tiết ▾'}
          </button>`}

        ${showMore && html`
          ${advanced.length ? card(advanced.map(renderRow)) : ''}
          ${a.laps && html`
            <div style=${{ marginBottom: 14 }}>
              <p style=${{ margin: '0 0 8px 2px', ...T.label }}>Chia chặng / lap (tuỳ chọn)</p>
              ${laps.map((lp, i) => html`
                <div key=${i} style=${{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style=${{ width: 22, fontSize: 12, color: C.txt4, flexShrink: 0 }}>#${i + 1}</span>
                  <input type="number" inputMode="decimal" value=${lp.dist} onInput=${e => setLap(i, 'dist', e.target.value)} placeholder=${type === 'swim' ? 'm' : 'km'} style=${{ ...inputStyle, flex: 1 }}/>
                  <input inputMode="numeric" value=${lp.time} onInput=${e => setLap(i, 'time', e.target.value)} placeholder="mm:ss" style=${{ ...inputStyle, flex: 1 }}/>
                  <button onClick=${() => delLap(i)} class="btn-action" style=${{ width: 36, height: 36, borderRadius: r.md, border: `1px solid ${C.bdr}`, background: '#fff', color: C.txt4, cursor: 'pointer', flexShrink: 0 }}>✕</button>
                </div>`)}
              <button onClick=${addLap} class="btn-action" style=${{ width: '100%', padding: '10px', borderRadius: r.md, border: `1.5px dashed ${C.bdr2}`, background: 'transparent', color: C.txt2, fontSize: 13.5, cursor: 'pointer' }}>＋ Thêm chặng</button>
            </div>`}`}

        <!-- Ô QUY ĐỔI ĐIỂM — live theo phút × cường độ -->
        <div style=${{ display: 'flex', alignItems: 'center', gap: 12, background: BRAND.babyBlue, borderRadius: r.lg, padding: '14px 16px', marginBottom: 14 }}>
          <div style=${{ flex: 1, minWidth: 0 }}>
            <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 12, letterSpacing: '.1em', color: '#2E5A80', textTransform: 'uppercase' }}>Buổi này được</p>
            <p style=${{ margin: '2px 0 0', fontFamily: F.serif, fontStyle: 'italic', fontSize: 12, color: '#3D6285' }}>${canSave ? liveSubtitle : (a.category === 'pace' ? 'Nhập quãng đường để tính điểm' : 'Nhập thời lượng để tính điểm')}</p>
          </div>
          <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 34, lineHeight: 1, color: BRAND.blue, flexShrink: 0 }}>${livePoints}<span style=${{ fontSize: 14, marginLeft: 4 }}>đ</span></p>
        </div>

        <p style=${{ margin: '0 0 6px 2px', ...T.label }}>Ghi chú</p>
        <textarea value=${note} onInput=${e => setNote(e.target.value)} placeholder="Cảm giác hôm nay thế nào?" rows=${2} style=${{ ...inputStyle, resize: 'none', marginBottom: 14 }}/>

        <label style=${{ display: 'block', cursor: 'pointer', marginBottom: 6 }}>
          <input type="file" accept="image/*" style=${{ display: 'none' }} onChange=${pickPhoto}/>
          ${photoPreview
            ? html`<img src=${photoPreview} style=${{ width: '100%', borderRadius: r.xl, aspectRatio: '4/3', objectFit: 'cover' }}/>`
            : html`<div style=${{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '18px', borderRadius: r.xl, border: `1.5px dashed #C7D8E6`, color: C.txt3, fontSize: 13, fontWeight: 600 }}><${SportIcon} k="photo" size=${18} color=${C.txt3}/> Thêm ảnh (tuỳ chọn)</div>`}
        </label>
        <p style=${{ margin: '0 0 16px 2px', fontSize: 11.5, color: C.txt4 }}>Ảnh sẽ hiển thị với toàn bộ đồng nghiệp.</p>

        <p style=${{ margin: '0 0 8px 2px', ...T.label }}>Hiển thị</p>
        <div style=${{ display: 'flex', gap: 8 }}>
          ${[{ v: 'company', l: 'Đồng nghiệp', k: 'globe' }, { v: 'private', l: 'Chỉ mình tôi', k: 'lock' }].map(o => {
            const on = visibility === o.v;
            return html`<button key=${o.v} onClick=${() => setVisibility(o.v)} class="btn-action" style=${{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', borderRadius: r.md, cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
              border: on ? 'none' : `1px solid ${C.bdr}`, background: on ? BRAND.blue : '#fff', color: on ? '#fff' : C.txt2,
            }}><${SportIcon} k=${o.k} size=${15} color=${on ? '#fff' : C.txt3}/>${o.l}</button>`;
          })}
        </div>
      </div>
    </div>`;
}
