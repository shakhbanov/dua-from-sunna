# URL ARCHITECTURE

**Verdict: the strongest area of the audit — with one structural liability.**

## How URLs are produced

`src/router/routes.ts` is the single source of truth. `allRoutes()` generates every path; `buildChapterPath()`, `buildCategoryPath()`, `buildCollectionIndexPath()`, `buildPrayerTimesPath()` and `buildHomePath()` are the only constructors. Prerender, sitemap, OG generation and llms.txt all consume the same table via `routeCatalog()` — nothing re-derives URLs by parsing data files with regexes. This is the correct architecture and it is why canonical/sitemap parity is perfect.

```
sunna  ru → /<slug>/                       sunna  en → /en/<slug>/
quran  ru → /dua-iz-korana/<slug>/         quran  en → /en/quran-duas/<slug>/
```

## Verified properties

| Property | Result |
|----------|--------|
| Trailing slash | ✅ Consistent — every path ends `/`; `matchRoute()` normalises |
| Case | ✅ All lowercase |
| Readability | ✅ Transliterated, descriptive, hyphenated |
| Query parameters | ✅ None in the canonical URL space |
| Duplicate URLs | ✅ **Build fails on collision** — `prerender.mjs:39-52` |
| Depth | ✅ Max 3 segments (`/en/quran-duas/<slug>/`) |
| Encoding | ✅ ASCII-only; no percent-encoding |
| Host normalisation | ✅ `github.io` → custom domain (301) |
| HTTPS | ⚠️ Works, but `http://` also serves 200 (P2-06) |
| `www` | ✅ Not configured — no duplicate host |

The collision guard deserves emphasis: it fails the build if a category slug ever shadows a chapter slug. Most sites discover that class of bug in production.

## The liability: URLs are effectively immutable, but are being changed

Static hosting provides no 301. The Quran restructure (`9419908`) changed 20 URLs and produced 20 permanent 404s (P1-01). The route table is well-designed enough that slug changes are *easy to make* — which, without a redirect layer, is a hazard rather than a feature.

**Legacy handling that does exist:** `legacyQueryToPath()` migrates the pre-clean-URL query form (`/?chapter=N&lang=en`) to clean paths client-side. This is a good pattern — but it runs only after the SPA boots on a page that already returned 200, so it cannot help URLs that 404.

## Crawl-explosion risk: none

Assessed explicitly per the brief. The worst-case URL space is **372 URLs — the exact size of the sitemap.**

| Vector | Status |
|--------|--------|
| Faceted navigation | Does not exist |
| Sort parameters | Do not exist |
| Search URLs | Search is a client-side filter over `searchQuery`; no URL representation |
| Calendar archives | Do not exist |
| Session/tracking params | None generated internally |
| Infinite pagination | Does not exist |

Combined with `Allow: /` in robots.txt and no parameter handling, this is safe **only because the URL space is closed by construction**. If search, filtering or pagination is ever added, this section must be re-audited before launch — the current `robots.txt` would permit unlimited crawling of whatever appears.

## Scale assessment

At 100k articles the URL *scheme* holds up fine — it is flat, readable and collision-guarded. What does not hold up is the absence of a redirect layer (any editorial reorganisation becomes destructive) and the single flat sitemap (see [SITEMAPS.md](SITEMAPS.md)).
