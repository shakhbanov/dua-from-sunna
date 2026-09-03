import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';
import type { ChapterData, Collection, WordSync } from '../types';
import { MOCK_DATABASE, APP_TITLE } from '../constants';
import { CATEGORIES } from '../data/categories';
import {
  COLLECTIONS,
  DEFAULT_COLLECTION,
  defaultChapterIdFor,
  getCollection,
  getChapter,
  getSlug,
} from '../data/collections';
import { getChapterDescription } from '../data/descriptions';
import { I18N } from './i18n/strings';
import { RouterProvider } from './router/RouterContext';
import {
  allRoutes,
  buildCategoryPath,
  buildChapterPath,
  buildCollectionIndexPath,
  matchRoute,
  type Route,
} from './router/routes';
import { buildMetaTags } from './seo/updateMetaTags';

export { allRoutes };
export type { Route };

export interface RenderResult {
  html: string;
  headHtml: string;
  htmlLangAttr: string;
}

const HOME_TITLE = {
  ru: 'Дуа — дуа и азкары из Сунны с аудио',
  en: 'Dua — duas and adhkars from the Sunnah with audio',
} as const;

const HOME_DESCRIPTION = {
  ru: 'Дуа и азкары из Сунны онлайн: 134 главы с арабским текстом, огласовками, пословным русским и английским переводом, аудио и ссылками на хадисы (аль-Бухари, Муслим, Абу Дауд, ат-Тирмизи, Ибн Маджа, ан-Наса‘и, Ахмад).',
  en: 'Duas and adhkar from the Sunnah online: 134 chapters with Arabic text, diacritics, word-by-word Russian and English translations, audio, and hadith source citations (al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa\'i, Ahmad).',
} as const;

export interface RouteMeta {
  route: Route;
  collection: Collection;
  /** Chapter rendered for this route — for non-chapter views it is the collection's default. */
  chapter: ChapterData;
  title: string;
  description: string;
  /** Basename of the per-chapter OG image, or null for page-type defaults. */
  ogSlug: string | null;
}

/**
 * Single source of truth for a route's <title>/<meta description>. Used by
 * render() and re-exported through routeCatalog() so the build scripts
 * (sitemap, OG images, llms.txt) never have to re-derive it by parsing the
 * data files with regexes.
 */
export function routeMeta(route: Route): RouteMeta {
  const collection = route.collection ?? DEFAULT_COLLECTION;
  const collectionMeta = getCollection(collection);
  const effectiveChapterId = route.chapterId ?? defaultChapterIdFor(collection);
  const chapter =
    getChapter(collection, effectiveChapterId) ?? collectionMeta.chapters[0] ?? MOCK_DATABASE[0];

  const lang = route.lang;
  let title: string;
  let description: string;

  if (route.view === 'home') {
    title = HOME_TITLE[lang];
    description = HOME_DESCRIPTION[lang];
  } else if (route.view === 'collection-index') {
    title = `${collectionMeta.title[lang]} — ${APP_TITLE[lang]}`;
    description = collectionMeta.summary[lang];
  } else if (route.view === 'categories-index') {
    title =
      lang === 'ru'
        ? `Категории дуа и азкаров — ${APP_TITLE[lang]}`
        : `Dua and adhkar categories — ${APP_TITLE[lang]}`;
    description =
      lang === 'ru'
        ? 'Тематические подборки дуа и азкаров из Сунны: утренние и вечерние азкары, дуа перед сном, в путешествии, при тревоге, для хаджа и другие.'
        : 'Thematic collections of duas and adhkar from the Sunnah: morning and evening adhkar, before sleep, for travel, for anxiety, for hajj, and more.';
  } else if (route.view === 'category' && route.categoryId) {
    const cat = CATEGORIES.find((c) => c.id === route.categoryId);
    if (cat) {
      title = `${cat.title[lang]} — ${APP_TITLE[lang]}`;
      description = cat.summary[lang];
    } else {
      title = HOME_TITLE[lang];
      description = HOME_DESCRIPTION[lang];
    }
  } else if (route.view === 'about') {
    title = lang === 'ru' ? `О проекте — ${APP_TITLE[lang]}` : `About — ${APP_TITLE[lang]}`;
    description =
      lang === 'ru'
        ? 'Кто ведёт сборник дуа и азкаров, откуда взят текст каждой мольбы, как указываются источники и как сообщить об ошибке в переводе или ссылке.'
        : 'Who maintains this collection of duas and adhkar, where the text of each supplication comes from, how sources are cited, and how to report an error in a translation or reference.';
  } else if (route.view === 'prayer-times') {
    title = `${I18N[lang].prayerTimes} — ${APP_TITLE[lang]}`;
    description = HOME_DESCRIPTION[lang];
  } else {
    title = `${chapter.title[lang]} — ${APP_TITLE[lang]}`;
    // Priority: (1) long-form description from data/descriptions.ts (top-30
    // chapters with hand-written ~300 word explainers) → (2) inline chapter
    // description from data/chapters/*.ts → (3) first dua translation
    // → (4) generic home description. Truncate to 180 chars for <meta>.
    const longForm = getChapterDescription(chapter.id);
    const descRaw =
      longForm?.[lang] ??
      chapter.description?.[lang] ??
      chapter.duas[0]?.fullTranslation?.[lang] ??
      HOME_DESCRIPTION[lang];
    description = descRaw.replace(/\*\*/g, '').replace(/\s+/g, ' ').slice(0, 180).trim();
  }

  const ogSlug = route.view === 'chapter' ? getSlug(collection, chapter.id, lang) : null;

  return { route, collection, chapter, title, description, ogSlug };
}

/** Every prerendered route with its resolved metadata. Consumed by the build scripts. */
export function routeCatalog(): RouteMeta[] {
  return allRoutes().map(routeMeta);
}

// --- Content catalog ---
// A plain-data view of every collection, chapter and dua, with resolved URLs.
// Build scripts (llms.txt, OG images) consume this instead of re-parsing the
// data/*.ts sources with regexes.

export interface DuaExport {
  id: string;
  arabic: string;
  fullTranslation: { ru: string; en: string };
  source: { ru: string; en: string } | null;
  hasAudio: boolean;
}

export interface ChapterExport {
  id: number;
  collection: Collection;
  title: { ru: string; en: string };
  description: { ru: string; en: string } | null;
  slug: { ru: string; en: string };
  path: { ru: string; en: string };
  duas: DuaExport[];
}

export interface CollectionExport {
  id: Collection;
  title: { ru: string; en: string };
  summary: { ru: string; en: string };
  /** Landing page for the collection; the default collection uses the home page. */
  indexPath: { ru: string; en: string };
  chapters: ChapterExport[];
}

// Verse-end ornaments are layout, not text: skip them and join the rest in a
// single pass rather than filtering and mapping the word list twice.
function joinArabicWords(sync: WordSync[]): string {
  let out = '';
  for (const word of sync) {
    if (word.isVerseEnd) continue;
    out += out ? ` ${word.text}` : word.text;
  }
  return out.replace(/\s+/g, ' ').trim();
}

export function contentCatalog(): CollectionExport[] {
  return COLLECTIONS.map((coll) => ({
    id: coll.id,
    title: coll.title,
    summary: coll.summary,
    indexPath: {
      ru: buildCollectionIndexPath(coll.id, 'ru'),
      en: buildCollectionIndexPath(coll.id, 'en'),
    },
    chapters: coll.chapters.map((ch) => ({
      id: ch.id,
      collection: coll.id,
      title: ch.title,
      description: ch.description ?? null,
      slug: { ru: getSlug(coll.id, ch.id, 'ru'), en: getSlug(coll.id, ch.id, 'en') },
      path: {
        ru: buildChapterPath(ch.id, 'ru', coll.id),
        en: buildChapterPath(ch.id, 'en', coll.id),
      },
      duas: ch.duas.map((d) => ({
        id: d.id,
        arabic: joinArabicWords(d.sync),
        fullTranslation: d.fullTranslation,
        source: d.source ?? null,
        hasAudio: !!d.audioUrl,
      })),
    })),
  }));
}

export interface CategoryExport {
  id: string;
  title: { ru: string; en: string };
  summary: { ru: string; en: string };
  path: { ru: string; en: string };
  chapterIds: number[];
}

export function categoryCatalog(): CategoryExport[] {
  return CATEGORIES.map((c) => ({
    id: c.id,
    title: c.title,
    summary: c.summary,
    path: { ru: buildCategoryPath(c.id, 'ru'), en: buildCategoryPath(c.id, 'en') },
    chapterIds: c.chapterIds,
  }));
}

export function render(pathname: string): RenderResult | null {
  const route = matchRoute(pathname);
  if (!route) return null;

  const { chapter, title, description } = routeMeta(route);
  const lang = route.lang;
  const effectiveChapterId = chapter.id;

  const isChapterPage = route.view === 'chapter';
  const meta = buildMetaTags({
    title,
    description,
    lang,
    path: route.path,
    chapterId: isChapterPage ? chapter.id : undefined,
    chapterTitle: isChapterPage ? chapter.title[lang] : undefined,
    chapterDescription: isChapterPage ? description : undefined,
    chapter: isChapterPage ? chapter : undefined,
  });

  // Server-side render the React tree.
  // We wrap App in an initial RouterProvider that does NOT attempt DOM access
  // (the provider guards window/sessionStorage access behind typeof checks).
  const initialRoute: Route = { ...route, chapterId: effectiveChapterId };
  const reactHtml = renderToString(
    <RouterProvider initial={initialRoute}>
      <App />
    </RouterProvider>
  );

  const headHtml = buildHeadHtml(meta);

  return {
    html: reactHtml,
    headHtml,
    htmlLangAttr: lang,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Escape a JSON payload for an HTML script body. `<`, `>` and `&` become
// JSON unicode escapes: they parse back to the same characters, but can no longer
// close the script element or start an entity, whatever the data contains.
function escapeJson(json: string): string {
  return json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function buildHeadHtml(meta: ReturnType<typeof buildMetaTags>): string {
  const lines: string[] = [];
  lines.push(`<title>${escapeHtml(meta.title)}</title>`);
  lines.push(`<meta name="description" content="${escapeHtml(meta.description)}" />`);
  lines.push(`<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`);
  lines.push(`<link rel="alternate" hreflang="ru" href="${escapeHtml(meta.hreflang.ru)}" />`);
  lines.push(`<link rel="alternate" hreflang="en" href="${escapeHtml(meta.hreflang.en)}" />`);
  lines.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(meta.hreflang.xDefault)}" />`);
  lines.push(`<meta property="og:type" content="${meta.og.type}" />`);
  lines.push(`<meta property="og:site_name" content="${escapeHtml(meta.og.siteName)}" />`);
  lines.push(`<meta property="og:title" content="${escapeHtml(meta.og.title)}" />`);
  lines.push(`<meta property="og:description" content="${escapeHtml(meta.og.description)}" />`);
  lines.push(`<meta property="og:url" content="${escapeHtml(meta.og.url)}" />`);
  lines.push(`<meta property="og:locale" content="${escapeHtml(meta.og.locale)}" />`);
  lines.push(`<meta property="og:image" content="${escapeHtml(meta.og.image)}" />`);
  lines.push(`<meta property="og:image:width" content="1200" />`);
  lines.push(`<meta property="og:image:height" content="630" />`);
  lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
  lines.push(`<meta name="twitter:title" content="${escapeHtml(meta.twitter.title)}" />`);
  lines.push(`<meta name="twitter:description" content="${escapeHtml(meta.twitter.description)}" />`);
  lines.push(`<meta name="twitter:image" content="${escapeHtml(meta.twitter.image)}" />`);
  for (const { id, data } of meta.jsonLd) {
    lines.push(
      `<script id="${id}" type="application/ld+json">${escapeJson(JSON.stringify(data))}</script>`
    );
  }
  return lines.join('\n    ');
}
