import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DuaItem, Language } from '../../types';
import { I18N } from '../../src/i18n/strings';

interface Props {
  duas: DuaItem[];
  activeIndex: number;
  language: Language;
  onSelect: (index: number) => void;
}

/** Dot pagination for a chapter that holds more than one dua. */
const DuaPager: React.FC<Props> = ({ duas, activeIndex, language, onSelect }) => {
  const t = I18N[language];

  return (
    <div className="flex items-center justify-center gap-3 mb-8 bg-surface p-1.5 rounded-full border border-border">
      <button
        onClick={() => onSelect(Math.max(0, activeIndex - 1))}
        disabled={activeIndex === 0}
        aria-label={t.previousDua}
        title={t.previousDua}
        className="p-1.5 rounded-full hover:bg-background disabled:opacity-30 transition-[background-color,opacity] text-neutral-600 dark:text-neutral-400"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex gap-1.5">
        {duas.map((dua, idx) => (
          <button
            key={dua.id}
            id={dua.id}
            onClick={() => onSelect(idx)}
            aria-label={`${t.goToDua} ${idx + 1}`}
            aria-current={idx === activeIndex ? 'true' : undefined}
            className={`
                w-2.5 h-2.5 rounded-full transition-[background-color,transform] duration-300
                ${idx === activeIndex ? 'bg-foreground scale-110' : 'bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'}
            `}
          />
        ))}
      </div>

      <button
        onClick={() => onSelect(Math.min(duas.length - 1, activeIndex + 1))}
        disabled={activeIndex === duas.length - 1}
        aria-label={t.nextDua}
        title={t.nextDua}
        className="p-1.5 rounded-full hover:bg-background disabled:opacity-30 transition-[background-color,opacity] text-neutral-600 dark:text-neutral-400"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default DuaPager;
