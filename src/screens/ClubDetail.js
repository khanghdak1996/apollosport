import { useState, useEffect, useRef } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Wrap, Empty } from '../ui/primitives.js';
import { Icons } from '../ui/icons.js';
import { actOf } from '../domain/activities.js';
import { toggleReaction } from '../data/repo-social.js';
import { listAllUsers } from '../data/repo-users.js';
import { listClubGoals } from '../data/repo-goals.js';
import { PostCard } from './PostCard.js';
import { GoalCard } from './GoalCard.js';
import { GoalForm } from './GoalForm.js';
import { AnnouncementFeed } from './AnnouncementFeed.js';
import {
  getClub, listMembers, listRequests, myJoinRequested,
  joinPublicClub, leaveClub, requestJoin, approveRequest, denyRequest, deleteClub, clubFeedPage,
  inviteToClub, updateClubVisibility, listClubInvites,
} from '../data/repo-clubs.js';

export function ClubDetail({ clubId, me, mySessions, myReactions, isAdmin, onBack, onOpenProfile, onOpenComments, onDeleted }) {
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reqSent, setReqSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [done, setDone] = useState(false);
  const [reacted, setReacted] = useState(myReactions || new Set());
  const sentinel = useRef(null);

  // Mời thành viên (chủ nhóm)
  const [showInvite, setShowInvite] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [uQuery, setUQuery] = useState('');
  const [invitedSet, setInvitedSet] = useState(new Set());
  const [savingVis, setSavingVis] = useState(false);
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);

  const isMember = members.some(m => m.uid === me.uid);
  const isOwner = club && club.ownerUid === me.uid;
  const memberSet = new Set(members.map(m => m.uid));

  const reload = async () => {
    setLoading(true);
    const c = await getClub(clubId);
    if (!c) { setClub(null); setLoading(false); return; }
    const mem = await listMembers(clubId);
    setClub(c); setMembers(mem);
    if (c.ownerUid === me.uid && c.visibility === 'invite') setRequests(await listRequests(clubId));
    if (c.visibility === 'invite' && !mem.some(m => m.uid === me.uid)) setReqSent(await myJoinRequested(clubId, me.uid));
    setGoals(await listClubGoals(clubId));
    setLoading(false);
    // feed: bài của thành viên, đúng môn nhóm
    const set = new Set(mem.map(m => m.uid));
    const { items, cursor, done } = await clubFeedPage(null, c.sport, set);
    setItems(items); setCursor(cursor); setDone(done);
  };
  useEffect(() => { reload(); }, [clubId]);

  useEffect(() => {
    if (!sentinel.current || done || loading) return;
    const io = new IntersectionObserver(async (es) => {
      if (es[0].isIntersecting && cursor) {
        const { items: more, cursor: c2, done: d2 } = await clubFeedPage(cursor, club.sport, memberSet);
        setItems(prev => [...prev, ...more]); setCursor(c2); setDone(d2);
      }
    }, { rootMargin: '200px' });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [cursor, done, loading, members.length]);

  const react = async (post) => {
    const key = `${post.authorUid}_${post.id}`;
    const now = !reacted.has(key);
    setReacted(s => { const n = new Set(s); now ? n.add(key) : n.delete(key); return n; });
    setItems(prev => prev.map(p => p === post ? { ...p, reactionCount: Math.max(0, (p.reactionCount || 0) + (now ? 1 : -1)) } : p));
    const res = await toggleReaction(key, me, 'heart');
    if (res === null) setReacted(s => { const n = new Set(s); now ? n.delete(key) : n.add(key); return n; });
  };

  const join = async () => { setBusy(true); try { await joinPublicClub(clubId, me); await reload(); } finally { setBusy(false); } };
  const leave = async () => { if (!window.confirm('Rời khỏi nhóm này?')) return; setBusy(true); try { await leaveClub(clubId, me.uid); await reload(); } finally { setBusy(false); } };
  const askJoin = async () => { setBusy(true); try { await requestJoin(clubId, me); setReqSent(true); } finally { setBusy(false); } };
  const approve = async (u) => { setBusy(true); try { await approveRequest(clubId, u); await reload(); } finally { setBusy(false); } };
  const deny = async (u) => { setBusy(true); try { await denyRequest(clubId, u.uid); setRequests(rs => rs.filter(x => x.uid !== u.uid)); } finally { setBusy(false); } };
  const removeClub = async () => {
    if (!window.confirm('Xoá câu lạc bộ này? Không thể hoàn tác.')) return;
    setBusy(true); await deleteClub(clubId); onDeleted && onDeleted();
  };
  const changeVisibility = async (v) => {
    if (!club || club.visibility === v || savingVis) return;
    setSavingVis(true);
    setClub(c => ({ ...c, visibility: v }));
    try { await updateClubVisibility(clubId, v); } finally { setSavingVis(false); }
  };
  const openInvite = async () => {
    setShowInvite(true); setUQuery('');
    const [users, invs] = await Promise.all([listAllUsers(), listClubInvites(clubId)]);
    setAllUsers(users);
    setInvitedSet(new Set(invs.map(i => i.toUid)));
  };
  const invite = async (u) => {
    setInvitedSet(s => new Set(s).add(u.uid));
    try { await inviteToClub(club, u, me); } catch (e) { setInvitedSet(s => { const n = new Set(s); n.delete(u.uid); return n; }); }
  };
  const inviteCandidates = () => {
    const q = uQuery.trim().toLowerCase();
    return allUsers
      .filter(u => u.uid !== me.uid && !memberSet.has(u.uid))
      .filter(u => !q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q))
      .slice(0, 30);
  };

  const a = club ? actOf(club.sport) : null;

  const actionBtn = () => {
    if (isOwner) return html`<span style=${{ fontSize: 12, fontWeight: 600, color: ACC, background: 'var(--accent-glow)', borderRadius: 16, padding: '7px 14px' }}>Chủ nhóm</span>`;
    if (isMember) return html`<button onClick=${leave} disabled=${busy} class="btn-action" style=${{ background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: 16, padding: '7px 16px', color: C.txt2, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Rời nhóm</button>`;
    if (club.visibility === 'public') return html`<button onClick=${join} disabled=${busy} class="btn-action" style=${{ background: ACC, border: 'none', borderRadius: 16, padding: '7px 18px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Tham gia</button>`;
    return reqSent
      ? html`<span style=${{ fontSize: 12, color: C.txt3, background: C.bg3, borderRadius: 16, padding: '7px 14px' }}>Đã gửi yêu cầu</span>`
      : html`<button onClick=${askJoin} disabled=${busy} class="btn-action" style=${{ background: ACC, border: 'none', borderRadius: 16, padding: '7px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Yêu cầu tham gia</button>`;
  };

  return html`
    <${Wrap} cx=${{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, background: C.bg1 }}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>
        <h2 style=${{ margin: 0, fontSize: 17, fontWeight: 600, color: C.txt1, flex: 1 }}>Câu lạc bộ</h2>
        ${club && (isOwner || isAdmin) && html`<button onClick=${removeClub} class="btn-action" title="Xoá nhóm" style=${{ background: '#fef2f2', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.red }}><${Icons.trash} size=${16}/></button>`}
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        ${loading
          ? html`<p style=${{ textAlign: 'center', color: C.txt3, fontSize: 13, padding: 40 }}>Đang tải...</p>`
          : !club
            ? html`<${Empty} icon="🤔" msg="Nhóm không tồn tại"/>`
            : html`
              <div style=${{ padding: '20px 16px', textAlign: 'center', borderBottom: `1px solid ${C.bdr}`, background: '#fff' }}>
                <div style=${{ width: 64, height: 64, borderRadius: 18, margin: '0 auto 10px', background: a.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>${club.coverEmoji || a.emoji}</div>
                <h1 style=${{ margin: '0 0 4px', fontSize: 21, fontWeight: 600, color: C.txt1 }}>${club.name}</h1>
                <p style=${{ margin: '0 0 4px', fontSize: 12.5, color: C.txt3 }}>${a.label} · ${club.memberCount || 0} thành viên${club.visibility === 'invite' ? ' · 🔒 Cần duyệt' : ''}</p>
                ${club.desc && html`<p style=${{ margin: '8px auto 0', fontSize: 13, color: C.txt2, lineHeight: 1.5, maxWidth: 360 }}>${club.desc}</p>`}
                <div style=${{ marginTop: 14 }}>${actionBtn()}</div>
              </div>

              ${isOwner && html`
                <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}` }}>
                  <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style=${{ fontSize: 12.5, fontWeight: 600, color: C.txt2 }}>Quản lý nhóm</span>
                    <button onClick=${openInvite} class="btn-action" style=${{ background: ACC, border: 'none', borderRadius: 16, padding: '7px 14px', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>＋ Mời thành viên</button>
                  </div>
                  <p style=${{ margin: '0 0 6px', fontSize: 11.5, color: C.txt3 }}>Cổng vào nhóm</p>
                  <div style=${{ display: 'flex', gap: 8 }}>
                    ${[{ v: 'public', l: '🌐 Công khai' }, { v: 'invite', l: '🔒 Cần duyệt' }].map(o => html`
                      <button key=${o.v} onClick=${() => changeVisibility(o.v)} disabled=${savingVis} class="btn-action" style=${{ flex: 1, padding: '9px', borderRadius: r.md, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, border: `1px solid ${club.visibility === o.v ? ACC : C.bdr}`, background: club.visibility === o.v ? 'var(--accent-glow)' : '#fff', color: club.visibility === o.v ? ACC : C.txt2 }}>${o.l}</button>`)}
                  </div>
                  <p style=${{ margin: '8px 0 0', fontSize: 11, color: C.txt3, lineHeight: 1.5 }}>${club.visibility === 'public' ? 'Ai cũng vào được ngay.' : 'Người mới phải gửi yêu cầu, bạn duyệt. Người được mời vào thẳng.'}</p>
                </div>`}

              ${isOwner && club.visibility === 'invite' && requests.length > 0 && html`
                <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}` }}>
                  <p style=${{ margin: '0 0 10px', fontSize: 12.5, fontWeight: 600, color: C.txt2 }}>Yêu cầu tham gia (${requests.length})</p>
                  ${requests.map(u => html`
                    <div key=${u.uid} style=${{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      ${u.photoURL ? html`<img src=${u.photoURL} style=${{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}/>` : html`<div style=${{ width: 30, height: 30, borderRadius: '50%', background: C.bg3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: C.txt2 }}>${(u.name || '?').charAt(0).toUpperCase()}</div>`}
                      <span style=${{ flex: 1, fontSize: 13, color: C.txt1 }}>${u.name}</span>
                      <button onClick=${() => approve(u)} disabled=${busy} class="btn-action" style=${{ background: ACC, border: 'none', borderRadius: 14, padding: '5px 12px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Duyệt</button>
                      <button onClick=${() => deny(u)} disabled=${busy} class="btn-action" style=${{ background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: 14, padding: '5px 10px', color: C.txt3, fontSize: 12, cursor: 'pointer' }}>Từ chối</button>
                    </div>`)}
                </div>`}

              <div style=${{ padding: '14px 16px 4px' }}>
                <div style=${{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                  ${members.slice(0, 12).map(m => html`
                    <button key=${m.uid} onClick=${() => onOpenProfile && onOpenProfile(m.uid)} class="btn-action" title=${m.name} style=${{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                      ${m.photoURL ? html`<img src=${m.photoURL} style=${{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}/>` : html`<div style=${{ width: 30, height: 30, borderRadius: '50%', background: C.bg3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: C.txt2 }}>${(m.name || '?').charAt(0).toUpperCase()}</div>`}
                    </button>`)}
                  ${members.length > 12 && html`<span style=${{ fontSize: 12, color: C.txt3, alignSelf: 'center' }}>+${members.length - 12}</span>`}
                </div>
              </div>

              <div style=${{ padding: '14px 16px 4px' }}>
                <${AnnouncementFeed} parent=${['clubs', clubId]} canPost=${isOwner || isAdmin} me=${me} isAdmin=${isAdmin}/>
              </div>

              <div style=${{ padding: '8px 16px 4px' }}>
                <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <p style=${{ margin: 0, fontSize: 13, fontWeight: 600, color: C.txt2 }}>🎯 Mục tiêu nhóm</p>
                  ${isOwner && html`<button onClick=${() => setShowGoalForm(true)} class="btn-action" style=${{ background: 'var(--accent-glow)', border: 'none', borderRadius: 14, padding: '6px 12px', color: ACC, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>＋ Tạo</button>`}
                </div>
                ${goals.length === 0
                  ? html`<p style=${{ margin: '0 0 8px', fontSize: 12.5, color: C.txt3 }}>Chưa có mục tiêu nào.${isOwner ? ' Tạo một mục tiêu để cả nhóm cùng phấn đấu!' : ''}</p>`
                  : goals.map(g => html`<${GoalCard} key=${g.id} goal=${g} me=${me} mySessions=${mySessions} canContribute=${isMember} isAdmin=${isAdmin} onDeleted=${() => setGoals(gs => gs.filter(x => x.id !== g.id))}/>`)}
              </div>

              <div style=${{ padding: '8px 16px 20px' }}>
                <p style=${{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: C.txt2 }}>Hoạt động của nhóm · ${a.emoji} ${a.label}</p>
                ${items.length === 0
                  ? html`<${Empty} icon=${a.emoji} msg="Chưa có buổi ${a.label.toLowerCase()} nào" sub="Thành viên đăng buổi tập sẽ hiện ở đây"/>`
                  : items.map(p => html`<${PostCard}
                      key=${`${p.authorUid}_${p.id}`}
                      post=${p}
                      reacted=${reacted.has(`${p.authorUid}_${p.id}`)}
                      onReact=${() => react(p)}
                      onOpenComments=${() => onOpenComments(p)}
                      onOpenProfile=${onOpenProfile}
                      myUid=${me.uid}
                    />`)}
                ${!done && items.length > 0 && html`<div ref=${sentinel} style=${{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.txt3, fontSize: 12 }}>Đang tải thêm...</div>`}
              </div>`}
      </div>

      ${showInvite && html`
        <div style=${{ position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick=${() => setShowInvite(false)}>
          <div onClick=${e => e.stopPropagation()} style=${{ width: '100%', background: C.bg1, borderRadius: '20px 20px 0 0', padding: '18px 16px calc(18px + env(safe-area-inset-bottom))', maxHeight: '80%', display: 'flex', flexDirection: 'column' }}>
            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: C.txt1 }}>Mời vào nhóm</h3>
              <button onClick=${() => setShowInvite(false)} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: C.txt2 }}>×</button>
            </div>
            <input value=${uQuery} onInput=${e => setUQuery(e.target.value)} placeholder="Tìm theo tên hoặc email..." style=${{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14, marginBottom: 12, background: '#fff', color: C.txt1 }}/>
            <div style=${{ flex: 1, overflowY: 'auto' }}>
              ${inviteCandidates().length === 0
                ? html`<p style=${{ textAlign: 'center', color: C.txt3, fontSize: 13, padding: 20 }}>${uQuery.trim() ? 'Không tìm thấy ai phù hợp' : 'Nhập tên hoặc email để tìm'}</p>`
                : inviteCandidates().map(u => {
                  const done = invitedSet.has(u.uid);
                  return html`
                    <div key=${u.uid} style=${{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 2px' }}>
                      ${u.photoURL ? html`<img src=${u.photoURL} style=${{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}/>` : html`<div style=${{ width: 34, height: 34, borderRadius: '50%', background: C.bg3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: C.txt2 }}>${(u.name || '?').charAt(0).toUpperCase()}</div>`}
                      <div style=${{ flex: 1, minWidth: 0 }}>
                        <p style=${{ margin: 0, fontSize: 13.5, fontWeight: 500, color: C.txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${u.name || u.email}</p>
                        <p style=${{ margin: 0, fontSize: 11, color: C.txt3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${[u.dept, u.email].filter(Boolean).join(' · ')}</p>
                      </div>
                      ${done
                        ? html`<span style=${{ fontSize: 12, color: C.txt3, flexShrink: 0 }}>✓ Đã mời</span>`
                        : html`<button onClick=${() => invite(u)} class="btn-action" style=${{ background: 'var(--accent-glow)', border: 'none', borderRadius: 14, padding: '6px 13px', color: ACC, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Mời</button>`}
                    </div>`;
                })}
            </div>
          </div>
        </div>`}

      ${showGoalForm && club && html`<${GoalForm} scope="club" clubId=${clubId} clubName=${club.name} clubSport=${club.sport} me=${me} onClose=${() => setShowGoalForm(false)} onCreated=${async () => { setShowGoalForm(false); setGoals(await listClubGoals(clubId)); }}/>`}
    </${Wrap}>`;
}
