#!/usr/bin/env python3
"""Read the collected SERPs and answer the questions that pick the content plan.

Free, no API. For each query: who holds the top-10, how many are sites we
cannot realistically outrank, and — the question that decides the format —
what *kind* of page Yandex is rewarding.
"""

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "seo-audit" / "serp"
OURS = "dua.shakhbanov.org"

HEAVYWEIGHTS = {
    "ru.wikipedia.org", "wikipedia.org", "dzen.ru", "vk.com", "ok.ru",
    "youtube.com", "rutube.ru", "islam.ru", "islam-today.ru", "ria.ru",
    "rbc.ru", "lenta.ru", "kp.ru", "aif.ru", "gazeta.ru", "tass.ru",
    "yandex.ru", "mail.ru", "ozon.ru", "wildberries.ru", "avito.ru",
    "t.me", "pinterest.com", "tiktok.com",
}

# What Yandex is actually ranking. A lonngread cannot beat a format mismatch.
PAGE_TYPE = {
    "медиа/музыка": r"music\.|zvyki|hitmos|my\.mail\.ru|rutube|youtube|tiktok"
                    r"|zaycev|patefon|muzofond|mp3|audio",
    "видео": r"youtube|rutube|dzen\.ru/video|video",
    "соцсеть/UGC": r"vk\.com|ok\.ru|t\.me|pinterest|dzen\.ru/a/|otvet\.mail",
    "агрегатор Яндекса": r"^yandex\.ru|ya\.ru",
    "магазин": r"ozon|wildberries|avito|alifbooks|shop|market",
    "энциклопедия": r"wikipedia",
}


def kind(domain: str, url: str) -> str:
    hay = f"{domain} {url}".lower()
    for name, pat in PAGE_TYPE.items():
        if re.search(pat, hay):
            return name
    return "контентный сайт"


def main() -> None:
    files = sorted(SRC.glob("*.json"))
    if not files:
        raise SystemExit(f"нет данных в {SRC}")

    per_cluster = defaultdict(list)
    domain_hits = Counter()
    domain_best = {}
    content_wins = Counter()

    print(f"{'запрос':<34}{'тяж':>4}{'формат топ-3':>22}  топ-3 домены")
    print("-" * 104)
    for f in files:
        d = json.loads(f.read_text(encoding="utf-8"))
        rows = d["rows"]
        if not rows:
            print(f"{d['query']:<34}  — пустая выдача")
            continue
        hw = sum(1 for r in rows
                 if any(r["domain"].endswith(h) for h in HEAVYWEIGHTS))
        kinds = [kind(r["domain"], r["url"]) for r in rows]
        top3 = Counter(kinds[:3]).most_common(1)[0][0]
        for r, k in zip(rows, kinds):
            dom = r["domain"].removeprefix("www.")
            domain_hits[dom] += 1
            domain_best[dom] = min(domain_best.get(dom, 99), r["pos"])
            if k == "контентный сайт":
                content_wins[dom] += 1
        per_cluster[d["cluster"]].append((d["query"], hw, top3, kinds))
        ours = next((r["pos"] for r in rows if OURS in r["domain"]), None)
        mark = f"  ← МЫ #{ours}" if ours else ""
        doms = ", ".join(r["domain"].removeprefix("www.")[:22] for r in rows[:3])
        print(f"{d['query']:<34}{hw:>4}{top3:>22}  {doms}{mark}")

    print("\n\nПО КЛАСТЕРАМ — сколько выдач держит наш формат (контентный сайт)")
    print("-" * 72)
    for cl, items in sorted(per_cluster.items()):
        avg_hw = sum(i[1] for i in items) / len(items)
        content_top3 = sum(1 for i in items if i[2] == "контентный сайт")
        verdict = ("заходим" if avg_hw <= 3 and content_top3 >= len(items) * 0.6
                   else "тяжело" if avg_hw >= 5 else "смешанно")
        print(f"  {cl:<14} запросов {len(items):>2}  тяжеловесов в среднем {avg_hw:>4.1f}"
              f"  наш формат в топ-3: {content_top3}/{len(items)}  → {verdict}")

    print("\n\nКОНКУРЕНТЫ — контентные сайты, которые встречаются чаще всего")
    print("-" * 72)
    print(f"  {'домен':<32}{'выдач':>7}{'лучшая поз.':>13}")
    for dom, n in content_wins.most_common(18):
        print(f"  {dom:<32}{n:>7}{domain_best[dom]:>13}")

    print("\n\nВСЕ ДОМЕНЫ ПО ЧАСТОТЕ ПОЯВЛЕНИЯ")
    print("-" * 72)
    for dom, n in domain_hits.most_common(20):
        tag = " (тяжеловес)" if any(dom.endswith(h) for h in HEAVYWEIGHTS) else ""
        print(f"  {dom:<32}{n:>4} из {len(files)}{tag}")


if __name__ == "__main__":
    main()
