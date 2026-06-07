/**
 * RETROCORE://HUB — session.js
 * Fake operator session system — localStorage only.
 * No real auth. Stores operator identity for personalization.
 */

const KEYS = {
  OPERATOR:  'retrocore_operator',
  EMAIL:     'retrocore_email',
  LINKED:    'retrocore_linked',
  HASH:      'retrocore_hash',
};

// ── Simple deterministic "hash" for display purposes ──
function fakeHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16).toUpperCase().padStart(8, '0');
}

// ── Write session ──────────────────────────────────────
export function createSession(operatorId, email = '') {
  localStorage.setItem(KEYS.OPERATOR, operatorId.trim());
  localStorage.setItem(KEYS.EMAIL,    email.trim().toLowerCase());
  localStorage.setItem(KEYS.LINKED,   '1');
  localStorage.setItem(KEYS.HASH,     fakeHash(operatorId + email));

  document.dispatchEvent(new CustomEvent('retrocore:session-created', {
    detail: { operatorId },
    bubbles: true,
  }));
}

// ── Restore / verify session ───────────────────────────
export function getSession() {
  const linked = localStorage.getItem(KEYS.LINKED) === '1';
  if (!linked) return null;
  return {
    operatorId: localStorage.getItem(KEYS.OPERATOR) || '',
    email:      localStorage.getItem(KEYS.EMAIL)    || '',
    hash:       localStorage.getItem(KEYS.HASH)     || '',
    linked:     true,
  };
}

// ── Clear session ──────────────────────────────────────
export function clearSession() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  document.dispatchEvent(new CustomEvent('retrocore:session-cleared', { bubbles: true }));
}

// ── Simple "login" — checks stored operatorId ─────────
export function verifySession(operatorId) {
  const stored = localStorage.getItem(KEYS.OPERATOR);
  return stored && stored.toLowerCase() === operatorId.trim().toLowerCase();
}

// ── Check if already linked ───────────────────────────
export function isLinked() {
  return localStorage.getItem(KEYS.LINKED) === '1';
}