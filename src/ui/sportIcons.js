// src/ui/sportIcons.js — bộ icon keyline thay emoji hệ điều hành.
// Nét mảnh 24x24, stroke currentColor — phong cách minh hoạ keyline của Apollo Brand Book.
import { html } from '../html.js';

export const SPORT_PATHS = {
  run: '<circle cx="15.5" cy="4.5" r="2"/><path d="M13.5 21l1.5-5.5-3.5-3 1-4.5 3.5 2.5 3 .5"/><path d="M11 8L7 9l-1 3"/>',
  walk: '<circle cx="13" cy="4.5" r="2"/><path d="M11 21l1-6-3-3 1-4 3 2.5 2.5 1"/><path d="M14 15l2 6"/>',
  gym: '<path d="M4 9v6M8 7v10M16 7v10M20 9v6M8 12h8"/>',
  strength: '<path d="M4 9v6M8 7v10M16 7v10M20 9v6M8 12h8"/>',
  bike: '<circle cx="5.5" cy="17" r="3.2"/><circle cx="18.5" cy="17" r="3.2"/><path d="M5.5 17l4-8h4l3 8M9 9h5"/><circle cx="14.5" cy="4.5" r="1.5"/>',
  swim: '<circle cx="17" cy="7.5" r="1.9"/><path d="M5 10.5l5-2.5 4 2.5"/><path d="M3 15c1.8-1.4 3.2-1.4 5 0 1.8 1.4 3.2 1.4 5 0 1.8-1.4 3.2-1.4 5 0"/><path d="M3 19c1.8-1.4 3.2-1.4 5 0 1.8 1.4 3.2 1.4 5 0 1.8-1.4 3.2-1.4 5 0"/>',
  hike: '<path d="M2 20l6.5-11 3.5 5.5 2-3L21 20z"/><circle cx="17" cy="5.5" r="2"/>',
  yoga: '<circle cx="12" cy="4.5" r="2"/><path d="M12 8v6M6 21l6-7 6 7"/><path d="M5 12h14"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18"/><path d="M12 3a9 9 0 0 1 0 18"/>',
  football: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18"/><path d="M12 3a9 9 0 0 1 0 18"/>',
  basketball: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18"/><path d="M12 3a9 9 0 0 1 0 18"/>',
  racket: '<ellipse cx="9" cy="8" rx="5.5" ry="6.5" transform="rotate(-30 9 8)"/><path d="M12.5 13.5L20 21"/>',
  badminton: '<ellipse cx="9" cy="8" rx="5.5" ry="6.5" transform="rotate(-30 9 8)"/><path d="M12.5 13.5L20 21"/>',
  tennis: '<ellipse cx="9" cy="8" rx="5.5" ry="6.5" transform="rotate(-30 9 8)"/><path d="M12.5 13.5L20 21"/>',
  pickleball: '<ellipse cx="9" cy="8" rx="5.5" ry="6.5" transform="rotate(-30 9 8)"/><path d="M12.5 13.5L20 21"/>',
  other: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',

  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  heart: '<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1z"/>',
  comment: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 21l1.9-5a8.4 8.4 0 0 1-.9-3.9 8.4 8.4 0 0 1 8.4-8.4 8.4 8.4 0 0 1 8.6 8.3z"/>',
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6M18 14h.5A4.5 4.5 0 0 1 23 18.5V20"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
  medal: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5"/>',
  crown: '<path d="M3 6l4.5 4L12 3l4.5 7L21 6l-1.8 12H4.8z"/>',
  photo: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10.5" r="1.6"/><path d="M21 16l-5-5-6 6"/>',
  video: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10.5 9.5l4.5 2.5-4.5 2.5z"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
  bolt: '<path d="M13 2L4.5 14H11l-1 8 8.5-12H12z"/>',
  bell: '<path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 8.5a4 4 0 0 1 0 7"/>',
  check: '<path d="M4 12.5l5.5 5.5L20 7"/>',
  chevronR: '<path d="M9 5l7 7-7 7"/>',
  chevronL: '<path d="M15 5l-7 7 7 7"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 10h18M8 2.5v4M16 2.5v4"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 11.5 4a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9 2 2 0 1 1 0 4z"/>',
  warn: '<path d="M10.3 4.3L2.5 18a1.8 1.8 0 0 0 1.6 2.7h15.8A1.8 1.8 0 0 0 21.5 18L13.7 4.3a1.8 1.8 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18h6a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H15"/>',
  gauge: '<path d="M4 18a9 9 0 1 1 16 0"/><path d="M12 14l4-4"/>',
  wave: '<path d="M3 9c1.8-1.4 3.2-1.4 5 0 1.8 1.4 3.2 1.4 5 0 1.8-1.4 3.2-1.4 5 0"/><path d="M3 14c1.8-1.4 3.2-1.4 5 0 1.8 1.4 3.2 1.4 5 0 1.8-1.4 3.2-1.4 5 0"/><path d="M3 19c1.8-1.4 3.2-1.4 5 0 1.8 1.4 3.2 1.4 5 0 1.8-1.4 3.2-1.4 5 0"/>',
  star: '<path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.8 6.4 20l1.4-6.2L3 9.5l6.4-.6z"/>',
  edit: '<path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4 16.5z"/>',
  journal: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 0-6 6v3.58a6 6 0 0 0 6 6 6 6 0 0 0 6-6V8a6 6 0 0 0-6-6z"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};

export const SportIcon = ({ k = 'other', size = 20, color = 'currentColor', sw = 1.8, cx = {} }) => html`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color}
       stroke-width=${sw} stroke-linecap="round" stroke-linejoin="round" style=${cx}
       dangerouslySetInnerHTML=${{ __html: SPORT_PATHS[k] || SPORT_PATHS.other }} />`;

// Ô vuông bo góc bọc icon — dùng ở list "Gần đây", chọn môn, feed.
export const SportChip = ({ k, size = 34, icon = 19, color, tint, radius = 10 }) => html`
  <span style=${{ width: size, height: size, borderRadius: radius, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <${SportIcon} k=${k} size=${icon} color=${color}/>
  </span>`;
