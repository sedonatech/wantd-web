#!/usr/bin/env python3
"""The feed shown on /brands/: Agathe's own public pieces (24 November 2026).

    python3 tools/brands_feed.py            # writes brands/feed.json and brands/feed/*.webp

/brands/ shows Wantd itself in a window (/feed/?showcase); in that mode the
app reads its river from brands/feed.json instead of the worker, so the
window shows only her pieces, drawn by the app's own code (prices, shops,
the piece, Shop). This script writes that file in the river's own format.

Kept: her pieces that anyone may see (public, on a list that is not private,
never a photo of her own), not yet bought, with a link, a name and a picture,
the newest first. Nothing about a reservation is read or written: a reserved
piece stays like any other (the owner never learns of a reservation, not even
from an absence). Pictures are copied here so the window never waits on a shop.
`counts.json` beside this script, if present, gives each link its number of
wants (read from the live feed, product link -> number).

Reads CloudKit with the server key in ~/.wantd-ck (never printed).
"""
import io, json, pathlib, sys, urllib.request
sys.path.insert(0, str(pathlib.Path.home() / ".wantd-ck"))
import re
import ckreq
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent.parent
OUT = HERE / "brands"
OWNER = "_e4a756c55355bc6245fe776aede18bbb"   # wtd-agathe
KEEP = 96
# The piece shown in close-up on /brands/ (the travel scene): also written at
# 1200px as <id>@2x.webp, so it stays sharp (Agathe, 24/11: the blush was soft).
HERO = "46F4C023-E666-4587-876F-5ED2EB5D087E"   # CHANEL cat-eye sunglasses, 3289x3840 at the shop


def rows(res):
    return [r for r in res.get("records", []) if not r.get("serverErrorCode")]


def query(kind):
    out, marker = [], None
    while True:
        body = {"query": {"recordType": kind, "filterBy": [{"fieldName": "ownerID", "comparator": "EQUALS", "fieldValue": {"value": OWNER}}]}, "resultsLimit": 200}
        if marker:
            body["continuationMarker"] = marker
        res = ckreq.call("records/query", body)
        out += rows(res)
        marker = res.get("continuationMarker")
        if not marker:
            return out


# The file is public: a link keeps what names the product and loses what
# names a person, a device or a campaign. Share links that carry an account
# (TikTok) and other publishers' affiliate short links are left out.
SKIP_HOSTS = ("tiktok.com", "sovrn.co", "amzn.eu", "amzn.to")
TRACKING = ("utm_", "gclid", "gbraid", "wbraid", "gad_", "fbclid", "_gl", "srsltid", "epik", "otid", "wmc", "pp",
            "_su_rec", "recommendationId", "icid2", "om_mmc", "c3ch", "c3nid", "affid", "ranEAID", "ranMID",
            "ranSiteID", "ranLinkID", "gclsrc", "deeplink", "product", "_d", "_svg", "checksum",
            "tag", "hv", "mcid", "linkCode", "psc")


def clean(url):
    from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
    parts = urlsplit(url)
    host = parts.netloc.lower()
    if any(host == h or host.endswith("." + h) for h in SKIP_HOSTS):
        return None
    q = [(k, v) for k, v in parse_qsl(parts.query, keep_blank_values=True) if not any(k == t or k.startswith(t) for t in TRACKING)]
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(q), parts.fragment))


def light_ground(img):
    """The photo sits on a light, neutral ground (Agathe, 24/11: "pourquoi fond
    vert"): its four corners pale and without colour, as a shop's packshot."""
    w, h = img.size
    px = [img.getpixel(p) for p in [(3, 3), (w - 4, 3), (3, h - 4), (w - 4, h - 4)]]
    return all(min(c) >= 205 and max(c) - min(c) <= 24 for c in px)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return Image.open(io.BytesIO(r.read())).convert("RGB")


def main():
    private = {l["fields"].get("listUUID", {}).get("value") for l in query("List") if l["fields"].get("isPrivate", {}).get("value") == 1}
    counts_file = pathlib.Path(__file__).with_name("counts.json")
    counts = json.loads(counts_file.read_text()) if counts_file.exists() else {}
    pieces = []
    # The 96 most recent pieces, then older bags until the search demo of
    # /brands/ has a dozen of them (Agathe, 26/11: five a row, more bags).
    BAGS = re.compile(r"\bbags?\b|hobo|baguette|tote|clutch|bolso|borsa|handbag|crossbody|\bsac\b", re.I)
    WANT_BAGS = 12
    records = sorted(query("Item"), key=lambda r: -r["fields"].get("addedAt", {}).get("value", 0))
    for r in records:
        f = r["fields"]
        if len(pieces) >= KEEP:
            bags = sum(1 for p in pieces if BAGS.search(p["n"] + " " + p["u"]) and p.get("pa") is not None)
            if bags >= WANT_BAGS:
                break
            if not (BAGS.search((f.get("name", {}).get("value") or "") + " " + (f.get("urlString", {}).get("value") or "")) and f.get("priceAmount", {}).get("value") is not None):
                continue
        v = lambda k: f.get(k, {}).get("value")
        ids = v("listIDs") or []
        if v("isPublic") == 0 or (ids and all(i in private for i in ids)) or v("ownPhoto"):
            continue
        if (v("status") or "") == "purchased" or not (v("name") and v("urlString")):
            continue
        link = clean(v("urlString"))
        if not link:
            continue
        sources = []
        asset = v("imageAsset")
        if asset and asset.get("downloadURL"):
            sources.append(asset["downloadURL"].replace("${f}", "image"))
        sources += [u for u in [v("imageURLString")] + list(v("imageCandidateURLs") or []) if u and u not in sources]
        img = None
        for s in sources[:6]:
            try:
                got = fetch(s)
            except Exception:
                continue
            # A real packshot: wide enough, light ground, and not a shop's empty
            # "No image" placeholder (nearly flat).
            from PIL import ImageStat
            # ... and not a wide banner (Agathe, 24/11: "exclus ce genre de large images"): at least 4:5.
            if got.width >= 300 and got.height / got.width >= 0.8 and light_ground(got) and ImageStat.Stat(got.convert("L")).stddev[0] >= 5:
                img = got; break
        if img is None:
            continue
        rid = r["recordName"]
        (OUT / "feed").mkdir(parents=True, exist_ok=True)
        if rid == HERO and img.width >= 1200:
            big = img.resize((1200, round(img.height * 1200 / img.width)), Image.LANCZOS)
            big.save(OUT / "feed" / f"{rid}@2x.webp", "WEBP", quality=86, method=6)
        if img.width > 600:
            img = img.resize((600, round(img.height * 600 / img.width)), Image.LANCZOS)
        img.save(OUT / "feed" / f"{rid}.webp", "WEBP", quality=80, method=6)
        it = {"id": rid, "n": v("name"), "u": link, "i": f"/brands/feed/{rid}.webp", "o": OWNER,
              "at": v("addedAt"), "ar": round(img.height / img.width, 3)}
        if v("store"): it["s"] = v("store")
        if v("brand"): it["b"] = v("brand")
        if isinstance(v("priceAmount"), (int, float)) and v("priceCurrency"):
            it["pa"] = v("priceAmount"); it["pc"] = v("priceCurrency")
        if v("priceText"): it["pt"] = v("priceText")
        pieces.append(it)
        print(f"- {it.get('s', '')}: {it['n'][:50]}")
    # Every price also in dollars, for the background of /brands/ (the app
    # converts on its own; the background is drawn without it).
    try:
        rates = json.load(urllib.request.urlopen("https://open.er-api.com/v6/latest/USD", timeout=20))["rates"]
        for p in pieces:
            if isinstance(p.get("pa"), (int, float)) and rates.get(p.get("pc"), 0) > 0:
                p["pu"] = round(p["pa"] / rates[p["pc"]])
    except Exception as e:
        print("no dollar prices:", e)
    # Each want of the community, as the worker lists them (link, member):
    # only the number is real here, the members stay unnamed.
    rewants = [[p["u"], f"m{k}"] for p in pieces for k in range(int(counts.get(p["u"], 0)))]
    (OUT / "feed.json").write_text(json.dumps({"items": pieces, "rewants": rewants}, ensure_ascii=False, separators=(",", ":")))
    print(f"{len(pieces)} pieces written to brands/feed.json")


if __name__ == "__main__":
    main()
