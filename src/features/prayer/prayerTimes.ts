// adhan is loaded via import-map from esm.sh at runtime; typed loosely here
// because we don't ship adhan types. Functionality is well-documented:
// https://github.com/batoulapps/adhan-js
import type { Coords } from '../geolocation/resolveCoordinates';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface DayPrayers {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export type CalculationMethodName =
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'Qatar'
  | 'Kuwait'
  | 'MoonsightingCommittee'
  | 'Singapore'
  | 'Turkey'
  | 'Tehran'
  | 'NorthAmerica'
  | 'Other';

interface AdhanModule {
  Coordinates: new (lat: number, lng: number) => unknown;
  PrayerTimes: new (coords: unknown, date: Date, params: unknown) => DayPrayers;
  CalculationMethod: Record<CalculationMethodName, () => unknown>;
  Madhab: { Shafi: unknown; Hanafi: unknown };
}

let _adhan: AdhanModule | null = null;

async function loadAdhan(): Promise<AdhanModule> {
  if (_adhan) return _adhan;
  const mod = await import('adhan');
  _adhan = mod as unknown as AdhanModule;
  return _adhan;
}

export async function computePrayerTimes(
  coords: Coords,
  date: Date = new Date(),
  method: CalculationMethodName = 'MuslimWorldLeague'
): Promise<DayPrayers> {
  const adhan = await loadAdhan();
  const location = new adhan.Coordinates(coords.lat, coords.lng);
  const params = adhan.CalculationMethod[method]();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (params as any).madhab = adhan.Madhab.Shafi;
  const times = new adhan.PrayerTimes(location, date, params);
  return {
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha,
  };
}

export function formatTime(date: Date, locale: string = 'ru'): string {
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function nextPrayer(times: DayPrayers, now: Date = new Date()): { key: PrayerKey; at: Date } {
  const order: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
  for (const k of order) {
    if (times[k] > now) return { key: k, at: times[k] };
  }
  return { key: 'fajr', at: times.fajr };
}
