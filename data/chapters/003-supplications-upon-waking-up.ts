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
          { text: "الْحَمْدُ", trans: { ru: "Хвала", en: "Praise" }, start: 0.252, end: 1.096 },
          { text: "لِلَّهِ", trans: { ru: "Аллаху", en: "To Allah" }, start: 1.156, end: 1.979 },
          { text: "الَّذِي", trans: { ru: "Который", en: "Who" }, start: 2.020, end: 2.723 },
          { text: "أَحْيَا", trans: { ru: "Оживил", en: "Revived" }, start: 2.823, end: 3.653 },
          { text: "نَا", trans: { ru: "Нас", en: "Us" }, start: 3.653, end: 4.068 },
          { text: "بَعْدَ", trans: { ru: "После", en: "After" }, start: 4.189, end: 4.591 },
          { text: "مَا", trans: { ru: "Того как", en: "What" }, start: 4.731, end: 5.073 },
          { text: "أَمَاتَنَا", trans: { ru: "Умертвил нас", en: "Caused us to die" }, start: 5.193, end: 5.977 },
          { text: "وإِلَيْهِ", trans: { ru: "И к Нему", en: "And to Him" }, start: 5.997, end: 6.378 },
          { text: "النُّشُورُ", trans: { ru: "Возвращение", en: "Resurrection" }, start: 6.398, end: 6.559 }
        ]
      }
    ]
  };
