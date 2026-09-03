# PERFORMANCE / CORE WEB VITALS

**Score: 5.0 / 8. Lab measurement only — field data is NOT AUDITABLE.**

## Field data: NOT AUDITABLE

CrUX, Search Console and GA4 are not connected to this repository, and no exported data is available. Real-user LCP, INP and CLS **cannot be reported**. Per audit rule 36 this is recorded as NOT AUDITABLE, not as a pass. Everything below is lab/static analysis of the built artifact and live HTTP responses.

## Measured

| Metric | Value | Assessment |
|--------|-------|------------|
| TTFB (live, Fastly `fra` edge) | **327–375 ms** | ✅ Good |
| HTML per chapter page | 57 KB raw / **9.3 KB gzip** | ✅ Good |
| HTML homepage | 187 KB raw / ~15 KB gzip | ⚠️ Large — 340 inline links |
| CSS | 28,931 B / **5,876 B gzip** | ✅ Excellent |
| **JS main chunk** | 1,302,901 B / **319,472 B gzip** | 🔴 **Too large** |
| JS `adhan` chunk | 13,952 B / 4,814 B gzip | ✅ Correctly split |
| Content images | **0** | ✅ No image LCP risk |
| Service worker precache | 48 entries | ✅ |
| Compression | gzip via Fastly | ✅ (Brotli not offered) |
| Cache-Control | `max-age=600` on all assets | ⚠️ Platform default |

## What is done well

**Content is fully prerendered.** Arabic text, translations and citations are in the raw HTML. First paint does not wait on JavaScript, which is the single most important performance decision for a content site and it is already made correctly. LCP is almost certainly a text node rendered from static HTML.

**No content images at all.** The design is typographic, so there is no image LCP, no CLS from unsized images, no `srcset`/lazy-loading complexity, and no alt-text debt. An unusual but genuinely favourable position.

**CSS is 5.9 KB gzip** — Tailwind is being purged correctly.

## Problems

### 🔴 319 KB gzip JavaScript in one chunk (P3-06)

The bundle statically imports the entire corpus:

```
data/chapters/*.ts   (135 files)   data/quran/*.ts      (40 files)
data/descriptions.ts (134 KB)      data/categories.ts   (32 KB)
data/slugs.ts        (38 KB)
```

Every visitor downloads and parses data for all 372 pages to read one. Because content is prerendered, this does **not** delay LCP — but it does drive:

- **INP risk** — hydrating a tree over a 1.3 MB parsed module graph on mid-range mobile.
- **Mobile data cost** — 319 KB before any interaction, on a site whose audience is substantially mobile.
- **Unbounded growth** — the bundle grows linearly with the archive. This is the hardest scaling ceiling in the audit.

**Fix:** emit each chapter's data as a JSON island in its own prerendered HTML; dynamic-import the rest. Split `descriptions.ts` and `categories.ts` out of the main chunk. Target: main chunk under 120 KB gzip.

### ⚠️ Render-blocking third-party fonts (P4-01)

```html
<link href="https://fonts.googleapis.com/css2?family=Amiri…&family=Aref+Ruqaa…
      &family=Inter…&family=Scheherazade+New…" rel="stylesheet">
```

Four families from a third-party origin, render-blocking, while `@fontsource/amiri`, `@fontsource/inter` and `@fontsource/scheherazade-new` are already installed as devDependencies and unused. `preconnect` hints are present and help, but the round-trip and the cross-origin dependency remain. Arabic faces are large; this likely delays text paint on slow connections.

`Aref Ruqaa` has no `@fontsource` package installed — it must be added or dropped when self-hosting.

### ⚠️ Homepage carries 340 inline links

187 KB of HTML, most of it the full chapter list. Acceptable today; it is the same O(n) pattern that breaks at scale ([INTERNAL-LINKING.md](INTERNAL-LINKING.md)).

### ⚠️ `cache-control: max-age=600` on hashed assets

`/assets/index-BVnQHUfw.js` is content-hashed and immutable but cached for 10 minutes — the GitHub Pages default. `immutable, max-age=31536000` is correct for hashed assets. **Not changeable on this hosting** (P1-02); a proxy would fix it.

## Third-party scripts

Only Yandex Metrika, and it is properly gated:

```js
var id = '%VITE_YANDEX_METRIKA_ID%';
if (!id || id.charAt(0) === '%') return;    // no-op when unset
```

No Google Analytics, no tag manager, no ad scripts, no consent-management platform. Third-party weight is close to zero — a real strength.

## Priority

1. Self-host fonts, drop the Google Fonts link — **best effort-to-impact ratio here**.
2. Split the content data out of the main bundle.
3. Connect CrUX/GSC so this section stops being NOT AUDITABLE.
4. Cache headers — blocked on P1-02.
