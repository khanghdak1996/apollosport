import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Wrap } from '../ui/primitives.js';
import { Icons } from '../ui/icons.js';
import { actOf } from '../domain/activities.js';
import { ytSearchUrl } from '../domain/guides.js';

// Bài hướng dẫn chi tiết. Render: video YouTube + nhóm cơ/dụng cụ + các bước + lỗi thường gặp
// + đoạn văn + mẹo/an toàn. Có chỗ cho ảnh (đầu bài & từng bước) — để trống thì hiện placeholder.
export function GuideDetail({ guide, onBack }) {
  if (!guide) return null;
  const a = actOf(guide.sport);
  const media = guide.media || [];
  const steps = guide.steps || [];
  const mistakes = guide.mistakes || [];
  const sections = guide.sections || [];
  const chips = [guide.muscles && { l: '💪', v: guide.muscles }, guide.equipment && { l: '🏋️', v: guide.equipment }].filter(Boolean);
  const ytUrl = guide.ytQuery ? ytSearchUrl(guide.ytQuery) : null;
  const stepsEN = steps.some(s => s.lang === 'en');
  // Các bước mặc định thu gọn — người đã biết tập không bị ép đọc phần cơ bản; ai cần thì mở.
  const [stepsOpen, setStepsOpen] = useState(false);
  const stepRows = steps.map((s, i) => html`
    <div key=${i} style=${{ display: 'flex', gap: 12, marginBottom: 14 }}>
      <div style=${{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: ACC, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>${i + 1}</div>
      <div style=${{ flex: 1, minWidth: 0 }}>
        <p style=${{ margin: 0, fontSize: 14, color: C.txt1, lineHeight: 1.55 }}>${s.text}</p>
        ${s.media && html`<div style=${{ marginTop: 8 }}><img src=${s.media} loading="lazy" style=${{ width: '100%', borderRadius: r.md, display: 'block' }}/></div>`}
      </div>
    </div>`);

  const imgPlaceholder = (h, label) => html`
    <div style=${{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, height: h, borderRadius: r.md, border: `1.5px dashed ${C.bdr2}`, color: C.txt3 }}>
      <span style=${{ fontSize: h > 90 ? 26 : 18 }}>🖼️</span>
      ${label && html`<span style=${{ fontSize: 11 }}>${label}</span>`}
    </div>`;

  return html`
    <${Wrap}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>
        <h2 style=${{ flex: 1, margin: 0, fontSize: 16, fontWeight: 600, color: C.txt1, letterSpacing: '-0.01em' }}>${a.emoji} ${a.label}</h2>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '18px 16px', WebkitOverflowScrolling: 'touch' }}>
        <div style=${{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style=${{ fontSize: 10.5, fontWeight: 500, color: ACC, background: 'var(--accent-glow)', borderRadius: 20, padding: '3px 9px' }}>${guide.level}</span>
        </div>
        <h1 style=${{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: C.txt1, letterSpacing: '-0.02em', lineHeight: 1.25 }}>${guide.title}</h1>
        <p style=${{ margin: '0 0 14px', fontSize: 14, color: C.txt2, lineHeight: 1.55 }}>${guide.summary}</p>

        ${chips.length > 0 && html`
          <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            ${chips.map((c, i) => html`
              <span key=${i} style=${{ background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: 20, padding: '5px 12px', fontSize: 12.5, color: C.txt2 }}>${c.l} <strong style=${{ color: C.txt1, fontWeight: 500 }}>${c.v}</strong></span>`)}
          </div>`}

        ${ytUrl && html`
          <a href=${ytUrl} target="_blank" rel="noopener noreferrer" class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', background: '#ff0000', color: '#fff', borderRadius: r.md, padding: '12px 16px', marginBottom: 18, fontWeight: 600, fontSize: 14 }}>
            <span style=${{ fontSize: 18 }}>▶</span>
            <span style=${{ flex: 1 }}>Xem video hướng dẫn (YouTube)</span>
            <span style=${{ opacity: 0.85 }}>↗</span>
          </a>`}

        ${media.length > 0
      ? media.map((m, i) => m.type === 'video'
        ? html`<video key=${i} src=${m.src} controls style=${{ width: '100%', borderRadius: r.lg, marginBottom: 8, background: '#000' }}/>`
        : html`<img key=${i} src=${m.src} loading="lazy" style=${{ width: '100%', borderRadius: r.lg, marginBottom: 8, display: 'block' }}/>`)
      : (!guide.auto && (steps.length > 0 || sections.length > 0)) ? html`<div style=${{ marginBottom: 18 }}>${imgPlaceholder(130, 'Hình/ video minh hoạ sắp có')}</div>` : ''}

        ${steps.length > 0 && html`
          <div style=${{ marginBottom: 8 }}>
            <button onClick=${() => setStepsOpen(o => !o)} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'transparent', border: 'none', padding: '4px 0', cursor: 'pointer', textAlign: 'left' }}>
              <h3 style=${{ margin: 0, flex: 1, fontSize: 16, fontWeight: 700, color: C.txt1 }}>Các bước thực hiện</h3>
              ${stepsEN && html`<span style=${{ fontSize: 11, color: C.txt3, flexShrink: 0 }}>bản dịch đang cập nhật</span>`}
              <span style=${{ fontSize: 12, color: C.txt3, flexShrink: 0 }}>${steps.length} bước</span>
              <span style=${{ fontSize: 13, color: C.txt2, flexShrink: 0, transform: stepsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
            </button>
            ${stepsOpen
        ? html`<div style=${{ marginTop: 12 }}>${stepRows}</div>`
        : html`
              <div onClick=${() => setStepsOpen(true)} class="card-hover" style=${{ position: 'relative', marginTop: 10, cursor: 'pointer', borderRadius: r.md }}>
                <div style=${{ maxHeight: 88, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to bottom, #000 30%, transparent 96%)', maskImage: 'linear-gradient(to bottom, #000 30%, transparent 96%)', pointerEvents: 'none' }}>
                  ${stepRows}
                </div>
                <div style=${{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, paddingTop: 20, fontSize: 12.5, fontWeight: 600, color: ACC }}>
                  <span>Xem ${steps.length} bước</span><span style=${{ fontSize: 13 }}>▾</span>
                </div>
              </div>`}
          </div>`}

        ${sections.map((s, i) => html`
          <div key=${i} style=${{ marginBottom: 18 }}>
            <h3 style=${{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: ACC }}>${s.heading}</h3>
            <p style=${{ margin: 0, fontSize: 14, color: C.txt1, lineHeight: 1.6 }}>${s.body}</p>
          </div>`)}

        ${mistakes.length > 0 && html`
          <div style=${{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: r.lg, padding: '14px 16px', marginBottom: 14 }}>
            <p style=${{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#b91c1c' }}>❌ Lỗi thường gặp</p>
            <ul style=${{ margin: 0, paddingLeft: 18, color: '#7f1d1d', fontSize: 13.5, lineHeight: 1.6 }}>
              ${mistakes.map((t, i) => html`<li key=${i} style=${{ marginBottom: 4 }}>${t}</li>`)}
            </ul>
          </div>`}

        ${guide.tips && guide.tips.length > 0 && html`
          <div style=${{ background: 'var(--accent-glow)', borderRadius: r.lg, padding: '14px 16px', marginBottom: 14 }}>
            <p style=${{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: ACC }}>💡 Mẹo</p>
            <ul style=${{ margin: 0, paddingLeft: 18, color: C.txt1, fontSize: 13.5, lineHeight: 1.6 }}>
              ${guide.tips.map((t, i) => html`<li key=${i} style=${{ marginBottom: 4 }}>${t}</li>`)}
            </ul>
          </div>`}

        ${guide.safety && guide.safety.length > 0 && html`
          <div style=${{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: r.lg, padding: '14px 16px', marginBottom: 14 }}>
            <p style=${{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#9a3412' }}>⚠️ An toàn</p>
            <ul style=${{ margin: 0, paddingLeft: 18, color: '#7c2d12', fontSize: 13.5, lineHeight: 1.6 }}>
              ${guide.safety.map((t, i) => html`<li key=${i} style=${{ marginBottom: 4 }}>${t}</li>`)}
            </ul>
          </div>`}

        ${guide.auto && html`
          <p style=${{ margin: '4px 0 0', fontSize: 12.5, color: C.txt2, lineHeight: 1.5, fontStyle: 'italic' }}>Bài hướng dẫn chi tiết cho động tác này đang được bổ sung. Bạn có thể xem video ở trên trong lúc chờ.</p>`}

        ${guide.source === 'free-exercise-db' && html`<p style=${{ margin: '12px 0 0', fontSize: 11, color: C.txt3 }}>Ảnh & hướng dẫn gốc: free-exercise-db (public domain).</p>`}
        <p style=${{ margin: '6px 0 0', fontSize: 11, color: C.txt3, lineHeight: 1.5 }}>Nội dung mang tính tham khảo, không thay thế tư vấn chuyên môn y tế/huấn luyện.</p>
      </div>
    </${Wrap}>`;
}
