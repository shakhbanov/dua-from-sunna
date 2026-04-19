declare global {
  interface Window {
    ym?: (id: number, action: string, params?: unknown, options?: unknown) => void;
  }
}

const COUNTER_ID_RAW = import.meta.env.VITE_YANDEX_METRIKA_ID as string | undefined;
const COUNTER_ID = COUNTER_ID_RAW ? Number(COUNTER_ID_RAW) : 0;

export function trackPageView(url?: string, title?: string): void {
  if (!COUNTER_ID) return;
  if (typeof window === 'undefined' || typeof window.ym !== 'function') return;
  try {
    window.ym(COUNTER_ID, 'hit', url ?? location.href, {
      title: title ?? document.title,
      referer: document.referrer,
    });
  } catch {
    // ignore analytics failures
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!COUNTER_ID) return;
  if (typeof window === 'undefined' || typeof window.ym !== 'function') return;
  try {
    window.ym(COUNTER_ID, 'reachGoal', name, params);
  } catch {
    // ignore
  }
}
