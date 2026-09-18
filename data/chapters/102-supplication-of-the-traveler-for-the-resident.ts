import { ChapterData } from '../../types';

export const CHAPTER_102: ChapterData = {
    id: 102,
    title: { ru: "Мольба за остающихся при отправлении в путь", en: "Supplication of the traveler for the resident" },
    duas: [
      {
        id: "102-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/212.mp3?v=bbb076de",
        fullTranslation: {
          ru: "Отдаю вас под защиту Аллаха, у Которого ничто из отданного на хранение не пропадает!",
          en: "I entrust you to the care of Allah, whose trusts are never lost."
        },
        sync: [
          { text: "أَسْتَوْدِعُكُمُ", trans: { ru: "Отдаю вас под защиту", en: "I entrust you to" }, start: 0.74, end: 1.88 },
          { text: "اللَّهَ", trans: { ru: "Аллаха", en: "Allah" }, start: 1.88, end: 2.48 },
          { text: "الَّذِي", trans: { ru: "у Которого", en: "(the One) who" }, start: 2.48, end: 3.23 },
          { text: "لَا", trans: { ru: "не", en: "not" }, start: 3.23, end: 3.83 },
          { text: "تَضِيعُ", trans: { ru: "пропадает", en: "are lost" }, start: 3.83, end: 4.68 },
          { text: "وَدَائِعُهُ", trans: { ru: "отданное Ему на хранение", en: "His trusts" }, start: 4.68, end: 5.66 }
        ],
        source: { ru: "Ахмад 2/403; Ибн Маджа 2825; Сахих Ибн Маджа 2/133", en: "Ahmad 2/403; Ibn Majah 2825; Sahih Ibn Majah 2/133" }
      }
    ]
  };
