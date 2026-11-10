// Her account on the web, whichever way she came in (SED-949, Agathe's
// decision of 5 November 2026: one Wantd account on every device, by Apple,
// Google or a code sent by email). Apple stays what it was: CloudKit JS signs
// her in and the page reads and writes iCloud as herself. Google and email
// have no Apple identity: their account lives on the server (the Android
// bridge, wantd-android), which keeps the same records with its own key, and
// every read and write of such a member goes through it, exactly as the
// Android app's do. This file holds that session and the bridge's routes,
// translated into the shapes the page already draws; the screens stay in
// wishes.js and friends.js.
(function () {
"use strict";

const BRIDGE = LOCAL ? "/__bridge" : "https://wantd-android.wantd-reserve.workers.dev";
// The project's web client, the one Android hands Google as its server client.
const GOOGLE_CLIENT_ID = "781336407988-fvs1sevmsod0ihh3va8i3l45h0bb2p78.apps.googleusercontent.com";
const KEY = "wantd.account.v1";

// ---------------------------------------------------------------------------
// The session: a bearer the bridge gave, kept in this browser.
// ---------------------------------------------------------------------------
let current = null;   // { session, ownerID, via: "google" | "email" }
const listeners = [];
function read() {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || "null");
    current = c && typeof c.session === "string" && /^_[0-9a-f]{32}$/.test(c.ownerID || "") ? c : null;
  } catch (e) { current = null; }
}
function keep(c) {
  current = c;
  try { if (c) localStorage.setItem(KEY, JSON.stringify(c)); else localStorage.removeItem(KEY); } catch (e) {}
  for (const fn of listeners) { try { fn(identity()); } catch (e) { console.log("account listener", e); } }
}
function identity() { return current ? { id: current.ownerID, via: "bridge", how: current.via } : null; }

class BridgeError extends Error {
  constructor(status, code, detail) { super(code + (detail ? " " + detail : "")); this.status = status; this.code = code; this.detail = detail || ""; }
}

/// One call to the bridge. A session it no longer knows ends here too: the
/// doors show again, as on Android ("Come in again to find your list").
async function api(method, path, body) {
  const headers = { "Accept": "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (current) headers.Authorization = "Bearer " + current.session;
  let res;
  try { res = await fetch(BRIDGE + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }); }
  catch (e) { throw new BridgeError(0, "unreachable"); }
  let j = null;
  try { j = await res.json(); } catch (e) { j = null; }
  if (res.ok) return j || {};
  const code = (j && j.error && j.error.code) || ("http_" + res.status), detail = (j && j.error && j.error.message) || "";
  if (res.status === 401 && current && path !== "/v1/session" && (detail === "session_unknown" || detail === "session_malformed")) keep(null);
  throw new BridgeError(res.status, code, detail);
}

/// A proof traded for a session: `{ google }` or `{ email, code }`.
async function open(proof, via) {
  const r = await api("POST", "/v1/session", proof);
  if (!r.session || !r.ownerID) throw new BridgeError(0, "no_session");
  keep({ session: r.session, ownerID: r.ownerID, via });
  return r;
}
async function signOut() {
  const had = current;
  keep(null);
  if (had) { try { await fetch(BRIDGE + "/v1/session", { method: "DELETE", headers: { Authorization: "Bearer " + had.session } }); } catch (e) {} }
}

// ---------------------------------------------------------------------------
// Google: its own button (Google Identity Services), the ID token it hands
// back is the proof.
// ---------------------------------------------------------------------------
let gsi = null;
function loadGoogle() {
  if (gsi) return gsi;
  gsi = new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) { resolve(window.google.accounts.id); return; }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client"; s.async = true; s.defer = true;
    s.onload = () => resolve(window.google.accounts.id);
    s.onerror = () => { gsi = null; reject(new Error("gsi")); };
    document.head.appendChild(s);
  });
  return gsi;
}
let googleReady = null;
/// Draws Google's button into `host`; `onDone(error)` once the sign-in ended.
async function googleButton(host, onDone) {
  const id = await loadGoogle();
  if (!googleReady) {
    googleReady = true;
    id.initialize({
      client_id: GOOGLE_CLIENT_ID, ux_mode: "popup", itp_support: true,
      callback: async (res) => {
        try { await open({ google: res.credential }, "google"); for (const fn of pending) fn(null); }
        catch (e) { for (const fn of pending) fn(e); }
        pending.length = 0;
      },
    });
  }
  pending.push(onDone);
  const dark = matchMedia("(prefers-color-scheme: dark)").matches;
  id.renderButton(host, { type: "standard", theme: dark ? "filled_black" : "outline", size: "large", text: "continue_with", shape: "pill", logo_alignment: "left", width: Math.min(320, host.clientWidth || 320), locale: FR ? "fr" : "en" });
}
const pending = [];

// ---------------------------------------------------------------------------
// Email: a six-digit code, sent by the bridge, typed back.
// ---------------------------------------------------------------------------
const requestCode = (email) => api("POST", "/v1/email-code", { email });
const verifyCode = (email, code) => open({ email, code }, "email");

// ---------------------------------------------------------------------------
// The bridge's objects, in the shapes the page draws (wishes.js
// itemFromRecord / listFromRecord, the index's own letters).
// ---------------------------------------------------------------------------
function giftOf(g, me) {
  if (!g) return null;
  const out = { contributions: (g.contributions || []).map((c) => ({ contributorName: c.name, amount: c.amount, contributorID: c.mine ? me : undefined })) };
  if (typeof g.targetAmount === "number") out.targetAmount = g.targetAmount;
  if (g.currencyCode) out.currencyCode = g.currencyCode;
  return out;
}
function itemOf(v) {
  const me = current ? current.ownerID : "";
  const st = v.status || "available";
  const it = {
    id: v.id, n: v.name || "", b: v.brand || undefined, s: v.store || undefined,
    pt: v.priceText || undefined, pa: typeof v.priceAmount === "number" ? v.priceAmount : undefined, pc: v.priceCurrency || undefined,
    u: v.urlString || "", i: v.imageURLString || undefined, ic: v.imageCandidateURLs || [],
    at: v.addedAt || Date.now(), l: v.listIDs || [], o: v.ownerID,
    si: typeof v.sortIndex === "number" ? v.sortIndex : 0, st,
    // Who reserved it is never named by the bridge: hers, or someone's.
    rb: v.reservedByMe || (st === "purchased" && v.ownerID === me) ? me : (st === "reserved" ? "someone" : undefined),
    note: v.personalNote || undefined, aw: v.alsoWantedBy || [], rf: v.rewantedFrom || undefined, _tag: null,
    nc: v.netContent || undefined, ncf: v.netContentFor || undefined, rn: v.reservedNote || undefined,
    gift: giftOf(v.groupGift, me),
  };
  if (v.ownPhoto && v.imageAssetURL) { it.op = 1; it.ia = v.imageAssetURL; }
  return it;
}
function listOf(v) {
  return {
    id: v.id, name: v.name || "", isMain: !!v.isMain, isPrivate: !!v.isPrivate,
    memberIDs: v.memberIDs || [], memberSince: Object.entries(v.memberSince || {}).map(([k, ms]) => k + "|" + Math.round(ms / 1000)),
    creatorID: v.creatorID, createdAt: v.createdAt || 0, recordName: `list-${v.creatorID}-${v.id}`, _tag: null,
  };
}
function profileOf(p) {
  if (!p) return null;
  return { o: p.ownerID, h: p.handle || "", n: p.displayName || "", avatarURL: p.avatarURL || null, emoji: p.avatarEmoji || null, e: p.avatarEmoji || null, b: p.birthday || null };
}

const Bridge = {
  me: () => api("GET", "/v1/me"),
  async mine() {
    const [items, lists, meR] = await Promise.all([api("GET", "/v1/me/items"), api("GET", "/v1/me/lists"), api("GET", "/v1/me")]);
    return { items: (items.items || []).map(itemOf), lists: (lists.lists || []).map(listOf), shared: (lists.sharedWithMe || []).map(listOf), profile: profileOf(meR.profile) };
  },
  /// Her word on the lists shared with her: LISTUUID -> { state, at }.
  async words() {
    const [a, l] = await Promise.all([api("GET", "/v1/me/memberships?state=accepted"), api("GET", "/v1/me/memberships?state=left")]);
    const out = new Map();
    for (const [state, r] of [["accepted", a], ["left", l]]) for (const m of r.memberships || []) {
      const id = String(m.listID || "").toUpperCase(), prev = out.get(id);
      if (id && (!prev || (m.at || 0) >= (prev.at || 0))) out.set(id, { state, at: m.at || 0, tag: null });
    }
    return out;
  },
  sayToList: (id, state, at) => api("PUT", `/v1/lists/${id}/membership`, { state, at }),
  saveItem: async (id, body) => itemOf((await api("PUT", `/v1/items/${id}`, body)).item),
  deleteItem: (id) => api("DELETE", `/v1/items/${id}`),
  saveList: async (id, body) => listOf((await api("PUT", `/v1/lists/${id}`, body)).list),
  deleteList: (id) => api("DELETE", `/v1/lists/${id}`),
  handleFree: async (h) => (await api("GET", `/v1/handles/${encodeURIComponent(h)}`)).available === true,
  putProfile: async (body) => profileOf((await api("PUT", "/v1/me/profile", body)).profile),
  follow: (owner) => api("PUT", `/v1/follows/${owner}`, { silent: false }),
  unfollow: (owner) => api("DELETE", `/v1/follows/${owner}`),
  isFollowing: async (owner) => (await api("GET", `/v1/follows/${owner}`)).following === true,
  friends: () => api("GET", "/v1/me/friends"),
  profiles: async (ids) => ((await api("GET", "/v1/profiles?ownerIDs=" + ids.join(","))).profiles || []).map(profileOf),
  profile: async (handle) => { const r = await api("GET", `/v1/profiles/${encodeURIComponent(handle)}`); return { profile: profileOf(r.profile), lists: (r.lists || []).map(listOf), items: (r.items || []).map(itemOf) }; },
  item: async (id) => itemOf((await api("GET", `/v1/items/${id}`)).item),
  listItems: async (owner, id) => ((await api("GET", `/v1/lists/${owner}/${id}/items`)).items || []).map(itemOf),
  reserveNote: (id, note) => api("PUT", `/v1/items/${id}/reservation/note`, { note }),
  received: (id, on) => api("PUT", `/v1/items/${id}/received`, { received: !!on }),
  reserve: (id, on) => api(on ? "PUT" : "DELETE", `/v1/items/${id}/reservation`),
  rewant: (itemID, listIDs) => api("POST", "/v1/rewants", listIDs && listIDs.length ? { itemID, listIDs } : { itemID }),
  unrewant: (productURL) => api("POST", "/v1/rewants/remove", { productURL }),
  startGift: (id, currencyCode) => api("PUT", `/v1/items/${id}/group-gift`, currencyCode ? { currencyCode } : {}),
  contribute: (id, name, amount) => api("PUT", `/v1/items/${id}/group-gift/contribution`, { name, amount }),
  withdraw: (id) => api("DELETE", `/v1/items/${id}/group-gift/contribution`),
  report: (itemID, reason) => api("POST", "/v1/reports", { itemID, reason }),
  feedback: (text) => api("POST", "/v1/feedback", { text, appVersion: "web" }),
};

read();
window.Account = {
  identity, signOut, onChange: (fn) => listeners.push(fn),
  googleButton, requestCode, verifyCode, BridgeError,
  bridge: Bridge,
};
})();
