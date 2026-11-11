// The Wishlist tab of Wantd on the web (SED-942): her own lists and pieces,
// read and written in CloudKit as the member herself (CloudKit JS, the same
// identity as the iPhone's), screen for screen as the Mac's HomeView.
// Loaded after the feed page's own script and built on its words and walls.
(function () {
"use strict";

// The words, as the app says them (Localizable.xcstrings).
const W = words("W", {
  founder: "Founder",
  share: "Share", copied: "Link copied", shareText: "Here is my WANTD wishlist", shareTitle: (n) => `${n}'s WANTD`,
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
  deleteAsk: "Delete this want?", deleteBody: "It will leave your wishlist for good.", unwantAsk: "Unwant this?", unwantBody: "It leaves your wishlist, and your want mark comes off everywhere.",
  inWhichLists: "In which lists?", tapToAddRemove: "Tap to add or remove", wishGranted: "Wish granted", grantedUndo: "Wish granted. Tap to undo", wasGift: "Was it a gift?", yesGift: "Yes, a gift", noTreat: "No, I couldn't resist",
  leaveList: "Leave this list", deleteWithWants: "Delete with its wants", deleteListAsk: (n) => `Delete ${n}?`, deleteListBody: "A want that also lives on another list stays there either way.",
  choosePhoto: "Choose photo",
  offersYou: (from, amount) => `${from} offers you ${amount}.`, choosePiece: " Choose a piece.", chooseLine: "Choose the piece it becomes. They will see your choice and shop it themselves.",
  promiseCovers: (a, b) => `Their promise covers ${a} of ${b}.`, chooseThisOne: "Choose this one?", chooseIt: "Choose it", willSee: (from) => `${from} will see the piece you chose and give it to you.`,
  declinePromise: "Decline this promise", declinePromiseAsk: "Decline this promise?", decline: "Decline", leavesUntold: (from) => `It leaves your wishlist. ${from} will not be told.`,
  didNotGo: "That did not go through", checkConn: "Check your connection and try again.", ok: "OK",
  yourBudget: "Your budget", reset: "Reset", done: "Done", shop: "Shop", lists: "Lists", privateList: "Private list", deleteList: "Delete this list",
  deleteListKeep: "Delete, keep its wants",
  editProfile: "Edit profile", useInitial: "Use initial", nameLabel: "Name", username: "Username", usernamePrompt: "yourname",
  handleHint: "Your public handle. Friends use it to find you.", handleInvalid: "2 to 15 letters or numbers.", handleChecking: "Checking availability…",
  handleAvailable: (h) => `@wtd-${h} is available.`, handleTaken: "Already taken. Try another.", handleOffline: "Can't check right now. Check your connection.",
  pricesIn: "Prices in", legal: "Legal", saving: "Saving…",
  signOut: "Sign out", privacy: "Privacy Policy", terms: "Terms of Service", commission: "Shop links may earn Wantd a commission, at no cost to you.",
  shareAsk: (who, list) => `${who} wants to share the ${list} list with you.`, aMember: "A member", yes: "Yes", no: "No",
  callYou: "What should we call you?", nameLine: "The name your circle will read on your list.", yourName: "Your name", thatsMe: "That's me",
  spoilTitle: "The day to spoil you.", spoilLine: "Add your birthday, so your circle never has to ask.", addBirthday: "Add my birthday", notNow: "Not now",
  heardTitle: "How did you hear about us?", heardLine: "I make Wantd on my own. Knowing where you came from helps.",
  heardFriend: "A friend told me", heardStore: "The App Store", heardElse: "Somewhere else", where: "Where?", cont: "Continue",
  welcomeTo: "Welcome to", openMyList: "Open my list", connIssue: "Connection issue. Try again in a moment.", oneMoment: "One moment...",
  everyDevice: "Your wishlist, on every device.", withApple: "Continue with Apple", withGoogle: "Continue with Google", withEmail: "Continue with email",
  yourEmail: "Your email.", emailLine: "We'll send you a six-digit code. No password, ever.", emailPrompt: "you@example.com", sendCode: "Send me the code",
  inbox: "Check your inbox.", codeLine: (e) => `The code we sent to ${e}. It works for 10 minutes.`, codePrompt: "6 digits", codeAgain: "Send another code", otherEmail: "Another email", back: "Back",
  codeWrong: "That's not the code. Try again.", codeExpired: "This code has expired. Send another one.", emailBad: "That doesn't look like an email address.", tooMany: "Too many codes asked. Wait a quarter of an hour.",
  unreachable: "Couldn't reach Wantd. Check your connection and try again.", googleFailed: "Google didn't let you in this time. Try again.",
});

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
  extras: {},          // listID -> the co-members' pieces of a list kept with others (WishlistStore.sharedListExtras)
  pledges: [],         // promises made on her list (SED-611): { recordName, token, fromName, amount, currencyCode, status }
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
    nc: v(r, "netContent") || undefined, ncf: v(r, "netContentFor") || undefined,
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

/// The piece as the bridge wants it whole: its PUT writes the price and
/// the picture every time (an absent one clears them) and asks the name, so
/// an edit sends the piece as it stands with the change on top.
function bridgeBody(it, changes) {
  const body = { name: it.n || "", urlString: it.u || "", addedAt: it.at || Date.now(), sortIndex: typeof it.si === "number" ? it.si : 0,
    imageURLString: it.op ? null : (it.i || null), priceText: it.pt || null };
  if (it.s) body.store = it.s;
  if (it.b) body.brand = it.b;
  if (typeof it.pa === "number") { body.priceAmount = it.pa; body.priceCurrency = it.pc || null; }
  if ((it.l || []).length) body.listIDs = it.l;
  if (it.note) body.personalNote = it.note;
  if ((it.ic || []).length) body.imageCandidateURLs = it.ic.slice(0, 20);
  if (it.rf) body.rewantedFrom = it.rf;
  return Object.assign(body, changes || {});
}
/// Every piece filed on a list, whoever wrote it (fetchItems(inList:)).
async function itemsInList(listID) {
  const rows = await queryAll({ recordType: "Item", filterBy: [{ fieldName: "listIDs", comparator: "LIST_CONTAINS", fieldValue: { value: listID } }] },
    { resultsLimit: 200, desiredKeys: ["name", "brand", "store", "priceText", "priceAmount", "priceCurrency", "urlString", "status", "addedAt", "sortIndex", "reservedBy", "listIDs", "personalNote", "alsoWantedBy", "imageCandidateURLs", "imageURLString", "ownerID", "rewantedFrom", "ownPhoto", "imageAsset", "netContent", "netContentFor"] });
  return rows.map(itemFromRecord);
}
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
        const [mine, w, m, pl] = await Promise.all([Bridge().mine(), Bridge().words().catch(() => null), getJSON("/member?owner=" + encodeURIComponent(me.id)).catch(() => null), Bridge().pledges().catch(() => [])]);
        items = mine.items; lists = mine.lists; sharedLists = mine.shared; words = w; member = m;
        profilesRead = mine.profile ? [mine.profile] : [];
        me.pledges = pl;
      } else {
        const [itemsR, mineR, sharedR, profR, m, wordsR] = await Promise.all([
          queryAll({ recordType: "Item", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] },
                   { resultsLimit: 200, desiredKeys: ["name", "brand", "store", "priceText", "priceAmount", "priceCurrency", "urlString", "status", "addedAt", "sortIndex", "reservedBy", "listIDs", "personalNote", "alsoWantedBy", "imageCandidateURLs", "imageURLString", "ownerID", "rewantedFrom", "ownPhoto", "imageAsset", "netContent", "netContentFor"] }),
          queryAll({ recordType: "List", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] }, { resultsLimit: 200 }),
          queryAll({ recordType: "List", filterBy: [{ fieldName: "memberIDs", comparator: "LIST_CONTAINS", fieldValue: { value: me.id } }] }, { resultsLimit: 200 }).catch(() => []),
          // null when the read failed: a profile that could not be read is not
          // "she has none" (ensureProfileOnce), and nobody is walked in on it.
          queryAll({ recordType: "Profile", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] }, { resultsLimit: 5 }).catch(() => null),
          getJSON("/member?owner=" + encodeURIComponent(me.id)).catch(() => null),
          queryAll({ recordType: "ListMembership", filterBy: [{ fieldName: "memberID", comparator: "EQUALS", fieldValue: { value: me.id } }] }, { resultsLimit: 200 }).catch(() => null),
        ]);
        items = itemsR.map(itemFromRecord); lists = mineR.map(listFromRecord); sharedLists = sharedR.map(listFromRecord); member = m;
        // The promises made on her list (fetchMyPledges): a giver named an
        // amount, she picks the piece it becomes.
        me.pledges = (await queryAll({ recordType: "GiftPledge", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: me.id } }] },
          { resultsLimit: 50, desiredKeys: ["token", "fromName", "amount", "currencyCode", "status"] }).catch(() => []))
          .map((r) => ({ recordName: r.recordName, token: v(r, "token"), fromName: v(r, "fromName"), amount: v(r, "amount"), currencyCode: v(r, "currencyCode") || "EUR", status: v(r, "status") || "offered" }))
          .filter((p) => p.token && p.fromName && typeof p.amount === "number");
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
          return { b: (x.birthday && x.birthday.value) || null, h: (x.handle && x.handle.value) || "", n: (x.displayName && x.displayName.value) || "", avatarURL: asset ? String(asset).replace("${f}", "avatar.jpg") : null, emoji: (x.avatarEmoji && x.avatarEmoji.value) || null };
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
      // A co-owned tab shows the WHOLE list (HomeView): the co-members' pieces
      // come beside hers, never pushed, deduplicated nor deleted by her.
      me.extras = {};
      await Promise.all(me.lists.filter((l) => (l.memberIDs || []).length).map(async (l) => {
        try {
          const found = viaBridge() ? await Bridge().listItems(l.creatorID, l.id) : await itemsInList(l.id);
          me.extras[l.id] = found.filter((it) => it.n && it.o && it.o !== me.id).map((it) => Object.assign(it, { _visited: true }));
        } catch (e) { console.log("shared list pieces", e); }
      }));
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
        avatarURL: (p && p.avatarURL) || null, emoji: (p && p.emoji) || null, b: (p && p.b) || null,
      };
    }
    me.loaded = true;
  } catch (e) {
    me.error = String(e && (e.message || e)); console.log("wishes load failed", e);
  }
  me.loading = false;
  paint();
  if (window.riverRefresh) window.riverRefresh();
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
    if (me.listID) list = list.filter((it) => (it.l || []).includes(me.listID)).concat(me.extras[me.listID] || []);
  }
  if (me.budget) {
    // Items without a known price are kept (ContentView.filtered(budgetRange:)).
    const [lo, hi] = me.budget;
    list = list.filter((it) => { const a = viewerAmount(it); return a == null ? true : a >= lo && a <= hi; });
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

/// This browser's own handle, for the /@ pages: the link of her wishlist
/// opens her Wishlist here, someone else's opens that member in Friends.
const ME_HANDLE = "wantd.me.handle";
function rememberHandle() {
  if (DEMO) return;
  try {
    if (me.id && me.profile && me.profile.h) localStorage.setItem(ME_HANDLE, me.profile.h.toLowerCase());
    else if (!me.id) localStorage.removeItem(ME_HANDLE);
  } catch (e) {}
}
function paint() {
  const sec = $("wishes");
  const signedIn = !!me.id;
  rememberHandle();
  if (window.prettify) window.prettify();
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
  // The promise line (SED-611), museum grammar: one sentence, the act underlined.
  const pl = $("wPledges"); pl.innerHTML = "";
  for (const p of me.pledges.filter((x) => x.status === "offered")) {
    const b = el("button", "wpledge"); b.type = "button";
    b.appendChild(document.createTextNode(W.offersYou(p.fromName, money(p.amount, p.currencyCode))));
    b.appendChild(el("span", "act", W.choosePiece));
    b.addEventListener("click", () => openPledgeChoose(p));
    pl.appendChild(b);
  }
  pl.hidden = !pl.childElementCount;
  paintWall();
}

/// A promise's conversion into the viewer's money, as CurrencyService does it.
function viewerMoney(amount, code) {
  const cur = String(code || "").toUpperCase();
  if (VIEWER && cur !== VIEWER && rates && rates[cur] > 0 && rates[VIEWER]) return amount / rates[cur] * rates[VIEWER];
  return amount;
}
/// She picks the piece a promise becomes (PledgeChooseSheet): hers, not had,
/// on a public list or none, priced within the promise plus 15 percent (a
/// price unknown stays choosable); a dearer piece shows the gap, with sobriety.
function openPledgeChoose(p) {
  const promise = money(p.amount, p.currencyCode);
  const ceiling = viewerMoney(p.amount, p.currencyCode) * 1.15;
  const privateIDs = new Set(me.lists.filter((l) => l.isPrivate).map((l) => l.id));
  const choosable = me.items.filter((it) => {
    if (isHad(it)) return false;
    if ((it.l || []).length && (it.l || []).every((id) => privateIDs.has(id))) return false;
    const mine = viewerAmount(it);
    return mine == null ? true : mine <= ceiling;
  });
  openSheet((panel) => {
    const head = el("div", "whead left");
    head.appendChild(el("h2", "wtitle", W.offersYou(p.fromName, promise)));
    head.appendChild(el("p", "wsub", W.chooseLine));
    // The way out, one underlined line as the app says it (SED-976): the
    // promise leaves her list, the giver is not told.
    const out = el("button", "wsubact", W.declinePromise); out.type = "button";
    out.addEventListener("click", () => {
      alertBox(W.declinePromiseAsk, W.leavesUntold(p.fromName), W.decline, async () => {
        let ok = false;
        try {
          if (viaBridge()) { await Bridge().dismissPledge(p.token); ok = true; }
          else { const res = await fetch(API + "/pledge-dismiss", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: p.token }) }); const j = await res.json(); ok = res.ok && j.ok === true; }
        } catch (e) { ok = false; }
        if (!ok) throw new Error(W.didNotGo + " " + W.checkConn);
        p.status = "dismissed"; closeSheet(); paint();
      });
    });
    head.appendChild(out);
    panel.appendChild(head);
    const list = el("div", "wpledgelist"); panel.appendChild(list);
    for (const it of choosable) {
      const row = el("button", "wpledgerow"); row.type = "button";
      const ph = el("div", "wthumbbox"); const srcs = photoSources(it);
      if (srcs.length) { const img = el("img"); img.alt = ""; img.referrerPolicy = "no-referrer"; let k = 0; img.onerror = () => { k += 1; if (k < srcs.length) img.src = srcs[k]; else img.remove(); }; img.src = srcs[0]; ph.appendChild(img); }
      row.appendChild(ph);
      const txt = el("div", "wpledgetxt"); txt.appendChild(el("div", "name", it.n || ""));
      const price = priceOf(it); if (price) txt.appendChild(el("div", "num price", price));
      const mine = viewerAmount(it), promised = viewerMoney(p.amount, p.currencyCode);
      if (mine != null && mine > promised + 0.01 && price) txt.appendChild(el("div", "gap", W.promiseCovers(promise, price)));
      row.appendChild(txt);
      row.addEventListener("click", () => {
        alertBox(W.chooseThisOne, W.willSee(p.fromName), W.chooseIt, async () => {
          let ok = false;
          try {
            if (viaBridge()) { await Bridge().choosePledge(p.token, it.id); ok = true; }
            else { const res = await fetch(API + "/pledge-choose", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: p.token, itemID: it.id }) }); const j = await res.json(); ok = res.ok && j.ok === true; }
          } catch (e) { ok = false; }
          if (!ok) throw new Error(W.didNotGo + " " + W.checkConn);
          p.status = "chosen"; closeSheet(); paint();
        });
      });
      list.appendChild(row);
    }
  });
}
function paintTabs() { paint(); }

/// Her own order, by hand (WishlistStore.move): the dragged piece takes the
/// place of the one it lands on, and the whole order is numbered again;
/// only the pieces whose number changed are written.
async function movePiece(draggedID, targetID) {
  if (draggedID === targetID) return;
  const ordered = me.items.slice().sort((a, b) => a.si - b.si || b.at - a.at);
  const from = ordered.findIndex((x) => x.id === draggedID); if (from < 0) return;
  const [moved] = ordered.splice(from, 1);
  const at = ordered.findIndex((x) => x.id === targetID); if (at < 0) return;
  ordered.splice(at, 0, moved);
  const changed = [];
  ordered.forEach((x, i) => { if (x.si !== i) { x.si = i; changed.push(x); } });
  paint();
  try {
    if (viaBridge()) { for (const x of changed) await Bridge().saveItem(x.id, bridgeBody(x, { sortIndex: x.si })); }
    else for (let i = 0; i < changed.length; i += 50) {
      const recs = changed.slice(i, i + 50).map((x) => ({ recordType: "Item", recordName: x.id, recordChangeTag: x._tag, fields: { sortIndex: f(x.si, "DOUBLE") } }));
      const res = await db().saveRecords(recs);
      if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode).join(", "));
      for (const r of res.records) { const x = me.items.find((y) => y.id === r.recordName); if (x) x._tag = r.recordChangeTag; }
    }
  } catch (e) { console.log("reorder failed", e); load(); }
}
/// The gesture: on a computer the card is dragged; on a phone a long press
/// lifts it, then it follows the finger. Only in her own order.
function wireReorder(host) {
  if (DEMO || me.sort !== "manual" || me.shelf) return;
  const cards = [...host.querySelectorAll(".card")].filter((c) => me.items.some((x) => x.id === c.dataset.id && x.o === me.id));
  for (const c of cards) {
    c.draggable = true;
    c.addEventListener("dragstart", (e) => { c.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", c.dataset.id); });
    c.addEventListener("dragend", () => { c.classList.remove("dragging"); host.querySelectorAll(".dropat").forEach((x) => x.classList.remove("dropat")); });
    c.addEventListener("dragover", (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (!c.classList.contains("dragging")) c.classList.add("dropat"); });
    c.addEventListener("dragleave", () => c.classList.remove("dropat"));
    c.addEventListener("drop", (e) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); c.classList.remove("dropat"); if (id) movePiece(id, c.dataset.id); });
    // The phone: a long press, then the finger.
    let timer = null, lifted = false, ghost = null;
    const end = () => { clearTimeout(timer); if (ghost) { ghost.remove(); ghost = null; } c.classList.remove("dragging"); host.querySelectorAll(".dropat").forEach((x) => x.classList.remove("dropat")); lifted = false; };
    c.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      timer = setTimeout(() => { lifted = true; c.classList.add("dragging"); ghost = c.cloneNode(true); ghost.style.cssText = "position:fixed;pointer-events:none;width:" + c.offsetWidth + "px;opacity:0.9;z-index:70;left:0;top:0"; document.body.appendChild(ghost); }, 350);
    }, { passive: true });
    c.addEventListener("touchmove", (e) => {
      if (!lifted) { clearTimeout(timer); return; }
      e.preventDefault();
      const t = e.touches[0];
      ghost.style.transform = `translate(${t.clientX - c.offsetWidth / 2}px, ${t.clientY - 40}px)`;
      const under = document.elementFromPoint(t.clientX, t.clientY); const over = under && under.closest(".card");
      host.querySelectorAll(".dropat").forEach((x) => { if (x !== over) x.classList.remove("dropat"); });
      if (over && over !== c) over.classList.add("dropat");
    }, { passive: false });
    c.addEventListener("touchend", (e) => {
      if (lifted) { const t = e.changedTouches[0]; const under = document.elementFromPoint(t.clientX, t.clientY); const over = under && under.closest(".card"); if (over && over !== c) movePiece(c.dataset.id, over.dataset.id); }
      end();
    });
    c.addEventListener("touchcancel", end);
  }
}
/// Her wishlist, passed on as the app does (SharePreviewSheet): the link of
/// her page, or of the list on screen when it is public and not the main one.
async function shareMine() {
  const h = me.profile && me.profile.h;
  if (!h) return;
  const l = me.listID && me.lists.find((x) => x.id === me.listID && !x.isMain && !x.isPrivate);
  const url = "https://wantd.sedonatech.uk/@" + h.toLowerCase() + (l ? "?list=" + String(l.id).toLowerCase() : "");
  const name = (me.profile && me.profile.n) || h;
  if (navigator.share && matchMedia("(pointer: coarse)").matches) {
    try { await navigator.share({ title: W.shareTitle(name), text: W.shareText, url }); } catch (e) {}
    return;
  }
  try { await navigator.clipboard.writeText(url); } catch (e) { return; }
  const c = $("wCopied"); c.textContent = W.copied; c.hidden = false;
  clearTimeout(shareMine.t); shareMine.t = setTimeout(() => { c.hidden = true; }, 1800);
}
let wallKey = "";
function paintWall() {
  const host = $("wWall"), state = $("wState");
  const list = shown();
  // The same picture as last time stays as it is: no card is torn down to
  // be rebuilt (every photo would blink on each return to the tab).
  const key = JSON.stringify([me.loading && !me.loaded, me.error || "", me.shelf, me.listID, REGULAR.matches && me.perRow,
    list.map((it) => [it.id, it.st, it.n, it.pt, it.i, it.ia, it.rb, it.note ? 1 : 0, it.gift ? 1 : 0, it.l, wantedCount(it)])]);
  if (key === wallKey && host.childElementCount) return;
  wallKey = key;
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
  wireReorder(host);
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
  holdPage(true);
  sheetOpen = true;
  const first = panel.querySelector("input, textarea, button");
  if (first && !REGULAR.matches) {} else if (first) first.focus({ preventScroll: true });
}
function closeSheet(now) {
  const root = $("wSheet");
  if (!sheetOpen) { if (now) root.classList.remove("on", "in"); return; }
  sheetOpen = false;
  root.classList.remove("in");
  holdPage(false);
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
  // A photo of her own: chosen from her device, kept at 1 600 px at most,
  // as the app keeps a camera-roll picture (ImageDownsampler, 1 600).
  const pick = el("button", "wchip soft wpick", W.choosePhoto); pick.type = "button";
  const file = el("input"); file.type = "file"; file.accept = "image/*"; file.hidden = true;
  file.addEventListener("change", async () => {
    const chosen = file.files && file.files[0]; if (!chosen) return;
    try {
      const blob = await downsample(chosen, 1600);
      draft.photo = blob; draft.picked = false;
      const url = URL.createObjectURL(blob);
      let img = photo.querySelector("img");
      if (!img) { img = el("img"); img.alt = ""; photo.appendChild(img); }
      img.onerror = null; img.src = url;
      card.querySelectorAll(".wthumb").forEach((x) => x.classList.remove("on"));
    } catch (e) { console.log("photo", e); }
  });
  pick.addEventListener("click", () => file.click());
  card.appendChild(pick); card.appendChild(file);
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
    return { n: name.value.trim(), s: store.value.trim(), pa: Number.isFinite(pa) && a ? pa : null, pc: cur.value || null, note: note.value.trim(), i: draft.i, ic: draft.ic || [], picked: !!draft.picked, photo: draft.photo || null };
  };
  return card;
}

/// A picture read from a file, drawn no larger than `max` on its long side,
/// as a JPEG of fair weight.
function downsample(file, max) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("photo"))), "image/jpeg", 0.86);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("photo")); };
    img.src = url;
  });
}
const blobBase64 = (blob) => new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result).split(",")[1]); r.onerror = reject; r.readAsDataURL(blob); });

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
    let draft = null, card = null, selected = new Set(me.listID && me.lists.some((l) => l.id === me.listID) ? [me.listID] : []), reading = false;
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
      // A page the reader cannot open is still a want (the app's blocked
      // shops): she writes the name and the price, and gives her own photo.
      if (!read) read = { url: t, blocked: true, images: [] };
      draft = { n: read.name || "", s: read.store || "", b: read.brand || undefined, pa: typeof read.priceAmount === "number" ? read.priceAmount : undefined, pc: read.priceCurrency || undefined,
                u: read.url || t, i: (read.images || [])[0], ic: read.images || [], blocked: !!read.blocked, storefront: !!read.storefront || looksLikeStorefront(read.url || t) };
      const already = me.items.some((it) => it.u && urlKey(it.u) === urlKey(draft.u));
      card = editableCard(draft, { already });
      const wrap = el("div");
      if (draft.blocked) wrap.appendChild(el("div", "wnote", W.cantRead));
      wrap.appendChild(card);
      let sel = null;
      const renew = () => { const n = listSelector(selected, () => newListInline(n, async (created) => { selected.add(created.id); const next = renew(); n.replaceWith(next); })); return n; };
      sel = renew();
      wrap.appendChild(sel);
      setState(wrap);
      const notes = el("div", "wnote"); foot.appendChild(notes);
      const add = bar(already ? W.addAnyway : W.addToWishlist, async () => {
        const read2 = card.read();
        if (!read2.n) { card.querySelector("textarea").focus(); return; }
        if (draft.storefront) { notes.textContent = W.storefront; return; }
        if (!read2.i && !read2.photo) { notes.textContent = W.noPhoto; return; }
        add.disabled = true; add.textContent = "…";
        try { await savePiece(Object.assign({}, draft, read2), selected); closeSheet(); }
        catch (e) { add.disabled = false; add.textContent = already ? W.addAnyway : W.addToWishlist; notes.textContent = String(e && (e.message || e)); }
      });
      if (draft.storefront) notes.textContent = W.storefront; else if (!draft.i && !draft.photo) notes.textContent = W.noPhoto;
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
    if (d.photo) { body.imageJpegBase64 = await blobBase64(d.photo); body.imageURLString = null; }
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
  if (d.photo) { fields.imageAsset = { value: d.photo }; fields.ownPhoto = f(1, "INT64"); fields.imageURLString = f(null, "STRING"); }
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
    const changes = {};
    for (const k of Object.keys(fields)) changes[k] = fields[k].value;
    if ("priceAmount" in changes && changes.priceAmount === null) changes.priceEditedByHand = true;
    if ("personalNote" in changes && changes.personalNote === null) changes.personalNote = "";
    fresh = await Bridge().saveItem(it.id, bridgeBody(it, changes));
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
    // A list someone shared with her: she walks out of it (leaveList); nothing
    // is deleted for the others, her own pieces come back to her main list.
    if (existing && existing.creatorID !== me.id) {
      foot.appendChild(quietLine(W.leaveList, async () => {
        try {
          const main = me.lists.find((l) => l.isMain && l.creatorID === me.id);
          for (const x of me.items.filter((y) => y.o === me.id && (y.l || []).includes(existing.id))) {
            let ids = (x.l || []).filter((id) => id !== existing.id);
            if (!ids.length && main) ids = [main.id];
            if (viaBridge()) { const fresh = await Bridge().saveItem(x.id, bridgeBody(x, { listIDs: ids })); x.l = fresh.l; }
            else {
              const r1 = await db().saveRecords([{ recordType: "Item", recordName: x.id, recordChangeTag: x._tag, fields: { listIDs: f(ids, "STRING_LIST") } }]);
              if (r1.hasErrors) throw new Error(r1.errors.map((e) => e.ckErrorCode).join(", "));
              x._tag = r1.records[0].recordChangeTag; x.l = ids;
            }
          }
          await sayToList(existing, "left");
          me.lists = me.lists.filter((x) => x.id !== existing.id); delete me.extras[existing.id];
          if (me.listID === existing.id) me.listID = null;
          paint(); closeSheet();
        } catch (e) { err.textContent = String(e && (e.message || e)); }
      }, true));
    }
    if (existing && !existing.isMain && existing.creatorID === me.id) {
      // Delete with its wants: only wants living exclusively on this list go
      // (Agathe, 2026-08-28), one also filed elsewhere merely leaves it.
      foot.appendChild(quietLine(W.deleteWithWants, () => {
        alertBox(W.deleteListAsk(existing.name), W.deleteListBody, W.delete, async () => {
          const doomed = me.items.filter((x) => x.o === me.id && (x.l || []).includes(existing.id) && (x.l || []).length === 1);
          for (const x of doomed) await deletePiece(x);
          await removeList(existing);
          closeSheet();
        });
      }, true));
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
              const fresh = await Bridge().saveItem(x.id, bridgeBody(x, { listIDs: ids }));
              x.l = fresh.l;
            }
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
          await removeList(existing);
          closeSheet();
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
/// The list's own record goes, after its pieces were seen to (deleteList).
async function removeList(existing) {
  if (viaBridge()) await Bridge().deleteList(existing.id);
  else {
    const res = await db().deleteRecords([{ recordName: existing.recordName, recordChangeTag: existing._tag }]);
    if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode).join(", "));
  }
  me.lists = me.lists.filter((x) => x.id !== existing.id);
  if (me.listID === existing.id) me.listID = null;
  paint();
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
  alertBox(it.rf ? W.unwantAsk : W.deleteAsk, it.rf ? W.unwantBody : W.deleteBody, it.rf ? W.unwant : W.delete, async () => { await deletePiece(it); closePiece(); });
}

/// In which lists (ListPickerSheet): tap to add or remove, a new list
/// inline; a piece left with no list goes back to the main one (toggleList).
function openListsSheet(it) {
  openSheet((panel) => {
    const head = el("div", "whead"); head.appendChild(el("h2", "wtitle", W.inWhichLists)); head.appendChild(el("p", "wsub", W.tapToAddRemove)); panel.appendChild(head);
    const box = el("div", "wlistsel"); const row = el("div", "wchips"); box.appendChild(row); panel.appendChild(box);
    const err = el("div", "wnote"); panel.appendChild(err);
    let busy = false;
    const write = async (ids) => {
      const main = me.lists.find((l) => l.isMain && l.creatorID === me.id);
      if (!ids.length && main) ids = [main.id];
      const open = ids.some((id) => { const l = me.lists.find((y) => y.id === id); return l && !l.isPrivate; });
      if (viaBridge()) { const fresh = await Bridge().saveItem(it.id, bridgeBody(it, { listIDs: ids })); it.l = fresh.l; }
      else {
        const res = await db().saveRecords([{ recordType: "Item", recordName: it.id, recordChangeTag: it._tag, fields: { listIDs: f(ids, "STRING_LIST"), isPublic: f(open ? 1 : 0, "INT64") } }]);
        if (res.hasErrors) throw new Error(res.errors.map((e) => e.ckErrorCode).join(", "));
        it._tag = res.records[0].recordChangeTag; it.l = ids;
      }
      paint();
    };
    const draw = () => {
      row.innerHTML = "";
      const lists = me.lists.filter((l) => !l.isMain);
      lists.forEach((l, i) => {
        if (i) row.appendChild(el("span", "wdot", "·"));
        const on = (it.l || []).includes(l.id);
        const b = el("button", "wchip" + (on ? " on" : "")); b.type = "button";
        if (l.isPrivate) b.appendChild(lockIcon());
        b.appendChild(el("span", null, l.name));
        b.addEventListener("click", async () => {
          if (busy) return; busy = true; err.textContent = "";
          const ids = on ? (it.l || []).filter((id) => id !== l.id) : (it.l || []).concat([l.id]);
          try { await write(ids); } catch (e) { err.textContent = String(e && (e.message || e)); }
          busy = false; draw();
        });
        row.appendChild(b);
      });
      if (lists.length) row.appendChild(el("span", "wdot", "·"));
      const nb = el("button", "wchip soft", W.newList); nb.type = "button";
      nb.addEventListener("click", () => newListInline(box, async (created) => { await write((it.l || []).concat([created.id])).catch((e) => { err.textContent = String(e && (e.message || e)); }); draw(); }));
      row.appendChild(nb);
    };
    draw();
    const foot = el("div", "wfoot"); foot.appendChild(bar(W.done, () => closeSheet())); panel.appendChild(foot);
  });
}

/// A new list made where she stands, under the chips, without leaving the
/// sheet she is in (the app stacks its sheet; the web has one panel).
function newListInline(host, onCreated) {
  if (host.querySelector(".wnewlist")) return;
  const box = el("div", "wnewlist");
  const name = textInput("", W.nameIt, { caps: "words" }); name.className = "wbig";
  let isPrivate = false;
  const priv = quietLine(W.visible, () => { isPrivate = !isPrivate; priv.textContent = isPrivate ? W.privateOnlyYou : W.visible; priv.classList.toggle("cobalt", isPrivate); }, true);
  const err = el("div", "wnote");
  const go = bar(W.create, async () => {
    const n = name.value.trim(); if (!n) { name.focus(); return; }
    go.disabled = true;
    try { const l = await saveList({ name: n, isMain: false, isPrivate }); box.remove(); await onCreated(l); }
    catch (e) { go.disabled = false; err.textContent = String(e && (e.message || e)); }
  });
  box.appendChild(name); box.appendChild(priv); box.appendChild(err); box.appendChild(go);
  host.appendChild(box);
  setTimeout(() => name.focus({ preventScroll: true }), 50);
}

/// Wish granted (SED-892), after one question: a gift, or she could not
/// resist; taking it back asks nothing (markReceived).
async function setGranted(it, how) {
  const on = !!how;
  if (viaBridge()) { await Bridge().received(it.id, on); }
  else {
    const res = await db().fetchRecords([{ recordName: it.id }], { desiredKeys: ["status", "reservedBy", "reservedNote"] });
    const r = res.records && res.records[0]; if (!r || !r.fields) throw new Error("read");
    const previous = r.fields.reservedBy && r.fields.reservedBy.value;
    const fields = { status: f(on ? "purchased" : "available", "STRING"), reservedBy: f(on ? me.id : null, "STRING"), grantedHow: f(on ? how : null, "STRING"),
      receivedFrom: f(on && previous && previous !== me.id ? previous : null, "STRING") };
    if (on) fields.reservedNote = f(null, "STRING");
    const out = await db().saveRecords([{ recordType: "Item", recordName: it.id, recordChangeTag: r.recordChangeTag, fields }]);
    if (out.hasErrors) throw new Error(out.errors.map((e) => e.ckErrorCode).join(", "));
    it._tag = out.records[0].recordChangeTag;
  }
  it.st = on ? "purchased" : "available"; it.rb = on ? me.id : undefined;
  paint();
}
function askGranted(it) {
  openSheet((panel) => {
    const head = el("div", "whead"); head.appendChild(el("h2", "wtitle", W.wasGift)); panel.appendChild(head);
    const foot = el("div", "wfoot"); panel.appendChild(foot);
    const err = el("div", "wnote"); foot.appendChild(err);
    const answer = (how) => async () => {
      try { await setGranted(it, how); closeSheet(); if (pieceOpen && pieceOpen.id === it.id) openPiece(it, true); }
      catch (e) { err.textContent = String(e && (e.message || e)); }
    };
    foot.appendChild(bar(W.yesGift, answer("gift")));
    foot.appendChild(quietLine(W.noTreat, answer("treat"), true));
  });
}

// The quiet lines under Shop on her own piece (ProductDetailView.actionButtons).
function ownActions(it) {
  if (DEMO || it.o !== me.id) return [];
  const edit = quietLine(W.edit, () => openEditSheet(it));
  const lists = quietLine(W.lists, () => openListsSheet(it));
  const had = isHad(it);
  const granted = quietLine(had ? W.grantedUndo : W.wishGranted, async () => {
    if (had) { try { await setGranted(it, null); if (pieceOpen && pieceOpen.id === it.id) openPiece(it, true); } catch (e) { console.log("granted", e); } }
    else askGranted(it);
  });
  if (had) granted.classList.add("cobalt");
  const del = quietLine(it.rf ? W.unwant : W.delete, () => confirmDelete(it));
  return [edit, lists, granted, del];
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
  $("wShare").setAttribute("aria-label", W.share);
  $("wShare").addEventListener("click", shareMine);
  $("wEditProfile").textContent = W.editProfile; $("wEditProfile").addEventListener("click", () => openProfileSheet(false));
  $("wPrivacy").textContent = W.privacy; $("wPrivacy").addEventListener("click", () => openLegal("privacy"));
  $("wTerms").textContent = W.terms; $("wTerms").addEventListener("click", () => openLegal("terms"));
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
// ---------------------------------------------------------------------------
// Edit profile (SED-967): the app's ProfileEditSheet, field for field. Her
// photo, her name, her username, her birthday, the money every price is
// shown in, and the legal texts. Leaving Wantd and the duplicates cleanup
// are still the app's alone.
// ---------------------------------------------------------------------------
const CURRENCY_KEY = "wantd.currency";
/// "wtd-" and 2 to 15 letters or digits (ProfileStore.isValidHandle).
const validHandle = (h) => /^wtd-[a-z0-9]{2,15}$/.test(h);
/// What she types after "@wtd-": accents folded, lower case, letters and
/// digits only, 15 at most (the app filters the field the same way).
const handleTyped = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15);
function chevronIcon() { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 8 12"); s.innerHTML = '<path d="M2 1.5 6.5 6 2 10.5"/>'; s.classList.add("wpchev"); return s; }
/// Every money the rates know, in her language; the short list before they arrive.
function currencyChoices(current) {
  let codes = rates ? Object.keys(rates) : CURRENCIES.slice();
  try { const known = new Set(Intl.supportedValuesOf("currency")); codes = codes.filter((c) => known.has(c)); } catch (e) {}
  if (current && !codes.includes(current)) codes.push(current);
  let names = null; try { names = new Intl.DisplayNames([LOCALE], { type: "currency" }); } catch (e) {}
  return codes.map((c) => ({ code: c, name: (names && names.of(c)) || c })).sort((a, b) => a.name.localeCompare(b.name, LOCALE));
}
function openProfileSheet(preview) {
  $("wMenuBox").hidden = true;
  const p = preview ? { h: "wtd-agathe", n: "Agathe", avatarURL: null, emoji: null, b: new Date(2001, 3, 1, 12).getTime() } : Object.assign({}, me.profile || {});
  const kept = (() => { try { return localStorage.getItem(CURRENCY_KEY) || ""; } catch (e) { return ""; } })();
  // photo: undefined = as it is, a Blob = a new one, null = her initial.
  const draft = { name: p.n || "", core: (p.h || "").startsWith("wtd-") ? p.h.slice(4) : "", photo: undefined,
                  hasBirthday: !!p.b, birthday: p.b ? new Date(p.b) : null, currency: kept || VIEWER || "EUR", status: "unchanged" };
  let wheels = null, objectURL = null, checkSeq = 0, checkTimer = null;
  openSheet((panel) => {
    const head = el("div", "whead"); head.appendChild(el("h2", "wtitle", W.editProfile)); panel.appendChild(head);
    const body = el("div", "wprofile"); panel.appendChild(body);

    // The photo, with her initial when there is none.
    const photo = el("div", "wpavatar");
    const face = el("div", "wpface"); photo.appendChild(face);
    const pills = el("div", "wppills");
    const file = el("input"); file.type = "file"; file.accept = "image/*"; file.hidden = true;
    const choose = el("button", "wpill", W.choosePhoto); choose.type = "button"; choose.addEventListener("click", () => file.click());
    const initial = el("button", "wpill soft", W.useInitial); initial.type = "button";
    pills.append(choose, initial, file); photo.appendChild(pills); body.appendChild(photo);
    const paintFace = () => {
      if (objectURL) { URL.revokeObjectURL(objectURL); objectURL = null; }
      let url = null;
      if (draft.photo instanceof Blob) url = objectURL = URL.createObjectURL(draft.photo);
      else if (draft.photo === undefined) url = p.avatarURL || null;
      const emoji = draft.photo === undefined ? p.emoji : null;
      face.replaceChildren(avatarNode({ n: draft.name.trim() || p.n || "?", h: p.h, e: emoji, avatarURL: url }, 100));
      initial.hidden = !url;
    };
    initial.addEventListener("click", () => { draft.photo = null; paintFace(); });
    file.addEventListener("change", async () => {
      const chosen = file.files && file.files[0]; file.value = "";
      if (!chosen) return;
      try { draft.photo = await downsample(chosen, 400); paintFace(); } catch (e) { console.log("profile photo", e); }
    });
    paintFace();

    // Her name.
    const nameSec = el("div", "wpsec"); nameSec.appendChild(el("div", "wplabel", W.nameLabel));
    const nameCap = el("label", "wcap"); const nameIn = textInput(draft.name, W.yourName, { caps: "words" }); nameIn.maxLength = 40;
    nameIn.addEventListener("input", () => { draft.name = nameIn.value; if (draft.photo !== undefined || !p.avatarURL) paintFace(); });
    nameCap.appendChild(nameIn); nameSec.appendChild(nameCap); body.appendChild(nameSec);

    // Her username, checked while she types.
    const userSec = el("div", "wpsec"); userSec.appendChild(el("div", "wplabel", W.username));
    const userCap = el("label", "wcap"); userCap.appendChild(el("span", "wppre", "@wtd-"));
    const userIn = textInput(draft.core, W.usernamePrompt, { caps: "none" }); userIn.autocorrect = "off";
    userCap.appendChild(userIn); userSec.appendChild(userCap);
    const hint = el("div", "wphint"); userSec.appendChild(hint); body.appendChild(userSec);
    const showStatus = () => {
      const s = draft.status;
      hint.className = "wphint" + (s === "available" ? " ok" : s === "taken" ? " bad" : "");
      hint.textContent = s === "invalid" ? W.handleInvalid : s === "checking" ? W.handleChecking : s === "available" ? W.handleAvailable(draft.core)
        : s === "taken" ? W.handleTaken : s === "offline" ? W.handleOffline : W.handleHint;
      go.disabled = s === "taken" || s === "invalid" || s === "checking";
    };
    userIn.addEventListener("input", () => {
      const typed = handleTyped(userIn.value);
      if (typed !== userIn.value) userIn.value = typed;
      draft.core = typed;
      clearTimeout(checkTimer);
      const candidate = "wtd-" + typed, seq = ++checkSeq;
      if (!typed || candidate === p.h) { draft.status = "unchanged"; showStatus(); return; }
      if (!validHandle(candidate)) { draft.status = "invalid"; showStatus(); return; }
      draft.status = "checking"; showStatus();
      checkTimer = setTimeout(async () => {
        const st = preview ? { state: "available" } : await handleState(candidate);
        if (seq !== checkSeq) return;
        draft.status = st.state === "available" ? (st.record && st.record.h === p.h ? "unchanged" : "available") : st.state === "taken" ? "taken" : "offline";
        showStatus();
      }, 450);
    });

    // Her birthday, on the same wheels as the entrance.
    const bdSec = el("div", "wpsec");
    const bdRow = el("button", "wpswitchrow"); bdRow.type = "button"; bdRow.setAttribute("role", "switch");
    bdRow.appendChild(el("span", null, W.addBirthday)); const knob = el("span", "wswitch"); bdRow.appendChild(knob);
    bdSec.appendChild(bdRow);
    const bdBox = el("div", "wpwheels"); bdSec.appendChild(bdBox); body.appendChild(bdSec);
    const paintBirthday = () => {
      bdRow.setAttribute("aria-checked", draft.hasBirthday ? "true" : "false");
      bdBox.hidden = !draft.hasBirthday;
      if (draft.hasBirthday && !wheels) {
        wheels = dateWheels((date) => { draft.birthday = date; }, draft.birthday);
        bdBox.appendChild(wheels);
      }
    };
    bdRow.addEventListener("click", () => {
      draft.hasBirthday = !draft.hasBirthday;
      if (draft.hasBirthday && !draft.birthday) draft.birthday = new Date(new Date().getFullYear() - 25, 0, 1, 12);
      paintBirthday();
      if (draft.hasBirthday && wheels) requestAnimationFrame(() => wheels.seat());
    });
    paintBirthday();

    // The money every price is shown in, on this device (the app keeps it
    // on the phone too: wantd.currency).
    const curSec = el("div", "wpsec"); curSec.appendChild(el("div", "wplabel", W.pricesIn));
    const curBox = el("label", "wpcur");
    const curText = el("span", "wpcurcode", draft.currency); curBox.appendChild(curText);
    const updown = document.createElementNS("http://www.w3.org/2000/svg", "svg"); updown.setAttribute("viewBox", "0 0 8 12"); updown.innerHTML = '<path d="M1.5 4.5 4 2l2.5 2.5M1.5 7.5 4 10l2.5-2.5"/>'; updown.classList.add("wpchev"); curBox.appendChild(updown);
    const curSel = el("select"); curSel.setAttribute("aria-label", W.pricesIn);
    for (const c of currencyChoices(draft.currency)) { const o = el("option", null, c.code + " · " + c.name); o.value = c.code; curSel.appendChild(o); }
    curSel.value = draft.currency;
    curSel.addEventListener("change", () => { draft.currency = curSel.value; curText.textContent = curSel.value; });
    curBox.appendChild(curSel); curSec.appendChild(curBox); body.appendChild(curSec);

    // The legal texts, and the one honest line the affiliation needs.
    const legal = el("div", "wpsec"); legal.appendChild(el("div", "wplabel", W.legal));
    const group = el("div", "wpgroup");
    for (const [label, which] of [[W.privacy, "privacy"], [W.terms, "terms"]]) {
      const row = el("button", "wprow"); row.type = "button"; row.appendChild(el("span", null, label)); row.appendChild(chevronIcon());
      row.addEventListener("click", () => openLegal(which)); group.appendChild(row);
    }
    legal.appendChild(group); legal.appendChild(el("div", "wpsmall", W.commission)); body.appendChild(legal);

    const foot = el("div", "wfoot"); panel.appendChild(foot);
    const err = el("div", "wnote"); foot.appendChild(err);
    const go = bar(W.save, async () => {
      go.disabled = true; go.textContent = W.saving; err.textContent = "";
      const result = await saveProfile(p, draft, preview);
      go.textContent = W.save;
      if (result === "ok") {
        const moneyMoved = draft.currency !== (kept || VIEWER || "EUR");
        if (moneyMoved) { try { localStorage.setItem(CURRENCY_KEY, draft.currency); } catch (e) {} }
        closeSheet();
        if (moneyMoved && !preview) setTimeout(() => location.reload(), 340); else paint();
        return;
      }
      if (result === "taken" || result === "invalid") { draft.status = result; showStatus(); }
      else { err.textContent = W.connIssue; go.disabled = false; }
    });
    foot.appendChild(go);
    showStatus();
  });
  if (wheels) wheels.seat();
}
/// Rename first, then the edits, onto whichever record is hers now
/// (ProfileEditSheet.saveAll): "ok", "taken", "invalid" or "error".
async function saveProfile(p, draft, preview) {
  if (preview || DEMO) return "ok";
  const name = draft.name.trim() && draft.name.trim() !== "You" ? draft.name.trim() : p.n;
  const birthday = draft.hasBirthday && draft.birthday ? draft.birthday.getTime() : null;
  const wanted = draft.core ? "wtd-" + draft.core : p.h;
  if (wanted !== p.h && !validHandle(wanted)) return "invalid";
  try {
    if (viaBridge()) {
      let handle = p.h;
      if (wanted !== p.h) {
        try { handle = (await Bridge().renameProfile(wanted)).h || wanted; }
        catch (e) { return e && e.code === "handle_taken" ? "taken" : "error"; }
      }
      const body = { handle, displayName: name, birthday };
      if (draft.photo instanceof Blob) body.avatarJpegBase64 = await blobBase64(draft.photo);
      else if (draft.photo === null) body.removeAvatar = true;
      const saved = await Bridge().putProfile(body);
      me.profile = Object.assign({}, me.profile, { h: saved.h || handle, n: saved.n || name, avatarURL: saved.avatarURL || null, emoji: saved.emoji || null, b: saved.b || birthday });
      keepHandle(me.profile.h);
      return "ok";
    }
    const got = await db().fetchRecords([{ recordName: "profile-" + p.h }]);
    const r = got.records && got.records[0];
    if (!r || !r.fields || v(r, "ownerID") !== me.id) return "error";
    const fields = { displayName: f(name, "STRING"), birthday: f(birthday, "TIMESTAMP") };
    if (draft.photo instanceof Blob) { fields.avatarAsset = { value: draft.photo }; fields.avatarEmoji = f(null, "STRING"); }
    else if (draft.photo === null) { fields.avatarAsset = { value: null }; fields.avatarEmoji = f(null, "STRING"); }
    let saved;
    if (wanted !== p.h) {
      // A plain insert on the new name (claimProfile): refused when someone
      // holds it. Her photo is carried over; the old record goes after.
      fields.handle = f(wanted, "STRING"); fields.ownerID = f(me.id, "STRING");
      if (draft.photo === undefined) {
        const emoji = v(r, "avatarEmoji"); if (emoji) fields.avatarEmoji = f(emoji, "STRING");
        const asset = r.fields.avatarAsset && r.fields.avatarAsset.value && r.fields.avatarAsset.value.downloadURL;
        if (asset) {
          const res = await fetch(String(asset).replace("${f}", "avatar.jpg"));
          if (!res.ok) return "error";
          fields.avatarAsset = { value: await res.blob() };
        }
      }
      const out = await db().saveRecords([{ recordType: "Profile", recordName: "profile-" + wanted, fields }]);
      if (out.hasErrors) { const now = await handleState(wanted); return now.state === "taken" ? "taken" : "error"; }
      saved = out.records[0];
      try { await db().deleteRecords([r]); } catch (e) { console.log("old profile kept", e); }
      keepHandle(wanted);
    } else {
      const out = await db().saveRecords([{ recordType: "Profile", recordName: r.recordName, recordChangeTag: r.recordChangeTag, fields }]);
      if (out.hasErrors) return "error";
      saved = out.records[0];
    }
    const asset = saved && saved.fields && saved.fields.avatarAsset && saved.fields.avatarAsset.value && saved.fields.avatarAsset.value.downloadURL;
    me.profile = Object.assign({}, me.profile, { h: wanted, n: name, b: birthday,
      avatarURL: asset ? String(asset).replace("${f}", "avatar.jpg") : null, emoji: (saved && v(saved, "avatarEmoji")) || null });
    return "ok";
  } catch (e) {
    console.log("profile not saved", e);
    return "error";
  }
}

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
  holdPage(true);
  nameScreen();
}
function closeEntrance() {
  if (!entry.open) return;
  entry.open = false;
  const root = $("wEnter");
  root.hidden = true; root.innerHTML = ""; root.classList.remove("leaving");
  holdPage(false);
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
    // The wrong account, one tap ago: the way out of the card, back to the
    // doors (a bridge session has no other exit while the card is up).
    if (!entry.preview) {
      const out = setIn(el("button", "equiet", W.signOut), 0.40); out.type = "button";
      out.addEventListener("click", () => {
        markEntering(false);
        if (viaBridge()) { window.Account.signOut(); return; }
        const b = $("ckSignOut").querySelector(".apple-auth-button, button, [role=button], div"); if (b) b.click();
      });
      page.appendChild(out);
    }
    if (REGULAR.matches) setTimeout(() => input.focus({ preventScroll: true }), 400);
  });
}

/// Month, day and year in the order her language writes them, never past
/// today; the chosen row bright in its band, the others fading.
function dateWheels(onChange, initial) {
  const ROW = 34, today = new Date();
  const box = el("div", "ewheels");
  const start = initial instanceof Date && !isNaN(initial) && initial <= today ? initial : today;
  let y = start.getFullYear(), m = start.getMonth(), d = start.getDate();
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
      const b = el("button", null, ({ "A friend told me": W.heardFriend, "The App Store": W.heardStore, "Somewhere else": W.heardElse })[source] || source); b.type = "button";
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
  me.loaded = false; me.items = []; me.lists = []; me.extras = {}; me.profile = null; me.pending = []; me.words = new Map(); me.asking = false; me.newcomer = false;
  if (!entry.preview) closeEntrance();
  paint();
  if (window.riverRefresh) window.riverRefresh();
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
  // The two legal texts, one quiet line under the doors (the app shows them
  // on the profile, where a visitor never goes).
  const legal = el("p", "doorlegal");
  const pv = el("button", null, W.privacy); pv.type = "button"; pv.addEventListener("click", () => openLegal("privacy"));
  const tm = el("button", null, W.terms); tm.type = "button"; tm.addEventListener("click", () => openLegal("terms"));
  legal.appendChild(pv); legal.appendChild(el("span", "wdot", "·")); legal.appendChild(tm);
  host.appendChild(legal);
  google.classList.add("waiting");
  if (!DEMO) window.Account.googleButton(gsi, (err) => { note.hidden = !err; if (err) note.textContent = err && err.code === "unreachable" ? W.unreachable : W.googleFailed; }).then(() => google.classList.remove("waiting")).catch(() => {});
}

/// A legal text, as the app's LegalDocumentView: its title, its date, its
/// paragraphs, in English as the app keeps them. The texts come in a file of
/// their own the first time one is opened.
let legalLoading = null;
function loadLegal() {
  if (window.WANTD_LEGAL) return Promise.resolve(window.WANTD_LEGAL);
  if (!legalLoading) legalLoading = new Promise((resolve, reject) => {
    const sc = document.createElement("script"); sc.src = "/feed/legal.js?v=1"; sc.async = true;
    sc.onload = () => resolve(window.WANTD_LEGAL); sc.onerror = () => { legalLoading = null; reject(new Error("legal")); };
    document.head.appendChild(sc);
  });
  return legalLoading;
}
function openLegal(which) {
  openSheet((panel) => {
    const head = el("div", "whead left"); head.appendChild(el("h2", "wtitle", which === "privacy" ? W.privacy : W.terms)); panel.appendChild(head);
    const box = el("div", "wlegal"); panel.appendChild(box);
    loadLegal().then((L) => {
      const doc = L[which];
      box.appendChild(el("p", "wlegaldate", doc.updated));
      for (const para of doc.body.split("\n\n")) { const pEl = el("p", null, para); box.appendChild(pEl); }
      if (which === "terms") box.appendChild(el("p", "wlegalnote", W.commission));
    }).catch(() => { box.appendChild(el("p", null, W.unreachable)); });
    $("wMenuBox").hidden = true;
  });
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
  holdPage(true);
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
  findMine: (id) => me.items.find((it) => it.id === id) || null,
  myHandle: () => (me.id && me.profile && me.profile.h) || "",
  /// The products she already has, by their link: the river leaves them out.
  myKeys: () => (me.loaded ? new Set(me.items.filter((it) => it.u).map((it) => urlKey(it.u))) : null),
  /// Any piece of the public base, by its id: a shared link outside the
  /// loaded river. Through the bridge for a member born there; iCloud's
  /// public base otherwise, signed in or not.
  async readPiece(id) {
    if (viaBridge()) return Bridge().item(id).catch(() => null);
    if (!container()) return null;
    const res = await db().fetchRecords([{ recordName: String(id).toUpperCase() }], { desiredKeys: ["name", "brand", "store", "priceText", "priceAmount", "priceCurrency", "urlString", "status", "addedAt", "sortIndex", "reservedBy", "listIDs", "personalNote", "alsoWantedBy", "imageCandidateURLs", "imageURLString", "ownerID", "rewantedFrom", "ownPhoto", "imageAsset", "netContent", "netContentFor"] });
    const r = res.records && res.records[0];
    return r && r.fields ? itemFromRecord(r) : null;
  },
  kit: { el, $, f, bar, quietLine, labeled, textInput, capsuleField, openSheet, closeSheet, queryAll, db, me: () => me, W, DEMO, viaBridge, buildDoor,
         listFromRecord, itemFromRecord, itemsInList, makeWallWith, lockIcon, peopleIcon, saveCopy, deletePiece, alert: alertBox, avatar: avatarNode },
};
REGULAR.addEventListener("change", () => { if (me.id) paint(); });
// A local try walks the entrance without writing anything (the app's
// --preview-onboarding): /feed/?tab=wishes&preview=enter
if (LOCAL && new URLSearchParams(location.search).get("preview") === "enter") openEntrance(true);
if (LOCAL && new URLSearchParams(location.search).get("preview") === "profile") setTimeout(() => openProfileSheet(true), 400);
// The page may have opened on this tab before this script was read.
if (!document.getElementById("wishes").hidden) window.Wishes.enter();
})();
