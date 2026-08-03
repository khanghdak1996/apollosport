/* Service worker cho Firebase Cloud Messaging — PHẢI nằm ở gốc site (scope "/").
 * Dùng bản "compat" qua importScripts vì service worker không đọc importmap của trang.
 * Firebase web config ở đây đều là giá trị PUBLIC (giống src/firebase.js) — an toàn.
 * Nhiệm vụ: hiện notification khi app đang ĐÓNG/nền (onBackgroundMessage) + xử lý click.
 * Xem PUSH-SETUP.md. */
/* global importScripts, firebase, self, clients */

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBUUbB149e2J_mZHulhbcYtXyUy2JbhN0k',
  authDomain: 'apollo-sport-social.firebaseapp.com',
  projectId: 'apollo-sport-social',
  storageBucket: 'apollo-sport-social.firebasestorage.app',
  messagingSenderId: '368506443580',
  appId: '1:368506443580:web:a553f151fe5894a1a3f039',
});

const messaging = firebase.messaging();

// Message "notification" thường được trình duyệt tự hiện. Ta xử lý message "data-only"
// (server nên gửi data để kiểm soát nội dung + link) và hiện thủ công.
messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  const title = d.title || 'Apollo Sport';
  self.registration.showNotification(title, {
    body: d.body || '',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-192.png',
    tag: d.tag || undefined,           // gộp các thông báo cùng loại
    data: { url: d.url || '/' },
  });
});

// Bấm vào notification → mở/đưa app lên trước, điều hướng tới url kèm theo.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async () => {
    const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if ('focus' in c) { try { await c.navigate(url); } catch { /* cross-origin */ } return c.focus(); }
    }
    if (clients.openWindow) return clients.openWindow(url);
  })());
});
