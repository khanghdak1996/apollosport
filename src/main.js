import { render } from 'preact';
import { html } from './html.js';
import { GymPair } from './app.js';
import { initForeground } from './data/push.js';

render(html`<${GymPair}/>`, document.getElementById('root'));

// Nếu người dùng đã bật thông báo đẩy ở thiết bị này, gắn handler foreground (no-op nếu chưa bật).
initForeground();
