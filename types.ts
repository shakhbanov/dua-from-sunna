export type Language = 'ru' | 'en';

/**
 * Content collection — the section of the site a chapter belongs to.
 * 'sunna' is the original 134-chapter hadith collection (lives at the URL root);
 * 'quran' is the Quranic supplications collection (lives under its own prefix).
 * Absent means 'sunna' so the existing chapter files need no edits.
 */
export type Collection = 'sunna' | 'quran';

export interface WordSync {
  text: string; // Arabic text, or verse-end ornament if isVerseEnd
  trans: {
    ru: string;
    en: string;
  };
  start: number;
  end: number;
  isVerseEnd?: boolean; // renders as a Quranic verse-ending divider (۝ + number); not clickable, forces line break
}

/** Precise Quranic reference for a dua taken from the Qur'an. */
export interface QuranRef {
  sura: number;
  ayahFrom: number;
  ayahTo?: number; // omit for a single ayah
}

export interface DuaItem {
  id: string; // Unique string ID for the sub-dua (e.g., "1-1")
  /** Heading for this particular dua, when a chapter groups several distinct ones. */
  title?: {
    ru: string;
    en: string;
  };
  /** Optional: Quranic duas have no recording yet, so the player is hidden. */
  audioUrl?: string;
  narration?: {
    ru: string;
    en: string;
  };
  fullTranslation: {
    ru: string;
    en: string;
  };
  note?: { // Post-dua instruction or commentary, rendered below the translation
    ru: string;
    en: string;
  };
  source?: { // e.g. { ru: "аль-Бухари 6312", en: "al-Bukhari 6312" }
    ru: string;
    en: string;
  };
  /**
   * Set when the dua is a Quranic passage. Drives the "Quran" provenance badge
   * and the deep link to the ayah. Independent of the chapter's collection —
   * several Sunnah chapters quote the Qur'an (e.g. Ayat al-Kursi in ch. 30).
   */
  ref?: QuranRef;
  /** Word-by-word Arabic with per-word translation and audio timings. */
  sync: WordSync[];
}

export interface ChapterData {
  id: number;
  /** Defaults to 'sunna' when absent. */
  collection?: Collection;
  title: {
    ru: string;
    en: string;
  };
  description?: {
    ru: string;
    en: string;
  };
  duas: DuaItem[];
}
