import { ChapterData } from '../../types';

export const CHAPTER_030: ChapterData = {
    id: 30,
    title: { ru: "Слова поминания Аллаха, которые желательно произносить перед сном", en: "Supplications before sleeping" },
    duas: [
      {
        id: "30-1",
        audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3",
        fullTranslation: {
          ru: "С твоим именем, о Аллах, я умираю и оживаю.",
          en: "In Your Name, O Allah, I die and I live."
        },
        sync: [
          { text: "بِاسْمِكَ", trans: { ru: "С именем Твоим", en: "In Your name" }, start: 0, end: 1.5 },
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 1.5, end: 2.5 },
          { text: "أَمُوتُ", trans: { ru: "Я умираю", en: "I die" }, start: 2.5, end: 3.5 },
          { text: "وَأَحْيَا", trans: { ru: "И оживаю", en: "And I live" }, start: 3.5, end: 5.0 }
        ]
      }
    ]
  };
