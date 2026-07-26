import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Wrap, Empty } from '../ui/primitives.js';
import { Icons } from '../ui/icons.js';
import { getUserDoc } from '../data/repo-users.js';
import { allSessionsOf } from '../data/repo-sessions.js';
import { liveStreak } from '../domain/streak.js';
import { actOf, ACT } from '../domain/activities.js';
import { headline, summaryStats } from '../domain/session.js';
import { fDT } from '../domain/format.js';
import { BADGES } from '../domain/badges.js';
import { personalRecords, currentWeekActivity } from '../domain/stats.js';

const STAT_EMOJI = { flame: '🔥', check: '✅', clock: '⏱', route: '📏', bolt: '⚡', star: '⭐' };

export function ProfileScreen({ uid, isSelf = false, onBack, onView }) {
  const [doc, setDoc] = useState(null);
  const [allSess, setAllSess] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([getUserDoc(uid), allSessionsOf(uid, { isSelf })]).then(([d, all]) => {
      if (!alive) return;
      setDoc(d); setAllSess(all); setLoading(false);
    });
    return () => { alive = false; };
  }, [uid, isSelf]);

  const st = doc ? liveStreak(doc.streak) : { current: 0 };
  const t = doc?.totals || {};
  const items = allSess.slice(0, 12); // buổi gần đây (đã sắp desc theo loggedAt)

  // Kỷ lục cá nhân theo môn (Cục B): distance + session không đối kháng; gym & đối kháng → rỗng.
  const prBlocks = [...new Set(allSess.map(s => s.type || 'gym'))]
    .map(ty => ({ ty, recs: personalRecords(allSess, ty, actOf(ty).kind) }))
    .filter(x => x.recs.length);

  // Tiến độ mục tiêu tuần — CHỈ hiện trên hồ sơ CỦA MÌNH (riêng tư, không phơi mục tiêu người khác).
  const goals = doc?.goals || {};
  const showGoals = isSelf && (goals.sessionsPerWeek > 0 || goals.minutesPerWeek > 0);
  const cw = showGoals ? currentWeekActivity(allSess) : null;
  const goalBar = (cur, target, color) => {
    const pctv = target > 0 ? Math.min(100, Math.round((cur / target) * 100)) : 0;
    return html`<div style=${{ height: 8, borderRadius: 4, background: C.bg3, overflow: 'hidden' }}><div style=${{ height: '100%', width: `${pctv}%`, background: color, borderRadius: 4 }}/></div>`;
  };

  const stat = (label, val) => html`
    <div style=${{ flex: 1, textAlign: 'center' }}>
      <p style=${{ margin: 0, fontSize: 18, fontWeight: 700, color: C.txt1 }}>${val}</p>
      <p style=${{ margin: 0, fontSize: 10.5, color: C.txt3 }}>${label}</p>
    </div>`;

  return html`
    <${Wrap}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>
        <h2 style=${{ margin: 0, fontSize: 17, fontWeight: 600, color: C.txt1 }}>Hồ sơ</h2>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        ${loading
          ? html`<p style=${{ textAlign: 'center', color: C.txt3, fontSize: 13, padding: 40 }}>Đang tải...</p>`
          : !doc
            ? html`<${Empty} icon="other" msg="Không tìm thấy hồ sơ"/>`
            : html`
              <div style=${{ padding: '24px 16px 18px', textAlign: 'center' }}>
                ${doc.photoURL
                  ? html`<img src=${doc.photoURL} style=${{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${doc.accent || ACC}` }}/>`
                  : html`<div style=${{ width: 84, height: 84, borderRadius: '50%', margin: '0 auto', background: (doc.accent || ACC) + '22', color: doc.accent || ACC, border: `3px solid ${doc.accent || ACC}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 34 }}>${(doc.name || '?').charAt(0).toUpperCase()}</div>`}
                <h1 style=${{ margin: '12px 0 2px', fontSize: 22, fontWeight: 600, color: C.txt1 }}>${doc.name}</h1>
                <p style=${{ margin: 0, fontSize: 13, color: C.txt3 }}>${[doc.dept, doc.center].filter(Boolean).join(' · ') || '—'}</p>
                ${st.current > 0 && html`<div style=${{ display: 'inline-block', marginTop: 10, background: 'var(--accent-glow)', color: ACC, borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600 }}>🔥 Chuỗi ${st.current} ngày</div>`}
              </div>

              <div style=${{ display: 'flex', padding: '0 16px 18px' }}>
                <div style=${{ display: 'flex', flex: 1, background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.lg, padding: '14px 8px' }}>
                  ${stat('Buổi tập', t.sessions || 0)}
                  ${stat('Phút', t.minutes || 0)}
                  ${stat('Điểm', t.points || 0)}
                  ${stat('Chuỗi dài', doc.streak?.longest || 0)}
                </div>
              </div>

              ${showGoals && html`
                <div style=${{ padding: '0 16px 18px' }}>
                  <div style=${{ background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.lg, padding: '14px 16px' }}>
                    <p style=${{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: C.txt2 }}>🎯 Mục tiêu tuần này</p>
                    <div style=${{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      ${goals.sessionsPerWeek > 0 && html`
                        <div>
                          <div style=${{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                            <span style=${{ color: C.txt3 }}>Buổi tập</span>
                            <strong style=${{ color: C.txt1 }}>${cw.count}/${goals.sessionsPerWeek}${cw.count >= goals.sessionsPerWeek ? ' ✅' : ''}</strong>
                          </div>
                          ${goalBar(cw.count, goals.sessionsPerWeek, ACC)}
                        </div>`}
                      ${goals.minutesPerWeek > 0 && html`
                        <div>
                          <div style=${{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                            <span style=${{ color: C.txt3 }}>Phút vận động</span>
                            <strong style=${{ color: C.txt1 }}>${cw.minutes}/${goals.minutesPerWeek}${cw.minutes >= goals.minutesPerWeek ? ' ✅' : ''}</strong>
                          </div>
                          ${goalBar(cw.minutes, goals.minutesPerWeek, '#22c55e')}
                        </div>`}
                    </div>
                  </div>
                </div>`}

              ${prBlocks.length > 0 && html`
                <div style=${{ padding: '0 16px 18px' }}>
                  <p style=${{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: C.txt2 }}>🏆 Kỷ lục cá nhân</p>
                  <div style=${{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    ${prBlocks.map(({ ty, recs }) => { const a = actOf(ty); return html`
                      <div key=${ty} style=${{ background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.md, padding: '12px 14px' }}>
                        <p style=${{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: C.txt1, display: 'flex', alignItems: 'center', gap: 6 }}><span>${a.emoji}</span> ${a.label}</p>
                        <div style=${{ display: 'grid', gridTemplateColumns: `repeat(${recs.length}, 1fr)`, gap: 8 }}>
                          ${recs.map(rc => html`<div key=${rc.key} style=${{ textAlign: 'center' }}>
                            <p style=${{ margin: 0, fontSize: 16, fontWeight: 700, color: a.color }}>${rc.value}<span style=${{ fontSize: 10, fontWeight: 500, color: C.txt3 }}> ${rc.unit}</span></p>
                            <p style=${{ margin: '2px 0 0', fontSize: 9.5, color: C.txt3 }}>${rc.label}</p>
                          </div>`)}
                        </div>
                      </div>`; })}
                  </div>
                </div>`}

              ${(doc.badges?.length > 0) && html`
                <div style=${{ padding: '0 16px 18px' }}>
                  <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    ${doc.badges.map(b => BADGES[b] && html`<span key=${b} title=${BADGES[b].label} style=${{ fontSize: 22 }}>${BADGES[b].icon}</span>`)}
                  </div>
                </div>`}

              <div style=${{ padding: '0 16px 24px' }}>
                <p style=${{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: C.txt2 }}>Buổi tập gần đây</p>
                ${items.length === 0
                  ? html`<${Empty} icon="other" msg="Chưa có buổi tập công khai"/>`
                  : items.map(s => {
                    const a = actOf(s.type);
                    return html`
                      <div key=${`${s.authorUid}_${s.id}`} onClick=${() => onView && onView(s)} class="card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.md, padding: '12px 14px', marginBottom: 8, cursor: 'pointer' }}>
                        <span style=${{ fontSize: 24, flexShrink: 0 }}>${a.emoji}</span>
                        <div style=${{ flex: 1, minWidth: 0 }}>
                          <p style=${{ margin: 0, fontSize: 13.5, fontWeight: 500, color: C.txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${s.title || a.label}</p>
                          <p style=${{ margin: '2px 0 0', fontSize: 11.5, color: C.txt3 }}>${summaryStats(s).map(x => `${x.v}${x.u ? ' ' + x.u : ''}`).join(' · ')} · ${fDT(s.loggedAt)}</p>
                        </div>
                        ${s.visibility === 'private' && html`<span style=${{ fontSize: 13 }}>🔒</span>`}
                      </div>`;
                  })}
              </div>`}
      </div>
    </${Wrap}>`;
}
