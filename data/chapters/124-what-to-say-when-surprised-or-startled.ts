import { ChapterData } from '../../types';

export const CHAPTER_124: ChapterData = {
    id: 124,
    title: { ru: "Слова поминания Аллаха в случае удивительного или радостного события", en: "What to say when surprised or startled" },
    duas: [
      {
        id: "124-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/235.mp3",
        narration: {
          ru: "Сообщается, что, удивляясь чему-либо, Пророк ﷺ говорил:",
          en: "It is reported that when something surprised the Prophet ﷺ, he would say:"
        },
        fullTranslation: {
          ru: "Пречист Аллах!",
          en: "Glory be to Allah."
        },
        sync: [
          { text: "سُبْحَانَ", trans: { ru: "Пречист", en: "Glorified (is)" }, start: 0.29, end: 0.98 },
          { text: "اللَّهِ", trans: { ru: "Аллах", en: "Allah" }, start: 0.98, end: 2.07 }
        ],
        source: { ru: "аль-Бухари 283; Муслим 371", en: "al-Bukhari 283; Muslim 371" }
      },
      {
        id: "124-2",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/236.mp3",
        narration: {
          ru: "А когда его радовало какое-либо приятное и неожиданное известие, он говорил:",
          en: "And when something pleasant and unexpected delighted him, he would say:"
        },
        fullTranslation: {
          ru: "Аллах велик!",
          en: "Allah is the Greatest."
        },
        sync: [
          { text: "اللَّهُ", trans: { ru: "Аллах", en: "Allah" }, start: 0.3, end: 0.77 },
          { text: "أَكْبَرُ", trans: { ru: "велик", en: "(is) greatest" }, start: 0.77, end: 3.41 }
        ],
        source: { ru: "аль-Бухари 3611; Муслим 2791", en: "al-Bukhari 3611; Muslim 2791" }
      }
    ]
  };
