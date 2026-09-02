# INDEXABILITY AUDIT

**Headline: there are zero conflicting indexability signals anywhere on this site.** That is unusual and worth stating plainly before the problems.

## Per-page-type determination

| Page type | Count | Determination |
|-----------|-------|---------------|
| Home (RU/EN) | 2 | **INDEX, FOLLOW** |
| Chapter — Sunnah | 268 | **INDEX, FOLLOW** |
| Chapter — Quran | 74 | **INDEX, FOLLOW** |
| Collection index | 2 | **INDEX, FOLLOW** — but orphaned |
| Categories index | 2 | **INDEX, FOLLOW** — but orphaned |
| Category | 24 | **INDEX, FOLLOW** — but unreachable from `/` |
| Prayer times | 2 | **INDEX, FOLLOW** — but orphaned |
| `404.html` | — | **NOINDEX** ✅ correct, and serves HTTP 404 |

No page is AUTH-GATED, BLOCKED, or CANONICAL-TO-OTHER. There are no private, paywalled or member-only surfaces.

## Signal-conflict matrix

Checked across all 372 pages:

| Signal pair | Conflicts found |
|-------------|-----------------|
| `robots.txt` vs meta robots | **0** |
| meta robots vs canonical | **0** |
| canonical vs sitemap | **0** |
| sitemap vs HTTP status | **0** |
| canonical vs `og:url` | **0** |
| canonical vs hreflang | **0** |
| internal links vs canonical | **0** |
| redirects vs canonical | N/A — no redirects exist |

`X-Robots-Tag` is not present on any response — correct here, since nothing needs suppressing, though it is also **not available** as a tool on this hosting (P1-02).

## Findings

### ✅ No accidentally noindexed pages
No `<meta name="robots">` appears on any of the 372 content pages. Absence means index/follow by default, which is the intent. The only `noindex` is on `404.html`, correctly.

### ✅ No accidentally indexed pages
There are no test, staging, preview, draft, admin or duplicate pages in the build. Every one of the 372 files corresponds to a deliberate route in `allRoutes()`.

### ✅ No blocked pages needing crawl
`robots.txt` disallows nothing. CSS, JS and images are all crawlable.

### ⚠️ Discovery is sitemap-dependent
All 372 pages are *indexable*, but 6 are **orphans** and 31 are **unreachable from `/`** by following links:

```
Orphans (0 inbound internal links):
  /kategorii/          /en/categories/
  /namaz/              /en/prayer-times/
  /dua-iz-korana/      /en/quran-duas/
```

Being in the sitemap makes these discoverable. It does not make them *important* — a URL with zero internal links receives no link equity and reads as low-priority regardless of its sitemap presence. See [INTERNAL-LINKING.md](INTERNAL-LINKING.md).

### ⚠️ Thin-content candidates
The 24 category pages carry only a summary sentence plus a chapter list (P4-03). They are the pages best positioned for head terms and are currently both thin and unreachable.

### 🔴 20 URLs removed from the index space without redirects
See [FINDINGS.md#p1-01](FINDINGS.md). These were indexable and linked; they are now 404.

## Field verification: NOT AUDITABLE

Actual indexation status — how many of the 372 pages Google has indexed, crawl frequency, `Discovered – currently not indexed` counts — **cannot be determined from this audit**. Google Search Console is not connected to this repository and no exported data is available. Per audit rule 36 this is recorded as NOT AUDITABLE, not as a pass. Connecting GSC is the first item in [AUTOMATION.md](AUTOMATION.md).
