// src/screens/PostCard.js — bản redesign. THAY TOÀN BỘ file cũ.
// Khác bản cũ: avatar viền theo màu môn, hàng số liệu dùng số condensed,
// và TIM + BÌNH LUẬN dồn về phải CÙNG HÀNG số liệu (bỏ 2 nút to chia đôi thẻ).
import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND, SHADOW, sportColor } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { PhotoView } from '../ui/Lightbox.js';
import { actOf } from '../domain/activities.js';
import { summaryStats, headline } from '../domain/session.js';
import { fDT } from '../domain/format.js';
import { fetchCommentCount } from '../data/repo-social.js';
import { t } from '../i18n.js';

function Avatar({ name, photo, color }) {
  const st = { width: 40, height: 40, borderRadius: '50%', border: `2px solid ${color}`, flexShrink: 0 };
  if (photo) return html`<img src=${photo} loading="lazy" style=${{ ...st, objectFit: 'cover' }}/>`;
  return html`<div style=${{ ...st, background: C.bg3, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>${(name || '?').trim().charAt(0).toUpperCase()}</div>`;
}

export function PostCard({ post, reacted, onReact, onOpenComments, onOpenProfile, myUid, onManage, moderating, onAdminDelete }) {
  const a = actOf(post.type);
  const stats = summaryStats(post);
  const mine = myUid && post.authorUid === myUid;
  const ring = sportColor(a.iconKey);

  // Số bình luận đếm thật bằng aggregation (không còn field commentCount giả được).
  const sidFull = `${post.authorUid}_${post.id}`;
  const [commentCount, setCommentCount] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchCommentCount(sidFull).then(n => { if (alive) setCommentCount(n); });
    return () => { alive = false; };
  }, [sidFull]);

  return html`
    <div style=${{ background: C.bg2, borderRadius: r.xl, marginBottom: 11, border: `1px solid ${C.bdr}`, overflow: 'hidden', boxShadow: SHADOW.card }}>

      <div style=${{ display: 'flex', gap: 11, alignItems: 'center', padding: '14px 16px 0' }}>
        <div onClick=${() => onOpenProfile && onOpenProfile(post.authorUid)} style=${{ cursor: 'pointer' }}>
          <${Avatar} name=${post.authorName} photo=${post.authorPhoto} color=${ring}/>
        </div>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, fontSize: 13.5, lineHeight: 1.35, color: C.txt1 }}>
            <b style=${{ fontWeight: 700 }}>${post.authorName}</b><span style=${{ color: C.txt2 }}> ${headline(post)}</span>
          </p>
          <p style=${{ margin: '2px 0 0', fontSize: 11, color: C.txt4 }}>
            ${post.dept ? post.dept + ' · ' : ''}${fDT(post.loggedAt || post.startTime)}${post.streakAtPost > 1 ? ' · ' + t('post.streak', { n: post.streakAtPost }) : ''}
          </p>
        </div>
        <${SportIcon} k=${a.iconKey} size=${20} color=${ring} cx=${{ flexShrink: 0 }}/>
        ${mine && onManage ? html`
          <button onClick=${() => onManage(post)} class="btn-action" title=${t('post.manage')} style=${{ flexShrink: 0, background: 'transparent', border: 'none', cursor: 'pointer', color: C.txt5, fontSize: 20, lineHeight: 1, padding: '0 2px', marginLeft: -4 }}>⋯</button>` : ''}
        ${moderating && !mine && onAdminDelete ? html`
          <button onClick=${() => { if (window.confirm(t('post.adminDelConfirm', { name: post.authorName || t('post.someone') }))) onAdminDelete(post); }} class="btn-action" title=${t('post.adminDelTitle')} style=${{ flexShrink: 0, background: C.redBg, border: `1px solid ${C.redBdr}`, borderRadius: 16, height: 30, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: C.red, fontSize: 12, fontWeight: 600, marginLeft: -2 }}>${t('common.delete')}</button>` : ''}
      </div>

      ${post.note ? html`<p style=${{ margin: '10px 0 0', padding: '0 16px', fontSize: 13.5, color: C.txt1, lineHeight: 1.5 }}>${post.note}</p>` : ''}
      ${post.photoUrl ? html`<${PhotoView} src=${post.photoUrl} alt=${post.title || ''} style=${{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', background: C.bg3, marginTop: 12 }}/>` : ''}

      <div style=${{ display: 'flex', alignItems: 'center', gap: 14, margin: '11px 16px 0', padding: '11px 0 12px', borderTop: `1px solid ${C.bdr2}` }}>
        ${stats.map((st, i) => html`
          <span key=${i} style=${{ fontSize: 12.5, color: C.txt3, whiteSpace: 'nowrap' }}>
            <b style=${{ fontFamily: F.display, fontWeight: 700, fontSize: 15, color: C.txt1 }}>${st.v}</b> ${st.u}
          </span>`)}

        <span style=${{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          <button onClick=${onReact} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12.5, color: reacted ? C.red : C.txt3 }}>
            <${SportIcon} k="heart" size=${17} color=${C.red} sw=${reacted ? 2.4 : 1.8}/>${post.reactionCount > 0 ? post.reactionCount : ''}
          </button>
          <button onClick=${onOpenComments} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12.5, color: C.txt3 }}>
            <${SportIcon} k="comment" size=${17} color=${BRAND.blue}/>${commentCount > 0 ? commentCount : ''}
          </button>
        </span>
      </div>
    </div>`;
}
