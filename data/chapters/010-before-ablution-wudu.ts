import { ChapterData } from '../../types';

export const CHAPTER_010: ChapterData = {
    id: 10,
    title: { ru: "Слова поминания Аллаха перед омовением (вуду)", en: "Before ablution (wudu)" },
    duas: [
      {
        id: "10-1",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/12.wav",
        fullTranslation: {
          ru: "С именем Аллаха.",
          en: "In the name of Allah."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0.261, end: 0.964 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 1.024, end: 1.969 }
        ],
        source: { ru: "Абу Дауд 101; Ирва аль-галиль т. 1, с. 122", en: "Abu Dawud 101; Irwa' al-Ghalil vol. 1, p. 122" }
      }
    ]
  };
