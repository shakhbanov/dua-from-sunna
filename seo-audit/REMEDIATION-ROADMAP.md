# REMEDIATION ROADMAP

Sequenced by dependency and impact-per-hour, not by severity. Effort estimates assume familiarity with the codebase.

---

## Phase 0 — Immediate (< 1 day)

Highest impact per hour in the entire audit.

| # | Action | File | Effort | Fixes |
|---|--------|------|--------|-------|
| 1 | **Enable "Enforce HTTPS"** in repo Settings → Pages | — | 2 min | P2-06 |
| 2 | **`<button>` → `RouteLink`** in `ChapterRow` | `components/Sidebar.tsx:171` | 1 h | P1-03 |
| 3 | **Header/footer links** to `/kategorii/`, `/dua-iz-korana/`, `/namaz/` (×2 languages) | `components/AppHeader.tsx` | 2 h | P1-04, P1-05 |
| 4 | **Language switcher → `<a href>`** to the hreflang counterpart | `components/Sidebar.tsx` | 1 h | P1-05, i18n |
| 5 | **Delete `FAQPage` and `SearchAction`** | `src/seo/updateMetaTags.ts`, `index.html` | 1 h | P2-03, P2-04 |
| 6 | **One `<h1>` per page**: wordmark → `<span>`, drop the constant `<h1>`, chapter title `<h2>` → `<h1>` | `Sidebar.tsx:67`, `ChapterReader.tsx` | 2 h | P2-01, P3-05 |

**Outcome:** 0 orphans, ~370/372 pages reachable, correct heading contract, no fabricated schema, HTTPS enforced. Roughly one working day for the largest single improvement available.

---

## Phase 1 — URL recovery (2–3 days)

| # | Action | Effort | Fixes |
|---|--------|--------|-------|
| 7 | **Reconstruct the thematic→surah mapping** for the 20 retired Quran URLs (editorial: several map to multiple targets) | 4 h | P1-01 |
| 8 | **Emit legacy stub routes** — canonical to successor + `meta refresh` + visible link; excluded from sitemap | 4 h | P1-01 |
| 9 | **Decide on a redirect layer.** Front the Pages origin with Cloudflare (DNS already delegated) for real 301s, HSTS, `X-Robots-Tag` and cache headers | 4 h | P1-02 |

Item 9 is a decision as much as a task. Without it, item 8's stub pattern becomes the permanent mechanism for every future URL change — workable, but a standing tax.

---

## Phase 2 — Dates, entities, trust (1–2 weeks)

| # | Action | Effort | Fixes |
|---|--------|--------|-------|
| 10 | **Derive per-chapter dates from git** (`git log -1 --format=%aI -- <file>`), thread through `routeCatalog()` | 6 h | P2-02, P3-01 |
| 11 | **Complete `Article`**: `datePublished`, `dateModified`, `image`, `url` | 2 h | P2-02 |
| 12 | **Scope static JSON-LD**: move `WebSite`/`Organization` into `buildMetaTags()`; collection schema per collection | 3 h | P2-03 |
| 13 | **`og:type=article` + `article:*`** on chapter routes; strip static `og:type`/`og:site_name` | 2 h | P2-05 |
| 14 | **Visible breadcrumbs + 3-level `BreadcrumbList`** | 4 h | P3-02 |
| 15 | **Prev/next + related-chapter links** | 6 h | P1-03 depth |
| 16 | **About / editorial-policy / corrections / contact** pages (×2 languages) + `Person` and `Organization` schema | 8 h | P2-07 |
| 17 | **Real 404 page** — stop redirecting unknown URLs to `/` | 2 h | P3-03 |
| 18 | **Fix `AudioObject.@id`**; add `duration` from sync timestamps | 2 h | P3-04 |

**Item 16 requires decisions only the site owner can make** — who is named as compiler/translator, what qualifications are stated, whether a scholarly reviewer is credited. This should not be invented; it is flagged as a decision, not a ticket.

---

## Phase 3 — Performance & automation (1–2 weeks)

| # | Action | Effort | Fixes |
|---|--------|--------|-------|
| 19 | **Self-host fonts** via `@fontsource`; drop the Google Fonts link (note: `Aref Ruqaa` needs adding or dropping) | 3 h | P4-01 |
| 20 | **Split content data out of the main bundle** — per-page JSON islands + dynamic imports | 12 h | P3-06 |
| 21 | **SEO test suite** — the 8 checks in [AUTOMATION.md](AUTOMATION.md); build check #3 first | 12 h | P5-01 |
| 22 | **Connect GSC + Bing data**; weekly CrUX pull | 4 h | P5-02 |
| 23 | **Category editorial content** — 150–300 words each | 8 h | P4-03 |
| 24 | **Remove `meta keywords`**; add `llms.txt` provenance | 1 h | P4-02, P5-03 |

---

## FINAL VERDICT

### Can this architecture scale to 100,000+ articles without systemic SEO debt?

## **NO**

Not because the code is poor — the route table, data model and canonical architecture are genuinely well-built and would survive a migration largely intact. The answer is NO because **four ceilings are structural, and all four are hit well before 100k**.

### 1. Hosting — hard ceiling

GitHub Pages provides no redirects, no header control, no `X-Robots-Tag`, and a ~1 GB soft repository limit. At 100k pages × ~57 KB, the prerendered HTML alone is **~5.7 GB**. P1-01 already demonstrates the redirect gap costing real indexed URLs at 372 pages; at 100k, editorial reorganisation becomes impossible without permanent loss.

### 2. Navigation topology — hard ceiling

The homepage links to every chapter individually: **340 links today**. This is O(n) per page. At 100k articles the homepage would need 100,000 links, and the current 187 KB homepage becomes ~50 MB. The graph has no depth (measured: `{0:1, 1:340}`) and therefore no hierarchy to distribute crawl budget through.

### 3. Sitemap — hard ceiling at 50,000

A single flat `sitemap.xml`, fully regenerated each build, with no sitemap index and no sharding. It breaches the 50,000-URL limit at exactly half the target scale.

### 4. Client bundle — unbounded growth

The 319 KB gzip bundle statically imports the entire corpus. It grows linearly with the archive with no code splitting. At 100k articles this is not a performance problem; it is a non-functional site.

### What "YES WITH CONDITIONS" would require

- Hosting with redirects and header control (Cloudflare Pages / Netlify / Workers proxy).
- Hierarchical navigation: home → hubs → sub-hubs → articles, with paginated listings — never a full index on any single page.
- A sitemap index over per-collection, per-language shards with real per-URL `lastmod`.
- Per-page data islands; no corpus-wide client bundle.
- An editorial model with authors, dates, revisions and review state.
- The [AUTOMATION.md](AUTOMATION.md) suite gating every deploy.

### The honest assessment

At its current size — **372 pages** — this site is in good shape. Canonicals are flawless, the sitemap is exact, titles and descriptions are 100% unique, hreflang is textbook, and content is fully prerendered with real source citations. The score of 58/100 is dragged down by three things that are cheap to fix (linking, headings, fabricated schema) and one that is genuinely expensive (publisher-trust infrastructure).

**Phase 0 alone — about one day of work — would move the score to roughly 72/100.**

The architecture is right for a curated reference corpus of a few hundred to a few thousand pages, and there is no evidence the project intends to become a 100k-article publisher. The scaling ceilings are worth knowing, not necessarily worth pre-emptively engineering around. **The urgent work is Phases 0 and 1; the rest is a matter of ambition.**
