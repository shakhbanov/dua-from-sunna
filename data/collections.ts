// Registry of content collections. A collection is a section of the site with
// its own URL namespace, its own chapter list and its own sidebar tab.
//
//   'sunna' — the original 134 hadith-sourced chapters. Lives at the URL root
//             (/<slug>/ and /en/<slug>/) — those URLs are indexed and must not
//             move.
//   'quran' — Quranic supplications. Lives under a path prefix so it can never
//             collide with a Sunnah or category slug.

import type { ChapterData, Collection, Language } from '../types';
import { MOCK_DATABASE } from '../constants';
import { QURAN_DATABASE } from './quran';
import { CHAPTER_SLUGS, type ChapterSlugs } from './slugs';
import { QURAN_CHAPTER_SLUGS } from './quranSlugs';

export interface CollectionMeta {
  id: Collection;
  /** Path segment under which every chapter of this collection lives. '' = URL root. */
  prefix: { ru: string; en: string };
  title: { ru: string; en: string };
  /** Short label for the sidebar source tab. */
  shortTitle: { ru: string; en: string };
  summary: { ru: string; en: string };
  chapters: ChapterData[];
  slugs: Record<number, ChapterSlugs>;
}

export const COLLECTIONS: CollectionMeta[] = [
  {
    id: 'sunna',
    prefix: { ru: '', en: '' },
    title: { ru: 'Дуа из Сунны', en: 'Duas from the Sunnah' },
    shortTitle: { ru: 'Сунна', en: 'Sunnah' },
    summary: {
      ru: 'Дуа и азкары, подтверждённые достоверными хадисами Пророка ﷺ, с аудио и пословным переводом.',
      en: 'Duas and adhkar established by authentic hadith of the Prophet ﷺ, with audio and word-by-word translation.',
    },
    chapters: MOCK_DATABASE,
    slugs: CHAPTER_SLUGS,
  },
  {
    id: 'quran',
    prefix: { ru: 'dua-iz-korana', en: 'quran-duas' },
    title: { ru: 'Дуа из Корана', en: 'Duas from the Quran' },
    shortTitle: { ru: 'Коран', en: 'Quran' },
    summary: {
      ru: 'Мольбы, приведённые в Коране, — дуа пророков и верующих с арабским текстом, пословным переводом и указанием суры и аята.',
      en: 'Supplications found in the Quran — the duas of the prophets and the believers, with Arabic text, word-by-word translation and the sura and ayah reference.',
    },
    chapters: QURAN_DATABASE,
    slugs: QURAN_CHAPTER_SLUGS,
  },
];

export const DEFAULT_COLLECTION: Collection = 'sunna';

export function getCollection(id: Collection): CollectionMeta {
  const c = COLLECTIONS.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown collection: ${id}`);
  return c;
}

export function getCollectionChapters(id: Collection): ChapterData[] {
  return getCollection(id).chapters;
}

/** The collection a chapter belongs to — defaults to 'sunna' when unset. */
export function chapterCollection(chapter: ChapterData): Collection {
  return chapter.collection ?? DEFAULT_COLLECTION;
}

/** Look a chapter up by id within a collection. */
export function getChapter(collection: Collection, id: number): ChapterData | undefined {
  return getCollection(collection).chapters.find((c) => c.id === id);
}

/**
 * Look a chapter up by id across every collection. Ids are globally unique
 * (Sunnah 1..134, Quran 2001+), so this is unambiguous.
 */
export function findChapterAnywhere(id: number): ChapterData | undefined {
  for (const c of COLLECTIONS) {
    const hit = c.chapters.find((ch) => ch.id === id);
    if (hit) return hit;
  }
  return undefined;
}

/** Resolve which collection owns a chapter id. */
export function collectionOfChapterId(id: number): Collection {
  for (const c of COLLECTIONS) {
    if (c.chapters.some((ch) => ch.id === id)) return c.id;
  }
  return DEFAULT_COLLECTION;
}

/**
 * Chapter shown when a route names a collection but no chapter (home page,
 * collection index). The Sunnah collection opens on chapter 3 — chapters 1-2
 * are the preface and a virtues essay, not supplications.
 */
export const SUNNA_DEFAULT_CHAPTER_ID = 3;

export function defaultChapterIdFor(collection: Collection): number {
  if (collection === DEFAULT_COLLECTION) return SUNNA_DEFAULT_CHAPTER_ID;
  return getCollection(collection).chapters[0].id;
}

export function getSlug(collection: Collection, id: number, lang: Language): string {
  const s = getCollection(collection).slugs[id];
  if (!s) throw new Error(`No slug for chapter ${id} in collection ${collection}`);
  return s[lang];
}
