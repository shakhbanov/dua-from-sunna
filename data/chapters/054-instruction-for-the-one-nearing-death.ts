import { ChapterData } from '../../types';

export const CHAPTER_054: ChapterData = {
    id: 54,
    title: { ru: "Что следует подсказывать умирающему", en: "Instruction (talqīn) for the one nearing death" },
    duas: [
      {
        id: "54-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/153.wav",
        narration: {
          ru: "Передают, что Посланник Аллаха ﷺ сказал: «Войдёт в Рай тот [человек], последними словами которого [станут слова]:»",
          en: "The Messenger of Allah ﷺ said: \"Whoever's last words are the following will enter Paradise:\""
        },
        fullTranslation: {
          ru: "Нет бога, кроме Аллаха.",
          en: "There is no god but Allah."
        },
        sync: [
          { text: "لَا", trans: { ru: "Нет", en: "(There is) no" }, start: 0, end: 0 },
          { text: "إِلَٰهَ", trans: { ru: "бога", en: "god" }, start: 0, end: 0 },
          { text: "إِلَّا", trans: { ru: "кроме", en: "but" }, start: 0, end: 0 },
          { text: "اللَّهُ", trans: { ru: "Аллаха", en: "Allah" }, start: 0, end: 0 }
        ],
        note: {
          ru: "Шейх аль-Албани сказал: «Под подсказкой подразумевается не произнесение слов свидетельства в присутствии умирающего так, чтобы он их слышал, как полагают некоторые, а веление умирающему произносить эти слова».",
          en: "Shaykh al-Albani said: \"The ‹talqīn› here is not for others to recite the shahada aloud in the dying person's presence, as some suppose, but rather to instruct the dying person himself to say these words.\""
        },
        source: { ru: "Абу Дауд 3116; Сахих аль-джами‘ 6479", en: "Abu Dawud 3116; Sahih al-Jami‘ 6479" }
      }
    ]
  };
