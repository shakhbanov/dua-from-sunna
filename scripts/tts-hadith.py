#!/usr/bin/env python3
"""
Voice the Forty Hadith: synthesize a recitation, time it word by word, put it
in S3 and write the timings back into the hadith's source file.

One hadith at a time, end to end:

  1. Synthesize the Arabic with a TTS model. The text read aloud is exactly
     what the word grid renders — the isnad tokens followed by the matn tokens
     — so the recording and the grid cannot drift apart.
  2. Encode to mp3. The masters stay as wav; the site is served the mp3, which
     is some six times smaller over a mobile connection.
  3. Transcribe the mp3 with word-level timestamps, then align that transcript
     onto the canonical tokens. The recogniser hears its own spelling of a word
     and occasionally splits or merges one, so the two sequences are matched
     rather than zipped, and anything unmatched is interpolated across the span
     its neighbours leave open.
  4. Upload, and write `audio` into data/nawawi/source/NN.json — the url, the
     duration and one [start, end] pair per token. The chapter builder turns
     those into `audioUrl` and the per-word `start`/`end` of the sync array.

  python3 scripts/tts-hadith.py 1              # one hadith
  python3 scripts/tts-hadith.py --all          # every hadith that has none yet
  python3 scripts/tts-hadith.py --all --force  # re-record even those that do
  python3 scripts/tts-hadith.py 1 --no-upload  # keep everything local

Credentials come from .env.local (gitignored):
  OPENROUTER_API_KEY, S3_ENDPOINT_URL, S3_BUCKET, S3_REGION,
  S3_ACCESS_KEY, S3_SECRET_KEY, S3_PUBLIC_BASE_URL
"""

import argparse
import base64
import datetime
import hashlib
import hmac
import json
import os
import re
import struct
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "data" / "nawawi" / "source"
OUT_DIR = ROOT / ".tts-out"
S3_PREFIX = "40hadis"

TTS_MODEL = "google/gemini-3.1-flash-tts-preview"
VOICE = "Orus"
STT_MODEL = "openai/whisper-large-v3"
# Gemini synthesises at 24 kHz; `pcm` comes back bare, without a rate to read.
SAMPLE_RATE = 24000
# Below this share of tokens matched outright, the alignment is mostly guessed
# and the recording deserves a listen before it ships.
MIN_MATCH = 0.75

# Gemini's TTS speaks everything after the colon and treats what precedes it as
# direction. The direction asks for a reciter's articulation: every harakah
# pronounced, the throat and emphatic letters given their own makhraj, and the
# tajwid rules of assimilation, nasalisation and prolongation observed — with a
# clean boundary between words so each one can be highlighted on its own.
STYLE = (
    "Recite the following classical Arabic text aloud as a trained Arab reciter "
    "(muqri') would, in a calm, measured, unhurried voice, reading it exactly as "
    "vowelled and adding nothing of your own. Observe the rules of tajwid: give "
    "every letter its proper makhraj — the throat letters (ء ه ع ح غ خ), the "
    "emphatic letters (ص ض ط ظ ق) fully velarised, ث ذ ظ as interdentals, a "
    "clear distinction between س and ص, ت and ط, د and ض, ك and ق; hold the "
    "ghunnah on every nun and mim with shaddah and in idgham, ikhfa' and iqlab; "
    "give the madd letters their full length; pronounce every shaddah doubled; "
    "articulate the qalqalah letters (ق ط ب ج د) when they carry sukun; and "
    "read the name of Allah with tafkhim after fathah and dammah, with tarqiq "
    "after kasrah. Keep an audible boundary between words so each word can be "
    "followed separately, but do not break a word into pieces and do not spell "
    "anything out. Text: "
)

print_lock = threading.Lock()


def say(*parts: object) -> None:
    with print_lock:
        print(*parts, flush=True)


# --- Sources ------------------------------------------------------------


def load_env() -> None:
    env_file = ROOT / ".env.local"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def write_source(path: Path, data: dict) -> None:
    """Save a hadith source, keeping each [start, end] pair on one line.

    json.dumps would spread every pair over five lines, burying the hadith
    under thousands of lines of numbers; the word triples are left expanded,
    the way the sources already read.
    """
    text = json.dumps(data, ensure_ascii=False, indent=2)
    text = re.sub(
        r"\[\s*\n\s*(-?\d+(?:\.\d+)?),\s*\n\s*(-?\d+(?:\.\d+)?)\s*\n\s*\]",
        r"[\1, \2]",
        text,
    )
    path.write_text(text + "\n", encoding="utf-8")


def source_path(number: int) -> Path:
    return SRC_DIR / f"{number:02d}.json"


def hadith_tokens(number: int) -> list[str]:
    """The Arabic tokens of the word grid: the isnad, then the matn."""
    path = source_path(number)
    if not path.exists():
        sys.exit(f"No source for hadith {number}: {path.relative_to(ROOT)}")
    data = json.loads(path.read_text(encoding="utf-8"))
    return [w[0] for w in data["isnadWords"]] + [w[0] for w in data["words"]]


# --- OpenRouter ---------------------------------------------------------


ATTEMPTS = 5


class Refused(RuntimeError):
    """The other end answered, and said no. Carries the status it said it with."""

    def __init__(self, message: str, status: int):
        super().__init__(message)
        self.status = status


def with_retries(what: str, call):
    """Run a request again when the failure is one that may not repeat.

    Long uploads over a slow link drop often enough that a batch of forty would
    otherwise lose a hadith or two to a truncated TLS read, and the TTS
    provider now and then returns 200 with an empty stream, which reaches us as
    a 502. Both are worth another try. A refusal on our side of the line — a
    bad model name, a rejected format, no credit — is not: it would only be
    refused again.
    """
    for attempt in range(1, ATTEMPTS + 1):
        try:
            return call()
        except Refused as err:
            if err.status < 500 and err.status != 429:
                raise
            reason = f"{err.status}"
        except Exception as err:
            reason = type(err).__name__
        if attempt == ATTEMPTS:
            raise RuntimeError(f"{what} failed after {ATTEMPTS} tries ({reason})") from None
        wait = 2 ** attempt
        say(f"  {what}: {reason}, retrying in {wait}s")
        time.sleep(wait)


def openrouter(path: str, payload: dict, api_key: str, timeout: int = 900, check=None):
    """POST to OpenRouter; return (bytes, headers) so callers can read either.

    `check` inspects the answer from inside the retry, so a reply that arrives
    with HTTP 200 but nothing usable in it — which is how an overloaded TTS
    provider fails — is tried again instead of being handed back empty.
    """
    body = json.dumps(payload).encode("utf-8")

    def once():
        request = urllib.request.Request(
            f"https://openrouter.ai/api/v1{path}",
            data=body,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://dua.shakhbanov.org",
                "X-Title": "dua-from-sunna",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                answer = (response.read(), response.headers)
        except urllib.error.HTTPError as err:
            raise Refused(
                f"OpenRouter {path} {err.code}: {err.read().decode('utf-8', 'replace')[:400]}",
                err.code,
            ) from None
        if check:
            check(*answer)
        return answer

    return with_retries(f"OpenRouter {path}", once)


def synthesize(text: str, model: str, voice: str, api_key: str) -> tuple[bytes, int]:
    """Synthesize the text; return raw pcm and the rate it came at.

    TTS models live behind /audio/speech, not chat/completions, which rejects
    them outright. Gemini returns bare 16-bit little-endian pcm and nothing
    else — mp3 is refused — so the rate is read off the content type.
    """
    def not_empty(audio: bytes, _headers) -> None:
        if not audio:
            raise Refused("OpenRouter returned an empty audio stream", 502)

    audio, headers = openrouter(
        "/audio/speech",
        {"model": model, "input": STYLE + text, "voice": voice, "response_format": "pcm"},
        api_key,
        check=not_empty,
    )
    content_type = headers.get("Content-Type") or ""
    rate = re.search(r"rate=(\d+)", content_type)
    return audio, int(rate.group(1)) if rate else SAMPLE_RATE


def transcribe(path: Path, model: str, api_key: str) -> list[dict]:
    """Word-level timestamps for the recording, in the order they were heard."""
    def has_words(body: bytes, _headers) -> None:
        if not (json.loads(body).get("words") or []):
            raise Refused("the recogniser returned no word timestamps", 502)

    body, _ = openrouter(
        "/audio/transcriptions",
        {
            "model": model,
            "input_audio": {
                "data": base64.b64encode(path.read_bytes()).decode("ascii"),
                "format": path.suffix.lstrip("."),
            },
            "language": "ar",
            "response_format": "verbose_json",
            "timestamp_granularities": ["word"],
            "temperature": 0,
        },
        api_key,
        check=has_words,
    )
    return json.loads(body)["words"]


# --- Audio --------------------------------------------------------------


def as_wav(audio: bytes, sample_rate: int = SAMPLE_RATE) -> bytes:
    """Gemini hands back bare 16-bit PCM; give it a header when it lacks one."""
    if audio[:4] == b"RIFF":
        return audio
    header = b"RIFF" + struct.pack("<I", 36 + len(audio)) + b"WAVEfmt "
    header += struct.pack("<IHHIIHH", 16, 1, 1, sample_rate, sample_rate * 2, 2, 16)
    header += b"data" + struct.pack("<I", len(audio))
    return header + audio


def to_mp3(wav: Path, mp3: Path) -> None:
    """Mono 64 kbit/s — speech at 24 kHz, and a sixth of the wav to download."""
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav),
         "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k", str(mp3)],
        check=True,
    )


def duration_of(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        check=True, capture_output=True, text=True,
    )
    return round(float(out.stdout.strip()), 3)


# --- Alignment ----------------------------------------------------------

# Orthography the recogniser is free to differ on: it writes what it hears, so
# hamza seats, ta marbuta and alif maqsura are folded away before matching.
FOLD = str.maketrans({
    "أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا",
    "ى": "ي", "ة": "ه", "ؤ": "و", "ئ": "ي",
})


def fold(word: str) -> str:
    word = re.sub(r"[ً-ْٰـۖ-ۭ]", "", word)
    word = word.translate(FOLD)
    return re.sub(r"[^ء-ي]", "", word)


def align(tokens: list[str], heard: list[dict], duration: float) -> tuple[list[list[float]], float]:
    """Give every canonical token a [start, end], and say how much was matched.

    Where the recogniser's sequence agrees with ours the timings are taken
    straight. Where it does not — a merged word, a different spelling, a word
    it dropped — the tokens in that run share the span their neighbours leave
    open, split in proportion to how long they are to say.
    """
    ours = [fold(t) for t in tokens]
    theirs = [fold(w["word"]) for w in heard]
    spans: list[list[float] | None] = [None] * len(tokens)
    matched = 0

    for tag, i1, i2, j1, j2 in SequenceMatcher(None, ours, theirs, autojunk=False).get_opcodes():
        if tag == "equal":
            for offset in range(i2 - i1):
                word = heard[j1 + offset]
                spans[i1 + offset] = [float(word["start"]), float(word["end"])]
            matched += i2 - i1
            continue
        if i1 == i2:
            continue  # the recogniser heard something we do not render
        # Everything the run is allowed to occupy: from where the previous
        # token ended to where the next one begins.
        start = float(heard[j1 - 1]["end"]) if j1 > 0 else 0.0
        end = float(heard[j2]["start"]) if j2 < len(heard) else duration
        if j1 < j2:
            start = float(heard[j1]["start"])
            end = float(heard[j2 - 1]["end"])
        if end <= start:
            end = start + 0.2 * (i2 - i1)
        weights = [max(len(ours[i]), 1) for i in range(i1, i2)]
        total = sum(weights)
        cursor = start
        for index, weight in zip(range(i1, i2), weights):
            width = (end - start) * weight / total
            spans[index] = [cursor, cursor + width]
            cursor += width

    # Nothing may run backwards, start before zero or end past the recording.
    previous = 0.0
    result: list[list[float]] = []
    for span in spans:
        start, end = span if span else (previous, previous + 0.2)
        start = max(previous, min(start, duration))
        end = max(start + 0.05, min(end, duration))
        result.append([round(start, 3), round(end, 3)])
        previous = start
    return result, matched / len(tokens)


# --- S3 -----------------------------------------------------------------


def upload(path: Path, key: str, content_type: str, cache_control: str) -> str:
    """PUT the file into S3, signed with SigV4 by hand.

    boto3 is not usable here: the Homebrew Python it installs under has a
    broken pyexpat, so any S3 response it tries to parse blows up. A signed PUT
    needs nothing but hashlib and urllib, and works on whichever Python runs it.
    """
    endpoint = os.environ["S3_ENDPOINT_URL"].rstrip("/")
    host = urllib.parse.urlsplit(endpoint).netloc
    region = os.environ.get("S3_REGION", "ru-1")
    access_key = os.environ["S3_ACCESS_KEY"]
    secret_key = os.environ["S3_SECRET_KEY"]
    bucket = os.environ["S3_BUCKET"]

    body = path.read_bytes()
    payload_hash = hashlib.sha256(body).hexdigest()
    canonical_uri = "/" + urllib.parse.quote(f"{bucket}/{key}")

    def once():
        # Signed afresh on every attempt: the signature is stamped with the
        # clock, and one minted before a long backoff would come back skewed.
        now = datetime.datetime.now(datetime.timezone.utc)
        amz_date = now.strftime("%Y%m%dT%H%M%SZ")
        date_stamp = now.strftime("%Y%m%d")

        headers = {
            "cache-control": cache_control,
            "content-type": content_type,
            "host": host,
            "x-amz-acl": "public-read",
            "x-amz-content-sha256": payload_hash,
            "x-amz-date": amz_date,
        }
        signed_headers = ";".join(sorted(headers))
        canonical_headers = "".join(f"{k}:{headers[k]}\n" for k in sorted(headers))
        canonical_request = "\n".join(
            ["PUT", canonical_uri, "", canonical_headers, signed_headers, payload_hash]
        )

        scope = f"{date_stamp}/{region}/s3/aws4_request"
        to_sign = "\n".join(
            [
                "AWS4-HMAC-SHA256",
                amz_date,
                scope,
                hashlib.sha256(canonical_request.encode("utf-8")).hexdigest(),
            ]
        )
        signing_key = f"AWS4{secret_key}".encode("utf-8")
        for part in (date_stamp, region, "s3", "aws4_request"):
            signing_key = hmac.new(signing_key, part.encode("utf-8"), hashlib.sha256).digest()
        signature = hmac.new(signing_key, to_sign.encode("utf-8"), hashlib.sha256).hexdigest()

        headers["Authorization"] = (
            f"AWS4-HMAC-SHA256 Credential={access_key}/{scope}, "
            f"SignedHeaders={signed_headers}, Signature={signature}"
        )
        request = urllib.request.Request(
            f"{endpoint}{canonical_uri}", data=body, headers=headers, method="PUT"
        )
        try:
            with urllib.request.urlopen(request, timeout=600) as response:
                response.read()
        except urllib.error.HTTPError as err:
            raise Refused(
                f"S3 {err.code}: {err.read().decode('utf-8', 'replace')[:400]}", err.code
            ) from None

    with_retries(f"S3 PUT {key}", once)
    return f"{os.environ['S3_PUBLIC_BASE_URL'].rstrip('/')}/{key}"


# --- Pipeline -----------------------------------------------------------


def voice(number: int, args, api_key: str) -> dict:
    """Record, time and publish one hadith. Returns a row for the summary."""
    tokens = hadith_tokens(number)
    wav = OUT_DIR / f"{number:02d}.wav"
    mp3 = OUT_DIR / f"{number:02d}.mp3"

    if not (args.keep_audio and mp3.exists()):
        say(f"[{number:02d}] synthesizing {len(tokens)} tokens with {args.voice}")
        pcm, rate = synthesize(" ".join(tokens), args.model, args.voice, api_key)
        wav.write_bytes(as_wav(pcm, rate))
        to_mp3(wav, mp3)

    seconds = duration_of(mp3)
    say(f"[{number:02d}] {seconds:.1f}s, {mp3.stat().st_size / 1024:.0f} KB mp3 — timing it")

    heard = transcribe(mp3, args.stt_model, api_key)
    timings, share = align(tokens, heard, seconds)

    url = None
    if not args.no_upload:
        url = upload(mp3, f"{S3_PREFIX}/{number:02d}.mp3", "audio/mpeg", args.cache_control)
        upload(wav, f"{S3_PREFIX}/master/{number:02d}.wav", "audio/wav", args.cache_control)

        path = source_path(number)
        data = json.loads(path.read_text(encoding="utf-8"))
        data["audio"] = {
            "url": url,
            "duration": seconds,
            "voice": args.voice,
            "model": args.model,
            "timings": timings,
        }
        write_source(path, data)

    flag = "" if share >= MIN_MATCH else "  <- CHECK BY EAR"
    say(f"[{number:02d}] {len(heard)} heard / {len(tokens)} tokens, {share:.0%} matched{flag}")
    return {"number": number, "seconds": seconds, "matched": share, "url": url}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("number", nargs="?", type=int, help="hadith number")
    parser.add_argument("--all", action="store_true", help="every hadith in the source directory")
    parser.add_argument("--force", action="store_true", help="with --all, redo the ones already voiced")
    parser.add_argument("--model", default=TTS_MODEL)
    parser.add_argument("--stt-model", default=STT_MODEL)
    parser.add_argument("--voice", default=VOICE)
    parser.add_argument("--jobs", type=int, default=3, help="hadiths in flight at once")
    parser.add_argument("--no-upload", action="store_true", help="keep the audio and the timings local")
    parser.add_argument(
        "--keep-audio",
        action="store_true",
        help="reuse the mp3 already in .tts-out instead of synthesizing again",
    )
    parser.add_argument(
        "--cache-control",
        default="public, max-age=86400, stale-while-revalidate=604800",
        help="how long the CDN and the browser may hold a recording",
    )
    args = parser.parse_args()

    load_env()
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
        say("Every hadith is already voiced — pass --force to redo them.")
        return

    OUT_DIR.mkdir(exist_ok=True)
    say(f"Voicing {len(numbers)} hadith(s) with {args.voice}, {args.jobs} at a time\n")

    rows, failures = [], []

    def run(number: int):
        try:
            rows.append(voice(number, args, api_key))
        except Exception as err:  # one bad hadith must not sink the batch
            failures.append((number, str(err)))
            say(f"[{number:02d}] FAILED — {err}")

    with ThreadPoolExecutor(max_workers=max(1, args.jobs)) as pool:
        list(pool.map(run, numbers))

    rows.sort(key=lambda r: r["number"])
    total = sum(r["seconds"] for r in rows)
    say(f"\n{len(rows)} recorded, {total / 60:.1f} minutes in all")
    weak = [r for r in rows if r["matched"] < MIN_MATCH]
    if weak:
        say("Listen to these before shipping — their timings are mostly interpolated:")
        for r in weak:
            say(f"  {r['number']:02d}: {r['matched']:.0%} matched")
    if failures:
        say(f"\n{len(failures)} failed:")
        for number, err in failures:
            say(f"  {number:02d}: {err}")
        sys.exit(1)


if __name__ == "__main__":
    main()
