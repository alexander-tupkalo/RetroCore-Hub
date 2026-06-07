/* ═══════════════════════════════════════════
   ATMOSPHERE.JS — VHS noise renderer,
   noise intensity control, signal strength,
   clock tick, signal fragment flashes,
   brightness drift toggle
   ═══════════════════════════════════════════ */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── VHS Noise ── */

const noiseCanvas = document.getElementById('noise');
const noiseCtx = noiseCanvas.getContext('2d');
const NOISE_W = 200;
const NOISE_H = 150;

noiseCanvas.width = NOISE_W;
noiseCanvas.height = NOISE_H;

let noiseImageData = null;

/**
 * Noise alpha — controls grain intensity.
 * Default: 12 (subtle). Boost to 28-35 during
 * panel transitions for analog distortion feel.
 */
let noiseAlpha = 12;

function initNoiseBuffer() {
    noiseImageData = noiseCtx.createImageData(NOISE_W, NOISE_H);
}

function drawNoise() {
    if (!noiseImageData) return;
    const d = noiseImageData.data;
    const a = noiseAlpha;
    for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 22;
        d[i]     = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = a;
    }
    noiseCtx.putImageData(noiseImageData, 0, 0);
}

let lastNoiseTime = 0;

function noiseLoop(time) {
    if (!REDUCED_MOTION && time - lastNoiseTime > 80) {
        drawNoise();
        lastNoiseTime = time;
    }
    requestAnimationFrame(noiseLoop);
}

export function initNoise() {
    initNoiseBuffer();
    requestAnimationFrame(noiseLoop);
}

/**
 * Set noise grain intensity.
 * @param {number} level - Alpha value (8–40 recommended)
 */
export function setNoiseIntensity(level) {
    noiseAlpha = level;
}

/**
 * Reset noise to default subtle level.
 */
export function resetNoiseIntensity() {
    noiseAlpha = 12;
}


/* ── Signal Strength Animation ── */

export function animateSignal() {
    if (REDUCED_MOTION) return;

    const bars = document.querySelectorAll('.signal-bars .bar.active');
    const valEl = document.getElementById('sig-value');
    let val = 47;

    if (bars.length === 0 || !valEl) return;

    function flickerBar() {
        const bar = bars[Math.floor(Math.random() * bars.length)];
        bar.style.opacity = '0.15';
        setTimeout(() => {
            bar.style.opacity = '1';
        }, 80 + Math.random() * 180);
        setTimeout(flickerBar, 2500 + Math.random() * 4000);
    }
    setTimeout(flickerBar, 5000);

    function driftValue() {
        val += Math.floor(Math.random() * 5) - 2;
        val = Math.max(41, Math.min(53, val));
        valEl.textContent = val + '%';
        setTimeout(driftValue, 3500 + Math.random() * 3000);
    }
    setTimeout(driftValue, 6000);
}


/* ── Timestamp Clock ── */

export function startClock() {
    const el = document.getElementById('timestamp');
    if (!el) return;

    setInterval(() => {
        const parts = el.textContent.split(' ');
        const timeParts = parts[parts.length - 1].split(':');
        let s = parseInt(timeParts[2], 10) || 0;
        s = (s + 1) % 60;
        timeParts[2] = s.toString().padStart(2, '0');
        parts[parts.length - 1] = timeParts.join(':');
        el.textContent = parts.join(' ');
    }, 1000);
}


/* ── Signal Fragment Flashes ── */

export function spawnFragment() {
    if (REDUCED_MOTION) return;

    const panel = document.getElementById('main-panel');
    if (!panel || !panel.classList.contains('panel-active')) return;

    const frag = document.createElement('div');
    frag.className = 'signal-fragment';
    frag.setAttribute('aria-hidden', 'true');

    frag.style.top   = (8 + Math.random() * 84) + '%';
    frag.style.width  = (15 + Math.random() * 55) + '%';
    frag.style.left   = (5 + Math.random() * 35) + '%';

    panel.appendChild(frag);

    setTimeout(() => {
        if (frag.parentNode) frag.remove();
    }, 1100);

    setTimeout(spawnFragment, 4000 + Math.random() * 8000);
}


/* ── Brightness Drift Overlay ── */

/**
 * Activate the slow brightness drift overlay.
 * Used during panel playback for atmospheric motion.
 */
export function enableBrightnessDrift() {
    if (REDUCED_MOTION) return;
    const el = document.querySelector('.brightness-drift');
    if (el) el.classList.add('active');
}

/**
 * Deactivate brightness drift overlay.
 */
export function disableBrightnessDrift() {
    const el = document.querySelector('.brightness-drift');
    if (el) el.classList.remove('active');
}