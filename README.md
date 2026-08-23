# Mountain Maryland Firearms Training — website (Rev 2)

A rebuild of [mountainmdft.com](https://www.mountainmdft.com), replacing the Wix site
with a static site that loads fast, works on a phone, and is actually indexable.

All copy on the old site was carried over. Where the old wording had typos, stale
dates, or a question with no answer, it was corrected — see
[What changed](#what-changed) and [Before launch](#before-launch).

## Quick start

```bash
node build.js      # writes dist/
npm run serve      # builds, then serves dist/ at http://localhost:8080
npm run zip        # builds, then packs dist/ into mountainmdft-site.zip
```

No dependencies and no install step — Node 18+ and the standard library only.

## How it works

```
src/content.js     Every fact on the site: courses, prices, FAQ, bio, contact details
src/layout.js      Page shell, header, footer, icon set
build.js           Renders content -> dist/
public/            Copied verbatim into dist/ (CSS, JS, images)
dist/              Build output. Generated — do not edit by hand
```

Content and presentation are separate on purpose: to change a price, add a course, or
fix a phone number, edit `src/content.js` and rebuild. Nav, footer, sitemap, structured
data, and cross-links all update themselves.

### Adding a course

Append an entry to the `courses` array in `src/content.js`. Set `featured: true` to put
it in the top row on the home page and courses index. The course page, both nav
placements, the sitemap entry, and its `Course` structured data are generated from it.

## What changed

**Findings from the old site.** Each of these was a real defect, verified against the
live pages:

| Problem | Fix |
| --- | --- |
| 11 of 12 pages had the title `… \| Mysite` and **no meta description** | Unique, hand-written title and description on every page |
| Four courses — Basic Pistol, Basic Rifle, Private Training, Self Defense — existed but were linked from **no menu anywhere**, so no visitor could reach them | All eight courses are in the nav, the courses index, and the sitemap |
| The home page and the RSO page rendered **no text at all** without JavaScript, so there was nothing for search engines to index | Fully static HTML; every page is complete before any script runs |
| ~616 KB of HTML per page plus dozens of JS bundles, and a 9.6 MB PNG | ~24 KB HTML, 21 KB CSS, 1.4 KB JS; ~220 KB for a full home page load |
| FAQ answers still said the process "will be automated" **prior to October 1, 2013** — a date twelve years past | Answers rewritten in the present tense |
| One FAQ question ("How does a new resident register a regulated firearm?") had **no answer** | Answered, with a pointer to MSP for current specifics |
| A "7/5/22 UPDATE" banner sat at the top of the Wear & Carry page | Removed; the durable part (complete training *before* applying) kept |
| Typos: "Pistol Safety" for *safely*, "cliental", "semi-automated handguns", "lever actions rifles", "minors accompanied by and adult", "Ammunition's", "An HQL is the only required" | Corrected |
| RSO page had a title and nothing else | Written up with the standard NRA RSO topics and a call-for-dates note |
| No structured data, sitemap, robots.txt, or 404 page | All added |

**Also new:** phone number as a tap-to-call button in the header and on every page,
course cost and length surfaced on cards rather than buried in prose, a five-step
Wear & Carry explainer built from the shop's own checklist graphic, breadcrumbs,
skip link, keyboard-operable mobile menu, and a print stylesheet.

### Visual direction

Gunmetal ground, not white. Neutrals carry a slight blue bias toward the brand steel
so they read as chosen rather than inherited. Two accents with distinct jobs: the brand
steel (sampled from the shop's signage) carries links and structure, and a hi-vis
yellow-green — sampled from the target silhouettes in the range photo — is reserved for
primary actions and live state. Corners are tight (3px) and card icon panels carry a
faint diagonal hatch, so surfaces read like equipment rather than app chrome.

Every foreground/background pair in the palette was checked against WCAG AA; the
tightest is muted body text on a card surface at 4.84:1.

### Accessibility and SEO

Every page: one `<h1>`, no heading-level skips, alt text on all images, visible focus
rings, `prefers-reduced-motion` respected, and a canonical URL. `LocalBusiness`,
`Course` (with `Offer` where a price is published), `FAQPage`, `Person`, and
`BreadcrumbList` structured data are emitted as JSON-LD.

### Old URLs

Every old Wix URL redirects to its new home, so existing links and search results keep
working. `dist/_redirects` gives real 301s on Netlify and Cloudflare Pages; matching
meta-refresh stubs cover hosts without redirect support, such as GitHub Pages.

## Before launch

Three things need a human decision — all marked `REVIEW` in `src/content.js`:

0. **The shop page's NFA wording.** Transferring suppressors and SBRs requires an SOT
   in addition to the FFL. The copy says these are ordered and transferred through the
   shop, which is what was described — confirm the exact licensing wording, and whether
   transfers for outside purchases are offered and at what fee.

1. **The contact form has no destination.** `site.formEndpoint` is `null`, so the
   contact page shows a call-to-book panel instead of a form that would silently
   discard messages. Set it to a Formspree (or similar) endpoint to switch the real
   form on — the markup is already written.
2. **Prices marked "Call for pricing"** — Wear & Carry (original), RSO, Basic Pistol,
   Basic Rifle, Private Training, and Self Defense. The old site never published these.
   Add a `price` and `priceValue` in `src/content.js` and the figure appears on the
   card, the course page, and its structured data.

Address (79 S Grant St) and opening hours are confirmed and live on the site.

Worth adding when someone can supply it: an email address, and more photos of recent
classes — see [Adding photos](#adding-photos).

### Adding photos

Photos live in `public/assets/img/` as a `.jpg` + `.webp` pair per slot. To add or
replace one, drop the full-size original into a `photos/` folder named after its slot
and run the optimizer — it resizes, strips EXIF rotation, and writes both formats:

```bash
pip install pillow
python3 tools/optimize-photos.py
node build.js
```

Alt text lives with the slot in the `photos` map in `src/content.js`, and dimensions are
read from the file itself at build time — so swapping in a photo of a different shape
cannot leave stale alt text or a distorted layout behind.

A slot with no file is skipped rather than rendering a broken image, and `node build.js`
lists what is still missing. Two placements are wired to light up on their own:

- `shop-interior` and `gun-wall` add a "Visit the shop" section to the contact page;
  with neither present the section does not render at all.
- A course entry with `photo: '<slot>'` gets that image as a captioned figure.

Slots cropped with `object-fit: cover` can set a `position` in the `photos` map to move
the crop. Note this only pans along the axis that is actually being cropped — a portrait
photo in a landscape box crops vertically, so a horizontal value there does nothing.

Slots: `hero-range`, `range-lesson`, `classroom`, `shop-interior`, `gun-wall`,
`trooper`, `deployment`, `checklist`, `lawshield`. Add a new one with a line in `SLOTS`
in the script, an entry in `photos`, and a `picture('<slot>')` call in `build.js`.

Originals are kept in `photos/` and versioned with the site, so an image can be
re-cropped or re-exported later without hunting for the source. Pillow is only needed
for this tool — `node build.js` still has no dependencies.

Photos never render larger than their own resolution: figures size to the file, and the
optimizer only ever downscales. If a photo looks soft, the fix is a higher-resolution
original in `photos/`, not a bigger slot.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to
`main` (enable it under Settings → Pages → Source: GitHub Actions).

The output is plain static files, so any host works. For Cloudflare Pages, run
`npm run zip` and drag `mountainmdft-site.zip` into Workers & Pages → Create → Pages →
Upload assets; the files sit at the zip root and `_redirects` gives real 301s from the
old Wix URLs. Netlify takes the same `dist/` folder, as does any existing hosting. Point the domain at it and keep
`site.origin` in `src/content.js` matching the live domain, since canonical URLs and
the sitemap are built from it.
