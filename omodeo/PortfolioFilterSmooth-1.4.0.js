// Omodeo — Portfolio filter/sort crossfade, parallax OFF on the Portfolio grid (Roundable thread 903), replaces PortfolioFilterSmooth 1.3.0
// Webflow registered script id: portfoliofiltersmooth, v1.4.0, Portfolio page footer only.
// Changes vs 1.3.0: parallax is disabled on the Portfolio list cards only (selector needs [fs-list-element="list"], which only the Portfolio page has,
// so Home / About cards keep their parallax). The oversized image (125% high, -15rem margin) is made to simply fill its frame.
// Earlier changes vs 1.2.0: shorter wait before the swap (160ms), longer softer eases (0.7s), the new cards rise in with a
// small stagger (translateY 18px, 55ms apart) while the old snapshot fades out, then everything is cleaned up.
(function () {
  var st = document.createElement('style');
  st.textContent =
    '[fs-list-element="list"] .portfolio-card-item .image-content{position:absolute!important;top:0!important;left:0!important;width:100%!important;height:100%!important;margin:0!important;transform:none!important;object-fit:cover!important}';
  document.head.appendChild(st);
})();
(function () {
  var wrap, list, snap, locked = false, lockT, settleT, cleanT;
  var EASE = 'cubic-bezier(.22,1,.36,1)';
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
  function reset(s) {
    if (s) s.remove();
    wrap.style.transition = '';
    wrap.style.height = '';
    wrap.style.position = '';
    list.style.transition = '';
    list.style.opacity = '';
    Array.prototype.forEach.call(list.children, function (c) {
      c.style.transition = '';
      c.style.opacity = '';
      c.style.transform = '';
    });
  }
  function lock() {
    try {
      if (!wrap && !find()) return;
      clearTimeout(lockT);
      clearTimeout(settleT);
      clearTimeout(cleanT);
      reset(snap);
      snap = null;
      var h0 = wrap.offsetHeight;
      wrap.style.transition = 'none';
      wrap.style.height = h0 + 'px';
      wrap.style.position = 'relative';
      snap = list.cloneNode(true);
      snap.removeAttribute('fs-list-element');
      snap.querySelectorAll('[fs-list-element]').forEach(function (e) { e.removeAttribute('fs-list-element'); });
      snap.setAttribute('aria-hidden', 'true');
      snap.style.cssText += ';position:absolute;top:' + list.offsetTop + 'px;left:' + list.offsetLeft + 'px;width:' + list.offsetWidth + 'px;margin:0;pointer-events:none;z-index:2;opacity:1;transition:none;will-change:opacity';
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
    var items = Array.prototype.slice.call(list.children);
    items.forEach(function (c) {
      c.style.transition = 'none';
      c.style.opacity = '0';
      c.style.transform = 'translateY(18px)';
    });
    list.style.transition = 'none';
    list.style.opacity = '1';
    void wrap.offsetHeight;
    wrap.style.transition = 'height .7s ' + EASE;
    wrap.style.height = h1 + 'px';
    items.forEach(function (c, i) {
      var d = Math.min(i * 55, 440) + 'ms';
      c.style.transition = 'opacity .7s ease ' + d + ', transform .8s ' + EASE + ' ' + d;
      c.style.opacity = '1';
      c.style.transform = 'translateY(0)';
    });
    var s = snap;
    snap = null;
    if (s) { s.style.transition = 'opacity .45s ease'; s.style.opacity = '0'; }
    cleanT = setTimeout(function () {
      reset(s);
      nudge();
    }, 900 + Math.min(items.length * 55, 440));
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
        if (locked) setTimeout(release, 60);
        else setTimeout(nudge, 400);
      }, 160);
    }).observe(list, { childList: true });
  });
})();
