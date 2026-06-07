/**
 * Night Observer — Main radar/observation canvas display
 */

export class RadarDisplay {
  constructor(canvas, container) {
    this.canvas = canvas;
    this.container = container;
    this.ctx = canvas.getContext('2d');
    this.size = 0;
    this.cx = 0;
    this.cy = 0;
    this.radius = 0;
    this.sweepAngle = 0;
    this.sweepSpeed = 0.75; // ~8.4s per revolution
    this.anomaly = null;
    this.markers = [];
    this.reticle = null;
    this.time = 0;

    // Pre-generate stars
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 0.08 + Math.random() * 0.88;
      this.stars.push({
        x: 0.5 + Math.cos(a) * d * 0.5,
        y: 0.5 + Math.sin(a) * d * 0.5,
        brightness: 0.03 + Math.random() * 0.08,
        twinkle: Math.random() < 0.15,
        twinkleSpeed: 1.5 + Math.random() * 2,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Pre-generate noise positions
    this.noiseDots = [];
    for (let i = 0; i < 70; i++) {
      this.noiseDots.push({
        rx: Math.random(),
        ry: Math.random(),
        size: 1,
        alpha: 0.02 + Math.random() * 0.04,
      });
    }

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const rect = this.container.getBoundingClientRect();
    const maxSize = Math.min(rect.width, rect.height);
    const size = Math.max(200, Math.floor(maxSize));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.size = size;
    this.cx = size / 2;
    this.cy = size / 2;
    this.radius = Math.max(1, size / 2 - 16);
  }

  setAnomaly(anomaly) {
    this.anomaly = anomaly;
  }

  addMarker(anomaly) {
    this.markers.push({ x: anomaly.x, y: anomaly.y, alpha: 1.0 });
  }

  showReticle(anomaly, durationMs) {
    this.reticle = {
      x: anomaly.x,
      y: anomaly.y,
      alpha: 1.0,
      duration: durationMs / 1000,
      age: 0,
    };
  }

  update(dt) {
    this.time += dt;
    this.sweepAngle += this.sweepSpeed * dt;
    if (this.sweepAngle > Math.PI * 2) this.sweepAngle -= Math.PI * 2;

    for (const dot of this.noiseDots) {
      dot.rx += (Math.random() - 0.5) * 0.08;
      dot.ry += (Math.random() - 0.5) * 0.08;
      if (dot.rx < 0 || dot.rx > 1) dot.rx = Math.random();
      if (dot.ry < 0 || dot.ry > 1) dot.ry = Math.random();
    }

    for (let i = this.markers.length - 1; i >= 0; i--) {
      this.markers[i].alpha -= dt * 0.12;
      if (this.markers[i].alpha <= 0) this.markers.splice(i, 1);
    }

    if (this.reticle) {
      this.reticle.age += dt;
      this.reticle.alpha = Math.max(0, 1 - this.reticle.age / this.reticle.duration);
      if (this.reticle.alpha <= 0) this.reticle = null;
    }
  }

  draw() {
    const ctx = this.ctx;
    const { cx, cy, radius, size } = this;
    ctx.clearRect(0, 0, size, size);

    this._drawBackground();
    this._drawStars();
    this._drawNoise();
    this._drawGrid();
    this._drawRangeRings();
    this._drawCompass();
    this._drawSweep();
    this._drawMarkers();
    if (this.anomaly) this._drawAnomaly();
    if (this.reticle) this._drawReticle();
    this._drawVignette();
  }

  _drawBackground() {
    const { ctx, cx, cy, radius, size } = this;
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, size, size);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, 'rgba(90, 154, 154, 0.018)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  _drawStars() {
    const { ctx, radius } = this;
    for (const star of this.stars) {
      let b = star.brightness;
      if (star.twinkle) {
        b *= 0.5 + 0.5 * Math.sin(this.time * star.twinkleSpeed + star.twinklePhase);
      }
      if (b < 0.01) continue;
      const px = this.cx + (star.x - 0.5) * radius * 2;
      const py = this.cy + (star.y - 0.5) * radius * 2;
      ctx.beginPath();
      ctx.arc(px, py, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(160, 190, 200, ' + b + ')';
      ctx.fill();
    }
  }

  _drawNoise() {
    const { ctx, radius } = this;
    for (const dot of this.noiseDots) {
      const px = this.cx + (dot.rx - 0.5) * radius * 2;
      const py = this.cy + (dot.ry - 0.5) * radius * 2;
      const dx = px - this.cx;
      const dy = py - this.cy;
      if (dx * dx + dy * dy > radius * radius) continue;
      ctx.fillStyle = 'rgba(120, 180, 180, ' + dot.alpha + ')';
      ctx.fillRect(px, py, dot.size, dot.size);
    }
  }

  _drawGrid() {
    const { ctx, cx, cy, radius } = this;
    ctx.strokeStyle = 'rgba(90, 154, 154, 0.03)';
    ctx.lineWidth = 0.5;
    const step = radius / 6;
    for (let i = -6; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * step, cy - radius);
      ctx.lineTo(cx + i * step, cy + radius);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy + i * step);
      ctx.lineTo(cx + radius, cy + i * step);
      ctx.stroke();
    }
  }

  _drawRangeRings() {
    const { ctx, cx, cy, radius } = this;
    const rings = [0.25, 0.5, 0.75, 1.0];
    const labels = ['25', '50', '75', '100'];

    for (let i = 0; i < rings.length; i++) {
      const r = Math.max(1, radius * rings[i]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(90, 154, 154, 0.07)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.font = '9px "IBM Plex Mono", monospace';
      ctx.fillStyle = 'rgba(90, 154, 154, 0.15)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(labels[i], cx + 4, cy - r + 10);
    }
  }

  _drawCompass() {
    const { ctx, cx, cy, radius } = this;
    const dirs = [
      { label: 'N', angle: -Math.PI / 2 },
      { label: 'E', angle: 0 },
      { label: 'S', angle: Math.PI / 2 },
      { label: 'W', angle: Math.PI },
    ];

    for (let deg = 0; deg < 360; deg += 10) {
      const a = (deg / 180) * Math.PI - Math.PI / 2;
      const isMajor = deg % 30 === 0;
      const inner = radius - (isMajor ? 8 : 4);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
      ctx.strokeStyle = isMajor ? 'rgba(90, 154, 154, 0.12)' : 'rgba(90, 154, 154, 0.05)';
      ctx.lineWidth = isMajor ? 0.8 : 0.5;
      ctx.stroke();
    }

    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(122, 188, 188, 0.25)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const d of dirs) {
      const dist = radius + 12;
      ctx.fillText(d.label, cx + Math.cos(d.angle) * dist, cy + Math.sin(d.angle) * dist);
    }
  }

  _drawSweep() {
    const { ctx, cx, cy, radius, sweepAngle } = this;
    const trailLength = 1.0;
    const segments = 30;

    for (let i = 0; i < segments; i++) {
      const t0 = i / segments;
      const t1 = (i + 1) / segments;
      const a0 = sweepAngle - trailLength * (1 - t0);
      const a1 = sweepAngle - trailLength * (1 - t1);
      const alpha = t1 * 0.1;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, a0, a1);
      ctx.closePath();
      ctx.fillStyle = 'rgba(90, 154, 154, ' + alpha + ')';
      ctx.fill();
    }

    const sx = cx + Math.cos(sweepAngle) * radius;
    const sy = cy + Math.sin(sweepAngle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sx, sy);
    ctx.strokeStyle = 'rgba(122, 188, 188, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(122, 188, 188, 0.2)';
    ctx.fill();
  }

  _drawMarkers() {
    const { ctx, radius } = this;
    for (const m of this.markers) {
      const px = this.cx + (m.x - 0.5) * radius * 2;
      const py = this.cy + (m.y - 0.5) * radius * 2;
      const a = m.alpha;
      const s = 8;

      ctx.strokeStyle = 'rgba(90, 154, 106, ' + (a * 0.7) + ')';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(px - s, py);
      ctx.lineTo(px + s, py);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px, py - s);
      ctx.lineTo(px, py + s);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(90, 154, 106, ' + (a * 0.4) + ')';
      ctx.stroke();
    }
  }

  _drawAnomaly() {
    const a = this.anomaly;
    if (a.brightness <= 0.01) return;

    const { ctx, radius } = this;

    if (a.type === 'trajectory' && a.trail.length > 1) {
      for (let i = 0; i < a.trail.length - 1; i++) {
        const t = a.trail[i];
        const px = this.cx + (t.x - 0.5) * radius * 2;
        const py = this.cy + (t.y - 0.5) * radius * 2;
        const alpha = (i / a.trail.length) * 0.2 * a.brightness;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(122, 188, 188, ' + alpha + ')';
        ctx.fill();
      }
    }

    const px = this.cx + (a.x - 0.5) * radius * 2;
    const py = this.cy + (a.y - 0.5) * radius * 2;
    const b = a.brightness;

    const glowSize = a.type === 'signal_spike' ? 18 : 12;
    ctx.beginPath();
    ctx.arc(px, py, glowSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(122, 188, 188, ' + (b * 0.06) + ')';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(122, 188, 188, ' + (b * 0.15) + ')';
    ctx.fill();

    let coreSize = 2.5;
    if (a.type === 'stationary') {
      coreSize = 2 + Math.sin(this.time * 2.5 + a.pulsePhase) * 1.2;
    } else if (a.type === 'signal_spike') {
      coreSize = 3 + Math.sin(this.time * 8) * 1.5;
    }
    coreSize = Math.max(0.5, coreSize);

    ctx.beginPath();
    ctx.arc(px, py, coreSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(180, 220, 220, ' + (b * 0.9) + ')';
    ctx.fill();

    if (a.type === 'signal_spike') {
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220, 240, 240, ' + (b * 0.8) + ')';
      ctx.fill();
    }
  }

  _drawReticle() {
    const r = this.reticle;
    const { ctx, radius } = this;
    const px = this.cx + (r.x - 0.5) * radius * 2;
    const py = this.cy + (r.y - 0.5) * radius * 2;
    const a = r.alpha;
    const size = 28;
    const len = size * 0.35;
    const half = size / 2;

    ctx.strokeStyle = 'rgba(122, 188, 188, ' + (a * 0.7) + ')';
    ctx.lineWidth = 1.2;

    const corners = [
      [-half, -half, 1, 1],
      [half, -half, -1, 1],
      [-half, half, 1, -1],
      [half, half, -1, -1],
    ];
    for (const [ox, oy, dx, dy] of corners) {
      ctx.beginPath();
      ctx.moveTo(px + ox, py + oy + dy * len);
      ctx.lineTo(px + ox, py + oy);
      ctx.lineTo(px + ox + dx * len, py + oy);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(122, 188, 188, ' + (a * 0.35) + ')';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(px - 4, py);
    ctx.lineTo(px + 4, py);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px, py - 4);
    ctx.lineTo(px, py + 4);
    ctx.stroke();
  }

  _drawVignette() {
    const { ctx, cx, cy, radius, size } = this;
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius * 1.15);
    grad.addColorStop(0, 'rgba(6, 10, 18, 0)');
    grad.addColorStop(1, 'rgba(6, 10, 18, 0.7)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
}