import { ChapterData } from '../../types';

export const CHAPTER_012: ChapterData = {
    id: 12,
    title: { ru: "Слова поминания Аллаха при выходе из дома", en: "When leaving the home" },
    duas: [
      {
        id: "12-1",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/16.wav",
        fullTranslation: {
          ru: "С именем Аллаха, уповаю на Аллаха, нет мощи и силы ни у кого, кроме Аллаха.",
          en: "In the name of Allah, I trust in Allah; there is no might and no power except with Allah."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0.280, end: 0.761 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 0.801, end: 1.602 },
          { text: "تَوَكَّلْتُ", trans: { ru: "уповаю", en: "I trust" }, start: 1.702, end: 2.844 },
          { text: "عَلَى", trans: { ru: "на", en: "in" }, start: 2.924, end: 3.224 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 3.244, end: 4.025 },
          { text: "لَا", trans: { ru: "нет", en: "no" }, start: 4.125, end: 4.426 },
          { text: "حَوْلَ", trans: { ru: "мощи", en: "might" }, start: 4.586, end: 5.167 },
          { text: "وَلَا", trans: { ru: "и нет", en: "nor" }, start: 5.267, end: 5.707 },
          { text: "قُوَّةَ", trans: { ru: "силы", en: "power" }, start: 5.887, end: 6.648 },
          { text: "إِلَّا", trans: { ru: "кроме как", en: "except" }, start: 6.749, end: 7.369 },
          { text: "بِاللَّهِ", trans: { ru: "в Аллахе", en: "by Allah" }, start: 7.469, end: 8.290 }
        ],
        source: { ru: "Абу Дауд 5095; Сахих аль-джами‘ 499", en: "Abu Dawud 5095; Sahih al-Jami‘ 499" }
      },
      {
        id: "12-2",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/17.wav",
        fullTranslation: {
          ru: "О Аллах! Поистине, я прибегаю к Твоей защите от того, чтобы сбиться с пути или оказаться сбитым с него, от того, чтобы самому допустить ошибку, и от того, чтобы меня заставили ошибиться, от того, чтобы самому допустить несправедливость, и от того, чтобы со мной поступили несправедливо, от того, чтобы поступать подобно невежественным, и от того, чтобы [люди] поступали так со мной.",
          en: "O Allah, I seek refuge with You lest I should stray or be led astray, lest I should slip or be made to slip, lest I should wrong others or be wronged, lest I should act foolishly or be treated foolishly."
        },
        sync: [
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 0.320, end: 1.181 },
          { text: "إِنِّي", trans: { ru: "поистине я", en: "verily I" }, start: 1.261, end: 1.901 },
          { text: "أَعُوذُ", trans: { ru: "прибегаю", en: "seek refuge" }, start: 1.981, end: 2.662 },
          { text: "بِكَ", trans: { ru: "к Тебе", en: "with You" }, start: 2.722, end: 3.062 },
          { text: "أَنْ", trans: { ru: "чтобы [не]", en: "lest" }, start: 3.142, end: 3.382 },
          { text: "أَضِلَّ", trans: { ru: "сбиться [с пути]", en: "I should stray" }, start: 3.442, end: 4.163 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 4.223, end: 4.483 },
          { text: "أُضَلَّ", trans: { ru: "быть сбитым", en: "be led astray" }, start: 4.563, end: 6.304 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 6.384, end: 6.644 },
          { text: "أَزِلَّ", trans: { ru: "оступиться [впасть в грех]", en: "slip [into sin]" }, start: 6.725, end: 7.445 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 7.505, end: 7.785 },
          { text: "أُزَلَّ", trans: { ru: "быть подведённым к нему", en: "be made to slip" }, start: 7.865, end: 9.526 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 9.627, end: 9.887 },
          { text: "أَظْلِمَ", trans: { ru: "проявить несправедливость", en: "wrong [others]" }, start: 9.967, end: 10.687 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 10.767, end: 11.047 },
          { text: "أُظْلَمَ", trans: { ru: "быть обиженным", en: "be wronged" }, start: 11.148, end: 12.689 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 12.769, end: 13.029 },
          { text: "أَجْهَلَ", trans: { ru: "проявить невежество", en: "act foolishly" }, start: 13.109, end: 13.849 },
          { text: "أَوْ", trans: { ru: "или", en: "or" }, start: 13.929, end: 14.210 },
          { text: "يُجْهَلَ", trans: { ru: "[чтобы со мной] поступили невежественно", en: "be treated foolishly" }, start: 14.290, end: 14.990 },
          { text: "عَلَيَّ", trans: { ru: "со мной", en: "against me" }, start: 15.090, end: 15.631 }
        ],
        source: { ru: "Абу Дауд 5094; аль-Калим ат-таййиб 60", en: "Abu Dawud 5094; al-Kalim at-Tayyib 60" }
      }
    ]
  };
