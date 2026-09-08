#!/usr/bin/env python3
"""Enumerate each competitor's dua pages to read their URL and title templates.

The four strongest competitors block direct crawling, so their structure is
read out of Yandex instead: a `host:` probe returns ten of their own URLs and
titles per query, which is enough to infer how they slug pages, what their
title pattern is, and which themes they have pages for at all.

    python3 scripts/competitors-collect.py            # plan + cost
    python3 scripts/competitors-collect.py --confirm  # ~0.5 RUB per query
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
COST = 0.5
NET_RETRIES = 15
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "seo-audit" / "competitors"

# Ranked by how often they held a top-10 slot across the 30 measured SERPs.
COMPETITORS = [
    ("umma.ru", 22), ("medinaschool.org", 15), ("islam-today.ru", 14),
    ("islam.global", 14), ("islam.ru", 12), ("azan.ru", 12),
]

# Three probes per site: the head term, a situational page, and the form of
# delivery. Together they expose the slug pattern and the title template.
PROBES = ["дуа", "дуа перед сном", "дуа текст перевод транскрипция"]


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
    sys.exit("YANDEX_WORDSTAT_API_KEY не найден")


def fetch(query: str, key: str, tries: int = 0) -> dict:
    body = json.dumps({
        "query": {"searchType": "SEARCH_TYPE_RU", "queryText": query},
        "groupSpec": {"groupsOnPage": "10"},
        "l10n": "LOCALIZATION_RU",
    }).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT, data=body, method="POST",
        headers={"Authorization": f"Api-Key {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        if tries < NET_RETRIES:      # a dropped handshake was never billed
            time.sleep(2)
            return fetch(query, key, tries + 1)
        raise SystemExit(f"«{query}»: сеть не поднялась ({e.reason})")


def parse(payload: dict) -> list[dict]:
    raw = payload.get("rawData")
    if not raw:
        return []
    try:
        root = ET.fromstring(base64.b64decode(raw).decode("utf-8", "replace"))
    except ET.ParseError:
        return []
    out = []
    for doc in root.iter("doc"):
        url = (doc.findtext("url") or "").strip()
        if not url:
            continue
        t = doc.find("title")
        h = doc.find("headline")
        out.append({
            "url": url,
            "title": "".join(t.itertext()).strip() if t is not None else "",
            "headline": "".join(h.itertext()).strip() if h is not None else "",
        })
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--confirm", action="store_true")
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)

    jobs = [(host, p) for host, _ in COMPETITORS for p in PROBES]
    todo = [(h, p) for h, p in jobs
            if not (OUT / f"{h}--{re.sub(r'[^a-zа-я0-9]+', '-', p)}.json").is_file()]
    print(f"Конкурентов: {len(COMPETITORS)}, зондов на каждого: {len(PROBES)}")
    print(f"Запросов: {len(todo)} × {COST} ₽ ≈ {len(todo) * COST:.0f} ₽\n")
    if not a.confirm:
        for h, p in todo:
            print(f"  · host:{h} {p}")
        print("\nЭто план. Для запуска добавьте --confirm")
        return

    key = load_key()
    for i, (host, probe) in enumerate(todo, 1):
        rows = parse(fetch(f"host:{host} {probe}", key))
        fn = OUT / f"{host}--{re.sub(r'[^a-zа-я0-9]+', '-', probe)}.json"
        fn.write_text(json.dumps({"host": host, "probe": probe, "rows": rows},
                                 ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"[{i}/{len(todo)}] host:{host} «{probe}» → {len(rows)} страниц")
        for r in rows[:3]:
            print(f"      {r['url'][:88]}")
        time.sleep(2)
    print(f"\nГотово: {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
