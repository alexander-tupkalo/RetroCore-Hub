/**
 * RETROCORE://HUB — platform.js
 * Phase 6 orchestrator.
 * Wires: i18n engine · language switcher · registration · session · localization-events
 */

import { initI18n, t, setLanguage }   from './i18n-engine.js';
import { initLanguageSwitcher }        from './language-switcher.js';
import { initRegistration, applyPersonalization } from './registration.js';
import { getSession, clearSession }    from './session.js';

// ── Operator greeting HTML ─────────────────────────────
function ensureGreetingElement() {
  if (document.getElementById('operator-greeting')) return;

  const el = document.createElement('div');
  el.id = 'operator-greeting';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.innerHTML = `
    <span class="greeting__pip" aria-hidden="true"></span>
    <span class="greeting__welcome"></span>
    <span class="greeting__divider" aria-hidden="true">//</span>
    <span class="greeting__status"></span>
    <button class="greeting__logout" id="greeting-logout" aria-label="Unlink operator session">
      ${t('operatorLogout')}
    </button>
  `;

  // Insert into hero content, before hero title
  const heroContent = document.querySelector('.hero__content');
  const heroTitle   = heroContent?.querySelector('.hero__title');
  if (heroContent && heroTitle) {
    heroContent.insertBefore(el, heroTitle);
  } else {
    // Fallback: prepend to hero
    const hero = document.querySelector('.hero');
    if (hero) hero.prepend(el);
  }
}

// ── Logout handler ─────────────────────────────────────
function wireLogout() {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#greeting-logout')) return;
    clearSession();
    const greeting = document.getElementById('operator-greeting');
    if (greeting) {
      greeting.classList.remove('greeting--visible');
    }
    // Restore REGISTER button text
    document.querySelectorAll('.btn-register').forEach(btn => {
      btn.textContent = t('navRegister');
    });
    document.dispatchEvent(new CustomEvent('retrocore:session-cleared', { bubbles: true }));
  });
}

// ── Update REGISTER button when linked ────────────────
function updateRegisterBtn(operatorId) {
  document.querySelectorAll('.btn-register').forEach(btn => {
    btn.textContent = operatorId
      ? `${operatorId.slice(0, 8).toUpperCase()}`
      : t('navRegister');
  });
}

// ── Sync greeting text on lang change ─────────────────
function syncGreetingOnLangChange() {
  document.addEventListener('retrocore:lang-change', () => {
    const session = getSession();
    if (session?.operatorId) {
      applyPersonalization(session.operatorId);
    }
    // Sync logout button text
    const logoutBtn = document.getElementById('greeting-logout');
    if (logoutBtn) logoutBtn.textContent = t('operatorLogout');
  });
}

// ── Session event handlers ─────────────────────────────
function wireSessionEvents() {
  document.addEventListener('retrocore:operator-linked', (e) => {
    updateRegisterBtn(e.detail?.operatorId);
  });
  document.addEventListener('retrocore:session-cleared', () => {
    updateRegisterBtn(null);
  });
}

// ── Boot sequence translation hook ────────────────────
// Patch boot.js BOOT_LINES to use translated strings at runtime.
// Boot.js is already loaded; we replace its text after lang init
// by listening to the boot start event and regenerating if needed.
// Simple approach: re-export translated boot lines via custom event.
function emitBootTranslations() {
  const bootLines = [
    { key: 'bootLine1', cls: 'boot__line--title',   pause: 520 },
    { key: 'bootLine2', cls: 'boot__line--cmd',      pause: 380 },
    { key: 'bootLine3', cls: 'boot__line--cmd',      pause: 340 },
    { key: 'bootLine4', cls: 'boot__line--cmd',      pause: 380 },
    { key: 'bootLine5', cls: 'boot__line--cmd',      pause: 420 },
    { key: 'bootLine6', cls: 'boot__line--status',   pause: 480, html: true },
    { key: 'bootLine7', cls: 'boot__line--welcome',  pause: 900 },
  ].map(l => ({ ...l, text: t(l.key) }));

  document.dispatchEvent(new CustomEvent('retrocore:boot-translations', {
    detail: { lines: bootLines, skip: t('bootSkip') },
    bubbles: true,
  }));
}

// ── Localization events (ambient terminal i18n) ────────
// Re-emit translated event texts when lang changes
function syncTerminalEvents() {
  document.addEventListener('retrocore:lang-change', () => {
    const evts = [
      t('evt1'), t('evt2'), t('evt3'), t('evt4'),
      t('evt5'), t('evt6'), t('evt7'), t('evt8'),
    ];
    document.dispatchEvent(new CustomEvent('retrocore:update-events', {
      detail: { events: evts }, bubbles: true,
    }));
  });
}

// ── Audio toggle i18n ──────────────────────────────────
function syncAudioToggleLabel() {
  function updateLabel() {
    const toggle = document.getElementById('audio-toggle');
    if (!toggle) return;
    const on = toggle.getAttribute('data-audio') === 'on';
    const label = toggle.querySelector('#audio-label');
    if (label) label.textContent = on ? t('audioOn') : t('audioOff');
  }

  document.addEventListener('retrocore:lang-change', updateLabel);
  // Also sync immediately in case toggle already rendered
  setTimeout(updateLabel, 200);
}

// ── Transition overlay i18n ────────────────────────────
// transitions.js reads module labels at click-time; those use
// hardcoded EN strings. We patch by providing translated strings
// via a globally accessible helper on window (minimal coupling).
function exposeTranslationHelper() {
  window.__rc_t = t;
}

// ── Init ───────────────────────────────────────────────
function init() {
  // 1. Initialize i18n engine (reads localStorage, applies DOM translations)
  const lang = initI18n();

  // 2. Wire language switcher buttons
  initLanguageSwitcher();

  // 3. Ensure greeting DOM element exists
  ensureGreetingElement();

  // 4. Initialize registration system
  initRegistration();

  // 5. Wire session/logout events
  wireLogout();
  wireSessionEvents();

  // 6. Sync greeting on lang change
  syncGreetingOnLangChange();

  // 7. Sync terminal events on lang change
  syncTerminalEvents();

  // 8. Sync audio toggle label on lang change
  syncAudioToggleLabel();

  // 9. Expose t() for modules loaded without direct import
  exposeTranslationHelper();

  // 10. Emit boot translations for boot.js to consume
  emitBootTranslations();

  // 11. Restore session if active
  const session = getSession();
  if (session?.operatorId) {
    updateRegisterBtn(session.operatorId);
  }

  console.log(
    `%c v0.6.0  PLATFORM LAYER ACTIVE  [${lang.toUpperCase()}] `,
    'color:#00e5ff;font-family:monospace;letter-spacing:0.12em;font-weight:bold;'
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}