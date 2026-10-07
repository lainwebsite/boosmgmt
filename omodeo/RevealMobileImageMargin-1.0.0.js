// Omodeo — reveal images on mobile/tablet (Roundable RB-2.02, thread 617)
// Webflow registered script id: revealmobileimagemargin, v1.0.0, site footer.
// <=991px: the reveal images are positioned with inset:0 / height:100%, but `.image-content.parrallex-anim`
// still carried margin-top:-8rem, so each new image stopped 8rem short and the previous image showed at the bottom.
(function () {
  var s = document.createElement('style');
  s.textContent =
    '@media screen and (max-width:991px){.ow-stage .ow-image-layer>[class*="image-reveal-"]{margin-top:0!important;margin-bottom:0!important}}';
  document.head.appendChild(s);
})();
