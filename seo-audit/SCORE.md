# WEIGHTED SCORE — 58/100

Scoring is evidence-bound: every deduction below cites a verified measurement, and no category was scored on impression. Where something is genuinely absent rather than broken, it is marked N/A and justified rather than silently passed (audit rule 36).

| # | Category | Max | Score | % | Verdict |
|---|----------|-----|-------|---|---------|
| 1 | Technical foundation | 15 | 10.0 | 67% | Solid SSG; no header/redirect control |
| 2 | Crawlability / indexability | 15 | 10.0 | 67% | All pages 200 + indexable; discovery is sitemap-dependent |
| 3 | URL / canonical architecture | 10 | 7.5 | 75% | Canonicals flawless; no redirect layer |
| 4 | Content / editorial SEO | 10 | 5.5 | 55% | Excellent primary content; no editorial model |
| 5 | Information architecture | 10 | 3.0 | 30% | Flat star graph; taxonomy orphaned |
| 6 | Structured data | 8 | 4.0 | 50% | Valid JSON, but two fabricated claims + missing dates |
| 7 | Internal linking | 8 | 2.0 | 25% | 339/372 pages emit 2 links |
| 8 | Performance / CWV | 8 | 5.0 | 63% | Fast HTML; 312 KB gzip JS, blocking fonts |
| 9 | Image / media SEO | 4 | 2.5 | 63% | OG 372/372; AudioObject `@id` uses dead URLs |
| 10 | UGC / comments | 4 | 4.0 | N/A | No UGC surface exists — scored as no-risk |
| 11 | International | 3 | 2.0 | 67% | hreflang perfect; zero crawlable RU↔EN links |
| 12 | Publisher trust / E-E-A-T | 3 | 0.5 | 17% | No author, dates, policy or About pages |
| 13 | AI search / GEO | 2 | 1.5 | 75% | Strong llms.txt + citability; no provenance |
| | **TOTAL** | **100** | **57.5 → 58** | | |

---

## 1. Technical foundation — 10.0 / 15

**Findings.** Vite 6 + React 19, built to fully static HTML via `vite build --ssr` → `scripts/prerender.mjs`. 372 routes prerendered from a single declarative route table (`src/router/routes.ts`). Served by GitHub Pages behind Fastly; TTFB measured **327–375 ms** from `fra` edge. Trailing slashes consistent; no case-sensitivity or URL-encoding issues; no query-parameter surface.

**Credits.** The prerenderer includes an explicit URL-collision guard (`prerender.mjs:39-52`) that fails the build if two routes resolve to the same path — a genuinely publisher-grade safeguard that most sites lack.

**Deductions.**
- −2.0 No control over HTTP headers: no `X-Robots-Tag`, no HSTS, no CSP (static hosting).
- −1.5 No redirect capability whatsoever (P1-02).
- −1.0 `http://` origin serves 200 without redirecting to HTTPS (P2-06).
- −0.5 `cache-control: max-age=600` on immutable hashed assets is left at the platform default.

## 2. Crawlability / indexability — 10.0 / 15

**Findings.** All 372 pages return **200** and are indexable. `robots.txt` is syntactically valid, disallows nothing, blocks no CSS/JS, names the sitemap, and explicitly allows 13 AI/answer-engine crawlers. **No conflicting signals were found anywhere**: zero `noindex` on indexable pages, zero robots-blocked pages needing crawl, zero canonical-vs-sitemap disagreements. No crawl traps exist — search is a client-side sidebar filter with no URL surface, and there is no faceted navigation, pagination, or calendar archive.

**Deductions.**
- −3.0 Discovery depends almost entirely on the sitemap: 6 orphans and 31 pages unreachable from `/` (P1-03/04/05).
- −1.5 20 previously-indexed URLs now 404 with no redirect (P1-01).
- −0.5 `robots.txt` uses the non-standard `Host:` directive (Yandex-only, ignored elsewhere; harmless).

## 3. URL / canonical architecture — 7.5 / 10

**Findings — this is the strongest category.** Verified across all 372 pages: canonical present, absolute, HTTPS, correct host, self-referencing, resolving to 200, indexable, and present in the sitemap. **0 chains, 0 loops, 0 canonical-to-redirect, 0 canonical-to-404, 0 canonical-to-noindex, 0 `og:url` mismatches.** Slugs are readable, transliterated, stable and collision-guarded.

**Deductions.**
- −1.5 No redirect layer, so URL changes are destructive (P1-01/02).
- −1.0 `shakhbanov.github.io/dua-from-sunna/` 301s to `http://dua.shakhbanov.org/` — right host, wrong scheme.

## 4. Content / editorial SEO — 5.5 / 10

**Findings.** The primary content is genuinely high quality: Arabic with full diacritics, word-by-word RU/EN translation, audio sync, and per-dua hadith citations (al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa'i, Ahmad). 372/372 unique titles and descriptions. 30 chapters carry hand-written long-form explainers (`data/descriptions.ts`).

**Deductions.**
- −2.0 No `datePublished`/`dateModified` on any page, in content or schema.
- −1.5 Broken heading contract on 372/372 pages (P2-01).
- −1.0 No editorial content model: no Author, Editor, Revision, or Entity types exist (see [CONTENT-ARCHITECTURE.md](CONTENT-ARCHITECTURE.md)).

## 5. Information architecture — 3.0 / 10

**Findings.** Two collections (`sunna` 134 ch., `quran` 36 ch.) and 12 thematic categories are modelled cleanly in data — but the model is not expressed in the link graph. Measured depth histogram from `/`: `{0: 1, 1: 340}`. There is no level 2. Categories, collection indexes and prayer times are unreachable.

**Deductions.** −7.0 across orphaned hubs (P1-04), unreachable taxonomy (P1-05), absent breadcrumb UI, no prev/next, no related-chapter links.

## 6. Structured data — 4.0 / 8

**Findings.** Every emitted JSON-LD block parses. `Article`, `BreadcrumbList`, `AudioObject` and `FAQPage` are emitted per chapter; JSON is correctly `<`-escaped against script-breakout (`entry-server.tsx:escapeJson`) — a real security credit. Distribution across 372 pages: 2 blocks (32 pages), 4 (90), 5 (12), 6 (238).

**Deductions.**
- −1.5 `Article` missing `datePublished`, `dateModified`, `image`, `url`; `author` is a hostname string (P2-02).
- −1.0 Two fabricated claims: non-existent `SearchAction` endpoint and synthetic `FAQPage` questions (P2-03, P2-04).
- −0.75 `og:type=website` on all 372 pages including articles; no `article:*` meta (P2-05).
- −0.5 Static `CreativeWork` ("collection from the Sunnah") injected onto Quran pages — wrong entity (P2-03).
- −0.25 `BreadcrumbList` is 2 levels and omits the collection (P3-02).

## 7. Internal linking — 2.0 / 8

**Findings.** Outbound-link distribution across 372 pages: **339 pages have exactly 2 links**; one page (the homepage) has 340; the remainder (hubs) have 7–37. Inbound: 296 pages have exactly 2; 6 have zero. Root cause is a single line — `components/Sidebar.tsx:171` renders `ChapterRow` as `<button onClick>` instead of an anchor.

**Deductions.** −6.0. PageRank has exactly one distribution point and no onward flow. See [INTERNAL-LINKING.md](INTERNAL-LINKING.md).

## 8. Performance / CWV — 5.0 / 8

**Findings.** Content is prerendered, so first paint does not wait on JS. HTML gzips to ~9.3 KB/page; CSS to 5.9 KB. TTFB 327–375 ms.

**Deductions.**
- −1.5 Single JS chunk: 1,302,901 B raw / **312 KB gzip**, no code splitting beyond `adhan`.
- −1.0 Render-blocking Google Fonts stylesheet requesting 4 families, despite `@fontsource/*` already being installed.
- −0.5 Field data unavailable — **CrUX/GSC not connected: NOT AUDITABLE.** Lab-only assessment.

## 9. Image / media SEO — 2.5 / 4

**Findings.** OG images verified **372/372 present** — every referenced file resolves. `1200×630` declared with dimensions. There are no content `<img>` elements at all (the design is typographic), so alt-text, `srcset`, LCP-image and CLS-from-images risks are structurally absent rather than merely unmeasured.

**Deductions.** −1.0 `AudioObject.@id` uses legacy `/?chapter=N#dua-X` URLs that no longer route (P3-04). −0.5 No `VideoObject`/image sitemap — correctly N/A, but audio has no `duration`/`uploadDate`.

## 10. UGC / comments — 4.0 / 4 (N/A)

**There is no UGC surface.** No comments, no user accounts, no profiles, no submissions, no user-generated links anywhere in the codebase. Consequently there is no spam, XSS, `rel=ugc`, thin-UGC or moderation exposure. Scored full marks as **absence of risk**, not as an achievement — if UGC is ever added, this category must be re-audited from zero. Policy recommendations are recorded in [UGC-COMMENTS.md](UGC-COMMENTS.md).

## 11. International — 2.0 / 3

**Findings.** `hreflang` `ru`/`en`/`x-default` on 372/372 pages, fully reciprocal, absolute, HTTPS, with every RU page paired to a real EN page. Locale-correct `og:locale`. This is textbook.

**Deductions.** −0.75 No crawlable link between the RU and EN trees; the language switcher is a `<button>` and `/en/` is unreachable from `/`. −0.25 EN pages carry a Russian `<h1>` and `og:site_name="Дуа"`.

## 12. Publisher trust / E-E-A-T — 0.5 / 3

**Findings.** The one real credit: per-dua source citations to named hadith collections, carried into `Article.citation`. That is meaningful provenance for religious content.

**Deductions.** −2.5. Absent: About, contact, ownership, editorial standards, corrections policy, privacy, terms, any named author or reviewer, any publication or update date, and any scholarly review attribution. For religious guidance — a YMYL-adjacent category where accuracy carries real-world consequence — this is the most serious qualitative gap in the audit.

## 13. AI search / GEO — 1.5 / 2

**Findings.** Strong and deliberate. `llms.txt` (81 KB, bilingual, structured) and `llms-full.txt` (448 KB full corpus); 13 AI crawlers explicitly allowed; content fully server-rendered; passages are self-contained (each dua is a complete unit with Arabic, translation and source); primary-source attribution per item.

**Deductions.** −0.5 No content provenance — no author identity, no dates, no revision history, which are the signals AI systems increasingly weight for citation confidence.
