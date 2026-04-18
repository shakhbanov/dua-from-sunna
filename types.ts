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
  source?: string; // e.g. "аль-Бухари 6312; Муслим 6887"
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