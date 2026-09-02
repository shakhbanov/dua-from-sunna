# PAGE-TYPE MATRIX

All 372 prerendered pages, verified against `dist/` (identical to deployed `gh-pages` HEAD).

## Page types that exist

| Type | URL pattern | Count | HTTP | Index | Follow | Canonical | Sitemap | H1 | Structured data | Inbound links |
|------|-------------|-------|------|-------|--------|-----------|---------|-----|-----------------|---------------|
| Home | `/` · `/en/` | 2 | 200 | ✅ | ✅ | self ✅ | ✅ | ⚠️ 2 (neither is topic) | WebSite, CreativeWork | 340 / 340 |
| Chapter (Sunnah) | `/<slug>/` · `/en/<slug>/` | 268 | 200 | ✅ | ✅ | self ✅ | ✅ | ⚠️ 2 (title is H2) | +Article, Breadcrumb, AudioObject, FAQ | 2 |
| Chapter (Quran) | `/dua-iz-korana/<slug>/` · `/en/quran-duas/<slug>/` | 74 | 200 | ✅ | ✅ | self ✅ | ✅ | ⚠️ 2 (title is H2) | +Article, Breadcrumb, AudioObject | 2 |
| Collection index | `/dua-iz-korana/` · `/en/quran-duas/` | 2 | 200 | ✅ | ✅ | self ✅ | ✅ | ⚠️ 2 (1 correct) | WebSite, CreativeWork only | **0 — orphan** |
| Categories index | `/kategorii/` · `/en/categories/` | 2 | 200 | ✅ | ✅ | self ✅ | ✅ | ⚠️ 2 (1 correct) | WebSite, CreativeWork only | **0 — orphan** |
| Category | `/<cat-slug>/` · `/en/<cat-slug>/` | 24 | 200 | ✅ | ✅ | self ✅ | ✅ | ⚠️ 2 (1 correct) | WebSite, CreativeWork only | 2 (unreachable from `/`) |
| Prayer times | `/namaz/` · `/en/prayer-times/` | 2 | 200 | ✅ | ✅ | self ✅ | ✅ | ⚠️ 2 | WebSite, CreativeWork only | **0 — orphan** |
| 404 | any unmatched | — | **404** ✅ | `noindex` ✅ | — | none | ❌ | — | none | — |

**Totals:** 372 pages · 372 indexable · 372 with correct self-canonical · 372 in sitemap · 0 with conflicting robots signals.

### Duplication and thin-content risk

| Risk | Assessment |
|------|------------|
| Duplicate titles | **None** — 372/372 unique |
| Duplicate descriptions | **None** — derived per chapter with a 4-level fallback chain |
| Duplicate URLs | **None** — build fails on collision (`prerender.mjs:39-52`) |
| Thin content — categories | ⚠️ 24 pages: summary + link list only (P4-03) |
| Thin content — chapters | Low: Arabic + word-by-word translation + citation per dua |
| Empty taxonomy pages | **None** — every category maps to ≥1 chapter |

---

## Page types that do NOT exist

Confirmed absent by scanning all 372 rendered pages and `allRoutes()`.

| Type | Status | Assessment |
|------|--------|------------|
| Author page | **ABSENT** | ⚠️ P2-07 — the most consequential gap |
| About | **ABSENT** | ⚠️ P2-07 |
| Editorial policy | **ABSENT** | ⚠️ P2-07 |
| Corrections policy | **ABSENT** | ⚠️ P2-07 |
| Contact | **ABSENT** | ⚠️ P2-07 |
| Privacy / Terms | **ABSENT** | ⚠️ Also a PWA-store and GDPR consideration |
| Search results | **ABSENT** | ✅ **Good** — search is a client-side filter with no URL, so no crawl trap and no thin SERP pages. Note this contradicts the `SearchAction` schema (P2-03) |
| Pagination | **ABSENT** | ✅ N/A — no list exceeds 134 items; all render in full |
| Filter / faceted nav | **ABSENT** | ✅ **Good** — zero faceted-navigation crawl-explosion risk |
| Archive (date-based) | **ABSENT** | ✅ N/A — no dates exist in the content model |
| Tag pages | **ABSENT** | Categories serve this role; no uncontrolled tag generation |
| User profile / account / login / subscription | **ABSENT** | ✅ N/A — no auth, no accounts |
| Comments / UGC | **ABSENT** | ✅ N/A — see [UGC-COMMENTS.md](UGC-COMMENTS.md) |
| RSS / feeds | **ABSENT** | ⚠️ See [CONTENT-ARCHITECTURE.md](CONTENT-ARCHITECTURE.md) |
| Video pages | **ABSENT** | ✅ N/A — no video content |
| API | **ABSENT** | N/A — `llms.txt`/`llms-full.txt` serve as the machine-readable surface |

## Environments

| Environment | Status |
|-------------|--------|
| Production | `https://dua.shakhbanov.org` — 200, live |
| `github.io` alias | `shakhbanov.github.io/dua-from-sunna/` → **301** to custom domain ✅ (but to `http://` — P2-06) |
| Staging / preview / dev | **None exist.** No preview deployments, no `staging.*`/`dev.*` DNS. ✅ **No indexable-staging risk** |
