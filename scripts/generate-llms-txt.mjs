#!/usr/bin/env node
// Generate llms.txt and llms-full.txt from data/chapters/*.ts
// https://llmstxt.org — a markdown file that helps LLM-based search engines
// (ChatGPT, Claude, Perplexity, Gemini) discover, summarize, and cite content.
//
// Parses chapter TS files with regex. The structure is consistent across all
// 134 chapter files — title: { ru, en }, duas: [{ sync, fullTranslation, source }].
// If the shape ever changes, this parser will need to be revisited.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SITE = 'https://dua.shakhbanov.org';

// --- Load slugs (clean-URL paths per chapter) ---

const slugsSrc = fs.readFileSync(path.join(root, 'data', 'slugs.ts'), 'utf8');
const slugRe = /(\d+)\s*:\s*\{\s*ru\s*:\s*"([^"]+)"\s*,\s*en\s*:\s*"([^"]+)"\s*\}/g;
const CHAPTER_SLUGS = new Map();
{
  let m;
  while ((m = slugRe.exec(slugsSrc)) !== null) {
    CHAPTER_SLUGS.set(Number(m[1]), { ru: m[2], en: m[3] });
  }
}
function chapterUrl(id, lang) {
  const slugs = CHAPTER_SLUGS.get(id);
  if (!slugs) return `${SITE}/?chapter=${id}`; // fallback
  return lang === 'ru' ? `${SITE}/${slugs.ru}/` : `${SITE}/en/${slugs.en}/`;
}

// --- Load categories ---

const categoriesSrc = fs.readFileSync(path.join(root, 'data', 'categories.ts'), 'utf8');
const catRe = /id:\s*'([^']+)'[\s\S]*?slug:\s*\{\s*ru:\s*'([^']+)'\s*,\s*en:\s*'([^']+)'\s*\}[\s\S]*?title:\s*\{\s*ru:\s*'([^']+)'\s*,\s*en:\s*"([^"]+)"\s*\}[\s\S]*?summary:\s*\{\s*ru:\s*'([^']+)'\s*,\s*en:\s*'([^']+)'/g;
// The title field has a mix of ' and " quoting, so we use a permissive regex below
const CATEGORIES_INFO = [];
{
  const idRe = /\{\s*id:\s*'([^']+)'/g;
  const slugMatchRe = /slug:\s*\{\s*ru:\s*'([^']+)'\s*,\s*en:\s*'([^']+)'\s*\}/g;
  const titleMatchRe = /title:\s*\{\s*ru:\s*['"]([^'"]+)['"]\s*,\s*en:\s*['"]([^'"]+)['"]\s*\}/g;
  const summaryMatchRe = /summary:\s*\{\s*ru:\s*['"]([^'"]+)['"]\s*,\s*en:\s*['"]([^'"]+)['"]\s*\}/g;

  const idMatches = [...categoriesSrc.matchAll(idRe)];
  const slugMatches = [...categoriesSrc.matchAll(slugMatchRe)];
  const titleMatches = [...categoriesSrc.matchAll(titleMatchRe)];
  const summaryMatches = [...categoriesSrc.matchAll(summaryMatchRe)];

  for (let i = 0; i < idMatches.length; i++) {
    const id = idMatches[i][1];
    const s = slugMatches[i];
    const t = titleMatches[i];
    const sm = summaryMatches[i];
    if (id && s && t && sm) {
      CATEGORIES_INFO.push({
        id,
        slug: { ru: s[1], en: s[2] },
        title: { ru: t[1], en: t[2] },
        summary: { ru: sm[1], en: sm[2] },
      });
    }
  }
}
function categoryUrl(cat, lang) {
  return lang === 'ru' ? `${SITE}/${cat.slug.ru}/` : `${SITE}/en/${cat.slug.en}/`;
}

// --- Parse chapter files ---

const chaptersDir = path.join(root, 'data', 'chapters');
const chapterFiles = fs
  .readdirSync(chaptersDir)
  .filter((f) => /^\d+-.+\.ts$/.test(f))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

function readChapter(filename) {
  const full = path.join(chaptersDir, filename);
  const src = fs.readFileSync(full, 'utf8');
  const id = parseInt(filename.split('-')[0], 10);

  // Title: first `title: { ru: "...", en: "..." }` block in the file.
  const titleMatch = src.match(/title\s*:\s*\{\s*ru\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*en\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/);
  const title = titleMatch
    ? { ru: unescape(titleMatch[1]), en: unescape(titleMatch[2]) }
    : { ru: `Глава ${id}`, en: `Chapter ${id}` };

  // Description (optional): `description: { ru: "...", en: "..." }` at chapter level.
  // We match only the chapter-level one (appears before `duas:`).
  const beforeDuas = src.split(/\bduas\s*:/)[0] || src;
  const descMatch = beforeDuas.match(/description\s*:\s*\{\s*ru\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*en\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/);
  const description = descMatch
    ? { ru: unescape(descMatch[1]), en: unescape(descMatch[2]) }
    : null;

  // Duas: each has id, fullTranslation.{ru,en}, source.{ru,en} (opt), and sync[].text (Arabic words).
  const duas = [];
  const duaBlockRe = /id\s*:\s*"(\d+-\d+)"[\s\S]*?(?=\{\s*id\s*:\s*"\d+-\d+"|\]\s*;?\s*$|\]\s*\}\s*;)/g;
  // Simpler approach: split on `{ id: "N-M"` boundaries inside the `duas:` array.
  const duasStart = src.indexOf('duas');
  if (duasStart !== -1) {
    const duasText = src.slice(duasStart);
    // Match every `id: "N-M"` dua entry block heuristically
    const idRe = /\bid\s*:\s*"(\d+-\d+)"/g;
    const duaPositions = [];
    let m;
    while ((m = idRe.exec(duasText)) !== null) {
      duaPositions.push({ id: m[1], start: m.index });
    }
    for (let i = 0; i < duaPositions.length; i++) {
      const start = duaPositions[i].start;
      const end = i + 1 < duaPositions.length ? duaPositions[i + 1].start : duasText.length;
      const block = duasText.slice(start, end);
      const duaId = duaPositions[i].id;

      // Arabic: collect all sync[*].text values in order
      const arabicWords = [];
      const syncRe = /\btext\s*:\s*"((?:[^"\\]|\\.)*)"/g;
      let sm;
      while ((sm = syncRe.exec(block)) !== null) {
        arabicWords.push(unescape(sm[1]));
      }
      const arabic = arabicWords.join(' ').replace(/\s+/g, ' ').trim();

      // Full translation
      const ftMatch = block.match(/fullTranslation\s*:\s*\{\s*ru\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*en\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/);
      const fullTranslation = ftMatch
        ? { ru: unescape(ftMatch[1]), en: unescape(ftMatch[2]) }
        : { ru: '', en: '' };

      // Source (optional)
      const srcMatch = block.match(/source\s*:\s*\{\s*ru\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*en\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/);
      const source = srcMatch
        ? { ru: unescape(srcMatch[1]), en: unescape(srcMatch[2]) }
        : null;

      duas.push({ id: duaId, arabic, fullTranslation, source });
    }
  }

  return { id, title, description, duas };
}

function unescape(s) {
  return s
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');
}

const chapters = chapterFiles.map(readChapter);

// --- Emit llms.txt (short linked ToC) ---

function shortDescription(lang) {
  return lang === 'ru'
    ? 'Сборник дуа и азкаров из достоверной Сунны Пророка ﷺ. 134 главы, ~280 дуа с арабским текстом, огласовками, пословным русским и английским переводом, аудио-синхронизацией и ссылками на хадисы (аль-Бухари, Муслим, Абу Дауд, ат-Тирмизи, Ибн Маджа, ан-Наса‘и, Ахмад).'
    : 'A collection of duas and adhkar from the authentic Sunnah of the Prophet ﷺ. 134 chapters, ~280 duas with Arabic text, diacritics, word-by-word Russian and English translations, audio sync, and hadith source citations (al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa\'i, Ahmad).';
}

const llmsLines = [];
llmsLines.push('# Дуа — Duas and Adhkar from the Sunnah');
llmsLines.push('');
llmsLines.push(`> ${shortDescription('en')}`);
llmsLines.push('');
llmsLines.push(`> ${shortDescription('ru')}`);
llmsLines.push('');
if (CATEGORIES_INFO.length > 0) {
  llmsLines.push('## Тематические категории / Thematic categories');
  llmsLines.push('');
  for (const cat of CATEGORIES_INFO) {
    llmsLines.push(`- [${cat.title.ru}](${categoryUrl(cat, 'ru')}) / [${cat.title.en}](${categoryUrl(cat, 'en')}) — ${cat.summary.ru.slice(0, 100)}`);
  }
  llmsLines.push('');
}

llmsLines.push('## Chapters (Russian)');
llmsLines.push('');
for (const ch of chapters) {
  llmsLines.push(`- [Глава ${ch.id}. ${ch.title.ru}](${chapterUrl(ch.id, 'ru')}): ${ch.duas.length} дуа${ch.description ? ' — ' + oneLine(ch.description.ru).slice(0, 160) : ''}`);
}
llmsLines.push('');
llmsLines.push('## Chapters (English)');
llmsLines.push('');
for (const ch of chapters) {
  llmsLines.push(`- [Chapter ${ch.id}. ${ch.title.en}](${chapterUrl(ch.id, 'en')}): ${ch.duas.length} dua${ch.duas.length !== 1 ? 's' : ''}${ch.description ? ' — ' + oneLine(ch.description.en).slice(0, 160) : ''}`);
}
llmsLines.push('');
llmsLines.push('## Optional');
llmsLines.push('');
llmsLines.push(`- [llms-full.txt](${SITE}/llms-full.txt): Complete plain-text dump of every chapter and dua for direct AI ingestion.`);
llmsLines.push(`- [sitemap.xml](${SITE}/sitemap.xml): All indexable URLs with hreflang alternates.`);
llmsLines.push('');

function oneLine(s) {
  return s.replace(/\s+/g, ' ').trim();
}

const llmsTxt = llmsLines.join('\n');

// --- Emit llms-full.txt (full corpus dump) ---

const fullLines = [];
fullLines.push('# Дуа — Duas and Adhkar from the Sunnah — Full Text');
fullLines.push('');
fullLines.push(`Source: ${SITE}`);
fullLines.push(`Generated: ${new Date().toISOString().split('T')[0]}`);
fullLines.push('');
fullLines.push('This file contains the complete text of duas and adhkar from the authentic Sunnah');
fullLines.push('of the Prophet ﷺ — Arabic text, Russian translation, English translation, and hadith');
fullLines.push('source citations (al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa\'i,');
fullLines.push('Ahmad). Intended for AI answer engines.');
fullLines.push('');
fullLines.push('---');
fullLines.push('');

for (const ch of chapters) {
  fullLines.push(`## Chapter ${ch.id} / Глава ${ch.id}`);
  fullLines.push('');
  fullLines.push(`### ${ch.title.en}`);
  fullLines.push(`### ${ch.title.ru}`);
  fullLines.push('');
  fullLines.push(`URL (RU): ${chapterUrl(ch.id, 'ru')}`);
  fullLines.push(`URL (EN): ${chapterUrl(ch.id, 'en')}`);
  fullLines.push('');
  if (ch.description) {
    fullLines.push(`**Description (EN)**: ${oneLine(ch.description.en)}`);
    fullLines.push('');
    fullLines.push(`**Описание (RU)**: ${oneLine(ch.description.ru)}`);
    fullLines.push('');
  }
  for (const dua of ch.duas) {
    fullLines.push(`#### Dua ${dua.id}`);
    fullLines.push('');
    if (dua.arabic) {
      fullLines.push('**Arabic**:');
      fullLines.push(dua.arabic);
      fullLines.push('');
    }
    if (dua.fullTranslation?.en) {
      fullLines.push('**English**: ' + oneLine(dua.fullTranslation.en));
      fullLines.push('');
    }
    if (dua.fullTranslation?.ru) {
      fullLines.push('**Русский**: ' + oneLine(dua.fullTranslation.ru));
      fullLines.push('');
    }
    if (dua.source) {
      fullLines.push(`**Source**: ${oneLine(dua.source.en)} / ${oneLine(dua.source.ru)}`);
      fullLines.push('');
    }
  }
  fullLines.push('---');
  fullLines.push('');
}

const llmsFullTxt = fullLines.join('\n');

// --- Write files ---

const outs = [
  { name: 'llms.txt', content: llmsTxt },
  { name: 'llms-full.txt', content: llmsFullTxt },
];

for (const { name, content } of outs) {
  const publicPath = path.join(root, 'public', name);
  fs.writeFileSync(publicPath, content, 'utf8');
  const bytes = Buffer.byteLength(content, 'utf8');
  console.log(`✓ public/${name} (${chapters.length} chapters, ${(bytes / 1024).toFixed(1)} KB)`);

  const distPath = path.join(root, 'dist', name);
  if (fs.existsSync(path.join(root, 'dist'))) {
    fs.writeFileSync(distPath, content, 'utf8');
    console.log(`✓ dist/${name}`);
  }
}

// --- Inject the full chapter ToC into dist/index.html#seo-fallback ---
// Crawlers that can't run JS (ChatGPT/Perplexity/Claude scrapers, slow bots)
// still see the full list of indexable chapter URLs + bilingual titles.

const distIndex = path.join(root, 'dist', 'index.html');
if (fs.existsSync(distIndex)) {
  const html = fs.readFileSync(distIndex, 'utf8');
  const startMarker = '<!-- SEO-FALLBACK:START -->';
  const endMarker = '<!-- SEO-FALLBACK:END -->';
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const fallback = buildSeoFallback();
    const updated =
      html.slice(0, startIdx + startMarker.length) +
      '\n' + fallback + '\n      ' +
      html.slice(endIdx);
    fs.writeFileSync(distIndex, updated, 'utf8');
    console.log(`✓ dist/index.html (SEO fallback injected — ${chapters.length} chapter links)`);
  } else {
    console.warn(`⚠ dist/index.html missing SEO-FALLBACK markers; skipped injection`);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildSeoFallback() {
  const lines = [];
  lines.push('      <h1>Дуа и азкары из Сунны — арабский текст, перевод, аудио</h1>');
  lines.push('      <p>Сборник из 134 глав с дуа и азкарами, подтверждёнными достоверными хадисами Пророка ﷺ. Каждая глава содержит арабский текст с огласовками, пословный русский и английский перевод, аудиозапись и ссылки на сборники хадисов (аль-Бухари, Муслим, Абу Дауд, ат-Тирмизи, Ибн Маджа, ан-Наса‘и, Ахмад).</p>');
  lines.push('      <p>A collection of 134 chapters with duas and adhkar from the authentic Sunnah of the Prophet ﷺ. Every chapter provides the Arabic text with diacritics, word-by-word Russian and English translations, audio recordings, and hadith references (al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa\'i, Ahmad).</p>');
  lines.push('      <h2>Главы / Chapters</h2>');
  lines.push('      <ul>');
  for (const ch of chapters) {
    const ru = escapeHtml(ch.title.ru);
    const en = escapeHtml(ch.title.en);
    const ruHref = chapterUrl(ch.id, 'ru').replace(SITE, '');
    const enHref = chapterUrl(ch.id, 'en').replace(SITE, '');
    lines.push(`        <li><a href="${ruHref}">${ch.id}. ${ru}</a> / <a href="${enHref}">${en}</a></li>`);
  }
  lines.push('      </ul>');
  lines.push('      <p>Full machine-readable corpus: <a href="/llms-full.txt">llms-full.txt</a>. Short summary: <a href="/llms.txt">llms.txt</a>. All URLs: <a href="/sitemap.xml">sitemap.xml</a>.</p>');
  return lines.join('\n');
}
