import { ChapterData } from '../../types';

export const CHAPTER_033: ChapterData = {
    id: 33,
    title: { ru: "Что следует делать тому, кто увидит какое-нибудь видение или бессвязный сон", en: "Upon seeing a good or bad dream" },
    description: {
      ru: "В подобных случаях желательно:\n\n**а)** трижды имитировать лёгкое поплёвывание налево (без выделения слюны);\n**б)** трижды обратиться к Аллаху с мольбой о защите от шайтана и зла того, что увидел человек;\n**в)** никому не рассказывать об этом;\n**г)** перевернуться на другой бок.\n\nТакже в подобных случаях рекомендуется встать и совершить [добровольную] молитву.",
      en: "In such cases it is recommended to:\n\n**a)** blow lightly three times to the left (without spitting);\n**b)** seek Allah's protection three times from the devil and from the evil of what was seen;\n**c)** not tell anyone about it;\n**d)** turn over onto the other side.\n\nIt is also recommended to get up and pray a voluntary prayer."
    },
    duas: [
      {
        id: "33-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/114.mp3",
        narration: {
          ru: "После трёхкратного поплёвывания налево трижды произнести слова мольбы о защите:",
          en: "After the three light blows to the left, recite three times the following plea for protection:"
        },
        fullTranslation: {
          ru: "Прибегаю к защите Аллаха от проклятого шайтана и от зла того, что я увидел.",
          en: "I seek refuge in Allah from the accursed devil and from the evil of what I saw."
        },
        sync: [
          { text: "أَعُوذُ", trans: { ru: "Прибегаю", en: "I seek refuge" }, start: 0.24, end: 0.88 },
          { text: "بِاللَّهِ", trans: { ru: "к Аллаху", en: "in Allah" }, start: 0.88, end: 1.82 },
          { text: "مِنَ", trans: { ru: "от", en: "from" }, start: 1.82, end: 2.26 },
          { text: "الشَّيْطَانِ", trans: { ru: "шайтана", en: "the devil" }, start: 2.26, end: 3.68 },
          { text: "الرَّجِيمِ", trans: { ru: "проклятого", en: "the accursed" }, start: 3.68, end: 5.2 },
          { text: "وَمِنْ", trans: { ru: "и от", en: "and from" }, start: 7.41, end: 7.85 },
          { text: "شَرِّ", trans: { ru: "зла", en: "the evil of" }, start: 7.85, end: 9.27 },
          { text: "مَا", trans: { ru: "того, что", en: "what" }, start: 9.27, end: 9.71 },
          { text: "رَأَيْتُ", trans: { ru: "я увидел", en: "I saw" }, start: 9.71, end: 11.61 }
        ],
        note: {
          ru: "Передают, что Пророк ﷺ сказал: «Добрый сон — от Аллаха, а [дурной] — от шайтана. Если кто-нибудь из вас увидит то, что ему не нравится, пусть трижды сплюнёт налево, когда проснётся, и прибегнет к защите Аллаха от его зла, и тогда этот [сон] не причинит ему вреда» [Муслим 5862; аль-Бухари 6995].",
          en: "The Prophet ﷺ said: \"A good dream is from Allah and a bad dream is from Satan. If any of you sees what he dislikes, let him blow three times to his left, seek refuge in Allah from its evil — and it will not harm him\" [Muslim 5862; al-Bukhari 6995]."
        },
        source: { ru: "аль-Бухари 6995; Муслим 5862", en: "al-Bukhari 6995; Muslim 5862" }
      }
    ]
  };
