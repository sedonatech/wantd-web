#!/usr/bin/env python3
"""Per-member WhatsApp preview cards (SED, 2026-08-30).

For each member: fetch their PUBLIC pieces from CloudKit, take the first
four photos, and compose a 1200x630 card — name in Georgia on the left,
cobalt wordmark, photo grid on the right. Written to og/<handle>.png.

Run me again whenever lists change enough to deserve a fresh preview:
    python3 generate-og.py && git add og && git commit -m "og refresh" && git push
Reads the server key from ~/.wantd-ck (never printed).
"""
import io, json, sys, urllib.request
sys.path.insert(0, "/Users/agathedozo/.wantd-ck")
import ckreq
from PIL import Image, ImageDraw, ImageFont, ImageOps

W, H = 1200, 630
IVORY = (247, 247, 245)
INK = (20, 20, 18)
SOFT = (122, 120, 116)
COBALT = (39, 67, 214)

GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEORGIA_I = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
HELV = "/System/Library/Fonts/Helvetica.ttc"


def rows(res):
    return [r for r in res.get("records", []) if not r.get("serverErrorCode")]


def public_images(owner_id):
    """First public pieces' image URLs, in her own order."""
    private = set()
    lists = ckreq.call("records/query", {"query": {
        "recordType": "List",
        "filterBy": [{"fieldName": "ownerID", "comparator": "EQUALS",
                      "fieldValue": {"value": owner_id}}]}})
    for r in rows(lists):
        if (r["fields"].get("isPrivate", {}).get("value") or 0) == 1:
            u = r["fields"].get("listUUID", {}).get("value")
            if u: private.add(u)

    items = ckreq.call("records/query", {"query": {
        "recordType": "Item",
        "filterBy": [{"fieldName": "ownerID", "comparator": "EQUALS",
                      "fieldValue": {"value": owner_id}}]}, "resultsLimit": 200})
    out = []
    for r in sorted(rows(items), key=lambda r: r["fields"].get("sortIndex", {}).get("value", 0)):
        f = r["fields"]
        if (f.get("status", {}).get("value") or "") == "purchased":
            continue
        ids = f.get("listIDs", {}).get("value") or []
        if ids and all(i in private for i in ids):
            continue
        url = f.get("imageURLString", {}).get("value")
        if not url and f.get("imageAsset", {}).get("value", {}).get("downloadURL"):
            url = f["imageAsset"]["value"]["downloadURL"].replace("${f}", "image")
        if url:
            out.append(url)
    return out


def fetch_img(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return Image.open(io.BytesIO(r.read())).convert("RGB")
    except Exception:
        return None


def rounded(img, size, radius=18):
    img = ImageOps.fit(img, size, Image.LANCZOS)
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, *size], radius, fill=255)
    out = Image.new("RGB", size, IVORY)
    out.paste(img, (0, 0), mask)
    return out, mask


def card(name, handle, count, photos):
    img = Image.new("RGB", (W, H), IVORY)
    d = ImageDraw.Draw(img)

    f_name = ImageFont.truetype(GEORGIA_I, 58)
    f_sub = ImageFont.truetype(HELV, 24, index=0)
    f_mark = ImageFont.truetype(HELV, 40, index=1)

    x = 64
    d.text((x, 180), name + "'s", font=f_name, fill=INK)
    d.text((x, 252), "wishlist.", font=f_name, fill=INK)
    d.text((x, 348), f"{count} wants on Wantd", font=f_sub, fill=SOFT)
    d.text((x, H - 118), "Wantd.", font=f_mark, fill=COBALT)

    # 2x2 grid on the right.
    gx, gy, gw, gh, gap = 560, 44, 288, 263, 16
    for i, ph in enumerate(photos[:4]):
        tile, mask = rounded(ph, (gw, gh))
        px = gx + (i % 2) * (gw + gap)
        py = gy + (i // 2) * (gh + gap)
        img.paste(tile, (px, py), mask)
    return img


MEMBERS = [
    ("wtd-agathe", "Agathe", "_e4a756c55355bc6245fe776aede18bbb"),
    ("wtd-sedona", "Sedona", "_bb1ae9292a574f8ceb31036e56ca322b"),
    ("wtd-mildred", "Mildred", "_1bae8baf395bea85c92efb0822653657"),
    ("wtd-julien", "Julien", "_cca99cda04020a4ada609a4d9b55f239"),
    ("wtd-you", "You", "_249f2033fe80421697db55a8c0b67498"),
    ("wtd-you2", "Catherine", "_d55e9d01ab6f3bf1122b0d4f8d162c47"),
]

import os
os.makedirs("og", exist_ok=True)
for handle, name, owner in MEMBERS:
    urls = public_images(owner)
    photos = [p for p in (fetch_img(u) for u in urls[:8]) if p][:4]
    if not photos:
        print(f"- {handle}: no photos, skipped (generic card stays)")
        continue
    card(name, handle, len(urls), photos).save(f"og/{handle}.png", optimize=True)
    print(f"- og/{handle}.png ({len(urls)} wants, {len(photos)} photos)")
