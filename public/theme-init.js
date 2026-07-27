document.documentElement.classList.add('js');
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
    }
    document.documentElement.dataset.theme = t;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();

// Decide BEFORE paint whether the loading screen should run, so it never
// flashes on its way out. It plays on the first visit of a browser session
// and on every refresh; arriving back via an internal link (Index / Home)
// skips it. main.js sets the flag once the animation has actually played.
(function () {
  try {
    var entry = performance.getEntriesByType('navigation')[0];
    var reloaded = entry ? entry.type === 'reload' : false;
    if (!reloaded && sessionStorage.getItem('preloaded') === '1') {
      document.documentElement.dataset.preload = 'skip';
    }
  } catch (e) {
    /* no sessionStorage / no timing API — fall through and let it play */
  }
})();

// Arriving on a fragment (e.g. /#work from a case study's Index link) paints
// the TOP of the page first, then jumps once the browser has resolved the
// target — a visible flash of the hero. Flag it before paint so CSS can hold
// the page back until main.js has positioned it.
(function () {
  if (!window.location.hash || window.location.hash.length < 2) return;
  var html = document.documentElement;
  html.dataset.jump = '1';
  // Safety net: never leave the page invisible if the bundle fails to load.
  window.setTimeout(function () {
    delete html.dataset.jump;
  }, 1000);
})();
