import { CHAPTER_SLUGS, getChapterSlug } from '../../data/slugs';
import { CATEGORIES } from '../../data/categories';
import type { Language } from '../../types';

export type View = 'chapter' | 'prayer-times' | 'home' | 'category' | 'categories-index';

export interface Route {
  path: string;          // absolute path: "/", "/en/", "/<slug>/", "/en/<slug>/"
  lang: Language;
  view: View;
  chapterId?: number;    // only when view === 'chapter'
  categoryId?: string;   // only when view === 'category'
}

const PRAYER_TIMES_SLUG = {
  ru: 'namaz',
  en: 'prayer-times',
} as const;

const CATEGORIES_INDEX_SLUG = {
  ru: 'kategorii',
  en: 'categories',
} as const;

export function buildChapterPath(id: number, lang: Language): string {
  const slug = getChapterSlug(id, lang);
  return lang === 'ru' ? `/${slug}/` : `/en/${slug}/`;
}

export function buildPrayerTimesPath(lang: Language): string {
  return lang === 'ru' ? `/${PRAYER_TIMES_SLUG.ru}/` : `/en/${PRAYER_TIMES_SLUG.en}/`;
}

export function buildHomePath(lang: Language): string {
  return lang === 'ru' ? '/' : '/en/';
}

export function buildCategoriesIndexPath(lang: Language): string {
  return lang === 'ru' ? `/${CATEGORIES_INDEX_SLUG.ru}/` : `/en/${CATEGORIES_INDEX_SLUG.en}/`;
}

export function buildCategoryPath(categoryId: string, lang: Language): string {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) throw new Error(`Unknown category id: ${categoryId}`);
  const slug = cat.slug[lang];
  return lang === 'ru' ? `/${slug}/` : `/en/${slug}/`;
}

// --- The full list of prerendered routes ---

export function allRoutes(): Route[] {
  const routes: Route[] = [];
  const langs: Language[] = ['ru', 'en'];

  for (const lang of langs) {
    routes.push({ path: buildHomePath(lang), lang, view: 'home' });
    routes.push({ path: buildPrayerTimesPath(lang), lang, view: 'prayer-times' });
    routes.push({ path: buildCategoriesIndexPath(lang), lang, view: 'categories-index' });
    for (const idStr of Object.keys(CHAPTER_SLUGS)) {
      const id = Number(idStr);
      routes.push({ path: buildChapterPath(id, lang), lang, view: 'chapter', chapterId: id });
    }
    for (const cat of CATEGORIES) {
      routes.push({
        path: buildCategoryPath(cat.id, lang),
        lang,
        view: 'category',
        categoryId: cat.id,
      });
    }
  }

  return routes;
}

// --- Path → route lookup (used by entry-server and client hydration) ---

const PATH_LOOKUP = new Map<string, Route>();
for (const r of allRoutes()) PATH_LOOKUP.set(r.path, r);

export function matchRoute(pathname: string): Route | null {
  // Normalize: always trailing slash
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  return PATH_LOOKUP.get(p) ?? null;
}

// --- Legacy query-string migration ---
// Old URLs: /?chapter=N, /?chapter=N&lang=en, /?view=prayer-times, /?lang=en
// Returns the new clean path (or null if the legacy URL was already clean).

export function legacyQueryToPath(search: string): string | null {
  const p = new URLSearchParams(search);
  const langRaw = p.get('lang');
  const lang: Language = langRaw === 'en' ? 'en' : 'ru';
  const view = p.get('view');
  const chapterRaw = p.get('chapter');

  if (view === 'prayer-times') return buildPrayerTimesPath(lang);
  if (chapterRaw) {
    const id = Number.parseInt(chapterRaw, 10);
    if (Number.isFinite(id) && CHAPTER_SLUGS[id]) return buildChapterPath(id, lang);
  }
  if (langRaw === 'en' || langRaw === 'ru') return buildHomePath(lang);
  return null;
}
