import { ChapterData } from '../../types';

export const CHAPTER_007: ChapterData = {
    id: 7,
    title: { ru: "Что следует сказать тому, кто снимет с себя одежду", en: "Before undressing" },
    duas: [
      {
        id: "7-1",
        audioUrl: "https://s3.shakhbanov.org/dua-from-sunna/9.wav",
        fullTranslation: {
          ru: "С именем Аллаха.",
          en: "In the name of Allah."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0.261, end: 0.964 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 1.024, end: 1.969 }
        ],
        source: { ru: "ат-Тирмизи 606; Сахих Сунан ат-Тирмизи 606", en: "at-Tirmidhi 606; Sahih Sunan at-Tirmidhi 606" }
      }
    ]
  };
