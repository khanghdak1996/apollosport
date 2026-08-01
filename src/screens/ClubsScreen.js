import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND, sportColor, sportTint } from '../ui/theme.js';
import { Wrap, Empty, Btn } from '../ui/primitives.js';
import { SportIcon } from '../ui/sportIcons.js';
import { ACTIVITIES, actOf, actLabel } from '../domain/activities.js';
import { listClubs, myClubIds, createClub } from '../data/repo-clubs.js';
import { t } from '../i18n.js';

export function ClubsScreen({ me, onBack, onOpenClub }) {
  const [clubs, setClubs] = useState([]);
  const [mine, setMine] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  // form
  const [name, setName] = useState('');
  const [sport, setSport] = useState('run');
  const [visibility, setVisibility] = useState('public');
  const [desc, setDesc] = useState('');

  const load = async () => {
    setLoading(true);
    const [list, ids] = await Promise.all([listClubs(), myClubIds(me.uid)]);
    setClubs(list); setMine(ids); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const id = await createClub({ name, sport, desc, coverEmoji: actOf(sport).emoji, visibility }, me);
      setCreating(false); setName(''); setDesc(''); setSport('run'); setVisibility('public');
      onOpenClub(id);
    } catch (e) { setSaving(false); }
    setSaving(false);
  };

  const myClubs = clubs.filter(c => mine.has(c.id));
  const otherClubs = clubs.filter(c => !mine.has(c.id));

  const clubCard = (c) => {
    const a = actOf(c.sport);
    const joined = mine.has(c.id);
    return html`
      <div key=${c.id} onClick=${() => onOpenClub(c.id)} class="card-hover" style=${{ display: 'flex', alignItems: 'center', gap: 12, background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '13px 15px', marginBottom: 10, cursor: 'pointer' }}>
        <span style=${{ width: 46, height: 46, borderRadius: 13, background: sportTint(a.iconKey), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <${SportIcon} k=${a.iconKey} size=${24} color=${sportColor(a.iconKey)}/>
        </span>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, fontSize: 15, fontWeight: 600, color: C.txt1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${c.name}</p>
          <p style=${{ margin: '2px 0 0', fontSize: 12, color: C.txt3, display: 'flex', alignItems: 'center', gap: 5 }}>
            ${actLabel(c.sport)} · ${t('clubs.members', { n: c.memberCount || 0 })}${c.visibility === 'invite' ? html` · <${SportIcon} k="lock" size=${12} color=${C.txt4}/> ${t('clubs.privateTag')}` : ''}
          </p>
        </div>
        ${joined && html`<span style=${{ fontSize: 11, fontWeight: 700, color: BRAND.blue, background: C.bg3, borderRadius: 20, padding: '4px 10px', flexShrink: 0, letterSpacing: '.02em' }}>${t('clubs.joined')}</span>`}
        <${SportIcon} k="chevronR" size=${17} color=${C.txt5} sw=${2}/>
      </div>`;
  };

  return html`
    <${Wrap}>
      <div style=${{ padding: '12px 16px', borderBottom: `1px solid ${C.bdr}`, background: C.bg2, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <p style=${{ margin: 0, flex: 1, ...T.h2 }}>${t('clubs.title')}</p>
        <button onClick=${() => setCreating(true)} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 5, background: BRAND.blue, border: 'none', borderRadius: 20, height: 34, padding: '0 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <${SportIcon} k="plus" size=${15} color="#fff" sw=${2.4}/> ${t('clubs.create')}
        </button>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '18px 16px 80px', WebkitOverflowScrolling: 'touch' }}>
        ${loading
      ? html`<p style=${{ textAlign: 'center', color: C.txt3, fontSize: 13, padding: 30 }}>${t('common.loading')}</p>`
      : html`
            ${myClubs.length > 0 && html`
              <p style=${{ margin: '0 2px 9px', ...T.section }}>${t('clubs.mine')}</p>
              ${myClubs.map(clubCard)}
              <div style=${{ height: 14 }}/>`}
            ${otherClubs.length > 0 && html`<p style=${{ margin: '0 2px 9px', ...T.section }}>${t('clubs.discover')}</p>`}
            ${otherClubs.map(clubCard)}
            ${clubs.length === 0 && html`<${Empty} icon="people" msg=${t('clubs.emptyMsg')} sub=${t('clubs.emptySub')}/>`}`}
      </div>

      ${creating && html`
        <div style=${{ position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick=${() => !saving && setCreating(false)}>
          <div onClick=${e => e.stopPropagation()} style=${{ width: '100%', background: C.bg1, borderRadius: '20px 20px 0 0', padding: '18px 16px calc(18px + env(safe-area-inset-bottom))', maxHeight: '88%', overflowY: 'auto' }}>
            <p style=${{ margin: '0 0 16px', ...T.h2 }}>${t('clubs.createTitle')}</p>

            <p style=${{ margin: '0 0 6px 2px', ...T.label }}>${t('clubs.nameLabel')}</p>
            <input value=${name} onInput=${e => setName(e.target.value)} maxLength=${60} placeholder=${t('clubs.namePlaceholder')} style=${{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14.5, marginBottom: 14, background: C.bg2, color: C.txt1 }}/>

            <p style=${{ margin: '0 0 8px 2px', ...T.label }}>${t('clubs.sportLabel')}</p>
            <div style=${{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              ${ACTIVITIES.map(a => {
        const on = sport === a.id;
        return html`
                <button key=${a.id} onClick=${() => setSport(a.id)} class="btn-action" style=${{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: r.pill, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, border: `1px solid ${on ? BRAND.blue : C.bdr}`, background: on ? BRAND.blue : C.bg2, color: on ? '#fff' : C.txt2 }}>
                  <${SportIcon} k=${a.iconKey} size=${15} color=${on ? '#fff' : sportColor(a.iconKey)}/> ${actLabel(a.id)}
                </button>`;
      })}
            </div>

            <p style=${{ margin: '0 0 8px 2px', ...T.label }}>${t('clubs.accessLabel')}</p>
            <div style=${{ display: 'flex', gap: 8, marginBottom: 16 }}>
              ${[{ v: 'public', k: 'globe', l: t('clubs.public'), s: t('clubs.publicSub') }, { v: 'invite', k: 'lock', l: t('clubs.needApprove'), s: t('clubs.needApproveSub') }].map(o => {
        const on = visibility === o.v;
        return html`
                <button key=${o.v} onClick=${() => setVisibility(o.v)} class="btn-action" style=${{ flex: 1, textAlign: 'left', padding: '11px 13px', borderRadius: r.md, cursor: 'pointer', border: `1px solid ${on ? BRAND.blue : C.bdr}`, background: on ? C.bg3 : C.bg2 }}>
                  <p style=${{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: on ? BRAND.blue : C.txt1 }}><${SportIcon} k=${o.k} size=${14} color=${on ? BRAND.blue : C.txt3}/> ${o.l}</p>
                  <p style=${{ margin: '3px 0 0', fontSize: 11, color: C.txt3 }}>${o.s}</p>
                </button>`;
      })}
            </div>

            <p style=${{ margin: '0 0 6px 2px', ...T.label }}>${t('clubs.descLabel')}</p>
            <textarea value=${desc} onInput=${e => setDesc(e.target.value)} rows=${2} maxLength=${300} placeholder=${t('clubs.descPlaceholder')} style=${{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14, marginBottom: 16, resize: 'vertical', fontFamily: 'inherit', background: C.bg2, color: C.txt1 }}/>

            <div style=${{ display: 'flex', gap: 8 }}>
              <button onClick=${() => setCreating(false)} class="btn-action" style=${{ flex: 1, padding: '12px', borderRadius: r.md, border: `1px solid ${C.bdr}`, background: C.bg2, color: C.txt2, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>${t('common.cancel')}</button>
              <${Btn} onClick=${submit} cx=${{ flex: 1, opacity: (!name.trim() || saving) ? 0.5 : 1, pointerEvents: (!name.trim() || saving) ? 'none' : 'auto' }}>${saving ? t('clubs.creating') : t('clubs.create')}</${Btn}>
            </div>
          </div>
        </div>`}
    </${Wrap}>`;
}
