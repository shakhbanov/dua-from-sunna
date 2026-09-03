import React from 'react';
import { useRoute } from '../router/RouterContext';
import { COLLECTIONS } from '../../data/collections';
import { buildHomePath } from '../router/routes';
import SiteFooter from '../../components/SiteFooter';
import type { Language } from '../../types';

const REPO = 'https://github.com/shakhbanov/dua-from-sunna';
const PROFILE = 'https://github.com/shakhbanov';

interface Counts {
  chapters: number;
  duas: number;
}

// Copy lives in a table, the way CategoryPage keeps its own — a page written as
// nested ru/en ternaries becomes unreadable long before it becomes wrong.
const COPY: Record<Language, {
  home: string;
  breadcrumb: string;
  heading: string;
  lead: (c: Counts) => string;
  compiler: { title: string; before: string; name: string; middle: string; repo: string; after: string };
  sources: { title: string; body: string; precedence: string };
  errors: { title: string; before: string; link: string; after: string };
  dates: { title: string; body: string };
}> = {
  ru: {
    home: 'Главная',
    breadcrumb: 'О проекте',
    heading: 'О проекте',
    lead: (c) =>
      `Цифровой сборник дуа и азкаров: ${c.chapters} глав и ${c.duas} мольб с арабским текстом, пословным переводом на русский и английский и указанием источника для каждой мольбы.`,
    compiler: {
      title: 'Кто ведёт проект',
      before: 'Составитель и разработчик — ',
      name: 'Зураб Шахбанов',
      middle:
        '. Проект некоммерческий, ведётся с открытым исходным кодом: весь текст сборника, разметка и код опубликованы в ',
      repo: 'репозитории на GitHub',
      after: ' — историю правок каждой главы можно прочитать целиком.',
    },
    sources: {
      title: 'Источники',
      body: 'Каждая мольба сопровождается ссылкой на источник, приведённой на самой странице. Для дуа из Сунны это сборник хадисов и номер (аль-Бухари, Муслим, Абу Дауд, ат-Тирмизи, Ибн Маджа, ан-Наса‘и, Ахмад). Для мольб из Корана — номер суры и аята.',
      precedence:
        'Первоисточник имеет приоритет над этим сайтом. Если приведённый здесь текст, перевод или ссылка расходятся с первоисточником, верен первоисточник, а страница подлежит исправлению.',
    },
    errors: {
      title: 'Как сообщить об ошибке',
      before:
        'Сообщения об ошибках в арабском тексте, переводе, огласовках или ссылке на источник принимаются публично — ',
      link: 'через issues репозитория',
      after:
        '. Укажите адрес страницы и в чём состоит расхождение. Исправления вносятся в исходный файл главы, поэтому каждое из них остаётся в открытой истории правок.',
    },
    dates: {
      title: 'Даты',
      body: 'Даты публикации и последнего изменения каждой главы берутся из истории git её исходного файла, а не проставляются вручную. Дата обновления меняется только тогда, когда действительно менялось содержимое главы.',
    },
  },
  en: {
    home: 'Home',
    breadcrumb: 'About',
    heading: 'About this project',
    lead: (c) =>
      `A digital collection of duas and adhkar: ${c.chapters} chapters and ${c.duas} supplications with the Arabic text, word-by-word Russian and English translation, and a source reference for every supplication.`,
    compiler: {
      title: 'Who maintains it',
      before: 'Compiled and developed by ',
      name: 'Zurab Shakhbanov',
      middle:
        '. The project is non-commercial and open source: the entire text of the collection, its markup and its code are published in the ',
      repo: 'GitHub repository',
      after: ' — the edit history of every chapter can be read in full.',
    },
    sources: {
      title: 'Sources',
      body: "Every supplication carries a source reference shown on the page itself. For duas from the Sunnah this is the hadith collection and number (al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa'i, Ahmad). For Quranic supplications it is the sura and ayah number.",
      precedence:
        'The primary source takes precedence over this site. Where the text, translation or reference given here disagrees with the primary source, the primary source is correct and the page is to be corrected.',
    },
    errors: {
      title: 'Reporting an error',
      before:
        'Reports of errors in the Arabic text, the translation, the diacritics or the source reference are accepted publicly — ',
      link: 'through the repository issues',
      after:
        '. Please give the page address and the nature of the discrepancy. Corrections are made to the chapter source file, so each one stays in the open edit history.',
    },
    dates: {
      title: 'Dates',
      body: 'The publication and modification dates of every chapter are taken from the git history of its source file rather than set by hand. The update date changes only when the chapter content actually changed.',
    },
  },
};

/**
 * Who stands behind the collection, where its text comes from, and how to
 * report an error.
 *
 * Everything stated here is verifiable from the repository or from the pages
 * themselves. No qualification is claimed that the project cannot show.
 */
const AboutPage: React.FC = () => {
  const { lang } = useRoute();
  const t = COPY[lang];
  const counts: Counts = {
    chapters: COLLECTIONS.reduce((n, c) => n + c.chapters.length, 0),
    duas: COLLECTIONS.reduce((n, c) => n + c.chapters.reduce((m, ch) => m + ch.duas.length, 0), 0),
  };

  return (
    <main className="max-w-3xl mx-auto px-5 py-10 font-sans">
      <nav aria-label="breadcrumb" className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        <a href={buildHomePath(lang)} className="hover:underline">
          {t.home}
        </a>
        <span className="mx-2">/</span>
        <span>{t.breadcrumb}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{t.heading}</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-10 leading-relaxed">
        {t.lead(counts)}
      </p>

      <Section title={t.compiler.title}>
        <p>
          {t.compiler.before}
          <a href={PROFILE} rel="me noopener" className="underline underline-offset-4">
            {t.compiler.name}
          </a>
          {t.compiler.middle}
          <a href={REPO} rel="noopener" className="underline underline-offset-4">
            {t.compiler.repo}
          </a>
          {t.compiler.after}
        </p>
      </Section>

      <Section title={t.sources.title}>
        <p>{t.sources.body}</p>
        <p>{t.sources.precedence}</p>
      </Section>

      <Section title={t.errors.title}>
        <p>
          {t.errors.before}
          <a href={`${REPO}/issues`} rel="noopener" className="underline underline-offset-4">
            {t.errors.link}
          </a>
          {t.errors.after}
        </p>
      </Section>

      <Section title={t.dates.title}>
        <p>{t.dates.body}</p>
      </Section>

      <SiteFooter lang={lang} view="about" collection="sunna" />
    </main>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">{title}</h2>
    <div className="space-y-3 leading-relaxed text-neutral-800 dark:text-neutral-200">{children}</div>
  </section>
);

export default AboutPage;
