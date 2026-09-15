import { ChapterData } from '../../types';

export const CHAPTER_041: ChapterData = {
    id: 41,
    title: { ru: "Что желательно сказать тому, кто испугается кого-либо из людей", en: "What to say when afraid of a group of people" },
    duas: [
      {
        id: "41-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/132.mp3",
        fullTranslation: {
          ru: "О Аллах! Защити меня от них посредством того, что Тебе будет угодно.",
          en: "O Allah, suffice me against them by whatever You will."
        },
        sync: [
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 0.45, end: 1.77 },
          { text: "اكْفِنِيهِمْ", trans: { ru: "защити меня от них", en: "suffice me against them" }, start: 1.77, end: 3.51 },
          { text: "بِمَا", trans: { ru: "посредством того, что", en: "by whatever" }, start: 3.51, end: 4.39 },
          { text: "شِئْتَ", trans: { ru: "Тебе будет угодно", en: "You will" }, start: 4.39, end: 5.43 }
        ],
        source: { ru: "Муслим 7511", en: "Muslim 7511" }
      }
    ]
  };
