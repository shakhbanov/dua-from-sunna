export interface KeyedParagraph {
  key: string;
  text: string;
}

/**
 * Pairs each paragraph with a key derived from where it starts in the joined
 * text. Prose lists never reorder, but the offset is a real identity — unlike
 * the array index, it does not shift when a paragraph above it is edited.
 */
export function keyedParagraphs(paragraphs: string[]): KeyedParagraph[] {
  let offset = 0;
  return paragraphs.map((text) => {
    const keyed: KeyedParagraph = { key: `p${offset}`, text };
    offset += text.length + 1;
    return keyed;
  });
}
