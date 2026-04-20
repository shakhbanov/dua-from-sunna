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
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/20.1.wav",
        fullTranslation: {
          ru: "Прибегаю к защите Аллаха Великого, Его благородного лика и Его предвечной власти от проклятого шайтана.",
          en: "I seek refuge in Allah the Almighty, in His noble Face, and in His eternal authority, from the accursed devil."
        },
        sync: [
          { text: "أَعُوذُ", trans: { ru: "Прибегаю к защите", en: "I seek refuge" }, start: 0.260, end: 1.081 },
          { text: "بِاللَّهِ", trans: { ru: "Аллаха", en: "in Allah" }, start: 1.141, end: 2.122 },
          { text: "الْعَظِيمِ", trans: { ru: "Великого", en: "the Almighty" }, start: 2.182, end: 3.323 },
          { text: "وَبِوَجْهِهِ", trans: { ru: "и Его лика", en: "and in His Face" }, start: 3.403, end: 4.664 },
          { text: "الْكَرِيمِ", trans: { ru: "благородного", en: "the Noble" }, start: 4.704, end: 5.845 },
          { text: "وَسُلْطَانِهِ", trans: { ru: "и Его власти", en: "and in His authority" }, start: 5.905, end: 7.487 },
          { text: "الْقَدِيمِ", trans: { ru: "предвечной", en: "the Eternal" }, start: 7.527, end: 8.688 },
          { text: "مِنَ", trans: { ru: "от", en: "from" }, start: 8.768, end: 9.088 },
          { text: "الشَّيْطَانِ", trans: { ru: "шайтана", en: "the devil" }, start: 9.128, end: 10.569 },
          { text: "الرَّجِيمِ", trans: { ru: "проклятого", en: "the accursed" }, start: 10.629, end: 12.231 }
        ],
        source: { ru: "Абу Дауд 466; Сахих аль-джами‘ 4715", en: "Abu Dawud 466; Sahih al-Jami‘ 4715" }
      },
      {
        id: "15-2",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/20.2.wav",
        narration: {
          ru: "А также, входя в мечеть, желательно произнести (фрагменты собраны из разных источников):",
          en: "It is also recommended to say upon entering (combining fragments from different narrations):"
        },
        fullTranslation: {
          ru: "С именем Аллаха, благословение и мир посланнику Аллаха. О Аллах! Открой для меня врата Твоего милосердия.",
          en: "In the name of Allah; blessings and peace be upon the Messenger of Allah. O Allah, open for me the gates of Your mercy."
        },
        sync: [
          { text: "بِسْمِ", trans: { ru: "С именем", en: "In the name of" }, start: 0.340, end: 0.801 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 0.841, end: 1.502 },
          { text: "وَالصَّلَاةُ", trans: { ru: "и благословение", en: "and blessings" }, start: 1.562, end: 2.603 },
          { text: "وَالسَّلَامُ", trans: { ru: "и мир", en: "and peace" }, start: 2.663, end: 3.664 },
          { text: "عَلَى", trans: { ru: "на", en: "be upon" }, start: 3.764, end: 4.164 },
          { text: "رَسُولِ", trans: { ru: "посланника", en: "the Messenger of" }, start: 4.264, end: 4.925 },
          { text: "اللَّهِ", trans: { ru: "Аллаха", en: "Allah" }, start: 4.965, end: 6.266 },
          { text: "اللَّهُمَّ", trans: { ru: "О Аллах", en: "O Allah" }, start: 6.467, end: 7.468 },
          { text: "افْتَحْ", trans: { ru: "открой", en: "open" }, start: 7.488, end: 8.088 },
          { text: "لِي", trans: { ru: "для меня", en: "for me" }, start: 8.168, end: 8.489 },
          { text: "أَبْوَابَ", trans: { ru: "врата", en: "the gates of" }, start: 8.589, end: 9.490 },
          { text: "رَحْمَتِكَ", trans: { ru: "Твоего милосердия", en: "Your mercy" }, start: 9.570, end: 10.331 }
        ],
        source: { ru: "Абу Дауд 466; Ибн ас-Сунни, ‘Амаль аль-йаум 88; Муслим 1652", en: "Abu Dawud 466; Ibn as-Sunni, ‘Amal al-yawm 88; Muslim 1652" }
      }
    ]
  };
