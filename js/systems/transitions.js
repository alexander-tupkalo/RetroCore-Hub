/**
 * RETROCORE://HUB — transitions.js
 * Cinematic module launch transition overlay.
 * Intercepts mod-card clicks, runs sequence, then navigates.
 */

// Translation helper — platform.js exposes window.__rc_t = t()
// Falls back to EN strings if i18n not yet loaded
function _t(key, fallback) {
  return (typeof window.__rc_t === 'function' ? window.__rc_t(key) : null) || fallback;
}

// Standard 4-line sequence: [exeName, linkLine, completeLine]
const MODULE_LABELS = {
  'vhs-movieclub':       ['VHS_MOVIECLUB.exe',        'CINEMA ARCHIVE LINK...',       'SIGNAL STABLE'],
  'neon-invaders':       ['NEON_INVADERS.exe',         'ARCADE GRID LINK...',          'GRID LOCKED'],
  'neon-cyberdeck':      ['NEON_CYBERDECK.exe',        'TERMINAL ACCESS LINK...',      'NODE ACTIVE'],
};

// Themed sequences for new modules — short, fast, atmospheric
// Built as functions so _t() reads current language at click-time
function getArchiveSequence() {
  return [
    { text: 'RETRO_SIGNAL_ARCHIVE.exe',                                      pause: 380, pct: '30%',  accent: true },
    { text: _t('transArchiveLink', 'RECOVERING VHS ARCHIVE...'),             pause: 340, pct: '65%'  },
    { text: _t('transArchiveDone', 'SIGNAL STABILIZED'),                     pause: 500, pct: '100%' },
  ];
}

function getWavecastSequence() {
  return [
    { text: 'RETRO_WAVECAST.exe',                                            pause: 320, pct: '28%',  accent: true },
    { text: _t('transWavecastLink', 'CONNECTING TO FM BAND...'),             pause: 320, pct: '62%'  },
    { text: _t('transWavecastDone', 'SIGNAL LOCKED'),                        pause: 480, pct: '100%' },
  ];
}

// Naval sequence — 5 lines, slower pacing. Built at call-time for i18n.
function getNavalSequence() {
  return [
    { text: _t('transNavalLink',  'LINKING RADAR ARRAY...'),        pause: 340, pct: '18%'  },
    { text: 'NEON_BATTLESHIP.exe',                                   pause: 400, pct: '38%',  accent: true },
    { text: _t('transNavalAuth',  'AUTHORIZING TACTICAL GRID...'),  pause: 380, pct: '58%'  },
    { text: _t('transNavalSonar', 'SONAR CHANNEL ACTIVE...'),       pause: 360, pct: '78%'  },
    { text: _t('transNavalDepth', 'DEPTH SIGNAL CONFIRMED.'),       pause: 560, pct: '100%' },
  ];
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function inferSlug(href) {
  const match = href.match(/\/projects\/([^/]+)/);
  return match ? match[1] : 'module';
}

// ── Build overlay DOM (created once, reused) ──────────
let _overlay = null;

function getOverlay() {
  if (_overlay) return _overlay;

  _overlay = document.createElement('div');
  _overlay.id = 'transition-overlay';
  _overlay.setAttribute('aria-hidden', 'true');
  _overlay.innerHTML = `
    <div class="trans__bg"        aria-hidden="true"></div>
    <div class="trans__scanlines" aria-hidden="true"></div>
    <div class="trans__noise"     aria-hidden="true"></div>
    <div class="trans__chroma"    aria-hidden="true"></div>
    <div class="trans__vignette"  aria-hidden="true"></div>

    <div class="trans__terminal">
      <div class="trans__lines" id="trans-lines"></div>
      <div class="trans__caret-row" aria-hidden="true">
        <span class="trans__prompt">EXEC:&gt;&nbsp;</span>
        <span class="trans__caret"></span>
      </div>
    </div>

    <div class="trans__corner trans__corner--tl" aria-hidden="true"></div>
    <div class="trans__corner trans__corner--tr" aria-hidden="true"></div>
    <div class="trans__corner trans__corner--bl" aria-hidden="true"></div>
    <div class="trans__corner trans__corner--br" aria-hidden="true"></div>

    <div class="trans__progress-track" aria-hidden="true">
      <div class="trans__progress-fill" id="trans-progress"></div>
    </div>
  `;
  document.body.appendChild(_overlay);
  return _overlay;
}

function addLine(linesEl, text, cls = '') {
  const row = document.createElement('div');
  row.className = `trans__line ${cls}`.trim();
  row.innerHTML = `<span class="trans__prefix">&gt;&nbsp;</span><span>${text}</span>`;
  linesEl.appendChild(row);
  requestAnimationFrame(() => row.classList.add('trans__line--visible'));
  return row;
}

// ── Standard (non-naval) transition ───────────────────
async function runStandardTransition(href, slug) {
  const overlay    = getOverlay();
  const linesEl    = overlay.querySelector('#trans-lines');
  const progressEl = overlay.querySelector('#trans-progress');

  linesEl.innerHTML = '';
  progressEl.style.width = '0%';
  document.body.style.overflow = 'hidden';
  overlay.classList.add('trans--visible');
  await wait(120);

  const [exeName, linkLine, completeLine] =
    MODULE_LABELS[slug] || [`${slug.toUpperCase()}.exe`, 'LINKING SIGNAL...', 'TRANSFER COMPLETE'];

  await wait(180);
  addLine(linesEl, _t('transInit', 'INITIALIZING MODULE...'));
  progressEl.style.width = '15%';
  document.dispatchEvent(new CustomEvent('retrocore:trans-tick', { bubbles: true }));
  await wait(320);

  addLine(linesEl, exeName, 'trans__line--accent');
  progressEl.style.width = '40%';
  document.dispatchEvent(new CustomEvent('retrocore:trans-tick', { bubbles: true }));
  await wait(380);

  addLine(linesEl, linkLine);
  progressEl.style.width = '70%';
  document.dispatchEvent(new CustomEvent('retrocore:trans-tick', { bubbles: true }));
  await wait(420);

  addLine(linesEl, _t('transComplete', completeLine));
  progressEl.style.width = '100%';
  document.dispatchEvent(new CustomEvent('retrocore:trans-tick', { bubbles: true }));
  await wait(520);

  window.location.href = href;
}

// ── Naval transition ───────────────────────────────────
async function runNavalTransition(href) {
  const overlay    = getOverlay();
  const linesEl    = overlay.querySelector('#trans-lines');
  const progressEl = overlay.querySelector('#trans-progress');

  linesEl.innerHTML = '';
  progressEl.style.width = '0%';
  document.body.style.overflow = 'hidden';

  // Apply naval tint class
  document.body.classList.add('trans--naval');
  overlay.classList.add('trans--visible');
  await wait(140);

  addLine(linesEl, _t('transNavalInit', 'INITIALIZING TACTICAL MODULE...'));
  progressEl.style.width = '8%';
  document.dispatchEvent(new CustomEvent('retrocore:trans-tick', { bubbles: true }));
  await wait(300);

  for (const step of getNavalSequence()) {
    addLine(
      linesEl,
      step.text,
      step.accent ? 'trans__line--accent' : ''
    );
    progressEl.style.width = step.pct;
    document.dispatchEvent(new CustomEvent('retrocore:trans-tick', { bubbles: true }));
    await wait(step.pause);
  }

  document.body.classList.remove('trans--naval');
  window.location.href = href;
}

// ── Router ─────────────────────────────────────────────
async function runTransition(href, slug) {
  if (slug === 'neon-battleship')      return runNavalTransition(href);
  if (slug === 'retro-signal-archive') return runThemedTransition(href, 'archive',  getArchiveSequence(),  _t('transArchiveInit',  'OPENING MEMORY NODE...'));
  if (slug === 'retro-wavecast')       return runThemedTransition(href, 'wavecast', getWavecastSequence(), _t('transWavecastInit', 'TUNING SIGNAL...'));
  return runStandardTransition(href, slug);
}

// ── Themed short transition (archive / wavecast) ──────
async function runThemedTransition(href, theme, sequence, initLine) {
  const overlay    = getOverlay();
  const linesEl    = overlay.querySelector('#trans-lines');
  const progressEl = overlay.querySelector('#trans-progress');

  linesEl.innerHTML = '';
  progressEl.style.width = '0%';
  document.body.style.overflow = 'hidden';

  document.body.classList.add(`trans--${theme}`);
  overlay.classList.add('trans--visible');
  await wait(120);

  addLine(linesEl, initLine);
  progressEl.style.width = '10%';
  document.dispatchEvent(new CustomEvent('retrocore:trans-tick', { bubbles: true }));
  await wait(260);

  for (const step of sequence) {
    addLine(linesEl, step.text, step.accent ? 'trans__line--accent' : '');
    progressEl.style.width = step.pct;
    document.dispatchEvent(new CustomEvent('retrocore:trans-tick', { bubbles: true }));
    await wait(step.pause);
  }

  document.body.classList.remove(`trans--${theme}`);
  window.location.href = href;
}

// ── Wire up all module cards ───────────────────────────
export function initTransitions() {
  document.querySelectorAll('.mod-card:not(.mod-card--disabled)').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const href = card.getAttribute('href');
      if (!href) return;
      runTransition(href, inferSlug(href));
    });
  });
}