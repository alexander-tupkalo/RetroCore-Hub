/**
 * RETROCORE://HUB — terminal-events.js
 * Rare, unobtrusive ambient system-event notifications.
 * Fire infrequently. Never interrupt navigation.
 */

const EVENTS = [
  { text: 'SIGNAL INSTABILITY DETECTED',              accent: 'rgba(255,179,71,0.7)'   },
  { text: 'UNKNOWN FREQUENCY FOUND',                   accent: 'rgba(162,89,255,0.7)'   },
  { text: 'REMOTE CHANNEL LINKED',                     accent: 'rgba(0,229,255,0.7)'    },
  { text: 'ARCHIVE NODE RESTORED',                     accent: 'rgba(0,201,167,0.7)'    },
  { text: 'UNREGISTERED SIGNAL DETECTED',              accent: 'rgba(255,45,85,0.7)'    },
  { text: 'SECTOR_07 HANDSHAKE OK',                    accent: 'rgba(0,229,255,0.7)'    },
  { text: 'VHS MEMORY FRAGMENT RECOVERED',             accent: 'rgba(162,89,255,0.7)'   },
  { text: 'FREQUENCY DRIFT: +0.03 MHz',                accent: 'rgba(255,179,71,0.7)'   },
  { text: 'FM SIGNAL LOCKED // RETROWAVE BAND ACTIVE', accent: 'rgba(255,45,155,0.7)'   },
  { text: 'ARCHIVE NODE RESTORED // VHS FRAGMENTS DETECTED', accent: 'rgba(255,179,71,0.7)' },
];

// i18n sync — platform.js emits translated event texts on lang change
const ACCENTS = [
  'rgba(255,179,71,0.7)', 'rgba(162,89,255,0.7)', 'rgba(0,229,255,0.7)',
  'rgba(0,201,167,0.7)',  'rgba(255,45,85,0.7)',   'rgba(0,229,255,0.7)',
  'rgba(162,89,255,0.7)', 'rgba(255,179,71,0.7)',
  'rgba(255,45,155,0.7)', 'rgba(255,179,71,0.7)',  // Phase 7 additions
];

document.addEventListener('retrocore:update-events', (e) => {
  const texts = e.detail?.events;
  if (!Array.isArray(texts)) return;
  texts.forEach((text, i) => {
    if (EVENTS[i]) EVENTS[i].text = text;
  });
});

// Min/max delay between events (ms)
const MIN_DELAY = 18_000;
const MAX_DELAY = 45_000;

let _container = null;
let _timer     = null;
let _enabled   = true;

function getContainer() {
  if (_container) return _container;
  _container = document.createElement('div');
  _container.id = 'terminal-events';
  _container.setAttribute('aria-live', 'polite');
  _container.setAttribute('aria-label', 'System event log');
  document.body.appendChild(_container);
  return _container;
}

function showEvent(evt) {
  if (!_enabled) return;
  const container = getContainer();

  const el = document.createElement('div');
  el.className = 'term-event';
  el.setAttribute('role', 'status');
  el.style.setProperty('--evt-accent', evt.accent);
  el.innerHTML =
    `<span class="term-event__pip"></span>` +
    `<span class="term-event__prefix">SYS://</span>` +
    `<span class="term-event__text">${evt.text}</span>`;

  container.appendChild(el);

  // entrance
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('term-event--visible'));
  });

  // auto-dismiss after 4.5s
  setTimeout(() => {
    el.classList.add('term-event--exit');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, 4500);

  document.dispatchEvent(new CustomEvent('retrocore:sys-event', {
    detail: { text: evt.text }, bubbles: true
  }));
}

function scheduleNext() {
  const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
  _timer = setTimeout(() => {
    // Don't fire during boot
    if (document.body.classList.contains('boot-active')) {
      scheduleNext();
      return;
    }
    const evt = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    showEvent(evt);
    scheduleNext();
  }, delay);
}

export function initTerminalEvents() {
  scheduleNext();
}

export function pauseTerminalEvents() {
  _enabled = false;
  clearTimeout(_timer);
}

export function resumeTerminalEvents() {
  _enabled = true;
  scheduleNext();
}