import React from 'react';
import { MapPin, RefreshCw, Loader2 } from 'lucide-react';
import type { UIStrings } from '../../src/i18n/strings';
import type { Coords } from '../../src/features/geolocation/resolveCoordinates';

interface Props {
  t: UIStrings;
  coords: Coords | null;
  loading: boolean;
  onRefresh: () => void;
}

function locationLabel(t: UIStrings, coords: Coords | null, loading: boolean): string {
  if (loading && !coords) return t.detectingLocation;
  if (!coords) return '—';
  if (coords.city && coords.country) return `${coords.city}, ${coords.country}`;
  return `${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`;
}

const LocationCard: React.FC<Props> = ({ t, coords, loading, onRefresh }) => (
  <div className="flex items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-surface">
    <div className="flex items-center gap-3 min-w-0">
      <MapPin size={18} className="shrink-0 text-neutral-500" />
      <div className="min-w-0">
        <div className="text-xs text-neutral-500 uppercase tracking-wide">{t.location}</div>
        <div className="text-sm font-medium truncate">{locationLabel(t, coords, loading)}</div>
        {coords?.source === 'ip' && (
          <div className="text-[11px] text-neutral-400 mt-0.5">{t.locationDenied}</div>
        )}
      </div>
    </div>
    <button
      onClick={onRefresh}
      disabled={loading}
      aria-label={t.refresh}
      title={t.refresh}
      className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
    </button>
  </div>
);

export default LocationCard;
