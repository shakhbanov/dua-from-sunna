#!/usr/bin/env python3
"""
The engine behind the recordings: synthesize, encode, time, align, upload.

Nothing here knows what a hadith or a dua is. The front-ends — tts-hadith.py
for the Forty Hadith, tts-dua.py for the duas of the Sunnah and the Quran —
each know how to find their own Arabic tokens and where to write the timings
back; both hand the tokens to this module and get [start, end] pairs returned.

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
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / ".tts-out"
# Everything the site plays lives under one prefix in the bucket, one
# directory per collection.
S3_ROOT = "dua.shakhbanov.org"

TTS_MODEL = "google/gemini-3.1-flash-tts-preview"
VOICE = "Orus"
STT_MODEL = "openai/whisper-large-v3"
# Whisper sometimes swallows a run of words in the middle of a recording and
# reports the rest with a straight face, which would cram the missing words
# into the gap it left. When the alignment comes out poor, these are asked the
# same question; whichever hears the text best wins.
FALLBACK_STT = ["mistralai/voxtral-mini-transcribe", "openai/whisper-1"]
# Gemini synthesises at 24 kHz; `pcm` comes back bare, without a rate to read.
SAMPLE_RATE = 24000
# Below this share of tokens matched outright, the alignment is mostly guessed
# and the recording deserves a listen before it ships.
MIN_MATCH = 0.75
# Above this, the first recogniser is trusted and the others are not asked.
GOOD_ENOUGH = 0.95

# Gemini's TTS speaks everything after the colon and treats what precedes it as
# direction. The direction asks for a reciter's articulation: every harakah
# pronounced, the throat and emphatic letters given their own makhraj, and the
# tajwid rules of assimilation, nasalisation and prolongation observed — with a
# clean boundary between words so each one can be highlighted on its own.
# Gemini's TTS speaks everything after the colon and treats what precedes it
# as direction. Kept short on purpose: a long block of phonetic instruction,
# with Arabic words and IPA inside it, made the delivery worse rather than
# better — the model reads the manner from a few words and cannot be taught
# phonemes it does not have.
STYLE = (
    "Recite this classical Arabic aloud as a reciter of the Arabian peninsula "
    "would: pure fusha with full tajwid, every harakah sounded, an even "
    "unhurried pace of about a second a word, nothing held longer than tajwid "
    "asks. Every fatha is a pure open [a] — no imala. Read exactly as vowelled "
    "and add nothing of your own. Text: "
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
    # Rounded to the hundredth: ten milliseconds sits far inside the shortest
    # word, and the data carries sixteen thousand of these numbers.
    previous = 0.0
    result: list[list[float]] = []
    for span in spans:
        start, end = span if span else (previous, previous + 0.2)
        start = max(previous, min(start, duration))
        end = max(start + 0.05, min(end, duration))
        result.append([round(start, 2), round(end, 2)])
        previous = start
    return result, matched / len(tokens)



def silences(path: Path, noise: str = "-35dB", gap: float = 0.08) -> list[tuple[float, float]]:
    """Where the recording falls quiet, as (start, end) pairs.

    The reciter is asked to leave a boundary between words, so these gaps are
    where the word boundaries truly are — far more exactly than a recogniser's
    attention weights can place them.
    """
    out = subprocess.run(
        ["ffmpeg", "-i", str(path), "-af", f"silencedetect=noise={noise}:d={gap}", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", out)]
    ends = [float(x) for x in re.findall(r"silence_end: (-?[\d.]+)", out)]
    return [(a, b) for a, b in zip(starts, ends) if b > a]


def speech_runs(path: Path, duration: float, gap: float = 0.10) -> list[tuple[float, float]]:
    """The stretches where the reciter is actually sounding, pause to pause."""
    runs, cursor = [], 0.0
    for a, b in silences(path, gap=gap):
        if a > cursor + 0.01:
            runs.append((cursor, a))
        cursor = b
    if duration > cursor + 0.01:
        runs.append((cursor, duration))
    return runs


# How long a word takes to say, near enough to share out a stretch of speech
# between the words in it. Letters carry the length; the long vowels ا و ي and
# a doubled consonant carry more.
LONG = set("اوي")
# No word is said in less time than this, however the arithmetic falls out.
MIN_WORD = 0.12


def weight(token: str) -> float:
    letters = [c for c in token if "\u0621" <= c <= "\u064A"]
    if not letters:
        return 1.0
    return len(letters) + sum(1 for c in letters if c in LONG) + 2 * token.count("\u0651")


def lay_out(tokens: list[str], anchors: list[list[float]], path: Path, duration: float) -> list[list[float]]:
    """Place the words on the recording by where the sound actually is.

    The recogniser is asked only which stretch of speech a word falls in — a
    coarse judgement it makes reliably — and the words within one stretch then
    share it out in proportion to how long each takes to say. Its own word
    boundaries are not used: they jitter by a couple of hundred milliseconds,
    which was crushing short words like إلى into eight-hundredths of a second
    and making the highlight flick past them.
    """
    runs = speech_runs(path, duration)
    if len(runs) < 2:
        return anchors

    # Each word goes to the stretch its middle lands in, and never to an
    # earlier stretch than the word before it.
    def nearest(middle: float) -> int:
        return min(
            range(len(runs)),
            key=lambda i: 0.0 if runs[i][0] <= middle <= runs[i][1]
            else min(abs(middle - runs[i][0]), abs(middle - runs[i][1])),
        )

    placed, previous = [], 0
    for start, end in anchors:
        here = max(nearest((start + end) / 2), previous)
        placed.append(here)
        previous = here

    out: list[list[float]] = [None] * len(tokens)  # type: ignore[list-item]
    for index in sorted(set(placed)):
        mine = [i for i, r in enumerate(placed) if r == index]
        begin, finish = runs[index]
        # A stretch too short for the words in it means the pause after it was
        # really part of the last word — a held ending that fell below the
        # silence threshold. Let the stretch borrow from that pause rather than
        # crushing every word in it to nothing.
        needed = MIN_WORD * len(mine)
        if finish - begin < needed:
            ceiling = runs[index + 1][0] if index + 1 < len(runs) else duration
            finish = min(begin + needed, ceiling)
        weights = [weight(tokens[i]) for i in mine]
        total = sum(weights) or 1.0
        cursor = begin
        for i, w in zip(mine, weights):
            width = (finish - begin) * w / total
            out[i] = [round(cursor, 2), round(min(cursor + width, finish), 2)]
            cursor += width

    # Nothing may run backwards or vanish.
    previous_start = -1.0
    for i, span in enumerate(out):
        start, end = span if span else anchors[i]
        start = max(start, previous_start + 0.01)
        end = max(end, start + MIN_WORD)
        out[i] = [round(start, 2), round(end, 2)]
        previous_start = start
    return out


def health(timings: list[list[float]]) -> float:
    """How much of a timing list is usable at all.

    A recogniser can report the words perfectly and still collapse the last
    five of them onto one instant — the text matches, the highlight freezes.
    This counts the words that last long enough to see and begin after the one
    before them.
    """
    if not timings:
        return 0.0
    good, previous = 0, -1.0
    for start, end in timings:
        if end - start >= 0.06 and start > previous:
            good += 1
        previous = start
    return good / len(timings)


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




# --- The whole of it ----------------------------------------------------

CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800"


def record(name: str, tokens: list[str], args, api_key: str, label: str = "") -> dict:
    """Recite `tokens`, time them, and hand back everything worth keeping.

    The mp3 is left in .tts-out under `name` so a failed upload, or a second
    thought about the timings, costs nothing to redo. Uploading and writing the
    result back where it belongs is the caller's business.
    """
    wav = OUT_DIR / f"{name}.wav"
    mp3 = OUT_DIR / f"{name}.mp3"
    tag = label or name

    if not (getattr(args, "keep_audio", False) and mp3.exists()):
        say(f"[{tag}] synthesizing {len(tokens)} tokens with {args.voice}")
        pcm, rate = synthesize(" ".join(tokens), args.model, args.voice, api_key)
        wav.parent.mkdir(parents=True, exist_ok=True)
        wav.write_bytes(as_wav(pcm, rate))
        to_mp3(wav, mp3)

    seconds = duration_of(mp3)
    best = None
    for model in [args.stt_model, *FALLBACK_STT]:
        try:
            heard = transcribe(mp3, model, api_key)
        except Exception as err:
            say(f"[{tag}] {model} could not time it: {err}")
            continue
        timings, share = align(tokens, heard, seconds)
        # Both halves matter, and neither implies the other: the words can be
        # heard perfectly and still be stamped onto one instant.
        sound = health(timings)
        score = share * sound
        if best is None or score > best["score"]:
            best = {
                "heard": len(heard), "timings": timings, "matched": share,
                "health": sound, "score": score, "model": model,
            }
        if score >= GOOD_ENOUGH:
            break
        say(f"[{tag}] {model}: {share:.0%} heard, {sound:.0%} of timings usable — asking another")

    if best is None:
        raise RuntimeError("no recogniser could time the recording")

    best["timings"] = lay_out(tokens, best["timings"], mp3, seconds)
    flag = "" if best["score"] >= MIN_MATCH else "  <- CHECK BY EAR"
    heard_by = "" if best["model"] == args.stt_model else f", timed by {best['model'].split('/')[-1]}"
    say(
        f"[{tag}] {seconds:.1f}s, {mp3.stat().st_size / 1024:.0f} KB — "
        f"{best['heard']} heard / {len(tokens)} tokens, {best['matched']:.0%} matched{heard_by}{flag}"
    )
    return {
        "mp3": mp3, "wav": wav, "duration": seconds,
        "timings": best["timings"], "matched": best["score"],
    }


def stamp(mp3: Path) -> str:
    """A short fingerprint of the recording, to hang off its url.

    A recording that is made again keeps its name in the bucket, so without
    this the listener would go on hearing the old one: the service worker holds
    audio for thirty days and answers from its cache before asking. S3 ignores
    the query, the cache does not, and a recording that has not changed keeps
    the url it had.
    """
    return hashlib.sha256(mp3.read_bytes()).hexdigest()[:8]


def publish(result: dict, directory: str, stem: str, cache_control: str = CACHE_CONTROL) -> str:
    """Put the mp3 where the site expects it, the wav master beside it."""
    url = upload(result["mp3"], f"{S3_ROOT}/{directory}/{stem}.mp3", "audio/mpeg", cache_control)
    upload(result["wav"], f"{S3_ROOT}/{directory}/master/{stem}.wav", "audio/wav", cache_control)
    return f"{url}?v={stamp(result['mp3'])}"
