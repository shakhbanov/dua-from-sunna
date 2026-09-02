# CRITICAL ISSUES — Act On These First

**P0: 0 · P1: 3**

No finding meets the brief's P0 bar. There is no site-wide `noindex`, no robots block on critical content, no canonical failure, no indexable staging environment, no duplicate-URL explosion, and production is available and serving correctly. That is the accurate result.

---

## 1. Twenty indexed URLs went to 404 on the last deploy — and cannot be redirected

Commit `9419908` re-slugged the Quran collection from thematic to surah-based URLs. The previous slugs were live, linked from the homepage and submitted via IndexNow. They now return hard 404s, and GitHub Pages offers no redirect mechanism.

```
/dua-iz-korana/dua-o-blage-v-oboikh-mirakh/  → 404   (was linked from home in deploy d37fbb5)
/en/quran-duas/duas-for-parents/             → 404
/dua-iz-korana/dua-iz-sury-al-fatiha/        → 200   (the replacement)
```

**Why it is urgent:** every day these stay 404 is signal decay, and the window to recover them narrows once Google drops them. **Full detail:** [FINDINGS.md#p1-01](FINDINGS.md).

**Note on the restructure itself:** moving from thematic to surah-based Quran URLs is a *defensible editorial decision* — mushaf order is the canonical organisation for Quranic material and the surah slugs are more stable long-term. The problem is not the decision; it is that it shipped without a migration path.

---

## 2. There is no redirect layer, and the current hosting cannot provide one

P1-01 is the first instance of this, not a one-off. Static GitHub Pages hosting means every future slug change permanently destroys its predecessor's equity, and there is no `X-Robots-Tag`, HSTS, or cache-control control either.

**Full detail:** [FINDINGS.md#p1-02](FINDINGS.md) · [SECURITY.md](SECURITY.md)

---

## 3. The internal link graph collapsed to a single hub — from one line of code

```
Outbound internal links, all 372 pages:     Link depth from /:
  2 links   → 339 pages                       depth 0 →   1 page
  7–37      →  32 pages                       depth 1 → 340 pages
  340       →   1 page (homepage)             depth 2 →   0 pages
```

Root cause, `components/Sidebar.tsx:171` — the 134-chapter primary navigation renders as buttons:

```tsx
const ChapterRow = ({ chapter, ..., onSelect }) => (
  <button onClick={() => onSelect(chapter.id)}>   // ← crawlers cannot follow this
```

Introduced by `e8f36d7` *"Clear every react-doctor finding: 65 → 100"*. The same commit deliberately kept `RouteLink` (a real `<a href>`) for the collection switcher 70 lines earlier in the same file — so the anchor component exists, is already imported, and simply is not used here.

**Consequences, all measured:**
- **6 hub pages have zero inbound internal links:** `/kategorii/`, `/en/categories/`, `/namaz/`, `/en/prayer-times/`, `/dua-iz-korana/`, `/en/quran-duas/`. The entire taxonomy and prayer-times layer exists only in the sitemap.
- **31 pages are unreachable from `/`**, including all 24 category pages and `/en/` itself.
- **No page sits deeper than one click**, so there is no hierarchy for search engines to infer topical structure from.

**This is the highest-leverage fix in the audit.** Swapping the `<button>` for the already-imported `RouteLink` restores crawlable navigation across 340 pages in roughly an hour.

**Full detail:** [FINDINGS.md#p1-03](FINDINGS.md) · [INTERNAL-LINKING.md](INTERNAL-LINKING.md)

---

## A caution about the cause

Findings 1 and 3 were both introduced by commits that improved something real — a cleaner content model, a perfect `react-doctor` score. Neither was careless. They shipped because **nothing in CI tests SEO invariants**: the deploy gate is five shell assertions covering two files out of 372. A link-graph check and a sitemap-parity check would have caught both before they reached production. That is the actual systemic issue, and it is addressed in [AUTOMATION.md](AUTOMATION.md).
