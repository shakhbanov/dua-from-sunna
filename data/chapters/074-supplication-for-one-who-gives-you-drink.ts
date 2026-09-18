import { ChapterData } from '../../types';

export const CHAPTER_074: ChapterData = {
    id: 74,
    title: { ru: "Мольба, с которой человеку желательно обратиться к Аллаху за того, кто предложил ему напиться или хотел сделать это", en: "Supplication for one who offers you drink" },
    duas: [
      {
        id: "74-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/183.mp3?v=4caaf377",
        fullTranslation: {
          ru: "О Аллах! Накорми того, кто накормил меня, и напои того, кто напоил меня.",
          en: "O Allah, feed the one who fed me, and give drink to the one who gave me drink."
        },
        sync: [
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 0.42, end: 1.07 },
          { text: "أَطْعِمْ", trans: { ru: "накорми", en: "feed" }, start: 1.07, end: 1.76 },
          { text: "مَنْ", trans: { ru: "того, кто", en: "the one who" }, start: 2.1, end: 2.87 },
          { text: "أَطْعَمَنِي", trans: { ru: "накормил меня", en: "fed me" }, start: 3.17, end: 3.86 },
          { text: "وَاسْقِ", trans: { ru: "и напои", en: "and give drink to" }, start: 5.28, end: 5.74 },
          { text: "مَنْ", trans: { ru: "того, кто", en: "the one who" }, start: 5.86, end: 6.03 },
          { text: "سَقَانِي", trans: { ru: "напоил меня", en: "gave me drink" }, start: 6.03, end: 6.57 }
        ],
        source: { ru: "Муслим 5362", en: "Muslim 5362" }
      }
    ]
  };
