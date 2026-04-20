import { ChapterData } from '../../types';

export const CHAPTER_013: ChapterData = {
    id: 13,
    title: { ru: "Слова поминания Аллаха при входе в дом", en: "When entering the home" },
    duas: [
      {
        id: "13-1",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/18.wav",
        fullTranslation: {
          ru: "С именем Аллаха мы вошли, с именем Аллаха мы вышли и на Аллаха, Господа нашего, мы полагаемся.",
          en: "In the name of Allah we have entered, in the name of Allah we have departed, and upon Allah, our Lord, we rely."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0.200, end: 0.661 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 0.701, end: 1.342 },
          { text: "وَلَجْنَا", trans: { ru: "мы вошли", en: "we have entered" }, start: 1.422, end: 2.723 },
          { text: "وَبِسْمِ", trans: { ru: "и с именем", en: "and in the name of" }, start: 2.803, end: 3.364 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 3.404, end: 3.985 },
          { text: "خَرَجْنَا", trans: { ru: "мы вышли", en: "we have departed" }, start: 4.105, end: 5.327 },
          { text: "وَعَلَى", trans: { ru: "и на", en: "and upon" }, start: 5.447, end: 5.907 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 5.947, end: 6.568 },
          { text: "رَبِّنَا", trans: { ru: "Господа нашего", en: "our Lord" }, start: 6.668, end: 7.389 },
          { text: "تَوَكَّلْنَا", trans: { ru: "мы полагаемся", en: "we rely" }, start: 7.509, end: 8.450 }
        ],
        note: {
          ru: "Сказав это, вошедшему следует обратиться с приветствием к тем, кто находится в доме.",
          en: "Having said this, the one entering should greet those who are in the house with the salām."
        },
        source: { ru: "Абу Дауд 5096", en: "Abu Dawud 5096" }
      }
    ]
  };
