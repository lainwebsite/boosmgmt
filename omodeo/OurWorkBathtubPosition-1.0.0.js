// Omodeo — Home "Our Work" bathroom photo (Roundable RB-1.04, thread 615)
// Webflow registered script id: ourworkbathtubposition, v1.0.0, site footer.
// Desktop (>= 992px): crop the portrait bathroom image (.image-reveal-2) so the bathtub (about 65-95% down) stays visible.
(function () {
  var s = document.createElement('style');
  s.textContent =
    '@media screen and (min-width:992px){.ow-stage .image-reveal-2{object-fit:cover!important;object-position:50% 80%!important}}';
  document.head.appendChild(s);
})();
