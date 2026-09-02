# EXECUTIVE SUMMARY — Publisher-Grade SEO Forensic Audit

**Project:** `dua.shakhbanov.org` — Duas & adhkar from the Sunnah and the Quran (RU/EN)
**Audit date:** 2026-09-03
**Audited artifact:** `dist/` @ md5 `85ad6bf5c8aa71e665ea5efc3f729022` — **byte-identical to the deployed `gh-pages` HEAD (`990f6b6`)**, so every finding below reflects live production, not a local build.
**Method:** source code + route table + rendered HTML (372 files) + live HTTP responses + git history. No claude-seo score was accepted without independent verification.

---

## CURRENT SCORE: 58/100

```
P0: 0    P1: 3    P2: 7    P3: 6    P4: 4    P5: 3        (23 findings)
```

```
INDEXABILITY   72/100     TECHNICAL     67/100
EDITORIAL      55/100     SEMANTIC      39/100
PERFORMANCE    63/100     UGC          N/A (no UGC surface)
AI SEARCH      75/100
```

---

## WHAT THIS SITE ALREADY DOES AT PUBLISHER GRADE

These are not assumptions — each was verified across all 372 rendered pages:

- **Canonical architecture is flawless.** 372/372 pages carry an absolute, HTTPS, correct-host, self-referencing canonical. Zero chains, zero loops, zero canonical-to-404, zero mismatches with `og:url`.
- **Sitemap is exact.** 372 URLs; 0 sitemap URLs without a prerendered page; 0 prerendered pages missing from the sitemap. Perfect 1:1 with the route table because the sitemap is generated from `routeCatalog()` rather than regex-scraped.
- **Titles and descriptions are 100% unique.** 0 duplicate `<title>` across 372 pages.
- **hreflang is complete and reciprocal** — `ru`/`en`/`x-default` on every page, every RU page paired to a real EN page.
- **Everything is prerendered.** Editorial content (Arabic, translations, hadith citations) is in the raw HTML with no JS execution required.
- **OG images: 372/372 present** — every referenced `og:image` resolves to a real file.
- **AI-search readiness is genuinely strong** — `llms.txt`, `llms-full.txt`, permissive AI-crawler robots, self-contained passages, per-dua source citations.

The foundation is better than most sites at this size. The failures are **architectural**, not hygienic.

---

## TOP 10 RISKS

| # | Risk | Sev | Evidence |
|---|------|-----|----------|
| 1 | **20 previously-indexed Quran URLs are now hard 404s.** Commit `9419908` re-slugged the Quran collection from theme-based to surah-based. `GET /dua-iz-korana/dua-o-blage-v-oboikh-mirakh/` → **404**; `/en/quran-duas/duas-for-parents/` → **404**. | P1 | Live HTTP |
| 2 | **There is no redirect layer and there cannot be one.** GitHub Pages serves static files only — no 301 capability. Every future slug change permanently 404s its predecessor. | P1 | Hosting model |
| 3 | **Internal link graph is a single-hub star.** 339 of 372 pages have exactly **2** outbound internal links. The homepage has 340. Link depth histogram is `{0:1, 1:340}` — no hierarchy exists. | P1 | Link graph |
| 4 | **6 hub pages have zero inbound internal links** — `/kategorii/`, `/en/categories/`, `/namaz/`, `/en/prayer-times/`, `/dua-iz-korana/`, `/en/quran-duas/`. The entire taxonomy layer is sitemap-only. | P1 | Link graph |
| 5 | **31 pages unreachable from `/`**, including all 12 RU + 12 EN category pages and `/en/` itself. | P1 | BFS from `/` |
| 6 | **Every page has two `<h1>`s and neither is the page topic.** 372/372 pages. On chapter pages the real title is demoted to `<h2>`; the second `<h1>` is a site-wide constant. | P2 | All 372 files |
| 7 | **`Article` schema has no dates and no real author.** No `datePublished`, no `dateModified`, no `image`, no `url`. `author` is `{Organization, name:"dua.shakhbanov.org"}` — a hostname, not an entity. | P2 | `updateMetaTags.ts` |
| 8 | **Fabricated structured-data claims.** `WebSite.potentialAction` advertises a `SearchAction` at `/?q={search_term_string}` — no such endpoint exists. `FAQPage` questions are synthesised from title regexes and appear nowhere on the page. | P2 | Schema vs. DOM |
| 9 | **Zero publisher-trust infrastructure.** No About, author, editorial policy, corrections policy, contact, privacy, or terms page. No publication or update date anywhere on any page. | P2 | Page-type scan |
| 10 | **`http://` serves HTTP 200 with no HTTPS redirect**, and `shakhbanov.github.io/dua-from-sunna/` 301s to **`http://`**, depositing crawlers on the insecure origin. No HSTS. | P2 | Live HTTP |

---

## TOP 10 HIGHEST-ROI FIXES

Ordered by (impact ÷ effort), not by severity.

| # | Fix | Effort | Why it pays |
|---|-----|--------|-------------|
| 1 | **Restore `<a href>` on `ChapterRow`.** `components/Sidebar.tsx:171` renders the primary 134-chapter navigation as `<button onClick>`. Every chapter page therefore emits ~2 links instead of a navigable set. | ~1h | Single highest-leverage change in the codebase |
| 2 | **Link the hubs.** Add header/footer links to `/kategorii/`, `/namaz/`, `/dua-iz-korana/` (+ EN). Removes all 6 orphans and 31 unreachable pages at once. | ~2h | Restores the taxonomy layer to the crawl graph |
| 3 | **Fix the H1 contract.** One `<h1>` per page = the page's own subject. Demote the Arabic wordmark to `<p>`/`<span>`, drop the site-wide constant `<h1>`. | ~2h | Fixes the primary relevance signal on 372 pages |
| 4 | **Re-publish the 20 dead Quran URLs as canonical-only stubs** pointing at their surah-based replacements (the only redirect mechanism static hosting allows). | ~3h | Recovers equity that is currently being discarded |
| 5 | **Add `datePublished`/`dateModified` to content and to `Article`**, sourced from git history per chapter file. | ~4h | Unblocks freshness signals + E-E-A-T + AI provenance |
| 6 | **Delete the two fabricated schema claims** (`SearchAction`, `FAQPage`) and scope the static `CreativeWork` to Sunnah pages only. | ~1h | Removes a spam-pattern risk for near-zero cost |
| 7 | **Turn on "Enforce HTTPS"** in the repository's Pages settings. | ~2min | Closes the duplicate-origin and insecure-redirect chain |
| 8 | **Add per-chapter breadcrumbs (UI + schema) with the collection level**, and prev/next chapter links. | ~4h | Creates the hierarchy the link graph currently lacks |
| 9 | **Ship `about` / `editorial-policy` / `corrections` / `contact` pages** with a named, credentialed author entity + `Person` schema. | ~6h | The single largest E-E-A-T gap for a religious-content site |
| 10 | **Add SEO regression tests to CI.** Today the deploy gate is 5 `grep` assertions; a link-graph, canonical, and sitemap-parity check would have caught findings #1, #3, #4 and #5 before deploy. | ~4h | Prevents recurrence of every P1 above |

---

## FINAL VERDICT

**Can this architecture scale to 100,000+ articles without systemic SEO debt? → NO.**

Full reasoning in [REMEDIATION-ROADMAP.md](REMEDIATION-ROADMAP.md#final-verdict). In short, four hard ceilings are structural, not incidental:

1. **Hosting.** GitHub Pages has no redirect layer, no header control, no `X-Robots-Tag`, and a ~1 GB soft limit. At 100k pages × ~57 KB, the HTML alone is ~5.7 GB.
2. **Navigation.** The homepage links to every chapter individually (340 links today). That pattern is O(n) per page and cannot survive 100k.
3. **Sitemap.** A single flat `sitemap.xml`. The 50,000-URL/50 MB limit is breached at 50k with no sitemap index in place.
4. **Client bundle.** The 1.27 MB (312 KB gzip) bundle inlines the entire content corpus. It grows linearly with the archive and has no code splitting.

None of these is a bug to be patched — each is a decision to be revisited. The good news is that the *data model and route table are clean enough to survive the migration*: `routes.ts` + `routeCatalog()` are already the single source of truth, which is exactly the asset a re-platform needs.
