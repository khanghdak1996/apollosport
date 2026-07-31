// Gọi trợ lý AI qua proxy server-side (api/chat.js). Không giữ key ở client.
import { auth } from '../firebase.js';

// messages: [{ role:'user'|'assistant', text }] — toàn bộ lịch sử hội thoại hiện tại.
// Trả về chuỗi text trả lời của trợ lý; throw Error(message tiếng Việt) khi lỗi.
export async function askAI(messages) {
  const user = auth && auth.currentUser;
  if (!user) throw new Error('Bạn cần đăng nhập để dùng trợ lý.');

  const idToken = await user.getIdToken();
  let res;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, messages }),
    });
  } catch (e) {
    throw new Error('Không kết nối được tới trợ lý. Kiểm tra mạng nhé.');
  }

  let data = {};
  try { data = await res.json(); } catch { /* giữ data rỗng */ }
  if (!res.ok) throw new Error(data.error || 'Trợ lý đang bận, thử lại sau nhé.');
  return data.text || '';
}
