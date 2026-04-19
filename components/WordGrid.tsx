import React, { useMemo } from 'react';
import { WordSync, Language } from '../types';

interface WordGridProps {
  words: WordSync[];
  currentTime: number;
  language: Language;
  onWordClick: (startTime: number) => void;
  showTranslation: boolean;
  enableHighlight: boolean;
}

const WordGrid: React.FC<WordGridProps> = ({
  words,
  currentTime,
  language,
  onWordClick,
  showTranslation,
  enableHighlight
}) => {
  // Активный индекс: последнее слово, чьё start <= currentTime.
  // Так подсветка не мигает на стыках (gap между .end и следующим .start),
  // а плавно перетекает на следующее слово ровно на его .start.
  const activeIndex = useMemo(() => {
    if (!enableHighlight) return -1;
    for (let i = words.length - 1; i >= 0; i--) {
      if (currentTime >= words[i].start) {
        // У последнего слова даём 0.5с паузы после .end, затем снимаем подсветку
        if (i === words.length - 1 && currentTime > words[i].end + 0.5) return -1;
        return i;
      }
    }
    return -1;
  }, [words, currentTime, enableHighlight]);

  return (
    <div
      className={`
        flex flex-wrap justify-center content-start px-2 md:px-6 max-w-3xl mx-auto transition-all duration-300
        ${showTranslation
          ? 'gap-x-3 gap-y-8 min-h-[50vh] py-8'
          : 'gap-x-1 gap-y-3 min-h-[15vh] py-4'
        }
      `}
      dir="rtl"
    >
      {words.map((word, index) => {
        const isActive = index === activeIndex;
        // When highlight mode is off, render every word at full brightness.
        const isBright = !enableHighlight || isActive;

        return (
          <button
            key={`${index}-${word.start}`}
            onClick={() => onWordClick(word.start)}
            className={`
              group relative flex flex-col items-center text-center rounded-xl outline-none
              transition-[background-color,box-shadow,opacity,transform] duration-300 ease-out
              ${showTranslation ? 'px-3 py-2' : 'px-1 py-0.5'}
              ${isActive
                ? 'bg-surface shadow-sm opacity-100'
                : !enableHighlight
                  ? 'hover:bg-surface/50 opacity-100'
                  : 'hover:bg-surface/50 opacity-100 md:opacity-80 hover:opacity-100'
              }
            `}
          >
            {/* Arabic Word */}
            <span
              className={`
                font-arabic text-3xl md:text-4xl pt-1 transition-colors duration-300 ease-out
                ${showTranslation ? 'leading-relaxed mb-5' : 'leading-snug mb-0'}
                ${isBright ? 'text-foreground' : 'text-neutral-600 dark:text-neutral-400'}
              `}
            >
              {word.text}
            </span>

            {/* Translation */}
            {showTranslation && (
              <span
                dir="ltr"
                className={`
                  font-sans text-[11px] md:text-xs font-medium tracking-wide uppercase transition-colors duration-300 ease-out
                  ${isActive
                    ? 'text-accent'
                    : !enableHighlight
                      ? 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                      : 'text-neutral-400 group-hover:text-neutral-500'
                  }
                `}
              >
                {word.trans[language]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default WordGrid;