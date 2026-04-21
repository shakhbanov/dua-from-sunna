import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Language } from '../../types';
import {
  buildChapterPath,
  buildHomePath,
  buildPrayerTimesPath,
  legacyQueryToPath,
  matchRoute,
  type Route,
  type View,
} from './routes';

interface RouterValue {
  path: string;
  lang: Language;
  view: View;
  chapterId?: number;
  categoryId?: string;
  navigate: (to: Partial<{ view: View; chapterId: number; categoryId: string; lang: Language }>) => void;
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
    (to: Partial<{ view: View; chapterId: number; lang: Language }>) => {
      if (typeof window === 'undefined') return;
      const next: Route = {
        ...route,
        ...(to.lang !== undefined && { lang: to.lang }),
        ...(to.view !== undefined && { view: to.view }),
        ...(to.chapterId !== undefined && { chapterId: to.chapterId }),
      };
      const lang = next.lang;
      let path: string;
      if (next.view === 'prayer-times') path = buildPrayerTimesPath(lang);
      else if (next.view === 'home') path = buildHomePath(lang);
      else if (next.chapterId) path = buildChapterPath(next.chapterId, lang);
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
      chapterId: route.chapterId,
      categoryId: route.categoryId,
      navigate,
    }),
    [route, navigate]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};
