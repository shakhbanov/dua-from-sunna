import { ChapterData } from '../../types';

export const CHAPTER_079: ChapterData = {
    id: 79,
    title: { ru: "Слова мольбы, которые желательно произнести, если кто-нибудь чихнёт", en: "Supplications when someone sneezes" },
    description: {
      ru: "Передают, что Пророк ﷺ сказал: **«Если кто-нибудь из вас чихнёт, пусть скажет: „Хвала Аллаху“, и пусть его брат [в исламе] (или: его спутник) скажет ему: „Да помилует тебя Аллах“. И если он скажет ему: „Да помилует тебя Аллах“, пусть [чихнувший] скажет [ему в ответ]: „Да укажет вам Аллах правильный путь и да приведёт Он в порядок [все дела] ваши“»** [аль-Бухари 6224].",
      en: "The Prophet ﷺ said: **\"When any of you sneezes, let him say ‹Al-hamdu li-Llah› (All praise is due to Allah). Let his brother or companion say to him ‹Yarhamuka-Llah› (May Allah have mercy on you). And if he says that to him, let the sneezer reply: ‹Yahdikumu-Llahu wa yuslihu balakum› (May Allah guide you and set right your affairs)\"** [al-Bukhari 6224]."
    },
    duas: [
      {
        id: "79-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/188.wav",
        narration: {
          ru: "Чихнувший говорит:",
          en: "The one who sneezes says:"
        },
        fullTranslation: {
          ru: "Хвала Аллаху.",
          en: "All praise is due to Allah."
        },
        sync: [
          { text: "الْحَمْدُ", trans: { ru: "Хвала", en: "Praise" }, start: 0, end: 0 },
          { text: "لِلَّهِ", trans: { ru: "Аллаху", en: "is to Allah" }, start: 0, end: 0 }
        ],
        source: { ru: "аль-Бухари 6224", en: "al-Bukhari 6224" }
      },
      {
        id: "79-2",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/188a.wav",
        narration: {
          ru: "Слышавший чих отвечает чихнувшему:",
          en: "The one who hears him replies:"
        },
        fullTranslation: {
          ru: "Да помилует тебя Аллах.",
          en: "May Allah have mercy on you."
        },
        sync: [
          { text: "يَرْحَمُكَ", trans: { ru: "Да помилует тебя", en: "May have mercy on you" }, start: 0, end: 0 },
          { text: "اللَّهُ", trans: { ru: "Аллах", en: "Allah" }, start: 0, end: 0 }
        ],
        source: { ru: "аль-Бухари 6224", en: "al-Bukhari 6224" }
      },
      {
        id: "79-3",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/188b.wav",
        narration: {
          ru: "Чихнувший отвечает тому, кто сказал «Йархаму-ка Ллах»:",
          en: "The sneezer then replies to the one who blessed him:"
        },
        fullTranslation: {
          ru: "Да укажет вам Аллах правильный путь и да приведёт Он в порядок [все дела] ваши.",
          en: "May Allah guide you and set right your affairs."
        },
        sync: [
          { text: "يَهْدِيكُمُ", trans: { ru: "Да укажет вам путь", en: "May guide you" }, start: 0, end: 0 },
          { text: "اللَّهُ", trans: { ru: "Аллах", en: "Allah" }, start: 0, end: 0 },
          { text: "وَيُصْلِحُ", trans: { ru: "и да приведёт в порядок", en: "and set right" }, start: 0, end: 0 },
          { text: "بَالَكُمْ", trans: { ru: "дела ваши", en: "your affairs" }, start: 0, end: 0 }
        ],
        source: { ru: "аль-Бухари 6224", en: "al-Bukhari 6224" }
      }
    ]
  };
