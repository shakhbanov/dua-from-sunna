# SECURITY (SEO-relevant only)

Scope per audit rule 29: only issues affecting SEO or search integrity.

## Summary

| Area | Status |
|------|--------|
| HTTPS available and valid | ✅ |
| `http://` → `https://` redirect | 🔴 **Absent** (P2-06) |
| HSTS | 🔴 Absent — not settable on this hosting |
| CSP | ❌ Absent — not settable |
| `X-Robots-Tag` capability | ❌ Not available |
| XSS surface | ✅ None — no user input reaches the DOM |
| JSON-LD injection | ✅ Correctly escaped |
| UGC injection | ✅ N/A — no UGC |
| Malicious outbound links | ✅ None — only `quran.com` |
| Host poisoning | ✅ Not applicable — static files |
| Cache poisoning | ✅ Low — no dynamic responses |
| Indexable staging | ✅ **None exists** |
| Secret exposure | ✅ None found in build output |

## 🔴 `http://` serves 200 with no redirect (P2-06)

```
attempt 1: http://dua.shakhbanov.org/  → status=200  redirect=''
attempt 2:                             → curl (52) Empty reply from server
attempt 3: http://dua.shakhbanov.org/  → status=200  redirect=''
```

Full content served over cleartext, no `Location` header, no HSTS. Additionally:

```
https://shakhbanov.github.io/dua-from-sunna/  → 301 → http://dua.shakhbanov.org/
```

The `github.io` alias canonicalises to the right host but the **wrong scheme**, depositing crawlers arriving that way onto the insecure origin.

**Mitigation already in place:** every page carries an absolute `https://` canonical, so Google should consolidate to HTTPS regardless. This is why the finding is P2 and not P1.

**Fix:** enable "Enforce HTTPS" in repository Settings → Pages. The certificate is already provisioned. Roughly two minutes.

## ✅ No indexable non-production environment

Explicitly checked, as this is a P0-class risk when present:

| Environment | Status |
|-------------|--------|
| `staging.dua.shakhbanov.org` | Does not resolve |
| `dev.*` / `preview.*` | Do not resolve |
| `shakhbanov.github.io/dua-from-sunna/` | **301** to the custom domain ✅ |
| Preview deployments | None — the workflow deploys only `main` to `gh-pages` |

The `public/CNAME` file causes GitHub to redirect the `github.io` origin rather than serve a duplicate. This is the correct configuration and eliminates the most common duplicate-content failure mode for GitHub Pages sites.

## ✅ XSS and injection

No user input is ever rendered as HTML. The only input is the sidebar search field, held in React state and used solely for client-side filtering — never written to the DOM as markup, never sent anywhere, never placed in a URL.

JSON-LD is correctly escaped against script breakout (`entry-server.tsx`):

```js
json.replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026')
    .replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')
```

Complete, including the U+2028/2029 cases commonly omitted.

## ✅ Outbound links

The only external destination is `quran.com` (72 links from Quran chapter pages, in `DuaFooter.tsx`) — an appropriate, reputable reference. No user-supplied links, no affiliate links, no link-farm exposure.

## ⚠️ No header control (P1-02)

Static GitHub Pages hosting provides no way to set `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`, or `X-Robots-Tag`. None is currently *needed* — there is no XSS surface and nothing requires index suppression — but the capability gap is worth recording, since it constrains any future feature that would need it.

## Secrets

`VITE_YANDEX_METRIKA_ID` is injected at build time from GitHub Actions secrets and correctly no-ops when unset. `.env.local.example` contains placeholders only. No credentials, tokens or keys appear in `dist/`.
