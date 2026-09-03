# UGC / COMMENTS AUDIT

## Status: N/A — no UGC surface exists

Verified across the full codebase and all 372 rendered pages.

| Surface | Present |
|---------|---------|
| Comments | ❌ |
| User accounts / registration / login | ❌ |
| User profiles | ❌ |
| Content submission | ❌ |
| Ratings / reviews | ❌ |
| Forums / discussion | ❌ |
| User-generated links | ❌ |
| Any server-side write path | ❌ — fully static hosting |

There is no backend, no database, no authentication and no write path of any kind. The site is prerendered HTML on static hosting.

## Consequent risk assessment

Every risk in this category is **structurally absent**, not merely unobserved:

| Risk | Status |
|------|--------|
| Comment spam | Not possible |
| Link injection / SEO spam | Not possible |
| XSS via user input | Not possible |
| Thin UGC pages | Not possible |
| Auto-generated profile pages indexed | Not possible |
| `rel="ugc"` / `rel="nofollow"` needed | N/A |
| Comment pagination crawl traps | N/A |
| Moderation burden | None |

**Scored 4/4 as absence of risk, not as achievement.** If UGC is ever introduced, this category must be re-audited from zero.

## The one user-input surface that does exist

The sidebar search field (`Sidebar.tsx`) accepts text into React state (`searchQuery`) and filters the chapter list client-side. It is never written to the DOM as HTML, never sent anywhere, and never appears in a URL. No injection or crawl-surface risk.

## Policy to adopt *before* any UGC ships

Recorded now so the decision is not made under delivery pressure later:

1. **Comment links:** `rel="ugc nofollow"` on all user-supplied links, without exception.
2. **Comment indexation:** comments render on the parent page under its canonical. No per-comment URLs, no comment permalinks, no comment pagination as separate indexable URLs.
3. **Profiles:** `noindex` by default. A profile becomes indexable only on meeting a substantive contribution threshold — never on registration.
4. **Sanitisation:** allowlist-based HTML sanitisation server-side, not client-side. Never trust the client.
5. **Moderation:** pre-moderation or rate limiting from day one. Religious content attracts both doctrinal disputes and targeted spam.
6. **Schema:** `DiscussionForumPosting` only if real discussion exists — and never `FAQPage` over comments (the site already has a fabricated-FAQ problem to unwind; see [STRUCTURED-DATA.md](STRUCTURED-DATA.md)).
7. **`robots.txt`:** must be updated in the same change. The current `Allow: /` with no exclusions is safe only because the URL space is closed — UGC opens it.

Adding UGC also means adding a backend, which changes the hosting model — and would incidentally resolve P1-02 (no redirect layer).
