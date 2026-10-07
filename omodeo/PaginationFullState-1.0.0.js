// Omodeo — "Our Work" pagination full state (Roundable RB-1.01, thread 591)
// Webflow registered script id: paginationfullstate, v1.0.0, site footer.
// When current === total (last item), total number and divider drop `lower-white` (full white).
// Other items keep the dim state.
(function () {
  function sync() {
    document.querySelectorAll('.hp-ow-bottom-pagination').forEach(function (p) {
      var h = p.querySelectorAll('.heading-style-h2');
      if (h.length < 2) return;
      var total = h[h.length - 1];
      var line = p.querySelector('[class*="hp-ow-line"]');
      var full = h[0].textContent.trim() === total.textContent.trim();
      total.classList.toggle('lower-white', !full);
      if (line) line.classList.toggle('lower-white', !full);
    });
  }
  if (document.readyState === 'complete') sync();
  else window.addEventListener('load', sync);
})();
