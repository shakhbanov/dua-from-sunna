import React, { useId } from 'react';
import type { UIStrings } from '../../src/i18n/strings';
import {
  CALCULATION_METHODS,
  type CalculationMethodName,
  type MadhabName,
} from '../../src/features/prayer/prayerTimes';

const METHOD_I18N_KEY: Record<CalculationMethodName, keyof UIStrings> = {
  Russia: 'methodRussia',
  MuslimWorldLeague: 'methodMWL',
  Karachi: 'methodKarachi',
  Egyptian: 'methodEgyptian',
  UmmAlQura: 'methodUmmAlQura',
  Turkey: 'methodTurkey',
  NorthAmerica: 'methodNorthAmerica',
  MoonsightingCommittee: 'methodMoonsighting',
  Dubai: 'methodDubai',
  Qatar: 'methodQatar',
  Kuwait: 'methodKuwait',
  Singapore: 'methodSingapore',
  Tehran: 'methodTehran',
};

interface Props {
  t: UIStrings;
  method: CalculationMethodName;
  madhab: MadhabName;
  onMethodChange: (next: CalculationMethodName) => void;
  onMadhabChange: (next: MadhabName) => void;
}

const PrayerSettingsCard: React.FC<Props> = ({ t, method, madhab, onMethodChange, onMadhabChange }) => {
  const methodId = useId();
  const madhabId = useId();

  return (
    <div className="mb-6 p-4 rounded-xl border border-border space-y-4">
      <div>
        <label
          htmlFor={methodId}
          className="block text-xs text-neutral-500 uppercase tracking-wide mb-1.5"
        >
          {t.calculationMethod}
        </label>
        <select
          id={methodId}
          value={method}
          onChange={(e) => onMethodChange(e.target.value as CalculationMethodName)}
          className="w-full bg-surface rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-foreground/20 focus:outline-none"
        >
          {CALCULATION_METHODS.map((m) => (
            <option key={m} value={m}>{t[METHOD_I18N_KEY[m]]}</option>
          ))}
        </select>
      </div>
      <div>
        {/* The madhab picker is a two-button group, so the label names the group
            rather than a single control. */}
        <span
          id={madhabId}
          className="block text-xs text-neutral-500 uppercase tracking-wide mb-1.5"
        >
          {t.madhab}
        </span>
        <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby={madhabId}>
          <button
            onClick={() => onMadhabChange('Shafi')}
            aria-pressed={madhab === 'Shafi'}
            className={`py-2 rounded-lg text-sm transition-colors ${madhab === 'Shafi' ? 'bg-accent text-accent-text' : 'bg-surface hover:bg-background'}`}
          >
            {t.madhabShafi}
          </button>
          <button
            onClick={() => onMadhabChange('Hanafi')}
            aria-pressed={madhab === 'Hanafi'}
            className={`py-2 rounded-lg text-sm transition-colors ${madhab === 'Hanafi' ? 'bg-accent text-accent-text' : 'bg-surface hover:bg-background'}`}
          >
            {t.madhabHanafi}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrayerSettingsCard;
