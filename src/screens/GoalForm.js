import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, T, BRAND, sportColor } from '../ui/theme.js';
import { Btn } from '../ui/primitives.js';
import { SportIcon } from '../ui/sportIcons.js';
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

  const input = { width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14.5, background: C.bg2, color: C.txt1 };

  return html`
    <div style=${{ position: 'absolute', inset: 0, zIndex: 250, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick=${() => !saving && onClose()}>
      <div onClick=${e => e.stopPropagation()} style=${{ width: '100%', background: C.bg1, borderRadius: '20px 20px 0 0', padding: '18px 16px calc(18px + env(safe-area-inset-bottom))', maxHeight: '90%', overflowY: 'auto' }}>
        <p style=${{ margin: '0 0 16px', ...T.h2 }}>${scope === 'club' ? `MỤC TIÊU NHÓM${clubName ? ` · ${clubName}` : ''}` : 'MỤC TIÊU TOÀN CÔNG TY'}</p>

        <p style=${{ margin: '0 0 6px 2px', ...T.label }}>TÊN MỤC TIÊU</p>
        <input value=${title} onInput=${e => setTitle(e.target.value)} maxLength=${80} placeholder="VD: Cả nhóm chạy 1000km tháng này" style=${{ ...input, marginBottom: 14 }}/>

        <p style=${{ margin: '0 0 8px 2px', ...T.label }}>ĐO BẰNG</p>
        <div style=${{ display: 'flex', gap: 8, marginBottom: 16 }}>
          ${metricOpts.map(o => {
      const on = metric === o.v;
      return html`<button key=${o.v} onClick=${() => setMetric(o.v)} class="btn-action" style=${{ flex: 1, padding: '10px', borderRadius: r.md, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, border: `1px solid ${on ? BRAND.blue : C.bdr}`, background: on ? BRAND.blue : C.bg2, color: on ? '#fff' : C.txt2 }}>${o.l}</button>`;
    })}
        </div>

        ${scope === 'company' && html`
          <p style=${{ margin: '0 0 8px 2px', ...T.label }}>MÔN ${metricNeedsSport ? '(BẮT BUỘC)' : '(TUỲ CHỌN — ĐỂ TRỐNG = MỌI MÔN)'}</p>
          <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <button onClick=${() => setSport('')} class="btn-action" style=${{ padding: '7px 12px', borderRadius: r.pill, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, border: `1px solid ${sport === '' ? BRAND.blue : C.bdr}`, background: sport === '' ? BRAND.blue : C.bg2, color: sport === '' ? '#fff' : C.txt2, opacity: metricNeedsSport ? 0.4 : 1, pointerEvents: metricNeedsSport ? 'none' : 'auto' }}>Mọi môn</button>
            ${ACTIVITIES.map(x => {
      const on = sport === x.id;
      return html`<button key=${x.id} onClick=${() => setSport(x.id)} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: r.pill, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, border: `1px solid ${on ? BRAND.blue : C.bdr}`, background: on ? BRAND.blue : C.bg2, color: on ? '#fff' : C.txt2 }}><${SportIcon} k=${x.iconKey} size=${15} color=${on ? '#fff' : sportColor(x.iconKey)}/> ${x.label}</button>`;
    })}
          </div>`}
        ${scope === 'club' && clubSport && html`<p style=${{ margin: '0 0 14px 2px', fontSize: 12, color: C.txt3, display: 'flex', alignItems: 'center', gap: 5 }}>Môn: <${SportIcon} k=${actOf(clubSport).iconKey} size=${14} color=${sportColor(actOf(clubSport).iconKey)}/> <strong style=${{ color: C.txt2 }}>${actOf(clubSport).label}</strong> (theo nhóm)</p>`}

        <p style=${{ margin: '0 0 6px 2px', ...T.label }}>MỤC TIÊU (${unit.toUpperCase()})</p>
        <input type="number" inputMode="numeric" value=${target} onInput=${e => setTarget(e.target.value)} placeholder="VD: 1000" style=${{ ...input, marginBottom: 14 }}/>

        <div style=${{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <div style=${{ flex: 1 }}>
            <p style=${{ margin: '0 0 6px 2px', ...T.label }}>BẮT ĐẦU</p>
            <input type="date" value=${start} onInput=${e => setStart(e.target.value)} style=${{ ...input, padding: '10px 12px', fontSize: 14 }}/>
          </div>
          <div style=${{ flex: 1 }}>
            <p style=${{ margin: '0 0 6px 2px', ...T.label }}>KẾT THÚC</p>
            <input type="date" value=${end} onInput=${e => setEnd(e.target.value)} style=${{ ...input, padding: '10px 12px', fontSize: 14 }}/>
          </div>
        </div>

        <div style=${{ display: 'flex', gap: 8 }}>
          <button onClick=${onClose} class="btn-action" style=${{ flex: 1, padding: '12px', borderRadius: r.md, border: `1px solid ${C.bdr}`, background: C.bg2, color: C.txt2, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Huỷ</button>
          <${Btn} onClick=${submit} cx=${{ flex: 1, opacity: (!valid || saving) ? 0.5 : 1, pointerEvents: (!valid || saving) ? 'none' : 'auto' }}>${saving ? 'Đang tạo...' : 'Tạo mục tiêu'}</${Btn}>
        </div>
      </div>
    </div>`;
}
