#!/usr/bin/env node
/**
 * Every audioUrl in the data must actually serve audio.
 *
 * This check exists because the recordings were moved inside the bucket and
 * every one of the 300 URLs in the data kept pointing at the old prefix — the
 * players on the live site went silent, and nothing noticed. The SEO checks
 * cannot catch it: they are deliberately offline.
 *
 *   node scripts/check-audio-urls.mjs            # check them all
 *   node scripts/check-audio-urls.mjs --quiet    # only report the broken ones
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const quiet = process.argv.includes('--quiet');
const CONCURRENCY = 6;
const ATTEMPTS = 3;

const sources = [];
for (const dir of ['data/chapters', 'data/quran', 'data/nawawi']) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) continue;
  for (const name of fs.readdirSync(full)) {
    if (name.endsWith('.ts')) sources.push(path.join(full, name));
  }
}

const urls = new Map(); // url -> the files that reference it
for (const file of sources) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/audioUrl: "([^"]+)"/g)) {
    const where = path.relative(root, file);
    urls.set(m[1], [...(urls.get(m[1]) ?? []), where]);
  }
}

if (urls.size === 0) {
  console.log('No audioUrl found in the data — nothing to check.');
  process.exit(0);
}

console.log(`Checking ${urls.size} distinct recordings…`);

const list = [...urls.keys()];
const broken = [];
let done = 0;

async function probe(u) {
  // A ranged GET, not HEAD: some S3 gateways answer HEAD differently from the
  // request a browser's <audio> element actually makes. A connection that
  // times out is the bucket throttling this very check, not a missing file,
  // so it is tried again before being called broken.
  let why = null;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(u, { headers: { Range: 'bytes=0-0' } });
      if (res.status === 200 || res.status === 206) { why = null; break; }
      why = String(res.status);
      if (res.status < 500) break; // a refusal repeats; an overload may not
    } catch (err) {
      why = err.cause?.code ?? err.message;
    }
    if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, 500 * attempt));
  }
  if (why) broken.push([u, why]);
  else if (!quiet && done % 50 === 0) process.stdout.write(`  ${done}/${list.length}\r`);
  done++;
}

const queue = list.slice();
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await probe(queue.pop());
  })
);

if (broken.length === 0) {
  console.log(`✓ all ${urls.size} recordings play`);
  process.exit(0);
}

broken.sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }));
console.error(`\n✗ ${broken.length} of ${urls.size} recordings do not play:\n`);
for (const [u, why] of broken) {
  console.error(`  ${why}  ${u}`);
  if (!quiet) console.error(`        referenced by ${urls.get(u).join(', ')}`);
}
process.exit(1);
