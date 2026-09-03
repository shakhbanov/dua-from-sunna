// Tematic category pages — curated groupings of chapters for SEO landing pages.
// Each category is a separate prerendered route (/<slug-ru>/ and /en/<slug-en>/)
// targeting a specific long-tail keyword cluster.

export interface Category {
  id: string;                             // stable internal key
  slug: { ru: string; en: string };
  title: { ru: string; en: string };
  /** Short teaser used as meta description + list blurb. Plain text, ~160 chars. */
  summary: { ru: string; en: string };
  /** Landing-page intro — 120–250 words of RU/EN copy. Plain text paragraphs. */
  intro: { ru: string[]; en: string[] };
  /** Chapter IDs in desired reading order. Works for both collections. */
  chapterIds: number[];
  /**
   * Individual supplications, for the Quran collection where a chapter is a
   * whole sura and covers several themes at once. Surah Al 'Imran holds
   * fourteen duas about steadfastness, forgiveness, offspring, sovereignty and
   * the Day of Gathering — a category needs one of them, not all fourteen.
   *
   * Every entry is validated at build time by scripts/seo-checks.mjs: an id
   * that does not resolve fails the build rather than vanishing from the page.
   */
  duaRefs?: Array<{ chapterId: number; duaId: string }>;
}

export const CATEGORIES: Category[] = [
  {
    id: 'morning-evening-adhkar',
    slug: { ru: 'utrennie-i-vechernie-azkary', en: 'morning-evening-adhkar' },
    title: {
      ru: 'Утренние и вечерние азкары',
      en: 'Morning and evening adhkar',
    },
    summary: {
      ru: 'Утренние и вечерние азкары — сборник дуа и поминаний Аллаха, читаемых после фаджра и после асра, с арабским текстом, переводом и аудио.',
      en: 'Morning and evening adhkar — a collection of duas and remembrances of Allah to be recited after Fajr and after Asr, with Arabic text, translation, and audio.',
    },
    intro: {
      ru: [
        'Утренние и вечерние азкары — это ежедневная защита верующего, собранная из достоверной Сунны Пророка ﷺ. Регулярное поминание Аллаха утром и вечером укрепляет веру и приносит покой сердцу.',
        'На этой странице собраны достоверные азкары, которые читают дважды в сутки: после утренней молитвы (фаджр) и после послеобеденной молитвы (‘аср). Для каждого азкара приведены арабский текст, огласовки, пословный перевод, полный смысловой перевод на русский и ссылка на источник хадиса (аль-Бухари, Муслим, Абу Дауд, ат-Тирмизи, Ибн Маджа, ан-Наса‘и, Ахмад).',
        'Аудиозапись позволяет запомнить правильное произношение. Рекомендуется читать утренние азкары между фаджром и восходом, а вечерние — между ‘асром и закатом.',
        'Коран даёт этой теме три текста. Суры «аль-Фаляк» (113) и «ан-Нас» (114) — прибежище от зла сотворённого, от зависти и от наущений; аят 9:129 «Достаточно мне Аллаха» завершает суру «Ат-Тауба». Они отличаются положением от азкаров выше: это не слова, переданные через хадис, а текст самой Книги. Рядом с каждым стоит ссылка на суру и аят, так что любую мольбу можно сверить с мусхафом.',
      ],
      en: [
        'Morning and evening adhkar form the believer\'s daily protection, assembled from the authentic Sunnah of the Prophet ﷺ. Regular remembrance of Allah, morning and evening, strengthens faith and brings tranquility to the heart.',
        'This page gathers the authentic adhkar to be recited twice a day: after the Fajr (dawn) prayer and after the ‘Asr (afternoon) prayer. For each, we provide the Arabic text with diacritics, word-by-word translation, a full meaning-based English translation, and the hadith source (al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa\'i, Ahmad).',
        'Audio recordings help you memorize correct pronunciation. It is recommended to recite the morning adhkar between Fajr and sunrise, and the evening adhkar between ‘Asr and sunset.',
        'The Quran adds three texts to this theme. Surah al-Falaq (113) and Surah an-Nas (114) seek refuge from the evil of what was created, from envy and from whispering; ayah 9:129 — "Allah is sufficient for me" — closes Surah at-Tawbah. Their standing differs from the adhkar above: these are not words transmitted through hadith but the text of the Book itself, and the sura and ayah reference beside each one can be checked against the mushaf.',
      ],
    },
    chapterIds: [29],
    duaRefs: [
      { chapterId: 2036, duaId: '2036-108' }, // 113:1–5 — сура «аль-Фаляк», прибежище от зла сотворённого
      { chapterId: 2036, duaId: '2036-109' }, // 114:1–6 — сура «ан-Нас», прибежище от наущений
      { chapterId: 2008, duaId: '2008-42' }, // 9:129 — «Достаточно мне Аллаха»; заметка: утром и вечером
    ],
  },
  {
    id: 'sleep',
    slug: { ru: 'dua-pered-snom-i-pri-probuzhdenii', en: 'duas-before-sleep-and-upon-waking' },
    title: {
      ru: 'Дуа перед сном и при пробуждении',
      en: 'Duas before sleep and upon waking up',
    },
    summary: {
      ru: 'Дуа и азкары, читаемые перед сном и при пробуждении ото сна, включая чтение аятов аль-Курси, Ихляс, Фалак и Нас с переводом и аудио.',
      en: 'Duas and adhkar to recite before sleep and upon waking, including Ayat al-Kursi, al-Ikhlas, al-Falaq, and an-Nas with translation and audio.',
    },
    intro: {
      ru: [
        'Сон — малая смерть, пробуждение — малое воскрешение. Пророк ﷺ учил нас ложиться спать и просыпаться с поминанием Аллаха, чтобы каждое состояние было наполнено смыслом и защитой.',
        'В этот раздел вошли: дуа, читаемые перед сном, включая чтение аята аль-Курси («Аллаху ля иляха илля Хуа…»), сур «аль-Ихляс», «аль-Фалак» и «ан-Нас», а также дуа, произносимые при переворачивании во сне, при ночном страхе, при виде хорошего или плохого сна, и слова поминания сразу после пробуждения.',
        'Для каждого дуа указан источник (аль-Бухари, Муслим и другие), приведены арабский оригинал с огласовками, перевод и аудио для заучивания.',
        'Из Корана в этот раздел вошли пять мольб. Суры «аль-Фаляк» (113) и «ан-Нас» (114) уже названы выше; к ним добавлены два последних аята суры «Аль-Бакара» (2:286), прибежище от наущений шайтанов (23:97–98) и аят 3:191 — слова тех, кто размышляет о сотворённом. Это текст самой Книги, а не переданное через хадис, и каждая мольба указана сурой и аятом.',
      ],
      en: [
        'Sleep is a minor death, waking a minor resurrection. The Prophet ﷺ taught us to enter and leave sleep with the remembrance of Allah, so that each state carries meaning and protection.',
        'This section includes: the duas before sleep — including the recitation of Ayat al-Kursi ("Allah, there is no god but He…"), Surah al-Ikhlas, al-Falaq, and an-Nas — along with the supplication when turning over during sleep, upon waking in fear, on seeing a good or bad dream, and the words of remembrance said immediately on waking up.',
        'Every dua is cited from authentic sources (al-Bukhari, Muslim, and others) with Arabic text, diacritics, translation, and audio for memorization.',
        'Five supplications here come from the Quran. Surah al-Falaq (113) and Surah an-Nas (114) are named above; alongside them stand the last two ayahs of Surah al-Baqarah (2:286), the refuge from the whisperings of the devils (23:97–98), and ayah 3:191, the words of those who reflect on creation. These are the text of the Book itself rather than reports transmitted through hadith, and each one carries its sura and ayah.',
      ],
    },
    chapterIds: [3, 30, 31, 32, 33],
    duaRefs: [
      { chapterId: 2036, duaId: '2036-108' }, // 113:1–5 — заметка: перед сном
      { chapterId: 2036, duaId: '2036-109' }, // 114:1–6 — вторая из двух сур-прибежищ, названных выше
      { chapterId: 2002, duaId: '2002-12' }, // 2:286 — два последних аята «Аль-Бакара»; заметка: читают ночью
      { chapterId: 2018, duaId: '2018-75' }, // 23:97–98 — от наущений шайтанов; заметка: бессонница, перед сном
      { chapterId: 2003, duaId: '2003-23' }, // 3:191 — слова размышляющих; заметка: при пробуждении ночью
    ],
  },
  {
    id: 'daily',
    slug: { ru: 'dua-na-kazhdyy-den', en: 'daily-duas-and-adhkar' },
    title: {
      ru: 'Дуа на каждый день — одежда, дом, улица',
      en: 'Daily duas — clothing, home, and the street',
    },
    summary: {
      ru: 'Дуа при одевании, снимании одежды, при входе и выходе из дома, при посещении отхожего места — полный сборник повседневных азкаров.',
      en: 'Duas when dressing and undressing, entering and leaving the home, and using the toilet — the complete set of everyday adhkar.',
    },
    intro: {
      ru: [
        'Повседневность мусульманина пронизана поминанием Аллаха: каждое привычное действие — одевание, выход из дома, посещение уборной — сопровождается своим дуа. Это превращает рутину в поклонение.',
        'Собраны азкары при надевании одежды, при ношении новой одежды, перед тем как раздеться, при входе и выходе из отхожего места, при выходе и при входе в дом. У каждого — арабский оригинал, перевод и источник из Сунны.',
        'Заучивание этих коротких дуа вместе с аудио — шаг к устойчивой связи с Аллахом в течение всего дня.',
        'Четыре коранические мольбы отвечают тем же будничным нуждам. Аят 28:24 — слова Мусы (мир ему) в Мадьяне, оставшегося без денег, крова и защиты; 3:26–27 — о власти, достоинстве и уделе; 23:29 — о благословенном месте, где остановиться; 5:114 — о ниспослании трапезы. В отличие от азкаров выше, это слова, приведённые в Книге Аллаха, и каждая указана сурой и аятом.',
      ],
      en: [
        'A Muslim\'s daily life is woven with remembrance of Allah: every ordinary act — dressing, leaving home, using the bathroom — has its own supplication. This turns routine into worship.',
        'Collected here: adhkar for putting on clothes, wearing new clothes, before undressing, before entering and after leaving the toilet, and when leaving or entering the home. Each has Arabic, translation, and source from the Sunnah.',
        'Memorizing these short duas together with the audio is a step toward a steady connection with Allah throughout the whole day.',
        'Four Quranic supplications answer the same everyday needs. Ayah 28:24 holds the words of Musa (peace be upon him) in Madyan, left without money, shelter or protection; 3:26–27 speaks of sovereignty, honour and provision; 23:29 asks to be brought to a blessed landing place; 5:114 asks for a table sent down. Unlike the adhkar above, these are words set down in the Book of Allah, each given with its sura and ayah.',
      ],
    },
    chapterIds: [4, 5, 6, 7, 8, 9, 12, 13],
    duaRefs: [
      { chapterId: 2022, duaId: '2022-88' }, // 28:24 — «нуждаюсь в любом благе»; заметка: бедность, нет жилья
      { chapterId: 2003, duaId: '2003-16' }, // 3:26–27 — «даруешь удел без счёта»; заметка: работа, ризк
      { chapterId: 2018, duaId: '2018-73' }, // 23:29 — благословенное место; заметка: новый дом
      { chapterId: 2005, duaId: '2005-30' }, // 5:114 — «надели нас уделом»; заметка: нужда в пропитании
    ],
  },
  {
    id: 'wudu-prayer',
    slug: { ru: 'dua-omovenie-i-namaz', en: 'duas-for-wudu-and-prayer' },
    title: {
      ru: 'Дуа для омовения и намаза',
      en: 'Duas for wudu and prayer',
    },
    summary: {
      ru: 'Азкары до и после омовения (вуду), все дуа внутри намаза — от такбира до салама, суджуд, руку, ташаххуд и салават Пророку ﷺ.',
      en: 'Adhkar before and after ablution (wudu), and all duas inside prayer — from takbir to salam, including sujood, ruku, tashahhud, and salawat on the Prophet ﷺ.',
    },
    intro: {
      ru: [
        'Намаз — опора религии, и каждый его элемент — от омовения до последнего салама — освящён дуа из Сунны. Пропустить их — значит обеднить молитву.',
        'В этом разделе: дуа перед омовением и после его завершения, дуа при начале намаза (истифтах), в руку‘, при подъёме из руку‘, в суджуде, между двумя земными поклонами, в ташаххуде, салават Пророку ﷺ, дуа перед саламом и поминания после салама, а также кунут аль-витр и поминания после витра.',
        'Все арабские тексты даны с огласовками, пословным переводом и аудио, чтобы любой мог выстроить намаз по Сунне.',
        'Коран участвует в намазе не только как чтение. Сура «Аль-Фатиха» (1:5–7) сама по себе мольба; аяты 6:79 и 6:162–163 входят в дуа аль-истифтах, приведённую в главе 18; 14:40 — просьба Ибрахима (мир ему) о том, чтобы он и его потомство совершали молитву; 2:127 — о принятии дела; 2:201 — о благе в обоих мирах; 39:46 — обращение к Творцу небес и земли.',
      ],
      en: [
        'Prayer is the pillar of the religion, and every stage — from ablution to the final salam — is consecrated by duas from the Sunnah. To skip them is to impoverish the prayer.',
        'This section includes: duas before and after wudu, the opening supplication (istiftah), duas in ruku, on rising from ruku, in sujood, between the two prostrations, in the tashahhud, salawat on the Prophet ﷺ, the dua before salam, remembrance after salam, along with Qunut al-Witr and adhkar after witr.',
        'Every Arabic text is given with diacritics, word-by-word translation, and audio so anyone can align their prayer with the Sunnah.',
        'The Quran enters the prayer as more than recitation. Surah al-Fatihah (1:5–7) is itself a supplication; ayahs 6:79 and 6:162–163 belong to the opening dua al-istiftah given in chapter 18; 14:40 is the request of Ibrahim (peace be upon him) that he and his offspring establish the prayer; 2:127 asks for a deed to be accepted; 2:201 asks for good in both worlds; 39:46 addresses the Creator of the heavens and the earth.',
      ],
    },
    chapterIds: [10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 34, 35],
    duaRefs: [
      { chapterId: 2001, duaId: '2001-1' }, // 1:5–7 — «Аль-Фатиха»; заметка: в каждом ракате
      { chapterId: 2006, duaId: '2006-31' }, // 6:79 — заметка: входит в дуа аль-истифтах
      { chapterId: 2006, duaId: '2006-32' }, // 6:162–163 — заметка: в дуа истифтах
      { chapterId: 2012, duaId: '2012-54' }, // 14:40 — «сделай меня совершающим молитву»; заметка: после намаза
      { chapterId: 2002, duaId: '2002-4' }, // 2:127 — «прими от нас»; заметка: по завершении молитвы, поста
      { chapterId: 2026, duaId: '2026-94' }, // 39:46 — обращение к Творцу небес и земли; заметка: тахаджуд
      { chapterId: 2002, duaId: '2002-8' }, // 2:201 — заметка: после намаза
    ],
  },
  {
    id: 'food',
    slug: { ru: 'dua-pered-edoy-i-posle-edy', en: 'duas-before-and-after-eating' },
    title: {
      ru: 'Дуа перед едой и после еды',
      en: 'Duas before and after eating',
    },
    summary: {
      ru: 'Азкары перед едой, после еды, при питье, дуа за хозяина и за того, кто напоил, дуа при разговении в гостях и первые плоды сезона.',
      en: 'Adhkar before eating, after eating, when drinking, for the host, for the one who gave you drink, for iftar at someone\'s home, and for the first fruits of the season.',
    },
    intro: {
      ru: [
        'Приём пищи в исламе — не просто насыщение, а повод для благодарности. Пророк ﷺ установил конкретные слова для начала и завершения трапезы, напоминая, что пища — милость Аллаха.',
        'Сюда вошли: дуа при разговении (ифтар), дуа перед едой, дуа после окончания приёма пищи, дуа гостя за того, кто его принял, дуа за того, кто напоил, дуа при разговении в чужом доме, дуа постящегося в присутствии еды, дуа при ругани во время поста и дуа при виде первого урожая сезона.',
        'Для каждого — арабский текст, ссылка на аль-Бухари / Муслима и аудио.',
        'Из Корана к этой теме относится одна мольба — 5:114, слова Исы, сына Марьям (мир ему), просившего ниспослать трапезу с неба: «Надели нас уделом, ведь Ты — лучший из дарующих удел». В отличие от азкаров выше, переданных через хадис, это текст суры «Аль-Маида», и ссылка рядом ведёт к самому аяту.',
      ],
      en: [
        'Eating, in Islam, is not mere nourishment — it is an occasion for gratitude. The Prophet ﷺ set specific words for beginning and ending a meal, reminding us that food is a mercy from Allah.',
        'Included here: the dua at iftar (breaking the fast), before eating, after the meal, the guest\'s dua for the host, the dua for one who gave you drink, the dua at iftar in someone\'s home, the dua of a fasting person in the presence of food, what to say when reviled while fasting, and the dua on seeing the first fruit of the season.',
        'Each comes with Arabic text, hadith source (al-Bukhari / Muslim), and audio.',
        'One supplication on this page comes from the Quran: 5:114, the words of Isa son of Maryam (peace be upon him) asking for a table to be sent down from heaven — "And provide for us — You are the best of providers." Unlike the adhkar above, which reach us through hadith, this is the text of Surah al-Ma’idah, and the reference beside it points to the ayah itself.',
      ],
    },
    chapterIds: [70, 71, 72, 73, 74, 75, 76, 77, 78],
    duaRefs: [
      { chapterId: 2005, duaId: '2005-30' }, // 5:114 — трапеза с неба; заметка: перед едой в трудные времена
    ],
  },
  {
    id: 'travel',
    slug: { ru: 'dua-v-puteshestvii', en: 'duas-for-travel' },
    title: {
      ru: 'Дуа в путешествии',
      en: 'Duas for travel',
    },
    summary: {
      ru: 'Полный сборник дуа путешественника: перед выездом, при посадке, при спусках и подъёмах, при въезде в город, при остановке и возвращении домой.',
      en: 'The complete traveler\'s duas: before setting out, on mounting, on ascents and descents, on entering a town, on stopping, and on returning home.',
    },
    intro: {
      ru: [
        'Путешествие — испытание и милость одновременно. Пророк ﷺ научил своих сподвижников целому ряду дуа для разных этапов пути — от посадки на верховое животное (или в транспорт) до возвращения к семье.',
        'В подборке: дуа при посадке на транспорт, общая дуа путешественника, дуа при въезде в город или селение, дуа на рынке, дуа при спотыкании животного (или транспорта), дуа путешественника за оставшихся дома, дуа остающегося за путешественника, поминания при подъёмах и спусках, дуа путешественника перед рассветом, дуа при остановке на привал и дуа при возвращении из путешествия.',
        'Все тексты сверены с авторитетными сборниками (Муслим, Абу Дауд, ат-Тирмизи) и снабжены аудио.',
        'Четыре мольбы о дороге приведены в самом Коране. Аят 43:13–14 — слова о подчинённом человеку транспорте; 11:41 — то, что сказал Нух (мир ему), взойдя на ковчег; 17:80 — о правдивом входе и выходе; 23:29 — о благословенном месте, где остановиться. Это текст Книги, а не переданное через хадис, и каждая мольба указана сурой и аятом.',
      ],
      en: [
        'Travel is both a trial and a mercy. The Prophet ﷺ taught his companions a whole series of duas for every stage of the journey — from mounting a riding animal (or vehicle) to the return home.',
        'In this collection: the dua when mounting transport, the general traveler\'s dua, the dua on entering a town or village, the dua at the market, the dua when the mount stumbles, the traveler\'s dua for those staying behind, the resident\'s dua for the traveler, remembrance while ascending or descending, the traveler\'s dua as dawn approaches, the dua when making a stop, and the dua on returning from travel.',
        'All texts are cross-checked against authoritative collections (Muslim, Abu Dawud, at-Tirmidhi) and come with audio.',
        'Four supplications for the road are set down in the Quran itself. Ayah 43:13–14 speaks of the transport made subject to us; 11:41 is what Nuh (peace be upon him) said as he boarded the ark; 17:80 asks to enter with a truthful entrance and leave with a truthful exit; 23:29 asks to be brought to a blessed landing place. These are the text of the Book rather than reports transmitted through hadith, each with its sura and ayah.',
      ],
    },
    chapterIds: [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107],
    duaRefs: [
      { chapterId: 2028, duaId: '2028-97' }, // 43:13–14 — заметка: стандартная дуа путешествия
      { chapterId: 2010, duaId: '2010-46' }, // 11:41 — Нух, взойдя на ковчег; заметка: при отправлении в дорогу
      { chapterId: 2013, duaId: '2013-57' }, // 17:80 — вход и выход; заметка: при въезде в город и выезде
      { chapterId: 2018, duaId: '2018-73' }, // 23:29 — заметка: при возвращении из поездки, в гостинице
    ],
  },
  {
    id: 'distress',
    slug: { ru: 'dua-ot-trevogi-pechali-i-bedstviy', en: 'duas-for-anxiety-sorrow-and-distress' },
    title: {
      ru: 'Дуа от тревоги, печали и бедствий',
      en: 'Duas for anxiety, sorrow, and distress',
    },
    summary: {
      ru: 'Дуа при беспокойстве, печали, бедствии, страхе перед правителем или врагом, при долге, при затруднении и при панике — слова Пророка ﷺ для тяжёлых часов.',
      en: 'Duas for anxiety, sorrow, distress, fear of a ruler or enemy, debt, difficulty, and panic — the Prophet\'s ﷺ words for hard hours.',
    },
    intro: {
      ru: [
        'Когда жизнь сжимает, Пророк ﷺ оставил нам слова, которые одновременно поднимают сердце к Аллаху и снимают тяжесть с плеч. Часто эти дуа произносятся в пороговых ситуациях — перед встречей с несправедливым правителем, в момент паники, при долге, который невозможно оплатить.',
        'Сборник: дуа при тревоге и грусти, дуа при бедствии, дуа при встрече с врагом или обладающим властью, дуа при страхе перед несправедливым правителем, дуа против врага, дуа при страхе перед группой людей, дуа для того, кто испытывает сомнения в вере, дуа о погашении долга, дуа для молящегося, которого отвлекает шайтан, дуа при затруднении, дуа при совершении греха, дуа для изгнания дьявола и дуа при панике.',
        'Каждое — от достоверных источников, с аудио и ссылками.',
        'Пятнадцать коранических мольб дополняют главы выше. Среди них — дуа Юнуса (мир ему) во тьме (21:87), слова Айюба (мир ему), которыми он лишь описал своё состояние (21:83), «Достаточно нам Аллаха» (3:173), жалоба Якуба (мир ему) на скорбь и печаль (12:86), истирджа при утрате (2:156) и прибежище от наущений шайтанов (23:97–98). Это слова, приведённые в Книге Аллаха; каждая дана с сурой и аятом.',
      ],
      en: [
        'When life tightens, the Prophet ﷺ left us words that simultaneously lift the heart to Allah and lighten the shoulders. These duas are often spoken at threshold moments — before meeting an unjust ruler, in panic, when a debt cannot be repaid.',
        'The collection: dua for anxiety and sorrow, for distress, when encountering an enemy or one in authority, fearing an unjust ruler, against an enemy, when afraid of a group of people, for one afflicted with doubt in his faith, for settling a debt, for one whose prayer is disrupted by Satan, when something becomes difficult, upon committing a sin, for expelling the devil, and when panicked.',
        'Each is from authentic sources, with audio and references.',
        'Fifteen Quranic supplications stand alongside the chapters above. Among them: the dua of Yunus (peace be upon him) in the darkness (21:87), the words of Ayyub (peace be upon him), which only describe his state (21:83), "Allah is sufficient for us" (3:173), the complaint of Yaqub (peace be upon him) of his anguish and grief (12:86), the istirja said at a loss (2:156), and the refuge from the whisperings of the devils (23:97–98). These are words set down in the Book of Allah, each with its sura and ayah.',
      ],
    },
    chapterIds: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 128],
    // The first four are restored from the project's own editorial history:
    // exactly the supplications that data/quran/2004-distress-hardship-and-
    // illness.ts carried before commit 9419908 regrouped the collection by sura.
    duaRefs: [
      { chapterId: 2017, duaId: '2017-68' }, // 21:87 — дуа Юнуса, «зун-нун»
      { chapterId: 2017, duaId: '2017-67' }, // 21:83 — дуа Айюба при болезни
      { chapterId: 2003, duaId: '2003-22' }, // 3:173 — «Достаточно нам Аллаха»
      { chapterId: 2008, duaId: '2008-42' }, // 9:129 — «Достаточно мне Аллаха»
      { chapterId: 2011, duaId: '2011-50' }, // 12:86 — «жалуюсь на скорбь и печаль только Аллаху»
      { chapterId: 2002, duaId: '2002-7' }, // 2:156 — истирджа; заметка: при любой потере
      { chapterId: 2018, duaId: '2018-75' }, // 23:97–98 — заметка: навязчивые мысли, тревога, страх
      { chapterId: 2025, duaId: '2025-93' }, // 38:41 — «шайтан коснулся меня утомлением и мучением»
      { chapterId: 2031, duaId: '2031-100' }, // 54:10 — «я побеждён — так помоги же мне»
      { chapterId: 2016, duaId: '2016-65' }, // 20:45–46 — страх, что несправедливый навредит
      { chapterId: 2015, duaId: '2015-63' }, // 19:18 — прибежище от того, кто внушает страх
      { chapterId: 2007, duaId: '2007-41' }, // 7:200 — прибежище от шайтана; заметка: при гневе, страхе
      { chapterId: 2002, duaId: '2002-9' }, // 2:250 — заметка: перед тяжёлым испытанием, когда силы на исходе
      { chapterId: 2029, duaId: '2029-98' }, // 44:12 — «избавь нас от мучений»; заметка: общее бедствие
      { chapterId: 2018, duaId: '2018-72' }, // 23:28 — хвала за спасение; заметка: после избавления от беды
    ],
  },
  {
    id: 'family',
    slug: { ru: 'dua-dlya-semi-i-brachnoy-zhizni', en: 'duas-for-family-and-marriage' },
    title: {
      ru: 'Дуа для семьи и брачной жизни',
      en: 'Duas for family and marriage',
    },
    summary: {
      ru: 'Дуа за новобрачных, при рождении ребёнка, при защите детей, дуа жениха и дуа перед супружеской близостью — слова Пророка ﷺ для семейной жизни.',
      en: 'Duas for newlyweds, upon the birth of a child, for protecting children, the groom\'s supplication, and the dua before marital intimacy — the Prophet\'s ﷺ words for family life.',
    },
    intro: {
      ru: [
        'Семья в исламе — это поле поклонения, а не просто частная жизнь. Пророк ﷺ освятил каждое её звено — от свадьбы до рождения и воспитания детей — конкретными дуа из Сунны.',
        'В подборку входят: дуа за новобрачных, дуа жениха в брачную ночь (и при покупке животного), дуа перед супружеской близостью, поздравление с новорождённым, слова, которыми дети вверяются покровительству Аллаха.',
        'Арабский оригинал, перевод на русский и английский, и ссылки на достоверные источники.',
        'Коран даёт этой теме тринадцать мольб. Главная из них — 25:74: просьба об отраде очей в супругах и потомках. Рядом — «Господи, даруй мне праведного потомка» (37:100), мольба Закарии (мир ему) о наследнике (19:4–6 и 21:89), просьба о защите ребёнка от шайтана (3:36) и дуа Асии (мир ей) о доме у Аллаха в Раю (66:11). Это слова самой Книги, каждое с указанием суры и аята.',
      ],
      en: [
        'Family in Islam is a field of worship, not merely private life. The Prophet ﷺ consecrated each of its links — from the wedding to the birth and upbringing of children — with specific duas from the Sunnah.',
        'This set includes: the dua for newlyweds, the groom\'s dua on the wedding night (and when buying an animal), the dua before marital intimacy, congratulations on a new-born baby, and the words placing children under Allah\'s protection.',
        'Arabic original, Russian and English translation, and references to authentic sources.',
        'The Quran gives this theme thirteen supplications. The central one is 25:74, the request for the comfort of the eyes in spouses and offspring. Beside it stand "My Lord, grant me a righteous child" (37:100), the plea of Zakariya (peace be upon him) for an heir (19:4–6 and 21:89), the request that a child be protected from Satan (3:36), and the dua of Asiya (peace be upon her) for a house near Allah in Paradise (66:11). These are the words of the Book itself, each carrying its sura and ayah.',
      ],
    },
    chapterIds: [49, 50, 81, 82, 83],
    duaRefs: [
      { chapterId: 2019, duaId: '2019-79' }, // 25:74 — отрада очей в супругах и потомках
      { chapterId: 2024, duaId: '2024-90' }, // 37:100 — «даруй мне праведного потомка»
      { chapterId: 2003, duaId: '2003-19' }, // 3:38 — «даруй мне благое потомство»; заметка: при бесплодии
      { chapterId: 2015, duaId: '2015-62' }, // 19:4–6 — Закария о наследнике; заметка: о детях в позднем возрасте
      { chapterId: 2017, duaId: '2017-69' }, // 21:89 — «не оставляй меня одиноким»; заметка: при бездетности
      { chapterId: 2003, duaId: '2003-18' }, // 3:36 — защита ребёнка; заметка: после рождения ребёнка
      { chapterId: 2003, duaId: '2003-17' }, // 3:35 — обет о том, кто в чреве
      { chapterId: 2012, duaId: '2012-54' }, // 14:40 — «сделай меня и моё потомство совершающими молитву»
      { chapterId: 2020, duaId: '2020-82' }, // 26:169 — «спаси меня и мою семью от того, что они совершают»
      { chapterId: 2030, duaId: '2030-99' }, // 46:15 — «сделай моё потомство праведным»
      { chapterId: 2034, duaId: '2034-105' }, // 66:11 — дуа Асии; заметка: в тяжёлом браке, при насилии дома
      { chapterId: 2002, duaId: '2002-5' }, // 2:128 — о потомстве; заметка: о детях и внуках
      { chapterId: 2027, duaId: '2027-95' }, // 40:7–9 — за отцов, супругов и потомков
    ],
  },
  {
    id: 'sickness-death',
    slug: { ru: 'dua-pri-bolezni-smerti-i-pokhoronakh', en: 'duas-for-illness-death-and-funerals' },
    title: {
      ru: 'Дуа при болезни, смерти и похоронах',
      en: 'Duas for illness, death, and funerals',
    },
    summary: {
      ru: 'Дуа при посещении больного, при боли, инструкция умирающему, соболезнование, заупокойный намаз, опускание в могилу и посещение кладбища.',
      en: 'Duas when visiting the sick, for pain, instruction for the dying, condolence, funeral prayer, placing in the grave, and visiting graves.',
    },
    intro: {
      ru: [
        'Смерть — учитель. Пророк ﷺ научил нас тому, как говорить с больным, как наставлять умирающего, как хоронить и как навещать могилы — превращая горе в служение.',
        'Собранные здесь главы покрывают: посещение больного, достоинство посещения больного, дуа больного, потерявшего надежду на жизнь, наставление умирающему (талкын), дуа за того, кого постигло несчастье, закрытие глаз умершего, заупокойный намаз (джаназа), дуа за опережающий награду в джаназе, соболезнование, опускание покойного в могилу, дуа после погребения и посещение кладбищ.',
        'Каждый элемент снабжён арабским текстом, переводом и источником (аль-Бухари, Муслим, ан-Наса‘и и др.).',
        'Шесть мольб этой темы приведены в Коране. Айюб (мир ему) при болезни лишь описывает своё состояние, не прося прямо об избавлении (21:83); истирджа (2:156) — слова при утрате; Юсуф (мир ему) просит упокоить его мусульманином и присоединить к праведникам (12:101); 3:193 и 7:126 — об упокоении с благочестивыми; 40:7–9 — мольба ангелов за верующих. Это текст Книги, а не переданное через хадис.',
      ],
      en: [
        'Death is a teacher. The Prophet ﷺ taught us how to speak to the sick, how to instruct the dying, how to bury, and how to visit graves — turning grief into service.',
        'The chapters gathered here cover: visiting the sick, the excellence of doing so, the dua of a sick person who has lost hope of life, the instruction for the dying (talqin), the dua for one afflicted by calamity, closing the eyes of the deceased, the funeral prayer (janazah), the dua for the advancement of reward during the funeral prayer, condolence, placing the deceased in the grave, after burial, and visiting the graves.',
        'Each element comes with the Arabic text, translation, and source (al-Bukhari, Muslim, an-Nasa\'i and others).',
        'Six supplications on this theme are set down in the Quran. Ayyub (peace be upon him) in his illness only describes his condition without asking outright for relief (21:83); the istirja (2:156) is said at a loss; Yusuf (peace be upon him) asks to have his soul taken as a Muslim and to be joined with the righteous (12:101); 3:193 and 7:126 ask for the soul to be taken among the devout; 40:7–9 is the supplication of the angels for the believers. This is the text of the Book, not a report transmitted through hadith.',
      ],
    },
    chapterIds: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 126],
    duaRefs: [
      { chapterId: 2017, duaId: '2017-67' }, // 21:83 — «меня коснулась беда»; заметка: при болезни и боли
      { chapterId: 2002, duaId: '2002-7' }, // 2:156 — заметка: при известии о смерти
      { chapterId: 2011, duaId: '2011-51' }, // 12:101 — «упокой меня мусульманином»
      { chapterId: 2003, duaId: '2003-25' }, // 3:193 — «упокой нас вместе с благочестивыми»
      { chapterId: 2007, duaId: '2007-36' }, // 7:126 — «упокой нас покорившимися Тебе»
      { chapterId: 2027, duaId: '2027-95' }, // 40:7–9 — заметка: дуа за умерших
    ],
  },
  {
    id: 'hajj-umrah',
    slug: { ru: 'dua-khadzha-i-umry', en: 'duas-for-hajj-and-umrah' },
    title: {
      ru: 'Дуа хаджа и умры',
      en: 'Duas for hajj and umrah',
    },
    summary: {
      ru: 'Талбия паломника, такбир у Чёрного камня, дуа между Йеменским углом и Чёрным камнем, дуа у Сафы и Марвы, дуа в день Арафа и у аль-Маш‘ар аль-Харам.',
      en: 'The pilgrim\'s talbiyah, takbir at the Black Stone, the dua between the Yemeni Corner and the Black Stone, duas at Safa and Marwa, on the Day of Arafah, and at al-Mash‘ar al-Haram.',
    },
    intro: {
      ru: [
        'Хадж и умра — путешествие души к Дому Аллаха, и каждый их обряд сопровождается словами, которым Пророк ﷺ учил своих сподвижников.',
        'В сборнике: талбия паломника («Ляббайка, Аллахумма, ляббайк…»), такбир при прохождении мимо Чёрного камня, дуа между Йеменским углом и Чёрным камнем, дуа у горы Сафа и Марва, дуа в день Арафа, дуа в Масджид аль-Маш‘ар аль-Харам (Муздалифа) и такбир при каждом броске камешка (джамарат).',
        'Все тексты приведены с огласовками и снабжены аудио для запоминания в пути.',
        'Пять коранических мольб связаны с Заповедным домом. «Господь наш, даруй нам добро в этом мире и добро в мире вечном» (2:201) — та же мольба, что приведена в главе 119 о словах между Йеменским углом Каабы и Чёрным камнем. Аяты 2:127 и 2:128 — слова Ибрахима и Исмаила (мир им) при возведении Каабы, а 2:126 и 14:35 — их просьба о безопасности этого города.',
      ],
      en: [
        'Hajj and Umrah are a journey of the soul to the House of Allah, and every one of their rites is accompanied by words the Prophet ﷺ taught his companions.',
        'In this collection: the pilgrim\'s talbiyah ("Labbayk, Allahumma, labbayk…"), the takbir on passing the Black Stone, the dua between the Yemeni Corner and the Black Stone, the duas at Safa and Marwa, the dua on the Day of Arafah, the dua at the Sacred Area of Muzdalifah (al-Mash‘ar al-Haram), and the takbir at each throw of a pebble at the Jamarat.',
        'Every text is fully vocalized and provided with audio for memorization on the journey.',
        'Five Quranic supplications belong to the Sacred House. "Our Lord, grant us good in this world and good in the Hereafter" (2:201) is the same supplication set out in chapter 119, on the words said between the Yemeni corner of the Kaaba and the Black Stone. Ayahs 2:127 and 2:128 are the words of Ibrahim and Ismail (peace be upon them) as they raised the Kaaba, while 2:126 and 14:35 are their request for the safety of that city.',
      ],
    },
    chapterIds: [117, 118, 119, 120, 121, 122, 123],
    duaRefs: [
      { chapterId: 2002, duaId: '2002-8' }, // 2:201 — та же мольба, что в главе 119; заметка: в таваф
      { chapterId: 2002, duaId: '2002-5' }, // 2:128 — «покажи нам обряды»; заметка: во время хаджа
      { chapterId: 2002, duaId: '2002-4' }, // 2:127 — Ибрахим и Исмаил при возведении Каабы
      { chapterId: 2002, duaId: '2002-3' }, // 2:126 — «сделай эту землю безопасной» — Ибрахим о Мекке
      { chapterId: 2012, duaId: '2012-52' }, // 14:35 — «сделай этот город безопасным»
    ],
  },
  {
    id: 'social',
    slug: { ru: 'dua-v-obshchenii-i-srede-lyudey', en: 'duas-in-speech-and-social-life' },
    title: {
      ru: 'Дуа в общении и среди людей',
      en: 'Duas in speech and social life',
    },
    summary: {
      ru: 'Дуа при чихании, при похвале, в собрании, за того, кто сделал добро, за того, кто сказал «Пусть Аллах простит тебя», при распространении салама.',
      en: 'Duas for sneezing, for being praised, in a gathering, for someone who did you a favor, for one who said "May Allah forgive you", and for spreading salam.',
    },
    intro: {
      ru: [
        'Этика общения в исламе — это малые дуа, которые превращают слова и жесты в поминание Аллаха. Собеседник чихает — ты говоришь «Йархаму-кя Ллах». Тебя хвалят — ты отвечаешь мольбой за свою душу.',
        'Сборник охватывает: дуа при чихании, дуа за немусульманина, если он чихнул и восхвалил Аллаха, дуа при гневе, дуа при виде испытанного, поминания в собрании, искупление собрания, дуа за того, кто сказал «Пусть Аллах простит тебя», дуа за того, кто сделал тебе добро, дуа за того, кто сказал «Я люблю тебя ради Аллаха», дуа за того, кто предложил тебе своё имущество, дуа заимодавцу при возврате долга, дуа при страхе ширка, дуа за того, кто сказал «Пусть Аллах благословит тебя», дуа против суеверий, дуа за оскорблённого, этикет похвалы мусульманина и дуа за похваленного.',
        'Каждое — из Сунны, с источником и аудио.',
        'Семнадцать мольб этой темы взяты из Корана. Аят 59:10 — просьба не оставлять в сердце злобы к уверовавшим; 7:151 — о прощении для себя и брата; 7:89 и 21:112 — о справедливом рассуждении в споре; 4:75 — о покровителе для притесняемых; 18:39 — слова при виде чужого блага; 10:10 — зов обитателей Рая, а 37:180–182 — прославление, которым завершается сура «Ас-Саффат».',
      ],
      en: [
        'Etiquette of speech in Islam is made of small duas that turn words and gestures into remembrance of Allah. A person sneezes — you say "Yarhamu-kallah." Someone praises you — you answer with a supplication for your own soul.',
        'This set includes: supplication when sneezing, for a non-Muslim who sneezes and praises Allah, when angry, on seeing someone in trial, remembrance in a gathering, the expiation of a gathering, the reply to "May Allah forgive you", for one who did you a favor, for one who says "I love you for the sake of Allah", for one who offers you his wealth, for the lender when the debt is settled, against the fear of shirk, for one who says "May Allah bless you", against superstitious belief, for one you have insulted, the etiquette of praising a fellow Muslim, and the dua for the one who is praised.',
        'Every one is from the Sunnah, with source citation and audio.',
        'Seventeen supplications here are taken from the Quran. Ayah 59:10 asks that no rancour towards the believers be left in the heart; 7:151 asks forgiveness for oneself and for a brother; 7:89 and 21:112 ask for a just decision in a dispute; 4:75 asks for a protector for the oppressed; 18:39 gives the words said on seeing what pleases you in another; 37:180–182 is the glorification that closes Surah as-Saffat. Each carries its sura and ayah.',
      ],
    },
    chapterIds: [79, 80, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 114, 115, 116],
    duaRefs: [
      { chapterId: 2032, duaId: '2032-101' }, // 59:10 — «не насаждай в наших сердцах злобы к тем, кто уверовал»
      { chapterId: 2007, duaId: '2007-39' }, // 7:151 — о брате; заметка: после ссоры с близким
      { chapterId: 2007, duaId: '2007-35' }, // 7:89 — «рассуди между нами и нашим народом по истине»
      { chapterId: 2017, duaId: '2017-70' }, // 21:112 — «Господи, рассуди по истине»
      { chapterId: 2018, duaId: '2018-71' }, // 23:26 — «они сочли меня лжецом»; заметка: когда оговорили
      { chapterId: 2020, duaId: '2020-81' }, // 26:117–118 — «рассуди между мной и ними окончательно»
      { chapterId: 2004, duaId: '2004-27' }, // 4:75 — покровитель для притесняемых
      { chapterId: 2022, duaId: '2022-87' }, // 28:21 — «спаси меня от людей несправедливых»
      { chapterId: 2023, duaId: '2023-89' }, // 29:30 — «помоги мне против народа нечестивого»
      { chapterId: 2005, duaId: '2005-28' }, // 5:25 — «разлучи нас с народом нечестивым»
      { chapterId: 2009, duaId: '2009-44' }, // 10:85–86 — «не делай нас искушением»; заметка: при травле за веру
      { chapterId: 2014, duaId: '2014-61' }, // 18:39 — «так пожелал Аллах»; заметка: от зависти и сглаза
      { chapterId: 2009, duaId: '2009-43' }, // 10:10 — заметка: начало и завершение собрания
      { chapterId: 2024, duaId: '2024-91' }, // 37:180–182 — заметка: завершение собрания
      { chapterId: 2022, duaId: '2022-86' }, // 28:17 — «не буду пособником преступников»
      { chapterId: 2026, duaId: '2026-94' }, // 39:46 — «Ты рассудишь Своих рабов в том, в чём они расходились»
      { chapterId: 2033, duaId: '2033-103' }, // 60:5 — «не делай нас искушением для неверующих»
    ],
  },
  {
    id: 'weather',
    slug: { ru: 'dua-pri-pogodnykh-yavleniyakh', en: 'duas-for-weather-events' },
    title: {
      ru: 'Дуа при погодных явлениях',
      en: 'Duas for weather events',
    },
    summary: {
      ru: 'Дуа при ветре и буре, при громе, при просьбе о дожде и при дожде, при виде молодого месяца — слова Пророка ﷺ для явлений природы.',
      en: 'Duas during wind and storms, at thunder, for rain and during rain, and on sighting the crescent moon — the Prophet\'s ﷺ words for natural phenomena.',
    },
    intro: {
      ru: [
        'Природа — знамение Аллаха, и каждое её явление — напоминание. Пророк ﷺ не смотрел на ветер, гром и дождь как на природные события, но как на возможность обратиться к Господу.',
        'Собраны: намаз во время сильного ветра, дуа при грозе (громе), дуа о ниспослании дождя (истиска), дуа во время дождя, дуа после дождя, дуа о прекращении дождя и ясной погоде, дуа при виде новой Луны (хиляль).',
        'Каждое дуа сверено с Сунной и снабжено аудио.',
      ],
      en: [
        'Nature is a sign of Allah, and every one of its events is a reminder. The Prophet ﷺ did not view wind, thunder, and rain as mere natural phenomena, but as occasions to turn to the Lord.',
        'Collected: the prayer during a wind storm, the dua on hearing thunder, the prayer for rain (istisqa), the dua during rain, after rain, for clear skies, and on sighting the new crescent moon (hilal).',
        'Each dua is verified against the Sunnah and provided with audio.',
      ],
    },
    chapterIds: [63, 64, 65, 66, 67, 68, 69],
  },
  {
    id: 'forgiveness-repentance',
    slug: { ru: 'dua-o-proshchenii-i-pokayanii', en: 'duas-for-forgiveness-and-repentance' },
    title: {
      ru: 'Дуа о прощении и покаянии',
      en: 'Duas for forgiveness and repentance',
    },
    summary: {
      ru: 'Мольбы о прощении грехов и покаянии — дуа Адама и Мусы (мир им) из Корана и слова истигфара из Сунны, с арабским текстом, переводом и ссылкой на источник.',
      en: 'Supplications for forgiveness of sins and repentance — the duas of Adam and Musa from the Quran and the words of istighfar from the Sunnah, with Arabic text and translation.',
    },
    intro: {
      ru: [
        'Просьба о прощении — то, с чего начинается возвращение к Аллаху. В Коране первая такая мольба принадлежит Адаму и Хавве (мир им): «Господь наш, мы поступили несправедливо по отношению к себе» (7:23). Почти теми же словами молился народ Мусы после ошибки (7:149).',
        'На этой странице собраны восемнадцать коранических мольб о прощении и покаянии — от самой короткой, завершающей суру «Аль-Муминун» (23:118), до развёрнутой мольбы обладающих разумом (3:193) и просьбы ангелов за раскаявшихся (40:7–9). Рядом стоят две главы из Сунны: слова истигфара и покаяния и то, что говорят после совершённого греха.',
        'Коранические мольбы отличаются положением от переданных через хадис: это текст самой Книги. У каждой указаны сура и аят, так что её можно сверить с мусхафом за минуту; у мольб из Сунны указан источник хадиса.',
      ],
      en: [
        'Asking forgiveness is where the return to Allah begins. In the Quran the first such supplication belongs to Adam and Hawwa (peace be upon them): "Our Lord, we have wronged ourselves" (7:23). The people of Musa prayed with almost the same words after their mistake (7:149).',
        'This page gathers eighteen Quranic supplications for forgiveness and repentance — from the shortest, which closes Surah al-Mu’minun (23:118), to the long plea of those endowed with understanding (3:193) and the request of the angels for those who repent (40:7–9). Two chapters from the Sunnah stand beside them: the words of istighfar and repentance, and what is said after committing a sin.',
        'The Quranic supplications differ in standing from those transmitted through hadith: they are the text of the Book itself. Each carries its sura and ayah, so it can be checked against the mushaf in a minute; the supplications from the Sunnah carry their hadith source.',
      ],
    },
    chapterIds: [131, 46],
    duaRefs: [
      { chapterId: 2007, duaId: '2007-33' }, // 7:23 — дуа Адама, первая мольба о прощении в Коране
      { chapterId: 2018, duaId: '2018-77' }, // 23:118 — «Господи, прости и помилуй»
      { chapterId: 2002, duaId: '2002-12' }, // 2:286 — «прости нас, отпусти нам грехи и помилуй нас»
      { chapterId: 2003, duaId: '2003-15' }, // 3:16 — «прости же нам наши грехи»
      { chapterId: 2003, duaId: '2003-25' }, // 3:193 — «сотри наши прегрешения»
      { chapterId: 2003, duaId: '2003-21' }, // 3:147 — «прости нам наши грехи и излишества в наших делах»
      { chapterId: 2002, duaId: '2002-11' }, // 2:285 — «прощения Твоего просим, Господь наш»
      { chapterId: 2022, duaId: '2022-85' }, // 28:16 — «я поступил несправедливо к себе. Прости же меня»
      { chapterId: 2007, duaId: '2007-37' }, // 7:143 — «я раскаиваюсь перед Тобой»
      { chapterId: 2007, duaId: '2007-38' }, // 7:149 — раскаяние после ошибки
      { chapterId: 2007, duaId: '2007-39' }, // 7:151 — «прости меня и моего брата»
      { chapterId: 2007, duaId: '2007-40' }, // 7:155–156 — «Ты — лучший из прощающих»
      { chapterId: 2010, duaId: '2010-47' }, // 11:47 — «если Ты не простишь меня и не помилуешь»
      { chapterId: 2018, duaId: '2018-76' }, // 23:109 — «прости же нас и помилуй»
      { chapterId: 2021, duaId: '2021-84' }, // 27:44 — «я была несправедлива к себе, и я покорилась»
      { chapterId: 2012, duaId: '2012-55' }, // 14:41 — «прости меня, моих родителей и верующих»
      { chapterId: 2035, duaId: '2035-107' }, // 71:28 — «прости меня, моих родителей и тех, кто вошёл в мой дом»
      { chapterId: 2027, duaId: '2027-95' }, // 40:7–9 — «прости же тех, кто раскаялся»
    ],
  },
  {
    id: 'patience-trust',
    slug: { ru: 'dua-o-terpenii-i-upovanii', en: 'duas-for-patience-and-trust-in-allah' },
    title: {
      ru: 'Дуа о терпении и уповании на Аллаха',
      en: 'Duas for patience and trust in Allah',
    },
    summary: {
      ru: 'Мольбы о терпении, стойкости сердца и уповании — «не отклоняй наши сердца» (3:8), «излей на нас терпение» (2:250) и главы Сунны о сомнении и предопределении.',
      en: 'Supplications for patience, a steadfast heart and trust in Allah — "do not let our hearts deviate" (3:8), "pour patience upon us" (2:250), and Sunnah chapters on doubt and decree.',
    },
    intro: {
      ru: [
        'Терпение в Коране просят так же, как просят пропитания: не как чувство, а как то, что изливается свыше. Войско Талута перед битвой сказало: «Господь наш, излей на нас терпение, укрепи наши стопы и помоги нам против неверующего народа» (2:250) — и почти теми же словами молились шедшие за пророками (3:147).',
        'Сюда вошли двенадцать коранических мольб. Среди них просьба о стойкости сердца «не отклоняй наши сердца после того, как Ты наставил нас на прямой путь» (3:8), слова уверовавших колдунов фараона перед казнью (7:126), «на Тебя мы уповаем, к Тебе обращаемся» (60:4) и «я вверяю своё дело Аллаху» (40:44).',
        'Из Сунны здесь четыре главы: что говорить при сомнении в вере, при том, что не нравится или чего нельзя изменить, при страхе впасть в многобожие и о порицании дурных предзнаменований. У коранических мольб указаны сура и аят, у остальных — источник хадиса.',
      ],
      en: [
        'In the Quran patience is asked for the way provision is asked for: not as a feeling but as something poured down from above. The army of Talut said before the battle, "Our Lord, pour patience upon us, make our feet firm, and help us against the disbelieving people" (2:250), and those who followed the prophets prayed with almost the same words (3:147).',
        'Twelve Quranic supplications are gathered here. Among them: the request for a steadfast heart, "do not let our hearts deviate after You have guided us" (3:8); the words of the magicians of Pharaoh who believed, spoken before their execution (7:126); "upon You we rely, to You we turn" (60:4); and "I entrust my affair to Allah" (40:44).',
        'Four chapters from the Sunnah stand with them: what to say when doubt about faith arises, when something is disliked or cannot be changed, when one fears falling into shirk, and against reading bad omens. The Quranic supplications carry their sura and ayah; the rest carry their hadith source.',
      ],
    },
    chapterIds: [42, 48, 94, 96],
    duaRefs: [
      { chapterId: 2003, duaId: '2003-13' }, // 3:8 — «не отклоняй наши сердца после того, как Ты наставил нас»
      { chapterId: 2002, duaId: '2002-9' }, // 2:250 — «излей на нас терпение, укрепи наши стопы»
      { chapterId: 2003, duaId: '2003-21' }, // 3:147 — «укрепи наши стопы и помоги нам»
      { chapterId: 2007, duaId: '2007-36' }, // 7:126 — «излей на нас терпение и упокой нас покорившимися»
      { chapterId: 2033, duaId: '2033-102' }, // 60:4 — «на Тебя мы уповаем, к Тебе обращаемся»
      { chapterId: 2027, duaId: '2027-96' }, // 40:44 — «я вверяю своё дело Аллаху»
      { chapterId: 2010, duaId: '2010-48' }, // 11:88 — «успех мой — только от Аллаха. На Него я уповаю»
      { chapterId: 2003, duaId: '2003-20' }, // 3:53 — «запиши же нас среди свидетельствующих»
      { chapterId: 2005, duaId: '2005-29' }, // 5:83 — «запиши же нас среди свидетелей»
      { chapterId: 2033, duaId: '2033-103' }, // 60:5 — «не делай нас искушением для неверующих»
      { chapterId: 2012, duaId: '2012-52' }, // 14:35 — «убереги меня и моих сыновей от поклонения идолам»
      { chapterId: 2001, duaId: '2001-1' }, // 1:5–7 — «веди нас прямым путём»
    ],
  },
  {
    id: 'knowledge-speech',
    slug: { ru: 'dua-o-znanii-i-yasnosti-rechi', en: 'duas-for-knowledge-and-clear-speech' },
    title: {
      ru: 'Дуа о знании, ясности речи и верном решении',
      en: 'Duas for knowledge, clear speech and right decisions',
    },
    summary: {
      ru: 'Мольбы о знании и ясности речи: «Господи, приумножь мои знания» (20:114), дуа Мусы перед трудным разговором (20:25–28) и слова истихары из Сунны.',
      en: 'Supplications for knowledge and clear speech — "My Lord, increase me in knowledge" (20:114), the dua of Musa before a hard conversation (20:25–28), and istikhara from the Sunnah.',
    },
    intro: {
      ru: [
        'Во всём Коране есть только одна мольба о прибавлении чего-либо, и это прибавление знания: «Господи, приумножь мои знания» (20:114). Немногим раньше, в той же суре «Та Ха», Муса (мир ему) просит перед разговором с фараоном: «раскрой мою грудь, облегчи моё дело, развяжи узел на моём языке, чтобы они поняли мою речь» (20:25–28).',
        'К ним добавлены слова ангелов «мы знаем лишь то, чему Ты нас научил» (2:32), мольба юношей пещеры «устрой наше дело наилучшим образом» (18:10), оговорка о будущем (18:24) и просьба Ибрахима (мир ему) о мудрости (26:83–87). Из Сунны сюда входит истихара — мольба того, кто испрашивает благословения перед решением.',
        'Коранические мольбы приведены в самой Книге, а не переданы через хадис; у каждой указаны сура и аят, так что её можно сверить с мусхафом. Истихара дана с арабским текстом, огласовками, переводом и ссылкой на источник хадиса.',
      ],
      en: [
        'In the whole of the Quran there is only one supplication asking for an increase of anything, and what it asks to increase is knowledge: "My Lord, increase me in knowledge" (20:114). A little earlier in the same Surah Ta Ha, Musa (peace be upon him) asks before facing Pharaoh: "expand my breast, ease my task, and untie the knot from my tongue, so that they may understand my speech" (20:25–28).',
        'With them stand the words of the angels, "we know nothing except what You have taught us" (2:32); the plea of the youths of the cave, "prepare for us right guidance in our affair" (18:10); the qualification to be said about the future (18:24); and the request of Ibrahim (peace be upon him) for sound judgement (26:83–87). From the Sunnah comes istikhara, the supplication of one seeking guidance before a decision.',
        'The Quranic supplications are set down in the Book itself rather than transmitted through hadith, and each carries its sura and ayah, so it can be checked against the mushaf. Istikhara is given with Arabic text, diacritics, translation and its hadith source.',
      ],
    },
    chapterIds: [28],
    duaRefs: [
      { chapterId: 2016, duaId: '2016-66' }, // 20:114 — «Господи, приумножь мои знания»
      { chapterId: 2016, duaId: '2016-64' }, // 20:25–28 — «развяжи узел на моём языке, чтобы они поняли мою речь»
      { chapterId: 2002, duaId: '2002-2' }, // 2:32 — «мы знаем лишь то, чему Ты нас научил»
      { chapterId: 2014, duaId: '2014-59' }, // 18:10 — «устрой наше дело наилучшим образом»
      { chapterId: 2014, duaId: '2014-60' }, // 18:24 — «быть может, Господь мой поведёт меня к более близкому пути»
      { chapterId: 2020, duaId: '2020-80' }, // 26:83–87 — «Господи, даруй мне мудрость»
    ],
  },
  {
    id: 'parents',
    slug: { ru: 'dua-za-roditeley-zhivykh-i-umershikh', en: 'duas-for-parents-living-and-departed' },
    title: {
      ru: 'Дуа за родителей — живых и умерших',
      en: 'Duas for parents — living and departed',
    },
    summary: {
      ru: 'Дуа за родителей из Корана: «Господи, помилуй их обоих, как они растили меня ребёнком» (17:24), мольбы Ибрахима и Нуха (мир им) о прощении для родителей.',
      en: 'Duas for parents from the Quran: "My Lord, have mercy on them both as they brought me up when I was small" (17:24), and the pleas of Ibrahim and Nuh for their parents.',
    },
    intro: {
      ru: [
        'Коран приводит саму формулу мольбы за родителей и ставит её сразу после веления быть с ними добрым: «Господи, помилуй их обоих, как они растили меня ребёнком» (17:24).',
        'Рядом — три мольбы, в которых родители названы вместе с другими верующими: просьба Ибрахима (мир ему) «прости меня, моих родителей и верующих в тот день, когда наступит расчёт» (14:41), его же просьба о прощении для отца (26:83–87) и мольба Нуха (мир ему) о родителях, домочадцах и всей общине (71:28). Мольба достигшего сорока лет (46:15) просит о благодарности за милость, оказанную ему и его родителям.',
        'Отдельной главы о родителях в собрании из Сунны нет, поэтому страница целиком кораническая: пять мольб, у каждой указаны сура и аят, арабский текст с огласовками и пословный перевод. Это слова, приведённые в Книге Аллаха, и любую из них можно сверить с мусхафом.',
      ],
      en: [
        'The Quran gives the formula of the supplication for parents itself, and places it directly after the command to treat them well: "My Lord, have mercy on them both as they brought me up when I was small" (17:24).',
        'Beside it stand three supplications in which parents are named together with the other believers: the plea of Ibrahim (peace be upon him), "our Lord, forgive me, my parents and the believers on the Day the reckoning is established" (14:41); his request for forgiveness for his father (26:83–87); and the supplication of Nuh (peace be upon him) for his parents, his household and the whole community (71:28). The supplication of one who reaches forty (46:15) asks for gratitude for the favour bestowed on him and on his parents.',
        'The Sunnah collection on this site has no chapter of its own on parents, so this page is entirely Quranic: five supplications, each with its sura and ayah, the Arabic text with diacritics and a word-by-word translation. These are words set down in the Book of Allah, and any of them can be checked against the mushaf.',
      ],
    },
    chapterIds: [],
    duaRefs: [
      { chapterId: 2013, duaId: '2013-56' }, // 17:24 — «помилуй их обоих, как они растили меня ребёнком»
      { chapterId: 2012, duaId: '2012-55' }, // 14:41 — «прости меня, моих родителей и верующих»
      { chapterId: 2035, duaId: '2035-107' }, // 71:28 — «прости меня, моих родителей и тех, кто вошёл в мой дом»
      { chapterId: 2020, duaId: '2020-80' }, // 26:83–87 — «прости моего отца, ведь он был из заблудших»
      { chapterId: 2030, duaId: '2030-99' }, // 46:15 — «милость, которой Ты одарил меня и моих родителей»
    ],
  },
  {
    id: 'judgement-salvation',
    slug: { ru: 'dua-o-spasenii-v-den-voskreseniya', en: 'duas-for-salvation-on-the-day-of-resurrection' },
    title: {
      ru: 'Дуа о Дне воскресения, свете и спасении от Огня',
      en: 'Duas for the Day of Resurrection, light and salvation from the Fire',
    },
    summary: {
      ru: 'Мольбы о Дне воскресения: «дай нам света сполна и прости нас» (66:8), просьбы о защите от Огня и о доме в Раю, с указанием суры и аята у каждой.',
      en: 'Supplications for the Day of Resurrection — "perfect our light for us and forgive us" (66:8), requests for protection from the Fire and for a house in Paradise, with sura and ayah.',
    },
    intro: {
      ru: [
        'Мольба о свете в День воскресения приведена в суре «Ат-Тахрим»: «Господь наш, дай нам света сполна и прости нас. Воистину, Ты способен на всякую вещь» (66:8).',
        'Десять коранических мольб этой страницы говорят об одном дне и о том, чем он кончится. Обладающие разумом просят: «Господь наш, Ты сотворил это не напрасно… Защити же нас от мучений Огня» (3:191) и «не опозорь нас в День воскресения» (3:194). Рабы Милостивого просят отвратить мучения Геенны (25:65–66); Асия (мир ей) просит построить ей дом у Аллаха в Раю (66:11).',
        'Из Сунны сюда входит глава о мольбах после последнего ташаххуда перед приветствием, среди которых прибежище от мук Геенны, от мучений могилы и от искушения Лжемессии. У коранических мольб указаны сура и аят, у мольб из Сунны — источник хадиса.',
      ],
      en: [
        'The supplication for light on the Day of Resurrection is set down in Surah at-Tahrim: "Our Lord, perfect our light for us and forgive us. Truly You are able to do all things" (66:8).',
        'The ten Quranic supplications on this page speak of one day and of how it ends. Those endowed with understanding ask, "our Lord, You did not create this in vain… Protect us from the punishment of the Fire" (3:191), and "do not disgrace us on the Day of Resurrection" (3:194). The servants of the Most Merciful ask that the punishment of Hell be turned away from them (25:65–66); Asiya (peace be upon her) asks for a house near Allah in Paradise (66:11).',
        'From the Sunnah comes the chapter of supplications said after the final tashahhud and before the salam, among them the refuge from the punishment of Hell, from the punishment of the grave and from the trial of the false messiah. The Quranic supplications carry their sura and ayah; those from the Sunnah carry their hadith source.',
      ],
    },
    chapterIds: [26],
    duaRefs: [
      { chapterId: 2034, duaId: '2034-104' }, // 66:8 — «дай нам света сполна и прости нас»
      { chapterId: 2003, duaId: '2003-26' }, // 3:194 — «не опозорь нас в День воскресения»
      { chapterId: 2003, duaId: '2003-23' }, // 3:191 — «защити же нас от мучений Огня»
      { chapterId: 2003, duaId: '2003-15' }, // 3:16 — «защити нас от мучений Огня»
      { chapterId: 2019, duaId: '2019-78' }, // 25:65–66 — «отврати от нас мучения Геенны»
      { chapterId: 2003, duaId: '2003-14' }, // 3:9 — «Ты соберёшь людей в день, в котором нет сомнения»
      { chapterId: 2003, duaId: '2003-24' }, // 3:192 — «того, кого Ты ввёл в Огонь, Ты уже опозорил»
      { chapterId: 2007, duaId: '2007-34' }, // 7:47 — «не помещай нас с несправедливым народом»
      { chapterId: 2018, duaId: '2018-74' }, // 23:93–94 — «не помещай меня среди несправедливых людей»
      { chapterId: 2034, duaId: '2034-105' }, // 66:11 — «построй для меня дом у Себя в Раю»
    ],
  },
];

export function findCategoryBySlug(slug: string, lang: 'ru' | 'en'): Category | null {
  return CATEGORIES.find((c) => c.slug[lang] === slug) ?? null;
}
