import { ChapterData } from '../../types';

export const CHAPTER_080: ChapterData = {
    id: 80,
    title: { ru: "Что следует сказать неверному, если он чихнёт и воздаст хвалу Аллаху", en: "What to say to a non-Muslim if he sneezes and praises Allah" },
    duas: [
      {
        id: "80-1",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/189.wav",
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
        note: {
          ru: "Для неверного, чихнувшего и воздавшего хвалу Аллаху, произносят не «Да помилует тебя Аллах» (как для мусульманина), а эту мольбу о наставлении на правильный путь.",
          en: "For a non-Muslim who sneezes and praises Allah, one says this prayer for guidance rather than the usual \"May Allah have mercy on you\" that is said to a fellow Muslim."
        },
        source: { ru: "ат-Тирмизи 2739; Сахих Сунан ат-Тирмизи 2739", en: "at-Tirmidhi 2739; Sahih Sunan at-Tirmidhi 2739" }
      }
    ]
  };
