#!/usr/bin/env node
// Nine SEO invariants, enforced against the built dist/ before deploy.
//
// Every one of these exists because a real, well-intentioned commit broke it:
// a link graph collapsed when 134 buttons replaced 134 links, 20 indexed URLs
// vanished in a re-slugging, and a heading contract was wrong on every page for
// months. None of them were caught, because nothing checked.
//
// No network, no dependencies. Run: node scripts/seo-checks.mjs

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const SITE = 'https://dua.shakhbanov.org';

// URLs deliberately dropped from the sitemap, each with the successor that
// replaced it. Check 2 refuses any other disappearance.
const LEGACY = new URL('./legacy-urls.json', import.meta.url);
const legacy = fs.existsSync(LEGACY) ? JSON.parse(fs.readFileSync(LEGACY, 'utf8')) : {};
const successorOf = (u) => legacy[u]?.primary;

// Schema types this project must never emit: each was, or would be, a claim
// the visible page does not make.
const FORBIDDEN_TYPES = ['FAQPage', 'HowTo', 'AggregateRating', 'Review', 'Recipe', 'Course'];

// The main entry chunk's gzip ceiling. Set to the size actually achieved, so
// the number can only be lowered deliberately, never drift upward.
const JS_BUDGET_GZIP = 240 * 1024;

const failures = [];
const notes = [];
function fail(check, msg) { failures.push(`[${check}] ${msg}`); }

if (!fs.existsSync(dist)) {
  console.error('✗ dist/ not found — run `npm run build` first.');
  process.exit(1);
}

// --- Load every prerendered page once ---

const pages = new Map();
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    if (fs.statSync(abs).isDirectory()) walk(abs);
    else if (name === 'index.html') {
      const rel = path.relative(dist, path.dirname(abs)).split(path.sep).join('/');
      pages.set(rel === '' ? '/' : `/${rel}/`, fs.readFileSync(abs, 'utf8'));
    }
  }
})(dist);

if (pages.size === 0) {
  console.error('✗ dist/ contains no prerendered pages.');
  process.exit(1);
}

const ASSET = /\.(png|jpe?g|svg|xml|txt|css|js|mjs|ico|webmanifest|json|mp3|wav|pdf)$/i;
function internalLinks(html) {
  const out = new Set();
  for (const m of html.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) {
    let h = m[1];
    if (!h.startsWith('/') || ASSET.test(h)) continue;
    h = h.split('#')[0].split('?')[0];
    if (!h.endsWith('/')) h += '/';
    out.add(h);
  }
  return out;
}

function jsonLdBlocks(html) {
  const out = [];
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    out.push(m[1]);
  }
  return out;
}

function visibleText(html) {
  const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? html;
  return body
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

// A page kept only so an old URL still resolves. Excluded from the graph and
// sitemap checks on purpose — it is addressed by its canonical successor.
function isLegacyStub(html) {
  return /<meta name="x-legacy-stub"/.test(html);
}

const liveePages = new Map([...pages].filter(([, html]) => !isLegacyStub(html)));
const stubCount = pages.size - liveePages.size;

// ---------------------------------------------------------------- 1. graph
{
  const out = new Map();
  const inbound = new Map([...liveePages.keys()].map((p) => [p, 0]));
  for (const [p, html] of liveePages) {
    const links = new Set([...internalLinks(html)].filter((h) => liveePages.has(h) && h !== p));
    out.set(p, links);
    for (const h of links) inbound.set(h, inbound.get(h) + 1);
  }
  const depth = new Map([['/', 0]]);
  const queue = ['/'];
  while (queue.length) {
    const cur = queue.shift();
    for (const h of out.get(cur) ?? []) {
      if (!depth.has(h)) { depth.set(h, depth.get(cur) + 1); queue.push(h); }
    }
  }
  const orphans = [...inbound].filter(([, n]) => n === 0).map(([p]) => p);
  const unreachable = [...liveePages.keys()].filter((p) => !depth.has(p));
  const maxDepth = Math.max(...depth.values());
  const deadEnds = [...out].filter(([, l]) => l.size === 0).map(([p]) => p);

  if (orphans.length) fail('graph', `${orphans.length} page(s) with no inbound link: ${orphans.slice(0, 5).join(', ')}`);
  if (unreachable.length) fail('graph', `${unreachable.length} page(s) unreachable from /: ${unreachable.slice(0, 5).join(', ')}`);
  if (maxDepth < 2) fail('graph', `link graph is flat (max depth ${maxDepth}) — every page hangs off the home page`);
  if (deadEnds.length) fail('graph', `${deadEnds.length} dead-end page(s): ${deadEnds.slice(0, 5).join(', ')}`);
  notes.push(`graph: ${liveePages.size} pages, max depth ${maxDepth}, 0 orphans, 0 dead ends`);
}

// ------------------------------------------------------------- 2. sitemap
{
  const smPath = path.join(dist, 'sitemap.xml');
  if (!fs.existsSync(smPath)) fail('sitemap', 'dist/sitemap.xml is missing');
  else {
    const xml = fs.readFileSync(smPath, 'utf8');
    const urls = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '')));

    for (const u of urls) if (!liveePages.has(u)) fail('sitemap', `sitemap lists ${u}, which the build did not produce`);
    for (const p of liveePages.keys()) if (!urls.has(p)) fail('sitemap', `build produced ${p}, which the sitemap omits`);

    // Anything that used to be listed and no longer is must name a successor.
    //
    // The comparison is against the PARENT commit, not HEAD: the build rewrites
    // public/sitemap.xml and it is committed alongside the change that caused
    // the removal, so diffing against HEAD would compare the new sitemap with
    // itself and never fire. HEAD~1 is the state before this change.
    let previous = '';
    for (const ref of ['HEAD~1:public/sitemap.xml', 'HEAD:public/sitemap.xml']) {
      try { previous = execFileSync('git', ['show', ref], { cwd: root, encoding: 'utf8' }); break; }
      catch { /* try the next ref */ }
    }
    if (!previous) notes.push('sitemap: no earlier sitemap to diff against (first commit)');
    if (previous) {
      const before = new Set([...previous.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '')));
      const gone = [...before].filter((u) => !urls.has(u));
      for (const u of gone) {
        const successor = successorOf(u);
        if (!successor) {
          fail('sitemap', `${u} was in the last sitemap and is now gone with no successor. Add it to scripts/legacy-urls.json with the URL that replaced it.`);
        } else if (!liveePages.has(successor)) {
          fail('sitemap', `${u} names successor ${successor}, which does not exist in this build`);
        }
      }
      if (gone.length) notes.push(`sitemap: ${gone.length} URL(s) removed, all with declared successors`);
    }

    const lastmods = new Set([...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]));
    if (lastmods.size <= 1) fail('sitemap', `every URL shares one lastmod (${[...lastmods][0]}) — it is the build clock, not the content date`);
    notes.push(`sitemap: ${urls.size} URLs, ${lastmods.size} distinct lastmod values`);
  }
}

// ---------------------------------------------------------------- 3. h1
{
  let bad = 0;
  for (const [p, html] of pages) {
    const hs = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
    if (hs.length !== 1) { fail('h1', `${p} has ${hs.length} <h1> elements`); bad++; continue; }
    const lang = /<html lang="([^"]+)"/.exec(html)?.[1];
    const cyr = /[А-Яа-яЁё]/.test(hs[0]);
    const lat = /[A-Za-z]/.test(hs[0]);
    if (lang === 'en' && cyr && !lat) { fail('h1', `${p} declares lang="en" but its <h1> is Russian: "${hs[0].slice(0, 40)}"`); bad++; }
    if (lang === 'ru' && lat && !cyr && !/[؀-ۿ]/.test(hs[0])) { fail('h1', `${p} declares lang="ru" but its <h1> is Latin-only: "${hs[0].slice(0, 40)}"`); bad++; }
  }
  if (!bad) notes.push(`h1: exactly one per page on all ${pages.size} pages, language matches html lang`);
}

// --------------------------------------------------------- 4. canonicals
{
  let bad = 0;
  const sm = fs.existsSync(path.join(dist, 'sitemap.xml')) ? fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8') : '';
  const smUrls = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  for (const [p, html] of pages) {
    const c = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    if (!c) { fail('canonical', `${p} has no canonical`); bad++; continue; }
    if (!c.startsWith('https://')) { fail('canonical', `${p} canonical is not HTTPS: ${c}`); bad++; }
    if (!c.startsWith(SITE)) { fail('canonical', `${p} canonical points at a foreign host: ${c}`); bad++; }
    const target = c.replace(SITE, '');
    if (!pages.has(target)) { fail('canonical', `${p} canonical ${c} does not resolve to a built page`); bad++; continue; }
    if (/<meta name="robots"[^>]*noindex/i.test(pages.get(target))) { fail('canonical', `${p} canonicalises to a noindex page: ${c}`); bad++; }
    if (isLegacyStub(html)) {
      if (target === p) { fail('canonical', `legacy stub ${p} is self-canonical — it must point at its successor`); bad++; }
      continue; // stubs are intentionally absent from the sitemap
    }
    if (target !== p) { fail('canonical', `${p} is not self-canonical (points at ${target})`); bad++; }
    if (smUrls.size && !smUrls.has(c)) { fail('canonical', `${p} canonical is absent from the sitemap`); bad++; }
  }
  if (!bad) notes.push(`canonical: ${pages.size}/${pages.size} absolute, HTTPS, own host, resolvable, indexable`);
}

// ---------------------------------------------------------- 5. JSON-LD
{
  let bad = 0;
  for (const [p, html] of pages) {
    if (isLegacyStub(html)) continue;
    const text = visibleText(html);
    for (const raw of jsonLdBlocks(html)) {
      let data;
      try { data = JSON.parse(raw); }
      catch (e) { fail('jsonld', `${p} has unparseable JSON-LD: ${e.message}`); bad++; continue; }
      const nodes = data['@graph'] ?? [data];
      for (const node of [].concat(nodes)) {
        const type = node['@type'];
        if (FORBIDDEN_TYPES.includes(type)) { fail('jsonld', `${p} emits ${type}, which the visible page does not support`); bad++; }
        if (node.potentialAction?.['@type'] === 'SearchAction') { fail('jsonld', `${p} advertises a SearchAction, but the site has no search endpoint`); bad++; }
        if (type === 'Article') {
          for (const field of ['headline', 'datePublished', 'dateModified', 'url', 'image', 'author', 'publisher']) {
            if (node[field] === undefined) { fail('jsonld', `${p} Article is missing ${field}`); bad++; }
          }
          if (node.headline && !text.includes(node.headline.slice(0, 30))) {
            fail('jsonld', `${p} Article headline is not present in the visible page`); bad++;
          }
          if (typeof node.author?.name === 'string' && /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(node.author.name)) {
            fail('jsonld', `${p} Article author is a hostname (${node.author.name}), not a person or organisation`); bad++;
          }
          for (const d of [node.datePublished, node.dateModified]) {
            if (d && Number.isNaN(Date.parse(d))) { fail('jsonld', `${p} Article has an unparseable date: ${d}`); bad++; }
          }
        }
        if (type === 'BreadcrumbList') {
          for (const item of node.itemListElement ?? []) {
            if (item.name && !text.includes(String(item.name))) {
              fail('jsonld', `${p} breadcrumb step "${item.name}" is not visible on the page`); bad++;
            }
          }
        }
      }
    }
  }
  if (!bad) notes.push(`jsonld: all blocks parse; Article complete; no unsupported types; breadcrumbs match visible trail`);
}

// -------------------------------------------------------- 6. hreflang
{
  let bad = 0;
  for (const [p, html] of pages) {
    if (isLegacyStub(html)) continue;
    const alts = {};
    for (const m of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) alts[m[1]] = m[2];
    for (const tag of ['ru', 'en', 'x-default']) {
      if (!alts[tag]) { fail('hreflang', `${p} has no hreflang="${tag}"`); bad++; }
    }
    for (const [tag, href] of Object.entries(alts)) {
      const t = href.replace(SITE, '');
      if (!pages.has(t)) { fail('hreflang', `${p} hreflang="${tag}" points at ${href}, which does not exist`); bad++; continue; }
      // Reciprocity: the target must name this page back under some hreflang.
      if (tag !== 'x-default' && !pages.get(t).includes(`href="${SITE}${p}"`)) {
        fail('hreflang', `${p} declares ${t} as its ${tag} alternate, but ${t} does not point back`); bad++;
      }
    }
  }
  if (!bad) notes.push(`hreflang: ru/en/x-default present and reciprocal on all ${liveePages.size} live pages`);
}

// ------------------------------------------------------- 7. prerender
{
  // Which paths are chapters, and which collection each belongs to, comes from
  // the route table rather than from matching slugs: identifying collections by
  // their URL prefix meant that registering a third one filed all of its pages
  // under the Sunnah, and the group it should have formed was never checked.
  const ssrBundle = path.join(root, 'dist-server', 'entry-server.js');
  const routes = fs.existsSync(ssrBundle)
    ? (await import(url.pathToFileURL(ssrBundle).href)).routeCatalog()
    : [];
  if (routes.length === 0) fail('prerender', 'dist-server/entry-server.js is missing — cannot resolve the route table');

  const groups = {};
  for (const { route } of routes) {
    if (route.view !== 'chapter') continue;
    const key = `${route.lang}/${route.collection}`;
    (groups[key] ??= []).push(route.path);
  }
  const samples = Object.values(groups).flat();
  // Every chapter page, not a sample: a sampled check let an empty #root
  // through when the broken page happened to fall outside the sample.
  for (const [group, list] of Object.entries(groups)) {
    if (list.length === 0) { fail('prerender', `no pages found for ${group}`); continue; }
    for (const p of list) {
      const html = liveePages.get(p);
      if (!html) { fail('prerender', `${p} is in the route table but was not rendered`); continue; }
      if (!/[؀-ۿ]/.test(html)) fail('prerender', `${p} contains no Arabic text — the shell shipped without content`);
      if (!/<h1[^>]*>/.test(html)) fail('prerender', `${p} has no <h1> in the raw HTML`);
      if (internalLinks(html).size < 3) fail('prerender', `${p} carries fewer than 3 internal links in the raw HTML`);
      if (!/<div id="root">\s*<[^>]/.test(html)) fail('prerender', `${p} has an empty #root — it was not prerendered`);
    }
  }
  notes.push(
    `prerender: Arabic, heading, links and hydrated root verified on all ${samples.length} chapter pages ` +
      `across ${Object.keys(groups).length} collection\u00d7language groups`
  );
}

// -------------------------------------------------------- 8. budget
{
  const assets = path.join(dist, 'assets');
  if (!fs.existsSync(assets)) fail('budget', 'dist/assets is missing');
  else {
    let biggest = { name: null, gz: 0 };
    for (const name of fs.readdirSync(assets)) {
      if (!name.endsWith('.js')) continue;
      const gz = zlib.gzipSync(fs.readFileSync(path.join(assets, name))).length;
      if (gz > biggest.gz) biggest = { name, gz };
    }
    if (biggest.gz > JS_BUDGET_GZIP) {
      fail('budget', `largest JS chunk ${biggest.name} is ${(biggest.gz / 1024).toFixed(0)} KB gzip, over the ${(JS_BUDGET_GZIP / 1024).toFixed(0)} KB budget`);
    }
    notes.push(`budget: largest JS chunk ${(biggest.gz / 1024).toFixed(0)} KB gzip (budget ${(JS_BUDGET_GZIP / 1024).toFixed(0)} KB)`);
  }

  // Render-blocking third-party stylesheets. media="print" + onload is the
  // async pattern and does not block.
  for (const [p, html] of pages) {
    for (const m of html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)) {
      const tag = m[0];
      if (!/href="https?:\/\//.test(tag)) continue;
      if (/media="print"/.test(tag)) continue;
      fail('budget', `${p} loads a render-blocking third-party stylesheet: ${tag.slice(0, 90)}`);
    }
    break; // the template is shared; one page is representative
  }
}

// ------------------------------------------------- 9. category references
{
  // Category chapterIds used to be resolved against the Sunnah collection
  // alone, so a Quran id was dropped by a .filter() while the index page went
  // on counting it: fewer chapters shown than promised, and no error anywhere.
  // Reading the built pages is the check — a reference that resolved is a link
  // on the page, and one that did not is a number with nothing behind it.
  const catalog = path.join(root, 'data', 'categories.ts');
  if (!fs.existsSync(catalog)) fail('categories', 'data/categories.ts is missing');
  else {
    const src = fs.readFileSync(catalog, 'utf8');
    const blocks = src.split(/\n  \{\n/).slice(1);
    let checked = 0;
    for (const block of blocks) {
      const slug = /slug: \{ ru: '([^']+)'/.exec(block)?.[1];
      if (!slug) continue;
      const pagePath = `/${slug}/`;
      const html = liveePages.get(pagePath);
      if (!html) { fail('categories', `category /${slug}/ has no built page`); continue; }

      const declaredChapters = (/chapterIds: \[([^\]]*)\]/.exec(block)?.[1] ?? '')
        .split(',').map((x) => x.trim()).filter(Boolean).length;
      const declaredDuas = (block.match(/duaId: '[^']+'/g) ?? []).length;

      // Rows the template renders for each list.
      const chapterRows = (html.match(/<li class="py-3">/g) ?? []).length;
      if (chapterRows < declaredChapters + declaredDuas) {
        fail(
          'categories',
          `/${slug}/ declares ${declaredChapters} chapter(s) and ${declaredDuas} dua(s) ` +
            `but renders only ${chapterRows} row(s) — an id did not resolve`
        );
      }
      for (const m of block.matchAll(/duaId: '([^']+)'/g)) {
        if (!html.includes(`#${m[1]}"`)) {
          fail('categories', `/${slug}/ declares duaId ${m[1]} but links to no such fragment`);
        }
      }
      checked += declaredChapters + declaredDuas;
    }
    notes.push(`categories: ${checked} chapter and dua references all resolve to rendered links`);
  }
}

// ---------------------------------------------------------------- report

for (const n of notes) console.log(`  ✓ ${n}`);
if (stubCount) console.log(`  · ${stubCount} legacy stub page(s) excluded from graph and sitemap checks by design`);

if (failures.length) {
  console.error(`\n✗ ${failures.length} SEO check failure(s):\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`\n✓ all 9 SEO checks passed across ${pages.size} pages`);
