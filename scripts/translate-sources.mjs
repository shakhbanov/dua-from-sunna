#!/usr/bin/env node
/**
 * One-shot migration: convert every `source: "..."` Russian string literal in
 * data/chapters/*.ts into a bilingual `source: { ru: "...", en: "..." }` object.
 *
 * Transliterates Russian hadith source citations into English using a curated
 * mapping table. Common forms handled:
 *   - "аль-Бухари 6312"              → "al-Bukhari 6312"
 *   - "Муслим 2711"                  → "Muslim 2711"
 *   - "Сахих Сунан ат-Тирмизи 3/182" → "Sahih Sunan at-Tirmidhi 3/182"
 *   - "Коран 3:190"                  → "Qur'an 3:190"
 *   - etc.
 *
 * Idempotent: skips files whose source fields are already objects.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const chaptersDir = path.join(root, 'data', 'chapters');

// Order matters: longer patterns first to avoid partial matches.
// Patterns are applied sequentially.
const REPLACEMENTS = [
  // Compilations (check before their component words)
  [/Сахих Сунан ат-Тирмизи/g, 'Sahih Sunan at-Tirmidhi'],
  [/Сахих Сунан Абу Дауд/g, 'Sahih Sunan Abi Dawud'],
  [/Сахих Сунан Ибн Маджа/g, 'Sahih Sunan Ibn Majah'],
  [/Сахих Сунан ан-Наса[’'‘]и/g, "Sahih Sunan an-Nasa'i"],
  [/Сахих Ибн Маджа/g, 'Sahih Ibn Majah'],
  [/Сахих Ибн Хузайма/g, 'Sahih Ibn Khuzayma'],
  [/Сахих аль-Джами[‘'‛]? ас-сагир/g, "Sahih al-Jami‘ as-saghir"],
  [/Сахих аль-Джами[‘'‛]/g, "Sahih al-Jami‘"],
  [/Сахих аль-Калим ат-таййиб/g, 'Sahih al-Kalim at-Tayyib'],
  [/Сахих аль-Адаб аль-муфрад/g, 'Sahih al-Adab al-Mufrad'],
  [/Сахих ат-таргиб ва-т-тархиб/g, 'Sahih at-Targhib wa-t-Tarhib'],
  [/Сильсиля ас-сахиха/g, 'Silsilah as-Sahihah'],
  [/Сильсиля ад-да[‘'‛]ифа/g, "Silsilah ad-Da‘ifah"],
  [/Аль-Адаб аль-муфрад/g, 'al-Adab al-Mufrad'],
  [/Аль-Муватта[’']?/g, "al-Muwatta'"],
  [/Фатх аль-Бари/g, 'Fath al-Bari'],
  [/Маджма[‘'‛] аз-заваид/g, "Majma‘ az-zawaid"],
  [/Шу[‘'‛]аб аль-иман/g, "Shu‘ab al-iman"],
  [/[‘'‛]Амаль аль-йаум ва-ль-лейля/g, "‘Amal al-yawm wa-l-laylah"],
  [/[‘'‛]Амаль аль-йаум/g, "‘Amal al-yawm"],
  [/Ирва[’'‛]? аль-галиль/g, "Irwa' al-Ghalil"],
  [/Мусаннаф [‘'‛]Абд ар-Раззак/g, 'Musannaf ‘Abd ar-Razzaq'],
  [/Мустадрак/g, 'al-Mustadrak'],

  // Primary collections
  [/аль-Бухари/g, 'al-Bukhari'],
  [/Муслим/g, 'Muslim'],
  [/Абу Дауд/g, 'Abu Dawud'],
  [/ат-Тирмизи/g, 'at-Tirmidhi'],
  [/Ибн Маджа/g, 'Ibn Majah'],
  [/ан-Наса[’'‛]?и/g, "an-Nasa'i"],
  [/Ахмад/g, 'Ahmad'],
  [/Малик/g, 'Malik'],
  [/ад-Дарими/g, 'ad-Darimi'],
  [/ад-Даракутни/g, 'ad-Daraqutni'],
  [/аль-Хаким/g, 'al-Hakim'],
  [/Ибн ас-Сунни/g, 'Ibn as-Sunni'],
  [/Ибн Хиббан/g, 'Ibn Hibban'],
  [/Ибн Хузайма/g, 'Ibn Khuzayma'],
  [/аль-Байхаки/g, 'al-Bayhaqi'],
  [/ат-Табарани/g, 'at-Tabarani'],
  [/аль-Мунзири/g, 'al-Mundhiri'],
  [/ан-Навави/g, 'an-Nawawi'],
  [/Ибн Таймийя/g, 'Ibn Taymiyyah'],
  [/Ибн аль-Джаузи/g, 'Ibn al-Jawzi'],
  [/Ибн Хаджар/g, 'Ibn Hajar'],

  // Books
  [/Коран/g, "Qur'an"],
  [/Сунан/g, 'Sunan'],
  [/Муснад/g, 'Musnad'],
  [/Сборник/g, 'Compilation'],

  // Particles still in Russian — safety cleanup
  [/ва-ль-лейля/g, 'wa-l-laylah'],
  [/ва-ль-/g, 'wa-l-'],
  [/ва-т-/g, 'wa-t-'],
  [/ас-сахих[ае]я?/g, 'as-Sahihah'],
];

function translateSource(ru) {
  let out = ru;
  for (const [re, rep] of REPLACEMENTS) {
    out = out.replace(re, rep);
  }
  // Collapse repeated spaces, trim
  return out.replace(/\s+/g, ' ').trim();
}

// Regex that captures `source: "…"` (single quotes too) and is NOT already an object.
// Only matches string literals, not nested braces. Multiline not required (single line source).
const SOURCE_STRING_RE = /source:\s*(["'])((?:(?!\1).)*?)\1/g;

function rewriteFile(filepath) {
  const src = fs.readFileSync(filepath, 'utf8');
  let updatedCount = 0;
  const next = src.replace(SOURCE_STRING_RE, (match, quote, inner) => {
    // Skip if inner starts with { (should not happen but be safe)
    if (inner.trim().startsWith('{')) return match;
    const en = translateSource(inner);
    updatedCount++;
    // Use same quote style as original; escape inner quotes of opposite kind intact.
    const ruEsc = inner.replace(/"/g, '\\"');
    const enEsc = en.replace(/"/g, '\\"');
    return `source: { ru: "${ruEsc}", en: "${enEsc}" }`;
  });
  if (updatedCount > 0) {
    fs.writeFileSync(filepath, next, 'utf8');
  }
  return updatedCount;
}

const files = fs.readdirSync(chaptersDir)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => path.join(chaptersDir, f))
  .sort();

let totalUpdated = 0;
let filesTouched = 0;
for (const f of files) {
  const n = rewriteFile(f);
  if (n > 0) {
    filesTouched++;
    totalUpdated += n;
    console.log(`✓ ${path.basename(f)}  (${n} source${n > 1 ? 's' : ''})`);
  }
}
console.log(`\nTotal: ${totalUpdated} source fields across ${filesTouched} files`);
