import { useState } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC } from '../ui/theme.js';
import { Wrap, Btn, Label } from '../ui/primitives.js';
import { Icons } from '../ui/icons.js';

function Toggle({ on, onChange }) {
  return html`
    <button onClick=${() => onChange(!on)} class="btn-action" style=${{
      width: 46, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? ACC : C.bdr2, position: 'relative', transition: 'background 0.2s',
    }}>
      <span style=${{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
    </button>`;
}

function Row({ title, sub, right, onClick, danger }) {
  return html`
    <div onClick=${onClick} style=${{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 4px', cursor: onClick ? 'pointer' : 'default' }}>
      <div style=${{ flex: 1, minWidth: 0 }}>
        <p style=${{ margin: 0, fontSize: 14.5, fontWeight: 500, color: danger ? C.red : C.txt1 }}>${title}</p>
        ${sub && html`<p style=${{ margin: '2px 0 0', fontSize: 12, color: C.txt3, lineHeight: 1.4 }}>${sub}</p>`}
      </div>
      ${right}
    </div>`;
}

export function Settings({ me, onBack, onSaveProfile, onToggleLeaderboard, onToggleHideWeight, onRecomputeStreak, isAdmin, adminMode, onToggleAdminMode, onSignOut, onDeleteAccount }) {
  const [name, setName] = useState(me.name || '');
  const [dept, setDept] = useState(me.dept || '');
  const [center, setCenter] = useState(me.center || '');
  const [savingP, setSavingP] = useState(false);
  const [recomputed, setRecomputed] = useState(false);
  const [optOut, setOptOut] = useState(!!me.prefs?.optOutLeaderboard);
  const [hideWeight, setHideWeight] = useState(!!me.prefs?.hideWeight);

  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: r.md, border: `1px solid ${C.bdr}`, fontSize: 14.5, color: C.txt1, background: '#fff' };
  const section = { background: '#fff', borderRadius: r.lg, border: `1px solid ${C.bdr}`, padding: '4px 14px', marginBottom: 18 };

  const saveProfile = async () => {
    if (!name.trim() || savingP) return;
    setSavingP(true);
    await onSaveProfile({ name: name.trim(), dept: dept.trim(), center: center.trim() });
    setSavingP(false);
  };

  return html`
    <${Wrap}>
      <div style=${{ padding: '14px 16px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick=${onBack} class="btn-action" style=${{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.txt2 }}><${Icons.back} size=${18}/></button>
        <h2 style=${{ margin: 0, fontSize: 18, fontWeight: 600, color: C.txt1 }}>Cài đặt</h2>
      </div>

      <div style=${{ flex: 1, overflowY: 'auto', padding: '18px 16px', WebkitOverflowScrolling: 'touch' }}>
        <${Label} t="Hồ sơ"/>
        <div style=${{ ...section, padding: 14 }}>
          <p style=${{ margin: '0 0 5px', fontSize: 11.5, color: C.txt3 }}>Tên hiển thị</p>
          <input value=${name} onInput=${e => setName(e.target.value)} style=${{ ...inputStyle, marginBottom: 12 }}/>
          <p style=${{ margin: '0 0 5px', fontSize: 11.5, color: C.txt3 }}>Phòng ban</p>
          <input value=${dept} onInput=${e => setDept(e.target.value)} placeholder="VD: Kỹ thuật" style=${{ ...inputStyle, marginBottom: 12 }}/>
          <p style=${{ margin: '0 0 5px', fontSize: 11.5, color: C.txt3 }}>Trung tâm / Cơ sở</p>
          <input value=${center} onInput=${e => setCenter(e.target.value)} placeholder="VD: Hà Nội" style=${{ ...inputStyle, marginBottom: 14 }}/>
          <${Btn} onClick=${saveProfile} cx=${{ width: '100%', opacity: (!name.trim() || savingP) ? 0.5 : 1, pointerEvents: (!name.trim() || savingP) ? 'none' : 'auto' }}>${savingP ? 'Đang lưu...' : 'Lưu hồ sơ'}</${Btn}>
        </div>

        <${Label} t="Quyền riêng tư"/>
        <div style=${section}>
          <${Row}
            title="Tham gia bảng xếp hạng"
            sub=${optOut ? 'Bạn đang ẩn khỏi bảng xếp hạng' : 'Điểm của bạn hiển thị trên bảng xếp hạng'}
            right=${html`<${Toggle} on=${!optOut} onChange=${(v) => { setOptOut(!v); onToggleLeaderboard(v); }}/>`}
          />
          <div style=${{ borderTop: `1px solid ${C.bdr}` }}/>
          <${Row}
            title="Ẩn theo dõi cân nặng"
            sub="Cân nặng luôn riêng tư; bật để ẩn hẳn tính năng này"
            right=${html`<${Toggle} on=${hideWeight} onChange=${(v) => { setHideWeight(v); onToggleHideWeight(v); }}/>`}
          />
        </div>

        ${isAdmin && html`
          <${Label} t="Quản trị"/>
          <div style=${section}>
            <${Row}
              title="Chế độ quản trị"
              sub=${adminMode ? '🛡 Đang bật — bạn có thể xoá bài & bình luận của mọi người' : 'Bật để kiểm duyệt (xoá bài/bình luận vi phạm của người khác)'}
              right=${html`<${Toggle} on=${!!adminMode} onChange=${onToggleAdminMode}/>`}
            />
          </div>`}

        <${Label} t="Chuỗi tập"/>
        <div style=${section}>
          <${Row}
            title="Tính lại chuỗi"
            sub="Dùng khi bạn ghi buổi tập lùi ngày và chuỗi bị lệch"
            onClick=${async () => { await onRecomputeStreak(); setRecomputed(true); setTimeout(() => setRecomputed(false), 2000); }}
            right=${html`<span style=${{ fontSize: 13, color: ACC, fontWeight: 500 }}>${recomputed ? '✓ Đã cập nhật' : 'Tính lại ›'}</span>`}
          />
        </div>

        <${Label} t="Tài khoản"/>
        <div style=${section}>
          <${Row} title="Đăng xuất" onClick=${onSignOut} right=${html`<${Icons.back} size=${16} color=${C.txt3} style=${{ transform: 'rotate(180deg)' }}/>`}/>
          <div style=${{ borderTop: `1px solid ${C.bdr}` }}/>
          <${Row}
            title="Xoá tài khoản"
            sub="Xoá vĩnh viễn mọi buổi tập, điểm và hồ sơ. Không thể hoàn tác."
            danger=${true}
            onClick=${() => { if (window.confirm('Xoá vĩnh viễn tài khoản và toàn bộ dữ liệu tập luyện? Không thể hoàn tác.')) onDeleteAccount(); }}
            right=${html`<span style=${{ fontSize: 20 }}>⚠️</span>`}
          />
        </div>

        <p style=${{ margin: '4px 4px 24px', fontSize: 11.5, color: C.txt3, lineHeight: 1.5, textAlign: 'center' }}>Cân nặng và số đo của bạn không bao giờ hiển thị với đồng nghiệp.</p>
      </div>
    </${Wrap}>`;
}
