import { auth } from '../firebase.js';

// Yêu cầu server tính lại điểm xếp hạng + totals của MÌNH (client bị firestore.rules cấm ghi
// leaderboard/totals — chống bịa điểm F12). Gọi sau khi lưu/xoá/đổi visibility buổi tập, và lúc
// đăng nhập (tự chữa). Fire-and-forget: lỗi không chặn UI, điểm sẽ được chữa ở lần gọi sau.
// Bảo mật: server tính từ buổi THẬT theo uid đăng nhập → client chỉ "nhờ tính lại", không bịa được.
// dates = ngày của buổi vừa đổi (để server xoá entry mồ côi khi xoá buổi cuối của kỳ).
const SCORE_ENDPOINT = '/api/score';

export async function requestRescore(dates = []) {
  try {
    const u = auth?.currentUser;
    if (!u) return;
    const idToken = await u.getIdToken();
    await fetch(SCORE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, dates: (dates || []).filter(Boolean) }),
      keepalive: true,
    });
  } catch { /* im lặng — không chặn UI */ }
}
