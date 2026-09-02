# SITEMAP AUDIT

**Result: the sitemap is exact — 372/372 parity with the build, in both directions.**

## Verification

```
sitemap URLs:                              372
sitemap URLs with no prerendered page:       0
prerendered pages missing from sitemap:      0
dist/sitemap.xml == public/sitemap.xml:    yes (md5 c221955c…)
```

Every `<loc>` → 200 → indexable → self-canonical → canonical equals the sitemap URL. The full chain the brief asks for holds for all 372 entries.

## Structure

`scripts/generate-sitemap.mjs` imports `routeCatalog()` from the SSR bundle rather than parsing data files — the same source of truth as the router and the prerenderer. It pairs RU/EN routes by view + identifier and emits `xhtml:link` alternates inline.

```xml
<url>
  <loc>https://dua.shakhbanov.org/dua-iz-korana/dua-iz-sury-al-fatiha/</loc>
  <lastmod>2026-09-02</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
  <xhtml:link rel="alternate" hreflang="ru" href="…/dua-iz-korana/dua-iz-sury-al-fatiha/" />
  <xhtml:link rel="alternate" hreflang="en" href="…/en/quran-duas/duas-from-surah-al-fatihah/" />
  <xhtml:link rel="alternate" hreflang="x-default" href="…/dua-iz-korana/dua-iz-sury-al-fatiha/" />
</url>
```

| Check | Result |
|-------|--------|
| Valid XML, correct namespaces | ✅ `sitemaps.org/0.9` + `xhtml` |
| Referenced in `robots.txt` | ✅ |
| Absolute HTTPS URLs, correct host | ✅ 372/372 |
| Only canonical URLs | ✅ |
| No redirects, 404s or noindex | ✅ |
| No duplicates | ✅ |
| No stale or deleted URLs | ✅ |
| Size / count limits | ✅ 218 KB, 372 URLs — far under 50 MB / 50,000 |
| Unpaired routes | ✅ 0 — the generator warns and skips, and warns on nothing |

## Issues

### ⚠️ P3-01 — `lastmod` is the build date for all 372 URLs

```js
const today = new Date().toISOString().split('T')[0];   // generate-sitemap.mjs:19
```

Distinct `<lastmod>` values in the file: **`['2026-09-02']`** — one value, everywhere, rewritten every deploy. This tells crawlers all 372 pages change on every build, which is false and causes the signal to be discounted. Fix: derive per-chapter dates from `git log -1 --format=%aI -- <data file>`; the same derivation resolves P2-02.

### ⚠️ `changefreq` and `priority` are advisory only

`PRIORITY` in the generator assigns `daily`/`1.0` to home down to `monthly`/`0.7` for chapters. Google ignores both fields. Harmless, but they are not doing the work they appear to be doing — real prioritisation comes from internal linking, which is where the actual problem is ([INTERNAL-LINKING.md](INTERNAL-LINKING.md)).

### ⚠️ Missing specialised sitemaps

| Type | Status |
|------|--------|
| Sitemap index | Absent — not needed at 372 URLs, **required past 50,000** |
| Image sitemap | N/A — no content images |
| Video sitemap | N/A — no video |
| News sitemap | **Correctly absent** — see below |

### ✅ News SEO: correctly N/A

This site publishes a **reference corpus, not news**. There are no timely articles, no publication cadence, no reporting. `NewsArticle` schema and a Google News sitemap would both be inappropriate, and the code correctly emits neither — `articleSchema()` uses plain `Article`. Marking every page `NewsArticle` is a common over-application; this codebase avoids it. Recorded as **N/A, correctly handled**.

## Scale assessment

The single flat sitemap works at 372 URLs and breaks at 50,000. There is no sitemap index, no sharding by collection or language, and no incremental generation — the file is fully rewritten each build. At 100k articles this needs to become a sitemap index over per-collection shards. See the final verdict in [REMEDIATION-ROADMAP.md](REMEDIATION-ROADMAP.md).
