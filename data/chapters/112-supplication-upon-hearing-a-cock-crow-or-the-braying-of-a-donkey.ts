import { ChapterData } from '../../types';

export const CHAPTER_112: ChapterData = {
    id: 112,
    title: { ru: "Что желательно сказать тому, кто услышит крик петуха или ржание осла", en: "Supplication upon hearing a cock crow or the braying of a donkey" },
    duas: [
      {
        id: "112-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/222.mp3?v=18022c27",
        narration: {
          ru: "Передают, что Посланник Аллаха ﷺ сказал: «Когда услышите крик петуха, просите Аллаха о Его милости, ибо, поистине, он увидел ангела…»:",
          en: "The Messenger of Allah ﷺ said: \"When you hear the crowing of a rooster, ask Allah of His bounty, for it has seen an angel…\":"
        },
        fullTranslation: {
          ru: "Прошу Аллаха о Его милости!",
          en: "I ask Allah of His bounty."
        },
        sync: [
          { text: "أَسْأَلُ", trans: { ru: "Прошу", en: "I ask" }, start: 0.28, end: 0.63 },
          { text: "اللَّهَ", trans: { ru: "Аллаха", en: "Allah" }, start: 0.8, end: 1.45 },
          { text: "مِنْ", trans: { ru: "о", en: "of" }, start: 1.45, end: 2.32 },
          { text: "فَضْلِهِ", trans: { ru: "милости Его", en: "His bounty" }, start: 2.32, end: 3.63 }
        ],
        source: { ru: "аль-Бухари 3303; Муслим 2729", en: "al-Bukhari 3303; Muslim 2729" }
      },
      {
        id: "112-2",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/223.mp3?v=7797041e",
        narration: {
          ru: "«…а услышав ржание осла, ищите защиты у Аллаха от шайтана, ибо, поистине, он увидел шайтана»:",
          en: "\"…and when you hear the braying of a donkey, seek refuge with Allah from Shaytan, for it has seen a devil\":"
        },
        fullTranslation: {
          ru: "Прибегаю к защите Аллаха от побиваемого камнями шайтана!",
          en: "I seek refuge in Allah from the accursed Shaytan."
        },
        sync: [
          { text: "أَعُوذُ", trans: { ru: "Прибегаю к защите", en: "I seek refuge" }, start: 0.3, end: 0.84 },
          { text: "بِاللَّهِ", trans: { ru: "Аллаха", en: "in Allah" }, start: 0.84, end: 1.63 },
          { text: "مِنَ", trans: { ru: "от", en: "from" }, start: 1.63, end: 2.04 },
          { text: "الشَّيْطَانِ", trans: { ru: "шайтана", en: "Shaytan" }, start: 2.04, end: 3.35 },
          { text: "الرَّجِيمِ", trans: { ru: "побиваемого камнями", en: "the accursed" }, start: 3.47, end: 5.65 }
        ],
        source: { ru: "аль-Бухари 3303; Муслим 2729", en: "al-Bukhari 3303; Muslim 2729" }
      }
    ]
  };
