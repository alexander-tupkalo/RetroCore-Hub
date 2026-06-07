/**
 * RETROCORE://UNKNOWN_SECTOR
 * Main Entry Point
 * Initializes atmospheric background systems and localization
 */

import { RadarSystem } from './radar.js';
import { SignalTraces } from './signals.js';
import { initI18n } from './i18n.js';

const radarCanvas = document.getElementById('radar-canvas');
const signalsCanvas = document.getElementById('signals-canvas');

let radar = null;
let signals = null;

if (radarCanvas) {
  radar = new RadarSystem(radarCanvas);
}

if (signalsCanvas) {
  signals = new SignalTraces(signalsCanvas);
}

// Initialize localization before first render
initI18n();

// Animation loop
function animate() {
  if (radar) {
    radar.update();
    radar.draw();
  }
  if (signals) {
    signals.update();
    signals.draw();
  }
  requestAnimationFrame(animate);
}

// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!prefersReducedMotion.matches) {
  animate();
} else {
  // Draw a single static frame
  if (radar) radar.draw();
  if (signals) signals.draw();
}