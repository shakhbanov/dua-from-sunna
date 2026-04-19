export type Language = 'ru' | 'en';

export interface WordSync {
  text: string; // Arabic text
  trans: {
    ru: string;
    en: string;
  };
  start: number;
  end: number;
}

export interface DuaItem {
  id: string; // Unique string ID for the sub-dua (e.g., "1-1")
  audioUrl: string;
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
  sync: WordSync[];
}

export interface ChapterData {
  id: number;
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