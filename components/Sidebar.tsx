import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import type { ChapterData, Collection, Language } from '../types';
import { COLLECTIONS, defaultChapterIdFor, type CollectionMeta } from '../data/collections';
import { I18N } from '../src/i18n/strings';
import { buildAlternatePath, buildChapterPath } from '../src/router/routes';
import { useRoute } from '../src/router/RouterContext';
import RouteLink from '../src/router/RouteLink';
import CastleIcon from './CastleIcon';

interface Props {
  language: Language;
  collection: Collection;
  chapters: ChapterData[];
  currentChapterId: number;
  searchQuery: string;
  isMobileMenuOpen: boolean;
  isDesktopSidebarOpen: boolean;
  otherCollection: CollectionMeta;
  otherCollectionMatches: number;
  onSearchChange: (query: string) => void;
  /** Runs after the router has moved to the other language. */
  onSelectLanguage: (language: Language) => void;
  /** Runs after the router has opened a chapter — resets the dua and closes the drawer. */
  onSelectChapter: (chapterId: number) => void;
  onCollectionChange: () => void;
  onSwitchToOtherCollection: () => void;
}

const Sidebar: React.FC<Props> = ({
  language,
  collection,
  chapters,
  currentChapterId,
  searchQuery,
  isMobileMenuOpen,
  isDesktopSidebarOpen,
  otherCollection,
  otherCollectionMatches,
  onSearchChange,
  onSelectLanguage,
  onSelectChapter,
  onCollectionChange,
  onSwitchToOtherCollection,
}) => {
  const t = I18N[language];
  const route = useRoute();

  return (
    <aside className={`
        fixed lg:static inset-y-0 left-0 z-[70] bg-background border-r border-border
        transition-[width,transform,opacity] duration-300 ease-in-out flex flex-col overflow-hidden

        /* Mobile (Default) Styles */
        w-[280px] dark:shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}

        /* Desktop Styles */
        lg:translate-x-0 lg:shadow-none
        ${isDesktopSidebarOpen ? 'lg:w-[320px] lg:opacity-100' : 'lg:w-0 lg:opacity-0 lg:border-r-0'}
      `}>
      {/* Inner container to hold width constant while parent width animates */}
      <div className="w-[280px] lg:w-[320px] h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 pb-4">
          {/* Centered Logo & Title */}
          <div className="flex flex-col items-center justify-center mb-6 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center shrink-0 shadow-md">
              <CastleIcon size={26} />
            </div>
            <span className="font-calligraphy text-3xl font-bold tracking-normal text-foreground text-center">
              دُعَاءٌ مِنَ السُّنَّةِ
            </span>
          </div>

          {/* Language and source share one row: the two controls are the same
              widget, but their labels are not the same length, so the language
              pill shrinks to its two-letter content and the source pill takes
              the rest. Saves a full row of sidebar height. */}
          <div className="flex items-stretch gap-2 mb-4">
            {/* Language — compact */}
            <div className="shrink-0 flex p-1 bg-surface rounded-lg">
              {(['ru', 'en'] as Language[]).map(l => (
                <RouteLink
                  key={l}
                  href={buildAlternatePath(route, l)}
                  to={{ lang: l }}
                  onNavigate={() => onSelectLanguage(l)}
                  aria-label={l === 'ru' ? 'Русский' : 'English'}
                  aria-current={language === l ? 'page' : undefined}
                  className={`px-2.5 text-[11px] font-bold uppercase py-1.5 rounded-md transition-colors ${language === l
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                    }`}
                >
                  {l}
                </RouteLink>
              ))}
            </div>

            {/* Source — takes the remaining width. Links, so the collections
                stay crawlable. */}
            <div className="flex-1 grid grid-cols-2 p-1 bg-surface rounded-lg min-w-0">
              {COLLECTIONS.map(c => (
                <RouteLink
                  key={c.id}
                  href={buildChapterPath(defaultChapterIdFor(c.id), language, c.id)}
                  to={{ collection: c.id }}
                  onNavigate={onCollectionChange}
                  aria-current={c.id === collection ? 'page' : undefined}
                  className={`truncate text-center text-[11px] font-bold uppercase py-1.5 rounded-md transition-colors ${collection === c.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                    }`}
                >
                  {c.shortTitle[language]}
                </RouteLink>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-foreground transition-colors" aria-hidden="true" />
            <input
              type="search"
              placeholder={t.searchPlaceholder}
              aria-label={t.search}
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full bg-surface border-none rounded-xl py-2 pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:ring-1 focus:ring-foreground/20 transition-shadow"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar">
          {chapters.length === 0 ? (
            <div className="text-center py-10 px-3">
              <p className="text-neutral-400 text-sm">{t.nothingFound}</p>
              {otherCollectionMatches > 0 && (
                <button
                  onClick={onSwitchToOtherCollection}
                  className="mt-3 text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  {otherCollection.title[language]} — {otherCollectionMatches}
                </button>
              )}
            </div>
          ) : (
            chapters.map(chapter => (
              <ChapterRow
                key={chapter.id}
                chapter={chapter}
                language={language}
                collection={collection}
                isCurrent={currentChapterId === chapter.id}
                onSelect={onSelectChapter}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

interface RowProps {
  chapter: ChapterData;
  language: Language;
  collection: Collection;
  isCurrent: boolean;
  onSelect: (chapterId: number) => void;
}

const ChapterRow: React.FC<RowProps> = ({ chapter, language, collection, isCurrent, onSelect }) => {
  // ID 1 = Preface (no number). ID 2 = Virtues (no number). ID 3 = Chapter 1...
  // Quranic chapters are thematic groups, not numbered book chapters.
  const isNumbered = collection === 'sunna' && chapter.id > 2;

  return (
    <RouteLink
      href={buildChapterPath(chapter.id, language, collection)}
      to={{ chapterId: chapter.id }}
      onNavigate={() => onSelect(chapter.id)}
      aria-current={isCurrent ? 'page' : undefined}
      className={`
        w-full group flex items-center justify-between p-3 mb-1 rounded-xl text-left transition-colors duration-200
        ${isCurrent
          ? 'bg-foreground text-background shadow-md'
          : 'text-neutral-600 dark:text-neutral-400 hover:bg-surface hover:text-foreground'
        }
      `}
    >
      <div className="flex items-center min-w-0 pr-2">
        {isNumbered && (
          <span className={`text-xs font-mono w-6 text-left shrink-0 mr-1 ${isCurrent ? 'text-background/70' : 'text-neutral-400 group-hover:text-neutral-500'}`}>
            {chapter.id - 2}
          </span>
        )}
        <span className="font-medium text-sm truncate">{chapter.title[language]}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Count badge — every chapter that holds duas, in either collection. */}
        {chapter.duas.length > 0 && (
          <span className={`text-[10px] min-w-[18px] text-center px-1 py-0.5 rounded-md ${isCurrent ? 'bg-background/20' : 'bg-surface text-neutral-500'}`}>
            {chapter.duas.length}
          </span>
        )}
        {isCurrent && <ChevronRight size={14} />}
      </div>
    </RouteLink>
  );
};

export default Sidebar;
