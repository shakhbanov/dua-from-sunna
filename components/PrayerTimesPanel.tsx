import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, Bell, BellOff, RefreshCw, X, Loader2 } from 'lucide-react';
import type { Language } from '../types';
import { I18N } from '../src/i18n/strings';
import { resolveCoordinates, type Coords, clearCoordsCache } from '../src/features/geolocation/resolveCoordinates';
import { computePrayerTimes, formatTime, nextPrayer, type DayPrayers, type PrayerKey } from '../src/features/prayer/prayerTimes';
import {
  notificationsSupported,
  requestNotificationPermission,
  scheduleTodayNotifications,
  cancelAllScheduledNotifications,
  isStandalone,
} from '../src/features/notifications/schedule';

interface Props {
  language: Language;
  onClose: () => void;
}

const ROW_ORDER: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

const PrayerTimesPanel: React.FC<Props> = ({ language, onClose }) => {
  const t = I18N[language];
  const [coords, setCoords] = useState<Coords | null>(null);
  const [times, setTimes] = useState<DayPrayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );
  const [scheduledCount, setScheduledCount] = useState(0);
  const [showIOSHint, setShowIOSHint] = useState(false);

  const loadPrayers = useCallback(async (skipCache = false) => {
    setLoading(true);
    setError(null);
    try {
      const c = await resolveCoordinates({ skipCache });
      setCoords(c);
      const p = await computePrayerTimes(c);
      setTimes(p);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrayers();
  }, [loadPrayers]);

  const handleRefresh = async () => {
    clearCoordsCache();
    await loadPrayers(true);
  };

  const handleEnableNotifications = async () => {
    if (!notificationsSupported()) {
      setPermission('unsupported');
      return;
    }
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (isIOS && !isStandalone()) {
      setShowIOSHint(true);
      return;
    }
    const result = await requestNotificationPermission();
    if (result === 'granted') {
      setPermission('granted');
      if (coords) {
        const scheduled = await scheduleTodayNotifications(coords, language);
        setScheduledCount(scheduled.length);
      }
    } else if (result === 'denied') {
      setPermission('denied');
    }
  };

  const handleDisableNotifications = () => {
    cancelAllScheduledNotifications();
    setScheduledCount(0);
  };

  const next = times ? nextPrayer(times) : null;
  const locale = language === 'ru' ? 'ru-RU' : 'en-US';

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-lg font-serif font-bold">{t.prayerTimesTitle}</h2>
        <button
          onClick={onClose}
          aria-label={t.close}
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Location */}
        <div className="flex items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-surface">
          <div className="flex items-center gap-3 min-w-0">
            <MapPin size={18} className="shrink-0 text-neutral-500" />
            <div className="min-w-0">
              <div className="text-xs text-neutral-500 uppercase tracking-wide">{t.location}</div>
              <div className="text-sm font-medium truncate">
                {loading && !coords ? t.detectingLocation : coords ? (
                  coords.city && coords.country ? `${coords.city}, ${coords.country}` : `${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`
                ) : '—'}
              </div>
              {coords?.source === 'ip' && (
                <div className="text-[11px] text-neutral-400 mt-0.5">{t.locationDenied}</div>
              )}
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh"
            className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 text-sm text-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Prayer rows */}
        {times && (
          <div className="space-y-1 mb-6">
            {ROW_ORDER.map((key) => {
              const isNext = next?.key === key;
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
        )}

        {/* Notifications */}
        <div className="p-4 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-3">
            {permission === 'granted' && scheduledCount > 0 ? (
              <Bell size={18} className="text-green-600 dark:text-green-400" />
            ) : (
              <BellOff size={18} className="text-neutral-500" />
            )}
            <h3 className="font-medium">{t.notifications}</h3>
          </div>

          {permission === 'unsupported' && (
            <p className="text-sm text-neutral-500">{t.notificationsUnsupported}</p>
          )}
          {permission === 'denied' && (
            <p className="text-sm text-neutral-500">{t.notificationsDenied}</p>
          )}
          {showIOSHint && (
            <p className="text-sm text-neutral-500 mb-2">{t.notificationsIOSHint}</p>
          )}
          {(permission === 'default' || (permission === 'granted' && scheduledCount === 0)) && (
            <button
              onClick={handleEnableNotifications}
              className="w-full py-2 rounded-lg bg-accent text-accent-text hover:bg-accent-hover transition-colors text-sm font-medium"
            >
              {t.notificationsEnable}
            </button>
          )}
          {permission === 'granted' && scheduledCount > 0 && (
            <div>
              <p className="text-sm text-neutral-500 mb-2">{t.notificationsEnabled} ({scheduledCount})</p>
              <button
                onClick={handleDisableNotifications}
                className="w-full py-2 rounded-lg border border-border hover:bg-surface transition-colors text-sm"
              >
                {t.close}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesPanel;
