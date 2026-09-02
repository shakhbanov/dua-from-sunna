# FINDINGS — All 23 Issues

Every finding follows the evidence format required by audit rule 35: ISSUE / SEVERITY / LOCATION / EVIDENCE / WHY IT MATTERS / EXPECTED STATE / RECOMMENDED FIX / DEPENDENCIES / VALIDATION TEST.

**Severity counts:** P0: 0 · P1: 3 · P2: 7 · P3: 6 · P4: 4 · P5: 3

> **On P0:** no finding meets the P0 bar defined in the brief. There is no site-wide `noindex`, no robots block on critical content, no canonical failure, no indexable staging environment, no duplicate-URL explosion, and production is available. Reporting zero P0s is the accurate result, not a gap in the audit.

---

## P1 — CRITICAL

### P1-01 · 20 previously-indexed Quran URLs are now hard 404s with no redirect

- **LOCATION:** `data/quranSlugs.ts`, `data/quran/*.ts`, commit `9419908` ("Rebuild the Quran collection from the reference: 109 duas in mushaf order"), deployed as `990f6b6`.
- **EVIDENCE:** The Quran collection was re-slugged from thematic to surah-based URLs. Live HTTP, measured 2026-09-03:
  ```
  GET /dua-iz-korana/dua-o-blage-v-oboikh-mirakh/   → 404
  GET /en/quran-duas/duas-for-parents/              → 404
  GET /dua-iz-korana/dua-iz-sury-al-fatiha/         → 200   (the replacement)
  ```
  All 10 RU + 10 EN thematic Quran URLs were present in the previously deployed sitemap and linked from the previously deployed homepage (verified in `gh-pages` commit `d37fbb5`, which lists `/dua-iz-korana/dua-o-blage-v-oboikh-mirakh/` among its 288 homepage links). They are absent from the current build: `dist/dua-iz-korana/` contains 37 surah directories and zero thematic ones.
- **WHY IT MATTERS:** These URLs were crawled, linked and submitted via IndexNow. They now return 404 with no redirect target, so all accumulated ranking signals are discarded rather than transferred. Google will drop them from the index after repeated 404s, and any external links to them are dead.
- **EXPECTED STATE:** Each retired URL 301-redirects to its surah-based successor, or — since static hosting forbids 301 — serves a page that canonicalises to the successor.
- **RECOMMENDED FIX:** Emit "legacy stub" routes for the 20 retired slugs. Each stub prerenders with `<link rel="canonical">` pointing at the successor, a `<meta http-equiv="refresh">` for users, and a visible link. Add a `LEGACY_SLUG_MAP` to `data/quranSlugs.ts` and extend `allRoutes()` to emit them. Keep them out of the sitemap.
- **DEPENDENCIES:** Requires the thematic→surah mapping to be reconstructed from `1a6bc59`/`9419908`; several thematic pages map to *multiple* surah pages and need an editorial decision on the best target.
- **VALIDATION TEST:** `curl -o /dev/null -w '%{http_code}'` over all 20 retired URLs returns 200, and each response's canonical differs from its own URL and resolves to 200.

### P1-02 · No redirect layer exists, and the hosting model cannot provide one

- **LOCATION:** `.github/workflows/deploy.yml`, `public/CNAME`, `scripts/deploy-gh-pages.sh`.
- **EVIDENCE:** Deployment is `peaceiris/actions-gh-pages@v4` → GitHub Pages static hosting. Response headers confirm `server: GitHub.com` behind Fastly. GitHub Pages serves files; it has no rewrite, redirect, or header-configuration facility. There is no `_redirects`, `netlify.toml`, `vercel.json`, or equivalent in the repository. `public/404.html` is the only not-found mechanism.
- **WHY IT MATTERS:** This converts every future URL change into permanent signal loss (P1-01 is the first instance, not the last). It also forecloses `X-Robots-Tag`, HSTS, CSP, and cache-control tuning. For an archive intended to grow, an un-redirectable URL space is a structural liability.
- **EXPECTED STATE:** A hosting layer capable of 301s and custom headers (Cloudflare Pages, Netlify, or Cloudflare Workers in front of the current origin).
- **RECOMMENDED FIX:** Front the existing Pages origin with Cloudflare (DNS already delegates the apex) and implement a redirect map there — no build changes required. This is the minimum-disruption path and also unlocks HSTS and `X-Robots-Tag`.
- **DEPENDENCIES:** DNS control for `shakhbanov.org`.
- **VALIDATION TEST:** A retired URL returns `301` with a `Location` header resolving to 200 in one hop.

### P1-03 · Internal link graph is a single-hub star: 339 of 372 pages emit 2 links

- **LOCATION:** `components/Sidebar.tsx:171-180` (`ChapterRow`), introduced by commit `e8f36d7` ("Clear every react-doctor finding: 65 → 100").
- **EVIDENCE:** Outbound internal-link distribution measured over all 372 rendered pages:
  ```
  2 links   → 339 pages        340 links → 1 page (homepage)
  7–37      → 32 pages (hubs)
  ```
  Link-depth histogram from `/`: `{0: 1, 1: 340}` — no page sits at depth 2. Root cause, `components/Sidebar.tsx`:
  ```tsx
  const ChapterRow: React.FC<RowProps> = ({ chapter, ... onSelect }) => (
    <button onClick={() => onSelect(chapter.id)}>   // ← not <a href>
  ```
  The 134-chapter primary navigation is JavaScript buttons. `git log -S'RouteLink' -- components/Sidebar.tsx` shows `e8f36d7` as the commit that introduced this shape; the same commit did keep `RouteLink` for the *collection* switcher (`Sidebar.tsx:99`), so the pattern is inconsistent within one file.
- **WHY IT MATTERS:** Crawlers cannot follow `onClick` handlers. Link equity has exactly one distribution point (the homepage) and no onward flow between the 340 leaf pages. Contextual relevance signals between related duas do not exist. This is also an accessibility and UX regression: chapter navigation cannot be opened in a new tab, copied, or shared.
- **EXPECTED STATE:** Every chapter row is an `<a href>` to the chapter's canonical path; chapter pages link to their collection, their categories, and adjacent chapters.
- **RECOMMENDED FIX:** Replace the `<button>` in `ChapterRow` with the existing `RouteLink` component — it already wraps an `<a href>` with SPA interception and is already imported in this file for the collection switcher. Then add prev/next and category links to `ChapterReader`.
- **DEPENDENCIES:** Confirm `react-doctor` does not re-flag the anchor; the original conversion appears to have been made to satisfy a lint rule, so the rule should be reviewed rather than the anchor re-removed.
- **VALIDATION TEST:** Link-graph BFS from `/` reaches ≥ 370/372 pages, and the median outbound-link count exceeds 10.

---

## P2 — HIGH

### P2-01 · Two `<h1>` elements on all 372 pages; the real page title is demoted to `<h2>`

- **LOCATION:** `components/Sidebar.tsx:67` (Arabic wordmark `<h1>`); the site-wide constant `<h1>` rendered on every route.
- **EVIDENCE:** `<h1>` count distribution across 372 pages: **`{2: 372}`** — every page, without exception. Heading outline of `/dua-iz-korana/dua-iz-sury-al-fatiha/`:
  ```
  h1  دُعَاءٌ مِنَ السُّنَّةِ                                    ← decorative wordmark
  h2  Дуа из суры «Аль-Фатиха» (1)                        ← the actual page subject
  h3  Мольба о прямом пути
  h3  Установить «Дуа» на домашний экран                  ← install-prompt UI
  h1  Дуа и азкары из Сунны — арабский текст, перевод, аудио ← site-wide constant
  ```
  The second `<h1>` is byte-identical on all 372 pages, including English ones.
- **WHY IT MATTERS:** The `<h1>` is a primary topical signal. Here it says the same thing on every page and never states what the page is about, while the true subject is one level down. Two `<h1>`s is valid HTML5 but leaves no unambiguous primary heading. On EN pages the constant `<h1>` is in Russian, contradicting `lang="en"`.
- **EXPECTED STATE:** Exactly one `<h1>` per page containing that page's subject; the wordmark as `<p>`/`<span>` inside a `<header>`; UI widget headings not competing in the outline.
- **RECOMMENDED FIX:** In `Sidebar.tsx:67` change the wordmark `<h1>` to a `<span>`. Remove the site-wide constant `<h1>`. Promote the chapter title in `ChapterReader` from `<h2>` to `<h1>`. Category and collection pages already have a correct page-subject `<h1>` and only need the two extras removed.
- **DEPENDENCIES:** None; CSS classes carry all styling, so the change is presentational-neutral.
- **VALIDATION TEST:** Across `dist/**/index.html`, `<h1>` count is exactly 1 per file, and its text equals the page's `<title>` minus the site suffix.

### P2-02 · `Article` schema has no dates and no real author entity

- **LOCATION:** `src/seo/updateMetaTags.ts` → `articleSchema()`.
- **EVIDENCE:** Parsed `Article` node from `/dua-iz-korana/dua-iz-sury-al-fatiha/`:
  ```
  keys: ['@context','@type','author','citation','description','headline',
         'inLanguage','isPartOf','mainEntityOfPage','publisher']
  author:        {"@type":"Organization","name":"dua.shakhbanov.org"}
  datePublished: None      dateModified: None
  ```
  Absent: `datePublished`, `dateModified`, `image`, `url`.
- **WHY IT MATTERS:** `datePublished` is required by Google's Article structured-data guidance; `image` is recommended. Without dates there is no freshness signal and no way for search or AI systems to assess currency. An `author` whose `name` is a hostname is not an entity — it cannot be reconciled to any `Person` or `Organization` and contributes nothing to E-E-A-T.
- **EXPECTED STATE:** `Article` carries `datePublished`, `dateModified`, `image` (the existing per-chapter OG image), `url`, and an `author` resolving to a named `Person` or a properly-described `Organization` with `@id`, `url` and `sameAs`.
- **RECOMMENDED FIX:** Derive per-chapter dates from git history (`git log -1 --format=%aI -- data/chapters/<file>.ts`) at build time and thread them through `routeCatalog()`. Define a single `Organization` node with a stable `@id` and reference it from both `author` and `publisher`.
- **DEPENDENCIES:** Requires the publisher-identity decision in P2-07 (who is the named author/reviewer).
- **VALIDATION TEST:** Google Rich Results Test reports zero errors and zero warnings for `Article` on a representative chapter page.

### P2-03 · Site-wide static JSON-LD is injected onto every page, including where it is factually wrong

- **LOCATION:** `index.html:80-104` (static blocks); `scripts/prerender.mjs` → `stripDefaultMeta()`.
- **EVIDENCE:** `stripDefaultMeta()` documents itself as removing "the static homepage JSON-LD blocks (WebSite + Book) — we'll re-emit them only on the home route", but its implementation contains no `<script>` rule:
  ```js
  .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
  .replace(/<meta\s+name=["']description["'][^>]*>\s*/i, '')
  .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/i, '')
  // …meta/link rules only — no <script type="application/ld+json"> rule
  ```
  Consequence, verified on all 372 pages: the static `WebSite` and `CreativeWork` blocks appear everywhere. Two concrete defects follow:
  1. `CreativeWork` describes *"Сборник дуа и азкаров, подтверждённых достоверными хадисами"* — a **Sunnah** collection — yet is emitted on all 74 **Quran** pages, which are not hadith-sourced.
  2. `WebSite.potentialAction` advertises `SearchAction` at `https://dua.shakhbanov.org/?q={search_term_string}`. **No such endpoint exists** — `grep -rn "search_term_string\|?q=" src/ components/ App.tsx` returns nothing; search is a client-side sidebar filter over `searchQuery` with no URL representation.
- **WHY IT MATTERS:** The `SearchAction` is a claim about a capability the site does not have — the exact pattern Google's structured-data policy treats as misleading markup. The misapplied `CreativeWork` asserts a false provenance for Quranic content, which for religious material is a substantive accuracy problem, not a technical one.
- **EXPECTED STATE:** `WebSite` emitted once, site-wide, without a `SearchAction` (or with one only after a real `/search?q=` route exists). `CreativeWork`/collection schema scoped to the collection it describes.
- **RECOMMENDED FIX:** Delete both static blocks from `index.html` and emit schema exclusively from `buildMetaTags()`, where collection context is already available via `chapterCollection(ch)`. Drop `potentialAction` entirely.
- **DEPENDENCIES:** None.
- **VALIDATION TEST:** No Quran page contains the string `достоверными хадисами` in JSON-LD; no page contains `search_term_string`.

### P2-04 · `FAQPage` schema is synthesised from title regexes and does not match visible content

- **LOCATION:** `src/seo/updateMetaTags.ts` → `FAQ_TITLE_PATTERNS`, `faqPageSchema()`.
- **EVIDENCE:** FAQ eligibility is decided by matching the chapter title against 24 regexes (`/^Что\s+(говорить|…)/i`, `/^Supplication(?:s)?\s+(when|for|…)/i`, …). Questions are then fabricated by string concatenation:
  ```js
  const questionPrefix = lang === 'ru' ? 'Какое дуа/азкар: ' : 'What supplication: ';
  name: `${questionPrefix}${chapter.title[lang]}${chapter.duas.length > 1 ? ` — ${d.id}` : ''}`
  ```
  producing e.g. *"Какое дуа/азкар: Слова поминания при пробуждении — 1"*. That string appears nowhere in the rendered page — the pages contain no question-and-answer UI at all. 238 of 372 pages carry 6 JSON-LD blocks, the FAQ block among them.
- **WHY IT MATTERS:** Google requires FAQ structured data to reflect Q&A content actually visible on the page; markup that does not is a structured-data policy violation risking a manual action. Separately, since August 2023 FAQ rich results are limited to authoritative government and health sites, so the markup has no upside here — it is pure downside risk.
- **EXPECTED STATE:** No `FAQPage` markup, unless real visible Q&A content is authored.
- **RECOMMENDED FIX:** Delete `FAQ_TITLE_PATTERNS`, `matchesFaqPattern()`, `faqPageSchema()` and the `ld-faq` emission. Remove `'ld-faq'` from `MANAGED_JSONLD_IDS`.
- **DEPENDENCIES:** None. Net code deletion.
- **VALIDATION TEST:** `grep -rl FAQPage dist/` returns nothing.

### P2-05 · `og:type=website` on all 372 pages, including chapter articles

- **LOCATION:** `index.html:22` (static `og:type`); `scripts/prerender.mjs` → `stripDefaultMeta()`; `entry-server.tsx` → `buildHeadHtml()`.
- **EVIDENCE:** `stripDefaultMeta()` strips `og:(title|description|url|locale|image|image:width|image:height)` but **not** `og:type`, `og:site_name`, or `og:locale:alternate`. `buildHeadHtml()` never emits `og:type`. Measured on a chapter page: `og:type = website`, `og:site_name = Дуа`, and no `article:published_time`, `article:modified_time`, `article:author` or `article:section`.
- **WHY IT MATTERS:** Every chapter is a content document but is typed as a site root for social and link-preview consumers, and no article-level publication metadata is exposed. On EN pages `og:site_name` is additionally the Russian "Дуа".
- **EXPECTED STATE:** `og:type=article` plus `article:published_time`/`article:modified_time`/`article:section` on chapter routes; `og:type=website` on home, collection index and categories index; locale-correct `og:site_name`.
- **RECOMMENDED FIX:** Add `og:type` (and the `article:*` set) to `buildHeadHtml()`, driven by `route.view`, and add `og:type`/`og:site_name` to the `stripDefaultMeta()` rules.
- **DEPENDENCIES:** `article:published_time` depends on the date source from P2-02.
- **VALIDATION TEST:** Every `dist/**/index.html` under a chapter route contains exactly one `og:type` whose value is `article`.

### P2-06 · `http://` serves HTTP 200 with no HTTPS redirect; `github.io` 301s to `http://`

- **LOCATION:** GitHub Pages repository settings ("Enforce HTTPS"); `public/CNAME`.
- **EVIDENCE:** Three sequential requests to `http://dua.shakhbanov.org/`:
  ```
  attempt 1: status=200 redirect=''
  attempt 2: curl (52) Empty reply from server
  attempt 3: status=200 redirect=''
  ```
  Full content is served over cleartext with no `Location` header. And:
  ```
  GET https://shakhbanov.github.io/dua-from-sunna/ → 301 → http://dua.shakhbanov.org/
  ```
  Response headers on HTTPS contain no `Strict-Transport-Security`.
- **WHY IT MATTERS:** Two fully-served origins for identical content. The `github.io` alias correctly canonicalises to the custom domain but lands on the insecure scheme, so any crawler arriving that way is placed on `http://`. Absolute HTTPS canonicals on every page mitigate the duplicate-content risk substantially, which is why this is P2 and not P1 — but the redirect chain and missing HSTS remain real.
- **EXPECTED STATE:** `http://` 301s to `https://`; HSTS present; `github.io` resolves to the HTTPS custom domain.
- **RECOMMENDED FIX:** Enable "Enforce HTTPS" in repository Settings → Pages (~2 minutes; requires the certificate to be provisioned, which it is). HSTS additionally requires the proxy from P1-02.
- **DEPENDENCIES:** None for the redirect; HSTS depends on P1-02.
- **VALIDATION TEST:** `curl -sSI http://dua.shakhbanov.org/` returns `301` with `location: https://dua.shakhbanov.org/`.

### P2-07 · No publisher-trust infrastructure of any kind

- **LOCATION:** Absent from the entire route table (`src/router/routes.ts` → `allRoutes()`).
- **EVIDENCE:** A directory scan of all 372 prerendered pages for `about`, `o-proekte`, `contact`, `kontakty`, `privacy`, `policy`, `terms`, `editorial`, `corrections`, `istochniki`, `sources` returned **no matches**. `allRoutes()` emits exactly six view types: `home`, `prayer-times`, `categories-index`, `collection-index`, `chapter`, `category`. No page states who compiled the translations, who verified them against the Arabic, what sources were used beyond per-dua citations, how corrections are requested, or when anything was published or revised.
- **WHY IT MATTERS:** This is religious guidance that people act on. Google's quality guidance weights "who is responsible for this content" heavily for topics with real-world consequence, and AI answer engines increasingly require identifiable authorship before citing a source. The site currently has strong *content* provenance (per-dua hadith citations) and zero *publisher* provenance.
- **EXPECTED STATE:** About, editorial standards, corrections policy, and contact pages; a named author/compiler with credentials and `Person` schema; visible publication and update dates.
- **RECOMMENDED FIX:** Add four static routes to `allRoutes()` with content in both languages. Define one `Person` (compiler/translator) and one `Organization`, cross-referenced via `@id` and `sameAs`, and reference the `Person` as `Article.author`.
- **DEPENDENCIES:** Editorial and personal decisions the codebase cannot supply — who is named, what credentials are claimed, whether a scholarly reviewer is credited. **This is a judgement call for the site owner, not an engineering task.**
- **VALIDATION TEST:** `/about/`, `/editorial-policy/`, `/corrections/`, `/contact/` return 200 in both languages, are linked from every page footer, and carry valid `Person`/`Organization` schema.

---

## P3 — MEDIUM

### P3-01 · `lastmod` is the build date for all 372 URLs
- **LOCATION:** `scripts/generate-sitemap.mjs:19` — `const today = new Date().toISOString().split('T')[0];`
- **EVIDENCE:** Distinct `<lastmod>` values in `sitemap.xml`: `['2026-09-02']` — a single value for all 372 URLs, rewritten on every build.
- **WHY IT MATTERS:** Declaring that all 372 pages changed on every deploy makes `lastmod` uninformative; crawlers that detect the pattern discount the signal entirely. Google has stated it ignores `lastmod` it deems unreliable.
- **EXPECTED STATE:** Per-URL `lastmod` reflecting the last actual content change.
- **RECOMMENDED FIX:** Use `git log -1 --format=%aI -- <chapter data file>` per chapter at build time; fall back to build date only for pages with no data file.
- **DEPENDENCIES:** Shares the date-derivation work with P2-02 — implement once, consume in both.
- **VALIDATION TEST:** `sitemap.xml` contains more than one distinct `lastmod`, and an unchanged chapter's value is stable across two consecutive builds.

### P3-02 · `BreadcrumbList` is 2 levels and contradicts the URL hierarchy
- **LOCATION:** `src/seo/updateMetaTags.ts` → `breadcrumbSchema()`.
- **EVIDENCE:** For `/dua-iz-korana/dua-iz-sury-al-fatiha/` (a two-segment URL): `[(1,'Главная','https://dua.shakhbanov.org'), (2,'Дуа из суры «Аль-Фатиха» (1)', '…/dua-iz-korana/dua-iz-sury-al-fatiha/')]`. The `/dua-iz-korana/` collection level is skipped. Position 1's `item` is `https://dua.shakhbanov.org` with no trailing slash, while the canonical home URL is `https://dua.shakhbanov.org/`.
- **WHY IT MATTERS:** The breadcrumb asserts a flat hierarchy the URL structure contradicts, and there is no breadcrumb UI on the page for it to describe.
- **EXPECTED STATE:** Home → Collection → Chapter for Quran pages; Home → Chapter for Sunnah pages (which are genuinely one level deep); trailing-slash-consistent `item` URLs; a matching visible breadcrumb.
- **RECOMMENDED FIX:** Build crumbs from `route.collection` and `buildCollectionIndexPath()`, and render a visible breadcrumb in `ChapterReader` — which simultaneously contributes inbound links to the orphaned collection hubs (P1-04).
- **DEPENDENCIES:** Pairs naturally with the P1-03 linking work.
- **VALIDATION TEST:** Every Quran chapter page's `BreadcrumbList` has 3 items and its position-2 `item` returns 200.

### P3-03 · `404.html` JavaScript-redirects every unknown URL to the homepage
- **LOCATION:** `public/404.html:11-22`.
- **EVIDENCE:** `location.replace('/')` executes unconditionally after stashing the path in `sessionStorage`. Verified: `GET /definitely-not-real-xyz/` returns **HTTP 404** (correct status), then the body's JS redirects to `/`. `RouterContext.tsx` only restores the stashed path when `matchRoute()` succeeds, so unknown URLs terminate on the homepage.
- **WHY IT MATTERS:** The HTTP status is correct, which is the part that matters most for crawlers, so this is not the classic soft-404. But redirecting users to the homepage rather than showing a not-found page with navigation is the pattern Google explicitly advises against, and it silently hides broken inbound links from anyone testing in a browser — including, in this case, the 20 URLs broken by P1-01.
- **EXPECTED STATE:** A real 404 page that returns 404, states the page was not found, and offers navigation and search.
- **RECOMMENDED FIX:** Keep the `sessionStorage` stash and the `location.replace('/')` *only* when the stashed path matches a known route; otherwise render the not-found page in place.
- **DEPENDENCIES:** None.
- **VALIDATION TEST:** `GET /nonexistent/` returns 404 and the rendered body contains the not-found heading rather than homepage content.

### P3-04 · `AudioObject.@id` points at retired legacy query URLs
- **LOCATION:** `src/seo/updateMetaTags.ts` → `audioObjectsSchema()`.
- **EVIDENCE:** `'@id': \`${SITE}/?chapter=${chapter.id}#dua-${d.id}\`` — the pre-migration query-string URL scheme. The current architecture uses clean paths, and `legacyQueryToPath()` exists precisely to migrate away from this form. `AudioObject` nodes also lack `duration` and `uploadDate`.
- **WHY IT MATTERS:** `@id` is the entity identifier. Using a URL form the site no longer canonicalises fragments the audio entities away from their pages.
- **EXPECTED STATE:** `@id` built from `buildChapterPath()` plus the dua fragment.
- **RECOMMENDED FIX:** Replace with `${SITE}${buildChapterPath(chapter.id, lang)}#dua-${d.id}`; add `duration` (ISO-8601, derivable from the existing sync timestamps) and `uploadDate`.
- **DEPENDENCIES:** None.
- **VALIDATION TEST:** No `dist/**/index.html` contains `?chapter=` inside a JSON-LD block.

### P3-05 · English pages carry Russian `<h1>` and `og:site_name`
- **LOCATION:** The site-wide constant `<h1>`; `index.html:23` (`og:site_name`).
- **EVIDENCE:** `dist/en/index.html` renders `<html lang="en">` while its second `<h1>` reads *"Дуа и азкары из Сунны — арабский текст, перевод, аудио"* and `og:site_name` is `Дуа`. Verified on the live EN homepage.
- **WHY IT MATTERS:** Content-language mismatch against the declared `lang` attribute and the `en` hreflang, weakening EN-locale relevance.
- **EXPECTED STATE:** All EN-page chrome in English.
- **RECOMMENDED FIX:** Resolved as a by-product of P2-01 (removing the constant `<h1>`); localise `og:site_name` via `I18N`.
- **DEPENDENCIES:** P2-01.
- **VALIDATION TEST:** No file under `dist/en/` contains Cyrillic in `<h1>` or `og:site_name`.

### P3-06 · 312 KB gzip single JS bundle with no code splitting
- **LOCATION:** `vite.config.ts`; `dist/assets/index-BVnQHUfw.js`.
- **EVIDENCE:** `1,302,901 B raw / 319,472 B gzip` in one chunk. Only `adhan` is split (13,952 B). The bundle statically imports the full content corpus — `data/chapters/*` (135 files), `data/quran/*` (40), `data/descriptions.ts` (134 KB), `data/categories.ts` (32 KB) — so all 372 pages' data ships to every visitor.
- **WHY IT MATTERS:** Content is prerendered so first paint is unaffected, but hydration cost, INP and mobile data use all scale with the whole archive rather than the page. This is the growth ceiling described in the final verdict.
- **EXPECTED STATE:** Route-level splitting; per-chapter data fetched on demand or inlined per prerendered page.
- **RECOMMENDED FIX:** Emit each chapter's data as a JSON island in its prerendered HTML and dynamic-import the rest; split `descriptions.ts` and `categories.ts` out of the main chunk.
- **DEPENDENCIES:** Touches the hydration contract in `entry-client.tsx`; do after the P1 linking fixes.
- **VALIDATION TEST:** Main chunk under 120 KB gzip; total JS on a chapter page under 150 KB gzip.

---

## P4 — LOW

### P4-01 · Render-blocking Google Fonts despite bundled `@fontsource` packages
- **LOCATION:** `index.html:76`.
- **EVIDENCE:** `<link href="https://fonts.googleapis.com/css2?family=Amiri…&family=Aref+Ruqaa…&family=Inter…&family=Scheherazade+New…" rel="stylesheet">` — a render-blocking third-party stylesheet for 4 families. Meanwhile `package.json` lists `@fontsource/amiri`, `@fontsource/inter` and `@fontsource/scheherazade-new` as devDependencies.
- **WHY IT MATTERS:** Two font delivery strategies coexist; the third-party one blocks render and adds a cross-origin dependency. `preconnect` hints are present, which softens but does not remove the cost.
- **EXPECTED STATE:** Self-hosted, subset, preloaded fonts from one source.
- **RECOMMENDED FIX:** Import the `@fontsource` faces in `src/index.css`, drop the Google Fonts link, and `preload` only the Arabic face used above the fold. Note `Aref Ruqaa` has no `@fontsource` package installed and must be added or dropped.
- **VALIDATION TEST:** No `fonts.googleapis.com` request in the network waterfall; LCP unchanged or improved.

### P4-02 · Obsolete `<meta name="keywords">`
- **LOCATION:** `index.html:12`. Ignored by all major engines since 2009. Harmless but signals dated practice; not stripped by `stripDefaultMeta()` so it ships on all 372 pages.

### P4-03 · Category pages have no editorial body content
- **LOCATION:** `src/views/CategoryPage.tsx`; `data/categories.ts` (12 categories).
- **EVIDENCE:** Each category renders its `summary` string plus a chapter list. No introduction, no editorial framing, no internal links beyond the list.
- **WHY IT MATTERS:** Thin-content risk for exactly the pages best positioned to rank for head terms ("утренние азкары", "дуа в путешествии"). These pages are currently also unreachable (P1-05) — thin *and* orphaned.
- **RECOMMENDED FIX:** 150–300 words of original editorial per category, in both languages.

### P4-04 · `Article.isPartOf` is an untyped inline `CreativeWork`
- **LOCATION:** `updateMetaTags.ts` → `articleSchema()`. `isPartOf` is `{'@type':'CreativeWork', name, inLanguage}` with no `@id` or `url`, so it cannot be reconciled with the collection's own landing page and forms no entity graph.

---

## P5 — OPTIMIZATION

### P5-01 · No SEO regression tests anywhere
- **EVIDENCE:** A repository-wide search for `*.test.*`, `*.spec.*`, `vitest*`, `playwright*` returns **nothing**. The only deploy gate is 5 shell assertions in `.github/workflows/deploy.yml`: two `test -f`, one Arabic-text `grep`, one `hreflang` `grep`.
- **WHY IT MATTERS:** Findings P1-01, P1-03, P1-04 and P1-05 were all introduced by ordinary commits and would each have been caught by a cheap automated check. The existing gate is well-intentioned but tests two files out of 372.
- **RECOMMENDED FIX:** See [AUTOMATION.md](AUTOMATION.md) for the proposed 8-check suite.

### P5-02 · No SEO observability
- **EVIDENCE:** No Search Console, CrUX, GA4 or rank-tracking integration in the repository. Only `src/analytics/yandexMetrika.ts`, gated on `VITE_YANDEX_METRIKA_ID`. Field Core Web Vitals are therefore **NOT AUDITABLE**.
- **RECOMMENDED FIX:** Connect GSC + Bing Webmaster; schedule a weekly CrUX/PSI pull; alert on indexed-page-count drops.

### P5-03 · `llms-full.txt` is 448 KB with no update or scope policy
- **EVIDENCE:** `public/llms.txt` 81 KB, `public/llms-full.txt` 448 KB — the entire corpus duplicated as plain text, regenerated per build.
- **WHY IT MATTERS:** Not harmful (`llms.txt` is not a Google signal), but it is an unversioned second copy of the corpus with no canonical relationship to the HTML pages and no provenance metadata.
- **RECOMMENDED FIX:** Add per-entry canonical URLs and a generation timestamp; decide explicitly whether full-corpus mirroring is intended.
