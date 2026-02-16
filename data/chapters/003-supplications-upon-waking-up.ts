import { ChapterData } from '../../types';

export const CHAPTER_003: ChapterData = {
    id: 3,
    title: { ru: "Слова поминания при пробуждении ото сна", en: "Supplications upon waking up" },
    duas: [
      {
        id: "3-1",
        // Switched to reliable CDN
        audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/113.mp3",
        fullTranslation: {
          ru: "Хвала Аллаху, Который оживил нас после того, как умертвил нас, и к Нему возвращение.",
          en: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection."
        },
        sync: [
          { text: "الْحَمْدُ", trans: { ru: "Хвала", en: "Praise" }, start: 0, end: 1.0 },
          { text: "لِلَّهِ", trans: { ru: "Аллаху", en: "To Allah" }, start: 1.0, end: 2.0 },
          { text: "الَّذِي", trans: { ru: "Который", en: "Who" }, start: 2.0, end: 3.0 },
          { text: "أَحْيَا", trans: { ru: "Оживил", en: "Revived" }, start: 3.0, end: 4.0 },
          { text: "نَا", trans: { ru: "Нас", en: "Us" }, start: 4.0, end: 5.0 },
          { text: "بَعْدَ", trans: { ru: "После", en: "After" }, start: 5.0, end: 5.5 },
          { text: "مَا", trans: { ru: "Того как", en: "What" }, start: 5.5, end: 6.0 },
          { text: "أَمَاتَنَا", trans: { ru: "Умертвил нас", en: "Caused us to die" }, start: 6.0, end: 7.5 },
          { text: "وإِلَيْهِ", trans: { ru: "И к Нему", en: "And to Him" }, start: 7.5, end: 8.5 },
          { text: "النُّشُورُ", trans: { ru: "Возвращение", en: "Resurrection" }, start: 8.5, end: 10.0 }
        ]
      }
    ]
  };
