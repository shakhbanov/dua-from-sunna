import { ChapterData } from '../../types';

export const CHAPTER_012: ChapterData = {
    id: 12,
    title: { ru: "Слова поминания Аллаха при выходе из дома", en: "When leaving the home" },
    duas: [
      {
        id: "12-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/16.wav",
        fullTranslation: {
          ru: "С именем Аллаха, уповаю на Аллаха, нет мощи и силы ни у кого, кроме Аллаха.",
          en: "In the name of Allah, I trust in Allah; there is no might and no power except with Allah."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0.28, end: 0.76 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 0.8, end: 1.6 },
          { text: "تَوَكَّلْتُ", trans: { ru: "уповаю", en: "I trust" }, start: 1.7, end: 2.84 },
          { text: "عَلَى", trans: { ru: "на", en: "in" }, start: 2.92, end: 3.22 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 3.24, end: 4.03 },
          { text: "لَا", trans: { ru: "нет", en: "no" }, start: 4.12, end: 4.43 },
          { text: "حَوْلَ", trans: { ru: "мощи", en: "might" }, start: 4.59, end: 5.17 },
          { text: "وَلَا", trans: { ru: "и нет", en: "nor" }, start: 5.27, end: 5.71 },
          { text: "قُوَّةَ", trans: { ru: "силы", en: "power" }, start: 5.89, end: 6.65 },
          { text: "إِلَّا", trans: { ru: "кроме как", en: "except" }, start: 6.75, end: 7.37 },
          { text: "بِاللَّهِ", trans: { ru: "в Аллахе", en: "by Allah" }, start: 7.47, end: 8.29 }
        ],
        source: { ru: "Абу Дауд 5095; Сахих аль-джами‘ 499", en: "Abu Dawud 5095; Sahih al-Jami‘ 499" }
      },
      {
        id: "12-2",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/17.wav",
        fullTranslation: {
          ru: "О Аллах! Поистине, я прибегаю к Твоей защите от того, чтобы сбиться с пути или оказаться сбитым с него, от того, чтобы самому допустить ошибку, и от того, чтобы меня заставили ошибиться, от того, чтобы самому допустить несправедливость, и от того, чтобы со мной поступили несправедливо, от того, чтобы поступать подобно невежественным, и от того, чтобы [люди] поступали так со мной.",
          en: "O Allah, I seek refuge with You lest I should stray or be led astray, lest I should slip or be made to slip, lest I should wrong others or be wronged, lest I should act foolishly or be treated foolishly."
        },
        sync: [
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 0.32, end: 1.18 },
          { text: "إِنِّي", trans: { ru: "поистине я", en: "verily I" }, start: 1.26, end: 1.9 },
          { text: "أَعُوذُ", trans: { ru: "прибегаю", en: "seek refuge" }, start: 1.98, end: 2.66 },
          { text: "بِكَ", trans: { ru: "к Тебе", en: "with You" }, start: 2.72, end: 3.06 },
          { text: "أَنْ", trans: { ru: "чтобы [не]", en: "lest" }, start: 3.14, end: 3.38 },
          { text: "أَضِلَّ", trans: { ru: "сбиться [с пути]", en: "I should stray" }, start: 3.44, end: 4.16 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 4.22, end: 4.48 },
          { text: "أُضَلَّ", trans: { ru: "быть сбитым", en: "be led astray" }, start: 4.56, end: 6.3 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 6.38, end: 6.64 },
          { text: "أَزِلَّ", trans: { ru: "оступиться [впасть в грех]", en: "slip [into sin]" }, start: 6.72, end: 7.45 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 7.5, end: 7.79 },
          { text: "أُزَلَّ", trans: { ru: "быть подведённым к нему", en: "be made to slip" }, start: 7.87, end: 9.53 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 9.63, end: 9.89 },
          { text: "أَظْلِمَ", trans: { ru: "проявить несправедливость", en: "wrong [others]" }, start: 9.97, end: 10.69 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 10.77, end: 11.05 },
          { text: "أُظْلَمَ", trans: { ru: "быть обиженным", en: "be wronged" }, start: 11.15, end: 12.69 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 12.77, end: 13.03 },
          { text: "أَجْهَلَ", trans: { ru: "проявить невежество", en: "act foolishly" }, start: 13.11, end: 13.85 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 13.93, end: 14.21 },
          { text: "يُجْهَلَ", trans: { ru: "[чтобы со мной] поступили невежественно", en: "be treated foolishly" }, start: 14.29, end: 14.99 },
          { text: "عَلَيَّ", trans: { ru: "со мной", en: "against me" }, start: 15.09, end: 15.63 }
        ],
        source: { ru: "Абу Дауд 5094; аль-Калим ат-таййиб 60", en: "Abu Dawud 5094; al-Kalim at-Tayyib 60" }
      }
    ]
  };
