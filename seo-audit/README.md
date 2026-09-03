# SEO Forensic Audit — `dua.shakhbanov.org`

**Date:** 2026-09-03 · **Score: 58/100** · **P0: 0 · P1: 3 · P2: 7 · P3: 6 · P4: 4 · P5: 3**

Audited artifact: `dist/` @ md5 `85ad6bf5c8aa71e665ea5efc3f729022` — byte-identical to the deployed `gh-pages` HEAD, so findings reflect live production.

**No application code, configuration, data or deployment artifact was modified. This directory contains audit output only.**

## Read in this order

| Document | Purpose |
|----------|---------|
| [EXECUTIVE-SUMMARY.md](EXECUTIVE-SUMMARY.md) | Score, top 10 risks, top 10 ROI fixes, verdict |
| [CRITICAL-ISSUES.md](CRITICAL-ISSUES.md) | The 3 P1s in detail |
| [SCORE.md](SCORE.md) | Weighted 13-category breakdown with per-deduction evidence |
| [FINDINGS.md](FINDINGS.md) | All 23 findings in full ISSUE/EVIDENCE/FIX format |
| [REMEDIATION-ROADMAP.md](REMEDIATION-ROADMAP.md) | Phased plan + **final verdict on 100k-article scale** |
| [EVIDENCE.md](EVIDENCE.md) | Raw measurements and reproducible commands |

## Domain reports

| Document | Verdict |
|----------|---------|
| [PAGE-TYPE-MATRIX.md](PAGE-TYPE-MATRIX.md) | 8 page types present, 16 absent |
| [URL-ARCHITECTURE.md](URL-ARCHITECTURE.md) | ✅ Excellent — one structural liability |
| [INDEXABILITY.md](INDEXABILITY.md) | ✅ Zero conflicting signals |
| [CANONICALS.md](CANONICALS.md) | ✅ **372/372 perfect** |
| [SITEMAPS.md](SITEMAPS.md) | ✅ Exact parity; `lastmod` defective |
| [ROBOTS.md](ROBOTS.md) | ✅ Valid and correct |
| [STRUCTURED-DATA.md](STRUCTURED-DATA.md) | ⚠️ Valid JSON, 2 fabricated claims |
| [INTERNAL-LINKING.md](INTERNAL-LINKING.md) | 🔴 **Weakest area** — 2.0/8 |
| [CONTENT-ARCHITECTURE.md](CONTENT-ARCHITECTURE.md) | ⚠️ Clean model, no editorial layer |
| [AUTHORS-TOPICS-ENTITIES.md](AUTHORS-TOPICS-ENTITIES.md) | 🔴 No author entity at all |
| [UGC-COMMENTS.md](UGC-COMMENTS.md) | ✅ N/A — no UGC surface |
| [PERFORMANCE.md](PERFORMANCE.md) | ⚠️ Fast HTML, 319 KB gzip JS |
| [GEO-AI-SEARCH.md](GEO-AI-SEARCH.md) | ✅ Strong — 75% |
| [SECURITY.md](SECURITY.md) | ⚠️ No HTTPS redirect; no staging leak |
| [AUTOMATION.md](AUTOMATION.md) | 🔴 Zero SEO tests |

## Headline

**One day of work (Phase 0) moves the score from 58 to roughly 72.** The three highest-value changes are a one-line component swap in `components/Sidebar.tsx:171`, adding hub links to the header, and deleting two pieces of fabricated schema.
