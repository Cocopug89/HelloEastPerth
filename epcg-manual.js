/* EAST PERTH HUB - MANUAL OVERLAY. Applied to window.HUB in the browser, at load.
 *
 * WHY THIS FILE EXISTS
 * hub-data.js is rewritten every weekday by east-perth-disruptions-weekly. Anything hand-edited
 * into it is destroyed at the next run. That is not theoretical: the SkyVista Ferris Wheel
 * location was corrected by hand, silently reverted to the auto-generated "Terrace Road Car Park"
 * value, and nobody noticed for weeks.
 *
 * Tools/hub-manual.json was created to fix that, but it only works if the scheduled task reads it,
 * and NO SCRIPT IN Tools/ APPLIES IT - the instruction lives in AGENT NOTES, and the task itself is
 * a local desktop scheduled task whose prompt cannot be read or edited from a cloud session. So the
 * fix could not be verified.
 *
 * THIS FILE DOES NOT DEPEND ON THE PIPELINE AT ALL. It is in the same class as epcg-events.js:
 * a hand-curated file the scrapers do not know about and therefore never rewrite. It loads
 * immediately after hub-data.js on every page and mutates window.HUB before the page reads it.
 * If the refresh wipes hub-data.js, the corrections come straight back on the next page load.
 *
 * *** THE SCRAPERS MUST NEVER WRITE TO THIS FILE. ***
 *
 * Keep Tools/hub-manual.json in step - it stays the source of truth for the build pipeline, and if
 * the pipeline ever does start applying it the results are identical (both are idempotent and
 * dedupe by id). Belt and braces, deliberately.
 *
 * THREE OPERATIONS
 *   overrides  patch named fields on a record that already exists, matched by id
 *   replace    remove a record by id and substitute one or more records
 *   seed       add records no scrape can produce (target: disruptions | notices)
 *
 * Anything with an `end` (disruptions) in the past is dropped automatically, so a finished event
 * cannot rot on the board. Notices are left to the board's own close-date logic, which already
 * moves them to the Closed filter.
 */
(function () {
  var M = {

    /* ---- overrides: auto-generated values that are simply wrong ---- */
    overrides: [
      { id: "EV-2026/224",
        set: { loc: "Riverside Dr near Governors Ave (foreshore), Perth", lat: -31.95953, lng: 115.86133 },
        why: "SkyVista Ferris Wheel. Auto value put it at the Terrace Road Car Park. It is on the foreshore. Reverted once already - this is the fix that keeps it." },
      { id: "OB-2026/746",
        set: { lng: 115.8761 },
        why: "Hay St tower crane removal - belongs at the Plain St corner (Garden Towers), not where the auto value placed it." }
    ],

    /* ---- replace: one scraped record that is actually several ---- */
    replace: [
      { id: "EV-2026/233",
        why: "Royal on the Waterfront is TWO single days, not a continuous span, and is not recurring.",
        with: [
          { id: "EV-2026/233a", start: "24/07/2026", end: "24/07/2026" },
          { id: "EV-2026/233b", start: "27/09/2026", end: "27/09/2026" }
        ],
        inherit: true }   /* the substitutes copy every other field from the record they replace */
    ],

    /* ---- seed: records the sources cannot produce ---- */
    seed: {
      /* SOURCE GAP: the scrape reads City of Perth public notices only. Optus Stadium sits OUTSIDE
         the City of Perth and its traffic management belongs to the venue and Main Roads, so no
         stadium road impact will ever appear - even though East Perth wears the traffic. Seed from
         the published fixture, which is available months ahead. Dates verified against the venues'
         own event pages, 31 Jul 2026. Road CLOSURES are deliberately not claimed: Main Roads has
         not been checked, so these describe congestion, parking pressure and pedestrian volume. */
      disruptions: [
        { id: "OB-2026/STADIUM-20260805", cat: "obstruction", sev: "medium", zone: "east",
          title: "Optus Stadium: AC Milan v Inter (Milan Derby) - East Perth access impacts",
          loc: "Nelson Ave / Plain St / Riverside Dr, East Perth WA 6004",
          start: "05/08/2026", end: "05/08/2026", lat: -31.9555, lng: 115.8785,
          desc: "Calcio Italiano. Gates 5.30 pm, kick-off 7.00 pm. Little Italy also running in Stadium Park from 4 pm.",
          impact: "Event-day congestion, parking restrictions and heavy pedestrian volumes on the East Perth side, including the Windan and Matagarup bridge approaches. Allow extra time on Nelson Ave, Plain St and Riverside Dr from mid-afternoon." },
        { id: "OB-2026/STADIUM-20260808", cat: "obstruction", sev: "medium", zone: "east",
          title: "Optus Stadium: Juventus v Inter (Derby d'Italia) - East Perth access impacts",
          loc: "Nelson Ave / Plain St / Riverside Dr, East Perth WA 6004",
          start: "08/08/2026", end: "08/08/2026", lat: -31.9555, lng: 115.8785,
          desc: "Calcio Italiano. Gates 5.30 pm, kick-off 7.00 pm. Saturday fixture - compounds with Little Italy in Stadium Park and the Farmers Market earlier in the day.",
          impact: "Event-day congestion, parking restrictions and heavy pedestrian volumes on the East Perth side, including the Windan and Matagarup bridge approaches. Allow extra time on Nelson Ave, Plain St and Riverside Dr from mid-afternoon." },
        { id: "OB-2026/HBFPARK-20260811", cat: "obstruction", sev: "medium", zone: "east",
          title: "HBF Park: Juventus v Palermo - Lord St / Pier St precinct impacts",
          loc: "HBF Park, 310 Pier St, Perth WA 6000",
          start: "11/08/2026", end: "11/08/2026", lat: -31.9430, lng: 115.8686,
          desc: "Calcio Italiano, third match. Gates 4.30 pm, kick-off 6.00 pm. MOVED from Optus Stadium to HBF Park in July 2026 - ticket holders who booked early should check the venue on their ticket.",
          impact: "Weeknight fixture on the East Perth boundary. Expect congestion and parking pressure on Lord St, Bulwer St and Pier St, and on-street parking taken up by event traffic in the Claisebrook/Royal St residential streets." }
      ],

      /* SOURCE GAP: HUB.notices carries CITY OF PERTH statutory notices only, and consultations.js
         (the usual home for outside items) is GENERATED WEEKLY by epcg-consultations-weekly and must
         not be hand-edited. A Commonwealth notice is neither, so it has nowhere else to live.
         The notices renderer already prefers an explicit `url` over a City slug and draws a source
         chip from `src`, so no code change is needed. */
      notices: [
        { typ: "Census", title: "2026 Census - Census Night is Tuesday 11 August",
          url: "https://info.census.abs.gov.au/", src: "ABS",
          pub: "2026-07-31", close: "2026-08-11", kind: "notice" }
        /* close is Census Night because it is the only firm published date - the ABS states no
           post-night deadline. The row leaves the Current filter on 12 Aug. To carry it through the
           ABS follow-up period, extend `close`. Do NOT invent a deadline in the title. */
      ]
    }
  };

  var H = window.HUB;
  if (!H) return;                                   /* fail open - never break a page */
  H.disruptions = H.disruptions || [];
  H.notices     = H.notices     || [];

  function past(ddmmyyyy) {                          /* "dd/mm/yyyy" -> is it before today? */
    if (!ddmmyyyy) return false;
    var p = String(ddmmyyyy).split("/");
    if (p.length !== 3) return false;
    var d = new Date(+p[2], +p[1] - 1, +p[0], 23, 59, 59);
    var t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t;
  }
  function findIdx(arr, id) {
    for (var i = 0; i < arr.length; i++) if (arr[i] && arr[i].id === id) return i;
    return -1;
  }

  try {
    /* overrides */
    M.overrides.forEach(function (o) {
      var i = findIdx(H.disruptions, o.id);
      if (i < 0) return;                             /* record gone from the feed - nothing to patch */
      Object.keys(o.set).forEach(function (k) { H.disruptions[i][k] = o.set[k]; });
    });

    /* replace */
    M.replace.forEach(function (r) {
      var i = findIdx(H.disruptions, r.id);
      if (i < 0) return;
      var base = H.disruptions[i];
      var subs = r.with.map(function (w) {
        var rec = r.inherit ? Object.assign({}, base, w) : Object.assign({}, w);
        delete rec.recurring;                        /* the split is the point - it is not recurring */
        return rec;
      }).filter(function (rec) { return !past(rec.end); });
      H.disruptions.splice(i, 1);
      subs.forEach(function (rec) { if (findIdx(H.disruptions, rec.id) < 0) H.disruptions.push(rec); });
    });

    /* seed - disruptions */
    (M.seed.disruptions || []).forEach(function (rec) {
      if (past(rec.end)) return;
      if (findIdx(H.disruptions, rec.id) < 0) H.disruptions.push(rec);
    });

    /* seed - notices (deduped on title; notices have no id) */
    (M.seed.notices || []).forEach(function (rec) {
      var dup = H.notices.some(function (n) { return n && n.title === rec.title; });
      if (!dup) H.notices.push(rec);
    });

    window.EPCG_MANUAL_APPLIED = true;               /* diag.html and any check can assert on this */
  } catch (e) {
    if (window.console && console.warn) console.warn("epcg-manual.js: overlay skipped -", e);
  }
})();
