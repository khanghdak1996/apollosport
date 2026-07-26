// src/screens/GoalsScreen.js — Mục tiêu chung, bản redesign. FILE MỚI.
import { html } from '../html.js';
import { C, r, F, T, BRAND, SHADOW } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { Contributors } from './ClubScreen.js';

// Vòng tiến độ — dùng lại được ở nhiều chỗ.
export function Ring({ pct, size = 96, stroke = 10, label, sub }) {
  const rad = (size - stroke) / 2;
  const circ = 2 * Math.PI * rad;
  return html`
    <div style=${{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width=${size} height=${size} viewBox=${`0 0 ${size} ${size}`}>
        <circle cx=${size / 2} cy=${size / 2} r=${rad} fill="none" stroke=${C.bdr2} stroke-width=${stroke}/>
        <circle cx=${size / 2} cy=${size / 2} r=${rad} fill="none" stroke=${BRAND.blue} stroke-width=${stroke}
          stroke-linecap="round" stroke-dasharray=${circ} stroke-dashoffset=${circ * (1 - Math.min(1, pct / 100))}
          transform=${`rotate(-90 ${size / 2} ${size / 2})`} style=${{ transition: 'stroke-dashoffset .5s' }}/>
      </svg>
      <div style=${{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: size * 0.31, lineHeight: 1, color: BRAND.blue }}>${label}</p>
        <p style=${{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: C.txt4 }}>${sub}</p>
      </div>
    </div>`;
}

export function GoalsScreen({ goal, contributors = [], myUid, announceCount = 0, onBack, onCreate, onOpenAnnounce }) {
  const pct = goal ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;

  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px 16px', background: C.bg2, borderBottom: `1px solid ${C.bdr}`, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <p style=${{ flex: 1, margin: 0, ...T.h2 }}>MỤC TIÊU CHUNG</p>
        ${onCreate ? html`
          <button onClick=${onCreate} class="btn-action" style=${{ background: BRAND.blue, border: 'none', borderRadius: r.md, padding: '9px 16px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, whiteSpace: 'nowrap' }}>
            <${SportIcon} k="plus" size=${13} color="#fff" sw=${2.4}/>Tạo
          </button>` : ''}
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <div style=${{ display: 'flex', gap: 12, background: BRAND.babyBlue, borderRadius: r.lg, padding: '14px 16px', marginBottom: 16 }}>
          <${SportIcon} k="target" size=${20} color="#2E5A80" sw=${1.9} cx=${{ flexShrink: 0, marginTop: 1 }}/>
          <p style=${{ margin: 0, fontFamily: F.serif, fontSize: 12.5, lineHeight: 1.6, color: '#2E5A80' }}>
            Phong trào toàn công ty do ban lãnh đạo phát động. Bạn <b style=${{ fontFamily: F.body }}>tự động góp</b> khi tập đúng môn — không xếp hạng, chỉ cùng nhau về đích.
          </p>
        </div>

        ${goal ? html`
          <div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xxl, padding: 18, boxShadow: SHADOW.raised }}>
            <div style=${{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style=${{ background: C.greenBg, color: C.green, borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>Đang diễn ra</span>
              <span style=${{ fontSize: 11.5, color: C.txt4 }}>${goal.range}</span>
            </div>
            <p style=${{ margin: '0 0 16px', fontFamily: F.display, fontWeight: 700, fontSize: 26, lineHeight: 1.15, letterSpacing: '.01em', color: C.txt1, textTransform: 'uppercase' }}>${goal.title}</p>

            <div style=${{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 }}>
              <${Ring} pct=${pct} label=${goal.current} sub=${'/' + goal.target}/>
              <div style=${{ flex: 1, minWidth: 0 }}>
                <p style=${{ margin: 0, fontSize: 12, color: C.txt3 }}>Đóng góp của bạn</p>
                <p style=${{ margin: '1px 0 12px', fontFamily: F.display, fontWeight: 700, fontSize: 24, lineHeight: 1, color: C.txt1 }}>${goal.mine || 0} ${goal.unit}</p>
                <p style=${{ margin: 0, fontSize: 12, color: C.txt3 }}>Đang tham gia</p>
                <p style=${{ margin: '1px 0 0', fontFamily: F.display, fontWeight: 700, fontSize: 24, lineHeight: 1, color: C.txt1 }}>${goal.activeCount || 0} người</p>
              </div>
            </div>

            ${contributors.length ? html`<${Contributors} rows=${contributors} unit=${goal.unit} myUid=${myUid}/>` : ''}

            ${announceCount > 0 ? html`
              <div onClick=${onOpenAnnounce} style=${{ display: 'flex', alignItems: 'center', gap: 11, background: C.bg1, borderRadius: 14, padding: '12px 14px', marginTop: 6, cursor: 'pointer' }}>
                <${SportIcon} k="bell" size=${18} color=${C.txt2} sw=${1.9}/>
                <p style=${{ margin: 0, flex: 1, fontSize: 12.5, fontWeight: 600, color: C.txt2 }}>${announceCount} thông báo từ ban tổ chức</p>
                <${SportIcon} k="chevronR" size=${16} color=${C.txt5} sw=${2}/>
              </div>` : ''}
          </div>` : ''}
      </div>
    </div>`;
}
