# CONTENT & EDITORIAL ARCHITECTURE

## The data model as it exists

```
Collection (2)            data/collections.ts    — sunna (134 ch.), quran (36 ch.)
  └─ Chapter (170)        data/chapters/*.ts, data/quran/*.ts
       ├─ id, title{ru,en}, description{ru,en}?
       ├─ slug{ru,en}     data/slugs.ts, data/quranSlugs.ts
       └─ Dua (367)
            ├─ sync: WordSync[]   — per-word Arabic + timing
            ├─ fullTranslation{ru,en}
            ├─ source{ru,en}      — hadith citation, or sura:ayah
            └─ audioUrl?
Category (12)             data/categories.ts     — chapterIds[] → many-to-many
LongDescription (30)      data/descriptions.ts   — hand-written explainers
```

This is a clean, typed, well-normalised model for a **reference corpus**. Slugs are separated from titles, translations are first-class, citations are per-dua, and the collection abstraction absorbed a second corpus (Quran) without restructuring. `routeCatalog()` and `contentCatalog()` expose it as plain data to every build script — which is why sitemap/canonical/OG parity is perfect.

## What the model does not have

| Entity | Status | Consequence |
|--------|--------|-------------|
| `Author` | **Absent** | No `Person` schema, no author pages, no E-E-A-T attribution |
| `Editor` / `Reviewer` | **Absent** | No scholarly-review signal on religious content |
| `datePublished` / `dateModified` | **Absent** | No freshness signal; `Article` incomplete; `lastmod` meaningless |
| `ArticleRevision` | **Absent** | No update history, no corrections trail |
| `Entity` (Person/Place/Concept) | **Absent** | No entity graph — Prophet ﷺ, companions, hadith collections, surahs are strings, not entities |
| `Topic` (distinct from Category) | **Absent** | Only one taxonomy level exists |
| `ArticleRelation` | **Absent** | No "related duas"; relatedness only inferable via shared categories |
| `MediaAsset` | **Partial** | `audioUrl` is a bare string; no duration, licence or attribution |
| `Redirect` | **Absent** | Root cause of P1-01 |
| `Comment` / UGC | **Absent** | Deliberate — see [UGC-COMMENTS.md](UGC-COMMENTS.md) |

## Taxonomy: category vs topic vs tag vs entity

Only **one** of the four exists.

| Layer | Present | Notes |
|-------|---------|-------|
| **Category** | ✅ 12, curated | `morning-evening-adhkar`, `sleep`, `daily`, `wudu-prayer`, `food`, `travel`, `distress`, `family`, `sickness-death`, `hajj-umrah`, `social`, `weather`. Hand-assigned, bilingual, no empties, no duplicates. |
| **Topic** | ❌ | No semantic layer above categories |
| **Tag** | ❌ | ✅ Good — no uncontrolled tag generation, so no tag-page sprawl |
| **Entity** | ❌ | Hadith collections and surahs appear only as display strings |

The 12 categories are genuinely well-curated: mutually intelligible, no overlap ambiguity, every one populated. The problem is not the taxonomy — it is that the taxonomy is **unreachable** (P1-05) and **thin** (P4-03). The best-designed part of the information architecture is the part search engines cannot reach.

## Entity opportunity

The corpus contains a rich implicit entity graph that is currently flattened to strings:

- **Hadith collections** — al-Bukhari, Muslim, Abu Dawud, at-Tirmidhi, Ibn Majah, an-Nasa'i, Ahmad. Already parsed per dua into `Article.citation`.
- **Surahs** — 37 surahs, already first-class after the `9419908` restructure (each has its own page and slug).
- **Occasions** — waking, sleeping, travel, rain, illness. Currently only category labels.

Making these real entities with `@id`s would let each dua connect to its source collection, its surah, and its occasion — the structure AI answer engines use to establish topical authority. The data to do this **already exists**; it needs modelling, not authoring.

## Missing distribution surface: RSS

No feed of any kind. For a corpus with no dates this is currently moot, but once `datePublished` exists (P2-02), per-collection and per-category Atom feeds become cheap to generate from `contentCatalog()` and give the archive a syndication path it does not have.

## Editorial model

There is no CMS, no draft state, no review workflow, no publishing pipeline beyond `git push` → GitHub Actions. For a fixed reference corpus maintained by one person, **that is a reasonable and defensible choice** — a CMS would add operational cost with little benefit at this size.

It stops being reasonable at the scale the brief asks about. Sustained editorial throughput at 100k articles needs draft/review states, revision history, per-article dates and author attribution — none of which the current model can represent. See [REMEDIATION-ROADMAP.md](REMEDIATION-ROADMAP.md).
