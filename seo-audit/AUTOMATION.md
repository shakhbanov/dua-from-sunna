# AUTOMATED SEO TESTING & OBSERVABILITY

## Current state

| Category | Status |
|----------|--------|
| SEO unit tests | ❌ None |
| Integration tests | ❌ None |
| Crawler tests | ❌ None |
| Schema tests | ❌ None |
| Sitemap tests | ❌ None |
| Canonical tests | ❌ None |
| Redirect tests | ❌ None (no redirects exist) |
| Broken-link tests | ❌ None |
| Metadata tests | ⚠️ One `grep` for `hreflang` |
| Any test framework | ❌ **None installed** |

A repository-wide search for `*.test.*`, `*.spec.*`, `vitest*` and `playwright*` returns nothing.

## The existing gate

`.github/workflows/deploy.yml` runs five shell assertions before deploying:

```bash
test -f dist/index.html
test -f "dist/slova-pominaniya-pri-probuzhdenii-oto-sna/index.html"
test -f "dist/en/supplications-upon-waking-up/index.html"
grep -q "اَلْحَمْدُ\|الْحَمْدُ" "dist/slova-pominaniya-pri-probuzhdenii-oto-sna/index.html"
grep -q "hreflang=\"en\"" "dist/slova-pominaniya-pri-probuzhdenii-oto-sna/index.html"
```

This is a genuinely good instinct — it verifies that prerendering produced real Arabic content and hreflang rather than an empty shell. It covers **2 files out of 372** and tests none of the invariants that actually broke.

Two additional safeguards exist and deserve credit: the **URL-collision guard** in `prerender.mjs` (fails the build if two routes collide) and the sitemap generator's **unpaired-route warning**.

## Why this matters

Every P1 in this audit was introduced by an ordinary, well-intentioned commit and would have been caught by a cheap automated check:

| Finding | Introduced by | Check that would have caught it |
|---------|---------------|--------------------------------|
| P1-01 — 20 URLs → 404 | `9419908` Quran restructure | Sitemap diff vs. previous deploy |
| P1-03 — link graph collapse | `e8f36d7` lint cleanup | Link-graph reachability |
| P1-04 — 6 orphan hubs | same | Orphan detection |
| P1-05 — 31 unreachable | same | BFS from `/` |
| P2-01 — two `<h1>`s | pre-existing | `<h1>` count assertion |

**This is the systemic issue.** Individual fixes address symptoms; the test suite prevents recurrence.

## Proposed suite

Eight checks, all runnable against `dist/` with no network access, no framework beyond Node, and no new dependency. Each is a few dozen lines.

| # | Check | Assertion | Catches |
|---|-------|-----------|---------|
| 1 | **Canonical integrity** | Every page has exactly one canonical: absolute, HTTPS, correct host, self-referencing | Canonical regressions |
| 2 | **Sitemap parity** | `sitemap.xml` ↔ `dist/**/index.html` is bijective | P1-01 |
| 3 | **Link-graph reachability** | ≥ 99% of pages reachable from `/`; **zero orphans** | P1-03/04/05 |
| 4 | **Heading contract** | Exactly one `<h1>` per page; its text matches the page subject | P2-01 |
| 5 | **Schema validity** | Every JSON-LD block parses; `Article` has `datePublished`, `dateModified`, `image`, `url`; no `FAQPage` | P2-02, P2-04 |
| 6 | **hreflang reciprocity** | Every `ru`↔`en` pair is mutual and both targets exist in the build | i18n regressions |
| 7 | **Retired-URL guard** | Every URL in the previous deploy's sitemap still 200s or has a stub | P1-01 recurrence |
| 8 | **Budget guard** | Main JS chunk under a declared gzip ceiling | P3-06 creep |

**Check 3 is the one to build first** — it alone would have caught three of the five regressions above.

### Wiring

Add a `seo-check` job to `deploy.yml` between build and deploy. Failing the check fails the deploy. Check 7 needs the previous sitemap, retrievable from the `gh-pages` branch:

```bash
git show gh-pages:sitemap.xml > /tmp/previous-sitemap.xml
```

## Observability — none exists

| Signal | Status |
|--------|--------|
| Google Search Console | ❌ Not connected |
| Bing Webmaster Tools | ⚠️ Verified (`BingSiteAuth.xml`) but no data pipeline |
| Indexation monitoring | ❌ |
| Crawl-error monitoring | ❌ |
| 4xx / 5xx monitoring | ❌ |
| Core Web Vitals field data | ❌ — **NOT AUDITABLE** |
| Organic traffic / impressions / CTR | ❌ |
| Structured-data error monitoring | ❌ |
| Uptime | ❌ |
| Analytics | ⚠️ Yandex Metrika only, if the secret is set |

**What does exist:** `scripts/indexnow-ping.mjs` — a well-built IndexNow client with `--changed` git-diff detection, 24-hour deduplication and dry-run mode, wired into the deploy with `continue-on-error`. That is real, thoughtful proactive submission infrastructure. It is *submission*, though, not *observation* — nothing reports back whether the URLs were accepted or indexed.

### Minimum viable observability

1. **Connect Google Search Console** — the single most valuable step. Without it, indexation status and field CWV remain NOT AUDITABLE.
2. **Weekly CrUX/PSI pull** for the top 10 pages, committed to the repo as a trend record.
3. **Alert on indexed-page-count drop** > 5% week-over-week — this is what would have flagged P1-01 in production.
4. **Wire Bing Webmaster data** — verification already exists; Bing feeds Copilot citations.
