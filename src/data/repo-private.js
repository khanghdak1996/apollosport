import { doc, getDoc, setDoc } from 'fb/firestore';
import { db, reportCloudError } from '../firebase.js';

// Cân nặng là dữ liệu tuyệt mật -> users/{uid}/private/weights (rules chỉ chủ đọc/ghi).
// Lưu 1 doc chứa mảng entries [{ at, kg }] cho đơn giản.
export async function getPrivateWeights(uid) {
  try {
    const s = await getDoc(doc(db, 'users', uid, 'private', 'weights'));
    return s.exists() ? (s.data().entries || []) : null;
  } catch (e) { reportCloudError('Không tải được cân nặng', e); return null; }
}

export async function savePrivateWeights(uid, entries) {
  try { await setDoc(doc(db, 'users', uid, 'private', 'weights'), { entries }, { merge: true }); }
  catch (e) { reportCloudError('Đồng bộ cân nặng thất bại', e); }
}
