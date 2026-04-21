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
  /** Chapter IDs in desired reading order. */
  chapterIds: number[];
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
      ],
      en: [
        'Morning and evening adhkar form the believer\'s daily protection, assembled from the authentic Sunnah of the Prophet ﷺ. Regular remembrance of Allah, morning and evening, strengthens faith and brings tranquility to the heart.',
        'This page gathers the authentic adhkar to be recited twice a day: after the Fajr (dawn) prayer and after the ‘Asr (afternoon) prayer. For each, we provide the Arabic text with diacritics, word-by-word translation, a full meaning-based English translation, and the hadith source (al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa\'i, Ahmad).',
        'Audio recordings help you memorize correct pronunciation. It is recommended to recite the morning adhkar between Fajr and sunrise, and the evening adhkar between ‘Asr and sunset.',
      ],
    },
    chapterIds: [29],
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
      ],
      en: [
        'Sleep is a minor death, waking a minor resurrection. The Prophet ﷺ taught us to enter and leave sleep with the remembrance of Allah, so that each state carries meaning and protection.',
        'This section includes: the duas before sleep — including the recitation of Ayat al-Kursi ("Allah, there is no god but He…"), Surah al-Ikhlas, al-Falaq, and an-Nas — along with the supplication when turning over during sleep, upon waking in fear, on seeing a good or bad dream, and the words of remembrance said immediately on waking up.',
        'Every dua is cited from authentic sources (al-Bukhari, Muslim, and others) with Arabic text, diacritics, translation, and audio for memorization.',
      ],
    },
    chapterIds: [3, 30, 31, 32, 33],
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
      ],
      en: [
        'A Muslim\'s daily life is woven with remembrance of Allah: every ordinary act — dressing, leaving home, using the bathroom — has its own supplication. This turns routine into worship.',
        'Collected here: adhkar for putting on clothes, wearing new clothes, before undressing, before entering and after leaving the toilet, and when leaving or entering the home. Each has Arabic, translation, and source from the Sunnah.',
        'Memorizing these short duas together with the audio is a step toward a steady connection with Allah throughout the whole day.',
      ],
    },
    chapterIds: [4, 5, 6, 7, 8, 9, 12, 13],
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
      ],
      en: [
        'Prayer is the pillar of the religion, and every stage — from ablution to the final salam — is consecrated by duas from the Sunnah. To skip them is to impoverish the prayer.',
        'This section includes: duas before and after wudu, the opening supplication (istiftah), duas in ruku, on rising from ruku, in sujood, between the two prostrations, in the tashahhud, salawat on the Prophet ﷺ, the dua before salam, remembrance after salam, along with Qunut al-Witr and adhkar after witr.',
        'Every Arabic text is given with diacritics, word-by-word translation, and audio so anyone can align their prayer with the Sunnah.',
      ],
    },
    chapterIds: [10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 34, 35],
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
      ],
      en: [
        'Eating, in Islam, is not mere nourishment — it is an occasion for gratitude. The Prophet ﷺ set specific words for beginning and ending a meal, reminding us that food is a mercy from Allah.',
        'Included here: the dua at iftar (breaking the fast), before eating, after the meal, the guest\'s dua for the host, the dua for one who gave you drink, the dua at iftar in someone\'s home, the dua of a fasting person in the presence of food, what to say when reviled while fasting, and the dua on seeing the first fruit of the season.',
        'Each comes with Arabic text, hadith source (al-Bukhari / Muslim), and audio.',
      ],
    },
    chapterIds: [70, 71, 72, 73, 74, 75, 76, 77, 78],
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
      ],
      en: [
        'Travel is both a trial and a mercy. The Prophet ﷺ taught his companions a whole series of duas for every stage of the journey — from mounting a riding animal (or vehicle) to the return home.',
        'In this collection: the dua when mounting transport, the general traveler\'s dua, the dua on entering a town or village, the dua at the market, the dua when the mount stumbles, the traveler\'s dua for those staying behind, the resident\'s dua for the traveler, remembrance while ascending or descending, the traveler\'s dua as dawn approaches, the dua when making a stop, and the dua on returning from travel.',
        'All texts are cross-checked against authoritative collections (Muslim, Abu Dawud, at-Tirmidhi) and come with audio.',
      ],
    },
    chapterIds: [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107],
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
      ],
      en: [
        'When life tightens, the Prophet ﷺ left us words that simultaneously lift the heart to Allah and lighten the shoulders. These duas are often spoken at threshold moments — before meeting an unjust ruler, in panic, when a debt cannot be repaid.',
        'The collection: dua for anxiety and sorrow, for distress, when encountering an enemy or one in authority, fearing an unjust ruler, against an enemy, when afraid of a group of people, for one afflicted with doubt in his faith, for settling a debt, for one whose prayer is disrupted by Satan, when something becomes difficult, upon committing a sin, for expelling the devil, and when panicked.',
        'Each is from authentic sources, with audio and references.',
      ],
    },
    chapterIds: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 128],
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
      ],
      en: [
        'Family in Islam is a field of worship, not merely private life. The Prophet ﷺ consecrated each of its links — from the wedding to the birth and upbringing of children — with specific duas from the Sunnah.',
        'This set includes: the dua for newlyweds, the groom\'s dua on the wedding night (and when buying an animal), the dua before marital intimacy, congratulations on a new-born baby, and the words placing children under Allah\'s protection.',
        'Arabic original, Russian and English translation, and references to authentic sources.',
      ],
    },
    chapterIds: [49, 50, 81, 82, 83],
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
      ],
      en: [
        'Death is a teacher. The Prophet ﷺ taught us how to speak to the sick, how to instruct the dying, how to bury, and how to visit graves — turning grief into service.',
        'The chapters gathered here cover: visiting the sick, the excellence of doing so, the dua of a sick person who has lost hope of life, the instruction for the dying (talqin), the dua for one afflicted by calamity, closing the eyes of the deceased, the funeral prayer (janazah), the dua for the advancement of reward during the funeral prayer, condolence, placing the deceased in the grave, after burial, and visiting the graves.',
        'Each element comes with the Arabic text, translation, and source (al-Bukhari, Muslim, an-Nasa\'i and others).',
      ],
    },
    chapterIds: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 126],
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
      ],
      en: [
        'Hajj and Umrah are a journey of the soul to the House of Allah, and every one of their rites is accompanied by words the Prophet ﷺ taught his companions.',
        'In this collection: the pilgrim\'s talbiyah ("Labbayk, Allahumma, labbayk…"), the takbir on passing the Black Stone, the dua between the Yemeni Corner and the Black Stone, the duas at Safa and Marwa, the dua on the Day of Arafah, the dua at the Sacred Area of Muzdalifah (al-Mash‘ar al-Haram), and the takbir at each throw of a pebble at the Jamarat.',
        'Every text is fully vocalized and provided with audio for memorization on the journey.',
      ],
    },
    chapterIds: [117, 118, 119, 120, 121, 122, 123],
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
      ],
      en: [
        'Etiquette of speech in Islam is made of small duas that turn words and gestures into remembrance of Allah. A person sneezes — you say "Yarhamu-kallah." Someone praises you — you answer with a supplication for your own soul.',
        'This set includes: supplication when sneezing, for a non-Muslim who sneezes and praises Allah, when angry, on seeing someone in trial, remembrance in a gathering, the expiation of a gathering, the reply to "May Allah forgive you", for one who did you a favor, for one who says "I love you for the sake of Allah", for one who offers you his wealth, for the lender when the debt is settled, against the fear of shirk, for one who says "May Allah bless you", against superstitious belief, for one you have insulted, the etiquette of praising a fellow Muslim, and the dua for the one who is praised.',
        'Every one is from the Sunnah, with source citation and audio.',
      ],
    },
    chapterIds: [79, 80, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 114, 115, 116],
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
];

export function findCategoryBySlug(slug: string, lang: 'ru' | 'en'): Category | null {
  return CATEGORIES.find((c) => c.slug[lang] === slug) ?? null;
}
