/**
 * RETROCORE://HUB — immersion.js
 * Phase 4 orchestrator. Imports all immersion systems.
 * Loaded as <script type="module"> after main.js.
 */

import { initBoot }                   from './systems/boot.js';
import { initTransitions }            from './systems/transitions.js';
import { initTerminalEvents }         from './systems/terminal-events.js';
import { initAudio, toggleAudio,
         isAudioEnabled, startAudio } from './systems/ambient-audio.js';

// ═══════════════════════════════════════════════════════
//  AUDIO TOGGLE UI
// ═══════════════════════════════════════════════════════
function createAudioToggle() {
  const btn = document.createElement('button');
  btn.className    = 'audio-toggle';
  btn.id           = 'audio-toggle';
  btn.setAttribute('aria-label', 'Toggle ambient audio');
  btn.setAttribute('aria-pressed', isAudioEnabled() ? 'true' : 'false');

  const audioOn = isAudioEnabled();
  btn.setAttribute('data-audio', audioOn ? 'on' : 'off');

  // Use translated label if available
  function audioLabel(on) {
    return (typeof window.__rc_t === 'function')
      ? window.__rc_t(on ? 'audioOn' : 'audioOff')
      : (on ? 'AUDIO://ON' : 'AUDIO://OFF');
  }

  btn.innerHTML = `
    <div class="audio-toggle__icon" aria-hidden="true">
      <span class="audio-toggle__bar"></span>
      <span class="audio-toggle__bar"></span>
      <span class="audio-toggle__bar"></span>
      <span class="audio-toggle__bar"></span>
    </div>
    <span class="audio-toggle__label" id="audio-label">
      ${audioLabel(audioOn)}
    </span>
  `;

  btn.addEventListener('click', () => {
    const nowOn = toggleAudio();
    btn.setAttribute('data-audio', nowOn ? 'on' : 'off');
    btn.setAttribute('aria-pressed', nowOn ? 'true' : 'false');
    btn.querySelector('#audio-label').textContent = audioLabel(nowOn);

    // Flash feedback
    btn.classList.remove('flash');
    void btn.offsetWidth; // reflow
    btn.classList.add('flash');
    btn.addEventListener('animationend', () => btn.classList.remove('flash'), { once: true });

    document.dispatchEvent(new CustomEvent('retrocore:audio-toggle', {
      detail: { enabled: nowOn }, bubbles: true
    }));
  });

  document.body.appendChild(btn);
  return btn;
}

// Update audio toggle UI state if audio was started by initAudio internals
function syncAudioToggleUI() {
  const btn = document.getElementById('audio-toggle');
  if (!btn) return;
  const on = isAudioEnabled();
  btn.setAttribute('data-audio', on ? 'on' : 'off');
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  const label = btn.querySelector('#audio-label');
  if (label) label.textContent = on ? 'AUDIO://ON' : 'AUDIO://OFF';
}

// ═══════════════════════════════════════════════════════
//  BOOT → PAGE READY SEQUENCE
// ═══════════════════════════════════════════════════════
function onPageReady() {
  // 1. Module transitions
  initTransitions();

  // 2. Terminal events — start after brief delay post-boot
  setTimeout(() => initTerminalEvents(), 8000);

  // 3. Audio (activates after first interaction)
  initAudio();

  // 4. Audio toggle UI
  createAudioToggle();

  // Sync toggle if audio auto-started via interaction
  document.addEventListener('retrocore:audio-toggle', syncAudioToggleUI, { once: false });

  console.log(
    '%c v0.4.0  IMMERSION LAYER ACTIVE ',
    'color:#a259ff;font-family:monospace;letter-spacing:0.12em;font-weight:bold;'
  );
}

// ═══════════════════════════════════════════════════════
//  ENTRY
// ═══════════════════════════════════════════════════════
function init() {
  // Boot sequence gates everything else
  initBoot(onPageReady);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}