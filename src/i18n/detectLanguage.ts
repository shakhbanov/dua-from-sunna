import type { Language } from '../../types';

const SUPPORTED: readonly Language[] = ['ru', 'en'] as const;
const STORAGE_KEY = 'hisn.lang';

const RUSSIAN_SPEAKING_TZ = /Moscow|Kiev|Kyiv|Minsk|Tashkent|Almaty|Baku|Yerevan|Tbilisi|Chisinau|Tallinn|Riga|Vilnius|Samara|Volgograd|Ekaterinburg|Yekaterinburg|Novosibirsk|Krasnoyarsk|Irkutsk|Yakutsk|Vladivostok|Magadan|Kamchatka|Bishkek|Ashgabat|Dushanbe/i;

export function getStoredLanguage(): Language | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as Language | null;
    return v && SUPPORTED.includes(v) ? v : null;
  } catch {
    return null;
  }
}

export function storeLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore storage quota / private browsing
  }
}

export function detectLanguage(): Language {
  // 1. URL param wins if present
  try {
    const urlLang = new URLSearchParams(location.search).get('lang') as Language | null;
    if (urlLang && SUPPORTED.includes(urlLang)) return urlLang;
  } catch {
    // noop
  }

  // 2. User choice persisted
  const stored = getStoredLanguage();
  if (stored) return stored;

  // 3. Browser language preferences
  const navLangs: readonly string[] =
    (navigator.languages && navigator.languages.length > 0)
      ? navigator.languages
      : [navigator.language || 'en'];

  for (const nav of navLangs) {
    const base = nav.toLowerCase().split('-')[0] as Language;
    if (SUPPORTED.includes(base)) return base;
  }

  // 4. Fallback by IANA time zone → Cyrillic-speaking regions default to RU
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && RUSSIAN_SPEAKING_TZ.test(tz)) return 'ru';
  } catch {
    // noop
  }

  return 'en';
}
