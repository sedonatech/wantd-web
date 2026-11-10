// The Friends tab of Wantd on the web (SED-943): her circle, a friend's
// lists, and what one does on a friend's piece: Also want this, Reserve,
// Send to someone, Report, the group gift, the promise. Screen for screen
// as the Mac's FriendsView, VisitProfileView and ProductDetailView, with
// the same records in CloudKit as the iPhone writes.
(function () {
"use strict";
const K = window.Wishes.kit;   // the Wishlist's own tools: me, db, sheets, fields
const { el, $, f, bar, quietLine, labeled, textInput, openSheet, closeSheet, queryAll, db, me } = K;

const F = words("F", {
  newFromFriends: "New from friends", friendsN: (n) => `${n} ${n === 1 ? "friend" : "friends"}`, following: "Following",
  waitBack: "They'll become friends when they follow you back.",
  none: "No friends yet.", noneBody: "Friends are people you follow who follow you back. Share your handle, or find someone.",
  find: "Find someone", share: (h) => `Share @${h}`, finding: "Finding your friends...",
  wantsN: (n) => `${n} ${n === 1 ? "want" : "wants"}`, followersN: (n) => `${n.toLocaleString(LOCALE)} ${n === 1 ? "follower" : "followers"}`,
  bdToday: "birthday today", bdTomorrow: "birthday tomorrow", bdIn: (d) => `birthday in ${d} day${d > 1 ? "s" : ""}`, bdOn: (s) => `birthday on ${s}`,
  pledge: "Not sure what to pick? Offer an amount, let them choose", follow: "Follow", followingYou: "Following", founder: "Founder",
  all: "All", granted: "Granted", nothing: "Nothing on this list yet.", notFound: "Profile not found", checkHandle: "Check the handle and try again.",
  lookingMember: "Looking for a member? Visit their list", searchMember: "Search", noMember: "No member by that name yet.",
  alsoWant: "Also want this", added: "Added to your wishlist. Tap to unwant", unwantAsk: "Unwant this?", unwantBody: "It leaves your wishlist, and your want mark comes off everywhere.", unwant: "Unwant",
  whichList: "In which list?", mainUnless: "Your main wishlist, unless you pick one.", tapToAdd: "Tap to add or remove", addToMine: "Add to my wishlist",
  reserve: "Reserve this gift", reservedByYou: "Reserved by you. Tap to undo", alreadyReserved: "Already reserved",
  reserveAsk: "Reserve this gift?", reserveBody: "Reserving tells everyone this gift is taken, so nobody else will offer it. Only reserve if you truly plan to give it.", reserveOk: "Reserve", cancel: "Cancel",
  someoneReserved: "Someone has reserved this gift.", grantedLine: "This wish is already granted.",
  send: "Send to someone", preparing: "Preparing...", giftCard: "Send a gift card instead", removeFailed: "Couldn't save your contribution", leaveNote: "Leave a note with it", editNote: "Edit your note", noteTitle: "A note with the gift", noteBody: "They read it the day the gift reaches their hands, not before.", notePrompt2: "Happy birthday...", inkIt: "Ink it", sendText: (who, name, link) => who ? `Look what ${who} wants: ${name}. Open it in Wantd to add your share. ${link}` : `Look what someone wants: ${name}. Open it in Wantd to add your share. ${link}`,
  copied: "Link copied", giftCard: "Send a gift card instead",
  report: "Report", reported: "Reported", reportAsk: "Report this want?", reportBody: "We look at every report within 24 hours. You will stop seeing anything from this member straight away.", reportOk: "Report and block this member",
  groupGift: "Group gift", startGift: "Start a group gift", addShare: "Add my contribution", editShare: "Edit my contribution", removeShare: "Remove my contribution",
  yourShare: "Your contribution", yourName: "Your name", namePrompt: "e.g. Camille", amount: "Amount", confirmShare: "Confirm contribution",
  shareFailed: "Couldn't save your contribution", potUntouched: "The pot was left as it was. Check your connection and try again.",
  letChoose: "Let them choose", nameAmount: (n) => `Name an amount. ${n} picks the piece it becomes, and you shop it yourself.`, promise: "Promise it", oneMoment: "One moment...",
  promiseWith: (n) => `Your promise is with ${n}.`, theyChoose: "They will choose a piece from their wishlist, and you will hear about it.", failed: "That did not go through", checkConn: "Check your connection and try again.",
  from: (n) => `From ${n}`, done: "Done",
});

const FOUNDER = "_e4a756c55355bc6245fe776aede18bbb";
const SHARE_HOST = "https://wantd.sedonatech.uk";
// The card this piece's house sells, or nothing at all (Affiliate.giftCards,
// kept in step with the app): a house listed with a path answers only for
// the aisle its card can pay for (Dior's is a beauty card).
const GIFT_CARDS = {
  "zara.com": [null, "https://www.zara.com/fr/fr/giftcard-l1052.html"], "asos.com": [null, "https://www.asos.com/gift-vouchers/"],
  "sephora.fr": [null, "https://www.sephora.fr/carte-cadeau.html"], "sephora.com": [null, "https://www.sephora.com/beauty/giftcards"],
  "zalando.fr": [null, "https://www.zalando.fr/carte-cadeau-home/"], "hm.com": [null, "https://www2.hm.com/fr_fr/carte-cadeau.html"],
  "farfetch.com": [null, "https://www.farfetch.com/fr/gift-card"], "net-a-porter.com": [null, "https://www.net-a-porter.com/fr-fr/gift-cards/"],
  "chanel.com": [null, "https://www.chanel.com/gb/gift-card/"], "cartier.com": [null, "https://cargiftcard.cartier.com/"],
  "apm.mc": [null, "https://www.apm.mc/products/gift-card"], "aloyoga.com": [null, "https://www.aloyoga.com/products/gift-card"],
  "mejuri.com": [null, "https://mejuri.com/shop/t/gift-cards"], "dior.com": ["/beauty/", "https://www.dior.com/en_gb/beauty/products/dior-beauty-e-gift-card-Y74290.html"],
};
function giftCardURL(u) {
  try {
    const x = new URL(u); const host = x.hostname.toLowerCase().replace(/^www\d?\./, "");
    const entry = GIFT_CARDS[host]; if (!entry) return null;
    if (entry[0] && !x.pathname.includes(entry[0])) return null;
    return shopURL(entry[1], { brand: host.split(".")[0], name: "" });
  } catch (e) { return null; }
}
const ITEM_KEYS = ["name", "brand", "store", "priceText", "priceAmount", "priceCurrency", "urlString", "status", "addedAt", "sortIndex", "reservedBy", "listIDs", "alsoWantedBy", "imageCandidateURLs", "imageURLString", "ownerID", "rewantedFrom", "ownPhoto", "imageAsset", "groupGiftJSON", "personalNote", "netContent", "netContentFor"];

// ---------------------------------------------------------------------------
// State.
// ---------------------------------------------------------------------------
const viaBridge = () => K.viaBridge();
const Bridge = () => window.Account.bridge;
const circle = { loaded: false, loading: false, error: null, following: [], mutual: new Set(), friends: [], pending: [], at: 0 };
const visit = { handle: "", owner: "", profile: null, lists: [], items: [], sections: {}, listID: null, shelf: false, sort: "manual", budget: null, loading: false, notFound: false, seq: 0, following: false };
// Who she reported: the feed page keeps the list, under her own id.
const blocked = { has: (owner) => window.wantdBlocks.list().includes(owner) };
/// Hers, or on a list she co-owns: she must never see its reservations or
/// its pot, and has no act on it (WishlistStore.isMineOrShared).
function isMineOrShared(it) {
  const m = me();
  if (!m.id) return false;
  if (it.o === m.id) return true;
  const shared = new Set((m.lists || []).filter((l) => (l.memberIDs || []).length).map((l) => String(l.id).toUpperCase()));
  return (it.l || []).some((id) => shared.has(String(id).toUpperCase()));
}
let wall = null;

// ---------------------------------------------------------------------------
// Reads.
// ---------------------------------------------------------------------------
async function followedIDs() {
  const rows = await queryAll({ recordType: "Follow", filterBy: [
    { fieldName: "followerID", comparator: "EQUALS", fieldValue: { value: me().id } },
    { fieldName: "status", comparator: "EQUALS", fieldValue: { value: "accepted" } }] }, { resultsLimit: 200, desiredKeys: ["followedID"] });
  return [...new Set(rows.map((r) => r.fields.followedID && r.fields.followedID.value).filter(Boolean))];
}
async function mutualIDs(following) {
  const out = new Set();
  for (let i = 0; i < following.length; i += 100) {
    const chunk = following.slice(i, i + 100);
    const rows = await queryAll({ recordType: "Follow", filterBy: [
      { fieldName: "followerID", comparator: "IN", fieldValue: { value: chunk } },
      { fieldName: "followedID", comparator: "EQUALS", fieldValue: { value: me().id } },
      { fieldName: "status", comparator: "EQUALS", fieldValue: { value: "accepted" } }] }, { resultsLimit: 200, desiredKeys: ["followerID"] });
    for (const r of rows) if (r.fields.followerID) out.add(r.fields.followerID.value);
  }
  return out;
}
async function memberPage(owner) {
  try { return await getJSON("/member?owner=" + encodeURIComponent(owner)); } catch (e) { return null; }
}
function daysToBirthday(ms) {
  if (!ms) return null;
  const b = new Date(ms), now = new Date(); now.setHours(0, 0, 0, 0);
  let next = new Date(now.getFullYear(), b.getMonth(), b.getDate());
  if (next < now) next = new Date(now.getFullYear() + 1, b.getMonth(), b.getDate());
  return Math.round((next - now) / 86400000);
}

// The circle as the page last saw it, kept in the browser (FriendsView's
// own cache): painted at once, dealt again behind.
const CACHE = "wantd.circle.v1";
function restoreCircle() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE) || "null");
    if (!c || c.me !== me().id) return false;
    circle.following = c.following || []; circle.mutual = new Set(c.mutual || []); circle.friends = c.friends || []; circle.pending = c.pending || []; circle.loaded = true; circle.at = c.at || 0;
    return true;
  } catch (e) { return false; }
}
function saveCircle() {
  try { localStorage.setItem(CACHE, JSON.stringify({ me: me().id, at: circle.at, following: circle.following, mutual: [...circle.mutual], friends: circle.friends, pending: circle.pending })); } catch (e) {}
}

/// Her circle in one question to the worker (/circle), the portraits beside
/// it; one /member a friend took four seconds each.
async function circlePages(owners) {
  const out = {};
  for (let i = 0; i < owners.length; i += 50) {
    const chunk = owners.slice(i, i + 50);
    let page = null, failed = null;
    try { page = await getJSON("/circle?owners=" + chunk.join(",")); } catch (e) { page = null; failed = e; }
    if (page && page.circle) { for (const c of page.circle) out[c.o] = c; continue; }
    if (failed && !(await memberPage(chunk[0]))) throw new Error(F.failed || "worker");
    // The worker of before this route: one member at a time.
    await Promise.all(chunk.map(async (owner) => {
      const m = await memberPage(owner);
      if (m && m.profile) { const items = (m.items || []).filter((it) => it.n && it.u); out[owner] = { o: owner, profile: m.profile, count: items.length, latest: items.filter(hasPhoto).sort((a, b) => b.at - a.at).slice(0, 12) }; }
    }));
  }
  return out;
}

async function loadCircle() {
  if (circle.loading) return;
  circle.loading = true; circle.error = null; paintCircle();
  try {
    // On a local try, three members of the community stand in for her circle.
    let following, mutual;
    if (K.DEMO) { following = ((await getJSON("/people?q=mar&limit=3")).people || []).map((p) => p.o); mutual = new Set(following); }
    else if (viaBridge()) {
      // The bridge answers the Friends page in one question (FriendsView.load).
      const fr = await Bridge().friends();
      mutual = new Set((fr.friends || []).map((x) => x.profile && x.profile.ownerID).filter(Boolean));
      following = [...mutual].concat((fr.pending || []).map((p) => p.ownerID).filter(Boolean));
    } else { following = await followedIDs(); mutual = await mutualIDs(following); }
    const friendIDs = [...mutual];
    const pendingIDs = following.filter((id) => !mutual.has(id));
    const [pages, faces] = await Promise.all([circlePages(friendIDs.concat(pendingIDs)), portraits(friendIDs.concat(pendingIDs))]);
    const friends = [];
    for (const owner of friendIDs) {
      const c = pages[owner]; if (!c || !c.profile) continue;
      const seen = new Set();
      const latest = (c.latest || []).filter(hasPhoto).sort((a, b) => b.at - a.at).filter((it) => { const k = urlKey(it.u); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 6);
      friends.push({ owner, profile: Object.assign({}, c.profile, faces[owner] || {}), wantCount: c.count || 0, latest });
    }
    const pending = [];
    for (const owner of pendingIDs) {
      const c = pages[owner]; const known = (c && c.profile) || river.profiles[owner];
      if (known) pending.push(Object.assign({ owner, h: known.h, n: known.n }, faces[owner] || {}));
    }
    pending.sort((a, b) => (a.n || "").localeCompare(b.n || ""));
    circle.following = following; circle.mutual = mutual; circle.friends = friends; circle.pending = pending; circle.loaded = true; circle.at = Date.now();
    saveCircle();
  } catch (e) { circle.error = String(e && (e.message || e)); console.log("friends load failed", e); }
  circle.loading = false;
  paintCircle();
}

// ---------------------------------------------------------------------------
// The Friends page: the newest from friends, the cards, who waits.
// ---------------------------------------------------------------------------
function sortedFriends() {
  return circle.friends.slice().sort((a, b) => {
    const da = daysToBirthday(a.profile.b) ?? 9999, dbb = daysToBirthday(b.profile.b) ?? 9999;
    if (da !== dbb) return da - dbb;
    return ((b.latest[0] && b.latest[0].at) || 0) - ((a.latest[0] && a.latest[0].at) || 0);
  });
}
function subline(fr) {
  const parts = [F.wantsN(fr.wantCount)];
  const d = daysToBirthday(fr.profile.b);
  if (d != null && fr.profile.b) {
    if (d <= 30) parts.push(d === 0 ? F.bdToday : d === 1 ? F.bdTomorrow : F.bdIn(d));
    else parts.push(F.bdOn(new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long" }).format(new Date(fr.profile.b))));
  }
  return parts.join(" · ");
}
function avatar(p, size, cls) { const a = K.avatar(p, size); if (cls) a.classList.add(cls); return a; }

/// Their portraits, as the app shows them: the Profile records of a few
/// members in one question, their photo and their emoji.
async function portraits(owners) {
  const out = {};
  if (K.DEMO || !owners.length) return out;
  for (let i = 0; i < owners.length; i += 100) {
    const chunk = owners.slice(i, i + 100);
    if (viaBridge()) {
      try { for (const p of await Bridge().profiles(chunk)) if (p.o) out[p.o] = { avatarURL: p.avatarURL, e: p.emoji }; } catch (e) { console.log("portraits failed", e); }
      continue;
    }
    try {
      const rows = await queryAll({ recordType: "Profile", filterBy: [{ fieldName: "ownerID", comparator: "IN", fieldValue: { value: chunk } }] }, { resultsLimit: 200, desiredKeys: ["ownerID", "handle", "avatarAsset", "avatarEmoji"] });
      for (const r of rows) {
        const fl = r.fields || {}; const o = fl.ownerID && fl.ownerID.value; if (!o) continue;
        if (fl.handle && fl.handle.value === "wtd-you" && out[o]) continue;
        const asset = fl.avatarAsset && fl.avatarAsset.value;
        out[o] = { avatarURL: asset && asset.downloadURL ? String(asset.downloadURL).replace("${f}", "avatar.jpg") : null, e: (fl.avatarEmoji && fl.avatarEmoji.value) || null };
      }
    } catch (e) { console.log("portraits failed", e); }
  }
  return out;
}
function thumb(it, size, radius) {
  const b = el("button", "fthumb"); b.type = "button"; b.style.width = b.style.height = size + "px"; b.style.borderRadius = radius + "px";
  const srcs = photoSources(it);
  if (srcs.length) { const img = el("img"); img.alt = it.n || ""; img.referrerPolicy = "no-referrer"; img.loading = "lazy"; let k = 0; img.onerror = () => { k += 1; if (k < srcs.length) img.src = srcs[k]; else img.remove(); }; img.src = srcs[0]; b.appendChild(img); }
  return b;
}

function paintCircle() {
  const signedIn = !!me().id;
  $("fDoor").hidden = signedIn; $("fHome").hidden = !signedIn;
  if (!signedIn) return;
  const head = $("fHead"), strip = $("fNew"), people = $("fPeople"), state = $("fState"), wait = $("fWait"), empty = $("fEmpty");
  strip.innerHTML = ""; people.innerHTML = ""; wait.innerHTML = ""; empty.innerHTML = "";
  if (circle.loading && !circle.loaded) { state.hidden = false; state.className = "state tall"; state.innerHTML = '<div class="spin"></div>' + F.finding; head.hidden = true; return; }
  if (circle.error && !circle.loaded) { state.hidden = false; state.className = "state serif"; state.textContent = circle.error; return; }
  state.hidden = true; head.hidden = false;
  const recent = circle.friends.flatMap((fr) => fr.latest.map((it) => Object.assign({}, it, { _friend: fr.profile.n }))).sort((a, b) => b.at - a.at).slice(0, 12);
  $("fNewLabel").hidden = !recent.length;
  if (recent.length) {
    const w = REGULAR.matches ? 176 : 132;
    for (const it of recent) {
      const t = el("button", "ftile"); t.type = "button"; t.style.width = w + "px";
      const ph = el("div", "ftileph"); ph.style.height = Math.round(w * 1.24) + "px";
      const srcs = photoSources(it);
      if (srcs.length) { const img = el("img"); img.alt = ""; img.referrerPolicy = "no-referrer"; let k = 0; img.onerror = () => { k += 1; if (k < srcs.length) img.src = srcs[k]; else img.remove(); }; img.src = srcs[0]; ph.appendChild(img); }
      t.appendChild(ph); t.appendChild(el("div", "ftilename", it.n)); t.appendChild(el("div", "ftilewho", it._friend));
      t.addEventListener("click", () => openPiece(it));
      strip.appendChild(t);
    }
  }
  if (!circle.friends.length && !circle.pending.length) {
    empty.appendChild(el("div", "ftitle", F.none));
    empty.appendChild(el("p", "fbody", F.noneBody));
    const row = el("div", "frow");
    const find = el("button", "fcapsule", F.find); find.type = "button"; find.addEventListener("click", openMemberSearch); row.appendChild(find);
    if (me().profile && me().profile.h) { const sh = el("a", "wline", F.share(me().profile.h)); sh.href = SHARE_HOST + "/@" + me().profile.h; sh.target = "_blank"; sh.rel = "noopener"; row.appendChild(sh); }
    empty.appendChild(row);
    $("fPeopleLabel").hidden = true;
    return;
  }
  $("fPeopleLabel").hidden = !circle.friends.length;
  $("fPeopleLabel").textContent = F.friendsN(circle.friends.length);
  for (const fr of sortedFriends()) {
    const card = el("button", "fcard"); card.type = "button";
    const top = el("div", "fcardtop");
    top.appendChild(avatar(fr.profile, 48));
    const who = el("div", "fwho"); who.appendChild(el("div", "fname", fr.profile.n || fr.profile.h)); who.appendChild(el("div", "fsub", subline(fr))); top.appendChild(who);
    card.appendChild(top);
    if (fr.latest.length) { const row = el("div", "fthumbs"); for (const it of fr.latest.slice(0, 4)) { const t = thumb(it, 0, 12); t.style.width = ""; t.style.height = ""; t.addEventListener("click", (e) => { e.stopPropagation(); openPiece(it); }); row.appendChild(t); } card.appendChild(row); }
    card.addEventListener("click", () => go({ tab: "friends", u: fr.profile.h }));
    people.appendChild(card);
  }
  if (circle.pending.length) {
    wait.appendChild(el("div", "label", F.following));
    const list = el("div", "fwaitlist");
    circle.pending.forEach((p, i) => {
      const row = el("button", "fwaitrow"); row.type = "button";
      row.appendChild(avatar(p, 36));
      const who = el("div", "fwho"); who.appendChild(el("div", "fname small", p.n || p.h)); who.appendChild(el("div", "fsub", "@" + p.h)); row.appendChild(who);
      row.addEventListener("click", () => go({ tab: "friends", u: p.h }));
      list.appendChild(row);
    });
    wait.appendChild(list);
    wait.appendChild(el("p", "frule", F.waitBack));
  }
}

// ---------------------------------------------------------------------------
// Find someone: the worker's /people, handles and names.
// ---------------------------------------------------------------------------
function openMemberSearch() {
  openSheet((panel) => {
    const head = el("div", "whead"); head.appendChild(el("h2", "wtitle", F.find)); panel.appendChild(head);
    const q = textInput("", F.searchMember, { caps: "none" }); q.type = "search";
    panel.appendChild(K.capsuleField('<svg viewBox="0 0 16 16"><circle cx="6.8" cy="6.8" r="5.2"/><path d="M10.6 10.6 L15 15"/></svg>', q));
    const list = el("div", "fwaitlist"); panel.appendChild(list);
    let seq = 0, timer = null;
    const run = async () => {
      const t = q.value.trim(); const s = ++seq;
      list.innerHTML = "";
      if (t.length < 2) return;
      let page = null;
      try { page = await getJSON("/people?q=" + encodeURIComponent(t) + "&limit=8"); } catch (e) {}
      if (s !== seq) return;
      const people = ((page && page.people) || []).filter((p) => p.o !== me().id);
      if (!people.length) { list.appendChild(el("p", "frule", F.noMember)); return; }
      for (const p of people) {
        const row = el("button", "fwaitrow"); row.type = "button";
        row.appendChild(avatar(p, 36));
        const who = el("div", "fwho"); who.appendChild(el("div", "fname small", p.n || p.h)); who.appendChild(el("div", "fsub", "@" + p.h)); row.appendChild(who);
        row.addEventListener("click", () => { closeSheet(); go({ tab: "friends", u: p.h }); });
        list.appendChild(row);
      }
    };
    q.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(run, 250); });
    q.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); run(); } });
    setTimeout(() => q.focus({ preventScroll: true }), 50);
  });
}

// ---------------------------------------------------------------------------
// A friend's page: her header, her lists, her pieces, as the iPhone shows them.
// ---------------------------------------------------------------------------
async function openProfile(handle) {
  const seq = ++visit.seq;
  Object.assign(visit, { handle, owner: "", profile: null, lists: [], items: [], sections: {}, listID: null, shelf: false, budget: null, loading: true, notFound: false, following: false });
  paintVisit();
  // Who she is: the worker knows her by handle; a member who joined minutes
  // ago is read from her Profile record (FriendsView tolerates "@Wtd-Gags ").
  handle = String(handle || "").trim().toLowerCase().replace(/^@/, "");
  const candidates = handle.startsWith("wtd-") ? [handle] : [handle, "wtd-" + handle];
  let person = null;
  for (const h of candidates) {
    try {
      const page = await getJSON("/people?q=" + encodeURIComponent(h) + "&limit=8");
      person = (page.people || []).find((p) => p.h === h) || null;
    } catch (e) {}
    if (person) break;
  }
  if (!person && !K.DEMO) for (const h of candidates) {
    try {
      if (viaBridge()) { const page = await Bridge().profile(h); if (page.profile && page.profile.h) person = { o: page.profile.o, h: page.profile.h, n: page.profile.n, b: page.profile.b, e: page.profile.emoji }; }
      else {
        const res = await db().fetchRecords([{ recordName: "profile-" + h }], { desiredKeys: ["handle", "displayName", "ownerID", "birthday", "avatarEmoji"] });
        const r = res.records && res.records[0];
        if (r && r.fields) person = { o: r.fields.ownerID.value, h: r.fields.handle.value, n: (r.fields.displayName && r.fields.displayName.value) || "", b: r.fields.birthday && r.fields.birthday.value, e: r.fields.avatarEmoji && r.fields.avatarEmoji.value };
      }
    } catch (e) {}
    if (person) break;
  }
  if (person && (person.h === "wtd-you" || /^wtd-you\d+$/.test(person.h))) person = null;
  if (seq !== visit.seq) return;
  if (!person) { visit.loading = false; visit.notFound = true; paintVisit(); return; }
  if (person.o === me().id) { go({ tab: "wishes" }); return; }
  visit.owner = person.o;
  visit.profile = { h: person.h, n: person.n, fr: person.fr || 0, fg: person.fg || 0, b: person.b, e: person.e || null };
  visit.following = circle.loaded ? circle.following.includes(person.o) : false;
  paintVisit();
  if (K.DEMO) {
    const page = await memberPage(person.o);
    if (seq !== visit.seq) return;
    visit.items = ((page && page.items) || []).map((it, i) => Object.assign({ si: i, st: "available", l: it.l || [] }, it));
    visit.loading = false; paintVisit(); return;
  }
  // The header is never drawn without knowing the answer (FriendsView):
  // the one Follow record, read every time, never the cache.
  const followingTask = viaBridge()
    ? Bridge().isFollowing(person.o).catch(() => null)
    : queryAll({ recordType: "Follow", filterBy: [
        { fieldName: "followerID", comparator: "EQUALS", fieldValue: { value: me().id } },
        { fieldName: "followedID", comparator: "EQUALS", fieldValue: { value: person.o } }] }, { resultsLimit: 2, desiredKeys: ["status"] })
        .then((rows) => rows.some((r) => r.fields.status && r.fields.status.value === "accepted")).catch(() => null);
  try {
    // Her lists: the ones she created and the ones she joined, private ones
    // never (fetchVisibleLists); her own pieces, those filed only on private
    // lists kept with her (hidingPrivate).
    let visible, items;
    if (viaBridge()) {
      const page = await Bridge().profile(handle);
      visible = page.lists.filter((l) => !l.isPrivate);
      items = page.items.filter((it) => it.n && it.u !== undefined);
      if (page.profile && page.profile.avatarURL) visit.profile.avatarURL = page.profile.avatarURL;
    } else {
      const [rows, joined, own, profiles] = await Promise.all([
        queryAll({ recordType: "List", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: person.o } }] }, { resultsLimit: 200 }).catch(() => []),
        queryAll({ recordType: "List", filterBy: [{ fieldName: "memberIDs", comparator: "LIST_CONTAINS", fieldValue: { value: person.o } }] }, { resultsLimit: 200 }).catch(() => []),
        queryAll({ recordType: "Item", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: person.o } }] }, { resultsLimit: 200, desiredKeys: ITEM_KEYS }),
        queryAll({ recordType: "Profile", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: person.o } }] }, { resultsLimit: 5, desiredKeys: ["avatarAsset", "avatarEmoji"] }).catch(() => []),
      ]);
      if (seq !== visit.seq) return;
      const byID = new Map();
      for (const r of rows.concat(joined)) { const l = K.listFromRecord(r); if (l.id && !l.isPrivate && !byID.has(l.id)) byID.set(l.id, l); }
      visible = [...byID.values()];
      const privateIDs = new Set(rows.map(K.listFromRecord).filter((l) => l.isPrivate).map((l) => l.id));
      items = own.map(K.itemFromRecord).filter((it) => it.n && it.u !== undefined && !((it.l || []).length && (it.l || []).every((id) => privateIDs.has(id))));
      const av = profiles[0] && profiles[0].fields;
      if (av && av.avatarAsset && av.avatarAsset.value && av.avatarAsset.value.downloadURL) visit.profile.avatarURL = String(av.avatarAsset.value.downloadURL).replace("${f}", "avatar.jpg");
    }
    if (seq !== visit.seq) return;
    // One tab per public list, the main one first and once; a co-owned list
    // is its own tab, never blended into the grid: a piece kept with someone
    // must read as such before anyone gifts it.
    let mainSeen = false;
    visit.lists = visible.filter((l) => { if (!l.isMain) return true; if (mainSeen) return false; mainSeen = true; return true; })
      .filter((l) => !l.isMain).sort((a, b) => a.createdAt - b.createdAt);
    const sharedIDs = new Set(visible.filter((l) => (l.memberIDs || []).length).map((l) => l.id));
    visit.items = items.filter((it) => !(it.l || []).some((id) => sharedIDs.has(id))).map((it) => Object.assign(it, { _visited: true }));
    visit.loading = false;
    paintVisit();
    // Each shared list whole, every member's pieces, after the grid is up.
    await Promise.all([...sharedIDs].map(async (id) => {
      const l = visible.find((x) => x.id === id);
      try {
        const found = viaBridge() ? await Bridge().listItems(l.creatorID, id) : await K.itemsInList(id);
        if (seq !== visit.seq) return;
        visit.sections[id] = found.filter((it) => it.n && it.o).map((it) => Object.assign(it, { _visited: true }));
      } catch (e) { console.log("shared list", id, e); }
    }));
  } catch (e) { console.log("visit load failed", e); }
  const following = await followingTask;
  if (seq !== visit.seq) return;
  if (following != null) visit.following = following;
  visit.loading = false;
  paintVisit();
}

function viewerAmountOf(it) {
  if (typeof it.pa !== "number" || !it.pc) return null;
  const cur = it.pc.toUpperCase();
  if (VIEWER && cur !== VIEWER && rates && rates[cur] > 0 && rates[VIEWER]) return it.pa / rates[cur] * rates[VIEWER];
  return it.pa;
}
function openVisitFilter() {
  openSheet((panel) => {
    const head = el("div", "whead"); head.appendChild(el("h2", "wtitle", K.W.filter)); head.appendChild(el("p", "wsub", K.W.yourBudget)); panel.appendChild(head);
    const all = visit.items.concat(...Object.values(visit.sections));
    const max = Math.max(1, ...all.map((it) => viewerAmountOf(it) || 0));
    const cur = visit.budget || [0, Math.ceil(max)];
    const lo = textInput(String(Math.round(cur[0])), "0", { type: "number" }); lo.min = "0";
    const hi = textInput(String(Math.round(cur[1])), String(Math.ceil(max)), { type: "number" }); hi.min = "0";
    const row = el("div", "wrow"); row.appendChild(labeled("Min", lo)); row.appendChild(labeled("Max", hi)); panel.appendChild(row);
    const foot = el("div", "wfoot"); panel.appendChild(foot);
    foot.appendChild(bar(K.W.done, () => { const a = Number(lo.value) || 0, b = Number(hi.value) || Math.ceil(max); visit.budget = (a <= 0 && b >= Math.ceil(max)) ? null : [Math.min(a, b), Math.max(a, b)]; paintVisit(); closeSheet(); }));
    foot.appendChild(quietLine(K.W.reset, () => { visit.budget = null; paintVisit(); closeSheet(); }, true));
  });
}
const isHadByOwner = (it) => it.st === "purchased" && it.rb === visit.owner;
function visitShown() {
  let list = visit.items.slice();
  if (visit.shelf) list = list.filter(isHadByOwner);
  else if (visit.listID && visit.sections[visit.listID]) list = visit.sections[visit.listID].filter((it) => !isHadByOwner(it));
  else { list = list.filter((it) => !isHadByOwner(it)); if (visit.listID) list = list.filter((it) => (it.l || []).includes(visit.listID)); }
  if (visit.budget) {
    // Items without a known price are kept (ContentView.filtered(budgetRange:)).
    const [lo, hi] = visit.budget;
    list = list.filter((it) => { const a = viewerAmountOf(it); return a == null ? true : a >= lo && a <= hi; });
  }
  const by = { manual: (a, b) => a.si - b.si || b.at - a.at, recent: (a, b) => b.at - a.at, oldest: (a, b) => a.at - b.at,
    priceAsc: (a, b) => (viewerAmountOf(a) ?? Infinity) - (viewerAmountOf(b) ?? Infinity), priceDesc: (a, b) => (viewerAmountOf(b) ?? -1) - (viewerAmountOf(a) ?? -1) }[visit.sort] || ((a, b) => a.si - b.si);
  return list.sort(by);
}
function paintVisit() {
  const sec = $("fVisit");
  if (!visit.handle) { sec.hidden = true; $("fCircle").hidden = false; return; }
  sec.hidden = false; $("fCircle").hidden = true;
  const p = visit.profile;
  $("vNotFound").hidden = !visit.notFound;
  $("vPage").hidden = visit.notFound;
  if (visit.notFound) return;
  const av = $("vAvatar"); av.innerHTML = ""; if (p) av.appendChild(avatar(p, 40, "inline"));
  $("vName").textContent = p ? (p.n || p.h) : "";
  $("vFounder").hidden = !(p && visit.owner === FOUNDER);
  const count = visit.items.filter((it) => !isHadByOwner(it)).length + Object.values(visit.sections).reduce((n, sec) => n + sec.length, 0);
  $("vFacts").textContent = p ? `@${p.h} · ${F.wantsN(visit.items.length ? count : 0)} · ${F.followersN(p.fr || 0)}` : "";
  $("vFilterValue").textContent = visit.budget ? "· " + K.W.on : "";
  const fb = $("vFollow"); fb.hidden = !p || visit.owner === me().id; fb.textContent = visit.following ? F.followingYou : F.follow; fb.classList.toggle("soft", visit.following);
  $("vPledge").hidden = !p || visit.owner === me().id;
  const tabs = $("vTabs"); tabs.innerHTML = "";
  const hasGranted = visit.items.some(isHadByOwner);
  const show = visit.lists.length > 0 || hasGranted;
  tabs.hidden = !show;
  if (show) {
    const tab = (title, active, opts) => { const b = el("button", "wtab" + (active ? " on" : "")); b.type = "button"; if (opts && opts.shared) b.appendChild(K.peopleIcon()); b.appendChild(el("span", null, title)); return b; };
    const allB = tab(F.all, !visit.shelf && !visit.listID); allB.addEventListener("click", () => { visit.shelf = false; visit.listID = null; paintVisit(); }); tabs.appendChild(allB);
    for (const l of visit.lists) { const b = tab(l.name, !visit.shelf && visit.listID === l.id, { shared: l.memberIDs.length > 0 }); b.addEventListener("click", () => { visit.shelf = false; visit.listID = l.id; paintVisit(); }); tabs.appendChild(b); }
    if (hasGranted) { const g = tab(F.granted, visit.shelf); g.addEventListener("click", () => { visit.shelf = true; visit.listID = null; paintVisit(); }); tabs.appendChild(g); }
  }
  const host = $("vWall"), state = $("vState");
  host.innerHTML = ""; wall = K.makeWallWith(host, REGULAR.matches ? 5 : 2);
  if (visit.loading && !visit.items.length) { state.hidden = false; state.className = "state"; state.innerHTML = '<div class="spin"></div>'; host.hidden = true; return; }
  const list = visitShown();
  if (!list.length) { state.hidden = false; state.className = "state serif"; state.textContent = F.nothing; host.hidden = true; return; }
  state.hidden = true; host.hidden = false;
  wall.add(list, { counts: (it) => river.counts.get(urlKey(it.u)) || (it.aw ? it.aw.length : 0), status: (it) => me().loaded && !isMineOrShared(it) });
}

async function toggleFollow() {
  if (!visit.owner || visit.owner === me().id) return;
  const was = visit.following;
  visit.following = !was; visit.profile.fr = Math.max(0, (visit.profile.fr || 0) + (was ? -1 : 1)); paintVisit();
  try {
    const name = `follow-${me().id}-${visit.owner}`;
    if (viaBridge()) {
      if (was) { await Bridge().unfollow(visit.owner); circle.following = circle.following.filter((id) => id !== visit.owner); circle.mutual.delete(visit.owner); circle.friends = circle.friends.filter((fr) => fr.owner !== visit.owner); }
      else { await Bridge().follow(visit.owner); if (!circle.following.includes(visit.owner)) circle.following.push(visit.owner); circle.loaded = false; }
    } else if (was) {
      const res = await db().deleteRecords([{ recordName: name }]);
      if (res.hasErrors && !res.errors.every((e) => e.ckErrorCode === "NOT_FOUND")) throw new Error(res.errors[0].ckErrorCode);
      circle.following = circle.following.filter((id) => id !== visit.owner); circle.mutual.delete(visit.owner); circle.friends = circle.friends.filter((fr) => fr.owner !== visit.owner);
    } else {
      const fields = { followerID: f(me().id, "STRING"), followedID: f(visit.owner, "STRING"), status: f("accepted", "STRING") };
      if (me().profile && me().profile.h) fields.followerHandle = f(me().profile.h, "STRING");
      const res = await db().saveRecords([{ recordType: "Follow", recordName: name, fields }], { operationType: "forceUpdate" });
      if (res.hasErrors) throw new Error(res.errors[0].ckErrorCode);
      if (!circle.following.includes(visit.owner)) circle.following.push(visit.owner);
      circle.loaded = false;   // dealt again on the next visit of the tab
    }
  } catch (e) { visit.following = was; visit.profile.fr = Math.max(0, (visit.profile.fr || 0) + (was ? 1 : -1)); paintVisit(); console.log("follow failed", e); }
}

// ---------------------------------------------------------------------------
// The promise: offer an amount, she picks the piece (SED-611, the worker's /pledge).
// ---------------------------------------------------------------------------
function openPledgeSheet() {
  const p = visit.profile; if (!p) return;
  openSheet((panel) => {
    const head = el("div", "whead left");
    head.appendChild(el("h2", "wtitle", F.letChoose));
    head.appendChild(el("p", "wsub", F.nameAmount(p.n || p.h)));
    panel.appendChild(head);
    const row = el("div", "wrow");
    const amount = textInput("", "50", { type: "text" }); amount.inputMode = "decimal";
    row.appendChild(labeled(F.amount, amount));
    const cur = el("div", "wfield"); cur.appendChild(el("div", "wlabel", "")); cur.appendChild(el("div", "fcur", VIEWER || "EUR")); row.appendChild(cur);
    panel.appendChild(row);
    const foot = el("div", "wfoot"); panel.appendChild(foot);
    const err = el("div", "wnote"); foot.appendChild(err);
    const go = bar(F.promise, async () => {
      const a = Number(amount.value.trim().replace(",", ".")); if (!(a > 0)) { amount.focus(); return; }
      go.disabled = true; go.textContent = F.oneMoment;
      try {
        const res = await fetch(API + "/pledge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ handle: p.h, name: (me().profile && me().profile.n) || "", amount: a, currency: VIEWER || "EUR" }) });
        const j = await res.json();
        if (!res.ok || j.error) throw new Error(j.error || res.status);
        panel.innerHTML = '<div class="grab"></div>';
        const done = el("div", "whead left"); done.appendChild(el("h2", "wtitle", F.promiseWith(p.n || p.h))); done.appendChild(el("p", "wsub", F.theyChoose)); panel.appendChild(done);
        const ft = el("div", "wfoot"); ft.appendChild(bar(F.done, () => closeSheet())); panel.appendChild(ft);
      } catch (e) { go.disabled = false; go.textContent = F.promise; err.textContent = F.failed + ". " + F.checkConn; }
    });
    foot.appendChild(go);
    setTimeout(() => amount.focus({ preventScroll: true }), 50);
  });
}

// ---------------------------------------------------------------------------
// On someone else's piece: the quiet lines under Shop, and the pot.
// ---------------------------------------------------------------------------
const live = new Map();   // id -> { st, rb, gift, _tag, aw }
async function readState(it) {
  if (viaBridge()) {
    try {
      const fresh = await Bridge().item(it.id);
      if (!(it.l || []).length && fresh.l.length) it.l = fresh.l;
      const s = { st: fresh.st, rb: fresh.rb, gift: fresh.gift, _tag: null, aw: fresh.aw || [], rn: fresh.rn || null };
      live.set(it.id, s);
      return s;
    } catch (e) { return null; }
  }
  try {
    const res = await db().fetchRecords([{ recordName: it.id }], { desiredKeys: ["status", "reservedBy", "groupGiftJSON", "alsoWantedBy", "listIDs", "reservedNote"] });
    if (res.hasErrors || !res.records[0]) return null;
    const r = res.records[0];
    const gj = r.fields.groupGiftJSON && r.fields.groupGiftJSON.value;
    let gift = null;
    // The bytes are UTF-8, as the app writes them: read as such, or "Chloé"
    // comes back "ChloÃ©" and is saved that way for everyone.
    if (gj) { try { gift = JSON.parse(new TextDecoder("utf-8").decode(Uint8Array.from(atob(gj), (c) => c.charCodeAt(0)))); } catch (e) { gift = null; } }
    if (!(it.l || []).length && r.fields.listIDs && r.fields.listIDs.value) it.l = r.fields.listIDs.value;
    const s = { st: (r.fields.status && r.fields.status.value) || "available", rb: r.fields.reservedBy && r.fields.reservedBy.value, gift, _tag: r.recordChangeTag, aw: (r.fields.alsoWantedBy && r.fields.alsoWantedBy.value) || [],
      rn: r.fields.reservedNote && r.fields.reservedNote.value ? unveil(r.fields.reservedNote.value, it.id) : null };
    live.set(it.id, s);
    return s;
  } catch (e) { return null; }
}
/// The veil of a note (NoteVeil): the UTF-8 bytes XOR the item's id, base64.
function veil(text, key) { const k = new TextEncoder().encode(key), b = new TextEncoder().encode(text); return btoa(String.fromCharCode(...b.map((x, i) => x ^ k[i % k.length]))); }
function unveil(blob, key) { try { const k = new TextEncoder().encode(key), b = Uint8Array.from(atob(blob), (c) => c.charCodeAt(0)); return new TextDecoder("utf-8").decode(b.map((x, i) => x ^ k[i % k.length])); } catch (e) { return null; } }
const giftB64 = (gift) => btoa(unescape(encodeURIComponent(JSON.stringify(gift))));
const nowCK = () => Date.now() / 1000 - 978307200;   // seconds since 2001, as JSONEncoder writes a Date

/// A change to someone's piece, made where the piece stands: read it,
/// decide the fields from what was just read (null: nothing to write), write
/// with its tag, and on a collision read again and decide again. Never the
/// same bytes twice: two friends giving in the same moment both stay, and a
/// reservation made meanwhile is never written over (CloudKitService's
/// "someone else just contributed: read theirs and add ours").
async function changeState(it, decide) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const s = await readState(it);
    if (!s) throw new Error("read");
    const fields = decide(s);
    if (!fields) return false;
    const res = await db().saveRecords([{ recordType: "Item", recordName: it.id, recordChangeTag: s._tag, fields }]);
    if (!res.hasErrors) { await readState(it); return true; }
    if (!res.errors.some((e) => e.ckErrorCode === "CONFLICT")) throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
  }
  throw new Error("CONFLICT");
}

function othersActions(it, body) {
  const m = me();
  if (!m.id || isMineOrShared(it)) return;
  const acts = body.querySelector(".acts");
  const box = el("div", "facts");
  acts.insertAdjacentElement("afterend", box);
  const lines = el("div", "flines"); box.appendChild(lines);
  const pot = el("div", "fpot"); box.appendChild(pot);
  const alreadyMine = () => it.u ? m.items.some((x) => x.u && urlKey(x.u) === urlKey(it.u)) : m.items.some((x) => x.rf && !x.u && x.n === it.n);
  let didRepost = alreadyMine();
  const render = () => {
    lines.innerHTML = "";
    const s = live.get(it.id) || { st: it.st || "available", rb: it.rb, gift: null };
    // Also want this.
    {
      const w = quietLine(didRepost ? F.added : F.alsoWant, () => { if (didRepost) confirmUnwant(); else wantFromCard(); });
      lines.appendChild(w);
    }
    // Reserve.
    const mine = s.st === "reserved" && s.rb === m.id;
    const taken = s.st === "reserved" && !mine;
    if (s.st !== "purchased") {
      const r = quietLine(mine ? F.reservedByYou : taken ? F.alreadyReserved : F.reserve, () => { if (mine) toggleReserve(false); else if (!taken) confirmReserve(); }, taken);
      if (taken) r.disabled = true;
      lines.appendChild(r);
      // The unwrapping note (SED-614): one line that travels with the
      // reservation and unveils the day she shelves the piece.
      if (mine) lines.appendChild(quietLine(s.rn ? F.editNote : F.leaveNote, () => openNote(s.rn || "")));
    } else lines.appendChild(el("div", "fstatus", F.grantedLine));
    if (taken) lines.appendChild(el("div", "fstatus", F.someoneReserved));
    // Send to someone.
    lines.appendChild(quietLine(F.send, sendToSomeone));
    // The last-minute door (SED-612): one quiet line, only where a real card exists.
    const card = it.u ? giftCardURL(it.u) : null;
    if (card) { const a = el("a", "wline", F.giftCard); a.href = card; a.target = "_blank"; a.rel = "noopener"; lines.appendChild(a); }
    // Report.
    const rep = el("button", "freport", F.report); rep.type = "button"; rep.addEventListener("click", confirmReport); lines.appendChild(rep);
    renderPot(s);
  };
  const renderPot = (s) => {
    pot.innerHTML = "";
    const g = s.gift;
    if (!g) { pot.appendChild(quietLine(F.startGift, startGift)); return; }
    const cur = g.currencyCode || it.pc || VIEWER || "EUR";
    pot.appendChild(el("div", "fpottitle", F.groupGift));
    const collected = (g.contributions || []).reduce((t, c) => t + (Number(c.amount) || 0), 0);
    const target = typeof g.targetAmount === "number" ? g.targetAmount : (typeof it.pa === "number" ? it.pa : null);
    const line = el("div", "fpotline");
    const big = el("span", "num big", money(collected, cur)); line.appendChild(big);
    if (target) { line.appendChild(el("span", "num soft", "/ " + money(target, cur))); const pct = el("span", "num soft right", Math.round(Math.min(1, collected / target) * 100) + " %"); line.appendChild(pct); }
    pot.appendChild(line);
    if (target) { const barEl = el("div", "fbar"); const fill = el("div"); fill.style.width = Math.round(Math.min(1, collected / target) * 100) + "%"; barEl.appendChild(fill); pot.appendChild(barEl); }
    for (const c of g.contributions || []) {
      const row = el("div", "fcontrib");
      row.appendChild(el("span", "fcircle", String(c.contributorName || "?").charAt(0).toUpperCase()));
      row.appendChild(el("span", "fcname", c.contributorName || ""));
      row.appendChild(el("span", "num soft", money(Number(c.amount) || 0, cur)));
      pot.appendChild(row);
    }
    const mineC = (g.contributions || []).find((c) => c.contributorID === m.id);
    if (mineC) {
      pot.appendChild(quietLine(F.editShare, () => openContribute(g, mineC)));
      pot.appendChild(quietLine(F.removeShare, removeShare, true));
    } else pot.appendChild(quietLine(F.addShare, () => openContribute(g, null)));
  };

  // --- Also want this: her own copy, and the shared counter (Rewant).
  const wantFromCard = () => {
    const lists = m.lists.filter((l) => !l.isMain && l.creatorID === m.id);
    if (alreadyMine() || !lists.length) repost(new Set());
    else openSheet((panel) => {
      const head = el("div", "whead left"); head.appendChild(el("h2", "wtitle", F.whichList)); const sub = el("p", "wsub", F.mainUnless); head.appendChild(sub); panel.appendChild(head);
      const selected = new Set();
      const row = el("div", "wchips");
      lists.forEach((l, i) => { if (i) row.appendChild(el("span", "wdot", "·")); const b = el("button", "wchip"); b.type = "button"; if (l.isPrivate) b.appendChild(K.lockIcon()); b.appendChild(el("span", null, l.name)); b.addEventListener("click", () => { if (selected.has(l.id)) selected.delete(l.id); else selected.add(l.id); b.classList.toggle("on", selected.has(l.id)); sub.textContent = selected.size ? F.tapToAdd : F.mainUnless; }); row.appendChild(b); });
      panel.appendChild(row);
      const foot = el("div", "wfoot"); foot.appendChild(bar(F.addToMine, () => { closeSheet(); repost(selected); })); panel.appendChild(foot);
    });
  };
  const repost = async (selected) => {
    didRepost = true; render();
    try {
      if (viaBridge()) {
        // The bridge makes her copy and her mark in one go (the app's repost).
        const r = await Bridge().rewant(it.id, [...selected]);
        if (r.status === "rewanted" && r.itemID) { const copy = await Bridge().item(r.itemID).catch(() => null); if (copy) { m.items.unshift(copy); } }
        const k = urlKey(it.u); if (it.u && r.status === "rewanted") river.counts.set(k, (river.counts.get(k) || 0) + 1);
      } else {
        if (!alreadyMine()) await K.saveCopy(it, selected);
        if (it.u) await addRewant(it);
        else await changeState(it, (s) => (s.aw.includes(m.id) ? null : { alsoWantedBy: f(s.aw.concat([m.id]), "STRING_LIST") }));
      }
      const s = live.get(it.id); if (s && !s.aw.includes(m.id)) s.aw.push(m.id);
    } catch (e) { didRepost = alreadyMine(); render(); console.log("rewant failed", e); }
  };
  const confirmUnwant = () => K.alert(F.unwantAsk, F.unwantBody, F.unwant, async () => {
    const mine = m.items.find((x) => x.u && urlKey(x.u) === urlKey(it.u));
    if (mine) await K.deletePiece(mine); else await removeRewant(it);
    didRepost = false; render();
  });

  // --- Reserve.
  const confirmReserve = () => K.alert(F.reserveAsk, F.reserveBody, F.reserveOk, () => toggleReserve(true));
  const toggleReserve = async (on) => {
    try {
      if (viaBridge()) { try { await Bridge().reserve(it.id, on); } catch (e) { if (!(e && (e.code === "taken" || e.code === "not_reserved_by_you"))) throw e; } await readState(it); render(); return; }
      await changeState(it, (s) => {
        // Only a free piece is reserved, only her own reservation is undone.
        if (on ? s.st !== "available" : !(s.st === "reserved" && s.rb === m.id)) return null;
        return { status: f(on ? "reserved" : "available", "STRING"), reservedBy: f(on ? m.id : null, "STRING") };
      });
    } catch (e) { console.log("reserve failed", e); }
    render();
  };

  // --- The note with the gift: a sheet with the app's alert's words.
  const openNote = (current) => openSheet((panel) => {
    const head = el("div", "whead left"); head.appendChild(el("h2", "wtitle", F.noteTitle)); head.appendChild(el("p", "wsub", F.noteBody)); panel.appendChild(head);
    const field = textInput(current, F.notePrompt2, { caps: "sentences" }); field.maxLength = 280; field.className = "wbig";
    panel.appendChild(field);
    const foot = el("div", "wfoot"); panel.appendChild(foot);
    const err = el("div", "wnote"); foot.appendChild(err);
    const ok = bar(F.inkIt, async () => {
      const note = field.value.trim().slice(0, 280);
      ok.disabled = true;
      try {
        if (viaBridge()) await Bridge().reserveNote(it.id, note);
        else await changeState(it, (s) => (s.st === "reserved" && s.rb === m.id ? { reservedNote: f(note ? veil(note, it.id) : null, "STRING") } : null));
        await readState(it); closeSheet(); render();
      } catch (e) { ok.disabled = false; err.textContent = F.failed + ". " + F.checkConn; }
    });
    foot.appendChild(ok);
    foot.appendChild(quietLine(F.cancel || K.W.cancel, () => closeSheet(), true));
    setTimeout(() => field.focus({ preventScroll: true }), 50);
  });

  // --- Send to someone: the app's words and the piece's own link.
  const sendToSomeone = async () => {
    const who = ownerName(it);
    const link = SHARE_HOST + "/i/" + it.id.toLowerCase();
    const text = F.sendText(who, it.n, link);
    try {
      if (navigator.share) { await navigator.share({ text }); return; }
      await navigator.clipboard.writeText(text);
      const note = el("div", "fstatus", F.copied); lines.appendChild(note); setTimeout(() => note.remove(), 2000);
    } catch (e) {}
  };

  // --- Report and block.
  const confirmReport = () => K.alert(F.reportAsk, F.reportBody, F.reportOk, async () => {
    try {
      if (viaBridge()) { await Bridge().report(it.id, "reported from the product card"); }
      else { const res = await db().saveRecords([{ recordType: "Report", recordName: "report-" + crypto.randomUUID().toUpperCase(), fields: {
        reporterID: f(m.id, "STRING"), reportedOwnerID: f(it.o || "", "STRING"), itemID: f(it.id, "STRING"), itemName: f(it.n || "", "STRING"),
        reason: f("reported from the product card", "STRING"), reportedAt: f(Date.now(), "TIMESTAMP") } }]);
      if (res.hasErrors) throw new Error(res.errors[0].ckErrorCode); }
    } catch (e) { console.log("report failed", e); }
    if (it.o) window.wantdBlocks.add(it.o);
    closePiece();
  });

  // --- The pot.
  const startGift = async () => {
    const code = it.pc || VIEWER || "EUR";
    const gift = { contributions: [], currencyCode: code };
    if (typeof it.pa === "number") gift.targetAmount = it.pa;
    // A pot someone opened meanwhile is joined, never emptied.
    try {
      if (viaBridge()) { await Bridge().startGift(it.id, code); await readState(it); }
      else await changeState(it, (s) => (s.gift ? null : { groupGiftJSON: f(giftB64(gift), "BYTES") }));
    } catch (e) { console.log("start gift failed", e); return; }
    const s = live.get(it.id); render();
    openContribute((s && s.gift) || gift, null);
  };
  const openContribute = (gift, mineC) => openSheet((panel) => {
    const head = el("div", "whead left"); head.appendChild(el("h2", "wtitle", F.yourShare)); head.appendChild(el("p", "wsub", it.n)); panel.appendChild(head);
    const name = textInput(mineC ? mineC.contributorName : ((m.profile && m.profile.n) || ""), F.namePrompt, { caps: "words" });
    const amount = textInput(mineC ? String(mineC.amount) : "", "50", { type: "text" }); amount.inputMode = "decimal";
    panel.appendChild(labeled(F.yourName, name));
    panel.appendChild(labeled(F.amount + " (" + (gift.currencyCode || it.pc || VIEWER || "EUR") + ")", amount));
    const foot = el("div", "wfoot"); panel.appendChild(foot);
    const err = el("div", "wnote"); foot.appendChild(err);
    const ok = bar(F.confirmShare, async () => {
      const a = Number(amount.value.trim().replace(",", ".")); const n = name.value.trim();
      if (!(a > 0) || !n) return;
      ok.disabled = true;
      try {
        if (viaBridge()) { const s0 = live.get(it.id); if (!(s0 && s0.gift)) await Bridge().startGift(it.id, gift.currencyCode || it.pc || VIEWER || "EUR"); await Bridge().contribute(it.id, n, a); await readState(it); }
        else await mutateGift((g) => {
          g.contributions = (g.contributions || []).filter((c) => !(c.contributorID === m.id || (!c.contributorID && c.contributorName === n)));
          g.contributions.push({ id: (mineC && mineC.id) || crypto.randomUUID().toUpperCase(), contributorName: n, amount: a, date: nowCK(), contributorID: m.id });
        });
        closeSheet(); render();
      } catch (e) { ok.disabled = false; err.textContent = F.shareFailed + ". " + F.potUntouched; }
    });
    foot.appendChild(ok);
    setTimeout(() => (mineC ? amount : name).focus({ preventScroll: true }), 50);
  });
  const removeShare = async () => {
    try {
      if (viaBridge()) { await Bridge().withdraw(it.id); await readState(it); }
      else await mutateGift((g) => { g.contributions = (g.contributions || []).filter((c) => c.contributorID !== m.id); });
    } catch (e) { K.alert(F.removeFailed, F.checkConn, F.done, async () => {}); }
    render();
  };
  const mutateGift = (change) => changeState(it, (s) => {
    const g = s.gift ? JSON.parse(JSON.stringify(s.gift)) : { contributions: [] };
    if (!g.currencyCode) g.currencyCode = it.pc || VIEWER || "EUR";
    if (g.targetAmount == null && typeof it.pa === "number") g.targetAmount = it.pa;
    change(g);
    return { groupGiftJSON: f(giftB64(g), "BYTES") };
  });

  render();
  readState(it).then((s) => { if (s) render(); });
}

// Rewant: her mark on the shared counter, as the app writes it.
async function rewantName(url) {
  const data = new TextEncoder().encode(urlKey(url));
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", data));
  return "rewant-" + [...digest.slice(0, 16)].map((b) => b.toString(16).padStart(2, "0")).join("") + "-" + me().id;
}
async function addRewant(it) {
  if (!it.u) return;
  const fields = { productURL: f(urlKey(it.u), "STRING"), userID: f(me().id, "STRING") };
  if (it.o && it.o !== me().id) {
    fields.originOwnerID = f(it.o, "STRING");
    if (it.n) fields.itemName = f(it.n, "STRING");
    if (me().profile && me().profile.h) fields.rewanterHandle = f(me().profile.h, "STRING");
  }
  const res = await db().saveRecords([{ recordType: "Rewant", recordName: await rewantName(it.u), fields }], { operationType: "forceUpdate" });
  if (res.hasErrors && !res.errors.every((e) => e.ckErrorCode === "CONFLICT")) throw new Error(res.errors[0].ckErrorCode);
  const k = urlKey(it.u); river.counts.set(k, (river.counts.get(k) || 0) + 1);
}
async function removeRewant(it) {
  if (!it.u) return;
  if (viaBridge()) {
    try { const r = await Bridge().unrewant(it.u); if (r.rewantRecordDeleted) { const k = urlKey(it.u); river.counts.set(k, Math.max(0, (river.counts.get(k) || 1) - 1)); } } catch (e) {}
    return;
  }
  // Counted down only when a mark of hers was really there: on her own
  // original there is none (the app's "no-op").
  let had = false;
  try { const res = await db().deleteRecords([{ recordName: await rewantName(it.u) }]); had = !res.hasErrors; } catch (e) {}
  if (!had) return;
  const k = urlKey(it.u); river.counts.set(k, Math.max(0, (river.counts.get(k) || 1) - 1));
}
const ownerName = (it) => { const p = river.profiles[it.o]; if (p) return p.n || p.h || ""; if (visit.owner === it.o && visit.profile) return visit.profile.n || ""; const fr = circle.friends.find((x) => x.owner === it.o); return fr ? fr.profile.n : ""; };
const ownerHandle = (it) => { const p = river.profiles[it.o]; if (p && p.h) return p.h; if (visit.owner === it.o && visit.profile) return visit.profile.h; const fr = circle.friends.find((x) => x.owner === it.o); return fr ? fr.profile.h : ""; };

// ---------------------------------------------------------------------------
// The door from the feed page.
// ---------------------------------------------------------------------------
let wired = false;
function wire() {
  K.buildDoor($("fDoorWays"));
  $("fNewLabel").textContent = F.newFromFriends;
  $("fSearch").addEventListener("click", openMemberSearch);
  $("vBack").addEventListener("click", () => history.back());
  $("vFollow").addEventListener("click", toggleFollow);
  $("vPledge").textContent = F.pledge; $("vPledge").addEventListener("click", openPledgeSheet);
  $("vFounder").textContent = F.founder;
  $("vNotFoundTitle").textContent = F.notFound; $("vNotFoundBody").textContent = F.checkHandle;
  $("vSortLabel").textContent = window.Wishes.kit.W.sort; $("vFilterLabel").textContent = window.Wishes.kit.W.filter;
  const sort = $("vSort");
  for (const [k, label] of [["manual", K.W.sortDefault], ["recent", K.W.sortNewest], ["oldest", K.W.sortOldest], ["priceAsc", K.W.sortPriceUp], ["priceDesc", K.W.sortPriceDown]]) { const o = el("option", null, label); o.value = k; sort.appendChild(o); }
  sort.addEventListener("change", () => { visit.sort = sort.value; paintVisit(); });
  $("vFilter").addEventListener("click", openVisitFilter);
}
// On the Feed too, from the first page (FeedView.swift:990): the member link.
$("memberLink").textContent = F.lookingMember; $("memberLink").addEventListener("click", openMemberSearch);
window.Friends = {
  enter(handle) {
    window.Wishes.wake();   // the member is signed in once, for both tabs
    if (!wired) { wired = true; wire(); }
    const signedIn = !!me().id;
    if (handle) { if (signedIn) { if (visit.handle !== handle) openProfile(handle); else paintVisit(); } else { visit.handle = handle; paintVisit(); } }
    else { visit.handle = ""; paintVisit(); }
    if (signedIn && !circle.loaded && !circle.loading && restoreCircle()) { paintCircle(); if (Date.now() - circle.at > 60000) loadCircle(); return; }
    paintCircle();
    if (signedIn && !circle.loaded && !circle.loading) loadCircle();
  },
  othersActions, removeRewant,
  ownerName, ownerHandle,
  onAuth() { circle.loaded = false; circle.loading = false; circle.friends = []; circle.pending = []; if (!$("friends").hidden) window.Friends.enter(visit.handle); },
  isBlocked: (owner) => blocked.has(owner),
};
if (!document.getElementById("friends").hidden) window.Friends.enter(new URL(location.href).searchParams.get("u") || "");
// The member is known from the first page, the Feed included: "Also want
// this" and Report need her there too.
window.Wishes.wake();
})();
