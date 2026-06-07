/**
 * RETROCORE://HUB — signal-ai.js
 * SIGNAL_AI v0.1 — Cinematic frontend prototype
 *
 * Recovered intelligence fragment terminal.
 * Fake scripted responses. Structured for future backend swap.
 *
 * Architecture:
 *  initSignalAI()      — mounts hero node + wires events
 *  openTerminal()      — builds & shows overlay
 *  closeTerminal()     — tears down overlay gracefully
 *  handleCommand(cmd)  — routes input to response engine
 *  typeResponse(lines) — cinematic character-by-character output
 *
 * FUTURE: Replace handleCommand() internals with backend AI fetch.
 */

'use strict';

// ── i18n helper ────────────────────────────────────────
// Delegates to the global window.__rc_t exposed by platform.js.
// Falls back to the key name so nothing breaks if called before platform loads.
function t(key) {
  return (typeof window.__rc_t === 'function' ? window.__rc_t(key) : null) || key;
}

// ── Constants ──────────────────────────────────────────
const OVERLAY_ID   = 'sai-overlay';
const STORAGE_KEY  = 'retrocore_sai_session';
const TYPE_SPEED   = 22;   // ms per character (base)
const GLITCH_ODDS  = 0.04; // probability per char
const SIGNAL_LOSS_ODDS = 0.12; // probability per response

let _overlay    = null;
let _isOpen     = false;
let _isTyping   = false;
let _audioCtx   = null;
let _cmdHistory = [];
let _historyIdx = -1;

// ── Node status data (drive UI from single source) ─────
const NODE_STATUS = {
  nodeId:       'RETROCORE://SIGNAL_AI',
  memFragments: '12%',
  signalCond:   'UNSTABLE',
  buildRef:     'v0.1-proto',
};

// ═══════════════════════════════════════════════════════
//  RESPONSE DATABASE
//  FUTURE: Replace this section with backend AI request.
//  getResponses() is called at command-time so t() always
//  reads the current language — never stale EN strings.
// ═══════════════════════════════════════════════════════
function getResponses() {
  // Array keys in translations are flat string arrays; wrap each in [text]
  const wrap = (arr) => arr.map(s => [s]);

  return {
    help:             wrap(t('saiHelp')),
    'who are you':    wrap(t('saiWho')),
    status:           wrap(t('saiStatus')),
    scan:             wrap(t('saiScan')),
    'open archive':   wrap(t('saiArchive')),
    signal:           wrap(t('saiSignal')),
    unknown:          wrap(t('saiUnknown')),
    // redirect is not translated — always a path
    'open archive _redirect': './projects/retro-signal-archive/index.html',
  };
}

function getSignalLossMessages() {
  return t('saiLoss').map(s => [s]);
}


// ═══════════════════════════════════════════════════════
//  AUDIO — ultra-subtle terminal sounds
// ═══════════════════════════════════════════════════════
function getAudioCtx() {
  if (_audioCtx) return _audioCtx;
  try {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch { return null; }
  return _audioCtx;
}

function playTick(vol = 0.028) {
  const ctx = getAudioCtx();
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const buf  = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.014), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.22)) * 0.7;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = vol;
    src.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch { /* no-op */ }
}

function playBlip(freq = 880, vol = 0.02) {
  const ctx = getAudioCtx();
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    const t   = ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.035);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  } catch { /* no-op */ }
}

function playOpenTone() {
  // Soft two-note "connection" motif
  playBlip(660, 0.018);
  setTimeout(() => playBlip(880, 0.014), 140);
}

function playCloseTone() {
  playBlip(440, 0.015);
  setTimeout(() => playBlip(330, 0.012), 120);
}

function playSubmitTone() {
  playBlip(1100, 0.016);
}

// ═══════════════════════════════════════════════════════
//  DOM BUILDERS
// ═══════════════════════════════════════════════════════

// ── Hero access node ───────────────────────────────────
function buildNode() {
  const node = document.createElement('div');
  node.className = 'sai-node';
  node.id = 'sai-node';
  node.setAttribute('role', 'button');
  node.setAttribute('tabindex', '0');
  node.setAttribute('aria-label', t('saiNodeAria'));
  node.innerHTML = `
    <div class="sai-node__pip-wrap" aria-hidden="true">
      <span class="sai-node__pip-ring"></span>
      <span class="sai-node__pip"></span>
    </div>

    <div class="sai-node__labels">
      <span class="sai-node__id" data-sai="nodeId">${t('saiNodeId')}</span>
      <span class="sai-node__status" data-sai="nodeStatus">${t('saiNodeStatusDormant')}</span>
    </div>

    <span class="sai-node__cta" data-sai="nodeCta">${t('saiNodeCta')}</span>

    <div class="sai-node__accent" aria-hidden="true"></div>
  `;

  node.addEventListener('click', openTerminal);
  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openTerminal();
    }
  });

  return node;
}

// ── Full overlay ───────────────────────────────────────
function buildOverlay() {
  const el = document.createElement('div');
  el.id = OVERLAY_ID;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', t('saiOverlayAria'));
  el.innerHTML = `
    <div class="sai__bg"        aria-hidden="true"></div>
    <div class="sai__scanlines" aria-hidden="true"></div>
    <div class="sai__noise"     aria-hidden="true"></div>
    <div class="sai__vignette"  aria-hidden="true"></div>
    <div class="sai__chroma"    aria-hidden="true"></div>

    <div class="sai__corner sai__corner--tl" aria-hidden="true"></div>
    <div class="sai__corner sai__corner--tr" aria-hidden="true"></div>
    <div class="sai__corner sai__corner--bl" aria-hidden="true"></div>
    <div class="sai__corner sai__corner--br" aria-hidden="true"></div>

    <div class="sai__terminal" role="document">

      <!-- Header bar -->
      <div class="sai__header">
        <div class="sai__header-dots" aria-hidden="true">
          <span class="sai__header-dot"></span>
          <span class="sai__header-dot"></span>
          <span class="sai__header-dot"></span>
        </div>
        <span class="sai__header-title">${NODE_STATUS.nodeId}</span>
        <div class="sai__header-meta" aria-hidden="true">
          <span class="sai__header-stat sai__header-stat--warn" data-sai="memStat">${t('saiMemStat')} ${NODE_STATUS.memFragments}</span>
          <span class="sai__header-stat sai__header-stat--bad"  data-sai="sigStat">${t('saiSigStat')} ${t('saiStripSignalVal')}</span>
          <span class="sai__header-stat">${NODE_STATUS.buildRef}</span>
        </div>
        <button class="sai__close" id="sai-close" aria-label="${t('saiCloseAria')}">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          <span data-sai="closeBtn">${t('saiCloseBtn')}</span>
        </button>
      </div>

      <!-- Node status strip -->
      <div class="sai__status-strip" aria-hidden="true">
        <div class="sai__strip-item">
          <span class="sai__strip-pip sai__strip-pip--warn"></span>
          <span class="sai__strip-label" data-sai="stripStatus">${t('saiStripStatus')}</span>
          <span class="sai__strip-val--warn" data-sai="stripStatusVal">${t('saiStripStatusVal')}</span>
        </div>
        <div class="sai__strip-item">
          <span class="sai__strip-label" data-sai="stripMemory">${t('saiStripMemory')}</span>
          <span class="sai__strip-val--warn">${NODE_STATUS.memFragments}</span>
        </div>
        <div class="sai__strip-item">
          <span class="sai__strip-label" data-sai="stripSignal">${t('saiStripSignal')}</span>
          <span class="sai__strip-val--bad" data-sai="stripSignalVal">${t('saiStripSignalVal')}</span>
        </div>
        <div class="sai__strip-item">
          <span class="sai__strip-pip sai__strip-pip--ok"></span>
          <span class="sai__strip-label" data-sai="stripConn">${t('saiStripConn')}</span>
          <span class="sai__strip-val--ok" data-sai="stripConnVal">${t('saiStripConnVal')}</span>
        </div>
      </div>

      <!-- Output log -->
      <div class="sai__output" id="sai-output" aria-live="polite" aria-label="Terminal output"></div>

      <!-- Thinking indicator -->
      <div class="sai__thinking" id="sai-thinking" aria-hidden="true">
        <span data-sai="processing">${t('saiProcessing')}</span>
        <span class="sai__thinking-dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>

      <!-- Input row -->
      <div class="sai__input-row">
        <span class="sai__input-prompt">SYS://&nbsp;&gt;</span>
        <input
          type="text"
          class="sai__input"
          id="sai-input"
          placeholder="${t('saiPlaceholder')}"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          maxlength="120"
          aria-label="Command input"
        >
        <button class="sai__input-submit" id="sai-submit" data-sai="sendBtn" aria-label="Submit command">${t('saiSendBtn')}</button>
      </div>

    </div><!-- /.sai__terminal -->
  `;
  return el;
}

// ═══════════════════════════════════════════════════════
//  TERMINAL OUTPUT ENGINE
// ═══════════════════════════════════════════════════════
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function appendMessage(text, type = 'response', prefix = '>') {
  const output = document.getElementById('sai-output');
  if (!output) return null;

  const row = document.createElement('div');
  row.className = `sai__msg sai__msg--${type}`;

  const pre  = document.createElement('span');
  pre.className = 'sai__msg-prefix';
  pre.textContent = prefix;
  pre.setAttribute('aria-hidden', 'true');

  const body = document.createElement('span');
  body.className = 'sai__msg-body';

  row.appendChild(pre);
  row.appendChild(body);
  output.appendChild(row);
  output.scrollTop = output.scrollHeight;
  return body;
}

// Character-by-character typing with optional glitch
async function typeText(el, text, speed = TYPE_SPEED) {
  for (let i = 0; i < text.length; i++) {
    if (!_isOpen) return; // abort if closed mid-type

    const char = text[i];
    el.textContent += char;

    // Occasional glitch character flash
    if (Math.random() < GLITCH_ODDS && char !== ' ' && char !== '\n') {
      el.classList.add('sai__glitch');
      await wait(80);
      el.classList.remove('sai__glitch');
    }

    // Tick sound every ~6 chars
    if (i % 6 === 0) playTick(0.018);

    // Variable speed: slower on punctuation
    const delay = /[.,…—]/.test(char)
      ? speed * 4
      : speed + (Math.random() * speed * 0.6);
    await wait(delay);

    // Auto-scroll
    const output = document.getElementById('sai-output');
    if (output) output.scrollTop = output.scrollHeight;
  }
}

// Type a full multi-line response
async function typeResponse(lines, type = 'response') {
  setThinking(true);
  await wait(320 + Math.random() * 280); // simulate processing delay
  setThinking(false);

  // Rare signal-loss injection
  if (Math.random() < SIGNAL_LOSS_ODDS) {
    const lossMsgs = getSignalLossMessages();
    const lossMsg = lossMsgs[Math.floor(Math.random() * lossMsgs.length)];
    for (const l of lossMsg) {
      const el = appendMessage(l[0] || '', 'error', '!');
      if (el && l[0]) await typeText(el, l[0], 24);
      await wait(180);
    }
    await wait(400);
  }

  for (const lineData of lines) {
    if (!_isOpen) return;

    const text = Array.isArray(lineData) ? lineData[0] : lineData;
    if (text === '') {
      // Empty line — just spacer
      appendMessage('', type);
      await wait(60);
      continue;
    }

    const el = appendMessage(text, type);
    if (el) await typeText(el, text, TYPE_SPEED);
    await wait(80);
  }

  playBlip(660, 0.014); // soft confirmation blip
}

function setThinking(active) {
  const el = document.getElementById('sai-thinking');
  if (el) el.classList.toggle('sai__thinking--active', active);
}

// ═══════════════════════════════════════════════════════
//  COMMAND ENGINE
//  FUTURE: Replace this section with backend AI fetch.
//  Signature should remain: handleCommand(cmd) → Promise<void>
// ═══════════════════════════════════════════════════════
async function handleCommand(raw) {
  if (_isTyping) return;
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return;

  _isTyping = true;

  // Echo user input
  const inputEl = appendMessage(raw, 'input', '>');
  if (inputEl) inputEl.textContent = raw; // no type effect for user input

  // Store history
  _cmdHistory.unshift(raw);
  if (_cmdHistory.length > 30) _cmdHistory.pop();
  _historyIdx = -1;

  // FUTURE: persistent operator memory
  // await saveToOperatorSession(cmd);

  // Route command
  if (cmd === 'exit' || cmd === 'quit') {
    await typeResponse([[t('saiExitLine1')], [t('saiExitLine2')]], 'system');
    await wait(800);
    closeTerminal();
    _isTyping = false;
    return;
  }

  if (cmd === 'clear') {
    const output = document.getElementById('sai-output');
    if (output) output.innerHTML = '';
    _isTyping = false;
    return;
  }

  // Get fresh responses in current language
  const RESPONSES = getResponses();

  if (cmd === 'open archive') {
    await typeResponse(RESPONSES['open archive'], 'response');
    await wait(800);
    // FUTURE: emit navigation event rather than hard redirect
    window.location.href = RESPONSES['open archive _redirect'];
    _isTyping = false;
    return;
  }

  // Match known commands
  let lines = RESPONSES[cmd];

  if (!lines) {
    // Fuzzy partial match
    const key = Object.keys(RESPONSES).find(k =>
      k !== 'unknown' && !k.endsWith('_redirect') && k.startsWith(cmd.slice(0, 4))
    );
    lines = key ? RESPONSES[key] : null;
  }

  if (!lines) {
    // Unknown command response — replace %CMD% placeholder
    lines = RESPONSES.unknown.map(l => [l[0].replace('%CMD%', raw)]);
  }

  // FUTURE: backend AI request
  // const lines = await fetchAIResponse({ command: cmd, operatorId: getSession()?.id });

  await typeResponse(lines, 'response');
  _isTyping = false;
}

// ═══════════════════════════════════════════════════════
//  OVERLAY LIFECYCLE
// ═══════════════════════════════════════════════════════
function openTerminal() {
  if (_isOpen) return;
  _isOpen = true;

  // Resume audio context if suspended (browser policy)
  const ctx = getAudioCtx();
  if (ctx?.state === 'suspended') ctx.resume();

  // Build overlay
  _overlay = buildOverlay();
  document.body.appendChild(_overlay);

  // Lock scroll
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top      = `-${scrollY}px`;
  document.body.style.width    = '100%';
  document.body.dataset.saiScrollY = scrollY;

  // Wire events
  document.getElementById('sai-close')?.addEventListener('click', closeTerminal);
  document.getElementById('sai-submit')?.addEventListener('click', submitInput);
  document.addEventListener('keydown', onKeydown);

  const input = document.getElementById('sai-input');
  input?.addEventListener('keydown', onInputKeydown);

  // Show
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      _overlay.classList.add('sai--visible');
      input?.focus();
      playOpenTone();
    });
  });

  // Boot greeting
  setTimeout(() => {
    if (!_isOpen) return;
    typeResponse([
      [t('saiGreet1')],
      [''],
      [t('saiGreet2')],
      [''],
      [t('saiGreet3')],
      [t('saiGreet4')],
    ], 'system');
  }, 400);

  // Update node status label
  const statusEl = document.querySelector('[data-sai="nodeStatus"]');
  if (statusEl) statusEl.textContent = t('saiNodeStatusConn');
}

function closeTerminal() {
  if (!_overlay || !_isOpen) return;
  _isOpen   = false;
  _isTyping = false;

  document.removeEventListener('keydown', onKeydown);
  playCloseTone();

  _overlay.classList.remove('sai--visible');
  _overlay.classList.add('sai--exit');

  const onDone = () => {
    _overlay?.remove();
    _overlay = null;

    // Restore scroll
    const scrollY = parseInt(document.body.dataset.saiScrollY || '0');
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    window.scrollTo(0, scrollY);

    // Return focus to node
    document.getElementById('sai-node')?.focus({ preventScroll: true });

    // Reset node status
    const statusEl = document.querySelector('[data-sai="nodeStatus"]');
    if (statusEl) statusEl.textContent = t('saiNodeStatusDormant');
  };

  _overlay.addEventListener('transitionend', onDone, { once: true });
  setTimeout(onDone, 320); // safety fallback
}

// ═══════════════════════════════════════════════════════
//  INPUT HANDLING
// ═══════════════════════════════════════════════════════
function submitInput() {
  const input = document.getElementById('sai-input');
  if (!input) return;
  const val = input.value.trim();
  input.value = '';
  if (!val) return;
  playSubmitTone();
  handleCommand(val);
}

function onInputKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitInput();
    return;
  }

  // Command history navigation
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (_cmdHistory.length === 0) return;
    _historyIdx = Math.min(_historyIdx + 1, _cmdHistory.length - 1);
    e.target.value = _cmdHistory[_historyIdx] || '';
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _historyIdx = Math.max(_historyIdx - 1, -1);
    e.target.value = _historyIdx >= 0 ? (_cmdHistory[_historyIdx] || '') : '';
    return;
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeTerminal();
  }
}

// ═══════════════════════════════════════════════════════
//  LIVE LANGUAGE SYNC
//  Updates all sai-node and open overlay text instantly
//  when the user switches language via the lang switcher.
// ═══════════════════════════════════════════════════════
function applyLangToDOM() {
  // ── Hero node (always in DOM) ──────────────────────
  const node = document.getElementById('sai-node');
  if (node) {
    node.setAttribute('aria-label', t('saiNodeAria'));
    const idEl     = node.querySelector('[data-sai="nodeId"]');
    const ctaEl    = node.querySelector('[data-sai="nodeCta"]');
    const statusEl = node.querySelector('[data-sai="nodeStatus"]');
    if (idEl)     idEl.textContent     = t('saiNodeId');
    if (ctaEl)    ctaEl.textContent    = t('saiNodeCta');
    if (statusEl) statusEl.textContent = _isOpen
      ? t('saiNodeStatusConn')
      : t('saiNodeStatusDormant');
  }

  // ── Open overlay (present only while terminal is open) ─
  const overlay = document.getElementById('sai-overlay');
  if (!overlay) return;

  overlay.setAttribute('aria-label', t('saiOverlayAria'));

  const q = (sel) => overlay.querySelector(`[data-sai="${sel}"]`);

  const closeBtn = q('closeBtn');
  if (closeBtn) closeBtn.textContent = t('saiCloseBtn');

  const closeBtnEl = overlay.querySelector('#sai-close');
  if (closeBtnEl) closeBtnEl.setAttribute('aria-label', t('saiCloseAria'));

  const memStat = q('memStat');
  if (memStat) memStat.textContent = `${t('saiMemStat')} ${NODE_STATUS.memFragments}`;

  const sigStat = q('sigStat');
  if (sigStat) sigStat.textContent = `${t('saiSigStat')} ${t('saiStripSignalVal')}`;

  const keys = [
    ['stripStatus',    'saiStripStatus'],
    ['stripStatusVal', 'saiStripStatusVal'],
    ['stripMemory',    'saiStripMemory'],
    ['stripSignal',    'saiStripSignal'],
    ['stripSignalVal', 'saiStripSignalVal'],
    ['stripConn',      'saiStripConn'],
    ['stripConnVal',   'saiStripConnVal'],
    ['processing',     'saiProcessing'],
    ['sendBtn',        'saiSendBtn'],
  ];
  keys.forEach(([saiKey, tKey]) => {
    const el = q(saiKey);
    if (el) el.textContent = t(tKey);
  });

  const input = overlay.querySelector('#sai-input');
  if (input) input.setAttribute('placeholder', t('saiPlaceholder'));
}

// ═══════════════════════════════════════════════════════
//  HERO NODE INJECTION
// ═══════════════════════════════════════════════════════
export function initSignalAI() {
  const target = document.querySelector('.hero__badges');
  if (!target) {
    console.warn('[SIGNAL_AI] hero__badges element not found');
    return;
  }

  const node = buildNode();

  // Insert after .hero__badges (which is the last child of .hero__content)
  target.insertAdjacentElement('afterend', node);

  // Live language sync — fires whenever user switches EN ↔ UA
  document.addEventListener('retrocore:lang-change', applyLangToDOM);

  console.log(
    '%c SIGNAL_AI v0.1 // NODE DORMANT ',
    'color:#00e5ff;font-family:monospace;letter-spacing:0.12em;font-style:italic;'
  );
}