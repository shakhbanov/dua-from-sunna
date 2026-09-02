import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import { RouterProvider } from './router/RouterContext';
import { matchRoute, legacyQueryToPath, type Route } from './router/routes';
import { DEFAULT_COLLECTION, defaultChapterIdFor } from '../data/collections';
import { detectLanguage } from './i18n/detectLanguage';
import './index.css';

const DEFAULT_CHAPTER_ID = 3;

function resolveInitialRoute(): Route {
  // 1. Exact match on current pathname (prerendered URLs).
  const matched = matchRoute(window.location.pathname);
  if (matched) {
    return { ...matched, chapterId: matched.chapterId ?? defaultChapterIdFor(matched.collection) };
  }

  // 2. Legacy ?chapter=N URL — pick the corresponding clean path.
  const legacy = legacyQueryToPath(window.location.search);
  if (legacy) {
    const m = matchRoute(legacy);
    if (m) return { ...m, chapterId: m.chapterId ?? defaultChapterIdFor(m.collection) };
  }

  // 3. Fallback: language-detected home.
  const lang = detectLanguage();
  return {
    path: lang === 'ru' ? '/' : '/en/',
    lang,
    view: 'home',
    collection: DEFAULT_COLLECTION,
    chapterId: DEFAULT_CHAPTER_ID,
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const initial = resolveInitialRoute();

const tree = (
  <React.StrictMode>
    <RouterProvider initial={initial}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);

// Prerendered HTML is present — hydrate. Otherwise (dev, or a route that
// slipped past the prerender), mount fresh with createRoot.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, tree);
} else {
  ReactDOM.createRoot(rootElement).render(tree);
}
