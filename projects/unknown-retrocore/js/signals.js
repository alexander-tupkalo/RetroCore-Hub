/**
 * RETROCORE://UNKNOWN_SECTOR
 * Signal Trace System
 * Atmospheric background — slow-scrolling waveform traces
 */

export class SignalTraces {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;
    this.width = 0;
    this.height = 0;

    // Trace configurations
    this.traces = [
      { y: 0.28, amplitude: 12, frequency: 0.014, speed: 0.35, color: '90, 154, 154' },
      { y: 0.58, amplitude: 8,  frequency: 0.022, speed: 0.22, color: '74, 122, 90'  },
      { y: 0.84, amplitude: 6,  frequency: 0.009, speed: 0.16, color: '90, 154, 154' },
    ];

    // Pre-generate smooth noise buffers
    const BUFFER_LEN = 4096;
    this.bufferLen = BUFFER_LEN;
    this.noiseBuffers = this.traces.map(() => {
      const buf = new Float32Array(BUFFER_LEN);
      let val = 0;
      for (let i = 0; i < BUFFER_LEN; i++) {
        val += (Math.random() - 0.5) * 0.25;
        val *= 0.985;
        buf[i] = val;
      }
      return buf;
    });

    // Pre-defined anomaly spikes (deterministic, no random flicker)
    this.spikes = [
      { trace: 0, pos: 600,  width: 18, height: 32 },
      { trace: 0, pos: 2400, width: 12, height: 20 },
      { trace: 1, pos: 1400, width: 22, height: 26 },
      { trace: 2, pos: 2800, width: 15, height: 18 },
    ];

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  _interpolateNoise(traceIndex, position) {
    const buf = this.noiseBuffers[traceIndex];
    const len = this.bufferLen;
    const pos = ((position % len) + len) % len;
    const i = Math.floor(pos);
    const frac = pos - i;
    return buf[i] + (buf[(i + 1) % len] - buf[i]) * frac;
  }

  _getSpike(traceIndex, position) {
    let val = 0;
    for (const s of this.spikes) {
      if (s.trace !== traceIndex) continue;
      let diff = position - s.pos;
      diff = ((diff % this.bufferLen) + this.bufferLen) % this.bufferLen;
      if (diff < s.width) {
        val += Math.sin((diff / s.width) * Math.PI) * s.height;
      }
    }
    return val;
  }

  update() {
    this.time += 1;
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    for (let t = 0; t < this.traces.length; t++) {
      const trace = this.traces[t];
      const baseY = this.height * trace.y;
      const offset = this.time * trace.speed;

      // Faint baseline
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      ctx.lineTo(this.width, baseY);
      ctx.strokeStyle = `rgba(${trace.color}, 0.06)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Waveform
      ctx.beginPath();
      for (let x = 0; x <= this.width; x += 2) {
        const pos = x + offset;
        const sine = Math.sin(pos * trace.frequency) * trace.amplitude;
        const harmonic = Math.sin(pos * trace.frequency * 2.7 + 1.3) * trace.amplitude * 0.2;
        const noise = this._interpolateNoise(t, pos * 0.4) * trace.amplitude * 0.6;
        const spike = this._getSpike(t, pos);
        const y = baseY + sine + harmonic + noise + spike;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${trace.color}, 0.35)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }
}