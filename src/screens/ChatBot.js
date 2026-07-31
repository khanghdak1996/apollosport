import { useState, useRef, useEffect } from 'preact/hooks';
import { html } from '../html.js';
import { C, r, ACC, F } from '../ui/theme.js';
import { Wrap } from '../ui/primitives.js';
import { SportIcon } from '../ui/sportIcons.js';
import { askAI } from '../data/chat-ai.js';

const SUGGESTIONS = [
  'Người mới nên bắt đầu tập gym thế nào?',
  'Ăn gì trước và sau khi chạy bộ?',
  'Gợi ý lịch tập 3 buổi/tuần',
  'Cách giãn cơ tránh đau sau tập',
];

// Trợ lý AI tư vấn tập luyện & dinh dưỡng. History nằm ở GymPair (giữ khi minimize/đổi tab).
// onClose = minimize (ẩn panel, KHÔNG xoá history). "Đoạn mới" mới xoá history.
export function ChatBot({ msgs, setMsgs, onClose }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs.length, sending]);

  const send = async (override) => {
    const t = (override != null ? override : text).trim();
    if (!t || sending) return;
    const userMsg = { role: 'user', text: t };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setText('');
    setSending(true);
    try {
      const reply = await askAI(next);
      setMsgs(m => [...m, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMsgs(m => [...m, { role: 'assistant', text: e.message || 'Có lỗi xảy ra, thử lại nhé.', error: true }]);
    } finally {
      setSending(false);
    }
  };

  const newChat = () => { if (!sending) { setMsgs([]); setText(''); } };

  const bubble = (m, i) => {
    const mine = m.role === 'user';
    return html`
      <div key=${i} style=${{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
        <div style=${{
          maxWidth: '82%', padding: '9px 13px', borderRadius: 16, fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          background: mine ? ACC : (m.error ? C.redBg : C.bg3),
          color: mine ? '#fff' : (m.error ? C.redInk : C.txt1),
          borderBottomRightRadius: mine ? 5 : 16, borderBottomLeftRadius: mine ? 16 : 5,
        }}>${m.text}</div>
      </div>`;
  };

  const dots = html`<span style=${{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
    ${[0, 1, 2].map(i => html`<span key=${i} class="chat-dot" style=${{ animationDelay: `${i * 0.15}s`, width: 6, height: 6, borderRadius: '50%', background: C.txt3, display: 'inline-block' }}/>`)}
  </span>`;

  return html`
    <${Wrap} cx=${{ position: 'absolute', inset: 0, zIndex: 300, background: C.bg1 }} class="slide-up">
      <div style=${{ padding: '12px 14px', borderBottom: `1px solid ${C.bdr}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style=${{ width: 34, height: 34, borderRadius: 10, background: C.bg3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><${SportIcon} k="comment" size=${18} color=${ACC}/></span>
        <div style=${{ flex: 1, minWidth: 0 }}>
          <p style=${{ margin: 0, fontFamily: F.display, fontWeight: 700, fontSize: 16, color: C.txt1 }}>Trợ lý Apollo</p>
          <p style=${{ margin: 0, fontSize: 11, color: C.txt3 }}>Tư vấn tập luyện & dinh dưỡng</p>
        </div>
        ${msgs.length > 0 && html`<button onClick=${newChat} class="btn-action" style=${{ background: C.bg3, border: 'none', borderRadius: r.pill, padding: '7px 12px', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: ACC, flexShrink: 0 }}>＋ Mới</button>`}
        <button onClick=${onClose} class="btn-action" style=${{ background: C.bg1, border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><${SportIcon} k="close" size=${18} color=${C.txt2}/></button>
      </div>

      <div ref=${scrollRef} style=${{ flex: 1, overflowY: 'auto', padding: '14px 14px', WebkitOverflowScrolling: 'touch' }}>
        ${msgs.length === 0 && html`
          <div style=${{ padding: '8px 2px 4px' }}>
            <p style=${{ margin: '0 0 4px', fontFamily: F.display, fontWeight: 700, fontSize: 18, color: C.txt1 }}>Chào bạn 👋</p>
            <p style=${{ margin: '0 0 16px', fontSize: 13.5, color: C.txt2, lineHeight: 1.5 }}>Mình có thể tư vấn về tập luyện và dinh dưỡng. Hỏi mình bất cứ điều gì, hoặc thử vài gợi ý dưới đây:</p>
            <div style=${{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              ${SUGGESTIONS.map(s => html`<button key=${s} onClick=${() => send(s)} class="btn-action" style=${{ textAlign: 'left', background: '#fff', border: `1px solid ${C.bdr}`, borderRadius: r.md, padding: '11px 13px', cursor: 'pointer', fontSize: 13.5, color: C.txt1 }}>${s}</button>`)}
            </div>
          </div>`}
        ${msgs.map(bubble)}
        ${sending && html`<div style=${{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
          <div style=${{ padding: '11px 14px', borderRadius: 16, borderBottomLeftRadius: 5, background: C.bg3 }}>${dots}</div>
        </div>`}
      </div>

      <div style=${{ borderTop: `1px solid ${C.bdr}`, padding: '10px 12px', background: '#fff', display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}>
        <input value=${text} onInput=${e => setText(e.target.value)} onKeyDown=${e => { if (e.key === 'Enter') send(); }} placeholder="Nhập câu hỏi..." maxLength=${1000} style=${{ flex: 1, boxSizing: 'border-box', padding: '11px 14px', borderRadius: 22, border: `1px solid ${C.bdr}`, fontSize: 14, background: C.bg3, color: C.txt1 }}/>
        <button onClick=${() => send()} class="btn-action" style=${{ background: ACC, border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', flexShrink: 0, opacity: (text.trim() && !sending) ? 1 : 0.5, pointerEvents: sending ? 'none' : 'auto' }}>➤</button>
      </div>
    </${Wrap}>`;
}
