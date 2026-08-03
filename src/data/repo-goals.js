import {
  doc, getDoc, getDocs, setDoc, deleteDoc, collection, query, where, limit, serverTimestamp,
} from 'fb/firestore';
import { db, reportCloudError } from '../firebase.js';

const gid = () => Math.random().toString(36).slice(2, 10);

// Tạo mục tiêu chung. scope='club' (kèm clubId/clubName) hoặc 'company'.
export async function createGoal(g, creator) {
  const id = `g-${gid()}`;
  await setDoc(doc(db, 'goals', id), {
    id, title: g.title.trim(), scope: g.scope,
    clubId: g.clubId || null, clubName: g.clubName || null,
    metric: g.metric, sport: g.sport || null,
    target: g.target, startDate: g.startDate, endDate: g.endDate,
    creatorUid: creator.uid, creatorName: creator.name || '', createdAt: serverTimestamp(),
  });
  return id;
}

// Mục tiêu toàn công ty (sort client theo createdAt để khỏi cần composite index).
export async function listCompanyGoals() {
  const snap = await getDocs(query(collection(db, 'goals'), where('scope', '==', 'company'), limit(50)));
  return snap.docs.map(d => d.data());
}
// Mục tiêu của 1 nhóm.
export async function listClubGoals(clubId) {
  const snap = await getDocs(query(collection(db, 'goals'), where('clubId', '==', clubId), limit(50)));
  return snap.docs.map(d => d.data());
}

// Toàn bộ bản đóng góp của 1 mục tiêu (để cộng tổng nhóm).
export async function getGoalProgress(goalId) {
  const snap = await getDocs(query(collection(db, 'goals', goalId, 'progress'), limit(500)));
  return snap.docs.map(d => d.data());
}
// Ghi đóng góp của chính mình (tính lại từ sessions phía client).
export async function setMyGoalProgress(goalId, me, value) {
  await setDoc(doc(db, 'goals', goalId, 'progress', me.uid), {
    uid: me.uid, name: me.name || '', value, updatedAt: serverTimestamp(),
  });
}

export async function deleteGoal(goalId) {
  try {
    for (const sub of ['progress', 'posts']) {
      const snap = await getDocs(query(collection(db, 'goals', goalId, sub), limit(500)));
      await Promise.all(snap.docs.map(d => deleteDoc(d.ref).catch(() => { })));
    }
    await deleteDoc(doc(db, 'goals', goalId));
  } catch (e) { reportCloudError('Xoá mục tiêu thất bại', e); }
}
