import { html } from '../html.js';

    export const Svg = ({ d, viewBox = '0 0 24 24', fill = 'none', stroke = 'currentColor', strokeWidth = '2', size = 24, cx = {} }) => html`
  <svg width=${size} height=${size} viewBox=${viewBox} fill=${fill} stroke=${stroke} stroke-width=${strokeWidth} stroke-linecap="round" stroke-linejoin="round" style=${cx}>
    ${d}
  </svg>
`;

    export const Icons = {
      home: (props) => html`<${Svg} ...${props} d=${html`<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`}/>`,
      progs: (props) => html`<${Svg} ...${props} d=${html`<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>`}/>`,
      hist: (props) => html`<${Svg} ...${props} d=${html`<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>`}/>`,
      plus: (props) => html`<${Svg} ...${props} d=${html`<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`}/>`,
      close: (props) => html`<${Svg} ...${props} d=${html`<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`}/>`,
      check: (props) => html`<${Svg} ...${props} d=${html`<polyline points="20 6 9 17 4 12"/>`}/>`,
      swap: (props) => html`<${Svg} ...${props} d=${html`<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>`}/>`,
      trash: (props) => html`<${Svg} ...${props} d=${html`<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>`}/>`,
      clock: (props) => html`<${Svg} ...${props} d=${html`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`}/>`,
      flame: (props) => html`<${Svg} ...${props} d=${html`<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`}/>`,
      trophy: (props) => html`<${Svg} ...${props} d=${html`<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 0-6 6v3.58a6 6 0 0 0 6 6 6 6 0 0 0 6-6V8a6 6 0 0 0-6-6z"/>`}/>`,
      back: (props) => html`<${Svg} ...${props} d=${html`<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`}/>`,
      journal: (props) => html`<${Svg} ...${props} d=${html`<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`}/>`,
      trend: (props) => html`<${Svg} ...${props} d=${html`<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`}/>`,
      scale: (props) => html`<${Svg} ...${props} d=${html`<circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 3"/>`}/>`,
      info: (props) => html`<${Svg} ...${props} d=${html`<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>`}/>`,
      edit: (props) => html`<${Svg} ...${props} d=${html`<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>`}/>`,
      calendar: (props) => html`<${Svg} ...${props} d=${html`<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`}/>`,
      user: (props) => html`<${Svg} ...${props} d=${html`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`}/>`
    };
