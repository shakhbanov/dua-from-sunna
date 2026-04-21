import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';
import { MOCK_DATABASE, APP_TITLE } from '../constants';
import { CATEGORIES } from '../data/categories';
import { getChapterDescription } from '../data/descriptions';
import { I18N } from './i18n/strings';
import { RouterProvider } from './router/RouterContext';
import { allRoutes, matchRoute, type Route } from './router/routes';
import { buildMetaTags } from './seo/updateMetaTags';

export { allRoutes };
export type { Route };

export interface RenderResult {
  html: string;
  headHtml: string;
  htmlLangAttr: string;
}

const DEFAULT_CHAPTER_ID = 3;

export function render(pathname: string): RenderResult | null {
  const route = matchRoute(pathname);
  if (!route) return null;

  // Resolve the effective chapter (home view falls back to the default).
  const effectiveChapterId = route.chapterId ?? DEFAULT_CHAPTER_ID;
  const chapter =
    MOCK_DATABASE.find((c) => c.id === effectiveChapterId) ?? MOCK_DATABASE[0];

  const lang = route.lang;
  const viewForTitle: 'chapter' | 'prayer-times' =
    route.view === 'prayer-times' ? 'prayer-times' : 'chapter';

  const HOME_TITLE = {
    ru: 'Дуа — дуа и азкары из Сунны с аудио',
    en: 'Dua — duas and adhkars from the Sunnah with audio',
  } as const;
  const HOME_DESCRIPTION = {
    ru: 'Дуа и азкары из Сунны онлайн: 134 главы с арабским текстом, огласовками, пословным русским и английским переводом, аудио и ссылками на хадисы (аль-Бухари, Муслим, Абу Дауд, ат-Тирмизи, Ибн Маджа, ан-Наса‘и, Ахмад).',
    en: 'Duas and adhkar from the Sunnah online: 134 chapters with Arabic text, diacritics, word-by-word Russian and English translations, audio, and hadith source citations (al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa\'i, Ahmad).',
  } as const;

  let title: string;
  let description: string;

  if (route.view === 'home') {
    title = HOME_TITLE[lang];
    description = HOME_DESCRIPTION[lang];
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
  } else if (viewForTitle === 'prayer-times') {
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

// Escape for a <script type="application/ld+json"> body. Only </ is dangerous.
function escapeJsonLd(json: string): string {
  return json.replace(/<\/(script)/gi, '<\\/$1');
}

function buildHeadHtml(meta: ReturnType<typeof buildMetaTags>): string {
  const lines: string[] = [];
  lines.push(`<title>${escapeHtml(meta.title)}</title>`);
  lines.push(`<meta name="description" content="${escapeHtml(meta.description)}" />`);
  lines.push(`<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`);
  lines.push(`<link rel="alternate" hreflang="ru" href="${escapeHtml(meta.hreflang.ru)}" />`);
  lines.push(`<link rel="alternate" hreflang="en" href="${escapeHtml(meta.hreflang.en)}" />`);
  lines.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(meta.hreflang.xDefault)}" />`);
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
      `<script id="${id}" type="application/ld+json">${escapeJsonLd(JSON.stringify(data))}</script>`
    );
  }
  return lines.join('\n    ');
}
