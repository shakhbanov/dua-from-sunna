#!/usr/bin/env node
// Generate sitemap.xml with hreflang alternates for every chapter + main views
// Run after `vite build` — writes to dist/sitemap.xml and public/sitemap.xml

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SITE = 'https://dua.shakhbanov.org';
const LANGS = ['ru', 'en'];
const today = new Date().toISOString().split('T')[0];

// Parse chapter IDs from data/chapters/*.ts filenames like "001-authors-preface.ts"
const chaptersDir = path.join(root, 'data', 'chapters');
const chapterIds = fs
  .readdirSync(chaptersDir)
  .filter((f) => /^\d+-.+\.ts$/.test(f))
  .map((f) => parseInt(f.split('-')[0], 10))
  .filter((n) => Number.isFinite(n))
  .sort((a, b) => a - b);

function xmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function xmlUrl(loc, lastmod, changefreq, priority, alternates) {
  const alts = alternates
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${xmlEscape(a.hreflang)}" href="${xmlEscape(a.href)}" />`)
    .join('\n');
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alts}
  </url>`;
}

function buildEntry(pathSegment, { changefreq = 'weekly', priority = '0.7' } = {}) {
  return LANGS.map((lang) => {
    const qs = new URLSearchParams();
    if (pathSegment.search) {
      for (const [k, v] of Object.entries(pathSegment.search)) qs.set(k, String(v));
    }
    if (lang !== 'ru') qs.set('lang', lang);
    const suffix = qs.toString();
    const loc = `${SITE}/${suffix ? '?' + suffix : ''}`;

    const alternates = LANGS.map((alt) => {
      const altQs = new URLSearchParams();
      if (pathSegment.search) {
        for (const [k, v] of Object.entries(pathSegment.search)) altQs.set(k, String(v));
      }
      if (alt !== 'ru') altQs.set('lang', alt);
      return {
        hreflang: alt,
        href: `${SITE}/${altQs.toString() ? '?' + altQs.toString() : ''}`,
      };
    });
    alternates.push({ hreflang: 'x-default', href: `${SITE}/` });

    return xmlUrl(loc, today, changefreq, priority, alternates);
  });
}

const entries = [];

// Home + prayer-times view
entries.push(...buildEntry({ search: null }, { changefreq: 'daily', priority: '1.0' }));
entries.push(...buildEntry({ search: { view: 'prayer-times' } }, { changefreq: 'weekly', priority: '0.8' }));

// Each chapter
for (const id of chapterIds) {
  entries.push(...buildEntry(
    { search: { chapter: id } },
    { changefreq: 'monthly', priority: '0.7' }
  ));
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
  console.log(`✓ dist/sitemap.xml (${entries.length} urls, ${chapterIds.length} chapters × ${LANGS.length} langs + home + prayer-times)`);
}
fs.writeFileSync(outPublic, xml, 'utf8');
console.log(`✓ public/sitemap.xml`);
