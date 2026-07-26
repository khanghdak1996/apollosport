    export const uid = () => Math.random().toString(36).slice(2, 8);
    export const p2 = n => String(Math.floor(Math.abs(n))).padStart(2, '0');
    export const fT = s => `${p2(s / 60)}:${p2(s % 60)}`;
    export const fD = d => { try { return new Date(d + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }); } catch { return d; } };
    export const durS = ms => { const m = Math.floor(ms / 60000); return m < 60 ? `${m} phút` : `${Math.floor(m / 60)}h${m % 60 > 0 ? ' ' + m % 60 + 'm' : ''}`; };
    export const restLabel = s => s < 90 ? `${s}s` : s === 90 ? '90s' : `${s / 60}m`;
    export const fDM = d => { try { const dt = new Date(d + 'T00:00:00'); return `${p2(dt.getDate())}/${p2(dt.getMonth() + 1)}`; } catch { return d; } };
    export const fDT = ts => { try { return new Date(ts).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
