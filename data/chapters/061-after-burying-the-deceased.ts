import { ChapterData } from '../../types';

export const CHAPTER_061: ChapterData = {
    id: 61,
    title: { ru: "Мольба, с которой желательно обратиться к Аллаху после погребения", en: "Supplication after burying the deceased" },
    duas: [
      {
        id: "61-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/164.mp3?v=eac87115",
        fullTranslation: {
          ru: "О Аллах! Прости его. О Аллах! Укрепи его.",
          en: "O Allah, forgive him. O Allah, make him firm."
        },
        sync: [
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 0.3, end: 1.24 },
          { text: "اغْفِرْ", trans: { ru: "прости", en: "forgive" }, start: 1.24, end: 2.23 },
          { text: "لَهُ", trans: { ru: "его", en: "him" }, start: 2.23, end: 2.58 },
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 4.09, end: 4.9 },
          { text: "ثَبِّتْهُ", trans: { ru: "укрепи его", en: "make him firm" }, start: 4.9, end: 6.07 }
        ],
        note: {
          ru: "«Укрепи его» — то есть дай ему твёрдость при ответе ангелам в могиле.",
          en: "\"Make him firm\" — i.e., grant him firmness when answering the angels in the grave."
        },
        source: { ru: "Абу Дауд 3221; Сахих аль-джами‘ 945", en: "Abu Dawud 3221; Sahih al-Jami‘ 945" }
      }
    ]
  };
