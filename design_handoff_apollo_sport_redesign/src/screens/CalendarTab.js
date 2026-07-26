// src/screens/CalendarTab.js — tab Cá nhân, bản redesign. FILE MỚI.
//
// Cách gắn vào app.js:
//   1. Thêm:  import { CalendarTab } from './screens/CalendarTab.js';
//   2. XOÁ hàm function CalendarTab(...) đang nằm trong app.js (khoảng dòng 187).
//   3. Chỗ gọi giữ nguyên, chỉ thêm các props mới nếu có sẵn dữ liệu:
//      profile, streak, points, weights, onOpenClubs, onOpenGoals, onOpenGuides, onSettings
import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND, SHADOW, sportColor, sportTint } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { Section } from '../ui/primitives.js';
import { actOf } from '../domain/activities.js';

const DOW = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

export function CalendarTab({ profile, sessions, streak, points = 0, rank, weights = [], onView, onOpenClubs, onOpenGoals, onOpenGuides, onSettings, onLogWeight }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const st = streak || { current: 0 };

  const y = cursor.getFullYear(), m = cursor.getMonth();
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7;            // T2 = 0
  const nDays = new Date(y, m + 1, 0).getDate();

  // Ngày → danh sách môn đã tập (để vẽ chấm màu, nhiều môn = nhiều chấm)
  const byDay = {};
  sessions.forEach(s => {
    const d = new Date(s.date);
    if (d.getFullYear() !== y || d.getMonth() !== m) return;
    const k = d.getDate();
    const key = actOf(s.type).iconKey;
    byDay[k] = byDay[k] || [];
    if (!byDay[k].includes(key)) byDay[k].push(key);
  });

  const inMonth = sessions.filter(s => {
    const d = new Date(s.date);
    return d.getFullYear() === y && d.getMonth() === m;
  });
  const monthMin = Math.round(inMonth.reduce((t, s) => t + (s.activeMinutes || s.durationMin || 0), 0));

  // Phân bổ theo môn — 90 ngày, chuẩn hoá theo môn cao nhất = 100%
  const since = new Date(today); since.setDate(today.getDate() - 90);
  const agg = {};
  sessions.filter(s => new Date(s.date) >= since).forEach(s => {
    const key = actOf(s.type).iconKey;
    agg[key] = agg[key] || { key, label: actOf(s.type).label, n: 0, min: 0, pts: 0 };
    agg[key].n += 1;
    agg[key].min += s.activeMinutes || s.durationMin || 0;
    agg[key].pts += s.points || 0;
  });
  const breakdown = Object.values(agg).sort((a, b) => b.pts - a.pts);
  const maxPts = Math.max(1, ...breakdown.map(b => b.pts));

  const last = weights.length ? weights[weights.length - 1] : null;
  const prev = weights.length > 1 ? weights[weights.length - 2] : null;
  const delta = last && prev ? Math.round(((last.kg - prev.kg) / prev.kg) * 1000) / 10 : null;
  const spark = weights.slice(-8);
  const wMin = spark.length ? Math.min(...spark.map(w => w.kg)) : 0;
  const wMax = spark.length ? Math.max(...spark.map(w => w.kg)) : 1;

  const links = [
    { t: 'Câu lạc bộ', sub: 'Gặp đồng nghiệp cùng đam mê một môn', k: 'people', tint: C.bg3, color: BRAND.blue, on: onOpenClubs },
    { t: 'Mục tiêu chung', sub: 'Cả công ty cùng góp để về đích chung', k: 'target', tint: C.yellowBg, color: C.yellowInk, on: onOpenGoals },
    { t: 'Hướng dẫn tập luyện', sub: 'Kiến thức nhập môn cho từng bài tập', k: 'book', tint: C.pinkBg, color: BRAND.pink, on: onOpenGuides },
  ];

  return html`
    <div class="fade-in">

      <div style=${{ background: BRAND.blue, padding: '18px 18px 20px', color: '#fff' }}>
        <div style=${{ display: 'flex', alignItems: 'center', gap: 13 }}>
          ${profile.photoURL
            ? html`<img src=${profile.photoURL} style=${{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${BRAND.yellow}`, flexShrink: 0 }}/>`
            : html`<div style=${{ width: 56, height: 56, borderRadius: '50%', background: BRAND.babyBlue, border: `3px solid ${BRAND.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, color: BRAND.blue, flexShrink: 0 }}>${(profile.name || '?').charAt(0).toUpperCase()}</div>`}
          <div style=${{ flex: 1, minWidth: 0 }}>
            <p style=${{ margin: 0, fontSize: 17, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${profile.name}</p>
            <p style=${{ margin: '1px 0 0', fontSize: 12, color: BRAND.babyBlue }}>${profile.dept || '—'}${rank ? ' · hạng ' + rank + ' tuần này' : ''}</p>
          </div>
          <button onClick=${onSettings} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.18)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <${SportIcon} k="gear" size=${18} color="#fff" sw=${1.9}/>
          </button>
        </div>
        <div style=${{ display: 'flex', gap: 8, marginTop: 16 }}>
          ${[{ v: points, l: 'Điểm tuần' }, { v: monthMin, l: 'Phút tháng' }, { v: st.current + ' ngày', l: 'Chuỗi' }].map((s, i) => html`
            <div key=${i} style=${{ flex: 1, background: 'rgba(255,255,255,.14)', borderRadius: 14, padding: '11px 10px', minWidth: 0 }}>
              <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 24, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${s.v}</p>
              <p style=${{ margin: '3px 0 0', fontSize: 10.5, letterSpacing: '.09em', fontWeight: 600, color: BRAND.babyBlue, textTransform: 'uppercase' }}>${s.l}</p>
            </div>`)}
        </div>
      </div>

      <div style=${{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 9 }}>
        ${links.map(l => html`
          <div key=${l.t} onClick=${l.on} class="card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 13, background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '13px 16px', cursor: 'pointer' }}>
            <span style=${{ width: 38, height: 38, borderRadius: 12, background: l.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <${SportIcon} k=${l.k} size=${20} color=${l.color}/>
            </span>
            <div style=${{ flex: 1, minWidth: 0 }}>
              <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 700, color: C.txt1 }}>${l.t}</p>
              <p style=${{ margin: '1px 0 0', fontSize: 11.5, color: C.txt3 }}>${l.sub}</p>
            </div>
            <${SportIcon} k="chevronR" size=${17} color=${C.txt5} sw=${2}/>
          </div>`)}
      </div>

      <div style=${{ padding: '20px 16px 0' }}>
        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style=${{ margin: 0, ...T.section }}>${MONTHS[m]}, ${y}</p>
          <div style=${{ display: 'flex', gap: 6 }}>
            ${[{ k: 'chevronL', d: -1 }, { k: 'chevronR', d: 1 }].map(b => html`
              <button key=${b.k} onClick=${() => setCursor(new Date(y, m + b.d, 1))} class="btn-action" style=${{ width: 28, height: 28, borderRadius: 9, background: C.bg2, border: `1px solid ${C.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <${SportIcon} k=${b.k} size=${14} color=${C.txt2} sw=${2.2}/>
              </button>`)}
          </div>
        </div>
        <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '14px 16px' }}>
          <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
            ${DOW.map(d => html`<span key=${d} style=${{ textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: C.txt5 }}>${d}</span>`)}
          </div>
          <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            ${Array.from({ length: lead }).map((_, i) => html`<div key=${'p' + i}/>`)}
            ${Array.from({ length: nDays }).map((_, i) => {
              const day = i + 1;
              const kinds = byDay[day];
              const isToday = day === today.getDate() && m === today.getMonth() && y === today.getFullYear();
              return html`
                <div key=${day} style=${{
                  aspectRatio: '1', borderRadius: 11, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 3, fontSize: 12.5,
                  background: kinds ? C.bg3 : 'transparent', color: kinds ? C.txt1 : C.txt3,
                  border: isToday ? `1.5px solid ${BRAND.blue}` : '1.5px solid transparent',
                  fontWeight: kinds ? 700 : 400,
                }}>
                  <span>${day}</span>
                  <span style=${{ display: 'flex', gap: 2, height: 4 }}>
                    ${(kinds || []).slice(0, 3).map(k => html`<span key=${k} style=${{ width: 4, height: 4, borderRadius: '50%', background: sportColor(k) }}/>`)}
                  </span>
                </div>`;
            })}
          </div>
        </div>
      </div>

      ${breakdown.length > 0 ? html`
        <div style=${{ padding: '20px 16px 0' }}>
          <${Section} t="PHÂN BỔ THEO MÔN" note="90 ngày" mt=${0}/>
          <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '14px 16px' }}>
            ${breakdown.map(b => html`
              <div key=${b.key} style=${{ marginBottom: 13 }}>
                <div style=${{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
                  <${SportIcon} k=${b.key} size=${17} color=${sportColor(b.key)}/>
                  <span style=${{ flex: 1, fontSize: 13, fontWeight: 600, color: C.txt1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${b.label}</span>
                  <span style=${{ fontSize: 11, color: C.txt4, whiteSpace: 'nowrap' }}>${b.n} buổi · ${b.min} phút</span>
                  <span style=${{ fontFamily: F.display, fontWeight: 700, fontSize: 15, color: C.txt1, minWidth: 44, textAlign: 'right' }}>${b.pts} đ</span>
                </div>
                <div style=${{ height: 6, borderRadius: 4, background: C.bg1, overflow: 'hidden' }}>
                  <div style=${{ width: Math.round((b.pts / maxPts) * 100) + '%', height: '100%', borderRadius: 4, background: sportColor(b.key) }}/>
                </div>
              </div>`)}
          </div>
        </div>` : ''}

      <div style=${{ padding: '18px 16px 80px' }}>
        <${Section} t="CÂN NẶNG" note="chỉ mình bạn thấy" mt=${0}/>
        <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style=${{ flexShrink: 0 }}>
            <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 34, lineHeight: 1, color: C.txt1 }}>
              ${last ? String(last.kg).replace('.', ',') : '—'}<span style=${{ fontSize: 15, marginLeft: 4 }}>KG</span>
            </p>
            <p style=${{ margin: '3px 0 0', fontSize: 11, color: C.txt4 }}>
              ${last ? last.label || '' : 'Chưa ghi'}${delta !== null ? html`<span style=${{ color: delta > 0 ? C.red : C.green, fontWeight: 600 }}> ${delta > 0 ? '▲' : '▼'} ${Math.abs(delta)}%</span>` : ''}
            </p>
          </div>
          <div style=${{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4, height: 44 }}>
            ${spark.map((w, i) => html`<span key=${i} style=${{ flex: 1, height: (wMax > wMin ? 30 + ((w.kg - wMin) / (wMax - wMin)) * 70 : 60) + '%', background: BRAND.babyBlue, borderRadius: 3 }}/>`)}
          </div>
          <button onClick=${onLogWeight} class="btn-action" style=${{ background: BRAND.blue, border: 'none', borderRadius: r.md, padding: '11px 16px', fontSize: 13.5, fontWeight: 600, color: '#fff', cursor: 'pointer', flexShrink: 0 }}>Ghi</button>
        </div>
      </div>
    </div>`;
}
