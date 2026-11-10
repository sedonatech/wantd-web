// A wishlist's link, /@handle (the one the app and the Share button pass on),
// opens the right screen for whoever clicks it, as a profile link does on
// Instagram: her own Wishlist when it is hers, that member in Friends when
// she is signed in to Wantd here, the public board otherwise. This browser's
// handle is kept by feed/wishes.js (wantd.me.handle).
(function () {
  var m = location.pathname.match(/^\/@([\w-]+)\/?$/);
  if (!m) return;
  var h = m[1].toLowerCase(), q = location.search.slice(1), mine = null;
  try { mine = localStorage.getItem("wantd.me.handle"); } catch (e) {}
  var params = new URLSearchParams(q), p = params.get("p"), list = params.get("list");
  var tail = q ? "&" + q : "";
  if (mine && !list) location.replace(mine === h ? "/feed/?tab=wishes" + tail : "/feed/?tab=friends&u=" + encodeURIComponent(h) + tail);
  else if (p && !list) location.replace("/feed/?p=" + encodeURIComponent(p));
  else location.replace("/board/?handle=" + encodeURIComponent(m[1]) + tail);
})();
