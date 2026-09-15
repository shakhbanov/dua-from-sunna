import { ChapterData } from '../../types';

export const CHAPTER_075: ChapterData = {
    id: 75,
    title: { ru: "Мольба, с которой желательно обратиться к Аллаху тому, кто разговелся у кого-либо", en: "Supplication when breaking the fast at someone's home" },
    duas: [
      {
        id: "75-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/184.mp3",
        fullTranslation: {
          ru: "Да разговляются у вас постящиеся, да вкушают вашу еду праведные и да благословляют вас ангелы.",
          en: "May the fasting break their fast with you, may the righteous eat your food, and may the angels send blessings upon you."
        },
        sync: [
          { text: "أَفْطَرَ", trans: { ru: "Да разговляются", en: "May break their fast" }, start: 0.18, end: 0.84 },
          { text: "عِنْدَكُمُ", trans: { ru: "у вас", en: "with you" }, start: 0.84, end: 1.8 },
          { text: "الصَّائِمُونَ", trans: { ru: "постящиеся", en: "the fasting ones" }, start: 1.8, end: 3.32 },
          { text: "وَأَكَلَ", trans: { ru: "и да вкушают", en: "and may eat" }, start: 5.58, end: 6.26 },
          { text: "طَعَامَكُمُ", trans: { ru: "вашу еду", en: "your food" }, start: 6.26, end: 7.46 },
          { text: "الْأَبْرَارُ", trans: { ru: "праведные", en: "the righteous" }, start: 7.46, end: 8.58 },
          { text: "وَصَلَّتْ", trans: { ru: "и да благословляют", en: "and may send blessings" }, start: 11.52, end: 12.4 },
          { text: "عَلَيْكُمُ", trans: { ru: "на вас", en: "upon you" }, start: 12.4, end: 13.24 },
          { text: "الْمَلَائِكَةُ", trans: { ru: "ангелы", en: "the angels" }, start: 13.24, end: 15.7 }
        ],
        source: { ru: "Абу Дауд 3854; Сахих аль-джами‘ 1137", en: "Abu Dawud 3854; Sahih al-Jami‘ 1137" }
      }
    ]
  };
