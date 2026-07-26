import { p2 } from './format.js';

    // Lấy danh sách bài tập của một session gym, chịu được cả schema mới (detail.exs) lẫn cũ (exs).
    export const exsOf = s => (s && s.detail && s.detail.exs) || (s && s.exs) || [];
    export const gymSessions = list => list.filter(s => (s.type ? s.type === 'gym' : true));
    // Volume kg của một session (gym), chịu được cả 2 schema.
    export const volOf = s => (s && s.detail && s.detail.totalVol != null) ? s.detail.totalVol : (s && s.totalVol) || 0;

    export const sVol = s => (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0);
    export const eVol = e => e.sets.filter(s => s.done).reduce((t, s) => t + sVol(s), 0);
    export const tVol = exs => exs.reduce((t, e) => t + eVol(e), 0);

    export const e1rm = s => { const w = parseFloat(s.weight) || 0, rp = parseInt(s.reps) || 0; return rp <= 0 ? 0 : w * (1 + rp / 30); };
    export const startOfWeek = dateStr => {
      const d = new Date(dateStr + 'T00:00:00');
      const day = (d.getDay() + 6) % 7;
      d.setDate(d.getDate() - day);
      return d.toISOString().split('T')[0];
    };
    export const fWeek = wk => {
      const start = new Date(wk + 'T00:00:00');
      const end = new Date(start); end.setDate(end.getDate() + 6);
      const fmt = x => `${p2(x.getDate())}/${p2(x.getMonth() + 1)}`;
      return `${fmt(start)}–${fmt(end)}`;
    };
    export const pct = (cur, prev) => {
      if (!prev) return cur > 0 ? 100 : 0;
      return Math.round(((cur - prev) / prev) * 100);
    };
    export const weeklyStats = (sessions, exId) => {
      const map = {};
      sessions.forEach(s => {
        exsOf(s).forEach(ex => {
          if (ex.exId !== exId) return;
          const done = ex.sets.filter(x => x.done);
          if (!done.length) return;
          const wk = startOfWeek(s.date);
          if (!map[wk]) map[wk] = { wk, sets: 0, vol: 0 };
          map[wk].sets += done.length;
          map[wk].vol += done.reduce((t, x) => t + sVol(x), 0);
        });
      });
      return Object.values(map).sort((a, b) => a.wk < b.wk ? -1 : 1);
    };
    export const exHistory = (sessions, exId) => {
      const list = [];
      sessions.forEach(s => {
        exsOf(s).forEach(ex => {
          if (ex.exId !== exId) return;
          ex.sets.filter(x => x.done).forEach(x => list.push(x));
        });
      });
      return list;
    };
    export const lastExSets = (sessions, exId) => {
      for (const s of sessions) {
        const ex = exsOf(s).find(e => e.exId === exId);
        if (ex) {
          const done = ex.sets.filter(x => x.done);
          if (done.length) return done;
        }
      }
      return null;
    };
    export const trainedExIds = sessions => {
      const ids = new Set();
      sessions.forEach(s => exsOf(s).forEach(ex => { if (ex.sets.some(x => x.done)) ids.add(ex.exId); }));
      return [...ids];
    };
    export const titleOptions = sessions => {
      const seen = new Set(), list = [];
      [...sessions].sort((a, b) => (b.loggedAt || b.startTime || 0) - (a.loggedAt || a.startTime || 0)).forEach(s => {
        const t = s.title || s.dayName;
        if (t && !seen.has(t)) { seen.add(t); list.push(t); }
      });
      return list;
    };
    export const sessionsByTitle = (sessions, title) => sessions.filter(s => (s.title || s.dayName) === title).sort((a, b) => (a.loggedAt || a.startTime || 0) - (b.loggedAt || b.startTime || 0));
    // ── Tổng hợp ĐA MÔN (mọi type) ─────────────────────────────────────
    // Đọc field đã finalize ở cấp trên (session.js), không phụ thuộc detail gym.
    const sMin = s => Math.round(s.activeMinutes || s.durationMin || 0);
    const sPts = s => Math.round(s.points || 0);
    const sTime = s => s.loggedAt || s.startTime || (s.date ? new Date(s.date + 'T00:00:00').getTime() : 0);

    // Thống kê theo tuần gộp mọi môn: [{wk, minutes, points, count}].
    export const weeklyActive = sessions => {
      const map = {};
      sessions.forEach(s => {
        if (!s.date) return;
        const wk = startOfWeek(s.date);
        if (!map[wk]) map[wk] = { wk, minutes: 0, points: 0, count: 0 };
        map[wk].minutes += sMin(s);
        map[wk].points += sPts(s);
        map[wk].count += 1;
      });
      return Object.values(map).sort((a, b) => a.wk < b.wk ? -1 : 1);
    };

    // Phân bổ theo môn trong `sinceDays` ngày gần nhất: [{type, count, minutes, points}] (giảm dần theo điểm).
    export const sportBreakdown = (sessions, sinceDays = 30) => {
      const cutoff = Date.now() - sinceDays * 86400000;
      const map = {};
      sessions.forEach(s => {
        if (sTime(s) < cutoff) return;
        const type = s.type || 'gym';
        if (!map[type]) map[type] = { type, count: 0, minutes: 0, points: 0 };
        map[type].count += 1;
        map[type].minutes += sMin(s);
        map[type].points += sPts(s);
      });
      return Object.values(map).sort((a, b) => b.points - a.points);
    };

    // Tiến độ môn distance (chạy/đi/đạp/bơi/leo): xu hướng quãng đường/tuần + kỷ lục pace/tốc độ.
    // Trả cả km và mét để UI tự chọn đơn vị theo môn (bơi → mét + /100m).
    export const distanceProgress = (sessions, type) => {
      const list = sessions.filter(s => s.type === type);
      const weekMap = {};
      let bestPaceKm = Infinity, bestPace100 = Infinity, bestSpeed = 0, longestKm = 0, longestM = 0;
      list.forEach(s => {
        const d = s.detail || {};
        const meters = parseFloat(d.distanceM) || (parseFloat(d.distanceKm) || 0) * 1000;
        const km = meters / 1000;
        const min = s.durationMin || 0;
        if (s.date && meters > 0) {
          const wk = startOfWeek(s.date);
          if (!weekMap[wk]) weekMap[wk] = { wk, km: 0, meters: 0, minutes: 0 };
          weekMap[wk].km += km;
          weekMap[wk].meters += meters;
          weekMap[wk].minutes += min;
        }
        if (km > longestKm) longestKm = km;
        if (meters > longestM) longestM = meters;
        if (meters > 0 && min > 0) {
          const paceKm = min / km;
          if (paceKm < bestPaceKm) bestPaceKm = paceKm;
          const pace100 = min / (meters / 100);
          if (pace100 < bestPace100) bestPace100 = pace100;
          const speed = km / (min / 60);
          if (speed > bestSpeed) bestSpeed = speed;
        }
      });
      const weeks = Object.values(weekMap).sort((a, b) => a.wk < b.wk ? -1 : 1);
      return {
        weeks, count: list.length,
        bestPaceKm: isFinite(bestPaceKm) ? bestPaceKm : 0,
        bestPace100: isFinite(bestPace100) ? bestPace100 : 0,
        bestSpeed, longestKm, longestM,
      };
    };

    // Môn đối kháng: KHÔNG có khái niệm PR (nguyên tắc app không ghi thắng/thua).
    export const COMBAT_SPORTS = new Set(['football', 'basketball', 'badminton', 'tennis', 'pickleball']);

    // Kỷ lục cá nhân (SO VỚI CHÍNH MÌNH, không GPS) cho 1 môn ngoài gym. Trả [{key,label,value,unit}].
    //  distance (chạy/đi/đạp/bơi/leo): xa nhất 1 buổi · tổng tuần cao nhất · buổi dài nhất (phút).
    //  session không đối kháng (yoga/khác): buổi dài nhất (phút) · tổng phút tuần cao nhất.
    //  đối kháng / gym: [] (gym có PR tạ riêng ở computePRs).
    export const personalRecords = (sessions, type, kind) => {
      if (kind === 'strength' || COMBAT_SPORTS.has(type)) return [];
      const list = sessions.filter(s => (s.type || 'gym') === type);
      if (!list.length) return [];
      const isSwim = type === 'swim';
      let longestMin = 0, longestMeters = 0;
      const weekMeters = {}, weekMin = {};
      list.forEach(s => {
        const d = s.detail || {};
        const meters = parseFloat(d.distanceM) || (parseFloat(d.distanceKm) || 0) * 1000;
        const min = s.durationMin || 0;
        if (min > longestMin) longestMin = min;
        if (meters > longestMeters) longestMeters = meters;
        if (s.date) {
          const wk = startOfWeek(s.date);
          weekMeters[wk] = (weekMeters[wk] || 0) + meters;
          weekMin[wk] = (weekMin[wk] || 0) + Math.round(s.activeMinutes || s.durationMin || 0);
        }
      });
      const bestWeekMeters = Object.values(weekMeters).reduce((a, b) => Math.max(a, b), 0);
      const bestWeekMin = Object.values(weekMin).reduce((a, b) => Math.max(a, b), 0);
      const dist = m => isSwim ? { v: Math.round(m), u: 'm' } : { v: Math.round(m / 100) / 10, u: 'km' };
      const recs = [];
      if (kind === 'distance') {
        if (longestMeters > 0) { const x = dist(longestMeters); recs.push({ key: 'longDist', label: 'Xa nhất 1 buổi', value: x.v, unit: x.u }); }
        if (bestWeekMeters > 0) { const x = dist(bestWeekMeters); recs.push({ key: 'weekDist', label: 'Tổng tuần cao nhất', value: x.v, unit: x.u }); }
        if (longestMin > 0) recs.push({ key: 'longMin', label: 'Buổi dài nhất', value: longestMin, unit: 'phút' });
      } else {
        if (longestMin > 0) recs.push({ key: 'longMin', label: 'Buổi dài nhất', value: longestMin, unit: 'phút' });
        if (bestWeekMin > 0) recs.push({ key: 'weekMin', label: 'Tổng phút tuần cao nhất', value: bestWeekMin, unit: 'phút' });
      }
      return recs;
    };

    // Hoạt động của TUẦN HIỆN TẠI: {count, minutes, points} — để so với mục tiêu tuần.
    export const currentWeekActivity = sessions => {
      const wkNow = startOfWeek(new Date().toISOString().split('T')[0]);
      let count = 0, minutes = 0, points = 0;
      sessions.forEach(s => {
        if (!s.date || startOfWeek(s.date) !== wkNow) return;
        count += 1; minutes += sMin(s); points += sPts(s);
      });
      return { count, minutes: Math.round(minutes), points: Math.round(points) };
    };

    // Đóng góp của MỘT người vào 1 mục tiêu chung, tính từ buổi tập của họ trong khoảng ngày.
    // metric: sessions (số buổi) | minutes (phút vận động) | distanceKm (km, cần sport).
    // startDate/endDate dạng 'YYYY-MM-DD' (so sánh chuỗi hợp lệ).
    export const goalContribution = (sessions, goal) => {
      const { metric, sport, startDate, endDate } = goal;
      let v = 0;
      sessions.forEach(s => {
        if (!s.date || s.date < startDate || s.date > endDate) return;
        if (sport && (s.type || 'gym') !== sport) return;
        if (metric === 'sessions') v += 1;
        else if (metric === 'minutes') v += Math.round(s.activeMinutes || s.durationMin || 0);
        else if (metric === 'distanceKm') {
          const d = s.detail || {};
          const meters = parseFloat(d.distanceM) || (parseFloat(d.distanceKm) || 0) * 1000;
          v += meters / 1000;
        }
      });
      return metric === 'distanceKm' ? Math.round(v * 10) / 10 : v;
    };

    export const computePRs = (workout, prevPRs) => {
      const updated = { ...prevPRs };
      const newly = [];
      exsOf(workout).forEach(ex => {
        const done = ex.sets.filter(s => s.done);
        if (!done.length) return;
        const bestW = Math.max(...done.map(s => parseFloat(s.weight) || 0));
        const bestE = Math.max(...done.map(e1rm));
        const old = updated[ex.exId];
        const isNewW = !old || bestW > old.weight;
        const isNewE = !old || bestE > old.e1rm;
        if (isNewW || isNewE) {
          updated[ex.exId] = {
            weight: Math.max(bestW, old?.weight || 0),
            e1rm: Math.max(bestE, old?.e1rm || 0),
            date: workout.date || new Date().toISOString().split('T')[0],
          };
          newly.push({ exId: ex.exId, name: ex.name, weight: bestW, e1rm: Math.round(bestE), isNewW, isNewE });
        }
      });
      return { updated, newly };
    };
