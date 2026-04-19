import type { Language } from '../../types';

interface MetaUpdate {
  title: string;
  description: string;
  lang: Language;
  path: string;
  chapterId?: number;
  chapterTitle?: string;
  chapterDescription?: string;
}

const SITE = 'https://dua.shakhbanov.org';

function setAttr(selector: string, attr: string, value: string): void {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    const tag = selector.startsWith('meta') ? 'meta' : selector.startsWith('link') ? 'link' : 'meta';
    el = document.createElement(tag);
    // Parse attributes from selector like `meta[name="description"]`
    const attrMatch = selector.match(/\[([^\]]+)\]/g);
    attrMatch?.forEach((a) => {
      const [k, v] = a.slice(1, -1).split('=');
      if (k && v) el!.setAttribute(k, v.replace(/^["']|["']$/g, ''));
    });
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setJsonLd(id: string, data: object): void {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function updateMetaTags(m: MetaUpdate): void {
  document.title = m.title;
  document.documentElement.setAttribute('lang', m.lang);

  const url = `${SITE}${m.path}`;
  const altRu = `${SITE}${m.path.replace(/([?&])lang=en/, '$1lang=ru') || '?lang=ru'}`;
  const altEn = `${SITE}${m.path.includes('lang=') ? m.path.replace(/([?&])lang=ru/, '$1lang=en') : (m.path.includes('?') ? `${m.path}&lang=en` : `${m.path}?lang=en`)}`;

  setAttr('meta[name="description"]', 'content', m.description);
  setAttr('link[rel="canonical"]', 'href', url);

  // hreflang alternates
  setAttr('link[rel="alternate"][hreflang="ru"]', 'href', altRu);
  setAttr('link[rel="alternate"][hreflang="en"]', 'href', altEn);
  setAttr('link[rel="alternate"][hreflang="x-default"]', 'href', altEn);

  // Open Graph
  setAttr('meta[property="og:title"]', 'content', m.title);
  setAttr('meta[property="og:description"]', 'content', m.description);
  setAttr('meta[property="og:url"]', 'content', url);
  setAttr('meta[property="og:locale"]', 'content', m.lang === 'ru' ? 'ru_RU' : 'en_US');

  // Twitter
  setAttr('meta[name="twitter:title"]', 'content', m.title);
  setAttr('meta[name="twitter:description"]', 'content', m.description);

  // Structured data for article/chapter
  if (m.chapterId && m.chapterTitle) {
    setJsonLd('ld-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: m.chapterTitle,
      description: m.chapterDescription ?? m.description,
      inLanguage: m.lang,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: { '@type': 'Organization', name: 'dua.shakhbanov.org' },
      publisher: {
        '@type': 'Organization',
        name: m.lang === 'ru' ? 'Дуа' : 'Dua',
        logo: { '@type': 'ImageObject', url: `${SITE}/icons/icon-512.png` },
      },
      isPartOf: {
        '@type': 'Book',
        name: 'Крепость мусульманина',
        alternateName: ['Hisn al-Muslim', 'Fortress of the Muslim'],
      },
    });
    setJsonLd('ld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: m.lang === 'ru' ? 'Главная' : 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: m.chapterTitle, item: url },
      ],
    });
  } else {
    // Remove article schema on non-chapter views
    document.getElementById('ld-article')?.remove();
    document.getElementById('ld-breadcrumb')?.remove();
  }
}
