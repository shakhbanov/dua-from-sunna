import { ChapterData } from '../../types';

export const CHAPTER_124: ChapterData = {
    id: 124,
    title: { ru: "Слова поминания Аллаха в случае удивительного или радостного события", en: "What to say when surprised or startled" },
    duas: [
      {
        id: "124-1",
        audioUrl: "https://s3.shakhbanov.org/dua-from-sunna/235.wav",
        narration: {
          ru: "Сообщается, что, удивляясь чему-либо, Пророк ﷺ говорил:",
          en: "It is reported that when something surprised the Prophet ﷺ, he would say:"
        },
        fullTranslation: {
          ru: "Пречист Аллах!",
          en: "Glory be to Allah."
        },
        sync: [
          { text: "سُبْحَانَ", trans: { ru: "Пречист", en: "Glorified (is)" }, start: 0, end: 0 },
          { text: "اللَّهِ", trans: { ru: "Аллах", en: "Allah" }, start: 0, end: 0 }
        ],
        source: { ru: "аль-Бухари 283; Муслим 371", en: "al-Bukhari 283; Muslim 371" }
      },
      {
        id: "124-2",
        audioUrl: "https://s3.shakhbanov.org/dua-from-sunna/236.wav",
        narration: {
          ru: "А когда его радовало какое-либо приятное и неожиданное известие, он говорил:",
          en: "And when something pleasant and unexpected delighted him, he would say:"
        },
        fullTranslation: {
          ru: "Аллах велик!",
          en: "Allah is the Greatest."
        },
        sync: [
          { text: "اللَّهُ", trans: { ru: "Аллах", en: "Allah" }, start: 0, end: 0 },
          { text: "أَكْبَرُ", trans: { ru: "велик", en: "(is) greatest" }, start: 0, end: 0 }
        ],
        source: { ru: "аль-Бухари 3611; Муслим 2791", en: "al-Bukhari 3611; Muslim 2791" }
      }
    ]
  };
