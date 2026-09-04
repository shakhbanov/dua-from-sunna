import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { DuaItem, Language, QuranRef } from '../../types';
import { I18N } from '../../src/i18n/strings';
import { renderInline } from '../../src/features/reader/renderDescription';

// Deep link to the ayah on quran.com, e.g. { sura: 2, ayahFrom: 201 } -> /2/201.
const quranComUrl = (ref: QuranRef): string =>
  `https://quran.com/${ref.sura}/${ref.ayahFrom}${ref.ayahTo ? `-${ref.ayahTo}` : ''}`;

interface Props {
  dua: DuaItem;
  language: Language;
  /**
   * The narrator's introduction, when it belongs with the translation rather
   * than above the Arabic. A hadith reads as one passage — who reported it,
   * then what was said — so splitting the two around the word grid broke the
   * sentence in half.
   */
  lead?: string;
}

/** Translation, commentary and provenance shown under the Arabic text. */
const DuaFooter: React.FC<Props> = ({ dua, language, lead }) => {
  const t = I18N[language];

  return (
    <div className="mt-12 pt-8 border-t border-border w-full text-center">
      <p className="font-serif italic text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
        {lead && <>{renderInline(lead)} </>}
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
    </div>
  );
};

export default DuaFooter;
