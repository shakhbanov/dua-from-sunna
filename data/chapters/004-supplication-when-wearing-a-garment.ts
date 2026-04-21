import { ChapterData } from '../../types';

export const CHAPTER_004: ChapterData = {
    id: 4,
    title: { ru: "Слова поминания Аллаха при одевании", en: "Supplication when wearing a garment" },
    duas: [
      {
        id: "4-1",
        audioUrl: "https://s3.shakhbanov.org/dua-from-sunna/5.wav",
        fullTranslation: {
          ru: "Хвала Аллаху, Который одел меня в эту одежду и наделил меня ею, а сам я не [предпринял бы никаких] действий и не [обладал бы] силой, [не будь на то воли Аллаха].",
          en: "Praise is to Allah who clothed me with this garment and provided it for me, though on my own I had neither power nor strength."
        },
        sync: [
          { text: "الْحَمْدُ", trans: { ru: "Хвала", en: "Praise" }, start: 0.520, end: 1.621 },
          { text: "لِلَّهِ", trans: { ru: "Аллаху", en: "to Allah" }, start: 1.681, end: 2.762 },
          { text: "الَّذِي", trans: { ru: "Который", en: "Who" }, start: 2.782, end: 3.743 },
          { text: "كَسَانِي", trans: { ru: "одел меня", en: "clothed me" }, start: 3.863, end: 5.064 },
          { text: "هَٰذَا", trans: { ru: "в эту", en: "with this" }, start: 5.184, end: 5.784 },
          { text: "الثَّوْبَ", trans: { ru: "одежду", en: "garment" }, start: 5.824, end: 6.765 },
          { text: "وَرَزَقَنِيهِ", trans: { ru: "и наделил меня ею", en: "and provided me with it" }, start: 6.865, end: 8.566 },
          { text: "مِنْ", trans: { ru: "без", en: "without" }, start: 8.626, end: 9.027 },
          { text: "غَيْرِ", trans: { ru: "[всякого]", en: "any" }, start: 9.127, end: 9.747 },
          { text: "حَوْلٍ", trans: { ru: "действия", en: "effort" }, start: 9.907, end: 10.628 },
          { text: "مِنِّي", trans: { ru: "с моей стороны", en: "on my part" }, start: 11.228, end: 12.509 },
          { text: "وَلَا", trans: { ru: "и без", en: "nor" }, start: 12.609, end: 13.150 },
          { text: "قُوَّةٍ", trans: { ru: "[моей] силы", en: "[any] strength" }, start: 13.370, end: 13.910 }
        ],
        source: { ru: "Абу Дауд 4023; Сахих аль-калим 188", en: "Abu Dawud 4023; Sahih al-Kalim 188" }
      }
    ]
  };
