# INTERNAL LINKING

**Score: 2.0 / 8 — the weakest area of the audit, and the one with the highest-leverage fix.**

## Measured graph

All 372 rendered pages parsed for `<a href>`; asset links excluded; targets resolved against the page set.

```
OUTBOUND link distribution              INBOUND link distribution
  2 links   → 339 pages                   0 inbound →   6 pages   ← orphans
  7–37      →  32 pages (hubs)            1 inbound →  50 pages
  340       →   1 page  (homepage)        2 inbound → 296 pages
                                          7–14      →  16 pages
LINK DEPTH FROM /                         172–173   →   4 pages
  depth 0 →   1 page
  depth 1 → 340 pages                   Reachable from /: 341 / 372
  depth 2 →   0 pages                   Unreachable:       31
                                        Dead ends:          0
```

**There is no depth 2.** The graph is a star: one hub, 340 spokes, no edges between spokes.

## Root cause — one component

`components/Sidebar.tsx:171`, the 134-chapter primary navigation:

```tsx
const ChapterRow: React.FC<RowProps> = ({ chapter, language, collection, isCurrent, onSelect }) => {
  return (
    <button onClick={() => onSelect(chapter.id)}>      // ← crawlers cannot follow
```

Introduced by `e8f36d7` *"Clear every react-doctor finding: 65 → 100"*. Seventy lines earlier **the same commit uses the correct pattern** for the collection switcher:

```tsx
<RouteLink href={buildChapterPath(defaultChapterIdFor(c.id), language, c.id)}>
```

`RouteLink` (`src/router/RouteLink.tsx`) renders a real `<a href>` and intercepts clicks for SPA navigation. It is already imported in `Sidebar.tsx`. The fix is to use it in `ChapterRow` too.

## The six orphans

Zero inbound internal links — reachable only via `sitemap.xml`:

```
/kategorii/        /en/categories/       ← the entire category taxonomy entry point
/dua-iz-korana/    /en/quran-duas/       ← the Quran collection landing pages
/namaz/            /en/prayer-times/     ← the prayer-times tool
```

Every hub page on the site is orphaned. These are the pages that should be *concentrating* equity and distributing it downward; instead they receive none and pass none.

## The 31 unreachable pages

All 24 category pages, both collection indexes, both categories indexes, both prayer-times pages, and **`/en/`** — the English homepage. There is no crawlable link from the Russian tree to the English tree; the language switcher is `<button onClick={() => onSelectLanguage(l)}>`. hreflang annotations exist and are correct (372/372), so Google can still discover EN — but hreflang is a *relationship* hint, not a link, and it passes no equity.

## What the expected graph looks like

```
                        /  ·  /en/
                            │
        ┌───────────────────┼───────────────────┐
   /kategorii/        /dua-iz-korana/        /namaz/
        │                   │
   category pages ×12   quran chapters ×37
        │                   │
        └──── chapter ──────┘
               │  ├─ breadcrumb → collection → home
               │  ├─ prev / next chapter
               │  ├─ parent categories
               │  └─ 3–5 related chapters
```

Each chapter should emit roughly 8–12 contextual links instead of 2, and each hub should receive inbound links from every page beneath it.

## Fix sequence

| # | Change | File | Effect |
|---|--------|------|--------|
| 1 | `<button>` → `RouteLink` in `ChapterRow` | `Sidebar.tsx:171` | Restores crawlable navigation on 340 pages |
| 2 | Header/footer links to the three hubs (×2 languages) | `AppHeader.tsx` | Removes all 6 orphans |
| 3 | Language switcher → `<a href>` to the hreflang counterpart | `Sidebar.tsx` | Connects the RU and EN trees; `/en/` reachable |
| 4 | Visible breadcrumb on chapter pages | `ChapterReader.tsx` | Creates depth 2; feeds hubs; fixes P3-02 |
| 5 | Prev/next chapter links | `DuaPager.tsx` | Sequential crawl path through each collection |
| 6 | "Related duas" from shared categories | `ChapterReader.tsx` | Topical clustering between spokes |

Items 1–3 are roughly half a day and resolve every orphan and unreachable page. Items 4–6 build the hierarchy.

## Scale assessment

The homepage currently links to all 340 content pages individually. That is viable at 372 pages and impossible at 100,000 — the homepage would need 100,000 links. The fix sequence above is also the migration path: once hubs and breadcrumbs exist, the homepage can link to ~20 hubs instead of every leaf, and the graph gains the depth it needs to scale. **The linking fix is not just remediation; it is the prerequisite for growth.**
