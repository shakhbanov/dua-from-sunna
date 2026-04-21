import React from 'react';
import { useRoute } from '../router/RouterContext';
import { CATEGORIES } from '../../data/categories';
import { MOCK_DATABASE } from '../../constants';
import { buildChapterPath, buildHomePath } from '../router/routes';
import type { Language } from '../../types';

interface CategoryPageProps {
  categoryId: string;
}

const UI = {
  ru: {
    home: 'Главная',
    categories: 'Категории',
    chaptersInCategory: 'Главы категории',
    open: 'Открыть',
    dua: 'дуа',
    relatedCategories: 'Похожие категории',
  },
  en: {
    home: 'Home',
    categories: 'Categories',
    chaptersInCategory: 'Chapters in this category',
    open: 'Open',
    dua: 'dua',
    relatedCategories: 'Related categories',
  },
} as const;

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId }) => {
  const { lang, navigate } = useRoute();
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return null;

  const t = UI[lang];
  const chaptersById = new Map(MOCK_DATABASE.map((c) => [c.id, c]));
  const chapters = cat.chapterIds
    .map((id) => chaptersById.get(id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const related = CATEGORIES.filter((c) => c.id !== cat.id).slice(0, 6);

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
        <span>{cat.title[lang]}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{cat.title[lang]}</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
        {cat.summary[lang]}
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
        {cat.intro[lang].map((para, i) => (
          <p key={i} className="mb-4 leading-relaxed text-neutral-800 dark:text-neutral-200">
            {para}
          </p>
        ))}
      </div>

      <section aria-labelledby="chapters-heading" className="mb-12">
        <h2
          id="chapters-heading"
          className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100"
        >
          {t.chaptersInCategory}
        </h2>
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800">
          {chapters.map((ch) => (
            <li key={ch.id} className="py-3">
              <a
                href={buildChapterPath(ch.id, lang)}
                onClick={(e) => go(e, ch.id)}
                className="flex items-baseline justify-between gap-4 hover:underline"
              >
                <span>
                  <span className="text-neutral-500 dark:text-neutral-400 mr-2">
                    {ch.id}.
                  </span>
                  <span className="font-medium">{ch.title[lang]}</span>
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">
                  {ch.duas.length} {t.dua}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="related-heading">
        <h2
          id="related-heading"
          className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100"
        >
          {t.relatedCategories}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {related.map((c) => (
            <li key={c.id}>
              <a
                href={lang === 'ru' ? `/${c.slug.ru}/` : `/en/${c.slug.en}/`}
                className="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
              >
                <div className="font-medium mb-1">{c.title[lang]}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                  {c.summary[lang]}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default CategoryPage;

// --- Categories index ---

export const CategoriesIndexPage: React.FC = () => {
  const { lang } = useRoute();
  const t = UI[lang];

  return (
    <main className="max-w-3xl mx-auto px-5 py-10 font-sans">
      <nav aria-label="breadcrumb" className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        <a href={buildHomePath(lang)} className="hover:underline">
          {t.home}
        </a>
        <span className="mx-2">/</span>
        <span>{t.categories}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
        {lang === 'ru' ? 'Категории дуа и азкаров' : 'Dua and adhkar categories'}
      </h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-10 leading-relaxed">
        {lang === 'ru'
          ? 'Тематические подборки дуа и азкаров из Сунны — утренние и вечерние азкары, дуа перед сном, дуа в путешествии, дуа от тревоги, дуа хаджа и другие группы глав, собранные для быстрого поиска по ситуации.'
          : 'Thematic collections of duas and adhkar from the Sunnah — morning and evening adhkar, before sleep, during travel, for anxiety, for hajj, and other chapter groups arranged for quick look-up by situation.'}
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <a
              href={lang === 'ru' ? `/${c.slug.ru}/` : `/en/${c.slug.en}/`}
              className="block p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
            >
              <div className="font-semibold mb-1">{c.title[lang]}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {c.chapterIds.length} {lang === 'ru' ? 'глав' : 'chapters'}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
                {c.summary[lang]}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
};
