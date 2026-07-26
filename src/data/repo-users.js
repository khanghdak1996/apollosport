import { doc, getDoc, setDoc, getDocs, collection, query, limit, serverTimestamp } from 'fb/firestore';
import { db } from '../firebase.js';

// Danh sách gọn mọi user (cap 500) để tìm kiếm mời vào nhóm theo tên/email. Lọc phía client.
export async function listAllUsers() {
  const snap = await getDocs(query(collection(db, 'users'), limit(500)));
  return snap.docs.map(d => {
    const u = d.data();
    return { uid: u.uid, name: u.name || '', email: u.email || '', photoURL: u.photoURL || null, dept: u.dept || '' };
  });
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

// Quyền admin là CỘNG THÊM: có mặt trong admins/{uid} = có thêm quyền quản trị,
// nhưng vẫn là user đầy đủ (log tập, lên bảng xếp hạng...). Chỉ set tay qua
// Firebase Console — client không ghi được (rules chặn). Trả false nếu không phải
// hoặc nếu đọc lỗi (fail-closed).
export async function isAdminUser(uid) {
  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    return snap.exists();
  } catch {
    return false;
  }
}

// Cập nhật một số field hồ sơ (merge). Không đụng vào uid/email (bất biến theo rules).
export async function updateUserDoc(uid, fields) {
  await setDoc(doc(db, 'users', uid), { ...fields, lastActiveAt: serverTimestamp() }, { merge: true });
}

// Lưu kết quả onboarding lần đầu.
export async function saveOnboarding(uid, { name, dept, center, prefs }) {
  await setDoc(doc(db, 'users', uid), {
    name, dept: dept || '', center: center || '',
    prefs: { ...prefs, onboarded: true },
    lastActiveAt: serverTimestamp(),
  }, { merge: true });
}
