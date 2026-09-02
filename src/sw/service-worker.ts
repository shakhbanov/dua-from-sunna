/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope;

// SW build marker — bump to force clients to fetch a fresh shell.
// v: 2026-04-21-ssr-cleanurl
self.skipWaiting();
clientsClaim();

// Precache all build assets injected by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// Navigation fallback — SPA shell
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: 'hisn-html-v1',
      networkTimeoutSeconds: 3,
    })
  )
);

// Audio — CacheFirst, 30 days, 300 entries cap.
// Two origins: our own S3 for the Sunnah recordings, and the AlQuran Cloud CDN
// for the per-ayah recitations used by the Quran collection.
registerRoute(
  ({ url }) =>
    url.origin === 'https://s3.shakhbanov.org' ||
    url.origin === 'https://cdn.islamic.network',
  new CacheFirst({
    cacheName: 'hisn-audio-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Google Fonts stylesheets
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({ cacheName: 'google-fonts-css-v1' })
);

// Google Fonts files
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-files-v1',
    plugins: [new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 })],
  })
);

// Yandex.Metrika tag loader — NetworkFirst so hits reach the server when online,
// but don't break the page if offline. Tracking payloads (/watch, /metrika/2)
// are not routed — they go straight to network (default browser behavior).
registerRoute(
  ({ url }) => url.origin === 'https://mc.yandex.ru' && url.pathname.startsWith('/metrika/'),
  new StaleWhileRevalidate({
    cacheName: 'yandex-metrika-v1',
    plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 })],
  })
);

// --- Local notification scheduling ---

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  at: string;
  lang: 'ru' | 'en';
  url?: string;
  tag?: string;
}

const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

self.addEventListener('message', (event) => {
  const { type, payload } = (event.data ?? {}) as {
    type?: string;
    payload?: ScheduledNotification;
  };

  if (type === 'SCHEDULE_NOTIFICATION' && payload) {
    scheduleNotification(payload);
  } else if (type === 'CANCEL_ALL_NOTIFICATIONS') {
    for (const t of pendingTimers.values()) clearTimeout(t);
    pendingTimers.clear();
  } else if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function scheduleNotification(n: ScheduledNotification): void {
  const fireAt = new Date(n.at).getTime();
  const delay = fireAt - Date.now();
  if (delay < 0 || delay > 24 * 60 * 60 * 1000) {
    // Skip past or too-far entries; PWA must be re-opened to schedule again
    return;
  }
  // Replace any existing timer for same id
  const existing = pendingTimers.get(n.id);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    self.registration.showNotification(n.title, {
      body: n.body,
      tag: n.tag ?? n.id,
      lang: n.lang,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-96.png',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...( { vibrate: [180, 80, 180] } as any ),
      data: { url: n.url ?? '/' },
    });
    pendingTimers.delete(n.id);
  }, delay);

  pendingTimers.set(n.id, timer);
}

// --- Notification click ---

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data?.url as string) ?? '/';
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of all) {
        if ('focus' in client) {
          await (client as WindowClient).navigate(target).catch(() => {});
          return (client as WindowClient).focus();
        }
      }
      return self.clients.openWindow(target);
    })()
  );
});

// --- Generic push handler (for Phase 2 when backend is added) ---

self.addEventListener('push', (event) => {
  let data: { title?: string; body?: string; url?: string; lang?: string; tag?: string } = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    data = { title: event.data?.text() ?? '' };
  }
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Дуа', {
      body: data.body,
      lang: data.lang,
      tag: data.tag,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-96.png',
      data: { url: data.url ?? '/' },
    })
  );
});
