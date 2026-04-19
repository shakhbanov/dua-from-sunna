import { ChapterData } from '../../types';

export const CHAPTER_111: ChapterData = {
    id: 111,
    title: { ru: "Как следует отвечать неверному, если он поприветствует тебя", en: "How to reply to a disbeliever if he greets you" },
    duas: [
      {
        id: "111-1",
        audioUrl: "https://s3.twcstorage.ru/44a93b74-shakhbanov/hisn-al-muslim/221.wav",
        narration: {
          ru: "Передают, что Посланник Аллаха ﷺ сказал: «Когда люди Писания поприветствуют вас [словами «ас-саму ‘алей-кум»¹], [ответьте им]:»",
          en: "The Messenger of Allah ﷺ said: \"When the People of the Book greet you [with the words \"as-samu ‘alaykum\"¹], say in reply:\""
        },
        fullTranslation: {
          ru: "И вам!",
          en: "And upon you."
        },
        sync: [
          { text: "وَعَلَيْكُمْ", trans: { ru: "И вам", en: "And upon you" }, start: 0, end: 0 }
        ],
        note: {
          ru: "¹ «Ас-саму ‘алей-кум» означает «смерть вам». Искажая обычное приветствие «ас-саляму ‘алей-кум», иудеи в Медине использовали созвучное ему слово «саам» (смерть), что и имеется в виду в этом хадисе. Поэтому отвечать следует лишь словами «и вам» без «мира», чтобы пожелание обернулось на того, кто его произнёс.",
          en: "¹ \"As-samu ‘alaykum\" means \"may death be upon you.\" Twisting the usual greeting \"as-salamu ‘alaykum,\" the Jews of Medina used the similar-sounding word \"sam\" (death), which is what this hadith refers to. The reply \"wa ‘alaykum\" (without \"salam\") simply returns the wish upon the one who spoke it."
        },
        source: { ru: "аль-Бухари 6258; Муслим 2163", en: "al-Bukhari 6258; Muslim 2163" }
      }
    ]
  };
