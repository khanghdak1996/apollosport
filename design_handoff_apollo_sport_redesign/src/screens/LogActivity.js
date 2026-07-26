// src/screens/LogActivity.js — bản redesign. THAY TOÀN BỘ file cũ.
// Khác bản cũ: các ô số GỘP vào một thẻ (nhãn trái, số condensed 30px phải),
// nút chọn dùng nền xanh đặc khi active, và có Ô QUY ĐỔI ĐIỂM cập nhật ngay.
import { useState, useMemo } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND, sportColor, sportTint } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { actOf } from '../domain/activities.js';

const INTENS = [{ v: 'light', l: 'Nhẹ' }, { v: 'moderate', l: 'Vừa' }, { v: 'vigorous', l: 'Mạnh' }];
const INTENS_LABEL = { light: 'nhẹ', moderate: 'vừa', vigorous: 'mạnh' };

// Hàng số trong thẻ: nhãn + hint bên trái, số lớn bên phải.
function NumRow({ label, hint, value, unit, onInput, first, placeholder = '—' }) {
  return html`
    <div style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 0', borderTop: first ? 'none' : `1px solid ${C.bdr2}` }}>
      <div style=${{ minWidth: 0 }}>
        <p style=${{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.txt1 }}>${label}</p>
        ${hint ? html`<p style=${{ margin: '1px 0 0', fontSize: 11, color: C.txt4 }}>${hint}</p>` : ''}
      </div>
      <div style=${{ display: 'flex', alignItems: 'baseline', gap: 5, flexShrink: 0 }}>
        <input value=${value} onInput=${onInput} inputmode="decimal" placeholder=${placeholder}
          style=${{ width: 90, background: 'transparent', border: 'none', outline: 'none', textAlign: 'right', fontFamily: F.display, fontWeight: 700, fontSize: 30, lineHeight: 1, color: C.txt1, padding: 0 }}/>
        <span style=${{ fontSize: 12, color: C.txt3 }}>${unit}</span>
      </div>
    </div>`;
}

// Nút chọn chia đều — active = nền xanh đặc, chữ trắng.
function Choice({ items, value, onPick }) {
  return html`
    <div style=${{ display: 'flex', gap: 8, marginBottom: 16 }}>
      ${items.map(it => {
        const on = value === it.v;
        return html`
          <button key=${it.v} onClick=${() => onPick(it.v)} class="btn-action" style=${{
            flex: 1, padding: 12, borderRadius: 13, cursor: 'pointer', fontSize: 14, fontWeight: 600,
            background: on ? BRAND.blue : C.bg2, color: on ? '#fff' : C.txt2,
            border: on ? `1px solid ${BRAND.blue}` : `1px solid ${C.bdr}`,
          }}>${it.l}</button>`;
      })}
    </div>`;
}

export function LogActivity({ type, onSave, onBack, estimatePoints }) {
  const a = actOf(type);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState('');
  const [distance, setDistance] = useState('');
  const [intensity, setIntensity] = useState('moderate');
  const [outdoor, setOutdoor] = useState(true);
  const [note, setNote] = useState('');
  const [visibility, setVisibility] = useState('team');

  const min = parseFloat(minutes) || 0;
  const km = parseFloat(distance) || 0;
  const isDistance = a.kind === 'distance';

  // Tốc độ / pace tự tính — người dùng không nhập.
  const derived = useMemo(() => {
    if (!isDistance || !km || !min) return null;
    if (type === 'cycle') return { l: 'Tốc độ trung bình', v: (Math.round((km / (min / 60)) * 10) / 10).toString().replace('.', ','), u: 'km/h' };
    const p = min / km;
    const mm = Math.floor(p), ss = Math.round((p - mm) * 60);
    return { l: 'Pace', v: mm + ':' + String(ss).padStart(2, '0'), u: '/km' };
  }, [isDistance, km, min, type]);

  // Điểm quy đổi — cập nhật mỗi lần đổi phút hoặc cường độ.
  const points = useMemo(() => {
    if (estimatePoints) return estimatePoints({ type, durationMin: min, intensity });
    const met = { light: 3, moderate: 6, vigorous: 9 }[intensity] || 6;
    return Math.round(min * met * 0.25);
  }, [min, intensity, type, estimatePoints]);

  const canSave = min > 0;

  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      <div style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.bg2, borderBottom: `1px solid ${C.bdr}`, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <span style=${{ width: 34, height: 34, borderRadius: 10, background: sportTint(a.iconKey), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <${SportIcon} k=${a.iconKey} size=${20} color=${sportColor(a.iconKey)}/>
        </span>
        <p style=${{ flex: 1, margin: 0, ...T.h2 }}>${a.label}</p>
        <button onClick=${() => canSave && onSave({ type, title, durationMin: min, detail: { distanceKm: km || null, outdoor }, intensity, note, visibility, points })}
          class="btn-action" disabled=${!canSave} style=${{
            background: canSave ? BRAND.blue : '#A9C6DF', color: '#fff', border: 'none', borderRadius: r.md,
            padding: '10px 20px', cursor: canSave ? 'pointer' : 'default', flexShrink: 0,
            fontFamily: F.display, fontWeight: 700, fontSize: 15, letterSpacing: '.08em',
          }}>LƯU</button>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '16px 16px 40px' }}>
        <input value=${title} onInput=${e => setTitle(e.target.value)} placeholder=${'VD: ' + a.label + ' sáng'}
          style=${{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: 'none', outline: 'none', fontSize: 20, fontWeight: 600, color: C.txt1, padding: 0, marginBottom: 16, fontFamily: F.body }}/>

        <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '4px 16px', marginBottom: 12 }}>
          <${NumRow} first=${true} label="Thời lượng" hint="Bắt buộc" value=${minutes} unit="phút" onInput=${e => setMinutes(e.target.value)}/>
          ${isDistance ? html`<${NumRow} label="Quãng đường" hint="Tuỳ chọn" value=${distance} unit=${type === 'swim' ? 'm' : 'km'} onInput=${e => setDistance(e.target.value)}/>` : ''}
          ${derived ? html`
            <div style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderTop: `1px solid ${C.bdr2}` }}>
              <p style=${{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.txt2 }}>${derived.l}</p>
              <div style=${{ display: 'flex', alignItems: 'center', gap: 6, background: C.bg3, borderRadius: 9, padding: '5px 10px' }}>
                <${SportIcon} k="bolt" size=${14} color=${BRAND.blue} sw=${2}/>
                <span style=${{ fontFamily: F.display, fontWeight: 700, fontSize: 16, color: BRAND.blue }}>${derived.v}</span>
                <span style=${{ fontSize: 11, color: C.txt2 }}>${derived.u}</span>
              </div>
            </div>` : ''}
        </div>

        ${isDistance ? html`
          <p style=${{ margin: '0 2px 8px', ...T.label }}>ĐỊA ĐIỂM</p>
          <${Choice} items=${[{ v: false, l: 'Trong nhà' }, { v: true, l: 'Ngoài trời' }]} value=${outdoor} onPick=${setOutdoor}/>` : ''}

        <p style=${{ margin: '0 2px 8px', ...T.label }}>CƯỜNG ĐỘ</p>
        <${Choice} items=${INTENS} value=${intensity} onPick=${setIntensity}/>

        <!-- Ô quy đổi điểm — cho người dùng thấy công sức quy ra gì TRƯỚC khi bấm Lưu -->
        <div style=${{ display: 'flex', alignItems: 'center', gap: 12, background: BRAND.babyBlue, borderRadius: r.lg, padding: '14px 16px', marginBottom: 16 }}>
          <div style=${{ flex: 1, minWidth: 0 }}>
            <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 13, letterSpacing: '.1em', color: '#2E5A80' }}>BUỔI NÀY ĐƯỢC</p>
            <p style=${{ margin: '2px 0 0', fontFamily: F.serif, fontStyle: 'italic', fontSize: 11.5, color: '#3D6285' }}>
              ${min > 0 ? min + ' phút × cường độ ' + INTENS_LABEL[intensity] : 'Nhập thời lượng để xem điểm'}
            </p>
          </div>
          <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 34, lineHeight: 1, color: C.txt1, flexShrink: 0 }}>
            ${points}<span style=${{ fontSize: 15, letterSpacing: '.06em', marginLeft: 5 }}>ĐIỂM</span>
          </p>
        </div>

        <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '14px 16px', marginBottom: 12 }}>
          <p style=${{ margin: '0 0 8px', ...T.label }}>GHI CHÚ</p>
          <textarea value=${note} onInput=${e => setNote(e.target.value)} placeholder="Cảm giác hôm nay thế nào?" rows=${2}
            style=${{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: 14, color: C.txt1, fontFamily: F.body, lineHeight: 1.5, padding: 0 }}/>
        </div>

        <div style=${{ border: '1.5px dashed #C7D8E6', borderRadius: r.xl, padding: 20, textAlign: 'center', marginBottom: 16, cursor: 'pointer' }}>
          <div style=${{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><${SportIcon} k="photo" size=${22} color=${C.txt4} sw=${1.8}/></div>
          <p style=${{ margin: 0, fontSize: 13, fontWeight: 600, color: C.txt3 }}>Thêm ảnh</p>
          <p style=${{ margin: '2px 0 0', fontSize: 11, color: C.txt4 }}>Ảnh sẽ hiển thị với toàn bộ đồng nghiệp</p>
        </div>

        <div style=${{ display: 'flex', gap: 8 }}>
          ${[{ v: 'team', l: 'Đồng nghiệp', k: 'globe' }, { v: 'private', l: 'Chỉ mình tôi', k: 'lock' }].map(o => {
            const on = visibility === o.v;
            return html`
              <button key=${o.v} onClick=${() => setVisibility(o.v)} class="btn-action" style=${{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 12,
                borderRadius: 13, cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
                background: on ? BRAND.blue : C.bg2, color: on ? '#fff' : C.txt2,
                border: on ? `1px solid ${BRAND.blue}` : `1px solid ${C.bdr}`,
              }}><${SportIcon} k=${o.k} size=${16} color=${on ? '#fff' : C.txt3} sw=${1.9}/>${o.l}</button>`;
          })}
        </div>
      </div>
    </div>`;
}
