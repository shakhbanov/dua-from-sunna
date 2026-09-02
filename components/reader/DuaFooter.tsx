import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { DuaItem, Language, QuranRef } from '../../types';
import { I18N } from '../../src/i18n/strings';
import { RECITER } from '../../data/quranAudio';
import { renderInline } from '../../src/features/reader/renderDescription';

// Deep link to the ayah on quran.com, e.g. { sura: 2, ayahFrom: 201 } -> /2/201.
const quranComUrl = (ref: QuranRef): string =>
  `https://quran.com/${ref.sura}/${ref.ayahFrom}${ref.ayahTo ? `-${ref.ayahTo}` : ''}`;

interface Props {
  dua: DuaItem;
  language: Language;
  segmentIndex: number;
  segmentCount: number;
}

/** Translation, commentary and provenance shown under the Arabic text. */
const DuaFooter: React.FC<Props> = ({ dua, language, segmentIndex, segmentCount }) => {
  const t = I18N[language];

  return (
    <div className="mt-12 pt-8 border-t border-border w-full text-center">
      <p className="font-serif italic text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
        "{dua.fullTranslation[language]}"
      </p>

      {dua.note && (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300 font-serif leading-relaxed max-w-2xl mx-auto">
          {renderInline(dua.note[language])}
        </p>
      )}

      {dua.source && (
        dua.ref ? (
          // Quranic provenance — link straight to the ayah.
          <a
            href={quranComUrl(dua.ref)}
            target="_blank"
            rel="noopener noreferrer"
            title={t.readInQuran}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono hover:text-foreground transition-colors"
          >
            [{dua.source[language]}]
            <ExternalLink size={11} className="shrink-0" aria-hidden="true" />
          </a>
        ) : (
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            [{dua.source[language]}]
          </p>
        )
      )}

      {/* Quranic audio is a recitation of the whole ayah, while most duas quote
          only its supplication part — say so rather than let the mismatch
          surprise the listener. */}
      {dua.ref && segmentCount > 0 && (
        <p className="mt-2 text-[11px] text-neutral-400 dark:text-neutral-500">
          {t.recitedBy} {RECITER.name[language]} · {t.fullAyahRecited}
          {segmentCount > 1 && (
            <> · {t.ayahShort} {segmentIndex + 1}/{segmentCount}</>
          )}
        </p>
      )}
    </div>
  );
};

export default DuaFooter;
