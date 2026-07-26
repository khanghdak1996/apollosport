// src/screens/Celebrate.js — màn Chúc mừng, bản redesign. FILE MỚI.
// Gắn vào app.js: import { Celebrate } from './screens/Celebrate.js';
// rồi thay khối chúc mừng đang có trong app.js bằng component này.
import { html } from '../html.js';
import { C, r, F, BRAND } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { actOf } from '../domain/activities.js';
import { summaryStats } from '../domain/session.js';

const CONFETTI_COLORS = [BRAND.yellow, BRAND.babyBlue, BRAND.pink, '#FFFFFF', BRAND.red];
const TOPS = [3, 7, 12, 5, 16, 9, 20, 2, 14, 22, 6, 18, 10, 24];
const LEFTS = [8, 22, 40, 62, 78, 90, 15, 48, 70, 34, 86, 55, 28, 74];

export function Celebrate({ session, streak, newBadge, onShare, onSkip }) {
  const a = actOf(session.type);
  const stats = summaryStats(session).slice(0, 3);

  return html`
    <div style=${{ position: 'relative', height: '100%', background: BRAND.blue, color: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      ${TOPS.map((t, i) => html`
        <span key=${i} class="confetti-piece" style=${{
          position: 'absolute', top: t + '%', left: LEFTS[i] + '%', width: 8, height: 12, borderRadius: 2,
          background: CONFETTI_COLORS[i % 5], transform: `rotate(${(i * 37) % 90 - 45}deg)`, opacity: .9,
        }}/>`)}

      <div style=${{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 26px', position: 'relative' }}>
        <div style=${{ width: 96, height: 96, borderRadius: '50%', background: BRAND.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <${SportIcon} k="check" size=${46} color=${C.txt1} sw=${2.4}/>
        </div>

        <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 46, lineHeight: 1, letterSpacing: '.02em', textAlign: 'center', textTransform: 'uppercase' }}>
          Xong buổi<br/>${a.label}!
        </p>
        <p style=${{ margin: '12px 0 26px', fontFamily: F.serif, fontStyle: 'italic', fontSize: 14, color: BRAND.babyBlue, textAlign: 'center' }}>
          ${streak > 1 ? `Chuỗi của bạn lên ${streak} ngày.` : 'Buổi đầu tiên — chuỗi bắt đầu từ hôm nay.'}
        </p>

        <div style=${{ display: 'flex', gap: 9, width: '100%', marginBottom: 14 }}>
          ${stats.map((s, i) => html`
            <div key=${i} style=${{ flex: 1, background: 'rgba(255,255,255,.14)', borderRadius: r.lg, padding: '14px 8px', textAlign: 'center', minWidth: 0 }}>
              <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 28, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>${s.v}</p>
              <p style=${{ margin: '4px 0 0', fontSize: 10.5, letterSpacing: '.09em', fontWeight: 600, color: BRAND.babyBlue, textTransform: 'uppercase' }}>${s.u || 'điểm'}</p>
            </div>`)}
        </div>

        ${newBadge ? html`
          <div style=${{ display: 'flex', alignItems: 'center', gap: 12, background: BRAND.yellow, borderRadius: r.lg, padding: '13px 16px', width: '100%' }}>
            <${SportIcon} k="medal" size=${26} color=${C.txt1} sw=${1.8}/>
            <div style=${{ minWidth: 0 }}>
              <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 15, letterSpacing: '.06em', color: C.txt1, textTransform: 'uppercase' }}>Huy hiệu mới · ${newBadge.name}</p>
              <p style=${{ margin: '1px 0 0', fontSize: 11.5, color: C.txt1, opacity: .7 }}>${newBadge.desc}</p>
            </div>
          </div>` : ''}
      </div>

      <div style=${{ padding: '0 20px 26px', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
        <button onClick=${onShare} class="btn-action" style=${{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#fff', border: 'none', borderRadius: 15, padding: 15, cursor: 'pointer' }}>
          <${SportIcon} k="journal" size=${19} color=${BRAND.blue} sw=${1.9}/>
          <span style=${{ fontFamily: F.display, fontWeight: 700, fontSize: 17, letterSpacing: '.09em', color: BRAND.blue }}>CHIA SẺ LÊN BẢNG TIN</span>
        </button>
        <button onClick=${onSkip} class="btn-action" style=${{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: BRAND.babyBlue }}>Để sau</button>
      </div>
    </div>`;
}
