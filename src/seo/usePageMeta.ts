import { useEffect } from 'react';
import type { ChapterData, Collection, Language } from '../../types';
import { APP_TITLE } from '../../constants';
import { getCollection } from '../../data/collections';
import { I18N } from '../i18n/strings';
import { trackPageView } from '../analytics/yandexMetrika';
import { buildChapterPath, buildCollectionIndexPath, buildPrayerTimesPath } from '../router/routes';
import type { View } from '../router/routes';
import { updateMetaTags } from './updateMetaTags';

const FALLBACK_DESCRIPTION: Record<Language, string> = {
  ru: 'Дуа и азкары из Сунны с аудио, пословным переводом и пояснениями.',
  en: 'Duas and adhkars from the Sunnah with audio, word-by-word translation, and commentary.',
};

interface Args {
  view: View;
  chapter: ChapterData;
  language: Language;
  collection: Collection;
  isPrayerTimes: boolean;
}

function pageTitle({ view, chapter, language, collection, isPrayerTimes }: Args): string {
  if (view === 'collection-index') {
    return `${getCollection(collection).title[language]} — ${APP_TITLE[language]}`;
  }
  if (isPrayerTimes) return `${I18N[language].prayerTimes} — ${APP_TITLE[language]}`;
  return `${chapter.title[language]} — ${APP_TITLE[language]}`;
}

function pageDescription({ view, chapter, language, collection }: Args): string {
  const raw = view === 'collection-index'
    ? getCollection(collection).summary[language]
    : chapter.description?.[language]
      ?? chapter.duas[0]?.fullTranslation?.[language]
      ?? FALLBACK_DESCRIPTION[language];

  return raw.replace(/\*\*/g, '').replace(/\s+/g, ' ').slice(0, 180).trim();
}

function pagePath({ view, chapter, language, collection, isPrayerTimes }: Args): string {
  if (view === 'collection-index') return buildCollectionIndexPath(collection, language);
  if (isPrayerTimes) return buildPrayerTimesPath(language);
  return buildChapterPath(chapter.id, language, collection);
}

/**
 * Keeps <head> and the analytics page view in step with the client-side route.
 *
 * Category and collection-index pages are prerendered with their own head, so
 * this only takes over for the views the SPA actually re-renders in place.
 */
export function usePageMeta({ view, chapter, language, collection, isPrayerTimes }: Args): void {
  useEffect(() => {
    if (view === 'category' || view === 'categories-index' || view === 'about') return;

    const page: Args = { view, chapter, language, collection, isPrayerTimes };
    const title = pageTitle(page);
    const description = pageDescription(page);
    const path = pagePath(page);
    const isChapter = view === 'chapter';

    updateMetaTags({
      title,
      description,
      lang: language,
      path,
      chapterId: isChapter ? chapter.id : undefined,
      chapterTitle: isChapter ? chapter.title[language] : undefined,
      chapterDescription: isChapter ? description : undefined,
      chapter: isChapter ? chapter : undefined,
    });

    // SPA hit to Yandex.Metrika on chapter/view/lang change
    trackPageView(typeof window !== 'undefined' ? window.location.href : path, title);
  }, [view, chapter, language, collection, isPrayerTimes]);
}
