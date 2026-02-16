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
  fullTranslation: {
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