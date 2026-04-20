import { ChapterData } from '../../types';

export const CHAPTER_006: ChapterData = {
    id: 6,
    title: { ru: "Слова мольбы за того, кто наденет новую одежду", en: "Supplication for someone wearing a new garment" },
    duas: [
      {
        id: "6-1",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/7.wav",
        fullTranslation: {
          ru: "Да возместит тебе Аллах Всевышний, когда ты износишь [её].",
          en: "May Allah the Exalted give you a replacement when [the garment] wears out."
        },
        sync: [
          { text: "تُبْلِي", trans: { ru: "[Когда] ты износишь", en: "[When] you wear it out" }, start: 0.261, end: 1.123 },
          { text: "وَيُخْلِفُ", trans: { ru: "да возместит", en: "may replace it" }, start: 1.203, end: 2.025 },
          { text: "اللَّهُ", trans: { ru: "Аллах", en: "Allah" }, start: 2.065, end: 2.300 },
          { text: "تَعَالَىٰ", trans: { ru: "Всевышний", en: "the Exalted" }, start: 2.340, end: 3.920 }
        ],
        source: { ru: "Абу Дауд 4020", en: "Abu Dawud 4020" }
      },
      {
        id: "6-2",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/8.wav",
        fullTranslation: {
          ru: "Носи новое, живи достойно и умри шахидом.",
          en: "Wear it out anew, live in praise, and die a martyr."
        },
        sync: [
          { text: "الْبَسْ", trans: { ru: "Носи", en: "Wear" }, start: 0.240, end: 0.901 },
          { text: "جَدِيدًا", trans: { ru: "новое", en: "new [clothing]" }, start: 0.962, end: 2.584 },
          { text: "وَعِشْ", trans: { ru: "и живи", en: "and live" }, start: 2.664, end: 3.165 },
          { text: "حَمِيدًا", trans: { ru: "достойно", en: "praiseworthy" }, start: 3.285, end: 4.868 },
          { text: "وَمُتْ", trans: { ru: "и умри", en: "and die" }, start: 4.948, end: 5.469 },
          { text: "شَهِيدًا", trans: { ru: "шахидом", en: "a martyr" }, start: 5.509, end: 6.170 }
        ],
        source: { ru: "Ибн Маджа 3558; Сильсиля ас-сахиха 352", en: "Ibn Majah 3558; Silsilah as-Sahihah 352" }
      }
    ]
  };
