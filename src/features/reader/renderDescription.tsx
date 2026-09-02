import React from 'react';

const FOOTNOTE_DIGITS = '¹²³⁴⁵⁶⁷⁸⁹⁰';
const FOOTNOTE_REGEX = new RegExp(`^([${FOOTNOTE_DIGITS}]+)\\s+([\\s\\S]+)$`);

const BOLD_SPLIT = /(\*\*[^*]+\*\*)/g;

interface Chunk {
  key: string;
  text: string;
}

/**
 * Splits text into chunks keyed by their offset in the source string. The offset
 * is a real identity for a piece of static prose — unlike an array index it does
 * not shift meaning when the text above it changes.
 */
function keyedChunks(parts: string[], separatorLength = 0): Chunk[] {
  let offset = 0;
  return parts.map((text) => {
    const chunk: Chunk = { key: `c${offset}`, text };
    offset += text.length + separatorLength;
    return chunk;
  });
}

/** Renders `**bold**` markers inside a single line of text. */
export const renderInline = (text: string): React.ReactNode =>
  keyedChunks(text.split(BOLD_SPLIT)).map(({ key, text: part }) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={key} className="font-semibold">{part.slice(2, -2)}</strong>
      : <React.Fragment key={key}>{part}</React.Fragment>
  );

/**
 * Chapter descriptions are plain text with a few book conventions: blank-line
 * paragraphs, a `---` rule, superscript footnotes, `_italic translations_` and
 * centred basmala lines.
 */
export const renderDescription = (description: string): React.ReactNode => {
  let firstFootnoteSeen = false;

  return keyedChunks(description.split('\n\n'), 2).flatMap(({ key, text: para }) => {
    const trimmed = para.trim();
    if (!trimmed || trimmed === '---') return [];

    const footnoteMatch = trimmed.match(FOOTNOTE_REGEX);
    if (footnoteMatch) {
      const [, marker, rest] = footnoteMatch;
      const showRule = !firstFootnoteSeen;
      firstFootnoteSeen = true;
      return [(
        <div key={key} className="text-left">
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
        key={key}
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
