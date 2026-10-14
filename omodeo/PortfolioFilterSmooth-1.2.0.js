// Omodeo — Portfolio filter/sort crossfade (Roundable thread 903), replaces PortfolioFilterSmooth 1.1.0
// Webflow registered script id: portfoliofiltersmooth, v1.2.0, Portfolio page footer only.
// Screen recording showed the grid hard-cutting in one frame. Now:
// 1) On a filter/sort change, a visual snapshot of the current list is laid over it and its height is frozen.
// 2) Finsweet re-renders the real list underneath (hidden). When it settles, parallax is re-synced,
//    the wrapper height animates to the new height and the snapshot crossfades into the new list (0.5s).
// Observes childList only (no loop with parallax styles). Safety timer restores everything if no render happens.
(function () {
  var wrap, list, snap, locked = false, lockT, settleT;
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
    try {
      if (!wrap && !find()) return;
      clearTimeout(lockT);
      clearTimeout(settleT);
      if (snap) { snap.remove(); snap = null; }
      var h0 = wrap.offsetHeight;
      wrap.style.transition = 'none';
      wrap.style.height = h0 + 'px';
      wrap.style.position = 'relative';
      snap = list.cloneNode(true);
      snap.removeAttribute('fs-list-element');
      snap.querySelectorAll('[fs-list-element]').forEach(function (e) { e.removeAttribute('fs-list-element'); });
      snap.setAttribute('aria-hidden', 'true');
      snap.style.cssText += ';position:absolute;top:' + list.offsetTop + 'px;left:' + list.offsetLeft + 'px;width:' + list.offsetWidth + 'px;margin:0;pointer-events:none;z-index:2;opacity:1;transition:none';
      wrap.appendChild(snap);
      list.style.transition = 'none';
      list.style.opacity = '0';
      locked = true;
      lockT = setTimeout(release, 1500);
    } catch (err) {
      locked = false;
    }
  }
  function release() {
    clearTimeout(lockT);
    if (!locked) return;
    locked = false;
    var h0 = parseFloat(wrap.style.height) || wrap.offsetHeight;
    wrap.style.height = 'auto';
    var h1 = wrap.offsetHeight;
    wrap.style.height = h0 + 'px';
    void wrap.offsetHeight;
    wrap.style.transition = 'height .5s cubic-bezier(.22,1,.36,1)';
    wrap.style.height = h1 + 'px';
    list.style.transition = 'opacity .5s ease';
    list.style.opacity = '1';
    var s = snap;
    snap = null;
    if (s) { s.style.transition = 'opacity .5s ease'; s.style.opacity = '0'; }
    setTimeout(function () {
      if (s) s.remove();
      wrap.style.transition = '';
      wrap.style.height = '';
      wrap.style.position = '';
      list.style.transition = '';
      list.style.opacity = '';
      nudge();
    }, 580);
  }
  document.addEventListener('change', function (e) {
    if (e.target && e.target.closest && e.target.closest('[fs-list-element="filters"]')) lock();
  }, true);
  window.addEventListener('load', function () {
    if (!find()) return;
    new MutationObserver(function () {
      clearTimeout(settleT);
      settleT = setTimeout(function () {
        nudge();
        if (locked) setTimeout(release, 80);
        else setTimeout(nudge, 400);
      }, 300);
    }).observe(list, { childList: true });
  });
})();
