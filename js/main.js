/* RETROCORE://HUB — main.js (ES6 Module) */

'use strict';

// ═══════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════
const PARTICLE_COUNT   = 55;
const PARTICLE_BASE_SPEED = 0.18;
const SCROLL_THRESHOLD = 40;

// ═══════════════════════════════════════════════════════
//  PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════
class ParticleSystem {
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.particles = [];
    this.raf     = null;
    this.running = false;

    this._resize = this._resize.bind(this);
    this._tick   = this._tick.bind(this);
  }

  init() {
    this._resize();
    window.addEventListener('resize', this._resize, { passive: true });
    this._populate();
    this.running = true;
    this._tick();
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._resize);
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width  = window.innerWidth  * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width  = window.innerWidth  + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(dpr, dpr);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
  }

  _populate() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this.particles.push(this._createParticle(true));
    }
  }

  _createParticle(randomY = false) {
    const types = ['dot', 'cross', 'diamond'];
    const type  = types[Math.floor(Math.random() * types.length)];
    return {
      x:       Math.random() * this.w,
      y:       randomY ? Math.random() * this.h : this.h + 10,
      size:    Math.random() * 1.6 + 0.4,
      speed:   Math.random() * PARTICLE_BASE_SPEED + 0.06,
      drift:   (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.45 + 0.08,
      life:    0,
      maxLife: Math.random() * 0.6 + 0.4,
      type,
      hue:     Math.random() > 0.8
        ? `rgba(0, 201, 167,`
        : `rgba(0, 229, 255,`,
    };
  }

  _drawParticle(p) {
    const { ctx } = this;
    ctx.save();
    ctx.globalAlpha = p.opacity * Math.sin(Math.PI * p.life / p.maxLife);
    ctx.fillStyle   = `${p.hue}${p.opacity})`;
    ctx.strokeStyle = `${p.hue}${p.opacity * 0.6})`;
    ctx.shadowColor = p.hue.includes('201') ? '#00c9a7' : '#00e5ff';
    ctx.shadowBlur  = 6;

    ctx.translate(p.x, p.y);

    if (p.type === 'cross') {
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(-p.size * 2, 0);
      ctx.lineTo(p.size * 2, 0);
      ctx.moveTo(0, -p.size * 2);
      ctx.lineTo(0, p.size * 2);
      ctx.stroke();
    } else if (p.type === 'diamond') {
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.5);
      ctx.lineTo(p.size * 1.5, 0);
      ctx.lineTo(0, p.size * 1.5);
      ctx.lineTo(-p.size * 1.5, 0);
      ctx.closePath();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _tick() {
    if (!this.running) return;

    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.y    -= p.speed;
      p.x    += p.drift;
      p.life += p.speed * 0.004;

      if (p.life >= p.maxLife || p.y < -20) {
        this.particles[i] = this._createParticle(false);
        continue;
      }

      this._drawParticle(p);
    }

    this.raf = requestAnimationFrame(this._tick);
  }
}

// ═══════════════════════════════════════════════════════
//  HEADER SCROLL BEHAVIOR
// ═══════════════════════════════════════════════════════
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastY = 0;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    if (y > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastY   = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════
//  LANGUAGE SWITCHER
// ═══════════════════════════════════════════════════════
function initLangSwitcher() {
  const btns = document.querySelectorAll('.lang-btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const lang = btn.dataset.lang;
      document.documentElement.lang = lang || 'en';

      // Emit custom event for future i18n module
      document.dispatchEvent(new CustomEvent('retrocore:lang', {
        detail: { lang },
        bubbles: true
      }));
    });
  });
}

// ═══════════════════════════════════════════════════════
//  MOBILE MENU
// ═══════════════════════════════════════════════════════
function initMobileMenu() {
  const toggle  = document.querySelector('.header__menu-toggle');
  const mobileNav = document.querySelector('.header__mobile-nav');
  if (!toggle || !mobileNav) return;

  function closeMenu() {
    toggle.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════
//  VHS TIMESTAMP
// ═══════════════════════════════════════════════════════
function initVHSTimestamp() {
  const stamp = document.querySelector('.hero__vhs-stamp');
  if (!stamp) return;

  function fmt(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now = new Date();
    const h = fmt(now.getHours());
    const m = fmt(now.getMinutes());
    const s = fmt(now.getSeconds());
    const day  = fmt(now.getDate());
    const mon  = fmt(now.getMonth() + 1);
    const year = now.getFullYear();
    stamp.textContent = `${h}:${m}:${s}  ${day}/${mon}/${year}`;
  }

  tick();
  setInterval(tick, 1000);
}

// ═══════════════════════════════════════════════════════
//  CURSOR GLOW (desktop)
// ═══════════════════════════════════════════════════════
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const el = document.createElement('div');
  el.className = 'cursor-glow';
  Object.assign(el.style, {
    position:      'fixed',
    pointerEvents: 'none',
    width:         '280px',
    height:        '280px',
    borderRadius:  '50%',
    background:    'radial-gradient(circle, rgba(0,229,255,0.035) 0%, transparent 70%)',
    transform:     'translate(-50%, -50%)',
    zIndex:        '9',
    transition:    'opacity 0.4s ease',
    opacity:       '0',
  });
  document.body.appendChild(el);

  let mouseX = 0, mouseY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    el.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    el.style.opacity = '0';
  });

  function follow() {
    el.style.left = mouseX + 'px';
    el.style.top  = mouseY + 'px';
    raf = requestAnimationFrame(follow);
  }
  follow();
}

// ═══════════════════════════════════════════════════════
//  SCROLL HINT CLICK
// ═══════════════════════════════════════════════════════
function initScrollHint() {
  const hint = document.querySelector('.hero__scroll-hint');
  if (!hint) return;

  hint.addEventListener('click', () => {
    const next = document.querySelector('main > section:nth-child(2)');
    const target = next || document.querySelector('footer');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  });
}

// ═══════════════════════════════════════════════════════
//  BOOT SEQUENCE
// ═══════════════════════════════════════════════════════
function boot() {
  // Particles
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ps = new ParticleSystem(canvas);
    ps.init();
  }

  initHeaderScroll();
  initLangSwitcher();
  initMobileMenu();
  initVHSTimestamp();
  initCursorGlow();
  initScrollHint();
  initModules();

  // Register CTA
  const registerBtns = document.querySelectorAll('.btn-register');
  registerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('[RETROCORE] → register intent');
      document.dispatchEvent(new CustomEvent('retrocore:register', { bubbles: true }));
    });
  });

  console.log(
    '%c RETROCORE://HUB  ',
    'background:#00e5ff;color:#020408;font-family:monospace;font-weight:bold;padding:4px 10px;letter-spacing:0.2em;'
  );
  console.log(
    '%c v0.1.0  FOUNDATION LOADED ',
    'color:#00c9a7;font-family:monospace;letter-spacing:0.12em;'
  );
}

// ─ Entry point ─
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// ═══════════════════════════════════════════════════════
//  ACTIVE MODULES — scroll reveal + interactions
// ═══════════════════════════════════════════════════════
function initModules() {
  // ── Intersection Observer for section intro ────────
  const introObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      introObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.12 });

  const intro = document.querySelector('.modules__intro');
  if (intro) introObserver.observe(intro);

  // ── Observe separator ──────────────────────────────
  const sep = document.querySelector('.modules__separator');
  if (sep) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.3 }).observe(sep);
  }

  // ── Staggered card reveal ──────────────────────────
  const cards = document.querySelectorAll('.mod-card');
  cards.forEach((card, i) => {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          entry.target.classList.add('in-view');
          // override nth-child delay now that JS has fired
          entry.target.style.animationDelay = `${i * 0.11}s, 1.1s`;
        }, i * 85);
        cardObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    cardObserver.observe(card);
  });

  // ── Click guard for disabled (coming-soon) card ────
  document.querySelectorAll('.mod-card--disabled').forEach(card => {
    card.addEventListener('click', e => e.preventDefault());
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
    });
  });

  // ── Subtle magnetic tilt (desktop pointer only) ────
  if (!window.matchMedia('(pointer: coarse)').matches) {
    cards.forEach(card => {
      if (card.classList.contains('mod-card--disabled')) return;

      card.addEventListener('mousemove', (e) => {
        const r   = card.getBoundingClientRect();
        const dx  = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const dy  = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        card.style.transform  = `translateY(-5px) scale(1.012) rotateX(${dy * -3.5}deg) rotateY(${dx * 3.5}deg)`;
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = 'transform var(--dur-slow) var(--ease-out-expo)';
      });
    });
  }

  // ── Module launch telemetry event ──────────────────
  cards.forEach(card => {
    if (card.classList.contains('mod-card--disabled')) return;
    card.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('retrocore:module-launch', {
        detail: { href: card.getAttribute('href') },
        bubbles: true,
      }));
    });
  });

  console.log(
    '%c v0.2.0  MODULES LOADED ',
    'color:#a259ff;font-family:monospace;letter-spacing:0.12em;'
  );
}

// ── Wire initModules into boot (patch boot call) ──────
const _origBoot = boot;
// Re-declare boot to include modules (hoisting-safe IIFE patch)
(function patchBoot() {
  const origBoot = window.__retroBoot || boot;
  document.addEventListener('DOMContentLoaded', () => {
    initModules();
  }, { once: true });

  // if DOM already loaded (module runs after parse)
  if (document.readyState !== 'loading') {
    initModules();
  }
}());

// ═══════════════════════════════════════════════════════
//  PHASE 3 — INCOMING SIGNALS + FOOTER
// ═══════════════════════════════════════════════════════

// ── Signals scroll reveal ──────────────────────────────
function initSignals() {
  const rowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      rowObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

  // Section intro
  const intro = document.querySelector('.signals__intro');
  if (intro) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); }
      });
    }, { threshold: 0.15 }).observe(intro);
  }

  // Signal rows — staggered
  const rows = document.querySelectorAll('.sig-row');
  rows.forEach((row, i) => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        setTimeout(() => {
          e.target.classList.add('in-view');
          e.target.style.animationDelay = `${i * 0.14}s, ${1 + i * 0.14}s`;
        }, i * 110);
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });
    obs.observe(row);
  });

  // Animate progress fill widths via JS for cross-browser support
  rows.forEach(row => {
    const fill = row.querySelector('.sig-row__progress-fill');
    const pctVal = row.querySelector('.sig-row__pct-val');
    if (!fill) return;

    const target = parseFloat(fill.style.getPropertyValue('--prog-target') || '0');

    // Watch when fill becomes visible
    const fillObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        // Animate counter
        let start = null;
        const duration = 3000;
        function step(ts) {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          fill.style.width = (ease * target) + '%';
          if (pctVal) pctVal.textContent = Math.round(ease * target) + '%';
          if (progress < 1) requestAnimationFrame(step);
        }
        // delay matches row stagger
        setTimeout(() => requestAnimationFrame(step), 700);
        fillObs.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    fillObs.observe(row);
  });
}

// ── Footer VHS timestamp ───────────────────────────────
function initFooterTimestamp() {
  const el = document.getElementById('footer-timestamp');
  if (!el) return;

  function fmt(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const d = new Date();
    // Fictional 2089 year overlay — keep hh:mm:ss real, year is theatrical
    el.textContent =
      `${fmt(d.getHours())}:${fmt(d.getMinutes())}:${fmt(d.getSeconds())}  ` +
      `${fmt(d.getDate())}/${fmt(d.getMonth() + 1)}/2089`;
  }

  tick();
  setInterval(tick, 1000);
}

// ── Wire into DOMContentLoaded ─────────────────────────
(function initPhase3() {
  function run() {
    initSignals();
    initFooterTimestamp();
    console.log(
      '%c v0.3.0  LOWER SECTIONS LOADED ',
      'color:#00c9a7;font-family:monospace;letter-spacing:0.12em;'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}());