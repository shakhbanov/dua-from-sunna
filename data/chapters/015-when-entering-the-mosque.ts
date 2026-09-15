import { ChapterData } from '../../types';

export const CHAPTER_015: ChapterData = {
    id: 15,
    title: { ru: "Слова обращения к Аллаху с мольбой при входе в мечеть", en: "When entering the mosque" },
    description: {
      ru: "Передают, что Анас бин Малик رضي الله عنه сказал: «Согласно сунне, когда будешь входить в мечеть, [порог желательно переступить] сначала правой ногой, а когда будешь выходить — с левой» [аль-Хаким 1/218; Сильсиля ас-сахиха 2478].",
      en: "Anas ibn Malik (may Allah be pleased with him) said: \"It is from the Sunnah that when you enter the mosque you step in with your right foot, and when you leave you step out with your left\" [al-Hakim 1/218; Silsila as-Sahiha 2478]."
    },
    duas: [
      {
        id: "15-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/20.1.wav",
        fullTranslation: {
          ru: "Прибегаю к защите Аллаха Великого, Его благородного лика и Его предвечной власти от проклятого шайтана.",
          en: "I seek refuge in Allah the Almighty, in His noble Face, and in His eternal authority, from the accursed devil."
        },
        sync: [
          { text: "أَعُوذُ", trans: { ru: "Прибегаю к защите", en: "I seek refuge" }, start: 0.26, end: 1.08 },
          { text: "بِاللَّهِ", trans: { ru: "Аллаха", en: "in Allah" }, start: 1.14, end: 2.12 },
          { text: "الْعَظِيمِ", trans: { ru: "Великого", en: "the Almighty" }, start: 2.18, end: 3.32 },
          { text: "وَبِوَجْهِهِ", trans: { ru: "и Его лика", en: "and in His Face" }, start: 3.4, end: 4.66 },
          { text: "الْكَرِيمِ", trans: { ru: "благородного", en: "the Noble" }, start: 4.7, end: 5.84 },
          { text: "وَسُلْطَانِهِ", trans: { ru: "и Его власти", en: "and in His authority" }, start: 5.91, end: 7.49 },
          { text: "الْقَدِيمِ", trans: { ru: "предвечной", en: "the Eternal" }, start: 7.53, end: 8.69 },
          { text: "مِنَ", trans: { ru: "от", en: "from" }, start: 8.77, end: 9.09 },
          { text: "الشَّيْطَانِ", trans: { ru: "шайтана", en: "the devil" }, start: 9.13, end: 10.57 },
          { text: "الرَّجِيمِ", trans: { ru: "проклятого", en: "the accursed" }, start: 10.63, end: 12.23 }
        ],
        source: { ru: "Абу Дауд 466; Сахих аль-джами‘ 4715", en: "Abu Dawud 466; Sahih al-Jami‘ 4715" }
      },
      {
        id: "15-2",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/dua.shakhbanov.org/dua-from-sunna/20.2.wav",
        narration: {
          ru: "А также, входя в мечеть, желательно произнести (фрагменты собраны из разных источников):",
          en: "It is also recommended to say upon entering (combining fragments from different narrations):"
        },
        fullTranslation: {
          ru: "С именем Аллаха, благословение и мир посланнику Аллаха. О Аллах! Открой для меня врата Твоего милосердия.",
          en: "In the name of Allah; blessings and peace be upon the Messenger of Allah. O Allah, open for me the gates of Your mercy."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0.34, end: 0.8 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 0.84, end: 1.5 },
          { text: "وَالصَّلَاةُ", trans: { ru: "и благословение", en: "and blessings" }, start: 1.56, end: 2.6 },
          { text: "وَالسَّلَامُ", trans: { ru: "и мир", en: "and peace" }, start: 2.66, end: 3.66 },
          { text: "عَلَى", trans: { ru: "на", en: "be upon" }, start: 3.76, end: 4.16 },
          { text: "رَسُولِ", trans: { ru: "посланника", en: "the Messenger of" }, start: 4.26, end: 4.92 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 4.96, end: 6.27 },
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 6.47, end: 7.47 },
          { text: "افْتَحْ", trans: { ru: "открой", en: "open" }, start: 7.49, end: 8.09 },
          { text: "لِي", trans: { ru: "для меня", en: "for me" }, start: 8.17, end: 8.49 },
          { text: "أَبْوَابَ", trans: { ru: "врата", en: "the gates of" }, start: 8.59, end: 9.49 },
          { text: "رَحْمَتِكَ", trans: { ru: "Твоего милосердия", en: "Your mercy" }, start: 9.57, end: 10.33 }
        ],
        source: { ru: "Абу Дауд 466; Ибн ас-Сунни, ‘Амаль аль-йаум 88; Муслим 1652", en: "Abu Dawud 466; Ibn as-Sunni, ‘Amal al-yawm 88; Muslim 1652" }
      }
    ]
  };
