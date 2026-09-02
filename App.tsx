import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { APP_TITLE } from './constants';
import { Collection, Language } from './types';
import {
    COLLECTIONS,
    DEFAULT_COLLECTION,
    defaultChapterIdFor,
    getCollection,
    getCollectionChapters,
} from './data/collections';
import Player from './components/Player';
import WordGrid from './components/WordGrid';
import PrayerTimesPanel from './components/PrayerTimesPanel';
import InstallPrompt from './components/InstallPrompt';
import { Menu, Search, Moon, Sun, ChevronRight, ChevronLeft, Settings, Type, Highlighter, BookOpen, Clock, ExternalLink } from 'lucide-react';
import { storeLanguage } from './src/i18n/detectLanguage';
import { I18N } from './src/i18n/strings';
import { updateMetaTags } from './src/seo/updateMetaTags';
import { trackPageView } from './src/analytics/yandexMetrika';
import { useRoute } from './src/router/RouterContext';
import { buildChapterPath, buildCollectionIndexPath, buildPrayerTimesPath } from './src/router/routes';
import CategoryPage, { CategoriesIndexPage } from './src/views/CategoryPage';
import CollectionIndexPage from './src/views/CollectionIndexPage';

// --- CUSTOM ICONS ---

const CustomCastleIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="m111 208.5h-47v63h47zm-15 48h-17v-33h17z" />
        <path d="m168 327.5h47v-47h-47zm15-32h17v17h-17z" />
        <path d="m232 327.5h47v-47h-47zm15-32h17v17h-17z" />
        <path d="m343 280.5h-47v47h47zm-15 32h-17v-17h17z" />
        <path d="m447 208.5h-47v63h47zm-15 48h-17v-33h17z" />
        <path d="m487 424.5v-233h24v-119h-47v40h-17v-40h-47v40h-17v-40h-47v119h24v17h-32v40h-17v-40h-47v40h-17v-40h-47v40h-17v-40h-32v-17h24v-119h-47v40h-17v-40h-47v40h-17v-40h-47v119h24v40h15v-40h97v233h-97v-49h25v16h15v-16h17v-15h-25v-17h9v-15h-41v-81h-15v177h-24v15h416v-15h-41v-233h97v145h-48v15h16v17h-24v15h16v16h15v-16h25v41h-40v15h80v-15zm-472-337h17v40h47v-40h17v40h47v-40h17v89h-145zm41 256v17h-17v-17zm304 49h-17v-17h17zm-209-16v-17h17v17zm121 48h-33v-33c0-9.098 7.402-16.5 16.5-16.5s16.5 7.402 16.5 16.5zm15 0v-33c0-17.369-14.131-31.5-31.5-31.5s-31.5 14.131-31.5 31.5v33h-73v-33h25v16h15v-16h17v-15h-25v-17h17v-15h-49v-121h17v40h47v-40h17v40h47v-40h17v40h47v-40h17v137h-25v-17h-15v17h-8v15h16v17h-16v15h48v17zm64-337h17v40h47v-40h17v40h47v-40h17v89h-145zm104 281v-17h17v17z" />
        <path d="m48 144.5h16v15h-16z" />
        <path d="m80 144.5h16v15h-16z" />
        <path d="m112 144.5h16v15h-16z" />
        <path d="m384 144.5h16v15h-16z" />
        <path d="m416 144.5h16v15h-16z" />
        <path d="m448 144.5h16v15h-16z" />
    </svg>
);

// --- DESCRIPTION RENDERER ---

// Deep link to the ayah on quran.com, e.g. { sura: 2, ayahFrom: 201 } -> /2/201.
const quranComUrl = (ref: { sura: number; ayahFrom: number; ayahTo?: number }): string =>
    `https://quran.com/${ref.sura}/${ref.ayahFrom}${ref.ayahTo ? `-${ref.ayahTo}` : ''}`;

const FOOTNOTE_DIGITS = '¹²³⁴⁵⁶⁷⁸⁹⁰';
const FOOTNOTE_REGEX = new RegExp(`^([${FOOTNOTE_DIGITS}]+)\\s+([\\s\\S]+)$`);

const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
            ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
            : <React.Fragment key={i}>{part}</React.Fragment>
    );
};

const renderDescription = (description: string): React.ReactNode => {
    const paragraphs = description.split('\n\n');
    let firstFootnoteSeen = false;
    return paragraphs.flatMap((para, i) => {
        const trimmed = para.trim();
        if (!trimmed || trimmed === '---') return [];

        const footnoteMatch = trimmed.match(FOOTNOTE_REGEX);
        if (footnoteMatch) {
            const [, marker, rest] = footnoteMatch;
            const showRule = !firstFootnoteSeen;
            firstFootnoteSeen = true;
            return [(
                <div key={i} className="text-left">
                    {showRule && <div className="w-28 border-t border-neutral-300 dark:border-neutral-500 mb-3 mt-4" />}
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 font-serif leading-relaxed">
                        <sup className="align-top text-xs mr-1 text-neutral-500 dark:text-neutral-300">{marker}</sup>{renderInline(rest)}
                    </p>
                </div>
            )];
        }

        const isBasmala = trimmed.includes('بسم الله');
        const isTranslation = trimmed.startsWith('_') && trimmed.endsWith('_');
        const cleanPara = isTranslation ? trimmed.slice(1, -1) : trimmed;

        return [(
            <p
                key={i}
                className={`
                    ${(isBasmala || isTranslation) ? 'text-center' : 'text-justify'}
                    ${isTranslation ? 'italic' : ''}
                    ${isBasmala ? 'text-2xl md:text-3xl mb-2' : ''}
                `}
            >
                {renderInline(cleanPara)}
            </p>
        )];
    });
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
    // --- STATE ---
    // Route state (chapter id, language, view) is managed by RouterContext and
    // reflects the current URL. Home view is treated as chapter view (default ch.3).
    const route = useRoute();
    const language: Language = route.lang;
    const collection: Collection = route.collection ?? DEFAULT_COLLECTION;
    // Chapters of the collection the current route belongs to. The sidebar
    // list, search and prev/next navigation all stay inside this collection.
    const chapters = useMemo(() => getCollectionChapters(collection), [collection]);
    const currentChapterId: number = route.chapterId ?? defaultChapterIdFor(collection);
    const currentView: 'chapter' | 'prayer-times' =
        route.view === 'prayer-times' ? 'prayer-times' : 'chapter';

    const setCurrentChapterId = useCallback(
        (id: number) => route.navigate({ chapterId: id, view: 'chapter' }),
        [route]
    );
    const setCurrentView = useCallback(
        (v: 'chapter' | 'prayer-times') => route.navigate({ view: v }),
        [route]
    );
    const setLanguage = useCallback(
        (l: Language) => {
            storeLanguage(l);
            route.navigate({ lang: l });
        },
        [route]
    );
    const setCollection = useCallback(
        (c: Collection) => route.navigate({ collection: c }),
        [route]
    );

    const [activeDuaIndex, setActiveDuaIndex] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Navigation State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Display Filters
    const [showTranslation, setShowTranslation] = useState(true);
    const [enableHighlight, setEnableHighlight] = useState(true);

    // Audio State
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [volume, setVolume] = useState(1.0);

    // Touch State
    const touchStartRef = useRef<{ x: number, y: number } | null>(null);
    const minSwipeDistance = 50;

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

    // When a query matches nothing here but does match the other collection,
    // offer a jump instead of a dead end.
    const otherCollection = useMemo(
        () => COLLECTIONS.find(c => c.id !== collection)!,
        [collection]);

    const otherCollectionMatches = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return 0;
        return otherCollection.chapters.filter(d =>
            d.title[language].toLowerCase().includes(q)
        ).length;
    }, [otherCollection, searchQuery, language]);

    // --- EFFECTS ---

    // Theme Init
    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    // URL sync and popstate handling are owned by RouterContext now.

    // Update SEO meta tags when chapter/language changes
    const chapterForMeta = currentChapter;

    useEffect(() => {
        // Category and collection-index pages get their tags from the SSR
        // head; overwriting them here with chapter meta would be wrong.
        if (route.view === 'category' || route.view === 'categories-index') return;

        const collectionMeta = getCollection(collection);
        const isCollectionIndex = route.view === 'collection-index';

        const title = isCollectionIndex
            ? `${collectionMeta.title[language]} — ${APP_TITLE[language]}`
            : currentView === 'prayer-times'
                ? `${I18N[language].prayerTimes} — ${APP_TITLE[language]}`
                : `${chapterForMeta.title[language]} — ${APP_TITLE[language]}`;

        const descRaw = isCollectionIndex
            ? collectionMeta.summary[language]
            : chapterForMeta.description?.[language]
            ?? chapterForMeta.duas[0]?.fullTranslation?.[language]
            ?? (language === 'ru' ? 'Дуа и азкары из Сунны с аудио, пословным переводом и пояснениями.' : 'Duas and adhkars from the Sunnah with audio, word-by-word translation, and commentary.');
        const description = descRaw.replace(/\*\*/g, '').replace(/\s+/g, ' ').slice(0, 180).trim();

        const path = isCollectionIndex
            ? buildCollectionIndexPath(collection, language)
            : currentView === 'prayer-times'
                ? buildPrayerTimesPath(language)
                : buildChapterPath(chapterForMeta.id, language, collection);

        updateMetaTags({
            title,
            description,
            lang: language,
            path,
            chapterId: route.view === 'chapter' ? chapterForMeta.id : undefined,
            chapterTitle: route.view === 'chapter' ? chapterForMeta.title[language] : undefined,
            chapterDescription: route.view === 'chapter' ? description : undefined,
            chapter: route.view === 'chapter' ? chapterForMeta : undefined,
        });

        // SPA hit to Yandex.Metrika on chapter/view/lang change
        trackPageView(typeof window !== 'undefined' ? window.location.href : path, title);
    }, [chapterForMeta, language, currentView, collection, route.view]);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    // Audio Source Update
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        setIsPlaying(false);
        setCurrentTime(0);

        if (activeDua?.audioUrl) {
            audio.src = activeDua.audioUrl;
            audio.load();
            // Restore volume/speed after load
            audio.playbackRate = playbackSpeed;
            audio.volume = volume;
        } else {
            audio.pause();
            audio.removeAttribute('src');
        }
    }, [activeDua]);

    // Handle auto-advance
    const handleEnded = useCallback(() => {
        if (activeDua && activeDuaIndex < currentChapter.duas.length - 1) {
            // Go to next dua
            setActiveDuaIndex(prev => prev + 1);
            setIsPlaying(false);
        } else {
            setIsPlaying(false);
            setCurrentTime(0);
        }
    }, [activeDua, activeDuaIndex, currentChapter.duas.length]);

    // Audio Event Listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [handleEnded]);

    // Sync Speed/Volume
    useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = playbackSpeed; }, [playbackSpeed]);
    useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

    // --- HANDLERS ---

    const togglePlay = useCallback(() => {
        if (!audioRef.current || !activeDua?.audioUrl) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play().catch(console.error);
        setIsPlaying(!isPlaying);
    }, [isPlaying, activeDua]);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const skip = useCallback((seconds: number) => {
        if (audioRef.current) {
            const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    }, [duration]);

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

    // --- TOUCH / SWIPE NAVIGATION ---

    const handleNext = () => {
        const currentChapterIndex = chapters.findIndex(c => c.id === currentChapterId);
        const currentChapterData = chapters[currentChapterIndex];

        // 1. Next Dua in current chapter
        if (currentChapterData.duas && activeDuaIndex < currentChapterData.duas.length - 1) {
            setActiveDuaIndex(prev => prev + 1);
            return;
        }

        // 2. Next Chapter
        if (currentChapterIndex < chapters.length - 1) {
            const nextChapter = chapters[currentChapterIndex + 1];
            setCurrentChapterId(nextChapter.id);
            setActiveDuaIndex(0);
        }
    };

    const handlePrev = () => {
        const currentChapterIndex = chapters.findIndex(c => c.id === currentChapterId);

        // 1. Prev Dua in current chapter
        if (activeDuaIndex > 0) {
            setActiveDuaIndex(prev => prev - 1);
            return;
        }

        // 2. Prev Chapter
        if (currentChapterIndex > 0) {
            const prevChapter = chapters[currentChapterIndex - 1];
            setCurrentChapterId(prevChapter.id);
            // Go to last dua of previous chapter
            const lastDuaIndex = prevChapter.duas.length > 0 ? prevChapter.duas.length - 1 : 0;
            setActiveDuaIndex(lastDuaIndex);
        }
    };

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        };
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartRef.current) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const xDiff = touchStartRef.current.x - touchEnd.x;
        const yDiff = touchStartRef.current.y - touchEnd.y;

        // Detect Horizontal Swipe (Must be greater than min distance and greater than vertical movement)
        if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > minSwipeDistance) {
            if (xDiff > 0) {
                handleNext(); // Swipe Left (Finger moves Right to Left)
            } else {
                handlePrev(); // Swipe Right (Finger moves Left to Right)
            }
        }
        touchStartRef.current = null;
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
    if (route.view === 'collection-index') {
        return <CollectionIndexPage collection={collection} />;
    }

    return (
        <div className="flex h-[100dvh] overflow-hidden bg-background text-foreground font-sans transition-colors duration-300">

            {/* MOBILE OVERLAY */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* SIDEBAR */}
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
                                <CustomCastleIcon size={26} />
                            </div>
                            <h1 className="font-calligraphy text-3xl font-bold tracking-normal text-foreground text-center">
                                دُعَاءٌ مِنَ السُّنَّةِ
                            </h1>
                        </div>

                        {/* Language Segmented Control */}
                        <div className="grid grid-cols-2 p-1 mb-4 bg-surface rounded-lg">
                            {(['ru', 'en'] as Language[]).map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLanguage(l)}
                                    className={`text-[11px] font-bold uppercase py-1.5 rounded-md transition-all ${language === l
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        {/* Source Segmented Control — same control as the
                            language switcher above. Rendered as links so the
                            collections stay crawlable. */}
                        <div className="grid grid-cols-2 p-1 mb-4 bg-surface rounded-lg">
                            {COLLECTIONS.map(c => (
                                <a
                                    key={c.id}
                                    href={buildChapterPath(defaultChapterIdFor(c.id), language, c.id)}
                                    onClick={e => {
                                        e.preventDefault();
                                        setCollection(c.id);
                                        setActiveDuaIndex(0);
                                        closeSidebarOnItemClick();
                                    }}
                                    aria-current={c.id === collection ? 'page' : undefined}
                                    className={`text-center text-[11px] font-bold uppercase py-1.5 rounded-md transition-all ${collection === c.id
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                                        }`}
                                >
                                    {c.shortTitle[language]}
                                </a>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-foreground transition-colors" />
                            <input
                                type="text"
                                placeholder={I18N[language].searchPlaceholder}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-surface border-none rounded-xl py-2 pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:ring-1 focus:ring-foreground/20 transition-all"
                            />
                        </div>

                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar">
                        {filteredChapters.length === 0 ? (
                            <div className="text-center py-10 px-3">
                                <p className="text-neutral-400 text-sm">{I18N[language].nothingFound}</p>
                                {otherCollectionMatches > 0 && (
                                    <button
                                        onClick={() => {
                                            setCollection(otherCollection.id);
                                            closeSidebarOnItemClick();
                                        }}
                                        className="mt-3 text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                                    >
                                        {otherCollection.title[language]} — {otherCollectionMatches}
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredChapters.map(chapter => {
                                // Logic: ID 1 = Preface (no number). ID 2 = Virtues (no number). ID 3 = Chapter 1...
                                // Quranic chapters are thematic groups, not numbered book chapters.
                                const isNumbered = collection === 'sunna' && chapter.id > 2;
                                const displayNumber = isNumbered ? chapter.id - 2 : null;

                                return (
                                    <button
                                        key={chapter.id}
                                        onClick={() => {
                                            setCurrentChapterId(chapter.id);
                                            setActiveDuaIndex(0); // Explicitly reset dua index on chapter change
                                            closeSidebarOnItemClick();
                                        }}
                                        className={`
                                w-full group flex items-center justify-between p-3 mb-1 rounded-xl text-left transition-all duration-200
                                ${currentChapterId === chapter.id
                                                ? 'bg-foreground text-background shadow-md'
                                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-surface hover:text-foreground'
                                            }
                            `}
                                    >
                                        <div className="flex items-center min-w-0 pr-2">
                                            {/* Numbering */}
                                            {isNumbered && (
                                                <span className={`text-xs font-mono w-6 text-left shrink-0 mr-1 ${currentChapterId === chapter.id ? 'text-background/70' : 'text-neutral-400 group-hover:text-neutral-500'}`}>
                                                    {displayNumber}
                                                </span>
                                            )}
                                            <span className="font-medium text-sm truncate">{chapter.title[language]}</span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {/* Count badge - show for all numbered chapters */}
                                            {isNumbered && (
                                                <span className={`text-[10px] min-w-[18px] text-center px-1 py-0.5 rounded-md ${currentChapterId === chapter.id ? 'bg-background/20' : 'bg-surface text-neutral-500'}`}>
                                                    {chapter.duas.length}
                                                </span>
                                            )}
                                            {currentChapterId === chapter.id && <ChevronRight size={14} />}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col relative w-full h-full min-w-0">
                {/* Header (Mobile + Desktop Controls) */}
                <header className="h-14 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background z-50 relative">
                    {/* Left: Menu Trigger */}
                    <div className="flex items-center gap-3 z-10">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 -ml-2 text-foreground hover:bg-surface rounded-md transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    {/* Centered Title */}
                    <div className={`
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                text-center pointer-events-none md:pointer-events-auto
                transition-opacity duration-300
                ${isDesktopSidebarOpen ? 'lg:opacity-0' : 'lg:opacity-100'}
            `}>
                        <div className="flex items-center justify-center text-foreground">
                            <CustomCastleIcon size={28} />
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="ml-auto flex items-center gap-2 z-10">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-neutral-500 hover:bg-surface hover:text-foreground transition-colors"
                        >
                            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {/* Prayer Times */}
                        <button
                            onClick={() => setCurrentView('prayer-times')}
                            aria-label={I18N[language].prayerTimes}
                            title={I18N[language].prayerTimes}
                            className="p-2 rounded-full text-neutral-500 hover:bg-surface hover:text-foreground transition-colors"
                        >
                            <Clock size={20} />
                        </button>

                        {/* Settings Dropdown Wrapper */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className={`p-2 rounded-full transition-colors ${isSettingsOpen ? 'bg-surface text-foreground' : 'text-neutral-500 hover:bg-surface hover:text-foreground'}`}
                            >
                                <Settings size={20} />
                            </button>

                            {/* Settings Dropdown */}
                            {isSettingsOpen && (
                                <>
                                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsSettingsOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-72 p-2 bg-background border border-border rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex flex-col gap-1">

                                            {/* Show Translation Toggle */}
                                            <button
                                                onClick={() => setShowTranslation(!showTranslation)}
                                                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface transition-colors text-sm"
                                            >
                                                <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
                                                    <Type size={16} className="shrink-0" />
                                                    <span className="whitespace-nowrap">{I18N[language].wordByWord}</span>
                                                </div>
                                                <div className={`w-9 h-5 rounded-full relative transition-colors border ${showTranslation ? 'bg-foreground border-foreground' : 'bg-surface border-neutral-300 dark:border-neutral-600'}`}>
                                                    <div className={`absolute top-[1px] w-4 h-4 rounded-full transition-all duration-200 shadow-sm ${showTranslation ? 'left-[17px] bg-background' : 'left-[1px] bg-foreground'}`} />
                                                </div>
                                            </button>

                                            {/* Highlight Toggle */}
                                            <button
                                                onClick={() => setEnableHighlight(!enableHighlight)}
                                                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface transition-colors text-sm"
                                            >
                                                <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
                                                    <Highlighter size={16} className="shrink-0" />
                                                    <span className="whitespace-nowrap">{I18N[language].highlightWords}</span>
                                                </div>
                                                <div className={`w-9 h-5 rounded-full relative transition-colors border ${enableHighlight ? 'bg-foreground border-foreground' : 'bg-surface border-neutral-300 dark:border-neutral-600'}`}>
                                                    <div className={`absolute top-[1px] w-4 h-4 rounded-full transition-all duration-200 shadow-sm ${enableHighlight ? 'left-[17px] bg-background' : 'left-[1px] bg-foreground'}`} />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Scroll Area with Swipe Handlers */}
                <div
                    className="flex-1 overflow-y-auto relative no-scrollbar"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    {activeDua ? (
                        <>
                            {/* Quranic duas have no recording yet — no player, no transport controls. */}
                            {activeDua.audioUrl && (
                                <Player
                                    isPlaying={isPlaying}
                                    onPlayPause={togglePlay}
                                    currentTime={currentTime}
                                    duration={duration}
                                    onSeek={seek}
                                    onRewind={(s) => skip(-s)}
                                    onForward={(s) => skip(s)}
                                    onSpeedChange={setPlaybackSpeed}
                                    onVolumeChange={setVolume}
                                    currentSpeed={playbackSpeed}
                                    currentVolume={volume}
                                />
                            )}

                            <div className="px-4 pb-20 pt-8 max-w-4xl mx-auto flex flex-col items-center">
                                {/* Titles */}
                                <div className="text-center mb-6 space-y-2">
                                    {collection === 'sunna' && currentChapter.id > 2 && (
                                        <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                                            #{currentChapter.id - 2}
                                        </span>
                                    )}
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{currentChapter.title[language]}</h2>
                                </div>

                                {/* Chapter Description (Plain Text / Book Style) */}
                                {currentChapter.description && (
                                    <div className="w-full max-w-2xl mt-4 mb-12">
                                        <div className="font-serif text-lg md:text-xl text-foreground leading-relaxed space-y-6 text-justify">
                                                {renderDescription(currentChapter.description[language])}
                                            </div>
                                        </div>
                                    )}

                                {/* Sub-Dua Navigation (Pagination) - Only if there are duas */}
                                {currentChapter.duas.length > 1 && (
                                    <div className="flex items-center justify-center gap-3 mb-8 bg-surface p-1.5 rounded-full border border-border">
                                        <button
                                            onClick={() => setActiveDuaIndex(i => Math.max(0, i - 1))}
                                            disabled={activeDuaIndex === 0}
                                            className="p-1.5 rounded-full hover:bg-background disabled:opacity-30 transition-all text-neutral-600 dark:text-neutral-400"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        <div className="flex gap-1.5">
                                            {currentChapter.duas.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveDuaIndex(idx)}
                                                    className={`
                                            w-2.5 h-2.5 rounded-full transition-all duration-300
                                            ${idx === activeDuaIndex ? 'bg-foreground scale-110' : 'bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'}
                                        `}
                                                />
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setActiveDuaIndex(i => Math.min(currentChapter.duas.length - 1, i + 1))}
                                            disabled={activeDuaIndex === currentChapter.duas.length - 1}
                                            className="p-1.5 rounded-full hover:bg-background disabled:opacity-30 transition-all text-neutral-600 dark:text-neutral-400"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}

                                {/* Narration above the Arabic dua text */}
                                {activeDua?.narration && (
                                    <div className="w-full max-w-2xl mb-8 font-serif text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed text-justify">
                                        {renderInline(activeDua.narration[language])}
                                    </div>
                                )}

                                {/* Words - Only if activeDua exists */}
                                {activeDua && (
                                    <WordGrid
                                        words={activeDua.sync}
                                        currentTime={currentTime}
                                        language={language}
                                        onWordClick={(t) => {
                                            if (!activeDua.audioUrl) return;
                                            seek(t);
                                            if (!isPlaying && audioRef.current) {
                                                audioRef.current.play();
                                                setIsPlaying(true);
                                            }
                                        }}
                                        showTranslation={showTranslation}
                                        enableHighlight={enableHighlight}
                                    />
                                )}

                                {/* Footer Translation - Only if activeDua exists */}
                                {activeDua && (
                                    <div className="mt-12 pt-8 border-t border-border w-full text-center">
                                        <p className="font-serif italic text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                                            "{activeDua.fullTranslation[language]}"
                                        </p>
                                        {activeDua.note && (
                                            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300 font-serif leading-relaxed max-w-2xl mx-auto">
                                                {renderInline(activeDua.note[language])}
                                            </p>
                                        )}
                                        {activeDua.source && (
                                            activeDua.ref ? (
                                                // Quranic provenance — link straight to the ayah.
                                                <a
                                                    href={quranComUrl(activeDua.ref)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={I18N[language].readInQuran}
                                                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono hover:text-foreground transition-colors"
                                                >
                                                    [{activeDua.source[language]}]
                                                    <ExternalLink size={11} className="shrink-0" />
                                                </a>
                                            ) : (
                                                <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                                                    [{activeDua.source[language]}]
                                                </p>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={`flex flex-col items-center px-4 w-full ${currentChapter.description ? 'pt-12 pb-24' : 'justify-center h-[60vh]'}`}>
                            <div className="w-16 h-16 mb-6 rounded-full bg-surface flex items-center justify-center text-neutral-400 shrink-0">
                                <BookOpen size={32} />
                            </div>

                            <div className="text-center mb-8 space-y-2">
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{currentChapter.title[language]}</h3>
                            </div>

                            {currentChapter.description ? (
                                <div className="w-full max-w-2xl px-2">
                                    <div className="font-serif text-lg md:text-xl text-foreground leading-relaxed space-y-6">
                                        {renderDescription(currentChapter.description[language])}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-neutral-500 dark:text-neutral-400 max-w-sm text-center">
                                    {language === 'ru' && "Контент для этой главы скоро будет добавлен."}
                                    {language === 'en' && "Content for this chapter will be added soon."}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Hidden Audio */}
            <audio
                ref={audioRef}
                onError={(e) => console.error("Audio playback error:", e.currentTarget.error)}
            />

            {/* Prayer Times Panel */}
            {currentView === 'prayer-times' && (
                <PrayerTimesPanel
                    language={language}
                    onClose={() => setCurrentView('chapter')}
                />
            )}

            {/* PWA install prompt (mobile/tablet only, hidden when already installed) */}
            <InstallPrompt language={language} />
        </div>
    );
};

export default App;