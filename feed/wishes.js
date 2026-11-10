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
  signIn: "Se connecter avec Apple", signOut: "Se déconnecter",
  shareAsk: (who, list) => `${who} souhaite partager la liste ${list} avec vous.`, aMember: "Un membre", yes: "Oui", no: "Non",
  callYou: "Comment doit-on vous appeler\u00a0?", nameLine: "Le nom que votre cercle lira sur votre liste.", yourName: "Votre nom", thatsMe: "C’est moi",
  spoilTitle: "Le jour où l’on vous gâte.", spoilLine: "Ajoutez votre anniversaire, pour que votre cercle n’ait jamais à le demander.", addBirthday: "Ajouter mon anniversaire", notNow: "Pas maintenant",
  heardTitle: "Comment avez-vous connu Wantd\u00a0?", heardLine: "Je fais Wantd seule. Savoir d’où vous venez m’aide.",
  heard: { "A friend told me": "On m’en a parlé", "The App Store": "L’App Store", "Somewhere else": "Ailleurs" }, where: "Où\u00a0?", cont: "Continuer",
  welcomeTo: "Bienvenue sur", openMyList: "Ouvrir ma liste", connIssue: "Problème de connexion. Réessayez dans un instant.", oneMoment: "Un instant…",
  everyDevice: "Votre liste d’envies, sur tous vos appareils.", withApple: "Continuer avec Apple", withGoogle: "Continuer avec Google", withEmail: "Continuer par email",
  yourEmail: "Votre email.", emailLine: "Nous vous envoyons un code à six chiffres. Jamais de mot de passe.", emailPrompt: "vous@exemple.com", sendCode: "Recevoir le code",
  inbox: "Regardez votre boîte mail.", codeLine: (e) => `Le code envoyé à ${e}. Il vaut 10 minutes.`, codePrompt: "6 chiffres", codeAgain: "Renvoyer un code", otherEmail: "Une autre adresse", back: "Retour",
  codeWrong: "Ce n’est pas le bon code. Réessayez.", codeExpired: "Ce code a expiré. Demandez-en un autre.", emailBad: "Cela ne ressemble pas à une adresse email.", tooMany: "Trop de codes demandés. Patientez un quart d’heure.",
  unreachable: "Wantd est injoignable. Vérifiez votre connexion et réessayez.", googleFailed: "Google ne vous a pas laissée entrer cette fois. Réessayez.",
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
  signIn: "Sign in with Apple", signOut: "Sign out",
  shareAsk: (who, list) => `${who} wants to share the ${list} list with you.`, aMember: "A member", yes: "Yes", no: "No",
  callYou: "What should we call you?", nameLine: "The name your circle will read on your list.", yourName: "Your name", thatsMe: "That's me",
  spoilTitle: "The day to spoil you.", spoilLine: "Add your birthday, so your circle never has to ask.", addBirthday: "Add my birthday", notNow: "Not now",
  heardTitle: "How did you hear about us?", heardLine: "I make Wantd on my own. Knowing where you came from helps.",
  heard: {}, where: "Where?", cont: "Continue",
  welcomeTo: "Welcome to", openMyList: "Open my list", connIssue: "Connection issue. Try again in a moment.", oneMoment: "One moment...",
  everyDevice: "Your wishlist, on every device.", withApple: "Continue with Apple", withGoogle: "Continue with Google", withEmail: "Continue with email",
  yourEmail: "Your email.", emailLine: "We'll send you a six-digit code. No password, ever.", emailPrompt: "you@example.com", sendCode: "Send me the code",
  inbox: "Check your inbox.", codeLine: (e) => `The code we sent to ${e}. It works for 10 minutes.`, codePrompt: "6 digits", codeAgain: "Send another code", otherEmail: "Another email", back: "Back",
  codeWrong: "That's not the code. Try again.", codeExpired: "This code has expired. Send another one.", emailBad: "That doesn't look like an email address.", tooMany: "Too many codes asked. Wait a quarter of an hour.",
  unreachable: "Couldn't reach Wantd. Check your connection and try again.", googleFailed: "Google didn't let you in this time. Try again.",
};

const FOUNDER = "_e4a756c55355bc6245fe776aede18bbb";
const CURRENCIES = ["EUR", "GBP", "USD", "CHF", "CAD", "AUD", "SEK", "NOK", "DKK", "PLN", "JPY", "AED", "SGD", "HKD", "NZD", "CZK", "HUF", "RON", "MXN", "BRL", "TRY", "INR", "KRW", "ZAR"];

// ---------------------------------------------------------------------------
// State.
// ---------------------------------------------------------------------------
const me = {
  id: null,            // her ownerID, CKContainer.userRecordID().recordName
  via: null,           // "ck": Apple, the page reads iCloud as herself; "bridge": Google or email, through the server
  profile: null,       // { h, n, fr, fg, avatarURL, emoji }
  lists: [],           // { id, name, isMain, isPrivate, memberIDs, creatorID, createdAt, recordName, _tag }
  pending: [],         // lists someone shared with her, still waiting for her yes
  pendingNames: {},    // their creators' first names, for the question
  words: new Map(),    // her word on each shared list: LISTUUID -> { state, at, tag }
  asking: false,
  items: [],           // index-shaped pieces, with si (sortIndex), st (status), rb (reservedBy), note, _tag
  loaded: false, loading: false, error: null,
  newcomer: false,     // her profile was read and she has none: the entrance is hers
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
// On a local try the page shows the founder's public pieces, read only; with
// ?bridge, or once a bridge session is open, it behaves as the real site
// does (the doors, then a local bridge on CloudKit Development).
const DEMO = LOCAL && !new URLSearchParams(location.search).has("bridge") && !(window.Account && window.Account.identity());
const viaBridge = () => me.via === "bridge";
const Bridge = () => window.Account.bridge;

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
    memberIDs: v(r, "memberIDs") || [], memberSince: v(r, "memberSince") || [], creatorID: v(r, "ownerID"), createdAt: v(r, "createdAt") || 0, recordName: r.recordName, _tag: r.recordChangeTag,
  };
}

// ---------------------------------------------------------------------------
// The door of a shared list, as the app keeps it (WishlistStore, SED-695): a
// list someone shared with her waits for her yes, and one she refused or
// left stays out, whatever the creator's record still says. Her word is her
// own record, `membership-<list>-<her>`: "accepted" or "left", and when.
// ---------------------------------------------------------------------------
const ACCEPTANCE_BIRTH = Date.UTC(2026, 8, 17, 12);   // WishlistStore.acceptanceBirth
/// When she was invited into this list ("<member>|<seconds>"), in ms.
function invitedAt(l) {
  for (const e of l.memberSince || []) {
    const i = String(e).indexOf("|");
    if (i > 0 && String(e).slice(0, i) === me.id) { const s = Number(String(e).slice(i + 1)); return Number.isFinite(s) ? s * 1000 : null; }
  }
  return null;
}
/// "in", "asked" or "out" for a list someone else created.
function doorOf(l, word) {
  const since = invitedAt(l);
  // A leave older than a fresh invitation is over (reconcileLeaves).
  if (word && word.state === "left" && !(since != null && since > word.at)) return "out";
  // Only an invitation from after the door was born is asked (needsAcceptance).
  if (since != null && since >= ACCEPTANCE_BIRTH && !(word && word.state === "accepted" && word.at >= since)) return "asked";
  return "in";
}
const membershipName = (l) => `membership-${l.id}-${me.id}`;
async function sayToList(l, state) {
  const at = Date.now();
  if (viaBridge()) { await Bridge().sayToList(l.id, state, at); me.words.set(String(l.id).toUpperCase(), { state, at, tag: null }); return; }
  const word = me.words.get(String(l.id).toUpperCase());
  const rec = { recordType: "ListMembership", recordName: membershipName(l),
    fields: { listUUID: f(l.id, "STRING"), memberID: f(me.id, "STRING"), state: f(state, "STRING"), at: f(at, "TIMESTAMP") } };
  if (word && word.tag) rec.recordChangeTag = word.tag;
  const res = await db().saveRecords([rec]);
  if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
  me.words.set(String(l.id).toUpperCase(), { state, at, tag: res.records[0] && res.records[0].recordChangeTag });
}
/// The app's question, one list at a time: "Mila wants to share the
/// Christmas list with you." No, Yes.
function askNextShare() {
  const l = me.pending[0];
  if (!l || me.asking) return;
  me.asking = true;
  const next = () => { me.asking = false; me.pending = me.pending.filter((x) => x.id !== l.id); paint(); askNextShare(); };
  alertBox(W.shareAsk(me.pendingNames[l.creatorID] || W.aMember, l.name), "", W.yes, async () => {
    await sayToList(l, "accepted");
    me.lists = me.lists.concat([l]).sort((a, b) => a.createdAt - b.createdAt);
    next();
  }, { cancelLabel: W.no, onCancel: async () => { await sayToList(l, "left"); next(); } });
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
      // Her things, read as herself in iCloud (Apple) or through the bridge
      // (Google, email): the same pieces, lists, words and profile either way.
      let items, lists, sharedLists, words, profilesRead, member;
      if (viaBridge()) {
        const [mine, w, m] = await Promise.all([Bridge().mine(), Bridge().words().catch(() => null), getJSON("/member?owner=" + encodeURIComponent(me.id)).catch(() => null)]);
        items = mine.items; lists = mine.lists; sharedLists = mine.shared; words = w; member = m;
        profilesRead = mine.profile ? [mine.profile] : [];
      } else {
        const [itemsR, mineR, sharedR, profR, m, wordsR] = await Promise.all([
          queryAll({ recordType: "Item", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] },
                   { resultsLimit: 200, desiredKeys: ["name", "brand", "store", "priceText", "priceAmount", "priceCurrency", "urlString", "status", "addedAt", "sortIndex", "reservedBy", "listIDs", "personalNote", "alsoWantedBy", "imageCandidateURLs", "imageURLString", "ownerID", "rewantedFrom", "ownPhoto", "imageAsset"] }),
          queryAll({ recordType: "List", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] }, { resultsLimit: 200 }),
          queryAll({ recordType: "List", filterBy: [{ fieldName: "memberIDs", comparator: "LIST_CONTAINS", fieldValue: { value: me.id } }] }, { resultsLimit: 200 }).catch(() => []),
          // null when the read failed: a profile that could not be read is not
          // "she has none" (ensureProfileOnce), and nobody is walked in on it.
          queryAll({ recordType: "Profile", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] }, { resultsLimit: 5 }).catch(() => null),
          getJSON("/member?owner=" + encodeURIComponent(me.id)).catch(() => null),
          queryAll({ recordType: "ListMembership", filterBy: [{ fieldName: "memberID", comparator: "EQUALS", fieldValue: { value: me.id } }] }, { resultsLimit: 200 }).catch(() => null),
        ]);
        items = itemsR.map(itemFromRecord); lists = mineR.map(listFromRecord); sharedLists = sharedR.map(listFromRecord); member = m;
        // Her own word on the lists shared with her: her record only, never the
        // creator's note of the invitation ("listinvite-…", same type).
        words = wordsR ? new Map() : null;
        for (const r of wordsR || []) {
          if (!String(r.recordName || "").startsWith("membership-")) continue;
          const id = String(v(r, "listUUID") || "").toUpperCase(), state = v(r, "state");
          if (id && (state === "left" || state === "accepted")) words.set(id, { state, at: v(r, "at") || 0, tag: r.recordChangeTag });
        }
        profilesRead = profR && profR.map((r) => {
          const x = r.fields || {}; const asset = x.avatarAsset && x.avatarAsset.value && x.avatarAsset.value.downloadURL;
          return { h: (x.handle && x.handle.value) || "", n: (x.displayName && x.displayName.value) || "", avatarURL: asset ? String(asset).replace("${f}", "avatar.jpg") : null, emoji: (x.avatarEmoji && x.avatarEmoji.value) || null };
        });
      }
      me.items = items.filter((it) => it.n);
      lists = lists.filter((l) => l.id);
      const known = new Set(lists.map((l) => l.id));
      me.words = words || new Map();
      // A list someone shared with her passes the door first. When her word
      // could not be read, none of them shows: a failed read is not a yes.
      const pending = [];
      for (const l of words ? sharedLists : []) {
        if (!l.id || l.creatorID === me.id || known.has(l.id)) continue;
        known.add(l.id);
        const door = doorOf(l, me.words.get(String(l.id).toUpperCase()));
        if (door === "in") lists.push(l); else if (door === "asked") pending.push(l);
      }
      me.lists = lists.sort((a, b) => a.createdAt - b.createdAt);
      me.pending = pending;
      const unnamed = [...new Set(pending.map((l) => l.creatorID).filter((x) => x && !me.pendingNames[x]))];
      if (unnamed.length && viaBridge()) {
        for (const pr of await Bridge().profiles(unnamed).catch(() => [])) if (pr.o && pr.n) me.pendingNames[pr.o] = pr.n;
      } else for (const id of unnamed) {
        const pr = await queryAll({ recordType: "Profile", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: id } }] }, { resultsLimit: 5, desiredKeys: ["displayName", "handle"] }).catch(() => []);
        const named = pr.map((r) => v(r, "displayName")).find((n) => n);
        if (named) me.pendingNames[id] = named;
      }
      // Someone new (MemberDoor.existingProfiles): her profile could be read and
      // there is none, and the server knows no member by her id.
      const onServer = !!(member && member.profile && member.profile.h);
      let profiles = profilesRead || [], unsure = !profilesRead;
      if (profilesRead && !profilesRead.length && !onServer && keptHandle()) {
        const st = await handleState(keptHandle());
        if (st.record && st.state === "available") profiles = [st.record];
        else if (st.state === "error") unsure = true;
      }
      me.newcomer = !unsure && !profiles.length && !onServer;
      const p = profiles.find((x) => x.h && x.h !== "wtd-you") || profiles[0] || null;
      me.profile = {
        h: (p && p.h) || (member && member.profile && member.profile.h) || "",
        n: (p && p.n) || (member && member.profile && member.profile.n) || "",
        fr: (member && member.profile && member.profile.fr) || 0, fg: (member && member.profile && member.profile.fg) || 0,
        avatarURL: (p && p.avatarURL) || null, emoji: (p && p.emoji) || null,
      };
    }
    me.loaded = true;
  } catch (e) {
    me.error = String(e && (e.message || e)); console.log("wishes load failed", e);
  }
  me.loading = false;
  paint();
  // Someone new is walked in first; so is one who left the entrance half way
  // (the app's hasOnboarded), once her profile could be read again.
  if (me.loaded && !DEMO && (me.newcomer || (entering() && me.profile && me.profile.h))) openEntrance();
  else askNextShare();
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
  const av = $("wAvatar"); av.innerHTML = ""; av.className = "wavatarbox";
  av.appendChild(avatarNode({ n: p.n, h: p.h, e: p.emoji, avatarURL: p.avatarURL }, 40));
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

/// The app's AvatarView: her photo, else her emoji, else the house's letter
/// picture (Avatar-A to Avatar-Z, served from /avatars), else her initial.
function avatarNode(p, size) {
  const a = el("div", "wavatar"); a.style.width = a.style.height = size + "px";
  const name = (p && (p.n || p.h)) || "";
  if (p && p.avatarURL) { const img = el("img"); img.src = p.avatarURL; img.alt = ""; img.referrerPolicy = "no-referrer"; a.appendChild(img); return a; }
  if (p && p.e) { const e = el("span", "emoji", p.e); e.style.fontSize = Math.round(size * 0.5) + "px"; a.appendChild(e); return a; }
  const folded = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const letter = (folded.match(/[A-Z]/) || [])[0];
  if (letter) { const img = el("img"); img.src = "/avatars/" + letter + ".jpg"; img.alt = ""; a.appendChild(img); return a; }
  const l = el("span", "letter", name.trim().charAt(0) || "?"); l.style.fontSize = Math.round(size * 0.4) + "px"; a.appendChild(l);
  return a;
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
      b.addEventListener("click", () => { draft.i = u; draft.picked = true; strip.querySelectorAll(".wthumb").forEach((x) => x.classList.toggle("on", x === b)); const big = photo.querySelector("img"); if (big) big.src = u; });
      strip.appendChild(b);
    }
    card.appendChild(strip);
  }
  if (opts && opts.already) { const pill = el("span", "walready"); pill.appendChild(el("i")); pill.appendChild(el("span", null, W.already)); card.appendChild(pill); }
  card.read = () => {
    const a = amount.value.trim().replace(",", ".").replace(/[^\d.]/g, "");
    const pa = a ? Number(a) : NaN;
    return { n: name.value.trim(), s: store.value.trim(), pa: Number.isFinite(pa) && a ? pa : null, pc: cur.value || null, note: note.value.trim(), i: draft.i, ic: draft.ic || [], picked: !!draft.picked };
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
  if (viaBridge()) {
    // The bridge writes the piece as the app does, her handle and its
    // visibility included (a public piece is flagged a moment later, as here).
    const body = { name: d.n.slice(0, 300), urlString: d.u || "", addedAt: Date.now(), sortIndex: minIndex - 1, imageURLString: d.i || null, priceText: null };
    if (d.s) body.store = d.s;
    if (d.b) body.brand = d.b;
    if (typeof d.pa === "number" && d.pc) { body.priceAmount = d.pa; body.priceCurrency = d.pc; body.priceText = money(d.pa, d.pc); }
    if (listIDs.length) body.listIDs = listIDs;
    if (d.note) body.personalNote = d.note;
    if (d.ic && d.ic.length) body.imageCandidateURLs = d.ic.slice(0, 20);
    if (d.rf) body.rewantedFrom = d.rf;
    const saved = await Bridge().saveItem(id, body);
    me.items.unshift(saved);
    paint();
    return saved;
  }
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
  if (d.rf) fields.rewantedFrom = f(d.rf, "STRING");
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

/// Her copy of someone else's piece (ProductDetailView.repostFromCard): a
/// new piece of hers, the origin kept, on the lists she chose or the main one.
async function saveCopy(from, selected) {
  const srcs = photoSources(from);
  const d = { n: from.n || "", s: from.s || "", b: from.b || undefined, pa: typeof from.pa === "number" ? from.pa : undefined, pc: from.pc || undefined,
              u: from.u || "", i: srcs[0] || null, ic: (from.ic || []).slice(0, 20), rf: from.rf || from.o || undefined };
  return savePiece(d, selected || new Set());
}

async function ensureMainList() {
  let main = me.lists.find((l) => l.isMain && l.creatorID === me.id);
  if (main || DEMO) return main || null;
  // Only when her lists were read and none is the main one: lists still on
  // their way, or a read that failed, are not "she has none" (the app's
  // SED-828: a second Main Wishlist).
  if (!me.loaded || me.error) throw new Error(W.onTheirWay);
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
  let l;
  if (viaBridge()) {
    l = await Bridge().saveList(id, { name: d.name, isMain: !!d.isMain, isPrivate: !!d.isPrivate, createdAt: existing ? existing.createdAt : Date.now(),
      memberIDs: existing ? existing.memberIDs : [] });
  } else {
    const rec = { recordType: "List", recordName: existing ? existing.recordName : `list-${me.id}-${id}`, fields };
    if (existing) rec.recordChangeTag = existing._tag;
    const res = await db().saveRecords([rec]);
    if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
    l = listFromRecord(res.records[0]);
  }
  const i = me.lists.findIndex((x) => x.id === l.id);
  if (i >= 0) me.lists[i] = Object.assign(me.lists[i], l); else me.lists.push(l);
  paint();
  return l;
}

async function updatePiece(it, read) {
  const fields = {
    name: f(read.n.slice(0, 300), "STRING"),
    imageURLString: f(read.i || null, "STRING"),
  };
  // The shop as she left it: the field shows the brand when a piece has no
  // shop, and that brand is not written back as its shop.
  if (read.s && read.s !== (it.s || it.b || "")) fields.store = f(read.s, "STRING");
  // The price only when she changed it: "the shop's own wording is kept"
  // (HomeView), so a price kept as words, or an amount without a currency,
  // survives a rename.
  const hadAmount = typeof it.pa === "number" ? it.pa : null;
  if (read.pa !== hadAmount || (read.pc || null) !== (it.pc || null)) {
    if (typeof read.pa === "number") {
      fields.priceAmount = f(read.pa, "DOUBLE"); fields.priceCurrency = f(read.pc || null, "STRING");
      fields.priceText = f(read.pc ? money(read.pa, read.pc) : String(read.pa), "STRING");
    } else { fields.priceAmount = f(null, "DOUBLE"); fields.priceCurrency = f(null, "STRING"); fields.priceText = f(null, "STRING"); }
  }
  // A shop photo chosen over her own: the piece stops claiming an own photo.
  if (it.op === 1 && read.picked) fields.ownPhoto = f(0, "INT64");
  if (read.note) fields.personalNote = f(read.note, "STRING"); else if (it.note) fields.personalNote = f(null, "STRING");
  let fresh;
  if (viaBridge()) {
    // The same fields, as the bridge takes them (a price is cleared only when
    // she cleared it by hand, as on iPhone).
    const body = {};
    for (const k of Object.keys(fields)) body[k] = fields[k].value;
    if ("priceAmount" in body && body.priceAmount === null) body.priceEditedByHand = true;
    if ("personalNote" in body && body.personalNote === null) body.personalNote = "";
    fresh = await Bridge().saveItem(it.id, body);
  } else {
    const res = await db().saveRecords([{ recordType: "Item", recordName: it.id, recordChangeTag: it._tag, fields }]);
    if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
    fresh = itemFromRecord(res.records[0]);
  }
  Object.assign(it, fresh);
  paint();
  return it;
}

async function deletePiece(it) {
  if (viaBridge()) {
    // The bridge takes her want back with it, as WishlistStore.delete does.
    await Bridge().deleteItem(it.id);
    me.items = me.items.filter((x) => x.id !== it.id);
    paint();
    return;
  }
  const res = await db().deleteRecords([{ recordName: it.id, recordChangeTag: it._tag }]);
  if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
  me.items = me.items.filter((x) => x.id !== it.id);
  paint();
  // "A deleted copy takes its want back with it, wherever it counted"
  // (WishlistStore.delete); on her own original there is no mark to take.
  if (it.u && window.Friends && window.Friends.removeRewant) { try { await window.Friends.removeRewant(it); } catch (e) {} }
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
    let isPrivate = !!(existing && existing.isPrivate);
    const priv = quietLine(isPrivate ? W.privateOnlyYou : W.visible, () => { isPrivate = !isPrivate; priv.textContent = isPrivate ? W.privateOnlyYou : W.visible; priv.classList.toggle("cobalt", isPrivate); }, true);
    priv.classList.toggle("cobalt", isPrivate);
    // A list she already has is neither renamed nor made private or public
    // from here: her iPhone is the one writer of its own lists ("THIS DEVICE
    // WINS", WishlistStore.sync) and would bring the old name and the old
    // privacy back, a private list public again. Until the app reads such a
    // change from the cloud, the web makes a list and deletes one.
    if (!existing) { panel.appendChild(name); panel.appendChild(priv); }
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
    if (!existing) foot.appendChild(go);
    if (existing && !existing.isMain) {
      foot.appendChild(quietLine(W.deleteListKeep, async () => {
        try {
          // Its pieces first leave it, back on the main list when it was their
          // only one, their visibility said again (WishlistStore.deleteList):
          // none is left pointing at a list that is gone.
          const main = me.lists.find((l) => l.isMain && l.creatorID === me.id);
          const moved = me.items.filter((x) => x.o === me.id && (x.l || []).includes(existing.id));
          if (viaBridge()) {
            for (const x of moved) {
              let ids = (x.l || []).filter((id) => id !== existing.id);
              if (!ids.length && main) ids = [main.id];
              const fresh = await Bridge().saveItem(x.id, { listIDs: ids });
              x.l = fresh.l;
            }
            await Bridge().deleteList(existing.id);
          } else for (let i = 0; i < moved.length; i += 50) {
            const recs = moved.slice(i, i + 50).map((x) => {
              let ids = (x.l || []).filter((id) => id !== existing.id);
              if (!ids.length && main) ids = [main.id];
              const open = !ids.length || ids.some((id) => { const l = me.lists.find((y) => y.id === id); return l && !l.isPrivate; });
              return { recordType: "Item", recordName: x.id, recordChangeTag: x._tag, fields: { listIDs: f(ids.length ? ids : null, "STRING_LIST"), isPublic: f(open ? 1 : 0, "INT64") } };
            });
            const r1 = await db().saveRecords(recs);
            if (r1.hasErrors) throw new Error(r1.errors.map((e) => e.ckErrorCode).join(", "));
            for (const r of r1.records) { const x = me.items.find((y) => y.id === r.recordName); if (x) { x._tag = r.recordChangeTag; x.l = (r.fields.listIDs && r.fields.listIDs.value) || []; } }
          }
          if (!viaBridge()) {
            const res = await db().deleteRecords([{ recordName: existing.recordName, recordChangeTag: existing._tag }]);
            if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode).join(", "));
          }
          me.lists = me.lists.filter((x) => x.id !== existing.id);
          if (me.listID === existing.id) me.listID = null;
          paint(); closeSheet();
        } catch (e) { err.textContent = String(e && (e.message || e)); }
      }, true));
    }
    if (!existing) setTimeout(() => name.focus({ preventScroll: true }), 50);
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
/// The Mac's alert: a title, a line, Cancel and one act. A question with two
/// answers (a shared list's Yes and No) names its own Cancel and what it does.
function alertBox(title, body, okLabel, onOk, { cancelLabel = null, onCancel = null } = {}) {
  const root = $("wAlert");
  root.querySelector(".atitle").textContent = title;
  const line = root.querySelector(".abody"); line.textContent = body; line.hidden = !body;
  const ok = root.querySelector(".aok"); ok.textContent = okLabel; ok.disabled = false;
  const cancel = root.querySelector(".acancel"); cancel.disabled = false;
  const plain = cancel.dataset.plain || (cancel.dataset.plain = cancel.textContent);
  cancel.textContent = cancelLabel || plain;
  root.hidden = false;
  const close = () => { root.hidden = true; ok.onclick = null; cancel.onclick = null; cancel.textContent = plain; };
  const act = (fn) => async () => {
    ok.disabled = cancel.disabled = true;
    try { await fn(); close(); } catch (e) { ok.disabled = cancel.disabled = false; line.hidden = false; line.textContent = String(e && (e.message || e)); }
  };
  cancel.onclick = onCancel ? act(onCancel) : close;
  ok.onclick = act(onOk);
}
function confirmDelete(it) {
  alertBox(W.deleteAsk, W.deleteBody, it.rf ? W.unwant : W.delete, async () => { await deletePiece(it); closePiece(); });
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
  buildDoor($("wDoorWays"));
  $("wFounder").textContent = W.founder;
  $("wMenu").addEventListener("click", () => { const m = $("wMenuBox"); m.hidden = !m.hidden; });
  $("wSignOut").textContent = W.signOut;
  $("wSignOut").addEventListener("click", () => {
    $("wMenuBox").hidden = true;
    if (viaBridge()) { window.Account.signOut(); return; }
    const b = $("ckSignOut").querySelector(".apple-auth-button, button, [role=button], div"); if (b) b.click();
  });
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
// The entrance of someone new, as the app's OnboardingView from her name on
// (the door before it is the sign-in): what should we call her, the day to
// spoil her, where she heard of us, the welcome. Her profile is written the
// moment she says who she is; her birthday, then the founder she follows
// from day one, are written at "Open my list". A member never sees it: it
// opens only when her profile was read and there is none.
// ---------------------------------------------------------------------------
const HEARD = ["A friend told me", "TikTok", "Instagram", "Pinterest", "The App Store", "Somewhere else"];
const entry = { open: false, preview: false, name: "", hasBirthday: false, birthday: null, heard: null, other: "", heardSent: false, handle: null, chain: Promise.resolve(true) };
const enteringKey = () => "wantd.entering." + me.id;
/// She began the entrance in this browser and has not opened her list yet.
function entering() { try { return !!me.id && localStorage.getItem(enteringKey()) === "1"; } catch (e) { return false; } }
function markEntering(on) { try { if (on) localStorage.setItem(enteringKey(), "1"); else localStorage.removeItem(enteringKey()); } catch (e) {} }
/// The handle she was given here, kept in this browser: CloudKit needs a few
/// seconds to list a profile it has just accepted, and a page opened again in
/// that moment must not take her for someone new (the app's doubles of
/// 8 September). Read back by its own name, which answers at once.
const handleKey = () => "wantd.handle." + me.id;
function keptHandle() { try { return (me.id && localStorage.getItem(handleKey())) || ""; } catch (e) { return ""; } }
function keepHandle(h) { entry.handle = h; try { localStorage.setItem(handleKey(), h); } catch (e) {} }
const isPlaceholder = (h, n) => n === "You" || h === "wtd-you" || /^wtd-you\d+$/.test(h || "");

/// A handle is free, or hers already (checkHandleAvailability). A read that
/// failed is "error", never "taken" and never "free".
async function handleState(handle) {
  if (viaBridge()) {
    try {
      // Free, or hers already; her own record read back when it is hers.
      if (!(await Bridge().handleFree(handle))) return { state: "taken" };
      const meR = await Bridge().me();
      const mine = meR.profile && meR.profile.handle === handle;
      return mine ? { state: "available", record: { h: meR.profile.handle, n: meR.profile.displayName, avatarURL: meR.profile.avatarURL || null, emoji: meR.profile.avatarEmoji || null } } : { state: "available" };
    } catch (e) { return { state: "error" }; }
  }
  try {
    const res = await db().fetchRecords([{ recordName: "profile-" + handle }], { desiredKeys: ["ownerID", "handle", "displayName"] });
    const r = res.records && res.records[0];
    if (r && r.fields) return { state: v(r, "ownerID") === me.id ? "available" : "taken", record: { h: v(r, "handle"), n: v(r, "displayName"), avatarURL: null, emoji: null } };
    const err = res.errors && res.errors[0];
    return { state: err && err.ckErrorCode === "NOT_FOUND" ? "available" : "error" };
  } catch (e) {
    return { state: e && e.ckErrorCode === "NOT_FOUND" ? "available" : "error" };
  }
}
/// "wtd-" and her name, accents folded, letters and digits only; numbered,
/// then with four random characters, when someone else holds it
/// (ProfileStore.pickAvailableHandle).
function handleCore(name) {
  let c = String(name).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!c) c = "user";
  c = c.slice(0, 15);
  if (c.length < 2) c += "0";
  return c;
}
async function pickHandle(name) {
  const c = handleCore(name);
  const hex = (n) => crypto.randomUUID().replace(/-/g, "").slice(0, n).toLowerCase();
  const tries = ["wtd-" + c].concat([2, 3, 4, 5].map((n) => "wtd-" + c.slice(0, 13) + n), [0, 1, 2].map(() => "wtd-" + c.slice(0, 11) + hex(4)));
  for (const h of tries) {
    const s = (await handleState(h)).state;
    if (s === "available") return h;
    if (s === "error") throw new Error("offline");
  }
  return "wtd-" + c.slice(0, 7) + hex(8);
}
/// A plain insert the server refuses when someone got there first
/// (claimProfile): never written over another member's record.
async function claimProfile(handle, name) {
  if (viaBridge()) {
    try { await Bridge().putProfile({ handle, displayName: name }); return "available"; }
    catch (e) { return e && e.code === "handle_taken" ? "taken" : "error"; }
  }
  let res = null;
  try {
    res = await db().saveRecords([{ recordType: "Profile", recordName: "profile-" + handle,
      fields: { handle: f(handle, "STRING"), displayName: f(name, "STRING"), ownerID: f(me.id, "STRING") } }]);
  } catch (e) { res = null; }
  if (res && !res.hasErrors && res.records && res.records[0]) return "available";
  const now = await handleState(handle);
  return now.record ? now.state : "error";
}
/// Her profile, once (ensureProfile): passes are chained, never side by side,
/// and each reads before it writes, so she is never doubled.
function ensureProfile() {
  entry.chain = entry.chain.then(async () => {
    if (entry.handle || entry.preview) return true;
    const name = entry.name.trim();
    if (!name || name === "You") return false;
    try {
      let kept;
      if (viaBridge()) { const meR = await Bridge().me(); kept = meR.profile && meR.profile.handle ? { h: meR.profile.handle } : null; }
      else {
        const mine = await queryAll({ recordType: "Profile", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] }, { resultsLimit: 5, desiredKeys: ["handle", "displayName"] });
        kept = mine.map((r) => ({ h: v(r, "handle"), n: v(r, "displayName") })).find((x) => x.h && !isPlaceholder(x.h, x.n));
      }
      if (kept) { keepHandle(kept.h); return true; }
      for (let i = 0; i < 3; i++) {
        const h = await pickHandle(name);
        const got = await claimProfile(h, name);
        if (got === "available") { keepHandle(h); return true; }
        if (got === "error") return false;
      }
    } catch (e) { console.log("profile not written", e); }
    return false;
  });
  return entry.chain;
}
/// Her name as she last typed it and her birthday, onto her own record.
async function writeProfileEdits() {
  const name0 = entry.name.trim();
  if (viaBridge()) {
    const body = { handle: entry.handle, displayName: name0 && name0 !== "You" ? name0 : undefined };
    if (body.displayName === undefined) body.displayName = ((await Bridge().me()).profile || {}).displayName || name0;
    if (entry.hasBirthday && entry.birthday) body.birthday = entry.birthday.getTime();
    await Bridge().putProfile(body);
    return;
  }
  const res = await db().fetchRecords([{ recordName: "profile-" + entry.handle }]);
  const r = res.records && res.records[0];
  if (!r || !r.fields || v(r, "ownerID") !== me.id) throw new Error("profile");
  const fields = {}, name = entry.name.trim();
  if (name && name !== "You" && v(r, "displayName") !== name) fields.displayName = f(name, "STRING");
  if (entry.hasBirthday && entry.birthday) fields.birthday = f(entry.birthday.getTime(), "TIMESTAMP");
  if (!Object.keys(fields).length) return;
  const out = await db().saveRecords([{ recordType: "Profile", recordName: r.recordName, recordChangeTag: r.recordChangeTag, fields }]);
  if (out.hasErrors) throw new Error(out.errors.map((e) => e.ckErrorCode).join(", "));
}
/// Day one is never empty: she follows the founder, her handle on the record
/// so the follow can name who arrived. Written once, here, and never again.
async function followFounder() {
  if (me.id === FOUNDER) return false;
  if (viaBridge()) {
    for (let i = 0; i < 3; i++) {
      try { await Bridge().follow(FOUNDER); return true; } catch (e) {}
      await new Promise((r) => setTimeout(r, 800));
    }
    return false;
  }
  const make = (named) => {
    const fields = { followerID: f(me.id, "STRING"), followedID: f(FOUNDER, "STRING"), status: f("accepted", "STRING") };
    if (named && entry.handle) fields.followerHandle = f(entry.handle, "STRING");
    return { recordType: "Follow", recordName: `follow-${me.id}-${FOUNDER}`, fields };
  };
  for (const named of [true, true, false]) {
    try { const res = await db().saveRecords([make(named)], { operationType: "forceUpdate" }); if (!res.hasErrors) return true; } catch (e) {}
    await new Promise((r) => setTimeout(r, 800));
  }
  return false;
}
/// Where she came from rides a Feedback record, in her name ("Heard: TikTok"):
/// the answer stays one of the English values, the cockpit counts by that text.
function sendHeard() {
  if (!entry.heard || entry.heardSent || entry.preview) return;
  entry.heardSent = true;
  const other = entry.other.trim();
  const answer = entry.heard === "Somewhere else" && other ? "Somewhere else: " + other : entry.heard;
  if (viaBridge()) { ensureProfile().then(() => Bridge().feedback("Heard: " + answer)).catch(() => {}); return; }
  ensureProfile().then(() => db().saveRecords([{ recordType: "Feedback", recordName: "feedback-" + crypto.randomUUID().toUpperCase(),
    fields: { text: f("Heard: " + answer, "STRING"), senderID: f(me.id, "STRING"), senderHandle: f(entry.handle || "", "STRING"), appVersion: f("web", "STRING"), sentAt: f(Date.now(), "TIMESTAMP") } }])).catch(() => {});
}

// The card's grammar: each page enters in reading order, kicker, content, acts.
function setIn(node, delay) { node.classList.add("set"); node.style.setProperty("--d", delay + "s"); return node; }
function enterPage(build, cls) {
  const root = $("wEnter");
  const page = el("div", "epage" + (cls ? " " + cls : ""));
  build(page);
  for (const old of root.querySelectorAll(".epage")) { old.classList.add("out"); setTimeout(() => old.remove(), 420); }
  root.appendChild(page);
  root.scrollTop = 0;
  requestAnimationFrame(() => requestAnimationFrame(() => page.classList.add("in")));
  return page;
}
function cardBar(title, onClick) {
  const b = el("button", "ebar", title); b.type = "button";
  b.ready = (on) => { b.classList.toggle("ready", !!on); b.disabled = !on; };
  b.ready(false);
  b.addEventListener("click", onClick);
  return b;
}
const cardSpace = (small) => el("div", "espace" + (small ? " small" : ""));

function openEntrance(preview) {
  if (entry.open) return;
  Object.assign(entry, { open: true, preview: !!preview, name: (!preview && me.profile && me.profile.n) || "", hasBirthday: false, birthday: null, heard: null, other: "", heardSent: false,
    handle: (!preview && me.profile && me.profile.h) || null, chain: Promise.resolve(true) });
  if (!preview) markEntering(true);
  closeSheet(true);
  const root = $("wEnter");
  root.innerHTML = ""; root.classList.remove("leaving"); root.hidden = false;
  document.body.style.overflow = "hidden";
  nameScreen();
}
function closeEntrance() {
  if (!entry.open) return;
  entry.open = false;
  const root = $("wEnter");
  root.hidden = true; root.innerHTML = ""; root.classList.remove("leaving");
  document.body.style.overflow = "";
}

function nameScreen() {
  enterPage((page) => {
    page.appendChild(setIn(el("div", "eword", "Wantd."), 0.04));
    page.appendChild(cardSpace());
    page.appendChild(setIn(el("h1", "etitle", W.callYou), 0.12));
    page.appendChild(setIn(el("p", "eline", W.nameLine), 0.20));
    const field = setIn(el("div", "efield"), 0.26);
    const input = el("input"); input.type = "text"; input.placeholder = W.yourName; input.value = entry.name; input.maxLength = 40;
    input.autocomplete = "given-name"; input.autocapitalize = "words"; input.spellcheck = false; input.enterKeyHint = "done"; input.setAttribute("aria-label", W.yourName);
    field.appendChild(input); field.appendChild(el("div", "rule"));
    page.appendChild(field);
    page.appendChild(cardSpace());
    const go = setIn(cardBar(W.thatsMe, () => {
      entry.name = input.value.trim();
      if (!entry.name) return;
      // Written now, not after the welcome: the birthday and the question
      // that follow give this write all the time it needs.
      ensureProfile();
      birthdayScreen();
    }), 0.32);
    const sync = () => { const t = input.value.trim(); field.classList.toggle("filled", !!t); go.ready(!!t && t !== "You"); };
    input.addEventListener("input", sync);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !go.disabled) { e.preventDefault(); go.click(); } });
    sync();
    page.appendChild(go);
    if (REGULAR.matches) setTimeout(() => input.focus({ preventScroll: true }), 400);
  });
}

/// Month, day and year in the order her language writes them, never past
/// today; the chosen row bright in its band, the others fading.
function dateWheels(onChange) {
  const ROW = 34, today = new Date();
  const box = el("div", "ewheels");
  let y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
  const years = []; for (let i = 1900; i <= today.getFullYear(); i++) years.push(i);
  const months = []; for (let i = 0; i < 12; i++) months.push(new Intl.DateTimeFormat(LOCALE, { month: "long" }).format(new Date(2021, i, 15)));
  const daysIn = (yy, mm) => new Date(yy, mm + 1, 0).getDate();
  function wheel(labels, selected, grow, label, onSelect) {
    const col = el("div", "ewheel"); col.style.flex = grow + " 1 0"; col.tabIndex = 0; col.setAttribute("role", "spinbutton"); col.setAttribute("aria-label", label);
    let current = selected, timer = null, count = 0;
    const shade = () => {
      const c = Math.max(0, Math.min(count - 1, Math.round(col.scrollTop / ROW)));
      for (let i = 0; i < count; i++) { const dist = Math.abs(i - c); col.children[i].style.opacity = dist === 0 ? "1" : dist === 1 ? "0.55" : dist === 2 ? "0.32" : "0.18"; }
      col.setAttribute("aria-valuetext", col.children[c] ? col.children[c].textContent : "");
      return c;
    };
    col.fill = (list) => {
      col.innerHTML = ""; count = list.length;
      list.forEach((t, i) => { const r = el("div", "erow", String(t)); r.addEventListener("click", () => col.scrollTo({ top: i * ROW, behavior: "smooth" })); col.appendChild(r); });
    };
    col.set = (i) => { current = i; col.scrollTop = i * ROW; shade(); };
    col.addEventListener("scroll", () => {
      const c = shade();
      clearTimeout(timer);
      timer = setTimeout(() => { if (c !== current) { current = c; onSelect(c); } }, 140);
    }, { passive: true });
    col.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      col.scrollTo({ top: Math.max(0, Math.min(count - 1, current + (e.key === "ArrowDown" ? 1 : -1))) * ROW, behavior: "smooth" });
    });
    col.fill(labels);
    return col;
  }
  let last = new Date(y, m, d, 12).getTime();
  const emit = () => {
    d = Math.min(d, daysIn(y, m));
    let chosen = new Date(y, m, d, 12);
    if (chosen > today) { chosen = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12); y = chosen.getFullYear(); m = chosen.getMonth(); d = chosen.getDate(); }
    const n = daysIn(y, m);
    if (cols.day.children.length !== n) { const list = []; for (let i = 1; i <= n; i++) list.push(i); cols.day.fill(list); }
    cols.year.set(years.indexOf(y)); cols.month.set(m); cols.day.set(d - 1);
    if (chosen.getTime() === last) return;
    last = chosen.getTime();
    onChange(chosen);
  };
  const dayList = []; for (let i = 1; i <= daysIn(y, m); i++) dayList.push(i);
  const cols = {
    month: wheel(months, m, 1.6, "month", (i) => { m = i; emit(); }),
    day: wheel(dayList, d - 1, 0.8, "day", (i) => { d = i + 1; emit(); }),
    year: wheel(years, years.indexOf(y), 1, "year", (i) => { y = years[i]; emit(); }),
  };
  let order = ["month", "day", "year"];
  try {
    const parts = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long", year: "numeric" }).formatToParts(today).map((p) => p.type).filter((t) => t === "day" || t === "month" || t === "year");
    if (parts.length === 3) order = parts;
  } catch (e) {}
  for (const k of order) box.appendChild(cols[k]);
  // Seated by the page once it stands in the document and has a size to scroll in.
  box.seat = () => { cols.year.set(years.indexOf(y)); cols.month.set(m); cols.day.set(d - 1); };
  return box;
}

function birthdayScreen() {
  let wheels = null;
  enterPage((page) => {
    page.appendChild(setIn(el("div", "eword", "Wantd."), 0.04));
    page.appendChild(cardSpace());
    page.appendChild(setIn(el("h1", "etitle", W.spoilTitle), 0.12));
    page.appendChild(setIn(el("p", "eline", W.spoilLine), 0.20));
    const add = cardBar(W.addBirthday, () => heardScreen());
    wheels = dateWheels((date) => { entry.birthday = date; entry.hasBirthday = true; add.ready(true); });
    page.appendChild(setIn(wheels, 0.26));
    page.appendChild(cardSpace());
    page.appendChild(setIn(add, 0.32));
    // A birthday cannot be required: the door does not wait for it, and
    // walking past leaves her profile's birthday empty.
    const skip = setIn(el("button", "equiet", W.notNow), 0.38); skip.type = "button";
    skip.addEventListener("click", () => { entry.hasBirthday = false; entry.birthday = null; heardScreen(); });
    page.appendChild(skip);
  });
  wheels.seat();
}

function heardScreen() {
  enterPage((page) => {
    page.appendChild(setIn(el("div", "eword", "Wantd."), 0.04));
    page.appendChild(cardSpace(true));
    page.appendChild(setIn(el("h1", "etitle", W.heardTitle), 0.12));
    page.appendChild(setIn(el("p", "eline", W.heardLine), 0.20));
    const list = setIn(el("div", "eheard"), 0.26);
    const where = el("input", "ewhere"); where.type = "text"; where.placeholder = W.where; where.maxLength = 120; where.hidden = true; where.autocomplete = "off"; where.setAttribute("aria-label", W.where);
    where.addEventListener("input", () => { entry.other = where.value; });
    const go = cardBar(W.cont, () => { sendHeard(); readyScreen(); });
    for (const source of HEARD) {
      // TikTok, Instagram, Pinterest: names, never translated.
      const b = el("button", null, W.heard[source] || source); b.type = "button";
      b.addEventListener("click", () => {
        entry.heard = source;
        for (const x of list.children) x.classList.toggle("on", x === b);
        where.hidden = source !== "Somewhere else";
        if (where.hidden) { where.value = ""; entry.other = ""; } else where.focus({ preventScroll: true });
        go.ready(true);
      });
      list.appendChild(b);
    }
    page.appendChild(list);
    page.appendChild(where);
    page.appendChild(cardSpace(true));
    page.appendChild(setIn(go, 0.32));
  });
}

function readyScreen() {
  const page = enterPage((page) => {
    page.appendChild(cardSpace());
    const w = el("div", "ewelcome");
    w.appendChild(el("div", "to", W.welcomeTo));
    w.appendChild(el("div", "mark", "Wantd."));
    page.appendChild(w);
    page.appendChild(cardSpace());
    const err = el("div", "eerror"); err.hidden = true; err.setAttribute("role", "alert"); page.appendChild(err);
    const open = cardBar(W.openMyList, async () => {
      open.ready(false); open.classList.add("ready"); err.hidden = true;
      if (!entry.preview) {
        open.textContent = W.oneMoment;
        let ok = await ensureProfile();
        if (!ok) ok = await ensureProfile();
        if (ok) { try { await writeProfileEdits(); } catch (e) { ok = false; } }
        if (!ok) { open.textContent = W.openMyList; err.textContent = W.connIssue; err.hidden = false; open.ready(true); return; }
        const followed = await followFounder();
        me.profile = Object.assign({ fr: 0, avatarURL: null, emoji: null }, me.profile || {}, { h: entry.handle, n: entry.name.trim(), fg: followed ? 1 : 0 });
        me.newcomer = false;
        markEntering(false);
      }
      // Into the app: the card grows away and her list is there.
      $("wEnter").classList.add("leaving");
      setTimeout(() => {
        const preview = entry.preview;
        closeEntrance();
        if (preview) return;
        if ($("wishes").hidden) go({ tab: "wishes" }); else paint();
        if (window.Friends) window.Friends.onAuth();
        askNextShare();
      }, 560);
    });
    open.ready(true);
    page.appendChild(open);
  }, "ready");
  // Sleeps, as the app: her welcome, the wordmark's ink, then the bar.
  setTimeout(() => page.classList.add("a1"), 300);
  setTimeout(() => page.classList.add("a2"), 900);
  setTimeout(() => page.classList.add("a3"), 2200);
}

// ---------------------------------------------------------------------------
// Sign in, sign out: CloudKit draws Apple's buttons into #ckSignIn and
// #ckSignOut; the identity is the iPhone's.
// ---------------------------------------------------------------------------
function signedIn(identity) {
  me.id = identity && identity.userRecordName;
  me.via = me.id ? (identity.via === "bridge" ? "bridge" : "ck") : null;
  me.loaded = false; me.items = []; me.lists = []; me.profile = null; me.pending = []; me.words = new Map(); me.asking = false; me.newcomer = false;
  if (!entry.preview) closeEntrance();
  paint();
  if (me.id) load();
  // Signed out: her circle does not stay in this browser for the next person.
  else { try { localStorage.removeItem("wantd.circle.v1"); } catch (e) {} }
  if (window.wantdBlocks) window.wantdBlocks.drop();
  if (window.Friends) window.Friends.onAuth();
}
/// The bridge's session as the page's identity, when she came in by Google
/// or email; it wins over a CloudKit session left in this browser.
const bridgeIdentity = () => { const a = window.Account && window.Account.identity(); return a ? { userRecordName: a.id, via: "bridge" } : null; };
function watchAuth() {
  if (DEMO) { signedIn({ userRecordName: FOUNDER }); return; }
  let ck = null;
  window.Account.onChange(() => { const b = bridgeIdentity(); if (b) signedIn(b); else if (me.via === "bridge" || !me.id) signedIn(ck); });
  // A bridge session is hers at once, without waiting for CloudKit JS.
  const b0 = bridgeIdentity();
  if (b0) signedIn(b0);
  const tick = () => {
    const a = window.wantdAuth;
    if (!a || !a.ready) { setTimeout(tick, 200); return; }
    ck = a.identity;
    if (!bridgeIdentity()) signedIn(ck);
    const c = container();
    if (!c) return;
    const loop = () => {
      c.whenUserSignsIn().then((id) => { ck = id; if (!bridgeIdentity()) signedIn(id); loop2(); }).catch(() => {});
    };
    const loop2 = () => { c.whenUserSignsOut().then(() => { ck = null; if (me.via === "ck") signedIn(null); loop(); }).catch(() => {}); };
    if (a.identity) loop2(); else loop();
  };
  tick();
}

// ---------------------------------------------------------------------------
// The doors, as everyone knows them (the Android sheet Agathe validated on
// 9 November 2026): Apple's black button with its logo, Google's own, the
// email one with an envelope, under "Your wishlist, on every device."
// ---------------------------------------------------------------------------
const APPLE_LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>';
const GOOGLE_G = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
const MAIL_ICON = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="4.5" width="16" height="11" rx="2"/><path d="M2.5 6l7.5 5.5L17.5 6"/></svg>';
/// The door of a tab: built once per host, the same three ways in.
function buildDoor(host) {
  host.innerHTML = "";
  host.appendChild(el("h2", "doortitle", W.everyDevice));
  const ways = el("div", "ways");
  const apple = el("button", "way apple"); apple.type = "button"; apple.innerHTML = APPLE_LOGO; apple.appendChild(el("span", null, W.withApple));
  apple.addEventListener("click", () => { const b = $("ckSignIn").querySelector(".apple-auth-button, button, [role=button], div"); if (b) b.click(); });
  ways.appendChild(apple);
  // Google's: the same pill as the others, the official "G", and Google's
  // own button laid over it, unseen, so the click is Google's.
  const google = el("div", "way plain google"); google.innerHTML = GOOGLE_G; google.appendChild(el("span", null, W.withGoogle));
  const gsi = el("div", "gsi"); google.appendChild(gsi);
  ways.appendChild(google);
  const mail = el("button", "way plain"); mail.type = "button"; mail.innerHTML = MAIL_ICON; mail.appendChild(el("span", null, W.withEmail));
  mail.addEventListener("click", () => openEmailDoor());
  ways.appendChild(mail);
  const note = el("p", "doornote"); note.hidden = true; note.setAttribute("role", "alert"); ways.appendChild(note);
  host.appendChild(ways);
  google.classList.add("waiting");
  if (!DEMO) window.Account.googleButton(gsi, (err) => { note.hidden = !err; if (err) note.textContent = err && err.code === "unreachable" ? W.unreachable : W.googleFailed; }).then(() => google.classList.remove("waiting")).catch(() => {});
}

// Her email, then the code (the Android screens of SED-948), on the same
// cobalt card as the entrance; a right code opens her session and the page
// takes it from there (a member straight in, someone new to the entrance).
const looksLikeEmail = (t) => t.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t);
function openEmailDoor() {
  if (entry.open) return;
  Object.assign(entry, { open: true, preview: false, email: "" });
  closeSheet(true);
  const root = $("wEnter");
  root.innerHTML = ""; root.classList.remove("leaving"); root.hidden = false;
  document.body.style.overflow = "hidden";
  emailScreen();
}
function leaveDoor() { closeEntrance(); }
function emailScreen(error) {
  enterPage((page) => {
    page.appendChild(setIn(el("div", "eword", "Wantd."), 0.04));
    page.appendChild(cardSpace());
    page.appendChild(setIn(el("h1", "etitle", W.yourEmail), 0.12));
    page.appendChild(setIn(el("p", "eline", W.emailLine), 0.20));
    const field = setIn(el("div", "efield"), 0.26);
    const input = el("input"); input.type = "email"; input.placeholder = W.emailPrompt; input.value = entry.email || ""; input.maxLength = 200;
    input.autocomplete = "email"; input.autocapitalize = "none"; input.spellcheck = false; input.inputMode = "email"; input.enterKeyHint = "send"; input.setAttribute("aria-label", W.yourEmail);
    field.appendChild(input); field.appendChild(el("div", "rule"));
    page.appendChild(field);
    const err = el("div", "eerror"); err.hidden = !error; err.textContent = error || ""; err.setAttribute("role", "alert"); err.style.marginTop = "18px"; page.appendChild(err);
    page.appendChild(cardSpace());
    let busy = false;
    const go = setIn(cardBar(W.sendCode, async () => {
      const t = input.value.trim();
      if (busy || !looksLikeEmail(t)) return;
      busy = true; go.textContent = W.oneMoment; go.ready(false); go.classList.add("ready"); err.hidden = true;
      try {
        entry.email = t;
        await window.Account.requestCode(t);
        codeScreen();
      } catch (e) {
        busy = false; go.textContent = W.sendCode; go.ready(true);
        err.textContent = e && e.status === 429 ? W.tooMany : e && e.code === "email" ? W.emailBad : W.unreachable; err.hidden = false;
      }
    }), 0.32);
    const sync = () => { const t = input.value.trim(); field.classList.toggle("filled", !!t); go.ready(!busy && looksLikeEmail(t)); };
    input.addEventListener("input", sync);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !go.disabled) { e.preventDefault(); go.click(); } });
    sync();
    page.appendChild(go);
    const back = setIn(el("button", "equiet", W.back), 0.38); back.type = "button"; back.addEventListener("click", leaveDoor); page.appendChild(back);
    if (REGULAR.matches) setTimeout(() => input.focus({ preventScroll: true }), 400);
  });
}
function codeScreen() {
  enterPage((page) => {
    page.appendChild(setIn(el("div", "eword", "Wantd."), 0.04));
    page.appendChild(cardSpace());
    page.appendChild(setIn(el("h1", "etitle", W.inbox), 0.12));
    page.appendChild(setIn(el("p", "eline", W.codeLine(entry.email)), 0.20));
    const field = setIn(el("div", "efield"), 0.26);
    const input = el("input"); input.type = "text"; input.placeholder = W.codePrompt; input.maxLength = 6; input.className = "ecode";
    input.autocomplete = "one-time-code"; input.inputMode = "numeric"; input.pattern = "[0-9]*"; input.setAttribute("aria-label", W.codePrompt);
    field.appendChild(input); field.appendChild(el("div", "rule"));
    page.appendChild(field);
    const err = el("div", "eerror"); err.hidden = true; err.setAttribute("role", "alert"); err.style.marginTop = "18px"; page.appendChild(err);
    page.appendChild(cardSpace());
    let busy = false;
    // Six digits typed: checked at once, nothing to press.
    const verify = async () => {
      const code = input.value.replace(/\D/g, "");
      if (busy || code.length !== 6) return;
      busy = true; err.hidden = true; again.textContent = W.oneMoment;
      try {
        await window.Account.verifyCode(entry.email, code);
        // Her session is open: the page signs her in (watchAuth), the card goes.
        leaveDoor();
      } catch (e) {
        busy = false; again.textContent = W.codeAgain;
        err.textContent = e && e.detail === "code_expired" ? W.codeExpired : e && e.detail === "code_wrong" ? W.codeWrong : e && e.code === "unreachable" ? W.unreachable : W.codeWrong;
        err.hidden = false; input.value = ""; input.focus();
      }
    };
    input.addEventListener("input", () => { input.value = input.value.replace(/\D/g, "").slice(0, 6); field.classList.toggle("filled", !!input.value); if (input.value.length === 6) verify(); });
    const words = setIn(el("div", "ewords"), 0.32);
    const again = el("button", "equiet"); again.type = "button"; again.textContent = W.codeAgain;
    again.addEventListener("click", async () => {
      if (busy) return;
      busy = true; again.textContent = W.oneMoment; err.hidden = true;
      try { await window.Account.requestCode(entry.email); } catch (e) { err.textContent = e && e.status === 429 ? W.tooMany : W.unreachable; err.hidden = false; }
      busy = false; again.textContent = W.codeAgain;
    });
    const other = el("button", "equiet"); other.type = "button"; other.textContent = W.otherEmail; other.addEventListener("click", () => emailScreen());
    words.appendChild(again); words.appendChild(other);
    page.appendChild(words);
    setTimeout(() => input.focus({ preventScroll: true }), 400);
  });
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
  // The Friends tab needs the same member: signed in here, once, for both.
  wake() { if (!wired) { wired = true; wireControls(); watchAuth(); } },
  ownActions,
  isMine: (it) => !!me.id && it.o === me.id && !DEMO,
  kit: { el, $, f, bar, quietLine, labeled, textInput, capsuleField, openSheet, closeSheet, queryAll, db, me: () => me, W, DEMO, viaBridge, buildDoor,
         listFromRecord, itemFromRecord, makeWallWith, lockIcon, peopleIcon, saveCopy, deletePiece, alert: alertBox, avatar: avatarNode },
};
REGULAR.addEventListener("change", () => { if (me.id) paint(); });
// A local try walks the entrance without writing anything (the app's
// --preview-onboarding): /feed/?tab=wishes&preview=enter
if (LOCAL && new URLSearchParams(location.search).get("preview") === "enter") openEntrance(true);
// The page may have opened on this tab before this script was read.
if (!document.getElementById("wishes").hidden) window.Wishes.enter();
})();
