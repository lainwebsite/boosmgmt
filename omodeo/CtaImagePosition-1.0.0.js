// Omodeo — CTA image position (Roundable RB-2.01, thread 608)
// Webflow registered script id: ctaimageposition, v1.0.0, site footer.
// Desktop + tablet (>= 768px): crop the portrait CTA image so the sink and table (about 60-85% down) stay visible.
// Mobile (<= 767px) is untouched; it is handled by ctamobileparallax.
(function () {
  var s = document.createElement('style');
  s.textContent =
    '@media screen and (min-width:768px){.cta-container-inner .image-content.parrallex-anim{object-fit:cover!important;object-position:50% 75%!important}}';
  document.head.appendChild(s);
})();
