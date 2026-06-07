/**
 * Night Observer — Main orchestrator
 * Phase 4: integrated audio system
 */

import { RadarDisplay } from './radar-display.js';
import { AnomalySystem } from './anomaly-system.js';
import { ObservationLog } from './observation-log.js';
import { AudioSystem } from './audio-system.js';
import {
  loadData, incrementConfirmedAnomalies,
  incrementFalsePositives, incrementMissedAnomalies,
  updateStorage, isSignalCorrelationFound,
  generateSessionId
} from './storage.js';
import { extendTranslations, initI18n, t } from '../../../js/i18n.js';
import { nightObserverTranslations } from './translations.js';

// --- i18n ---
extendTranslations(nightObserverTranslations);
initI18n();

// --- DOM ---
const canvas = document.getElementById('observer-radar');
const radarContainer = document.querySelector('.radar-container');
const alertEl = document.getElementById('anomaly-alert');
const alertHeaderText = document.getElementById('alert-header-text');
const alertDot = alertEl.querySelector('.alert-dot');
const alertActions = document.getElementById('alert-actions');
const analysisGrid = document.getElementById('analysis-grid');
const analysisValues = {
  signalType:     document.getElementById('av-signal-type'),
  trajectory:     document.getElementById('av-trajectory'),
  signalStrength: document.getElementById('av-signal-strength'),
  movement:       document.getElementById('av-movement'),
};
const btnConfirm = document.getElementById('btn-confirm');
const btnDismiss = document.getElementById('btn-dismiss');
const logContainer = document.getElementById('log-entries');
const confirmedCountEl = document.getElementById('confirmed-count');
const sessionIdEl = document.getElementById('session-id');
const radarStatusText = document.getElementById('radar-status-text');

// Audio DOM
const audioIndicator = document.getElementById('audio-indicator');
const audioVolumeSlider = document.getElementById('audio-volume');
const audioMuteBtn = document.getElementById('audio-mute');
const audioStatusEl = document.getElementById('audio-status-value');

// --- State ---
const data = loadData();
sessionIdEl.textContent = generateSessionId();
confirmedCountEl.textContent = data.confirmedAnomalies;

let isBusy = false;
const milestonesFired = new Set(data.milestonesFired || []);

// --- Systems ---
const radar = new RadarDisplay(canvas, radarContainer);
const log = new ObservationLog(logContainer);
const anomalySystem = new AnomalySystem();
const audio = new AudioSystem();

// Init audio indicator
audio.setIndicator(audioIndicator);

// Restore correlation if already unlocked
if (isSignalCorrelationFound()) {
  anomalySystem.setCorrelationEnabled(true);
}

// --- Audio activation on first interaction ---
let audioActivated = false;

function activateAudio() {
  if (audioActivated) return;
  audioActivated = true;
  audio.activate();
  updateAudioUI();
  document.removeEventListener('click', activateAudio);
  document.removeEventListener('keydown', activateAudio);
}

document.addEventListener('click', activateAudio);
document.addEventListener('keydown', activateAudio);

// --- Audio UI ---

function updateAudioUI() {
  const vol = audio.getVolume();
  audioVolumeSlider.value = vol;

  if (audio.isMuted()) {
    audioStatusEl.textContent = t('observer.audio.muted');
    audioStatusEl.classList.add('audio-status--muted');
    audioStatusEl.classList.remove('audio-status--online');
    audioMuteBtn.textContent = t('observer.audio.unmute');
  } else {
    audioStatusEl.textContent = t('observer.audio.online');
    audioStatusEl.classList.add('audio-status--online');
    audioStatusEl.classList.remove('audio-status--muted');
    audioMuteBtn.textContent = t('observer.audio.mute');
  }
}

audioVolumeSlider.addEventListener('input', () => {
  audio.setVolume(parseInt(audioVolumeSlider.value, 10));
  updateAudioUI();
});

audioMuteBtn.addEventListener('click', () => {
  audio.toggleMute();
  updateAudioUI();
});

// Initial UI state (before activation)
updateAudioUI();

// --- Helpers ---

function randomScore(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function persistMilestones() {
  updateStorage({ milestonesFired: Array.from(milestonesFired) });
}

function resetAlertClasses() {
  alertEl.classList.remove(
    'anomaly-alert--milestone', 'anomaly-alert--confirmed',
    'anomaly-alert--false-positive', 'anomaly-alert--missed',
    'anomaly-alert--dismissed'
  );
  alertDot.classList.remove(
    'alert-dot--milestone', 'alert-dot--confirmed',
    'alert-dot--false-positive', 'alert-dot--missed'
  );
}

function showAnomalyAlert(anomaly) {
  isBusy = true;
  resetAlertClasses();
  alertHeaderText.textContent = t('observer.anomalyDetected');
  alertActions.style.display = 'flex';
  analysisGrid.style.display = 'grid';

  analysisValues.signalType.textContent = t(anomaly.analysis.signalType);
  analysisValues.signalType.className = 'analysis-value' +
    (anomaly.correlated ? ' analysis-value--repeated' : '');
  analysisValues.trajectory.textContent = t(anomaly.analysis.trajectory);
  analysisValues.signalStrength.textContent = t(anomaly.analysis.signalStrength);
  analysisValues.movement.textContent = t(anomaly.analysis.movementProfile);

  alertEl.classList.add('active');
  radarStatusText.textContent = t('observer.anomalyDetected');
  radarStatusText.className = 'radar-status radar-status--warning';

  if (anomaly.correlated) {
    log.addEntry(t('observer.log.correlated'));
    audio.playCorrelated();
  } else {
    audio.playContactDetected();
  }
}

function showFeedback(type) {
  resetAlertClasses();
  alertActions.style.display = 'none';
  analysisGrid.style.display = 'none';

  const classMap = {
    confirmed:     { alert: 'anomaly-alert--confirmed',     dot: 'alert-dot--confirmed' },
    falsePositive: { alert: 'anomaly-alert--false-positive', dot: 'alert-dot--false-positive' },
    missed:        { alert: 'anomaly-alert--missed',        dot: 'alert-dot--missed' },
    dismissed:     { alert: 'anomaly-alert--dismissed',     dot: '' },
  };

  const config = classMap[type];
  if (!config) return;

  alertHeaderText.textContent = t('observer.feedback.' + type);
  if (config.alert) alertEl.classList.add(config.alert);
  if (config.dot) alertDot.classList.add(config.dot);
  if (!alertEl.classList.contains('active')) alertEl.classList.add('active');
}

function showMilestone(text) {
  resetAlertClasses();
  alertActions.style.display = 'none';
  analysisGrid.style.display = 'none';

  alertHeaderText.textContent = text;
  alertEl.classList.add('anomaly-alert--milestone');
  alertDot.classList.add('alert-dot--milestone');

  if (!alertEl.classList.contains('active')) alertEl.classList.add('active');

  radarStatusText.textContent = text;
  radarStatusText.className = 'radar-status radar-status--milestone';
}

function hideAlert() {
  alertEl.classList.remove('active');
  alertActions.style.display = 'none';
  analysisGrid.style.display = 'none';
  resetAlertClasses();
  radarStatusText.textContent = t('observer.scanning');
  radarStatusText.className = 'radar-status';
}

function scheduleNext() {
  isBusy = false;
  anomalySystem._scheduleNext();
}

// --- Staged sequence runner ---

function runSequence(steps, onComplete) {
  let i = 0;
  function next() {
    if (i >= steps.length) {
      if (onComplete) onComplete();
      return;
    }
    const step = steps[i];
    i++;
    if (step.action) step.action();
    if (step.delay > 0) {
      setTimeout(next, step.delay);
    } else {
      next();
    }
  }
  next();
}

// --- Milestone sequences ---

function runPatternAnalysis(onComplete) {
  const score = randomScore(10, 30);
  const steps = [
    { action: () => updateStorage({ patternAnalysisActive: true }) },
    { delay: 600, action: () => log.addEntry(t('observer.log.patternActive')) },
    { delay: 2800, action: () => log.addEntry(t('observer.log.comparingContacts')) },
    { delay: 3000, action: () => log.addEntry(t('observer.log.correlationScore') + score + '%') },
    { delay: 800 },
  ];
  runSequence(steps, onComplete);
}

function runCorrelationAnalysis(onComplete) {
  const score = randomScore(45, 75);
  const steps = [
    {
      action: () => {
        updateStorage({ signalCorrelationFound: true });
        anomalySystem.setCorrelationEnabled(true);
      }
    },
    { delay: 600, action: () => log.addEntry(t('observer.log.repeatedSignature')) },
    { delay: 2800, action: () => log.addEntry(t('observer.log.comparingTrajectories')) },
    { delay: 3000, action: () => log.addEntry(t('observer.log.matchConfidence') + score + '%') },
    { delay: 800 },
  ];
  runSequence(steps, onComplete);
}

function runTransmissionAssembly(onComplete) {
  const integrity = randomScore(25, 55);
  const steps = [
    {
      action: () => {
        updateStorage({
          transmissionReady: true,
          outsideSignalUnlocked: true,
        });
      }
    },
    { delay: 600,  action: () => log.addEntry(t('observer.log.assemblingFragments')) },
    { delay: 2800, action: () => log.addEntry(t('observer.log.fragment01')) },
    { delay: 2400, action: () => log.addEntry(t('observer.log.fragment02')) },
    { delay: 2600, action: () => log.addEntry(t('observer.log.transmissionIntegrity') + integrity + '%') },
    { delay: 2800, action: () => log.addEntry(t('observer.log.outsideSignalAvailable')) },
    { delay: 1200 },
  ];
  runSequence(steps, onComplete);
}

// --- Milestone check ---

function getMilestone(count) {
  const map = { 2: 2, 4: 4, 7: 7 };
  const m = map[count];
  if (m && !milestonesFired.has(m)) {
    milestonesFired.add(m);
    persistMilestones();
    return t('observer.milestone.' + m);
  }
  return null;
}

// --- Anomaly callbacks ---

anomalySystem.onAnomalyAppeared((anomaly) => {
  showAnomalyAlert(anomaly);
});

anomalySystem.onAnomalyExpired(() => {
  alertHeaderText.textContent = t('observer.signalLost');
  alertActions.style.display = 'none';
  analysisGrid.style.display = 'none';
  resetAlertClasses();
  alertEl.classList.add('active');
  radarStatusText.textContent = t('observer.scanning');
  radarStatusText.className = 'radar-status';
  isBusy = false;
  setTimeout(hideAlert, 2500);
});

anomalySystem.onAnomalyAction((anomaly, action) => {
  const isConfirm = action === 'confirm';
  const isTrue = anomaly.isTrue;

  let logKey;
  if (isConfirm && isTrue)       logKey = 'observer.log.confirmed';
  else if (isConfirm && !isTrue)  logKey = 'observer.log.falsePositive';
  else if (!isConfirm && isTrue)  logKey = 'observer.log.missed';
  else                            logKey = 'observer.log.correctDismiss';
  log.addEntry(t(logKey));

  if (isConfirm && isTrue) {
    const newCount = incrementConfirmedAnomalies();
    confirmedCountEl.textContent = newCount;
    radar.addMarker(anomaly);
    showFeedback('confirmed');
    audio.playConfirmAnomaly();

    const milestone = getMilestone(newCount);

    setTimeout(() => {
      if (milestone) {
        showMilestone(milestone);
        log.addEntry(milestone);

        setTimeout(() => {
          if (newCount === 2) {
            audio.playMilestone2();
            runPatternAnalysis(() => { hideAlert(); scheduleNext(); });
          } else if (newCount === 4) {
            audio.playMilestone4();
            runCorrelationAnalysis(() => { hideAlert(); scheduleNext(); });
          } else if (newCount === 7) {
            audio.playMilestone7();
            runTransmissionAssembly(() => { hideAlert(); scheduleNext(); });
          } else {
            hideAlert();
            scheduleNext();
          }
        }, 4500);

      } else {
        hideAlert();
        scheduleNext();
      }
    }, 2500);

  } else if (isConfirm && !isTrue) {
    incrementFalsePositives();
    showFeedback('falsePositive');
    audio.playFalsePositive();
    setTimeout(() => { hideAlert(); scheduleNext(); }, 3000);

  } else if (!isConfirm && isTrue) {
    incrementMissedAnomalies();
    showFeedback('missed');
    audio.playMissedAnomaly();
    setTimeout(() => { hideAlert(); scheduleNext(); }, 3000);

  } else {
    showFeedback('dismissed');
    setTimeout(() => { hideAlert(); scheduleNext(); }, 2000);
  }
});

// --- Buttons ---
btnConfirm.addEventListener('click', () => anomalySystem.confirm());
btnDismiss.addEventListener('click', () => anomalySystem.dismiss());

// --- Atmospheric log entries ---

const ATMOSPHERIC_KEYS = [
  'observer.atm.passiveScan',
  'observer.atm.noiseIncreasing',
  'observer.atm.signalFluctuation',
  'observer.atm.carrierWave',
  'observer.atm.archiveFailed',
  'observer.atm.noOperatorResponse',
  'observer.atm.frequencyDrift',
];

const MYSTERY_KEYS = [
  'observer.mystery.trajectoryResembles',
  'observer.mystery.patternRecurrence',
  'observer.mystery.signatureMatch',
  'observer.mystery.originUnresolved',
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

setInterval(() => {
  if (isBusy) return;

  if (isSignalCorrelationFound() && Math.random() < 0.012) {
    log.addEntry(t(pickRandom(MYSTERY_KEYS)));
    return;
  }

  if (Math.random() < 0.022) {
    log.addEntry(t(pickRandom(ATMOSPHERIC_KEYS)));
  }
}, 6000);

// --- Animation loop ---
let lastTime = 0;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animate(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;
  anomalySystem.update(dt);
  radar.setAnomaly(anomalySystem.getCurrentAnomaly());
  radar.update(dt);
  radar.draw();
  requestAnimationFrame(animate);
}

anomalySystem.start();

if (!prefersReduced) {
  requestAnimationFrame(animate);
} else {
  radar.draw();
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    anomalySystem.destroy();
  } else {
    anomalySystem.start();
  }
});