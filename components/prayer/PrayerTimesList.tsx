import React from 'react';
import type { UIStrings } from '../../src/i18n/strings';
import { formatTime, type DayPrayers, type PrayerKey } from '../../src/features/prayer/prayerTimes';

const ROW_ORDER: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

interface Props {
  t: UIStrings;
  times: DayPrayers;
  locale: string;
  nextKey: PrayerKey | null;
}

const PrayerTimesList: React.FC<Props> = ({ t, times, locale, nextKey }) => (
  <div className="space-y-1 mb-6">
    {ROW_ORDER.map((key) => {
      const isNext = nextKey === key;
      return (
        <div
          key={key}
          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
            isNext ? 'bg-accent text-accent-text' : 'hover:bg-surface'
          }`}
        >
          <span className={`font-medium ${isNext ? '' : 'text-foreground'}`}>{t[key]}</span>
          <span className="font-mono tabular-nums">{formatTime(times[key], locale)}</span>
        </div>
      );
    })}
  </div>
);

export default PrayerTimesList;
