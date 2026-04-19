import { ChapterData } from '../../types';

export const CHAPTER_123: ChapterData = {
    id: 123,
    title: { ru: "Произнесение слов «Аллах велик» при бросании в столбы каждого камешка", en: "The Takbir at each throw of a pebble" },
    duas: [
      {
        id: "123-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/234.wav",
        narration: {
          ru: "Передают, что Ибн ‘Умар رضي الله عنهما бросал семь камешков в малый [столб¹], произнося [при бросании каждого] «Аллах велик!», после чего выходил вперёд, поворачивался к кыбле и, стоя, обращался к Аллаху с длинными мольбами, воздев руки. Потом он бросал камешки в средний [столб] и [снова] отходил в левую сторону в направлении русла [пересохшего ручья], поворачивался к кыбле и, стоя, обращался к Аллаху с длинными мольбами, воздев руки. А затем он бросал камешки в столб аль-Джамрат аль-‘Акаба, находясь на дне русла, но ни разу не простоял [у него]² и сразу же уходил, говоря: «Я видел, как так же поступал Пророк ﷺ».",
          en: "Ibn ‘Umar رضي الله عنهما would throw seven pebbles at the small [pillar¹], saying \"Allahu akbar\" with each throw, then move forward, face the Qibla, and stand for a long supplication with his hands raised. Then he would throw at the middle [pillar], turn to the left toward the valley, face the Qibla, and stand in long supplication with his hands raised. Then he would throw at Jamrat al-‘Aqabah from the bottom of the valley, not standing by it²; he would leave at once, saying: \"This is what I saw the Prophet ﷺ do.\""
        },
        fullTranslation: {
          ru: "Аллах велик! — при бросании каждого камешка.",
          en: "Allah is the Greatest — with each pebble thrown."
        },
        sync: [
          { text: "اللَّهُ", trans: { ru: "Аллах", en: "Allah" }, start: 0, end: 0 },
          { text: "أَكْبَرُ", trans: { ru: "велик", en: "(is) greatest" }, start: 0, end: 0 }
        ],
        note: {
          ru: "¹ В Мине имеются три каменных столба, условно именуемые «большой», «средний» и «малый». ² В отличие от остальных столбов, у джамрат аль-‘Акаба мольба не совершается.",
          en: "¹ At Mina there are three stone pillars, conventionally called \"big,\" \"middle,\" and \"small.\" ² Unlike at the other two pillars, no supplication is made by Jamrat al-‘Aqabah."
        },
        source: { ru: "аль-Бухари 1750", en: "al-Bukhari 1750" }
      }
    ]
  };
