#!/usr/bin/env node
// Ping IndexNow (Bing + Yandex) to re-index all site URLs.
// Run after a successful deploy. Reads URLs from dist/sitemap.xml.
// Google does not support IndexNow — for Google, rely on GSC sitemap auto-ping.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const HOST = 'dua.shakhbanov.org';
const KEY = '12c3d0c1697d4c5398d60158271c3f62';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// --- Collect URLs from sitemap ---

const sitemapPath = path.join(root, 'dist', 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('✗ dist/sitemap.xml not found. Run `npm run build` first.');
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (urls.length === 0) {
  console.error('✗ No URLs found in sitemap.');
  process.exit(1);
}

console.log(`→ Pinging IndexNow with ${urls.length} URLs...`);

// --- POST to IndexNow endpoint ---
// IndexNow spec: https://www.indexnow.org/documentation
// Bing endpoint accepts up to 10k URLs per request; Yandex accepts fewer — we
// split into 1000-URL batches to be safe for both.

const ENDPOINTS = [
  'https://api.indexnow.org/IndexNow',
  'https://yandex.com/indexnow',
];

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
  return { status: res.status, endpoint, count: batch.length };
}

const BATCH_SIZE = 1000;
const batches = [];
for (let i = 0; i < urls.length; i += BATCH_SIZE) {
  batches.push(urls.slice(i, i + BATCH_SIZE));
}

for (const endpoint of ENDPOINTS) {
  for (const batch of batches) {
    try {
      const r = await submitBatch(endpoint, batch);
      const ok = r.status >= 200 && r.status < 300;
      console.log(`  ${ok ? '✓' : '✗'} ${endpoint} — HTTP ${r.status} (${r.count} URLs)`);
    } catch (err) {
      console.error(`  ✗ ${endpoint} — ${err.message}`);
    }
  }
}

console.log('\nDone. Note: IndexNow is accepted by Bing and Yandex. Google uses GSC sitemap pings (automatic on sitemap update).');
