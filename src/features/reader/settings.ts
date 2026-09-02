/** What the reader shows under each Arabic word, toggled from the header menu. */
export interface ReaderSettings {
  /** Word-by-word translation under every word. */
  showTranslation: boolean;
  /** Dim words that are not currently being recited. */
  enableHighlight: boolean;
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  showTranslation: true,
  enableHighlight: true,
};
