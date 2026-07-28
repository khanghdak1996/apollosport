import {
  collection, doc, setDoc, deleteDoc, getDocs, query, orderBy, limit, serverTimestamp,
} from 'fb/firestore';
import { db } from '../firebase.js';
import { compressImage, uploadAnnouncementPhoto, deleteAnnouncementPhoto } from './photos.js';

// Feed thông báo dùng chung cho club & goal. parent = ['clubs', id] hoặc ['goals', id].
// Chỉ chủ/người-tạo/app-admin được đăng (rules gác); mọi người đọc.
const col = (parent) => collection(db, ...parent, 'posts');

export async function listAnnouncements(parent) {
  const snap = await getDocs(query(col(parent), orderBy('createdAt', 'desc'), limit(50)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Đăng thông báo, kèm ẢNH tuỳ chọn (F6). Mint id TRƯỚC để upload ảnh theo id rồi setDoc
// MỘT lần — rules chỉ cho create/delete (KHÔNG update), nên imageUrl phải gộp vào lúc tạo.
// Lưu imageId (= file id trên Storage) để xoá đúng ảnh sau này, tránh ảnh mồ côi.
// Trả về object post đầy đủ để UI chèn optimistic.
export async function addAnnouncement(parent, me, text, imageFile) {
  const ref = doc(col(parent));
  let imageUrl = null, imageId = null;
  if (imageFile) {
    const blob = await compressImage(imageFile);
    imageUrl = await uploadAnnouncementPhoto(blob, me.uid, ref.id);
    imageId = ref.id;
  }
  const data = { authorUid: me.uid, authorName: me.name || '', text: text.trim(), createdAt: serverTimestamp() };
  if (imageUrl) { data.imageUrl = imageUrl; data.imageId = imageId; }
  await setDoc(ref, data);
  return { id: ref.id, ...data };
}

// "Sửa" thông báo = TẠO bản mới rồi XOÁ bản cũ (rules không có update). Tạo TRƯỚC, xoá SAU
// để lỡ lỗi giữa chừng vẫn không mất thông báo. imageFile mới → thay ảnh (xoá ảnh cũ);
// keepImage → giữ nguyên ảnh cũ (carry imageUrl + imageId, KHÔNG upload lại); còn lại → bỏ ảnh.
export async function editAnnouncement(parent, me, oldPost, text, imageFile, keepImage) {
  const ref = doc(col(parent));
  let imageUrl = null, imageId = null;
  if (imageFile) {
    const blob = await compressImage(imageFile);
    imageUrl = await uploadAnnouncementPhoto(blob, me.uid, ref.id);
    imageId = ref.id;
  } else if (keepImage && oldPost.imageUrl) {
    imageUrl = oldPost.imageUrl; imageId = oldPost.imageId || null;
  }
  const data = { authorUid: me.uid, authorName: me.name || '', text: text.trim(), createdAt: serverTimestamp() };
  if (imageUrl) { data.imageUrl = imageUrl; if (imageId) data.imageId = imageId; }
  await setDoc(ref, data);
  await deleteDoc(doc(db, ...parent, 'posts', oldPost.id));
  // Ảnh cũ chỉ xoá khi KHÔNG còn được bản mới dùng lại (đổi ảnh hoặc bỏ ảnh).
  if (oldPost.imageId && imageId !== oldPost.imageId) deleteAnnouncementPhoto(oldPost.authorUid || me.uid, oldPost.imageId);
  return { id: ref.id, ...data };
}

export async function deleteAnnouncement(parent, post) {
  const id = typeof post === 'string' ? post : post.id;
  await deleteDoc(doc(db, ...parent, 'posts', id));
  if (post && post.imageId) deleteAnnouncementPhoto(post.authorUid, post.imageId);
}
