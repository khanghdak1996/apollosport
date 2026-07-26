// src/screens/HomeTab.js — Trang chủ, bản redesign. FILE MỚI.
//
// Cách gắn vào app.js:
//   1. Thêm ở đầu app.js:  import { HomeTab } from './screens/HomeTab.js';
//   2. XOÁ nguyên hàm function HomeTab(...) đang nằm trong app.js (khoảng dòng 85–177).
//   3. Chỗ gọi <${HomeTab} .../> giữ nguyên — props không đổi.
import { html } from '../html.js';
import { C, r, F, T, BRAND, SHADOW, sportColor, sportTint } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { StatStrip, Section } from '../ui/primitives.js';
import { actOf } from '../domain/activities.js';
import { summaryStats } from '../domain/session.js';
import { fD, durS } from '../domain/format.js';

const primStat = s => {
  const stats = summaryStats(s);
  return stats.find(x => x.icon !== 'clock' && typeof x.v === 'number')
      || stats.find(x => x.icon === 'star')
      || { v: s.points || 0, u: 'điểm' };
};

const DOW = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// 7 vạch tuần: thứ 2 → chủ nhật của tuần hiện tại.
function weekBars(sessions) {
  const now = new Date();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const done = new Set(sessions.map(s => {
    const d = new Date(s.date); d.setHours(0, 0, 0, 0);
    const diff = Math.floor((d - monday) / 86400000);
    return diff >= 0 && diff < 7 ? diff : -1;
  }));
  return DOW.map((l, i) => ({ l, on: done.has(i) }));
}

export function HomeTab({ profile, progs, sessions, streak, onStart, onView, onSwitch, onManagePrograms, weeklyGoal = 3, points = 0 }) {
  const last7 = sessions.filter(s => (new Date() - new Date(s.date)) / 86400000 <= 7);
  const nSessions = last7.length;
  const nMinutes = Math.round(last7.reduce((t, s) => t + (s.activeMinutes || s.durationMin || 0), 0));
  const st = streak || { current: 0, atRisk: false };
  const bars = weekBars(sessions);
  const pct = Math.min(100, Math.round((nSessions / Math.max(1, weeklyGoal)) * 100));

  return html`
    <div class="fade-in" style=${{ padding: '0 16px 80px' }}>

      <!-- Thanh trên: wordmark + avatar. Đã BỎ hero ảnh và nút Đăng xuất. -->
      <div style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 2px 12px' }}>
        <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 17, letterSpacing: '.14em', color: BRAND.blue, whiteSpace: 'nowrap' }}>APOLLO SPORT</p>
        <div onClick=${onSwitch} style=${{ cursor: 'pointer' }}>
          ${profile.photoURL
            ? html`<img src=${profile.photoURL} style=${{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${BRAND.blue}` }}/>`
            : html`<div style=${{ width: 34, height: 34, borderRadius: '50%', background: BRAND.babyBlue, border: `2px solid ${BRAND.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: BRAND.blue }}>${(profile.name || '?').charAt(0).toUpperCase()}</div>`}
        </div>
      </div>

      <!-- KHỐI STREAK — nhân vật chính của màn. Cảnh báo mất chuỗi GỘP VÀO ĐÂY,
           không còn banner cam riêng ở đầu màn như bản cũ. -->
      <div style=${{ background: BRAND.blue, borderRadius: r.xxl, padding: '20px 20px 16px', color: '#fff', marginBottom: 12 }}>
        <div style=${{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 600, fontSize: 12, letterSpacing: '.16em', color: BRAND.babyBlue }}>CHUỖI LIÊN TIẾP</p>
            <p style=${{ margin: '-6px 0 0', fontFamily: F.display, fontWeight: 700, fontSize: 76, lineHeight: 1, letterSpacing: '-.01em' }}>
              ${st.current}<span style=${{ fontSize: 24, letterSpacing: '.06em', marginLeft: 8 }}>NGÀY</span>
            </p>
          </div>
          <${SportIcon} k="flame" size=${34} color=${BRAND.yellow} sw=${1.7}/>
        </div>

        <div style=${{ display: 'flex', gap: 6, margin: '14px 0 0' }}>
          ${bars.map(d => html`
            <div key=${d.l} style=${{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <span style=${{ fontSize: 10, letterSpacing: '.08em', color: BRAND.babyBlue }}>${d.l}</span>
              <span style=${{ width: '100%', height: 5, borderRadius: 3, background: d.on ? BRAND.yellow : 'rgba(255,255,255,.28)' }}/>
            </div>`)}
        </div>

        ${st.atRisk ? html`
          <div style=${{ display: 'flex', alignItems: 'center', gap: 9, background: BRAND.yellow, borderRadius: r.md, padding: '9px 12px', marginTop: 14 }}>
            <${SportIcon} k="clock" size=${17} color=${C.txt1} sw=${1.9}/>
            <p style=${{ margin: 0, fontSize: 12.5, fontWeight: 600, color: C.txt1 }}>Tập hôm nay để giữ chuỗi ${st.current} ngày nhé!</p>
          </div>` : ''}
      </div>

      <!-- 3 thẻ trắng rời → MỘT dải có vách ngăn -->
      <div style=${{ marginBottom: 12 }}>
        <${StatStrip} items=${[
          { v: nSessions, l: 'Buổi tuần' },
          { v: nMinutes, l: 'Phút' },
          { v: points, l: 'Điểm' },
        ]}/>
      </div>

      <!-- Mục tiêu tuần (mới) -->
      <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '14px 16px', marginBottom: 12 }}>
        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
          <p style=${{ margin: 0, ...T.section }}>MỤC TIÊU TUẦN</p>
          <p style=${{ margin: 0, fontSize: 12, color: C.txt2 }}>${nSessions}<span style=${{ color: C.txt4 }}>/${weeklyGoal} buổi</span></p>
        </div>
        <div style=${{ height: 7, borderRadius: 4, background: C.bg3, overflow: 'hidden' }}>
          <div style=${{ width: pct + '%', height: '100%', background: BRAND.blue, borderRadius: 4, transition: 'width .4s' }}/>
        </div>
        <p style=${{ margin: '9px 0 0', ...T.lead }}>
          ${pct >= 100 ? 'Vượt mục tiêu tuần này rồi. Đặt mốc cao hơn?' : `Còn ${Math.max(0, weeklyGoal - nSessions)} buổi nữa là đạt mục tiêu tuần.`}
        </p>
      </div>

      <!-- "Gần đây": 3 thẻ rời → MỘT thẻ nhiều dòng -->
      ${sessions.length > 0 ? html`
        <${Section} t="GẦN ĐÂY" mt=${16} right=${html`<p style=${{ margin: 0, fontSize: 12, color: BRAND.blue, fontWeight: 600, cursor: 'pointer' }}>Tất cả ›</p>`}/>
        <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, overflow: 'hidden' }}>
          ${sessions.slice(0, 3).map((s, i) => {
            const a = actOf(s.type);
            const ps = primStat(s);
            return html`
              <div key=${s.id} onClick=${() => onView(s)} class="card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: i ? `1px solid ${C.bdr2}` : 'none', cursor: 'pointer' }}>
                <span style=${{ width: 34, height: 34, borderRadius: 10, background: sportTint(a.iconKey), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <${SportIcon} k=${a.iconKey} size=${19} color=${sportColor(a.iconKey)}/>
                </span>
                <div style=${{ flex: 1, minWidth: 0 }}>
                  <p style=${{ margin: 0, fontSize: 14, fontWeight: 600, color: C.txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${s.title || s.dayName || a.label}</p>
                  <p style=${{ margin: '1px 0 0', fontSize: 11.5, color: C.txt3 }}>${s.progName ? s.progName + ' · ' : ''}${fD(s.date)}</p>
                </div>
                <div style=${{ textAlign: 'right', flexShrink: 0 }}>
                  <p style=${{ margin: 0, ...T.num, fontSize: 17, color: BRAND.blue }}>${ps.v}${ps.u ? ' ' + ps.u : ''}</p>
                  <p style=${{ margin: 0, fontSize: 11, color: C.txt4 }}>${s.endTime && s.startTime ? durS(s.endTime - s.startTime) : (s.durationMin || 0) + ' phút'}</p>
                </div>
              </div>`;
          })}
        </div>` : ''}
    </div>`;
}
