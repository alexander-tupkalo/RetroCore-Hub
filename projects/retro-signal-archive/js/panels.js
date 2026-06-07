/* ═══════════════════════════════════════════
   PANELS.JS — Issue #01 + Issue #02,
   fast cinematic pacing, subtitles,
   detection alert sound, ambient track,
   ghost ending
   ═══════════════════════════════════════════ */

import { typeText, delay } from './transitions.js';
import {
    setNoiseIntensity,
    resetNoiseIntensity,
    enableBrightnessDrift
} from './atmosphere.js';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ══════════════════════════════════════════
   PANEL DATA
   ══════════════════════════════════════════ */

const ISSUE_01 = [
    {
        src: 'assets/panels/panel-01.jpg',
        overlays: ['YEAR: 1988', 'EVENT: SIGNAL BLACKOUT'],
        hold: 3500
    },
    {
        src: 'assets/panels/panel-02.jpg',
        overlays: ['OPERATOR STATUS: ACTIVE', 'SIGNAL DETECTION IN PROGRESS'],
        hold: 3500
    },
    {
        src: 'assets/panels/panel-03.jpg',
        overlays: ['CLASSIFIED TRANSMISSION DETECTED'],
        hold: 3500,
        alert: true
    },
    {
        src: 'assets/panels/panel-04.jpg',
        overlays: ['LOCATION: SECTOR-07', 'RADAR NODE STATUS: DORMANT'],
        hold: 3500
    },
    {
        src: 'assets/panels/panel-05.jpg',
        overlays: ['PRIMARY NETWORK DETECTED', 'RETROCORE LINK RESTORED'],
        hold: 3500
    }
];

const ISSUE_02 = [
    {
        src: 'assets/panels/panel-06.jpg',
        overlays: ['UNAUTHORIZED FREQUENCY DETECTED'],
        hold: 3500
    },
    {
        src: 'assets/panels/panel-07.jpg',
        overlays: [],
        hold: 3500,
        corrupted: true
    },
    {
        src: 'assets/panels/panel-08.jpg',
        overlays: ['UNKNOWN OPERATOR IDENTIFIED'],
        hold: 3500
    },
    {
        src: 'assets/panels/panel-09.jpg',
        overlays: ['NETWORK STATUS: COLLAPSED', 'SECTOR LINKS: OFFLINE'],
        hold: 3500
    },
    {
        src: 'assets/panels/panel-10.jpg',
        overlays: ['SIGNAL LOST'],
        hold: 3500
    }
];

const INTRO_01 = [
    '> RECOVERING ARCHIVE DATA...',
    '> SIGNAL INTEGRITY: 42%',
    '> ARCHIVE LINK ESTABLISHED'
];

const INTRO_02 = [
    '> NEW TRANSMISSION DETECTED',
    '> SIGNAL ORIGIN: UNKNOWN',
    '> ARCHIVE STATUS: UNSTABLE'
];

const INTERCEPT_MSGS = [
    '> SIGNAL ROUTE ACCEPTED',
    '> TRANSFER IN PROGRESS...'
];

const EXIT_MSGS = [
    '> SIGNAL ROUTE ACCEPTED',
    '> LINKING TO PRIMARY NETWORK',
    '> TRANSFER IN PROGRESS...'
];


/* ══════════════════════════════════════════
   STATE
   ══════════════════════════════════════════ */

let panelImg = null;
let corruptedLabel = null;
let subtitleEl = null;
let audioCtx = null;
let audioStarted = false;

let typingNoiseBuffer = null;
let typingGain = null;
let typingFilter = null;

let radarInterval = null;
let transClickInterval = null;
let ambientTrackSource = null;


/* ══════════════════════════════════════════
   AUDIO
   ══════════════════════════════════════════ */

function createNoiseBuffer(ctx, duration = 2) {
    const size = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

function startLoopingNoise(ctx, buffer) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.start();
    return source;
}

function playTypingClick() {
    if (!audioCtx || !audioStarted || REDUCED_MOTION) return;
    const now = audioCtx.currentTime;
    const source = audioCtx.createBufferSource();
    source.buffer = typingNoiseBuffer;
    typingFilter.frequency.setValueAtTime(2200 + Math.random() * 1800, now);
    const vol = 0.06 + Math.random() * 0.04;
    typingGain.gain.setValueAtTime(vol, now);
    typingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    source.connect(typingFilter);
    typingFilter.connect(typingGain);
    typingGain.connect(audioCtx.destination);
    source.start(now);
    source.stop(now + 0.05);
}

function playSoftPulse() {
    if (!audioCtx || !audioStarted || REDUCED_MOTION) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 80;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.9);
}

function playGhostDrone() {
    if (!audioCtx || !audioStarted || REDUCED_MOTION) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 45;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 3);
    gain.gain.linearRampToValueAtTime(0, now + 8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 9);
}

/**
 * Detection alert — 3 sharp beeps + sustained warning tone.
 * ~3.5 seconds. Loud.
 */
function playDetectionAlert() {
    if (!audioCtx || !audioStarted || REDUCED_MOTION) return;
    const now = audioCtx.currentTime;

    /* 3 sharp beeps at 1200Hz */
    [0, 0.3, 0.6].forEach(offset => {
        const osc = audioCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 1200;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.12);
    });

    /* Sustained warning tone 800Hz */
    const warn = audioCtx.createOscillator();
    warn.type = 'sine';
    warn.frequency.value = 800;
    const warnGain = audioCtx.createGain();
    warnGain.gain.setValueAtTime(0, now + 1.1);
    warnGain.gain.linearRampToValueAtTime(0.15, now + 1.4);
    warnGain.gain.setValueAtTime(0.15, now + 2.5);
    warnGain.gain.linearRampToValueAtTime(0, now + 3.5);
    warn.connect(warnGain);
    warnGain.connect(audioCtx.destination);
    warn.start(now + 1.1);
    warn.stop(now + 3.6);
}

function playRadarPing() {
    if (!audioCtx || !audioStarted || REDUCED_MOTION) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1200;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
}

function playTransmissionClick() {
    if (!audioCtx || !audioStarted || REDUCED_MOTION) return;
    const now = audioCtx.currentTime;
    const buf = createNoiseBuffer(audioCtx, 0.05);
    const source = audioCtx.createBufferSource();
    source.buffer = buf;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(now);
    source.stop(now + 0.06);
}

function startGhostAudio() {
    if (!audioStarted || REDUCED_MOTION) return;
    stopGhostAudio();
    radarInterval = setInterval(playRadarPing, 3000 + Math.random() * 3000);
    transClickInterval = setInterval(playTransmissionClick, 5000 + Math.random() * 5000);
}

function stopGhostAudio() {
    if (radarInterval) { clearInterval(radarInterval); radarInterval = null; }
    if (transClickInterval) { clearInterval(transClickInterval); transClickInterval = null; }
}

/**
 * Load and loop the ambient background track.
 * Decodes mp3 file into AudioBuffer, then plays
 * through a dedicated gain node at low volume.
 */
function startAmbientTrack() {
    if (!audioCtx || ambientTrackSource) return;

    fetch('assets/audio/ambient-drone.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            ambientTrackSource = audioCtx.createBufferSource();
            ambientTrackSource.buffer = audioBuffer;
            ambientTrackSource.loop = true;

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 6);

            ambientTrackSource.connect(gain);
            gain.connect(audioCtx.destination);
            ambientTrackSource.start();
        })
        .catch(() => {
            /* Track not found or decode error — silent fail */
        });
}

function startAudio() {
    if (audioStarted || REDUCED_MOTION) return;
    audioStarted = true;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const master = audioCtx.createGain();
        master.gain.setValueAtTime(0, audioCtx.currentTime);
        master.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 4);
        master.connect(audioCtx.destination);

        /* Layer 1: CRT Hum — boosted */
        const humOsc = audioCtx.createOscillator();
        humOsc.type = 'sine';
        humOsc.frequency.value = 60;
        const humGain = audioCtx.createGain();
        humGain.gain.value = 0.08;
        humOsc.connect(humGain);
        humGain.connect(master);
        humOsc.start();

        /* Layer 2: Low Signal Noise */
        const noiseBuffer = createNoiseBuffer(audioCtx, 2);
        const noiseSource = startLoopingNoise(audioCtx, noiseBuffer);
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 500;
        noiseFilter.Q.value = 0.7;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.value = 0.018;
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(master);
        const lfo = audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.08;
        const lfoDepth = audioCtx.createGain();
        lfoDepth.gain.value = 0.006;
        lfo.connect(lfoDepth);
        lfoDepth.connect(noiseGain.gain);
        lfo.start();

        /* Layer 3: Electrical Ambience — boosted */
        const elecBuffer = createNoiseBuffer(audioCtx, 3);
        const elecSource = startLoopingNoise(audioCtx, elecBuffer);
        const elecFilter = audioCtx.createBiquadFilter();
        elecFilter.type = 'bandpass';
        elecFilter.frequency.value = 150;
        elecFilter.Q.value = 2;
        const elecGain = audioCtx.createGain();
        elecGain.gain.value = 0.07;
        elecSource.connect(elecFilter);
        elecFilter.connect(elecGain);
        elecGain.connect(master);

        /* Layer 4: Typing Click */
        typingNoiseBuffer = createNoiseBuffer(audioCtx, 0.1);
        typingFilter = audioCtx.createBiquadFilter();
        typingFilter.type = 'bandpass';
        typingFilter.frequency.value = 3000;
        typingFilter.Q.value = 1.5;
        typingGain = audioCtx.createGain();
        typingGain.gain.value = 0;

        /* Layer 5: Ambient background track */
        startAmbientTrack();

    } catch (e) {
        audioStarted = false;
    }
}

function bindAudioStart() {
    function onFirst() {
        startAudio();
        document.removeEventListener('click', onFirst);
        document.removeEventListener('keydown', onFirst);
    }
    document.addEventListener('click', onFirst);
    document.addEventListener('keydown', onFirst);
}


/* ══════════════════════════════════════════
   TERMINAL HELPERS
   ══════════════════════════════════════════ */

function getTerminal() {
    return document.getElementById('terminal-body');
}

function addSeparator() {
    const terminal = getTerminal();
    if (!terminal) return;
    const sep = document.createElement('div');
    sep.className = 'log-separator';
    sep.textContent = '\u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500';
    terminal.appendChild(sep);
    terminal.scrollTop = terminal.scrollHeight;
}

async function typeOverlayLine(text) {
    const terminal = getTerminal();
    if (!terminal) return;
    const line = document.createElement('div');
    line.className = 'log-entry overlay-entry';
    terminal.appendChild(line);
    await typeText(line, text, 10, '', playTypingClick);
    terminal.scrollTop = terminal.scrollHeight;
}

async function typeOverlayLineNoSound(text) {
    const terminal = getTerminal();
    if (!terminal) return;
    const line = document.createElement('div');
    line.className = 'log-entry overlay-entry';
    terminal.appendChild(line);
    await typeText(line, text, 25);
    terminal.scrollTop = terminal.scrollHeight;
}

async function typeOverlayLineWithCursor(text) {
    const terminal = getTerminal();
    if (!terminal) return;
    const line = document.createElement('div');
    line.className = 'log-entry overlay-entry';
    terminal.appendChild(line);
    await new Promise(resolve => {
        let i = 0;
        line.textContent = '';
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.style.animationDuration = '1s';
        line.appendChild(cursor);
        function tick() {
            if (i < text.length) {
                line.insertBefore(document.createTextNode(text[i]), cursor);
                i++;
                setTimeout(tick, 25 + Math.random() * 15);
            } else {
                resolve();
            }
        }
        tick();
    });
    terminal.scrollTop = terminal.scrollHeight;
}


/* ══════════════════════════════════════════
   SUBTITLE SYSTEM
   ══════════════════════════════════════════ */

function ensureSubtitle() {
    if (subtitleEl) return;
    const panel = document.getElementById('main-panel');
    if (!panel) return;
    subtitleEl = document.createElement('div');
    subtitleEl.className = 'panel-subtitle';
    subtitleEl.setAttribute('aria-hidden', 'true');
    panel.appendChild(subtitleEl);
}

function clearSubtitle() {
    if (!subtitleEl) return;
    subtitleEl.classList.remove('visible');
    subtitleEl.innerHTML = '';
}

function showSubtitle() {
    if (subtitleEl) subtitleEl.classList.add('visible');
}

function addSubtitleLine(text) {
    if (!subtitleEl) return;
    const line = document.createElement('div');
    line.className = 'panel-subtitle-line';
    line.textContent = text;
    subtitleEl.appendChild(line);
}


/* ══════════════════════════════════════════
   PANEL DISPLAY
   ══════════════════════════════════════════ */

function ensurePanelElements() {
    const panel = document.getElementById('main-panel');
    if (!panel) return;
    if (!panelImg) {
        panelImg = document.createElement('img');
        panelImg.className = 'panel-image';
        panelImg.alt = 'Recovered signal transmission';
        panelImg.setAttribute('draggable', 'false');
        panel.appendChild(panelImg);
    }
    if (!corruptedLabel) {
        corruptedLabel = document.createElement('div');
        corruptedLabel.className = 'panel-corrupted';
        corruptedLabel.textContent = 'CORRUPTED SIGNAL';
        corruptedLabel.style.display = 'none';
        panel.appendChild(corruptedLabel);
    }
    ensureSubtitle();
}

async function hideAwaitingState() {
    const content = document.querySelector('.panel-content');
    if (!content) return;
    content.style.transition = 'opacity 1s ease';
    content.style.opacity = '0';
    await delay(REDUCED_MOTION ? 50 : 1000);
    content.style.display = 'none';
}

function loadPanelImage(panelData) {
    return new Promise(resolve => {
        ensurePanelElements();
        if (!panelData) { resolve('error'); return; }
        const probe = new Image();
        probe.onload = () => {
            panelImg.src = panelData.src;
            panelImg.style.display = 'block';
            corruptedLabel.style.display = 'none';
            resolve('loaded');
        };
        probe.onerror = () => {
            panelImg.style.display = 'none';
            corruptedLabel.style.display = 'flex';
            resolve('error');
        };
        probe.src = panelData.src;
    });
}

async function revealPanel() {
    if (panelImg) {
        panelImg.style.animation = 'none';
        void panelImg.offsetHeight;
        panelImg.style.animation = '';
        panelImg.style.opacity = '1';
    }
    if (corruptedLabel) corruptedLabel.style.opacity = '1';
    await delay(REDUCED_MOTION ? 50 : 400);
}

async function concealPanel() {
    clearSubtitle();
    if (panelImg) panelImg.style.opacity = '0';
    if (corruptedLabel) corruptedLabel.style.opacity = '0';
    await delay(REDUCED_MOTION ? 50 : 400);
}

function triggerInterferenceFlash() {
    if (REDUCED_MOTION) return;
    const panel = document.getElementById('main-panel');
    if (!panel) return;
    const flash = document.createElement('div');
    flash.style.cssText =
        'position:absolute;inset:0;z-index:10;' +
        'background:rgba(221,208,160,0.08);' +
        'pointer-events:none;' +
        'animation:transition-flash 0.8s ease-out forwards;';
    flash.setAttribute('aria-hidden', 'true');
    panel.appendChild(flash);
    setTimeout(() => { if (flash.parentNode) flash.remove(); }, 900);
}

async function triggerBlackout(ms = 100) {
    if (REDUCED_MOTION) return;
    if (panelImg) panelImg.style.opacity = '0.03';
    if (corruptedLabel) corruptedLabel.style.opacity = '0.03';
    await delay(ms);
    if (panelImg) panelImg.style.opacity = '1';
    if (corruptedLabel) corruptedLabel.style.opacity = '1';
}


/* ══════════════════════════════════════════
   BRIGHTNESS DRIFT
   ══════════════════════════════════════════ */

function addBrightnessDriftOverlay() {
    if (document.querySelector('.brightness-drift')) return;
    const overlay = document.createElement('div');
    overlay.className = 'brightness-drift';
    overlay.setAttribute('aria-hidden', 'true');
    document.getElementById('crt').appendChild(overlay);
}


/* ══════════════════════════════════════════
   PLAYBACK
   ══════════════════════════════════════════ */

async function typeIntro(messages) {
    setNoiseIntensity(16);
    for (const msg of messages) {
        await typeOverlayLine(msg);
        await delay(REDUCED_MOTION ? 30 : 60 + Math.random() * 60);
    }
    await delay(REDUCED_MOTION ? 30 : 150);
    addSeparator();
    await delay(REDUCED_MOTION ? 30 : 100);
    resetNoiseIntensity();
}

async function showPanel(p, globalIndex) {
    await loadPanelImage(p);

    if (p.corrupted) setNoiseIntensity(24);

    await revealPanel();
    showSubtitle();

    await delay(REDUCED_MOTION ? 30 : 150);

    for (const line of p.overlays) {
        await typeOverlayLine(line);
        addSubtitleLine(line);
        await delay(REDUCED_MOTION ? 20 : 30);
    }

    /* Detection alert on Issue #01 panel 3 */
    if (p.alert) {
        playDetectionAlert();
        await delay(REDUCED_MOTION ? 50 : 1200);
    }

    /* Corrupted panel glitches */
    if (p.corrupted) {
        await delay(REDUCED_MOTION ? 50 : 400);
        triggerInterferenceFlash();
        await delay(REDUCED_MOTION ? 30 : 300);
        triggerBlackout(80);
        await delay(REDUCED_MOTION ? 30 : 300);
        triggerInterferenceFlash();
        resetNoiseIntensity();
        await delay(REDUCED_MOTION ? 50 : 300);
    }

    await delay(REDUCED_MOTION ? 50 : p.hold);
}

async function transitionToNext(p, globalIndex) {
    setNoiseIntensity(28);
    triggerInterferenceFlash();
    await concealPanel();
    await delay(REDUCED_MOTION ? 30 : 100);
    resetNoiseIntensity();
    await showPanel(p, globalIndex);
}

async function playbackLoop(panels, startIndex = 0) {
    for (let i = 0; i < panels.length; i++) {
        if (i === 0 && startIndex === 0) {
            await showPanel(panels[i], i);
        } else {
            await transitionToNext(panels[i], startIndex + i);
        }
    }
}


/* ══════════════════════════════════════════
   ISSUE #01 — HUB
   ════════════════════════════════════════ */

async function activateHubReveal() {
    await delay(REDUCED_MOTION ? 50 : 600);

    addSeparator();
    await delay(REDUCED_MOTION ? 30 : 100);
    await typeOverlayLineNoSound('> SIGNAL ROUTE AVAILABLE');
    await delay(REDUCED_MOTION ? 30 : 150);

    document.querySelectorAll('.signal-bars .bar').forEach(b => b.classList.add('active'));
    const sigVal = document.getElementById('sig-value');
    if (sigVal) sigVal.textContent = '100%';
    const statusText = document.getElementById('status-text');
    if (statusText) statusText.textContent = 'LINKED';

    const footerSignal = document.querySelector('.footer-signal');
    if (footerSignal) footerSignal.classList.add('visible');

    const oldLink = document.getElementById('hub-link');
    if (!oldLink) return;

    const newLink = oldLink.cloneNode(true);
    newLink.id = 'hub-link';
    newLink.removeAttribute('href');
    oldLink.replaceWith(newLink);

    await delay(REDUCED_MOTION ? 30 : 200);
    newLink.classList.add('hub-activating');
    playSoftPulse();

    await delay(REDUCED_MOTION ? 30 : 2600);
    newLink.classList.remove('hub-activating');
    newLink.classList.add('hub-active');

    const hubStatus = newLink.querySelector('.hub-status');
    if (hubStatus) hubStatus.classList.add('visible');

    newLink.addEventListener('click', (e) => {
        e.preventDefault();
        interceptToIssue02(newLink);
    });
}


/* ══════════════════════════════════════════
   INTERCEPT → ISSUE #02
   ══════════════════════════════════════════ */

async function interceptToIssue02(hubLink) {
    hubLink.classList.remove('hub-active');
    hubLink.style.pointerEvents = 'none';
    hubLink.style.color = 'var(--fg-dim)';
    const hubStatus = hubLink.querySelector('.hub-status');
    if (hubStatus) hubStatus.style.opacity = '0';
    const footerSignal = document.querySelector('.footer-signal');
    if (footerSignal) {
        footerSignal.textContent = 'SIGNAL INTERRUPTED';
        footerSignal.style.color = 'var(--accent-red)';
    }

    for (const msg of INTERCEPT_MSGS) {
        await typeOverlayLineNoSound(msg);
        await delay(REDUCED_MOTION ? 30 : 150);
    }

    await delay(REDUCED_MOTION ? 30 : 200);
    await typeOverlayLineNoSound('> WARNING: NEW TRANSMISSION DETECTED');
    await delay(REDUCED_MOTION ? 30 : 150);
    await typeOverlayLineNoSound('> SIGNAL ROUTE OVERRIDDEN');
    await delay(REDUCED_MOTION ? 30 : 300);

    const crt = document.getElementById('crt');
    if (crt) {
        crt.classList.add('booting');
        await delay(REDUCED_MOTION ? 30 : 600);
        crt.classList.remove('booting');
    }

    document.querySelectorAll('.signal-bars .bar').forEach((b, i) => {
        if (i >= 3) b.classList.remove('active');
    });
    const sigVal = document.getElementById('sig-value');
    if (sigVal) sigVal.textContent = '??%';
    const statusText = document.getElementById('status-text');
    if (statusText) statusText.textContent = 'UNSTABLE';

    document.querySelectorAll('.header-bottom span').forEach(span => {
        if (span.textContent.includes('RC-0041')) span.textContent = 'ISSUE: RC-0042-GHOST';
        if (span.textContent.includes('DARKNET')) span.textContent = 'PROTOCOL: GHOST FREQUENCY';
    });

    await delay(REDUCED_MOTION ? 30 : 400);
    crt.classList.add('issue-ghost');
    startGhostAudio();

    /* Issue #02 intro */
    setNoiseIntensity(20);
    addSeparator();
    await delay(REDUCED_MOTION ? 30 : 300);
    for (const msg of INTRO_02) {
        await typeOverlayLineNoSound(msg);
        await delay(REDUCED_MOTION ? 30 : 300 + Math.random() * 200);
    }
    await delay(REDUCED_MOTION ? 30 : 200);
    addSeparator();
    await delay(REDUCED_MOTION ? 30 : 150);
    resetNoiseIntensity();

    await playbackLoop(ISSUE_02, 5);
    await ghostEnding();
}


/* ══════════════════════════════════════════
   GHOST ENDING → EMERGENCY → EXIT
   ══════════════════════════════════════════ */

async function ghostEnding() {
    await concealPanel();

    setNoiseIntensity(20);
    await delay(REDUCED_MOTION ? 50 : 1200);

    document.querySelectorAll('.signal-bars .bar').forEach((b, i) => {
        if (i > 0) b.classList.remove('active');
    });
    const sigVal = document.getElementById('sig-value');
    if (sigVal) sigVal.textContent = '???';
    const statusText = document.getElementById('status-text');
    if (statusText) statusText.textContent = 'LOST';

    resetNoiseIntensity();
    stopGhostAudio();
    playGhostDrone();

    await delay(REDUCED_MOTION ? 50 : 1500);

    addSeparator();
    await delay(REDUCED_MOTION ? 30 : 600);
    await typeOverlayLineWithCursor('> CONTINUE RECOVERY?');
    await delay(REDUCED_MOTION ? 30 : 800);
    await typeOverlayLineWithCursor('> [Y/N]');

    await delay(REDUCED_MOTION ? 50 : 3000);

    await typeOverlayLineNoSound('> NO RESPONSE RECEIVED');
    await delay(REDUCED_MOTION ? 30 : 500);
    await typeOverlayLineNoSound('> ESTABLISHING EMERGENCY ROUTE...');
    await delay(REDUCED_MOTION ? 30 : 400);

    document.querySelectorAll('.signal-bars .bar').forEach((b, i) => {
        if (i < 3) b.classList.add('active');
    });
    if (sigVal) sigVal.textContent = '61%';
    if (statusText) statusText.textContent = 'UNSTABLE';

    await delay(REDUCED_MOTION ? 30 : 400);

    const hubLink = document.getElementById('hub-link');
    if (hubLink) {
        hubLink.style.pointerEvents = '';
        hubLink.style.color = '';
        const hubStatus = hubLink.querySelector('.hub-status');
        if (hubStatus) {
            hubStatus.textContent = 'UNSTABLE';
            hubStatus.style.opacity = '';
        }
        hubLink.classList.add('hub-activating');
        playSoftPulse();
        await delay(REDUCED_MOTION ? 30 : 2600);
        hubLink.classList.remove('hub-activating');
        hubLink.classList.add('hub-active');
        if (hubStatus) hubStatus.classList.add('visible');
        hubLink.addEventListener('click', (e) => {
            e.preventDefault();
            hubTransition();
        });
    }

    const footerSignal = document.querySelector('.footer-signal');
    if (footerSignal) {
        footerSignal.textContent = 'EMERGENCY ROUTE';
        footerSignal.style.color = '';
    }

    const crt = document.getElementById('crt');
    if (crt) crt.classList.remove('issue-ghost');
}


/* ══════════════════════════════════════════
   HUB EXIT
   ══════════════════════════════════════════ */

async function hubTransition() {
    const link = document.getElementById('hub-link');
    if (link) {
        link.classList.remove('hub-active');
        link.style.pointerEvents = 'none';
    }

    for (const msg of EXIT_MSGS) {
        await typeOverlayLineNoSound(msg);
        await delay(REDUCED_MOTION ? 30 : 150);
    }

    await delay(REDUCED_MOTION ? 30 : 200);

    const crt = document.getElementById('crt');
    if (crt) {
        crt.classList.add('booting');
        await delay(REDUCED_MOTION ? 30 : 400);
        crt.classList.remove('booting');
    }

    setNoiseIntensity(28);
    await delay(REDUCED_MOTION ? 30 : 100);
    resetNoiseIntensity();

    const overlay = document.createElement('div');
    overlay.className = 'fade-to-black-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
    overlay.style.animation = 'fade-to-black 2s ease-in forwards';

    await delay(REDUCED_MOTION ? 200 : 2200);

    window.location.href = '../../index.html';
}


/* ══════════════════════════════════════════
   INIT
   ══════════════════════════════════════════ */

export async function initPanels() {
    addBrightnessDriftOverlay();
    bindAudioStart();

    await typeIntro(INTRO_01);
    await hideAwaitingState();
    enableBrightnessDrift();
    await playbackLoop(ISSUE_01);
    await activateHubReveal();
}