import { ChapterData } from '../../types';

export const CHAPTER_067: ChapterData = {
    id: 67,
    title: { ru: "Слова поминания Аллаха, которые желательно произносить после дождя", en: "Remembrance after rain" },
    duas: [
      {
        id: "67-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/173.mp3",
        fullTranslation: {
          ru: "Нам был послан дождь по милости Аллаха и милосердию Его.",
          en: "We have been given rain by the grace of Allah and His mercy."
        },
        sync: [
          { text: "مُطِرْنَا", trans: { ru: "Послан нам дождь", en: "We were given rain" }, start: 0.27, end: 1.31 },
          { text: "بِفَضْلِ", trans: { ru: "милостью", en: "by the grace of" }, start: 2.76, end: 3.7 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 3.7, end: 4.12 },
          { text: "وَرَحْمَتِهِ", trans: { ru: "и милосердием Его", en: "and His mercy" }, start: 4.12, end: 5.66 }
        ],
        source: { ru: "Муслим 231", en: "Muslim 231" }
      }
    ]
  };
