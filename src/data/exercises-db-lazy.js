import { useState, useEffect } from 'preact/hooks';

// Nạp exercises-db (~132KB, thư viện ảnh bài tập) LẦN ĐẦU khi cần — không tải lúc mở app.
// Consumer đọc qua useEXDB() (null tới khi nạp xong → fallback), tự nạp nền + re-render khi sẵn sàng.
let _db = null;
let _loading = null;
const subs = new Set();

export function ensureEXDB() {
  if (_db) return Promise.resolve(_db);
  if (!_loading) _loading = import('./exercises-db.js')
    .then((m) => { _db = m.EXDB; subs.forEach((fn) => fn(_db)); return _db; })
    .catch((e) => { _loading = null; throw e; });
  return _loading;
}

export function useEXDB() {
  const [db, setDb] = useState(_db);
  useEffect(() => {
    if (_db) { setDb(_db); return; }
    const fn = (d) => setDb(d);
    subs.add(fn);
    ensureEXDB().catch(() => {});
    return () => subs.delete(fn);
  }, []);
  return db;
}
