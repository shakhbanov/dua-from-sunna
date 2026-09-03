import React from 'react';
import { useRoute } from '../router/RouterContext';
import { getCollection } from '../../data/collections';
import { buildChapterPath, buildHomePath } from '../router/routes';
import { I18N } from '../i18n/strings';
import type { Collection } from '../../types';
import { keyedParagraphs } from '../features/reader/paragraphs';
import SiteFooter from '../../components/SiteFooter';

interface CollectionIndexPageProps {
  collection: Collection;
}

const INTRO: Record<Collection, { ru: string[]; en: string[] }> = {
  sunna: { ru: [], en: [] },
  quran: {
    ru: [
      'Коран содержит десятки мольб, вложенных Аллахом в уста пророков и верующих: слова Адама после ошибки, зов Юнуса из мрака, просьба Мусы о раскрытии груди, мольба Ибрахима о праведном потомстве. Эти дуа — не пересказ, а сама речь Аллаха, и потому занимают в мольбе особое место.',
      'В этом разделе они собраны по темам: прощение грехов, стойкость веры, тревога и беда, знание, семья, родители, пропитание, несправедливость и спасение в Судный день. Для каждой мольбы приведён арабский текст с огласовками, пословный перевод на русский и английский, обстоятельства её ниспослания и точная ссылка на суру и аят.',
      'Коранические мольбы читают в земном поклоне, в кунуте витра, после обязательных молитв и в любое время нужды. Многие из них Пророк ﷺ произносил сам — на это указано в пояснениях к отдельным дуа.',
    ],
    en: [
      'The Qur\'an contains dozens of supplications placed by Allah on the tongues of prophets and believers: the words of Adam after his lapse, the call of Yunus from the darkness, Musa\'s request that his breast be expanded, Ibrahim\'s plea for righteous offspring. These duas are not a retelling but the very speech of Allah, and so they hold a special rank in supplication.',
      'This section gathers them by theme: forgiveness of sins, steadfastness in faith, distress and hardship, knowledge, family, parents, provision, oppression, and salvation on the Day of Judgement. Each supplication comes with the vocalised Arabic text, word-by-word Russian and English translation, the circumstance in which it was revealed, and the exact sura and ayah reference.',
      'Quranic supplications are recited in prostration, in the qunut of witr, after the obligatory prayers, and at any time of need. Many of them were said by the Prophet ﷺ himself — this is noted in the commentary on the individual duas.',
    ],
  },
  nawawi: {
    ru: [
      'Сборник составил имам Яхья ибн Шараф ан-Навави (631–676 гг. хиджры) и назвал его «аль-Арбаун» — «Сорок». Под этим именем он и известен, хотя хадисов в нём сорок два: имам добавил последние, завершая труд.',
      'Хадисы охватывают основы религии: намерение, столпы ислама и веры, дозволенное и запретное, поминание Аллаха, отношение к людям и к самому себе. Каждый из них короток и заучивается наизусть — с этого сборника веками начинают изучение хадиса.',
      'Здесь каждый хадис приведён с арабским текстом с огласовками, пословным переводом на русский и английский, именем передавшего его сподвижника и ссылкой на сборник и номер хадиса.',
    ],
    en: [
      'The collection was compiled by Imam Yahya ibn Sharaf an-Nawawi (631–676 AH), who named it al-Arba\'un — “The Forty”. It is known by that name still, though it holds forty-two hadith: the imam added the last of them as he completed the work.',
      'The hadith cover the foundations of the religion: intention, the pillars of Islam and of faith, the lawful and the forbidden, the remembrance of Allah, and how a person treats others and himself. Each is short and meant to be memorised — for centuries the study of hadith has begun here.',
      'Each hadith is given with the vocalised Arabic text, word-by-word Russian and English translation, the name of the companion who narrated it, and the collection and number it comes from.',
    ],
  },
};

const CollectionIndexPage: React.FC<CollectionIndexPageProps> = ({ collection }) => {
  const { lang, navigate } = useRoute();
  const coll = getCollection(collection);
  const t = I18N[lang];
  const intro = INTRO[collection][lang];
  const totalDuas = coll.chapters.reduce((n, c) => n + c.duas.length, 0);
  // A collection whose chapters hold one item each (the Forty Hadith) counts
  // in chapters: repeating "1 дуа" on every row states nothing.
  const countsByChapter = coll.chapters.every((c) => c.duas.length <= 1);

  const go = (ev: React.MouseEvent<HTMLAnchorElement>, chapterId: number) => {
    ev.preventDefault();
    navigate({ view: 'chapter', chapterId });
  };

  return (
    <main className="max-w-3xl mx-auto px-5 py-10 font-sans">
      <nav aria-label="breadcrumb" className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        <a href={buildHomePath(lang)} className="hover:underline">
          {t.home}
        </a>
        <span className="mx-2">/</span>
        <span>{coll.title[lang]}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{coll.title[lang]}</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-2 leading-relaxed">
        {coll.summary[lang]}
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        {coll.chapters.length} {t.chapters}
        {!countsByChapter && ` · ${totalDuas} ${t.duasCount}`}
      </p>

      {intro.length > 0 && (
        <div className="max-w-none mb-10">
          {keyedParagraphs(intro).map((para) => (
            <p key={para.key} className="mb-4 leading-relaxed text-neutral-800 dark:text-neutral-200">
              {para.text}
            </p>
          ))}
        </div>
      )}

      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800">
        {coll.chapters.map((ch) => (
          <li key={ch.id} className="py-3">
            <a
              href={buildChapterPath(ch.id, lang, collection)}
              onClick={(e) => go(e, ch.id)}
              className="flex items-baseline justify-between gap-4 hover:underline"
            >
              <span className="font-medium">{ch.title[lang]}</span>
              {!countsByChapter && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">
                  {ch.duas.length} {t.duasCount}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>

      <SiteFooter lang={lang} />
    </main>
  );
};

export default CollectionIndexPage;
