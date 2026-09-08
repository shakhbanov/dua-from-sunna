#!/usr/bin/env python3
"""Collect Yandex top-10 for the queries that decide the content plan.

~0.5 RUB per query — three orders cheaper than Wordstat, but the same rules
apply: cache every answer to disk so a rerun costs nothing, and never let a
dropped TLS handshake look like an empty SERP.

    python3 scripts/serp-collect.py            # plan + cost, spends nothing
    python3 scripts/serp-collect.py --confirm  # actually queries
"""

import argparse
import base64
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ENDPOINT = "https://searchapi.api.cloud.yandex.net/v2/web/search"
COST_PER_QUERY = 0.5  # RUB, approximate
PAUSE = 2
NET_RETRIES = 15  # the tunnel here drops ~2/3 of handshakes; retries are free

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "seo-audit" / "serp"
OURS = "dua.shakhbanov.org"

# Queries chosen to answer specific questions, not to sample the whole niche.
# Grouped by the decision each one settles.
QUERIES = [
    # Is the 6.3M Quran cluster winnable, and by what page type?
    ("аят аль курси", "Коран"),
    ("сура ясин слушать", "Коран"),
    ("сура от сглаза", "Коран"),
    ("дуа из корана", "Коран"),
    # Audio is our only unique asset — who holds these SERPs today?
    ("слушать дуа", "Аудио"),
    ("мусульманские молитвы слушать", "Аудио"),
    ("дуа слушать онлайн", "Аудио"),
    # 551K cluster: is the SERP Islamic or esoteric?
    ("дуа от сглаза", "Сглаз"),
    ("дуа от порчи", "Сглаз"),
    ("рукия от сглаза", "Сглаз"),
    # The situational core the site is actually built on
    ("дуа перед сном", "Ситуация"),
    ("дуа после намаза", "Ситуация"),
    ("дуа перед едой", "Ситуация"),
    ("дуа за родителей", "Ситуация"),
    ("дуа в дорогу", "Ситуация"),
    ("дуа для успокоения души", "Ситуация"),
    ("дуа при болезни", "Ситуация"),
    ("дуа от тревоги и страха", "Ситуация"),
    # Goal-shaped demand
    ("дуа на богатство и достаток", "Цель"),
    ("дуа чтобы выйти замуж", "Цель"),
    ("дуа для детей", "Цель"),
    # Named entities — pages the site already has or could have
    ("дуа истихара", "Именованная"),
    ("дуа кунут", "Именованная"),
    ("астагфируллах значение", "Именованная"),
    # Form of delivery — where our word-grid and transcription could win
    ("дуа текст на русском", "Форма"),
    ("дуа на арабском с транскрипцией", "Форма"),
    ("как правильно читать дуа", "Форма"),
    # Source and authority
    ("крепость мусульманина", "Источник"),
    ("дуа из сунны", "Источник"),
    ("достоверные дуа из хадисов", "Источник"),
]

# Sites big enough that outranking them is a multi-year project, not a page.
HEAVYWEIGHTS = {
    "ru.wikipedia.org", "wikipedia.org", "dzen.ru", "vk.com", "ok.ru",
    "youtube.com", "rutube.ru", "islam.ru", "islam-today.ru", "ria.ru",
    "rbc.ru", "lenta.ru", "kp.ru", "aif.ru", "gazeta.ru", "tass.ru",
    "yandex.ru", "mail.ru", "ozon.ru", "wildberries.ru", "avito.ru",
    "t.me", "rutube.ru", "pinterest.com", "tiktok.com",
}


def load_key() -> str:
    key = os.environ.get("YANDEX_WORDSTAT_API_KEY", "").strip()
    if key:
        return key
    env = ROOT / ".env.local"
    if env.is_file():
        for line in env.read_text(encoding="utf-8").splitlines():
            m = re.match(r"\s*(?:export\s+)?YANDEX_WORDSTAT_API_KEY\s*=\s*(.+)\s*$", line)
            if m:
                return m.group(1).strip().strip("'\"")
    sys.exit("YANDEX_WORDSTAT_API_KEY не найден (.env.local)")


def slug(q: str) -> str:
    return re.sub(r"[^a-z0-9а-я]+", "-", q.lower()).strip("-")


def fetch(query: str, key: str, tries: int = 0) -> dict:
    body = json.dumps({
        "query": {"searchType": "SEARCH_TYPE_RU", "queryText": query},
        "groupSpec": {"groupsOnPage": "10"},
        "l10n": "LOCALIZATION_RU",
    }).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT, data=body, method="POST",
        headers={"Authorization": f"Api-Key {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        # A failed handshake never reached Yandex, so it was not billed.
        if tries < NET_RETRIES:
            time.sleep(2)
            return fetch(query, key, tries + 1)
        raise SystemExit(f"«{query}»: сеть не поднялась за {NET_RETRIES} попыток ({e.reason})")


def parse(payload: dict) -> list[dict]:
    raw = payload.get("rawData")
    if not raw:
        return []
    xml = base64.b64decode(raw).decode("utf-8", "replace")
    try:
        root = ET.fromstring(xml)
    except ET.ParseError:
        return []
    out = []
    for doc in root.iter("doc"):
        url = (doc.findtext("url") or "").strip()
        if not url:
            continue
        dom = (doc.findtext("domain") or "").strip().lower()
        title = "".join(doc.find("title").itertext()).strip() if doc.find("title") is not None else ""
        out.append({"pos": len(out) + 1, "url": url,
                    "domain": dom or re.sub(r"^https?://([^/]+).*", r"\1", url).lower(),
                    "title": title})
        if len(out) >= 10:
            break
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--confirm", action="store_true")
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)

    todo = [(q, c) for q, c in QUERIES if not (OUT / f"{slug(q)}.json").is_file()]
    done = len(QUERIES) - len(todo)
    print(f"Запросов всего: {len(QUERIES)}, уже собрано: {done}, к запросу: {len(todo)}")
    print(f"Стоимость: {len(todo)} × {COST_PER_QUERY} ₽ ≈ {len(todo) * COST_PER_QUERY:.0f} ₽\n")
    if not a.confirm:
        for q, c in todo:
            print(f"  · [{c}] {q}")
        print("\nЭто план. Для запуска добавьте --confirm")
        return
    if not todo:
        print("всё собрано")
        return

    key = load_key()
    for i, (q, cat) in enumerate(todo, 1):
        payload = fetch(q, key)
        rows = parse(payload)
        # Keep the raw XML: if parse() turns out to be wrong, re-reading it is
        # free, whereas re-querying is not.
        (OUT / f"{slug(q)}.json").write_text(
            json.dumps({"query": q, "cluster": cat, "rows": rows,
                        "raw": payload.get("rawData", "")},
                       ensure_ascii=False, indent=1), encoding="utf-8")
        doms = [r["domain"] for r in rows]
        hw = sum(1 for d in doms if any(d.endswith(h) for h in HEAVYWEIGHTS))
        ours = next((r["pos"] for r in rows if OURS in r["domain"]), None)
        mark = f"  МЫ #{ours}" if ours else ""
        print(f"[{i}/{len(todo)}] {q:<34} {len(rows):>2} рез, тяжеловесов {hw}{mark}")
        print(f"      {', '.join(doms[:5])}")
        time.sleep(PAUSE)
    print(f"\nГотово: {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
