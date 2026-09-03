import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Collection, Language } from '../../types';
import {
  DEFAULT_COLLECTION,
  collectionOfChapterId,
  defaultChapterIdFor,
} from '../../data/collections';
import {
  buildAboutPath,
  buildCategoriesIndexPath,
  buildCategoryPath,
  buildChapterPath,
  buildCollectionIndexPath,
  buildHomePath,
  buildPrayerTimesPath,
  legacyQueryToPath,
  matchRoute,
  type Route,
  type View,
} from './routes';

export type NavigateTarget = Partial<{
  view: View;
  chapterId: number;
  categoryId: string;
  lang: Language;
  collection: Collection;
}>;

interface RouterValue {
  path: string;
  lang: Language;
  view: View;
  collection: Collection;
  chapterId?: number;
  categoryId?: string;
  navigate: (to: NavigateTarget) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

export function useRoute(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRoute must be used inside RouterProvider');
  return ctx;
}

interface ProviderProps {
  initial: Route; // supplied by server entry on SSR, by client entry on hydrate
  children: React.ReactNode;
}

export const RouterProvider: React.FC<ProviderProps> = ({ initial, children }) => {
  const [route, setRoute] = useState<Route>(initial);

  // Client-side: sync route state with browser history.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // On first mount, check for a legacy ?chapter=N redirect.
    const legacyPath = legacyQueryToPath(window.location.search);
    if (legacyPath && legacyPath !== window.location.pathname) {
      window.history.replaceState({}, '', legacyPath);
      const matched = matchRoute(legacyPath);
      if (matched) setRoute(matched);
    }

    const onPop = () => {
      const matched = matchRoute(window.location.pathname);
      if (matched) setRoute(matched);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback(
    (to: NavigateTarget) => {
      if (typeof window === 'undefined') return;

      // A chapter always belongs to exactly one collection — never let an
      // explicit `collection` disagree with the chapter being opened.
      const collection: Collection =
        to.chapterId !== undefined
          ? collectionOfChapterId(to.chapterId)
          : to.collection ?? route.collection;

      // Switching collection is a switch of reading material, not a jump out
      // of the reader: it opens that collection's first chapter rather than
      // its index page. (The index pages still exist as prerendered landing
      // pages — they are reachable by URL, from the sitemap and from llms.txt.)
      const switchingCollection =
        to.collection !== undefined && to.collection !== route.collection;

      const view: View =
        to.view !== undefined
          ? to.view
          : to.chapterId !== undefined || switchingCollection
            ? 'chapter'
            : route.view;

      const next: Route = {
        ...route,
        collection,
        view,
        ...(to.lang !== undefined && { lang: to.lang }),
        ...(to.chapterId !== undefined && { chapterId: to.chapterId }),
        ...(to.categoryId !== undefined && { categoryId: to.categoryId }),
      };

      // Moving to a different collection drops the previous collection's
      // chapter — its id means nothing here — and opens that collection's
      // default chapter instead.
      if (switchingCollection && to.chapterId === undefined) {
        next.chapterId = defaultChapterIdFor(collection);
      }

      const lang = next.lang;
      let path: string;
      if (next.view === 'prayer-times') path = buildPrayerTimesPath(lang);
      else if (next.view === 'home') path = buildHomePath(lang);
      else if (next.view === 'collection-index') path = buildCollectionIndexPath(collection, lang);
      else if (next.view === 'categories-index') path = buildCategoriesIndexPath(lang);
      else if (next.view === 'about') path = buildAboutPath(lang);
      else if (next.view === 'category' && next.categoryId) path = buildCategoryPath(next.categoryId, lang);
      else if (next.chapterId) path = buildChapterPath(next.chapterId, lang, collection);
      else path = buildHomePath(lang);

      next.path = path;
      window.history.pushState({}, '', path);
      setRoute(next);
    },
    [route]
  );

  const value = useMemo<RouterValue>(
    () => ({
      path: route.path,
      lang: route.lang,
      view: route.view,
      collection: route.collection ?? DEFAULT_COLLECTION,
      chapterId: route.chapterId,
      categoryId: route.categoryId,
      navigate,
    }),
    [route, navigate]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};
