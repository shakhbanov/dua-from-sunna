import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Collection, Language } from './types';
import {
    COLLECTIONS,
    DEFAULT_COLLECTION,
    defaultChapterIdFor,
    getCollectionChapters,
    type CollectionMatches,
} from './data/collections';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import Breadcrumbs from './components/Breadcrumbs';
import ChapterReader from './components/reader/ChapterReader';
import PrayerTimesPanel from './components/PrayerTimesPanel';
import SiteFooter from './components/SiteFooter';
import InstallPrompt from './components/InstallPrompt';
import { storeLanguage } from './src/i18n/detectLanguage';
import { I18N } from './src/i18n/strings';
import { usePageMeta } from './src/seo/usePageMeta';
import { DEFAULT_READER_SETTINGS, type ReaderSettings } from './src/features/reader/settings';
import { useRoute } from './src/router/RouterContext';
import CategoryPage, { CategoriesIndexPage } from './src/views/CategoryPage';
import CollectionIndexPage from './src/views/CollectionIndexPage';
import AboutPage from './src/views/AboutPage';

const MIN_SWIPE_DISTANCE = 50;

const App: React.FC = () => {
    // Route state (chapter id, language, view) is managed by RouterContext and
    // reflects the current URL. Home view is treated as chapter view (default ch.3).
    const route = useRoute();
    const language: Language = route.lang;
    const collection: Collection = route.collection ?? DEFAULT_COLLECTION;
    // Chapters of the collection the current route belongs to. The sidebar
    // list, search and prev/next navigation all stay inside this collection.
    const chapters = useMemo(() => getCollectionChapters(collection), [collection]);
    const currentChapterId: number = route.chapterId ?? defaultChapterIdFor(collection);
    const isPrayerTimes = route.view === 'prayer-times';

    const setCurrentChapterId = useCallback(
        (id: number) => route.navigate({ chapterId: id, view: 'chapter' }),
        [route]
    );

    const [activeDuaIndex, setActiveDuaIndex] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Navigation State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

    const [isDarkMode, setIsDarkMode] = useState(false);

    const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_READER_SETTINGS);

    const touchStartRef = useRef<{ x: number, y: number } | null>(null);

    // --- DERIVED ---
    const currentChapter = useMemo(() =>
        chapters.find(d => d.id === currentChapterId) || chapters[0],
        [chapters, currentChapterId]);

    const activeDua = useMemo(() => {
        if (!currentChapter.duas || currentChapter.duas.length === 0) return null;
        return currentChapter.duas[activeDuaIndex] || currentChapter.duas[0];
    }, [currentChapter, activeDuaIndex]);

    const filteredChapters = useMemo(() =>
        chapters.filter(d =>
            d.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.id.toString().includes(searchQuery)
        ),
        [chapters, searchQuery, language]);

    // When a query matches nothing here but does match another collection,
    // offer a jump instead of a dead end. Every other collection is offered,
    // not just one: with three of them, "the other collection" is no longer a
    // single thing, and picking one of the two silently hid the rest.
    const otherCollectionMatches = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];
        const hits: CollectionMatches[] = [];
        for (const c of COLLECTIONS) {
            if (c.id === collection) continue;
            const matches = c.chapters.filter(d =>
                d.title[language].toLowerCase().includes(q)
            ).length;
            if (matches > 0) hits.push({ collection: c, matches });
        }
        return hits;
    }, [collection, searchQuery, language]);

    // A finished recitation rolls on to the next dua of the chapter, if any.
    const handleDuaFinished = useCallback(() => {
        setActiveDuaIndex(prev =>
            prev < currentChapter.duas.length - 1 ? prev + 1 : prev);
    }, [currentChapter.duas.length]);

    // --- EFFECTS ---

    // A link like /dua-iz-korana/dua-iz-sury-al-anbiya/#2017-68 names one
    // supplication inside the sura. Category pages address duas that way, so
    // opening one must select it rather than the chapter's first.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const id = window.location.hash.slice(1);
        if (!id) return;
        const idx = currentChapter.duas.findIndex(d => d.id === id);
        if (idx > 0) setActiveDuaIndex(idx);
        // Chapter-scoped: re-runs when the reader moves to another chapter.
    }, [currentChapter]);

    // Theme Init
    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    usePageMeta({
        view: route.view,
        chapter: currentChapter,
        language,
        collection,
        isPrayerTimes,
    });

    // --- HANDLERS ---

    const toggleSetting = (key: keyof ReaderSettings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    const toggleSidebar = () => {
        if (window.innerWidth >= 1024) {
            setIsDesktopSidebarOpen(prev => !prev);
        } else {
            setIsMobileMenuOpen(prev => !prev);
        }
    };

    const closeSidebarOnItemClick = () => {
        if (window.innerWidth < 1024) {
            setIsMobileMenuOpen(false);
        }
    };

    // The sidebar rows are links now, so the router has already moved by the
    // time this runs: it only resets reader state and closes the drawer.
    const onChapterNavigate = () => {
        setActiveDuaIndex(0);
        closeSidebarOnItemClick();
    };

    const onCollectionChange = () => {
        setActiveDuaIndex(0);
        closeSidebarOnItemClick();
    };

    const switchToCollection = (id: Collection) => {
        route.navigate({ collection: id });
        onCollectionChange();
    };

    // --- TOUCH / SWIPE NAVIGATION ---

    const goToAdjacentDua = (direction: 1 | -1) => {
        const chapterIndex = chapters.findIndex(c => c.id === currentChapterId);
        const nextDuaIndex = activeDuaIndex + direction;

        // 1. Another dua inside the current chapter
        if (nextDuaIndex >= 0 && nextDuaIndex < currentChapter.duas.length) {
            setActiveDuaIndex(nextDuaIndex);
            return;
        }

        // 2. The neighbouring chapter, opened at the dua closest to the swipe
        const neighbour = chapters[chapterIndex + direction];
        if (!neighbour) return;
        setCurrentChapterId(neighbour.id);
        setActiveDuaIndex(direction === 1 ? 0 : Math.max(0, neighbour.duas.length - 1));
    };

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        };
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        const start = touchStartRef.current;
        touchStartRef.current = null;
        if (!start) return;

        const xDiff = start.x - e.changedTouches[0].clientX;
        const yDiff = start.y - e.changedTouches[0].clientY;

        // Horizontal swipe: longer than the minimum and longer than the vertical move.
        if (Math.abs(xDiff) <= Math.abs(yDiff) || Math.abs(xDiff) <= MIN_SWIPE_DISTANCE) return;
        goToAdjacentDua(xDiff > 0 ? 1 : -1);
    };

    // --- RENDER ---

    // Category routes render a lean standalone layout (no sidebar, no audio
    // player). They live alongside the chapter UI in the same SPA so client
    // navigation between categories ↔ chapters works without a full reload.
    if (route.view === 'category' && route.categoryId) {
        return <CategoryPage categoryId={route.categoryId} />;
    }
    if (route.view === 'categories-index') {
        return <CategoriesIndexPage />;
    }
    if (route.view === 'about') {
        return <AboutPage />;
    }
    if (route.view === 'collection-index') {
        return <CollectionIndexPage collection={collection} />;
    }

    return (
        <div className="flex h-[100dvh] overflow-hidden bg-background text-foreground font-sans transition-colors duration-300">

            {/* MOBILE OVERLAY — a button, so dismissing the sidebar by tapping
                outside it is reachable from the keyboard too. Inert while
                closed, so it never takes focus behind the page. */}
            <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label={I18N[language].closeMenu}
                inert={!isMobileMenuOpen}
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />

            <Sidebar
                language={language}
                collection={collection}
                chapters={filteredChapters}
                currentChapterId={currentChapterId}
                searchQuery={searchQuery}
                isMobileMenuOpen={isMobileMenuOpen}
                isDesktopSidebarOpen={isDesktopSidebarOpen}
                otherCollectionMatches={otherCollectionMatches}
                onSearchChange={setSearchQuery}
                onSelectLanguage={storeLanguage}
                onSelectChapter={onChapterNavigate}
                onCollectionChange={onCollectionChange}
                onSwitchToCollection={switchToCollection}
            />

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col relative w-full h-full min-w-0">
                <AppHeader
                    language={language}
                    theme={isDarkMode ? 'dark' : 'light'}
                    sidebarExpanded={isDesktopSidebarOpen}
                    settings={settings}
                    breadcrumb={
                        route.view === 'chapter' ? (
                            <Breadcrumbs
                                chapter={currentChapter}
                                collection={collection}
                                language={language}
                            />
                        ) : undefined
                    }
                    onToggleSidebar={toggleSidebar}
                    onToggleTheme={toggleTheme}
                    onOpenPrayerTimes={() => route.navigate({ view: 'prayer-times' })}
                    onToggleSetting={toggleSetting}
                />

                {/* Scroll Area with Swipe Handlers */}
                <div
                    className="flex-1 overflow-y-auto relative no-scrollbar"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Keyed by the dua: a new dua remounts the reader, which
                        resets playback instead of an effect clearing it. */}
                    <ChapterReader
                        key={activeDua?.id ?? `chapter-${currentChapter.id}`}
                        chapter={currentChapter}
                        activeDua={activeDua}
                        activeDuaIndex={activeDuaIndex}
                        language={language}
                        collection={collection}
                        settings={settings}
                        isPrimaryHeading={!isPrayerTimes}
                        onSelectDua={setActiveDuaIndex}
                        onDuaFinished={handleDuaFinished}
                    />

                    <SiteFooter lang={language} />
                </div>
            </main>

            {isPrayerTimes && (
                <PrayerTimesPanel
                    language={language}
                    onClose={() => route.navigate({ view: 'chapter' })}
                />
            )}

            {/* PWA install prompt (mobile/tablet only, hidden when already installed) */}
            <InstallPrompt language={language} />
        </div>
    );
};

export default App;
