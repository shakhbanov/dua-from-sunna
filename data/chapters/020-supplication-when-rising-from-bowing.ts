import { ChapterData } from '../../types';

export const CHAPTER_020: ChapterData = {
    id: 20,
    title: { ru: "Слова поминания Аллаха, которые произносятся при выпрямлении после поясного поклона", en: "Supplication when rising from bowing" },
    duas: [
      {
        id: "20-1",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/38.wav",
        fullTranslation: {
          ru: "Да услышит Аллах тех (или: того), кто воздал Ему хвалу.",
          en: "May Allah hear the one who praises Him."
        },
        sync: [
          { text: "سَمِعَ", trans: { ru: "Да услышит", en: "May hear" }, start: 0.341, end: 0.923 },
          { text: "اللَّهُ", trans: { ru: "Аллах", en: "Allah" }, start: 0.963, end: 1.865 },
          { text: "لِمَنْ", trans: { ru: "того, кто", en: "the one who" }, start: 1.946, end: 2.527 },
          { text: "حَمِدَهُ", trans: { ru: "воздал Ему хвалу", en: "praises Him" }, start: 2.708, end: 3.390 }
        ],
        note: {
          ru: "То есть: да примет Аллах эту хвалу и воздаст за неё молящемуся.",
          en: "Meaning: may Allah accept this praise and reward the one who offers it."
        },
        source: { ru: "аль-Бухари 795", en: "al-Bukhari 795" }
      },
      {
        id: "20-2",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/39.wav",
        fullTranslation: {
          ru: "Господь наш, хвала же Тебе, хвала многая, благая и благословенная!",
          en: "Our Lord, to You is the praise — much, good, and blessed praise."
        },
        sync: [
          { text: "رَبَّنَا", trans: { ru: "Господь наш", en: "Our Lord" }, start: 0.320, end: 1.341 },
          { text: "وَلَكَ", trans: { ru: "и Тебе", en: "and to You" }, start: 1.461, end: 2.082 },
          { text: "الْحَمْدُ", trans: { ru: "хвала", en: "is the praise" }, start: 2.142, end: 3.983 },
          { text: "حَمْدًا", trans: { ru: "хвала", en: "praise" }, start: 4.163, end: 5.504 },
          { text: "كَثِيرًا", trans: { ru: "многая", en: "abundant" }, start: 5.665, end: 7.386 },
          { text: "طَيِّبًا", trans: { ru: "благая", en: "good" }, start: 7.546, end: 8.547 },
          { text: "مُبَارَكًا", trans: { ru: "благословенная", en: "blessed" }, start: 9.348, end: 11.609 },
          { text: "فِيهِ", trans: { ru: "—", en: "in it" }, start: 11.710, end: 13.091 }
        ],
        source: { ru: "аль-Бухари 799", en: "al-Bukhari 799" }
      },
      {
        id: "20-3",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/40.wav",
        fullTranslation: {
          ru: "Господь наш! Хвала Тебе, и пусть [эта хвала] наполнит собой небеса, землю, то, что находится между ними, и всё, что ещё Тебе будет угодно. Ты [больше всех] достоин восхваления и прославления, лучшим же из сказанного рабом [Твоим], — а все мы — Твои рабы, — [являются слова] «О Аллах! Никто не лишит того, что Ты даровал, и никто не дарует того, чего Ты лишил, и бесполезным пред Тобой окажется богатство обладающего богатством».",
          en: "Our Lord, to You is the praise — filling the heavens, filling the earth, filling whatever lies between them, and filling whatever else You will. You are most deserving of praise and glory. The truest word a servant has spoken — and we are all Your servants — is: \"O Allah, none can withhold what You have given, and none can give what You have withheld; and the wealth of the wealthy will not avail against You.\""
        },
        sync: [
          { text: "رَبَّنَا", trans: { ru: "Господь наш", en: "Our Lord" }, start: 0.360, end: 1.280 },
          { text: "لَكَ", trans: { ru: "Тебе", en: "to You" }, start: 1.360, end: 1.721 },
          { text: "الْحَمْدُ", trans: { ru: "хвала", en: "is the praise" }, start: 1.761, end: 2.621 },
          { text: "مِلْءَ", trans: { ru: "наполнив", en: "filling" }, start: 2.681, end: 3.241 },
          { text: "السَّمَاوَاتِ", trans: { ru: "небеса", en: "the heavens" }, start: 3.261, end: 4.782 },
          { text: "وَمِلْءَ", trans: { ru: "и наполнив", en: "and filling" }, start: 4.842, end: 5.602 },
          { text: "الْأَرْضِ", trans: { ru: "землю", en: "the earth" }, start: 5.642, end: 6.462 },
          { text: "وَمَا", trans: { ru: "и то, что", en: "and what" }, start: 6.522, end: 7.062 },
          { text: "بَيْنَهُمَا", trans: { ru: "между ними", en: "is between them" }, start: 7.142, end: 8.843 },
          { text: "وَمِلْءَ", trans: { ru: "и наполнив", en: "and filling" }, start: 8.923, end: 9.663 },
          { text: "مَا", trans: { ru: "то, что", en: "whatever" }, start: 9.743, end: 10.023 },
          { text: "شِئْتَ", trans: { ru: "Ты пожелаешь", en: "You will" }, start: 10.163, end: 10.763 },
          { text: "مِنْ", trans: { ru: "из", en: "of" }, start: 10.823, end: 11.104 },
          { text: "شَيْءٍ", trans: { ru: "чего-либо", en: "anything" }, start: 11.224, end: 12.224 },
          { text: "بَعْدُ", trans: { ru: "ещё", en: "afterward" }, start: 12.324, end: 12.924 },
          { text: "أَهْلَ", trans: { ru: "Достойный", en: "[You are] worthy of" }, start: 13.024, end: 13.544 },
          { text: "الثَّنَاءِ", trans: { ru: "восхваления", en: "praise" }, start: 13.584, end: 14.865 },
          { text: "وَالْمَجْدِ", trans: { ru: "и прославления", en: "and glory" }, start: 14.945, end: 16.505 },
          { text: "أَحَقُّ", trans: { ru: "наиболее достойное", en: "the truest" }, start: 16.585, end: 17.306 },
          { text: "مَا", trans: { ru: "из того, что", en: "of what" }, start: 17.386, end: 17.686 },
          { text: "قَالَ", trans: { ru: "сказал", en: "has been said by" }, start: 17.826, end: 18.366 },
          { text: "الْعَبْدُ", trans: { ru: "раб", en: "the servant" }, start: 18.406, end: 19.206 },
          { text: "وَكُلُّنَا", trans: { ru: "а все мы", en: "and all of us" }, start: 19.266, end: 20.507 },
          { text: "لَكَ", trans: { ru: "Тебе", en: "to You" }, start: 20.607, end: 20.947 },
          { text: "عَبْدٌ", trans: { ru: "рабы", en: "are servants" }, start: 21.047, end: 22.207 },
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 22.307, end: 23.748 },
          { text: "لَا", trans: { ru: "нет", en: "none" }, start: 23.848, end: 24.168 },
          { text: "مَانِعَ", trans: { ru: "лишающего", en: "can withhold" }, start: 24.268, end: 25.048 },
          { text: "لِمَا", trans: { ru: "того, что", en: "what" }, start: 25.128, end: 25.688 },
          { text: "أَعْطَيْتَ", trans: { ru: "Ты даровал", en: "You have given" }, start: 25.748, end: 26.809 },
          { text: "وَلَا", trans: { ru: "и нет", en: "and none" }, start: 26.889, end: 27.409 },
          { text: "مُعْطِيَ", trans: { ru: "дарующего", en: "can give" }, start: 27.529, end: 28.269 },
          { text: "لِمَا", trans: { ru: "того, что", en: "what" }, start: 28.349, end: 28.889 },
          { text: "مَنَعْتَ", trans: { ru: "Ты лишил", en: "You have withheld" }, start: 28.969, end: 29.730 },
          { text: "وَلَا", trans: { ru: "и не", en: "and not" }, start: 29.810, end: 30.310 },
          { text: "يَنْفَعُ", trans: { ru: "приносит пользы", en: "avails" }, start: 30.410, end: 31.290 },
          { text: "ذَا", trans: { ru: "обладателю", en: "the possessor of" }, start: 31.370, end: 31.510 },
          { text: "الْجَدِّ", trans: { ru: "богатства", en: "wealth" }, start: 31.530, end: 32.350 },
          { text: "مِنْكَ", trans: { ru: "пред Тобой", en: "against You" }, start: 32.430, end: 33.051 },
          { text: "الْجَدُّ", trans: { ru: "богатство", en: "his wealth" }, start: 33.071, end: 33.751 }
        ],
        note: {
          ru: "Иначе говоря, богатство не спасёт богатого от гнева Аллаха.",
          en: "Meaning: wealth will not save the wealthy from Allah's wrath."
        },
        source: { ru: "Муслим 1071, 1072", en: "Muslim 1071, 1072" }
      }
    ]
  };
