import {
  doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, writeBatch, collection, collectionGroup,
  query, where, orderBy, limit, startAfter, increment, serverTimestamp,
} from 'fb/firestore';
import { db, reportCloudError } from '../firebase.js';
import { notifyServer } from './push.js';

const uid8 = () => Math.random().toString(36).slice(2, 10);

// Tạo câu lạc bộ. Người tạo = chủ (role owner). memberCount khởi tạo = 1.
// Ghi 2 bước (club doc rồi member doc) vì rules member cần đọc club đã tồn tại.
export async function createClub({ name, sport, desc, coverEmoji, visibility }, owner) {
  const id = `${sport}-${uid8()}`;
  const clubRef = doc(db, 'clubs', id);
  await setDoc(clubRef, {
    id, name: name.trim(), sport, desc: (desc || '').trim(),
    coverEmoji: coverEmoji || '👥', ownerUid: owner.uid, ownerName: owner.name || '',
    visibility: visibility === 'invite' ? 'invite' : 'public',
    memberCount: 1, createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'clubs', id, 'members', owner.uid), {
    uid: owner.uid, name: owner.name || '', photoURL: owner.photoURL || null,
    role: 'owner', joinedAt: serverTimestamp(),
  });
  return id;
}

// Danh sách CLB (mọi nhóm, sắp theo số thành viên giảm dần). Đủ cho quy mô nội bộ.
export async function listClubs() {
  const snap = await getDocs(query(collection(db, 'clubs'), orderBy('memberCount', 'desc'), limit(100)));
  return snap.docs.map(d => d.data());
}

// Tập clubId mà uid đang là thành viên (1 truy vấn collection-group).
export async function myClubIds(uid) {
  try {
    const snap = await getDocs(query(collectionGroup(db, 'members'), where('uid', '==', uid)));
    const ids = new Set();
    snap.docs.forEach(d => { const cid = d.ref.parent.parent?.id; if (cid) ids.add(cid); });
    return ids;
  } catch (e) { reportCloudError('Không tải được nhóm của bạn', e); return new Set(); }
}

export async function getClub(clubId) {
  const s = await getDoc(doc(db, 'clubs', clubId));
  return s.exists() ? s.data() : null;
}

export async function listMembers(clubId) {
  const snap = await getDocs(query(collection(db, 'clubs', clubId, 'members'), limit(200)));
  return snap.docs.map(d => d.data());
}

// Tham gia nhóm public: tạo member doc + tăng memberCount (batch, khớp onlyMemberCountDelta).
export async function joinPublicClub(clubId, me) {
  const b = writeBatch(db);
  b.set(doc(db, 'clubs', clubId, 'members', me.uid), {
    uid: me.uid, name: me.name || '', photoURL: me.photoURL || null, role: 'member', joinedAt: serverTimestamp(),
  });
  b.update(doc(db, 'clubs', clubId), { memberCount: increment(1) });
  await b.commit();
}

// Rời nhóm: xoá member doc + giảm memberCount.
export async function leaveClub(clubId, uid) {
  const b = writeBatch(db);
  b.delete(doc(db, 'clubs', clubId, 'members', uid));
  b.update(doc(db, 'clubs', clubId), { memberCount: increment(-1) });
  await b.commit();
}

// Nhóm invite-only: gửi yêu cầu tham gia.
export async function requestJoin(clubId, me) {
  await setDoc(doc(db, 'clubs', clubId, 'joinRequests', me.uid), {
    uid: me.uid, name: me.name || '', photoURL: me.photoURL || null, requestedAt: serverTimestamp(),
  });
}
export async function myJoinRequested(clubId, uid) {
  const s = await getDoc(doc(db, 'clubs', clubId, 'joinRequests', uid));
  return s.exists();
}
export async function listRequests(clubId) {
  const snap = await getDocs(query(collection(db, 'clubs', clubId, 'joinRequests'), limit(100)));
  return snap.docs.map(d => d.data());
}
// Chủ duyệt yêu cầu: tạo member + tăng count + xoá request.
export async function approveRequest(clubId, user) {
  const b = writeBatch(db);
  b.set(doc(db, 'clubs', clubId, 'members', user.uid), {
    uid: user.uid, name: user.name || '', photoURL: user.photoURL || null, role: 'member', joinedAt: serverTimestamp(),
  });
  b.update(doc(db, 'clubs', clubId), { memberCount: increment(1) });
  b.delete(doc(db, 'clubs', clubId, 'joinRequests', user.uid));
  await b.commit();
}
export async function denyRequest(clubId, uid) {
  await deleteDoc(doc(db, 'clubs', clubId, 'joinRequests', uid));
}

// Đổi cổng vào nhóm: public ↔ invite (chỉ chủ/app-admin — rules gác).
export async function updateClubVisibility(clubId, visibility) {
  await updateDoc(doc(db, 'clubs', clubId), { visibility: visibility === 'invite' ? 'invite' : 'public' });
}

// Mời 1 người vào nhóm (chủ). Lưu clubs/{clubId}/invites/{toUid} kèm info nhóm để hiện noti.
export async function inviteToClub(club, toUser, fromUser) {
  await setDoc(doc(db, 'clubs', club.id, 'invites', toUser.uid), {
    toUid: toUser.uid, toName: toUser.name || '',
    fromUid: fromUser.uid, fromName: fromUser.name || '',
    clubId: club.id, clubName: club.name, clubSport: club.sport,
    createdAt: serverTimestamp(),
  });
  notifyServer({ type: 'clubInvite', clubId: club.id, toUid: toUser.uid, actorName: fromUser.name });
}
// Lời mời đang chờ của tôi (1 truy vấn collection-group).
export async function myInvites(uid) {
  try {
    const snap = await getDocs(query(collectionGroup(db, 'invites'), where('toUid', '==', uid)));
    return snap.docs.map(d => d.data());
  } catch (e) { reportCloudError('Không tải được lời mời', e); return []; }
}
// Chấp nhận lời mời: tự vào nhóm (member) + tăng count + xoá lời mời (batch).
export async function acceptInvite(clubId, me) {
  const b = writeBatch(db);
  b.set(doc(db, 'clubs', clubId, 'members', me.uid), {
    uid: me.uid, name: me.name || '', photoURL: me.photoURL || null, role: 'member', joinedAt: serverTimestamp(),
  });
  b.update(doc(db, 'clubs', clubId), { memberCount: increment(1) });
  b.delete(doc(db, 'clubs', clubId, 'invites', me.uid));
  await b.commit();
}
export async function dismissInvite(clubId, uid) {
  await deleteDoc(doc(db, 'clubs', clubId, 'invites', uid));
}
// Danh sách đã mời (chủ nhóm xem để tránh mời trùng).
export async function listClubInvites(clubId) {
  const snap = await getDocs(query(collection(db, 'clubs', clubId, 'invites'), limit(200)));
  return snap.docs.map(d => d.data());
}

// Xoá nhóm (chủ hoặc app-admin). Best-effort dọn member/request docs trước.
export async function deleteClub(clubId) {
  try {
    for (const sub of ['members', 'joinRequests', 'invites']) {
      const snap = await getDocs(query(collection(db, 'clubs', clubId, sub), limit(300)));
      await Promise.all(snap.docs.map(d => deleteDoc(d.ref).catch(() => { })));
    }
    await deleteDoc(doc(db, 'clubs', clubId));
  } catch (e) { reportCloudError('Xoá nhóm thất bại', e); }
}

// Feed của nhóm: bài của THÀNH VIÊN, CHỈ đúng môn của nhóm. Dùng index (visibility,type,loggedAt)
// rồi lọc client theo tập thành viên. Trang 15 → lọc; UI cuộn để nạp thêm.
const PAGE = 15;
export async function clubFeedPage(cursor, sport, memberSet, since) {
  const parts = [collection(db, 'sessions'), where('visibility', '==', 'company'), where('type', '==', sport)];
  // Chỉ lấy bài từ khi CLB được tạo trở đi (range trên cùng field loggedAt — khớp index sẵn có).
  if (since) parts.push(where('loggedAt', '>=', since));
  parts.push(orderBy('loggedAt', 'desc'), limit(PAGE));
  if (cursor) parts.push(startAfter(cursor));
  const snap = await getDocs(query(...parts));
  const items = snap.docs.map(d => d.data()).filter(s => memberSet.has(s.authorUid));
  return { items, cursor: snap.docs[snap.docs.length - 1] || null, done: snap.docs.length < PAGE };
}
