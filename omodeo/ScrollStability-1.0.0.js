// Omodeo — scroll stability on touch devices (jiggle fix)
// Webflow registered script id: scrollstability, v1.0.0, site header.
// 1) Pinned reveal screen uses 100svh (stable) instead of 100dvh (resizes while the URL bar collapses).
// 2) Ignore height-only resize events (URL bar show/hide) so the site's resize handler does not run
//    ScrollTrigger.refresh() in the middle of a scroll. Width changes (rotate, desktop resize) still pass.
(function () {
  var s = document.createElement('style');
  s.textContent =
    '@media screen and (max-width:991px){.ow-stage .ow-stage-screen{height:100svh!important;min-height:100svh!important}}';
  document.head.appendChild(s);
  var w = window.innerWidth;
  window.addEventListener(
    'resize',
    function (e) {
      if (window.innerWidth === w) e.stopImmediatePropagation();
      else w = window.innerWidth;
    },
    true
  );
})();
