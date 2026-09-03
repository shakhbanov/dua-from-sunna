#!/usr/bin/env node
// Generate llms.txt and llms-full.txt — https://llmstxt.org
// Markdown files that help LLM-based search engines (ChatGPT, Claude,
// Perplexity, Gemini) discover, summarize and cite the content.
//
// Content comes from contentCatalog() in the SSR bundle — the same data the
// pages themselves render, so nothing here can drift out of sync with the app.
//
// Run after `vite build --ssr src/entry-server.tsx --outDir dist-server`.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SITE = 'https://dua.shakhbanov.org';

const ssrBundle = path.join(root, 'dist-server', 'entry-server.js');
if (!fs.existsSync(ssrBundle)) {
  console.error(`✗ ${ssrBundle} not found. Run \`npm run build:ssr\` before \`npm run llms\`.`);
  process.exit(1);
}
const { contentCatalog, categoryCatalog } = await import(url.pathToFileURL(ssrBundle).href);

const collections = contentCatalog();
const categories = categoryCatalog();
const allChapters = collections.flatMap((c) => c.chapters);

const abs = (p) => `${SITE}${p}`;
const oneLine = (s) => String(s).replace(/\s+/g, ' ').trim();

// --- Emit llms.txt (short linked ToC) ---

const totalDuas = allChapters.reduce((n, c) => n + c.duas.length, 0);

const SUMMARY = {
  ru: `Сборник дуа и азкаров из достоверной Сунны Пророка ﷺ, мольб, приведённых в Коране, и сорока хадисов имама ан-Навави. ${allChapters.length} глав, ${totalDuas} текстов с арабским текстом, огласовками, пословным русским и английским переводом, аудио-синхронизацией и ссылками на источники (аль-Бухари, Муслим, Абу Дауд, ат-Тирмизи, Ибн Маджа, ан-Наса‘и, Ахмад; для коранических дуа — сура и аят).`,
  en: `A collection of duas and adhkar from the authentic Sunnah of the Prophet ﷺ, the supplications found in the Quran, and the Forty Hadith of Imam an-Nawawi. ${allChapters.length} chapters, ${totalDuas} texts with Arabic text, diacritics, word-by-word Russian and English translations, audio sync, and source citations (al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa'i, Ahmad; sura and ayah for Quranic duas).`,
};

const llmsLines = [];
llmsLines.push('# Дуа — Duas and Adhkar from the Sunnah, the Quran and the Forty Hadith');
llmsLines.push('');
llmsLines.push(`> ${SUMMARY.en}`);
llmsLines.push('');
llmsLines.push(`> ${SUMMARY.ru}`);
llmsLines.push('');

llmsLines.push('## Источники / Sources');
llmsLines.push('');
for (const coll of collections) {
  llmsLines.push(
    `- [${coll.title.ru}](${abs(coll.indexPath.ru)}) / [${coll.title.en}](${abs(coll.indexPath.en)}) — ${coll.chapters.length} глав / chapters`
  );
}
llmsLines.push('');

if (categories.length > 0) {
  llmsLines.push('## Тематические категории / Thematic categories');
  llmsLines.push('');
  for (const cat of categories) {
    llmsLines.push(
      `- [${cat.title.ru}](${abs(cat.path.ru)}) / [${cat.title.en}](${abs(cat.path.en)}) — ${oneLine(cat.summary.ru).slice(0, 100)}`
    );
  }
  llmsLines.push('');
}

for (const coll of collections) {
  llmsLines.push(`## ${coll.title.ru} — Chapters (Russian)`);
  llmsLines.push('');
  const unit = coll.id === 'nawawi' ? { ru: 'хадис', en: 'hadith' } : { ru: 'дуа', en: 'dua' };
  for (const ch of coll.chapters) {
    const desc = ch.description ? ' — ' + oneLine(ch.description.ru).slice(0, 160) : '';
    llmsLines.push(`- [${ch.title.ru}](${abs(ch.path.ru)}): ${ch.duas.length} ${unit.ru}${desc}`);
  }
  llmsLines.push('');
  llmsLines.push(`## ${coll.title.en} — Chapters (English)`);
  llmsLines.push('');
  for (const ch of coll.chapters) {
    const desc = ch.description ? ' — ' + oneLine(ch.description.en).slice(0, 160) : '';
    const plural = ch.duas.length !== 1 && unit.en === 'dua' ? 's' : '';
    llmsLines.push(`- [${ch.title.en}](${abs(ch.path.en)}): ${ch.duas.length} ${unit.en}${plural}${desc}`);
  }
  llmsLines.push('');
}

llmsLines.push('## Optional');
llmsLines.push('');
llmsLines.push(`- [llms-full.txt](${SITE}/llms-full.txt): Complete plain-text dump of every chapter and dua for direct AI ingestion.`);
llmsLines.push(`- [sitemap.xml](${SITE}/sitemap.xml): All indexable URLs with hreflang alternates.`);
llmsLines.push('');

const llmsTxt = llmsLines.join('\n');

// --- Emit llms-full.txt (full corpus dump) ---

const fullLines = [];
fullLines.push('# Дуа — Duas and Adhkar from the Sunnah, the Quran and the Forty Hadith — Full Text');
fullLines.push('');
fullLines.push(`Source: ${SITE}`);
fullLines.push(`Generated: ${new Date().toISOString().split('T')[0]} — regenerated on every deploy from the same data files that render the site, so this file cannot drift from the pages.`);
fullLines.push(`Compiled by: Zurab Shakhbanov — ${SITE}/o-proekte/ (RU) · ${SITE}/en/about/ (EN)`);
fullLines.push('Provenance: every text carries its own source reference — hadith collection and number for the Sunnah and for the Forty Hadith, sura and ayah for the Quran. The primary source takes precedence over this file.');
fullLines.push(`Corrections: https://github.com/shakhbanov/dua-from-sunna/issues`);
fullLines.push('License: the Arabic text is scripture; translations and commentary are the work of this project.');
fullLines.push('');
fullLines.push('This file contains the complete text of duas and adhkar from the authentic Sunnah');
fullLines.push('of the Prophet ﷺ, the supplications found in the Quran, and the Forty Hadith of Imam');
fullLines.push('an-Nawawi — Arabic text, Russian translation, English translation, and source');
fullLines.push('citations. Intended for AI answer engines.');
fullLines.push('');
fullLines.push('---');
fullLines.push('');

for (const coll of collections) {
  fullLines.push(`# ${coll.title.en} / ${coll.title.ru}`);
  fullLines.push('');
  fullLines.push(oneLine(coll.summary.en));
  fullLines.push('');
  fullLines.push('---');
  fullLines.push('');

  for (const ch of coll.chapters) {
    fullLines.push(`## Chapter ${ch.id} / Глава ${ch.id}`);
    fullLines.push('');
    fullLines.push(`### ${ch.title.en}`);
    fullLines.push(`### ${ch.title.ru}`);
    fullLines.push('');
    fullLines.push(`URL (RU): ${abs(ch.path.ru)}`);
    fullLines.push(`URL (EN): ${abs(ch.path.en)}`);
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
}

const llmsFullTxt = fullLines.join('\n');

// --- Write files ---

for (const { name, content } of [
  { name: 'llms.txt', content: llmsTxt },
  { name: 'llms-full.txt', content: llmsFullTxt },
]) {
  const publicPath = path.join(root, 'public', name);
  fs.writeFileSync(publicPath, content, 'utf8');
  const bytes = Buffer.byteLength(content, 'utf8');
  console.log(`✓ public/${name} (${allChapters.length} chapters, ${(bytes / 1024).toFixed(1)} KB)`);

  if (fs.existsSync(path.join(root, 'dist'))) {
    fs.writeFileSync(path.join(root, 'dist', name), content, 'utf8');
    console.log(`✓ dist/${name}`);
  }
}

// --- Inject the full chapter ToC into dist/index.html#seo-fallback ---
// Crawlers that can't run JS (ChatGPT/Perplexity/Claude scrapers, slow bots)
// still see the full list of indexable chapter URLs + bilingual titles.

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

