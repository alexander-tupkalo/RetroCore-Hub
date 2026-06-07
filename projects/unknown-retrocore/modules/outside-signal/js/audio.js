/**
 * Outside Signal — Audio system
 */

export class SignalAudio {
  constructor() {
    this.ctx = null;
    this.humOsc = null;
    this.humGain = null;
    this.muted = false;
    this.volume = 40;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const raw = localStorage.getItem('retrocore-no-audio');
      if (raw) {
        const d = JSON.parse(raw);
        this.volume = typeof d.volume === 'number' ? d.volume : 40;
        this.muted = d.muted === true;
      }
    } catch (e) {}
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {}
    this.initialized = true;
  }

  async activate() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume();
    this._startHum();
    this._scheduleStatic();
  }

  _startHum() {
    if (!this.ctx || this.humOsc) return;
    this.humOsc = this.ctx.createOscillator();
    this.humGain = this.ctx.createGain();
    this.humOsc.type = 'sine';
    this.humOsc.frequency.setValueAtTime(65, this.ctx.currentTime);
    this.humGain.gain.setValueAtTime(
      this.muted ? 0 : 0.06 * (this.volume / 100),
      this.ctx.currentTime
    );
    this.humOsc.connect(this.humGain);
    this.humGain.connect(this.ctx.destination);
    this.humOsc.start();
  }

  _scheduleStatic() {
    const burst = () => {
      if (!this.ctx || this.muted) { setTimeout(burst, 8000 + Math.random() * 12000); return; }
      const now = this.ctx.currentTime;
      const dur = 0.06 + Math.random() * 0.12;
      const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1);
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const gain = this.ctx.createGain();
      const v = Math.max(0.001, (0.03 + Math.random() * 0.05) * (this.volume / 100));
      gain.gain.setValueAtTime(v, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      const flt = this.ctx.createBiquadFilter();
      flt.type = 'bandpass';
      flt.frequency.setValueAtTime(700 + Math.random() * 500, now);
      flt.Q.setValueAtTime(3, now);
      src.connect(flt);
      flt.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(now);
      setTimeout(burst, 5000 + Math.random() * 12000);
    };
    setTimeout(burst, 2000 + Math.random() * 4000);
  }

  playRecovery() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.12);
    const v = Math.max(0.001, 0.35 * (this.volume / 100));
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(v, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.33);
  }

  playComplete() {
    if (!this.ctx || this.muted) return;
    [300, 450, 600].forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx || this.muted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        const v = Math.max(0.001, 0.4 * (this.volume / 100));
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(v, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.55);
      }, i * 220);
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.humGain && this.ctx) {
      this.humGain.gain.setValueAtTime(
        this.muted ? 0 : 0.06 * (this.volume / 100),
        this.ctx.currentTime
      );
    }
    try {
      localStorage.setItem('retrocore-no-audio', JSON.stringify({
        volume: this.volume,
        muted: this.muted,
      }));
    } catch (e) {}
    return this.muted;
  }

  isMuted() { return this.muted; }
}