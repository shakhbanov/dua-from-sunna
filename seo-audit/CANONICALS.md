# CANONICAL AUDIT

**Result: 372/372 pages pass every canonical check. Zero defects.**

This is the cleanest area of the site and reflects a genuinely good design decision — canonicals are computed from the same route table that produces the URLs, so they cannot drift.

## Verification

Every one of the 372 prerendered pages was parsed and its canonical compared to its own path:

```
canonical missing or mismatched: 0
```

| Check | Result |
|-------|--------|
| Canonical exists | ✅ 372/372 |
| Absolute URL | ✅ 372/372 |
| HTTPS scheme | ✅ 372/372 |
| Correct host (`dua.shakhbanov.org`) | ✅ 372/372 |
| Self-referencing | ✅ 372/372 |
| Returns 200 | ✅ 372/372 |
| Target indexable | ✅ 372/372 |
| Present in sitemap | ✅ 372/372 |
| Internal links point to canonical | ✅ — all links built by `buildChapterPath()` etc. |
| Matches `og:url` | ✅ — both from the same `MetaOutput.canonical` |
| Consistent with hreflang | ✅ — RU canonical == RU hreflang on RU pages |
| Trailing slash matches | ✅ |

## Pathologies checked for — none found

| Pathology | Count |
|-----------|-------|
| Canonical chains | 0 |
| Canonical loops | 0 |
| Canonical → redirect | 0 |
| Canonical → 404 | 0 |
| Canonical → noindex | 0 |
| Canonical → unrelated content | 0 |
| Cross-language canonical | 0 |
| Duplicate `<link rel="canonical">` | 0 — `stripDefaultMeta()` removes the static one before SSR injection |

## Why it holds

```
src/router/routes.ts  →  route.path
        ↓
entry-server.render() →  buildMetaTags({ path: route.path })
        ↓
updateMetaTags.ts     →  canonical = `${SITE}${m.path}`     ← single derivation
        ↓                og.url    = same value
buildHeadHtml()       →  <link rel="canonical"> + <meta property="og:url">
```

The canonical, `og:url` and sitemap `<loc>` are the same string from the same source. Divergence is not possible without changing the route table, and the same table drives the sitemap.

`stripDefaultMeta()` in `prerender.mjs` removes the static template's canonical before injecting the SSR one — verified: no page has two.

## Client-side navigation

`applyMetaTags()` (`updateMetaTags.ts`) updates the canonical on SPA navigation via `setAttr('link[rel="canonical"]', 'href', …)`. Since every route is also prerendered, crawlers see the correct canonical in raw HTML regardless — the client-side path is a UX nicety, not a dependency.

## The one caveat

Canonical correctness is currently a *property of the build*, protected by no test. Nothing in CI asserts it. Given that P1-01 and P1-03 both slipped through, this invariant is worth locking down — see [AUTOMATION.md](AUTOMATION.md), check #3.

## Related weakness

Correct canonicals are also the reason P2-06 (`http://` serving 200) is P2 rather than P1: every page carries an absolute HTTPS canonical, so Google should consolidate to the secure origin regardless. The canonical architecture is doing real defensive work here.
