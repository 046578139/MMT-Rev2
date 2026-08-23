#!/usr/bin/env node
'use strict';

/**
 * Static site generator for mountainmdft.com. No dependencies — `node build.js`
 * reads src/content.js and writes a complete, deployable site to dist/.
 */

const fs = require('fs');
const path = require('path');

const { site, nav, courses, faqs, instructor, photos, retail, brands } = require('./src/content');
const { page, esc, svg, courseIcon, fullAddress, hoursTable } = require('./src/layout');

const DIST = path.join(__dirname, 'dist');
const PUBLIC = path.join(__dirname, 'public');

/* ------------------------------------------------------------------ utils */

function write(relPath, contents) {
  const file = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

/** Write an HTML page at a clean URL: "/faq/" -> dist/faq/index.html */
function writePage(urlPath, html) {
  const rel = urlPath === '/' ? 'index.html' : path.join(urlPath.replace(/^\/|\/$/g, ''), 'index.html');
  write(rel, html);
  return urlPath;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

const urls = [];
const track = (p, priority, changefreq = 'monthly') => {
  urls.push({ loc: site.origin + p, priority, changefreq });
  return p;
};

/* --------------------------------------------------------------- partials */

/** Read intrinsic dimensions from a JPEG's SOF marker — no dependency, and it
 *  keeps width/height honest when a photo is swapped for one of another shape. */
function jpegSize(file) {
  const b = fs.readFileSync(file);
  let i = 2; // skip SOI
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    // SOF0-SOF15, excluding DHT (c4), JPG (c8) and DAC (cc)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error('No SOF marker in ' + file);
}

const IMG_DIR = path.join(PUBLIC, 'assets', 'img');
const hasPhoto = (name) => fs.existsSync(path.join(IMG_DIR, name + '.jpg'));

/** First candidate that is actually on disk, or null. Lets a better photo take
 *  over a slot the moment it is added, with no code change. */
const pickPhoto = (...candidates) => candidates.find(hasPhoto) || null;

/**
 * Responsive <picture> for our webp + jpg pairs. Alt text and real dimensions
 * are looked up rather than passed in. Returns '' for a slot with no file, so a
 * not-yet-supplied photo degrades to nothing instead of a broken image.
 */
function picture(name, { cls = '', loading = 'lazy', sizes, fetchpriority, alt } = {}) {
  if (!name || !hasPhoto(name)) return '';
  const { width, height } = jpegSize(path.join(IMG_DIR, name + '.jpg'));
  const meta = photos[name] || {};
  const text = alt || meta.alt || '';
  if (!text) throw new Error(`No alt text for photo "${name}" — add it to photos in src/content.js`);

  const attrs = [
    `src="/assets/img/${name}.jpg"`,
    `alt="${esc(text)}"`,
    `width="${width}"`,
    `height="${height}"`,
    meta.position ? `style="object-position:${meta.position}"` : '',
    `loading="${loading}"`,
    loading === 'eager' ? 'decoding="sync"' : 'decoding="async"',
    fetchpriority ? `fetchpriority="${fetchpriority}"` : '',
    sizes ? `sizes="${sizes}"` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return `<picture${cls ? ` class="${cls}"` : ''}>
  <source srcset="/assets/img/${name}.webp" type="image/webp">
  <img ${attrs}>
</picture>`;
}

/** Headline shop services — leads the shop page, above the stock list. */
function serviceStrip() {
  return `<ul class="services plain">
${retail.services
  .map(
    (sv) => `  <li class="service">
    <div class="service-icon">${svg(sv.icon)}</div>
    <h2>${esc(sv.name)}</h2>
    <p>${esc(sv.body)}</p>
  </li>`
  )
  .join('\n')}
</ul>`;
}

/** Retail categories as a spec-sheet grid. */
function retailGrid() {
  return `<div class="grid grid-3 kit">
${retail.categories
  .map(
    (c) => `  <article class="kit-item">
    <div class="kit-icon">${svg(c.icon)}</div>
    <h3>${esc(c.name)}</h3>
    <p>${esc(c.body)}</p>
  </article>`
  )
  .join('\n')}
</div>`;
}

/**
 * Brand strip. A brand renders as a text wordmark until a logo file is dropped at
 * public/assets/img/brands/<slug>.(svg|png), at which point the logo takes over.
 * Returns '' when no brands are listed, so nothing empty is published.
 */
function brandStrip() {
  if (!brands.length) return '';
  const items = brands
    .map((b) => {
      const svgPath = path.join(IMG_DIR, 'brands', b.slug + '.svg');
      const pngPath = path.join(IMG_DIR, 'brands', b.slug + '.png');
      const file = fs.existsSync(svgPath) ? `${b.slug}.svg` : fs.existsSync(pngPath) ? `${b.slug}.png` : null;
      return file
        ? `<li><img src="/assets/img/brands/${file}" alt="${esc(b.name)}" loading="lazy"></li>`
        : `<li><span class="brand-word">${esc(b.name)}</span></li>`;
    })
    .join('\n      ');
  return `
<section class="section brands-section">
  <div class="wrap">
    <h2 class="brands-head">Brands we carry</h2>
    <ul class="brand-strip plain">
      ${items}
    </ul>
  </div>
</section>`;
}

function courseCard(c) {
  return `<article class="card">
  <div class="card-icon">${svg(courseIcon[c.slug])}</div>
  <div class="card-body">
    ${c.badge ? `<p class="badge">${esc(c.badge)}</p>` : ''}
    <h3><a href="/courses/${c.slug}/">${esc(c.title)}</a></h3>
    <p>${esc(c.short)}</p>
    <ul class="meta plain">
      <li>${svg('tag')}${esc(c.price)}</li>
      <li>${svg('clock')}${esc(c.length)}</li>
    </ul>
  </div>
  <a class="card-link" href="/courses/${c.slug}/" tabindex="-1" aria-hidden="true">Details ${svg('arrow')}</a>
</article>`;
}

function ctaBand(heading = 'Ready to book your class?', sub) {
  return `<section class="band">
  <div class="wrap band-inner">
    <div>
      <h2>${esc(heading)}</h2>
      <p>${esc(sub || `Call ${site.phone} to check upcoming dates, ask about pricing, or arrange a private session.`)}</p>
    </div>
    <div class="band-actions">
      <a class="btn btn-accent btn-lg" href="tel:${site.phoneHref}">${svg('phone')}<span>${esc(site.phone)}</span></a>
      <a class="btn btn-ghost btn-lg" href="/contact/">Send a message</a>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------ JSON-LD data */

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': site.origin + '/#business',
  name: site.name,
  description: site.description,
  url: site.origin,
  telephone: site.phone,
  image: site.origin + '/assets/img/logo.png',
  logo: site.origin + '/assets/img/logo.png',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  openingHoursSpecification: site.hours
    .filter((h) => !h.closed)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.opens,
      closes: h.closes,
    })),
  areaServed: site.areaServed.map((a) => ({ '@type': 'Place', name: a })),
  sameAs: [site.facebook],
  founder: { '@type': 'Person', name: instructor.name },
};

const breadcrumbs = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.label,
    item: site.origin + t.href,
  })),
});

/* -------------------------------------------------------------- home page */

function buildHome() {
  const featured = courses.filter((c) => c.featured);
  const rest = courses.filter((c) => !c.featured);

  const body = `
<section class="hero">
  ${picture('hero-range', {
    cls: 'hero-bg',
    loading: 'eager',
    fetchpriority: 'high',
  })}
  <div class="wrap hero-inner">
    <p class="eyebrow">Frostburg, Maryland &middot; Allegany County</p>
    <h1>Maryland firearms training from a retired State Trooper.</h1>
    <p class="lede">
      HQL, Wear &amp; Carry, and NRA certification courses taught by a Maryland State Police
      Qualified Handgun Instructor with 30+ years carrying a firearm for a living.
    </p>
    <div class="hero-actions">
      <a class="btn btn-accent btn-lg" href="/courses/">See courses &amp; pricing</a>
      <a class="btn btn-ghost btn-lg" href="tel:${site.phoneHref}">${svg('phone')}<span>${esc(site.phone)}</span></a>
    </div>
    <ul class="trust plain">
      <li>${svg('check')}MSP Qualified Handgun Instructor</li>
      <li>${svg('check')}NRA Certified Instructor &amp; RSO</li>
      <li>${svg('check')}Loaner firearms available</li>
    </ul>
  </div>
</section>

<section class="wrap section">
  <div class="section-head">
    <h2>Which class do you need?</h2>
    <p>Most people come to us for one of these three. If you are not sure which applies to
      you, call and we will point you the right way — there is no charge for a question.</p>
  </div>
  <div class="grid grid-3">${featured.map(courseCard).join('\n')}</div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head">
      <h2>Also offered</h2>
      <p>Certification courses, private instruction, and empty-hand self defense.</p>
    </div>
    <div class="grid grid-3">${rest.map(courseCard).join('\n')}</div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="split split-reverse">
      <div class="split-media">
        ${picture(pickPhoto('gun-wall', 'shop-interior'), { cls: 'framed' })}
      </div>
      <div class="split-body">
        <p class="eyebrow">${esc(retail.eyebrow)}</p>
        <h2>${esc(retail.title)}</h2>
        <p>${esc(retail.lede)}</p>
        <ul class="ticks plain">
          ${retail.categories.slice(0, 4).map((c) => `<li>${svg('check')}<strong>${esc(c.name)}</strong></li>`).join('\n          ')}
        </ul>
        <p class="service-line">${retail.services.map((sv) => esc(sv.name)).join(' &middot; ')}</p>
        <a class="btn btn-outline" href="/shop/">See what we carry ${svg('arrow')}</a>
      </div>
    </div>
  </div>
</section>

<section class="wrap section">
  <div class="split">
    <div class="split-media">
      ${picture('deployment')}
    </div>
    <div class="split-body">
      <p class="eyebrow">Your instructor</p>
      <h2>${esc(instructor.name)}</h2>
      <p>${esc(instructor.intro)}</p>
      <ul class="ticks plain">
        ${instructor.credentials.slice(0, 5).map((c) => `<li>${svg('check')}${esc(c)}</li>`).join('\n')}
      </ul>
      <a class="btn btn-outline" href="/instructor/">Read John’s background ${svg('arrow')}</a>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="split split-reverse">
      <div class="split-media">
        ${picture('checklist', { cls: 'framed' })}
      </div>
      <div class="split-body">
        <p class="eyebrow">Wear &amp; Carry</p>
        <h2>Five steps to a Maryland carry permit</h2>
        <ol class="steps">
          <li><strong>Sign up</strong> for the Wear &amp; Carry class.</li>
          <li><strong>Complete 16 hours</strong> of mandatory classroom training — included in the class.</li>
          <li><strong>Pass live-fire qualification</strong> — included in the class.</li>
          <li><strong>Get LiveScan fingerprints</strong> — done onsite.</li>
          <li><strong>Apply</strong> online through the Maryland State Police.</li>
        </ol>
        <a class="btn btn-outline" href="/courses/md-wear-carry-training/">Wear &amp; Carry details ${svg('arrow')}</a>
      </div>
    </div>
  </div>
</section>

${ctaBand()}
`;

  writePage(
    track('/', '1.0', 'weekly'),
    page({
      title: `Maryland HQL & Wear and Carry Classes — Frostburg, MD`,
      description: site.description,
      path: '/',
      body,
      bodyClass: 'home',
      schema: [
        localBusiness,
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: site.name,
          url: site.origin,
        },
      ],
    })
  );
}

/* ---------------------------------------------------------- courses index */

function buildCourseIndex() {
  const body = `
<section class="page-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <span aria-current="page">Courses</span></nav>
    <h1>Courses &amp; pricing</h1>
    <p class="lede">Every class below is taught in Frostburg by ${esc(instructor.name)}. Dates are
      scheduled regularly and on demand — call ${esc(site.phone)} for the next available session.</p>
  </div>
</section>

<section class="wrap section">
  <h2 class="sr-only">Maryland licensing courses</h2>
  <div class="grid grid-3">${courses.filter((c) => c.featured).map(courseCard).join('\n')}</div>

  <h2 class="section-divider">Certification, private &amp; self defense</h2>
  <div class="grid grid-3">${courses.filter((c) => !c.featured).map(courseCard).join('\n')}</div>
</section>

${ctaBand('Not sure which class you need?')}
`;

  writePage(
    track('/courses/', '0.9', 'monthly'),
    page({
      title: `Firearms Courses & Pricing — ${site.name}`,
      description:
        'Maryland HQL, Wear & Carry, Wear & Carry renewal, NRA Range Safety Officer, basic ' +
        'pistol and rifle, private lessons, and self defense classes in Frostburg, MD.',
      path: '/courses/',
      schema: [
        breadcrumbs([
          { label: 'Home', href: '/' },
          { label: 'Courses', href: '/courses/' },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: courses.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.fullTitle,
            url: `${site.origin}/courses/${c.slug}/`,
          })),
        },
      ],
      body,
    })
  );
}

/* --------------------------------------------------------- course details */

function buildCourse(c) {
  const sections = (c.sections || [])
    .map(
      (s) => `<section class="prose-block">
  <h2>${esc(s.heading)}</h2>
  ${s.body ? `<p>${s.body}</p>` : ''}
  ${s.list ? `<ul class="ticks plain">${s.list.map((i) => `<li>${svg('check')}${i}</li>`).join('')}</ul>` : ''}
</section>`
    )
    .join('\n');

  const notes = (c.notes || []).length
    ? `<aside class="callout" role="note">
  <h2>Please note</h2>
  <ul class="plain">${c.notes.map((n) => `<li>${n}</li>`).join('')}</ul>
</aside>`
    : '';

  const related = courses
    .filter((x) => x.slug !== c.slug)
    .slice(0, 3)
    .map(courseCard)
    .join('\n');

  const body = `
<section class="page-head course-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> <span>/</span> <a href="/courses/">Courses</a> <span>/</span>
      <span aria-current="page">${esc(c.title)}</span>
    </nav>
    <div class="course-head-inner">
      <div class="course-head-icon">${svg(courseIcon[c.slug])}</div>
      <div>
        <h1>${esc(c.fullTitle)}</h1>
        <p class="lede">${esc(c.intro)}</p>
      </div>
    </div>
    <dl class="facts">
      <div><dt>${svg('tag')}Cost</dt><dd>${esc(c.price)}${c.priceValue ? ' per person' : ''}</dd></div>
      <div><dt>${svg('clock')}Length</dt><dd>${esc(c.length)}</dd></div>
      <div><dt>${svg('user')}Prerequisites</dt><dd>${esc(c.prereq)}</dd></div>
    </dl>
    <div class="hero-actions">
      <a class="btn btn-accent btn-lg" href="tel:${site.phoneHref}">${svg('phone')}<span>Call to book — ${esc(site.phone)}</span></a>
      <a class="btn btn-ghost btn-lg" href="/contact/">Ask a question</a>
    </div>
  </div>
</section>

<div class="wrap section course-body">
  <div class="prose">
    ${sections}
    ${notes}
    ${c.photo && hasPhoto(c.photo) ? `<figure class="figure figure-wide">${picture(c.photo)}<figcaption>${esc(c.photoCaption || '')}</figcaption></figure>` : ''}
    ${c.checklist ? `<figure class="figure">${picture('checklist', { cls: 'framed' })}<figcaption>The five steps from signing up to submitting your application.</figcaption></figure>` : ''}
  </div>
</div>

<section class="section section-alt">
  <div class="wrap">
    <h2 class="section-divider">Other courses</h2>
    <div class="grid grid-3">${related}</div>
  </div>
</section>

${ctaBand()}
`;

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: c.fullTitle,
    description: c.intro,
    url: `${site.origin}/courses/${c.slug}/`,
    provider: { '@type': 'LocalBusiness', name: site.name, '@id': site.origin + '/#business' },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      courseWorkload: c.length,
      location: {
        '@type': 'Place',
        name: site.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.street,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
        },
      },
    },
  };

  if (c.priceValue) {
    courseSchema.offers = {
      '@type': 'Offer',
      price: c.priceValue,
      priceCurrency: 'USD',
      category: 'Training',
      availability: 'https://schema.org/InStock',
      url: `${site.origin}/courses/${c.slug}/`,
    };
  }

  writePage(
    track(`/courses/${c.slug}/`, c.featured ? '0.9' : '0.7'),
    page({
      title: c.metaTitle,
      description: c.metaDescription,
      path: `/courses/${c.slug}/`,
      body,
      schema: [
        courseSchema,
        breadcrumbs([
          { label: 'Home', href: '/' },
          { label: 'Courses', href: '/courses/' },
          { label: c.title, href: `/courses/${c.slug}/` },
        ]),
      ],
    })
  );
}

/* -------------------------------------------------------------- shop page */

function buildShop() {
  const shopPhotos = ['shop-interior', 'gun-wall'].filter(hasPhoto);

  const body = `
<section class="page-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <span aria-current="page">The Shop</span></nav>
    <p class="eyebrow">${esc(retail.eyebrow)}</p>
    <h1>${esc(retail.title)}</h1>
    <p class="lede">${esc(retail.lede)}</p>
    <div class="hero-actions">
      <a class="btn btn-accent btn-lg" href="tel:${site.phoneHref}">${svg('phone')}<span>Check stock — ${esc(site.phone)}</span></a>
      <a class="btn btn-ghost btn-lg" href="/contact/">Find us</a>
    </div>
  </div>
</section>

<section class="wrap section services-section">
  <h2 class="sr-only">Shop services</h2>
  ${serviceStrip()}
</section>

<section class="wrap section section-tight">
  <div class="section-head">
    <h2>What's on the counter</h2>
    <p>Stock changes week to week. If you do not see it, ask — most things can be ordered.</p>
  </div>
  ${retailGrid()}
  <aside class="callout" role="note">
    <h2>Before you drive out</h2>
    <ul class="plain"><li>${retail.note}</li></ul>
  </aside>
</section>

${
  shopPhotos.length
    ? `<section class="section section-alt">
  <div class="wrap">
    <div class="section-head"><h2>Inside the shop</h2></div>
    <div class="grid grid-${shopPhotos.length}">
      ${shopPhotos.map((n) => `<figure class="shop-shot">${picture(n, { cls: 'framed' })}</figure>`).join('\n      ')}
    </div>
  </div>
</section>`
    : ''
}

<section class="wrap section">
  <div class="split">
    <div class="split-body">
      <p class="eyebrow">NFA</p>
      <h2>Suppressors and SBRs</h2>
      <p>${esc(retail.nfaNote)}</p>
      <a class="btn btn-outline" href="/contact/">Ask about an NFA item ${svg('arrow')}</a>
    </div>
    <div class="split-media">${picture('gun-wall', { cls: 'framed' })}</div>
  </div>
</section>
${brandStrip()}
${ctaBand('Stop in, or call ahead', `The shop is at ${fullAddress()}. Call ${site.phone} to check stock or ask about an order.`)}
`;

  writePage(
    track('/shop/', '0.9'),
    page({
      title: 'Gun Shop in Frostburg, MD — Sales, Trades & Transfers',
      description:
        'Buy, sell, trade and consign firearms, FFL gun transfers, and on-site sales in ' +
        'Frostburg, MD. Pistols, rifles, SBRs, NFA items and suppressors.',
      path: '/shop/',
      ogImage: '/assets/img/shop-interior.jpg',
      body,
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: site.name,
          '@id': site.origin + '/#business',
          url: site.origin + '/shop/',
          telephone: site.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: site.address.street,
            addressLocality: site.address.locality,
            addressRegion: site.address.region,
            postalCode: site.address.postalCode,
            addressCountry: site.address.country,
          },
          makesOffer: retail.services.map((sv) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: sv.name, description: sv.body },
          })),
          department: {
            '@type': 'Store',
            name: 'Firearms retail',
            makesOffer: retail.categories.map((c) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Product', name: c.name, description: c.body },
            })),
          },
        },
        breadcrumbs([
          { label: 'Home', href: '/' },
          { label: 'The Shop', href: '/shop/' },
        ]),
      ],
    })
  );
}

/* ------------------------------------------------------------- instructor */

function buildInstructor() {
  const body = `
<section class="page-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <span aria-current="page">Your Instructor</span></nav>
    <h1>Meet your instructor</h1>
    <p class="lede">${esc(instructor.role)}, ${esc(site.name)}</p>
  </div>
</section>

<div class="wrap section">
  <div class="split">
    <div class="split-media stack-media">
      ${picture('trooper', { cls: 'framed' })}
      ${picture('deployment', { cls: 'framed' })}
    </div>
    <div class="split-body prose">
      <h2>${esc(instructor.name)}</h2>
      <p class="lede">${esc(instructor.intro)}</p>
      ${instructor.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n')}
    </div>
  </div>
</div>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head">
      <h2>Certifications &amp; credentials</h2>
      <p>Every course here is taught by someone who has carried a firearm professionally,
        in uniform and overseas.</p>
    </div>
    <ul class="ticks ticks-grid plain">
      ${instructor.credentials.map((c) => `<li>${svg('check')}${esc(c)}</li>`).join('\n')}
    </ul>
  </div>
</section>

${ctaBand('Train with John')}
`;

  writePage(
    track('/instructor/', '0.8'),
    page({
      title: `${instructor.name} — Instructor, ${site.name}`,
      description:
        `${instructor.name} — retired Maryland State Police Trooper, Air Force veteran, and MSP ` +
        'Qualified Handgun Instructor teaching firearms courses in Frostburg, MD.',
      path: '/instructor/',
      ogImage: '/assets/img/trooper.jpg',
      body,
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: instructor.name,
          jobTitle: instructor.role,
          worksFor: { '@type': 'LocalBusiness', name: site.name, '@id': site.origin + '/#business' },
          knowsAbout: ['Firearms training', 'Maryland firearms law', 'Range safety', 'Hapkido'],
          url: site.origin + '/instructor/',
        },
        breadcrumbs([
          { label: 'Home', href: '/' },
          { label: 'Your Instructor', href: '/instructor/' },
        ]),
      ],
    })
  );
}

/* -------------------------------------------------------------------- FAQ */

function buildFaq() {
  const items = faqs
    .map(
      (f, i) => `<details class="faq-item"${i === 0 ? ' open' : ''}>
  <summary><span>${esc(f.q)}</span></summary>
  <div class="faq-answer"><p>${f.a}</p></div>
</details>`
    )
    .join('\n');

  const body = `
<section class="page-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <span aria-current="page">FAQ</span></nav>
    <h1>Frequently asked questions</h1>
    <p class="lede">Common questions about Maryland's HQL and Wear &amp; Carry requirements. If
      yours is not here, call ${esc(site.phone)} — we are happy to talk it through.</p>
  </div>
</section>

<div class="wrap section narrow">
  ${items}
</div>

${ctaBand('Still have a question?', `Call ${site.phone} and speak to the instructor directly.`)}
`;

  writePage(
    track('/faq/', '0.8'),
    page({
      title: 'Maryland HQL & Wear and Carry FAQ — Frostburg, MD',
      description:
        'Answers to common questions about the Maryland Handgun Qualification License, Wear ' +
        'and Carry permit training hours, costs, and what to bring to class.',
      path: '/faq/',
      body,
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
          })),
        },
        breadcrumbs([
          { label: 'Home', href: '/' },
          { label: 'FAQ', href: '/faq/' },
        ]),
      ],
    })
  );
}

/* ---------------------------------------------------------------- contact */

function buildContact() {
  const a = site.address;
  const mapQuery = encodeURIComponent(fullAddress());

  // With no configured endpoint the form would silently swallow submissions, so
  // render a phone-first panel instead of a broken form.
  const shopPhotos = ['shop-interior', 'gun-wall'].filter(hasPhoto);
  const shopSection = shopPhotos.length
    ? `
<section class="section section-alt">
  <div class="wrap">
    <div class="section-head">
      <h2>Visit the shop</h2>
      <p>Classes run out of our shop on Grant Street in Frostburg. Stop in during opening
        hours to ask about a class, handle a loaner, or pick up what you need for the range.</p>
    </div>
    <div class="grid grid-${shopPhotos.length}">
      ${shopPhotos.map((n) => `<figure class="shop-shot">${picture(n, { cls: 'framed' })}</figure>`).join('\n      ')}
    </div>
  </div>
</section>`
    : '';

  const form = site.formEndpoint
    ? `<form class="form" action="${site.formEndpoint}" method="POST">
  <div class="field">
    <label for="name">Your name</label>
    <input id="name" name="name" type="text" autocomplete="name" required>
  </div>
  <div class="field">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" required>
  </div>
  <div class="field">
    <label for="tel">Phone <span class="opt">(optional)</span></label>
    <input id="tel" name="phone" type="tel" autocomplete="tel">
  </div>
  <div class="field">
    <label for="course">Which course?</label>
    <select id="course" name="course">
      <option value="">Not sure yet</option>
      ${courses.map((c) => `<option value="${esc(c.title)}">${esc(c.title)}</option>`).join('\n      ')}
    </select>
  </div>
  <div class="field">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="5" required></textarea>
  </div>
  <button class="btn btn-accent btn-lg" type="submit">Send message</button>
  <p class="form-note">We usually reply within one business day. For same-day answers, call
    <a href="tel:${site.phoneHref}">${esc(site.phone)}</a>.</p>
</form>`
    : `<div class="callout callout-lg">
  <h2>Call or text to book</h2>
  <p>The fastest way to check dates, ask about pricing, or arrange a private session is to
    call the instructor directly.</p>
  <a class="btn btn-accent btn-lg" href="tel:${site.phoneHref}">${svg('phone')}<span>${esc(site.phone)}</span></a>
  <p class="form-note">Prefer to write? Message us on
    <a href="${site.facebook}" rel="noopener">Facebook</a>.</p>
</div>`;

  const body = `
<section class="page-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <span aria-current="page">Contact</span></nav>
    <h1>Contact us</h1>
    <p class="lede">Questions about which class you need, upcoming dates, or private
      instruction — get in touch and we will sort it out.</p>
  </div>
</section>

<div class="wrap section">
  <div class="contact-grid">
    <div>${form}</div>
    <aside class="contact-aside">
      <h2>Details</h2>
      <ul class="plain contact-list contact-list-lg">
        <li>${svg('phone')}<div><strong>Phone</strong><br><a href="tel:${site.phoneHref}">${esc(site.phone)}</a></div></li>
        <li>${svg('pin')}<div><strong>Location</strong><br>
          <address>${esc(a.street)}<br>${esc(a.locality)}, ${esc(a.region)} ${esc(a.postalCode)}</address>
          <a class="text-link" href="https://www.google.com/maps/search/?api=1&amp;query=${mapQuery}" rel="noopener">Open in Maps ${svg('arrow')}</a>
        </div></li>
        <li>${svg('facebook')}<div><strong>Facebook</strong><br>
          <a href="${site.facebook}" rel="noopener">Mountain Maryland Firearms Training</a></div></li>
      </ul>

      <h2>Hours</h2>
      ${hoursTable()}
      <p class="hours-note">Classes also run outside these hours by arrangement — call to
        set up a private session or a weekend class.</p>

      <h2>Areas we serve</h2>
      <p>${site.areaServed.map(esc).join(' &middot; ')}</p>

      <div class="partner">
        ${picture('lawshield')}
        <p>Ask about U.S. LawShield legal defense membership at your next class.</p>
      </div>
    </aside>
  </div>
</div>
${shopSection}
`;

  writePage(
    track('/contact/', '0.8'),
    page({
      title: `Contact — ${site.name}, Frostburg MD`,
      description: `Call ${site.phone} or message Mountain Maryland Firearms Training in Frostburg, Maryland, to book an HQL, Wear & Carry, or NRA course.`,
      path: '/contact/',
      body,
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          url: site.origin + '/contact/',
          mainEntity: { '@id': site.origin + '/#business' },
        },
        breadcrumbs([
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact/' },
        ]),
      ],
    })
  );
}

/* ------------------------------------------------------ 404 and redirects */

function build404() {
  const body = `
<section class="page-head">
  <div class="wrap narrow center">
    <p class="eyebrow">404</p>
    <h1>That page has moved on.</h1>
    <p class="lede">The page you were looking for is not here. The site was rebuilt in 2025, so
      an old bookmark may point somewhere that no longer exists.</p>
    <div class="hero-actions center-actions">
      <a class="btn btn-accent btn-lg" href="/courses/">Browse courses</a>
      <a class="btn btn-ghost btn-lg" href="tel:${site.phoneHref}">${svg('phone')}<span>${esc(site.phone)}</span></a>
    </div>
  </div>
</section>`;

  write(
    '404.html',
    page({
      title: `Page not found — ${site.name}`,
      description: 'The page you requested could not be found.',
      path: '/404.html',
      body,
    })
  );
}

/** Old Wix URLs -> new locations, so existing links and search results keep working. */
const REDIRECTS = {
  '/about-me': '/instructor/',
  '/contact-us': '/contact/',
  '/md-hql-class': '/courses/md-hql-class/',
  '/md-wear-carry-training': '/courses/md-wear-carry-training/',
  '/md-wear-carry-permit-renewal': '/courses/md-wear-carry-renewal/',
  '/range-safety-officer-nra': '/courses/range-safety-officer/',
  '/basic-pistol-course': '/courses/basic-pistol/',
  '/basic-rifle-course': '/courses/basic-rifle/',
  '/private-training-1-on-1': '/courses/private-training/',
  '/expert-self-defense-course': '/courses/self-defense/',
};

function buildRedirects() {
  // Netlify / Cloudflare Pages honour this file and issue real 301s.
  const netlify = Object.entries(REDIRECTS)
    .map(([from, to]) => `${from}    ${to}    301!`)
    .join('\n');
  write('_redirects', netlify + '\n');

  // Static hosts without redirect support (e.g. GitHub Pages) fall back to these.
  for (const [from, to] of Object.entries(REDIRECTS)) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="${site.origin}${to}">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.search + location.hash);</script>
</head>
<body><p>This page has moved. <a href="${to}">Continue to its new home</a>.</p></body>
</html>
`;
    write(path.join(from.replace(/^\//, ''), 'index.html'), html);
  }
}

/* --------------------------------------------------- sitemap, robots, etc */

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  write('sitemap.xml', xml);

  write(
    'robots.txt',
    `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`
  );
}

/* ------------------------------------------------------------------- main */

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  copyDir(PUBLIC, DIST);

  buildHome();
  buildCourseIndex();
  courses.forEach(buildCourse);
  buildShop();
  buildInstructor();
  buildFaq();
  buildContact();
  build404();
  buildRedirects();
  buildSitemap();

  const pending = Object.keys(photos).filter((n) => !hasPhoto(n));
  if (pending.length) {
    console.log(
      `\nPhoto slots with no file yet (skipped, nothing broken): ${pending.join(', ')}` +
      `\nDrop originals into photos/ and run: python3 tools/optimize-photos.py\n`
    );
  }

  console.log(`Built ${urls.length} pages + ${Object.keys(REDIRECTS).length} redirects -> dist/`);
  urls.forEach((u) => console.log('  ' + u.loc));
}

main();
