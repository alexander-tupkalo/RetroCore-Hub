/**
 * RETROCORE://HUB — unknown-sector.js
 * SIGNAL ANOMALY DETECTED — Unknown Sector entry point.
 * Ghost-green radar canvas + scroll-reveal + ambient flicker.
 */

'use strict';

// ── Ghost-green palette ────────────────────────────────
const G_BG     = 'rgba(2,  8,  12, 0)';   // transparent (panel provides bg)
const G_RING   = 'rgba(30, 255, 120, {a})';
const G_SWEEP  = 'rgba(30, 255, 120, {a})';
const G_BLIP   = 'rgba(30, 255, 120, 1)';
const G_ARM    = 'rgba(30, 255, 120, {a})';
const G_CROSS  = 'rgba(30, 255, 120, 0.1)';
const G_CENTRE = 'rgba(30, 255, 120, 1)';

function gc(template, a) {
  return template.replace('{a}', a);
}

// ── Canvas radar ───────────────────────────────────────
function initUnknownRadar() {
  const canvas = document.getElementById('us-radar-canvas');
  if (!canvas) return;

  let raf, running = true;
  let angle = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    canvas.getContext('2d').scale(dpr, dpr);
  }

  resize();

  const W = () => canvas.getBoundingClientRect().width;
  const H = () => canvas.getBoundingClientRect().height;

  // Static blip contacts — anomalous, asymmetric
  const blips = [
    { a: 1.1,  r: 0.60, life: 0, phase: 0   },
    { a: 2.8,  r: 0.42, life: 0, phase: 0.9 },
    { a: 4.4,  r: 0.74, life: 0, phase: 1.8 },
    { a: 0.35, r: 0.82, life: 0, phase: 2.7 },
  ];

  function draw() {
    if (!running) return;
    const ctx = canvas.getContext('2d');
    const w   = W(), h = H();
    const cx  = w / 2, cy = h / 2;
    const rm  = Math.min(w, h) * 0.44;

    ctx.clearRect(0, 0, w, h);

    // ── Concentric rings ────────────────────────────────
    [[0.28, 0.04], [0.52, 0.05], [0.76, 0.07], [1.00, 0.18]].forEach(([ratio, alpha]) => {
      const r = rm * ratio;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = gc(G_RING, alpha);
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // ── Crosshair ───────────────────────────────────────
    ctx.strokeStyle = G_CROSS;
    ctx.lineWidth   = 0.6;
    ctx.beginPath();
    ctx.moveTo(cx - rm, cy); ctx.lineTo(cx + rm, cy);
    ctx.moveTo(cx, cy - rm); ctx.lineTo(cx, cy + rm);
    ctx.stroke();

    // ── Sweep wedge ─────────────────────────────────────
    const arcSpan = Math.PI * 0.5;
    // Create conic-style wedge via many thin arcs
    for (let i = 0; i < 28; i++) {
      const t  = i / 27;           // 0 = arm, 1 = tail
      const da = t * arcSpan;
      const a  = gc(G_SWEEP, (1 - t) * (1 - t) * 0.22);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rm, angle - da, angle - da + 0.06);
      ctx.closePath();
      ctx.fillStyle = a;
      ctx.fill();
    }

    // ── Sweep arm ───────────────────────────────────────
    const ax = cx + Math.cos(angle) * rm;
    const ay = cy + Math.sin(angle) * rm;

    // Glow layers
    [[3, 0.06], [2, 0.15], [1, 0.75]].forEach(([lw, a]) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ax, ay);
      ctx.strokeStyle = gc(G_ARM, a);
      ctx.lineWidth   = lw;
      ctx.stroke();
    });

    // ── Blips ────────────────────────────────────────────
    blips.forEach(blip => {
      const da = ((angle - blip.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      if (da < 0.15) blip.life = 1.0;
      else           blip.life = Math.max(0, blip.life - 0.005);

      if (blip.life > 0) {
        const bx = cx + Math.cos(blip.a) * rm * blip.r;
        const by = cy + Math.sin(blip.a) * rm * blip.r;
        const alpha = blip.life * 0.9;

        // Halo
        const hgrad = ctx.createRadialGradient(bx, by, 0, bx, by, rm * 0.12);
        hgrad.addColorStop(0, `rgba(30,255,120,${alpha * 0.3})`);
        hgrad.addColorStop(1, 'rgba(30,255,120,0)');
        ctx.beginPath();
        ctx.arc(bx, by, rm * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = hgrad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(bx, by, rm * 0.025, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30,255,120,${alpha})`;
        ctx.fill();
      }
    });

    // ── Centre dot ──────────────────────────────────────
    const cgrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rm * 0.06);
    cgrad.addColorStop(0, 'rgba(30,255,120,0.8)');
    cgrad.addColorStop(1, 'rgba(30,255,120,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, rm * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = cgrad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, rm * 0.025, 0, Math.PI * 2);
    ctx.fillStyle = G_CENTRE;
    ctx.fill();

    // ── Outer ring glow ──────────────────────────────────
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, rm, 0, Math.PI * 2);
    ctx.strokeStyle = gc(G_RING, 0.25);
    ctx.lineWidth   = 1.5;
    ctx.shadowColor = 'rgba(30,255,120,0.7)';
    ctx.shadowBlur  = rm * 0.08;
    ctx.stroke();
    ctx.restore();

    // Advance angle — slower than battleship, feels more ominous
    angle = (angle + 0.008) % (Math.PI * 2);

    raf = requestAnimationFrame(draw);
  }

  draw();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running = false; cancelAnimationFrame(raf); }
    else                 { running = true;  draw(); }
  });

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  }, { passive: true });
}

// ── Scroll reveal ──────────────────────────────────────
function initUnknownReveal() {
  const panel = document.querySelector('.us-panel');
  if (!panel) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in-view');
      obs.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

  obs.observe(panel);
}

// ── Ambient signal interference (rare, subtle) ─────────
function initSignalInterference() {
  const panel = document.querySelector('.us-panel');
  if (!panel) return;

  function scheduleNext() {
    // Fire every 14–38 seconds — unpredictable, infrequent
    const delay = 14000 + Math.random() * 24000;
    setTimeout(() => {
      if (!panel.isConnected) return;

      // Brief 3-frame interference flicker on the whole panel
      panel.style.filter = 'brightness(1.15) contrast(1.05)';
      setTimeout(() => {
        panel.style.filter = 'brightness(0.88)';
        setTimeout(() => {
          panel.style.filter = '';
          scheduleNext();
        }, 60);
      }, 40);
    }, delay);
  }

  scheduleNext();
}

// ── Public init ────────────────────────────────────────
export function initUnknownSector() {
  initUnknownReveal();
  initUnknownRadar();
  initSignalInterference();

  console.log(
    '%c UNKNOWN SECTOR // SIGNAL DETECTED ',
    'color:#1eff78;font-family:monospace;letter-spacing:0.12em;font-style:italic;'
  );
}