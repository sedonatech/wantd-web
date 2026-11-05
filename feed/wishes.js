// The Wishlist tab of Wantd on the web (SED-942): her own lists and pieces,
// read and written in CloudKit as the member herself (CloudKit JS, the same
// identity as the iPhone's), screen for screen as the Mac's HomeView.
// Loaded after the feed page's own script and built on its words and walls.
(function () {
"use strict";

// The words, as the app says them (Localizable.xcstrings).
const W = FR ? {
  keeps: "Wantd garde votre liste dans iCloud.", wishes: "envies", founder: "Fondatrice",
  wantsN: (n) => `${n.toLocaleString(LOCALE)} ${n === 1 ? "envie" : "envies"}`, followersN: (n) => `${n.toLocaleString(LOCALE)} ${n === 1 ? "abonné" : "abonnés"}`,
  all: "Tout", edit: "Modifier", granted: "Exaucées", sort: "Trier", filter: "Filtrer", on: "Activé",
  sortDefault: "Par défaut", sortNewest: "Plus récentes d’abord", sortOldest: "Plus anciennes d’abord", sortPriceUp: "Prix croissant", sortPriceDown: "Prix décroissant",
  grid2: "Grille (2 par ligne)", grid4: "Grille (4 par ligne)", grid5: "Grille (5 par ligne)", gridView: "Vue en grille",
  priceToCheck: "Prix à vérifier", onTheirWay: "Vos envies arrivent depuis iCloud.", nothingHere: "Rien sur cette liste pour l’instant.", firstWant: "Ajoutez votre première envie avec ce plus.",
  addTitle: "Ajouter une envie", addSubtitle: "Collez le lien de n’importe quel produit", shopPrompt: "Ou saisissez une boutique, comme rolex.com", paste: "Coller",
  reading: "Lecture de la page…", cantRead: "Impossible de lire ce lien", badLink: "Collez un lien de produit valide.",
  productName: "Nom du produit", namePrompt: "ex. Pantalon large", storeOrBrand: "Boutique ou marque", storePrompt: "ASOS, Sephora…", amount: "Montant", currency: "Devise", select: "Choisir",
  note: "Note personnelle", notePrompt: "Taille, couleur, commentaire…", addToLists: "Ajouter à des listes", newList: "Nouvelle liste",
  addToWishlist: "Ajouter à la liste d’envies", addAnyway: "Ajouter quand même", already: "Déjà dans vos envies.",
  storefront: "Ce lien mène à toute la boutique. Partagez la page du produit lui-même.", noPhoto: "Chaque envie a besoin de sa photo.",
  newListTitle: "Une nouvelle liste.", nameIt: "Nommez-la", visible: "Visible par votre cercle.", privateOnlyYou: "Privée. Visible par vous uniquement.", create: "Créer",
  editWant: "Modifier l’envie", save: "Enregistrer", cancel: "Annuler", delete: "Supprimer", unwant: "Retirer",
  deleteAsk: "Supprimer cette envie ?", deleteBody: "Elle quitte votre liste d’envies, et votre marque d’envie disparaît partout.",
  yourBudget: "Votre budget", reset: "Réinitialiser", done: "OK", shop: "Acheter", lists: "Listes", listName: "Nom de la liste", privateList: "Liste privée", deleteList: "Supprimer cette liste",
  deleteListKeep: "Supprimer, garder ses envies",
} : {
  keeps: "Wantd keeps your list in iCloud.", wishes: "wants", founder: "Founder",
  wantsN: (n) => `${n.toLocaleString(LOCALE)} ${n === 1 ? "want" : "wants"}`, followersN: (n) => `${n.toLocaleString(LOCALE)} ${n === 1 ? "follower" : "followers"}`,
  all: "All", edit: "Edit", granted: "Granted", sort: "Sort", filter: "Filter", on: "On",
  sortDefault: "Default", sortNewest: "Newest first", sortOldest: "Oldest first", sortPriceUp: "Ascending price", sortPriceDown: "Descending price",
  grid2: "Grid (2 per row)", grid4: "Grid (4 per row)", grid5: "Grid (5 per row)", gridView: "Grid view",
  priceToCheck: "Price to check", onTheirWay: "Your wants are on their way from iCloud.", nothingHere: "Nothing on this list yet.", firstWant: "Add your first want with this plus.",
  addTitle: "Add a want", addSubtitle: "Paste any product link", shopPrompt: "Or type a shop, like rolex.com", paste: "Paste",
  reading: "Reading the page…", cantRead: "Couldn't read this link", badLink: "Please paste a valid product link.",
  productName: "Product name", namePrompt: "e.g. Wide-leg trousers", storeOrBrand: "Store or brand", storePrompt: "ASOS, Sephora…", amount: "Amount", currency: "Currency", select: "Select",
  note: "Personal note", notePrompt: "Size, color, comment…", addToLists: "Add to lists", newList: "New list",
  addToWishlist: "Add to wishlist", addAnyway: "Add anyway", already: "Already Wantd.",
  storefront: "This link is the whole shop. Share the product's own page.", noPhoto: "Every want needs its photo.",
  newListTitle: "A new list.", nameIt: "Name it", visible: "Visible to your circle.", privateOnlyYou: "Private. Only you can see it.", create: "Create",
  editWant: "Edit want", save: "Save", cancel: "Cancel", delete: "Delete", unwant: "Unwant",
  deleteAsk: "Delete this want?", deleteBody: "It leaves your wishlist, and your want mark comes off everywhere.",
  yourBudget: "Your budget", reset: "Reset", done: "Done", shop: "Shop", lists: "Lists", listName: "List name", privateList: "Private list", deleteList: "Delete this list",
  deleteListKeep: "Delete, keep its wants",
};

const FOUNDER = "_e4a756c55355bc6245fe776aede18bbb";
const CURRENCIES = ["EUR", "GBP", "USD", "CHF", "CAD", "AUD", "SEK", "NOK", "DKK", "PLN", "JPY", "AED", "SGD", "HKD", "NZD", "CZK", "HUF", "RON", "MXN", "BRL", "TRY", "INR", "KRW", "ZAR"];

// ---------------------------------------------------------------------------
// State.
// ---------------------------------------------------------------------------
const me = {
  id: null,            // her ownerID, CKContainer.userRecordID().recordName
  profile: null,       // { h, n, fr, fg, avatarURL, emoji }
  lists: [],           // { id, name, isMain, isPrivate, memberIDs, creatorID, createdAt, recordName, _tag }
  items: [],           // index-shaped pieces, with si (sortIndex), st (status), rb (reservedBy), note, _tag
  loaded: false, loading: false, error: null,
  listID: null,        // null = All
  shelf: false,        // the Granted shelf
  sort: "manual",
  perRow: 5,
  budget: null,        // [low, high] in the viewer's money
};
let wall = null;
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

const container = () => (window.CloudKit ? CloudKit.getDefaultContainer() : null);
const db = () => container().publicCloudDatabase;
const DEMO = LOCAL;   // on a local try the page shows the founder's public pieces, read only

// ---------------------------------------------------------------------------
// Records <-> the index's shape the feed page already draws.
// ---------------------------------------------------------------------------
const v = (r, k) => (r.fields && r.fields[k] ? r.fields[k].value : undefined);
function itemFromRecord(r) {
  const asset = v(r, "imageAsset");
  const it = {
    id: r.recordName, n: v(r, "name") || "", b: v(r, "brand"), s: v(r, "store"),
    pt: v(r, "priceText"), pa: typeof v(r, "priceAmount") === "number" ? v(r, "priceAmount") : undefined, pc: v(r, "priceCurrency"),
    u: v(r, "urlString") || "", i: v(r, "imageURLString") || undefined, ic: v(r, "imageCandidateURLs") || [],
    at: v(r, "addedAt") || Date.now(), l: v(r, "listIDs") || [], o: v(r, "ownerID"),
    si: typeof v(r, "sortIndex") === "number" ? v(r, "sortIndex") : 0, st: v(r, "status") || "available", rb: v(r, "reservedBy"),
    note: v(r, "personalNote"), aw: v(r, "alsoWantedBy") || [], rf: v(r, "rewantedFrom"), _tag: r.recordChangeTag,
  };
  if (v(r, "ownPhoto") === 1 && asset && asset.downloadURL) { it.op = 1; it.ia = String(asset.downloadURL).replace("${f}", "photo.jpg"); }
  return it;
}
function listFromRecord(r) {
  return {
    id: v(r, "listUUID"), name: v(r, "name") || "", isMain: v(r, "isMain") === 1, isPrivate: v(r, "isPrivate") === 1,
    memberIDs: v(r, "memberIDs") || [], creatorID: v(r, "ownerID"), createdAt: v(r, "createdAt") || 0, recordName: r.recordName, _tag: r.recordChangeTag,
  };
}
const f = (value, type) => ({ value, type });

async function queryAll(query, options) {
  const out = [];
  let res = await db().performQuery(query, options);
  for (;;) {
    if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
    out.push(...res.records);
    if (!res.moreComing) break;
    res = await db().performQuery(res);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Loading her things.
// ---------------------------------------------------------------------------
async function load() {
  if (me.loading) return;
  me.loading = true; me.error = null;
  paint();
  try {
    if (DEMO) {
      const page = await getJSON("/member?owner=" + encodeURIComponent(me.id));
      me.profile = page.profile ? { h: page.profile.h, n: page.profile.n, fr: page.profile.fr || 0, fg: page.profile.fg || 0 } : null;
      me.items = (page.items || []).map((it, i) => Object.assign({ si: i, st: "available", l: it.l || [] }, it));
      me.lists = [];
    } else {
      const [items, mine, shared, profiles, member] = await Promise.all([
        queryAll({ recordType: "Item", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] },
                 { resultsLimit: 200, desiredKeys: ["name", "brand", "store", "priceText", "priceAmount", "priceCurrency", "urlString", "status", "addedAt", "sortIndex", "reservedBy", "listIDs", "personalNote", "alsoWantedBy", "imageCandidateURLs", "imageURLString", "ownerID", "rewantedFrom", "ownPhoto", "imageAsset"] }),
        queryAll({ recordType: "List", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] }, { resultsLimit: 200 }),
        queryAll({ recordType: "List", filterBy: [{ fieldName: "memberIDs", comparator: "LIST_CONTAINS", fieldValue: { value: me.id } }] }, { resultsLimit: 200 }).catch(() => []),
        queryAll({ recordType: "Profile", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] }, { resultsLimit: 5 }).catch(() => []),
        getJSON("/member?owner=" + encodeURIComponent(me.id)).catch(() => null),
      ]);
      me.items = items.map(itemFromRecord).filter((it) => it.n);
      const lists = mine.map(listFromRecord).filter((l) => l.id);
      const known = new Set(lists.map((l) => l.id));
      for (const r of shared) { const l = listFromRecord(r); if (l.id && l.creatorID !== me.id && !known.has(l.id)) { known.add(l.id); lists.push(l); } }
      me.lists = lists.sort((a, b) => a.createdAt - b.createdAt);
      const p = profiles.map((r) => r.fields || {}).find((x) => x.handle && x.handle.value !== "wtd-you") || (profiles[0] && profiles[0].fields) || null;
      const avatar = p && p.avatarAsset && p.avatarAsset.value && p.avatarAsset.value.downloadURL;
      me.profile = {
        h: (p && p.handle && p.handle.value) || (member && member.profile && member.profile.h) || "",
        n: (p && p.displayName && p.displayName.value) || (member && member.profile && member.profile.n) || "",
        fr: (member && member.profile && member.profile.fr) || 0, fg: (member && member.profile && member.profile.fg) || 0,
        avatarURL: avatar ? String(avatar).replace("${f}", "avatar.jpg") : null, emoji: p && p.avatarEmoji && p.avatarEmoji.value,
      };
    }
    me.loaded = true;
  } catch (e) {
    me.error = String(e && (e.message || e)); console.log("wishes load failed", e);
  }
  me.loading = false;
  paint();
}

// ---------------------------------------------------------------------------
// The screen.
// ---------------------------------------------------------------------------
const isHad = (it) => it.st === "purchased" && it.rb === me.id;
function shown() {
  let list = me.items.slice();
  if (me.shelf) list = list.filter(isHad);
  else {
    list = list.filter((it) => !isHad(it));
    if (me.listID) list = list.filter((it) => (it.l || []).includes(me.listID));
  }
  if (me.budget) {
    const [lo, hi] = me.budget;
    list = list.filter((it) => { const a = viewerAmount(it); return a == null ? false : a >= lo && a <= hi; });
  }
  const by = {
    manual: (a, b) => a.si - b.si || b.at - a.at,
    recent: (a, b) => b.at - a.at, oldest: (a, b) => a.at - b.at,
    priceAsc: (a, b) => (viewerAmount(a) ?? Infinity) - (viewerAmount(b) ?? Infinity),
    priceDesc: (a, b) => (viewerAmount(b) ?? -1) - (viewerAmount(a) ?? -1),
  }[me.sort] || ((a, b) => a.si - b.si);
  return list.sort(by);
}
function viewerAmount(it) {
  if (typeof it.pa !== "number" || !it.pc) return null;
  const cur = it.pc.toUpperCase();
  if (VIEWER && cur !== VIEWER && rates && rates[cur] > 0 && rates[VIEWER]) return it.pa / rates[cur] * rates[VIEWER];
  return it.pa;
}
const wantedCount = (it) => river.counts.get(urlKey(it.u)) || (it.aw ? it.aw.length : 0);

function paint() {
  const sec = $("wishes");
  const signedIn = !!me.id;
  $("wDoor").hidden = signedIn;
  $("wHome").hidden = !signedIn;
  if (!signedIn) return;
  // The header.
  const p = me.profile || {};
  const av = $("wAvatar"); av.innerHTML = "";
  if (p.avatarURL) { const img = el("img"); img.src = p.avatarURL; img.alt = ""; img.referrerPolicy = "no-referrer"; av.appendChild(img); }
  else av.appendChild(el("span", "letter", (p.emoji || (p.n || "?").trim().charAt(0) || "?").toUpperCase()));
  $("wName").textContent = p.n || "";
  $("wFounder").hidden = me.id !== FOUNDER;
  const count = me.items.filter((it) => !isHad(it)).length;
  $("wFacts").textContent = p.h ? `@${p.h} · ${W.wantsN(count)} · ${W.followersN(p.fr || 0)}` : "";
  // The list tabs.
  const tabs = $("wTabs"); tabs.innerHTML = "";
  const tab = (title, active, opts) => {
    const b = el("button", "wtab" + (active ? " on" : "")); b.type = "button";
    if (opts && opts.locked) b.appendChild(lockIcon());
    if (opts && opts.shared) b.appendChild(peopleIcon());
    b.appendChild(el("span", null, title));
    return b;
  };
  const allB = tab(W.all, !me.shelf && !me.listID); allB.addEventListener("click", () => { me.shelf = false; me.listID = null; paintWall(); paintTabs(); });
  tabs.appendChild(allB);
  for (const l of me.lists.filter((x) => !x.isMain)) {
    const active = !me.shelf && me.listID === l.id;
    const b = tab(l.name, active, { locked: l.isPrivate, shared: l.memberIDs.length > 0 });
    b.addEventListener("click", () => { me.shelf = false; me.listID = l.id; paintWall(); paintTabs(); });
    tabs.appendChild(b);
    if (active && l.creatorID === me.id && !DEMO) { const e = el("button", "wedit", W.edit); e.type = "button"; e.addEventListener("click", () => openListSheet(l)); tabs.appendChild(e); }
  }
  if (me.items.some(isHad)) { const g = tab(W.granted, me.shelf); g.addEventListener("click", () => { me.shelf = true; me.listID = null; paintWall(); paintTabs(); }); tabs.appendChild(g); }
  if (!DEMO) { const plus = el("button", "wplus"); plus.type = "button"; plus.setAttribute("aria-label", W.newList); plus.innerHTML = '<svg viewBox="0 0 12 12"><path d="M6 1.5v9M1.5 6h9"/></svg>'; plus.addEventListener("click", () => openListSheet(null)); tabs.appendChild(plus); }
  // Sort, filter, grid.
  $("wSortValue").textContent = me.sort === "manual" ? "" : { recent: W.sortNewest, oldest: W.sortOldest, priceAsc: W.sortPriceUp, priceDesc: W.sortPriceDown }[me.sort];
  $("wFilterValue").textContent = me.budget ? "· " + W.on : "";
  $("wGrid").hidden = !REGULAR.matches;
  $("wAdd").hidden = DEMO;
  paintWall();
}
function paintTabs() { paint(); }

function paintWall() {
  const host = $("wWall"), state = $("wState");
  const list = shown();
  host.innerHTML = ""; wall = makeWall(host);
  if (REGULAR.matches) { wall.count = me.perRow; wall.reset(); for (let i = 0; i < 0; i++); }
  // makeWall deals by columnsNow(); the chosen density overrides it on a wide screen.
  if (REGULAR.matches && me.perRow !== wall.cols.length) { host.innerHTML = ""; wall = makeWallWith(host, me.perRow); }
  if (me.loading && !me.loaded) { state.hidden = false; state.className = "state"; state.innerHTML = '<div class="spin"></div>' + W.onTheirWay; host.hidden = true; return; }
  if (me.error) { state.hidden = false; state.className = "state serif"; state.textContent = me.error; host.hidden = true; return; }
  if (!list.length) {
    state.hidden = false; state.className = "state serif";
    state.textContent = me.items.length ? W.nothingHere : W.firstWant;
    host.hidden = true; return;
  }
  state.hidden = true; host.hidden = false;
  wall.add(list, { counts: wantedCount, own: true });
}
function makeWallWith(host, n) {
  const w = makeWall(host);
  w.count = n; host.innerHTML = ""; w.cols = []; w.heights = [];
  for (let i = 0; i < n; i++) { const c = el("div", "col"); host.appendChild(c); w.cols.push(c); w.heights.push(0); }
  return w;
}

function lockIcon() { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 12 12"); s.innerHTML = '<rect x="2.5" y="5.5" width="7" height="5.5" rx="1.2" fill="currentColor" stroke="none"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5"/>'; s.classList.add("wicon"); return s; }
function peopleIcon() { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 14 12"); s.innerHTML = '<circle cx="5" cy="4" r="2.2"/><circle cx="10" cy="4.5" r="1.8"/><path d="M1 11c0-2.4 1.8-4 4-4s4 1.6 4 4M9 10.5c.3-1.6 1.4-2.6 2.8-2.6 1 0 1.9.6 2.2 1.6"/>'; s.classList.add("wicon"); return s; }

// ---------------------------------------------------------------------------
// Sheets: one quiet panel, centred on the Mac, from the foot on a phone.
// ---------------------------------------------------------------------------
let sheetOpen = null;
function openSheet(build) {
  closeSheet(true);
  const root = $("wSheet"), panel = $("wSheetPanel");
  panel.innerHTML = '<div class="grab"></div>';
  build(panel);
  root.classList.add("on");
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("in")));
  document.body.style.overflow = "hidden";
  sheetOpen = true;
  const first = panel.querySelector("input, textarea, button");
  if (first && !REGULAR.matches) {} else if (first) first.focus({ preventScroll: true });
}
function closeSheet(now) {
  const root = $("wSheet");
  if (!sheetOpen) { if (now) root.classList.remove("on", "in"); return; }
  sheetOpen = false;
  root.classList.remove("in");
  document.body.style.overflow = "";
  setTimeout(() => { if (!sheetOpen) root.classList.remove("on"); }, now ? 0 : 320);
}
$("wSheetScrim").addEventListener("click", () => closeSheet());
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && sheetOpen) closeSheet(); });

function capsuleField(iconSVG, input) {
  const wrap = el("label", "wcap");
  const ic = el("span", "wcapicon"); ic.innerHTML = iconSVG; wrap.appendChild(ic);
  wrap.appendChild(input);
  return wrap;
}
const LINK_ICON = '<svg viewBox="0 0 14 14"><path d="M6 8.5a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5L7 4"/><path d="M8 5.5a2.5 2.5 0 0 0-3.5 0l-2 2A2.5 2.5 0 0 0 6 11l1-1"/></svg>';
const SHOP_ICON = '<svg viewBox="0 0 14 14"><path d="M2 6v6h10V6M1.5 3.5h11L13 6a2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-4 0L1.5 3.5zM5.5 12V8.5h3V12"/></svg>';

function labeled(title, input) {
  const b = el("div", "wfield");
  b.appendChild(el("div", "wlabel", title));
  b.appendChild(input);
  return b;
}
function textInput(value, placeholder, opts) {
  const i = el(opts && opts.multiline ? "textarea" : "input");
  if (!(opts && opts.multiline)) i.type = (opts && opts.type) || "text";
  i.value = value || ""; i.placeholder = placeholder || "";
  i.autocomplete = "off"; i.autocapitalize = (opts && opts.caps) || "sentences"; i.spellcheck = false;
  if (opts && opts.multiline) i.rows = 2;
  return i;
}
function currencySelect(value) {
  const s = el("select");
  const none = el("option", null, W.select); none.value = ""; s.appendChild(none);
  for (const c of CURRENCIES) { const o = el("option", null, c); o.value = c; s.appendChild(o); }
  if (value && !CURRENCIES.includes(value)) { const o = el("option", null, value); o.value = value; s.appendChild(o); }
  s.value = value || "";
  return s;
}
function bar(title, onClick) { const b = el("button", "wbar", title); b.type = "button"; b.addEventListener("click", onClick); return b; }
function quietLine(title, onClick, soft) { const b = el("button", "wline" + (soft ? " soft" : ""), title); b.type = "button"; b.addEventListener("click", onClick); return b; }

// The editable card, after a read or on an edit: photo, then the fields.
function editableCard(draft, opts) {
  const card = el("div", "wcard");
  const photo = el("div", "wphoto");
  const srcs = photoSources(draft);
  if (srcs.length) {
    const img = el("img"); img.alt = ""; img.referrerPolicy = "no-referrer";
    let k = 0; img.onerror = () => { k += 1; if (k < srcs.length) img.src = srcs[k]; else img.remove(); };
    img.src = srcs[0]; photo.appendChild(img);
  }
  card.appendChild(photo);
  const fields = el("div", "wfields");
  const name = textInput(draft.n, W.namePrompt, { multiline: true });
  const store = textInput(draft.s || draft.b || "", W.storePrompt, { caps: "words" });
  const amount = textInput(typeof draft.pa === "number" ? String(draft.pa) : "", "0", { type: "text" }); amount.inputMode = "decimal";
  const cur = currencySelect(draft.pc || "");
  const note = textInput(draft.note || "", W.notePrompt);
  fields.appendChild(labeled(W.productName, name));
  fields.appendChild(labeled(W.storeOrBrand, store));
  const row = el("div", "wrow"); row.appendChild(labeled(W.amount, amount)); row.appendChild(labeled(W.currency, cur)); fields.appendChild(row);
  fields.appendChild(labeled(W.note, note));
  card.appendChild(fields);
  // Other pictures the page offered, one tap to choose.
  if (draft.ic && draft.ic.length > 1) {
    const strip = el("div", "wstrip");
    for (const u of draft.ic.slice(0, 12)) {
      const b = el("button", "wthumb" + (u === draft.i ? " on" : "")); b.type = "button";
      const im = el("img"); im.src = u; im.alt = ""; im.referrerPolicy = "no-referrer"; im.loading = "lazy"; im.onerror = () => b.remove();
      b.appendChild(im);
      b.addEventListener("click", () => { draft.i = u; strip.querySelectorAll(".wthumb").forEach((x) => x.classList.toggle("on", x === b)); const big = photo.querySelector("img"); if (big) big.src = u; });
      strip.appendChild(b);
    }
    card.appendChild(strip);
  }
  if (opts && opts.already) { const pill = el("span", "walready"); pill.appendChild(el("i")); pill.appendChild(el("span", null, W.already)); card.appendChild(pill); }
  card.read = () => {
    const a = amount.value.trim().replace(",", ".").replace(/[^\d.]/g, "");
    const pa = a ? Number(a) : NaN;
    return { n: name.value.trim(), s: store.value.trim(), pa: Number.isFinite(pa) && a ? pa : null, pc: cur.value || null, note: note.value.trim(), i: draft.i, ic: draft.ic || [] };
  };
  return card;
}

// The lists a new piece is filed on: one line of words, a middle dot between.
function listSelector(selected, onNew) {
  const box = el("div", "wlistsel");
  box.appendChild(el("div", "wlabel", W.addToLists));
  const row = el("div", "wchips");
  const lists = me.lists.filter((l) => !l.isMain);
  lists.forEach((l, i) => {
    if (i) row.appendChild(el("span", "wdot", "·"));
    const b = el("button", "wchip" + (selected.has(l.id) ? " on" : "")); b.type = "button";
    if (l.isPrivate) b.appendChild(lockIcon());
    b.appendChild(el("span", null, l.name));
    b.addEventListener("click", () => { if (selected.has(l.id)) selected.delete(l.id); else selected.add(l.id); b.classList.toggle("on", selected.has(l.id)); });
    row.appendChild(b);
  });
  if (lists.length) row.appendChild(el("span", "wdot", "·"));
  const nb = el("button", "wchip soft", W.newList); nb.type = "button"; nb.addEventListener("click", onNew); row.appendChild(nb);
  box.appendChild(row);
  return box;
}

// ---------------------------------------------------------------------------
// Add a want.
// ---------------------------------------------------------------------------
function openAddSheet() {
  openSheet((panel) => {
    const head = el("div", "whead");
    head.appendChild(el("h2", "wtitle", W.addTitle));
    head.appendChild(el("p", "wsub", W.addSubtitle));
    panel.appendChild(head);
    const url = textInput("", "https://...", { type: "url", caps: "none" }); url.inputMode = "url"; url.enterKeyHint = "go";
    panel.appendChild(capsuleField(LINK_ICON, url));
    const shop = textInput("", W.shopPrompt, { caps: "none" }); shop.enterKeyHint = "go";
    panel.appendChild(capsuleField(SHOP_ICON, shop));
    const body = el("div", "wbody"); panel.appendChild(body);
    const foot = el("div", "wfoot"); panel.appendChild(foot);
    let draft = null, card = null, selected = new Set(), reading = false;
    const setState = (node) => { body.innerHTML = ""; if (node) body.appendChild(node); foot.innerHTML = ""; };
    const readLink = async () => {
      const t = url.value.trim();
      if (!/^https?:\/\/[^\s/]+\.[^\s/]+/i.test(t)) { const e = el("div", "werror", W.badLink); setState(e); return; }
      if (reading) return; reading = true;
      const r = el("div", "wreading"); r.innerHTML = '<span class="spin"></span>'; r.appendChild(el("span", null, W.reading)); setState(r);
      let read = null;
      try {
        const res = await fetch(API + "/read", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: t, lang: LOCALE }) });
        read = await res.json();
        if (!res.ok || read.error) throw new Error(read.error || res.status);
      } catch (e) { read = null; }
      reading = false;
      if (!read) { setState(el("div", "werror", W.cantRead)); return; }
      draft = { n: read.name || "", s: read.store || "", b: read.brand || undefined, pa: typeof read.priceAmount === "number" ? read.priceAmount : undefined, pc: read.priceCurrency || undefined,
                u: read.url || t, i: (read.images || [])[0], ic: read.images || [], blocked: !!read.blocked, storefront: !!read.storefront };
      const already = me.items.some((it) => it.u && urlKey(it.u) === urlKey(draft.u));
      card = editableCard(draft, { already });
      const wrap = el("div");
      if (draft.blocked) wrap.appendChild(el("div", "wnote", W.cantRead));
      wrap.appendChild(card);
      wrap.appendChild(listSelector(selected, () => openListSheet(null, (created) => { selected.add(created.id); })));
      setState(wrap);
      const notes = el("div", "wnote"); foot.appendChild(notes);
      const add = bar(already ? W.addAnyway : W.addToWishlist, async () => {
        const read2 = card.read();
        if (!read2.n) { card.querySelector("textarea").focus(); return; }
        if (draft.storefront) { notes.textContent = W.storefront; return; }
        if (!read2.i) { notes.textContent = W.noPhoto; return; }
        add.disabled = true; add.textContent = "…";
        try { await savePiece(Object.assign({}, draft, read2), selected); closeSheet(); }
        catch (e) { add.disabled = false; add.textContent = already ? W.addAnyway : W.addToWishlist; notes.textContent = String(e && (e.message || e)); }
      });
      if (draft.storefront) notes.textContent = W.storefront; else if (!draft.i) notes.textContent = W.noPhoto;
      foot.appendChild(add);
    };
    url.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); readLink(); } });
    url.addEventListener("input", () => { const t = url.value.trim(); if (/^https?:\/\/[^\s/]+\.[^\s/]+/i.test(t) && t.length > 12 && !reading && !draft) readLink(); });
    url.addEventListener("paste", () => setTimeout(() => { if (!draft) readLink(); }, 50));
    shop.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      let s = shop.value.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].replace(/\s+/g, "");
      if (!s) return;
      if (!s.includes(".")) s += ".com";
      window.open(shopURL("https://" + s + "/", { brand: s.split(".")[0], name: "" }), "_blank", "noopener");
    });
    setTimeout(() => url.focus({ preventScroll: true }), 50);
  });
}

// ---------------------------------------------------------------------------
// Writing: a piece as the app writes it (CloudKitService.record(from:)).
// ---------------------------------------------------------------------------
async function savePiece(d, selected) {
  if (DEMO) throw new Error("local");
  const main = await ensureMainList();
  const listIDs = selected.size ? [...selected] : (main ? [main.id] : []);
  const minIndex = me.items.reduce((m, it) => Math.min(m, it.si), 0);
  const id = crypto.randomUUID().toUpperCase();
  const fields = {
    name: f(d.n.slice(0, 300), "STRING"),
    urlString: f(d.u || "", "STRING"),
    addedAt: f(Date.now(), "TIMESTAMP"),
    sortIndex: f(minIndex - 1, "DOUBLE"),
    ownerID: f(me.id, "STRING"),
    imageURLString: f(d.i || null, "STRING"),
  };
  if (d.s) fields.store = f(d.s, "STRING");
  if (d.b) fields.brand = f(d.b, "STRING");
  if (typeof d.pa === "number" && d.pc) { fields.priceAmount = f(d.pa, "DOUBLE"); fields.priceCurrency = f(d.pc, "STRING"); fields.priceText = f(money(d.pa, d.pc), "STRING"); }
  else fields.priceText = f(null, "STRING");
  if (listIDs.length) fields.listIDs = f(listIDs, "STRING_LIST");
  if (d.note) fields.personalNote = f(d.note, "STRING");
  if (d.ic && d.ic.length) fields.imageCandidateURLs = f(d.ic.slice(0, 20), "STRING_LIST");
  if (me.profile && me.profile.h) fields.ownerHandle = f(me.profile.h, "STRING");
  const res = await db().saveRecords([{ recordType: "Item", recordName: id, fields }]);
  if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
  const saved = itemFromRecord(res.records[0]);
  me.items.unshift(saved);
  paint();
  // Public a moment later, as the app does: the push for a friend's new want
  // rings once the piece is whole.
  const visible = listIDs.some((lid) => { const l = me.lists.find((x) => x.id === lid); return l && !l.isPrivate; });
  if (visible) setTimeout(async () => {
    try {
      const r2 = await db().saveRecords([{ recordType: "Item", recordName: id, recordChangeTag: saved._tag, fields: { isPublic: f(1, "INT64") } }]);
      if (!r2.hasErrors) saved._tag = r2.records[0].recordChangeTag;
    } catch (e) {}
  }, 1500);
  return saved;
}

async function ensureMainList() {
  let main = me.lists.find((l) => l.isMain && l.creatorID === me.id);
  if (main || DEMO) return main || null;
  main = await saveList({ name: "Main Wishlist", isMain: true, isPrivate: false });
  return main;
}

async function saveList(d, existing) {
  const id = existing ? existing.id : crypto.randomUUID().toUpperCase();
  const fields = {
    listUUID: f(id, "STRING"), name: f(d.name, "STRING"), ownerID: f(me.id, "STRING"),
    isMain: f(d.isMain ? 1 : 0, "INT64"), isPrivate: f(d.isPrivate ? 1 : 0, "INT64"),
    createdAt: f(existing ? existing.createdAt : Date.now(), "TIMESTAMP"),
  };
  const rec = { recordType: "List", recordName: existing ? existing.recordName : `list-${me.id}-${id}`, fields };
  if (existing) rec.recordChangeTag = existing._tag;
  const res = await db().saveRecords([rec]);
  if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
  const l = listFromRecord(res.records[0]);
  const i = me.lists.findIndex((x) => x.id === l.id);
  if (i >= 0) me.lists[i] = Object.assign(me.lists[i], l); else me.lists.push(l);
  paint();
  return l;
}

async function updatePiece(it, read) {
  const fields = {
    name: f(read.n.slice(0, 300), "STRING"),
    priceText: f(typeof read.pa === "number" && read.pc ? money(read.pa, read.pc) : null, "STRING"),
    imageURLString: f(read.i || null, "STRING"),
  };
  if (read.s) fields.store = f(read.s, "STRING");
  if (typeof read.pa === "number" && read.pc) { fields.priceAmount = f(read.pa, "DOUBLE"); fields.priceCurrency = f(read.pc, "STRING"); }
  else { fields.priceAmount = f(null, "DOUBLE"); fields.priceCurrency = f(null, "STRING"); }
  if (read.note) fields.personalNote = f(read.note, "STRING"); else if (it.note) fields.personalNote = f(null, "STRING");
  const res = await db().saveRecords([{ recordType: "Item", recordName: it.id, recordChangeTag: it._tag, fields }]);
  if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
  const fresh = itemFromRecord(res.records[0]);
  Object.assign(it, fresh);
  paint();
  return it;
}

async function deletePiece(it) {
  const res = await db().deleteRecords([{ recordName: it.id, recordChangeTag: it._tag }]);
  if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
  me.items = me.items.filter((x) => x.id !== it.id);
  paint();
}

// ---------------------------------------------------------------------------
// A list: new, or the one under the active tab.
// ---------------------------------------------------------------------------
function openListSheet(existing, onCreated) {
  openSheet((panel) => {
    const head = el("div", "whead left");
    head.appendChild(el("h2", "wtitle", existing ? existing.name : W.newListTitle));
    panel.appendChild(head);
    const name = textInput(existing ? existing.name : "", W.nameIt, { caps: "words" }); name.className = "wbig";
    panel.appendChild(name);
    let isPrivate = !!(existing && existing.isPrivate);
    const priv = quietLine(isPrivate ? W.privateOnlyYou : W.visible, () => { isPrivate = !isPrivate; priv.textContent = isPrivate ? W.privateOnlyYou : W.visible; priv.classList.toggle("cobalt", isPrivate); }, true);
    priv.classList.toggle("cobalt", isPrivate);
    panel.appendChild(priv);
    const foot = el("div", "wfoot"); panel.appendChild(foot);
    const err = el("div", "wnote"); foot.appendChild(err);
    const go = bar(existing ? W.save : W.create, async () => {
      const n = name.value.trim(); if (!n) { name.focus(); return; }
      go.disabled = true;
      try {
        const l = await saveList({ name: n, isMain: !!(existing && existing.isMain), isPrivate }, existing);
        if (!existing && onCreated) onCreated(l);
        if (!existing && !onCreated) { me.listID = l.id; me.shelf = false; paint(); }
        closeSheet();
      } catch (e) { go.disabled = false; err.textContent = String(e && (e.message || e)); }
    });
    foot.appendChild(go);
    if (existing && !existing.isMain) {
      foot.appendChild(quietLine(W.deleteListKeep, async () => {
        try {
          const res = await db().deleteRecords([{ recordName: existing.recordName, recordChangeTag: existing._tag }]);
          if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode).join(", "));
          me.lists = me.lists.filter((x) => x.id !== existing.id);
          if (me.listID === existing.id) me.listID = null;
          paint(); closeSheet();
        } catch (e) { err.textContent = String(e && (e.message || e)); }
      }, true));
    }
    setTimeout(() => name.focus({ preventScroll: true }), 50);
  });
}

// ---------------------------------------------------------------------------
// Edit, delete: from the piece's cartel.
// ---------------------------------------------------------------------------
function openEditSheet(it) {
  openSheet((panel) => {
    const head = el("div", "whead"); head.appendChild(el("h2", "wtitle", W.editWant)); panel.appendChild(head);
    const card = editableCard(Object.assign({}, it));
    panel.appendChild(card);
    const foot = el("div", "wfoot"); panel.appendChild(foot);
    const err = el("div", "wnote"); foot.appendChild(err);
    const go = bar(W.save, async () => {
      const read = card.read(); if (!read.n) return;
      go.disabled = true;
      try { await updatePiece(it, read); closeSheet(); if (pieceOpen && pieceOpen.id === it.id) openPiece(it, true); }
      catch (e) { go.disabled = false; err.textContent = String(e && (e.message || e)); }
    });
    foot.appendChild(go);
  });
}
function confirmDelete(it) {
  const root = $("wAlert");
  root.querySelector(".atitle").textContent = W.deleteAsk;
  root.querySelector(".abody").textContent = W.deleteBody;
  const ok = root.querySelector(".aok"); ok.textContent = it.rf ? W.unwant : W.delete;
  root.hidden = false;
  const close = () => { root.hidden = true; ok.onclick = null; };
  root.querySelector(".acancel").onclick = close;
  ok.onclick = async () => { ok.disabled = true; try { await deletePiece(it); close(); closePiece(); } catch (e) { ok.disabled = false; root.querySelector(".abody").textContent = String(e && (e.message || e)); } };
}

// The quiet lines under Shop on her own piece (ProductDetailView.actionButtons).
function ownActions(it) {
  if (DEMO || it.o !== me.id) return [];
  const edit = quietLine(W.edit, () => openEditSheet(it));
  const del = quietLine(it.rf ? W.unwant : W.delete, () => confirmDelete(it));
  return [edit, del];
}

// ---------------------------------------------------------------------------
// Sort, filter, grid, add: the row under the tabs.
// ---------------------------------------------------------------------------
function wireControls() {
  const sort = $("wSort");
  for (const [k, label] of [["manual", W.sortDefault], ["recent", W.sortNewest], ["oldest", W.sortOldest], ["priceAsc", W.sortPriceUp], ["priceDesc", W.sortPriceDown]]) {
    const o = el("option", null, label); o.value = k; sort.appendChild(o);
  }
  sort.value = me.sort;
  sort.addEventListener("change", () => { me.sort = sort.value; paint(); });
  $("wSortLabel").textContent = W.sort;
  $("wFilterLabel").textContent = W.filter;
  const grid = $("wGrid");
  for (const [n, label] of [[5, W.grid5], [4, W.grid4], [2, W.grid2]]) { const o = el("option", null, label); o.value = String(n); grid.appendChild(o); }
  grid.value = String(me.perRow);
  grid.setAttribute("aria-label", W.gridView);
  grid.addEventListener("change", () => { me.perRow = Number(grid.value); paintWall(); });
  $("wFilter").addEventListener("click", openFilterSheet);
  $("wAdd").addEventListener("click", openAddSheet);
  $("wAdd").setAttribute("aria-label", W.addTitle);
  $("wKeeps").textContent = W.keeps;
  $("wFounder").textContent = W.founder;
  $("wMenu").addEventListener("click", () => { const m = $("wMenuBox"); m.hidden = !m.hidden; });
}
function openFilterSheet() {
  openSheet((panel) => {
    const head = el("div", "whead"); head.appendChild(el("h2", "wtitle", W.filter)); head.appendChild(el("p", "wsub", W.yourBudget)); panel.appendChild(head);
    const max = Math.max(1, ...me.items.map((it) => viewerAmount(it) || 0));
    const cur = me.budget || [0, Math.ceil(max)];
    const lo = textInput(String(Math.round(cur[0])), "0", { type: "number" }); lo.min = "0";
    const hi = textInput(String(Math.round(cur[1])), String(Math.ceil(max)), { type: "number" }); hi.min = "0";
    const row = el("div", "wrow"); row.appendChild(labeled("Min", lo)); row.appendChild(labeled("Max", hi)); panel.appendChild(row);
    const foot = el("div", "wfoot"); panel.appendChild(foot);
    foot.appendChild(bar(W.done, () => { const a = Number(lo.value) || 0, b = Number(hi.value) || Math.ceil(max); me.budget = (a <= 0 && b >= Math.ceil(max)) ? null : [Math.min(a, b), Math.max(a, b)]; paint(); closeSheet(); }));
    foot.appendChild(quietLine(W.reset, () => { me.budget = null; paint(); closeSheet(); }, true));
  });
}

// ---------------------------------------------------------------------------
// Sign in, sign out: CloudKit draws Apple's buttons into #ckSignIn and
// #ckSignOut; the identity is the iPhone's.
// ---------------------------------------------------------------------------
function signedIn(identity) {
  me.id = identity && identity.userRecordName;
  me.loaded = false; me.items = []; me.lists = []; me.profile = null;
  paint();
  if (me.id) load();
}
function watchAuth() {
  if (DEMO) { signedIn({ userRecordName: FOUNDER }); return; }
  const tick = () => {
    const a = window.wantdAuth;
    if (!a || !a.ready) { setTimeout(tick, 200); return; }
    signedIn(a.identity);
    const c = container();
    if (!c) return;
    const loop = () => {
      c.whenUserSignsIn().then((id) => { signedIn(id); loop2(); }).catch(() => {});
    };
    const loop2 = () => { c.whenUserSignsOut().then(() => { signedIn(null); loop(); }).catch(() => {}); };
    if (a.identity) loop2(); else loop();
  };
  tick();
}

// ---------------------------------------------------------------------------
// The door from the feed page.
// ---------------------------------------------------------------------------
let wired = false;
window.Wishes = {
  enter() {
    if (!wired) { wired = true; wireControls(); watchAuth(); }
    paint();
  },
  ownActions,
  isMine: (it) => !!me.id && it.o === me.id && !DEMO,
};
REGULAR.addEventListener("change", () => { if (me.id) paint(); });
// The page may have opened on this tab before this script was read.
if (!document.getElementById("wishes").hidden) window.Wishes.enter();
})();
