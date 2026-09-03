#!/usr/bin/env node
/**
 * Generate data/nawawi/*.ts from data/nawawi/source/NN.json.
 *
 * One JSON file per hadith of al-Arba‘un an-Nawawiyyah, numbered the way the
 * collection itself numbers them. Each file is the single source of truth for
 * its hadith: the Arabic matn exists only as the `words` list, so the running
 * text and the word-by-word grid cannot drift apart — the running text is
 * derived by joining the very tokens the grid renders.
 *
 * Chapter ids are 3000 + hadith number, keeping them clear of the Sunnah
 * collection (1..134) and the Quranic one (2001+).
 *
 *   node scripts/build-nawawi-chapters.mjs           # write the chapter files
 *   node scripts/build-nawawi-chapters.mjs --check   # validate the sources only
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SRC_DIR = path.join(root, 'data', 'nawawi', 'source');
const OUT_DIR = path.join(root, 'data', 'nawawi');
const SLUGS_FILE = path.join(root, 'data', 'nawawiSlugs.ts');
const ID_BASE = 3000;

const checkOnly = process.argv.includes('--check');

// --- Load ---------------------------------------------------------------

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Source directory missing: ${path.relative(root, SRC_DIR)}`);
  process.exit(1);
}

const files = fs
  .readdirSync(SRC_DIR)
  .filter((n) => n.endsWith('.json'))
  .sort();

if (files.length === 0) {
  console.error(`No hadith sources in ${path.relative(root, SRC_DIR)}`);
  process.exit(1);
}

const errors = [];
const hadiths = [];

for (const name of files) {
  const file = path.join(SRC_DIR, name);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${name}: not valid JSON — ${e.message}`);
    continue;
  }
  data.__file = name;
  hadiths.push(data);
}

// --- Validate -----------------------------------------------------------

const BILINGUAL = ['title', 'narration', 'translation', 'source'];
const seenNumbers = new Set();
const seenSlugs = { ru: new Set(), en: new Set() };

for (const h of hadiths) {
  const where = h.__file;

  if (!Number.isInteger(h.number) || h.number < 1) {
    errors.push(`${where}: "number" must be a positive integer`);
  } else if (seenNumbers.has(h.number)) {
    errors.push(`${where}: hadith number ${h.number} is used twice`);
  } else {
    seenNumbers.add(h.number);
  }

  const expected = `${String(h.number).padStart(2, '0')}.json`;
  if (Number.isInteger(h.number) && where !== expected) {
    errors.push(`${where}: hadith ${h.number} must live in ${expected}`);
  }

  for (const field of BILINGUAL) {
    const v = h[field];
    if (!v || typeof v.ru !== 'string' || typeof v.en !== 'string' || !v.ru.trim() || !v.en.trim()) {
      errors.push(`${where}: "${field}" needs a non-empty ru and en string`);
    }
  }

  if (h.note !== undefined) {
    if (!h.note || !h.note.ru?.trim() || !h.note.en?.trim()) {
      errors.push(`${where}: "note" is present but not bilingual`);
    }
  }

  for (const lang of ['ru', 'en']) {
    const slug = h.slug?.[lang];
    if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      errors.push(`${where}: slug.${lang} must be lowercase latin words joined by hyphens`);
      continue;
    }
    if (seenSlugs[lang].has(slug)) errors.push(`${where}: slug.${lang} "${slug}" is used twice`);
    seenSlugs[lang].add(slug);
  }

  if (!Array.isArray(h.words) || h.words.length === 0) {
    errors.push(`${where}: "words" must be a non-empty array`);
    continue;
  }
  h.words.forEach((w, i) => {
    if (!Array.isArray(w) || w.length !== 3) {
      errors.push(`${where}: word ${i + 1} must be [arabic, ru, en]`);
      return;
    }
    const [ar, ru, en] = w;
    // Arabic block, plus the presentation forms: the ﷺ ligature that follows
    // the Prophet's name in printed editions is a single glyph at U+FDFA and
    // gets one cell in the grid, not four.
    if (typeof ar !== 'string' || !/[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(ar)) {
      errors.push(`${where}: word ${i + 1} carries no Arabic`);
    }
    if (/\s/.test(ar)) {
      errors.push(`${where}: word ${i + 1} ("${ar}") contains whitespace — one token per entry`);
    }
    if (typeof ru !== 'string' || !ru.trim()) errors.push(`${where}: word ${i + 1} has no Russian gloss`);
    if (typeof en !== 'string' || !en.trim()) errors.push(`${where}: word ${i + 1} has no English gloss`);
  });
}

// The collection is numbered 1..N without gaps; a missing file is a missing
// hadith, and silently shipping 41 of them would be worse than failing here.
const maxNumber = Math.max(...[...seenNumbers]);
for (let n = 1; n <= maxNumber; n++) {
  if (!seenNumbers.has(n)) errors.push(`hadith ${n} is missing (expected ${String(n).padStart(2, '0')}.json)`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s) in the hadith sources:\n`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}

hadiths.sort((a, b) => a.number - b.number);

if (checkOnly) {
  const words = hadiths.reduce((n, h) => n + h.words.length, 0);
  console.log(`ok: ${hadiths.length} hadiths, ${words} Arabic tokens, every gloss present in ru and en`);
  process.exit(0);
}

// --- Emit ---------------------------------------------------------------

const q = (s) => JSON.stringify(s);
const bilingual = (v) => `{ ru: ${q(v.ru)}, en: ${q(v.en)} }`;

const written = [];

for (const h of hadiths) {
  const id = ID_BASE + h.number;
  const nn = String(h.number).padStart(2, '0');
  const base = `${id}-hadith-${nn}-${h.slug.en}`;
  const constName = `NAWAWI_CHAPTER_${id}`;

  const lines = [];
  lines.push(`// Generated by scripts/build-nawawi-chapters.mjs from data/nawawi/source/${h.__file}.`);
  lines.push('// Edit that source file and re-run the script; do not edit this one.');
  lines.push('');
  lines.push(`import { ChapterData } from '../../types';`);
  lines.push('');
  lines.push(`export const ${constName}: ChapterData = {`);
  lines.push(`  id: ${id},`);
  lines.push(`  collection: 'nawawi',`);
  lines.push(`  title: ${bilingual(h.title)},`);
  lines.push(`  duas: [`);
  lines.push(`    {`);
  lines.push(`      id: ${q(`${id}-1`)},`);
  lines.push(`      narration: ${bilingual(h.narration)},`);
  lines.push(`      fullTranslation: ${bilingual(h.translation)},`);
  if (h.note) lines.push(`      note: ${bilingual(h.note)},`);
  lines.push(`      source: ${bilingual(h.source)},`);
  lines.push(`      sync: [`);
  for (const [ar, ru, en] of h.words) {
    lines.push(`        { text: ${q(ar)}, trans: { ru: ${q(ru)}, en: ${q(en)} }, start: 0, end: 0 },`);
  }
  lines.push(`      ],`);
  lines.push(`    },`);
  lines.push(`  ],`);
  lines.push(`};`);
  lines.push('');

  fs.writeFileSync(path.join(OUT_DIR, `${base}.ts`), lines.join('\n'), 'utf8');
  written.push({ id, base, constName, hadith: h });
}

// Drop chapter files left behind by a renamed slug, so the directory always
// describes the sources exactly.
for (const name of fs.readdirSync(OUT_DIR)) {
  if (!/^\d{4}-hadith-/.test(name)) continue;
  if (!written.some((w) => `${w.base}.ts` === name)) fs.unlinkSync(path.join(OUT_DIR, name));
}

// index.ts
{
  const lines = [];
  lines.push('// Generated by scripts/build-nawawi-chapters.mjs. Do not edit by hand.');
  lines.push('//');
  lines.push("// The Forty Hadith of Imam an-Nawawi — one chapter per hadith, in the");
  lines.push('// order of the collection. Chapter ids are 3000 + the hadith number, so');
  lines.push('// they never collide with the Sunnah (1..134) or Quranic (2001+) chapters.');
  lines.push('');
  lines.push(`import type { ChapterData } from '../../types';`);
  for (const w of written) lines.push(`import { ${w.constName} } from './${w.base}';`);
  lines.push('');
  lines.push('export const NAWAWI_DATABASE: ChapterData[] = [');
  for (const w of written) lines.push(`  ${w.constName},`);
  lines.push('];');
  lines.push('');
  fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), lines.join('\n'), 'utf8');
}

// nawawiSlugs.ts
{
  const lines = [];
  lines.push('// Generated by scripts/build-nawawi-chapters.mjs. Do not edit by hand.');
  lines.push('//');
  lines.push('// Slugs for the Forty Hadith collection — one page per hadith.');
  lines.push('');
  lines.push('export interface ChapterSlugs {');
  lines.push('  ru: string;');
  lines.push('  en: string;');
  lines.push('}');
  lines.push('');
  lines.push('export const NAWAWI_CHAPTER_SLUGS: Record<number, ChapterSlugs> = {');
  for (const w of written) {
    const h = w.hadith;
    lines.push(
      `  ${w.id}: { ru: ${q(`hadis-${h.number}-${h.slug.ru}`)}, en: ${q(`hadith-${h.number}-${h.slug.en}`)} }, // ${h.title.ru}`
    );
  }
  lines.push('};');
  lines.push('');
  fs.writeFileSync(SLUGS_FILE, lines.join('\n'), 'utf8');
}

const tokens = hadiths.reduce((n, h) => n + h.words.length, 0);
console.log(`Wrote ${written.length} chapters (${tokens} Arabic tokens) to data/nawawi/ and data/nawawiSlugs.ts`);
