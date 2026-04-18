import { ChapterData } from '../../types';

export const CHAPTER_008: ChapterData = {
    id: 8,
    title: { ru: "Слова обращения к Аллаху при входе в отхожее место", en: "Before entering the toilet" },
    duas: [
      {
        id: "8-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/10.wav",
        fullTranslation: {
          ru: "С именем Аллаха. О Аллах! Поистине, я прибегаю к Твоей защите от злых духов обоего пола.",
          en: "In the name of Allah. O Allah, I seek refuge with You from male and female devils."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0, end: 0 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 0, end: 0 },
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 0, end: 0 },
          { text: "إِنِّي", trans: { ru: "поистине я", en: "verily I" }, start: 0, end: 0 },
          { text: "أَعُوذُ", trans: { ru: "прибегаю", en: "seek refuge" }, start: 0, end: 0 },
          { text: "بِكَ", trans: { ru: "к Тебе", en: "with You" }, start: 0, end: 0 },
          { text: "مِنَ", trans: { ru: "от", en: "from" }, start: 0, end: 0 },
          { text: "الْخُبُثِ", trans: { ru: "злых духов [мужского пола]", en: "male devils" }, start: 0, end: 0 },
          { text: "وَالْخَبَائِثِ", trans: { ru: "и [женского пола]", en: "and female devils" }, start: 0, end: 0 }
        ],
        source: "Муслим 831; Сахих аль-джами‘ 3611"
      }
    ]
  };
