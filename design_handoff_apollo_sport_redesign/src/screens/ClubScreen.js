// src/screens/ClubScreen.js — Câu lạc bộ, bản redesign. FILE MỚI.
// Gắn: import { ClubScreen } from './screens/ClubScreen.js';
import { html } from '../html.js';
import { C, r, F, T, BRAND, sportColor } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { Section } from '../ui/primitives.js';
import { actOf } from '../domain/activities.js';
import { summaryStats, headline } from '../domain/session.js';
import { fDT } from '../domain/format.js';

// Khối "GÓP NHIỀU NHẤT" — dùng chung cho CLB và Mục tiêu chung.
export function Contributors({ rows, unit, myUid }) {
  const max = Math.max(1, ...rows.map(r => r.value));
  return html`
    <div style=${{ borderTop: `1px solid ${C.bdr2}`, paddingTop: 12 }}>
      <p style=${{ margin: '0 0 9px', fontSize: 11, letterSpacing: '.09em', fontWeight: 700, color: C.txt4, textTransform: 'uppercase' }}>Góp nhiều nhất</p>
      ${rows.map(row => {
        const mine = myUid && row.uid === myUid;
        return html`
          <div key=${row.uid || row.name} style=${{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
            ${row.photoURL
              ? html`<img src=${row.photoURL} style=${{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}/>`
              : html`<div style=${{ width: 26, height: 26, borderRadius: '50%', background: mine ? BRAND.pink : BRAND.babyBlue, flexShrink: 0 }}/>`}
            <span style=${{ flex: 1, fontSize: 13, fontWeight: 600, color: C.txt1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${mine ? 'Bạn' : row.name}</span>
            <div style=${{ flex: 1.4, height: 6, borderRadius: 4, background: C.bg1, overflow: 'hidden' }}>
              <div style=${{ width: Math.round((row.value / max) * 100) + '%', height: '100%', borderRadius: 4, background: mine ? BRAND.yellow : BRAND.blue }}/>
            </div>
            <span style=${{ fontFamily: F.display, fontWeight: 700, fontSize: 14, color: C.txt1, minWidth: 46, textAlign: 'right' }}>${row.value} ${unit}</span>
          </div>`;
      })}
    </div>`;
}

export function ClubScreen({ club, goal, members = [], contributors = [], announcement, feed = [], myUid, onBack, onInvite, onView }) {
  const iconKey = actOf(club.type).iconKey;
  const pct = goal ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;

  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      <div style=${{ background: BRAND.blue, padding: '12px 16px 22px', color: '#fff', flexShrink: 0 }}>
        <div style=${{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.18)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <${SportIcon} k="back" size=${18} color="#fff" sw=${2}/>
          </button>
          <p style=${{ flex: 1, margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 20, letterSpacing: '.04em', textTransform: 'uppercase' }}>Câu lạc bộ</p>
          <button onClick=${onInvite} class="btn-action" style=${{ background: 'rgba(255,255,255,.18)', border: 'none', borderRadius: 11, padding: '7px 12px', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, whiteSpace: 'nowrap' }}>
            <${SportIcon} k="plus" size=${13} color="#fff" sw=${2.4}/>Mời
          </button>
        </div>
        <div style=${{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style=${{ width: 56, height: 56, borderRadius: 16, background: BRAND.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <${SportIcon} k=${iconKey} size=${28} color=${C.txt1} sw=${1.9}/>
          </span>
          <div style=${{ flex: 1, minWidth: 0 }}>
            <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 24, letterSpacing: '.02em', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${club.name}</p>
            <p style=${{ margin: '1px 0 0', fontSize: 12, color: BRAND.babyBlue }}>${actOf(club.type).label} · ${members.length} thành viên${club.rule ? ' · ' + club.rule : ''}</p>
          </div>
          <div style=${{ display: 'flex', flexShrink: 0 }}>
            ${members.slice(0, 2).map((mb, i) => html`
              <div key=${i} style=${{ width: 30, height: 30, borderRadius: '50%', background: i ? BRAND.pink : BRAND.babyBlue, border: `2px solid ${BRAND.blue}`, marginLeft: i ? -10 : 0 }}/>`)}
            ${members.length > 2 ? html`
              <div style=${{ width: 30, height: 30, borderRadius: '50%', background: '#fff', border: `2px solid ${BRAND.blue}`, marginLeft: -10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: BRAND.blue }}>+${members.length - 2}</div>` : ''}
          </div>
        </div>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '14px 16px 40px' }}>
        ${goal ? html`
          <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: 16, marginBottom: 12 }}>
            <div style=${{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style=${{ flex: 1, ...T.section }}>MỤC TIÊU NHÓM</span>
              <span style=${{ background: C.greenBg, color: C.green, borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>Đang diễn ra</span>
            </div>
            <p style=${{ margin: '0 0 3px', fontSize: 16, fontWeight: 700, color: C.txt1 }}>${goal.title}</p>
            <p style=${{ margin: '0 0 12px', fontFamily: F.serif, fontStyle: 'italic', fontSize: 11.5, color: C.txt3 }}>${goal.range}${goal.activeCount ? ' · ' + goal.activeCount + ' người đang góp' : ''}</p>
            <div style=${{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style=${{ fontFamily: F.display, fontWeight: 700, fontSize: 34, lineHeight: 1, color: BRAND.blue }}>${goal.current}</span>
              <span style=${{ fontSize: 13, color: C.txt3 }}>/ ${goal.target} ${goal.unit}</span>
              <span style=${{ marginLeft: 'auto', fontFamily: F.display, fontWeight: 700, fontSize: 18, color: C.txt4 }}>${pct}%</span>
            </div>
            <div style=${{ height: 9, borderRadius: 5, background: C.bg1, overflow: 'hidden', marginBottom: 14 }}>
              <div style=${{ width: pct + '%', height: '100%', borderRadius: 5, background: BRAND.blue, transition: 'width .4s' }}/>
            </div>
            ${contributors.length ? html`<${Contributors} rows=${contributors} unit=${goal.unit} myUid=${myUid}/>` : ''}
          </div>` : ''}

        ${announcement ? html`
          <div style=${{ display: 'flex', alignItems: 'center', gap: 11, background: BRAND.babyBlue, borderRadius: r.lg, padding: '13px 16px', marginBottom: 16 }}>
            <${SportIcon} k="bell" size=${19} color="#2E5A80" sw=${1.9}/>
            <div style=${{ flex: 1, minWidth: 0 }}>
              <p style=${{ margin: 0, fontSize: 13, fontWeight: 700, color: C.txt1 }}>${announcement.text}</p>
              <p style=${{ margin: '1px 0 0', fontSize: 11.5, color: '#3D6285' }}>${announcement.meta}</p>
            </div>
          </div>` : ''}

        <${Section} t="HOẠT ĐỘNG CỦA NHÓM" mt=${0}/>
        ${feed.map(p => {
          const a = actOf(p.type);
          return html`
            <div key=${p.id} onClick=${() => onView && onView(p)} class="card-hover" style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '14px 16px', marginBottom: 10, cursor: 'pointer' }}>
              <div style=${{ display: 'flex', gap: 11, alignItems: 'center' }}>
                ${p.authorPhoto
                  ? html`<img src=${p.authorPhoto} style=${{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${sportColor(a.iconKey)}`, flexShrink: 0 }}/>`
                  : html`<div style=${{ width: 38, height: 38, borderRadius: '50%', background: C.bg3, border: `2px solid ${sportColor(a.iconKey)}`, flexShrink: 0 }}/>`}
                <div style=${{ flex: 1, minWidth: 0 }}>
                  <p style=${{ margin: 0, fontSize: 13.5, color: C.txt1 }}><b style=${{ fontWeight: 700 }}>${p.authorName}</b> <span style=${{ color: C.txt2 }}>${headline(p)}</span></p>
                  <p style=${{ margin: '2px 0 0', fontSize: 11, color: C.txt4 }}>${p.dept ? p.dept + ' · ' : ''}${fDT(p.loggedAt || p.startTime)}</p>
                </div>
                <${SportIcon} k=${a.iconKey} size=${19} color=${sportColor(a.iconKey)} cx=${{ flexShrink: 0 }}/>
              </div>
              <div style=${{ display: 'flex', gap: 14, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.bdr2}` }}>
                ${summaryStats(p).map((s, i) => html`
                  <span key=${i} style=${{ fontSize: 12.5, color: C.txt3, whiteSpace: 'nowrap' }}>
                    <b style=${{ fontFamily: F.display, fontWeight: 700, fontSize: 15, color: C.txt1 }}>${s.v}</b> ${s.u}
                  </span>`)}
              </div>
            </div>`;
        })}
      </div>
    </div>`;
}
