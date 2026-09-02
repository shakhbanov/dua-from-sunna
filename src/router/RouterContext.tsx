import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Collection, Language } from '../../types';
import { DEFAULT_COLLECTION, collectionOfChapterId } from '../../data/collections';
import {
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

    // Also pick up the sessionStorage stash written by public/404.html.
    try {
      const stashed = sessionStorage.getItem('spa-redirect');
      if (stashed) {
        sessionStorage.removeItem('spa-redirect');
        const stashedPath = stashed.split('?')[0];
        const matched = matchRoute(stashedPath);
        if (matched) {
          window.history.replaceState({}, '', stashed);
          setRoute(matched);
        }
      }
    } catch {
      /* ignore */
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

      // Switching collection without naming a chapter lands on that
      // collection's index page (the home page for the default collection).
      const view: View =
        to.view !== undefined
          ? to.view
          : to.chapterId !== undefined
            ? 'chapter'
            : to.collection !== undefined && to.collection !== route.collection
              ? to.collection === DEFAULT_COLLECTION
                ? 'home'
                : 'collection-index'
              : route.view;

      const next: Route = {
        ...route,
        collection,
        view,
        ...(to.lang !== undefined && { lang: to.lang }),
        ...(to.chapterId !== undefined && { chapterId: to.chapterId }),
      };

      // Moving to a different collection drops the previous collection's
      // chapter — its id means nothing here.
      if (collection !== route.collection && to.chapterId === undefined) {
        next.chapterId = undefined;
      }

      const lang = next.lang;
      let path: string;
      if (next.view === 'prayer-times') path = buildPrayerTimesPath(lang);
      else if (next.view === 'home') path = buildHomePath(lang);
      else if (next.view === 'collection-index') path = buildCollectionIndexPath(collection, lang);
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
