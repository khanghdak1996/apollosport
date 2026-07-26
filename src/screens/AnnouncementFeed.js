import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { fDT } from '../domain/format.js';
import { listAnnouncements, addAnnouncement, deleteAnnouncement } from '../data/repo-posts.js';

// Feed thông báo 1 chiều: người có quyền (canPost) đăng text, mọi người đọc.
// parent = ['clubs', clubId] hoặc ['goals', goalId]. Lazy-load khi mở.
export function AnnouncementFeed({ parent, canPost, me, isAdmin }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => { setPosts(await listAnnouncements(parent)); setLoaded(true); };
  const toggle = () => { const n = !open; setOpen(n); if (n && !loaded) load(); };

  const post = async () => {
    const t = text.trim();
    if (!t || busy) return;
    setBusy(true);
    try {
      const id = await addAnnouncement(parent, me, t);
      setPosts(p => [{ id, authorUid: me.uid, authorName: me.name || '', text: t, createdAt: { toDate: () => new Date() } }, ...p]);
      setText('');
    } finally { setBusy(false); }
  };
  const del = async (p) => {
    if (!window.confirm('Xoá thông báo này?')) return;
    setPosts(list => list.filter(x => x.id !== p.id));
    try { await deleteAnnouncement(parent, p.id); } catch { }
  };

  return html`
    <div style=${{ background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.lg, overflow: 'hidden', marginBottom: 12 }}>
      <button onClick=${toggle} class="btn-action" style=${{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '13px 15px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style=${{ fontSize: 16 }}>📢</span>
        <span style=${{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.txt1 }}>Thông báo${loaded && posts.length ? ` (${posts.length})` : ''}</span>
        <span style=${{ color: C.txt3, fontSize: 13, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
      </button>

      ${open && html`
        <div style=${{ padding: '0 15px 14px' }}>
          ${canPost && html`
            <div style=${{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <textarea value=${text} onInput=${e => setText(e.target.value)} rows=${2} maxLength=${2000} placeholder="Đăng thông báo cho mọi người..." style=${{ flex: 1, boxSizing: 'border-box', padding: '9px 11px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 13.5, resize: 'vertical', fontFamily: 'inherit', background: '#fff', color: C.txt1 }}/>
              <button onClick=${post} class="btn-action" style=${{ alignSelf: 'flex-end', background: ACC, border: 'none', borderRadius: r.md, padding: '9px 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: text.trim() ? 1 : 0.5 }}>Đăng</button>
            </div>`}
          ${!loaded
            ? html`<p style=${{ margin: 0, fontSize: 12.5, color: C.txt3, textAlign: 'center', padding: 10 }}>Đang tải...</p>`
            : posts.length === 0
              ? html`<p style=${{ margin: 0, fontSize: 12.5, color: C.txt3, textAlign: 'center', padding: 10 }}>Chưa có thông báo nào.</p>`
              : posts.map(p => html`
                <div key=${p.id} style=${{ padding: '10px 0', borderTop: `1px solid ${C.bdr}` }}>
                  <div style=${{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style=${{ fontSize: 12.5, fontWeight: 600, color: C.txt1 }}>${p.authorName || '—'}</span>
                    <span style=${{ fontSize: 10.5, color: C.txt3, flex: 1 }}>${p.createdAt?.toDate ? fDT(p.createdAt.toDate().getTime()) : ''}</span>
                    ${(p.authorUid === me.uid || canPost || isAdmin) && html`<button onClick=${() => del(p)} class="btn-action" style=${{ background: 'none', border: 'none', color: C.txt3, fontSize: 11, cursor: 'pointer', padding: 0 }}>Xoá</button>`}
                  </div>
                  <p style=${{ margin: '3px 0 0', fontSize: 13.5, color: C.txt1, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>${p.text}</p>
                </div>`)}
        </div>`}
    </div>`;
}
