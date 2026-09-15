import { ChapterData } from '../../types';

export const CHAPTER_092: ChapterData = {
    id: 92,
    title: { ru: "Мольба за того, кто предложит тебе свои деньги", en: "Supplication for one who offers you his wealth" },
    duas: [
      {
        id: "92-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/201.mp3",
        fullTranslation: {
          ru: "Да благословит Аллах твою семью и твоё достояние.",
          en: "May Allah bless your family and your wealth."
        },
        sync: [
          { text: "بَارَكَ", trans: { ru: "Да благословит", en: "May bless" }, start: 0.29, end: 0.88 },
          { text: "اللَّهُ", trans: { ru: "Аллах", en: "Allah" }, start: 0.88, end: 1.2 },
          { text: "لَكَ", trans: { ru: "тебе", en: "for you" }, start: 1.2, end: 1.94 },
          { text: "فِي", trans: { ru: "в", en: "in" }, start: 1.94, end: 2.54 },
          { text: "أَهْلِكَ", trans: { ru: "семье твоей", en: "your family" }, start: 2.63, end: 3.08 },
          { text: "وَمَالِكَ", trans: { ru: "и достоянии твоём", en: "and your wealth" }, start: 3.17, end: 4.18 }
        ],
        source: { ru: "аль-Бухари 2049", en: "al-Bukhari 2049" }
      }
    ]
  };
