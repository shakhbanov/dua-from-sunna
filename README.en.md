[Русский](./README.md) · **English**

# Dua — Fortress of the Muslim

Digital edition of *Hisn al-Muslim* (The Fortress of the Muslim) — a compendium of duas and adhkars from the Sunnah. 134 chapters with audio, word-by-word Arabic/Russian/English translation, commentary, and sources for every supplication.

**Live site:** [dua.shakhbanov.org](https://dua.shakhbanov.org)

## Features

- **134 chapters, ~280 duas** — the complete text of Hisn al-Muslim preserving the original book structure
- **Audio** — recording for every dua (hosted on S3) with a player, playback-speed and volume controls
- **Word-by-word translation** — Arabic text synchronized with audio via per-word timecodes, active word highlighted
- **Two UI languages** — Russian and English; auto-detected from `navigator.language`, time zone, and user preference
- **Sources** — every dua is cited to a hadith collection (al-Bukhari, Muslim, an-Nasa'i, Abu Dawud, at-Tirmidhi, Ibn Majah, Ahmad, etc.) in both languages
- **Prayer times** — geolocation-based computation via `adhan-js` with selectable method (DUM RF / Russia, MWL, Karachi, Egyptian, Umm al-Qura, Turkey, ISNA, etc.) and madhab (Shafi / Hanafi)
- **Local notifications** — reminders for prayer times and morning/evening adhkar
- **PWA** — installable on Android and iOS (16.4+), works offline
- **Dark mode** — automatic from OS preference, toggle in the header
- **Responsive UI** — optimised for mobile, tablet, and desktop

## Stack

| Area | Technology |
|------|-----------|
| Frontend | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS (CDN), CSS custom properties for theming |
| Icons | lucide-react |
| Prayer times | adhan-js |
| PWA | vite-plugin-pwa + Workbox (injectManifest) |
| Analytics | Yandex.Metrika (ID in `.env.local`) |
| Hosting | GitHub Pages (`gh-pages` branch) |
| Domain | `dua.shakhbanov.org` (CNAME) |
| Audio CDN | s3.shakhbanov.org |

React, lucide-react, and adhan are loaded in the browser via a native import map from `esm.sh`, so the bundle stays small.

## Project layout

```
hisn-al-muslim/
├── data/
│   └── chapters/                  # 134 .ts files, one per chapter
│       └── NNN-slug.ts            # ChapterData with a duas array
├── components/
│   ├── Player.tsx                 # Audio player with seek/speed/volume
│   ├── WordGrid.tsx               # Word-by-word grid with highlighting
│   └── PrayerTimesPanel.tsx       # Prayer-times panel with settings
├── src/
│   ├── i18n/
│   │   ├── detectLanguage.ts      # User-language detection
│   │   └── strings.ts             # UI strings ru/en
│   ├── features/
│   │   ├── prayer/                # adhan wrapper + settings
│   │   ├── geolocation/           # Geolocation API + IP fallback
│   │   └── notifications/         # Local push scheduling
│   ├── analytics/
│   │   └── yandexMetrika.ts       # SPA page-view tracker
│   ├── seo/
│   │   └── updateMetaTags.ts      # Dynamic OG/hreflang/JSON-LD
│   └── sw/
│       └── service-worker.ts      # Workbox: offline cache, notification scheduler
├── public/
│   ├── icons/                     # Android/iOS PWA icons
│   ├── splashes/                  # 14 Apple splash screens
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── sitemap.xml                # Regenerated on build
├── scripts/
│   ├── generate-sitemap.mjs       # 272 URLs × hreflang
│   ├── generate-splashes.sh       # SVG → PNG for iOS splashes
│   ├── translate-sources.mjs      # RU → EN source transliteration
│   └── fix-source-en.mjs
├── App.tsx
├── index.html
├── constants.ts                   # MOCK_DATABASE — imports all chapters
├── types.ts                       # ChapterData / DuaItem / WordSync / Language
└── vite.config.ts
```

## Data model

Every dua in `data/chapters/NNN-slug.ts` is a `DuaItem` object:

```ts
interface DuaItem {
  id: string;                      // "3-1", "29-17a", ...
  audioUrl: string;
  narration?: { ru: string; en: string };          // Hadith context before the dua
  fullTranslation: { ru: string; en: string };     // Literary translation
  note?: { ru: string; en: string };               // Note rendered after the dua
  source?: { ru: string; en: string };             // Hadith citation
  sync: WordSync[];                                // Word-by-word breakdown + timecodes
}

interface WordSync {
  text: string;                    // Arabic word
  trans: { ru: string; en: string };
  start: number;                   // Seconds from start of audio
  end: number;
}
```

Chapters are indexed in `constants.ts` and exported as `MOCK_DATABASE`.

## Running locally

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Opens on `http://localhost:5050`.

## Build and deploy

### Automatic deploy via GitHub Actions

On every push to `main` the workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Installs dependencies
2. Builds the app via `npm run build`
3. Publishes `dist/` to the `gh-pages` branch

GitHub Pages serves `gh-pages` at `dua.shakhbanov.org` (CNAME configured in DNS).

### Manual deploy via worktree

```bash
npm run build

git worktree add -B gh-pages /tmp/gh-pages-deploy origin/gh-pages
rm -rf /tmp/gh-pages-deploy/*
cp -r dist/* /tmp/gh-pages-deploy/
echo "dua.shakhbanov.org" > /tmp/gh-pages-deploy/CNAME
cp /tmp/gh-pages-deploy/index.html /tmp/gh-pages-deploy/404.html

cd /tmp/gh-pages-deploy
git add -A
git commit -m "Deploy"
git push origin gh-pages
cd -
git worktree remove /tmp/gh-pages-deploy --force
```

`404.html = index.html` is required so GitHub Pages correctly serves the SPA when query parameters are used (`?chapter=N&lang=ru`).

## NPM scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 5050 with HMR |
| `npm run build` | Production build in `dist/` + sitemap generation |
| `npm run preview` | Local preview of the built site |
| `npm run sitemap` | Regenerate `sitemap.xml` standalone |

## Working with chapters

Each chapter is a standalone TypeScript file. Minimal example:

```ts
// data/chapters/003-supplications-upon-waking-up.ts
import { ChapterData } from '../../types';

export const CHAPTER_003: ChapterData = {
  id: 3,
  title: { ru: "Слова поминания при пробуждении", en: "Supplications upon waking up" },
  duas: [
    {
      id: "3-1",
      audioUrl: "https://s3.shakhbanov.org/hisn-al-muslim/1.wav",
      fullTranslation: {
        ru: "Хвала Аллаху, Который оживил нас…",
        en: "All praise is for Allah who gave us life…"
      },
      sync: [
        { text: "الْحَمْدُ", trans: { ru: "Хвала", en: "Praise" }, start: 0.240, end: 1.101 },
        // ...
      ],
      source: { ru: "аль-Бухари 6312; Муслим 2711", en: "al-Bukhari 6312; Muslim 2711" }
    }
  ]
};
```

### Adding a new chapter

1. Create `data/chapters/NNN-slug.ts`
2. Add an import and entry in `constants.ts`:
   ```ts
   import { CHAPTER_NNN } from './data/chapters/NNN-slug';
   // …
   export const MOCK_DATABASE = [/* …, */ CHAPTER_NNN];
   ```
3. The new chapter is automatically included in the sitemap on the next build

### Sources (bilingual)

The `source` field is always `{ ru: string; en: string }`. The utility [`scripts/translate-sources.mjs`](scripts/translate-sources.mjs) transliterates Russian citations into English (аль-Бухари → al-Bukhari, ат-Тирмизи → at-Tirmidhi, etc.) — use it when migrating legacy data.

## Routing

The app is a SPA, but state is mirrored into the URL via query parameters:

| Parameter | Values | Example |
|-----------|--------|---------|
| `chapter` | 1–136 | `?chapter=29` |
| `lang` | `ru`, `en` | `?lang=en` |
| `view` | `chapter`, `prayer-times` | `?view=prayer-times` |
| `q` | string | `?q=morning` |

`history.replaceState` updates the URL without reloading. `popstate` handles Back/Forward.

## PWA

The Service Worker provides:

- **Precache** of all static assets on first visit
- **NetworkFirst** for HTML (updates land quickly)
- **CacheFirst** for S3 audio (30 days, 300 entries, Range-request support)
- **StaleWhileRevalidate** for Google Fonts, Tailwind CDN, esm.sh, Yandex.Metrika
- **Local notification scheduler** via `postMessage` → `setTimeout`

### iOS limitations

Web push on iOS (16.4+) only works after the PWA has been added to the home screen via Safari → Share → Add to Home Screen. Before that, requesting permission returns `denied`. The prayer-times panel surfaces a hint for iOS users.

Background push (while the PWA is closed) requires a server-side backend with VAPID — not implemented here. Currently only local notifications are scheduled; they fire while the app is open or recently backgrounded.

## SEO

- **Dynamic meta tags** — `<title>`, description, canonical, Open Graph, Twitter Cards update on every chapter/language/view change through [`updateMetaTags.ts`](src/seo/updateMetaTags.ts)
- **hreflang** — `ru` / `en` / `x-default` alternates for each page
- **Schema.org JSON-LD** — `WebSite`, `Book` (site-wide), `Article` + `BreadcrumbList` (per chapter)
- **Sitemap** — [`sitemap.xml`](https://dua.shakhbanov.org/sitemap.xml): 272 URLs with `xhtml:link hreflang`
- **robots.txt** — links to the sitemap
- Verification for Yandex.Webmaster and Google Search Console (files are generated at build time from `.env.local`)

## Analytics

Yandex.Metrika with webvisor, click map, link tracking, and accurate bounce detection. The counter ID lives in `.env.local` (`VITE_YANDEX_METRIKA_ID`) and is substituted into `index.html` at build time. SPA navigations between chapters send `ym('hit', url, {title})` manually.

## Secrets and environment variables

No identifiers (counter IDs, verification codes) are stored in the repository. Copy [`.env.local.example`](.env.local.example) to `.env.local` and fill in your own values:

```bash
cp .env.local.example .env.local
# edit .env.local
```

| Variable | Purpose |
|----------|---------|
| `VITE_YANDEX_METRIKA_ID` | Yandex.Metrika counter ID |
| `VITE_YANDEX_WEBMASTER_CODE` | Code from the `yandex_<CODE>.html` filename |
| `VITE_GOOGLE_VERIFICATION_CODE` | Code from the `google<CODE>.html` filename |

At build time, [`scripts/generate-verification.mjs`](scripts/generate-verification.mjs) writes the verification files straight into `dist/` — they reach `gh-pages` but never the source tree.

## License

The original Hisn al-Muslim text is in the public domain; the Russian translation and commentary are taken from the printed edition (see the [source](https://umma.ru/books/khisn-al-muslim/)). Application source code — MIT.
