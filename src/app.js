import { useState, useEffect } from 'preact/hooks';
import { html } from './html.js';
import { C, r, ACC, F, BRAND } from './ui/theme.js';
import { Icons } from './ui/icons.js';
import { SportIcon } from './ui/sportIcons.js';
import { Wrap, Card, Empty, Label, Btn } from './ui/primitives.js';
import { beep } from './ui/sound.js';
import { uid, p2, fT, fD, durS, restLabel, fDM, fDT } from './domain/format.js';
import { sVol, eVol, tVol, e1rm, startOfWeek, fWeek, pct, weeklyStats, exHistory, lastExSets, trainedExIds, titleOptions, sessionsByTitle, computePRs, exsOf, volOf, weeklyActive, sportBreakdown, distanceProgress, personalRecords, currentWeekActivity } from './domain/stats.js';
import { EX } from './domain/exercises.js';
import { EXDB } from './data/exercises-db.js';
import { REST_PRESETS } from './domain/constants.js';
import { ACT, actOf, fieldsOf } from './domain/activities.js';
import { buildGymSession, buildActivitySession, summaryStats, headline } from './domain/session.js';
import { advanceStreak, computeStreak, liveStreak, dayStr } from './domain/streak.js';
import { evaluateBadges, BADGES } from './domain/badges.js';
import { db } from './data/local.js';
import { compressImage, uploadSessionPhoto, deleteSessionPhoto } from './data/photos.js';
import { saveSession, deleteSession as repoDeleteSession, updateSessionContent, deleteSessionWithStats, adminDeleteSession, dayContext } from './data/repo-sessions.js';
import { loadMyReactions } from './data/repo-social.js';
import { removeMyEntries } from './data/repo-leaderboard.js';
import { getPrivateWeights, savePrivateWeights } from './data/repo-private.js';
import { fbInitError, reportCloudError, setCloudErrorHandler } from './firebase.js';
import { watchAuth, consumeRedirect, ensureUserDoc, signOutUser, deleteMyAccount } from './auth.js';
import { saveOnboarding, updateUserDoc, isAdminUser } from './data/repo-users.js';
import { SignIn } from './screens/SignIn.js';
import { Onboarding } from './screens/Onboarding.js';
import { PickActivity } from './screens/PickActivity.js';
import { LogActivity } from './screens/LogActivity.js';
import { HomeTab } from './screens/HomeTab.js';
import { FeedTab } from './screens/FeedTab.js';
import { LeaderboardTab } from './screens/LeaderboardTab.js';
import { CommentsSheet } from './screens/CommentsSheet.js';
import { Settings } from './screens/Settings.js';
import { ProfileScreen } from './screens/ProfileScreen.js';
import { GuidesScreen } from './screens/GuidesScreen.js';
import { GuideDetail } from './screens/GuideDetail.js';
import { ClubsScreen } from './screens/ClubsScreen.js';
import { ClubDetail } from './screens/ClubDetail.js';
import { GoalsScreen } from './screens/GoalsScreen.js';
import { myInvites, acceptInvite, dismissInvite } from './data/repo-clubs.js';
import { guideForExercise, guidesForSport, richGuides } from './domain/guides.js';

function ResumeBar({ workout, onResume }) {
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - workout.startTime) / 1000));
  useEffect(() => {
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - workout.startTime) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [workout.startTime]);
  return html`
    <button onClick=${onResume} class="btn-action" style=${{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%',
      background: ACC, border: 'none', padding: '12px 16px', color: '#fff', cursor: 'pointer', flexShrink: 0,
    }}>
      <span style=${{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
        <span style=${{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block', opacity: 0.9 }}/>
        Đang tập: ${workout.dayName}
      </span>
      <span style=${{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>${fT(elapsed)} · Tiếp tục</span>
    </button>`;
}

// Chỉ số nổi bật (đa môn) cho thẻ tóm tắt: ưu tiên số liệu chính (không phải thời lượng), fallback điểm.
// Thay cho việc in "kg" cứng — gym→volume, chạy→km, bơi→m, yoga/đối kháng→điểm.
const primStat = s => {
  const stats = summaryStats(s);
  return stats.find(x => x.icon !== 'clock' && typeof x.v === 'number') || stats.find(x => x.icon === 'star') || { v: s.points || 0, u: 'điểm' };
};

function TabBar({ tab, onTab }) {
  const items = [
    { id: 'home', l: 'TRANG CHỦ', k: 'home' },
    { id: 'feed', l: 'BẢNG TIN', k: 'journal' },
    { id: 'rank', l: 'XẾP HẠNG', k: 'trophy' },
    { id: 'me', l: 'CÁ NHÂN', k: 'user' },
  ];
  return html`
    <nav style=${{ display: 'flex', borderTop: `1px solid ${C.bdr}`, background: '#fff', flexShrink: 0, paddingBottom: 'env(safe-area-inset-bottom)' }}>
      ${items.map(t => {
        const on = tab === t.id;
        return html`
          <button key=${t.id} onClick=${() => onTab(t.id)} class="btn-action" style=${{
            flex: 1, padding: '11px 0 9px', border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            color: on ? BRAND.blue : '#9DB4C9', transition: 'color .2s',
          }}>
            <${SportIcon} k=${t.k} size=${22} color=${on ? BRAND.blue : '#9DB4C9'} sw=${on ? 2 : 1.7}/>
            <span style=${{ fontFamily: F.display, fontSize: 11, fontWeight: 600, letterSpacing: '.07em' }}>${t.l}</span>
          </button>`;
      })}
    </nav>`;
}


function ProgsTab({ progs, onNew, onDel, onEdit, onStart, onBack }) {
  return html`
    <div class="fade-in" style=${{ padding: '22px 16px' }}>
      <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style=${{ display: 'flex', alignItems: 'center', gap: 10 }}>
          ${onBack && html`<button onClick=${onBack} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>`}
          <h2 style=${{ margin: 0, fontSize: 24, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.02em' }}>Chương trình</h2>
        </div>
        <${Btn} onClick=${onNew} cx=${{ display: 'flex', alignItems: 'center', gap: 6 }}><${Icons.plus} size=${16}/> Tạo mới</${Btn}>
      </div>
      ${progs.length === 0
      ? html`<${Empty} icon="journal" msg="Chưa có chương trình" sub='Nhấn "+ Tạo mới" để bắt đầu'/>`
      : progs.map(prog => html`
          <${Card} key=${prog.id} cx=${{ border: `1px solid ${C.bdr}` }}>
            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style=${{ margin: 0, fontSize: 16, fontWeight: 500, color: '#0f172a', letterSpacing: '-0.01em' }}>${prog.name}</p>
              <div style=${{ display: 'flex', gap: 6 }}>
                <button onClick=${() => onEdit(prog)} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.txt3, cursor: 'pointer' }}><${Icons.edit} size=${13}/></button>
                <button onClick=${() => { if (window.confirm(`Xoá "${prog.name}"?`)) onDel(prog.id); }} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.txt3, cursor: 'pointer' }}><${Icons.trash} size=${14}/></button>
              </div>
            </div>
            <div style=${{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              ${prog.days.map((d, i) => html`
                <button key=${i} onClick=${() => onStart(prog, i)} class="btn-action" style=${{
          padding: '8px 12px', borderRadius: r.md, border: `1px solid ${C.bdr}`,
          background: C.bg3, color: ACC, fontSize: 13, fontWeight: 400, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4
        }}>${d.name} <span style=${{ color: C.txt3, fontSize: 11, fontWeight: 500 }}>(${d.exercises.length})</span></button>`)}
            </div>
          </${Card}>`)}
    </div>`;
}

function CalendarTab({ sessions, onView, onClearHistory }) {
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selDate, setSelDate] = useState(null);

  const byDate = {};
  sessions.forEach(s => { if (!s.date) return; (byDate[s.date] = byDate[s.date] || []).push(s); });

  const y = cursor.getFullYear(), m = cursor.getMonth();
  const dateStr = (yy, mm, dd) => `${yy}-${p2(mm + 1)}-${p2(dd)}`;
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = new Date();
  const todayStr = dateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const streak = (() => {
    const set = new Set(Object.keys(byDate));
    let n = 0;
    const cur = new Date();
    const fmt = x => dateStr(x.getFullYear(), x.getMonth(), x.getDate());
    if (!set.has(fmt(cur))) cur.setDate(cur.getDate() - 1);
    while (set.has(fmt(cur))) { n++; cur.setDate(cur.getDate() - 1); }
    return n;
  })();

  const monthPrefix = `${y}-${p2(m + 1)}`;
  const monthSessions = sessions.filter(s => s.date && s.date.startsWith(monthPrefix));
  const monthMin = Math.round(monthSessions.reduce((t, s) => t + (s.activeMinutes || s.durationMin || 0), 0));

  const selSessions = selDate ? (byDate[selDate] || []) : [];
  const MONTH_NAMES = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  return html`
    <div class="fade-in" style=${{ padding: '22px 16px' }}>
      <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick=${() => { setCursor(new Date(y, m - 1, 1)); setSelDate(null); }} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2, fontSize: 16 }}>‹</button>
        <p style=${{ margin: 0, fontSize: 17, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>${MONTH_NAMES[m]}, ${y}</p>
        <button onClick=${() => { setCursor(new Date(y, m + 1, 1)); setSelDate(null); }} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2, fontSize: 16 }}>›</button>
      </div>

      <${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
        <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
          ${['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => html`<span key=${d} style=${{ textAlign: 'center', fontSize: 10, fontWeight: 500, color: C.txt3 }}>${d}</span>`)}
        </div>
        <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          ${cells.map((d, i) => {
    if (d === null) return html`<div key=${i}/>`;
    const ds = dateStr(y, m, d);
    const daySess = byDate[ds] || [];
    const has = daySess.length > 0;
    const dayTypes = [...new Set(daySess.map(s => s.type || 'gym'))].slice(0, 3);
    const isToday = ds === todayStr;
    const isSel = ds === selDate;
    return html`
              <button key=${ds} onClick=${() => has && setSelDate(isSel ? null : ds)} class="btn-action" style=${{
        aspectRatio: '1', border: isToday ? `1.5px solid ${ACC}` : '1px solid transparent', borderRadius: r.md,
        background: isSel ? ACC : (has ? 'var(--accent-glow)' : 'transparent'),
        color: isSel ? '#fff' : (has ? ACC : C.txt2),
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
        cursor: has ? 'pointer' : 'default', fontSize: 13, fontWeight: has ? 600 : 400
      }}>
                <span>${d}</span>
                ${has && html`<span style=${{ display: 'flex', gap: 2 }}>${dayTypes.map(t => html`<span key=${t} style=${{ width: 4, height: 4, borderRadius: '50%', background: isSel ? '#fff' : (ACT[t]?.color || ACC) }}/>`)}</span>`}
              </button>`;
  })}
        </div>
      </${Card}>

      <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        <${Card} cx=${{ border: `1px solid ${C.bdr}`, textAlign: 'center' }}>
          <div style=${{ display: 'flex', justifyContent: 'center', color: ACC, marginBottom: 4 }}><${Icons.flame} size=${18}/></div>
          <p style=${{ margin: 0, fontSize: 9, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Chuỗi liên tiếp</p>
          <p style=${{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: '#0f172a' }}>${streak} ngày</p>
        </${Card}>
        <${Card} cx=${{ border: `1px solid ${C.bdr}`, textAlign: 'center' }}>
          <div style=${{ display: 'flex', justifyContent: 'center', color: ACC, marginBottom: 4 }}><${Icons.trophy} size=${18}/></div>
          <p style=${{ margin: 0, fontSize: 9, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Trong tháng</p>
          <p style=${{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: '#0f172a' }}>${monthSessions.length} buổi · ${monthMin} phút</p>
        </${Card}>
      </div>

      ${selDate && html`
        <${Label} t=${fD(selDate)} mt=${20}/>
        ${selSessions.map(s => html`
          <${Card} key=${s.id} onClick=${() => onView(s)} class="card-hover" cx=${{ cursor: 'pointer', border: `1px solid ${C.bdr}` }}>
            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              ${s.photoUrl && html`<img src=${s.photoUrl} loading="lazy" style=${{ width: 44, height: 44, borderRadius: r.md, objectFit: 'cover', flexShrink: 0 }}/>`}
              <div style=${{ flex: 1, minWidth: 0 }}>
                <p style=${{ margin: '0 0 2px', fontSize: 14, fontWeight: 500, color: '#0f172a' }}>${s.title || s.dayName}</p>
                <p style=${{ margin: 0, color: C.txt2, fontSize: 12 }}>${s.progName}</p>
              </div>
              <div style=${{ textAlign: 'right', flexShrink: 0 }}>
                <p style=${{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: ACC }}>${primStat(s).v}${primStat(s).u ? ' ' + primStat(s).u : ''}</p>
                <p style=${{ margin: 0, color: C.txt3, fontSize: 12 }}>${durS(s.endTime - s.startTime)}</p>
              </div>
            </div>
          </${Card}>`)}
      `}

      ${sessions.length > 0 && html`
        <div style=${{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <button onClick=${() => { if (window.confirm(`Xoá toàn bộ ${sessions.length} buổi tập trong lịch sử? Không thể hoàn tác.`)) onClearHistory(); }} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 5, background: C.redBg, border: 'none', borderRadius: r.md, padding: '6px 12px', color: C.red, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}><${Icons.trash} size=${13}/> Xoá lịch sử</button>
        </div>
      `}
    </div>`;
}

function ActiveWorkout({ workout, sessions, onChange, onFinish, onDiscard, onPickEx, onMinimize, onGuide }) {
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - workout.startTime) / 1000));
  const [rest, setRest] = useState(null);
  const [restTime, setRestTime] = useState(90);

  useEffect(() => {
    const tick = () => {
      setElapsed(Math.floor((Date.now() - workout.startTime) / 1000));
      setRest(r => {
        if (!r) return null;
        const secsLeft = Math.max(0, Math.round((r.endTime - Date.now()) / 1000));
        if (secsLeft === 0 && !r.beeped) { beep(); return { ...r, secs: 0, beeped: true }; }
        return { ...r, secs: secsLeft };
      });
    };
    const iv = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    tick();
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', tick); };
  }, []);

  const updEx = async (i, ex) => onChange({ ...workout, exs: workout.exs.map((e, j) => j === i ? ex : e) });
  const toggleSet = async (ei, si) => {
    const ex = workout.exs[ei];
    const done = !ex.sets[si].done;
    const sets = ex.sets.map((s, j) => j === si ? { ...s, done } : s);
    if (done) setRest({ endTime: Date.now() + restTime * 1000, secs: restTime, max: restTime, beeped: false });
    await updEx(ei, { ...ex, sets });
  };
  const updSet = async (ei, si, f, v) => {
    const ex = workout.exs[ei];
    await updEx(ei, { ...ex, sets: ex.sets.map((s, j) => j === si ? { ...s, [f]: v } : s) });
  };
  const addSet = async (ei) => {
    const ex = workout.exs[ei];
    const last = ex.sets[ex.sets.length - 1] || {};
    await updEx(ei, { ...ex, sets: [...ex.sets, { id: uid(), weight: last.weight || '', reps: last.reps || '', rpe: '', done: false }] });
  };
  const delSet = async (ei) => {
    const ex = workout.exs[ei];
    if (ex.sets.length <= 1) return;
    await updEx(ei, { ...ex, sets: ex.sets.slice(0, -1) });
  };
  const replEx = (ei) => onPickEx(async e => {
    await onChange({ ...workout, exs: workout.exs.map((ex, i) => i === ei ? { ...ex, exId: e.id, name: e.name } : ex) });
  });
  const moveEx = async (ei, dir) => {
    const j = ei + dir;
    if (j < 0 || j >= workout.exs.length) return;
    const exs = [...workout.exs];
    [exs[ei], exs[j]] = [exs[j], exs[ei]];
    await onChange({ ...workout, exs });
  };
  const addEx = () => onPickEx(async e => {
    await onChange({ ...workout, exs: [...workout.exs, { id: uid(), exId: e.id, name: e.name, sets: [{ id: uid(), weight: '', reps: '', rpe: '', done: false }], notes: '' }] });
  });
  const addRestSecs = n => setRest(r => {
    if (!r) return null;
    const endTime = r.endTime + n * 1000;
    const secsLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    return { ...r, endTime, secs: secsLeft, max: Math.max(r.max, secsLeft), beeped: secsLeft > 0 ? false : r.beeped };
  });
  const vol = tVol(workout.exs);

  return html`
    <${Wrap}>
      <div style=${{ background: '#ffffff', borderBottom: `1px solid ${C.bdr}`, padding: '14px 16px 12px', flexShrink: 0 }}>
        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style=${{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick=${onMinimize} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2, flexShrink: 0 }}>
              <${Icons.back} size=${16}/>
            </button>
            <div>
              <p style=${{ margin: 0, fontSize: 11, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case', letterSpacing: '0.05em' }}>${workout.progName}</p>
              <h2 style=${{ margin: 0, fontSize: 20, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.02em' }}>${workout.dayName}</h2>
            </div>
          </div>
          <div style=${{ textAlign: 'right' }}>
            <p style=${{ margin: 0, fontSize: 24, fontWeight: 600, color: ACC, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>${fT(elapsed)}</p>
            <p style=${{ margin: 0, fontSize: 11, color: C.txt3, fontWeight: 500 }}>${Math.round(vol)} kg volume</p>
          </div>
        </div>
        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style=${{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style=${{ fontSize: 11, color: C.txt3, fontWeight: 400 }}>NGHỈ:</span>
            ${REST_PRESETS.map(t => html`
              <button key=${t} onClick=${() => setRestTime(t)} class="btn-action" style=${{
      padding: '5px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 400,
      background: restTime === t ? ACC : '#f1f5f9',
      color: restTime === t ? '#fff' : C.txt2,
      boxShadow: restTime === t ? `0 2px 8px var(--accent-glow)` : 'none'
    }}>${restLabel(t)}</button>`)}
          </div>
          <div style=${{ display: 'flex', gap: 8 }}>
            <button onClick=${() => { if (window.confirm('Huỷ buổi tập?')) onDiscard(); }} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: r.md, padding: '8px 14px', color: C.txt2, fontSize: 12, fontWeight: 400, cursor: 'pointer' }}>Huỷ</button>
            <button onClick=${onFinish} class="btn-action" style=${{ background: C.green, border: 'none', borderRadius: r.md, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', boxShadow: `0 4px 12px rgba(16,185,129,0.2)` }}>✓ Xong</button>
          </div>
        </div>
      </div>

      <!-- Radial Rest Timer Floating Card -->
      ${rest !== null && html`
        <div class="slide-up ${rest.secs === 0 ? 'pulse-red-glow' : ''}" style=${{
        position: 'fixed', bottom: 20, left: 16, right: 16,
        background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)',
        border: `1px solid ${rest.secs === 0 ? C.red : '#e2e8f0'}`,
        borderRadius: r.lg, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)', zIndex: 1000
      }}>
          <div style=${{ position: 'relative', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="54" height="54" viewBox="0 0 60 60" style=${{ transform: 'rotate(-90deg)' }}>
              <circle cx="30" cy="30" r="26" fill="none" stroke="#f1f5f9" stroke-width="4" />
              <circle cx="30" cy="30" r="26" fill="none" stroke=${rest.secs === 0 ? C.green : ACC} stroke-width="4" 
                      stroke-dasharray="163.3" 
                      stroke-dashoffset=${163.3 - (163.3 * rest.secs) / rest.max}
                      stroke-linecap="round"
                      style=${{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <span style=${{ position: 'absolute', fontSize: 14, fontWeight: 600, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
              ${rest.secs}s
            </span>
          </div>
          <div style=${{ flex: 1 }}>
            <p style=${{ margin: 0, fontSize: 10, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case', letterSpacing: '0.05em' }}>Thời gian nghỉ</p>
            <p style=${{ margin: 0, fontSize: 13, fontWeight: 500, color: rest.secs === 0 ? C.green : '#0f172a' }}>
              ${rest.secs === 0 ? 'Hết giờ! Tiếp tục tập thôi 🔥' : `Tiếp tục sau ${fT(rest.secs)}`}
            </p>
          </div>
          <div style=${{ display: 'flex', gap: 6, alignItems: 'center' }}>
            ${rest.secs > 0 && html`
              <button onClick=${() => addRestSecs(-15)} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: r.sm, padding: '6px 8px', fontSize: 11, fontWeight: 400, color: '#475569', cursor: 'pointer' }}>−15s</button>
              <button onClick=${() => addRestSecs(15)} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: r.sm, padding: '6px 8px', fontSize: 11, fontWeight: 400, color: '#475569', cursor: 'pointer' }}>+15s</button>
            `}
            <button onClick=${() => setRest(null)} class="btn-action" style=${{ background: 'none', border: 'none', color: C.txt3, cursor: 'pointer', fontSize: 22, padding: 4, marginLeft: 4 }}>×</button>
          </div>
        </div>
      `}

      <div style=${{ flex: 1, overflowY: 'auto', paddingBottom: 100, WebkitOverflowScrolling: 'touch' }}>
        ${workout.exs.map((ex, ei) => {
        const prevSets = sessions ? lastExSets(sessions, ex.exId) : null;
        return html`
          <div key=${ex.id} style=${{ borderBottom: `1px solid ${C.bdr}`, padding: '16px 16px' }}>
            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style=${{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <${ExThumb} exId=${ex.exId} name=${ex.name} size=${32}/>
                <div style=${{ minWidth: 0 }}>
                  <p style=${{ margin: 0, fontSize: 15, fontWeight: 600, color: ACC, letterSpacing: '-0.01em' }}>${ex.name}</p>
                  ${onGuide && guideForExercise(ex.exId) && html`<button onClick=${() => onGuide(ex.exId)} class="btn-action" style=${{ background: 'transparent', border: 'none', color: C.txt2, fontSize: 11.5, fontWeight: 500, cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', gap: 3 }}>📖 Hướng dẫn</button>`}
                </div>
              </div>
              <div style=${{ display: 'flex', gap: 6 }}>
                <button onClick=${() => moveEx(ei, -1)} disabled=${ei === 0} class="btn-action" style=${{ background: '#f1f5f9', border: `1px solid #e2e8f0`, borderRadius: r.md, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: ei === 0 ? C.txt3 : C.txt2, cursor: ei === 0 ? 'default' : 'pointer', opacity: ei === 0 ? 0.4 : 1 }}>↑</button>
                <button onClick=${() => moveEx(ei, 1)} disabled=${ei === workout.exs.length - 1} class="btn-action" style=${{ background: '#f1f5f9', border: `1px solid #e2e8f0`, borderRadius: r.md, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: ei === workout.exs.length - 1 ? C.txt3 : C.txt2, cursor: ei === workout.exs.length - 1 ? 'default' : 'pointer', opacity: ei === workout.exs.length - 1 ? 0.4 : 1 }}>↓</button>
                <button onClick=${() => replEx(ei)} class="btn-action" style=${{ background: '#f1f5f9', border: `1px solid #e2e8f0`, borderRadius: r.md, padding: '6px 12px', fontSize: 12, fontWeight: 400, color: C.txt2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><${Icons.swap} size=${12}/> Thay</button>
              </div>
            </div>
            ${prevSets && html`<p style=${{ margin: '0 0 12px', fontSize: 11.5, color: C.txt3 }}>Lần trước: ${prevSets.map(s => `${s.weight || 0}kg×${s.reps || 0}${s.rpe ? ` (RPE ${s.rpe})` : ''}`).join(' · ')}</p>`}
            ${!prevSets && html`<div style=${{ marginBottom: 12 }}/>`}

            <div style=${{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr 56px 40px', gap: 8, marginBottom: 8 }}>
              ${['#', 'KG', 'REPS', 'RPE', ''].map((h, i) => html`<span key=${i} style=${{ fontSize: 10, fontWeight: 500, color: C.txt3, textAlign: 'center', letterSpacing: '0.05em' }}>${h}</span>`)}
            </div>
            
            ${ex.sets.map((set, si) => html`
              <div key=${set.id} style=${{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr 56px 40px', gap: 8, marginBottom: 8, alignItems: 'center', opacity: set.done ? .75 : 1, transition: 'opacity 0.2s' }}>
                <span style=${{ fontSize: 12, color: C.txt3, fontWeight: 500, textAlign: 'center' }}>${si + 1}</span>
                <input type="number" inputMode="decimal" placeholder="—" value=${set.weight}
                  onInput=${e => updSet(ei, si, 'weight', e.target.value)}
                  class=${`workout-input ${set.done ? 'workout-input-done' : ''}`}
                  style=${{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '10px 4px', borderRadius: r.md, fontSize: 14, textAlign: 'center' }}
                />
                <input type="number" inputMode="numeric" placeholder="—" value=${set.reps}
                  onInput=${e => updSet(ei, si, 'reps', e.target.value)}
                  class=${`workout-input ${set.done ? 'workout-input-done' : ''}`}
                  style=${{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '10px 4px', borderRadius: r.md, fontSize: 14, textAlign: 'center' }}
                />
                <input type="number" inputMode="numeric" placeholder="—" min="1" max="10" value=${set.rpe}
                  onInput=${e => updSet(ei, si, 'rpe', e.target.value)}
                  class=${`workout-input ${set.done ? 'workout-input-done' : ''}`}
                  style=${{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '10px 4px', borderRadius: r.md, fontSize: 14, textAlign: 'center' }}
                />
                <button onClick=${() => toggleSet(ei, si)} class=${`btn-action ${set.done ? 'checkmark-pop' : ''}`} style=${{
            width: 40, height: 40, borderRadius: r.md, border: 'none', cursor: 'pointer',
            background: set.done ? C.greenBg : C.bg3, color: set.done ? C.green : C.txt3,
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: set.done ? '0 4px 12px rgba(16,185,129,0.08)' : 'none',
            transition: 'all 0.2s'
          }}>
                  <${Icons.check} size=${16} strokeWidth=${3} />
                </button>
              </div>`)}
            
            <div style=${{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick=${() => addSet(ei)} class="btn-action" style=${{ background: '#f1f5f9', border: `1px solid #e2e8f0`, borderRadius: r.md, padding: '8px 14px', fontSize: 12, fontWeight: 400, color: C.txt1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><${Icons.plus} size=${12}/> Set</button>
              ${ex.sets.length > 1 && html`<button onClick=${() => delSet(ei)} class="btn-action" style=${{ background: C.redBg, border: 'none', borderRadius: r.md, padding: '8px 14px', fontSize: 12, fontWeight: 400, color: C.red, cursor: 'pointer' }}>− Set</button>`}
            </div>
            
            <input type="text" placeholder="Ghi chú bài tập..." value=${ex.notes}
              onInput=${e => updEx(ei, { ...ex, notes: e.target.value })}
              style=${{ marginTop: 12, width: '100%', padding: '10px 12px', borderRadius: r.md, border: `1px solid #e2e8f0`, fontSize: 12, color: C.txt2, background: '#f8fafc' }}
            />
          </div>`;
      })}

        <div style=${{ padding: '20px 16px' }}>
          <button onClick=${addEx} class="btn-action" style=${{ width: '100%', padding: '14px', borderRadius: r.md, border: `1.5px dashed ${C.bdr2}`, background: 'transparent', color: ACC, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <${Icons.plus} size=${14} /> Thêm bài tập
          </button>
        </div>
      </div>
    </${Wrap}>`;
}

function SaveWorkout({ workout, defaultVisibility = 'company', onBack, onDiscard, onSave }) {
  const [title, setTitle] = useState(workout.dayName);
  const [note, setNote] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [visibility, setVisibility] = useState(defaultVisibility);
  const [durMin, setDurMin] = useState(() => String(Math.max(1, Math.round((Date.now() - workout.startTime) / 60000))));
  const [when, setWhen] = useState(() => {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const vol = tVol(workout.exs);
  const totalSets = workout.exs.reduce((t, e) => t + e.sets.filter(s => s.done).length, 0);

  const pickPhoto = e => {
    const f = e.target.files[0];
    if (!f) return;
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };
  const removePhoto = e => { e.preventDefault(); e.stopPropagation(); setPhotoFile(null); setPhotoPreview(null); };

  const save = async () => {
    const t = title.trim() || workout.dayName;
    const d = new Date(when);
    setSaving(true);
    // Không upload ở đây; truyền photoFile lên để GymPair xử lý theo uid.
    onSave({
      title: t, note: note.trim(), photoFile, visibility,
      durationMin: parseFloat(durMin) || Math.round((Date.now() - workout.startTime) / 60000),
      date: isNaN(d) ? undefined : d.toISOString().split('T')[0],
      loggedAt: isNaN(d) ? Date.now() : d.getTime(),
    });
  };

  return html`
    <${Wrap}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, flexShrink: 0, background: '#ffffff', display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick=${onBack} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}>
          <${Icons.back} size=${18}/>
        </button>
        <h2 style=${{ flex: 1, margin: 0, fontSize: 16, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>Lưu buổi tập</h2>
        <${Btn} onClick=${save} cx=${{ opacity: saving ? 0.6 : 1, pointerEvents: saving ? 'none' : 'auto' }}>${saving ? 'Đang lưu...' : 'Lưu'}</${Btn}>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '18px 16px', WebkitOverflowScrolling: 'touch' }}>
        <input type="text" value=${title} onInput=${e => setTitle(e.target.value)}
          placeholder="Tên buổi tập"
          style=${{ width: '100%', border: 'none', background: 'transparent', fontSize: 24, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 20, padding: 0 }}
        />

        <label style=${{ display: 'block', cursor: 'pointer', marginBottom: 20 }}>
          <input type="file" accept="image/*" style=${{ display: 'none' }} onChange=${pickPhoto}/>
          ${photoPreview
      ? html`
            <div style=${{ position: 'relative', borderRadius: r.lg, overflow: 'hidden' }}>
              <img src=${photoPreview} style=${{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}/>
              <button onClick=${removePhoto} style=${{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 28, height: 28, color: '#fff', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>`
      : html`
            <div style=${{ border: `1.5px dashed ${C.bdr2}`, borderRadius: r.lg, padding: '22px', textAlign: 'center', color: C.txt3 }}>
              <div style=${{ fontSize: 26, marginBottom: 6 }}>📷</div>
              <p style=${{ margin: 0, fontSize: 13, fontWeight: 500 }}>Thêm ảnh</p>
            </div>`}
        </label>

        <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20, alignItems: 'end' }}>
          <div>
            <p style=${{ margin: '0 0 2px', fontSize: 11, color: C.txt3, fontWeight: 400 }}>Thời lượng (phút)</p>
            <input type="number" inputMode="numeric" value=${durMin} onInput=${e => setDurMin(e.target.value)}
              class="workout-input" style=${{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', borderRadius: r.md, fontSize: 16, fontWeight: 600, color: ACC }}/>
          </div>
          <div>
            <p style=${{ margin: '0 0 2px', fontSize: 11, color: C.txt3, fontWeight: 400 }}>Volume</p>
            <p style=${{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0f172a' }}>${Math.round(vol)} kg</p>
          </div>
          <div>
            <p style=${{ margin: '0 0 2px', fontSize: 11, color: C.txt3, fontWeight: 400 }}>Sets</p>
            <p style=${{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0f172a' }}>${totalSets}</p>
          </div>
        </div>

        <div style=${{ borderTop: `1px solid ${C.bdr}`, paddingTop: 14, marginBottom: 16 }}>
          <p style=${{ margin: '0 0 6px', fontSize: 11, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Khi nào</p>
          <input type="datetime-local" value=${when} onInput=${e => setWhen(e.target.value)}
            class="workout-input" style=${{ width: '100%', padding: '10px 12px', borderRadius: r.md, fontSize: 14, color: ACC, fontWeight: 400 }}
          />
        </div>

        <div style=${{ borderTop: `1px solid ${C.bdr}`, paddingTop: 14, marginBottom: 24 }}>
          <p style=${{ margin: '0 0 6px', fontSize: 11, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Ghi chú</p>
          <textarea value=${note} onInput=${e => setNote(e.target.value)}
            placeholder="Buổi tập này thế nào? Cảm giác, năng lượng, điều cần nhớ..."
            rows="4"
            class="workout-input" style=${{ width: '100%', padding: '10px 12px', borderRadius: r.md, fontSize: 14, resize: 'none' }}
          />
        </div>

        <div style=${{ borderTop: `1px solid ${C.bdr}`, paddingTop: 14, marginBottom: 24 }}>
          <p style=${{ margin: '0 0 8px', fontSize: 11, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Hiển thị</p>
          <div style=${{ display: 'flex', gap: 8 }}>
            ${[{ v: 'company', l: '🌏 Đồng nghiệp' }, { v: 'private', l: '🔒 Chỉ mình tôi' }].map(o => html`
              <button key=${o.v} onClick=${() => setVisibility(o.v)} class="btn-action" style=${{
          flex: 1, padding: '11px', borderRadius: r.md, cursor: 'pointer', fontSize: 13.5, fontWeight: 500,
          border: `1px solid ${visibility === o.v ? ACC : C.bdr}`,
          background: visibility === o.v ? 'var(--accent-glow)' : '#fff',
          color: visibility === o.v ? ACC : C.txt2,
        }}>${o.l}</button>`)}
          </div>
        </div>

        <button onClick=${onDiscard} class="btn-action" style=${{ width: '100%', background: 'transparent', border: 'none', color: C.red, fontSize: 14, fontWeight: 400, cursor: 'pointer', padding: '10px 0' }}>
          Huỷ buổi tập
        </button>
      </div>
    </${Wrap}>`;
}

function CreateProg({ exList, onSave, onClose, editProg }) {
  const [name, setName] = useState(editProg?.name || '');
  const [days, setDays] = useState(editProg ? editProg.days.map(d => ({ id: d.id, name: d.name, exs: d.exercises })) : [{ id: uid(), name: '', exs: [] }]);
  const [pf, setPf] = useState(null);
  const [search, setSearch] = useState('');

  const filt = exList.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()));
  const setDN = (i, v) => setDays(d => d.map((day, j) => j === i ? { ...day, name: v } : day));
  const addDay = () => setDays(d => [...d, { id: uid(), name: '', exs: [] }]);
  const delDay = i => setDays(d => d.filter((_, j) => j !== i));
  const addExToDay = (di, ex) => { setDays(d => d.map((day, i) => i === di ? { ...day, exs: [...day.exs, { exId: ex.id, name: ex.name, sets: 3 }] } : day)); setPf(null); setSearch(''); };
  const delExFromDay = (di, ei) => setDays(d => d.map((day, i) => i === di ? { ...day, exs: day.exs.filter((_, j) => j !== ei) } : day));
  const setSetsN = (di, ei, v) => setDays(d => d.map((day, i) => i === di ? { ...day, exs: day.exs.map((e, j) => j === ei ? { ...e, sets: Math.max(1, parseInt(v) || 1) } : e) } : day));
  const save = () => {
    if (!name.trim()) return alert('Nhập tên chương trình!');
    if (days.some(d => !d.name.trim())) return alert('Nhập tên cho tất cả các ngày!');
    if (days.some(d => d.exs.length === 0)) return alert('Mỗi ngày cần ít nhất 1 bài tập!');
    onSave({ id: editProg?.id || uid(), name: name.trim(), days: days.map(d => ({ id: d.id, name: d.name, exercises: d.exs })) });
  };

  return html`
    <${Wrap} cx=${{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, background: C.bg1 }}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#ffffff', display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
        <button onClick=${onClose} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}>
          <${Icons.close} size=${20}/>
        </button>
        <h2 style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0f172a', flex: 1, letterSpacing: '-0.01em' }}>${editProg ? 'Sửa chương trình' : 'Tạo chương trình'}</h2>
        <${Btn} onClick=${save}>Lưu</${Btn}>
      </div>
      <div style=${{ flex: 1, overflowY: 'auto', padding: '16px', WebkitOverflowScrolling: 'touch' }}>
        <input type="text" placeholder="Tên chương trình (VD: Push Pull Legs)"
          value=${name} onInput=${e => setName(e.target.value)}
          style=${{ width: '100%', padding: '14px 16px', borderRadius: r.lg, border: `1px solid ${C.bdr}`, fontSize: 15, marginBottom: 20, background: '#ffffff', color: C.txt1, display: 'block', transition: 'border-color 0.2s' }}
          onFocus=${e => e.target.style.borderColor = ACC}
          onBlur=${e => e.target.style.borderColor = C.bdr}
        />
        ${days.map((day, di) => html`
          <div key=${day.id} style=${{ background: '#ffffff', borderRadius: r.lg, padding: 16, marginBottom: 16, border: `1px solid ${C.bdr}` }}>
            <div style=${{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
              <input type="text" placeholder="Tên ngày (Push, Chân, Full Body...)"
                value=${day.name} onInput=${e => setDN(di, e.target.value)}
                style=${{ flex: 1, padding: '10px 12px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 13, background: C.bg1, color: C.txt1 }}
              />
              ${days.length > 1 && html`<button onClick=${() => delDay(di)} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.txt3, cursor: 'pointer' }}><${Icons.close} size=${16}/></button>`}
            </div>
            ${day.exs.map((pe, ei) => html`
              <div key=${ei} style=${{ display: 'flex', alignItems: 'center', gap: 8, background: C.bg3, borderRadius: r.md, padding: '10px 12px', marginBottom: 8, border: `1px solid rgba(0,0,0,0.03)` }}>
                <span style=${{ flex: 1, fontSize: 13, fontWeight: 400, color: C.txt1 }}>${pe.name}</span>
                <input type="number" min="1" max="20" value=${pe.sets}
                  onInput=${e => setSetsN(di, ei, e.target.value)}
                  style=${{ width: 42, padding: '6px 4px', borderRadius: r.sm, border: `1px solid ${C.bdr}`, fontSize: 12, textAlign: 'center', color: C.txt1, background: '#ffffff' }}
                />
                <span style=${{ fontSize: 11, color: C.txt3, fontWeight: 400 }}>sets</span>
                <button onClick=${() => delExFromDay(di, ei)} class="btn-action" style=${{ background: 'none', border: 'none', color: C.txt3, cursor: 'pointer', padding: 4 }}><${Icons.close} size=${16}/></button>
              </div>`)}
            ${pf === di ? html`
              <div class="fade-in" style=${{ marginTop: 12, paddingTop: 12, borderTop: `1px solid rgba(0,0,0,0.05)` }}>
                <input type="text" placeholder="Tìm bài tập..." value=${search}
                  onInput=${e => setSearch(e.target.value)}
                  style=${{ width: '100%', padding: '10px 12px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 13, marginBottom: 8, background: C.bg1, color: C.txt1, boxSizing: 'border-box' }}
                />
                <div style=${{ maxHeight: 180, overflowY: 'auto', background: '#ffffff', borderRadius: r.md, border: `1px solid ${C.bdr}` }}>
                  ${filt.map(e => html`
                    <button key=${e.id} onClick=${() => addExToDay(di, e)} style=${{
      display: 'block', width: '100%', background: 'transparent', border: 'none',
      padding: '10px 12px', textAlign: 'left', fontSize: 13, cursor: 'pointer', color: C.txt1,
      borderBottom: `1px solid ${C.bdr}`,
    }}>${e.name} <span style=${{ color: C.txt3, fontSize: 11 }}>${e.g}</span></button>`)}
                </div>
                <button onClick=${() => { setPf(null); setSearch(''); }} style=${{ background: 'none', border: 'none', color: C.txt2, fontSize: 12, cursor: 'pointer', marginTop: 8, fontWeight: 400 }}>Huỷ</button>
              </div>`
      : html`
              <button onClick=${() => setPf(di)} class="btn-action" style=${{
          marginTop: day.exs.length ? 12 : 0, width: '100%', background: 'transparent',
          border: `1.5px dashed ${C.bdr2}`, borderRadius: r.md, padding: '11px', color: ACC, fontSize: 12, fontWeight: 400, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
        }}><${Icons.plus} size=${14} /> Thêm bài tập</button>`}
          </div>`)}
        <button onClick=${addDay} class="btn-action" style=${{ width: '100%', background: '#ffffff', border: `1px solid ${C.bdr2}`, borderRadius: r.md, padding: '14px', fontSize: 13, fontWeight: 400, color: C.txt1, cursor: 'pointer', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><${Icons.plus} size=${16}/> Thêm ngày</button>
      </div>
    </${Wrap}>`;
}

// Icon tròn nhỏ trước tên bài tập. Dùng ảnh tư thế kết thúc (1.jpg) từ thư viện EXDB;
// bài tự tạo (không có trong EXDB) → fallback chữ cái đầu.
function ExThumb({ exId, name, size = 34 }) {
  const img = EXDB[exId] && EXDB[exId].images && EXDB[exId].images[1];
  const base = { width: size, height: size, borderRadius: '50%', flexShrink: 0, border: `1px solid ${C.bdr}`, background: C.bg3 };
  if (img) return html`<img src=${img} loading="lazy" alt="" style=${{ ...base, objectFit: 'cover', display: 'block' }}/>`;
  return html`<div style=${{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.txt3, fontSize: Math.round(size * 0.42), fontWeight: 600 }}>${(name || '?').charAt(0).toUpperCase()}</div>`;
}

function PickEx({ exList, onPick, onClose, onAddEx }) {
  const [s, setS] = useState('');
  const [nn, setNn] = useState('');
  const [showA, setShowA] = useState(false);
  const [selG, setSelG] = useState(null);
  const [newG, setNewG] = useState(null);
  const CORE_GROUPS = [...new Set(EX.map(e => e.g))];
  const allGroups = [...new Set(exList.map(e => e.g))];
  const bySearch = s ? exList.filter(e => e.name.toLowerCase().includes(s.toLowerCase()) || e.g.toLowerCase().includes(s.toLowerCase())) : exList;
  const filt = selG ? bySearch.filter(e => e.g === selG) : bySearch;
  const groups = [...new Set(filt.map(e => e.g))];
  const addC = async () => {
    if (!nn.trim()) return;
    const ex = { id: uid(), name: nn.trim(), g: newG || 'Tuỳ chỉnh' };
    await onAddEx(ex);
    onPick(ex);
  };
  return html`
    <${Wrap} cx=${{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, background: C.bg1 }}>
      <div style=${{ padding: '14px 16px 12px', borderBottom: `1px solid ${C.bdr}`, background: '#ffffff', flexShrink: 0 }}>
        <div style=${{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <button onClick=${onClose} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}>
            <${Icons.close} size=${20}/>
          </button>
          <h3 style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>Chọn bài tập</h3>
        </div>
        <input type="text" placeholder="Tìm bài tập..." value=${s}
          onInput=${e => setS(e.target.value)}
          style=${{ width: '100%', padding: '11px 14px', borderRadius: r.lg, border: `1px solid ${C.bdr}`, fontSize: 13, background: '#ffffff', color: C.txt1, boxSizing: 'border-box', marginBottom: 10 }}
        />
        <div style=${{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
          <button onClick=${() => setSelG(null)} class="btn-action" style=${{
      flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
      background: selG === null ? ACC : C.bg3, color: selG === null ? '#fff' : C.txt2
    }}>Tất cả</button>
          ${allGroups.map(g => html`
            <button key=${g} onClick=${() => setSelG(g)} class="btn-action" style=${{
        flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
        background: selG === g ? ACC : C.bg3, color: selG === g ? '#fff' : C.txt2
      }}>${g}</button>`)}
        </div>
      </div>
      <div style=${{ flex: 1, overflowY: 'auto', padding: '8px 16px', WebkitOverflowScrolling: 'touch' }}>
        ${groups.length === 0 && html`<${Empty} icon="other" msg="Không tìm thấy bài tập" sub="Thử nhóm cơ khác hoặc từ khoá khác"/>`}
        ${groups.map(g => html`
          <div key=${g}>
            <${Label} t=${g} mt=${12}/>
            ${filt.filter(e => e.g === g).map(e => html`
              <button key=${e.id} onClick=${() => onPick(e)} class="btn-action card-hover" style=${{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: '#ffffff', border: `1px solid ${C.bdr}`,
          borderRadius: r.md, padding: '10px 14px', textAlign: 'left', fontSize: 13, fontWeight: 400,
          cursor: 'pointer', marginBottom: 8, color: C.txt1,
        }}>
                <${ExThumb} exId=${e.id} name=${e.name}/>
                <span style=${{ flex: 1, minWidth: 0 }}>${e.name}</span>
              </button>`)}
          </div>`)}
        ${!showA
      ? html`<button onClick=${() => setShowA(true)} class="btn-action" style=${{ marginTop: 20, marginBottom: 40, width: '100%', background: 'transparent', border: `1.5px dashed ${C.bdr2}`, borderRadius: r.md, padding: '14px', color: ACC, fontSize: 13, fontWeight: 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><${Icons.plus} size=${16}/> Tạo bài tập mới</button>`
      : html`
            <div class="fade-in" style=${{ marginTop: 20, marginBottom: 40, background: '#ffffff', borderRadius: r.lg, padding: 16, border: `1px solid ${C.bdr}` }}>
              <p style=${{ margin: '0 0 12px', fontSize: 13, fontWeight: 500, color: '#0f172a' }}>Bài tập mới</p>
              <input type="text" placeholder="Tên bài tập..." value=${nn}
                onInput=${e => setNn(e.target.value)}
                style=${{ width: '100%', padding: '11px 14px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 13, marginBottom: 12, background: C.bg1, color: C.txt1, boxSizing: 'border-box' }}
              />
              <p style=${{ margin: '4px 0 8px', fontSize: 11, fontWeight: 500, color: C.txt3, letterSpacing: '0.05em' }}>NHÓM CƠ</p>
              <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                ${[...CORE_GROUPS, 'Tuỳ chỉnh'].map(g => html`
                  <button key=${g} onClick=${() => setNewG(g)} class="btn-action" style=${{
          padding: '8px 14px', borderRadius: r.md, cursor: 'pointer', fontSize: 13, fontWeight: 500,
          border: `1px solid ${newG === g ? ACC : C.bdr}`,
          background: newG === g ? ACC : C.bg3,
          color: newG === g ? '#fff' : C.txt2
        }}>${g}</button>`)}
              </div>
              <div style=${{ display: 'flex', gap: 8 }}>
                <${Btn} onClick=${addC} cx=${{ flex: 1, padding: '11px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Thêm</${Btn}>
                <${Btn} onClick=${() => setShowA(false)} variant="ghost">Huỷ</${Btn}>
              </div>
            </div>`}
      </div>
    </${Wrap}>`;
}

function SessDetail({ session, onClose, canEdit = false, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [eTitle, setETitle] = useState(session.title || '');
  const [eNote, setENote] = useState(session.note || '');
  const [ePhotoFile, setEPhotoFile] = useState(null);      // ảnh mới chọn (File)
  const [ePhotoPreview, setEPhotoPreview] = useState(null); // URL xem trước ảnh mới
  const [eRemovePhoto, setERemovePhoto] = useState(false);  // gỡ ảnh hiện có
  const dur = session.endTime - session.startTime;
  const a = actOf(session.type || 'gym');
  const openEdit = () => { setETitle(session.title || ''); setENote(session.note || ''); setEPhotoFile(null); setEPhotoPreview(null); setERemovePhoto(false); setEditing(true); };
  const pickEditPhoto = e => { const f = e.target.files[0]; if (!f) return; setEPhotoFile(f); setEPhotoPreview(URL.createObjectURL(f)); setERemovePhoto(false); };
  const curPhoto = ePhotoPreview || (eRemovePhoto ? null : session.photoUrl);
  const exs = exsOf(session);
  const isGym = (session.type || 'gym') === 'gym';
  const authorName = session.authorName;
  const authorPhoto = session.authorPhoto;
  const subtitle = [isGym ? (session.detail?.progName || session.progName) : a.label, fD(session.date)].filter(Boolean).join(' · ');
  const STAT_EMOJI = { flame: '🔥', check: '✅', clock: '⏱', route: '📏', bolt: '⚡', star: '⭐', wave: '🌊', gauge: '💨' };
  const cells = isGym
    ? [
      { l: 'Tổng volume', v: `${Math.round(volOf(session))} kg` },
      { l: 'Thời gian', v: durS(dur) },
      { l: 'Số bài tập', v: `${exs.length} bài` },
      { l: 'Tổng set', v: `${session.detail?.totalSets ?? exs.reduce((t, e) => t + e.sets.filter(s => s.done).length, 0)} sets` },
    ]
    : summaryStats(session).map(x => ({ l: x.l || 'Chỉ số', v: `${x.v}${x.u ? ' ' + x.u : ''}`, e: STAT_EMOJI[x.icon] }));
  // Các ô chi tiết còn lại (kiểu bơi, trường phái, độ cao, số ván...) không nằm trong summary.
  const SKIP_DETAIL = new Set(['durationMin', 'distanceKm', 'distanceM', 'paceMinPerKm', 'laps']);
  const d = session.detail || {};
  const detailChips = isGym ? [] : fieldsOf(session.type)
    .filter(f => f.type !== 'pace' && !SKIP_DETAIL.has(f.k) && d[f.k] != null && d[f.k] !== '')
    .map(f => ({ l: f.label, v: `${d[f.k]}${f.unit ? ' ' + f.unit : ''}` }));
  const laps = Array.isArray(d.laps) ? d.laps : [];
  return html`
    <${Wrap} cx=${{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, background: C.bg1 }}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, flexShrink: 0, background: '#ffffff', display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick=${onClose} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}>
          <${Icons.close} size=${20}/>
        </button>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <h2 style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>${a.emoji} ${session.title || a.label}</h2>
          <p style=${{ margin: 0, color: C.txt3, fontSize: 12 }}>${authorName ? `${authorName} · ` : ''}${subtitle}</p>
        </div>
        ${canEdit && !editing && html`
          <button onClick=${openEdit} class="btn-action" title="Sửa bài" style=${{ background: '#f1f5f9', border: 'none', borderRadius: 18, height: 34, padding: '0 13px', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', color: C.txt1, fontSize: 13, fontWeight: 600, flexShrink: 0 }}><${Icons.edit} size=${14}/> Sửa</button>`}
        ${canEdit && !editing && onDelete && html`
          <button onClick=${() => { if (window.confirm('Xoá bài đăng này? Số liệu (điểm, phút, buổi, chuỗi, xếp hạng) sẽ được trừ lại. Không hoàn tác được.')) onDelete(session); }} class="btn-action" title="Xoá bài" style=${{ background: '#fef2f2', border: `1px solid ${C.red}33`, borderRadius: 18, height: 34, padding: '0 13px', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', color: C.red, fontSize: 13, fontWeight: 600, flexShrink: 0 }}><${Icons.trash} size=${14}/> Xoá</button>`}
        ${!editing && !canEdit && authorPhoto && html`<img src=${authorPhoto} style=${{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}/>`}
      </div>
      <div style=${{ flex: 1, overflowY: 'auto', padding: '16px', WebkitOverflowScrolling: 'touch' }}>
        ${editing && html`
          <div style=${{ background: '#ffffff', borderRadius: r.lg, padding: 16, marginBottom: 16, border: `1px solid ${C.bdr}` }}>
            <p style=${{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Tiêu đề</p>
            <input value=${eTitle} onInput=${e => setETitle(e.target.value)} placeholder=${a.label} style=${{ width: '100%', padding: '10px 12px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14, boxSizing: 'border-box', marginBottom: 12, color: C.txt1, background: '#fff' }}/>
            <p style=${{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Ghi chú (nhật ký)</p>
            <textarea value=${eNote} onInput=${e => setENote(e.target.value)} rows=${3} placeholder="Cảm nhận buổi tập, ghi chú riêng..." style=${{ width: '100%', padding: '10px 12px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14, boxSizing: 'border-box', resize: 'vertical', color: C.txt1, background: '#fff', fontFamily: 'inherit' }}/>
            <p style=${{ margin: '12px 0 6px', fontSize: 12, fontWeight: 600, color: C.txt2 }}>Ảnh</p>
            <label style=${{ display: 'block', cursor: 'pointer' }}>
              <input type="file" accept="image/*" style=${{ display: 'none' }} onChange=${pickEditPhoto}/>
              ${curPhoto
        ? html`<div style=${{ position: 'relative', borderRadius: r.md, overflow: 'hidden' }}>
                  <img src=${curPhoto} style=${{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}/>
                  <button onClick=${e => { e.preventDefault(); e.stopPropagation(); setEPhotoFile(null); setEPhotoPreview(null); setERemovePhoto(true); }} title="Gỡ ảnh" style=${{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 28, height: 28, color: '#fff', cursor: 'pointer', fontSize: 16 }}>×</button>
                </div>`
        : html`<div style=${{ border: `1.5px dashed ${C.bdr2}`, borderRadius: r.md, padding: '18px', textAlign: 'center', color: C.txt3 }}>
                  <div style=${{ fontSize: 24, marginBottom: 4 }}>📷</div>
                  <p style=${{ margin: 0, fontSize: 13, fontWeight: 500 }}>${eRemovePhoto ? 'Đã gỡ ảnh — bấm để thêm ảnh mới' : 'Thêm ảnh'}</p>
                </div>`}
            </label>
            <p style=${{ margin: '12px 0 0', fontSize: 11.5, color: C.txt3, lineHeight: 1.5 }}>Sửa tiêu đề, ghi chú & ảnh. Điểm, chuỗi và xếp hạng giữ nguyên như lúc đăng.</p>
            <div style=${{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick=${() => setEditing(false)} class="btn-action" style=${{ flex: 1, padding: '10px', borderRadius: r.md, border: `1px solid ${C.bdr}`, background: '#fff', color: C.txt2, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Huỷ</button>
              <button onClick=${async () => { if (!window.confirm('Lưu thay đổi cho bài này?')) return; await onSave(session.id, { title: eTitle, note: eNote, photoFile: ePhotoFile, removePhoto: eRemovePhoto }); setEditing(false); }} class="btn-action" style=${{ flex: 1, padding: '10px', borderRadius: r.md, border: 'none', background: ACC, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Lưu</button>
            </div>
          </div>`}
        ${!editing && session.photoUrl && html`<img src=${session.photoUrl} style=${{ width: '100%', height: 220, objectFit: 'cover', borderRadius: r.lg, marginBottom: 16, display: 'block' }}/>`}
        ${!editing && session.note && html`
          <div style=${{ background: '#ffffff', borderRadius: r.lg, padding: '14px 16px', marginBottom: 16, border: `1px solid ${C.bdr}`, fontSize: 13, color: C.txt1, lineHeight: 1.5, display: 'flex', gap: 8 }}>
            <span>📝</span><span>${session.note}</span>
          </div>
        `}
        <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          ${cells.map(({ l, v, e }) => html`
            <div key=${l} style=${{ background: '#ffffff', borderRadius: r.md, padding: '14px 16px', border: `1px solid ${C.bdr}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style=${{ fontSize: 20 }}>${e || '💪'}</div>
              <div>
                <p style=${{ margin: '0 0 2px', fontSize: 10, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>${l}</p>
                <p style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: ACC }}>${v}</p>
              </div>
            </div>`)}
        </div>
        ${detailChips.length > 0 && html`
          <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            ${detailChips.map(({ l, v }) => html`
              <div key=${l} style=${{ background: '#ffffff', border: `1px solid ${C.bdr}`, borderRadius: 20, padding: '6px 12px', fontSize: 12.5, color: C.txt2 }}>
                ${l}: <strong style=${{ color: C.txt1 }}>${v}</strong>
              </div>`)}
          </div>`}
        ${laps.length > 0 && html`
          <div style=${{ background: '#ffffff', borderRadius: r.lg, padding: 16, marginBottom: 20, border: `1px solid ${C.bdr}` }}>
            <p style=${{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: ACC }}>Chi tiết chặng</p>
            <div style=${{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              ${laps.map((lp, i) => html`
                <div key=${i} style=${{ display: 'flex', gap: 14, padding: '10px 14px', background: C.bg3, borderRadius: r.md, fontSize: 13, alignItems: 'center', color: C.txt1 }}>
                  <span style=${{ color: C.txt3, fontSize: 11, fontWeight: 500, width: 24 }}>#${lp.n || i + 1}</span>
                  <span style=${{ flex: 1 }}><strong>${lp.dist || '—'}</strong> ${session.type === 'swim' ? 'm' : 'km'}</span>
                  <span style=${{ flex: 1 }}><strong>${lp.time || '—'}</strong></span>
                </div>`)}
            </div>
          </div>`}
        ${exs.map((ex, i) => html`
          <div key=${i} style=${{ background: '#ffffff', borderRadius: r.lg, padding: 16, marginBottom: 14, border: `1px solid ${C.bdr}` }}>
            <p style=${{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: ACC, letterSpacing: '-0.01em' }}>${ex.name}</p>
            <div style=${{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              ${ex.sets.filter(s => s.done).map((set, j) => html`
                <div key=${j} style=${{ display: 'flex', gap: 14, padding: '10px 14px', background: C.bg3, borderRadius: r.md, fontSize: 13, alignItems: 'center', color: C.txt1, border: `1px solid rgba(0,0,0,0.02)` }}>
                  <span style=${{ color: C.txt3, fontSize: 11, fontWeight: 500, width: 16 }}>${j + 1}</span>
                  <span style=${{ flex: 1 }}><strong>${set.weight || '—'}</strong> kg</span>
                  <span style=${{ flex: 1 }}><strong>${set.reps || '—'}</strong> reps</span>
                  ${set.rpe && html`<span style=${{ background: 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: 4, color: C.txt2, fontSize: 11, fontWeight: 400 }}>RPE ${set.rpe}</span>`}
                </div>`)}
            </div>
            ${ex.notes && html`
              <div style=${{ marginTop: 10, paddingTop: 10, borderTop: `1px solid rgba(0,0,0,0.03)`, fontSize: 12, color: C.txt2, fontStyle: 'italic', display: 'flex', gap: 6 }}>
                <span>📝</span>
                <span>${ex.notes}</span>
              </div>
            `}
          </div>`)}
      </div>
    </${Wrap}>`;
}

function BarChart({ items }) {
  const max = Math.max(1, ...items.map(x => x.val));
  return html`
    <div style=${{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginTop: 10 }}>
      ${items.map((x, i) => html`
        <div key=${i} style=${{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style=${{ width: '100%', height: 100, display: 'flex', alignItems: 'flex-end', borderRadius: r.sm, background: C.bg3, overflow: 'hidden' }}>
            <div style=${{ width: '100%', height: `${Math.max(4, (x.val / max) * 100)}%`, background: ACC, borderRadius: `${r.sm} ${r.sm} 0 0`, transition: 'height 0.3s' }}/>
          </div>
          <span style=${{ fontSize: 9, color: C.txt3, fontWeight: 400 }}>${x.label}</span>
        </div>`)}
    </div>`;
}

function DeltaBadge({ cur, prev }) {
  const p = pct(cur, prev);
  const up = p > 0, flat = p === 0;
  return html`
    <span style=${{
      display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
      background: flat ? C.bg3 : (up ? C.greenBg : C.redBg), color: flat ? C.txt3 : (up ? C.green : C.red)
    }}>
      ${flat ? '–' : (up ? '▲' : '▼')} ${Math.abs(p)}%
    </span>`;
}

function SegToggle({ mode, setMode, opts }) {
  return html`
    <div style=${{ display: 'flex', background: C.bg3, borderRadius: r.md, padding: 3, marginBottom: 16, gap: 3 }}>
      ${opts.map(o => html`
        <button key=${o.id} onClick=${() => setMode(o.id)} class="btn-action" style=${{
      flex: 1, padding: '8px 0', borderRadius: r.sm, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
      background: mode === o.id ? '#ffffff' : 'transparent', color: mode === o.id ? ACC : C.txt2,
      boxShadow: mode === o.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
    }}>${o.l}</button>`)}
    </div>`;
}

function ProgressTab({ sessions, profile, weights, onAddWeight, hideWeight, goals, onSaveGoals }) {
  const [view, setView] = useState('overview');   // 'overview' | id môn (gym/run/swim/...)
  const [mode, setMode] = useState('exercise');
  // Mục tiêu tuần (Cục B): số buổi/tuần + số phút/tuần.
  const [goalEdit, setGoalEdit] = useState(false);
  const [gSess, setGSess] = useState(goals?.sessionsPerWeek || '');
  const [gMin, setGMin] = useState(goals?.minutesPerWeek || '');
  useEffect(() => { setGSess(goals?.sessionsPerWeek || ''); setGMin(goals?.minutesPerWeek || ''); }, [goals?.sessionsPerWeek, goals?.minutesPerWeek]);
  const curWeek = currentWeekActivity(sessions);
  const hasGoal = !!(goals?.sessionsPerWeek || goals?.minutesPerWeek);
  const saveGoals = () => {
    const s = Math.max(0, Math.min(21, parseInt(gSess) || 0));
    const m = Math.max(0, Math.min(10000, parseInt(gMin) || 0));
    onSaveGoals && onSaveGoals({ sessionsPerWeek: s, minutesPerWeek: m });
    setGoalEdit(false);
  };

  // ── Tổng quan ĐA MÔN ──
  const breakdown = sportBreakdown(sessions, 90);
  const doneTypes = breakdown.map(b => b.type);
  const weekly = weeklyActive(sessions).slice(-8);
  const wkNow = weekly[weekly.length - 1] || { minutes: 0, points: 0, count: 0 };
  const wkPrev = weekly[weekly.length - 2] || { minutes: 0, points: 0, count: 0 };
  const fmtMMSS = min => { const m = Math.floor(min); const sec = Math.round((min - m) * 60); return `${m}:${String(sec).padStart(2, '0')}`; };

  // ── Drill-down GYM (giữ nguyên logic cũ) ──
  const exIds = trainedExIds(sessions);
  const exMap = Object.fromEntries(EX.map(e => [e.id, e]));
  const recent = [];
  sessions.forEach(s => (s.exs || []).forEach(ex => { if (ex.sets.some(x => x.done) && !recent.includes(ex.exId)) recent.push(ex.exId); }));
  const exOptions = recent.length ? recent : exIds;
  const dayOptions = titleOptions(sessions.filter(s => (s.type || 'gym') === 'gym'));
  const [selExId, setSelExId] = useState(exOptions[0] || null);
  const [selDay, setSelDay] = useState(dayOptions[0] || null);
  const [wKg, setWKg] = useState('');

  useEffect(() => { if (!selExId && exOptions.length) setSelExId(exOptions[0]); }, [exOptions.length]);
  useEffect(() => { if (!selDay && dayOptions.length) setSelDay(dayOptions[0]); }, [dayOptions.length]);

  const weeks = selExId ? weeklyStats(sessions, selExId).slice(-8) : [];
  const thisWk = weeks[weeks.length - 1] || { sets: 0, vol: 0 };
  const lastWk = weeks[weeks.length - 2] || { sets: 0, vol: 0 };
  const hist = selExId ? exHistory(sessions, selExId) : [];
  const bestW = hist.length ? Math.max(...hist.map(s => parseFloat(s.weight) || 0)) : 0;
  const bestE = hist.length ? Math.round(Math.max(...hist.map(e1rm))) : 0;
  const exName = selExId && (exMap[selExId]?.name || sessions.flatMap(s => s.exs || []).find(e => e.exId === selExId)?.name);

  const dayOccs = selDay ? sessionsByTitle(sessions, selDay) : [];
  const dayLast = dayOccs[dayOccs.length - 1];
  const dayPrev = dayOccs[dayOccs.length - 2];
  const daySetsOf = s => s?.exs?.reduce((t, e) => t + e.sets.filter(x => x.done).length, 0) || 0;
  const dayTimeline = [...dayOccs].slice(-12).reverse();

  const sortedW = [...weights].sort((a, b) => (a.at || 0) - (b.at || 0));
  const lastWeight = sortedW[sortedW.length - 1];
  const prevWeight = sortedW[sortedW.length - 2];
  const addW = () => {
    const kg = parseFloat(wKg);
    if (!kg || kg <= 0) return;
    onAddWeight(kg);
    setWKg('');
  };

  if (sessions.length === 0) return html`<div class="fade-in"><${Empty} icon="star" msg="Chưa có dữ liệu" sub="Hoàn thành buổi tập để thấy tiến bộ ở đây"/></div>`;

  // Thẻ cân nặng cơ thể — trung lập, đưa lên phần Tổng quan (không còn nằm sau phân tích gym).
  const weightCard = html`
      <${Label} t="Cân nặng (riêng tư 🔒)" mt=${24}/>
      <${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: lastWeight ? 12 : 0 }}>
          <div>
            <p style=${{ margin: 0, fontSize: 10, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Gần nhất</p>
            <p style=${{ margin: '2px 0 0', fontSize: 20, fontWeight: 600, color: ACC }}>${lastWeight ? `${lastWeight.kg} kg` : 'Chưa có dữ liệu'}</p>
            ${lastWeight && html`<p style=${{ margin: '2px 0 0', fontSize: 11, color: C.txt3 }}>${fDT(lastWeight.at)}${prevWeight ? html` · <${DeltaBadge} cur=${lastWeight.kg} prev=${prevWeight.kg}/>` : ''}</p>`}
          </div>
          <div style=${{ display: 'flex', gap: 8 }}>
            <input type="number" inputMode="decimal" placeholder="kg" value=${wKg} onInput=${e => setWKg(e.target.value)}
              class="workout-input" style=${{ width: 70, padding: '8px 10px', borderRadius: r.md, fontSize: 14, textAlign: 'center' }}
            />
            <${Btn} onClick=${addW}>Lưu</${Btn}>
          </div>
        </div>
        ${sortedW.length > 1 && html`
          <div style=${{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60, marginTop: 14 }}>
            ${(() => {
      const last10 = sortedW.slice(-10); const mx = Math.max(...last10.map(w => w.kg)), mn = Math.min(...last10.map(w => w.kg)); const range = Math.max(1, mx - mn);
      return last10.map((w, i) => html`
                <div key=${i} style=${{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style=${{ width: '100%', height: `${10 + ((w.kg - mn) / range) * 90}%`, background: C.bg3, borderRadius: 2, position: 'relative' }}>
                    <div style=${{ position: 'absolute', bottom: 0, width: '100%', height: '100%', background: `${ACC}55`, borderRadius: 2 }}/>
                  </div>
                </div>`);
    })()}
          </div>
        `}
      </${Card}>`;

  // Thanh tiến độ mục tiêu.
  const bar = (cur, target, color) => {
    const pctv = target > 0 ? Math.min(100, Math.round((cur / target) * 100)) : 0;
    return html`<div style=${{ height: 8, borderRadius: 4, background: C.bg3, overflow: 'hidden' }}><div style=${{ height: '100%', width: `${pctv}%`, background: color, borderRadius: 4, transition: 'width .3s' }}/></div>`;
  };

  // Thẻ Mục tiêu tuần (Cục B) — đặt/sửa số buổi & số phút/tuần + thanh tiến độ.
  const goalCard = html`
      <${Label} t="Mục tiêu tuần này" mt=${4}/>
      <${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
        ${(!hasGoal && !goalEdit) ? html`
          <div style=${{ textAlign: 'center', padding: '6px 0' }}>
            <p style=${{ margin: '0 0 10px', fontSize: 13, color: C.txt2 }}>Đặt mục tiêu để giữ thói quen đều đặn 💪</p>
            <${Btn} onClick=${() => setGoalEdit(true)}>Đặt mục tiêu</${Btn}>
          </div>`
      : goalEdit ? html`
          <div style=${{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <p style=${{ margin: '0 0 5px', fontSize: 11.5, color: C.txt3 }}>Số buổi / tuần</p>
              <input type="number" inputMode="numeric" value=${gSess} onInput=${e => setGSess(e.target.value)} placeholder="VD: 3" class="workout-input" style=${{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: r.md, fontSize: 14 }}/>
            </div>
            <div>
              <p style=${{ margin: '0 0 5px', fontSize: 11.5, color: C.txt3 }}>Số phút / tuần</p>
              <input type="number" inputMode="numeric" value=${gMin} onInput=${e => setGMin(e.target.value)} placeholder="VD: 150" class="workout-input" style=${{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: r.md, fontSize: 14 }}/>
            </div>
            <div style=${{ display: 'flex', gap: 8 }}>
              <button onClick=${() => { setGoalEdit(false); setGSess(goals?.sessionsPerWeek || ''); setGMin(goals?.minutesPerWeek || ''); }} class="btn-action" style=${{ flex: 1, padding: '10px', borderRadius: r.md, border: `1px solid ${C.bdr}`, background: '#fff', color: C.txt2, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Huỷ</button>
              <${Btn} onClick=${saveGoals} cx=${{ flex: 1 }}>Lưu</${Btn}>
            </div>
            <p style=${{ margin: 0, fontSize: 11, color: C.txt3, lineHeight: 1.5 }}>Để 0 nếu không đặt mục tiêu đó. Gợi ý WHO: 150 phút/tuần.</p>
          </div>`
        : html`
          <div style=${{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            ${goals?.sessionsPerWeek > 0 && html`
              <div>
                <div style=${{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                  <span style=${{ color: C.txt2 }}>Buổi tập</span>
                  <strong style=${{ color: C.txt1 }}>${curWeek.count}/${goals.sessionsPerWeek}${curWeek.count >= goals.sessionsPerWeek ? ' ✅' : ''}</strong>
                </div>
                ${bar(curWeek.count, goals.sessionsPerWeek, ACC)}
              </div>`}
            ${goals?.minutesPerWeek > 0 && html`
              <div>
                <div style=${{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                  <span style=${{ color: C.txt2 }}>Phút vận động</span>
                  <strong style=${{ color: C.txt1 }}>${curWeek.minutes}/${goals.minutesPerWeek}${curWeek.minutes >= goals.minutesPerWeek ? ' ✅' : ''}</strong>
                </div>
                ${bar(curWeek.minutes, goals.minutesPerWeek, '#22c55e')}
              </div>`}
            <button onClick=${() => setGoalEdit(true)} class="btn-action" style=${{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: ACC, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', padding: 0 }}>Sửa mục tiêu</button>
          </div>`}
      </${Card}>`;

  // Thẻ Kỷ lục cá nhân cho 1 môn (dùng trong drill-down distance/session; đối kháng → rỗng).
  const prCard = t => {
    const recs = personalRecords(sessions, t, actOf(t).kind);
    if (!recs.length) return '';
    return html`
      <${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
        <p style=${{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: ACC, display: 'flex', alignItems: 'center', gap: 6 }}><${Icons.trophy} size=${16}/> Kỷ lục cá nhân</p>
        <div style=${{ display: 'grid', gridTemplateColumns: `repeat(${recs.length}, 1fr)`, gap: 10 }}>
          ${recs.map(rc => html`<div key=${rc.key} style=${{ textAlign: 'center' }}>
            <p style=${{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>${rc.value}<span style=${{ fontSize: 11, fontWeight: 500, color: C.txt3 }}> ${rc.unit}</span></p>
            <p style=${{ margin: '2px 0 0', fontSize: 10, color: C.txt3 }}>${rc.label}</p>
          </div>`)}
        </div>
      </${Card}>`;
  };

  // Phần TỔNG QUAN chung cho mọi người.
  const maxPts = Math.max(1, ...breakdown.map(b => b.points));
  const overview = html`
      <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        ${[{ l: 'Điểm tuần', v: wkNow.points, icon: Icons.flame }, { l: 'Phút tuần', v: wkNow.minutes, icon: Icons.clock }, { l: 'Buổi tuần', v: wkNow.count, icon: Icons.calendar }].map(t => html`
          <div key=${t.l} style=${{ background: C.bg2, borderRadius: r.md, padding: '12px 8px', textAlign: 'center', border: `1px solid ${C.bdr}` }}>
            <div style=${{ display: 'flex', justifyContent: 'center', color: ACC, marginBottom: 4 }}><${t.icon} size=${18}/></div>
            <p style=${{ margin: 0, fontSize: 9, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>${t.l}</p>
            <p style=${{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: '#0f172a' }}>${t.v}</p>
          </div>`)}
      </div>

      ${goalCard}

      ${breakdown.length > 0 && html`
        <${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
          <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style=${{ margin: 0, fontSize: 14, fontWeight: 600, color: ACC }}>Phân bổ theo môn</p>
            <span style=${{ fontSize: 11, color: C.txt3 }}>90 ngày</span>
          </div>
          ${breakdown.map(b => { const a = actOf(b.type); return html`
            <div key=${b.type} style=${{ marginBottom: 10 }}>
              <div style=${{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 4 }}>
                <span>${a.emoji}</span>
                <span style=${{ flex: 1, color: C.txt1 }}>${a.label}</span>
                <span style=${{ color: C.txt3, fontSize: 11.5 }}>${b.count} buổi · ${b.minutes} phút</span>
                <strong style=${{ color: ACC, minWidth: 46, textAlign: 'right' }}>${b.points} đ</strong>
              </div>
              <div style=${{ height: 6, borderRadius: 3, background: C.bg3, overflow: 'hidden' }}>
                <div style=${{ height: '100%', width: `${(b.points / maxPts) * 100}%`, background: a.color, borderRadius: 3 }}/>
              </div>
            </div>`; })}
        </${Card}>`}

      ${weekly.length > 1 && html`
        <${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
          <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <p style=${{ margin: 0, fontSize: 14, fontWeight: 600, color: ACC }}>Điểm theo tuần</p>
            <${DeltaBadge} cur=${wkNow.points} prev=${wkPrev.points}/>
          </div>
          <${BarChart} items=${weekly.map(w => ({ label: fWeek(w.wk).split('–')[0], val: w.points }))}/>
        </${Card}>`}

      ${!hideWeight && weightCard}`;

  // Drill-down môn distance (chạy/đi/đạp/bơi/leo).
  const distanceBlock = t => {
    const a = actOf(t);
    const dp = distanceProgress(sessions, t);
    const isSwim = t === 'swim', isCycle = t === 'cycle';
    const primL = isCycle ? 'Tốc độ tốt nhất' : 'Pace tốt nhất';
    const primV = isSwim ? (dp.bestPace100 ? `${fmtMMSS(dp.bestPace100)} /100m` : '—')
      : isCycle ? (dp.bestSpeed ? `${dp.bestSpeed} km/h` : '—')
        : (dp.bestPaceKm ? `${fmtMMSS(dp.bestPaceKm)} /km` : '—');
    const longV = isSwim ? (dp.longestM ? `${dp.longestM} m` : '—') : (dp.longestKm ? `${Math.round(dp.longestKm * 10) / 10} km` : '—');
    const cells = [{ l: primL, v: primV }, { l: 'Dài nhất', v: longV }, { l: 'Số buổi', v: `${dp.count}` }];
    return html`
      <${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
        <p style=${{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: ACC }}>${a.emoji} ${a.label}</p>
        <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          ${cells.map(c => html`<div key=${c.l}>
            <p style=${{ margin: 0, fontSize: 10, color: C.txt3, textTransform: 'sentence-case' }}>${c.l}</p>
            <p style=${{ margin: '2px 0 0', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>${c.v}</p>
          </div>`)}
        </div>
      </${Card}>
      ${prCard(t)}
      ${dp.weeks.length > 1
      ? html`<${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
            <${Label} t=${`Quãng đường theo tuần (${isSwim ? 'm' : 'km'})`}/>
            <${BarChart} items=${dp.weeks.map(w => ({ label: fWeek(w.wk).split('–')[0], val: isSwim ? w.meters : Math.round(w.km * 10) / 10 }))}/>
          </${Card}>`
      : html`<${Empty} icon=${a.iconKey} msg="Cần thêm buổi để thấy xu hướng"/>`}`;
  };

  // Drill-down môn theo buổi (yoga/bóng đá/…).
  const sessionBlock = t => {
    const a = actOf(t);
    const list = sessions.filter(s => (s.type || 'gym') === t);
    const wk = weeklyActive(list).slice(-8);
    const totalMin = list.reduce((acc, s) => acc + (s.activeMinutes || s.durationMin || 0), 0);
    const totalPts = list.reduce((acc, s) => acc + (s.points || 0), 0);
    const cells = [{ l: 'Số buổi', v: `${list.length}` }, { l: 'Tổng phút', v: `${Math.round(totalMin)}` }, { l: 'Tổng điểm', v: `${Math.round(totalPts)}` }];
    return html`
      <${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
        <p style=${{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: ACC }}>${a.emoji} ${a.label}</p>
        <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          ${cells.map(c => html`<div key=${c.l}>
            <p style=${{ margin: 0, fontSize: 10, color: C.txt3, textTransform: 'sentence-case' }}>${c.l}</p>
            <p style=${{ margin: '2px 0 0', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>${c.v}</p>
          </div>`)}
        </div>
      </${Card}>
      ${prCard(t)}
      ${wk.length > 1
      ? html`<${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
            <${Label} t="Điểm theo tuần"/>
            <${BarChart} items=${wk.map(w => ({ label: fWeek(w.wk).split('–')[0], val: w.points }))}/>
          </${Card}>`
      : html`<${Empty} icon=${a.iconKey} msg="Cần thêm buổi để thấy xu hướng"/>`}`;
  };

  return html`
    <div class="fade-in">
      <div style=${{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16, WebkitOverflowScrolling: 'touch' }}>
        ${[{ id: 'overview', emoji: '📊', label: 'Tổng quan' }, ...doneTypes.map(t => ({ id: t, emoji: actOf(t).emoji, label: actOf(t).label }))].map(o => html`
          <button key=${o.id} onClick=${() => setView(o.id)} class="btn-action" style=${{ flexShrink: 0, padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 500, border: `1px solid ${view === o.id ? ACC : C.bdr}`, background: view === o.id ? 'var(--accent-glow)' : '#fff', color: view === o.id ? ACC : C.txt2, whiteSpace: 'nowrap' }}>${o.emoji} ${o.label}</button>`)}
      </div>

      ${view === 'overview' ? overview
      : view === 'gym' ? html`
          <${SegToggle} mode=${mode} setMode=${setMode} opts=${[{ id: 'exercise', l: 'Theo bài tập' }, { id: 'day', l: 'Theo buổi tập' }]}/>

          ${mode === 'exercise' ? html`
            ${exOptions.length === 0
            ? html`<${Empty} icon="gym" msg="Chưa có dữ liệu bài tập"/>`
            : html`
                <select value=${selExId} onChange=${e => setSelExId(e.target.value)}
                  class="workout-input" style=${{ width: '100%', padding: '12px 14px', borderRadius: r.md, fontSize: 14, fontWeight: 400, color: C.txt1, marginBottom: 16 }}>
                  ${exOptions.map(id => html`<option key=${id} value=${id}>${exMap[id]?.name || id}</option>`)}
                </select>

                <${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
                  <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <p style=${{ margin: 0, fontSize: 14, fontWeight: 600, color: ACC }}>${exName}</p>
                    <${DeltaBadge} cur=${thisWk.vol} prev=${lastWk.vol}/>
                  </div>
                  <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 6 }}>
                    <div>
                      <p style=${{ margin: 0, fontSize: 10, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Tuần này</p>
                      <p style=${{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: '#0f172a' }}>${thisWk.sets} sets · ${Math.round(thisWk.vol)} kg</p>
                    </div>
                    <div>
                      <p style=${{ margin: 0, fontSize: 10, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Tuần trước</p>
                      <p style=${{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: C.txt2 }}>${lastWk.sets} sets · ${Math.round(lastWk.vol)} kg</p>
                    </div>
                  </div>
                  ${weeks.length > 1 && html`<${BarChart} items=${weeks.map(w => ({ label: fWeek(w.wk).split('–')[0], val: w.vol }))}/>`}
                </${Card}>

                <${Card} cx=${{ border: `1px solid ${C.bdr}`, display: 'flex', gap: 10 }}>
                  <div style=${{ flex: 1, textAlign: 'center' }}>
                    <div style=${{ display: 'flex', justifyContent: 'center', color: '#eab308', marginBottom: 4 }}><${Icons.trophy} size=${20}/></div>
                    <p style=${{ margin: 0, fontSize: 10, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>PR Tạ nặng nhất</p>
                    <p style=${{ margin: '2px 0 0', fontSize: 18, fontWeight: 600, color: '#0f172a' }}>${bestW || '—'} kg</p>
                  </div>
                  <div style=${{ width: 1, background: C.bdr }}/>
                  <div style=${{ flex: 1, textAlign: 'center' }}>
                    <div style=${{ display: 'flex', justifyContent: 'center', color: ACC, marginBottom: 4 }}><${Icons.flame} size=${20}/></div>
                    <p style=${{ margin: 0, fontSize: 10, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Est. 1RM</p>
                    <p style=${{ margin: '2px 0 0', fontSize: 18, fontWeight: 600, color: '#0f172a' }}>${bestE || '—'} kg</p>
                  </div>
                </${Card}>
              `}
          `: html`
            ${dayOptions.length === 0
            ? html`<${Empty} icon="calendar" msg="Chưa có dữ liệu buổi tập"/>`
            : html`
                <select value=${selDay} onChange=${e => setSelDay(e.target.value)}
                  class="workout-input" style=${{ width: '100%', padding: '12px 14px', borderRadius: r.md, fontSize: 14, fontWeight: 400, color: C.txt1, marginBottom: 16 }}>
                  ${dayOptions.map(t => html`<option key=${t} value=${t}>${t}</option>`)}
                </select>

                <${Card} cx=${{ border: `1px solid ${C.bdr}` }}>
                  <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <p style=${{ margin: 0, fontSize: 14, fontWeight: 600, color: ACC }}>${selDay}</p>
                    ${dayPrev && html`<${DeltaBadge} cur=${dayLast.totalVol || 0} prev=${dayPrev.totalVol || 0}/>`}
                  </div>
                  <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 6 }}>
                    <div>
                      <p style=${{ margin: 0, fontSize: 10, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Lần gần nhất</p>
                      <p style=${{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: '#0f172a' }}>${daySetsOf(dayLast)} sets · ${Math.round(dayLast?.totalVol || 0)} kg</p>
                    </div>
                    <div>
                      <p style=${{ margin: 0, fontSize: 10, color: C.txt3, fontWeight: 400, textTransform: 'sentence-case' }}>Lần trước đó</p>
                      <p style=${{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: C.txt2 }}>${dayPrev ? `${daySetsOf(dayPrev)} sets · ${Math.round(dayPrev.totalVol || 0)} kg` : '—'}</p>
                    </div>
                  </div>
                  ${dayOccs.length > 1 && html`<${BarChart} items=${dayOccs.slice(-8).map(s => ({ label: fDM(s.date), val: s.totalVol || 0 }))}/>`}
                </${Card}>

                <${Label} t="Lịch sử các lần tập" mt=${20}/>
                ${dayTimeline.map((s, i) => {
              const prevS = dayOccs[dayOccs.length - 1 - i - 1];
              return html`
                    <${Card} key=${s.id} cx=${{ border: `1px solid ${C.bdr}`, padding: '12px 16px', marginBottom: 8 }}>
                      <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style=${{ margin: 0, fontSize: 13, fontWeight: 500, color: '#0f172a' }}>${fD(s.date)}</p>
                          <p style=${{ margin: '2px 0 0', fontSize: 11, color: C.txt3 }}>${daySetsOf(s)} sets</p>
                        </div>
                        <div style=${{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <p style=${{ margin: 0, fontSize: 15, fontWeight: 600, color: ACC }}>${Math.round(s.totalVol || 0)} kg</p>
                          ${prevS && html`<${DeltaBadge} cur=${s.totalVol || 0} prev=${prevS.totalVol || 0}/>`}
                        </div>
                      </div>
                    </${Card}>`;
            })}
              `}
          `}
        `
      : actOf(view).kind === 'distance' ? distanceBlock(view)
      : sessionBlock(view)}
    </div>`;
}

function CelebrationModal({ onClose, workout, profile, newPRs, newBadges, streak }) {
  const pieces = Array.from({ length: 80 }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 2;
    const size = 6 + Math.random() * 8;
    const colors = ['#0084ff', '#db2777', '#10b981', '#f97316', '#eab308', '#ec4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return html`
      <div key=${i} class="confetti-piece" style=${{
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        width: `${size}px`,
        height: `${size * 1.5}px`,
        background: color,
        transform: `rotate(${Math.random() * 360}deg)`
      }} />
    `;
  });

  return html`
    <div class="fade-in" style=${{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(255, 255, 255, 0.98)', zIndex: 10000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 30
    }}>
      <div class="confetti-container">${pieces}</div>
      
      <div class="scale-in" style=${{ textAlign: 'center', maxWidth: 360, width: '100%' }}>
        <div style=${{ fontSize: 64, marginBottom: 20, animation: 'checkmarkPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>${(newBadges && newBadges.length) ? '🎉' : actOf(workout.type || 'gym').emoji}</div>
        <h2 style=${{ fontSize: 28, fontWeight: 600, margin: '0 0 10px', color: '#0f172a', letterSpacing: '-0.02em' }}>Tuyệt Vời!</h2>
        <p style=${{ fontSize: 16, color: C.txt2, margin: '0 0 28px' }}>Chúc mừng ${profile.name} ${headline(workout)} 🔥</p>

        <div style=${{ background: '#ffffff', borderRadius: r.lg, padding: 20, marginBottom: 24, border: `1px solid ${C.bdr}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            ${summaryStats(workout).slice(0, 2).map((st, i) => html`
              <div key=${i}>
                <p style=${{ margin: 0, fontSize: 11, color: C.txt3, textTransform: 'uppercase' }}>${st.u || 'Chỉ số'}</p>
                <p style=${{ margin: 0, fontSize: 20, fontWeight: 600, color: '#0f172a' }}>${st.v}${st.u ? '' : ''}</p>
              </div>`)}
          </div>
          ${streak && streak.current > 0 && html`
            <div style=${{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style=${{ fontSize: 20 }}>🔥</span>
              <span style=${{ fontSize: 15, fontWeight: 600, color: ACC }}>Chuỗi ${streak.current} ngày${streak.current === streak.longest && streak.current > 1 ? ' — kỷ lục mới!' : ''}</span>
            </div>`}
        </div>

        ${newBadges && newBadges.length > 0 && html`
          <div style=${{ background: 'var(--accent-glow)', border: `1px solid ${ACC}`, borderRadius: r.lg, padding: 16, marginBottom: 24 }}>
            <p style=${{ margin: '0 0 12px', fontSize: 12.5, fontWeight: 600, color: ACC }}>🏅 Mở khoá huy hiệu mới!</p>
            <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              ${newBadges.map(id => BADGES[id] && html`
                <div key=${id} style=${{ textAlign: 'center', width: 84 }}>
                  <div style=${{ fontSize: 34 }}>${BADGES[id].icon}</div>
                  <p style=${{ margin: '4px 0 0', fontSize: 11, fontWeight: 500, color: C.txt1, lineHeight: 1.3 }}>${BADGES[id].label}</p>
                </div>`)}
            </div>
          </div>`}

        ${newPRs && newPRs.length > 0 && html`
          <div style=${{ background: '#fffbeb', border: `1px solid #fde68a`, borderRadius: r.lg, padding: 16, marginBottom: 32, textAlign: 'left' }}>
            <p style=${{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#854f0b', textTransform: 'sentence-case', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>🏆 PR mới!</p>
            ${newPRs.map(p => html`
              <p key=${p.exId} style=${{ margin: '0 0 4px', fontSize: 13, color: '#854f0b' }}>
                <strong>${p.name}</strong> — ${p.weight} kg ${p.isNewE ? `(est. 1RM ${p.e1rm} kg)` : ''}
              </p>`)}
          </div>
        `}

        <button onClick=${onClose} class="btn-action pulse-glow" style=${{
      width: '100%', padding: '14px', borderRadius: r.md, border: 'none',
      background: ACC, color: '#fff', fontSize: 16, fontWeight: 500,
      cursor: 'pointer', boxShadow: `0 4px 15px var(--accent-glow)`
    }}>
          Đồng ý
        </button>
      </div>
    </div>
  `;
}

function GymPair() {
  const [authUser, setAuthUser] = useState(undefined); // undefined=đang tải, null=chưa đăng nhập
  const [userDoc, setUserDoc] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // quyền quản trị (cộng thêm, không đổi vai trò user)
  const [adminMode, setAdminMode] = useState(false); // chế độ kiểm duyệt bật/tắt (chỉ admin thấy nút)
  const [invites, setInvites] = useState([]); // lời mời vào nhóm đang chờ (popup noti khi reload)
  const pid = authUser ? authUser.uid : null;
  const [exList, setExList] = useState(EX);
  const [progs, setProgs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [feedKey, setFeedKey] = useState(0); // bump để feed nạp lại sau khi sửa/xoá bài
  const [active, setActive] = useState(null);
  const [showWorkout, setShowWorkout] = useState(true);
  const [tab, setTab] = useState('home');
  const [pg, setPg] = useState(null);
  const [pgCtx, setPgCtx] = useState(null);
  const [ready, setReady] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [finishedWorkout, setFinishedWorkout] = useState(null);
  const [newPRs, setNewPRs] = useState([]);
  const [newBadges, setNewBadges] = useState([]);
  const [celebStreak, setCelebStreak] = useState(null);
  const [cloudError, setCloudError] = useState(null);
  const [myReactions, setMyReactions] = useState(new Set());

  useEffect(() => {
    setCloudErrorHandler(setCloudError);
    if (fbInitError) setCloudError(fbInitError);
    return () => { setCloudErrorHandler(null); };
  }, []);
  const [prs, setPrs] = useState({});
  const [weights, setWeights] = useState([]);

  // Theo dõi trạng thái đăng nhập Google; bootstrap users/{uid}.
  useEffect(() => {
    consumeRedirect().catch(() => { });
    const unsub = watchAuth(async (u) => {
      if (u) {
        try {
          const { doc } = await ensureUserDoc(u);
          setUserDoc(doc);
        } catch (e) { reportCloudError('Không tải được hồ sơ', e); }
        isAdminUser(u.uid).then((v) => { setIsAdmin(v); if (!v) setAdminMode(false); }).catch(() => { setIsAdmin(false); setAdminMode(false); });
        setAuthUser(u);
      } else {
        setUserDoc(null);
        setIsAdmin(false);
        setAdminMode(false);
        setAuthUser(null);
      }
    });
    return unsub;
  }, []);

  // Đổi màu chủ đạo theo hồ sơ người dùng.
  useEffect(() => {
    const accent = userDoc?.accent;
    if (accent) {
      document.documentElement.style.setProperty('--accent', accent);
      document.documentElement.style.setProperty('--accent-glow', accent + '1A');
    }
  }, [userDoc?.accent]);

  // Nạp danh sách bài đã thả tim (để feed hiển thị trạng thái).
  useEffect(() => {
    if (!pid) return;
    loadMyReactions(pid).then(setMyReactions);
  }, [pid]);

  // Lời mời vào nhóm đang chờ → popup noti (nạp lúc vào app/reload; không cần thời gian thực).
  useEffect(() => {
    if (!pid) { setInvites([]); return; }
    myInvites(pid).then(setInvites).catch(() => { });
  }, [pid]);

  useEffect(() => {
    if (!pid) {
      setReady(false);
      return;
    }
    (async () => {
      const [c, p, s, a, pr, w] = await Promise.all([db.get(`c:${pid}`), db.get(`p:${pid}`), db.get(`s:${pid}`), db.get(`a:${pid}`), db.get(`pr:${pid}`), db.get(`wt:${pid}`)]);
      setExList(c ? [...EX, ...c] : EX);
      setProgs(p || []);
      setSessions(s || []);
      setActive(a || null);
      setPrs(pr || {});
      setWeights(w || []);
      setReady(true);
      // Cân nặng riêng tư: ưu tiên bản trên cloud (đồng bộ nhiều máy), fallback local.
      const cloudW = await getPrivateWeights(pid);
      if (cloudW) { setWeights(cloudW); db.set(`wt:${pid}`, cloudW); }
    })();
  }, [pid]);

  const saveP = p => { setProgs(p); db.set(`p:${pid}`, p); };
  const saveS = s => { setSessions(s); db.set(`s:${pid}`, s); };
  const saveA = a => { setActive(a); db.set(`a:${pid}`, a); };
  const saveC = list => { setExList(list); db.set(`c:${pid}`, list.filter(e => !EX.find(b => b.id === e.id))); };
  const savePrs = pr => { setPrs(pr); db.set(`pr:${pid}`, pr); };
  const addWeight = kg => {
    // Cân nặng riêng tư: lưu local + users/{uid}/private/weights (không ai khác đọc được).
    const entry = { at: Date.now(), kg };
    const w = [...weights, entry];
    setWeights(w); db.set(`wt:${pid}`, w);
    savePrivateWeights(pid, w);
  };
  const clearHistory = () => {
    sessions.forEach(s => repoDeleteSession(pid, s.id));
    saveS([]);
  };

  // --- Cài đặt ---
  const saveProfileFields = async (fields) => {
    await updateUserDoc(pid, fields);
    setUserDoc(d => ({ ...d, ...fields }));
  };
  const toggleLeaderboard = async (participate) => {
    await updateUserDoc(pid, { prefs: { ...(userDoc.prefs || {}), optOutLeaderboard: !participate } });
    setUserDoc(d => ({ ...d, prefs: { ...d.prefs, optOutLeaderboard: !participate } }));
    if (!participate) await removeMyEntries(pid); // tắt -> gỡ khỏi bảng kỳ này
  };
  const toggleHideWeight = async (hide) => {
    await updateUserDoc(pid, { prefs: { ...(userDoc.prefs || {}), hideWeight: hide } });
    setUserDoc(d => ({ ...d, prefs: { ...d.prefs, hideWeight: hide } }));
  };
  // Mục tiêu tuần (Cục B): lưu users/{uid}.goals (không đổi schema sessions/cách tính điểm).
  const saveGoals = async (goals) => {
    setUserDoc(d => ({ ...d, goals }));
    try { await updateUserDoc(pid, { goals }); }
    catch (e) { reportCloudError('Lưu mục tiêu thất bại', e); }
  };
  const recomputeStreak = async () => {
    const st = computeStreak(sessions.map(s => s.date).filter(Boolean));
    const next = { current: st.current, longest: st.longest, lastDate: st.lastDate };
    await updateUserDoc(pid, { streak: next });
    setUserDoc(d => ({ ...d, streak: next }));
  };
  const deleteAccount = async () => {
    try {
      [`c:${pid}`, `p:${pid}`, `s:${pid}`, `a:${pid}`, `pr:${pid}`, `wt:${pid}`].forEach(k => { try { localStorage.removeItem(k); } catch { } });
      await deleteMyAccount(pid);
    } catch (e) { setCloudError(e.message || 'Không xoá được tài khoản'); }
  };
  const openProfile = (uidToView) => { setPgCtx({ uid: uidToView, isSelf: uidToView === pid }); setPg('user-profile'); };
  // F0 — sửa nhật ký (title/note + ảnh) của buổi tập CHÍNH MÌNH. Chỉ chữ/ảnh mô tả;
  // điểm/streak/xếp hạng giữ nguyên như lúc đăng (xem updateSessionContent).
  const editSession = async (id, patch) => {
    const cur = sessions.find(s => s.id === id);
    const full = { title: (patch.title || '').trim(), note: (patch.note || '').trim() };
    if (patch.removePhoto) {
      full.photoUrl = null;
      if (cur?.photoUrl) deleteSessionPhoto(pid, id);
    } else if (patch.photoFile) {
      try { const blob = await compressImage(patch.photoFile); full.photoUrl = await uploadSessionPhoto(blob, pid, id); }
      catch (e) { reportCloudError('Upload ảnh thất bại', e); full.photoUrl = cur?.photoUrl || null; }
    } else {
      full.photoUrl = cur?.photoUrl || null;
    }
    saveS(sessions.map(s => s.id === id ? { ...s, ...full } : s));
    setPgCtx(c => (c && c.id === id) ? { ...c, ...full } : c);
    setFeedKey(k => k + 1);
    try { await updateSessionContent(pid, id, full); }
    catch (e) { reportCloudError('Sửa buổi tập thất bại', e); }
  };

  // Xoá bài đã đăng KÈM hoàn nguyên số liệu (điểm/phút/buổi/volume + streak + leaderboard kỳ đó).
  // Dùng cho trường hợp đăng nhầm / test. Không hoàn nguyên PR & huy hiệu.
  const deletePost = async (session) => {
    const remaining = sessions.filter(s => s.id !== session.id);
    saveS(remaining);
    if (session.photoUrl) deleteSessionPhoto(pid, session.id);
    setPg(null); setPgCtx(null);
    setFeedKey(k => k + 1);
    const volKg = session.type === 'gym' ? Math.round(session.detail?.totalVol || session.totalVol || 0) : 0;
    setUserDoc(d => ({
      ...d,
      totals: {
        sessions: Math.max(0, (d.totals?.sessions || 0) - 1),
        minutes: Math.max(0, (d.totals?.minutes || 0) - (session.activeMinutes || 0)),
        points: Math.max(0, (d.totals?.points || 0) - (session.points || 0)),
        volumeKg: Math.max(0, (d.totals?.volumeKg || 0) - volKg),
      },
    }));
    try {
      const st = await deleteSessionWithStats(session, meAuthor(), remaining);
      setUserDoc(d => ({ ...d, streak: { current: st.current, longest: st.longest, lastDate: st.lastDate } }));
    } catch (e) { reportCloudError('Xoá bài thất bại', e); }
  };
  // KIỂM DUYỆT (admin): gỡ bài vi phạm của người khác. Chỉ xoá doc + ảnh (best-effort),
  // KHÔNG hoàn nguyên số liệu tác giả (xem adminDeleteSession). Chỉ chạy khi đang bật chế độ quản trị.
  const adminDeletePost = async (post) => {
    if (!(isAdmin && adminMode)) return;
    try {
      await adminDeleteSession(post);
      if (post.photoUrl) deleteSessionPhoto(post.authorUid, post.id).catch(() => { });
      setFeedKey(k => k + 1);
      if (pg === 'sess-detail') { setPg(null); setPgCtx(null); }
    } catch (e) { reportCloudError('Xoá bài (quản trị) thất bại', e); }
  };
  // Lời mời vào nhóm: chấp nhận (tự vào nhóm) hoặc bỏ qua.
  const acceptClubInvite = async (inv) => {
    setInvites(list => list.filter(i => i.clubId !== inv.clubId));
    try { await acceptInvite(inv.clubId, meAuthor()); } catch (e) { reportCloudError('Vào nhóm thất bại', e); }
  };
  const dismissClubInvite = async (inv) => {
    setInvites(list => list.filter(i => i.clubId !== inv.clubId));
    try { await dismissInvite(inv.clubId, pid); } catch { }
  };
  // Mở bài hướng dẫn với nút quay lại tuỳ ngữ cảnh (danh sách / buổi tập / form log).
  const openGuide = (guide, back) => { if (!guide) return; setPgCtx({ guide, back }); setPg('guide-detail'); };

  // Tác giả cho các buổi tập (khớp firestore.rules + repo).
  const meAuthor = () => ({
    uid: pid, name: userDoc.name, photoURL: userDoc.photoURL || null,
    dept: userDoc.dept || '', streak: userDoc.streak, prefs: userDoc.prefs,
  });
  // Bổ sung field top-level tương thích để các component gym cũ đọc được (local dùng, cloud sạch).
  const toLocal = (sess) => sess.type === 'gym'
    ? { ...sess, exs: exsOf(sess), totalVol: volOf(sess), progName: sess.detail?.progName, dayName: sess.detail?.dayName }
    : { ...sess, progName: ACT[sess.type]?.label || '', totalVol: 0 };

  // Trao huy hiệu (nếu có) sau khi lưu buổi tập. Trả danh sách id vừa mở khoá.
  const awardBadges = (session, st) => {
    const owned = userDoc.badges || [];
    const triedTypes = [...sessions.map(s => s.type || 'gym'), session.type];
    const totalSessions = (userDoc.totals?.sessions || 0) + 1;
    const earned = evaluateBadges({ owned, streakCurrent: st.current, session, triedTypes, totalSessions });
    if (earned.length) {
      const next = [...owned, ...earned];
      updateUserDoc(pid, { badges: next });
      setUserDoc(d => ({ ...d, badges: next }));
    }
    return earned;
  };

  const startWorkout = (prog, di) => {
    const day = prog.days[di];
    saveA({
      id: uid(), progId: prog.id, progName: prog.name, dayName: day.name,
      startTime: Date.now(),
      exs: day.exercises.map(pe => ({
        id: uid(), exId: pe.exId, name: pe.name,
        sets: Array.from({ length: pe.sets || 3 }, () => ({ id: uid(), weight: '', reps: '', rpe: '', done: false })),
        notes: '',
      })),
    });
    setPg(null); setTab('home'); setShowWorkout(true);
  };

  const finishWorkout = async (meta = {}) => {
    if (!active || !userDoc) return;
    const date = meta.date || new Date(active.startTime).toISOString().split('T')[0];
    let photoUrl = meta.photoUrl || null;
    if (meta.photoFile) {
      try { const blob = await compressImage(meta.photoFile); photoUrl = await uploadSessionPhoto(blob, pid, active.id); }
      catch (e) { reportCloudError('Upload ảnh thất bại', e); }
    }
    const stLocal = advanceStreak(userDoc.streak, date);
    const sess = buildGymSession(active, { ...meta, photoUrl, date }, meAuthor(), stLocal.current);
    const local = toLocal(sess);
    const updatedSessions = [local, ...sessions].slice(0, 300);
    const { updated, newly } = computePRs(sess, prs);
    savePrs(updated);
    const earned = awardBadges(sess, stLocal);
    saveS(updatedSessions);
    setNewPRs(newly);
    setNewBadges(earned);
    setCelebStreak(liveStreak(stLocal));
    setFinishedWorkout(local);
    setShowCelebration(true);
    db.set(`a:${pid}`, null);
    setActive(null);
    setPg(null);
    try {
      const st = await saveSession(sess, meAuthor(), dayContext(sessions, date));
      setUserDoc(d => ({ ...d, streak: st }));
    } catch (e) { reportCloudError('Đồng bộ buổi tập thất bại', e); }
  };

  // Ghi buổi tập môn khác (không phải gym).
  const logActivity = async (input) => {
    if (!userDoc) return;
    const date = new Date().toISOString().split('T')[0];
    const stLocal = advanceStreak(userDoc.streak, date);
    const sess = buildActivitySession(input, meAuthor(), stLocal.current);
    if (input.photoFile) {
      try { const blob = await compressImage(input.photoFile); sess.photoUrl = await uploadSessionPhoto(blob, pid, sess.id); }
      catch (e) { reportCloudError('Upload ảnh thất bại', e); }
    }
    const local = toLocal(sess);
    const earned = awardBadges(sess, stLocal);
    saveS([local, ...sessions].slice(0, 300));
    setNewPRs([]);
    setNewBadges(earned);
    setCelebStreak(liveStreak(stLocal));
    setFinishedWorkout(local);
    setShowCelebration(true);
    setPg(null); setPgCtx(null);
    try {
      const st = await saveSession(sess, meAuthor(), dayContext(sessions, date));
      setUserDoc(d => ({ ...d, streak: st }));
    } catch (e) { reportCloudError('Đồng bộ buổi tập thất bại', e); }
  };

  const discardWorkout = () => { db.set(`a:${pid}`, null); setActive(null); };
  const goPickEx = cb => { setPg('pick-ex'); setPgCtx({ cb }); };
  const profile = userDoc ? { id: pid, name: userDoc.name, c: userDoc.accent, img: userDoc.photoURL } : null;

  const onboard = async (fields) => {
    await saveOnboarding(pid, {
      name: fields.name, dept: fields.dept, center: fields.center,
      prefs: { ...(userDoc.prefs || {}), sports: fields.sports },
    });
    setUserDoc(d => ({ ...d, name: fields.name, dept: fields.dept, center: fields.center, prefs: { ...(d.prefs || {}), sports: fields.sports, onboarded: true } }));
  };

  if (authUser === undefined) return html`<${Wrap} cx=${{ alignItems: 'center', justifyContent: 'center', color: C.txt2, fontSize: 14 }}>Đang tải...</${Wrap}>`;
  if (!authUser) return html`<${SignIn}/>`;
  if (userDoc && !userDoc.prefs?.onboarded) return html`<${Onboarding} initialName=${userDoc.name} onDone=${onboard}/>`;
  if (!ready) return html`<${Wrap} cx=${{ alignItems: 'center', justifyContent: 'center', color: C.txt2, fontSize: 14 }}>Đang tải...</${Wrap}>`;

  if (showCelebration && finishedWorkout) {
    return html`<${CelebrationModal} workout=${finishedWorkout} profile=${profile} newPRs=${newPRs} newBadges=${newBadges} streak=${celebStreak} onClose=${() => { setShowCelebration(false); setFinishedWorkout(null); setNewPRs([]); setNewBadges([]); setCelebStreak(null); setTab('feed'); }}/>`;
  }

  if (active && showWorkout) {
    if (pg === 'pick-ex') return html`<${PickEx} exList=${exList} onPick=${e => { pgCtx && pgCtx.cb(e); setPg(null); setPgCtx(null); }} onClose=${() => { setPg(null); setPgCtx(null); }} onAddEx=${ex => { saveC([...exList, ex]); }}/>`;
    if (pg === 'save-workout') return html`<${SaveWorkout} workout=${active} defaultVisibility=${userDoc.prefs?.defaultVisibility || 'company'} onBack=${() => setPg(null)} onDiscard=${() => { if (window.confirm('Huỷ buổi tập?')) { discardWorkout(); setPg(null); } }} onSave=${finishWorkout}/>`;
    if (pg === 'guide-detail') return html`<${GuideDetail} guide=${pgCtx.guide} onBack=${pgCtx.back || (() => setPg(null))}/>`;
    return html`<${ActiveWorkout} workout=${active} sessions=${sessions} onChange=${saveA} onFinish=${() => setPg('save-workout')} onDiscard=${discardWorkout} onPickEx=${goPickEx} onMinimize=${() => setShowWorkout(false)} onGuide=${exId => openGuide(guideForExercise(exId), () => { setPgCtx(null); setPg(null); })}/>`;
  }
  if (pg === 'create-prog') return html`<${CreateProg} exList=${exList} editProg=${pgCtx} onSave=${p => { saveP(pgCtx ? progs.map(x => x.id === p.id ? p : x) : [...progs, p]); setPg(null); setPgCtx(null); }} onClose=${() => { setPg(null); setPgCtx(null); }}/>`;
  if (pg === 'sess-detail') return html`<${SessDetail} session=${pgCtx} canEdit=${pgCtx.authorUid === pid} onSave=${editSession} onDelete=${deletePost} onClose=${() => { setPg(null); setPgCtx(null); }}/>`;
  if (pg === 'progs') return html`<${ProgsTab} progs=${progs} onNew=${() => { setPgCtx(null); setPg('create-prog'); }} onEdit=${p => { setPgCtx(p); setPg('create-prog'); }} onDel=${id => saveP(progs.filter(p => p.id !== id))} onStart=${startWorkout} onBack=${() => setPg(null)}/>`;
  if (pg === 'pick-activity') return html`<${PickActivity} recentTypes=${(userDoc.prefs?.sports) || []} onClose=${() => setPg(null)} onGym=${() => setPg('progs')} onActivity=${type => { setPgCtx({ type }); setPg('log-activity'); }}/>`;
  if (pg === 'log-activity') {
    const t = pgCtx.type;
    const sportGuide = guidesForSport(t)[0] || null;
    return html`<${LogActivity} type=${t} defaultVisibility=${userDoc.prefs?.defaultVisibility || 'company'} onBack=${() => { setPg('pick-activity'); setPgCtx(null); }} onSave=${logActivity} hasGuide=${!!sportGuide} onOpenGuide=${() => openGuide(sportGuide, () => { setPgCtx({ type: t }); setPg('log-activity'); })}/>`;
  }
  if (pg === 'comments') return html`<${CommentsSheet} post=${pgCtx} me=${meAuthor()} canModerate=${isAdmin && adminMode} onClose=${() => { setPg(null); setPgCtx(null); }}/>`;

  const openSess = s => { setPg('sess-detail'); setPgCtx(s); };
  const openComments = p => { setPg('comments'); setPgCtx(p); };

  if (pg === 'settings') return html`<${Settings} me=${userDoc}
        onBack=${() => setPg(null)}
        onSaveProfile=${saveProfileFields}
        onToggleLeaderboard=${toggleLeaderboard}
        onToggleHideWeight=${toggleHideWeight}
        onRecomputeStreak=${recomputeStreak}
        isAdmin=${isAdmin}
        adminMode=${adminMode}
        onToggleAdminMode=${setAdminMode}
        onSignOut=${() => signOutUser()}
        onDeleteAccount=${deleteAccount}/>`;
  if (pg === 'user-profile') return html`<${ProfileScreen} uid=${pgCtx.uid} isSelf=${pgCtx.isSelf} onBack=${() => { setPg(null); setPgCtx(null); }} onView=${openSess}/>`;
  if (pg === 'guides') return html`<${GuidesScreen} guides=${richGuides()} onBack=${() => setPg(null)} onOpen=${g => openGuide(g, () => setPg('guides'))}/>`;
  if (pg === 'guide-detail') return html`<${GuideDetail} guide=${pgCtx.guide} onBack=${pgCtx.back || (() => setPg(null))}/>`;
  if (pg === 'clubs') return html`<${ClubsScreen} me=${meAuthor()} onBack=${() => setPg(null)} onOpenClub=${cid => { setPgCtx({ clubId: cid }); setPg('club-detail'); }}/>`;
  if (pg === 'club-detail') return html`<${ClubDetail} clubId=${pgCtx.clubId} me=${meAuthor()} mySessions=${sessions} myReactions=${myReactions} isAdmin=${isAdmin} onBack=${() => setPg('clubs')} onOpenProfile=${openProfile} onOpenComments=${openComments} onDeleted=${() => setPg('clubs')}/>`;
  if (pg === 'goals') return html`<${GoalsScreen} me=${meAuthor()} mySessions=${sessions} isAdmin=${isAdmin} onBack=${() => setPg(null)}/>`;

  return html`
    <${Wrap}>
      ${invites.length > 0 && html`
        <div style=${{ position: 'absolute', inset: 0, zIndex: 300, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div class="scale-in" style=${{ width: '100%', maxWidth: 360, background: '#fff', borderRadius: r.lg, padding: 20, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
            <div style=${{ textAlign: 'center', marginBottom: 14 }}>
              <div style=${{ fontSize: 40, marginBottom: 6 }}>📨</div>
              <h3 style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: C.txt1 }}>Bạn có lời mời vào nhóm</h3>
            </div>
            ${invites.map(inv => { const a = ACT[inv.clubSport] || {}; return html`
              <div key=${inv.clubId} style=${{ border: `1px solid ${C.bdr}`, borderRadius: r.md, padding: '12px 14px', marginBottom: 10 }}>
                <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.txt1 }}>${a.emoji || '👥'} ${inv.clubName}</p>
                <p style=${{ margin: '2px 0 10px', fontSize: 12, color: C.txt3 }}>${inv.fromName ? `${inv.fromName} mời bạn` : 'Bạn được mời'}${a.label ? ` · ${a.label}` : ''}</p>
                <div style=${{ display: 'flex', gap: 8 }}>
                  <button onClick=${() => dismissClubInvite(inv)} class="btn-action" style=${{ flex: 1, padding: '9px', borderRadius: r.md, border: `1px solid ${C.bdr}`, background: '#fff', color: C.txt2, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Bỏ qua</button>
                  <button onClick=${() => acceptClubInvite(inv)} class="btn-action" style=${{ flex: 1, padding: '9px', borderRadius: r.md, border: 'none', background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Tham gia</button>
                </div>
              </div>`; })}
          </div>
        </div>`}
      ${cloudError && html`
        <div style=${{ background: '#fef2f2', borderBottom: `1px solid #fecaca`, padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12, color: '#991b1b', flexShrink: 0 }}>
          <span style=${{ flex: 1, lineHeight: 1.4, wordBreak: 'break-word' }}>⚠️ ${cloudError}</span>
          <button onClick=${() => setCloudError(null)} style=${{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>×</button>
        </div>
      `}
      ${isAdmin && adminMode && html`
        <div style=${{ background: '#7c3aed', color: '#fff', padding: '9px 16px', display: 'flex', gap: 10, alignItems: 'center', fontSize: 12.5, fontWeight: 500, flexShrink: 0 }}>
          <span style=${{ flex: 1 }}>🛡 Chế độ quản trị đang bật — bạn có thể xoá bài & bình luận của mọi người.</span>
          <button onClick=${() => setAdminMode(false)} class="btn-action" style=${{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 14, padding: '4px 12px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Thoát</button>
        </div>
      `}
      <div style=${{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 20, position: 'relative' }}>
        ${tab === 'home' && html`<${HomeTab} profile=${{ ...profile, photoURL: profile.img }} progs=${progs} sessions=${sessions} streak=${liveStreak(userDoc.streak)} onStart=${startWorkout} onView=${openSess} onSwitch=${() => signOutUser()} onManagePrograms=${() => setPg('progs')} weeklyGoal=${userDoc.goals?.sessionsPerWeek || 3} points=${sessions.reduce((t, s) => ((new Date() - new Date(s.date)) / 86400000 <= 7 ? t + (s.points || 0) : t), 0)}/>`}
        ${tab === 'feed' && html`<${FeedTab} me=${meAuthor()} myReactions=${myReactions} onOpenComments=${openComments} onOpenProfile=${openProfile} onManage=${openSess} moderating=${isAdmin && adminMode} onAdminDelete=${adminDeletePost} refreshKey=${feedKey}/>`}
        ${tab === 'rank' && html`<${LeaderboardTab} me=${meAuthor()} onOpenProfile=${openProfile}/>`}
        ${tab === 'me' && html`
          <div class="fade-in">
            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 16px 0' }}>
              <button onClick=${() => openProfile(pid)} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                ${profile.img
        ? html`<img src=${profile.img} style=${{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${profile.c}` }}/>`
        : html`<div style=${{ width: 40, height: 40, borderRadius: '50%', background: profile.c + '22', color: profile.c, border: `2px solid ${profile.c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>${(profile.name || '?').charAt(0).toUpperCase()}</div>`}
                <div style=${{ textAlign: 'left' }}>
                  <p style=${{ margin: 0, fontSize: 16, fontWeight: 600, color: C.txt1 }}>${profile.name}</p>
                  <p style=${{ margin: 0, fontSize: 12, color: ACC }}>Xem hồ sơ ›</p>
                </div>
              </button>
              <button onClick=${() => setPg('settings')} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2, fontSize: 18 }}>⚙️</button>
            </div>
            <div style=${{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick=${() => setPg('clubs')} class="btn-action card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.lg, padding: '14px 16px' }}>
                <span style=${{ fontSize: 26, lineHeight: 1 }}>👥</span>
                <div style=${{ flex: 1 }}>
                  <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.txt1 }}>Câu lạc bộ</p>
                  <p style=${{ margin: '2px 0 0', fontSize: 12, color: C.txt2 }}>Nhóm theo môn — kết nối đồng nghiệp cùng đam mê</p>
                </div>
                <span style=${{ color: C.txt3, fontSize: 18 }}>›</span>
              </button>
              <button onClick=${() => setPg('goals')} class="btn-action card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.lg, padding: '14px 16px' }}>
                <span style=${{ fontSize: 26, lineHeight: 1 }}>🎯</span>
                <div style=${{ flex: 1 }}>
                  <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.txt1 }}>Mục tiêu chung</p>
                  <p style=${{ margin: '2px 0 0', fontSize: 12, color: C.txt2 }}>Cả công ty cùng góp để về đích chung</p>
                </div>
                <span style=${{ color: C.txt3, fontSize: 18 }}>›</span>
              </button>
              <button onClick=${() => setPg('guides')} class="btn-action card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.lg, padding: '14px 16px' }}>
                <span style=${{ fontSize: 26, lineHeight: 1 }}>📖</span>
                <div style=${{ flex: 1 }}>
                  <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.txt1 }}>Hướng dẫn tập luyện</p>
                  <p style=${{ margin: '2px 0 0', fontSize: 12, color: C.txt2 }}>Kiến thức nhập môn cho từng bộ môn & bài tập</p>
                </div>
                <span style=${{ color: C.txt3, fontSize: 18 }}>›</span>
              </button>
            </div>
            <${CalendarTab} sessions=${sessions} onView=${openSess} onClearHistory=${clearHistory}/>
            <${ProgressTab} sessions=${sessions} profile=${profile} weights=${weights} onAddWeight=${addWeight} hideWeight=${!!userDoc.prefs?.hideWeight} goals=${userDoc.goals} onSaveGoals=${saveGoals}/>
          </div>`}
      </div>

      ${!active && html`
        <button onClick=${() => { setPgCtx(null); setPg('pick-activity'); }} class="btn-action" style=${{
        position: 'absolute', bottom: 78, right: 18, zIndex: 50,
        width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: ACC, color: '#fff', fontSize: 30, fontWeight: 300, lineHeight: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 20px var(--accent-glow), 0 2px 6px rgba(0,0,0,0.15)',
      }}>＋</button>`}

      ${active && !showWorkout && html`<${ResumeBar} workout=${active} onResume=${() => setShowWorkout(true)}/>`}
      <${TabBar} tab=${tab} onTab=${setTab}/>
    </${Wrap}>`;
}

export { GymPair };
