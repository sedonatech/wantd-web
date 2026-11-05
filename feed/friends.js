// The Friends tab of Wantd on the web (SED-943): her circle, a friend's
// lists, and what one does on a friend's piece: Also want this, Reserve,
// Send to someone, Report, the group gift, the promise. Screen for screen
// as the Mac's FriendsView, VisitProfileView and ProductDetailView, with
// the same records in CloudKit as the iPhone writes.
(function () {
"use strict";
const K = window.Wishes.kit;   // the Wishlist's own tools: me, db, sheets, fields
const { el, $, f, bar, quietLine, labeled, textInput, openSheet, closeSheet, queryAll, db, me } = K;

const F = FR ? {
  newFromFriends: "Nouveau chez vos amis", friendsN: (n) => `${n} ${n === 1 ? "ami" : "amis"}`, following: "Abonnements",
  waitBack: "Vous deviendrez amis dès que ces personnes vous suivront en retour.",
  none: "Pas encore d’amis.", noneBody: "Vos amis sont les personnes que vous suivez et qui vous suivent en retour. Partagez votre pseudo, ou trouvez quelqu’un.",
  find: "Trouver quelqu’un", share: (h) => `Partager @${h}`, finding: "Recherche de vos amis…",
  wantsN: (n) => `${n} ${n === 1 ? "envie" : "envies"}`, followersN: (n) => `${n.toLocaleString(LOCALE)} ${n === 1 ? "abonné" : "abonnés"}`,
  bdToday: "anniversaire aujourd’hui", bdTomorrow: "anniversaire demain", bdIn: (d) => `anniversaire dans ${d} jour${d > 1 ? "s" : ""}`, bdOn: (s) => `anniversaire le ${s}`,
  pledge: "Vous hésitez ? Offrez un montant, laissez choisir", follow: "Suivre", followingYou: "Vous suivez", founder: "Fondatrice",
  all: "Tout", granted: "Exaucées", nothing: "Rien sur cette liste pour l’instant.", notFound: "Profil introuvable", checkHandle: "Vérifiez le pseudo et réessayez.",
  lookingMember: "Vous cherchez un membre ? Visitez sa liste", searchMember: "Rechercher", noMember: "Aucun membre à ce nom pour l’instant.",
  alsoWant: "Moi aussi", added: "Ajoutée à votre liste d’envies. Touchez pour la retirer", unwantAsk: "Retirer cette envie ?", unwantBody: "Elle quitte votre liste d’envies, et votre marque d’envie disparaît partout.", unwant: "Retirer",
  whichList: "Dans quelle liste ?", mainUnless: "Votre liste d’envies principale, sauf si vous en choisissez une.", tapToAdd: "Touchez pour ajouter ou retirer", addToMine: "Ajouter à ma liste d’envies",
  reserve: "Réserver ce cadeau", reservedByYou: "Réservé par vous. Touchez pour annuler", alreadyReserved: "Déjà réservé",
  reserveAsk: "Réserver ce cadeau ?", reserveBody: "Réserver indique à tous que ce cadeau est pris : personne d’autre ne l’offrira. Ne réservez que si vous comptez vraiment l’offrir.", reserveOk: "Réserver", cancel: "Annuler",
  someoneReserved: "Quelqu’un a réservé ce cadeau.", grantedLine: "Cette envie est déjà exaucée.",
  send: "Envoyer à quelqu’un", preparing: "Préparation…", sendText: (who, name, link) => who ? `Regardez ce dont ${who} a envie : ${name}. Ouvrez-le dans Wantd pour participer. ${link}` : `Regardez ce dont quelqu’un a envie : ${name}. Ouvrez-le dans Wantd pour participer. ${link}`,
  copied: "Lien copié", giftCard: "Envoyer plutôt une carte cadeau",
  report: "Signaler", reported: "Signalé", reportAsk: "Signaler cette envie ?", reportBody: "Nous examinons chaque signalement sous 24 heures. Vous ne verrez plus rien de ce membre, dès maintenant.", reportOk: "Signaler et bloquer ce membre",
  groupGift: "Cadeau à plusieurs", startGift: "Lancer un cadeau à plusieurs", addShare: "Ajouter ma participation", editShare: "Modifier ma participation", removeShare: "Retirer ma participation",
  yourShare: "Votre participation", yourName: "Votre nom", namePrompt: "ex. Camille", amount: "Montant", confirmShare: "Confirmer la participation",
  shareFailed: "Impossible d’enregistrer votre participation", potUntouched: "La cagnotte est restée telle quelle. Vérifiez votre connexion et réessayez.",
  letChoose: "Laisser choisir", nameAmount: (n) => `Indiquez un montant. ${n} choisit la pièce qu’il deviendra, et vous l’achetez vous-même.`, promise: "Le promettre", oneMoment: "Un instant…",
  promiseWith: (n) => `Votre promesse est chez ${n}.`, theyChoose: "Cette personne choisira une pièce dans sa liste d’envies, et vous le saurez.", failed: "Cela n’a pas abouti", checkConn: "Vérifiez votre connexion et réessayez.",
  from: (n) => `Repérée par ${n}`, keeps: "Wantd garde votre liste dans iCloud.", signIn: "Se connecter avec Apple", done: "OK",
} : {
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
  send: "Send to someone", preparing: "Preparing...", sendText: (who, name, link) => who ? `Look what ${who} wants: ${name}. Open it in Wantd to add your share. ${link}` : `Look what someone wants: ${name}. Open it in Wantd to add your share. ${link}`,
  copied: "Link copied", giftCard: "Send a gift card instead",
  report: "Report", reported: "Reported", reportAsk: "Report this want?", reportBody: "We look at every report within 24 hours. You will stop seeing anything from this member straight away.", reportOk: "Report and block this member",
  groupGift: "Group gift", startGift: "Start a group gift", addShare: "Add my contribution", editShare: "Edit my contribution", removeShare: "Remove my contribution",
  yourShare: "Your contribution", yourName: "Your name", namePrompt: "e.g. Camille", amount: "Amount", confirmShare: "Confirm contribution",
  shareFailed: "Couldn't save your contribution", potUntouched: "The pot was left as it was. Check your connection and try again.",
  letChoose: "Let them choose", nameAmount: (n) => `Name an amount. ${n} picks the piece it becomes, and you shop it yourself.`, promise: "Promise it", oneMoment: "One moment...",
  promiseWith: (n) => `Your promise is with ${n}.`, theyChoose: "They will choose a piece from their wishlist, and you will hear about it.", failed: "That did not go through", checkConn: "Check your connection and try again.",
  from: (n) => `From ${n}`, keeps: "Wantd keeps your list in iCloud.", signIn: "Sign in with Apple", done: "Done",
};

const FOUNDER = "_e4a756c55355bc6245fe776aede18bbb";
const SHARE_HOST = "https://wantd.sedonatech.uk";
const ITEM_KEYS = ["name", "brand", "store", "priceText", "priceAmount", "priceCurrency", "urlString", "status", "addedAt", "sortIndex", "reservedBy", "listIDs", "alsoWantedBy", "imageCandidateURLs", "imageURLString", "ownerID", "rewantedFrom", "ownPhoto", "imageAsset", "groupGiftJSON"];

// ---------------------------------------------------------------------------
// State.
// ---------------------------------------------------------------------------
const circle = { loaded: false, loading: false, error: null, following: [], mutual: new Set(), friends: [], pending: [], at: 0 };
const visit = { handle: "", owner: "", profile: null, lists: [], items: [], listID: null, shelf: false, sort: "manual", loading: false, notFound: false, seq: 0, following: false };
const blocked = new Set(JSON.parse(localStorage.getItem("wantd.blocked") || "[]"));
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

async function loadCircle() {
  if (circle.loading) return;
  circle.loading = true; circle.error = null; paintCircle();
  try {
    // On a local try, three members of the community stand in for her circle.
    const following = K.DEMO ? ((await getJSON("/people?q=mar&limit=3")).people || []).map((p) => p.o) : await followedIDs();
    const mutual = K.DEMO ? new Set(following) : await mutualIDs(following);
    const friends = [];
    await Promise.all([...mutual].map(async (owner) => {
      if (blocked.has(owner)) return;
      const page = await memberPage(owner);
      if (!page || !page.profile) return;
      const items = (page.items || []).filter((it) => it.n && it.u);
      const latest = items.filter(hasPhoto).sort((a, b) => b.at - a.at).slice(0, 6);
      friends.push({ owner, profile: page.profile, wantCount: items.length, latest });
    }));
    const pendingIDs = following.filter((id) => !mutual.has(id));
    const pending = [];
    await Promise.all(pendingIDs.map(async (owner) => {
      const known = river.profiles[owner];
      if (known) { pending.push({ owner, h: known.h, n: known.n }); return; }
      const page = await memberPage(owner);
      if (page && page.profile) pending.push({ owner, h: page.profile.h, n: page.profile.n });
    }));
    pending.sort((a, b) => (a.n || "").localeCompare(b.n || ""));
    circle.following = following; circle.mutual = mutual; circle.friends = friends; circle.pending = pending; circle.loaded = true; circle.at = Date.now();
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
function avatar(p, size, cls) {
  const a = el("div", "wavatar " + (cls || "")); a.style.width = a.style.height = size + "px";
  if (p && p.avatarURL) { const img = el("img"); img.src = p.avatarURL; img.alt = ""; img.referrerPolicy = "no-referrer"; a.appendChild(img); }
  else { const l = el("span", "letter", ((p && (p.e || (p.n || "?").trim().charAt(0))) || "?").toUpperCase()); l.style.fontSize = Math.round(size * 0.55) + "px"; a.appendChild(l); }
  return a;
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
      const people = (page && page.people) || [];
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
  Object.assign(visit, { handle, owner: "", profile: null, lists: [], items: [], listID: null, shelf: false, loading: true, notFound: false, following: false });
  paintVisit();
  // Who she is: the worker knows her by handle.
  let person = null;
  try {
    const page = await getJSON("/people?q=" + encodeURIComponent(handle) + "&limit=8");
    person = (page.people || []).find((p) => p.h === handle) || null;
  } catch (e) {}
  if (seq !== visit.seq) return;
  if (!person) { visit.loading = false; visit.notFound = true; paintVisit(); return; }
  visit.owner = person.o;
  visit.profile = { h: person.h, n: person.n, fr: person.fr || 0, fg: person.fg || 0, b: person.b, e: person.e };
  visit.following = circle.loaded ? circle.following.includes(person.o) : false;
  paintVisit();
  if (K.DEMO) {
    const page = await memberPage(person.o);
    if (seq !== visit.seq) return;
    visit.items = ((page && page.items) || []).map((it, i) => Object.assign({ si: i, st: "available", l: it.l || [] }, it));
    visit.loading = false; paintVisit(); return;
  }
  try {
    const [items, lists, profiles, followRows] = await Promise.all([
      queryAll({ recordType: "Item", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: person.o } }] }, { resultsLimit: 200, desiredKeys: ITEM_KEYS }),
      queryAll({ recordType: "List", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: person.o } }] }, { resultsLimit: 200 }).catch(() => []),
      queryAll({ recordType: "Profile", filterBy: [{ fieldName: "ownerID", comparator: "EQUALS", fieldValue: { value: person.o } }] }, { resultsLimit: 5, desiredKeys: ["avatarAsset", "avatarEmoji"] }).catch(() => []),
      circle.loaded ? Promise.resolve(null) : queryAll({ recordType: "Follow", filterBy: [
        { fieldName: "followerID", comparator: "EQUALS", fieldValue: { value: me().id } },
        { fieldName: "followedID", comparator: "EQUALS", fieldValue: { value: person.o } }] }, { resultsLimit: 2, desiredKeys: ["status"] }).catch(() => []),
    ]);
    if (seq !== visit.seq) return;
    const all = lists.map(K.listFromRecord).filter((l) => l.id);
    const privateIDs = new Set(all.filter((l) => l.isPrivate).map((l) => l.id));
    visit.lists = all.filter((l) => !l.isPrivate && !l.isMain).sort((a, b) => a.createdAt - b.createdAt);
    // A piece filed only on private lists stays with her (hidingPrivate).
    visit.items = items.map(K.itemFromRecord).filter((it) => it.n && it.u !== undefined && !((it.l || []).length && (it.l || []).every((id) => privateIDs.has(id))));
    const av = profiles[0] && profiles[0].fields;
    if (av && av.avatarAsset && av.avatarAsset.value && av.avatarAsset.value.downloadURL) visit.profile.avatarURL = String(av.avatarAsset.value.downloadURL).replace("${f}", "avatar.jpg");
    if (followRows) visit.following = followRows.some((r) => r.fields.status && r.fields.status.value === "accepted");
  } catch (e) { console.log("visit load failed", e); }
  visit.loading = false;
  paintVisit();
}

const isHadByOwner = (it) => it.st === "purchased";
function visitShown() {
  let list = visit.items.slice();
  if (visit.shelf) list = list.filter(isHadByOwner);
  else { list = list.filter((it) => !isHadByOwner(it)); if (visit.listID) list = list.filter((it) => (it.l || []).includes(visit.listID)); }
  const by = { manual: (a, b) => a.si - b.si || b.at - a.at, recent: (a, b) => b.at - a.at, oldest: (a, b) => a.at - b.at }[visit.sort] || ((a, b) => a.si - b.si);
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
  const count = visit.items.filter((it) => !isHadByOwner(it)).length;
  $("vFacts").textContent = p ? `@${p.h} · ${F.wantsN(visit.items.length ? count : 0)} · ${F.followersN(p.fr || 0)}` : "";
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
  wall.add(list, { counts: (it) => river.counts.get(urlKey(it.u)) || (it.aw ? it.aw.length : 0), status: true });
}

async function toggleFollow() {
  if (!visit.owner || visit.owner === me().id) return;
  const was = visit.following;
  visit.following = !was; visit.profile.fr = Math.max(0, (visit.profile.fr || 0) + (was ? -1 : 1)); paintVisit();
  try {
    const name = `follow-${me().id}-${visit.owner}`;
    if (was) {
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
  try {
    const res = await db().fetchRecords([{ recordName: it.id }], { desiredKeys: ["status", "reservedBy", "groupGiftJSON", "alsoWantedBy"] });
    if (res.hasErrors || !res.records[0]) return null;
    const r = res.records[0];
    const gj = r.fields.groupGiftJSON && r.fields.groupGiftJSON.value;
    let gift = null;
    if (gj) { try { gift = JSON.parse(atob(gj)); } catch (e) { gift = null; } }
    const s = { st: (r.fields.status && r.fields.status.value) || "available", rb: r.fields.reservedBy && r.fields.reservedBy.value, gift, _tag: r.recordChangeTag, aw: (r.fields.alsoWantedBy && r.fields.alsoWantedBy.value) || [] };
    live.set(it.id, s);
    return s;
  } catch (e) { return null; }
}
const giftB64 = (gift) => btoa(unescape(encodeURIComponent(JSON.stringify(gift))));
const nowCK = () => Date.now() / 1000 - 978307200;   // seconds since 2001, as JSONEncoder writes a Date

async function writeState(it, fields) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const s = live.get(it.id) || await readState(it);
    const res = await db().saveRecords([{ recordType: "Item", recordName: it.id, recordChangeTag: s && s._tag, fields }]);
    if (!res.hasErrors) { await readState(it); return true; }
    if (res.errors.some((e) => e.ckErrorCode === "CONFLICT") && attempt === 0) { await readState(it); continue; }
    throw new Error(res.errors.map((e) => e.ckErrorCode + " " + (e.reason || "")).join(", "));
  }
  return false;
}

function othersActions(it, body) {
  const m = me();
  if (!m.id || it.o === m.id) return;
  const acts = body.querySelector(".acts");
  const box = el("div", "facts");
  acts.insertAdjacentElement("afterend", box);
  const lines = el("div", "flines"); box.appendChild(lines);
  const pot = el("div", "fpot"); box.appendChild(pot);
  const alreadyMine = () => !!it.u && m.items.some((x) => x.u && urlKey(x.u) === urlKey(it.u));
  let didRepost = alreadyMine();
  const render = () => {
    lines.innerHTML = "";
    const s = live.get(it.id) || { st: it.st || "available", rb: it.rb, gift: null };
    // Also want this.
    if (it.u) {
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
    } else lines.appendChild(el("div", "fstatus", F.grantedLine));
    if (taken) lines.appendChild(el("div", "fstatus", F.someoneReserved));
    // Send to someone.
    lines.appendChild(quietLine(F.send, sendToSomeone));
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
      if (!alreadyMine()) await K.saveCopy(it, selected);
      await addRewant(it);
      const s = live.get(it.id); if (s && !s.aw.includes(m.id)) s.aw.push(m.id);
    } catch (e) { didRepost = alreadyMine(); render(); console.log("rewant failed", e); }
  };
  const confirmUnwant = () => K.alert(F.unwantAsk, F.unwantBody, F.unwant, async () => {
    const mine = m.items.find((x) => x.u && urlKey(x.u) === urlKey(it.u));
    if (mine) await K.deletePiece(mine);
    await removeRewant(it);
    didRepost = false; render();
  });

  // --- Reserve.
  const confirmReserve = () => K.alert(F.reserveAsk, F.reserveBody, F.reserveOk, () => toggleReserve(true));
  const toggleReserve = async (on) => {
    try { await writeState(it, { status: f(on ? "reserved" : "available", "STRING"), reservedBy: f(on ? m.id : null, "STRING") }); }
    catch (e) { console.log("reserve failed", e); }
    render();
  };

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
      const res = await db().saveRecords([{ recordType: "Report", recordName: "report-" + crypto.randomUUID().toUpperCase(), fields: {
        reporterID: f(m.id, "STRING"), reportedOwnerID: f(it.o || "", "STRING"), itemID: f(it.id, "STRING"), itemName: f(it.n || "", "STRING"),
        reason: f("reported from the product card", "STRING"), reportedAt: f(Date.now(), "TIMESTAMP") } }]);
      if (res.hasErrors) throw new Error(res.errors[0].ckErrorCode);
    } catch (e) { console.log("report failed", e); }
    if (it.o) { blocked.add(it.o); try { localStorage.setItem("wantd.blocked", JSON.stringify([...blocked])); } catch (e) {} }
    closePiece();
  });

  // --- The pot.
  const startGift = async () => {
    const code = it.pc || VIEWER || "EUR";
    const gift = { contributions: [], currencyCode: code };
    if (typeof it.pa === "number") gift.targetAmount = it.pa;
    try { await writeState(it, { groupGiftJSON: f(giftB64(gift), "BYTES") }); } catch (e) { console.log("start gift failed", e); return; }
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
        await mutateGift((g) => {
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
    try { await mutateGift((g) => { g.contributions = (g.contributions || []).filter((c) => c.contributorID !== m.id); }); } catch (e) {}
    render();
  };
  const mutateGift = async (change) => {
    const s = await readState(it);
    const g = (s && s.gift) || { contributions: [] };
    if (!g.currencyCode) g.currencyCode = it.pc || VIEWER || "EUR";
    if (g.targetAmount == null && typeof it.pa === "number") g.targetAmount = it.pa;
    change(g);
    await writeState(it, { groupGiftJSON: f(giftB64(g), "BYTES") });
  };

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
  try { await db().deleteRecords([{ recordName: await rewantName(it.u) }]); } catch (e) {}
  const k = urlKey(it.u); river.counts.set(k, Math.max(0, (river.counts.get(k) || 1) - 1));
}
const ownerName = (it) => { const p = river.profiles[it.o]; if (p) return p.n || p.h || ""; if (visit.owner === it.o && visit.profile) return visit.profile.n || ""; const fr = circle.friends.find((x) => x.owner === it.o); return fr ? fr.profile.n : ""; };
const ownerHandle = (it) => { const p = river.profiles[it.o]; if (p && p.h) return p.h; if (visit.owner === it.o && visit.profile) return visit.profile.h; const fr = circle.friends.find((x) => x.owner === it.o); return fr ? fr.profile.h : ""; };

// ---------------------------------------------------------------------------
// The door from the feed page.
// ---------------------------------------------------------------------------
let wired = false;
function wire() {
  $("fKeeps").textContent = F.keeps; $("fAppleText").textContent = F.signIn;
  $("fApple").addEventListener("click", () => { const b = $("ckSignIn").querySelector(".apple-auth-button, button, [role=button], div"); if (b) b.click(); });
  $("fNewLabel").textContent = F.newFromFriends;
  $("fSearch").addEventListener("click", openMemberSearch);
  $("vBack").addEventListener("click", () => history.back());
  $("vFollow").addEventListener("click", toggleFollow);
  $("vPledge").textContent = F.pledge; $("vPledge").addEventListener("click", openPledgeSheet);
  $("vFounder").textContent = F.founder;
  $("vNotFoundTitle").textContent = F.notFound; $("vNotFoundBody").textContent = F.checkHandle;
  $("vSortLabel").textContent = window.Wishes.kit.W.sort; $("vFilterLabel").textContent = window.Wishes.kit.W.filter;
  const sort = $("vSort");
  for (const [k, label] of [["manual", K.W.sortDefault], ["recent", K.W.sortNewest], ["oldest", K.W.sortOldest]]) { const o = el("option", null, label); o.value = k; sort.appendChild(o); }
  sort.addEventListener("change", () => { visit.sort = sort.value; paintVisit(); });
  $("memberLink").textContent = F.lookingMember; $("memberLink").addEventListener("click", openMemberSearch);
}
window.Friends = {
  enter(handle) {
    window.Wishes.wake();   // the member is signed in once, for both tabs
    if (!wired) { wired = true; wire(); }
    const signedIn = !!me().id;
    if (handle) { if (signedIn) { if (visit.handle !== handle) openProfile(handle); else paintVisit(); } else { visit.handle = handle; paintVisit(); } }
    else { visit.handle = ""; paintVisit(); }
    paintCircle();
    if (signedIn && !circle.loaded && !circle.loading) loadCircle();
  },
  othersActions,
  ownerName, ownerHandle,
  onAuth() { circle.loaded = false; circle.friends = []; circle.pending = []; if (!$("friends").hidden) window.Friends.enter(visit.handle); },
  isBlocked: (owner) => blocked.has(owner),
};
if (!document.getElementById("friends").hidden) window.Friends.enter(new URL(location.href).searchParams.get("u") || "");
})();
