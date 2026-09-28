/* BOSS form dropdown select (registered script bossformdropdown)
   The form uses Webflow Dropdown components; their items are plain "#"
   links, so nothing gets picked or submitted. This turns each one into a
   select: a click shows the choice in the toggle, stores it in a hidden
   input submitted with the form, and closes the list. */
(() => {
  const NAMES = ['Goal', 'Budget Range'];

  const close = (dd) => {
    if (window.jQuery) {
      window.jQuery(dd).triggerHandler('w-close.w-dropdown');
    }

    if (dd.querySelector('.w--open')) {
      dd.querySelector('.w-dropdown-toggle')?.click();
    }
  };

  const init = () => {
    const form = document.querySelector('#email-form');

    if (!form) {
      return;
    }

    form.querySelectorAll('.w-dropdown').forEach((dd, i) => {
      const label = dd.querySelector('.w-dropdown-toggle > div:not(.w-icon-dropdown-toggle)');

      if (!label || dd.dataset.selectReady) {
        return;
      }

      dd.dataset.selectReady = '1';

      const input = document.createElement('input');

      input.type = 'hidden';
      input.name = NAMES[i] || `Dropdown ${i + 1}`;
      dd.appendChild(input);

      const links = dd.querySelectorAll('.w-dropdown-link');

      links.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();

          const value = link.textContent.trim();

          input.value = value;
          label.textContent = value;
          dd.classList.add('is-selected');
          links.forEach((l) => l.classList.toggle('w--current', l === link));

          close(dd);
        });
      });
    });
  };

  window.Webflow = window.Webflow || [];
  window.Webflow.push(init);
})();
