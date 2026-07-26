import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Btn } from '../ui/primitives.js';
import { ACTIVITIES, actOf } from '../domain/activities.js';
import { createGoal } from '../data/repo-goals.js';

const iso = d => d.toISOString().split('T')[0];

// Modal tạo mục tiêu chung. scope='company' (chọn môn tuỳ ý) hoặc 'club' (khoá theo môn nhóm).
export function GoalForm({ scope, clubId, clubName, clubSport, me, onCreated, onClose }) {
  const clubKind = clubSport ? actOf(clubSport).kind : null;   // 'distance' | 'session' | 'strength'
  const [title, setTitle] = useState('');
  // Mặc định theo môn: distance → km; còn lại (yoga/bóng/gym...) → số buổi.
  const [metric, setMetric] = useState(scope === 'club' && clubKind === 'distance' ? 'distanceKm' : 'sessions');
  const [sport, setSport] = useState(scope === 'club' ? (clubSport || '') : '');
  const [target, setTarget] = useState('');
  const [start, setStart] = useState(iso(new Date()));
  const [end, setEnd] = useState(iso(new Date(Date.now() + 30 * 86400000)));
  const [saving, setSaving] = useState(false);

  const metricNeedsSport = metric === 'distanceKm';
  const valid = title.trim() && Number(target) > 0 && start && end && start <= end && (!metricNeedsSport || sport);

  const submit = async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      const id = await createGoal({
        title, scope, clubId: scope === 'club' ? clubId : null, clubName: scope === 'club' ? clubName : null,
        metric, sport: sport || null, target: Number(target), startDate: start, endDate: end,
      }, me);
      onCreated && onCreated(id);
    } catch (e) { setSaving(false); return; }
    setSaving(false);
  };

  // 'Quãng đường (km)' chỉ có nghĩa với môn distance. Nhóm môn không distance → ẩn lựa chọn km.
  const allowKm = scope === 'company' || clubKind === 'distance';
  const metricOpts = [{ v: 'sessions', l: 'Số buổi' }, { v: 'minutes', l: 'Số phút' }, ...(allowKm ? [{ v: 'distanceKm', l: 'Quãng đường (km)' }] : [])];
  const unit = metric === 'minutes' ? 'phút' : metric === 'distanceKm' ? 'km' : 'buổi';

  return html`
    <div style=${{ position: 'absolute', inset: 0, zIndex: 250, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick=${() => !saving && onClose()}>
      <div onClick=${e => e.stopPropagation()} style=${{ width: '100%', background: C.bg1, borderRadius: '20px 20px 0 0', padding: '18px 16px calc(18px + env(safe-area-inset-bottom))', maxHeight: '90%', overflowY: 'auto' }}>
        <h3 style=${{ margin: '0 0 16px', fontSize: 18, fontWeight: 600, color: C.txt1 }}>${scope === 'club' ? `Mục tiêu nhóm${clubName ? ` · ${clubName}` : ''}` : 'Mục tiêu toàn công ty'}</h3>

        <p style=${{ margin: '0 0 5px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Tên mục tiêu</p>
        <input value=${title} onInput=${e => setTitle(e.target.value)} maxLength=${80} placeholder="VD: Cả nhóm chạy 1000km tháng này" style=${{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14.5, marginBottom: 14, background: '#fff', color: C.txt1 }}/>

        <p style=${{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Đo bằng</p>
        <div style=${{ display: 'flex', gap: 8, marginBottom: 14 }}>
          ${metricOpts.map(o => html`<button key=${o.v} onClick=${() => setMetric(o.v)} class="btn-action" style=${{ flex: 1, padding: '9px', borderRadius: r.md, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, border: `1px solid ${metric === o.v ? ACC : C.bdr}`, background: metric === o.v ? 'var(--accent-glow)' : '#fff', color: metric === o.v ? ACC : C.txt2 }}>${o.l}</button>`)}
        </div>

        ${scope === 'company' && html`
          <p style=${{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Môn ${metricNeedsSport ? '(bắt buộc)' : '(tuỳ chọn — để trống = mọi môn)'}</p>
          <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            <button onClick=${() => setSport('')} class="btn-action" style=${{ padding: '7px 12px', borderRadius: 18, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, border: `1px solid ${sport === '' ? ACC : C.bdr}`, background: sport === '' ? 'var(--accent-glow)' : '#fff', color: sport === '' ? ACC : C.txt2, opacity: metricNeedsSport ? 0.4 : 1, pointerEvents: metricNeedsSport ? 'none' : 'auto' }}>Mọi môn</button>
            ${ACTIVITIES.map(x => html`<button key=${x.id} onClick=${() => setSport(x.id)} class="btn-action" style=${{ padding: '7px 12px', borderRadius: 18, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, border: `1px solid ${sport === x.id ? ACC : C.bdr}`, background: sport === x.id ? 'var(--accent-glow)' : '#fff', color: sport === x.id ? ACC : C.txt2 }}>${x.emoji} ${x.label}</button>`)}
          </div>`}
        ${scope === 'club' && clubSport && html`<p style=${{ margin: '0 0 14px', fontSize: 12, color: C.txt3 }}>Môn: <strong style=${{ color: C.txt2 }}>${actOf(clubSport).emoji} ${actOf(clubSport).label}</strong> (theo nhóm)</p>`}

        <p style=${{ margin: '0 0 5px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Mục tiêu (${unit})</p>
        <input type="number" inputMode="numeric" value=${target} onInput=${e => setTarget(e.target.value)} placeholder="VD: 1000" style=${{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14.5, marginBottom: 14, background: '#fff', color: C.txt1 }}/>

        <div style=${{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <div style=${{ flex: 1 }}>
            <p style=${{ margin: '0 0 5px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Bắt đầu</p>
            <input type="date" value=${start} onInput=${e => setStart(e.target.value)} style=${{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14, background: '#fff', color: C.txt1 }}/>
          </div>
          <div style=${{ flex: 1 }}>
            <p style=${{ margin: '0 0 5px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Kết thúc</p>
            <input type="date" value=${end} onInput=${e => setEnd(e.target.value)} style=${{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14, background: '#fff', color: C.txt1 }}/>
          </div>
        </div>

        <div style=${{ display: 'flex', gap: 8 }}>
          <button onClick=${onClose} class="btn-action" style=${{ flex: 1, padding: '11px', borderRadius: r.md, border: `1px solid ${C.bdr}`, background: '#fff', color: C.txt2, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Huỷ</button>
          <${Btn} onClick=${submit} cx=${{ flex: 1, opacity: (!valid || saving) ? 0.5 : 1, pointerEvents: (!valid || saving) ? 'none' : 'auto' }}>${saving ? 'Đang tạo...' : 'Tạo mục tiêu'}</${Btn}>
        </div>
      </div>
    </div>`;
}
