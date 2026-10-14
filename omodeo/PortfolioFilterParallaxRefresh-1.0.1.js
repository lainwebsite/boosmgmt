// Omodeo — Portfolio filter image jump experiment (Roundable thread 903)
// Webflow registered script id: portfoliofilterparallaxrefresh, v1.0.1, Portfolio page footer only.
// After Finsweet re-renders the list (filter change), re-send scroll so Webflow parallax recalculates.
// Observes childList only (observing style attributes would loop with the parallax itself).
(function () {
  function nudge() {
    requestAnimationFrame(function () {
      window.dispatchEvent(new Event('scroll'));
      if (window.ScrollTrigger && ScrollTrigger.update) ScrollTrigger.update();
    });
  }
  function run() {
    nudge();
    setTimeout(nudge, 350);
    setTimeout(nudge, 700);
  }
  window.addEventListener('load', function () {
    var l = document.querySelector('[fs-list-element="list"]');
    if (!l) return;
    var t;
    new MutationObserver(function () {
      clearTimeout(t);
      t = setTimeout(run, 120);
    }).observe(l, { childList: true });
  });
})();
