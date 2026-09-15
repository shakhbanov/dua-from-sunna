import { ChapterData } from '../../types';

export const CHAPTER_010: ChapterData = {
    id: 10,
    title: { ru: "Слова поминания Аллаха перед омовением (вуду)", en: "Before ablution (wudu)" },
    duas: [
      {
        id: "10-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/12.wav",
        fullTranslation: {
          ru: "С именем Аллаха.",
          en: "In the name of Allah."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0.26, end: 0.96 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 1.02, end: 1.97 }
        ],
        source: { ru: "Абу Дауд 101; Ирва аль-галиль т. 1, с. 122", en: "Abu Dawud 101; Irwa' al-Ghalil vol. 1, p. 122" }
      }
    ]
  };
