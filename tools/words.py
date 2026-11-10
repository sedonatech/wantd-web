#!/usr/bin/env python3
"""The web's words in every language of the app (SED-963).

    python3 tools/words.py            # writes feed/words/<code>.js for the 34 languages

English is the source and lives in the page itself (the `T`, `W` and `F`
dictionaries of feed/index.html, wishes.js and friends.js); this script
writes, for each other language, the same keys translated:

- from the app's own catalog (WANTD/Localizable.xcstrings, 35 languages,
  French read line by line by Agathe), whenever the web's English text is a
  text of the app (MAP below, or the English text itself as the key);
- from i18n/web.json for the few words the web alone says (the doors, the
  email and the code), translated with the app's glossary.

Counted sentences come out as a table of plural forms; placeholders become
{0}, {1} (in the order of the English) and {n} for the count. The page picks
the forms with Intl.PluralRules (feed/index.html, `words`).
"""
import json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent.parent
CATALOG = pathlib.Path.home() / "Desktop/WANTD/WANTD/Localizable.xcstrings"
EXTRA = HERE / "i18n/web.json"
OUT = HERE / "feed/words"
LANGS = "ar ca cs da de el es es-419 fi fr he hi hr hu id it ja ko ms nb nl pl pt-BR pt-PT ro ru sk sv th tr uk vi zh-Hans zh-Hant".split()

# Web key -> catalog key, where the English text is not the key itself
# (a function in the page, or a word the catalog spells otherwise).
# "pair": two catalog keys, with and without a name (sendText).
MAP = {
    "T": {
        "open": "Open %@", "from": "From %@", "community": "%lld wants from the community",
        "perL": "%@ / 1 l", "perKg": "%@ / 1 kg",
    },
    "W": {
        "wantsN": "%lld wants", "followersN": "%lld followers",
        "shareAsk": "%@ wants to share the %@ list with you.",
        "heardFriend": "A friend told me", "heardStore": "The App Store", "heardElse": "Somewhere else",
        "deleteListAsk": "Delete %@?",
    },
    "F": {
        "friendsN": "%lld friends", "share": "Share @%@", "wantsN": "%lld wants", "followersN": "%lld followers",
        "bdIn": "birthday in %lld days", "bdOn": "birthday on %@", "from": "From %@",
        "nameAmount": "Name an amount. %@ picks the piece it becomes, and you shop it yourself.",
        "promiseWith": "Your promise is with %@.",
        "sendText": ("pair", "Look what %@ wants: %@. Open it in Wantd to add your share. %@", "Look what someone wants: %@. Open it in Wantd to add your share. %@"),
    },
}


def placeholders(s):
    """%1$@ -> {0}, %2$@ -> {1}; bare %@ in order; %lld / %1$lld -> {n}."""
    out, i = [], 0
    pos = [0]
    def sub(m):
        kind = m.group(2)
        if kind in ("lld", "d", "ld"):
            return "{n}"
        if m.group(1):
            return "{%d}" % (int(m.group(1)) - 1)
        pos[0] += 1
        return "{%d}" % (pos[0] - 1)
    return re.sub(r"%(?:(\d+)\$)?(@|lld|ld|d)", sub, s)


def read_english_keys():
    """The keys of the three dictionaries, from the page's own English."""
    import subprocess
    script = r'''
const fs = require("fs");
function enBlock(src, name) {
  const start = src.indexOf(`const ${name} = words("${name}", {`);
  const end = src.indexOf("\n});", start);
  return src.slice(start + `const ${name} = words("${name}", `.length, end + 2);
}
const LOCALE = "en", LANG = "en";
const srcs = { T: fs.readFileSync("feed/index.html", "utf8"), W: fs.readFileSync("feed/wishes.js", "utf8"), F: fs.readFileSync("feed/friends.js", "utf8") };
const out = {};
for (const [name, src] of Object.entries(srcs)) {
  const obj = eval("(" + enBlock(src, name) + ")");
  out[name] = {};
  for (const [k, v] of Object.entries(obj)) out[name][k] = typeof v === "function" ? null : v;
}
process.stdout.write(JSON.stringify(out));
'''
    r = subprocess.run(["node", "-e", script], cwd=HERE, capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def main():
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))["strings"]
    extra = json.loads(EXTRA.read_text(encoding="utf-8"))
    english = read_english_keys()
    OUT.mkdir(parents=True, exist_ok=True)
    missing = []

    def translate(key, lang):
        e = catalog.get(key)
        if e is None:
            return None
        loc = e.get("localizations", {}).get(lang)
        if not loc:
            # A text the app keeps in English everywhere (brand names).
            return placeholders(key) if e.get("shouldTranslate") is False or not e.get("localizations") else None
        if "variations" in loc:
            forms = loc["variations"].get("plural", {})
            return {cat: placeholders(f["stringUnit"]["value"]) for cat, f in forms.items()}
        return placeholders(loc["stringUnit"]["value"])

    for lang in LANGS:
        words = {}
        for dict_name, keys in english.items():
            table = {}
            for key, en in keys.items():
                spec = MAP.get(dict_name, {}).get(key)
                if isinstance(spec, tuple) and spec[0] == "pair":
                    a, b = translate(spec[1], lang), translate(spec[2], lang)
                    if a is None or b is None:
                        missing.append((lang, dict_name, key)); continue
                    table[key] = {"a": a, "b": b}
                    continue
                if spec is None and key in extra:
                    v = extra[key].get(lang)
                    if v is None:
                        missing.append((lang, dict_name, key)); continue
                    table[key] = v
                    continue
                cat_key = spec or en
                if cat_key is None:
                    missing.append((lang, dict_name, key)); continue
                v = translate(cat_key, lang)
                if v is None:
                    missing.append((lang, dict_name, key)); continue
                if isinstance(v, str) and en is not None and v == en and lang != "en":
                    pass   # the same word in that language (Feed, TikTok): kept
                table[key] = v
            words[dict_name] = table
        js = "window.WANTD_WORDS = " + json.dumps(words, ensure_ascii=False, separators=(",", ":")) + ";\n"
        (OUT / f"{lang}.js").write_text(js, encoding="utf-8")
    if missing:
        for m in missing:
            print("MISSING", *m)
        sys.exit(1)
    print(f"{len(LANGS)} languages written to {OUT.relative_to(HERE)}")


if __name__ == "__main__":
    main()
