import { ChapterData } from '../../types';

export const CHAPTER_089: ChapterData = {
    id: 89,
    title: { ru: "Слова мольбы за того, кто сделает тебе добро", en: "Praying for one who does you a favor" },
    duas: [
      {
        id: "89-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/198.wav",
        fullTranslation: {
          ru: "Да воздаст тебе Аллах благом.",
          en: "May Allah reward you with good."
        },
        sync: [
          { text: "جَزَاكَ", trans: { ru: "Да воздаст тебе", en: "May reward you" }, start: 0, end: 0 },
          { text: "اللَّهُ", trans: { ru: "Аллах", en: "Allah" }, start: 0, end: 0 },
          { text: "خَيْرًا", trans: { ru: "благом", en: "with good" }, start: 0, end: 0 }
        ],
        note: {
          ru: "Пророк ﷺ сказал: «Тот, кому сделали добро, а он сказал сделавшему: „Да воздаст тебе Аллах благом“, воистину воздал ему лучшей благодарностью» [ат-Тирмизи 2035].",
          en: "The Prophet ﷺ said: \"Whoever has good done to him and says to the one who did it ‹Jazaka-Llahu khayran›, has given him the best of thanks\" [at-Tirmidhi 2035]."
        },
        source: "ат-Тирмизи 2035; Сахих Сунан ат-Тирмизи 2035"
      }
    ]
  };
