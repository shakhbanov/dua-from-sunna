import { ChapterData } from './types';

export const APP_TITLE = {
  ru: "Крепость Мусульманина",
  en: "Fortress of the Muslim"
};



import { CHAPTER_001 } from './data/chapters/001-authors-preface';
import { CHAPTER_002 } from './data/chapters/002-virtues-of-remembering-allah';
import { CHAPTER_003 } from './data/chapters/003-supplications-upon-waking-up';
import { CHAPTER_004 } from './data/chapters/004-supplication-when-wearing-a-garment';
import { CHAPTER_005 } from './data/chapters/005-supplication-when-wearing-a-new-garment';
import { CHAPTER_006 } from './data/chapters/006-supplication-for-someone-wearing-a-new-garment';
import { CHAPTER_007 } from './data/chapters/007-before-undressing';
import { CHAPTER_008 } from './data/chapters/008-before-entering-the-toilet';
import { CHAPTER_009 } from './data/chapters/009-after-leaving-the-toilet';
import { CHAPTER_010 } from './data/chapters/010-before-ablution-wudu';
import { CHAPTER_011 } from './data/chapters/011-after-completing-ablution';
import { CHAPTER_012 } from './data/chapters/012-when-leaving-the-home';
import { CHAPTER_013 } from './data/chapters/013-when-entering-the-home';
import { CHAPTER_014 } from './data/chapters/014-supplication-when-going-to-the-mosque';
import { CHAPTER_015 } from './data/chapters/015-when-entering-the-mosque';
import { CHAPTER_016 } from './data/chapters/016-when-leaving-the-mosque';
import { CHAPTER_017 } from './data/chapters/017-supplications-related-to-the-adhan';
import { CHAPTER_018 } from './data/chapters/018-supplication-at-the-start-of-the-prayer';
import { CHAPTER_019 } from './data/chapters/019-supplication-while-bowing-in-prayer-ruku';
import { CHAPTER_020 } from './data/chapters/020-supplication-when-rising-from-bowing';
import { CHAPTER_021 } from './data/chapters/021-supplication-while-prostrating-sujood';
import { CHAPTER_022 } from './data/chapters/022-supplication-between-two-prostrations';
import { CHAPTER_023 } from './data/chapters/023-supplication-when-prostrating-due-to-recitation-of-quran';
import { CHAPTER_024 } from './data/chapters/024-the-tashahhud';
import { CHAPTER_025 } from './data/chapters/025-prayers-upon-the-prophet-after-tashahhud';
import { CHAPTER_026 } from './data/chapters/026-supplication-after-the-last-tashahhud-and-before-salam';
import { CHAPTER_027 } from './data/chapters/027-remembrance-after-salam';
import { CHAPTER_028 } from './data/chapters/028-supplication-for-seeking-guidance-istikharah';
import { CHAPTER_029 } from './data/chapters/029-morning-and-evening-adhkar';
import { CHAPTER_030 } from './data/chapters/030-supplications-before-sleeping';
import { CHAPTER_031 } from './data/chapters/031-supplication-when-turning-over-during-the-night';
import { CHAPTER_032 } from './data/chapters/032-supplication-upon-experiencing-unrest-or-fear-during-sleep';
import { CHAPTER_033 } from './data/chapters/033-upon-seeing-a-good-or-bad-dream';
import { CHAPTER_034 } from './data/chapters/034-qunut-al-witr';
import { CHAPTER_035 } from './data/chapters/035-remembrance-immediately-after-salam-in-witr-prayer';
import { CHAPTER_036 } from './data/chapters/036-supplication-for-anxiety-and-sorrow';
import { CHAPTER_037 } from './data/chapters/037-supplication-for-distress';
import { CHAPTER_038 } from './data/chapters/038-upon-encountering-an-enemy-or-those-of-authority';
import { CHAPTER_039 } from './data/chapters/039-supplication-when-fearing-an-unjust-ruler';
import { CHAPTER_040 } from './data/chapters/040-supplication-against-an-enemy';
import { CHAPTER_041 } from './data/chapters/041-what-to-say-when-afraid-of-a-group-of-people';
import { CHAPTER_042 } from './data/chapters/042-supplication-for-one-afflicted-with-doubt-in-his-faith';
import { CHAPTER_043 } from './data/chapters/043-supplication-for-settling-a-debt';
import { CHAPTER_044 } from './data/chapters/044-supplication-for-one-whose-prayer-is-disrupted-by-satan';
import { CHAPTER_045 } from './data/chapters/045-supplication-for-when-something-becomes-difficult';
import { CHAPTER_046 } from './data/chapters/046-supplication-upon-committing-a-sin';
import { CHAPTER_047 } from './data/chapters/047-supplications-for-expelling-the-devil-and-his-whisperings';
import { CHAPTER_048 } from './data/chapters/048-supplication-when-something-you-dislike-happens-or-for-when-you-fail-to-achieve-what-you-attempt-to-do';
import { CHAPTER_049 } from './data/chapters/049-congratulations-on-a-new-born-baby';
import { CHAPTER_050 } from './data/chapters/050-placing-children-under-allahs-protection';
import { CHAPTER_051 } from './data/chapters/051-when-visiting-the-sick';
import { CHAPTER_052 } from './data/chapters/052-excellence-of-visiting-the-sick';
import { CHAPTER_053 } from './data/chapters/053-supplication-of-the-sick-who-have-renounced-all-hope-of-life';
import { CHAPTER_054 } from './data/chapters/054-instruction-for-the-one-nearing-death';
import { CHAPTER_055 } from './data/chapters/055-supplication-for-one-afflicted-by-a-calamity';
import { CHAPTER_056 } from './data/chapters/056-when-closing-the-eyes-of-the-deceased';
import { CHAPTER_057 } from './data/chapters/057-supplication-for-the-deceased-at-the-funeral-prayer';
import { CHAPTER_058 } from './data/chapters/058-supplication-for-the-advancement-of-reward-during-the-funeral-prayer';
import { CHAPTER_059 } from './data/chapters/059-condolence';
import { CHAPTER_060 } from './data/chapters/060-placing-the-deceased-in-the-grave';
import { CHAPTER_061 } from './data/chapters/061-after-burying-the-deceased';
import { CHAPTER_062 } from './data/chapters/062-visiting-the-graves';
import { CHAPTER_063 } from './data/chapters/063-prayer-during-a-wind-storm';
import { CHAPTER_064 } from './data/chapters/064-supplication-upon-hearing-thunder';
import { CHAPTER_065 } from './data/chapters/065-supplication-for-rain';
import { CHAPTER_066 } from './data/chapters/066-supplication-when-it-rains';
import { CHAPTER_067 } from './data/chapters/067-supplication-after-rain';
import { CHAPTER_068 } from './data/chapters/068-asking-for-clear-skies';
import { CHAPTER_069 } from './data/chapters/069-upon-sighting-the-crescent-moon';
import { CHAPTER_070 } from './data/chapters/070-supplication-upon-breaking-the-fast';
import { CHAPTER_071 } from './data/chapters/071-supplication-before-eating';
import { CHAPTER_072 } from './data/chapters/072-supplication-upon-completing-the-meal';
import { CHAPTER_073 } from './data/chapters/073-supplication-of-the-guest-for-the-host';
import { CHAPTER_074 } from './data/chapters/074-supplication-for-one-who-gives-you-drink';
import { CHAPTER_075 } from './data/chapters/075-supplication-when-breaking-the-fast-in-someones-home';
import { CHAPTER_076 } from './data/chapters/076-supplication-by-one-fasting-when-food-is-presented-and-he-does-not-break-his-fast';
import { CHAPTER_077 } from './data/chapters/077-supplication-upon-seeing-the-early-or-premature-fruit';
import { CHAPTER_078 } from './data/chapters/078-supplication-upon-seeing-the-first-fruit-of-the-season';
import { CHAPTER_079 } from './data/chapters/079-supplication-when-sneezing';
import { CHAPTER_080 } from './data/chapters/080-supplication-for-the-disbeliever-if-he-sneezes-and-praises-allah';
import { CHAPTER_081 } from './data/chapters/081-supplication-for-the-newlywed';
import { CHAPTER_082 } from './data/chapters/082-the-grooms-supplication-on-the-wedding-night-or-when-buying-an-animal';
import { CHAPTER_083 } from './data/chapters/083-supplication-before-sexual-intercourse';
import { CHAPTER_084 } from './data/chapters/084-supplication-when-angry';
import { CHAPTER_085 } from './data/chapters/085-supplication-upon-seeing-someone-in-trial-or-tribulation';
import { CHAPTER_086 } from './data/chapters/086-remembrance-in-a-gathering';
import { CHAPTER_087 } from './data/chapters/087-supplication-for-the-expiation-of-sins-said-at-the-conclusion-of-a-gathering';
import { CHAPTER_088 } from './data/chapters/088-praying-for-one-who-says-may-allah-forgive-you';
import { CHAPTER_089 } from './data/chapters/089-praying-for-one-who-does-you-a-favor';
import { CHAPTER_090 } from './data/chapters/090-protection-from-the-dajjal';
import { CHAPTER_091 } from './data/chapters/091-praying-for-one-who-says-i-love-you-for-the-sake-of-allah';
import { CHAPTER_092 } from './data/chapters/092-praying-for-one-who-offers-you-his-wealth';
import { CHAPTER_093 } from './data/chapters/093-praying-for-the-lender-when-the-debt-is-settled';
import { CHAPTER_094 } from './data/chapters/094-supplication-for-fear-of-shirk';
import { CHAPTER_095 } from './data/chapters/095-praying-for-one-who-says-may-allah-bless-you';
import { CHAPTER_096 } from './data/chapters/096-supplication-against-superstitious-belief';
import { CHAPTER_097 } from './data/chapters/097-supplication-when-mounting-an-animal-or-any-means-of-transport';
import { CHAPTER_098 } from './data/chapters/098-supplication-for-travel';
import { CHAPTER_099 } from './data/chapters/099-supplication-upon-entering-a-town-or-village';
import { CHAPTER_100 } from './data/chapters/100-supplication-when-entering-the-market';
import { CHAPTER_101 } from './data/chapters/101-supplication-when-the-mount-or-vehicle-stumbles';
import { CHAPTER_102 } from './data/chapters/102-supplication-of-the-traveler-for-the-resident';
import { CHAPTER_103 } from './data/chapters/103-supplication-of-the-resident-for-the-traveler';
import { CHAPTER_104 } from './data/chapters/104-remembrance-while-ascending-or-descending';
import { CHAPTER_105 } from './data/chapters/105-prayer-of-the-traveler-as-dawn-approaches';
import { CHAPTER_106 } from './data/chapters/106-supplication-when-making-a-stop-while-traveling';
import { CHAPTER_107 } from './data/chapters/107-supplication-upon-returning-from-travel';
import { CHAPTER_108 } from './data/chapters/108-what-to-say-upon-receiving-pleasing-or-displeasing-news';
import { CHAPTER_109 } from './data/chapters/109-excellence-of-sending-prayers-upon-the-prophet';
import { CHAPTER_110 } from './data/chapters/110-excellence-of-spreading-the-salam';
import { CHAPTER_111 } from './data/chapters/111-how-to-reply-to-a-disbeliever-if-he-greets-you';
import { CHAPTER_112 } from './data/chapters/112-supplication-upon-hearing-a-cock-crow-or-the-braying-of-a-donkey';
import { CHAPTER_113 } from './data/chapters/113-supplication-upon-hearing-the-barking-of-dogs-at-night';
import { CHAPTER_114 } from './data/chapters/114-supplication-for-one-you-have-insulted';
import { CHAPTER_115 } from './data/chapters/115-the-etiquette-of-praising-a-fellow-muslim';
import { CHAPTER_116 } from './data/chapters/116-supplication-for-the-one-who-is-praised';
import { CHAPTER_117 } from './data/chapters/117-the-talbiyah-for-hajj-or-umrah';
import { CHAPTER_118 } from './data/chapters/118-the-takbir-passing-the-black-stone';
import { CHAPTER_119 } from './data/chapters/119-supplication-between-the-yemeni-corner-and-the-black-stone';
import { CHAPTER_120 } from './data/chapters/120-supplication-when-standing-at-mount-safa-and-mount-marwah';
import { CHAPTER_121 } from './data/chapters/121-supplication-on-the-day-of-arafah';
import { CHAPTER_122 } from './data/chapters/122-supplication-at-the-sacred-area-muzdalifah';
import { CHAPTER_123 } from './data/chapters/123-the-takbir-at-each-throw-of-a-pebble';
import { CHAPTER_124 } from './data/chapters/124-what-to-say-when-surprised-or-startled';
import { CHAPTER_125 } from './data/chapters/125-what-to-do-upon-receiving-good-news';
import { CHAPTER_126 } from './data/chapters/126-what-to-say-when-feeling-some-pain-in-the-body';
import { CHAPTER_127 } from './data/chapters/127-what-to-say-when-you-fear-you-might-afflict-something-with-the-evil-eye';
import { CHAPTER_128 } from './data/chapters/128-what-to-say-when-panicked';
import { CHAPTER_129 } from './data/chapters/129-what-to-say-when-slaughtering-or-sacrificing-an-animal';
import { CHAPTER_130 } from './data/chapters/130-to-ward-off-the-deception-of-the-obstinate-shaytans';
import { CHAPTER_131 } from './data/chapters/131-seeking-forgiveness-and-repentance';
import { CHAPTER_132 } from './data/chapters/132-excellence-of-remembrance-tasbih-tahmid-tahlil-takbir';
import { CHAPTER_133 } from './data/chapters/133-how-the-prophet-glorified-allah';
import { CHAPTER_134 } from './data/chapters/134-types-of-goodness-and-good-etiquette';

export const MOCK_DATABASE: ChapterData[] = [
  CHAPTER_001,
  CHAPTER_002,
  CHAPTER_003,
  CHAPTER_004,
  CHAPTER_005,
  CHAPTER_006,
  CHAPTER_007,
  CHAPTER_008,
  CHAPTER_009,
  CHAPTER_010,
  CHAPTER_011,
  CHAPTER_012,
  CHAPTER_013,
  CHAPTER_014,
  CHAPTER_015,
  CHAPTER_016,
  CHAPTER_017,
  CHAPTER_018,
  CHAPTER_019,
  CHAPTER_020,
  CHAPTER_021,
  CHAPTER_022,
  CHAPTER_023,
  CHAPTER_024,
  CHAPTER_025,
  CHAPTER_026,
  CHAPTER_027,
  CHAPTER_028,
  CHAPTER_029,
  CHAPTER_030,
  CHAPTER_031,
  CHAPTER_032,
  CHAPTER_033,
  CHAPTER_034,
  CHAPTER_035,
  CHAPTER_036,
  CHAPTER_037,
  CHAPTER_038,
  CHAPTER_039,
  CHAPTER_040,
  CHAPTER_041,
  CHAPTER_042,
  CHAPTER_043,
  CHAPTER_044,
  CHAPTER_045,
  CHAPTER_046,
  CHAPTER_047,
  CHAPTER_048,
  CHAPTER_049,
  CHAPTER_050,
  CHAPTER_051,
  CHAPTER_052,
  CHAPTER_053,
  CHAPTER_054,
  CHAPTER_055,
  CHAPTER_056,
  CHAPTER_057,
  CHAPTER_058,
  CHAPTER_059,
  CHAPTER_060,
  CHAPTER_061,
  CHAPTER_062,
  CHAPTER_063,
  CHAPTER_064,
  CHAPTER_065,
  CHAPTER_066,
  CHAPTER_067,
  CHAPTER_068,
  CHAPTER_069,
  CHAPTER_070,
  CHAPTER_071,
  CHAPTER_072,
  CHAPTER_073,
  CHAPTER_074,
  CHAPTER_075,
  CHAPTER_076,
  CHAPTER_077,
  CHAPTER_078,
  CHAPTER_079,
  CHAPTER_080,
  CHAPTER_081,
  CHAPTER_082,
  CHAPTER_083,
  CHAPTER_084,
  CHAPTER_085,
  CHAPTER_086,
  CHAPTER_087,
  CHAPTER_088,
  CHAPTER_089,
  CHAPTER_090,
  CHAPTER_091,
  CHAPTER_092,
  CHAPTER_093,
  CHAPTER_094,
  CHAPTER_095,
  CHAPTER_096,
  CHAPTER_097,
  CHAPTER_098,
  CHAPTER_099,
  CHAPTER_100,
  CHAPTER_101,
  CHAPTER_102,
  CHAPTER_103,
  CHAPTER_104,
  CHAPTER_105,
  CHAPTER_106,
  CHAPTER_107,
  CHAPTER_108,
  CHAPTER_109,
  CHAPTER_110,
  CHAPTER_111,
  CHAPTER_112,
  CHAPTER_113,
  CHAPTER_114,
  CHAPTER_115,
  CHAPTER_116,
  CHAPTER_117,
  CHAPTER_118,
  CHAPTER_119,
  CHAPTER_120,
  CHAPTER_121,
  CHAPTER_122,
  CHAPTER_123,
  CHAPTER_124,
  CHAPTER_125,
  CHAPTER_126,
  CHAPTER_127,
  CHAPTER_128,
  CHAPTER_129,
  CHAPTER_130,
  CHAPTER_131,
  CHAPTER_132,
  CHAPTER_133,
  CHAPTER_134,
];
