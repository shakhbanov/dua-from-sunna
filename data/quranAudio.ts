// Recitation audio for Quranic duas.
//
// We host no recordings of our own for the Quran collection, so the audio is
// resolved from the ayah reference against the AlQuran Cloud CDN, which serves
// one MP3 per ayah addressed by its *global* number (1…6236) rather than by
// sura:ayah. Deriving the URL from `DuaItem.ref` means a new Quranic chapter
// gets audio for free — there is no per-dua URL to fill in.
//
// Caveat worth surfacing in the UI: the recitation covers the whole ayah, while
// many duas quote only the supplication part of it.

import type { QuranRef } from '../types';

/** Ayah count of each sura, 1..114. Sums to 6236. */
const AYAH_COUNTS: readonly number[] = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111,
  110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45,
  83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55,
  78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20,
  56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21,
  11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

/** Cumulative ayah count before each sura, so OFFSETS[s - 1] + ayah = global number. */
const OFFSETS: readonly number[] = (() => {
  const out: number[] = [0];
  for (const n of AYAH_COUNTS) out.push(out[out.length - 1] + n);
  return out;
})();

export const RECITER = {
  /** CDN path segment. */
  id: 'ar.alafasy',
  name: {
    ru: 'Мишари Рашид аль-‘Афаси',
    en: 'Mishary Rashid Alafasy',
  },
} as const;

const CDN = 'https://cdn.islamic.network/quran/audio/128';

export function globalAyahNumber(sura: number, ayah: number): number | null {
  if (sura < 1 || sura > 114) return null;
  if (ayah < 1 || ayah > AYAH_COUNTS[sura - 1]) return null;
  return OFFSETS[sura - 1] + ayah;
}

/**
 * One audio URL per ayah of the reference, in recitation order. A dua spanning
 * 20:25–28 yields four segments, played back to back.
 */
export function quranAudioSegments(ref: QuranRef): string[] {
  const to = ref.ayahTo ?? ref.ayahFrom;
  const urls: string[] = [];
  for (let ayah = ref.ayahFrom; ayah <= to; ayah++) {
    const n = globalAyahNumber(ref.sura, ayah);
    if (n === null) continue;
    urls.push(`${CDN}/${RECITER.id}/${n}.mp3`);
  }
  return urls;
}
