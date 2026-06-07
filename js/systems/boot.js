/**
 * RETROCORE://HUB — boot.js
 * Cinematic OS boot sequence overlay.
 * Runs once per session (sessionStorage gate).
 * Skippable via click / Enter / Escape.
 */

const BOOT_KEY  = 'retrocore_booted';
let BOOT_LINES = [
  { text: 'RETROCORE://BOOT',                    pause: 520,  cls: 'boot__line--title'  },
  { text: 'INITIALIZING SIGNAL MATRIX...',        pause: 380,  cls: 'boot__line--cmd'    },
  { text: 'LOADING MODULE REGISTRY...',           pause: 340,  cls: 'boot__line--cmd'    },
  { text: 'VERIFYING TERMINAL LINKS...',          pause: 380,  cls: 'boot__line--cmd'    },
  { text: 'RESTORING VHS MEMORY CACHE...',        pause: 420,  cls: 'boot__line--cmd'    },
  { text: 'SIGNAL STABILITY: <span class="boot__ok">OK</span>', pause: 480, cls: 'boot__line--status', html: true },
  { text: 'WELCOME BACK, OPERATOR.',              pause: 900,  cls: 'boot__line--welcome'},
];

// i18n hook — platform.js dispatches translated lines before boot fires
document.addEventListener('retrocore:boot-translations', (e) => {
  if (e.detail?.lines?.length) {
    BOOT_LINES = e.detail.lines;
  }
  // Update skip label if overlay is visible
  const skip = document.getElementById('boot-skip');
  if (skip && e.detail?.skip) {
    skip.innerHTML =
      `<span class="boot__skip-bracket">[</span>${e.detail.skip}<span class="boot__skip-bracket">]</span>`;
  }
});

// ── char-by-char typing with optional html injection ──
function typeText(el, text, isHtml, speed = 32) {
  return new Promise(resolve => {
    if (isHtml) {
      // strip tags for typing, re-inject markup at end
      const plain = text.replace(/<[^>]+>/g, '');
      let i = 0;
      const iv = setInterval(() => {
        el.textContent = plain.slice(0, ++i);
        if (i >= plain.length) {
          clearInterval(iv);
          el.innerHTML = text;       // swap in full html
          resolve();
        }
      }, speed);
    } else {
      let i = 0;
      const iv = setInterval(() => {
        el.textContent = text.slice(0, ++i);
        if (i >= text.length) { clearInterval(iv); resolve(); }
      }, speed);
    }
  });
}

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── build the boot overlay DOM ─────────────────────────
function createBootOverlay() {
  const el = document.createElement('div');
  el.id = 'boot-overlay';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'System boot sequence');
  el.innerHTML = `
    <div class="boot__bg-gradient" aria-hidden="true"></div>
    <div class="boot__scanlines"   aria-hidden="true"></div>
    <div class="boot__noise"       aria-hidden="true"></div>
    <div class="boot__vignette"    aria-hidden="true"></div>
    <div class="boot__crt-beam"    aria-hidden="true"></div>

    <div class="boot__terminal" role="log" aria-live="polite">
      <div class="boot__terminal-header" aria-hidden="true">
        <span class="boot__term-dot"></span>
        <span class="boot__term-dot"></span>
        <span class="boot__term-dot"></span>
        <span class="boot__term-id">RETROCORE_OS&nbsp;//&nbsp;BOOT_SEQ_v3.1</span>
      </div>
      <div class="boot__lines" id="boot-lines"></div>
      <div class="boot__cursor-line" aria-hidden="true">
        <span class="boot__prompt">SYS:&gt;&nbsp;</span>
        <span class="boot__caret" id="boot-caret"></span>
      </div>
    </div>

    <div class="boot__skip" id="boot-skip" aria-label="Press any key to skip">
      <span class="boot__skip-bracket">[</span>
      PRESS ANY KEY TO SKIP
      <span class="boot__skip-bracket">]</span>
    </div>

    <div class="boot__corner boot__corner--tl" aria-hidden="true"></div>
    <div class="boot__corner boot__corner--tr" aria-hidden="true"></div>
    <div class="boot__corner boot__corner--bl" aria-hidden="true"></div>
    <div class="boot__corner boot__corner--br" aria-hidden="true"></div>
  `;
  return el;
}

// ── run the sequence ───────────────────────────────────
async function runBootSequence(overlay, onComplete) {
  const linesEl = overlay.querySelector('#boot-lines');
  let aborted   = false;

  // skip handler
  function abort() {
    if (aborted) return;
    aborted = true;
    completeBootOverlay(overlay, onComplete);
  }

  overlay.addEventListener('click', abort,       { once: true });
  document.addEventListener('keydown', abort,    { once: true });

  // brief fade-in
  await wait(80);
  overlay.classList.add('boot--visible');
  await wait(400);

  for (const line of BOOT_LINES) {
    if (aborted) break;

    const lineEl = document.createElement('div');
    lineEl.className = `boot__line ${line.cls || ''}`;

    // prefix
    const prefix = document.createElement('span');
    prefix.className = 'boot__prefix';
    prefix.textContent = '> ';
    lineEl.appendChild(prefix);

    const textEl = document.createElement('span');
    lineEl.appendChild(textEl);
    linesEl.appendChild(lineEl);

    // scroll into view
    linesEl.scrollTop = linesEl.scrollHeight;

    // type it
    const speed = line.cls === 'boot__line--title' ? 55 : 28;
    await typeText(textEl, line.text, line.html || false, speed);

    // dispatch event for audio tick
    document.dispatchEvent(new CustomEvent('retrocore:boot-line', {
      detail: { text: line.text }, bubbles: true
    }));

    await wait(line.pause);
  }

  if (!aborted) {
    await wait(600);
    completeBootOverlay(overlay, onComplete);
  }
}

function completeBootOverlay(overlay, onComplete) {
  overlay.classList.add('boot--exit');
  overlay.addEventListener('animationend', () => {
    overlay.remove();
    document.body.classList.remove('boot-active');
    onComplete?.();
  }, { once: true });
  sessionStorage.setItem(BOOT_KEY, '1');
}

// ── public init ────────────────────────────────────────
export function initBoot(onComplete) {
  // Skip if already booted this session
  if (sessionStorage.getItem(BOOT_KEY)) {
    onComplete?.();
    return;
  }

  const overlay = createBootOverlay();
  document.body.appendChild(overlay);
  document.body.classList.add('boot-active');

  // Ensure DOM paint before starting
  requestAnimationFrame(() => {
    requestAnimationFrame(() => runBootSequence(overlay, onComplete));
  });
}