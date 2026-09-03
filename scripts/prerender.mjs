#!/usr/bin/env node
// Prerender every route declared by src/router/routes.ts into dist/<path>/index.html.
// Runs AFTER `vite build` (client, outDir=dist) and `vite build --ssr src/entry-server.tsx`.
//
// Template: dist/index.html (Vite client build output — already has bundled JS/CSS links).
// SSR bundle: dist-server/entry-server.js (exports { render, allRoutes }).

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const ssrBundle = path.join(root, 'dist-server', 'entry-server.js');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('✗ dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}
if (!fs.existsSync(ssrBundle)) {
  console.error(`✗ ${ssrBundle} not found. Run \`vite build --ssr src/entry-server.tsx --outDir dist-server\` first.`);
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const { render, allRoutes } = await import(url.pathToFileURL(ssrBundle).href);

// Guard against accidental URL collisions (e.g. a category slug shadowing a
// chapter slug). Duplicate paths would cause the later-registered route to
// silently overwrite an earlier one in the lookup map and drop a page.
{
  const seen = new Map();
  for (const r of allRoutes()) {
    if (seen.has(r.path)) {
      const prev = seen.get(r.path);
      console.error(
        `✗ URL collision: ${r.path} — ${prev.view}(${prev.chapterId ?? prev.categoryId ?? ''}) vs ${r.view}(${r.chapterId ?? r.categoryId ?? ''})`
      );
      process.exit(1);
    }
    seen.set(r.path, r);
  }
}

// --- Prepare a template with default meta tags stripped so SSR-injected tags win ---
const cleanTemplate = stripDefaultMeta(template);

// --- Render every route ---
const routes = allRoutes();
let success = 0;
let failed = 0;

for (const route of routes) {
  try {
    const result = render(route.path);
    if (!result) {
      console.warn(`  skip ${route.path} (no route match)`);
      failed++;
      continue;
    }
    const html = injectSSR(cleanTemplate, result);
    const outFile = path.join(distDir, normalizePath(route.path), 'index.html');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html, 'utf8');
    success++;
  } catch (err) {
    console.error(`  fail ${route.path}: ${err.message}`);
    failed++;
  }
}

console.log(`✓ prerendered ${success} routes (${failed} failed) into dist/`);

// --- Helpers ---

function normalizePath(p) {
  // "/" → ""      (writes to dist/index.html)
  // "/foo/" → "foo"
  // "/en/foo/" → "en/foo"
  return p.replace(/^\/|\/$/g, '');
}

function stripDefaultMeta(html) {
  // Remove every statically-declared tag the SSR head re-emits per route.
  // Anything left here would be duplicated on all 372 pages with the home
  // page's values — which is how the Sunnah-specific JSON-LD ended up on the
  // Quran pages before this rule existed.
  const stripped = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/i, '')
    .replace(/<meta\s+name=["']author["'][^>]*>\s*/i, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/i, '')
    .replace(/<link\s+rel=["']alternate["'][^>]*hreflang=["'](ru|en|x-default)["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+property=["']og:(type|site_name|title|description|url|locale|image|image:width|image:height)["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+name=["']twitter:(title|description|image|card)["'][^>]*>\s*/gi, '')
    // The claim this function has always made, now actually enforced.
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>\s*/gi, '');

  // Fail loudly rather than shipping a duplicated tag on every page.
  const leftovers = [
    [/<script\s+type=["']application\/ld\+json["']/i, 'static JSON-LD'],
    [/<meta\s+property=["']og:(type|site_name|title|url)["']/i, 'static Open Graph'],
    [/<title>/i, 'static <title>'],
  ];
  for (const [re, label] of leftovers) {
    if (re.test(stripped)) {
      console.error(`\u2717 prerender: ${label} survived stripDefaultMeta() and would be copied to every page.`);
      process.exit(1);
    }
  }
  return stripped;
}

function injectSSR(template, { html, headHtml, htmlLangAttr }) {
  let out = template.replace(/<html\s+lang="[^"]*"/, `<html lang="${htmlLangAttr}"`);
  out = out.replace(/<\/head>/i, `    ${headHtml}\n  </head>`);
  out = out.replace(/<div id="root"><\/div>/, `<div id="root">${html}</div>`);
  return out;
}
