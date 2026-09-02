import React, { useEffect, useState, useCallback } from 'react';
import { X, Settings2 } from 'lucide-react';
import type { Language } from '../types';
import { I18N } from '../src/i18n/strings';
import { resolveCoordinates, type Coords, clearCoordsCache } from '../src/features/geolocation/resolveCoordinates';
import {
  computePrayerTimes,
  nextPrayer,
  type DayPrayers,
  type CalculationMethodName,
  type MadhabName,
} from '../src/features/prayer/prayerTimes';
import { getPrayerSettings, savePrayerSettings } from '../src/features/prayer/settings';
import LocationCard from './prayer/LocationCard';
import PrayerSettingsCard from './prayer/PrayerSettingsCard';
import PrayerTimesList from './prayer/PrayerTimesList';
import NotificationsCard from './prayer/NotificationsCard';

interface Props {
  language: Language;
  onClose: () => void;
}

const PrayerTimesPanel: React.FC<Props> = ({ language, onClose }) => {
  const t = I18N[language];
  const [coords, setCoords] = useState<Coords | null>(null);
  const [times, setTimes] = useState<DayPrayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [method, setMethod] = useState<CalculationMethodName>('Russia');
  const [madhab, setMadhab] = useState<MadhabName>('Shafi');

  // Load persisted settings on mount
  useEffect(() => {
    const s = getPrayerSettings();
    setMethod(s.method);
    setMadhab(s.madhab);
  }, []);

  const loadPrayers = useCallback(async (skipCache = false) => {
    setLoading(true);
    setError(null);
    try {
      const c = await resolveCoordinates({ skipCache });
      setCoords(c);
      const p = await computePrayerTimes(c, new Date(), method, madhab);
      setTimes(p);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [method, madhab]);

  useEffect(() => {
    loadPrayers();
  }, [loadPrayers]);

  const handleRefresh = () => {
    clearCoordsCache();
    void loadPrayers(true);
  };

  const handleMethodChange = (next: CalculationMethodName) => {
    setMethod(next);
    savePrayerSettings({ method: next, madhab });
  };

  const handleMadhabChange = (next: MadhabName) => {
    setMadhab(next);
    savePrayerSettings({ method, madhab: next });
  };

  const next = times ? nextPrayer(times) : null;
  const locale = language === 'ru' ? 'ru-RU' : 'en-US';

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-lg font-serif font-bold">{t.prayerTimesTitle}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label={t.settings}
            aria-pressed={showSettings}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-surface' : 'hover:bg-surface'}`}
          >
            <Settings2 size={18} />
          </button>
          <button
            onClick={onClose}
            aria-label={t.close}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <LocationCard t={t} coords={coords} loading={loading} onRefresh={handleRefresh} />

        {showSettings && (
          <PrayerSettingsCard
            t={t}
            method={method}
            madhab={madhab}
            onMethodChange={handleMethodChange}
            onMadhabChange={handleMadhabChange}
          />
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 text-sm text-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {times && <PrayerTimesList t={t} times={times} locale={locale} nextKey={next?.key ?? null} />}

        <NotificationsCard t={t} language={language} coords={coords} method={method} madhab={madhab} />
      </div>
    </div>
  );
};

export default PrayerTimesPanel;
