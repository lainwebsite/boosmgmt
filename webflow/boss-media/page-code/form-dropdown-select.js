/* BOSS form dropdown select (registered script bossformdropdown)
   The form uses Webflow Dropdown components; their items are plain "#"
   links, so nothing gets picked or submitted. This turns each one into a
   select: a tap shows the choice in the toggle, stores it in a hidden
   input submitted with the form, and closes the list.

   v1.1: on iPhone the list closed (pointer-events: none) before the tap's
   click arrived, so the pick is taken on pointerup, by tap position, and
   click is only a fallback (mouse / keyboard). */
(() => {
  const NAMES = ['Goal', 'Budget Range'];

  let lastPick = 0;

  let down = null;

  const close = (dd) => {
    if (window.jQuery) {
      window.jQuery(dd).triggerHandler('w-close.w-dropdown');
    }

    if (dd.querySelector('.w--open')) {
      dd.querySelector('.w-dropdown-toggle')?.click();
    }
  };

  const pick = (link) => {
    const dd = link.closest('.w-dropdown');

    if (!dd || !dd._select) {
      return;
    }

    const { input, label, links } = dd._select;

    const value = link.textContent.trim();

    input.value = value;
    label.textContent = value;
    dd.classList.add('is-selected');
    links.forEach((l) => l.classList.toggle('w--current', l === link));

    lastPick = Date.now();

    close(dd);
  };

  /* The option under a point, in any open list of the form */
  const linkAt = (form, x, y) => {
    for (const link of form.querySelectorAll('.w-dropdown-list.w--open .w-dropdown-link')) {
      const r = link.getBoundingClientRect();

      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return link;
      }
    }

    return null;
  };

  const init = () => {
    const form = document.querySelector('#email-form');

    if (!form || form.dataset.selectReady) {
      return;
    }

    form.dataset.selectReady = '1';

    form.querySelectorAll('.w-dropdown').forEach((dd, i) => {
      const label = dd.querySelector('.w-dropdown-toggle > div:not(.w-icon-dropdown-toggle)');

      if (!label) {
        return;
      }

      const input = document.createElement('input');

      input.type = 'hidden';
      input.name = NAMES[i] || `Dropdown ${i + 1}`;
      dd.appendChild(input);

      dd._select = {
        input,
        label,
        links: dd.querySelectorAll('.w-dropdown-link'),
      };
    });

    document.addEventListener(
      'pointerdown',
      (event) => {
        const link = linkAt(form, event.clientX, event.clientY);

        down = link ? { link, x: event.clientX, y: event.clientY } : null;
      },
      true,
    );

    document.addEventListener(
      'pointerup',
      (event) => {
        if (!down) {
          return;
        }

        const { link, x, y } = down;

        down = null;

        /* A drag is a scroll, not a pick */
        if (Math.abs(event.clientX - x) > 10 || Math.abs(event.clientY - y) > 10) {
          return;
        }

        pick(link);
      },
      true,
    );

    /* Stop the tap's late mouse events and click from landing on the
       field under the closed list */
    document.addEventListener(
      'touchend',
      (event) => {
        if (Date.now() - lastPick < 100 && event.cancelable) {
          event.preventDefault();
        }
      },
      {
        capture: true,
        passive: false,
      },
    );

    document.addEventListener(
      'click',
      (event) => {
        const link = event.target.closest?.('#email-form .w-dropdown-link');

        if (!link) {
          /* Ghost click of a tap that already picked */
          if (Date.now() - lastPick < 600) {
            event.preventDefault();
            event.stopPropagation();
          }

          return;
        }

        event.preventDefault();

        if (Date.now() - lastPick > 600) {
          pick(link);
        }
      },
      true,
    );
  };

  window.Webflow = window.Webflow || [];
  window.Webflow.push(init);
})();
