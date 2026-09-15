import { ChapterData } from '../../types';

export const CHAPTER_008: ChapterData = {
    id: 8,
    title: { ru: "Слова обращения к Аллаху при входе в отхожее место", en: "Before entering the toilet" },
    duas: [
      {
        id: "8-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/10.mp3",
        fullTranslation: {
          ru: "С именем Аллаха. О Аллах! Поистине, я прибегаю к Твоей защите от злых духов обоего пола.",
          en: "In the name of Allah. O Allah, I seek refuge with You from male and female devils."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0.28, end: 0.72 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 0.72, end: 1.32 },
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 3.06, end: 3.94 },
          { text: "إِنِّي", trans: { ru: "поистине я", en: "verily I" }, start: 3.94, end: 5.06 },
          { text: "أَعُوذُ", trans: { ru: "прибегаю", en: "seek refuge" }, start: 5.06, end: 6.08 },
          { text: "بِكَ", trans: { ru: "к Тебе", en: "with You" }, start: 6.08, end: 6.83 },
          { text: "مِنَ", trans: { ru: "от", en: "from" }, start: 7.44, end: 7.59 },
          { text: "الْخُبُثِ", trans: { ru: "злых духов [мужского пола]", en: "male devils" }, start: 7.59, end: 9.0 },
          { text: "وَالْخَبَائِثِ", trans: { ru: "и [женского пола]", en: "and female devils" }, start: 9.48, end: 11.32 }
        ],
        source: { ru: "Муслим 831; Сахих аль-джами‘ 3611", en: "Muslim 831; Sahih al-Jami‘ 3611" }
      }
    ]
  };
