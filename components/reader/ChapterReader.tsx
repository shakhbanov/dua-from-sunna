import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import type { ChapterData, Collection, DuaItem, Language } from '../../types';
import { duaAudioSegments, getCollection } from '../../data/collections';
import { I18N } from '../../src/i18n/strings';
import { renderDescription, renderInline } from '../../src/features/reader/renderDescription';
import type { ReaderSettings } from '../../src/features/reader/settings';
import { useAudioPlayer } from '../../src/features/audio/useAudioPlayer';
import { buildCollectionIndexPath, buildHomePath } from '../../src/router/routes';
import Player from '../Player';
import WordGrid from '../WordGrid';
import DuaPager from './DuaPager';
import DuaFooter from './DuaFooter';

interface Props {
  chapter: ChapterData;
  activeDua: DuaItem | null;
  activeDuaIndex: number;
  language: Language;
  collection: Collection;
  settings: ReaderSettings;
  /** False on the prayer-times route, which owns the page's h1 itself. */
  isPrimaryHeading: boolean;
  onSelectDua: (index: number) => void;
  /** The recitation reached the end of this dua. */
  onDuaFinished: () => void;
}

/**
 * The reading surface for one dua.
 *
 * Mounted under a key that changes with the dua, so playback position, segment
 * and speed reset by remounting instead of being cleared by an effect.
 */
const ChapterReader: React.FC<Props> = ({
  chapter,
  activeDua,
  activeDuaIndex,
  language,
  collection,
  settings,
  isPrimaryHeading,
  onSelectDua,
  onDuaFinished,
}) => {
  const audioSegments = useMemo(
    () => (activeDua ? duaAudioSegments(activeDua) : []),
    [activeDua]
  );
  const audio = useAudioPlayer(audioSegments, onDuaFinished);

  const Heading = isPrimaryHeading ? 'h1' : 'h2';

  if (!activeDua)
    return <ChapterProse chapter={chapter} language={language} isPrimaryHeading={isPrimaryHeading} />;

  return (
    <>
      {/* No audio at all (e.g. a prose-only chapter) — no player. */}
      {audioSegments.length > 0 && (
        <Player
          isPlaying={audio.isPlaying}
          onPlayPause={audio.togglePlay}
          currentTime={audio.currentTime}
          duration={audio.duration}
          onSeek={audio.seek}
          onRewind={(s) => audio.skip(-s)}
          onForward={(s) => audio.skip(s)}
          onSpeedChange={audio.setPlaybackSpeed}
          onVolumeChange={audio.setVolume}
          currentSpeed={audio.playbackSpeed}
          currentVolume={audio.volume}
          language={language}
        />
      )}

      <div className="px-4 pb-20 pt-8 max-w-4xl mx-auto flex flex-col items-center">
        <Breadcrumbs chapter={chapter} language={language} collection={collection} />

        {/* Titles */}
        <div className="text-center mb-6 space-y-2">
          {collection === 'sunna' && chapter.id > 2 && (
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
              #{chapter.id - 2}
            </span>
          )}
          <Heading className="text-2xl md:text-3xl font-serif font-bold text-foreground">{chapter.title[language]}</Heading>
        </div>

        {/* Chapter Description (Plain Text / Book Style) */}
        {chapter.description && (
          <div className="w-full max-w-2xl mt-4 mb-12">
            <div className="font-serif text-lg md:text-xl text-foreground leading-relaxed space-y-6 text-justify">
              {renderDescription(chapter.description[language])}
            </div>
          </div>
        )}

        {chapter.duas.length > 1 && (
          <DuaPager
            duas={chapter.duas}
            activeIndex={activeDuaIndex}
            language={language}
            onSelect={onSelectDua}
          />
        )}

        {/* A chapter that groups several distinct duas names each one. */}
        {activeDua.title && (
          <h3 className="mb-4 text-center text-lg md:text-xl font-serif font-semibold text-foreground">
            {activeDua.title[language]}
          </h3>
        )}

        {/* Narration above the Arabic dua text. A Quranic dua carries a
            one-line attribution ("Дуа Ибрахима о Мекке"), which reads as a
            centred caption; a Sunnah chapter carries a full hadith, which
            stays a justified paragraph. */}
        {activeDua.narration && (
          <div
            className={`w-full max-w-2xl mb-8 font-serif text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed ${
              collection === 'quran' ? 'text-center' : 'text-justify'
            }`}
          >
            {renderInline(activeDua.narration[language])}
          </div>
        )}

        <WordGrid
          words={activeDua.sync}
          currentTime={audio.currentTime}
          language={language}
          onWordClick={(time) => {
            if (audioSegments.length === 0) return;
            audio.seek(time);
            if (!audio.isPlaying) audio.play();
          }}
          showTranslation={settings.showTranslation}
          enableHighlight={settings.enableHighlight}
        />

        <DuaFooter dua={activeDua} language={language} />
      </div>

      {/* Hidden audio. The recitation is Arabic speech; the word grid above is
          its synchronised transcript and the translation sits under it, so both
          are on the page rather than behind a caption track. */}
      <audio
        ref={audio.audioRef}
        onError={(e) => console.error("Audio playback error:", e.currentTarget.error)}
      >
        <track kind="captions" />
      </audio>
    </>
  );
};

interface CrumbProps {
  chapter: ChapterData;
  language: Language;
  collection: Collection;
}

/**
 * The same trail the BreadcrumbList declares — the markup is not allowed to
 * claim a path the reader cannot see.
 */
const Breadcrumbs: React.FC<CrumbProps> = ({ chapter, language, collection }) => {
  const home = language === 'ru' ? 'Главная' : 'Home';
  return (
    <nav
      aria-label="breadcrumb"
      className="w-full mb-6 text-xs text-neutral-500 dark:text-neutral-400"
    >
      <a href={buildHomePath(language)} className="hover:underline">
        {home}
      </a>
      {collection !== 'sunna' && (
        <>
          <span className="mx-2">/</span>
          <a href={buildCollectionIndexPath(collection, language)} className="hover:underline">
            {getCollection(collection).title[language]}
          </a>
        </>
      )}
      <span className="mx-2">/</span>
      <span aria-current="page">{chapter.title[language]}</span>
    </nav>
  );
};

interface ProseProps {
  chapter: ChapterData;
  language: Language;
  isPrimaryHeading: boolean;
}

/** A chapter with no duas: preface, virtues, or content not yet written. */
const ChapterProse: React.FC<ProseProps> = ({ chapter, language, isPrimaryHeading }) => {
  const Heading = isPrimaryHeading ? 'h1' : 'h2';
  return (
  <div className={`flex flex-col items-center px-4 w-full ${chapter.description ? 'pt-12 pb-24' : 'justify-center h-[60vh]'}`}>
    <div className="w-16 h-16 mb-6 rounded-full bg-surface flex items-center justify-center text-neutral-400 shrink-0">
      <BookOpen size={32} aria-hidden="true" />
    </div>

    <div className="text-center mb-8 space-y-2">
      <Heading className="text-2xl md:text-3xl font-serif font-bold text-foreground">{chapter.title[language]}</Heading>
    </div>

    {chapter.description ? (
      <div className="w-full max-w-2xl px-2">
        <div className="font-serif text-lg md:text-xl text-foreground leading-relaxed space-y-6">
          {renderDescription(chapter.description[language])}
        </div>
      </div>
    ) : (
      <p className="text-neutral-500 dark:text-neutral-400 max-w-sm text-center">
        {I18N[language].comingSoon}
      </p>
    )}
    </div>
  );
};

export default ChapterReader;
