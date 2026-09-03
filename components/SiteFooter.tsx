import React from 'react';
import type { Collection, Language } from '../types';
import { COLLECTIONS, defaultChapterIdFor } from '../data/collections';
import { I18N } from '../src/i18n/strings';
import {
  buildAboutPath,
  buildAlternatePath,
  buildCategoriesIndexPath,
  buildCollectionIndexPath,
  buildHomePath,
  buildPrayerTimesPath,
  type View,
} from '../src/router/routes';
import RouteLink from '../src/router/RouteLink';
import { storeLanguage } from '../src/i18n/detectLanguage';

interface Props {
  lang: Language;
  view: View;
  collection: Collection;
  chapterId?: number;
  categoryId?: string;
  /** Chapter layouts sit inside a scroll pane and need their own top border. */
  variant?: 'standalone' | 'reader';
}

const UI = {
  ru: {
    sections: 'Разделы',
    language: 'Язык',
    switchTo: 'English',
    about: 'О проекте',
  },
  en: {
    sections: 'Sections',
    language: 'Language',
    switchTo: 'Русский',
    about: 'About',
  },
} as const;

/**
 * The site's hub navigation, rendered on every page in both layouts.
 *
 * Everything here is a plain visible link in the document flow: the collection
 * indexes, the category index and the prayer-times page are only reachable
 * through it, and the language pair is only crawlable through it.
 */
const SiteFooter: React.FC<Props> = ({
  lang,
  view,
  collection,
  chapterId,
  categoryId,
  variant = 'standalone',
}) => {
  const t = I18N[lang];
  const u = UI[lang];
  const other: Language = lang === 'ru' ? 'en' : 'ru';
  const altPath = buildAlternatePath({ view, collection, chapterId, categoryId }, other);

  return (
    <footer
      className={`w-full border-t border-border text-sm ${
        variant === 'reader' ? 'mt-16' : 'mt-16'
      }`}
    >
      <nav aria-label={u.sections} className="max-w-3xl mx-auto px-5 py-8">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-neutral-600 dark:text-neutral-300">
          <li>
            <RouteLink href={buildHomePath(lang)} to={{ view: 'home' }} className="hover:underline">
              {t.home}
            </RouteLink>
          </li>
          {COLLECTIONS.map((c) => (
            <li key={c.id}>
              <RouteLink
                href={buildCollectionIndexPath(c.id, lang)}
                to={
                  c.id === 'sunna'
                    ? { view: 'home' }
                    : { view: 'collection-index', collection: c.id }
                }
                className="hover:underline"
              >
                {c.title[lang]}
              </RouteLink>
            </li>
          ))}
          <li>
            <RouteLink
              href={buildCategoriesIndexPath(lang)}
              to={{ view: 'categories-index' }}
              className="hover:underline"
            >
              {lang === 'ru' ? 'Категории' : 'Categories'}
            </RouteLink>
          </li>
          <li>
            <RouteLink
              href={buildPrayerTimesPath(lang)}
              to={{ view: 'prayer-times' }}
              className="hover:underline"
            >
              {t.prayerTimes}
            </RouteLink>
          </li>
          <li>
            <RouteLink
              href={buildAboutPath(lang)}
              to={{ view: 'about' }}
              className="hover:underline"
            >
              {u.about}
            </RouteLink>
          </li>
        </ul>

        {/* The RU↔EN pair as a real link, so the two language trees are joined
            by something a crawler can follow — hreflang states the relation
            but carries no link equity. */}
        <p className="mt-5 text-neutral-500 dark:text-neutral-400">
          <span className="mr-2">{u.language}:</span>
          <RouteLink
            href={altPath}
            to={{ lang: other }}
            onNavigate={() => storeLanguage(other)}
            className="underline underline-offset-4 hover:opacity-70"
          >
            {u.switchTo}
          </RouteLink>
        </p>
      </nav>
    </footer>
  );
};

export default SiteFooter;
