/**
 * Night Observer — Procedural anomaly generation
 * Phase 3: correlation support
 */

const TYPES = ['moving_blip', 'stationary', 'trajectory', 'signal_spike'];

const TRUE_POOLS = {
  signalType:      ['analysis.sig.unknown', 'analysis.sig.anomalous', 'analysis.sig.unclassified', 'analysis.sig.nonstandard'],
  trajectory:      ['analysis.traj.irregular', 'analysis.traj.nonlinear', 'analysis.traj.impossible', 'analysis.traj.orbital_anomaly'],
  signalStrength:  ['analysis.str.unstable', 'analysis.str.fluctuating', 'analysis.str.erratic', 'analysis.str.anomalous'],
  movementProfile: ['analysis.mov.unpredictable', 'analysis.mov.nonnewtonian', 'analysis.mov.abrupt', 'analysis.mov.reversal'],
};

const FALSE_POOLS = {
  signalType:      ['analysis.sig.known', 'analysis.sig.civilian', 'analysis.sig.atmospheric', 'analysis.sig.system'],
  trajectory:      ['analysis.traj.linear', 'analysis.traj.predictable', 'analysis.traj.regular', 'analysis.traj.constant_bearing'],
  signalStrength:  ['analysis.str.stable', 'analysis.str.consistent', 'analysis.str.normal', 'analysis.str.steady'],
  movementProfile: ['analysis.mov.constant_vel', 'analysis.mov.steady', 'analysis.mov.linear', 'analysis.mov.predictable'],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class AnomalySystem {
  constructor() {
    this.currentAnomaly = null;
    this.nextTimer = null;
    this.eventCount = 0;
    this.correlationEnabled = false;
    this._appearedCb = null;
    this._actionCb = null;
    this._expiredCb = null;
  }

  onAnomalyAppeared(cb) { this._appearedCb = cb; }
  onAnomalyAction(cb)   { this._actionCb = cb; }
  onAnomalyExpired(cb)  { this._expiredCb = cb; }

  setCorrelationEnabled(enabled) {
    this.correlationEnabled = enabled;
  }

  start() {
    this._scheduleNext();
  }

  update(dt) {
    if (!this.currentAnomaly) return;
    const a = this.currentAnomaly;
    a.age += dt;

    if (a.state === 'appearing' && a.age >= 2) {
      a.state = 'active';
    }
    if (a.state === 'active' && a.age >= a.maxAge - 3) {
      a.state = 'expiring';
    }

    if (a.state === 'appearing') {
      a.brightness = a.age / 2;
    } else if (a.state === 'active') {
      a.brightness = 1;
    } else if (a.state === 'expiring') {
      a.brightness = Math.max(0, (a.maxAge - a.age) / 3);
    } else if (a.state === 'resolved') {
      a.brightness = Math.max(0, a.brightness - dt * 2);
    }

    if (a.state !== 'resolved') {
      this._moveAnomaly(a, dt);
    }

    if (a.state === 'expiring' && a.age >= a.maxAge) {
      this._expire();
    }

    if (a.state === 'resolved' && a.brightness <= 0) {
      this.currentAnomaly = null;
    }
  }

  getCurrentAnomaly() {
    return this.currentAnomaly;
  }

  confirm() {
    if (!this.currentAnomaly || this.currentAnomaly.state === 'resolved') return;
    this._resolve('confirm');
  }

  dismiss() {
    if (!this.currentAnomaly || this.currentAnomaly.state === 'resolved') return;
    this._resolve('dismiss');
  }

  _resolve(action) {
    const a = this.currentAnomaly;
    a.state = 'resolved';
    this.eventCount++;
    if (this._actionCb) this._actionCb(a, action);
  }

  _expire() {
    const a = this.currentAnomaly;
    a.state = 'resolved';
    this.eventCount++;
    if (this._expiredCb) this._expiredCb(a);
    setTimeout(() => this._scheduleNext(), 3000);
  }

  _scheduleNext() {
    const isFirst = this.eventCount === 0;
    const minDelay = isFirst ? 5 : 12;
    const maxDelay = isFirst ? 10 : 25;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    this.nextTimer = setTimeout(() => this._generateAnomaly(), delay * 1000);
  }

  _generateAnomaly() {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    const isTrue = Math.random() < 0.55;
    const pools = isTrue ? TRUE_POOLS : FALSE_POOLS;

    // Correlation check — 25% chance when enabled
    const isCorrelated = this.correlationEnabled && Math.random() < 0.25;

    let signalType = pickRandom(pools.signalType);
    if (isCorrelated) {
      signalType = 'analysis.sig.repeated';
    }

    const a = {
      id: 'ano_' + Date.now(),
      type: type,
      isTrue: isTrue,
      correlated: isCorrelated,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      orbitAngle: 0,
      orbitAngleSpeed: 0,
      orbitRadius: 0,
      orbitCenterX: 0,
      orbitCenterY: 0,
      brightness: 0,
      age: 0,
      maxAge: 0,
      state: 'appearing',
      trail: [],
      pulsePhase: Math.random() * Math.PI * 2,
      analysis: {
        signalType:      signalType,
        trajectory:      pickRandom(pools.trajectory),
        signalStrength:  pickRandom(pools.signalStrength),
        movementProfile: pickRandom(pools.movementProfile),
      },
    };

    switch (type) {
      case 'moving_blip':
        this._placeInZone(a, 0.25, 0.75);
        const moveAngle = Math.random() * Math.PI * 2;
        const speed = 0.012 + Math.random() * 0.018;
        a.vx = Math.cos(moveAngle) * speed;
        a.vy = Math.sin(moveAngle) * speed;
        a.maxAge = 22 + Math.random() * 8;
        break;

      case 'stationary':
        this._placeInZone(a, 0.15, 0.85);
        a.vx = 0;
        a.vy = 0;
        a.maxAge = 20 + Math.random() * 10;
        break;

      case 'trajectory':
        a.orbitCenterX = 0.3 + Math.random() * 0.4;
        a.orbitCenterY = 0.3 + Math.random() * 0.4;
        a.orbitRadius = 0.06 + Math.random() * 0.12;
        a.orbitAngle = Math.random() * Math.PI * 2;
        a.orbitAngleSpeed = (0.3 + Math.random() * 0.5) * (Math.random() < 0.5 ? 1 : -1);
        a.x = a.orbitCenterX + Math.cos(a.orbitAngle) * a.orbitRadius;
        a.y = a.orbitCenterY + Math.sin(a.orbitAngle) * a.orbitRadius;
        a.maxAge = 24 + Math.random() * 8;
        break;

      case 'signal_spike':
        this._placeInZone(a, 0.2, 0.8);
        a.maxAge = 5 + Math.random() * 4;
        break;
    }

    this.currentAnomaly = a;
    if (this._appearedCb) this._appearedCb(a);
  }

  _placeInZone(a, minDist, maxDist) {
    const angle = Math.random() * Math.PI * 2;
    const dist = minDist + Math.random() * (maxDist - minDist);
    a.x = 0.5 + Math.cos(angle) * dist * 0.5;
    a.y = 0.5 + Math.sin(angle) * dist * 0.5;
  }

  _moveAnomaly(a, dt) {
    switch (a.type) {
      case 'moving_blip':
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        const dx = a.x - 0.5;
        const dy = a.y - 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.48) {
          const nx = dx / dist;
          const ny = dy / dist;
          const dot = a.vx * nx + a.vy * ny;
          a.vx -= 2 * dot * nx;
          a.vy -= 2 * dot * ny;
          a.x = 0.5 + nx * 0.47;
          a.y = 0.5 + ny * 0.47;
        }
        break;

      case 'trajectory':
        a.orbitAngle += a.orbitAngleSpeed * dt;
        a.x = a.orbitCenterX + Math.cos(a.orbitAngle) * a.orbitRadius;
        a.y = a.orbitCenterY + Math.sin(a.orbitAngle) * a.orbitRadius;
        a.trail.push({ x: a.x, y: a.y });
        if (a.trail.length > 20) a.trail.shift();
        break;
    }
  }

  destroy() {
    if (this.nextTimer) clearTimeout(this.nextTimer);
  }
}