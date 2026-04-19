export interface Coords {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
  source: 'geolocation' | 'ip' | 'cache';
  timestamp: number;
}

const CACHE_KEY = 'hisn.coords';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function readCache(): Coords | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Coords;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return { ...parsed, source: 'cache' };
  } catch {
    return null;
  }
}

function writeCache(c: Coords): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    // ignore
  }
}

function getBrowserGeolocation(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c: Coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          source: 'geolocation',
          timestamp: Date.now(),
        };
        writeCache(c);
        resolve(c);
      },
      (err) => reject(err),
      { timeout: 8000, maximumAge: CACHE_TTL_MS, enableHighAccuracy: false }
    );
  });
}

async function getIPGeolocation(): Promise<Coords> {
  // ipapi.co is free (no key), CORS-enabled, reasonable precision
  const res = await fetch('https://ipapi.co/json/');
  if (!res.ok) throw new Error('IP geolocation failed');
  const data = await res.json();
  if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
    throw new Error('Invalid IP geolocation response');
  }
  const c: Coords = {
    lat: data.latitude,
    lng: data.longitude,
    city: data.city,
    country: data.country_name,
    source: 'ip',
    timestamp: Date.now(),
  };
  writeCache(c);
  return c;
}

export async function resolveCoordinates(options: { skipCache?: boolean; skipBrowser?: boolean } = {}): Promise<Coords> {
  if (!options.skipCache) {
    const cached = readCache();
    if (cached) return cached;
  }

  if (!options.skipBrowser) {
    try {
      return await getBrowserGeolocation();
    } catch {
      // fall through to IP
    }
  }

  return await getIPGeolocation();
}

export function clearCoordsCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}
