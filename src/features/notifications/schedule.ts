import type { Language } from '../../../types';
import { I18N } from '../../i18n/strings';
import { computePrayerTimes, type CalculationMethodName, type MadhabName } from '../prayer/prayerTimes';
import type { Coords } from '../geolocation/resolveCoordinates';

export type NotificationPermissionResult = 'granted' | 'denied' | 'default' | 'unsupported';

export function notificationsSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
}

export async function requestNotificationPermission(): Promise<NotificationPermissionResult> {
  if (!notificationsSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  at: string; // ISO date
  lang: Language;
  url?: string;
  tag?: string;
}

/**
 * Schedule notifications for today's adhkars and key prayers.
 * Uses postMessage → SW setTimeout. Works only while app is open
 * or very recently backgrounded. For true background delivery you need
 * a server + Web Push (VAPID). See Phase 2 in the architecture doc.
 */
export async function scheduleTodayNotifications(
  coords: Coords,
  lang: Language,
  method: CalculationMethodName = 'Russia',
  madhab: MadhabName = 'Shafi'
): Promise<ScheduledNotification[]> {
  if (!notificationsSupported()) return [];
  if (Notification.permission !== 'granted') return [];

  const reg = await navigator.serviceWorker.ready;
  if (!reg) return [];

  const times = await computePrayerTimes(coords, new Date(), method, madhab);
  const strings = I18N[lang];
  const now = Date.now();

  const schedule: ScheduledNotification[] = [];

  // Morning adhkar — shortly after Fajr
  const morningAt = new Date(times.fajr.getTime() + 10 * 60 * 1000);
  if (morningAt.getTime() > now) {
    schedule.push({
      id: `morning-${today()}`,
      title: strings.morningAdhkarTitle,
      body: strings.morningAdhkarBody,
      at: morningAt.toISOString(),
      lang,
      url: `/?chapter=29&lang=${lang}`,
      tag: 'adhkar-morning',
    });
  }

  // Evening adhkar — shortly after Asr
  const eveningAt = new Date(times.asr.getTime() + 10 * 60 * 1000);
  if (eveningAt.getTime() > now) {
    schedule.push({
      id: `evening-${today()}`,
      title: strings.eveningAdhkarTitle,
      body: strings.eveningAdhkarBody,
      at: eveningAt.toISOString(),
      lang,
      url: `/?chapter=29&lang=${lang}`,
      tag: 'adhkar-evening',
    });
  }

  // Fajr reminder — 15 min before
  const fajrReminder = new Date(times.fajr.getTime() - 15 * 60 * 1000);
  if (fajrReminder.getTime() > now) {
    schedule.push({
      id: `fajr-${today()}`,
      title: strings.fajrReminderTitle,
      body: strings.fajrReminderBody,
      at: fajrReminder.toISOString(),
      lang,
      url: `/?view=prayer-times&lang=${lang}`,
      tag: 'prayer-fajr',
    });
  }

  // Maghrib reminder — at Maghrib time
  if (times.maghrib.getTime() > now) {
    schedule.push({
      id: `maghrib-${today()}`,
      title: strings.maghribReminderTitle,
      body: strings.maghribReminderBody,
      at: times.maghrib.toISOString(),
      lang,
      url: `/?view=prayer-times&lang=${lang}`,
      tag: 'prayer-maghrib',
    });
  }

  for (const n of schedule) {
    reg.active?.postMessage({ type: 'SCHEDULE_NOTIFICATION', payload: n });
  }

  return schedule;
}

export function cancelAllScheduledNotifications(): void {
  if (!notificationsSupported()) return;
  navigator.serviceWorker.ready.then((reg) => {
    reg.active?.postMessage({ type: 'CANCEL_ALL_NOTIFICATIONS' });
  });
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}
