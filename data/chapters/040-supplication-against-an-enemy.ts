import { ChapterData } from '../../types';

export const CHAPTER_040: ChapterData = {
    id: 40,
    title: { ru: "Призывание проклятия на врага", en: "Supplication against an enemy" },
    duas: [
      {
        id: "40-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/131.mp3?v=8a9b4d0e",
        fullTranslation: {
          ru: "О Аллах, ниспославший Писание и скорый в расчёте! Нанеси поражение [этим людям]. О Аллах! Разбей их и потряси их.",
          en: "O Allah, Revealer of the Book, swift in reckoning! Defeat the confederates. O Allah, rout them and shake them."
        },
        sync: [
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 0.39, end: 1.43 },
          { text: "مُنْزِلَ", trans: { ru: "Ниспославший", en: "Revealer of" }, start: 1.43, end: 2.56 },
          { text: "الْكِتَابِ", trans: { ru: "Писание", en: "the Book" }, start: 2.56, end: 3.52 },
          { text: "سَرِيعَ", trans: { ru: "Скорый в", en: "swift in" }, start: 4.11, end: 5.02 },
          { text: "الْحِسَابِ", trans: { ru: "расчёте", en: "reckoning" }, start: 5.02, end: 5.88 },
          { text: "اهْزِمِ", trans: { ru: "нанеси поражение", en: "defeat" }, start: 6.52, end: 7.37 },
          { text: "الْأَحْزَابَ", trans: { ru: "собравшимся [против нас]", en: "the confederates" }, start: 7.37, end: 8.4 },
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 9.13, end: 10.6 },
          { text: "اهْزِمْهُمْ", trans: { ru: "разбей их", en: "rout them" }, start: 10.6, end: 11.53 },
          { text: "وَزَلْزِلْهُمْ", trans: { ru: "и потряси их", en: "and shake them" }, start: 11.53, end: 12.74 }
        ],
        source: { ru: "аль-Бухари 4115", en: "al-Bukhari 4115" }
      }
    ]
  };
