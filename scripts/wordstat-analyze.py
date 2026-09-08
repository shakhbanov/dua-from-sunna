#!/usr/bin/env python3
"""Clean and cluster the Wordstat harvest.

Runs on whatever seo-audit/wordstat/*.json holds — free, repeatable, no API.

Three things it does that a naive pass over the raw numbers gets wrong:

  1. Deduplicates across cores. "дуа от сглаза" comes back under "дуа",
     "дуа +от" and "сура +от сглаза"; counting each core's total would
     triple it.
  2. Strips homonyms. Dua Lipa and Nusa Dua (a Bali resort) together carry
     ~20% of the head core's impressions and none of the intent.
  3. Merges morphological variants. Wordstat splits one demand across
     "дуа кунут" / "дуа куну" / "куни дуа"; left apart, every cluster total
     reads low.
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "seo-audit" / "wordstat"

# A phrase that carries any of these is about the worship, whatever else it
# looks like. Checked BEFORE the homonym filters, because "салават" is both a
# city of 150k people and the blessing upon the Prophet ﷺ, "зикр" is both a
# car-parts brand and the remembrance of Allah, and "рукия" is both an anime
# character and healing by Quran. Filtering the string alone throws the
# worship away with the noise — measured cost of doing that: ~154k impressions.
ISLAMIC_SIGNAL = (
    r"пророк|мухаммад|мухаммед|аллах|коран|сур[аыуеой]\b|аят|намаз|дуа|хадис"
    r"|сунн|шариат|мусульман|ислам|джума|пятниц|таравих|тасбих|субханалл"
    r"|альхамдулилл|ляиляха|астагфир|салляллаху|сглаз|порч|джинн|шайтан"
    r"|колдовств|исцел|лечени|транскрипц|на арабском|благослов|поминани"
    r"|четк|утренн|вечерн|после намаза|перед сном|сколько раз|по сунне"
)

# Heads that mean two things at once. A phrase built on one of these, carrying
# neither an Islamic signal nor a junk marker, cannot be assigned honestly —
# bare "салават" (1.48M) is the city, the hockey club AND the blessing, and
# guessing would flatter the numbers. These are counted separately.
AMBIGUOUS_HEADS = r"\bсалават|\bзикр|\bруки[яейю]|\bрука[яею]"

# Islamic wording, but not what this site does. Dream interpretation rides on
# "по сунне" and "по корану" and would otherwise sit inside the hadith cluster,
# inflating it by 36k and pointing the content plan at the wrong intent.
NON_TARGET = {
    "Сонник и толкование снов": r"сонник|толкован[иья]* сн|\bсн[аеоы]\b|снится"
                               r"|приснил|видеть во сне|\bсон\b|снах",
}

# --- homonyms: same string, different world -------------------------------
HOMONYMS = {
    "Дуа Липа (певица)": r"\bлип[аыуеой]\b|lipa|гудини|houdini|training season"
                         r"|levitating|new rules|physical|тернер|каллум|песн|клип"
                         r"|альбом|концерт|певиц|радио|трек|обложк|дуа ли\b",
    "Нуса-Дуа (Бали)": r"нуса|бали|индонез|отел|курорт|пляж|тур[ыаov]|вилл"
                       r"|бронир|аэропорт",
    "Дуал-/Дуайт/дуэт": r"дуайт|дуал|дуат[лн]|дуада|дуала|дуанг|дуэт|dualsense"
                        r"|дуалсенс|дуалистич",
    "Щербет/напиток «Дуа»": r"щербет|шербет|клюквен|напиток|сироп|вкус",
    "Салават (город/клуб/имя)": r"юлаев|фатхетдин|погод|город|башкорт|хоккей|кхл"
                                r"|квартир|работа в|автобус|расписан|такси|стерлитамак"
                                r"|ишимбай|нефтеоргсинтез|северсталь|матч|新|население"
                                r"|新聞|новости|день салават|салават на дне|индекс|район"
                                r"|аренд|снять|куплю|\bг салават|салават \d{4}|метеор"
                                r"|\bхк\b|трактор|\bлада\b|авангард|ак барс|динамо"
                                r"|спартак|цска|торпедо|сибирь|амур|барыс|сочи|витязь"
                                r"|смотреть|онлайн трансл|счет|табло|турнир|плей.офф"
                                r"|\bуфа\b|\bуф\b|сегодня|завтра|вчера|расписание",
    "Рукия (аниме/имя)": r"кучики|bleach|блич|аниме|хентай|порно|косплей|манга"
                         r"|ичиго|\bруки\b|\bруках\b|\bрукам\b|\bруках\b",
    "ZIKR (автотовары)": r"зикр ?\d|зикрам|зикр машин|купить зикр|зикр цен"
                         r"|зикр автомоб|шина|диск|аккумулятор|запчаст|каталог"
                         r"|интернет.магазин|доставка",
}

# --- clusters: intent, not vocabulary -------------------------------------
CLUSTERS = {
    "Сглаз, порча, колдовство, рукъя": r"сглаз|порч|колдовств|магии|джинн|шайтан"
        r"|завист|рукия|рукъя|негатив|проклят|наговор|приворот",
    "Ризк, деньги, долги, работа": r"ризк|деньг|долг|кредит|богат|барака|работ"
        r"|торговл|бизнес|прибыл|удач|достат|бедност|зарплат|нужд",
    "Здоровье и болезнь": r"болезн|боль\b|больн|здоров|исцел|лечен|зубн|голов"
        r"|живот|температур|операц|давлен|шифа|выздоров|беременност|роды",
    "Семья, родители, дети": r"родител|мам[ыуа]|отц|папа|сын|дочь|дет[еийя]|ребен"
        r"|ребён|брат|сестр|муж[аеу]|жен[аыеу]|семь|внук|племянник",
    "Тревога, душа, сон": r"тревог|страх|паник|депресс|печал|грусть|горе|успокоен"
        r"|нерв|бессонниц|апати|стресс|беспокой|уныни|тоск|перед сном|пробужден",
    "Намаз, омовение, азан": r"намаз|омовен|вуду|азан|ташаххуд|витр|кунут|суджуд"
        r"|руку|таравих|тахаджуд|джума|пятниц|саляват|салават",
    "Прощение, покаяние, грехи": r"прощен|покаян|грех|истигфар|астагфир|тауб",
    "Рукъя — лечение Кораном": r"рукия|рукъя|рукия|рукая|рукие|лечение кораном"
        r"|исцелен кораном|шифа",
    "Салават Пророку ﷺ": r"салават|салляллаху|благословени пророк",
    "Зикр — поминание Аллаха": r"\bзикр|тасбих|субханалл|альхамдулилл|ляиляха"
        r"|поминани аллах|четк",
    "Защита": r"защит|уберечь|охран|прибежищ|от врагов|от зла|от беды|от всего плохого",
    "Учёба, экзамен, знание": r"экзамен|учеб|учёб|знани|память|запомин|егэ|школ"
        r"|студент|разум|сессии",
    "Никах, замужество, любовь": r"замуж|женитьб|никах|брак|любв|любим|свадьб|развод",
    "Путь, дорога, транспорт": r"путешеств|дорог|путь|поездк|самол[её]т|машин|транспорт",
    "Смерть, похороны, умершие": r"умерш|покойн|похорон|могил|джаназ|мертв|кладбищ"
        r"|соболезнован|упоко",
    "Рамадан, пост, праздники": r"рамадан|ураза|курбан|байрам|л[яа]йлят|кадр"
        r"|предопределен|ашура|шаабан|раджаб|сухур|ифтар|разговен|пост[аыу]?\b|арафа",
    "Хадж и умра": r"хадж|умр[аыу]|кааб|мекк|медин|тальби|сафа|марва|паломн",
    "Еда и трапеза": r"ед[ыой]|еде|пищ|трапез|голод|застол",
    "Форма: текст, перевод, арабский": r"текст|перевод|транскрипц|транслитер"
        r"|на русском|на арабском|арабск|кириллиц|русскими букв|написан",
    "Форма: аудио и видео": r"слушать|аудио|скачат|mp3|озвуч|запис|видео|голос",
    "Форма: как, сколько, когда": r"как читать|как правильно|сколько раз|когда читать"
        r"|правила|можно ли|что означа|что такое|значени|смысл|время чтения",
    # Ordered: the first pattern that matches wins, so the narrow, high-intent
    # buckets are listed before the broad Quran/hadith ones they sit inside.
    "Коран: суры и аяты (чтение)": r"\bсур[аыуеой]\b|\bсуры\b|\bаят|\bкоран"
        r"|ясин|фатиха|ихлас|бакара|кяхф|кахф|мульк|рахман|вакиа|мусхаф",
    "Хадисы и Сунна (источник)": r"хадис|\bсунн|достоверн|бухари|муслим|навави"
        r"|тирмизи|абу дауд|ибн маджа|насаи|источник|крепость мусульманина|40 хадис",
}


def fmt(n: int) -> str:
    """Thin-space thousands, without eating commas in surrounding text."""
    return f"{n:,}".replace(",", "\u2009")


def stem(word: str) -> str:
    """Crude Russian stemmer — enough to merge Wordstat's morphological splits."""
    for suf in ("ями", "ами", "ого", "ему", "ыми", "ими", "ая", "ое", "ые", "ый",
                "ой", "ом", "ов", "ах", "ях", "ам", "ям", "ей", "ию", "ии", "ие",
                "ья", "ью", "а", "я", "ы", "и", "у", "ю", "е", "о", "ь"):
        if len(word) > 4 and word.endswith(suf):
            return word[: -len(suf)]
    return word


def canon(phrase: str) -> str:
    """Word-order- and morphology-insensitive key, so three spellings collapse."""
    words = sorted(stem(w) for w in re.findall(r"[а-яёa-z0-9]+", phrase.lower()))
    return " ".join(words)


def main() -> None:
    files = sorted(SRC.glob("*.json"))
    if not files:
        sys.exit(f"нет данных в {SRC}")

    # Dedup across cores, keeping the highest count seen for each canonical form
    # and the shortest surface spelling as the label.
    best: dict[str, dict] = {}
    for f in files:
        for r in json.loads(f.read_text(encoding="utf-8"))["rows"]:
            k = canon(r["phrase"])
            cur = best.get(k)
            if cur is None or r["count"] > cur["count"]:
                best[k] = {"phrase": r["phrase"], "count": r["count"]}
            elif len(r["phrase"]) < len(cur["phrase"]) and r["count"] == cur["count"]:
                cur["phrase"] = r["phrase"]

    rows = sorted(best.values(), key=lambda x: -x["count"])
    total = sum(r["count"] for r in rows)
    print(f"Ядер собрано: {len(files)}   ({len(files) * 20} ₽)")
    print(f"Уникальных фраз после склейки словоформ: {len(rows):,}".replace(",", " "))
    print(f"Суммарная частотность до очистки: {total:,}\n".replace(",", " "))

    # Homonyms
    noise, clean, unclear = defaultdict(list), [], []
    for r in rows:
        for nname, npat in NON_TARGET.items():
            if re.search(npat, r["phrase"]):
                noise[nname].append(r)
                break
        else:
            pass
        if any(re.search(npat, r["phrase"]) for npat in NON_TARGET.values()):
            continue
        if re.search(ISLAMIC_SIGNAL, r["phrase"]):
            clean.append(r)          # worship wins over any homonym pattern
            continue
        for name, pat in HOMONYMS.items():
            if re.search(pat, r["phrase"]):
                noise[name].append(r)
                break
        else:
            # No signal either way on a two-meaning head: do not guess.
            (unclear if re.search(AMBIGUOUS_HEADS, r["phrase"]) else clean).append(r)

    print("ОЧИСТКА ОТ ОМОНИМОВ")
    dirty = 0
    for name, v in sorted(noise.items(), key=lambda x: -sum(r["count"] for r in x[1])):
        s = sum(r["count"] for r in v)
        dirty += s
        print(f"  − {name:<26} {len(v):>4} фраз  {fmt(s):>9} ({s / total * 100:.1f}%)")
    unc = sum(r["count"] for r in unclear)
    print(f"  ? неопределённые{'':<12} {len(unclear):>4} фраз  {fmt(unc):>9} "
          f"({unc / total * 100:.1f}%)  — голова двузначных ядер, не засчитана")
    cl = sum(r["count"] for r in clean)
    print(f"  = чистый спрос{'':<14} {len(clean):>4} фраз  {fmt(cl):>9} ({cl / total * 100:.1f}%)\n")

    # Clusters
    print("КЛАСТЕРЫ ПО НАМЕРЕНИЮ")
    hit, seen = defaultdict(list), set()
    for r in clean:
        for name, pat in CLUSTERS.items():
            if re.search(pat, r["phrase"]):
                hit[name].append(r)
                seen.add(id(r))
    print(f"  {'кластер':<34} {'фраз':>6} {'частотность':>12}")
    print(f"  {'-' * 34} {'-' * 6} {'-' * 12}")
    for name, v in sorted(hit.items(), key=lambda x: -sum(r["count"] for r in x[1])):
        s = sum(r["count"] for r in v)
        print(f"  {name:<34} {len(v):>6} {fmt(s):>12}")
    rest = [r for r in clean if id(r) not in seen]
    print(f"  {'(вне кластеров)':<34} {len(rest):>6} "
          f"{fmt(sum(r['count'] for r in rest)):>12}")

    # Top phrases per cluster, for the report
    out = ROOT / "seo-audit" / "clusters.md"
    with out.open("w", encoding="utf-8") as fh:
        fh.write(f"# Кластеры спроса\n\nЯдер: {len(files)}. "
                 f"Уникальных фраз: {len(rows)}. Чистый спрос: {cl:,}\n"
                 .replace(",", " "))
        for name, v in sorted(hit.items(), key=lambda x: -sum(r["count"] for r in x[1])):
            s = sum(r["count"] for r in v)
            fh.write(f"\n## {name} — {s:,} показов, {len(v)} фраз\n\n".replace(",", " "))
            for r in sorted(v, key=lambda x: -x["count"])[:25]:
                fh.write(f"- {r['count']:,} — {r['phrase']}\n".replace(",", " "))
    print(f"\nПодробно по фразам: {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
