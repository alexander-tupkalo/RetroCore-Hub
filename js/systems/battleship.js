/**
 * RETROCORE://HUB — battleship.js
 * Naval module systems:
 *  - Radar canvas sweep animation
 *  - Tactical coordinate cycling
 *  - Hover sonar audio (Web Audio API, ultra-subtle)
 *  - Transition naval-tint class management
 */

// ── Coordinate pool ────────────────────────────────────
const COORD_POOL = [
  'G7·H4', 'B2·D9', 'F5·A3', 'J1·C8',
  'E4·G6', 'H9·B5', 'D3·I7', 'A6·F2',
  'C1·J8', 'I5·E3', 'G2·H7', 'B8·D4',
];

let _coordIndex = 0;
let _audioCtx   = null;

// ── Sonar ping (Web Audio, one-shot) ──────────────────
function playSonarPing(gain = 0.025) {
  try {
    if (!_audioCtx) {
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_audioCtx.state === 'suspended') return; // respect autoplay policy

    const ctx = _audioCtx;
    const t   = ctx.currentTime;

    // Two-tone sonar: high pure sine decay + faint sub
    const osc1  = ctx.createOscillator();
    const osc2  = ctx.createOscillator();
    const g1    = ctx.createGain();
    const g2    = ctx.createGain();
    const master = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1480, t);
    osc1.frequency.exponentialRampToValueAtTime(620, t + 1.1);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(740, t);
    osc2.frequency.exponentialRampToValueAtTime(310, t + 1.4);

    g1.gain.setValueAtTime(0, t);
    g1.gain.linearRampToValueAtTime(gain, t + 0.04);
    g1.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

    g2.gain.setValueAtTime(0, t);
    g2.gain.linearRampToValueAtTime(gain * 0.4, t + 0.06);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);

    master.gain.value = 1;

    osc1.connect(g1); g1.connect(master);
    osc2.connect(g2); g2.connect(master);
    master.connect(ctx.destination);

    osc1.start(t); osc1.stop(t + 1.3);
    osc2.start(t); osc2.stop(t + 1.6);
  } catch { /* AudioContext not available */ }
}

// ── Radar canvas sweep ─────────────────────────────────
function initRadarCanvas() {
  const canvas = document.getElementById('bs-radar-canvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  const W    = canvas.width;
  const H    = canvas.height;
  const cx   = W / 2;
  const cy   = H / 2;
  const R    = Math.min(W, H) * 0.46;

  let angle  = 0;
  let raf;
  let running = true;

  // Blip data — static contacts on the radar
  const blips = [
    { a: 0.72, r: 0.55, size: 2.2, life: 0 },
    { a: 2.14, r: 0.38, size: 1.8, life: 0 },
    { a: 4.80, r: 0.70, size: 2.0, life: 0 },
    { a: 1.40, r: 0.82, size: 1.5, life: 0 },
  ];

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    // ── Background circles ───────────────────────────
    [0.25, 0.5, 0.75, 1].forEach(f => {
      ctx.beginPath();
      ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 200, 255, ${f === 1 ? 0.22 : 0.1})`;
      ctx.lineWidth = f === 1 ? 0.8 : 0.5;
      ctx.stroke();
    });

    // ── Crosshair lines ──────────────────────────────
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.1)';
    ctx.lineWidth = 0.5;
    [[cx, cy - R, cx, cy + R], [cx - R, cy, cx + R, cy]].forEach(([x1,y1,x2,y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    // ── Sweep sector (trailing glow wedge) ───────────
    const SWEEP_ARC = Math.PI * 0.55;
    const grad = ctx.createConicalGradient
      ? ctx.createConicalGradient(cx, cy, angle - SWEEP_ARC)  // non-standard
      : null;

    // Fallback: manual wedge
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, angle - SWEEP_ARC, angle);
    ctx.closePath();
    const fillGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    fillGrad.addColorStop(0,   'rgba(0,200,255,0.0)');
    fillGrad.addColorStop(0.6, 'rgba(0,200,255,0.04)');
    fillGrad.addColorStop(1,   'rgba(0,200,255,0.0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();
    ctx.restore();

    // ── Sweep arm ────────────────────────────────────
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
    ctx.strokeStyle = 'rgba(0, 215, 255, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = 'rgba(0, 200, 255, 0.9)';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.restore();

    // ── Blips ────────────────────────────────────────
    blips.forEach(blip => {
      const da = ((angle - blip.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

      // Activate blip when sweep passes over it
      if (da < 0.12) {
        blip.life = 1.0;
      } else {
        blip.life = Math.max(0, blip.life - 0.007);
      }

      if (blip.life > 0) {
        const bx = cx + Math.cos(blip.a) * R * blip.r;
        const by = cy + Math.sin(blip.a) * R * blip.r;
        const alpha = blip.life * 0.9;

        ctx.beginPath();
        ctx.arc(bx, by, blip.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 220, 255, ${alpha})`;
        ctx.shadowColor = `rgba(0, 200, 255, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.fill();

        // Blip halo
        ctx.beginPath();
        ctx.arc(bx, by, blip.size * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 200, 255, ${alpha * 0.25})`;
        ctx.lineWidth = 0.6;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }
    });

    // ── Center dot ───────────────────────────────────
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 220, 255, 0.9)';
    ctx.shadowColor = 'rgba(0, 200, 255, 1)';
    ctx.shadowBlur = 8;
    ctx.fill();

    // Advance angle
    angle = (angle + 0.012) % (Math.PI * 2);

    raf = requestAnimationFrame(draw);
  }

  draw();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else {
      running = true;
      draw();
    }
  });
}

// ── Coordinate cycling ─────────────────────────────────
function initCoordCycler() {
  const el = document.getElementById('bs-coords-val');
  if (!el) return;

  const card = document.getElementById('card-battleship');

  function cycleCoord() {
    el.style.opacity = '0';
    setTimeout(() => {
      _coordIndex = (_coordIndex + 1) % COORD_POOL.length;
      el.textContent = COORD_POOL[_coordIndex];
      el.style.transition = 'opacity 0.3s ease';
      el.style.opacity = '';
    }, 200);
  }

  // Cycle every 4.5s at rest, every 1.8s on hover
  let restInterval  = setInterval(cycleCoord, 4500);
  let hoverInterval = null;

  if (card) {
    card.addEventListener('mouseenter', () => {
      clearInterval(restInterval);
      restInterval = null;
      hoverInterval = setInterval(cycleCoord, 1800);
    });

    card.addEventListener('mouseleave', () => {
      clearInterval(hoverInterval);
      hoverInterval = null;
      restInterval = setInterval(cycleCoord, 4500);
    });
  }
}

// ── Hover sonar audio ──────────────────────────────────
function initHoverAudio() {
  const card = document.getElementById('card-battleship');
  if (!card) return;

  let canPing = true;

  // Attempt to share the existing AudioContext from ambient-audio
  // by listening for the first interaction event the ambient system sets up.
  // We use our own AudioContext lazily if needed.
  document.addEventListener('retrocore:audio-toggle', (e) => {
    // Sync: if user turned off global audio, mute sonar too
    if (!e.detail?.enabled) canPing = false;
    else canPing = true;
  });

  card.addEventListener('mouseenter', () => {
    if (!canPing) return;
    playSonarPing(0.022);
  });

  // Throttle: don't re-ping within 3 seconds
  card.addEventListener('mouseenter', () => {
    canPing = false;
    setTimeout(() => { canPing = true; }, 3000);
  });
}

// ── Public init ────────────────────────────────────────
export function initBattleship() {
  initRadarCanvas();
  initCoordCycler();
  initHoverAudio();

  console.log(
    '%c v0.5.0  BATTLESHIP MODULE DEPLOYED ',
    'color:#00c8ff;font-family:monospace;letter-spacing:0.12em;font-weight:bold;'
  );
}