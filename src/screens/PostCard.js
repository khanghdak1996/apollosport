import { html } from '../html.js';
import { C, r } from '../ui/theme.js';
import { actOf } from '../domain/activities.js';
import { summaryStats, headline } from '../domain/session.js';
import { fDT } from '../domain/format.js';

const STAT_EMOJI = { flame: '🔥', check: '✅', clock: '⏱', route: '📏', bolt: '⚡', star: '⭐', wave: '🌊', gauge: '💨' };

function Avatar({ name, photo, color }) {
  if (photo) return html`<img src=${photo} loading="lazy" style=${{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${color}`, objectFit: 'cover', flexShrink: 0 }}/>`;
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return html`<div style=${{ width: 40, height: 40, borderRadius: '50%', background: color + '22', color, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 16, flexShrink: 0 }}>${initial}</div>`;
}

export function PostCard({ post, reacted, onReact, onOpenComments, onOpenProfile, myUid, onManage, moderating, onAdminDelete }) {
  const a = actOf(post.type);
  const stats = summaryStats(post);
  const mine = myUid && post.authorUid === myUid;
  return html`
    <div style=${{ background: '#fff', borderRadius: r.lg, marginBottom: 14, border: `1px solid ${C.bdr}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <div style=${{ display: 'flex', gap: 10, alignItems: 'center', padding: '14px 16px 10px' }}>
        <div onClick=${() => onOpenProfile && onOpenProfile(post.authorUid)} style=${{ cursor: 'pointer' }}>
          <${Avatar} name=${post.authorName} photo=${post.authorPhoto} color=${a.color}/>
        </div>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, fontSize: 13.5, color: C.txt1 }}>
            <b style=${{ fontWeight: 600 }}>${post.authorName}</b>
            <span style=${{ color: C.txt2 }}> ${headline(post)}</span>
          </p>
          <p style=${{ margin: '1px 0 0', fontSize: 11, color: C.txt3 }}>
            ${post.dept ? post.dept + ' · ' : ''}${fDT(post.loggedAt || post.startTime)}
            ${post.streakAtPost > 1 ? html`<span> · 🔥 ${post.streakAtPost} ngày</span>` : ''}
          </p>
        </div>
        <span style=${{ fontSize: 20, flexShrink: 0 }}>${a.emoji}</span>
        ${mine && onManage && html`
          <button onClick=${() => onManage(post)} class="btn-action" title="Sửa / xoá bài" style=${{ flexShrink: 0, background: 'transparent', border: 'none', cursor: 'pointer', color: C.txt3, fontSize: 20, lineHeight: 1, padding: '0 2px', marginLeft: -4 }}>⋯</button>`}
        ${moderating && !mine && onAdminDelete && html`
          <button onClick=${() => { if (window.confirm(`Xoá bài này của ${post.authorName || 'người dùng'}? (Thao tác quản trị — không hoàn tác được.)`)) onAdminDelete(post); }} class="btn-action" title="Xoá bài (quản trị)" style=${{ flexShrink: 0, background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 16, height: 30, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#7c3aed', fontSize: 12, fontWeight: 600, marginLeft: -2 }}>🛡 Xoá</button>`}
      </div>

      ${post.note && html`<p style=${{ margin: 0, padding: '0 16px 12px', fontSize: 13.5, color: C.txt1, lineHeight: 1.5 }}>${post.note}</p>`}
      ${post.photoUrl && html`<img src=${post.photoUrl} loading="lazy" style=${{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', background: C.bg3 }}/>`}

      <div style=${{ display: 'flex', gap: 18, padding: '12px 16px', borderTop: `1px solid ${C.bdr}` }}>
        ${stats.map((st, i) => html`
          <span key=${i} style=${{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: C.txt2 }}>
            <span>${STAT_EMOJI[st.icon] || '•'}</span>
            <strong style=${{ color: C.txt1, fontWeight: 600 }}>${st.v}</strong> ${st.u}
          </span>`)}
      </div>

      <div style=${{ display: 'flex', borderTop: `1px solid ${C.bdr}` }}>
        <button onClick=${onReact} class="btn-action" style=${{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', border: 'none', background: 'transparent', cursor: 'pointer', color: reacted ? '#ef4444' : C.txt2, fontSize: 13.5, fontWeight: 500 }}>
          ${reacted ? '❤️' : '🤍'} ${post.reactionCount > 0 ? post.reactionCount : ''} <span style=${{ color: C.txt2, fontWeight: 400 }}>Thích</span>
        </button>
        <div style=${{ width: 1, background: C.bdr }}/>
        <button onClick=${onOpenComments} class="btn-action" style=${{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', border: 'none', background: 'transparent', cursor: 'pointer', color: C.txt2, fontSize: 13.5, fontWeight: 500 }}>
          💬 ${post.commentCount > 0 ? post.commentCount : ''} <span style=${{ fontWeight: 400 }}>Bình luận</span>
        </button>
      </div>
    </div>`;
}
