#!/usr/bin/env python3
"""Read competitor URL and title patterns out of the collected host: probes.

Answers the three questions the content plan needs: how they slug pages, what
their title template is, and which themes they have a dedicated page for —
because a theme none of them has a page for is where we can win outright.
"""

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "seo-audit" / "competitors"

# Themes taken from the measured clusters, to see who covers what.
THEMES = {
    "перед сном": r"pered-snom|sna\b|son|sleep",
    "после намаза": r"posle-namaza|namaz",
    "еда": r"edy|edoj|eda|pered-edoj|food",
    "родители": r"roditel|mat\b|otc|parents",
    "дорога": r"dorog|puteshestv|travel",
    "болезнь": r"bolezn|zdorov|health|isceleni",
    "сглаз/порча": r"sglaz|porch|ruqya|rukya|kolddovstv|dzhinn",
    "ризк/достаток": r"rizk|blagopoluci|dostatok|dengi|bogatstv",
    "тревога/печаль": r"pechal|grust|trevog|uspokoeni|strah",
    "прощение": r"istigfar|proshcheni|pokayani|tauba",
    "утро/вечер": r"utrenn|vechern|azkar|adhkar",
    "истихара": r"istihara|istikhara",
    "салават": r"salavat|salawat",
    "аят аль-курси": r"kursi|kursij",
    "замужество": r"zamuzh|nikah|brak",
    "дети": r"rebenk|detej|deti|potomstv",
}


def main() -> None:
    files = sorted(SRC.glob("*.json"))
    if not files:
        raise SystemExit(f"нет данных в {SRC}")

    pages: dict[str, dict[str, str]] = defaultdict(dict)   # host -> url -> title
    for f in files:
        d = json.loads(f.read_text(encoding="utf-8"))
        for r in d["rows"]:
            if d["host"] in r["url"]:
                pages[d["host"]][r["url"]] = r["title"]

    print("СТРУКТУРА URL")
    print("-" * 78)
    for host, urls in pages.items():
        paths = [re.sub(r"^https?://[^/]+", "", u).strip("/") for u in urls]
        depth = Counter(p.count("/") + 1 for p in paths if p)
        prefixes = Counter(p.split("/")[0] for p in paths if p)
        print(f"\n  {host}  ({len(urls)} страниц найдено)")
        print(f"    глубина пути: {dict(sorted(depth.items()))}")
        print(f"    разделы: {', '.join(f'/{k}/ ×{v}' for k, v in prefixes.most_common(4))}")
        for u in sorted(urls)[:3]:
            print(f"    {u}")

    print("\n\nШАБЛОН TITLE")
    print("-" * 78)
    for host, urls in pages.items():
        titles = [t for t in urls.values() if t]
        if not titles:
            continue
        avg = sum(len(t) for t in titles) / len(titles)
        brand = Counter()
        for t in titles:
            m = re.search(r"[|—\-]\s*([^|—\-]{3,30})\s*$", t)
            if m:
                brand[m.group(1).strip()] += 1
        num = sum(1 for t in titles if re.match(r"^\d+\s", t))
        print(f"\n  {host}: {len(titles)} заголовков, средняя длина {avg:.0f} симв.")
        if brand:
            b, n = brand.most_common(1)[0]
            print(f"    хвост-бренд: «{b}» в {n}/{len(titles)}")
        if num:
            print(f"    списков с числом в начале: {num}/{len(titles)}")
        for t in titles[:3]:
            print(f"    {t[:88]}")

    print("\n\nПОКРЫТИЕ ТЕМ — у кого есть страница")
    print("-" * 78)
    hosts = list(pages)
    print(f"  {'тема':<18}" + "".join(f"{h.split('.')[0][:9]:>11}" for h in hosts))
    gaps = []
    for theme, pat in THEMES.items():
        row = []
        for h in hosts:
            hit = any(re.search(pat, u, re.I) for u in pages[h])
            row.append("  есть" if hit else "     —")
        print(f"  {theme:<18}" + "".join(f"{c:>11}" for c in row))
        if not any("есть" in c for c in row):
            gaps.append(theme)
    if gaps:
        print(f"\n  НИ У КОГО НЕТ СТРАНИЦЫ: {', '.join(gaps)}")
        print("  (в пределах выборки — по три зонда на сайт, не полный обход)")


if __name__ == "__main__":
    main()
