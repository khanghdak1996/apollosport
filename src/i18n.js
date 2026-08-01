// src/i18n.js — lớp đa ngôn ngữ (VI/EN) cho GIAO DIỆN, app no-build.
// Cách dùng:
//   import { t } from '../i18n.js';   →  t('common.save')  |  t('leaderboard.rank', { n: 3 })
//   Đổi ngôn ngữ: setLang('en')  (nút ở Settings/SignIn).
//   Component gốc GymPair gọi useLang() một lần → đổi ngôn ngữ re-render toàn cây.
// Catalog chuỗi nằm ở ./strings.js. Thiếu khóa ở bản đang chọn → fallback VI → chính key
// (không bao giờ vỡ UI).
import { useState, useEffect } from 'preact/hooks';
import { STR } from './strings.js';

export const SUPPORTED = ['vi', 'en'];
const STORE_KEY = 'lang';

let LANG = (() => {
  try { const v = localStorage.getItem(STORE_KEY); return SUPPORTED.includes(v) ? v : 'vi'; }
  catch { return 'vi'; }
})();

const subs = new Set();
let persister = null; // GymPair đăng ký để lưu prefs.lang lên Firestore (tuỳ chọn)

export const getLang = () => LANG;

// GymPair gọi để lưu lựa chọn lên hồ sơ khi người dùng CHỦ ĐỘNG đổi.
export const onLangPersist = fn => { persister = fn; };

// persist=false khi khởi tạo từ userDoc.prefs.lang (tránh ghi ngược lại cloud).
export function setLang(l, persist = true) {
  if (!SUPPORTED.includes(l) || l === LANG) return;
  LANG = l;
  try { localStorage.setItem(STORE_KEY, l); } catch { }
  if (persist && persister) { try { persister(l); } catch { } }
  subs.forEach(fn => { try { fn(l); } catch { } });
}

// Hook đăng ký re-render khi đổi ngôn ngữ. Chỉ cần gọi ở component gốc.
export function useLang() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(x => x + 1);
    subs.add(fn);
    return () => subs.delete(fn);
  }, []);
  return LANG;
}

// Thay {name} bằng params.name.
const interp = (s, p) => (p ? String(s).replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : m)) : s);

export function t(key, params) {
  const table = STR[LANG] || STR.vi;
  const s = (key in table) ? table[key] : (key in STR.vi ? STR.vi[key] : key);
  return interp(s, params);
}
