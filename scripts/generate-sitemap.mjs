#!/usr/bin/env node
// Generate sitemap.xml with hreflang alternates for every prerendered route.
//
// The route table is the single source of truth: this script imports
// routeCatalog() from the SSR bundle rather than re-parsing data/*.ts with
// regexes, so a new collection or chapter shows up here automatically.
//
// Run after `vite build --ssr src/entry-server.tsx --outDir dist-server`.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SITE = 'https://dua.shakhbanov.org';

// Chapter dates come from git history of the chapter's source file. Pages with
// no chapter behind them (home, indexes, category pages) take the most recent
// chapter date as their own: they list chapters, so they are exactly as fresh
// as the newest thing they list. Nothing here is the build clock — two deploys
// with no content change must produce byte-identical lastmod values.
const { CHAPTER_DATES } = await import(
  url.pathToFileURL(path.join(root, 'data', 'chapterDates.generated.ts')).href
).catch(() => ({ CHAPTER_DATES: {} }));

const ssrBundle = path.join(root, 'dist-server', 'entry-server.js');
if (!fs.existsSync(ssrBundle)) {
  console.error(
    `✗ ${ssrBundle} not found. Run \`npm run build:ssr\` before \`npm run sitemap\`.`
  );
  process.exit(1);
}
const { routeCatalog } = await import(url.pathToFileURL(ssrBundle).href);

// --- Crawl priorities per view ---

const PRIORITY = {
  home: { changefreq: 'daily', priority: '1.0' },
  'collection-index': { changefreq: 'weekly', priority: '0.9' },
  'categories-index': { changefreq: 'weekly', priority: '0.85' },
  category: { changefreq: 'weekly', priority: '0.85' },
  'prayer-times': { changefreq: 'weekly', priority: '0.8' },
  chapter: { changefreq: 'monthly', priority: '0.7' },
};

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

// Group the catalog into RU/EN pairs so each entry can carry its alternates.
// The pair key is the view plus whatever identifies the page within it.
function pairKey(meta) {
  const r = meta.route;
  switch (r.view) {
    case 'chapter':
      return `chapter:${r.chapterId}`;
    case 'category':
      return `category:${r.categoryId}`;
    case 'collection-index':
      return `collection:${meta.collection}`;
    default:
      return r.view;
  }
}

const catalog = routeCatalog();

const day = (iso) => String(iso).split('T')[0];
const allDates = Object.values(CHAPTER_DATES).map((d) => d.modified).sort();
const newest = allDates.length ? day(allDates[allDates.length - 1]) : null;
if (!newest) {
  console.error('✗ sitemap: no chapter dates available — run scripts/generate-chapter-dates.mjs first.');
  process.exit(1);
}

function lastmodFor(meta) {
  const id = meta.route.chapterId;
  const d = id !== undefined ? CHAPTER_DATES[id] : undefined;
  return d ? day(d.modified) : newest;
}
const pairs = new Map();
for (const meta of catalog) {
  const key = pairKey(meta);
  if (!pairs.has(key)) pairs.set(key, { view: meta.route.view, lastmod: lastmodFor(meta) });
  pairs.get(key)[meta.route.lang] = `${SITE}${meta.route.path}`;
}

const entries = [];
const counts = {};

for (const [, pair] of pairs) {
  if (!pair.ru || !pair.en) {
    console.warn(`  skip ${pair.ru ?? pair.en} (no counterpart in the other language)`);
    continue;
  }
  const { changefreq, priority } = PRIORITY[pair.view] ?? PRIORITY.chapter;
  const alts = [
    { hreflang: 'ru', href: pair.ru },
    { hreflang: 'en', href: pair.en },
    { hreflang: 'x-default', href: pair.ru }, // RU is primary audience
  ];
  entries.push(emitUrl(pair.ru, pair.lastmod, changefreq, priority, alts));
  entries.push(emitUrl(pair.en, pair.lastmod, changefreq, priority, alts));
  counts[pair.view] = (counts[pair.view] ?? 0) + 2;
}

const body = entries.join('\n');

// The stylesheet is presentation only — crawlers read the urlset and ignore it.
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

const outDist = path.join(root, 'dist', 'sitemap.xml');
const outPublic = path.join(root, 'public', 'sitemap.xml');

const distinctLastmod = new Set(entries.map((e) => /<lastmod>([^<]+)</.exec(e)[1]));

const breakdown = Object.entries(counts)
  .map(([view, n]) => `${n} ${view}`)
  .join(' + ');

if (fs.existsSync(path.join(root, 'dist'))) {
  fs.writeFileSync(outDist, xml, 'utf8');
  console.log(
    `✓ dist/sitemap.xml (${entries.length} urls: ${breakdown}; ${distinctLastmod.size} distinct lastmod)`
  );
}
fs.writeFileSync(outPublic, xml, 'utf8');
console.log(`✓ public/sitemap.xml`);
