/**
 * RETROCORE://HUB — mini-player.js
 * Floating mini radio player for Retro Wavecast.
 * Synced with radio.js state controller.
 * Visible across all HUB pages once stream is configured.
 */

import {
  initRadio, play, pause, toggle,
  setVolume, getVolume, isPlaying, hasStream,
  onStateChange, getState
} from './radio.js';

// ── SVG icon helpers ──────────────────────────────────
const PLAY_ICON =
  `<svg viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 2L10 6L3 10Z"/>
  </svg>`;

const PAUSE_ICON =
  `<svg viewBox="0 0 12 12" aria-hidden="true">
    <rect x="2.5" y="2" width="3" height="8" rx="0.5"/>
    <rect x="6.5" y="2" width="3" height="8" rx="0.5"/>
  </svg>`;

// ── Build player DOM ──────────────────────────────────
function buildPlayer() {
  const el = document.createElement('div');
  el.id = 'mini-player';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Retro Wavecast mini player');

  el.innerHTML = `
    <div class="mp__header">
      <div class="mp__brand">
        <span class="mp__title">RETRO WAVECAST</span>
        <div class="mp__status">
          <span class="mp__status-pip" aria-hidden="true"></span>
          <span class="mp__status-text" id="mp-status-text">OFFLINE</span>
        </div>
      </div>
      <button class="mp__collapse" id="mp-collapse" aria-label="Toggle player" aria-expanded="true">▾</button>
    </div>

    <div class="mp__body">
      <!-- EQ bars -->
      <div class="mp__eq" aria-hidden="true">
        <span class="mp__eq-bar" style="height:18px"></span>
        <span class="mp__eq-bar" style="height:14px"></span>
        <span class="mp__eq-bar" style="height:18px"></span>
        <span class="mp__eq-bar" style="height:10px"></span>
        <span class="mp__eq-bar" style="height:16px"></span>
      </div>

      <!-- Play/Pause -->
      <button class="mp__play" id="mp-play" aria-label="Play / Pause">
        ${PLAY_ICON}
      </button>

      <!-- Volume -->
      <div class="mp__vol-wrap">
        <span class="mp__vol-label">VOL</span>
        <input
          type="range"
          class="mp__vol"
          id="mp-vol"
          min="0" max="1" step="0.02"
          value="${getVolume()}"
          aria-label="Volume"
        >
      </div>
    </div>

    <div class="mp__footer">
      <a class="mp__open" href="./projects/retro-wavecast/index.html" aria-label="Open Retro Wavecast station">
        OPEN STATION
        <svg viewBox="0 0 9 9">
          <path d="M1.5 7.5L7.5 1.5M4 1.5h3.5V5" stroke-linecap="round"/>
        </svg>
      </a>
      <span class="mp__freq">94.7 FM</span>
    </div>
  `;

  document.body.appendChild(el);
  return el;
}

// ── Sync UI to current state ──────────────────────────
function syncUI(el, state) {
  // Playing class
  el.classList.toggle('mp--playing', state.playing);

  // Status text
  const statusEl = el.querySelector('#mp-status-text');
  if (statusEl) statusEl.textContent = state.playing ? 'LIVE' : 'OFFLINE';

  // Play button icon
  const playBtn = el.querySelector('#mp-play');
  if (playBtn) {
    playBtn.innerHTML = state.playing ? PAUSE_ICON : PLAY_ICON;
    playBtn.setAttribute('aria-label', state.playing ? 'Pause' : 'Play');
  }

  // Volume slider
  const volEl = el.querySelector('#mp-vol');
  if (volEl && Math.abs(parseFloat(volEl.value) - state.volume) > 0.01) {
    volEl.value = String(state.volume);
  }
}

// ── Wire events ───────────────────────────────────────
function wirePlayer(el) {
  // Play/Pause
  el.querySelector('#mp-play')?.addEventListener('click', () => {
    toggle();
  });

  // Volume
  el.querySelector('#mp-vol')?.addEventListener('input', (e) => {
    setVolume(parseFloat(e.target.value));
  });

  // Collapse / expand
  const collapseBtn = el.querySelector('#mp-collapse');
  collapseBtn?.addEventListener('click', () => {
    const collapsed = el.classList.toggle('mp--collapsed');
    collapseBtn.textContent = collapsed ? '▸' : '▾';
    collapseBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  });

  // Prevent mini-player clicks from triggering other handlers
  el.addEventListener('click', (e) => e.stopPropagation());
}

// ── Show / hide ───────────────────────────────────────
let _el = null;

export function showMiniPlayer() {
  if (_el) return;
  _el = buildPlayer();
  wirePlayer(_el);

  // Sync state
  syncUI(_el, getState());

  // Subscribe to state changes
  onStateChange((state) => syncUI(_el, state));

  // Show with slight delay for cinematic feel
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      _el.classList.add('mp--visible');
    });
  });
}

export function hideMiniPlayer() {
  if (!_el) return;
  _el.classList.remove('mp--visible');
  _el.addEventListener('transitionend', () => {
    _el?.remove();
    _el = null;
  }, { once: true });
}

// ── Public init ───────────────────────────────────────
export function initMiniPlayer() {
  // Init radio state
  initRadio();

  // Show player — it's part of the OS chrome
  showMiniPlayer();

  // Expose for retro-wavecast module to call setStream()
  // The wavecast module can do: window.__rc_radio?.setStream(url)
  // or import directly if same origin

  console.log(
    '%c v0.7.0  MINI PLAYER ACTIVE ',
    'color:#ff2d9b;font-family:monospace;letter-spacing:0.12em;font-weight:bold;'
  );
}