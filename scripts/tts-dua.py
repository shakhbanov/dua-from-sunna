#!/usr/bin/env python3
"""
Voice the duas that have no recording, and time the words to them.

The duas of the Sunnah live in hand-written chapter files, one TypeScript
object per chapter; the Quranic ones are generated. Both render the same word
grid, and a dua whose `sync` entries all read `start: 0, end: 0` has no
recording behind it — the grid renders, the words never light up.

This finds those duas, recites them, times each word against the recording and
writes both the timings and the new audio url back into the chapter file. Duas
that already carry timings are left exactly as they are.

  python3 scripts/tts-dua.py --list             # what is missing, and where
  python3 scripts/tts-dua.py --all              # record every one of them
  python3 scripts/tts-dua.py --only 27-3,29-1   # record just these
  python3 scripts/tts-dua.py --all --no-upload  # keep the audio local

Credentials come from .env.local, the same ones tts-hadith.py uses.
"""

import argparse
import json
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import tts_engine as tts  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CHAPTER_DIRS = {"sunna": ROOT / "data" / "chapters", "quran": ROOT / "data" / "quran"}
S3_DIRS = {"sunna": "dua-from-sunna", "quran": "dua-from-quran"}
# The Quranic chapters are generated, so their timings cannot live in the .ts
# files — the next build would wipe them. They go in the builder's own source.
QURAN_AUDIO = ROOT / "data" / "quran" / "audio.json"
quran_lock = __import__("threading").Lock()

# One sync cell, exactly as the chapter files write it. The Arabic and the two
# glosses are matched loosely — they may hold anything but a quote — while the
# two numbers are captured so they can be replaced in place.
CELL = re.compile(
    r'\{ text: "(?P<text>(?:[^"\\]|\\.)*)", trans: \{ ru: "(?:[^"\\]|\\.)*", '
    r'en: "(?:[^"\\]|\\.)*" \}, start: (?P<start>[\d.]+), end: (?P<end>[\d.]+)'
    r'(?P<tail>[^}]*)\}'
)
DUA_ID = re.compile(r'^\s*id: "(?P<id>[^"]+)",\s*$', re.M)

# A cell holds a word only if it holds an Arabic letter — the Arabic block, or
# the presentation forms, where the ﷺ that follows the Prophet's name lives as
# a single glyph and is read aloud like any other word. The rest are marks for
# the eye: the verse rosette, the ellipsis standing for text left out, the
# slash between two variants, and the (٣٣) telling the reader how many times to
# repeat what precedes it. Reciting those aloud is how "(٣٢)" ended up being
# read as "thirty-two" in the middle of a dua.
WORD = re.compile(r"[\u0621-\u064A\uFB50-\uFDFF\uFE70-\uFEFF]")


def is_spoken(cell: re.Match) -> bool:
    return "isVerseEnd" not in cell.group("tail") and bool(WORD.search(cell.group("text")))


def spread(cells: list[re.Match], spoken: list[list[float]]) -> list[list[float]]:
    """Give every cell a timing, including the ones that are never said.

    A silent cell takes the timing of the word after it. The grid lights the
    last cell whose start has passed, scanning from the end, so a silent cell
    sharing a start with the word that follows always loses to that word, and
    the highlight steps over it rather than resting on it.
    """
    step = iter(spoken)
    times: list[list[float] | None] = [next(step) if is_spoken(c) else None for c in cells]
    following = None
    for i in range(len(times) - 1, -1, -1):
        if times[i] is None:
            times[i] = list(following) if following else None
        else:
            following = times[i]
    trailing = spoken[-1][1] if spoken else 0.0
    return [t if t else [trailing, trailing] for t in times]


class Dua:
    """One dua inside one chapter file, and where its cells sit in the text."""

    def __init__(self, collection: str, path: Path, dua_id: str, body: str, offset: int):
        self.collection = collection
        self.path = path
        self.id = dua_id
        self.offset = offset
        self.body = body
        self.cells = list(CELL.finditer(body))
        url = re.search(r'audioUrl: "([^"]+)"', body)
        self.audio_url = url.group(1) if url else None
        self.has_audio_line = url is not None

    @property
    def tokens(self) -> list[str]:
        """The words actually said — rosettes and editorial marks are not."""
        return [c.group("text") for c in self.cells if is_spoken(c)]

    @property
    def glossed(self) -> list[re.Match]:
        """The cells the Quran builder counts as words: everything but a rosette."""
        return [c for c in self.cells if "isVerseEnd" not in c.group("tail")]

    @property
    def timed(self) -> bool:
        return any(float(c.group("end")) > 0 for c in self.cells)

    @property
    def number(self) -> str:
        """The dua's own number — what the Quran builder keys its sources by."""
        return self.id.split("-", 1)[1]

    @property
    def stem(self) -> str:
        """The name the recording takes in the bucket.

        An existing url names the file the site already asks for, and that name
        is kept so nothing else has to change; a dua that never had one is
        named after its own id.
        """
        if self.audio_url:
            return self.audio_url.rsplit("/", 1)[-1].rsplit(".", 1)[0]
        return self.number if self.collection == "quran" else self.id


def chapters(collection: str) -> list[Path]:
    directory = CHAPTER_DIRS[collection]
    return sorted(p for p in directory.glob("*.ts") if p.name != "index.ts")


def read_duas(collection: str) -> list[Dua]:
    """Split each chapter file into its duas, keeping their place in the text."""
    found = []
    for path in chapters(collection):
        text = path.read_text(encoding="utf-8")
        marks = list(DUA_ID.finditer(text))
        for i, mark in enumerate(marks):
            end = marks[i + 1].start() if i + 1 < len(marks) else len(text)
            found.append(Dua(collection, path, mark.group("id"), text[mark.start():end], mark.start()))
    return found


def record_quran(dua: Dua, result: dict, url: str | None) -> None:
    """Save a Quranic dua's recording where the chapter builder will find it.

    data/quran/*.ts is generated; writing timings there would last until the
    next build. They belong in data/quran/audio.json, beside the glosses the
    builder already reads. One lock, because several duas finish at once and
    the file is one.
    """
    with quran_lock:
        stored = json.loads(QURAN_AUDIO.read_text(encoding="utf-8")) if QURAN_AUDIO.exists() else {}
        # A re-timing run uploads nothing and passes no url; the one already
        # recorded stays.
        stored[dua.number] = {
            "url": url or stored.get(dua.number, {}).get("url"),
            "duration": result["duration"],
            # One per glossed word, not per spoken one: the builder counts its
            # words the same way and refuses a list of the wrong length.
            "timings": spread(dua.glossed, result["timings"]),
        }
        text = json.dumps(dict(sorted(stored.items(), key=lambda kv: int(kv[0]))), ensure_ascii=False, indent=2)
        text = re.sub(r"\[\s*\n\s*(-?\d+(?:\.\d+)?),\s*\n\s*(-?\d+(?:\.\d+)?)\s*\n\s*\]", r"[\1, \2]", text)
        QURAN_AUDIO.write_text(text + "\n", encoding="utf-8")


def rewrite(dua: Dua, timings: list[list[float]], url: str | None) -> None:
    """Put the timings, and any new url, into the chapter file.

    The file is re-read and the dua located again by id, so two duas finishing
    at once in different threads cannot overwrite each other's edits.
    """
    text = dua.path.read_text(encoding="utf-8")
    marks = list(DUA_ID.finditer(text))
    here = next((m for m in marks if m.group("id") == dua.id), None)
    if here is None:
        raise RuntimeError(f"{dua.path.name}: dua {dua.id} vanished from the file")
    start = here.start()
    following = [m for m in marks if m.start() > start]
    end = following[0].start() if following else len(text)
    body = text[start:end]

    cells = list(CELL.finditer(body))
    step = iter(spread(cells, timings))

    def replace(match: re.Match) -> str:
        start, end = next(step)
        head = match.group(0)[: match.start("start") - match.start(0)]
        return f"{head}{start}, end: {end}{match.group('tail')}}}"

    body = CELL.sub(replace, body)
    if url and dua.has_audio_line:
        body = re.sub(r'audioUrl: "[^"]+"', f'audioUrl: "{url}"', body, count=1)
    elif url:
        body = re.sub(r'(id: "[^"]+",\n)', rf'\1        audioUrl: "{url}",\n', body, count=1)
    dua.path.write_text(text[:start] + body + text[end:], encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--collection", choices=["sunna", "quran"], default="sunna")
    parser.add_argument("--all", action="store_true", help="every untimed dua of the collection")
    parser.add_argument("--only", help="comma-separated dua ids")
    parser.add_argument("--list", action="store_true", help="show what is missing and stop")
    parser.add_argument("--model", default=tts.TTS_MODEL)
    parser.add_argument("--stt-model", default=tts.STT_MODEL)
    parser.add_argument("--voice", default=tts.VOICE)
    parser.add_argument("--jobs", type=int, default=3)
    parser.add_argument("--no-upload", action="store_true")
    parser.add_argument("--keep-audio", action="store_true", help="reuse the mp3 in .tts-out")
    parser.add_argument(
        "--realign",
        action="store_true",
        help="re-time every dua already recorded, from the mp3 in .tts-out, without synthesizing or uploading again",
    )
    args = parser.parse_args()

    tts.load_env()
    duas = read_duas(args.collection)
    untimed = [d for d in duas if not d.timed]

    if args.list:
        print(f"{args.collection}: {len(duas)} duas, {len(untimed)} without timings")
        for d in untimed:
            print(f"  {d.id:>8}  {len(d.tokens):>3} words  {d.path.name}")
        return

    if args.realign:
        args.keep_audio = True
        args.no_upload = True
        duas = [d for d in duas if (tts.OUT_DIR / f"{S3_DIRS[args.collection]}-{d.stem}.mp3").exists()]
        untimed = duas
    if args.only:
        wanted = {s.strip() for s in args.only.split(",")}
        targets = [d for d in duas if d.id in wanted]
        missing = wanted - {d.id for d in targets}
        if missing:
            sys.exit(f"No such dua: {', '.join(sorted(missing))}")
    elif args.all or args.realign:
        targets = untimed
    else:
        parser.error("give --all, --only, --realign, or --list")

    if not targets:
        print("Every dua already has its timings.")
        return

    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        sys.exit("OPENROUTER_API_KEY is not set (put it in .env.local).")

    tts.OUT_DIR.mkdir(exist_ok=True)
    directory = S3_DIRS[args.collection]
    tts.say(f"Voicing {len(targets)} dua(s) of the {args.collection} with {args.voice}, {args.jobs} at a time\n")

    rows, failures = [], []

    def run(dua: Dua):
        try:
            result = tts.record(
                f"{directory}-{dua.stem}", dua.tokens, args, api_key, label=dua.id
            )
            url = None
            if not args.no_upload:
                url = tts.publish(result, directory, dua.stem)
            if dua.collection == "quran":
                record_quran(dua, result, url)
            else:
                rewrite(dua, result["timings"], url)
            rows.append({"id": dua.id, "matched": result["matched"], "seconds": result["duration"]})
        except Exception as err:
            failures.append((dua.id, str(err)))
            tts.say(f"[{dua.id}] FAILED — {err}")

    with ThreadPoolExecutor(max_workers=max(1, args.jobs)) as pool:
        list(pool.map(run, targets))

    total = sum(r["seconds"] for r in rows)
    tts.say(f"\n{len(rows)} recorded, {total / 60:.1f} minutes in all")
    weak = [r for r in rows if r["matched"] < tts.MIN_MATCH]
    if weak:
        tts.say("Listen to these — their timings are mostly interpolated:")
        for r in sorted(weak, key=lambda r: r["matched"]):
            tts.say(f"  {r['id']}: {r['matched']:.0%} matched")
    if failures:
        tts.say(f"\n{len(failures)} failed:")
        for dua_id, err in failures:
            tts.say(f"  {dua_id}: {err}")
        sys.exit(1)


if __name__ == "__main__":
    main()
