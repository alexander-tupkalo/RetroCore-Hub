/**
 * Night Observer — Audio & Atmosphere System
 * Phase 4: ambient track, synthesized effects, station events
 */

export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambient = null;
    this.muted = false;
    this.volume = 18;
    this.initialized = false;
    this._indicatorEl = null;
    this._stationTimer = null;
    this._stationInterval = null;
  }

  setIndicator(el) {
    this._indicatorEl = el;
  }

  init() {
    if (this.initialized) return;

    try {
      const raw = localStorage.getItem('retrocore-no-audio');
      if (raw) {
        const data = JSON.parse(raw);
        this.volume = typeof data.volume === 'number' ? data.volume : 18;
        this.muted = data.muted === true;
      }
    } catch (e) {}

    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this._applyGain();
    } catch (e) {}

    try {
      this.ambient = new Audio('assets/audio/night-observer-ambient.mp3');
      this.ambient.preload = 'metadata';
      this.ambient.loop = true;
      this._applyAmbientVolume();

      this.ambient.addEventListener('canplaythrough', () => {
        console.log('[Night Observer] Ambient loaded successfully');
      });

      this.ambient.addEventListener('play', () => {
        console.log('[Night Observer] Ambient playback started');
      });

      this.ambient.addEventListener('error', (e) => {
        console.error('[Night Observer] Ambient failed to load', e);
      });
    } catch (e) {}

    this.initialized = true;
  }

  async activate() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (this.ambient) {
      try {
        await this.ambient.play();
        console.log('[Night Observer] Ambient online');
      } catch (e) {}
    }
    this._startStationEvents();
  }

  _applyGain() {
    if (!this.masterGain) return;
    const now = this.ctx ? this.ctx.currentTime : 0;
    this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume / 100, now);
  }

  _applyAmbientVolume() {
    if (!this.ambient) return;
    this.ambient.volume = this.muted ? 0 : this.volume / 100;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(100, val));
    this._applyGain();
    this._applyAmbientVolume();
    this._save();
  }

  toggleMute() {
    this.muted = !this.muted;
    this._applyGain();
    this._applyAmbientVolume();
    this._save();
    if (this.muted) {
      console.log('[Night Observer] Ambient muted');
    } else {
      console.log('[Night Observer] Ambient restored');
    }
    return this.muted;
  }

  isMuted() { return this.muted; }
  getVolume() { return this.volume; }

  _save() {
    try {
      localStorage.setItem('retrocore-no-audio', JSON.stringify({
        volume: this.volume,
        muted: this.muted,
      }));
    } catch (e) {}
  }

  _pulse() {
    if (!this._indicatorEl || this.muted) return;
    this._indicatorEl.classList.add('audio-indicator--pulse');
    setTimeout(() => {
      if (this._indicatorEl) {
        this._indicatorEl.classList.remove('audio-indicator--pulse');
      }
    }, 900);
  }

  // --- Primitive generators ---

  _tone(freq, duration, type, volMult, detune) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, now);
    if (detune) osc.detune.setValueAtTime(detune, now);
    const v = Math.max(0.001, (volMult || 0.3) * (this.volume / 100));
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(v, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  _noise(duration, volMult, freq, q) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    const v = Math.max(0.001, (volMult || 0.1) * (this.volume / 100));
    gain.gain.setValueAtTime(v, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    const flt = this.ctx.createBiquadFilter();
    flt.type = 'bandpass';
    flt.frequency.setValueAtTime(freq || 800, now);
    flt.Q.setValueAtTime(q || 2, now);
    src.connect(flt);
    flt.connect(gain);
    gain.connect(this.masterGain);
    src.start(now);
  }

  _click() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * 0.025));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1 * (this.volume / 100), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(2000, now);
    src.connect(hp);
    hp.connect(gain);
    gain.connect(this.masterGain);
    src.start(now);
  }

  // --- Event sounds ---

  playContactDetected() {
    this._tone(880, 0.15, 'sine', 0.25);
    setTimeout(() => this._tone(1100, 0.12, 'sine', 0.2), 120);
    this._pulse();
  }

  playCorrelated() {
    this._tone(780, 0.3, 'sine', 0.3, 15);
    this._tone(820, 0.3, 'sine', 0.3, -15);
    setTimeout(() => this._tone(960, 0.2, 'triangle', 0.22), 200);
    this._pulse();
  }

  playConfirmAnomaly() {
    this._tone(660, 0.2, 'sine', 0.35);
    setTimeout(() => this._tone(880, 0.2, 'sine', 0.35), 150);
    setTimeout(() => this._tone(1100, 0.3, 'sine', 0.28), 300);
    this._pulse();
  }

  playFalsePositive() {
    this._tone(300, 0.25, 'sawtooth', 0.15);
    this._tone(220, 0.35, 'sine', 0.13);
    this._pulse();
  }

  playMissedAnomaly() {
    this._tone(200, 0.5, 'sine', 0.22);
    this._tone(150, 0.6, 'sine', 0.16, -50);
    this._pulse();
  }

  // --- Milestone sounds ---

  playMilestone2() {
    this._tone(120, 0.8, 'sine', 0.35);
    this._tone(180, 0.6, 'triangle', 0.22);
    this._noise(0.3, 0.08, 600, 3);
    this._pulse();
  }

  playMilestone4() {
    this._tone(100, 1.0, 'sine', 0.32);
    setTimeout(() => this._tone(150, 0.8, 'sine', 0.28), 200);
    setTimeout(() => this._tone(200, 0.6, 'triangle', 0.22), 400);
    setTimeout(() => this._tone(250, 0.5, 'sine', 0.18), 600);
    this._noise(0.5, 0.06, 500, 2);
    this._pulse();
  }

  playMilestone7() {
    this._tone(80, 1.5, 'sine', 0.35);
    setTimeout(() => this._tone(120, 1.2, 'sine', 0.32), 300);
    setTimeout(() => this._tone(160, 1.0, 'triangle', 0.28), 600);
    setTimeout(() => this._tone(200, 0.8, 'sine', 0.22), 900);
    setTimeout(() => this._tone(240, 0.6, 'triangle', 0.18), 1200);
    setTimeout(() => this._tone(300, 0.5, 'sine', 0.15), 1500);
    this._noise(0.8, 0.05, 400, 1.5);
    this._pulse();
  }

  // --- Station ambient events ---

  _startStationEvents() {
    if (this._stationInterval) return;

    const schedule = () => {
      const delay = 15000 + Math.random() * 45000;
      this._stationTimer = setTimeout(() => {
        console.log('[Night Observer] Station event triggered');
        this._playStationEvent();
        schedule();
      }, delay);
    };
    schedule();
    this._stationInterval = true;
  }

  _playStationEvent() {
    if (!this.ctx || this.muted) return;
    const fns = [
      () => this._click(),
      () => this._tone(2000, 0.02, 'square', 0.06),
      () => this._noise(0.15, 0.06, 1200, 4),
      () => this._tone(60, 1.5, 'sine', 0.04),
      () => this._tone(400, 0.3, 'sine', 0.07, 20),
    ];
    fns[Math.floor(Math.random() * fns.length)]();
  }

  destroy() {
    if (this._stationTimer) clearTimeout(this._stationTimer);
    if (this.ambient) {
      this.ambient.pause();
      this.ambient.src = '';
      this.ambient = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}