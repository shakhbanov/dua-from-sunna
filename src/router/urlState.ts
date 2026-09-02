import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../../types';

export type View = 'chapter' | 'prayer-times';

export interface UrlState {
  chapterId: number;
  lang: Language;
  view: View;
  q: string;
}

const DEFAULT: UrlState = {
  chapterId: 3,
  lang: 'ru',
  view: 'chapter',
  q: '',
};

function parseUrl(initialLang: Language): UrlState {
  try {
    const params = new URLSearchParams(location.search);
    const chapterRaw = params.get('chapter');
    const langRaw = params.get('lang') as Language | null;
    const viewRaw = params.get('view') as View | null;
    const q = params.get('q') ?? '';

    const chapterId = chapterRaw ? parseInt(chapterRaw, 10) : DEFAULT.chapterId;
    const lang: Language = langRaw === 'ru' || langRaw === 'en' ? langRaw : initialLang;
    const view: View = viewRaw === 'prayer-times' ? 'prayer-times' : 'chapter';

    return {
      chapterId: Number.isFinite(chapterId) && chapterId > 0 ? chapterId : DEFAULT.chapterId,
      lang,
      view,
      q,
    };
  } catch {
    return { ...DEFAULT, lang: initialLang };
  }
}

function toSearch(s: UrlState): string {
  const params = new URLSearchParams();
  if (s.chapterId && s.chapterId !== DEFAULT.chapterId) params.set('chapter', String(s.chapterId));
  if (s.lang && s.lang !== 'ru') params.set('lang', s.lang);
  if (s.view !== 'chapter') params.set('view', s.view);
  if (s.q) params.set('q', s.q);
  const str = params.toString();
  return str ? `?${str}` : '';
}

export function useUrlState(initialLang: Language): [UrlState, (patch: Partial<UrlState>, replace?: boolean) => void] {
  const [state, setState] = useState<UrlState>(() => parseUrl(initialLang));
  // Mirrors `state` so `update` can merge a patch onto the latest value without
  // reading it inside the setter — history.pushState is a side effect and React
  // may replay a state updater, which would push the same entry twice.
  const stateRef = useRef(state);

  // Sync state → URL
  const update = useCallback((patch: Partial<UrlState>, replace = false) => {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;

    const search = toSearch(next);
    const url = `${location.pathname}${search}${location.hash}`;
    if (replace) history.replaceState(null, '', url);
    else history.pushState(null, '', url);

    setState(next);
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const onPop = () => {
      const parsed = parseUrl(initialLang);
      stateRef.current = parsed;
      setState(parsed);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [initialLang]);

  return [state, update];
}
