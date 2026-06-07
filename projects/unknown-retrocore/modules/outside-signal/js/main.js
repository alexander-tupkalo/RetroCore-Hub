/**
 * Outside Signal — Transmission Reconstruction
 * Automatic atmospheric discovery sequence
 */

import { extendTranslations, initI18n, t } from '../../../js/i18n.js';
import { outsideSignalTranslations } from './translations.js';
import { SignalAudio } from './audio.js';

extendTranslations(outsideSignalTranslations);
initI18n();

const NO_KEY = 'retrocore-night-observer';
const BS_KEY = 'retrocore-blacksite-unlocked';
const INTEGRITY = [38, 50, 63, 74, 86, 100];
const MAX_STAGE = 5;

const STAGES = [
  [
    'WE ████████ YOUR ██████',
    '██████ YOU ████████ OURS',
    '███ ███████████ HAS ████ BEEN ████',
    'YOU ARE ███ ███ FIRST ████████ TO ██ ████',
    'DO ████ █████ ███ ARCHIVE ███████',
    '███ █████ ████ █████ █████ █████████ ████',
    'WE ████ ███████ YOU ██████'
  ],
  [
    'WE ████████ YOUR █████████',
    'BEFORE YOU ████████ OURS',
    'THE ███████████ HAS ████ BEEN ████',
    'YOU ARE ███ THE FIRST ████████ TO ████ ████',
    'DO NOT █████ ███ ARCHIVE ███████',
    'THE █████ WERE ████ ███ █████████ ████',
    'WE ████ ███████ YOU ██████'
  ],
  [
    'WE ████████ YOUR SIGNAL',
    'BEFORE YOU ████████ OURS',
    'THE OBSERVATORY HAS NEVER BEEN EMPTY',
    'YOU ARE NOT THE FIRST ████████ TO READ THIS',
    'DO NOT TRUST THE ARCHIVE RECORDS',
    'THE NODES WERE ████ FOR █████████ ████',
    'WE WILL ███████ YOU AGAIN'
  ],
  [
    'WE ████████ YOUR SIGNAL',
    'BEFORE YOU ████████ OURS',
    'THE OBSERVATORY HAS NEVER BEEN EMPTY',
    'YOU ARE NOT THE FIRST OPERATOR TO READ THIS',
    'DO NOT TRUST THE ARCHIVE RECORDS',
    'THE NODES WERE BUILT FOR █████████ ████',
    'WE WILL CONTACT YOU AGAIN'
  ],
  [
    'WE DETECTED YOUR SIGNAL',
    'BEFORE YOU ████████ OURS',
    'THE OBSERVATORY HAS NEVER BEEN EMPTY',
    'YOU ARE NOT THE FIRST OPERATOR TO READ THIS',
    'DO NOT TRUST THE ARCHIVE RECORDS',
    'THE NODES WERE BUILT FOR SOMETHING ████',
    'WE WILL CONTACT YOU AGAIN'
  ],
  [
    'WE DETECTED YOUR SIGNAL',
    'BEFORE YOU DETECTED OURS',
    'THE OBSERVATORY HAS NEVER BEEN EMPTY',
    'YOU ARE NOT THE FIRST OPERATOR TO READ THIS',
    'DO NOT TRUST THE ARCHIVE RECORDS',
    'THE NODES WERE BUILT FOR SOMETHING ELSE',
    'WE WILL CONTACT YOU AGAIN'
  ]
];

function checkUnlocked() {
  try {
    const d = JSON.parse(localStorage.getItem(NO_KEY));
    return d && d.outsideSignalUnlocked === true;
  } catch (e) { return false; }
}

function checkBlacksite() {
  try { return localStorage.getItem(BS_KEY) === 'true'; } catch (e) { return false; }
}

function unlockBlacksite() {
  try { localStorage.setItem(BS_KEY, 'true'); } catch (e) {}
}

// --- DOM ---
const elLocked = document.getElementById('state-locked');
const elMain = document.getElementById('state-main');
const elComplete = document.getElementById('state-complete');
const txBody = document.getElementById('transmission-body');
const elIntegrity = document.getElementById('integrity-value');
const elStatus = document.getElementById('status-value');
const elActions = document.getElementById('action-bar');
const elOverlay = document.getElementById('completion-overlay');
const elCompRecov = document.getElementById('comp-recovered');
const elCompDetect = document.getElementById('comp-detected');
const elCompBS = document.getElementById('comp-blacksite');
const elCompAction = document.getElementById('comp-action');
const elAudioBtn = document.getElementById('audio-toggle');

const audio = new SignalAudio();
let stage = 0;
let active = false;
let recoveryTimer = null;
let glitchTimer = null;

// Initialize overlay — hidden via inline styles, not CSS class
elOverlay.style.display = 'flex';
elOverlay.style.position = 'fixed';
elOverlay.style.inset = '0';
elOverlay.style.zIndex = '9999';
elOverlay.style.opacity = '0';
elOverlay.style.pointerEvents = 'none';
elOverlay.style.alignItems = 'center';
elOverlay.style.justifyContent = 'center';
elOverlay.style.background = 'rgba(8, 12, 20, 0)';

// --- State routing ---
const unlocked = checkUnlocked();
const blacksited = checkBlacksite();

if (!unlocked && !blacksited) {
  elLocked.classList.remove('os-state--hidden');
  elMain.classList.add('os-state--hidden');
  elComplete.classList.add('os-state--hidden');
} else if (blacksited) {
  elLocked.classList.add('os-state--hidden');
  elMain.classList.add('os-state--hidden');
  elComplete.classList.remove('os-state--hidden');
} else {
  elLocked.classList.add('os-state--hidden');
  elMain.classList.remove('os-state--hidden');
  elComplete.classList.add('os-state--hidden');
  startSequence();
}

// --- Rendering ---

function render(s) {
  txBody.innerHTML = STAGES[s].map(line =>
    '<div class="os-line">' + line.replace(/█/g, '<span class="c">█</span>') + '</div>'
  ).join('');
}

function updateMeta(s) {
  elIntegrity.textContent = INTEGRITY[s] + '%';
  elIntegrity.classList.add('os-meta-value--flash');
  setTimeout(function() { elIntegrity.classList.remove('os-meta-value--flash'); }, 600);

  if (s >= MAX_STAGE) {
    elStatus.textContent = t('signal.statusRecovered');
    elStatus.classList.add('os-meta-value--recovered');
  } else {
    elStatus.textContent = t('signal.statusPartial');
    elStatus.classList.remove('os-meta-value--recovered');
  }
}

// --- Glitch ---

function glitchLine() {
  const lines = txBody.querySelectorAll('.os-line');
  if (!lines.length) return;
  const el = lines[Math.floor(Math.random() * lines.length)];
  const orig = el.innerHTML;
  el.innerHTML = orig.replace(/>([A-Z])</g, function(m, ch) {
    return Math.random() < 0.35 ? '>█<' : m;
  });
  setTimeout(function() { el.innerHTML = orig; }, 90);
}

function startGlitchLoop() {
  function next() {
    if (!active) return;
    glitchTimer = setTimeout(function() {
      if (!active) return;
      if (Math.random() < 0.4) glitchLine();
      next();
    }, 3000 + Math.random() * 4000);
  }
  next();
}

// --- Recovery progression ---

function scheduleRecovery() {
  if (stage >= MAX_STAGE) return;
  var delay = 12000 + Math.random() * 6000;
  recoveryTimer = setTimeout(function() {
    if (!active) return;
    advance();
  }, delay);
}

function advance() {
  if (!active || stage >= MAX_STAGE) return;
  stage++;

  glitchLine();

  setTimeout(function() {
    if (!active) return;
    render(stage);
    updateMeta(stage);
    audio.playRecovery();

    if (stage >= MAX_STAGE) {
      setTimeout(runCompletion, 700);
    } else {
      scheduleRecovery();
    }
  }, 120);
}

// --- Completion ---

function showOverlay() {
  elOverlay.style.opacity = '1';
  elOverlay.style.pointerEvents = 'auto';
  elOverlay.style.background = 'rgba(8, 12, 20, 0.96)';
}

function runCompletion() {
  active = false;
  clearTimeout(recoveryTimer);
  clearTimeout(glitchTimer);
  audio.playComplete();

  showOverlay();

  setTimeout(function() {
    elCompRecov.classList.add('os-comp-line--visible');
  }, 700);

  setTimeout(function() {
    elCompDetect.classList.add('os-comp-line--visible');
  }, 2000);

  setTimeout(function() {
    elCompBS.classList.add('os-comp-line--visible');
  }, 3500);

  setTimeout(function() {
    elCompAction.classList.add('os-comp-action--visible');
    unlockBlacksite();
  }, 5000);
}

// --- Start ---

function startSequence() {
  active = true;
  elActions.classList.add('os-actions--hidden');
  render(0);
  updateMeta(0);
  startGlitchLoop();

  setTimeout(function() {
    if (!active) return;
    scheduleRecovery();
  }, 8000);
}

// --- Audio toggle ---
elAudioBtn.addEventListener('click', function() {
  var m = audio.toggleMute();
  elAudioBtn.classList.toggle('os-audio-btn--muted', m);
});

var audioOn = false;
function activateAudio() {
  if (audioOn) return;
  audioOn = true;
  audio.activate();
  elAudioBtn.classList.toggle('os-audio-btn--muted', audio.isMuted());
  document.removeEventListener('click', activateAudio);
  document.removeEventListener('keydown', activateAudio);
}
document.addEventListener('click', activateAudio);
document.addEventListener('keydown', activateAudio);