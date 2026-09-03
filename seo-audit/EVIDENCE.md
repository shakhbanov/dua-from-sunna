# EVIDENCE LOG

Reproducible commands and raw measurements behind every finding. Audited artifact: `dist/` @ md5 `85ad6bf5c8aa71e665ea5efc3f729022`, **byte-identical to deployed `gh-pages` HEAD (`990f6b6`)**.

## E-00 · Artifact identity — audited build == production

```bash
$ git show 990f6b6:index.html > /tmp/ghp.html
$ md5 -q dist/index.html /tmp/ghp.html
85ad6bf5c8aa71e665ea5efc3f729022
85ad6bf5c8aa71e665ea5efc3f729022
```

> **Audit-integrity note.** An earlier pass in this audit inspected `dist/` while a build was still writing to it (`dist/index.html` was 137,927 B mid-write, 186,586 B when complete). That interim state produced three incorrect readings — a stale sitemap, 151 missing OG images, and a 3-link homepage. **All three were re-tested against the settled build and are false; none appears in this report.** They are recorded here because the discipline that caught them (re-verifying before reporting) is the same discipline the findings recommend for CI.

## E-01 · Link graph (P1-03, P1-04, P1-05)

```python
# parse all 372 dist/**/index.html, extract <a href>, resolve against page set
outbound distribution: {1:4, 2:339, 7:1, 8:1, 11:2, 12:3, 13:3, 14:3, 15:2,
                        16:1, 17:1, 18:1, 19:2, 20:2, 23:1, 24:2, 25:1,
                        36:1, 37:1, 340:1}
inbound distribution:  {0:6, 1:50, 2:296, 7:2, 12:12, 14:2, 172:2, 173:2}
depth from /:          {0:1, 1:340}          ← no depth 2
reachable from /:      341 / 372
unreachable:           31
orphans (0 inbound):   6
dead ends:             0
external link hosts:   {'quran.com': 72}
```

Orphans: `/dua-iz-korana/`, `/en/quran-duas/`, `/kategorii/`, `/en/categories/`, `/namaz/`, `/en/prayer-times/`

Root cause, `components/Sidebar.tsx:171`:
```tsx
const ChapterRow = ({ chapter, ..., onSelect }) => (
  <button onClick={() => onSelect(chapter.id)}>
```
Introduced by `e8f36d7`; the same file uses `RouteLink` (a real `<a href>`) at line 99.

## E-02 · Retired Quran URLs (P1-01)

```
$ curl -o /dev/null -w '%{http_code}' https://dua.shakhbanov.org<path>
/dua-iz-korana/dua-o-blage-v-oboikh-mirakh/   → 404
/en/quran-duas/duas-for-parents/              → 404
/dua-iz-korana/dua-iz-sury-al-fatiha/         → 200   (replacement)
/definitely-not-real-xyz/                     → 404   (correct 404 status)
```
Previously linked from the homepage — verified in `gh-pages` commit `d37fbb5` (288 homepage links, including the retired thematic Quran slugs). Current build: `dist/dua-iz-korana/` contains 37 surah dirs, 0 thematic.

## E-03 · Headings (P2-01)

```
<h1> count across 372 pages: {2: 372}
```
Outline of `/dua-iz-korana/dua-iz-sury-al-fatiha/`:
```
h1  دُعَاءٌ مِنَ السُّنَّةِ                                 ← Sidebar.tsx:67
h2  Дуа из суры «Аль-Фатиха» (1)                     ← the actual subject
h3  Мольба о прямом пути
h3  Установить «Дуа» на домашний экран
h1  Дуа и азкары из Сунны — арабский текст, перевод, аудио   ← site-wide constant
```
Confirmed identical on the live EN homepage (Russian `<h1>` under `lang="en"`).

## E-04 · Canonical & sitemap integrity (passing)

```
canonical missing or mismatched:            0 / 372
duplicate <title> groups:                   0
sitemap URLs:                             372
sitemap URLs with no prerendered page:      0
prerendered pages missing from sitemap:     0
pages with a missing og:image file:          0 / 372
dist/sitemap.xml == public/sitemap.xml:   md5 c221955ccc953c0299b09f921e01e2cf
distinct <lastmod> values:                ['2026-09-02']      ← P3-01
```

## E-05 · Structured data (P2-02, P2-03, P2-04)

```
ld+json blocks per page: {2:32, 4:90, 5:12, 6:238}

Article @ /dua-iz-korana/dua-iz-sury-al-fatiha/
  keys:          @context @type author citation description headline
                 inLanguage isPartOf mainEntityOfPage publisher
  author:        {"@type":"Organization","name":"dua.shakhbanov.org"}
  datePublished: None       dateModified: None
  missing:       image, url

BreadcrumbList: [(1,'Главная','https://dua.shakhbanov.org'),
                 (2,'Дуа из суры «Аль-Фатиха» (1)','…/dua-iz-sury-al-fatiha/')]
                 ← collection level omitted

og:type = website        (on a chapter page)
og:site_name = Дуа       (also on EN pages)
```

Non-existent search endpoint:
```bash
$ grep -rn "search_term_string\|?q=" src/ components/ App.tsx
(no matches)
```
yet `index.html` declares `"target":"https://dua.shakhbanov.org/?q={search_term_string}"`.

`stripDefaultMeta()` in `scripts/prerender.mjs` claims to strip static JSON-LD but contains only meta/link rules — no `<script>` rule. Consequence: static `WebSite` + `CreativeWork` ("подтверждённых достоверными хадисами") appear on all 372 pages including 74 Quran pages.

## E-06 · Protocol & environments (P2-06)

```
$ curl -sSI https://dua.shakhbanov.org/
HTTP/2 200 · server: GitHub.com · via: 1.1 varnish · x-served-by: cache-rtm-…
(no strict-transport-security, no content-security-policy, no x-robots-tag)

$ for i in 1 2 3; do curl -o /dev/null -w '%{http_code} %{redirect_url}' http://…/; done
200 ''  |  (52) empty reply  |  200 ''

$ curl -o /dev/null -w '%{http_code} → %{redirect_url}' https://shakhbanov.github.io/dua-from-sunna/
301 → http://dua.shakhbanov.org/          ← right host, wrong scheme
```
No `staging.*`, `dev.*` or `preview.*` hosts resolve. No preview deployments in `deploy.yml`.

## E-07 · Performance (P3-06, P4-01)

```
dist/assets/index-BVnQHUfw.js   raw 1,302,901   gzip 319,472
dist/assets/Adhan-DtJUjD0M.js   raw    13,952   gzip   4,814
dist/assets/index-DHzEgGqC.css  raw    28,931   gzip   5,876
dist/index.html                 raw   186,586   gzip ~ 15,000
chapter page                    raw    57,345   gzip   9,310

TTFB (live, Fastly fra edge): 327–375 ms
content <img> elements: 0
```
Render-blocking: `<link href="https://fonts.googleapis.com/css2?family=Amiri…&family=Aref+Ruqaa…&family=Inter…&family=Scheherazade+New…" rel="stylesheet">` — while `@fontsource/amiri`, `@fontsource/inter`, `@fontsource/scheherazade-new` sit unused in devDependencies.

## E-08 · Absent page types (P2-07)

Scan of all 372 pages for `about`, `o-proekte`, `contact`, `kontakty`, `privacy`, `policy`, `terms`, `editorial`, `corrections`, `istochniki`, `sources` → **no matches**. `allRoutes()` emits six view types only: `home`, `prayer-times`, `categories-index`, `collection-index`, `chapter`, `category`.

## E-09 · Test infrastructure (P5-01)

```bash
$ find . -path ./node_modules -prune -o \
    \( -name "*.test.*" -o -name "*.spec.*" -o -name "vitest*" -o -name "playwright*" \) -print
(no output)
```
Only gate: 5 shell assertions in `.github/workflows/deploy.yml` covering 2 of 372 files.

## E-10 · Taxonomy

12 curated categories in `data/categories.ts`: `morning-evening-adhkar`, `sleep`, `daily`, `wudu-prayer`, `food`, `travel`, `distress`, `family`, `sickness-death`, `hajj-umrah`, `social`, `weather`. No empties, no duplicates, no auto-generation.

## Not auditable

| Item | Reason |
|------|--------|
| Actual indexation status | GSC not connected |
| Field Core Web Vitals | CrUX/GSC not connected |
| Organic traffic / impressions / CTR | No analytics export available |
| Historical crawl behaviour | No log access |
| Backlink profile | Out of scope; no data source connected |

Recorded as NOT AUDITABLE per audit rule 36 — not as passes.
