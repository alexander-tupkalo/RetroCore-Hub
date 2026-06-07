/**
 * RETROCORE://UNKNOWN_SECTOR
 * Radar Display System
 * Atmospheric background element — slow sweep with fading blips
 */

export class RadarSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.angle = 0;
    this.speed = 0.003;
    this.size = 0;
    this.cx = 0;
    this.cy = 0;
    this.radius = 0;

    // Static blip positions (angle in radians, distance 0-1)
    this.blips = [
      { angle: 0.8,  dist: 0.6,  brightness: 0 },
      { angle: 2.4,  dist: 0.35, brightness: 0 },
      { angle: 4.1,  dist: 0.78, brightness: 0 },
      { angle: 5.6,  dist: 0.48, brightness: 0 },
    ];

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.size = rect.width;
    this.cx = this.size / 2;
    this.cy = this.size / 2;
    this.radius = Math.max(1, this.size / 2 - 12);
  }

  update() {
    this.angle += this.speed;
    if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;

    for (const blip of this.blips) {
      let diff = this.angle - blip.angle;
      if (diff < 0) diff += Math.PI * 2;
      if (diff < 0.6) {
        blip.brightness = Math.max(blip.brightness, 1 - diff / 0.6);
      } else {
        blip.brightness *= 0.993;
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    const { cx, cy, radius, angle } = this;
    ctx.clearRect(0, 0, this.size, this.size);

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(90, 154, 154, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Concentric rings
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius * (i / 4), 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(90, 154, 154, 0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Cross lines
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.strokeStyle = 'rgba(90, 154, 154, 0.05)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Diagonal lines
    const d = radius * 0.707;
    ctx.beginPath();
    ctx.moveTo(cx - d, cy - d);
    ctx.lineTo(cx + d, cy + d);
    ctx.moveTo(cx + d, cy - d);
    ctx.lineTo(cx - d, cy + d);
    ctx.strokeStyle = 'rgba(90, 154, 154, 0.03)';
    ctx.stroke();

    // Sweep trail — segmented fill for gradient effect
    const trailLength = 0.9;
    const segments = 24;

    for (let i = 0; i < segments; i++) {
      const t0 = i / segments;
      const t1 = (i + 1) / segments;
      const a0 = angle - trailLength * (1 - t0);
      const a1 = angle - trailLength * (1 - t1);
      const alpha = t1 * 0.08;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, a0, a1);
      ctx.closePath();
      ctx.fillStyle = `rgba(90, 154, 154, ${alpha})`;
      ctx.fill();
    }

    // Sweep line
    const sx = cx + Math.cos(angle) * radius;
    const sy = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sx, sy);
    ctx.strokeStyle = 'rgba(122, 188, 188, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Blips
    for (const blip of this.blips) {
      if (blip.brightness > 0.04) {
        const bx = cx + Math.cos(blip.angle) * radius * blip.dist;
        const by = cy + Math.sin(blip.angle) * radius * blip.dist;
        const b = blip.brightness;

        // Glow
        ctx.beginPath();
        ctx.arc(bx, by, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90, 154, 154, ${b * 0.1})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(122, 188, 188, ${b * 0.85})`;
        ctx.fill();
      }
    }

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(90, 154, 154, 0.2)';
    ctx.fill();

    // Faint edge tick marks
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const inner = radius - 4;
      const outer = radius;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
      ctx.strokeStyle = 'rgba(90, 154, 154, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}