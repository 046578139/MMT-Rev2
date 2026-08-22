'use strict';

const { site, nav } = require('./content');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline SVG icon set — no icon font, no extra requests. */
const icon = {
  phone:
    '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>',
  pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>',
  clock:
    '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.6V6h-2v7.4l5.2 3.1 1-1.7z"/>',
  tag: '<path d="M21.4 11.6 12.4 2.6A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .6 1.4l9 9a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8zM6.5 8A1.5 1.5 0 1 1 8 6.5 1.5 1.5 0 0 1 6.5 8z"/>',
  check:
    '<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>',
  shield:
    '<path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5zm-1 14-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10z"/>',
  target:
    '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-14a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>',
  book: '<path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h5v8l-2.5-1.5L6 12z"/>',
  user: '<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z"/>',
  hand: '<path d="M13 2a1.5 1.5 0 0 0-1.5 1.5v6h-1v-5a1.5 1.5 0 0 0-3 0v8.2l-1.6-2a1.5 1.5 0 1 0-2.4 1.8l3.6 5A4 4 0 0 0 10.3 22H15a4 4 0 0 0 4-4V7.5a1.5 1.5 0 0 0-3 0v2h-1v-6A1.5 1.5 0 0 0 13 2z"/>',
  arrow: '<path d="M5 12h12.2l-4.6-4.6L14 6l7 7-7 7-1.4-1.4 4.6-4.6H5z"/>',
  facebook:
    '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/>',
  menu: '<path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/>',
  close: '<path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/>',
};

const svg = (name, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icon[name]}</svg>`;

/** Course slug -> icon, used on cards and course headers. */
const courseIcon = {
  'md-hql-class': 'book',
  'md-wear-carry-training': 'shield',
  'md-wear-carry-renewal': 'check',
  'range-safety-officer': 'target',
  'basic-pistol': 'target',
  'basic-rifle': 'target',
  'private-training': 'user',
  'self-defense': 'hand',
};

const fullAddress = () =>
  `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;

function header(current) {
  const links = nav
    .map((n) => {
      const active = n.href === current;
      return `<li><a href="${n.href}"${active ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`;
    })
    .join('');

  return `
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${esc(site.name)} — home">
      <img src="/assets/img/logo-light.png" width="720" height="405" alt="${esc(site.name)}" class="brand-logo">
    </a>

    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
      ${svg('menu', 'nav-toggle-open')}${svg('close', 'nav-toggle-close')}
    </button>

    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul>${links}</ul>
      <a class="btn btn-accent nav-cta" href="tel:${site.phoneHref}">${svg('phone')}<span>${esc(site.phone)}</span></a>
    </nav>
  </div>
</header>`;
}

function footer() {
  const a = site.address;
  return `
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <img src="/assets/img/logo-light.png" width="720" height="405" alt="${esc(site.name)}" loading="lazy">
      <p>${esc(site.tagline)}</p>
      <a class="social" href="${site.facebook}" rel="noopener" aria-label="Mountain Maryland Firearms Training on Facebook">
        ${svg('facebook')}<span>Facebook</span>
      </a>
    </div>

    <div>
      <h2>Courses</h2>
      <ul class="plain">
        <li><a href="/courses/md-hql-class/">Maryland HQL Class</a></li>
        <li><a href="/courses/md-wear-carry-training/">Wear &amp; Carry Training</a></li>
        <li><a href="/courses/md-wear-carry-renewal/">Wear &amp; Carry Renewal</a></li>
        <li><a href="/courses/range-safety-officer/">NRA Range Safety Officer</a></li>
        <li><a href="/courses/">All courses</a></li>
      </ul>
    </div>

    <div>
      <h2>Contact</h2>
      <ul class="plain contact-list">
        <li>${svg('phone')}<a href="tel:${site.phoneHref}">${esc(site.phone)}</a></li>
        <li>${svg('pin')}<address>${esc(a.street)}<br>${esc(a.locality)}, ${esc(a.region)} ${esc(a.postalCode)}</address></li>
      </ul>
      <a class="btn btn-accent" href="/contact/">Get in touch</a>
    </div>
  </div>

  <div class="wrap footer-bottom">
    <p>&copy; ${new Date().getFullYear()} ${esc(site.name)}. All rights reserved.</p>
    <p class="disclaimer">
      Course completion is one requirement among several and does not guarantee that any
      permit or license will be issued. Information on this site is provided for general
      guidance and is not legal advice.
    </p>
  </div>
</footer>`;
}

/**
 * @param {object} o
 * @param {string} o.title      full <title>
 * @param {string} o.description meta description
 * @param {string} o.path       absolute site path, e.g. "/courses/"
 * @param {string} o.body       page markup
 * @param {object[]} [o.schema] JSON-LD objects
 * @param {string} [o.ogImage]  path to social image
 * @param {string} [o.bodyClass]
 */
function page({ title, description, path, body, schema = [], ogImage = '/assets/img/hero-range.jpg', bodyClass = '' }) {
  const url = site.origin + path;
  const jsonLd = schema.length
    ? `<script type="application/ld+json">${JSON.stringify(schema.length === 1 ? schema[0] : schema).replace(/</g, '\\u003c')}</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0f171e">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.origin}${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${site.origin}${ogImage}">

<link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/assets/img/favicon-512.png" sizes="512x512" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap">
<link rel="stylesheet" href="/styles.css">
${jsonLd}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script src="/main.js" defer></script>
</body>
</html>
`;
}

module.exports = { page, esc, svg, courseIcon, fullAddress, header, footer };
