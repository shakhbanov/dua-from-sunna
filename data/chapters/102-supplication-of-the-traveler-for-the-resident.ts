import { ChapterData } from '../../types';

export const CHAPTER_102: ChapterData = {
    id: 102,
    title: { ru: "Мольба за остающихся при отправлении в путь", en: "Supplication of the traveler for the resident" },
    duas: [
      {
        id: "102-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/212.wav",
        fullTranslation: {
          ru: "Отдаю вас под защиту Аллаха, у Которого ничто из отданного на хранение не пропадает!",
          en: "I entrust you to the care of Allah, whose trusts are never lost."
        },
        sync: [
          { text: "أَسْتَوْدِعُكُمُ", trans: { ru: "Отдаю вас под защиту", en: "I entrust you to" }, start: 0, end: 0 },
          { text: "اللَّهَ", trans: { ru: "Аллаха", en: "Allah" }, start: 0, end: 0 },
          { text: "الَّذِي", trans: { ru: "у Которого", en: "(the One) who" }, start: 0, end: 0 },
          { text: "لَا", trans: { ru: "не", en: "not" }, start: 0, end: 0 },
          { text: "تَضِيعُ", trans: { ru: "пропадает", en: "are lost" }, start: 0, end: 0 },
          { text: "وَدَائِعُهُ", trans: { ru: "отданное Ему на хранение", en: "His trusts" }, start: 0, end: 0 }
        ],
        source: "Ахмад 2/403; Ибн Маджа 2825; Сахих Ибн Маджа 2/133"
      }
    ]
  };
