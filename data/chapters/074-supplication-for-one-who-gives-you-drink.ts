import { ChapterData } from '../../types';

export const CHAPTER_074: ChapterData = {
    id: 74,
    title: { ru: "Мольба, с которой человеку желательно обратиться к Аллаху за того, кто предложил ему напиться или хотел сделать это", en: "Supplication for one who offers you drink" },
    duas: [
      {
        id: "74-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/183.mp3",
        fullTranslation: {
          ru: "О Аллах! Накорми того, кто накормил меня, и напои того, кто напоил меня.",
          en: "O Allah, feed the one who fed me, and give drink to the one who gave me drink."
        },
        sync: [
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 0.33, end: 1.27 },
          { text: "أَطْعِمْ", trans: { ru: "накорми", en: "feed" }, start: 1.27, end: 2.27 },
          { text: "مَنْ", trans: { ru: "того, кто", en: "the one who" }, start: 2.27, end: 2.63 },
          { text: "أَطْعَمَنِي", trans: { ru: "накормил меня", en: "fed me" }, start: 2.63, end: 3.65 },
          { text: "وَاسْقِ", trans: { ru: "и напои", en: "and give drink to" }, start: 5.16, end: 5.74 },
          { text: "مَنْ", trans: { ru: "того, кто", en: "the one who" }, start: 5.74, end: 6.06 },
          { text: "سَقَانِي", trans: { ru: "напоил меня", en: "gave me drink" }, start: 6.06, end: 7.1 }
        ],
        source: { ru: "Муслим 5362", en: "Muslim 5362" }
      }
    ]
  };
