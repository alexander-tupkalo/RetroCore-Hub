/**
 * RETROCORE://HUB — radio.js
 * Lightweight global radio persistence system.
 * Keeps Retro Wavecast audio alive across HUB navigation.
 * Uses a single shared Audio element + localStorage sync.
 * No frameworks. No overengineering.
 */

const RADIO_KEY_PLAYING = 'rc_radio_playing';
const RADIO_KEY_VOLUME  = 'rc_radio_volume';
const RADIO_KEY_SRC     = 'rc_radio_src';

// Default stream URL — overridden by retro-wavecast module if it has one
const DEFAULT_SRC = './projects/retro-wavecast/assets/audio/track-01.mp3';
const DEFAULT_VOL = 0.45;

let _audio   = null;
let _playing = false;
let _volume  = DEFAULT_VOL;
let _src     = null;

// Callbacks registered by mini-player UI
const _listeners = new Set();

function notify(state) {
  _listeners.forEach(fn => fn(state));
}

// ── Persist state ──────────────────────────────────────
function saveState() {
  try {
    localStorage.setItem(RADIO_KEY_PLAYING, _playing ? '1' : '0');
    localStorage.setItem(RADIO_KEY_VOLUME,  String(_volume));
    if (_src) localStorage.setItem(RADIO_KEY_SRC, _src);
  } catch { /* private browsing */ }
}

// ── Restore state ──────────────────────────────────────
function loadState() {
  try {
    _playing = localStorage.getItem(RADIO_KEY_PLAYING) === '1';
    _volume  = parseFloat(localStorage.getItem(RADIO_KEY_VOLUME) || String(DEFAULT_VOL));
    _src     = localStorage.getItem(RADIO_KEY_SRC) || null;
  } catch { /* ok */ }
}

// ── Get or create Audio element ────────────────────────
function getAudio() {
  if (_audio) return _audio;

  // Check if retro-wavecast already created a global audio element
  const existing = document.getElementById('rc-radio-audio');
  if (existing) {
    _audio = existing;
    return _audio;
  }

  _audio = document.createElement('audio');
  _audio.id     = 'rc-radio-audio';
  _audio.loop   = true;
  _audio.volume = _volume;
  _audio.setAttribute('preload', 'none');
  document.body.appendChild(_audio);
  return _audio;
}

// ── Set stream source ──────────────────────────────────
// Called by retro-wavecast module with its actual stream URL
export function setStream(url) {
  _src = url;

  const audio = getAudio();

  if (audio.src !== url) {
    audio.src = url;
  }

  audio.play().catch(() => {});

  _playing = true;

  saveState();
}

// ── Play / Pause ───────────────────────────────────────
export function play() {
  const audio = getAudio();
  if (!_src && !audio.src) return; // no stream configured yet

  _playing = true;
  audio.volume = _volume;
  audio.play().catch(() => {
    // Autoplay blocked — wait for interaction
    _playing = false;
    notify(getState());
  });
  saveState();
  notify(getState());
}

export function pause() {
  const audio = getAudio();
  _playing = false;
  audio.pause();
  saveState();
  notify(getState());
}

export function toggle() {
  if (_playing) pause(); else play();
  return _playing;
}

// ── Volume ─────────────────────────────────────────────
export function setVolume(v) {
  _volume = Math.max(0, Math.min(1, v));
  const audio = getAudio();
  audio.volume = _volume;
  saveState();
  notify(getState());
}

export function getVolume() { return _volume; }

// ── State ──────────────────────────────────────────────
export function isPlaying() { return _playing; }
export function hasStream()  { return Boolean(_src); }

export function getState() {
  return { playing: _playing, volume: _volume, src: _src };
}

// ── Subscribe to state changes ─────────────────────────
export function onStateChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

// ── Cross-page sync via storage events ────────────────
function handleStorageEvent(e) {
  if (e.key === RADIO_KEY_PLAYING) {
    const shouldPlay = e.newValue === '1';
    if (shouldPlay !== _playing) {
      shouldPlay ? play() : pause();
    }
  }
  if (e.key === RADIO_KEY_VOLUME) {
    const vol = parseFloat(e.newValue || String(DEFAULT_VOL));
    setVolume(vol);
  }
}

// ── Init ───────────────────────────────────────────────
export function initRadio() {
  loadState();

  const audio = getAudio();
  audio.volume = _volume;

  // Sync playing state from audio element events
  audio.addEventListener('play',  () => { _playing = true;  notify(getState()); });
  audio.addEventListener('pause', () => { _playing = false; notify(getState()); });
  audio.addEventListener('ended', () => { _playing = false; notify(getState()); });

  // Cross-tab sync
  window.addEventListener('storage', handleStorageEvent, { passive: true });

  // Resume if was playing (requires user interaction — handled at first click)
  if (_playing && _src) {
    audio.src = _src;
    // Will actually start in mini-player after first interaction
  }

  return { playing: _playing, volume: _volume };
}