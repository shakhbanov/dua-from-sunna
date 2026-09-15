import { ChapterData } from '../../types';

export const CHAPTER_066: ChapterData = {
    id: 66,
    title: { ru: "Мольба, с которой желательно обращаться к Аллаху во время дождя", en: "Supplication when it rains" },
    duas: [
      {
        id: "66-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/172.mp3",
        fullTranslation: {
          ru: "О Аллах! Пусть [этот] дождь принесёт пользу.",
          en: "O Allah, [send] a beneficial rain."
        },
        sync: [
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 0.6, end: 1.7 },
          { text: "صَيِّبًا", trans: { ru: "дождём", en: "rain" }, start: 1.9, end: 2.5 },
          { text: "نَافِعًا", trans: { ru: "полезным", en: "that is beneficial" }, start: 2.9, end: 3.88 }
        ],
        source: { ru: "аль-Бухари 1032", en: "al-Bukhari 1032" }
      }
    ]
  };
