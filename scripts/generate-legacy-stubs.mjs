#!/usr/bin/env node
// Rebuild the 20 Quran URLs that commit 9419908 removed.
//
// The collection was re-organised from ten thematic chapters into one chapter
// per sura. That was the right call editorially, but the old URLs were indexed,
// linked and submitted to IndexNow, and they have been returning 404 since.
// GitHub Pages cannot issue a 301, so each old URL is restored as a page that
// canonicalises to its successor, refreshes to it, and — because one thematic
// chapter usually became two to four sura chapters — lists every successor as
// a visible link so a reader who lands here still finds what they came for.
//
// These pages are marked with <meta name="x-legacy-stub"> and are deliberately
// absent from the sitemap and from site navigation.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const SITE = 'https://dua.shakhbanov.org';

const legacy = JSON.parse(fs.readFileSync(path.join(__dirname, 'legacy-urls.json'), 'utf8'));

const COPY = {
  ru: {
    title: (t) => `${t} — раздел переехал`,
    heading: 'Этот раздел переехал',
    lead: (t) =>
      `Подборка «${t}» больше не существует отдельной страницей: мольбы из Корана теперь сгруппированы по сурам, в порядке мусхафа. Содержимое этой подборки разошлось по следующим страницам.`,
    listHeading: 'Где искать эти мольбы',
    all: 'Все дуа из Корана',
    home: 'На главную',
  },
  en: {
    title: (t) => `${t} — this section has moved`,
    heading: 'This section has moved',
    lead: (t) =>
      `The "${t}" selection is no longer a page of its own: Quranic supplications are now grouped by sura, in mushaf order. The contents of this selection are now spread across the pages below.`,
    listHeading: 'Where these supplications are now',
    all: 'All duas from the Quran',
    home: 'Home',
  },
};

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

if (!fs.existsSync(dist)) {
  console.error('✗ dist/ not found — run the prerender first.');
  process.exit(1);
}

let written = 0;
for (const [oldPath, entry] of Object.entries(legacy)) {
  const { lang, title, primary, successors, successorTitles } = entry;
  const c = COPY[lang];

  const successorFile = path.join(dist, primary.replace(/^\/|\/$/g, ''), 'index.html');
  if (!fs.existsSync(successorFile)) {
    console.error(`✗ legacy stub ${oldPath}: successor ${primary} does not exist in this build.`);
    process.exit(1);
  }
  if (fs.existsSync(path.join(dist, oldPath.replace(/^\/|\/$/g, ''), 'index.html'))) {
    console.error(`✗ legacy stub ${oldPath} would overwrite a live page.`);
    process.exit(1);
  }

  const items = successors
    .map((href, i) => `        <li><a href="${esc(href)}">${esc(successorTitles[i])}</a></li>`)
    .join('\n');

  const allPath = lang === 'ru' ? '/dua-iz-korana/' : '/en/quran-duas/';
  const homePath = lang === 'ru' ? '/' : '/en/';

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-legacy-stub" content="${esc(primary)}" />
  <title>${esc(c.title(title))}</title>
  <meta name="description" content="${esc(c.lead(title)).slice(0, 180)}" />
  <link rel="canonical" href="${esc(SITE + primary)}" />
  <meta http-equiv="refresh" content="0; url=${esc(primary)}" />
  <link rel="icon" type="image/svg+xml" href="/logo.svg" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
           max-width: 40rem; margin: 4rem auto; padding: 0 1.25rem; line-height: 1.65;
           color: #09090b; background: #fff; }
    h1 { font-size: 1.5rem; margin-bottom: .75rem; }
    h2 { font-size: 1rem; margin: 2rem 0 .5rem; font-weight: 600; }
    p { color: #52525b; }
    ul { padding-left: 1.1rem; }
    li { margin: .35rem 0; }
    a { color: #09090b; }
    @media (prefers-color-scheme: dark) {
      body { background: #09090b; color: #fafafa; }
      p { color: #a1a1aa; }
      a { color: #fafafa; }
    }
  </style>
</head>
<body>
  <h1>${esc(c.heading)}</h1>
  <p>${esc(c.lead(title))}</p>

  <h2>${esc(c.listHeading)}</h2>
  <ul>
${items}
  </ul>

  <p>
    <a href="${allPath}">${esc(c.all)}</a> · <a href="${homePath}">${esc(c.home)}</a>
  </p>
</body>
</html>
`;

  const outFile = path.join(dist, oldPath.replace(/^\/|\/$/g, ''), 'index.html');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html, 'utf8');
  written++;
}

console.log(`✓ ${written} legacy stub pages restored (canonical → successor, absent from sitemap)`);
