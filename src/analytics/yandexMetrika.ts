declare global {
  interface Window {
    ym?: (id: number, action: string, params?: unknown, options?: unknown) => void;
  }
}

const COUNTER_ID = 108667425;

export function trackPageView(url?: string, title?: string): void {
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
  if (typeof window === 'undefined' || typeof window.ym !== 'function') return;
  try {
    window.ym(COUNTER_ID, 'reachGoal', name, params);
  } catch {
    // ignore
  }
}
