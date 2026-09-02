// Quranic supplications collection.
// Chapter ids live in the 2000+ range so they never collide with the 1..134
// ids of the Sunnah collection — several places (OG image names, AudioObject
// @id, prev/next) key off the bare chapter id.

import type { ChapterData } from '../../types';
import { QURAN_CHAPTER_2001 } from './2001-good-in-both-worlds';
import { QURAN_CHAPTER_2002 } from './2002-forgiveness-and-repentance';
import { QURAN_CHAPTER_2003 } from './2003-steadfastness-in-faith';
import { QURAN_CHAPTER_2004 } from './2004-distress-hardship-and-illness';
import { QURAN_CHAPTER_2005 } from './2005-knowledge-and-clear-speech';
import { QURAN_CHAPTER_2006 } from './2006-family-and-offspring';
import { QURAN_CHAPTER_2007 } from './2007-duas-for-parents';
import { QURAN_CHAPTER_2008 } from './2008-provision-and-need';
import { QURAN_CHAPTER_2009 } from './2009-oppression-and-enmity';
import { QURAN_CHAPTER_2010 } from './2010-light-and-salvation-on-judgement-day';

export const QURAN_DATABASE: ChapterData[] = [
  QURAN_CHAPTER_2001,
  QURAN_CHAPTER_2002,
  QURAN_CHAPTER_2003,
  QURAN_CHAPTER_2004,
  QURAN_CHAPTER_2005,
  QURAN_CHAPTER_2006,
  QURAN_CHAPTER_2007,
  QURAN_CHAPTER_2008,
  QURAN_CHAPTER_2009,
  QURAN_CHAPTER_2010,
];
