/**
 * RETROCORE://HUB — registration.js
 * Cinematic operator identity-link overlay.
 * Handles registration form, fake login, session creation,
 * post-registration personalization, and procedural audio feedback.
 */

import { t }            from './i18n-engine.js';
import { createSession, getSession, verifySession, isLinked } from './session.js';

// ── Procedural audio feedback ──────────────────────────
let _regAudioCtx = null;

function getAudioCtx() {
  if (_regAudioCtx) return _regAudioCtx;
  try {
    _regAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch { return null; }
  return _regAudioCtx;
}

function playKeyTick() {
  const ctx = getAudioCtx();
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const buf  = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.015), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3)) * 0.45;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = 0.028;
    src.connect(g); g.connect(ctx.destination);
    src.start();
  } catch { /* ok */ }
}

function playConfirmTone(success = true) {
  const ctx = getAudioCtx();
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const t0  = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = success ? 880 : 440;
    if (success) osc.frequency.setValueAtTime(880, t0);

    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.035, t0 + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + (success ? 0.7 : 0.35));

    osc.connect(g); g.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + (success ? 0.8 : 0.4));
  } catch { /* ok */ }
}

function playOverlayOpen() {
  const ctx = getAudioCtx();
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const t0  = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t0);
    osc.frequency.linearRampToValueAtTime(440, t0 + 0.3);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.022, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + 0.55);
  } catch { /* ok */ }
}

// ── Utility ────────────────────────────────────────────
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// ── Build overlay DOM ──────────────────────────────────
let _overlay = null;

function buildOverlay() {
  if (_overlay) { _overlay.remove(); _overlay = null; }

  _overlay = document.createElement('div');
  _overlay.id = 'reg-overlay';
  _overlay.setAttribute('role', 'dialog');
  _overlay.setAttribute('aria-modal', 'true');
  _overlay.setAttribute('aria-label', t('regTitle'));

  _overlay.innerHTML = `
    <!-- atmosphere layers -->
    <div class="reg__bg"        aria-hidden="true"></div>
    <div class="reg__scanlines" aria-hidden="true"></div>
    <div class="reg__noise"     aria-hidden="true"></div>
    <div class="reg__vignette"  aria-hidden="true"></div>
    <div class="reg__chroma"    aria-hidden="true"></div>

    <!-- corner brackets -->
    <div class="reg__corner reg__corner--tl" aria-hidden="true"></div>
    <div class="reg__corner reg__corner--tr" aria-hidden="true"></div>
    <div class="reg__corner reg__corner--bl" aria-hidden="true"></div>
    <div class="reg__corner reg__corner--br" aria-hidden="true"></div>

    <!-- terminal panel -->
    <div class="reg__panel" id="reg-panel" role="document">

      <!-- panel title bar -->
      <div class="reg__panel-bar" aria-hidden="false">
        <button class="reg__return" id="reg-return" aria-label="${t('regReturnAria')}">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>${t('regReturn')}</span>
        </button>
        <div class="reg__panel-dots" aria-hidden="true">
          <span class="reg__dot"></span>
          <span class="reg__dot"></span>
          <span class="reg__dot"></span>
        </div>
        <span class="reg__panel-id" id="reg-panel-id">${t('regPanelId')}</span>
      </div>

      <!-- panel content (form or linking sequence) -->
      <div class="reg__content" id="reg-content">
        <!-- injected by showRegistrationForm() / showLoginForm() -->
      </div>

    </div><!-- /.reg__panel -->
  `;

  document.body.appendChild(_overlay);

  // Wire return button once — it lives in the panel bar outside #reg-content
  // so it persists across form swaps and needs only one listener
  _overlay.querySelector('#reg-return')?.addEventListener('click', closeOverlay);

  return _overlay;
}

// ── Registration form ──────────────────────────────────
function showRegistrationForm() {
  const content = document.getElementById('reg-content');
  if (!content) return;

  content.innerHTML = `
    <div class="reg__header">
      <h2 class="reg__title" id="reg-panel-id">${t('regTitle')}</h2>
      <p class="reg__subtitle">${t('regSubtitle')}</p>
    </div>

    <div class="reg__form-area" id="reg-form">
      <div class="reg__field-group">
        <label class="reg__label" for="reg-username">${t('regUserLabel')}</label>
        <div class="reg__input-wrap">
          <span class="reg__input-prefix">▸</span>
          <input
            type="text"
            id="reg-username"
            class="reg__input"
            placeholder="${t('regUserPlaceholder')}"
            autocomplete="off"
            spellcheck="false"
            maxlength="32"
          >
          <span class="reg__input-caret" aria-hidden="true"></span>
        </div>
        <span class="reg__error" id="reg-err-user" aria-live="polite"></span>
      </div>

      <div class="reg__field-group">
        <label class="reg__label" for="reg-email">${t('regEmailLabel')}</label>
        <div class="reg__input-wrap">
          <span class="reg__input-prefix">▸</span>
          <input
            type="email"
            id="reg-email"
            class="reg__input"
            placeholder="${t('regEmailPlaceholder')}"
            autocomplete="off"
            spellcheck="false"
          >
          <span class="reg__input-caret" aria-hidden="true"></span>
        </div>
        <span class="reg__error" id="reg-err-email" aria-live="polite"></span>
      </div>

      <div class="reg__field-group">
        <label class="reg__label" for="reg-pass">${t('regPassLabel')}</label>
        <div class="reg__input-wrap">
          <span class="reg__input-prefix">▸</span>
          <input
            type="password"
            id="reg-pass"
            class="reg__input"
            placeholder="${t('regPassPlaceholder')}"
            autocomplete="new-password"
            maxlength="64"
          >
          <span class="reg__input-caret" aria-hidden="true"></span>
        </div>
        <span class="reg__error" id="reg-err-pass" aria-live="polite"></span>
      </div>

      <div class="reg__field-group">
        <label class="reg__label" for="reg-confirm">${t('regConfirmLabel')}</label>
        <div class="reg__input-wrap">
          <span class="reg__input-prefix">▸</span>
          <input
            type="password"
            id="reg-confirm"
            class="reg__input"
            placeholder="${t('regConfirmPlaceholder')}"
            autocomplete="new-password"
            maxlength="64"
          >
          <span class="reg__input-caret" aria-hidden="true"></span>
        </div>
        <span class="reg__error" id="reg-err-confirm" aria-live="polite"></span>
      </div>

      <div class="reg__actions">
        <button class="reg__submit" id="reg-submit">${t('regSubmit')}</button>
        <button class="reg__abort"  id="reg-abort" >${t('regAbort')}</button>
      </div>

      <div class="reg__switch">
        <span class="reg__switch-text">${t('regSwitchToLogin')}</span>
        <button class="reg__switch-btn" id="reg-to-login">${t('regLoginBtn')}</button>
      </div>
    </div>

    <div class="reg__linking-area" id="reg-linking" style="display:none">
      <div class="reg__linking-lines" id="reg-linking-lines"></div>
      <div class="reg__linking-cursor" aria-hidden="true">
        <span class="reg__link-prompt">LINK:&gt;&nbsp;</span>
        <span class="reg__link-caret"></span>
      </div>
      <div class="reg__linking-progress">
        <div class="reg__linking-bar" id="reg-link-bar"></div>
      </div>
    </div>
  `;

  wireRegistrationForm();
}

// ── Login form ─────────────────────────────────────────
function showLoginForm() {
  const content = document.getElementById('reg-content');
  if (!content) return;

  const panelId = document.getElementById('reg-panel-id');
  if (panelId) panelId.textContent = t('loginPanelId');

  content.innerHTML = `
    <div class="reg__header">
      <h2 class="reg__title">${t('loginTitle')}</h2>
      <p class="reg__subtitle">${t('loginSubtitle')}</p>
    </div>

    <div class="reg__form-area" id="reg-form">
      <div class="reg__field-group">
        <label class="reg__label" for="login-username">${t('loginUserLabel')}</label>
        <div class="reg__input-wrap">
          <span class="reg__input-prefix">▸</span>
          <input
            type="text"
            id="login-username"
            class="reg__input"
            placeholder="${t('loginUserPlaceholder')}"
            autocomplete="off"
            spellcheck="false"
            maxlength="32"
          >
          <span class="reg__input-caret" aria-hidden="true"></span>
        </div>
        <span class="reg__error" id="login-err" aria-live="polite"></span>
      </div>

      <div class="reg__field-group">
        <label class="reg__label" for="login-pass">${t('loginPassLabel')}</label>
        <div class="reg__input-wrap">
          <span class="reg__input-prefix">▸</span>
          <input
            type="password"
            id="login-pass"
            class="reg__input"
            placeholder="${t('loginPassPlaceholder')}"
            autocomplete="current-password"
            maxlength="64"
          >
          <span class="reg__input-caret" aria-hidden="true"></span>
        </div>
      </div>

      <div class="reg__actions">
        <button class="reg__submit" id="login-submit">${t('loginSubmit')}</button>
        <button class="reg__abort"  id="login-abort" >${t('loginAbort')}</button>
      </div>

      <div class="reg__switch">
        <span class="reg__switch-text">${t('loginSwitchToReg')}</span>
        <button class="reg__switch-btn" id="login-to-reg">${t('loginRegBtn')}</button>
      </div>
    </div>

    <div class="reg__linking-area" id="reg-linking" style="display:none">
      <div class="reg__linking-lines" id="reg-linking-lines"></div>
      <div class="reg__linking-cursor" aria-hidden="true">
        <span class="reg__link-prompt">AUTH:&gt;&nbsp;</span>
        <span class="reg__link-caret"></span>
      </div>
      <div class="reg__linking-progress">
        <div class="reg__linking-bar" id="reg-link-bar"></div>
      </div>
    </div>
  `;

  wireLoginForm();
}

// ── Input keyTick wiring ───────────────────────────────
function wireInputTicks(container) {
  container.querySelectorAll('.reg__input').forEach(input => {
    input.addEventListener('keydown', () => playKeyTick(), { passive: true });
    // Show input caret on focus
    input.addEventListener('focus', () => {
      const wrap = input.closest('.reg__input-wrap');
      wrap?.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      const wrap = input.closest('.reg__input-wrap');
      wrap?.classList.remove('focused');
    });
  });
}

// ── Wire registration form events ─────────────────────
function wireRegistrationForm() {
  const content = document.getElementById('reg-content');
  if (!content) return;
  wireInputTicks(content);

  document.getElementById('reg-abort')?.addEventListener('click', closeOverlay);
  document.getElementById('reg-to-login')?.addEventListener('click', () => {
    playKeyTick();
    showLoginForm();
  });

  document.getElementById('reg-submit')?.addEventListener('click', async () => {
    const username = document.getElementById('reg-username')?.value?.trim() || '';
    const email    = document.getElementById('reg-email')?.value?.trim()    || '';
    const pass     = document.getElementById('reg-pass')?.value             || '';
    const confirm  = document.getElementById('reg-confirm')?.value          || '';

    // Clear errors
    ['reg-err-user','reg-err-email','reg-err-pass','reg-err-confirm']
      .forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; });

    let valid = true;

    if (!username) {
      setError('reg-err-user', t('regErrorEmpty')); valid = false;
    }
    if (!isValidEmail(email)) {
      setError('reg-err-email', t('regErrorEmail')); valid = false;
    }
    if (pass.length < 6) {
      setError('reg-err-pass', t('regErrorPassShort')); valid = false;
    }
    if (pass !== confirm) {
      setError('reg-err-confirm', t('regErrorPassMatch')); valid = false;
    }

    if (!valid) { playConfirmTone(false); return; }

    // Run linking sequence
    await runLinkingSequence(username, email, false);
  });
}

// ── Wire login form events ─────────────────────────────
function wireLoginForm() {
  const content = document.getElementById('reg-content');
  if (!content) return;
  wireInputTicks(content);

  document.getElementById('login-abort')?.addEventListener('click', closeOverlay);
  document.getElementById('login-to-reg')?.addEventListener('click', () => {
    playKeyTick();
    showRegistrationForm();
  });

  document.getElementById('login-submit')?.addEventListener('click', async () => {
    const username = document.getElementById('login-username')?.value?.trim() || '';
    const errEl    = document.getElementById('login-err');

    if (!username) {
      if (errEl) errEl.textContent = t('regErrorEmpty');
      playConfirmTone(false); return;
    }

    if (!verifySession(username)) {
      if (errEl) errEl.textContent = t('loginError');
      playConfirmTone(false); return;
    }

    await runLinkingSequence(username, '', true);
  });
}

// ── Error helper ──────────────────────────────────────
function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.classList.add('reg__error--visible');
  }
}

// ── Linking sequence animation ─────────────────────────
async function runLinkingSequence(username, email, isLogin) {
  const form    = document.getElementById('reg-form');
  const linking = document.getElementById('reg-linking');
  const linesEl = document.getElementById('reg-linking-lines');
  const barEl   = document.getElementById('reg-link-bar');

  if (!form || !linking || !linesEl) return;

  form.style.display    = 'none';
  linking.style.display = 'block';
  linesEl.innerHTML     = '';

  const lines = isLogin
    ? [t('loginAuthLine1'), t('loginAuthLine2'), t('loginAuthLine3')]
    : [t('regLinkingLine1'), t('regLinkingLine2'), t('regLinkingLine3'), t('regLinkingLine4')];

  const pcts = isLogin ? ['30%', '65%', '100%'] : ['22%', '48%', '74%', '100%'];

  for (let i = 0; i < lines.length; i++) {
    await wait(i === 0 ? 200 : 360);
    const row = document.createElement('div');
    row.className = 'reg__link-line';
    const isLast = i === lines.length - 1;
    row.innerHTML =
      `<span class="reg__link-prefix">&gt;&nbsp;</span>` +
      `<span class="${isLast ? 'reg__link-text--success' : ''}">${lines[i]}</span>`;
    linesEl.appendChild(row);
    requestAnimationFrame(() => row.classList.add('reg__link-line--in'));

    if (barEl) barEl.style.width = pcts[i];
    playKeyTick();
    if (isLast) playConfirmTone(true);
  }

  await wait(900);

  // Commit session
  if (!isLogin) createSession(username, email);

  // Trigger personalization
  applyPersonalization(username);

  closeOverlay();
}

// ── Open overlay ───────────────────────────────────────
function openOverlay(mode = 'register') {
  playOverlayOpen();

  // Prevent scroll
  const scrollY = window.scrollY;
  document.body.style.position   = 'fixed';
  document.body.style.top        = `-${scrollY}px`;
  document.body.style.width      = '100%';
  document.body.dataset.scrollY  = scrollY;

  const overlay = buildOverlay();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('reg--visible');
    });
  });

  if (mode === 'login') {
    showLoginForm();
  } else {
    // If already linked, go straight to login
    if (isLinked()) {
      showLoginForm();
    } else {
      showRegistrationForm();
    }
  }

  // Escape to close
  document.addEventListener('keydown', onEscClose);
}

function onEscClose(e) {
  if (e.key === 'Escape') closeOverlay();
}

// ── Close overlay ──────────────────────────────────────
function closeOverlay() {
  if (!_overlay) return;
  document.removeEventListener('keydown', onEscClose);

  // Use CSS transition (not animation) for restrained 200ms fade
  _overlay.classList.remove('reg--visible');
  _overlay.classList.add('reg--exit');

  // Wait for transition to finish, then remove
  const onDone = () => {
    _overlay?.remove();
    _overlay = null;

    // Restore scroll
    const scrollY = parseInt(document.body.dataset.scrollY || '0');
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    window.scrollTo(0, scrollY);

    // Return focus to REGISTER button
    const registerBtn = document.querySelector('.btn-register');
    registerBtn?.focus({ preventScroll: true });
  };

  // Prefer transitionend; fall back to timeout matching CSS duration
  _overlay.addEventListener('transitionend', onDone, { once: true });
  setTimeout(onDone, 280); // safety fallback
}

// ── Personalization ────────────────────────────────────
export function applyPersonalization(operatorId) {
  const greeting = document.getElementById('operator-greeting');
  if (!greeting) return;

  const name = operatorId.toUpperCase();
  greeting.querySelector('.greeting__welcome').textContent =
    `${t('operatorWelcome')} ${name}.`;
  greeting.querySelector('.greeting__status').textContent =
    t('operatorGreeting');
  greeting.classList.add('greeting--visible');

  document.dispatchEvent(new CustomEvent('retrocore:operator-linked', {
    detail: { operatorId },
    bubbles: true,
  }));
}

// ── Public init ────────────────────────────────────────
export function initRegistration() {
  // Wire all REGISTER buttons
  document.querySelectorAll('.btn-register').forEach(btn => {
    btn.addEventListener('click', () => openOverlay('register'));
  });

  // Restore personalization if session exists
  const session = getSession();
  if (session?.operatorId) {
    applyPersonalization(session.operatorId);
  }

  // Re-sync greeting text on lang change
  document.addEventListener('retrocore:refresh-greeting', () => {
    const s = getSession();
    if (s?.operatorId) applyPersonalization(s.operatorId);
  });
}