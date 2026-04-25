#!/usr/bin/env node
/**
 * IndexNow ping — notifies Bing + Yandex about new or updated URLs.
 *
 * Modes (mutually exclusive):
 *   --all                   Submit every URL in dist/sitemap.xml.
 *   --changed [<base>]      Diff against <base> ref (default: HEAD~1) and
 *                           submit only the URLs whose source files changed.
 *   --urls <p1>,<p2>,...    Submit a comma-separated list of paths or full URLs.
 *
 * Flags:
 *   --dry-run               Print what would be sent; do not POST.
 *   --verbose               Print the full URL list.
 *   --no-history            Skip writing .indexnow-history.json.
 *
 * Exit code is 0 even on partial endpoint failure (IndexNow is best-effort).
 *
 * History is recorded in ./.indexnow-history.json so a re-pinged URL is
 * deduplicated against recent submissions (24 h window). This protects against
 * Bing/Yandex throttling.
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const HOST = 'dua.shakhbanov.org';
const SITE = `https://${HOST}`;
const KEY = '12c3d0c1697d4c5398d60158271c3f62';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const HISTORY_FILE = path.join(root, '.indexnow-history.json');
const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h dedupe

const ENDPOINTS = ['https://api.indexnow.org/IndexNow', 'https://yandex.com/indexnow'];

// --- CLI parsing ---

const args = process.argv.slice(2);
const flags = {
  all: args.includes('--all'),
  changed: args.includes('--changed'),
  dryRun: args.includes('--dry-run'),
  verbose: args.includes('--verbose'),
  noHistory: args.includes('--no-history'),
};
const changedBase = (() => {
  const i = args.indexOf('--changed');
  if (i === -1) return null;
  const next = args[i + 1];
  return next && !next.startsWith('--') ? next : 'HEAD~1';
})();
const urlsArg = (() => {
  const i = args.indexOf('--urls');
  if (i === -1) return null;
  const next = args[i + 1];
  return next && !next.startsWith('--') ? next : null;
})();

if (!flags.all && !flags.changed && !urlsArg) {
  // Default: show usage and exit 0 — never auto-submit everything by accident.
  console.log(`IndexNow ping — Bing + Yandex notifier

Usage:
  node scripts/indexnow-ping.mjs --all
  node scripts/indexnow-ping.mjs --changed [<git-ref>]
  node scripts/indexnow-ping.mjs --urls /slug-a/,/en/slug-b/

Flags:
  --dry-run     Print URLs; don't POST
  --verbose     Print full URL list
  --no-history  Skip dedupe log

Examples:
  npm run indexnow:changed              # diff vs HEAD~1
  npm run indexnow:changed -- HEAD~5    # diff vs 5 commits back
  npm run indexnow:all                  # submit every sitemap URL
  npm run indexnow -- --urls /utrennie-i-vechernie-azkary/,/en/morning-evening-adhkar/ --dry-run
`);
  process.exit(0);
}

// --- URL collection ---

let urls;

if (urlsArg) {
  urls = urlsArg.split(',').map(normalizeUrl);
  console.log(`→ Mode: explicit URL list (${urls.length} URLs)`);
} else if (flags.all) {
  urls = readSitemapUrls();
  console.log(`→ Mode: --all (${urls.length} URLs from dist/sitemap.xml)`);
} else if (flags.changed) {
  const result = changedUrlsFromGit(changedBase);
  urls = result.urls;
  console.log(`→ Mode: --changed (${changedBase} → HEAD)`);
  console.log(`  changed source files: ${result.changedFiles.length}`);
  if (flags.verbose) {
    for (const f of result.changedFiles.slice(0, 30)) console.log(`    ${f}`);
    if (result.changedFiles.length > 30) console.log(`    ... +${result.changedFiles.length - 30} more`);
  }
  console.log(`  resolved to URLs: ${urls.length}${result.fanoutAll ? ' (fanout: all sitemap URLs)' : ''}`);
}

if (urls.length === 0) {
  console.log('Nothing to submit. Exiting.');
  process.exit(0);
}

// --- History dedupe ---

const history = readHistory();
const now = Date.now();
const recent = new Set();
for (const entry of history) {
  if (now - new Date(entry.at).getTime() < RECENT_WINDOW_MS) {
    for (const u of entry.urls) recent.add(u);
  }
}
const beforeDedupe = urls.length;
urls = [...new Set(urls)].filter((u) => !recent.has(u));
const dedupedCount = beforeDedupe - urls.length;
if (dedupedCount > 0) {
  console.log(`  deduplicated against last 24h: skipped ${dedupedCount} URLs already pinged`);
}

if (urls.length === 0) {
  console.log('All URLs were submitted in the last 24h. Exiting.');
  process.exit(0);
}

if (flags.verbose) {
  console.log('\nURLs to submit:');
  for (const u of urls.slice(0, 50)) console.log(`  ${u}`);
  if (urls.length > 50) console.log(`  ... +${urls.length - 50} more`);
  console.log('');
}

if (flags.dryRun) {
  console.log(`\n[dry-run] Would submit ${urls.length} URLs to ${ENDPOINTS.join(', ')}.`);
  process.exit(0);
}

// --- Submit ---

const BATCH_SIZE = 1000;
const batches = [];
for (let i = 0; i < urls.length; i += BATCH_SIZE) batches.push(urls.slice(i, i + BATCH_SIZE));

console.log(`→ Submitting ${urls.length} URLs (${batches.length} batch${batches.length > 1 ? 'es' : ''})...`);

const submissions = [];
for (const endpoint of ENDPOINTS) {
  for (const batch of batches) {
    try {
      const res = await submitBatch(endpoint, batch);
      const ok = res.status >= 200 && res.status < 300;
      console.log(`  ${ok ? '✓' : '✗'} ${endpoint} — HTTP ${res.status} (${batch.length} URLs)`);
      submissions.push({ endpoint, status: res.status, count: batch.length, ok });
    } catch (err) {
      console.error(`  ✗ ${endpoint} — ${err.message}`);
      submissions.push({ endpoint, status: 0, count: batch.length, ok: false, error: err.message });
    }
  }
}

// --- Write history (only on real submission, not dry-run) ---

if (!flags.noHistory) {
  history.unshift({
    at: new Date().toISOString(),
    mode: flags.all ? 'all' : flags.changed ? 'changed' : 'urls',
    base: flags.changed ? changedBase : null,
    urls,
    submissions,
  });
  // Keep last 50 entries to avoid unbounded growth
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 50), null, 2), 'utf8');
}

console.log(
  `\nDone. Note: Bing accepts pings only after BingSiteAuth.xml verification. Yandex independently. Google does not support IndexNow.`
);

// =============================================================================

async function submitBatch(endpoint, batch) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: batch,
  });
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  return { status: res.status };
}

function normalizeUrl(input) {
  const s = input.trim();
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  if (s.startsWith('/')) return SITE + (s.endsWith('/') ? s : s + '/');
  return SITE + '/' + (s.endsWith('/') ? s : s + '/');
}

function readSitemapUrls() {
  const sitemapPath = path.join(root, 'dist', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('✗ dist/sitemap.xml not found. Run `npm run build` first.');
    process.exit(1);
  }
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function readHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch {
    return [];
  }
}

// --- changed-files → URL resolver ---
//
// Source files map to URL groups as follows:
//   data/chapters/NNN-*.ts     → that chapter's RU + EN URL
//   data/categories.ts         → all 24 category URLs (12 × 2 langs) + 2 index
//   data/slugs.ts              → all 268 chapter URLs (slugs may have moved)
//   data/descriptions.ts       → all 60 chapter URLs whose description-keyed
//                                  IDs intersect the 30 covered chapters
//   src/router/**              → all 298 URLs (routing changed)
//   src/seo/**                 → all 298 URLs
//   src/views/**               → all 298 URLs
//   src/entry-server.tsx       → all 298 URLs
//   src/entry-client.tsx       → no ping (client-only)
//   src/sw/**                  → no ping (service worker)
//   App.tsx                    → all 298 URLs (top-level rendering changed)
//   index.html                 → all 298 URLs (template changed)
//   vite.config.ts             → all 298 URLs
//   scripts/generate-*.mjs     → all 298 URLs
//   public/og/*, public/llms*  → no ping (auto-regenerated)
//   anything else under public/ → all 298 URLs (could be sitemap, robots, key)

function changedUrlsFromGit(baseRef) {
  let diffOut;
  try {
    diffOut = execSync(`git diff --name-only ${baseRef}...HEAD`, { cwd: root, encoding: 'utf8' });
  } catch (err) {
    console.error(`✗ git diff failed: ${err.message}`);
    process.exit(1);
  }
  const changedFiles = diffOut.trim().split('\n').filter(Boolean);

  const slugMap = readChapterSlugs(); // { 3: { ru: '...', en: '...' }, ... }
  const categorySlugs = readCategorySlugs(); // [{ ru, en }, ...]

  const urls = new Set();
  let fanoutAll = false;

  for (const file of changedFiles) {
    if (matchesAny(file, [
      /^src\/(router|seo|views)\//,
      /^src\/entry-server\.tsx$/,
      /^App\.tsx$/,
      /^index\.html$/,
      /^vite\.config\.ts$/,
      /^scripts\/generate-(sitemap|llms-txt|og-images)\.mjs$/,
      /^scripts\/prerender\.mjs$/,
      /^data\/slugs\.ts$/,
    ])) {
      fanoutAll = true;
      break;
    }

    const chapterMatch = file.match(/^data\/chapters\/(\d+)-/);
    if (chapterMatch) {
      const id = parseInt(chapterMatch[1], 10);
      const slugs = slugMap.get(id);
      if (slugs) {
        urls.add(`${SITE}/${slugs.ru}/`);
        urls.add(`${SITE}/en/${slugs.en}/`);
      }
      continue;
    }

    if (file === 'data/categories.ts') {
      // All categories + categories index, both languages
      for (const c of categorySlugs) {
        urls.add(`${SITE}/${c.ru}/`);
        urls.add(`${SITE}/en/${c.en}/`);
      }
      urls.add(`${SITE}/kategorii/`);
      urls.add(`${SITE}/en/categories/`);
      continue;
    }

    if (file === 'data/descriptions.ts') {
      // Descriptions cover specific chapter IDs — re-ping the whole top-30 set,
      // because we can't cheaply know which entries inside the file changed.
      const coveredIds = readDescriptionIds();
      for (const id of coveredIds) {
        const slugs = slugMap.get(id);
        if (slugs) {
          urls.add(`${SITE}/${slugs.ru}/`);
          urls.add(`${SITE}/en/${slugs.en}/`);
        }
      }
      continue;
    }

    if (matchesAny(file, [
      /^public\/(og|llms\.txt|llms-full\.txt|sitemap\.xml|service-worker.*)/,
      /^src\/(entry-client\.tsx|sw\/|i18n\/|features\/|analytics\/|index\.css)/,
      /^public\/(splashes|icons)\//,
      /^components\//,
      /^constants\.ts$/,
      /^types\.ts$/,
    ])) {
      // Build artefacts or non-content code — skip.
      continue;
    }

    // Anything else inside public/ probably means a static asset that affects
    // every page (favicon, robots, manifest, key file). Fan out.
    if (file.startsWith('public/')) {
      fanoutAll = true;
      break;
    }
  }

  if (fanoutAll) {
    return { urls: readSitemapUrls(), changedFiles, fanoutAll: true };
  }

  return { urls: [...urls], changedFiles, fanoutAll: false };
}

function matchesAny(s, patterns) {
  return patterns.some((re) => re.test(s));
}

function readChapterSlugs() {
  const src = fs.readFileSync(path.join(root, 'data', 'slugs.ts'), 'utf8');
  const re = /(\d+)\s*:\s*\{\s*ru\s*:\s*"([^"]+)"\s*,\s*en\s*:\s*"([^"]+)"\s*\}/g;
  const map = new Map();
  let m;
  while ((m = re.exec(src)) !== null) map.set(Number(m[1]), { ru: m[2], en: m[3] });
  return map;
}

function readCategorySlugs() {
  const src = fs.readFileSync(path.join(root, 'data', 'categories.ts'), 'utf8');
  const re = /slug\s*:\s*\{\s*ru\s*:\s*'([^']+)'\s*,\s*en\s*:\s*'([^']+)'\s*\}/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) out.push({ ru: m[1], en: m[2] });
  return out;
}

function readDescriptionIds() {
  const src = fs.readFileSync(path.join(root, 'data', 'descriptions.ts'), 'utf8');
  return [...src.matchAll(/^\s*(\d+):\s*\{/gm)].map((m) => Number(m[1]));
}
