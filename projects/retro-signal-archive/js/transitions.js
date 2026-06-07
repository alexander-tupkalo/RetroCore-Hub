/* ═══════════════════════════════════════════
   TRANSITIONS.JS — Typing effect utility,
   CRT boot sequence orchestrator
   ═══════════════════════════════════════════ */

import { initNoise, animateSignal, startClock, spawnFragment } from './atmosphere.js';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Utility ── */

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* ── Typing Effect ── */

export function typeText(element, text, speed = 35, cursorClass = '', onChar = null) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';

        const cursor = document.createElement('span');
        cursor.className = 'cursor' + (cursorClass ? ' ' + cursorClass : '');
        element.appendChild(cursor);

        function tick() {
            if (i < text.length) {
                element.insertBefore(
                    document.createTextNode(text[i]),
                    cursor
                );
                if (onChar) onChar(text[i]);
                i++;
                setTimeout(tick, speed + Math.random() * (speed * 0.5));
            } else {
                setTimeout(() => {
                    if (cursor.parentNode) cursor.remove();
                    resolve();
                }, 200);
            }
        }

        tick();
    });
}

/* ── CRT Boot Sequence ── */

export async function bootSequence() {
    const crt = document.getElementById('crt');
    const terminal = document.getElementById('terminal-body');
    const sideTerminal = document.getElementById('side-terminal');
    const titleEl = document.getElementById('title-text');

    await delay(REDUCED_MOTION ? 100 : 350);

    crt.classList.add('booting');
    await delay(REDUCED_MOTION ? 100 : 700);
    crt.classList.remove('booting');

    crt.classList.add('warming');
    await delay(REDUCED_MOTION ? 100 : 400);
    crt.classList.remove('warming');

    crt.classList.add('system-visible');
    await delay(REDUCED_MOTION ? 100 : 150);
    crt.classList.add('system-online');

    await delay(REDUCED_MOTION ? 50 : 200);
    await typeText(
        titleEl,
        'RETROCORE://SIGNAL_ARCHIVE',
        30,
        'cursor-amber'
    );

    await delay(REDUCED_MOTION ? 50 : 300);
    sideTerminal.classList.add('terminal-active');

    const initialLogs = [
        '> SIGNAL RECOVERY INITIATED',
        '> FREQUENCY LOCK: 47.3 MHz',
        '> SOURCE: SECTOR-7 RELAY NODE',
        '> STATUS: FRAGMENT DETECTED',
        '> INTEGRITY: 23.7%',
        '> CLASSIFICATION: LEVEL-4',
        '> WARNING: DEGRADATION CRITICAL',
        '> AWAITING FULL TRANSMISSION...',
    ];

    for (const entry of initialLogs) {
        const line = document.createElement('div');
        line.className = 'log-entry';
        terminal.appendChild(line);

        await typeText(line, entry, 12);
        terminal.scrollTop = terminal.scrollHeight;

        await delay(REDUCED_MOTION ? 20 : 25 + Math.random() * 30);
    }

    await delay(REDUCED_MOTION ? 50 : 200);
    document.getElementById('main-panel').classList.add('panel-active');

    initNoise();
    animateSignal();
    startClock();

    if (!REDUCED_MOTION) {
        setTimeout(spawnFragment, 3000);
    }
}