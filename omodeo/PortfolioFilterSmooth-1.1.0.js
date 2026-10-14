// Omodeo — Portfolio filter/sort smoothing (Roundable thread 903), replaces PortfolioFilterParallaxRefresh 1.0.1
// Webflow registered script id: portfoliofiltersmooth, v1.1.0, Portfolio page footer only.
// 1) On filter/sort change: freeze the list wrapper height before Finsweet re-renders, so the page never collapses/jumps.
// 2) After the list settles: animate the wrapper height to the new natural height (0.5s), then release to auto.
// 3) Re-send scroll so the Webflow parallax recalculates (observes childList only, no loop with parallax styles).
(function () {
  var wrap, list, lockT, settleT;
  function find() {
    list = document.querySelector('[fs-list-element="list"]');
    wrap = list && (list.closest('[fs-list-element="wrapper"]') || list.parentElement);
    return !!wrap;
  }
  function nudge() {
    requestAnimationFrame(function () {
      window.dispatchEvent(new Event('scroll'));
      if (window.ScrollTrigger && ScrollTrigger.update) ScrollTrigger.update();
    });
  }
  function lock() {
    if (!wrap && !find()) return;
    clearTimeout(lockT);
    wrap.style.transition = 'none';
    wrap.style.height = wrap.offsetHeight + 'px';
    lockT = setTimeout(release, 1800);
  }
  function release() {
    clearTimeout(lockT);
    if (!wrap || !wrap.style.height) return;
    var h0 = parseFloat(wrap.style.height);
    wrap.style.height = 'auto';
    var h1 = wrap.offsetHeight;
    wrap.style.height = h0 + 'px';
    void wrap.offsetHeight;
    wrap.style.transition = 'height .5s cubic-bezier(.22,1,.36,1)';
    wrap.style.height = h1 + 'px';
    setTimeout(function () {
      wrap.style.transition = '';
      wrap.style.height = '';
      nudge();
    }, 560);
  }
  document.addEventListener(
    'change',
    function (e) {
      if (e.target && e.target.closest && e.target.closest('[fs-list-element="filters"]')) lock();
    },
    true
  );
  window.addEventListener('load', function () {
    if (!find()) return;
    new MutationObserver(function () {
      clearTimeout(settleT);
      settleT = setTimeout(function () {
        if (wrap.style.height) release();
        else {
          nudge();
          setTimeout(nudge, 400);
        }
      }, 350);
    }).observe(list, { childList: true });
  });
})();
