// Registry of content collections. A collection is a section of the site with
// its own URL namespace, its own chapter list and its own sidebar tab.
//
//   'sunna' — the original 134 hadith-sourced chapters. Lives at the URL root
//             (/<slug>/ and /en/<slug>/) — those URLs are indexed and must not
//             move.
//   'quran' — Quranic supplications. Lives under a path prefix so it can never
//             collide with a Sunnah or category slug.
//   'nawawi' — the Forty Hadith of Imam an-Nawawi, one hadith per chapter,
//             likewise under its own prefix.

import type { ChapterData, Collection, DuaItem, Language } from '../types';
import { MOCK_DATABASE } from '../constants';
import { QURAN_DATABASE } from './quran';
import { NAWAWI_DATABASE } from './nawawi';
import { CHAPTER_SLUGS, type ChapterSlugs } from './slugs';
import { QURAN_CHAPTER_SLUGS } from './quranSlugs';
import { NAWAWI_CHAPTER_SLUGS } from './nawawiSlugs';

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
  {
    id: 'nawawi',
    prefix: { ru: '40-hadisov-an-navavi', en: '40-hadith-an-nawawi' },
    title: { ru: '40 хадисов имама ан-Навави', en: 'The Forty Hadith of Imam an-Nawawi' },
    shortTitle: { ru: 'Навави', en: 'Nawawi' },
    summary: {
      ru: 'Сборник имама ан-Навави — основы религии в сорока двух хадисах, с арабским текстом, пословным переводом на русский и английский и ссылкой на источник.',
      en: 'The collection of Imam an-Nawawi — the foundations of the religion in forty-two hadith, with the Arabic text, word-by-word Russian and English translation, and the source reference.',
    },
    chapters: NAWAWI_DATABASE,
    slugs: NAWAWI_CHAPTER_SLUGS,
  },
];

/** First chapter id of the Forty Hadith: chapter id = 3000 + hadith number. */
const NAWAWI_ID_BASE = 3000;

/** A collection and how many of its chapters match the current search query. */
export interface CollectionMatches {
  collection: CollectionMeta;
  matches: number;
}

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
 * (Sunnah 1..134, Quran 2001+, Forty Hadith 3001+), so this is unambiguous.
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

/**
 * Audio for a dua, as an ordered list of segments played back to back.
 * Only the Sunnah duas carry a recording today, so this is either that one
 * hosted file or nothing.
 */
export function duaAudioSegments(dua: DuaItem): string[] {
  return dua.audioUrl ? [dua.audioUrl] : [];
}

/**
 * The number shown beside a chapter, or null when the collection does not
 * number its chapters.
 *
 * The Sunnah book opens with a preface and an essay on the virtues of dhikr,
 * so its chapter 1 is the third entry. The Forty Hadith are numbered by the
 * collection itself. Quranic chapters are thematic groups around a sura and
 * carry no number of their own.
 */
export function chapterNumber(collection: Collection, id: number): number | null {
  if (collection === 'sunna') return id > 2 ? id - 2 : null;
  if (collection === 'nawawi') return id - NAWAWI_ID_BASE;
  return null;
}

export function getSlug(collection: Collection, id: number, lang: Language): string {
  const s = getCollection(collection).slugs[id];
  if (!s) throw new Error(`No slug for chapter ${id} in collection ${collection}`);
  return s[lang];
}
