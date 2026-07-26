import {
  collection, doc, addDoc, deleteDoc, getDocs, query, orderBy, limit, serverTimestamp,
} from 'fb/firestore';
import { db } from '../firebase.js';

// Feed thông báo dùng chung cho club & goal. parent = ['clubs', id] hoặc ['goals', id].
// Chỉ chủ/người-tạo/app-admin được đăng (rules gác); mọi người đọc.
const col = (parent) => collection(db, ...parent, 'posts');

export async function listAnnouncements(parent) {
  const snap = await getDocs(query(col(parent), orderBy('createdAt', 'desc'), limit(50)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addAnnouncement(parent, me, text) {
  const ref = await addDoc(col(parent), {
    authorUid: me.uid, authorName: me.name || '', text: text.trim(), createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteAnnouncement(parent, postId) {
  await deleteDoc(doc(db, ...parent, 'posts', postId));
}
