// Omodeo — Portfolio filter empty state (Roundable RB-3.01 thread 592, RB-3.03 thread 595: show as flex to keep centering)
// Webflow registered script id: portfolioemptystate, v1.0.1, site footer (exits early off the Portfolio page).
// Shows the `.empty-filter-state` copy block (Designer: after .portfolio-archive_list-wrapper)
// when the Finsweet-filtered list has no visible items, e.g. "Bathroom Interior" (no bathroom projects yet).
(function () {
  var box = document.querySelector('.empty-filter-state');
  var list = document.querySelector('[fs-list-element="list"]');
  if (!box || !list) return;
  var timer;
  function update() {
    var n = Array.prototype.filter.call(list.children, function (c) {
      return c.style.display !== 'none' && c.offsetParent !== null;
    }).length;
    box.style.display = n ? 'none' : 'flex';
  }
  function queue() {
    clearTimeout(timer);
    timer = setTimeout(update, 300);
  }
  new MutationObserver(queue).observe(list, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  window.addEventListener('load', queue);
})();
