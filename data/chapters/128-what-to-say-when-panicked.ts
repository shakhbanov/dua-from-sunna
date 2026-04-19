import { ChapterData } from '../../types';

export const CHAPTER_128: ChapterData = {
    id: 128,
    title: { ru: "Что желательно говорить в случае испуга", en: "What to say when panicked" },
    duas: [
      {
        id: "128-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/240.wav",
        narration: {
          ru: "Передают, что, испугавшись чего-либо, Пророк ﷺ говорил:",
          en: "It is reported that when something frightened the Prophet ﷺ, he would say:"
        },
        fullTranslation: {
          ru: "Нет бога, кроме Аллаха!",
          en: "There is no god but Allah."
        },
        sync: [
          { text: "لَا", trans: { ru: "Нет", en: "(There is) no" }, start: 0, end: 0 },
          { text: "إِلَٰهَ", trans: { ru: "бога", en: "god" }, start: 0, end: 0 },
          { text: "إِلَّا", trans: { ru: "кроме", en: "except" }, start: 0, end: 0 },
          { text: "اللَّهُ", trans: { ru: "Аллаха", en: "Allah" }, start: 0, end: 0 }
        ],
        source: "аль-Бухари 3346; Муслим 2880"
      }
    ]
  };
