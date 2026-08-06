import {
  doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, collection, query, orderBy, limit,
  onSnapshot, addDoc, increment, serverTimestamp, writeBatch, getCountFromServer,
} from 'fb/firestore';
import { db, reportCloudError } from '../firebase.js';
import { notifyServer } from './push.js';

// Thả / gỡ reaction trong MỘT writeBatch (nguyên tử): doc reaction + mirror + reactionCount ±1.
// Batch là điều kiện để rules ràng reactionCount vào reaction thật (existsAfter) — nhờ vậy
// không ai chỉnh được đếm tim của post người khác nếu không thực sự thả/gỡ tim của chính mình.
export async function toggleReaction(sidFull, me, kind = 'heart') {
  const rref = doc(db, 'sessions', sidFull, 'reactions', me.uid);
  const mirror = doc(db, 'users', me.uid, 'reacted', sidFull);
  const postRef = doc(db, 'sessions', sidFull);
  try {
    const existing = await getDoc(rref);
    const b = writeBatch(db);
    if (existing.exists()) {
      b.delete(rref);
      b.delete(mirror);
      b.set(postRef, { reactionCount: increment(-1) }, { merge: true });
      await b.commit();
      return false;
    } else {
      b.set(rref, { uid: me.uid, kind, at: serverTimestamp() });
      b.set(mirror, { at: serverTimestamp(), kind }, { merge: true });
      b.set(postRef, { reactionCount: increment(1) }, { merge: true });
      await b.commit();
      // Server tự verify reaction có thật + lấy tên người gửi theo uid (không tin client).
      notifyServer({ type: 'reaction', sessionId: sidFull });
      return true;
    }
  } catch (e) {
    reportCloudError('Thả tim thất bại', e);
    return null;
  }
}

// Đếm bình luận thật bằng aggregation (nguồn chuẩn, không giả được). Thay cho field
// commentCount denormalized cũ — field đó đã bỏ vì người-không-phải-chủ không được ghi post.
export async function fetchCommentCount(sidFull) {
  try {
    const snap = await getCountFromServer(collection(db, 'sessions', sidFull, 'comments'));
    return snap.data().count || 0;
  } catch { return 0; }
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
    const ref = await addDoc(collection(db, 'sessions', sidFull, 'comments'), {
      uid: me.uid, name: me.name, photoURL: me.photoURL || null,
      text: t.slice(0, 500), createdAt: serverTimestamp(),
    });
    // Server verify comment có thật (theo commentId + uid) rồi mới gửi; tên + preview lấy từ doc.
    notifyServer({ type: 'comment', sessionId: sidFull, commentId: ref.id });
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
  } catch (e) { reportCloudError('Xoá bình luận thất bại', e); }
}
