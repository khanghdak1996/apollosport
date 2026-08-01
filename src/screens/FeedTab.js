import { useState, useEffect, useRef } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC, T, BRAND, sportColor } from '../ui/theme.js';
import { Empty } from '../ui/primitives.js';
import { SportIcon } from '../ui/sportIcons.js';
import { ACTIVITIES, actLabel } from '../domain/activities.js';
import { feedPage, listenNewPosts } from '../data/repo-sessions.js';
import { t } from '../i18n.js';
import { toggleReaction } from '../data/repo-social.js';
import { PostCard } from './PostCard.js';

export function FeedTab({ me, myReactions, onReacted, onOpenComments, onOpenProfile, onManage, moderating, onAdminDelete, refreshKey }) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(null);
  const [reacted, setReacted] = useState(myReactions || new Set());
  const [newCount, setNewCount] = useState(0);
  const sentinel = useRef(null);
  const newestRef = useRef(0);

  const reset = async (tf) => {
    setLoading(true); setItems([]); setCursor(null); setDone(false); setNewCount(0);
    const { items, cursor, done } = await feedPage(null, tf);
    setItems(items); setCursor(cursor); setDone(done); setLoading(false);
    newestRef.current = items[0]?.loggedAt || 0;
  };

  useEffect(() => { reset(typeFilter); }, [typeFilter, refreshKey]);

  // Lắng nghe bài mới hơn bài đầu -> hiện pill "N bài mới".
  useEffect(() => {
    if (!newestRef.current) return;
    const unsub = listenNewPosts(newestRef.current, (fresh) => {
      const extra = fresh.filter(f => f.loggedAt > newestRef.current && (!typeFilter || f.type === typeFilter));
      if (extra.length) setNewCount(extra.length);
    });
    return unsub;
  }, [typeFilter, items.length]);

  // Cuộn tới đáy -> nạp trang tiếp.
  useEffect(() => {
    if (!sentinel.current || done) return;
    const io = new IntersectionObserver(async (es) => {
      if (es[0].isIntersecting && cursor && !loading) {
        const { items: more, cursor: c2, done: d2 } = await feedPage(cursor, typeFilter);
        setItems(prev => [...prev, ...more]); setCursor(c2); setDone(d2);
      }
    }, { rootMargin: '200px' });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [cursor, done, loading, typeFilter]);

  const react = async (post) => {
    const key = `${post.authorUid}_${post.id}`;
    const nowReacted = !reacted.has(key);
    // optimistic
    setReacted(s => { const n = new Set(s); nowReacted ? n.add(key) : n.delete(key); return n; });
    setItems(prev => prev.map(p => p === post ? { ...p, reactionCount: Math.max(0, (p.reactionCount || 0) + (nowReacted ? 1 : -1)) } : p));
    const res = await toggleReaction(key, me, 'heart');
    if (res === null) { // lỗi -> revert
      setReacted(s => { const n = new Set(s); nowReacted ? n.delete(key) : n.add(key); return n; });
    } else if (onReacted) onReacted(reacted);
  };

  const chip = (id, label, iconKey) => {
    const on = typeFilter === id;
    return html`
    <button key=${id || 'all'} onClick=${() => setTypeFilter(id)} class="btn-action" style=${{
      display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: r.pill, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
      border: `1px solid ${on ? BRAND.blue : C.bdr}`,
      background: on ? C.bg3 : C.bg2,
      color: on ? BRAND.blue : C.txt2,
    }}>${iconKey ? html`<${SportIcon} k=${iconKey} size=${15} color=${on ? BRAND.blue : sportColor(iconKey)}/>` : ''}${label}</button>`;
  };

  return html`
    <div class="fade-in">
      <div style=${{ position: 'sticky', top: 0, zIndex: 5, background: C.bg1, padding: '14px 16px 10px' }}>
        <h2 style=${{ margin: '0 0 12px', ...T.h1 }}>${t('feed.title')}</h2>
        <div style=${{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          ${chip(null, t('pe.all'))}
          ${ACTIVITIES.map(a => chip(a.id, actLabel(a.id), a.iconKey))}
        </div>
        ${newCount > 0 && html`
          <div style=${{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <button onClick=${() => reset(typeFilter)} class="btn-action" style=${{ background: ACC, color: '#fff', border: 'none', borderRadius: 20, padding: '7px 16px', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', boxShadow: '0 3px 8px var(--accent-glow)' }}>${t('feed.newPosts', { n: newCount })}</button>
          </div>`}
      </div>

      <div style=${{ padding: '0 16px' }}>
        ${loading && items.length === 0
          ? html`<p style=${{ textAlign: 'center', color: C.txt3, fontSize: 13, padding: 30 }}>${t('common.loading')}</p>`
          : items.length === 0
            ? html`<${Empty} icon="other" msg=${t('feed.emptyMsg')} sub=${t('feed.emptySub')}/>`
            : items.map(p => html`<${PostCard}
                key=${`${p.authorUid}_${p.id}`}
                post=${p}
                reacted=${reacted.has(`${p.authorUid}_${p.id}`)}
                onReact=${() => react(p)}
                onOpenComments=${() => onOpenComments(p)}
                onOpenProfile=${onOpenProfile}
                myUid=${me.uid}
                onManage=${onManage}
                moderating=${moderating}
                onAdminDelete=${onAdminDelete}
              />`)}
        ${!done && items.length > 0 && html`<div ref=${sentinel} style=${{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.txt3, fontSize: 12 }}>${t('feed.loadingMore')}</div>`}
      </div>
    </div>`;
}
