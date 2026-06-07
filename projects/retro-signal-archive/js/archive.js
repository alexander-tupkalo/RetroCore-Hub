/* ═══════════════════════════════════════════
   ARCHIVE.JS — Ambient terminal log loop,
   hub link handler, archive data definitions
   ═══════════════════════════════════════════ */

import { typeText } from './transitions.js';

/* ── Ambient Message Pool ── */

const AMBIENT_MESSAGES = [
    '> SCANNING 47.0-47.6 MHz...',
    '> NOISE FLOOR: -82 dBm',
    '> ATTEMPTING REASSEMBLY...',
    '> ERROR: CHECKSUM MISMATCH',
    '> RETRY... ATTEMPT 47',
    '> BURST DETECTED [2ms]',
    '> FRAGMENT DISCARDED',
    '> BUFFER: 0 KB RECOVERED',
    '> SWITCHING FREQ...',
    '> HANDSHAKE FAILED',
    '> NODE UNRESPONSIVE',
    '> LOGGING...',
    '> CYCLE RESET',
    '> GUARD BAND: CLEAR',
    '> INTERFERENCE: HIGH',
];

/* ── Ambient Log Loop ── */

export function startAmbientLogs() {
    const terminal = document.getElementById('terminal-body');
    if (!terminal) return;

    function addLog() {
        const msg = AMBIENT_MESSAGES[
            Math.floor(Math.random() * AMBIENT_MESSAGES.length)
        ];

        const line = document.createElement('div');
        line.className = 'log-entry ambient';
        terminal.appendChild(line);

        typeText(line, msg, 18).then(() => {
            terminal.scrollTop = terminal.scrollHeight;
        });

        setTimeout(addLog, 9000 + Math.random() * 14000);
    }

    setTimeout(addLog, 12000);
}

/* ── Hub Link Handler ── */

export function initHubLink() {
    const link = document.getElementById('hub-link');
    if (!link) return;

    const terminal = document.getElementById('terminal-body');
    if (!terminal) return;

    const errorLines = [
        '> ERROR: UPLINK SEVERED',
        '> HUB NAVIGATION UNAVAILABLE',
        '> NO ROUTE TO RETROCORE://HUB',
        '> CONNECTION TERMINATED',
    ];

    link.addEventListener('click', (e) => {
        e.preventDefault();

        errorLines.forEach((msg, i) => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'log-entry ambient';
                terminal.appendChild(line);

                typeText(line, msg, 15).then(() => {
                    terminal.scrollTop = terminal.scrollHeight;
                });
            }, i * 600);
        });
    });
}