import { ChapterData } from '../../types';

export const CHAPTER_095: ChapterData = {
    id: 95,
    title: { ru: "Мольба за того, кто скажет: «Да благословит тебя Аллах»", en: "Praying for one who says: May Allah bless you" },
    duas: [
      {
        id: "95-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/204.mp3?v=cf31051c",
        narration: {
          ru: "Если тебе скажут: «Да благословит тебя Аллах» (Барака Ллаху фи-кя / بَارَكَ اللَّهُ فِيكَ), ответь:",
          en: "When someone says to you \"Baraka-Llahu fika\" (\"May Allah bless you\" — بَارَكَ اللَّهُ فِيكَ), reply:"
        },
        fullTranslation: {
          ru: "И тебя да благословит Аллах!",
          en: "And may Allah bless you too."
        },
        sync: [
          { text: "وَفِيكَ", trans: { ru: "И тебя", en: "And in you" }, start: 0.24, end: 1.1 },
          { text: "بَارَكَ", trans: { ru: "да благословит", en: "may bless" }, start: 1.1, end: 2.08 },
          { text: "اللَّهُ", trans: { ru: "Аллах", en: "Allah" }, start: 2.08, end: 2.42 }
        ],
        source: { ru: "Ибн ас-Сунни, ‘Амаль аль-йаум ва-ль-лейля 278; Сахих аль-Калим ат-таййиб 236", en: "Ibn as-Sunni, ‘Amal al-yawm wa-l-laylah 278; Sahih al-Kalim at-Tayyib 236" }
      }
    ]
  };
