#!/usr/bin/env python3
"""Collect Yandex Wordstat topRequests for the approved semantic cores.

Every call costs 20 RUB regardless of how many phrases come back, so the script
is built around not spending more than was authorised:

  * waves run in order and the script stops between them for confirmation
  * a hard cap (MAX_CALLS) refuses to exceed the approved budget
  * a core whose raw response is already on disk is never re-fetched

Usage:
    python3 scripts/wordstat-collect.py --wave 0            # dry run, shows plan + cost
    python3 scripts/wordstat-collect.py --wave 0 --confirm  # actually spends money

The API key is read from YANDEX_WORDSTAT_API_KEY in the environment or from
.env.local. It is never printed, logged or written to the output files.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ENDPOINT = "https://searchapi.api.cloud.yandex.net/v2/wordstat/topRequests"
COST_PER_CALL = 20  # RUB
MAX_CALLS = 37      # approved 2026-09-08: waves 0+1+2 = 400 RUB, wave 3 raised it to 640 RUB
PAUSE = 7           # seconds between calls; the API rate-limits below ~6s
RETRY_BACKOFF = [30, 90, 240]  # a 403 after a success means rate limit, not "no demand"
NET_RETRIES = 12   # this machine's tunnel drops ~2/3 of TLS handshakes; retries are free

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "seo-audit" / "wordstat"

# Each core is (phrase, why it is worth 20 RUB). Waves match the approved plan.
WAVES = {
    0: [
        ("дуа", "мастер-ядро: вершина спроса + доля омонима «Дуа Липа»"),
        ("дуа +от", "проверка: обрабатывает ли API предлоги — от этого зависят волны 1-2"),
    ],
    1: [
        ("дуа +для", "крупнейшая семья целей: ризк, успокоение, замужество, дети"),
        ("дуа +за", "«за кого»: родители, мама, сын, умершие, муж"),
        ("дуа +перед", "ситуация «до»: сон, еда, намаз, экзамен, дорога"),
        ("дуа +при", "состояние: болезнь, роды, беда, страх"),
        ("дуа +после", "ситуация «после»: намаз, еда, азан, омовение"),
        ("азкар", "второй головной термин; утренние и вечерние азкары"),
        ("аят аль курси", "крупнейшая именованная сущность вне слова «дуа»"),
        ("сура +от сглаза", "тот же спрос словом «сура» + объём эзотерически-смежного кластера"),
        ("мусульманская молитва", "вход аудитории, не знающей слова «дуа»"),
        ("зикр", "тасбих, поминания, счёт — смежный головной термин"),
    ],
    2: [
        ("дуа +на", "«на ночь», «на удачу», «на арабском», «на русском»"),
        ("дуа +в", "«в дорогу», «в рамадан», «в пятницу», «в машине»"),
        ("дуа +чтобы", "самые естественные формулировки — прямая речь пользователя"),
        ("дуа текст", "спрос на форму: текст, арабский, транскрипция"),
        ("дуа слушать", "аудио-спрос — проверяет ценность главного актива сайта"),
        ("салават", "именованная сущность, есть материал (главы 25, 109)"),
        ("астагфируллах", "именованная сущность + «значение», «сколько раз»"),
        ("рукия", "объём спроса на лечение Кораном — ключ к решению по «сглазу»"),
    ],
    3: [
        ("дуа рамадан", "сезонное ядро: амплитуда нужна до контент-календаря"),
        ("дуа истихара", "именованная, высокоинтентная; глава 28 уже есть"),
        ("дуа кунут", "именованная; Wordstat дробит её морфологию на 3 строки"),
        ("сура ясин", "смежный крупнейший кластер чтения Корана — стоит ли выходить за дуа"),
        ("крепость мусульманина", "брендовый запрос книги; сайт — её полная цифровая версия"),
        ("как читать дуа", "информационный слой: правила, время, сколько раз, язык"),
        ("дуа ребенка", "дети, беременность, роды, потомство"),
        ("дуа болезни", "здоровье — крупнейший кластер по числу формулировок"),
        ("дуа замуж", "объём и доля эзотерического намерения до решения о странице"),
        ("намаз дуа", "пересечение с намазом; раздел /namaz/ уже есть"),
        ("дуа +из корана", "есть ли самостоятельный спрос на 109 коранических мольб"),
        ("дуа +на арабском", "форма подачи — прямое попадание в пословную сетку"),
    ],
    # Wave 4 closes the gap the owner pointed out: the site holds three
    # collections, and nothing so far measured demand for the third one.
    4: [
        ("40 хадисов", "коллекция ан-Навави — третий раздел сайта, ни разу не замерен"),
        ("хадис", "широкий головной термин: хадисы Пророка ﷺ, сборники, достоверность"),
        ("сунна", "широкий термин; проверяет, ищут ли «дуа из Сунны» этим словом"),
        ("сура", "36 глав коранических дуа лежат под сурами — есть ли спрос этим словом"),
        ("аят", "аяты как самостоятельный вход; аят аль-Курси уже дал 61 363"),
    ],
}


def load_key() -> str:
    key = os.environ.get("YANDEX_WORDSTAT_API_KEY", "").strip()
    if key:
        return key
    env_file = ROOT / ".env.local"
    if env_file.is_file():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            m = re.match(r"\s*(?:export\s+)?YANDEX_WORDSTAT_API_KEY\s*=\s*(.+)\s*$", line)
            if m:
                return m.group(1).strip().strip("'\"")
    sys.exit(
        "YANDEX_WORDSTAT_API_KEY не найден.\n"
        "Добавьте строку в .env.local (файл уже закрыт .gitignore):\n"
        "  YANDEX_WORDSTAT_API_KEY=<ключ>\n"
    )


def spent_calls() -> int:
    """Calls already paid for, counted from the raw responses on disk."""
    return len(list(OUT.glob("*.json"))) if OUT.is_dir() else 0


def slugify(phrase: str) -> str:
    return re.sub(r"[^a-z0-9а-я]+", "-", phrase.lower()).strip("-")


def fetch(phrase: str, key: str) -> dict:
    body = json.dumps(
        {
            "phrase": phrase,
            "numPhrases": 2000,
            "regions": ["225"],
            "devices": ["DEVICE_ALL"],
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=body,
        headers={
            "Authorization": f"Api-Key {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_with_retry(phrase: str, key: str, had_success: bool,
                     net_tries: list[int] | None = None) -> dict:
    """A 403 after an earlier success is a rate limit — back off, never conclude
    that the topic has no demand."""
    if net_tries is None:
        net_tries = [0]
    for attempt, wait in enumerate([0] + RETRY_BACKOFF):
        if wait:
            print(f"      403 — вероятно rate limit, пауза {wait}s и повтор "
                  f"({attempt}/{len(RETRY_BACKOFF)})")
            time.sleep(wait)
        try:
            return fetch(phrase, key)
        except urllib.error.HTTPError as e:
            if e.code == 403 and had_success and attempt < len(RETRY_BACKOFF):
                continue
            detail = e.read().decode("utf-8", "replace")[:400]
            raise SystemExit(f"HTTP {e.code} на «{phrase}»: {detail}")
        except urllib.error.URLError as e:
            # The tunnel on this machine drops a large share of TLS handshakes
            # (measured 4/12 success to this host, 8/12 to example.com), so a
            # failed handshake says nothing about Yandex. Nothing reached the
            # API, so nothing was charged — retrying is free. Only a completed
            # HTTP response costs money, and that path never lands here.
            net_tries[0] += 1
            if net_tries[0] <= NET_RETRIES:
                print(f"      сеть оборвалась ({e.reason}) — повтор "
                      f"{net_tries[0]}/{NET_RETRIES}, вызов не тарифицирован")
                time.sleep(3)
                return fetch_with_retry(phrase, key, had_success, net_tries)
            raise SystemExit(
                f"Не удалось соединиться с {ENDPOINT.split('/')[2]} за {NET_RETRIES} попыток "
                f"({e.reason}).\nНи один вызов не дошёл до Яндекса — деньги не списаны."
            )
    raise SystemExit(f"«{phrase}»: 403 не ушёл после {len(RETRY_BACKOFF)} повторов.")


def normalise(payload: dict) -> list[dict]:
    """Pull out (phrase, count) with count as an int — the API sends it as a string."""
    # "results" is what this API actually returns; the rest are fallbacks in
    # case the shape differs between endpoints.
    rows = []
    for key in ("results", "topRequests", "requests", "phrases", "items"):
        if isinstance(payload.get(key), list):
            rows = payload[key]
            break
    out = []
    for r in rows:
        if not isinstance(r, dict):
            continue
        text = r.get("phrase") or r.get("text") or r.get("name")
        raw = r.get("count", r.get("number", 0))
        try:
            count = int(str(raw).replace(" ", "").replace(" ", ""))
        except (TypeError, ValueError):
            count = 0
        if text:
            out.append({"phrase": text, "count": count})
    out.sort(key=lambda x: x["count"], reverse=True)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--wave", type=int, required=True, choices=sorted(WAVES))
    ap.add_argument("--confirm", action="store_true",
                    help="без этого флага показывается только план и стоимость")
    args = ap.parse_args()

    cores = WAVES[args.wave]
    OUT.mkdir(parents=True, exist_ok=True)
    todo = [(p, why) for p, why in cores if not (OUT / f"{slugify(p)}.json").exists()]
    done = len(cores) - len(todo)

    print(f"\nВолна {args.wave}: {len(cores)} ядер, уже собрано {done}, к запросу {len(todo)}")
    for phrase, why in todo:
        print(f"  · {phrase:<24} — {why}")
    print(f"\nСтоимость: {len(todo)} × {COST_PER_CALL} ₽ = {len(todo) * COST_PER_CALL} ₽")

    already = spent_calls()
    if already + len(todo) > MAX_CALLS:
        sys.exit(f"\nОтказ: получится {already + len(todo)} вызовов при одобренных "
                 f"{MAX_CALLS}. Поднимите MAX_CALLS осознанно.")
    print(f"Всего по проекту будет {already + len(todo)} / {MAX_CALLS} одобренных вызовов "
          f"({(already + len(todo)) * COST_PER_CALL} ₽ из {MAX_CALLS * COST_PER_CALL} ₽)")

    if not todo:
        print("\nНечего запрашивать — волна уже собрана.")
        return
    if not args.confirm:
        print("\nЭто сухой прогон. Для реального запуска добавьте --confirm")
        return

    key = load_key()
    had_success = False
    for i, (phrase, _why) in enumerate(todo):
        print(f"\n[{i + 1}/{len(todo)}] «{phrase}» …")
        payload = fetch_with_retry(phrase, key, had_success)
        had_success = True
        rows = normalise(payload)
        (OUT / f"{slugify(phrase)}.json").write_text(
            json.dumps({"phrase": phrase, "rows": rows, "raw": payload},
                       ensure_ascii=False, indent=1),
            encoding="utf-8",
        )
        top = ", ".join(f"{r['phrase']} ({r['count']})" for r in rows[:3])
        print(f"      {len(rows)} фраз. Топ: {top or '—'}")
        if i + 1 < len(todo):
            time.sleep(PAUSE)

    print(f"\nГотово. Сырые ответы: {OUT.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
