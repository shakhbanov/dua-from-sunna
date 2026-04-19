#!/usr/bin/env node
/**
 * Second pass: fix residual Cyrillic fragments inside `en: "..."` of
 * `source: { ru: "...", en: "..." }` objects that the first-pass script missed.
 * Idempotent — each run re-applies the substitution set; anything already
 * English stays as-is.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const chaptersDir = path.join(root, 'data', 'chapters');

const REPLACEMENTS = [
  // Compilations / books — check longest first
  [/Сахих Сунан Аби Дауд/g, 'Sahih Sunan Abi Dawud'],
  [/Сахих Сунан ан-Наса[’'‛]?и/g, "Sahih Sunan an-Nasa'i"],
  [/Сахих Сунан Ибн Маджа/g, 'Sahih Sunan Ibn Majah'],
  [/Сахих Сунан ат-Тирмизи/g, 'Sahih Sunan at-Tirmidhi'],
  [/Сахих Сунан Абу Дауд/g, 'Sahih Sunan Abi Dawud'],
  [/Сахих аль-[Дд]жами[‘'‛]?( ас-сагир)?/g, (m, suffix) => `Sahih al-Jami‘${suffix ? ' as-saghir' : ''}`],
  [/Сахих аль-Калим ат-таййиб/g, 'Sahih al-Kalim at-Tayyib'],
  [/Сахих аль-Адаб аль-муфрад/g, 'Sahih al-Adab al-Mufrad'],
  [/Сахих ат-таргиб ва-т-тархиб/g, 'Sahih at-Targhib wa-t-Tarhib'],
  [/Сахих Ибн Хузайма/g, 'Sahih Ibn Khuzayma'],
  [/Сахих Ибн Маджа/g, 'Sahih Ibn Majah'],
  [/Сильсиля ас-сахиха/g, 'Silsilah as-Sahihah'],
  [/Сильсиля ад-да[‘'‛]ифа/g, "Silsilah ad-Da‘ifah"],
  [/Аль-Адаб аль-муфрад/g, 'al-Adab al-Mufrad'],
  [/аль-Калим ат-таййиб/g, 'al-Kalim at-Tayyib'],
  [/Аль-Муватта[’']?/g, "al-Muwatta'"],
  [/Фатх аль-Бари/g, 'Fath al-Bari'],
  [/Маджма[‘'‛] аз-заваид/g, "Majma‘ az-zawaid"],
  [/Шу[‘'‛]аб аль-иман/g, "Shu‘ab al-iman"],
  [/[‘'‛]Амаль аль-йаум ва-ль-лейля/g, "‘Amal al-yawm wa-l-laylah"],
  [/[‘'‛]Амаль аль-йаум/g, "‘Amal al-yawm"],
  [/Ирва[’'‛]? аль-галиль/g, "Irwa' al-Ghalil"],
  [/Мусаннаф [‘'‛]Абд ар-Раззак/g, 'Musannaf ‘Abd ar-Razzaq'],
  [/Зад аль-ма[‘'‛]ад/g, 'Zad al-Ma‘ad'],
  [/Мустадрак/g, 'al-Mustadrak'],

  // Primary collections — ordered from longest/most specific first
  [/аль-Бухари/g, 'al-Bukhari'],
  [/Муслим/g, 'Muslim'],
  [/Абу Дауд/g, 'Abu Dawud'],
  [/Аби Дауд/g, 'Abi Dawud'],
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
  [/Ибн аль-[ДдКкЧч]айй?им/g, 'Ibn al-Qayyim'],
  [/Ибн Каййим/g, 'Ibn al-Qayyim'],
  [/Ибн Джарир/g, 'Ibn Jarir'],
  [/Ибн аль-Джаузи/g, 'Ibn al-Jawzi'],
  [/Ибн Хаджар/g, 'Ibn Hajar'],
  [/Ибн Касир/g, 'Ibn Kathir'],
  [/Коран/g, "Qur'an"],
  [/Сунан/g, 'Sunan'],
  [/Муснад/g, 'Musnad'],

  // Volume/page references
  [/т\.\s*(\d+),?\s*с\.\s*(\d+)/g, 'vol. $1, p. $2'],
  [/т\.\s*(\d+)/g, 'vol. $1'],
  [/с\.\s*(\d+)/g, 'p. $1'],

  // Works by title (partial, for orphaned remnants)
  [/Сахих маварид аз-зам[‘'‛]ан/g, "Sahih Mawarid az-Zam'an"],
  [/Сахих ат-таргиб ва-т-тархиб/g, 'Sahih at-Targhib wa-t-Tarhib'],
  [/Сахих ат-таргиб/g, 'Sahih at-Targhib'],
  [/аль-[Кк]алим ат-таййиб/g, 'al-Kalim at-Tayyib'],
  [/аль-[Кк]алим/g, 'al-Kalim'],
  [/Хидайат ар-рувват/g, 'Hidayat ar-Ruwat'],
  [/Ахкам аль-джана[’'‛]из/g, "Ahkam al-Jana'iz"],
  [/Сыфат ас-саля[тht]?/g, 'Sifat as-Salat'],
  [/Сыфат/g, 'Sifat'],
  [/Маджма[‘'‛]? аз-заваид/g, "Majma‘ az-zawaid"],
  [/Маджма[‘'‛]/g, "Majma‘"],
  [/Джами[‘'‛]?/g, "Jami‘"],
  [/аль-Албани/g, 'al-Albani'],
  [/Хайсами/g, 'al-Haythami'],
  [/Книга о похоронах/gi, 'Book of Funerals'],
  [/гл\./g, 'ch.'],
  [/см\./g, 'see'],

  // Final standalone tokens
  [/аль-адаб аль-муфрад/gi, 'al-Adab al-Mufrad'],
  [/аль-Азкар/gi, 'al-Adhkar'],
  [/Навави/g, 'Nawawi'],
  [/[‘']Арфаджи/g, "al-‘Arfaji"],
  [/Шарх/g, 'Sharh'],
  [/Сахих/g, 'Sahih'],
  [/Сунан/g, 'Sunan'],

  // Names with curly apostrophe U+2018/U+2019 variants (missed above)
  [/ан-Наса[‘’'‛]?и/g, "an-Nasa'i"],

  // Glue words still in RU after primary swaps
  [/ва-ль-лейля/g, 'wa-l-laylah'],
  [/ва-ль-/g, 'wa-l-'],
  [/ва-т-/g, 'wa-t-'],
];

function translate(en) {
  let out = en;
  for (const [re, rep] of REPLACEMENTS) {
    out = out.replace(re, rep);
  }
  return out.replace(/\s+/g, ' ').trim();
}

// Match `en: "…"` inside `source: { ru: "…", en: "…" }` specifically.
// We scope by first matching the whole source object, then rewriting its `en` portion.
const SOURCE_OBJECT_RE = /source:\s*\{\s*ru:\s*(["'])((?:(?!\1).)*?)\1\s*,\s*en:\s*(["'])((?:(?!\3).)*?)\3\s*\}/g;

function rewriteFile(filepath) {
  const src = fs.readFileSync(filepath, 'utf8');
  let changed = 0;
  const next = src.replace(SOURCE_OBJECT_RE, (match, rq, ru, eq, en) => {
    const newEn = translate(en);
    if (newEn === en) return match;
    changed++;
    const enEsc = newEn.replace(/"/g, '\\"');
    return `source: { ru: ${rq}${ru}${rq}, en: "${enEsc}" }`;
  });
  if (changed > 0) {
    fs.writeFileSync(filepath, next, 'utf8');
  }
  return changed;
}

const files = fs.readdirSync(chaptersDir)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => path.join(chaptersDir, f))
  .sort();

let total = 0;
let touched = 0;
for (const f of files) {
  const n = rewriteFile(f);
  if (n > 0) {
    touched++;
    total += n;
    console.log(`✓ ${path.basename(f)}  (${n})`);
  }
}
console.log(`\nTotal: ${total} en-fields patched across ${touched} files`);
