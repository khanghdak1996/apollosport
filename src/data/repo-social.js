import {
  doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, collection, query, orderBy, limit,
  onSnapshot, addDoc, increment, serverTimestamp,
} from 'fb/firestore';
import { db, reportCloudError } from '../firebase.js';

// Thả / gỡ reaction. Ghi vào sessions/{sid}/reactions/{uid} + mirror users/{uid}/reacted/{sid}
// + tăng/giảm reactionCount (±1) trên post. Không dùng transaction (đủ tốt cho app nội bộ).
export async function toggleReaction(sidFull, me, kind = 'heart') {
  const rref = doc(db, 'sessions', sidFull, 'reactions', me.uid);
  const mirror = doc(db, 'users', me.uid, 'reacted', sidFull);
  const postRef = doc(db, 'sessions', sidFull);
  try {
    const existing = await getDoc(rref);
    if (existing.exists()) {
      await deleteDoc(rref);
      await deleteDoc(mirror).catch(() => {});
      await setDoc(postRef, { reactionCount: increment(-1) }, { merge: true });
      return false;
    } else {
      await setDoc(rref, { uid: me.uid, kind, at: serverTimestamp() });
      await setDoc(mirror, { at: serverTimestamp(), kind }, { merge: true });
      await setDoc(postRef, { reactionCount: increment(1) }, { merge: true });
      return true;
    }
  } catch (e) {
    reportCloudError('Thả tim thất bại', e);
    return null;
  }
}

// Nạp tập id bài mình đã thả tim (1 lần lúc mở app) để feed hiển thị trạng thái.
export async function loadMyReactions(uid) {
  try {
    const snap = await getDocs(query(collection(db, 'users', uid, 'reacted')));
    return new Set(snap.docs.map(d => d.id));
  } catch (e) { return new Set(); }
}

// ---- bình luận ----
export function listenComments(sidFull, cb) {
  return onSnapshot(
    query(collection(db, 'sessions', sidFull, 'comments'), orderBy('createdAt', 'asc'), limit(100)),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    e => reportCloudError('Không tải được bình luận', e)
  );
}

export async function addComment(sidFull, me, text) {
  const t = (text || '').trim();
  if (!t) return;
  try {
    await addDoc(collection(db, 'sessions', sidFull, 'comments'), {
      uid: me.uid, name: me.name, photoURL: me.photoURL || null,
      text: t.slice(0, 500), createdAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'sessions', sidFull), { commentCount: increment(1) }, { merge: true });
  } catch (e) { reportCloudError('Gửi bình luận thất bại', e); }
}

// Sửa bình luận của CHÍNH MÌNH (chỉ text). Rules chỉ cho chủ bình luận đổi text, giữ uid/createdAt.
export async function editComment(sidFull, commentId, text) {
  const t = (text || '').trim();
  if (!t) return;
  try {
    await updateDoc(doc(db, 'sessions', sidFull, 'comments', commentId), {
      text: t.slice(0, 500), editedAt: serverTimestamp(),
    });
  } catch (e) { reportCloudError('Sửa bình luận thất bại', e); }
}

export async function deleteComment(sidFull, commentId) {
  try {
    await deleteDoc(doc(db, 'sessions', sidFull, 'comments', commentId));
    await setDoc(doc(db, 'sessions', sidFull), { commentCount: increment(-1) }, { merge: true });
  } catch (e) { reportCloudError('Xoá bình luận thất bại', e); }
}
