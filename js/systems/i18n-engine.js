/**
 * RETROCORE://HUB — i18n-engine.js
 * Translation engine.
 * - Reads data-i18n attributes from DOM
 * - Applies string values instantly
 * - Exports reactive t() helper for dynamic strings
 * - Fires 'retrocore:lang-change' event for other modules to react
 */

import { translations } from './translations.js';

const STORAGE_KEY   = 'retrocore_lang';
const DEFAULT_LANG  = 'en';
const SUPPORTED     = ['en', 'ua'];

let _currentLang = DEFAULT_LANG;

// ── Load stored preference ─────────────────────────────
function loadLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return SUPPORTED.includes(stored) ? stored : DEFAULT_LANG;
}

// ── Current language strings ───────────────────────────
function strings() {
  return translations[_currentLang] || translations[DEFAULT_LANG];
}

// ── Translate a key, fallback to EN ───────────────────
export function t(key) {
  const s = strings();
  return Object.prototype.hasOwnProperty.call(s, key)
    ? s[key]
    : (translations[DEFAULT_LANG][key] ?? `[${key}]`);
}

// ── Apply translations to all data-i18n nodes ─────────
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key   = el.dataset.i18n;
    const value = t(key);
    if (!value) return;

    // data-i18n-attr="placeholder" → set attribute instead of text
    const attr = el.dataset.i18nAttr;
    if (attr) {
      el.setAttribute(attr, value);
    } else if (el.dataset.i18nHtml === 'true') {
      el.innerHTML = value;
    } else {
      // Preserve child elements (spans, etc.) — only replace text nodes
      // For simple text elements use textContent
      const hasChildren = el.children.length > 0;
      if (hasChildren) {
        // Find first text node and update it
        const textNode = Array.from(el.childNodes)
          .find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        if (textNode) textNode.textContent = value;
        else el.textContent = value;
      } else {
        el.textContent = value;
      }
    }
  });

  // Update html lang attribute
  document.documentElement.lang =
    _currentLang === 'ua' ? 'uk' : _currentLang;

  // Update page title
  document.title = t('pageTitle');
}

// ── Set language ───────────────────────────────────────
export function setLanguage(lang) {
  if (!SUPPORTED.includes(lang)) return;
  if (lang === _currentLang) return;

  _currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  applyTranslations();

  document.dispatchEvent(new CustomEvent('retrocore:lang-change', {
    detail: { lang, strings: strings() },
    bubbles: true,
  }));
}

// ── Get current language ───────────────────────────────
export function getCurrentLang() {
  return _currentLang;
}

// ── Get all strings for current language ──────────────
export function getStrings() {
  return strings();
}

// ── Init ───────────────────────────────────────────────
export function initI18n() {
  _currentLang = loadLang();
  applyTranslations();
  return _currentLang;
}