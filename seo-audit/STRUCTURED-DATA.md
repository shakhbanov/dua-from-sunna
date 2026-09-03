# STRUCTURED DATA AUDIT

**Score: 4.0 / 8.** All emitted JSON-LD parses and is syntactically valid. The problems are semantic: missing required properties, two fabricated claims, and one entity applied to content it does not describe.

## What is emitted

Distribution of `<script type="application/ld+json">` blocks across 372 pages:

```
2 blocks →  32 pages    (home, indexes, categories, prayer times — static only)
4 blocks →  90 pages
5 blocks →  12 pages
6 blocks → 238 pages
```

| Type | Where | Source | Status |
|------|-------|--------|--------|
| `WebSite` | all 372 | `index.html` static | ⚠️ contains fabricated `SearchAction` |
| `CreativeWork` | all 372 | `index.html` static | 🔴 wrong entity on 74 Quran pages |
| `Article` | 342 chapters | `articleSchema()` | ⚠️ no dates, no real author |
| `BreadcrumbList` | 342 chapters | `breadcrumbSchema()` | ⚠️ 2 levels, omits collection |
| `AudioObject` (@graph) | chapters with audio | `audioObjectsSchema()` | ⚠️ legacy `@id` |
| `FAQPage` | 238 pages | `faqPageSchema()` | 🔴 synthetic, not on page |

**Not emitted, correctly:** `NewsArticle` (not a news site), `VideoObject` (no video), `DiscussionForumPosting` (no UGC), `Product`/`Event`/`Recipe` (not applicable). The codebase resists schema-for-the-sake-of-schema, which is right.

**Not emitted, and should be:** `Person` (no author exists — P2-07), `Organization` as a standalone identified node, `WebPage`, `ItemList` on collection/category indexes.

## Credit where due

`entry-server.tsx` escapes JSON-LD payloads against script breakout:

```js
function escapeJson(json) {
  return json.replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026')
             .replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
}
```

Correct and complete, including the U+2028/2029 line-terminator cases most implementations miss. `applyMetaTags()` also removes stale JSON-LD blocks on client-side navigation via `MANAGED_JSONLD_IDS`, so SPA transitions do not accumulate schema from previous routes. Both are good engineering.

---

## Defects

### 🔴 `FAQPage` is fabricated (P2-04)

Eligibility is decided by matching titles against 24 regexes; questions are then built by concatenation:

```js
name: `${questionPrefix}${chapter.title[lang]}…`   // "Какое дуа/азкар: Слова поминания…"
```

That string appears nowhere on the page — there is no Q&A UI at all. Google requires FAQ markup to reflect visible Q&A content; markup that does not is a policy violation. Since August 2023 FAQ rich results are also restricted to authoritative government and health sites, so there is no upside to offset the risk. **Recommendation: delete.**

### 🔴 `CreativeWork` misapplied to Quran pages (P2-03)

The static block describes *"Сборник дуа и азкаров, подтверждённых достоверными хадисами"* — supplications authenticated by hadith. It is emitted on all 74 Quran pages, whose content is Qur'anic, not hadith-sourced. For religious material this is a factual provenance error, not merely a technical one.

Cause: `stripDefaultMeta()` in `prerender.mjs` claims in its comment to strip the static JSON-LD but contains no `<script>` rule — only meta/link rules.

### 🔴 `SearchAction` advertises an endpoint that does not exist (P2-03)

```json
"potentialAction": { "@type":"SearchAction",
  "target":"https://dua.shakhbanov.org/?q={search_term_string}" }
```

`grep -rn "search_term_string\|?q=" src/ components/ App.tsx` → no matches. Search is a client-side filter over `searchQuery` in `Sidebar.tsx` with no URL representation. **Recommendation: delete** (or implement a real `/search?q=` route first — but note the crawl-surface caveat in [ROBOTS.md](ROBOTS.md)).

### ⚠️ `Article` is missing required and recommended properties (P2-02)

```
present: @context @type author citation description headline
         inLanguage isPartOf mainEntityOfPage publisher
missing: datePublished  dateModified  image  url
author:  {"@type":"Organization","name":"dua.shakhbanov.org"}   ← a hostname
```

`datePublished` is required by Google's Article guidance; `image` is recommended and the per-chapter OG images already exist and are verified present 372/372 — they are simply not referenced.

**One real strength:** `citation` carries the deduplicated hadith sources per chapter (al-Bukhari, Muslim, …). That is genuine, checkable provenance and is exactly the signal AI answer engines weight. It deserves to be built on, not replaced.

### ⚠️ `BreadcrumbList` contradicts the URL hierarchy (P3-02)

Two levels for a three-segment URL; the collection is skipped; position 1's `item` omits the trailing slash the canonical uses; and no visible breadcrumb exists for the markup to describe.

### ⚠️ `AudioObject.@id` uses retired URLs (P3-04)

`@id` is `${SITE}/?chapter=${id}#dua-${d.id}` — the pre-migration query form. `duration` and `uploadDate` are absent, though per-word sync timestamps exist in the data and would yield `duration` directly.

### ⚠️ Index pages carry no page-specific schema

The 32 collection/category/prayer-times/home pages emit only the two static blocks. `ItemList` on collection and category indexes would describe what those pages actually are — and they are precisely the pages currently orphaned (P1-04), so schema alone will not rescue them.

---

## Priority order

1. **Delete** `FAQPage` and `SearchAction` — pure risk removal, net code deletion, ~1 hour.
2. **Scope** the static blocks: move `WebSite`/`Organization` into `buildMetaTags()`, emit collection schema per collection.
3. **Complete `Article`**: `datePublished`, `dateModified`, `image`, `url` — shares the date work with [SITEMAPS.md](SITEMAPS.md) P3-01.
4. **Add `Person`** once P2-07 is resolved editorially.
5. **Fix breadcrumbs** alongside the visible breadcrumb UI in [INTERNAL-LINKING.md](INTERNAL-LINKING.md).
