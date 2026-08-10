import { useState, useEffect } from 'preact/hooks';

// Nạp domain/guides.js (kéo theo exercises-db + instructions-vi — cluster nặng) KHI CẦN, không
// gói vào initial load. Dùng cho hướng dẫn bài tập (guideForExercise/guidesForSport/richGuides).
let _mod = null;
let _loading = null;
const subs = new Set();

export function ensureGuides() {
  if (_mod) return Promise.resolve(_mod);
  if (!_loading) _loading = import('./guides.js')
    .then((m) => { _mod = m; subs.forEach((fn) => fn(m)); return m; })
    .catch((e) => { _loading = null; throw e; });
  return _loading;
}

// Component luôn cần guides (vd ActiveWorkout): nạp nền ngay khi mount + re-render khi sẵn sàng.
export function useGuides() {
  const [m, setM] = useState(_mod);
  useEffect(() => {
    if (_mod) { setM(_mod); return; }
    const fn = (mm) => setM(mm);
    subs.add(fn);
    ensureGuides().catch(() => {});
    return () => subs.delete(fn);
  }, []);
  return m;
}

// Chỉ nạp KHI active=true (vd khi vào route 'guides'/'log-activity') — tránh nạp lúc mở app.
export function useGuidesWhen(active) {
  const [m, setM] = useState(_mod);
  useEffect(() => {
    if (!active) return;
    if (_mod) { setM(_mod); return; }
    let alive = true;
    ensureGuides().then((mm) => { if (alive) setM(mm); }).catch(() => {});
    return () => { alive = false; };
  }, [active]);
  return m;
}
