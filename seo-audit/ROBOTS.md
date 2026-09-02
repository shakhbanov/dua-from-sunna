# ROBOTS.TXT AUDIT

**Result: valid, permissive, and correct. No accidental blocking.**

Live: `https://dua.shakhbanov.org/robots.txt` → **200**, `text/plain`, 897 bytes.

## Content

```
User-agent: *
Allow: /

# --- AI answer engines ---
GPTBot · OAI-SearchBot · ChatGPT-User        (OpenAI)
ClaudeBot · Claude-Web · anthropic-ai        (Anthropic)
PerplexityBot · Perplexity-User              (Perplexity)
Google-Extended                              (Gemini / AI Overviews)
CCBot                                        (Common Crawl)
Applebot-Extended                            (Apple Intelligence)
YandexBot · Bingbot
    → all: Allow: /

Sitemap: https://dua.shakhbanov.org/sitemap.xml
Host: dua.shakhbanov.org
```

## Checks

| Check | Result |
|-------|--------|
| Syntax valid | ✅ |
| `User-agent` groups well-formed | ✅ |
| Sitemap directive present and absolute | ✅ |
| CSS blocked | ✅ No |
| JS blocked | ✅ No |
| Images blocked | ✅ No |
| Important pages blocked | ✅ No |
| Unnecessary crawl restrictions | ✅ None |
| Used as a substitute for `noindex` | ✅ **No** — nothing is disallowed, so the anti-pattern cannot occur |

## Notes

**`Host:` directive** — non-standard, honoured only by Yandex and ignored elsewhere. Given the RU-primary audience this is a deliberate, harmless choice. Not a defect.

**Explicitly listing AI crawlers is redundant but not wrong.** `User-agent: * / Allow: /` already permits them; the named groups make the intent legible to a human reader and guard against a future blanket `Disallow`. This is a considered choice, not noise.

**`Allow: /` with no exclusions is safe *here* specifically because the URL space is closed** — 372 URLs, no search URLs, no filters, no parameters (see [URL-ARCHITECTURE.md](URL-ARCHITECTURE.md)). This is the correct configuration for the current architecture.

⚠️ **It will not remain correct if the architecture changes.** Adding a `/search?q=` route, filters, or pagination under this `robots.txt` would expose an unbounded crawl surface immediately. Treat any such feature as requiring a `robots.txt` update in the same change.

## What robots.txt cannot do here

`robots.txt` is the *only* crawler-directive mechanism available on this hosting. There is no `X-Robots-Tag` (no header control — P1-02), so any future need to suppress a non-HTML resource (a PDF, a JSON export) from indexing has no clean solution on GitHub Pages. Worth knowing before it is needed.
