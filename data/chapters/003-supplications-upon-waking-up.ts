import { ChapterData } from '../../types';

export const CHAPTER_003: ChapterData = {
    id: 3,
    title: { ru: "Слова поминания при пробуждении ото сна", en: "Supplications upon waking up" },
    duas: [
      {
        id: "3-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/1.wav",
        fullTranslation: {
          ru: "Хвала Аллаху, Который оживил нас после того, как умертвил нас, и к Нему возвращение.",
          en: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection."
        },
        sync: [
          { text: "الْحَمْدُ", trans: { ru: "Хвала", en: "Praise" }, start: 0.240, end: 1.101 },
          { text: "لِلَّهِ", trans: { ru: "Аллаху", en: "To Allah" }, start: 1.141, end: 1.982 },
          { text: "الَّذِي", trans: { ru: "Который", en: "Who" }, start: 2.022, end: 2.703 },
          { text: "أَحْيَا", trans: { ru: "Оживил", en: "Revived" }, start: 2.823, end: 3.664 },
          { text: "نَا", trans: { ru: "Нас", en: "Us" }, start: 3.664, end: 4.045 },
          { text: "بَعْدَ", trans: { ru: "После", en: "After" }, start: 4.165, end: 4.586 },
          { text: "مَا", trans: { ru: "Того как", en: "What" }, start: 4.706, end: 5.066 },
          { text: "أَمَاتَنَا", trans: { ru: "Умертвил нас", en: "Caused us to die" }, start: 5.166, end: 6.388 },
          { text: "وإِلَيْهِ", trans: { ru: "И к Нему", en: "And to Him" }, start: 6.468, end: 7.389 },
          { text: "النُّشُورُ", trans: { ru: "Возвращение", en: "Resurrection" }, start: 7.449, end: 7.970 }
        ]
      }
    ]
  };
