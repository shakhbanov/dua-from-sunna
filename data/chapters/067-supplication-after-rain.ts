import { ChapterData } from '../../types';

export const CHAPTER_067: ChapterData = {
    id: 67,
    title: { ru: "Слова поминания Аллаха, которые желательно произносить после дождя", en: "Remembrance after rain" },
    duas: [
      {
        id: "67-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/173.mp3?v=9c3695bf",
        fullTranslation: {
          ru: "Нам был послан дождь по милости Аллаха и милосердию Его.",
          en: "We have been given rain by the grace of Allah and His mercy."
        },
        sync: [
          { text: "مُطِرْنَا", trans: { ru: "Послан нам дождь", en: "We were given rain" }, start: 0.77, end: 1.7 },
          { text: "بِفَضْلِ", trans: { ru: "милостью", en: "by the grace of" }, start: 2.86, end: 3.83 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 3.83, end: 4.26 },
          { text: "وَرَحْمَتِهِ", trans: { ru: "и милосердием Его", en: "and His mercy" }, start: 4.26, end: 5.84 }
        ],
        source: { ru: "Муслим 231", en: "Muslim 231" }
      }
    ]
  };
