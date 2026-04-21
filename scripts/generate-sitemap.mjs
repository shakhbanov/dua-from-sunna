#!/usr/bin/env node
// Generate sitemap.xml with hreflang alternates for every prerendered route.
// URLs follow the clean path-based structure from src/router/routes.ts:
//   RU:  /, /<slug-ru>/, /namaz/
//   EN:  /en/, /en/<slug-en>/, /en/prayer-times/
//
// Run after `vite build` — writes dist/sitemap.xml and public/sitemap.xml.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SITE = 'https://dua.shakhbanov.org';
const today = new Date().toISOString().split('T')[0];

// --- Parse slugs from data/slugs.ts (regex, no TS loader required) ---

const slugsSrc = fs.readFileSync(path.join(root, 'data', 'slugs.ts'), 'utf8');
const slugRe = /(\d+)\s*:\s*\{\s*ru\s*:\s*"([^"]+)"\s*,\s*en\s*:\s*"([^"]+)"\s*\}/g;
const chapterSlugs = new Map();
let m;
while ((m = slugRe.exec(slugsSrc)) !== null) {
  chapterSlugs.set(Number(m[1]), { ru: m[2], en: m[3] });
}
const chapterIds = [...chapterSlugs.keys()].sort((a, b) => a - b);

// --- Parse category slugs from data/categories.ts ---

const categoriesSrc = fs.readFileSync(path.join(root, 'data', 'categories.ts'), 'utf8');
const categorySlugRe = /slug\s*:\s*\{\s*ru\s*:\s*'([^']+)'\s*,\s*en\s*:\s*'([^']+)'\s*\}/g;
const categorySlugs = [];
let cm;
while ((cm = categorySlugRe.exec(categoriesSrc)) !== null) {
  categorySlugs.push({ ru: cm[1], en: cm[2] });
}

// --- Build entries ---

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function emitUrl(loc, lastmod, changefreq, priority, alternates) {
  const alts = alternates
    .map(
      (a) =>
        `    <xhtml:link rel="alternate" hreflang="${xmlEscape(a.hreflang)}" href="${xmlEscape(a.href)}" />`
    )
    .join('\n');
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alts}
  </url>`;
}

function ruUrl(path) {
  return `${SITE}${path}`;
}
function enUrl(path) {
  return `${SITE}${path}`;
}

function bilingualEntries({ ruPath, enPath, changefreq, priority }) {
  const ruLoc = ruUrl(ruPath);
  const enLoc = enUrl(enPath);
  const alts = [
    { hreflang: 'ru', href: ruLoc },
    { hreflang: 'en', href: enLoc },
    { hreflang: 'x-default', href: ruLoc }, // RU is primary audience
  ];
  return [
    emitUrl(ruLoc, today, changefreq, priority, alts),
    emitUrl(enLoc, today, changefreq, priority, alts),
  ];
}

const entries = [];

// Home
entries.push(
  ...bilingualEntries({
    ruPath: '/',
    enPath: '/en/',
    changefreq: 'daily',
    priority: '1.0',
  })
);

// Prayer times
entries.push(
  ...bilingualEntries({
    ruPath: '/namaz/',
    enPath: '/en/prayer-times/',
    changefreq: 'weekly',
    priority: '0.8',
  })
);

// Categories index
entries.push(
  ...bilingualEntries({
    ruPath: '/kategorii/',
    enPath: '/en/categories/',
    changefreq: 'weekly',
    priority: '0.85',
  })
);

// Each category (thematic landing pages — high priority for SEO)
for (const cat of categorySlugs) {
  entries.push(
    ...bilingualEntries({
      ruPath: `/${cat.ru}/`,
      enPath: `/en/${cat.en}/`,
      changefreq: 'weekly',
      priority: '0.85',
    })
  );
}

// Each chapter
for (const id of chapterIds) {
  const { ru, en } = chapterSlugs.get(id);
  entries.push(
    ...bilingualEntries({
      ruPath: `/${ru}/`,
      enPath: `/en/${en}/`,
      changefreq: 'monthly',
      priority: '0.7',
    })
  );
}

const body = entries.join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

const outDist = path.join(root, 'dist', 'sitemap.xml');
const outPublic = path.join(root, 'public', 'sitemap.xml');

if (fs.existsSync(path.join(root, 'dist'))) {
  fs.writeFileSync(outDist, xml, 'utf8');
  console.log(
    `✓ dist/sitemap.xml (${entries.length} urls: 2 home + 2 prayer-times + 2 categories-index + ${categorySlugs.length} × 2 categories + ${chapterIds.length} × 2 chapters)`
  );
}
fs.writeFileSync(outPublic, xml, 'utf8');
console.log(`✓ public/sitemap.xml`);
