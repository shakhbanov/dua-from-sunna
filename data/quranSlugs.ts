// Slugs for the Quranic supplications collection. Hand-maintained: these are
// SEO landing pages, so the RU slug is a keyword phrase rather than a
// transliteration of the full chapter title.

export interface ChapterSlugs {
  ru: string;
  en: string;
}

export const QURAN_CHAPTER_SLUGS: Record<number, ChapterSlugs> = {
  2001: { ru: "dua-o-blage-v-oboikh-mirakh", en: "duas-for-good-in-both-worlds" },
  2002: { ru: "dua-o-proshchenii-grekhov", en: "duas-for-forgiveness-of-sins" },
  2003: { ru: "dua-o-stoykosti-very", en: "duas-for-steadfastness-in-faith" },
  2004: { ru: "dua-pri-trevoge-i-bede", en: "duas-in-distress-and-hardship" },
  2005: { ru: "dua-o-znanii", en: "duas-for-knowledge" },
  2006: { ru: "dua-o-potomstve", en: "duas-for-righteous-offspring" },
  2007: { ru: "dua-za-roditeley", en: "duas-for-parents" },
  2008: { ru: "dua-o-propitanii", en: "duas-for-provision" },
  2009: { ru: "dua-pri-nespravedlivosti", en: "duas-against-oppression" },
  2010: { ru: "dua-o-svete-v-sudnyy-den", en: "duas-for-light-on-judgement-day" },
};

export function getQuranChapterSlug(id: number, lang: "ru" | "en"): string {
  const s = QURAN_CHAPTER_SLUGS[id];
  if (!s) throw new Error(`No Quran slug for chapter ${id}`);
  return s[lang];
}
