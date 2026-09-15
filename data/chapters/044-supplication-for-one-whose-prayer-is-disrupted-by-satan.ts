import { ChapterData } from '../../types';

export const CHAPTER_044: ChapterData = {
    id: 44,
    title: { ru: "Мольба о защите от наущений шайтана, с которой желательно обращаться к Аллаху во время молитв и чтения Корана", en: "Supplication for one whose prayer is disrupted by Satan" },
    duas: [
      {
        id: "44-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/138.mp3",
        fullTranslation: {
          ru: "Прибегаю к защите Аллаха от проклятого шайтана.",
          en: "I seek refuge in Allah from the accursed devil."
        },
        sync: [
          { text: "أَعُوذُ", trans: { ru: "Прибегаю", en: "I seek refuge" }, start: 0.18, end: 0.94 },
          { text: "بِاللَّهِ", trans: { ru: "к Аллаху", en: "in Allah" }, start: 0.94, end: 1.84 },
          { text: "مِنَ", trans: { ru: "от", en: "from" }, start: 1.84, end: 2.28 },
          { text: "الشَّيْطَانِ", trans: { ru: "шайтана", en: "the devil" }, start: 2.28, end: 3.7 },
          { text: "الرَّجِيمِ", trans: { ru: "проклятого", en: "the accursed" }, start: 3.7, end: 5.7 }
        ],
        note: {
          ru: "Произнеся эти слова, следует трижды слегка поплевать налево (без выделения слюны).",
          en: "After saying these words, one should blow lightly three times to the left (without spitting)."
        },
        source: { ru: "Муслим 5738", en: "Muslim 5738" }
      }
    ]
  };
