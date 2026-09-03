# AUTHORS · TOPICS · ENTITIES

## Authors — absent (P2-07)

| Element | Status |
|---------|--------|
| Author URLs / pages | **ABSENT** |
| Author bios | **ABSENT** |
| Expertise / credentials | **ABSENT** |
| `Person` structured data | **ABSENT** |
| `sameAs` identity links | **ABSENT** |
| Author → article relationships | **ABSENT** |
| Editor / reviewer attribution | **ABSENT** |

The only authorship signal anywhere is:

```json
"author": { "@type": "Organization", "name": "dua.shakhbanov.org" }
```

A hostname string. It resolves to no entity, carries no credentials, and links to nothing.

### Why this matters more here than on most sites

This is religious guidance — supplications people recite and act on, with translations that must be accurate against the Arabic. Google's quality guidance weights "who is responsible for this content, and what qualifies them" heavily for material with real-world consequence. AI answer engines increasingly require identifiable authorship before citing a source.

The site has strong **content** provenance — every dua carries its hadith citation or sura:ayah reference, deduplicated into `Article.citation`. It has **zero publisher** provenance: nothing states who compiled these, who translated them, who verified the translations, or how an error would be reported and corrected.

### What is needed

1. A named compiler/translator with stated qualifications, as a `Person` with `@id`, `url` and `sameAs`.
2. If a scholar reviewed the translations, credit them — this is the single strongest E-E-A-T signal available to this site.
3. `Article.author` → the `Person`; `Article.publisher` → a properly described `Organization`.
4. An author page listing contributed chapters.

**This requires decisions only the site owner can make** — who is named, what credentials are claimed, whether review attribution is accurate. It is not an engineering task, and it should not be fabricated. Flagged as a decision, not a ticket.

### User profiles — correctly N/A

No accounts, no registration, no profiles. There is no risk of indexing thin auto-generated user pages, which is a common publisher failure mode. Recorded as **N/A, correctly avoided**.

---

## Topics — absent

No topic layer exists above categories. There is no semantic hierarchy, no topic hub pages, no pillar/cluster architecture. Categories are a flat set of 12.

---

## Categories — present and well-curated, but unreachable

```
morning-evening-adhkar · sleep · daily · wudu-prayer · food · travel
distress · family · sickness-death · hajj-umrah · social · weather
```

| Check | Result |
|-------|--------|
| Bilingual titles + summaries | ✅ |
| Empty categories | ✅ None |
| Duplicate / overlapping taxonomy | ✅ None |
| Uncontrolled generation | ✅ None — hand-curated |
| Indexable, canonical, in sitemap | ✅ 24/24 |
| Reachable from `/` | 🔴 **No** — all 24 unreachable (P1-05) |
| Editorial body content | ⚠️ Summary + link list only (P4-03) |
| Category → chapter links | ✅ Present (7–37 per page) |
| Chapter → category links | 🔴 **Absent** — relationship is one-directional |

The taxonomy itself is sound. It is invisible to crawlers and thin on content — the two things that make an otherwise good taxonomy worthless.

---

## Entities — absent, but latent in the data

No entity modelling exists. Yet the corpus already contains a well-structured implicit graph:

| Entity class | Instances | Where it lives today |
|--------------|-----------|----------------------|
| Hadith collections | 7 named | `dua.source` strings → `Article.citation` |
| Surahs | 37 | First-class since `9419908` — own pages and slugs |
| Occasions / situations | 12 | Category labels |
| Persons (Prophet ﷺ, companions) | — | Free text inside translations |

**The surah restructure quietly created the site's first real entity layer** — each surah now has a stable URL and identity. Extending that treatment to hadith collections (a page per collection, `@id`-linked from every dua citing it) would build a genuine entity graph out of data that already exists, and would give the orphaned hub problem a purposeful set of new hubs to solve alongside it.

---

## Summary

| Layer | Status | Priority |
|-------|--------|----------|
| Author | Absent | **High** — largest qualitative gap (P2-07) |
| Category | Present, unreachable, thin | **High** — fix linking (P1-05) + content (P4-03) |
| Topic | Absent | Medium — needed for scale, not for today |
| Entity | Absent, data latent | Medium — high leverage for AI citation |
| Tag | Absent | ✅ Correctly avoided |
| User profile | Absent | ✅ Correctly avoided |
