import type { CalculationMethodName, MadhabName } from './prayerTimes';

const METHOD_KEY = 'hisn.prayerMethod';
const MADHAB_KEY = 'hisn.prayerMadhab';

export interface PrayerSettings {
  method: CalculationMethodName;
  madhab: MadhabName;
}

const VALID_METHODS: readonly CalculationMethodName[] = [
  'Russia', 'MuslimWorldLeague', 'Karachi', 'Egyptian', 'UmmAlQura', 'Turkey',
  'NorthAmerica', 'MoonsightingCommittee', 'Dubai', 'Qatar', 'Kuwait', 'Singapore', 'Tehran',
];

export function getPrayerSettings(): PrayerSettings {
  let method: CalculationMethodName = 'Russia';
  let madhab: MadhabName = 'Shafi';
  try {
    const storedMethod = localStorage.getItem(METHOD_KEY) as CalculationMethodName | null;
    if (storedMethod && VALID_METHODS.includes(storedMethod)) method = storedMethod;
    const storedMadhab = localStorage.getItem(MADHAB_KEY) as MadhabName | null;
    if (storedMadhab === 'Shafi' || storedMadhab === 'Hanafi') madhab = storedMadhab;
  } catch {
    // ignore
  }
  return { method, madhab };
}

export function savePrayerSettings(s: PrayerSettings): void {
  try {
    localStorage.setItem(METHOD_KEY, s.method);
    localStorage.setItem(MADHAB_KEY, s.madhab);
  } catch {
    // ignore
  }
}
