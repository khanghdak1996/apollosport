import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Wrap, Empty } from '../ui/primitives.js';
import { Icons } from '../ui/icons.js';
import { fDT } from '../domain/format.js';
import { listenComments, addComment, editComment, deleteComment } from '../data/repo-social.js';

export function CommentsSheet({ post, me, canModerate, onClose }) {
  const sidFull = `${post.authorUid}_${post.id}`;
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [editId, setEditId] = useState(null);   // id bình luận đang sửa
  const [editText, setEditText] = useState('');

  useEffect(() => listenComments(sidFull, setComments), [sidFull]);

  const send = async () => {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setText('');
    await addComment(sidFull, me, t);
    setSending(false);
  };

  const startEdit = (c) => { setEditId(c.id); setEditText(c.text || ''); };
  const saveEdit = async () => {
    const t = editText.trim();
    if (!t) return;
    if (!window.confirm('Lưu thay đổi bình luận?')) return;
    await editComment(sidFull, editId, t);
    setEditId(null); setEditText('');
  };

  const removeComment = (c) => {
    if (window.confirm('Xoá bình luận này?')) deleteComment(sidFull, c.id);
  };

  const canDelete = (c) => c.uid === me.uid || post.authorUid === me.uid || canModerate;
  const canEdit = (c) => c.uid === me.uid;

  return html`
    <${Wrap}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onClose} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>
        <h2 style=${{ margin: 0, fontSize: 17, fontWeight: 600, color: C.txt1 }}>Bình luận</h2>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '14px 16px', WebkitOverflowScrolling: 'touch' }}>
        ${comments.length === 0
          ? html`<${Empty} icon="comment" msg="Chưa có bình luận" sub="Hãy động viên đồng nghiệp một câu!"/>`
          : comments.map(c => html`
            <div key=${c.id} style=${{ display: 'flex', gap: 10, marginBottom: 14 }}>
              ${c.photoURL
                ? html`<img src=${c.photoURL} style=${{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}/>`
                : html`<div style=${{ width: 32, height: 32, borderRadius: '50%', background: C.bg3, color: C.txt2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>${(c.name || '?').charAt(0).toUpperCase()}</div>`}
              <div style=${{ flex: 1, minWidth: 0 }}>
                ${editId === c.id
                ? html`
                  <div>
                    <textarea value=${editText} onInput=${e => setEditText(e.target.value)} rows=${2} maxLength=${500} style=${{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 13.5, background: '#fff', color: C.txt1, resize: 'vertical', fontFamily: 'inherit' }}/>
                    <div style=${{ display: 'flex', gap: 12, marginTop: 4, paddingLeft: 4 }}>
                      <button onClick=${saveEdit} style=${{ background: 'none', border: 'none', color: ACC, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', padding: 0 }}>Lưu</button>
                      <button onClick=${() => { setEditId(null); setEditText(''); }} style=${{ background: 'none', border: 'none', color: C.txt3, fontSize: 11.5, cursor: 'pointer', padding: 0 }}>Huỷ</button>
                    </div>
                  </div>`
                : html`
                  <div>
                    <div style=${{ background: C.bg3, borderRadius: r.md, padding: '8px 12px' }}>
                      <p style=${{ margin: '0 0 2px', fontSize: 12.5, fontWeight: 600, color: C.txt1 }}>${c.name}</p>
                      <p style=${{ margin: 0, fontSize: 13.5, color: C.txt1, lineHeight: 1.45, wordBreak: 'break-word' }}>${c.text}</p>
                    </div>
                    <div style=${{ display: 'flex', gap: 12, marginTop: 3, paddingLeft: 4 }}>
                      <span style=${{ fontSize: 10.5, color: C.txt3 }}>${c.createdAt?.toDate ? fDT(c.createdAt.toDate().getTime()) : ''}${c.editedAt ? ' · đã sửa' : ''}</span>
                      ${canEdit(c) && html`<button onClick=${() => startEdit(c)} style=${{ background: 'none', border: 'none', color: C.txt3, fontSize: 10.5, cursor: 'pointer', padding: 0 }}>Sửa</button>`}
                      ${canDelete(c) && html`<button onClick=${() => removeComment(c)} style=${{ background: 'none', border: 'none', color: C.txt3, fontSize: 10.5, cursor: 'pointer', padding: 0 }}>Xoá</button>`}
                    </div>
                  </div>`}
              </div>
            </div>`)}
      </div>

      <div style=${{ borderTop: `1px solid ${C.bdr}`, padding: '10px 12px', background: '#fff', display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}>
        <input value=${text} onInput=${e => setText(e.target.value)} onKeyDown=${e => { if (e.key === 'Enter') send(); }} placeholder="Viết bình luận..." maxLength=${500} style=${{ flex: 1, boxSizing: 'border-box', padding: '11px 14px', borderRadius: 22, border: `1px solid ${C.bdr}`, fontSize: 14, background: C.bg3 }}/>
        <button onClick=${send} class="btn-action" style=${{ background: ACC, border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', flexShrink: 0, opacity: text.trim() ? 1 : 0.5 }}>➤</button>
      </div>
    </${Wrap}>`;
}
