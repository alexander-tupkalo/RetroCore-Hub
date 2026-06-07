/**
 * RETROCORE://HUB — overlays.js
 * Shared loading state helpers and utility overlay functions.
 * Used by boot.js, transitions.js, and any future system.
 */

// ── Page loading state ────────────────────────────────
export function setPageLoading(active) {
  document.documentElement.setAttribute('data-loading', active ? 'true' : 'false');
  document.body.style.cursor = active ? 'wait' : '';
}

// ── Lock / unlock scroll ──────────────────────────────
export function lockScroll() {
  const scrollY = window.scrollY;
  document.body.style.position   = 'fixed';
  document.body.style.top        = `-${scrollY}px`;
  document.body.style.width      = '100%';
  document.body.dataset.scrollY  = scrollY;
}

export function unlockScroll() {
  const scrollY = parseInt(document.body.dataset.scrollY || '0');
  document.body.style.position = '';
  document.body.style.top      = '';
  document.body.style.width    = '';
  window.scrollTo(0, scrollY);
}

// ── Fullscreen dim backdrop ───────────────────────────
let _dimEl = null;

export function showDim(opacity = 0.6, zIndex = 90) {
  if (_dimEl) return;
  _dimEl = document.createElement('div');
  _dimEl.className = 'rc-dim';
  _dimEl.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,${opacity});
    z-index:${zIndex};pointer-events:none;opacity:0;
    transition:opacity 0.5s ease;
  `;
  document.body.appendChild(_dimEl);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { _dimEl.style.opacity = '1'; });
  });
}

export function hideDim() {
  if (!_dimEl) return;
  _dimEl.style.opacity = '0';
  _dimEl.addEventListener('transitionend', () => {
    _dimEl?.remove();
    _dimEl = null;
  }, { once: true });
}

// ── Tiny inline status flash (used by boot for page title) ─
let _titleInterval = null;

export function flashPageTitle(msg, durationMs = 3000) {
  const original = document.title;
  let blink = false;
  clearInterval(_titleInterval);
  _titleInterval = setInterval(() => {
    document.title = blink ? original : msg;
    blink = !blink;
  }, 700);
  setTimeout(() => {
    clearInterval(_titleInterval);
    document.title = original;
  }, durationMs);
}