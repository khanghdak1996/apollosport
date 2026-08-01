import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND, SHADOW, sportColor, sportTint } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { actOf, actLabel } from '../domain/activities.js';
import { goalContribution } from '../domain/stats.js';
import { t } from '../i18n.js';
import { getGoalProgress, setMyGoalProgress, deleteGoal } from '../data/repo-goals.js';
import { AnnouncementFeed } from './AnnouncementFeed.js';

function fDate(s) { const [y, m, d] = (s || '').split('-'); return d ? `${d}/${m}` : s; }

// Vòng tiến độ 96px (track EDF3F9, fill xanh, linecap round, rotate -90).
function Ring({ pct, reached }) {
  const size = 96, sw = 10, R = (size - sw) / 2, Circ = 2 * Math.PI * R;
  const off = Circ * (1 - Math.min(100, pct) / 100);
  const col = reached ? C.green : BRAND.blue;
  return html`
    <div style=${{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width=${size} height=${size} style=${{ transform: 'rotate(-90deg)' }}>
        <circle cx=${size / 2} cy=${size / 2} r=${R} fill="none" stroke=${C.bdr2} stroke-width=${sw}/>
        <circle cx=${size / 2} cy=${size / 2} r=${R} fill="none" stroke=${col} stroke-width=${sw} stroke-linecap="round" stroke-dasharray=${Circ} stroke-dashoffset=${off} style=${{ transition: 'stroke-dashoffset .5s' }}/>
      </svg>
      <div style=${{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style=${{ fontFamily: F.display, fontWeight: 700, fontSize: 26, letterSpacing: '.01em', color: col }}>${pct}<span style=${{ fontSize: 13 }}>%</span></span>
      </div>
    </div>`;
}

// Thẻ 1 mục tiêu chung: tính lại đóng góp của mình từ sessions, cộng tổng nhóm, hiện tiến độ.
export function GoalCard({ goal, me, mySessions, canContribute = true, isAdmin, onDeleted }) {
  const [progress, setProgress] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const METRIC = { sessions: { u: t('goal.mSessionsU'), l: t('goal.mSessionsL') }, minutes: { u: t('goal.mMinutesU'), l: t('goal.mMinutesL') }, distanceKm: { u: t('goal.mKmU'), l: t('goal.mKmL') } };
  const m = METRIC[goal.metric] || METRIC.sessions;
  const a = goal.sport ? actOf(goal.sport) : null;
  const today = new Date().toISOString().split('T')[0];
  const status = today < goal.startDate ? { t: t('goal.upcoming'), tone: 'quiet' } : today > goal.endDate ? { t: t('goal.ended'), tone: 'quiet' } : { t: t('goal.ongoing'), tone: 'good' };
  const canDelete = goal.creatorUid === me.uid || isAdmin;

  const withMine = (list, val) => [...list.filter(p => p.uid !== me.uid), { uid: me.uid, name: me.name || t('lb.you'), value: val }];

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await getGoalProgress(goal.id);
      const myVal = goalContribution(mySessions || [], goal);
      const hadDoc = list.some(p => p.uid === me.uid);
      let merged = list;
      if (canContribute && (myVal > 0 || hadDoc)) {
        setMyGoalProgress(goal.id, me, myVal).catch(() => { });
        merged = withMine(list, myVal);
      }
      if (alive) { setProgress(merged); setLoaded(true); }
    })();
    return () => { alive = false; };
  }, [goal.id]);

  const total = progress.reduce((t, p) => t + (p.value || 0), 0);
  const totalR = goal.metric === 'distanceKm' ? Math.round(total * 10) / 10 : Math.round(total);
  const mine = progress.find(p => p.uid === me.uid)?.value || 0;
  const pctv = goal.target > 0 ? Math.min(100, Math.round((total / goal.target) * 100)) : 0;
  const reached = total >= goal.target;
  const top = [...progress].filter(p => p.value > 0).sort((x, y) => y.value - x.value).slice(0, 5);

  const del = async () => {
    if (!window.confirm(t('goal.deleteConfirm'))) return;
    await deleteGoal(goal.id); onDeleted && onDeleted(goal.id);
  };

  const badge = { good: { bg: C.greenBg, fg: C.green }, quiet: { bg: C.bg3, fg: C.txt3 } }[status.tone];

  return html`
    <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xxl, padding: '16px', marginBottom: 12, boxShadow: SHADOW.raised }}>
      <div style=${{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style=${{ fontSize: 11, fontWeight: 700, letterSpacing: '.04em', color: badge.fg, background: badge.bg, borderRadius: 20, padding: '4px 11px' }}>${status.t}</span>
        <span style=${{ flex: 1, fontSize: 11.5, color: C.txt4 }}>${fDate(goal.startDate)}–${fDate(goal.endDate)}</span>
        ${canDelete && html`<button onClick=${del} class="btn-action" title=${t('common.delete')} style=${{ background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 4, display: 'flex' }}><${SportIcon} k="trash" size=${16} color=${C.txt4} sw=${1.9}/></button>`}
      </div>

      <div style=${{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 22, lineHeight: 1.08, letterSpacing: '.01em', color: C.txt1, textTransform: 'uppercase' }}>${goal.title}</p>
          <p style=${{ margin: '6px 0 0', fontSize: 12, color: C.txt3, display: 'flex', alignItems: 'center', gap: 5 }}>
            ${a ? html`<${SportIcon} k=${a.iconKey} size=${13} color=${sportColor(a.iconKey)}/> ${actLabel(goal.sport)}` : m.l}
          </p>
          <p style=${{ margin: '10px 0 0' }}>
            <span style=${{ fontFamily: F.display, fontWeight: 700, fontSize: 30, lineHeight: 1, color: reached ? C.green : BRAND.blue }}>${totalR}</span>
            <span style=${{ fontSize: 13, fontWeight: 500, color: C.txt3 }}> / ${goal.target} ${m.u}</span>
          </p>
        </div>
        <${Ring} pct=${pctv} reached=${reached}/>
      </div>

      <div style=${{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: C.txt3 }}>
        <span>${t('goal.yourContribution')} <strong style=${{ color: C.txt1 }}>${goal.metric === 'distanceKm' ? Math.round(mine * 10) / 10 : Math.round(mine)} ${m.u}</strong></span>
        <span>${t('goal.participants', { n: progress.filter(p => p.value > 0).length })}</span>
      </div>

      ${loaded && top.length > 0 && html`
        <div style=${{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.bdr2}` }}>
          <p style=${{ margin: '0 0 9px', ...T.label }}>${t('goal.topContributors')}</p>
          ${top.map((p, i) => html`
            <div key=${p.uid} style=${{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, padding: '4px 0', color: C.txt2 }}>
              <span style=${{ width: 16, fontFamily: F.display, fontWeight: 700, color: i === 0 ? BRAND.blue : C.txt4, flexShrink: 0 }}>${i + 1}</span>
              <span style=${{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${p.uid === me.uid ? t('lb.you') : p.name || '—'}</span>
              <strong style=${{ color: C.txt1, flexShrink: 0, marginLeft: 8 }}>${goal.metric === 'distanceKm' ? Math.round(p.value * 10) / 10 : Math.round(p.value)} ${m.u}</strong>
            </div>`)}
        </div>`}
      ${!canContribute && html`<p style=${{ margin: '10px 0 0', ...T.lead }}>${t('goal.joinToContribute')}</p>`}

      <div style=${{ marginTop: 14 }}>
        <${AnnouncementFeed} parent=${['goals', goal.id]} canPost=${goal.creatorUid === me.uid || isAdmin} me=${me} isAdmin=${isAdmin}/>
      </div>
    </div>`;
}
