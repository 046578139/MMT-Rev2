/* Mobile navigation toggle. Progressive enhancement: with JS off the nav
   markup is still in the document and reachable via the footer links. */
(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  var DESKTOP = window.matchMedia('(min-width: 62rem)');

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Escape closes the menu and returns focus to the button.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Clicking outside closes it.
  document.addEventListener('click', function (e) {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });

  // Resizing up to desktop clears the mobile state so the bar renders normally.
  DESKTOP.addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
})();

/* Highlight today in the hours tables. Resolved in the shop's timezone rather
   than the visitor's, so a traveller still sees the right row marked. */
(function () {
  'use strict';

  var tables = document.querySelectorAll('.hours[data-tz]');
  if (!tables.length) return;

  for (var t = 0; t < tables.length; t++) {
    var today;
    try {
      today = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: tables[t].getAttribute('data-tz')
      }).format(new Date());
    } catch (e) {
      continue; // No Intl or unknown zone: leave it unmarked rather than wrong.
    }

    var rows = tables[t].querySelectorAll('.hours-row[data-day]');
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute('data-day') === today) rows[i].classList.add('is-today');
    }
  }
})();
