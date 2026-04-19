import { ChapterData } from '../../types';

export const CHAPTER_042: ChapterData = {
    id: 42,
    title: { ru: "С какими мольбами желательно обращаться к Аллаху тому, кто испытает сомнение в вере", en: "Supplication for one afflicted with doubt in his faith" },
    duas: [
      {
        id: "42-1",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/133.wav",
        narration: {
          ru: "В подобных случаях необходимо обращаться за защитой к Аллаху, произнося:",
          en: "In such cases one must seek Allah's refuge, saying:"
        },
        fullTranslation: {
          ru: "Прибегаю к защите Аллаха от проклятого шайтана.",
          en: "I seek refuge in Allah from the accursed devil."
        },
        sync: [
          { text: "أَعُوذُ", trans: { ru: "Прибегаю", en: "I seek refuge" }, start: 0, end: 0 },
          { text: "بِاللَّهِ", trans: { ru: "к Аллаху", en: "in Allah" }, start: 0, end: 0 },
          { text: "مِنَ", trans: { ru: "от", en: "from" }, start: 0, end: 0 },
          { text: "الشَّيْطَانِ", trans: { ru: "шайтана", en: "the devil" }, start: 0, end: 0 },
          { text: "الرَّجِيمِ", trans: { ru: "проклятого", en: "the accursed" }, start: 0, end: 0 }
        ],
        note: {
          ru: "Кроме того, следует прекратить делать то, что внушает сомнения.",
          en: "Additionally, one should stop doing whatever prompts the doubt."
        },
        source: { ru: "аль-Бухари 3276; Муслим 134", en: "al-Bukhari 3276; Muslim 134" }
      },
      {
        id: "42-2",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/134.wav",
        fullTranslation: {
          ru: "Я уверовал в Аллаха и Его посланников.",
          en: "I believe in Allah and in His messengers."
        },
        sync: [
          { text: "آمَنْتُ", trans: { ru: "Уверовал я", en: "I believe" }, start: 0, end: 0 },
          { text: "بِاللَّهِ", trans: { ru: "в Аллаха", en: "in Allah" }, start: 0, end: 0 },
          { text: "وَرُسُلِهِ", trans: { ru: "и посланников Его", en: "and in His messengers" }, start: 0, end: 0 }
        ],
        source: { ru: "Муслим 134", en: "Muslim 134" }
      },
      {
        id: "42-3",
        audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/135.wav",
        narration: {
          ru: "Следует прочитать айат Корана, в котором сказано:",
          en: "One should recite the Qur'anic verse:"
        },
        fullTranslation: {
          ru: "Он — Первый и Последний, Высочайший и Скрытый, и Он — Всеведущий.",
          en: "He is the First and the Last, the Manifest and the Hidden, and He has knowledge of all things."
        },
        sync: [
          { text: "هُوَ", trans: { ru: "Он", en: "He is" }, start: 0, end: 0 },
          { text: "الْأَوَّلُ", trans: { ru: "Первый", en: "the First" }, start: 0, end: 0 },
          { text: "وَالْآخِرُ", trans: { ru: "и Последний", en: "and the Last" }, start: 0, end: 0 },
          { text: "وَالظَّاهِرُ", trans: { ru: "и Высочайший", en: "and the Manifest" }, start: 0, end: 0 },
          { text: "وَالْبَاطِنُ", trans: { ru: "и Скрытый", en: "and the Hidden" }, start: 0, end: 0 },
          { text: "وَهُوَ", trans: { ru: "и Он", en: "and He is" }, start: 0, end: 0 },
          { text: "بِكُلِّ", trans: { ru: "о всякой", en: "of every" }, start: 0, end: 0 },
          { text: "شَيْءٍ", trans: { ru: "вещи", en: "thing" }, start: 0, end: 0 },
          { text: "عَلِيمٌ", trans: { ru: "Всеведущий", en: "All-Knowing" }, start: 0, end: 0 }
        ],
        note: {
          ru: "**Первый** — Тот, Кто был всегда; **Последний** — Тот, Кто будет после исчезновения всего сотворённого; **Захир** — Тот, выше Которого нет ничего (Высочайший / Явный); **Батин** — Тот, Кто знает сокровенное, и нет никого ближе к человеку, чем Он.",
          en: "**The First** — the One who has always been; **the Last** — the One who remains after all else perishes; **az-Zahir** (Manifest / Most High) — above whom there is nothing; **al-Batin** (Hidden / Most Near) — who knows the innermost and is nearer than anything else."
        },
        source: { ru: "Коран 57:3; Абу Дауд 5110; Сахих ат-таргиб 1614", en: "Qur'an 57:3; Abu Dawud 5110; Sahih at-Targhib 1614" }
      }
    ]
  };
