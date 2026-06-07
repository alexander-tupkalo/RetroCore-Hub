/* ═══════════════════════════════════════════
   MAIN.JS — Entry point. Waits for fonts,
   runs boot sequence, then hands off to
   archive subsystems.
   ═══════════════════════════════════════════ */

import { bootSequence } from './transitions.js';
import { startAmbientLogs, initHubLink } from './archive.js';
import { initPanels } from './panels.js';

async function init() {
    await document.fonts.ready;
    await bootSequence();

    /* Boot complete — start background systems */
    startAmbientLogs();
    initHubLink();

    /* Begin cinematic panel playback */
    initPanels();
}

init();