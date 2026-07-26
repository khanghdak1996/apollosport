// src/screens/Settings.js — bản redesign. THAY TOÀN BỘ file cũ.
// Khác bản cũ: 4 nhóm có tiêu đề in hoa, toggle 46x28, và "Xoá lịch sử" chuyển
// từ tab Cá nhân về đây.
import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, F, T, BRAND } from '../ui/theme.js';
import { SportIcon } from '../ui/sportIcons.js';

function Field({ label, value, onInput, placeholder, first }) {
  return html`
    <div style=${{ padding: '13px 0', borderTop: first ? 'none' : `1px solid ${C.bdr2}` }}>
      <p style=${{ margin: '0 0 4px', ...T.label }}>${label}</p>
      <input value=${value} onInput=${onInput} placeholder=${placeholder}
        style=${{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: 'none', outline: 'none', fontSize: 15, fontWeight: 600, color: C.txt1, fontFamily: F.body, padding: 0 }}/>
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

export function Settings({ profile, onSave, onBack, onSignOut, onDeleteAccount, onRecalcStreak, onClearHistory, isAdmin }) {
  const [name, setName] = useState(profile.name || '');
  const [dept, setDept] = useState(profile.dept || '');
  const [center, setCenter] = useState(profile.center || '');
  const [inRank, setInRank] = useState(profile.leaderboardOptIn !== false);
  const [hideWeight, setHideWeight] = useState(!!profile.hideWeight);
  const [moderating, setModerating] = useState(!!profile.moderating);

  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.bg2, borderBottom: `1px solid ${C.bdr}`, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ width: 36, height: 36, borderRadius: '50%', background: C.bg1, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <${SportIcon} k="back" size=${18} color=${C.txt2} sw=${2}/>
        </button>
        <p style=${{ flex: 1, margin: 0, ...T.h2 }}>CÀI ĐẶT</p>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '18px 16px 40px' }}>
        <${GroupTitle} t="Hồ sơ"/>
        <${Panel} cx=${{ padding: '4px 16px 16px' }}>
          <${Field} first=${true} label="TÊN HIỂN THỊ" value=${name} onInput=${e => setName(e.target.value)} placeholder="Tên của bạn"/>
          <${Field} label="PHÒNG BAN / BỘ PHẬN" value=${dept} onInput=${e => setDept(e.target.value)} placeholder="VD: TD Communications"/>
          <${Field} label="TRUNG TÂM / CƠ SỞ" value=${center} onInput=${e => setCenter(e.target.value)} placeholder="VD: Hà Nội, HCM…"/>
          <button onClick=${() => onSave({ name, dept, center, leaderboardOptIn: inRank, hideWeight, moderating })} class="btn-action" style=${{ width: '100%', background: BRAND.blue, border: 'none', borderRadius: 13, padding: 12, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', marginTop: 6 }}>Lưu hồ sơ</button>
        </${Panel}>

        <${GroupTitle} t="Quyền riêng tư"/>
        <${Panel}>
          <${Row} first=${true} t="Tham gia bảng xếp hạng" s="Điểm của bạn hiển thị trên bảng xếp hạng" on=${inRank} onToggle=${() => setInRank(!inRank)}/>
          <${Row} t="Ẩn theo dõi cân nặng" s="Cân nặng luôn riêng tư; bật để ẩn hẳn tính năng này" on=${hideWeight} onToggle=${() => setHideWeight(!hideWeight)}/>
          ${isAdmin ? html`<${Row} t="Chế độ quản trị" s="Bật để kiểm duyệt bài & bình luận vi phạm của người khác" on=${moderating} onToggle=${() => setModerating(!moderating)}/>` : ''}
        </${Panel}>

        <${GroupTitle} t="Chuỗi tập"/>
        <${Panel} cx=${{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style=${{ flex: 1, minWidth: 0 }}>
            <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.txt1 }}>Tính lại chuỗi</p>
            <p style=${{ margin: '2px 0 0', fontSize: 12, color: C.txt4 }}>Dùng khi bạn ghi buổi tập lùi ngày và chuỗi bị lệch</p>
          </div>
          <button onClick=${onRecalcStreak} class="btn-action" style=${{ background: 'transparent', border: 'none', padding: 0, fontSize: 13, fontWeight: 600, color: BRAND.blue, cursor: 'pointer', flexShrink: 0 }}>Tính lại ›</button>
        </${Panel}>

        <${GroupTitle} t="Tài khoản"/>
        <${Panel} cx=${{ marginBottom: 16 }}>
          <div onClick=${onSignOut} style=${{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', cursor: 'pointer' }}>
            <p style=${{ margin: 0, flex: 1, fontSize: 14.5, fontWeight: 600, color: C.txt1 }}>Đăng xuất</p>
            <${SportIcon} k="chevronR" size=${17} color=${C.txt5} sw=${2}/>
          </div>
          <div onClick=${() => { if (window.confirm('Xoá toàn bộ lịch sử buổi tập? Không thể hoàn tác.')) onClearHistory && onClearHistory(); }} style=${{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderTop: `1px solid ${C.bdr2}`, cursor: 'pointer' }}>
            <div style=${{ flex: 1, minWidth: 0 }}>
              <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.txt1 }}>Xoá lịch sử buổi tập</p>
              <p style=${{ margin: '2px 0 0', fontSize: 12, lineHeight: 1.45, color: C.txt4 }}>Giữ tài khoản, chỉ xoá các buổi đã ghi.</p>
            </div>
            <${SportIcon} k="trash" size=${18} color=${C.txt4} sw=${1.9}/>
          </div>
          <div onClick=${() => { if (window.confirm('Xoá tài khoản? Mọi buổi tập, điểm và hồ sơ sẽ mất vĩnh viễn.')) onDeleteAccount && onDeleteAccount(); }} style=${{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderTop: `1px solid ${C.bdr2}`, cursor: 'pointer' }}>
            <div style=${{ flex: 1, minWidth: 0 }}>
              <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.red }}>Xoá tài khoản</p>
              <p style=${{ margin: '2px 0 0', fontSize: 12, lineHeight: 1.45, color: C.txt4 }}>Xoá vĩnh viễn mọi buổi tập, điểm và hồ sơ. Không thể hoàn tác.</p>
            </div>
            <${SportIcon} k="warn" size=${19} color=${C.red} sw=${1.9}/>
          </div>
        </${Panel}>

        <p style=${{ margin: 0, textAlign: 'center', fontFamily: F.serif, fontSize: 11.5, lineHeight: 1.6, color: C.txt4 }}>
          Cân nặng và số đo của bạn không bao giờ hiển thị với đồng nghiệp.
        </p>
      </div>
    </div>`;
}
