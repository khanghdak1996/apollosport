import { collection, query, where, orderBy, limit, getDocs, doc, deleteDoc } from 'fb/firestore';
import { db, reportCloudError } from '../firebase.js';
import { weekId, monthId } from '../domain/period.js';
import { dayStr } from '../domain/streak.js';

export const periodId = (scope, date = dayStr(new Date())) =>
  scope === 'month' ? monthId(date) : weekId(date);

// Top N theo điểm. dept != null -> lọc theo phòng ban (bảng phòng ban).
export async function topEntries(pid, { dept = null, n = 10 } = {}) {
  try {
    const parts = [collection(db, 'leaderboard', pid, 'entries')];
    if (dept) parts.push(where('dept', '==', dept));
    parts.push(orderBy('points', 'desc'), limit(n));
    const snap = await getDocs(query(...parts));
    return snap.docs.map((d, i) => ({ rank: i + 1, ...d.data() }));
  } catch (e) {
    reportCloudError('Không tải được bảng xếp hạng', e);
    return [];
  }
}

// Gỡ mình khỏi bảng xếp hạng kỳ hiện tại (khi tắt tham gia). Best-effort tuần + tháng.
export async function removeMyEntries(uid, date = dayStr(new Date())) {
  for (const pid of [weekId(date), monthId(date)]) {
    try { await deleteDoc(doc(db, 'leaderboard', pid, 'entries', uid)); }
    catch (e) { reportCloudError('Gỡ khỏi bảng xếp hạng thất bại', e); }
  }
}

// Toàn bộ entries của kỳ (để tính hạng của mình khi ngoài top). Dùng khi số người còn nhỏ.
export async function allEntries(pid, { dept = null } = {}) {
  try {
    const parts = [collection(db, 'leaderboard', pid, 'entries')];
    if (dept) parts.push(where('dept', '==', dept));
    parts.push(orderBy('points', 'desc'), limit(500));
    const snap = await getDocs(query(...parts));
    return snap.docs.map((d, i) => ({ rank: i + 1, ...d.data() }));
  } catch (e) {
    reportCloudError('Không tải được bảng xếp hạng', e);
    return [];
  }
}
