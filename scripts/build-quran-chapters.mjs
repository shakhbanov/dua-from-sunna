#!/usr/bin/env node
/**
 * Generate data/quran/*.ts from duas-iz-korana.md.
 *
 * The reference document is the source of truth for the Arabic, the Russian
 * meaning and the arrangement (109 duas in mushaf order, grouped by sura).
 * Two hand-authored side files supply what it does not carry:
 *
 *   data/quran/en.json       — English title / context / meaning / when-to-read
 *   data/quran/glosses.json  — word-by-word [ru, en] pair per Arabic token
 *
 * Arabic is never retyped: tokens come from splitting the reference on
 * whitespace, so the generated files cannot drift from the document. A gloss
 * list whose length does not match the token count fails the build.
 *
 *   node scripts/build-quran-chapters.mjs             # write the chapter files
 *   node scripts/build-quran-chapters.mjs --skeleton N  # print tokens of dua N
 *   node scripts/build-quran-chapters.mjs --check       # report gloss coverage
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const REFERENCE = path.join(root, 'duas-iz-korana.md');
const OUT_DIR = path.join(root, 'data', 'quran');
const VERSE_MARK = '۝';
// Recitation pause marks (waqf). They guide the reciter, they are not words,
// so they never get a cell in the word grid.
const WAQF = new Set(['ۖ', 'ۗ', 'ۘ', 'ۙ', 'ۚ', 'ۛ', 'ۜ', '۞', 'ۭ']);

// --- Sura sections: Russian name comes from the document, English from here ---

const SURA_EN = {
  1: 'al-Fatihah', 2: 'al-Baqarah', 3: "Al 'Imran", 4: 'an-Nisa', 5: "al-Ma'idah",
  6: "al-An'am", 7: "al-A'raf", 9: 'at-Tawbah', 10: 'Yunus', 11: 'Hud', 12: 'Yusuf',
  14: 'Ibrahim', 17: 'al-Isra', 18: 'al-Kahf', 19: 'Maryam', 20: 'Ta Ha',
  21: "al-Anbiya", 23: "al-Mu'minun", 25: 'al-Furqan', 26: "ash-Shu'ara",
  27: 'an-Naml', 28: 'al-Qasas', 29: "al-'Ankabut", 37: 'as-Saffat', 38: 'Sad',
  39: 'az-Zumar', 40: 'Ghafir', 43: 'az-Zukhruf', 44: 'ad-Dukhan', 46: 'al-Ahqaf',
  54: 'al-Qamar', 59: 'al-Hashr', 60: 'al-Mumtahanah', 66: 'at-Tahrim', 71: 'Nuh',
  113: 'al-Falaq', 114: 'an-Nas',
};

// Slug stems per sura, RU transliterated / EN romanised.
const SURA_SLUG = {
  1: ['al-fatiha', 'al-fatihah'], 2: ['al-bakara', 'al-baqarah'], 3: ['al-imran', 'al-imran'],
  4: ['an-nisa', 'an-nisa'], 5: ['al-maida', 'al-maidah'], 6: ['al-anam', 'al-anam'],
  7: ['al-araf', 'al-araf'], 9: ['at-tauba', 'at-tawbah'], 10: ['yunus', 'yunus'],
  11: ['hud', 'hud'], 12: ['yusuf', 'yusuf'], 14: ['ibrahim', 'ibrahim'],
  17: ['al-isra', 'al-isra'], 18: ['al-kahf', 'al-kahf'], 19: ['maryam', 'maryam'],
  20: ['ta-ha', 'ta-ha'], 21: ['al-anbiya', 'al-anbiya'], 23: ['al-muminun', 'al-muminun'],
  25: ['al-furkan', 'al-furqan'], 26: ['ash-shuara', 'ash-shuara'], 27: ['an-naml', 'an-naml'],
  28: ['al-kasas', 'al-qasas'], 29: ['al-ankabut', 'al-ankabut'], 37: ['as-saffat', 'as-saffat'],
  38: ['sad', 'sad'], 39: ['az-zumar', 'az-zumar'], 40: ['gafir', 'ghafir'],
  43: ['az-zuhruf', 'az-zukhruf'], 44: ['ad-duhan', 'ad-dukhan'], 46: ['al-ahkaf', 'al-ahqaf'],
  54: ['al-kamar', 'al-qamar'], 59: ['al-hashr', 'al-hashr'], 60: ['al-mumtahana', 'al-mumtahanah'],
  66: ['at-tahrim', 'at-tahrim'], 71: ['nuh', 'nuh'], 113: ['al-falyak-i-an-nas', 'al-falaq-and-an-nas'],
};

// --- Parse the reference ---

export function parseReference() {
  const src = fs.readFileSync(REFERENCE, 'utf8');
  const body = src.split('# XXXVII. Тематический указатель')[0];

  const headingRe = /^# [IVXL]+\.\s+(.+)$/gm;
  const marks = [];
  let m;
  while ((m = headingRe.exec(body)) !== null) marks.push({ at: m.index, heading: m[1].trim() });
  marks.push({ at: body.length, heading: null });

  const sections = [];
  for (let i = 0; i < marks.length - 1; i++) {
    const chunk = body.slice(marks[i].at, marks[i + 1].at);
    const heading = marks[i].heading;
    const suraNums = [...heading.matchAll(/(\d+)/g)].map((x) => Number(x[1]));
    const duas = [];

    for (const part of chunk.split(/^### /m).slice(1)) {
      const head = part.split('\n', 1)[0].trim();
      const hm = head.match(/^(\d+)\.\s*(.+)$/);
      const num = Number(hm[1]);
      const titleRu = hm[2].trim();

      const refM = part.match(/^\*\*(\d+):([\d–—-]+)\*\*(?:\s*·\s*(.+))?$/m);
      const arM = part.match(/^>\s*(.+)$/m);
      const meanM = part.match(/^\*\*Смысл:\*\*\s*(.+)$/m);
      const whenM = part.match(/^\*\*Когда читают:\*\*\s*(.+)$/m);

      let sura, ayahFrom, ayahTo;
      if (refM) {
        sura = Number(refM[1]);
        const range = refM[2].split(/[–—-]/).map(Number);
        ayahFrom = range[0];
        ayahTo = range.length > 1 ? range[1] : undefined;
      } else {
        // The two protective surahs are given whole, named in the title.
        sura = Number(titleRu.match(/\((\d+)\)/)[1]);
        ayahFrom = 1;
        ayahTo = sura === 113 ? 5 : 6;
      }

      duas.push({
        num,
        titleRu,
        sura,
        ayahFrom,
        ayahTo,
        contextRu: refM && refM[3] ? refM[3].trim() : null,
        arabic: arM[1].trim(),
        meaningRu: meanM[1].trim(),
        whenRu: whenM ? whenM[1].trim() : null,
        tokens: arM[1].trim().split(/\s+/).filter((t) => !WAQF.has(t)),
      });
    }
    sections.push({ heading, suraNums, duas });
  }
  return sections;
}

export const words = (tokens) => tokens.filter((t) => t !== VERSE_MARK);

// --- CLI modes that do not write ---

const argv = process.argv.slice(2);
const sections = parseReference();
const allDuas = sections.flatMap((s) => s.duas);

if (argv[0] === '--skeleton') {
  const want = new Set(argv.slice(1).map(Number));
  for (const d of allDuas) {
    if (want.size && !want.has(d.num)) continue;
    console.log(`\n### ${d.num} — ${d.sura}:${d.ayahFrom}${d.ayahTo ? '-' + d.ayahTo : ''} — ${d.titleRu}`);
    if (d.contextRu) console.log(`C: ${d.contextRu}`);
    console.log(`M: ${d.meaningRu}`);
    if (d.whenRu) console.log(`W: ${d.whenRu}`);
    words(d.tokens).forEach((t, i) => console.log(`${String(i).padStart(3)} ${t}`));
  }
  process.exit(0);
}

const readJson = (name) => {
  const p = path.join(OUT_DIR, name);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
};

const en = readJson('en.json');
const glosses = readJson('glosses.json');

if (argv[0] === '--check') {
  let missingEn = [], missingGloss = [], badLen = [];
  for (const d of allDuas) {
    if (!en[d.num]) missingEn.push(d.num);
    const g = glosses[d.num];
    if (!g) missingGloss.push(d.num);
    else if (g.length !== words(d.tokens).length) badLen.push(`${d.num}(${g.length}≠${words(d.tokens).length})`);
  }
  const done = allDuas.length - missingGloss.length - badLen.length;
  console.log(`en.json:      ${allDuas.length - missingEn.length}/${allDuas.length}`);
  console.log(`glosses.json: ${done}/${allDuas.length} дуа, ${Object.values(glosses).flat().length}/${allDuas.reduce((n, d) => n + words(d.tokens).length, 0)} слов`);
  if (missingEn.length) console.log('  нет en:', missingEn.join(','));
  if (missingGloss.length) console.log('  нет глосс:', missingGloss.join(','));
  if (badLen.length) console.log('  ✗ длина не сходится:', badLen.join(', '));
  process.exit(badLen.length ? 1 : 0);
}

// --- Emit ---

const q = (s) => JSON.stringify(String(s));

function arabicIndic(n) {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

function syncLines(dua) {
  const g = glosses[dua.num];
  const w = words(dua.tokens);
  if (!g) throw new Error(`dua ${dua.num}: no glosses`);
  if (g.length !== w.length)
    throw new Error(`dua ${dua.num}: ${g.length} glosses for ${w.length} words`);

  const lines = [];
  let wi = 0;
  // Verse ornaments close the ayah they follow, counting up from ayahFrom.
  let ayah = dua.ayahFrom;
  for (const tok of dua.tokens) {
    if (tok === VERSE_MARK) {
      const label = `${VERSE_MARK} ${arabicIndic(ayah)}`;
      lines.push(
        `        { text: ${q(label)}, trans: { ru: ${q('аят ' + ayah)}, en: ${q('ayah ' + ayah)} }, start: 0, end: 0, isVerseEnd: true },`
      );
      ayah++;
      continue;
    }
    const [ru, enGloss] = g[wi++];
    lines.push(
      `        { text: ${q(tok)}, trans: { ru: ${q(ru)}, en: ${q(enGloss)} }, start: 0, end: 0 },`
    );
  }
  return lines;
}

function ayahLabel(d) {
  return d.ayahTo && d.ayahTo !== d.ayahFrom ? `${d.ayahFrom}–${d.ayahTo}` : `${d.ayahFrom}`;
}

function chapterFile(section, index) {
  const id = 2001 + index;
  const primary = section.suraNums[0];
  const nameRu = section.heading.match(/«([^»]+)»/)[1];
  const isPair = section.suraNums.length > 1;

  const titleRu = isPair
    ? `Дуа из сур «Аль-Фаляк» и «Ан-Нас» (113–114)`
    : `Дуа из суры «${nameRu}» (${primary})`;
  const titleEn = isPair
    ? `Duas from Surahs al-Falaq and an-Nas (113–114)`
    : `Duas from Surah ${SURA_EN[primary]} (${primary})`;

  const [slugRu, slugEn] = SURA_SLUG[primary];
  const count = section.duas.length;
  const descRu = `${count} ${plural(count, 'мольба', 'мольбы', 'мольб')} из суры «${nameRu}» — арабский текст, пословный перевод и смысл каждой дуа с указанием аята.`;
  const descEn = `${count} supplication${count === 1 ? '' : 's'} from Surah ${isPair ? 'al-Falaq and an-Nas' : SURA_EN[primary]} — Arabic text, word-by-word translation and the meaning of each dua with its ayah reference.`;

  const out = [];
  out.push(`// Generated by scripts/build-quran-chapters.mjs from duas-iz-korana.md.`);
  out.push(`// Edit the reference document or data/quran/{en,glosses}.json, then re-run it.`);
  out.push(``);
  out.push(`import { ChapterData } from '../../types';`);
  out.push(``);
  out.push(`export const QURAN_CHAPTER_${id}: ChapterData = {`);
  out.push(`  id: ${id},`);
  out.push(`  collection: 'quran',`);
  out.push(`  title: { ru: ${q(titleRu)}, en: ${q(titleEn)} },`);
  out.push(`  description: { ru: ${q(descRu)}, en: ${q(descEn)} },`);
  out.push(`  duas: [`);

  for (const d of section.duas) {
    const e = en[d.num];
    if (!e) throw new Error(`dua ${d.num}: no English strings`);
    out.push(`    {`);
    out.push(`      id: "${id}-${d.num}",`);
    out.push(`      title: { ru: ${q(d.titleRu)}, en: ${q(e.title)} },`);
    if (d.contextRu || e.context) {
      out.push(`      narration: { ru: ${q(d.contextRu ?? '')}, en: ${q(e.context ?? '')} },`);
    }
    out.push(`      fullTranslation: { ru: ${q(d.meaningRu)}, en: ${q(e.meaning)} },`);
    if (d.whenRu || e.when) {
      out.push(`      note: { ru: ${q('Когда читают: ' + d.whenRu)}, en: ${q('When to recite: ' + e.when)} },`);
    }
    out.push(`      source: { ru: ${q(`Коран, ${d.sura}:${ayahLabel(d)}`)}, en: ${q(`Quran ${d.sura}:${ayahLabel(d)}`)} },`);
    out.push(
      `      ref: { sura: ${d.sura}, ayahFrom: ${d.ayahFrom}${d.ayahTo && d.ayahTo !== d.ayahFrom ? `, ayahTo: ${d.ayahTo}` : ''} },`
    );
    out.push(`      sync: [`);
    out.push(...syncLines(d));
    out.push(`      ],`);
    out.push(`    },`);
  }

  out.push(`  ],`);
  out.push(`};`);
  out.push(``);

  const fileSlug = isPair ? 'al-falaq-and-an-nas' : SURA_SLUG[primary][1];
  return {
    id,
    filename: `${id}-surah-${String(primary).padStart(3, '0')}-${fileSlug}.ts`,
    contents: out.join('\n'),
    slugRu: `dua-iz-sury-${slugRu}`,
    slugEn: `duas-from-surah-${slugEn}`,
    titleRu,
    titleEn,
  };
}

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

// Wipe the previously generated chapter files so a renamed sura cannot linger.
for (const f of fs.readdirSync(OUT_DIR)) {
  if (/^\d{4}-.*\.ts$/.test(f)) fs.unlinkSync(path.join(OUT_DIR, f));
}

const built = sections.map(chapterFile);
for (const c of built) {
  fs.writeFileSync(path.join(OUT_DIR, c.filename), c.contents, 'utf8');
}

const indexLines = [
  '// Generated by scripts/build-quran-chapters.mjs. Do not edit by hand.',
  '//',
  '// Quranic supplications, arranged in mushaf order and grouped by sura, as',
  '// laid out in duas-iz-korana.md. Chapter ids live in the 2000+ range so they',
  '// never collide with the 1..134 ids of the Sunnah collection.',
  '',
  "import type { ChapterData } from '../../types';",
  ...built.map((c) => `import { QURAN_CHAPTER_${c.id} } from './${c.filename.replace(/\.ts$/, '')}';`),
  '',
  'export const QURAN_DATABASE: ChapterData[] = [',
  ...built.map((c) => `  QURAN_CHAPTER_${c.id},`),
  '];',
  '',
];
fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), indexLines.join('\n'), 'utf8');

const slugLines = [
  '// Generated by scripts/build-quran-chapters.mjs. Do not edit by hand.',
  '//',
  '// Slugs for the Quranic supplications collection — one landing page per sura.',
  '',
  'export interface ChapterSlugs {',
  '  ru: string;',
  '  en: string;',
  '}',
  '',
  'export const QURAN_CHAPTER_SLUGS: Record<number, ChapterSlugs> = {',
  ...built.map((c) => `  ${c.id}: { ru: ${q(c.slugRu)}, en: ${q(c.slugEn)} }, // ${c.titleRu}`),
  '};',
  '',
  'export function getQuranChapterSlug(id: number, lang: "ru" | "en"): string {',
  '  const s = QURAN_CHAPTER_SLUGS[id];',
  '  if (!s) throw new Error(`No Quran slug for chapter ${id}`);',
  '  return s[lang];',
  '}',
  '',
];
fs.writeFileSync(path.join(root, 'data', 'quranSlugs.ts'), slugLines.join('\n'), 'utf8');

const duaCount = allDuas.length;
const wordCount = allDuas.reduce((n, d) => n + words(d.tokens).length, 0);
console.log(`✓ ${built.length} глав, ${duaCount} дуа, ${wordCount} слов пословного перевода`);
