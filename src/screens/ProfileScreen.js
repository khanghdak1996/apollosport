import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND, sportColor, sportTint } from '../ui/theme.js';
import { Wrap, Empty, Section } from '../ui/primitives.js';
import { SportIcon } from '../ui/sportIcons.js';
import { getUserDoc } from '../data/repo-users.js';
import { allSessionsOf } from '../data/repo-sessions.js';
import { liveStreak } from '../domain/streak.js';
import { actOf } from '../domain/activities.js';
import { summaryStats } from '../domain/session.js';
import { fDT } from '../domain/format.js';
import { BADGES } from '../domain/badges.js';
import { personalRecords, currentWeekActivity } from '../domain/stats.js';

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

  // Hero: với hồ sơ CỦA MÌNH, tính thẳng từ danh sách buổi thật (allSess gồm cả buổi riêng tư)
  // để luôn khớp với danh sách bên dưới & các màn khác, không lệ thuộc counter totals có thể trôi.
  // Xem người khác thì chỉ có buổi công khai nên vẫn dùng totals (đã tự chữa khi họ đăng nhập).
  const derived = isSelf ? allSess.reduce((x, s) => ({
    sessions: x.sessions + 1,
    minutes: x.minutes + (s.activeMinutes || 0),
    points: x.points + (s.points || 0),
  }), { sessions: 0, minutes: 0, points: 0 }) : null;
  const heroSessions = derived ? derived.sessions : (t.sessions || 0);
  const heroMinutes = derived ? derived.minutes : (t.minutes || 0);
  const heroPoints = derived ? derived.points : (t.points || 0);

  const prBlocks = [...new Set(allSess.map(s => s.type || 'gym'))]
    .map(ty => ({ ty, recs: personalRecords(allSess, ty, actOf(ty).kind) }))
    .filter(x => x.recs.length);

  // Tiến độ mục tiêu tuần — CHỈ hiện trên hồ sơ CỦA MÌNH.
  const goals = doc?.goals || {};
  const showGoals = isSelf && (goals.sessionsPerWeek > 0 || goals.minutesPerWeek > 0);
  const cw = showGoals ? currentWeekActivity(allSess) : null;
  const goalRow = (label, cur, target, color) => {
    const pctv = target > 0 ? Math.min(100, Math.round((cur / target) * 100)) : 0;
    const done = cur >= target;
    return html`
      <div>
        <div style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
          <span style=${{ color: C.txt2 }}>${label}</span>
          <strong style=${{ display: 'flex', alignItems: 'center', gap: 4, color: done ? C.green : C.txt1 }}>${cur}/${target}${done ? html` <${SportIcon} k="check" size=${13} color=${C.green} sw=${2.4}/>` : ''}</strong>
        </div>
        <div style=${{ height: 8, borderRadius: 4, background: C.bg3, overflow: 'hidden' }}><div style=${{ height: '100%', width: pctv + '%', background: color, borderRadius: 4, transition: 'width .4s' }}/></div>
      </div>`;
  };

  return html`
    <${Wrap}>
      <div style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.bg2, borderBottom: `1px solid ${C.bdr}`, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <p style=${{ margin: 0, flex: 1, ...T.h2 }}>${isSelf ? 'THÀNH TÍCH CỦA BẠN' : 'HỒ SƠ'}</p>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        ${loading
      ? html`<p style=${{ textAlign: 'center', color: C.txt3, fontSize: 13, padding: 40 }}>Đang tải...</p>`
      : !doc
        ? html`<div style=${{ padding: 16 }}><${Empty} icon="other" msg="Không tìm thấy hồ sơ"/></div>`
        : html`
              <!-- Hero xanh -->
              <div style=${{ background: BRAND.blue, color: '#fff', padding: '22px 18px 20px', textAlign: 'center' }}>
                ${doc.photoURL
          ? html`<img src=${doc.photoURL} style=${{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${BRAND.yellow}` }}/>`
          : html`<div style=${{ width: 84, height: 84, borderRadius: '50%', margin: '0 auto', background: BRAND.babyBlue, color: BRAND.blue, border: `3px solid ${BRAND.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 34 }}>${(doc.name || '?').charAt(0).toUpperCase()}</div>`}
                <p style=${{ margin: '12px 0 2px', fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>${doc.name}</p>
                <p style=${{ margin: 0, fontSize: 12.5, color: BRAND.babyBlue }}>${doc.dept || '—'}</p>
                ${st.current > 0 && html`<div style=${{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, background: 'rgba(255,255,255,.16)', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600 }}><${SportIcon} k="flame" size=${15} color=${BRAND.yellow}/> Chuỗi ${st.current} ngày</div>`}

                <div style=${{ display: 'flex', gap: 8, marginTop: 18 }}>
                  ${[{ v: heroSessions, l: 'Buổi tập' }, { v: heroMinutes, l: 'Phút' }, { v: heroPoints, l: 'Điểm' }, { v: doc.streak?.longest || 0, l: 'Chuỗi dài' }].map((s, i) => html`
                    <div key=${i} style=${{ flex: 1, background: 'rgba(255,255,255,.14)', borderRadius: 14, padding: '11px 6px', minWidth: 0 }}>
                      <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 22, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>${s.v}</p>
                      <p style=${{ margin: '3px 0 0', fontSize: 9.5, letterSpacing: '.07em', fontWeight: 600, color: BRAND.babyBlue, textTransform: 'uppercase' }}>${s.l}</p>
                    </div>`)}
                </div>
              </div>

              <div style=${{ padding: '0 16px 80px' }}>
                ${showGoals && html`
                  <${Section} t="MỤC TIÊU TUẦN NÀY" mt=${18}/>
                  <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    ${goals.sessionsPerWeek > 0 && goalRow('Buổi tập', cw.count, goals.sessionsPerWeek, BRAND.blue)}
                    ${goals.minutesPerWeek > 0 && goalRow('Phút vận động', cw.minutes, goals.minutesPerWeek, C.green)}
                  </div>`}

                ${prBlocks.length > 0 && html`
                  <${Section} t="KỶ LỤC CÁ NHÂN" mt=${18} right=${html`<${SportIcon} k="trophy" size=${17} color=${BRAND.yellow}/>`}/>
                  <div style=${{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    ${prBlocks.map(({ ty, recs }) => { const a = actOf(ty); return html`
                      <div key=${ty} style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '13px 15px' }}>
                        <p style=${{ margin: '0 0 10px', fontSize: 13.5, fontWeight: 700, color: C.txt1, display: 'flex', alignItems: 'center', gap: 7 }}><${SportIcon} k=${a.iconKey} size=${16} color=${sportColor(a.iconKey)}/> ${a.label}</p>
                        <div style=${{ display: 'grid', gridTemplateColumns: `repeat(${recs.length}, 1fr)`, gap: 8 }}>
                          ${recs.map(rc => html`<div key=${rc.key} style=${{ textAlign: 'center' }}>
                            <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 18, color: sportColor(a.iconKey) }}>${rc.value}<span style=${{ fontSize: 10, fontWeight: 500, color: C.txt3 }}> ${rc.unit}</span></p>
                            <p style=${{ margin: '2px 0 0', fontSize: 9.5, color: C.txt3 }}>${rc.label}</p>
                          </div>`)}
                        </div>
                      </div>`; })}
                  </div>`}

                ${(doc.badges?.length > 0) && html`
                  <${Section} t="HUY HIỆU" mt=${18}/>
                  <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    ${doc.badges.map(b => BADGES[b] && html`<span key=${b} title=${BADGES[b].label} style=${{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: C.txt2, background: C.bg3, borderRadius: 20, padding: '5px 12px' }}><span style=${{ fontSize: 16 }}>${BADGES[b].icon}</span> ${BADGES[b].label}</span>`)}
                  </div>`}

                <${Section} t="BUỔI TẬP GẦN ĐÂY" mt=${18}/>
                ${items.length === 0
          ? html`<${Empty} icon="other" msg="Chưa có buổi tập công khai"/>`
          : html`<div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, overflow: 'hidden' }}>
                    ${items.map((s, i) => {
            const a = actOf(s.type);
            return html`
                      <div key=${`${s.authorUid}_${s.id}`} onClick=${() => onView && onView(s)} class="card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px', borderTop: i ? `1px solid ${C.bdr2}` : 'none', cursor: 'pointer' }}>
                        <span style=${{ width: 34, height: 34, borderRadius: 10, background: sportTint(a.iconKey), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><${SportIcon} k=${a.iconKey} size=${19} color=${sportColor(a.iconKey)}/></span>
                        <div style=${{ flex: 1, minWidth: 0 }}>
                          <p style=${{ margin: 0, fontSize: 14, fontWeight: 600, color: C.txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${s.title || a.label}</p>
                          <p style=${{ margin: '2px 0 0', fontSize: 11.5, color: C.txt3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${summaryStats(s).map(x => `${x.v}${x.u ? ' ' + x.u : ''}`).join(' · ')} · ${fDT(s.loggedAt)}</p>
                        </div>
                        ${(s.visibility === 'private') ? html`<${SportIcon} k="lock" size=${14} color=${C.txt4}/>` : ''}
                      </div>`;
          })}
                  </div>`}
              </div>`}
      </div>
    </${Wrap}>`;
}
