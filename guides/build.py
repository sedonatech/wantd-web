#!/usr/bin/env python3
"""Gift guides for wantd.sedonatech.uk (SED-627).

Static pages Google can read without running a line of JavaScript. One JSON
per guide in guides/src/, one folder per guide in guides/<slug>/, the photos
processed once into guides/img/<slug>/. The guides index, /sitemap.xml and
/robots.txt at the site root are rewritten on every run.

    python3 guides/build.py            every guide
    python3 guides/build.py <slug>     one guide (index and sitemap follow)

A guide with "published": false is served with noindex and stays out of the
sitemap: a draft Agathe can look at on the live site before a word of it is
offered to Google.
"""
import json
import os
import re
import sys
from datetime import date
from html import escape
from string import Template
from urllib.parse import quote, urlparse

from PIL import Image

SITE = "https://wantd.sedonatech.uk"
# Sedona Tech Ltd on Skimlinks (same id as the board). Every outbound shop
# link goes through the wrapper, never bare: an unmonetised shop simply passes
# through to its own page (SED-586).
SKIMLINKS_ID = "308847X1797169"
APP_STORE = "https://apps.apple.com/app/id6787658989"

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(HERE, "src")
PLATE_W, PLATE_H = 900, 1200


# --------------------------------------------------------------------------
# Photos: the shop's own picture, set on a 3:4 plate the colour of its own
# background, so the plate reads as one piece of paper and never as a crop.
# --------------------------------------------------------------------------
def plate(src, dest):
    if os.path.exists(dest) and os.path.getmtime(dest) >= os.path.getmtime(src):
        return
    im = Image.open(src).convert("RGB")
    w, h = im.size
    k = max(8, min(w, h) // 40)
    corners = [im.crop(b).resize((1, 1), Image.BOX).getpixel((0, 0)) for b in
               ((0, 0, k, k), (w - k, 0, w, k), (0, h - k, k, h), (w - k, h - k, w, h))]
    bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))
    scale = min(PLATE_W / w, PLATE_H / h)
    fitted = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    canvas = Image.new("RGB", (PLATE_W, PLATE_H), bg)
    canvas.paste(fitted, ((PLATE_W - fitted.width) // 2, (PLATE_H - fitted.height) // 2))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    canvas.save(dest, "JPEG", quality=82, optimize=True, progressive=True)


def shop_link(url, channel):
    encoded = quote(url, safe="")
    return f"https://go.skimresources.com/?id={SKIMLINKS_ID}&url={encoded}&xcust={quote(channel, safe='')}"


def host(url):
    h = urlparse(url).netloc.lower()
    return h[4:] if h.startswith("www.") else h


def price_number(price):
    m = re.search(r"[\d]+(?:\.\d+)?", price.replace(",", ""))
    return m.group(0) if m else None


# --------------------------------------------------------------------------
# The page: the landing's cartel, on paper. Same tokens, same grammar.
# --------------------------------------------------------------------------
CSS = """
  :root {
    --paper: rgb(247,247,245); --paper-deep: rgb(238,238,235);
    --ink: rgb(20,20,18); --ink-soft: rgb(122,120,116);
    --cobalt: #0228B2; --hairline: rgba(20,20,18,0.10);
    --sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif;
    --serif: ui-serif, "New York", "Iowan Old Style", "Palatino", Georgia, "Times New Roman", serif;
  }
  @media (prefers-color-scheme: dark) {
    :root { --paper: rgb(9,9,9); --paper-deep: rgb(20,20,20); --ink: rgb(243,242,240);
            --ink-soft: rgb(150,149,146); --cobalt: #6D8CFF; --hairline: rgba(243,242,240,0.12); }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: var(--paper); }
  body { color: var(--ink); font-family: var(--sans); font-size: 16px; line-height: 1.5;
         -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
  a { color: inherit; }
  img { display: block; max-width: 100%; height: auto; }
  .page { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 56px); }

  header { display: flex; align-items: baseline; justify-content: space-between;
           padding: calc(22px + env(safe-area-inset-top)) 0 0; }
  .wordmark { font-size: 22px; font-weight: 600; letter-spacing: -0.023em; color: var(--ink); text-decoration: none; }
  .wordmark .dot { color: var(--cobalt); }
  header .inv { font-size: 13px; font-weight: 300; color: var(--ink-soft); }
  @media (max-width: 560px) { header { flex-direction: column; align-items: flex-start; gap: 6px; } }

  .label { font-size: 13px; font-weight: 400; color: var(--ink-soft); margin-bottom: 18px; }
  .say { font-family: var(--serif); font-style: italic; font-weight: 300; color: var(--ink); }

  .hero { padding: clamp(56px, 10vh, 110px) 0 clamp(40px, 6vh, 64px); }
  .hero h1 { font-size: clamp(34px, 5.6vw, 60px); font-weight: 300; letter-spacing: -0.025em;
             line-height: 1.06; text-wrap: balance; max-width: 820px; }
  .hero .say { font-size: clamp(19px, 2.2vw, 24px); line-height: 1.4; margin-top: 24px; max-width: 30em; }
  .hero .meta { margin-top: 22px; font-size: 13px; font-weight: 300; color: var(--ink-soft); }

  /* The pieces: a ruled list, one hairline per row, like cartels along a wall. */
  .pieces { list-style: none; border-top: 1px solid var(--hairline); }
  .piece { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 20px 48px;
           padding: 36px 0; border-bottom: 1px solid var(--hairline); align-items: start; }
  .piece figure img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; background: var(--paper-deep); }
  .cartel { padding-top: 4px; }
  .cartel .k { font-family: var(--serif); font-style: italic; font-weight: 300; font-size: 22px;
               color: var(--cobalt); line-height: 1; }
  .cartel .maker { margin-top: 18px; font-size: 13px; font-weight: 400; color: var(--ink-soft); }
  .cartel h2 { margin-top: 6px; font-size: clamp(22px, 2.4vw, 30px); line-height: 1.22; letter-spacing: -0.01em; }
  .cartel h2 .price { color: var(--ink-soft); }
  .cartel .note { margin-top: 14px; font-size: 16px; font-weight: 300; line-height: 1.5; max-width: 34em; }
  .cartel .shop { display: inline-block; margin-top: 18px; font-size: 14px; font-weight: 400;
                  text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--ink-soft); }
  .cartel .shop:hover { text-decoration-color: var(--ink); }
  @media (max-width: 640px) {
    .piece { grid-template-columns: 1fr; gap: 16px; padding: 28px 0; }
    .piece figure { max-width: 300px; }
  }

  section.ask { padding: clamp(52px, 8vh, 88px) 0; }
  .ask h2 { font-size: clamp(30px, 4.6vw, 48px); font-weight: 300; letter-spacing: -0.02em; line-height: 1.1; max-width: 760px; }
  .ask .say { font-size: clamp(18px, 2vw, 22px); margin-top: 18px; max-width: 30em; }
  .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 18px 28px; margin-top: 36px; }
  .cta { display: inline-block; border-radius: 999px; padding: 15px 26px; min-height: 48px; font-size: 14px;
         font-weight: 400; letter-spacing: 0.01em; text-decoration: none; background: var(--ink); color: var(--paper); }
  .cta:hover { opacity: 0.88; }
  .quiet { font-size: 14px; font-weight: 400; color: var(--ink); text-decoration: underline;
           text-underline-offset: 3px; text-decoration-color: var(--ink-soft); padding: 8px 0; }
  :focus-visible { outline: 2px solid var(--cobalt); outline-offset: 3px; border-radius: 2px; }

  /* The index of guides: the same ruled list, words only. */
  .rows { list-style: none; border-top: 1px solid var(--hairline); }
  .rows li { padding: 26px 0; border-bottom: 1px solid var(--hairline); }
  .rows h2 { font-size: clamp(22px, 2.6vw, 30px); font-weight: 400; letter-spacing: -0.015em; line-height: 1.22; }
  .rows h2 a { text-decoration: none; }
  .rows h2 a:hover { text-decoration: underline; text-underline-offset: 4px; text-decoration-color: var(--ink-soft); }
  .rows .say { font-size: clamp(17px, 1.7vw, 20px); line-height: 1.45; margin-top: 8px; max-width: 34em; }
  .rows .meta { margin-top: 10px; font-size: 13px; font-weight: 300; color: var(--ink-soft); }

  footer { border-top: 1px solid var(--hairline); padding: 30px 0 calc(40px + env(safe-area-inset-bottom));
           display: flex; flex-wrap: wrap; gap: 10px 26px; font-size: 13px; font-weight: 300; color: var(--ink-soft); }
  footer a { color: var(--ink-soft); text-decoration: none; }
  footer a:hover { color: var(--ink); }
"""

HEAD = Template("""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>$title</title>
<meta name="description" content="$description">
$robots<meta name="theme-color" content="#F7F7F5" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#090909" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="$canonical">
<meta property="og:title" content="$title">
<meta property="og:description" content="$description">
<meta property="og:type" content="$ogtype">
<meta property="og:url" content="$canonical">
<meta property="og:image" content="$ogimage">
<meta name="twitter:card" content="summary_large_image">
$jsonld<style>$css</style>
</head>
<body>
<div class="page">
  <header>
    <a class="wordmark" href="/" aria-label="Wantd">Wantd<span class="dot">.</span></a>
    <span class="inv">By invitation only. For iPhone and Mac.</span>
  </header>
  <main>
""")

FOOT = Template("""  </main>
  <footer>
    <span>Wantd is made by Sedona Tech Ltd.</span>
    <a href="/guides/">Gift guides</a>
    <a href="mailto:support@sedonatech.uk">support@sedonatech.uk</a>
    <a href="https://sedonatech.uk/privacy-policy/">Privacy</a>
    <a href="$appstore">App Store</a>
  </footer>
</div>
</body>
</html>
""")

ASK = Template("""
    <section class="ask" aria-labelledby="ask">
      <h2 id="ask">$ask_title</h2>
      <p class="say">$ask_say</p>
      <div class="actions">
        <a class="cta" href="/join/?s=$channel">Join the waitlist</a>
        <a class="quiet" href="$appstore">Already invited? Get Wantd on the App Store.</a>
      </div>
    </section>
""")


def head(title, description, canonical, ogimage, published, jsonld=None, ogtype="article"):
    return HEAD.substitute(
        title=escape(title), description=escape(description), canonical=canonical,
        ogimage=ogimage, ogtype=ogtype, css=CSS,
        robots="" if published else '<meta name="robots" content="noindex">\n',
        jsonld=('<script type="application/ld+json">%s</script>\n' % json.dumps(jsonld, ensure_ascii=False)) if jsonld else "",
    )


def render_guide(g):
    slug = g["slug"]
    channel = g.get("channel", "guide-" + slug)
    url = f"{SITE}/guides/{slug}/"
    out_dir = os.path.join(HERE, slug)
    img_dir = os.path.join(HERE, "img", slug)
    os.makedirs(out_dir, exist_ok=True)

    pieces, ld_items, first_img = [], [], None
    for n, it in enumerate(g["items"], 1):
        base = f"{n:02d}-{it['id']}.jpg"
        plate(os.path.expanduser(it["image"]), os.path.join(img_dir, base))
        rel = f"../img/{slug}/{base}"
        absolute = f"{SITE}/guides/img/{slug}/{base}"
        first_img = first_img or absolute
        shop = shop_link(it["url"], channel)
        note = f'\n          <p class="note">{escape(it["note"])}</p>' if it.get("note") else ""
        pieces.append(f"""        <li class="piece" id="p{n}">
          <figure><img src="{rel}" width="{PLATE_W}" height="{PLATE_H}" alt="{escape(it['alt'])}"{' loading="lazy"' if n > 2 else ''}></figure>
          <div class="cartel">
            <p class="k">{n}</p>
            <p class="maker">{escape(it['brand'])}</p>
            <h2 class="say">{escape(it['name'])}<span class="price">, {escape(it['price'])}</span></h2>{note}
            <a class="shop" href="{shop}" rel="sponsored nofollow noopener" target="_blank">Shop at {escape(host(it['url']))}</a>
          </div>
        </li>""")
        product = {
            "@type": "Product", "name": it["name"], "image": absolute,
            "brand": {"@type": "Brand", "name": it["brand"]},
            "url": it["url"],
        }
        amount = price_number(it["price"])
        if amount:
            product["offers"] = {"@type": "Offer", "price": amount, "priceCurrency": g.get("currency", "USD"), "url": it["url"]}
        ld_items.append({"@type": "ListItem", "position": n, "item": product})

    jsonld = {
        "@context": "https://schema.org", "@type": "ItemList",
        "name": g["title"], "description": g["description"], "url": url,
        "numberOfItems": len(ld_items), "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "itemListElement": ld_items,
    }
    updated = date.fromisoformat(g["updated"])
    html = head(f"{g['title']} | Wantd", g["description"], url, first_img, g.get("published", False), jsonld)
    html += f"""    <div class="hero">
      <p class="label">{escape(g.get('kicker', 'Gift guide'))}</p>
      <h1>{escape(g['title'])}</h1>
      <p class="say">{escape(g['say'])}</p>
      <p class="meta">{len(g['items'])} pieces, chosen by hand. Prices seen on {updated.strftime('%B %-d, %Y')}. Shop links may earn Wantd a commission, at no cost to you.</p>
    </div>
    <section aria-label="The pieces">
      <ol class="pieces">
{chr(10).join(pieces)}
      </ol>
    </section>
"""
    html += ASK.substitute(ask_title=escape(g.get("ask_title", "Want one of these?")),
                           ask_say=escape(g.get("ask_say", "Wantd keeps every piece you want on one list, with the photo and the price. Your circle sees it, and nobody spoils the surprise.")),
                           channel=quote(channel, safe=""), appstore=APP_STORE)
    html += FOOT.substitute(appstore=APP_STORE)
    with open(os.path.join(out_dir, "index.html"), "w") as f:
        f.write(html)
    return url, first_img


def render_index(guides):
    live = [g for g in guides if g.get("published")]
    rows = []
    for g in sorted(guides, key=lambda g: g["updated"], reverse=True):
        if not g.get("published") and not g.get("draft_in_index"):
            continue
        d = date.fromisoformat(g["updated"])
        rows.append(f"""        <li>
          <h2><a href="/guides/{g['slug']}/">{escape(g['title'])}</a></h2>
          <p class="say">{escape(g['say'])}</p>
          <p class="meta">{len(g['items'])} pieces. {d.strftime('%B %Y')}.</p>
        </li>""")
    url = f"{SITE}/guides/"
    html = head("Gift guides | Wantd", "Gift guides from Wantd: pieces chosen by hand, with the shop's photo and its price. For the people you love, and for your own list.",
                url, f"{SITE}/og-image.png", bool(live), ogtype="website")
    html += f"""    <div class="hero">
      <p class="label">Gift guides</p>
      <h1>Chosen by hand, kept <em style="font-style: normal; color: var(--cobalt)">beautifully.</em></h1>
      <p class="say">A few pieces at a time, with the shop's own photo and its real price. For the people you love, and for your own list.</p>
    </div>
    <section aria-label="Guides">
      <ul class="rows">
{chr(10).join(rows) if rows else '        <li><p class="say">The first guide is on its way.</p></li>'}
      </ul>
    </section>
"""
    html += ASK.substitute(ask_title="Keep the ones you want.",
                           ask_say="Paste a link. Wantd keeps the piece, the photo and the price. Your circle sees what you truly want, and nobody spoils the surprise.",
                           channel="guides", appstore=APP_STORE)
    html += FOOT.substitute(appstore=APP_STORE)
    with open(os.path.join(HERE, "index.html"), "w") as f:
        f.write(html)


def render_sitemap(guides):
    live = [g for g in guides if g.get("published")]
    today = date.today().isoformat()
    urls = [(f"{SITE}/", today, "weekly", "1.0")]
    if live:
        urls.append((f"{SITE}/guides/", max(g["updated"] for g in live), "weekly", "0.8"))
        urls += [(f"{SITE}/guides/{g['slug']}/", g["updated"], "monthly", "0.7") for g in live]
    body = "".join(f"  <url><loc>{u}</loc><lastmod>{m}</lastmod><changefreq>{c}</changefreq><priority>{p}</priority></url>\n"
                   for u, m, c, p in urls)
    with open(os.path.join(ROOT, "sitemap.xml"), "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "</urlset>\n")
    with open(os.path.join(ROOT, "robots.txt"), "w") as f:
        f.write(f"User-agent: *\nAllow: /\nDisallow: /board/\n\nSitemap: {SITE}/sitemap.xml\n")


def main(only=None):
    guides = []
    for name in sorted(os.listdir(SRC)):
        if name.endswith(".json"):
            with open(os.path.join(SRC, name)) as f:
                guides.append(json.load(f))
    for g in guides:
        if only and g["slug"] != only:
            continue
        url, _ = render_guide(g)
        print(("live  " if g.get("published") else "draft ") + url)
    render_index(guides)
    render_sitemap(guides)
    print("index, sitemap.xml and robots.txt rewritten")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
