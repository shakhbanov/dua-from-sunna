# AI SEARCH / GEO READINESS

**Score: 1.5 / 2 (75%) — the second-strongest category, and clearly deliberate.**

## What is in place

| Signal | Status |
|--------|--------|
| Content in raw HTML (no JS required) | ✅ All 372 pages prerendered |
| AI crawler access | ✅ 13 crawlers explicitly allowed in `robots.txt` |
| `llms.txt` | ✅ 81 KB, bilingual, structured with collection and category indexes |
| `llms-full.txt` | ✅ 448 KB full corpus |
| Self-contained passages | ✅ Each dua is complete: Arabic + translation + source |
| Primary-source attribution | ✅ Per-dua hadith citation or sura:ayah |
| Factual clarity | ✅ Declarative, unhedged, no filler |
| Semantic structure | ⚠️ Undermined by the heading defect |
| Entity clarity | ⚠️ Entities exist as strings, not identities |
| Organisation identity | ⚠️ Weak — a hostname |
| Author identity | 🔴 **Absent** |
| Content provenance (dates, revisions) | 🔴 **Absent** |

A note on `llms.txt`: it is a community convention, not a Google signal, and Google has stated it does not use it. It is not harmful and may help some AI crawlers, but it should not be counted as an indexing signal. The far more important factor — that the content is fully server-rendered and citable without JS execution — is already true here.

## Why this content is intrinsically citable

The corpus has properties AI answer engines reward, largely as a by-product of the subject matter being handled carefully:

1. **Atomic, self-contained units.** Each dua carries Arabic, transliterable diacritics, full translation and its source in one block — extractable and quotable without surrounding context.
2. **Primary-source attribution per unit.** "al-Bukhari 6306", "an-Nasa'i 1/279" — checkable references, not vague appeals to authority.
3. **Bilingual parallel corpus.** RU and EN pages are true translations of the same source with correct hreflang, letting a model align terminology across languages.
4. **No hedging or padding.** The prose states what the supplication is, when it is said, and where it comes from.
5. **Zero contradiction surface.** No comments, no user contributions, no conflicting claims.

## The gap: provenance

Everything above concerns *content* provenance, which is strong. What is missing is *publisher* provenance:

- **No author** — no `Person`, no credentials, no identity (P2-07).
- **No dates** — nothing indicates when a translation was made or last revised (P2-02).
- **No revision history** — no way to establish that an error was corrected.
- **No editorial policy** — no statement of how translations are verified.

AI systems increasingly weight identifiable authorship and content freshness when deciding *whether to cite* versus merely *read*. A corpus with excellent source citations but no identifiable compiler is a strong candidate for extraction and a weak one for attribution.

## Recommendations, in order

1. **Add author identity and dates** (P2-07, P2-02). Highest-impact GEO change available, and it is the same work that fixes E-E-A-T and `lastmod`.
2. **Fix the heading hierarchy** (P2-01). Passage extraction relies on heading structure; today every page's `<h1>` says the same thing and the real subject is an `<h2>`.
3. **Build the entity layer.** Hadith collections and surahs already exist as structured data ([AUTHORS-TOPICS-ENTITIES.md](AUTHORS-TOPICS-ENTITIES.md)); giving them `@id`s and pages would let models connect duas to sources as entities rather than strings.
4. **Delete the fabricated schema** (P2-03, P2-04). A `SearchAction` pointing at a non-existent endpoint and `FAQPage` questions absent from the page are exactly the inconsistencies that reduce machine trust in the rest of the markup.
5. **Add provenance to `llms.txt`** — per-entry canonical URLs and a generation timestamp (P5-03).

## Explicitly not recommended

No "AI SEO tricks", prompt injection in markup, hidden text for crawlers, or keyword stuffing in `llms.txt`. None is present in this codebase and none should be added. The site's AI-search position improves through the same work that improves it for search engines and for readers: identifiable authorship, accurate dates, honest markup, clean structure.
