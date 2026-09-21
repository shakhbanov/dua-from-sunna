import React from 'react';
import type { Language } from '../types';
import { I18N } from '../src/i18n/strings';
import {
  buildAboutPath,
  buildCategoriesIndexPath,
  buildPrayerTimesPath,
} from '../src/router/routes';
import RouteLink from '../src/router/RouteLink';

interface Props {
  lang: Language;
}

const UI = {
  ru: {
    sections: 'Разделы',
    categories: 'Категории',
    about: 'О проекте',
    support: 'Поддержать проект',
  },
  en: {
    sections: 'Sections',
    categories: 'Categories',
    about: 'About',
    support: 'Support the project',
  },
} as const;

const SUPPORT_URL = 'https://pay.cloudtips.ru/p/9589ace3';

/**
 * The site's secondary navigation, rendered on every page in both layouts.
 *
 * The category index, the prayer-times page and the About page have no other
 * inbound link, so these three are what keeps them out of the orphan list.
 * The collections and the language pair are reached from the header breadcrumb
 * and the sidebar switcher instead. The donation link leaves the site, so it is
 * a plain anchor rather than a RouteLink, and nofollowed: it sits on every page.
 */
const SiteFooter: React.FC<Props> = ({ lang }) => {
  const t = I18N[lang];
  const u = UI[lang];

  return (
    <footer className="w-full border-t border-border text-sm mt-16">
      <nav aria-label={u.sections} className="max-w-3xl mx-auto px-5 py-8">
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-neutral-600 dark:text-neutral-300">
          <li>
            <RouteLink
              href={buildCategoriesIndexPath(lang)}
              to={{ view: 'categories-index' }}
              className="hover:underline"
            >
              {u.categories}
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
            <RouteLink href={buildAboutPath(lang)} to={{ view: 'about' }} className="hover:underline">
              {u.about}
            </RouteLink>
          </li>
          <li>
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:underline"
            >
              {u.support}
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default SiteFooter;
