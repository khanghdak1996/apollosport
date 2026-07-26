import { render } from 'preact';
import { html } from './html.js';
import { GymPair } from './app.js';

render(html`<${GymPair}/>`, document.getElementById('root'));
