/**
 * Night Observer — Cross-module persistence
 * Phase 3: pattern, correlation, transmission flags
 */

const DATA_KEY = 'retrocore-night-observer';

const DEFAULT_DATA = {
  confirmedAnomalies: 0,
  falsePositives: 0,
  missedAnomalies: 0,
  patternAnalysisActive: false,
  signalCorrelationFound: false,
  transmissionReady: false,
  outsideSignalUnlocked: false,
};

export function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migration from Phase 1 structure
      if (parsed.anomaliesRecorded !== undefined && parsed.confirmedAnomalies === undefined) {
        parsed.confirmedAnomalies = parsed.anomaliesRecorded;
        parsed.falsePositives = 0;
        parsed.missedAnomalies = 0;
        delete parsed.anomaliesRecorded;
      }
      return { ...DEFAULT_DATA, ...parsed };
    }
  } catch (e) {}
  return { ...DEFAULT_DATA };
}

export function saveData(data) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch (e) {}
}

export function updateStorage(partial) {
  const data = loadData();
  Object.assign(data, partial);
  saveData(data);
  return data;
}

export function getConfirmedAnomalies() {
  return loadData().confirmedAnomalies;
}

export function incrementConfirmedAnomalies() {
  const data = loadData();
  data.confirmedAnomalies += 1;
  if (data.confirmedAnomalies >= 7) {
    data.outsideSignalUnlocked = true;
  }
  saveData(data);
  return data.confirmedAnomalies;
}

export function incrementFalsePositives() {
  const data = loadData();
  data.falsePositives += 1;
  saveData(data);
  return data.falsePositives;
}

export function incrementMissedAnomalies() {
  const data = loadData();
  data.missedAnomalies += 1;
  saveData(data);
  return data.missedAnomalies;
}

export function isOutsideSignalUnlocked() {
  return loadData().outsideSignalUnlocked === true;
}

export function isSignalCorrelationFound() {
  return loadData().signalCorrelationFound === true;
}

export function generateSessionId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'NO-07-';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}