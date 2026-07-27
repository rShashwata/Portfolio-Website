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

  const TARGETS = '[data-cursor], a, button';

  // Labelled targets show a pill; plain links/buttons just enlarge the dot;
  // nothing hovered resets both. Written as one function of the current
  // target — never as separate enter/leave side effects — because fast moves
  // and scroll-driven boundary crossings deliver enter(new) BEFORE leave(old).
  // The old code hid the pill only in leave(), and skipped it whenever
  // `hovered` had already moved on, which orphaned the pill on screen.
  const applyState = (el) => {
    const text = el?.getAttribute('data-cursor');
    if (text) {
      label.textContent = text;
      gsap.to(label, { scale: 1, duration: 0.3, ease: 'power3', overwrite: 'auto' });
      gsap.to(dot, { scale: 0, duration: 0.2, overwrite: 'auto' });
    } else {
      gsap.to(label, { scale: 0, duration: 0.25, ease: 'power3', overwrite: 'auto' });
      gsap.to(dot, { scale: el ? 2.6 : 1, duration: 0.25, overwrite: 'auto' });
    }
  };
  const setHovered = (el) => {
    if (el === hovered) return;
    hovered = el;
    applyState(el);
  };

  // A page navigation recreates the dot at 0,0 while the physical pointer
  // hasn't moved at all — it sat in the top-left and flew across on the next
  // mouse move. clientX/Y stay valid across a navigation (same screen, same
  // pointer), so restore the last known position and prime quickTo's start
  // value so nothing tweens in from the corner. Until a position is known the
  // dot stays hidden and the OS cursor is left visible (see global.css), so
  // there's never a moment with no pointer on screen.
  const place = (x, y) => {
    px = x;
    py = y;
    xDot(x, x);
    yDot(y, y);
    xLab(x, x);
    yLab(y, y);
    document.documentElement.setAttribute('data-cursor-ready', '');
  };
  try {
    const saved = sessionStorage.getItem('cursorPos');
    if (saved) {
      const [sx, sy] = saved.split(',').map(Number);
      if (Number.isFinite(sx) && Number.isFinite(sy)) place(sx, sy);
    }
  } catch (e) {
    /* storage blocked — the dot just appears on first move instead */
  }

  window.addEventListener('pointermove', (e) => {
    if (px === null) {
      place(e.clientX, e.clientY); // first move of the session: snap, don't tween
      return;
    }
    px = e.clientX;
    py = e.clientY;
    xDot(px);
    yDot(py);
    xLab(px);
    yLab(py);
  });

  // One write per navigation rather than one per mouse move.
  window.addEventListener('pagehide', () => {
    try {
      if (px !== null) sessionStorage.setItem('cursorPos', px + ',' + py);
    } catch (e) {
      /* storage blocked — nothing to restore next page */
    }
  });

  document.querySelectorAll(TARGETS).forEach((el) => {
    el.addEventListener('pointerenter', () => setHovered(el));
    // Don't trust which element fired — by the next frame any follow-up
    // pointermove has landed, so just re-read what's under the pointer.
    el.addEventListener('pointerleave', () => requestAnimationFrame(recheckHover));
  });

  // Smooth scroll (Lenis) can carry a target out from under a stationary
  // pointer without ever firing pointerenter/pointerleave — those only
  // respond to actual pointer movement, not content moving underneath it —
  // which left the pill/enlarged dot stuck. Re-hit-test the last known
  // pointer position on every scroll tick and correct the state if it drifted.
  function recheckHover() {
    if (px === null) return;
    setHovered(document.elementFromPoint(px, py)?.closest(TARGETS) || null);
  }
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

// ── Hero portrait: cursor-reactive halftone dot render of a photo ────────
function initHalftone() {
  const wrap = document.querySelector('[data-halftone]');
  const canvas = wrap?.querySelector('[data-halftone-canvas]');
  if (!wrap || !canvas) return;
  const src = canvas.getAttribute('data-src');
  if (!src) return;

  const ctx = canvas.getContext('2d');
  const GAP = 5; // target dot pitch in CSS px — smaller = finer, more detailed matrix
  const TOUCH_GAP = 3; // finer pitch on phones/tablets: the box caps at 320px there, so the desktop pitch reads coarse. The touch render is static (no pointer loop), so the extra dots cost nothing per frame.
  const REACH_FACTOR = 0.2; // repel radius as a fraction of the box's smaller side
  const PUSH_FACTOR = 0.18; // max dot displacement as a fraction of the repel radius — kept small for a loose, gentle nudge
  const FADE_START = 0.6; // fraction down the portrait where dots start fading out
  const LERP = 0.15; // per-tick ease factor, matches Lenis's own smoothing feel

  let cells = [];
  let cols = 0;
  let rows = 0;
  let gapX = GAP;
  let gapY = GAP;
  let maxR = GAP * 0.6;
  let boxW = 0;
  let boxH = 0;
  let fg = '#fff';
  const smoothed = { x: 0, y: 0 };
  let strength = 0;
  let targetX = 0;
  let targetY = 0;
  let targetStrength = 0;
  let ticking = false;

  const readFg = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#fff';

  // Downsample the source photo to one averaged pixel per dot cell in a
  // single drawImage call, then cache luminance/alpha once — this is the
  // only per-pixel sampling that ever happens; frames just redraw circles.
  const sampleImage = (img) => {
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const offCtx = off.getContext('2d');
    offCtx.drawImage(img, 0, 0, cols, rows);
    const data = offCtx.getImageData(0, 0, cols, rows).data;
    cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = (r * cols + c) * 4;
        const alpha = data[i + 3] / 255;
        if (alpha < 0.03) continue; // transparent background — no dot at all
        const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
        cells.push({ x: c * gapX + gapX / 2, y: r * gapY + gapY / 2, lum, alpha, baseRadius: 0 });
      }
    }
  };

  // Tone target flips with theme so dots stay readable against --bg either
  // way: dark mode wants light source pixels big (light dots), light mode
  // wants dark source pixels big (dark dots).
  const computeBase = () => {
    const light = document.documentElement.dataset.theme === 'light';
    const fadeFrom = boxH * FADE_START;
    const fadeSpan = boxH - fadeFrom;
    for (const cell of cells) {
      const t = light ? 1 - cell.lum : cell.lum;
      // Vertical falloff: dots thin out toward the bottom of the portrait so it
      // dissolves into the page instead of ending on a hard edge.
      let fade = 1;
      if (fadeSpan > 0 && cell.y > fadeFrom) {
        const f = (cell.y - fadeFrom) / fadeSpan; // 0 at fadeFrom → 1 at the bottom
        fade = 1 - f * f; // eased: full for a while, then falls away quickly
      }
      cell.baseRadius = maxR * Math.sqrt(t) * cell.alpha * fade;
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, boxW, boxH);
    const dots = new Path2D();
    // Dot size stays fixed (it encodes the photo's tone); only position moves.
    // Cells within `reach` of the cursor are pushed radially away from it,
    // strongest at the centre and easing to nothing at the edge, opening a
    // bubble that the dots flow around.
    const reach = Math.min(boxW, boxH) * REACH_FACTOR;
    const maxPush = reach * PUSH_FACTOR;
    for (const cell of cells) {
      const r = cell.baseRadius;
      if (r < 0.35) continue;
      let px = cell.x;
      let py = cell.y;
      if (strength > 0.001) {
        const dx = cell.x - smoothed.x;
        const dy = cell.y - smoothed.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < reach && dist > 0.001) {
          const t = 1 - dist / reach;
          const force = t * t * maxPush * strength; // squared falloff = soft edge, firm centre
          px += (dx / dist) * force;
          py += (dy / dist) * force;
        }
      }
      dots.moveTo(px + r, py);
      dots.arc(px, py, r, 0, Math.PI * 2);
    }
    ctx.fillStyle = fg;
    ctx.fill(dots);
  };

  const rebuild = (img) => {
    const rect = wrap.getBoundingClientRect();
    boxW = rect.width;
    boxH = rect.height;
    if (!boxW || !boxH) return;
    const gap = isTouch ? TOUCH_GAP : GAP;
    cols = Math.max(1, Math.round(boxW / gap));
    rows = Math.max(1, Math.round(boxH / gap));
    gapX = boxW / cols;
    gapY = boxH / rows;
    maxR = Math.min(gapX, gapY) * 0.6;
    // Allow the full pixel ratio (up to 3) on touch so the finer, smaller dots
    // stay crisp on high-DPI phones; desktop stays capped at 2.
    const dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 3 : 2);
    canvas.width = boxW * dpr;
    canvas.height = boxH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sampleImage(img);
    fg = readFg();
    computeBase();
    draw();
  };

  const img = new Image();
  img.src = src;
  const onReady = () => {
    if (!img.naturalWidth || !img.naturalHeight) return; // image missing/failed to load
    wrap.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    rebuild(img);

    // Canvas pixels don't follow the CSS cascade — watch the theme
    // attribute directly and recompute the tone target + recolor on flip.
    new MutationObserver(() => {
      fg = readFg();
      computeBase();
      draw();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let resizeTimer = null;
    new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => rebuild(img), 150);
    }).observe(wrap);

    if (isTouch || reduceMotion) return; // static portrait only, no pointer loop

    const tick = () => {
      smoothed.x += (targetX - smoothed.x) * LERP;
      smoothed.y += (targetY - smoothed.y) * LERP;
      strength += (targetStrength - strength) * LERP;
      draw();
      if (targetStrength === 0 && strength < 0.002) {
        strength = 0;
        draw();
        gsap.ticker.remove(tick);
        ticking = false;
      }
    };
    const startTicker = () => {
      if (ticking) return;
      ticking = true;
      gsap.ticker.add(tick);
    };
    const setTarget = (e) => {
      const rect = wrap.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetStrength = 1;
      startTicker();
    };
    wrap.addEventListener('pointerenter', (e) => {
      // Snap the smoothed point to the entry position so dots repel from where
      // the cursor actually is, not swooshing in from a stale off-screen point.
      const rect = wrap.getBoundingClientRect();
      smoothed.x = e.clientX - rect.left;
      smoothed.y = e.clientY - rect.top;
      setTarget(e);
    });
    wrap.addEventListener('pointermove', setTarget);
    wrap.addEventListener('pointerleave', () => {
      targetStrength = 0;
      startTicker();
    });
  };
  if (typeof img.decode === 'function') {
    img.decode().then(onReady).catch(onReady);
  } else {
    img.onload = onReady;
  }
}

// ── Hero role rotator: slot-machine vertical scroll through the crafts ───
function initRoleRotator() {
  const list = document.querySelector('[data-rotator-list]');
  if (!list) return;
  const words = Array.from(list.children); // roles + 1 trailing duplicate
  const total = words.length;
  const real = total - 1;
  if (real < 2) return;
  const stepPct = 100 / total; // one word as a % of the list's height

  // The rotator box is as wide as its widest word, so a fixed-width underline
  // overshoots shorter words. Measure each word's rendered text width (a Range
  // over the text node, not the block, which would just give the box width)
  // and resize the underline to match, animating it in step with each rotation.
  const underline = document.querySelector('.hero__underline');
  const textWidth = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect().width;
  };
  // Those widths are pixels, so anything that changes the text's metrics after
  // they're taken leaves the underline sized for the wrong word: the webfont
  // swapping in over the fallback (the usual one — the role size is only
  // measured once the preloader finishes, which on a cold cache beats the font
  // there), or the vw-driven role size changing on resize or rotation. So
  // re-measure and rebuild rather than baking the first reading in for good.
  let tl = null;
  let last = '';
  const build = () => {
    const widths = words.map(textWidth);
    if (!widths[0]) return;
    // Mobile browsers fire resize whenever the URL bar hides or shows; without
    // this the rotation would reset its phase mid-scroll every time.
    const key = widths.join();
    if (key === last) return;
    last = key;

    const progress = tl ? tl.progress() : 0;
    tl?.kill();
    tl = null;
    gsap.set(list, { yPercent: 0 });
    if (underline) gsap.set(underline, { width: widths[0] });
    if (reduceMotion) return; // show the first role only

    tl = gsap.timeline({ repeat: -1 });
    for (let i = 1; i <= real; i++) {
      tl.to(list, { yPercent: -stepPct * i, duration: 0.6, ease: 'power3.inOut' }, '+=1.8');
      if (underline) tl.to(underline, { width: widths[i], duration: 0.6, ease: 'power3.inOut' }, '<');
    }
    tl.set(list, { yPercent: 0 }); // snap back on the duplicate (visually identical)
    if (underline) tl.set(underline, { width: widths[0] });
    tl.progress(progress); // resume where the old cycle was, not from the top
  };

  build();
  document.fonts?.ready.then(build);
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
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
  const entries = [];
  document.querySelectorAll('[data-work-row]').forEach((row) => {
    const accent = row.getAttribute('data-accent');
    if (accent) row.style.setProperty('--row-accent', accent);
    if (isTouch) return;

    const thumb = row.querySelector('[data-work-thumb]');
    if (!thumb) return;
    const xTo = gsap.quickTo(thumb, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(thumb, 'y', { duration: 0.5, ease: 'power3' });

    let shown = false;
    const show = (x, y) => {
      if (!shown) {
        shown = true;
        // Snap to the cursor before revealing so it scales up in place
        // instead of easing in from a stale position. The second arg sets
        // quickTo's start value too, so later moves don't drift from it.
        xTo(x, x);
        yTo(y, y);
        gsap.to(thumb, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3', overwrite: 'auto' });
        return;
      }
      xTo(x);
      yTo(y);
    };
    const hide = () => {
      if (!shown) return;
      shown = false;
      gsap.to(thumb, { opacity: 0, scale: 0.85, duration: 0.35, ease: 'power3', overwrite: 'auto' });
    };

    row.addEventListener('pointerenter', (e) => show(e.clientX, e.clientY));
    row.addEventListener('pointermove', (e) => show(e.clientX, e.clientY));
    row.addEventListener('pointerleave', hide);
    entries.push({ row, show, hide });
  });

  if (!entries.length || !lenis) return;

  // Smooth scroll slides rows beneath a stationary cursor without reliably
  // firing pointerenter/pointerleave, which used to leave a thumbnail frozen
  // mid-screen. Re-resolve what the cursor is actually over on each scroll
  // frame: blanket-hiding instead fought pointermove and made the thumbnail
  // flicker whenever a row scrolled under a moving cursor.
  let px = 0;
  let py = 0;
  let havePointer = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      px = e.clientX;
      py = e.clientY;
      havePointer = true;
    },
    { passive: true }
  );

  lenis.on('scroll', () => {
    if (!havePointer) return;
    // The thumb is pointer-events:none, so it can't shadow the row here.
    const row = document.elementFromPoint(px, py)?.closest('[data-work-row]');
    entries.forEach((entry) => (entry.row === row ? entry.show(px, py) : entry.hide()));
  });
}

// ── Marquees: seamless loop + scroll-velocity speed/skew ─────────────────
function initMarquees() {
  const marquees = [];
  document.querySelectorAll('[data-marquee]').forEach((m) => {
    const track = m.querySelector('[data-marquee-track]');
    const seed = track?.firstElementChild;
    if (!seed) return;
    const reverse = m.getAttribute('data-reverse') === 'true';
    const entry = { track };

    // One cycle shifts the track left by exactly one group, so the groups
    // still on screen when the cycle ends must span the container. With only
    // the two copies Astro renders, a group narrower than the viewport runs
    // out and bare track shows at the right. Clone the seed until (n - 1)
    // groups cover the width, and shift by 100/n so the loop stays seamless.
    let count = 0;
    entry.build = () => {
      const groupW = seed.getBoundingClientRect().width;
      if (!groupW) return;
      const need = Math.max(2, Math.ceil(m.clientWidth / groupW) + 1);
      if (need === count) return;
      count = need;
      while (track.children.length > need) track.lastElementChild.remove();
      while (track.children.length < need) track.appendChild(seed.cloneNode(true));
      const shift = 100 / need;
      const progress = entry.tween ? entry.tween.progress() : 0;
      entry.tween?.kill();
      entry.tween = gsap
        .fromTo(
          track,
          { xPercent: reverse ? -shift : 0 },
          { xPercent: reverse ? 0 : -shift, duration: 24, ease: 'none', repeat: -1 }
        )
        .progress(progress);
      if (reduceMotion) entry.tween.pause();
    };

    entry.build();
    // Webfonts landing late make the group wider than first measured, so
    // re-run once they're ready.
    document.fonts?.ready.then(entry.build);
    marquees.push(entry);
  });
  if (!marquees.length) return;

  // The item font-size caps at 3rem, so past that width a wider viewport needs
  // more copies to stay covered.
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => marquees.forEach((e) => e.build()), 200);
  });
  if (reduceMotion) return;

  // Feed Lenis velocity into the loop speed + a subtle skew.
  if (lenis) {
    lenis.on('scroll', ({ velocity }) => {
      const v = clamp(velocity, -40, 40);
      const scale = 1 + Math.abs(v) * 0.08;
      marquees.forEach(({ track, tween }) => {
        tween?.timeScale(scale); // absent until the group measures non-zero
        gsap.to(track, { skewX: clamp(-v * 0.4, -12, 12), duration: 0.4, overwrite: 'auto' });
      });
    });
    // Settle the skew when scrolling stops.
    ScrollTrigger.addEventListener('scrollEnd', () =>
      marquees.forEach(({ track, tween }) => {
        tween?.timeScale(1);
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
    initHalftone();
    initRoleRotator();
    initDrawnMarks();
    initReveals();
    initAbout();
    initWork();
    initMarquees();
    ScrollTrigger.refresh();
  };

  // `data-preload="skip"` is set before paint in /theme-init.js when this
  // session has already seen the loading screen (i.e. we got here from an
  // internal link rather than a fresh load or a refresh).
  const skip = document.documentElement.dataset.preload === 'skip';

  if (!pre || reduceMotion || skip) {
    if (pre) pre.style.display = 'none';
    start();
    return;
  }

  // Only mark it as seen once it genuinely plays, so a visitor who lands on a
  // case study first still gets it when they reach the home page.
  try {
    sessionStorage.setItem('preloaded', '1');
  } catch (e) {
    /* storage blocked — it just plays every time */
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

// ── Fragment landing: jump before the page is revealed ───────────────────
// theme-init.js hides <body> when the URL has a fragment, because the browser
// paints the top of the page before resolving the target. Position the page
// here, then release it, so the hero is never seen on the way to #work.
function settleHashJump() {
  const html = document.documentElement;
  if (!html.dataset.jump) return;
  try {
    const target = document.querySelector(window.location.hash);
    if (target) {
      const y = Math.round(target.getBoundingClientRect().top + window.scrollY);
      window.scrollTo(0, y);
      // Lenis caches its own scroll value on init; without this it eases back.
      if (lenis) lenis.scrollTo(y, { immediate: true });
    }
  } catch (e) {
    /* hash isn't a valid selector — just reveal the page as-is */
  }
  delete html.dataset.jump;
}

// ── Boot ─────────────────────────────────────────────────────────────────
function init() {
  initSmoothScroll();
  // Straight after Lenis exists (it owns the scroll position) and before the
  // filters change the page height.
  settleHashJump();
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
