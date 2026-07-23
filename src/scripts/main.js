// ============================================================
//  Motion controller — GSAP + ScrollTrigger + Lenis smooth scroll.
//  Loaded once from Layout.astro. Everything is feature-detected
//  and respects prefers-reduced-motion.
// ============================================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// ── Small helper: split an element's text into masked, animatable chars ──
function splitChars(el) {
  const text = el.textContent.trim();
  el.textContent = '';
  el.style.display = 'block';
  el.style.overflow = 'hidden';
  el.style.paddingBottom = '0.06em';
  const chars = [];
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'split-char';
    span.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(span);
    chars.push(span);
  }
  return chars;
}

// ── Lenis smooth scroll, synced to GSAP's ticker & ScrollTrigger ─────────
let lenis = null;
function initSmoothScroll() {
  if (reduceMotion) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // In-page anchor links → smooth scroll via Lenis.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    });
  });
}

// ── Frosted-glass nav once scrolled past the top ─────────────────────────
function initScrolledNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;
  const threshold = 40;
  const update = (y) => nav.classList.toggle('is-scrolled', y > threshold);
  if (lenis) {
    lenis.on('scroll', ({ scroll }) => update(scroll));
  } else {
    window.addEventListener('scroll', () => update(window.scrollY), { passive: true });
  }
  update(window.scrollY || 0);
}

// ── Theme toggle (initial theme is set inline in <head> to avoid a flash) ──
function initTheme() {
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  if (!toggles.length) return;
  const apply = (t) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem('theme', t);
    } catch (e) {
      /* storage blocked — theme still applies for this session */
    }
  };
  toggles.forEach((btn) =>
    btn.addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
      apply(cur === 'light' ? 'dark' : 'light');
    })
  );
}

// ── Work category filter ──────────────────────────────────────────────────
function initFilters() {
  const buttons = document.querySelectorAll('[data-filter]');
  const rows = gsap.utils.toArray('[data-work-row]');
  if (!buttons.length || !rows.length) return;
  let active = 'recent';

  const applyFilter = (key, animate = true) => {
    active = key;
    // "Recent" (home) shows only the first 3 projects (DOM order = order in
    // site.js); "All" (gallery) shows everything; every other tab matches on
    // data-cat.
    let shown = 0;
    rows.forEach((row) => {
      const match =
        key === 'recent'
          ? shown < 3
          : key === 'all'
            ? true
            : row.getAttribute('data-cat') === key;
      row.hidden = !match;
      if (match) shown += 1;
    });
    if (animate && !reduceMotion) {
      // Animate the inner link, not the row: a transform on the row would
      // make it the containing block for its position:fixed thumbnail,
      // offsetting the preview from the cursor for the tween's duration.
      const links = rows
        .filter((r) => !r.hidden)
        .map((r) => r.querySelector('.work__link'));
      gsap.fromTo(
        links,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out', overwrite: true }
      );
    }
    ScrollTrigger.refresh();
  };

  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-filter');
      if (key === active) return;
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
      applyFilter(key);
    })
  );

  // Boot from whichever tab is active in the markup ("Recent" on the home
  // page, "All" on the gallery) without a fade — the rows are far down the
  // page and shouldn't animate before they're scrolled into view.
  const initial = document.querySelector('[data-filter].is-active') || buttons[0];
  applyFilter(initial.getAttribute('data-filter'), false);
}

// ── Custom cursor: a dot that trails the pointer + a contextual label ────
function initCursor() {
  if (isTouch) return;
  const dot = document.querySelector('.cursor');
  const label = document.querySelector('.cursor__label');
  if (!dot || !label) return;

  const xDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
  const yDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
  const xLab = gsap.quickTo(label, 'x', { duration: 0.4, ease: 'power3' });
  const yLab = gsap.quickTo(label, 'y', { duration: 0.4, ease: 'power3' });

  let px = null;
  let py = null;
  let hovered = null;

  // Labelled targets show a pill; plain links/buttons just enlarge the dot.
  const enter = (el) => {
    hovered = el;
    const text = el.getAttribute('data-cursor');
    if (text) {
      label.textContent = text;
      gsap.to(label, { scale: 1, duration: 0.3, ease: 'power3' });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    } else {
      gsap.to(dot, { scale: 2.6, duration: 0.25 });
    }
  };
  const leave = (el) => {
    if (hovered !== el) return;
    hovered = null;
    if (el.getAttribute('data-cursor')) {
      gsap.to(label, { scale: 0, duration: 0.25, ease: 'power3' });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    } else {
      gsap.to(dot, { scale: 1, duration: 0.25 });
    }
  };

  window.addEventListener('pointermove', (e) => {
    px = e.clientX;
    py = e.clientY;
    xDot(px);
    yDot(py);
    xLab(px);
    yLab(py);
  });

  document
    .querySelectorAll('[data-cursor], a:not([data-cursor]), button:not([data-cursor])')
    .forEach((el) => {
      el.addEventListener('pointerenter', () => enter(el));
      el.addEventListener('pointerleave', () => leave(el));
    });

  // Smooth scroll (Lenis) can carry a target out from under a stationary
  // pointer without ever firing pointerenter/pointerleave — those only
  // respond to actual pointer movement, not content moving underneath it —
  // which left the pill/enlarged dot stuck. Re-hit-test the last known
  // pointer position on every scroll tick and correct the state if it drifted.
  const recheckHover = () => {
    if (px === null) return;
    const el = document.elementFromPoint(px, py)?.closest('[data-cursor], a, button');
    if (el === hovered) return;
    if (hovered) leave(hovered);
    if (el) enter(el);
  };
  if (lenis) lenis.on('scroll', recheckHover);
  else window.addEventListener('scroll', recheckHover, { passive: true });
}

// ── Magnetic buttons: inner content leans toward the cursor ──────────────
function initMagnetic() {
  if (isTouch || reduceMotion) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    const inner = el.querySelector('.magnetic__inner') || el;
    const strength = 0.4;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      gsap.to(el, { x, y, duration: 0.4, ease: 'power3' });
      gsap.to(inner, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: 'power3' });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to([el, inner], { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

// ── Hero entrance (called after the preloader clears) ────────────────────
function revealHero() {
  const heroLines = document.querySelectorAll('[data-hero] [data-split]');
  const fades = document.querySelectorAll('[data-hero] [data-hero-fade]');
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  heroLines.forEach((line) => {
    const chars = splitChars(line);
    tl.from(
      chars,
      { yPercent: 110, duration: 1, stagger: 0.03 },
      heroLines.length > 1 ? '-=0.85' : 0
    );
  });

  tl.from(fades, { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.6');
  gsap.set(fades, { opacity: 1 }); // ensure visible if reduced motion skipped tween
}

// ── Hero role rotator: slot-machine vertical scroll through the crafts ───
function initRoleRotator() {
  const list = document.querySelector('[data-rotator-list]');
  if (!list) return;
  const total = list.children.length; // roles + 1 trailing duplicate
  const real = total - 1;
  if (real < 2) return;
  const stepPct = 100 / total; // one word as a % of the list's height
  gsap.set(list, { yPercent: 0 });
  if (reduceMotion) return; // show the first role only
  const tl = gsap.timeline({ repeat: -1 });
  for (let i = 1; i <= real; i++) {
    tl.to(list, { yPercent: -stepPct * i, duration: 0.6, ease: 'power3.inOut' }, '+=1.8');
  }
  tl.set(list, { yPercent: 0 }); // snap back on the duplicate (visually identical)
}

// ── Hand-drawn SVG marks: animate the stroke "drawing" itself in ─────────
function initDrawnMarks() {
  document.querySelectorAll('[data-draw]').forEach((path) => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: reduceMotion ? 0 : len });
    if (reduceMotion) return;
    gsap.to(path, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', delay: 0.5 });
  });
}

// ── Generic [data-reveal] fade-up, batched for performance ───────────────
function initReveals() {
  if (reduceMotion) {
    gsap.set('[data-reveal]', { opacity: 1, y: 0 });
    return;
  }
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        overwrite: true,
      }),
  });
  gsap.set('[data-reveal]', { y: 30 });
}

// ── About: statement words rise as the section scrolls into view ─────────
function initAbout() {
  const words = document.querySelectorAll('[data-about-word]');
  if (!words.length) return;
  if (reduceMotion) {
    gsap.set(words, { yPercent: 0 });
    return;
  }
  gsap.from(words, {
    yPercent: 110,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.02,
    scrollTrigger: { trigger: '[data-about]', start: 'top 70%' },
  });
}

// ── Work rows: cursor-following thumbnail + accent tint ──────────────────
function initWork() {
  const hiders = [];
  document.querySelectorAll('[data-work-row]').forEach((row) => {
    const accent = row.getAttribute('data-accent');
    if (accent) row.style.setProperty('--row-accent', accent);
    if (isTouch) return;

    const thumb = row.querySelector('[data-work-thumb]');
    if (!thumb) return;
    const xTo = gsap.quickTo(thumb, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(thumb, 'y', { duration: 0.5, ease: 'power3' });

    let shown = false;
    const show = (e) => {
      if (!shown) {
        shown = true;
        // Snap to the cursor before revealing so it scales up in place
        // instead of easing in from a stale position. The second arg sets
        // quickTo's start value too, so later moves don't drift from it.
        xTo(e.clientX, e.clientX);
        yTo(e.clientY, e.clientY);
        gsap.to(thumb, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3', overwrite: 'auto' });
        return;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const hide = () => {
      if (!shown) return;
      shown = false;
      gsap.to(thumb, { opacity: 0, scale: 0.85, duration: 0.35, ease: 'power3', overwrite: 'auto' });
    };

    row.addEventListener('pointerenter', show);
    row.addEventListener('pointermove', show);
    row.addEventListener('pointerleave', hide);
    hiders.push(hide);
  });

  // Smooth scroll slides rows beneath a stationary cursor without reliably
  // firing pointerleave, which left thumbnails frozen mid-screen. Hide them
  // all on scroll; pointermove re-shows the one actually under the cursor.
  if (hiders.length && lenis) {
    lenis.on('scroll', () => hiders.forEach((hide) => hide()));
  }
}

// ── Marquees: seamless loop + scroll-velocity speed/skew ─────────────────
function initMarquees() {
  const marquees = [];
  document.querySelectorAll('[data-marquee]').forEach((m) => {
    const track = m.querySelector('[data-marquee-track]');
    if (!track) return;
    const reverse = m.getAttribute('data-reverse') === 'true';
    const tween = gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: 24, ease: 'none', repeat: -1 }
    );
    marquees.push({ track, tween });
  });
  if (!marquees.length || reduceMotion) {
    if (reduceMotion) marquees.forEach((m) => m.tween.pause());
    return;
  }

  // Feed Lenis velocity into the loop speed + a subtle skew.
  if (lenis) {
    lenis.on('scroll', ({ velocity }) => {
      const v = clamp(velocity, -40, 40);
      const scale = 1 + Math.abs(v) * 0.08;
      marquees.forEach(({ track, tween }) => {
        tween.timeScale(scale);
        gsap.to(track, { skewX: clamp(-v * 0.4, -12, 12), duration: 0.4, overwrite: 'auto' });
      });
    });
    // Settle the skew when scrolling stops.
    ScrollTrigger.addEventListener('scrollEnd', () =>
      marquees.forEach(({ track, tween }) => {
        tween.timeScale(1);
        gsap.to(track, { skewX: 0, duration: 0.5 });
      })
    );
  }
}

// ── Preloader → hand off to hero, then build everything else ─────────────
function runPreloader() {
  const pre = document.querySelector('[data-preloader]');
  const countEl = document.querySelector('[data-preload-count]');
  const barEl = document.querySelector('[data-preload-bar]');

  const start = () => {
    revealHero();
    initRoleRotator();
    initDrawnMarks();
    initReveals();
    initAbout();
    initWork();
    initMarquees();
    ScrollTrigger.refresh();
  };

  if (!pre || reduceMotion) {
    if (pre) pre.style.display = 'none';
    start();
    return;
  }

  const counter = { v: 0 };
  const tl = gsap.timeline();
  tl.to(counter, {
    v: 100,
    duration: 1.6,
    ease: 'power2.inOut',
    onUpdate: () => {
      const n = Math.round(counter.v);
      if (countEl) countEl.textContent = n;
      if (barEl) barEl.style.width = n + '%';
    },
  })
    .to(pre, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '+=0.2')
    .add(start, '-=0.5')
    .set(pre, { display: 'none' });
}

// ── Boot ─────────────────────────────────────────────────────────────────
function init() {
  initSmoothScroll();
  initScrolledNav();
  initTheme();
  initCursor();
  initMagnetic();
  initFilters();
  runPreloader();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
