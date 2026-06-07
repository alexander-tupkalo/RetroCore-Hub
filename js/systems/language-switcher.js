/**
 * RETROCORE://HUB — language-switcher.js
 * Upgrades existing .lang-btn elements into a fully reactive
 * cinematic language switching system.
 */

import { setLanguage, getCurrentLang } from './i18n-engine.js';

// ── Visual sync across all switcher groups ─────────────
function syncButtons(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

// ── Micro-flash feedback on button ────────────────────
function flashButton(btn) {
  btn.classList.remove('lang-flash');
  void btn.offsetWidth; // reflow
  btn.classList.add('lang-flash');
  btn.addEventListener('animationend', () =>
    btn.classList.remove('lang-flash'), { once: true });
}

// ── Cinematic page-transition shimmer ─────────────────
function pageShimmer() {
  const shimmer = document.createElement('div');
  shimmer.style.cssText = `
    position:fixed;inset:0;z-index:6000;pointer-events:none;
    background:linear-gradient(
      180deg,
      transparent 0%,
      rgba(0,229,255,0.025) 50%,
      transparent 100%
    );
    opacity:0;transition:opacity 0.18s ease;
  `;
  document.body.appendChild(shimmer);
  requestAnimationFrame(() => {
    shimmer.style.opacity = '1';
    setTimeout(() => {
      shimmer.style.opacity = '0';
      shimmer.addEventListener('transitionend', () => shimmer.remove(), { once: true });
    }, 220);
  });
}

// ── Init ───────────────────────────────────────────────
export function initLanguageSwitcher() {
  const currentLang = getCurrentLang();
  syncButtons(currentLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === getCurrentLang()) return;

      setLanguage(lang);
      syncButtons(lang);
      flashButton(btn);
      pageShimmer();

      document.dispatchEvent(new CustomEvent('retrocore:lang-switched', {
        detail: { lang }, bubbles: true
      }));
    });
  });

  // Keep in sync if language changes from elsewhere (e.g., registration)
  document.addEventListener('retrocore:lang-change', (e) => {
    syncButtons(e.detail.lang);
  });
}