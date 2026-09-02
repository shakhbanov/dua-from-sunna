import { CHAPTER_SLUGS } from '../../data/slugs';
import { CATEGORIES } from '../../data/categories';
import {
  COLLECTIONS,
  DEFAULT_COLLECTION,
  collectionOfChapterId,
  getCollection,
  getSlug,
} from '../../data/collections';
import type { Collection, Language } from '../../types';

export type View =
  | 'chapter'
  | 'prayer-times'
  | 'home'
  | 'category'
  | 'categories-index'
  | 'collection-index';

export interface Route {
  path: string;          // absolute path: "/", "/en/", "/<slug>/", "/en/<slug>/"
  lang: Language;
  view: View;
  collection: Collection; // which content collection this route belongs to
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

// Prepends the language segment and the collection prefix:
//   sunna + ru → /<slug>/           sunna + en → /en/<slug>/
//   quran + ru → /dua-iz-korana/<slug>/   quran + en → /en/quran-duas/<slug>/
function joinPath(collection: Collection, lang: Language, ...segments: string[]): string {
  const prefix = getCollection(collection).prefix[lang];
  const parts = [lang === 'en' ? 'en' : '', prefix, ...segments].filter(Boolean);
  return `/${parts.join('/')}/`.replace(/\/{2,}/g, '/');
}

export function buildChapterPath(id: number, lang: Language, collection?: Collection): string {
  const coll = collection ?? collectionOfChapterId(id);
  return joinPath(coll, lang, getSlug(coll, id, lang));
}

/** Landing page listing every chapter of a collection. 'sunna' has no index of its own — it is the home page. */
export function buildCollectionIndexPath(collection: Collection, lang: Language): string {
  if (collection === DEFAULT_COLLECTION) return buildHomePath(lang);
  return joinPath(collection, lang);
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
    routes.push({ path: buildHomePath(lang), lang, view: 'home', collection: DEFAULT_COLLECTION });
    routes.push({
      path: buildPrayerTimesPath(lang),
      lang,
      view: 'prayer-times',
      collection: DEFAULT_COLLECTION,
    });
    routes.push({
      path: buildCategoriesIndexPath(lang),
      lang,
      view: 'categories-index',
      collection: DEFAULT_COLLECTION,
    });

    for (const coll of COLLECTIONS) {
      // Collections other than the default get their own index landing page.
      if (coll.id !== DEFAULT_COLLECTION) {
        routes.push({
          path: buildCollectionIndexPath(coll.id, lang),
          lang,
          view: 'collection-index',
          collection: coll.id,
        });
      }
      for (const chapter of coll.chapters) {
        routes.push({
          path: buildChapterPath(chapter.id, lang, coll.id),
          lang,
          view: 'chapter',
          collection: coll.id,
          chapterId: chapter.id,
        });
      }
    }

    for (const cat of CATEGORIES) {
      routes.push({
        path: buildCategoryPath(cat.id, lang),
        lang,
        view: 'category',
        collection: DEFAULT_COLLECTION,
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
    if (Number.isFinite(id) && CHAPTER_SLUGS[id]) return buildChapterPath(id, lang, 'sunna');
  }
  if (langRaw === 'en' || langRaw === 'ru') return buildHomePath(lang);
  return null;
}
