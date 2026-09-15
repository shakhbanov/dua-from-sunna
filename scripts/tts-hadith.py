#!/usr/bin/env python3
"""
Voice the Forty Hadith of Imam an-Nawawi and time the words to the recording.

The text read aloud is exactly what the word grid renders — the isnad tokens
followed by the matn tokens, joined from data/nawawi/source/NN.json — so the
recording and the grid cannot drift apart. The timings are written back into
that same source file, and scripts/build-nawawi-chapters.mjs turns them into
the `audioUrl` and the per-word `start`/`end` of the chapter.

  python3 scripts/tts-hadith.py 1              # one hadith
  python3 scripts/tts-hadith.py --all          # every hadith not yet recorded
  python3 scripts/tts-hadith.py --all --force  # re-record even those that are
  python3 scripts/tts-hadith.py 1 --no-upload  # keep everything local

The engine — synthesis, encoding, recognition, alignment, upload — lives in
tts_engine.py, which scripts/tts-dua.py shares.

Credentials come from .env.local (gitignored):
  OPENROUTER_API_KEY, S3_ENDPOINT_URL, S3_BUCKET, S3_REGION,
  S3_ACCESS_KEY, S3_SECRET_KEY, S3_PUBLIC_BASE_URL
"""

import argparse
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import tts_engine as tts  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "data" / "nawawi" / "source"
S3_DIR = "40hadis"


def source_path(number: int) -> Path:
    return SRC_DIR / f"{number:02d}.json"


def hadith_tokens(number: int) -> list[str]:
    """The Arabic tokens of the word grid: the isnad, then the matn."""
    path = source_path(number)
    if not path.exists():
        sys.exit(f"No source for hadith {number}: {path.relative_to(ROOT)}")
    data = json.loads(path.read_text(encoding="utf-8"))
    return [w[0] for w in data["isnadWords"]] + [w[0] for w in data["words"]]


def voice(number: int, args, api_key: str) -> dict:
    """Record, time and publish one hadith. Returns a row for the summary."""
    tokens = hadith_tokens(number)
    result = tts.record(f"{number:02d}", tokens, args, api_key, label=f"{number:02d}")

    if not args.no_upload:
        url = tts.publish(result, S3_DIR, f"{number:02d}", args.cache_control)
        path = source_path(number)
        data = json.loads(path.read_text(encoding="utf-8"))
        data["audio"] = {
            "url": url,
            "duration": result["duration"],
            "voice": args.voice,
            "model": args.model,
            "timings": result["timings"],
        }
        tts.write_source(path, data)

    return {"number": number, "seconds": result["duration"], "matched": result["matched"]}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("number", nargs="?", type=int, help="hadith number")
    parser.add_argument("--all", action="store_true", help="every hadith in the source directory")
    parser.add_argument("--force", action="store_true", help="with --all, redo the ones already voiced")
    parser.add_argument("--model", default=tts.TTS_MODEL)
    parser.add_argument("--stt-model", default=tts.STT_MODEL)
    parser.add_argument("--voice", default=tts.VOICE)
    parser.add_argument("--jobs", type=int, default=3, help="hadiths in flight at once")
    parser.add_argument("--no-upload", action="store_true", help="keep the audio and the timings local")
    parser.add_argument("--keep-audio", action="store_true", help="reuse the mp3 already in .tts-out")
    parser.add_argument("--cache-control", default=tts.CACHE_CONTROL)
    args = parser.parse_args()

    tts.load_env()
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        sys.exit("OPENROUTER_API_KEY is not set (put it in .env.local).")

    if args.all:
        numbers = sorted(int(p.stem) for p in SRC_DIR.glob("*.json"))
        if not args.force:
            numbers = [
                n for n in numbers
                if "audio" not in json.loads(source_path(n).read_text(encoding="utf-8"))
            ]
    elif args.number:
        numbers = [args.number]
    else:
        parser.error("give a hadith number, or --all")

    if not numbers:
        tts.say("Every hadith is already voiced — pass --force to redo them.")
        return

    tts.OUT_DIR.mkdir(exist_ok=True)
    tts.say(f"Voicing {len(numbers)} hadith(s) with {args.voice}, {args.jobs} at a time\n")

    rows, failures = [], []

    def run(number: int):
        try:
            rows.append(voice(number, args, api_key))
        except Exception as err:  # one bad hadith must not sink the batch
            failures.append((number, str(err)))
            tts.say(f"[{number:02d}] FAILED — {err}")

    with ThreadPoolExecutor(max_workers=max(1, args.jobs)) as pool:
        list(pool.map(run, numbers))

    rows.sort(key=lambda r: r["number"])
    total = sum(r["seconds"] for r in rows)
    tts.say(f"\n{len(rows)} recorded, {total / 60:.1f} minutes in all")
    weak = [r for r in rows if r["matched"] < tts.MIN_MATCH]
    if weak:
        tts.say("Listen to these before shipping — their timings are mostly interpolated:")
        for r in weak:
            tts.say(f"  {r['number']:02d}: {r['matched']:.0%} matched")
    if failures:
        tts.say(f"\n{len(failures)} failed:")
        for number, err in failures:
            tts.say(f"  {number:02d}: {err}")
        sys.exit(1)


if __name__ == "__main__":
    main()
