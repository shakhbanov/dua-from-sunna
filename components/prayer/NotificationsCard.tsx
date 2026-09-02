import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import type { Language } from '../../types';
import type { UIStrings } from '../../src/i18n/strings';
import type { Coords } from '../../src/features/geolocation/resolveCoordinates';
import type { CalculationMethodName, MadhabName } from '../../src/features/prayer/prayerTimes';
import {
  notificationsSupported,
  requestNotificationPermission,
  scheduleTodayNotifications,
  cancelAllScheduledNotifications,
  isStandalone,
} from '../../src/features/notifications/schedule';

interface Props {
  t: UIStrings;
  language: Language;
  coords: Coords | null;
  method: CalculationMethodName;
  madhab: MadhabName;
}

const NotificationsCard: React.FC<Props> = ({ t, language, coords, method, madhab }) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );
  const [scheduledCount, setScheduledCount] = useState(0);
  const [showIOSHint, setShowIOSHint] = useState(false);

  const handleEnable = async () => {
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
        const scheduled = await scheduleTodayNotifications(coords, language, method, madhab);
        setScheduledCount(scheduled.length);
      }
    } else if (result === 'denied') {
      setPermission('denied');
    }
  };

  const handleDisable = () => {
    cancelAllScheduledNotifications();
    setScheduledCount(0);
  };

  const isScheduled = permission === 'granted' && scheduledCount > 0;

  return (
    <div className="p-4 rounded-xl border border-border">
      <div className="flex items-center gap-2 mb-3">
        {isScheduled ? (
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
          onClick={handleEnable}
          className="w-full py-2 rounded-lg bg-accent text-accent-text hover:bg-accent-hover transition-colors text-sm font-medium"
        >
          {t.notificationsEnable}
        </button>
      )}
      {isScheduled && (
        <div>
          <p className="text-sm text-neutral-500 mb-2">{t.notificationsEnabled} ({scheduledCount})</p>
          <button
            onClick={handleDisable}
            className="w-full py-2 rounded-lg border border-border hover:bg-surface transition-colors text-sm"
          >
            {t.close}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsCard;
