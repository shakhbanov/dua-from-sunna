import { ChapterData } from '../../types';

export const CHAPTER_064: ChapterData = {
    id: 64,
    title: { ru: "Слова поминания Аллаха, которые желательно произносить, когда раздаются раскаты грома", en: "Supplication upon hearing thunder" },
    duas: [
      {
        id: "64-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/168.mp3",
        fullTranslation: {
          ru: "Пречист Тот, Кого славят гром и ангелы, [воздавая] Ему хвалу из страха перед Ним.",
          en: "Glory be to the One whom the thunder glorifies with His praise, as do the angels out of awe of Him."
        },
        sync: [
          { text: "سُبْحَانَ", trans: { ru: "Пречист", en: "Glory be to" }, start: 0.15, end: 1.03 },
          { text: "الَّذِي", trans: { ru: "Тот, Кого", en: "the One whom" }, start: 1.03, end: 1.33 },
          { text: "يُسَبِّحُ", trans: { ru: "славит", en: "glorifies" }, start: 1.33, end: 2.57 },
          { text: "الرَّعْدُ", trans: { ru: "гром", en: "the thunder" }, start: 2.57, end: 3.15 },
          { text: "بِحَمْدِهِ", trans: { ru: "хвалой Ему", en: "with His praise" }, start: 3.15, end: 4.09 },
          { text: "وَالْمَلَائِكَةُ", trans: { ru: "и ангелы", en: "and the angels" }, start: 4.89, end: 6.67 },
          { text: "مِنْ", trans: { ru: "из", en: "out of" }, start: 6.67, end: 6.93 },
          { text: "خِيفَتِهِ", trans: { ru: "страха пред Ним", en: "awe of Him" }, start: 6.93, end: 7.87 }
        ],
        note: {
          ru: "Эти слова основаны на аяте Корана 13:13: «Гром славит хвалой Его, и ангелы [славят Его] в страхе пред Ним».",
          en: "The wording is drawn from Qur'an 13:13: \"The thunder glorifies His praise, and so do the angels out of awe of Him.\""
        },
        source: { ru: "Сахих аль-адаб аль-муфрад 723", en: "Sahih al-Adab al-Mufrad 723" }
      }
    ]
  };
