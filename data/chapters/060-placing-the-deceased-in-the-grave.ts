import { ChapterData } from '../../types';

export const CHAPTER_060: ChapterData = {
    id: 60,
    title: { ru: "Слова, которые желательно произнести, когда покойного будут опускать в могилу", en: "Placing the deceased in the grave" },
    duas: [
      {
        id: "60-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/163.wav",
        fullTranslation: {
          ru: "С именем Аллаха и согласно сунне посланника Аллаха.",
          en: "In the name of Allah, and according to the Sunnah of the Messenger of Allah."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0, end: 0 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 0, end: 0 },
          { text: "وَعَلَىٰ", trans: { ru: "и согласно", en: "and according to" }, start: 0, end: 0 },
          { text: "سُنَّةِ", trans: { ru: "сунне", en: "the Sunnah of" }, start: 0, end: 0 },
          { text: "رَسُولِ", trans: { ru: "Посланника", en: "the Messenger of" }, start: 0, end: 0 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 0, end: 0 }
        ],
        source: { ru: "Абу Дауд 3213; Сахих аль-джами‘ 832", en: "Abu Dawud 3213; Sahih al-Jami‘ 832" }
      }
    ]
  };
