import { ChapterData } from '../../types';

export const CHAPTER_128: ChapterData = {
    id: 128,
    title: { ru: "Что желательно говорить в случае испуга", en: "What to say when panicked" },
    duas: [
      {
        id: "128-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/240.mp3?v=be0956f5",
        narration: {
          ru: "Передают, что, испугавшись чего-либо, Пророк ﷺ говорил:",
          en: "It is reported that when something frightened the Prophet ﷺ, he would say:"
        },
        fullTranslation: {
          ru: "Нет бога, кроме Аллаха!",
          en: "There is no god but Allah."
        },
        sync: [
          { text: "لَا", trans: { ru: "Нет", en: "(There is) no" }, start: 0.18, end: 0.36 },
          { text: "إِلَٰهَ", trans: { ru: "бога", en: "god" }, start: 0.36, end: 2.0 },
          { text: "إِلَّا", trans: { ru: "кроме", en: "except" }, start: 2.0, end: 2.88 },
          { text: "اللَّهُ", trans: { ru: "Аллаха", en: "Allah" }, start: 2.88, end: 3.42 }
        ],
        source: { ru: "аль-Бухари 3346; Муслим 2880", en: "al-Bukhari 3346; Muslim 2880" }
      }
    ]
  };
