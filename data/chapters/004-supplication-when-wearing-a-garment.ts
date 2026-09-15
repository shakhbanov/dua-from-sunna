import { ChapterData } from '../../types';

export const CHAPTER_004: ChapterData = {
    id: 4,
    title: { ru: "Слова поминания Аллаха при одевании", en: "Supplication when wearing a garment" },
    duas: [
      {
        id: "4-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/5.wav",
        fullTranslation: {
          ru: "Хвала Аллаху, Который одел меня в эту одежду и наделил меня ею, а сам я не [предпринял бы никаких] действий и не [обладал бы] силой, [не будь на то воли Аллаха].",
          en: "Praise is to Allah who clothed me with this garment and provided it for me, though on my own I had neither power nor strength."
        },
        sync: [
          { text: "الْحَمْدُ", trans: { ru: "Хвала", en: "Praise" }, start: 0.52, end: 1.62 },
          { text: "لِلَّهِ", trans: { ru: "Аллаху", en: "to Allah" }, start: 1.68, end: 2.76 },
          { text: "الَّذِي", trans: { ru: "Который", en: "Who" }, start: 2.78, end: 3.74 },
          { text: "كَسَانِي", trans: { ru: "одел меня", en: "clothed me" }, start: 3.86, end: 5.06 },
          { text: "هَٰذَا", trans: { ru: "в эту", en: "with this" }, start: 5.18, end: 5.78 },
          { text: "الثَّوْبَ", trans: { ru: "одежду", en: "garment" }, start: 5.82, end: 6.76 },
          { text: "وَرَزَقَنِيهِ", trans: { ru: "и наделил меня ею", en: "and provided me with it" }, start: 6.87, end: 8.57 },
          { text: "مِنْ", trans: { ru: "без", en: "without" }, start: 8.63, end: 9.03 },
          { text: "غَيْرِ", trans: { ru: "[всякого]", en: "any" }, start: 9.13, end: 9.75 },
          { text: "حَوْلٍ", trans: { ru: "действия", en: "effort" }, start: 9.91, end: 10.63 },
          { text: "مِنِّي", trans: { ru: "с моей стороны", en: "on my part" }, start: 11.23, end: 12.51 },
          { text: "وَلَا", trans: { ru: "и без", en: "nor" }, start: 12.61, end: 13.15 },
          { text: "قُوَّةٍ", trans: { ru: "[моей] силы", en: "[any] strength" }, start: 13.37, end: 13.91 }
        ],
        source: { ru: "Абу Дауд 4023; Сахих аль-калим 188", en: "Abu Dawud 4023; Sahih al-Kalim 188" }
      }
    ]
  };
