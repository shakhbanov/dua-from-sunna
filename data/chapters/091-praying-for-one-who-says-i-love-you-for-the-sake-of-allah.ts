import { ChapterData } from '../../types';

export const CHAPTER_091: ChapterData = {
    id: 91,
    title: { ru: "Мольба за того, кто скажет: «Поистине, я люблю тебя ради Аллаха»", en: "Reply to one who says: I love you for the sake of Allah" },
    duas: [
      {
        id: "91-1",
        audioUrl: "https://s3.shakhbanov.org/dua-from-sunna/200.wav",
        narration: {
          ru: "Если мусульманин скажет тебе: «Поистине, я люблю тебя ради Аллаха» (Ин-ни ухиббу-ка фи-Ллях / إِنِّي أُحِبُّكَ فِي اللَّهِ), ответь:",
          en: "When a Muslim says to you \"Inni uhibbuka fi-Llah\" (\"I love you for the sake of Allah\" — إِنِّي أُحِبُّكَ فِي اللَّهِ), reply:"
        },
        fullTranslation: {
          ru: "Да полюбит тебя Тот, ради Кого полюбил меня ты.",
          en: "May He for whose sake you have loved me love you [in return]."
        },
        sync: [
          { text: "أَحَبَّكَ", trans: { ru: "Да полюбит тебя", en: "May love you" }, start: 0, end: 0 },
          { text: "الَّذِي", trans: { ru: "Тот, ради Кого", en: "He for whose sake" }, start: 0, end: 0 },
          { text: "أَحْبَبْتَنِي", trans: { ru: "ты полюбил меня", en: "you loved me" }, start: 0, end: 0 },
          { text: "لَهُ", trans: { ru: "[ради Него]", en: "—" }, start: 0, end: 0 }
        ],
        source: { ru: "Абу Дауд 5125; Сильсиля ас-сахиха т. 1, с. 778", en: "Abu Dawud 5125; Silsilah as-Sahihah vol. 1, p. 778" }
      }
    ]
  };
