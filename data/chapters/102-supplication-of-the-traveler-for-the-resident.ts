import { ChapterData } from '../../types';

export const CHAPTER_102: ChapterData = {
    id: 102,
    title: { ru: "Мольба за остающихся при отправлении в путь", en: "Supplication of the traveler for the resident" },
    duas: [
      {
        id: "102-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/212.mp3",
        fullTranslation: {
          ru: "Отдаю вас под защиту Аллаха, у Которого ничто из отданного на хранение не пропадает!",
          en: "I entrust you to the care of Allah, whose trusts are never lost."
        },
        sync: [
          { text: "أَسْتَوْدِعُكُمُ", trans: { ru: "Отдаю вас под защиту", en: "I entrust you to" }, start: 0.24, end: 1.46 },
          { text: "اللَّهَ", trans: { ru: "Аллаха", en: "Allah" }, start: 1.46, end: 2.1 },
          { text: "الَّذِي", trans: { ru: "у Которого", en: "(the One) who" }, start: 2.1, end: 2.9 },
          { text: "لَا", trans: { ru: "не", en: "not" }, start: 2.9, end: 3.54 },
          { text: "تَضِيعُ", trans: { ru: "пропадает", en: "are lost" }, start: 3.54, end: 4.46 },
          { text: "وَدَائِعُهُ", trans: { ru: "отданное Ему на хранение", en: "His trusts" }, start: 4.46, end: 5.5 }
        ],
        source: { ru: "Ахмад 2/403; Ибн Маджа 2825; Сахих Ибн Маджа 2/133", en: "Ahmad 2/403; Ibn Majah 2825; Sahih Ibn Majah 2/133" }
      }
    ]
  };
