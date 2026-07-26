// src/screens/GuideDetail.js — Hướng dẫn chi tiết, bản redesign. THAY TOÀN BỘ file cũ.
// Khác bản cũ: nút video dùng ĐỎ APOLLO (#EB4754), không dùng đỏ YouTube.
import { html } from '../html.js';
import { C, r, F, T, BRAND, sportColor, sportTint } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { actOf } from '../domain/activities.js';

// Khối lời khuyên — dùng cho "Lỗi thường gặp" (đỏ) và "Mẹo" (vàng).
function TipBlock({ title, items, tone }) {
  const t = tone === 'warn'
    ? { bg: C.redBg, bdr: C.redBdr, head: C.redInk, body: '#8C2A34', dot: BRAND.red }
    : { bg: C.yellowBg, bdr: 'transparent', head: C.yellowDeep, body: '#6B5510', dot: C.yellowInk };
  return html`
    <div style=${{ background: t.bg, border: `1px solid ${t.bdr}`, borderRadius: r.xl, padding: '14px 16px', marginBottom: 12 }}>
      <p style=${{ margin: '0 0 9px', fontFamily: F.display, fontWeight: 700, fontSize: 14, letterSpacing: '.08em', color: t.head, textTransform: 'uppercase' }}>${title}</p>
      ${items.map((m, i) => html`
        <div key=${i} style=${{ display: 'flex', gap: 9, marginBottom: 6 }}>
          <span style=${{ color: t.dot, fontWeight: 700, flexShrink: 0 }}>·</span>
          <p style=${{ margin: 0, flex: 1, fontSize: 13.5, lineHeight: 1.55, color: t.body }}>${m}</p>
        </div>`)}
    </div>`;
}

export function GuideDetail({ guide, onBack }) {
  const a = actOf(guide.sport);
  const chips = [guide.muscles, guide.equipment].filter(Boolean);

  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.bg2, borderBottom: `1px solid ${C.bdr}`, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <span style=${{ width: 30, height: 30, borderRadius: 9, background: sportTint(a.iconKey), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <${SportIcon} k=${a.iconKey} size=${17} color=${sportColor(a.iconKey)}/>
        </span>
        <p style=${{ flex: 1, margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 18, letterSpacing: '.05em', color: C.txt1, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${a.label}</p>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '18px 16px 40px' }}>
        ${guide.level ? html`
          <span style=${{ display: 'inline-block', fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', color: BRAND.blue, background: C.bg3, borderRadius: 20, padding: '4px 11px', marginBottom: 10, whiteSpace: 'nowrap' }}>${guide.level}</span>` : ''}
        <p style=${{ margin: '0 0 8px', fontFamily: F.display, fontWeight: 700, fontSize: 30, lineHeight: 1.1, letterSpacing: '.01em', color: C.txt1, textTransform: 'uppercase' }}>${guide.title}</p>
        ${guide.summary ? html`<p style=${{ margin: '0 0 14px', fontFamily: F.serif, fontSize: 14, lineHeight: 1.65, color: C.txt2 }}>${guide.summary}</p>` : ''}

        ${chips.length ? html`
          <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            ${chips.map((c, i) => html`
              <span key=${i} style=${{ display: 'flex', alignItems: 'center', gap: 7, background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: 22, padding: '6px 13px', fontSize: 12.5, color: C.txt3 }}>
                <${SportIcon} k=${i ? 'target' : 'gym'} size=${15} color=${C.txt3}/>
                <b style=${{ fontWeight: 600, color: C.txt1 }}>${c}</b>
              </span>`)}
          </div>` : ''}

        ${guide.videoUrl ? html`
          <a href=${guide.videoUrl} target="_blank" rel="noopener" style=${{ display: 'flex', alignItems: 'center', gap: 11, background: BRAND.red, borderRadius: 15, padding: '13px 16px', marginBottom: 18, textDecoration: 'none' }}>
            <${SportIcon} k="video" size=${22} color="#fff" sw=${1.9}/>
            <span style=${{ flex: 1, fontFamily: F.display, fontWeight: 700, fontSize: 16, letterSpacing: '.07em', color: '#fff', textTransform: 'uppercase' }}>Xem video hướng dẫn</span>
            <${SportIcon} k="chevronR" size=${16} color="#fff" sw=${2}/>
          </a>` : ''}

        ${guide.imageUrl
          ? html`<img src=${guide.imageUrl} loading="lazy" style=${{ width: '100%', height: 150, objectFit: 'cover', borderRadius: r.xl, border: `1px solid ${C.bdr}`, marginBottom: 20, display: 'block' }}/>`
          : html`
            <div style=${{ height: 150, borderRadius: r.xl, background: 'repeating-linear-gradient(135deg,#E7F1FB,#E7F1FB 10px,#DDEAF7 10px,#DDEAF7 20px)', border: `1px solid ${C.bdr}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
              <${SportIcon} k="photo" size=${26} color=${C.txt3} sw=${1.7}/>
              <span style=${{ fontSize: 11, color: C.txt2 }}>ảnh minh hoạ động tác</span>
            </div>`}

        ${guide.steps && guide.steps.length ? html`
          <div style=${{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
            <p style=${{ margin: 0, flex: 1, fontFamily: F.display, fontWeight: 700, fontSize: 18, letterSpacing: '.05em', color: C.txt1, textTransform: 'uppercase' }}>Các bước thực hiện</p>
            <span style=${{ fontSize: 11.5, color: C.txt4, whiteSpace: 'nowrap' }}>${guide.steps.length} bước</span>
          </div>
          ${guide.steps.map((s, i) => html`
            <div key=${i} style=${{ display: 'flex', gap: 12, marginBottom: 13 }}>
              <span style=${{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: BRAND.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontWeight: 700, fontSize: 14 }}>${i + 1}</span>
              <p style=${{ margin: 0, flex: 1, fontSize: 14, lineHeight: 1.6, color: C.txt1 }}>${s}</p>
            </div>`)}` : ''}

        ${guide.mistakes && guide.mistakes.length ? html`<div style=${{ marginTop: 18 }}><${TipBlock} title="Lỗi thường gặp" items=${guide.mistakes} tone="warn"/></div>` : ''}
        ${guide.tips && guide.tips.length ? html`<${TipBlock} title="Mẹo" items=${guide.tips} tone="tip"/>` : ''}

        <p style=${{ margin: '14px 2px 0', fontSize: 11, lineHeight: 1.6, color: C.txt5 }}>
          Ảnh &amp; hướng dẫn gốc: free-exercise-db (public domain). Nội dung mang tính tham khảo, không thay thế tư vấn chuyên môn.
        </p>
      </div>
    </div>`;
}
