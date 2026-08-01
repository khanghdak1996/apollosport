import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { fDT } from '../domain/format.js';
import { listAnnouncements, addAnnouncement, editAnnouncement, deleteAnnouncement } from '../data/repo-posts.js';
import { t } from '../i18n.js';

// Feed thông báo 1 chiều: người có quyền (canPost) đăng text + ẢNH (F6), mọi người đọc.
// "Sửa" = xoá + tạo lại (rules không có update). parent = ['clubs', clubId] hoặc ['goals', goalId].
export function AnnouncementFeed({ parent, canPost, me, isAdmin }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [busy, setBusy] = useState(false);

  // Soạn thông báo mới
  const [text, setText] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  // Sửa thông báo (theo id)
  const [editId, setEditId] = useState(null);
  const [eText, setEText] = useState('');
  const [eImgFile, setEImgFile] = useState(null);
  const [eImgPreview, setEImgPreview] = useState(null);
  const [eRemoveImg, setERemoveImg] = useState(false);

  const load = async () => { setPosts(await listAnnouncements(parent)); setLoaded(true); };
  const toggle = () => { const n = !open; setOpen(n); if (n && !loaded) load(); };

  const pickImg = e => { const f = e.target.files[0]; if (!f) return; setImgFile(f); setImgPreview(URL.createObjectURL(f)); };
  const clearImg = e => { e && e.preventDefault(); e && e.stopPropagation(); setImgFile(null); setImgPreview(null); };

  const post = async () => {
    const msg = text.trim();
    if ((!msg && !imgFile) || busy) return;
    setBusy(true);
    try {
      const created = await addAnnouncement(parent, me, msg, imgFile);
      setPosts(p => [{ ...created, createdAt: { toDate: () => new Date() } }, ...p]);
      setText(''); clearImg();
    } catch (e) { window.alert(t('ann.postFail')); }
    finally { setBusy(false); }
  };

  const openEdit = (p) => { setEditId(p.id); setEText(p.text || ''); setEImgFile(null); setEImgPreview(null); setERemoveImg(false); };
  const cancelEdit = () => { setEditId(null); setEImgFile(null); setEImgPreview(null); setERemoveImg(false); };
  const pickEImg = e => { const f = e.target.files[0]; if (!f) return; setEImgFile(f); setEImgPreview(URL.createObjectURL(f)); setERemoveImg(false); };

  const saveEdit = async (oldPost) => {
    const msg = eText.trim();
    const willKeep = !eImgFile && !eRemoveImg && !!oldPost.imageUrl;
    if ((!msg && !eImgFile && !willKeep) || busy) return;
    setBusy(true);
    try {
      const updated = await editAnnouncement(parent, me, oldPost, msg, eImgFile, willKeep);
      setPosts(list => list.map(x => x.id === oldPost.id ? { ...updated, createdAt: { toDate: () => new Date() } } : x));
      cancelEdit();
    } catch (e) { window.alert(t('ann.editFail')); }
    finally { setBusy(false); }
  };

  const del = async (p) => {
    if (!window.confirm(t('ann.delConfirm'))) return;
    setPosts(list => list.filter(x => x.id !== p.id));
    try { await deleteAnnouncement(parent, p); } catch { }
  };

  const canManage = (p) => p.authorUid === me.uid || canPost || isAdmin;

  return html`
    <div style=${{ background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.lg, overflow: 'hidden', marginBottom: 12 }}>
      <button onClick=${toggle} class="btn-action" style=${{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '13px 15px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <${SportIcon} k="bell" size=${16} color=${ACC}/>
        <span style=${{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.txt1 }}>${t('ann.title')}${loaded && posts.length ? ` (${posts.length})` : ''}</span>
        <span style=${{ color: C.txt3, fontSize: 13, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
      </button>

      ${open && html`
        <div style=${{ padding: '0 15px 14px' }}>
          ${canPost && html`
            <div style=${{ marginBottom: 12 }}>
              <div style=${{ display: 'flex', gap: 8 }}>
                <textarea value=${text} onInput=${e => setText(e.target.value)} rows=${2} maxLength=${2000} placeholder=${t('ann.postPlaceholder')} style=${{ flex: 1, boxSizing: 'border-box', padding: '9px 11px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 13.5, resize: 'vertical', fontFamily: 'inherit', background: '#fff', color: C.txt1 }}/>
                <button onClick=${post} class="btn-action" style=${{ alignSelf: 'flex-end', background: ACC, border: 'none', borderRadius: r.md, padding: '9px 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: (text.trim() || imgFile) && !busy ? 1 : 0.5 }}>${t('ann.post')}</button>
              </div>
              ${imgPreview && html`
                <div style=${{ position: 'relative', marginTop: 8, borderRadius: r.md, overflow: 'hidden', maxWidth: 220 }}>
                  <img src=${imgPreview} style=${{ width: '100%', maxHeight: 150, objectFit: 'cover', display: 'block' }}/>
                  <button onClick=${clearImg} style=${{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 26, height: 26, color: '#fff', cursor: 'pointer', fontSize: 15 }}>×</button>
                </div>`}
              ${!imgPreview && html`
                <label style=${{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, cursor: 'pointer', fontSize: 12.5, color: C.txt3 }}>
                  <input type="file" accept="image/*" style=${{ display: 'none' }} onChange=${pickImg}/>
                  <span style=${{ fontSize: 15 }}>📷</span> ${t('photo.short')}
                </label>`}
            </div>`}
          ${!loaded
      ? html`<p style=${{ margin: 0, fontSize: 12.5, color: C.txt3, textAlign: 'center', padding: 10 }}>${t('common.loading')}</p>`
      : posts.length === 0
        ? html`<p style=${{ margin: 0, fontSize: 12.5, color: C.txt3, textAlign: 'center', padding: 10 }}>${t('ann.empty')}</p>`
        : posts.map(p => editId === p.id
          ? html`
                <div key=${p.id} style=${{ padding: '10px 0', borderTop: `1px solid ${C.bdr}` }}>
                  <textarea value=${eText} onInput=${e => setEText(e.target.value)} rows=${2} maxLength=${2000} style=${{ width: '100%', boxSizing: 'border-box', padding: '9px 11px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 13.5, resize: 'vertical', fontFamily: 'inherit', background: '#fff', color: C.txt1 }}/>
                  ${(eImgPreview || (!eRemoveImg && p.imageUrl))
        ? html`<div style=${{ position: 'relative', marginTop: 8, borderRadius: r.md, overflow: 'hidden', maxWidth: 220 }}>
                        <img src=${eImgPreview || p.imageUrl} style=${{ width: '100%', maxHeight: 150, objectFit: 'cover', display: 'block' }}/>
                        <button onClick=${e => { e.preventDefault(); setEImgFile(null); setEImgPreview(null); setERemoveImg(true); }} title="Gỡ ảnh" style=${{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 26, height: 26, color: '#fff', cursor: 'pointer', fontSize: 15 }}>×</button>
                      </div>`
        : html`<label style=${{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, cursor: 'pointer', fontSize: 12.5, color: C.txt3 }}>
                        <input type="file" accept="image/*" style=${{ display: 'none' }} onChange=${pickEImg}/>
                        <span style=${{ fontSize: 15 }}>📷</span> ${eRemoveImg ? t('sd.photoRemoved') : t('photo.short')}
                      </label>`}
                  <div style=${{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button onClick=${cancelEdit} class="btn-action" style=${{ flex: 1, padding: '8px', borderRadius: r.md, border: `1px solid ${C.bdr}`, background: '#fff', color: C.txt2, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>${t('common.cancel')}</button>
                    <button onClick=${() => saveEdit(p)} class="btn-action" style=${{ flex: 1, padding: '8px', borderRadius: r.md, border: 'none', background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>${t('common.save')}</button>
                  </div>
                </div>`
          : html`
                <div key=${p.id} style=${{ padding: '10px 0', borderTop: `1px solid ${C.bdr}` }}>
                  <div style=${{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style=${{ fontSize: 12.5, fontWeight: 600, color: C.txt1 }}>${p.authorName || '—'}</span>
                    <span style=${{ fontSize: 10.5, color: C.txt3, flex: 1 }}>${p.createdAt?.toDate ? fDT(p.createdAt.toDate().getTime()) : ''}</span>
                    ${canManage(p) && html`<button onClick=${() => openEdit(p)} class="btn-action" style=${{ background: 'none', border: 'none', color: ACC, fontSize: 11, cursor: 'pointer', padding: 0 }}>${t('common.edit')}</button>`}
                    ${canManage(p) && html`<button onClick=${() => del(p)} class="btn-action" style=${{ background: 'none', border: 'none', color: C.txt3, fontSize: 11, cursor: 'pointer', padding: 0 }}>${t('common.delete')}</button>`}
                  </div>
                  ${p.text && html`<p style=${{ margin: '3px 0 0', fontSize: 13.5, color: C.txt1, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>${p.text}</p>`}
                  ${p.imageUrl && html`<img src=${p.imageUrl} loading="lazy" style=${{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: r.md, marginTop: 8, display: 'block' }}/>`}
                </div>`)}
        </div>`}
    </div>`;
}
