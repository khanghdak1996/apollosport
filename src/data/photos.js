import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'fb/storage';
import { storage, fbInitError } from '../firebase.js';

// Upload ảnh buổi tập vào sessions/{uid}/{sessionId}.jpg (khớp storage.rules).
export async function uploadSessionPhoto(blob, uid, sessionId) {
  if (!storage) throw new Error(fbInitError || 'Firebase Storage chưa khởi tạo được');
  const sref = storageRef(storage, `sessions/${uid}/${sessionId}.jpg`);
  await uploadBytes(sref, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(sref);
}

// Xoá ảnh buổi tập trên Storage (khi gỡ ảnh hoặc xoá bài). Best-effort — không có/lỗi thì bỏ qua.
export async function deleteSessionPhoto(uid, sessionId) {
  if (!storage) return;
  try { await deleteObject(storageRef(storage, `sessions/${uid}/${sessionId}.jpg`)); }
  catch { /* ảnh không tồn tại hoặc lỗi mạng — bỏ qua */ }
}

// Ảnh đính kèm thông báo (F6): announcements/{uid}/{fileId}.jpg (khớp storage.rules).
export async function uploadAnnouncementPhoto(blob, uid, fileId) {
  if (!storage) throw new Error(fbInitError || 'Firebase Storage chưa khởi tạo được');
  const sref = storageRef(storage, `announcements/${uid}/${fileId}.jpg`);
  await uploadBytes(sref, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(sref);
}
export async function deleteAnnouncementPhoto(uid, fileId) {
  if (!storage || !fileId) return;
  try { await deleteObject(storageRef(storage, `announcements/${uid}/${fileId}.jpg`)); }
  catch { /* ảnh không tồn tại hoặc lỗi mạng — bỏ qua */ }
}

    export const compressImage = (file, maxDim = 1280, quality = 0.75) => new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) { height = Math.round(height * maxDim / width); width = maxDim; }
        else if (height > maxDim) { width = Math.round(width * maxDim / height); height = maxDim; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => { URL.revokeObjectURL(url); blob ? resolve(blob) : reject(new Error('compress failed')); }, 'image/jpeg', quality);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image load failed')); };
      img.src = url;
    });
