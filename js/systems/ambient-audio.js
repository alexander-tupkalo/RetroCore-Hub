/**
 * RETROCORE://HUB — ambient-audio.js
 * Procedural ambient soundscape via Web Audio API.
 * No audio files. Activates only after user interaction.
 * Ultra-low volume. Designed to be barely perceptible.
 */

const STORAGE_KEY = 'retrocore_audio';

let _ctx         = null;
let _masterGain  = null;
let _running     = false;
let _nodes       = {};
let _initialized = false;

// ── AudioContext bootstrap ─────────────────────────────
function getCtx() {
  if (_ctx) return _ctx;
  try {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    console.warn('[RETROCORE/audio] Web Audio API unavailable.');
    return null;
  }
  return _ctx;
}

// ── Utility ────────────────────────────────────────────
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// ── 1. Soft CRT hum (low-freq tone + slight detune) ───
function createCRTHum(ctx, dest) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'sine';
  osc1.frequency.value = 60;          // mains hum base
  osc2.type = 'sine';
  osc2.frequency.value = 120;         // harmonic
  osc2.detune.value = 4;

  filter.type = 'lowpass';
  filter.frequency.value = 200;
  filter.Q.value = 0.7;

  gain.gain.value = 0.018;            // barely audible

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  osc1.start();
  osc2.start();

  return { osc1, osc2, gain, filter, stop() { osc1.stop(); osc2.stop(); } };
}

// ── 2. VHS static (band-pass filtered white noise) ────
function createVHSStatic(ctx, dest) {
  const bufLen = ctx.sampleRate * 2;
  const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data   = buf.getChannelData(0);

  // shaped noise — emphasize mid-freq crackle
  for (let i = 0; i < bufLen; i++) {
    data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.997 ? 1.4 : 0.18);
  }

  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop   = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 2800;
  bandpass.Q.value = 0.4;

  const gain = ctx.createGain();
  gain.gain.value = 0.012;

  source.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(dest);
  source.start();

  return { source, bandpass, gain, stop() { source.stop(); } };
}

// ── 3. Terminal ticks (random sparse clicks) ──────────
function scheduleTerminalTicks(ctx, dest) {
  let stopped = false;

  function tick() {
    if (stopped) return;
    const delay = 2800 + Math.random() * 6000;

    setTimeout(() => {
      if (stopped || !_running) { tick(); return; }
      try {
        const buf  = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.012), ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.2));
        }
        const src  = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.value = 0.035 + Math.random() * 0.02;
        src.connect(g);
        g.connect(dest);
        src.start();
      } catch { /* ctx suspended */ }
      tick();
    }, delay);
  }

  tick();
  return { stop() { stopped = true; } };
}

// ── 4. Signal pulse (rare subtle sine blip) ──────────
function scheduleSignalPulses(ctx, dest) {
  let stopped = false;

  function pulse() {
    if (stopped) return;
    const delay = 8000 + Math.random() * 22000;

    setTimeout(() => {
      if (stopped || !_running) { pulse(); return; }
      try {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 880 + Math.random() * 440;

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.022, ctx.currentTime + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
      } catch { /* ctx suspended */ }
      pulse();
    }, delay);
  }

  pulse();
  return { stop() { stopped = true; } };
}

// ── 5. Radar ping (very rare, very soft) ─────────────
function scheduleRadarPings(ctx, dest) {
  let stopped = false;

  function ping() {
    if (stopped) return;
    const delay = 18000 + Math.random() * 36000;

    setTimeout(() => {
      if (stopped || !_running) { ping(); return; }
      try {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        const t    = ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 1.2);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.018, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 1.5);
      } catch { /* ctx suspended */ }
      ping();
    }, delay);
  }

  ping();
  return { stop() { stopped = true; } };
}

// ── Boot line tick (one-shot on event) ────────────────
function playBootTick(ctx, dest) {
  try {
    const buf  = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.018), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.25)) * 0.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = 0.04;
    src.connect(g);
    g.connect(dest);
    src.start();
  } catch { /* fine */ }
}

// ── Public API ────────────────────────────────────────
export function isAudioEnabled() {
  return localStorage.getItem(STORAGE_KEY) !== 'off';
}

export function initAudio() {
  if (_initialized) return;
  _initialized = true;

  const enabled = isAudioEnabled();

  // Only start after first interaction
  function onFirstInteraction() {
    document.removeEventListener('click',   onFirstInteraction);
    document.removeEventListener('keydown', onFirstInteraction);
    if (enabled) startAudio();
  }

  document.addEventListener('click',   onFirstInteraction, { passive: true });
  document.addEventListener('keydown', onFirstInteraction, { passive: true });

  // Boot-line ticks
  document.addEventListener('retrocore:boot-line', () => {
    if (!_running || !_ctx || !_masterGain) return;
    playBootTick(_ctx, _masterGain);
  });

  // Transition ticks
  document.addEventListener('retrocore:trans-tick', () => {
    if (!_running || !_ctx || !_masterGain) return;
    playBootTick(_ctx, _masterGain);
  });
}

export function startAudio() {
  if (_running) return;
  const ctx = getCtx();
  if (!ctx) return;

  // Resume suspended context (required post-interaction)
  if (ctx.state === 'suspended') ctx.resume();

  _masterGain = ctx.createGain();
  _masterGain.gain.value = 0.7;         // master volume (low)
  _masterGain.connect(ctx.destination);

  // Fade in gently
  _masterGain.gain.setValueAtTime(0, ctx.currentTime);
  _masterGain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 2.5);

  _nodes.hum    = createCRTHum(ctx, _masterGain);
  _nodes.static = createVHSStatic(ctx, _masterGain);
  _nodes.ticks  = scheduleTerminalTicks(ctx, _masterGain);
  _nodes.pulses = scheduleSignalPulses(ctx, _masterGain);
  _nodes.radar  = scheduleRadarPings(ctx, _masterGain);

  _running = true;
  localStorage.setItem(STORAGE_KEY, 'on');
}

export function stopAudio() {
  if (!_running || !_ctx || !_masterGain) return;

  // Fade out
  _masterGain.gain.linearRampToValueAtTime(0, _ctx.currentTime + 0.8);

  setTimeout(() => {
    Object.values(_nodes).forEach(n => { try { n.stop?.(); } catch { /* ok */ } });
    _nodes   = {};
    _running = false;
    localStorage.setItem(STORAGE_KEY, 'off');
  }, 900);
}

export function toggleAudio() {
  if (_running) {
    stopAudio();
    return false;
  } else {
    const ctx = getCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    startAudio();
    return true;
  }
}