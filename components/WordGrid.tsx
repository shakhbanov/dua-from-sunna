import React from 'react';
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
        const isCurrentTime = currentTime >= word.start && currentTime < word.end;
        const isActive = enableHighlight && isCurrentTime;
        
        return (
          <button
            key={`${index}-${word.start}`}
            onClick={() => onWordClick(word.start)}
            className={`
              group relative flex flex-col items-center text-center rounded-xl transition-all duration-200 outline-none
              ${showTranslation ? 'px-3 py-2' : 'px-1 py-0.5'}
              ${isActive 
                ? 'bg-surface shadow-sm opacity-100' 
                : 'hover:bg-surface/50 opacity-100 md:opacity-80 hover:opacity-100'
              }
            `}
          >
            {/* Arabic Word */}
            <span 
              className={`
                font-arabic text-3xl md:text-4xl pt-1 transition-all duration-200
                ${showTranslation ? 'leading-relaxed mb-5' : 'leading-snug mb-0'}
                ${isActive ? 'text-foreground' : 'text-neutral-600 dark:text-neutral-400'}
              `}
            >
              {word.text}
            </span>

            {/* Translation */}
            {showTranslation && (
              <span 
                dir="ltr"
                className={`
                  font-sans text-[11px] md:text-xs font-medium tracking-wide uppercase transition-colors duration-200
                  ${isActive ? 'text-accent' : 'text-neutral-400 group-hover:text-neutral-500'}
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