// src/screens/Settings.js — bản redesign. THAY TOÀN BỘ file cũ.
// Khác bản cũ: 4 nhóm có tiêu đề in hoa, toggle 46x28, và "Xoá lịch sử" chuyển
// từ tab Cá nhân về đây.
import { useState, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';
import { DEPARTMENTS } from '../data/departments.js';
import { t, getLang, setLang, SUPPORTED } from '../i18n.js';
import { pushStatus, enablePush, disablePush } from '../data/push.js';

// Chọn ngôn ngữ giao diện — mỗi nhãn tự viết bằng chính ngôn ngữ đó.
function LangPicker() {
  const cur = getLang();
  return html`
    <div style=${{ display: 'flex', gap: 8, padding: '12px 0' }}>
      ${SUPPORTED.map(l => html`
        <button key=${l} onClick=${() => setLang(l)} class="btn-action" style=${{
      flex: 1, padding: '11px 0', borderRadius: r.md, fontSize: 14, fontWeight: 600, cursor: 'pointer',
      background: l === cur ? BRAND.blue : C.bg1, color: l === cur ? '#fff' : C.txt2,
      border: `1px solid ${l === cur ? BRAND.blue : C.bdr}`,
    }}>${t('lang.' + l)}</button>`)}
    </div>`;
}

function Field({ label, value, onInput, placeholder, first }) {
  return html`
    <div style=${{ padding: '13px 0', borderTop: first ? 'none' : `1px solid ${C.bdr2}` }}>
      <p style=${{ margin: '0 0 4px', ...T.label }}>${label}</p>
      <input value=${value} onInput=${onInput} placeholder=${placeholder}
        style=${{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: 'none', outline: 'none', fontSize: 15, fontWeight: 600, color: C.txt1, fontFamily: F.body, padding: 0 }}/>
    </div>`;
}

// Dropdown chọn từ danh sách + ô tìm kiếm (gõ để lọc, cuộn để xem hết).
function SelectField({ label, value, options, placeholder, onChange, first }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();
  const shown = ql ? options.filter(o => o.toLowerCase().includes(ql)) : options;
  return html`
    <div style=${{ padding: '13px 0', borderTop: first ? 'none' : `1px solid ${C.bdr2}`, position: 'relative' }}>
      <p style=${{ margin: '0 0 4px', ...T.label }}>${label}</p>
      <div style=${{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input value=${open ? q : (value || '')} onFocus=${() => { setOpen(true); setQ(''); }}
          onBlur=${() => setTimeout(() => setOpen(false), 120)}
          onInput=${e => setQ(e.target.value)} placeholder=${placeholder}
          style=${{ flex: 1, boxSizing: 'border-box', background: 'transparent', border: 'none', outline: 'none', fontSize: 15, fontWeight: 600, color: C.txt1, fontFamily: F.body, padding: 0 }}/>
        <${SportIcon} k="chevronR" size=${15} color=${C.txt5} sw=${2} cx=${{ transform: open ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform .2s' }}/>
      </div>
      ${open && html`
        <div style=${{ position: 'absolute', left: -6, right: -6, top: '100%', zIndex: 30, marginTop: 6, background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.md, boxShadow: '0 12px 30px rgba(18,57,94,.16)', maxHeight: 240, overflowY: 'auto' }}>
          ${shown.length
      ? shown.map((o, i) => html`
            <div key=${o} onMouseDown=${() => { onChange(o); setOpen(false); setQ(''); }} style=${{ padding: '10px 14px', fontSize: 14, color: o === value ? BRAND.blue : C.txt1, fontWeight: o === value ? 700 : 500, cursor: 'pointer', borderTop: i ? `1px solid ${C.bdr2}` : 'none' }}>${o}</div>`)
      : html`<div style=${{ padding: '12px 14px', fontSize: 13, color: C.txt3 }}>${t('common.notFound', { q })}</div>`}
        </div>`}
    </div>`;
}

function Toggle({ on, onToggle }) {
  return html`
    <button onClick=${onToggle} class="btn-action" style=${{
      width: 46, height: 28, borderRadius: 14, border: 'none', padding: 0, position: 'relative',
      background: on ? BRAND.blue : '#C4D3E0', cursor: 'pointer', flexShrink: 0, transition: 'background .2s',
    }}>
      <span style=${{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .2s' }}/>
    </button>`;
}

function Row({ t, s, on, onToggle, first }) {
  return html`
    <div style=${{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: first ? 'none' : `1px solid ${C.bdr2}` }}>
      <div style=${{ flex: 1, minWidth: 0 }}>
        <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.txt1 }}>${t}</p>
        <p style=${{ margin: '2px 0 0', fontSize: 12, lineHeight: 1.45, color: C.txt4 }}>${s}</p>
      </div>
      <${Toggle} on=${on} onToggle=${onToggle}/>
    </div>`;
}

const GroupTitle = ({ t }) => html`<p style=${{ margin: '0 2px 9px', fontFamily: F.display, fontWeight: 700, fontSize: 13, letterSpacing: '.11em', color: C.txt3, textTransform: 'uppercase' }}>${t}</p>`;
const Panel = ({ children, cx }) => html`<div style=${{ background: C.bg2, border: `1px solid ${C.bdr}`, borderRadius: r.xl, padding: '0 16px', marginBottom: 20, ...cx }}>${children}</div>`;

export function Settings({ profile, onSave, onBack, onSignOut, onDeleteAccount, onClearHistory, isAdmin, onToggleModerating }) {
  const [name, setName] = useState(profile.name || '');
  const [dept, setDept] = useState(profile.dept || '');
  const [inRank, setInRank] = useState(profile.leaderboardOptIn !== false);
  const [hideWeight, setHideWeight] = useState(!!profile.hideWeight);
  const [moderating, setModerating] = useState(!!profile.moderating);
  const [pushOn, setPushOn] = useState(false);

  useEffect(() => { pushStatus().then(s => setPushOn(s === 'on')); }, []);

  const onTogglePush = async () => {
    const s = await pushStatus();
    if (s === 'unconfigured') return window.alert(t('settings.pushUnconfigured'));
    if (s === 'unsupported') return window.alert(t('settings.pushUnsupported'));
    if (s === 'denied') return window.alert(t('settings.pushDenied'));
    if (s === 'on') { await disablePush(); setPushOn(false); return; }
    const res = await enablePush();
    if (res.ok) { setPushOn(true); return; }
    setPushOn(false);
    if (res.reason === 'denied') window.alert(t('settings.pushDenied'));
    else if (res.reason === 'unsupported') window.alert(t('settings.pushUnsupported'));
    else if (res.reason === 'unconfigured') window.alert(t('settings.pushUnconfigured'));
  };

  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.bg2, borderBottom: `1px solid ${C.bdr}`, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <p style=${{ flex: 1, margin: 0, ...T.h2 }}>${t('settings.title')}</p>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '18px 16px 40px' }}>
        <${GroupTitle} t=${t('settings.profile')}/>
        <${Panel} cx=${{ padding: '4px 16px 16px' }}>
          <${Field} first=${true} label=${t('settings.name')} value=${name} onInput=${e => setName(e.target.value)} placeholder=${t('settings.namePlaceholder')}/>
          <${SelectField} label=${t('settings.dept')} value=${dept} options=${DEPARTMENTS} onChange=${setDept} placeholder=${t('ob.deptPlaceholder')}/>
          <button onClick=${() => onSave({ name, dept, leaderboardOptIn: inRank, hideWeight, moderating })} class="btn-action" style=${{ width: '100%', background: BRAND.blue, border: 'none', borderRadius: 13, padding: 12, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', marginTop: 6 }}>${t('settings.saveProfile')}</button>
        </${Panel}>

        <${GroupTitle} t=${t('lang.title')}/>
        <${Panel} cx=${{ padding: '4px 16px' }}>
          <${LangPicker}/>
        </${Panel}>

        <${GroupTitle} t=${t('settings.privacy')}/>
        <${Panel}>
          <${Row} first=${true} t=${t('settings.rank')} s=${t('settings.rankSub')} on=${inRank} onToggle=${() => setInRank(!inRank)}/>
          <${Row} t=${t('settings.push')} s=${t('settings.pushSub')} on=${pushOn} onToggle=${onTogglePush}/>
          <${Row} t=${t('settings.hideWeight')} s=${t('settings.hideWeightSub')} on=${hideWeight} onToggle=${() => setHideWeight(!hideWeight)}/>
          ${isAdmin ? html`<${Row} t=${t('settings.moderation')} s=${t('settings.moderationSub')} on=${moderating} onToggle=${() => { const nv = !moderating; setModerating(nv); onToggleModerating && onToggleModerating(nv); }}/>` : ''}
        </${Panel}>

        <${GroupTitle} t=${t('settings.account')}/>
        <${Panel} cx=${{ marginBottom: 16 }}>
          <div onClick=${onSignOut} style=${{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', cursor: 'pointer' }}>
            <p style=${{ margin: 0, flex: 1, fontSize: 14.5, fontWeight: 600, color: C.txt1 }}>${t('settings.signOut')}</p>
            <${SportIcon} k="chevronR" size=${17} color=${C.txt5} sw=${2}/>
          </div>
          <div onClick=${() => { if (window.confirm(t('settings.clearConfirm'))) onClearHistory && onClearHistory(); }} style=${{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderTop: `1px solid ${C.bdr2}`, cursor: 'pointer' }}>
            <div style=${{ flex: 1, minWidth: 0 }}>
              <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.txt1 }}>${t('settings.clearHistory')}</p>
              <p style=${{ margin: '2px 0 0', fontSize: 12, lineHeight: 1.45, color: C.txt4 }}>${t('settings.clearHistorySub')}</p>
            </div>
            <${SportIcon} k="trash" size=${18} color=${C.txt4} sw=${1.9}/>
          </div>
          <div onClick=${() => { if (window.confirm(t('settings.deleteConfirm'))) onDeleteAccount && onDeleteAccount(); }} style=${{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderTop: `1px solid ${C.bdr2}`, cursor: 'pointer' }}>
            <div style=${{ flex: 1, minWidth: 0 }}>
              <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.red }}>${t('settings.deleteAccount')}</p>
              <p style=${{ margin: '2px 0 0', fontSize: 12, lineHeight: 1.45, color: C.txt4 }}>${t('settings.deleteAccountSub')}</p>
            </div>
            <${SportIcon} k="warn" size=${19} color=${C.red} sw=${1.9}/>
          </div>
        </${Panel}>

        <p style=${{ margin: 0, textAlign: 'center', fontFamily: F.serif, fontSize: 11.5, lineHeight: 1.6, color: C.txt4 }}>
          ${t('settings.footer')}
        </p>
      </div>
    </div>`;
}
