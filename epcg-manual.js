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
        why: "Hay St tower crane removal - belongs at the Plain St corner (Garden Towers), not where the auto value placed it." },
      { id: "INF-JOHNOLDHAM",
        set: { lat: -31.958344, lng: 115.847151, zone: "central", geo: undefined,
               impact: "Water feature not running until further notice." },
        why: "John Oldham Park waterfall out of order. The scrape could not resolve the location (geo none, zone unknown), so it showed on no board. Pin from Jason, 2 Oct 2026; zone from Tools/zone_assign.py on that pin (central, rotated y 3930, outside the East Perth band)." },
      { id: "EV-2025/513",
        set: { lat: -31.96038, lng: 115.8646, zone: "central" },
        why: "The Kingsman Pop-up Event Space. The auto pin (-31.9602, 115.873) put it on Adelaide Tce; it is in Langley Park, at Jason's point of 3 Nov 2026. Zone pinned too: zone_assign.py gives central there ('inside Langley Park'), and this overlay runs after the zone rules." },
      { id: "EV-2026/327",
        set: { lat: -31.95988, lng: 115.86484 },
        why: "SkyVista at Langley Park, 26/27 season. The auto pin (-31.9618, 115.8699) is the middle of Langley Park; this is where the wheel stands, Jason's point of 3 Nov 2026. Zone stays central. EV-2026/224 above is the earlier season's record." },
      /* ---- STEP 4E research done by hand, 4 Nov 2026: public / org_url / price / about on approved events (What's On lists public:true with an org_url) ---- */
      { id: "EV-2026/327",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://www.rideskyvista.com.au/", "price": "paid", "about": "A 36 metre observation wheel at Langley Park, open daily from 10am, with a Christmas addition and summer fun fair planned.", "org_note": "SkyVista (ShowVista Entertainment Group)"},
        why: "SkyVista at Langley Park - Spring, Christmas & Summer Season 26/27. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://www.rideskyvista.com.au/ shows Langley Park, corner Terrace Rd and Victoria Ave, 24 Oct to 27 Nov 2026, daily from 10am, Book Now tickets; Christmas addition and Boxing Day fun fair 'coming soon' without dates. P" },
      { id: "EVI-2026/337",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://visitperth.com/events/music-in-the-gardens", "price": "free", "about": "Free community concert with a J-Funk band and free gelato; bring a picnic and a low-back chair.", "org_note": "City of Perth with West Perth Local"},
        why: "Music in the Gardens 2026. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://visitperth.com/events/music-in-the-gardens shows 7 November 2026, 4:30pm-6:30pm, Harold Boas Gardens, free." },
      { id: "EV-2026/213",
        set: {"public": false, "checked": "2026-11-04", "about": "Start line at Langley Park for Variety WA's Ruby Revival, a fundraising car drive for registered entrants.", "org_note": "Variety WA"},
        why: "Variety WA Ruby Revival - Start Line. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Not public: City list: start line for a fundraising drive. Search snippet of a Variety WA Humanitix listing (events.humanitix.com/2027-and-2028-motoring-events-launch) shows the 2026 Ruby Revival is for registered entrants. Start li" },
      { id: "EVI-2026/191",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://www.visitperth.com/events/perth-multicultural-festival", "price": "free_entry", "about": "Two-night festival at Elizabeth Quay with ten cultural groups on a floating stage, kids' workshops, food trucks and fireworks.", "org_note": "City of Perth"},
        why: "Perth Multicultural Festival 2026. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://www.visitperth.com/events/perth-multicultural-festival shows 14 and 15 November 2026, 5pm-9pm, Elizabeth Quay, free, alcohol-free, food trucks." },
      { id: "EV-2026/31",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://www.motorcultureaustralia.com/cars-culture-perth-2026/", "price": "free_entry", "about": "Free car show of supercars, European and JDM cars with market stalls, a DJ, food, coffee and racing simulators.", "org_note": "Motor Culture Australia"},
        why: "Cars & Culture Perth 2026. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://www.motorcultureaustralia.com/cars-culture-perth-2026/ shows Sunday 15 November 2026, Wellington Square, 9am-12:30pm, free for spectators (RSVP), food and market stalls." },
      { id: "EV-2026/236",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://fundraise.lungfoundation.com.au/event/shinealightperth26/home", "about": "Lantern walk along the foreshore to raise awareness of lung cancer and remember people affected by it.", "org_note": "Lung Foundation Australia"},
        why: "Shine a Light Walk Perth 2026. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://fundraise.lungfoundation.com.au/event/shinealightperth26/home shows Sunday 15 November 2026, Langley Park Pavilion, 4pm registration, 4:45pm walk, open registration. No entry fee listed; walkers are asked to fund" },
      { id: "EV-2026/189",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://latinmarketaustralia.com.au/weekend-market/", "about": "Latin community market with Latin food, live performances, local stalls and family entertainment.", "org_note": "Latin Market Australia"},
        why: "Latin Market (Wellington Square). One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://latinmarketaustralia.com.au/ and /weekend-market/ list Sunday 15 November 2026 and 13 December 2026, 'Visitors + stallholders welcome'. Search snippet of the site gives Wellington Square Park, 11am-5pm. Entry pri" },
      { id: "EV-2025/511",
        set: {"public": false, "checked": "2026-11-04", "about": "Corporate Christmas parties and family days booked by companies at Ozone Reserve.", "org_note": "Ultimo Catering and Events"},
        why: "Ultimo Corporate Christmas Parties and Family Days 2026. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Not public: City list: corporate Christmas parties. Ultimo's 2025 Ozone Reserve package PDFs (ultimocateringandevents.com.au) sell these as all-inclusive packages for company groups of 500-2,500. No 2026 public listing." },
      { id: "EV-2026/228",
        set: {"public": false, "checked": "2026-11-04", "about": "End of year staff event for engineering firm Knight Piesold.", "org_note": "Knight Piesold"},
        why: "Knight Piesold - End of Year Staff Event. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Not public: City list describes it as a work function. Not searched further." },
      { id: "EV-2026/358",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://www.perthfrontrunners.org/events/380318", "price": "free", "about": "Untimed 3km, 5km and 7km walk or run from Elizabeth Quay, open to all ages and abilities, part of Pridefest.", "org_note": "Perth Frontrunners"},
        why: "2026 Perth Pride Run & Walk. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://www.perthfrontrunners.org/events/380318 shows 2026 Pride Run & Walk, Saturday 21 November 2026, 9am-11:30am, start at Spanda sculpture, Elizabeth Quay, free registration, non-members welcome." },
      { id: "EV-2026/330",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://journeytomalaysia.com/", "price": "free_entry", "about": "Malaysian cultural festival with food, performances, games and workshops in the city centre.", "org_note": "Consulate General of Malaysia (Perth) with the Journey to Malaysia student committee"},
        why: "Journey to Malaysia 2.0. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://journeytomalaysia.com/ shows Journey to Malaysia 2026, Saturday 21 November 2026, 9am-6pm, Forrest Chase. https://perthisok.com/events/journey-to-malaysia-2026/ calls it a free event open to everyone with Malaysi" },
      { id: "EV-2026/40",
        set: {"public": false, "checked": "2026-11-04", "about": "Civil engineering students doing a surveying exercise in the gardens on Thelma Street."},
        why: "Civil engineering students surveying. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Not public: City list: students surveying activity. A class exercise, not an event to attend." },
      { id: "EV-2026/385",
        set: {"public": false, "checked": "2026-11-04", "about": "End of year gathering for Nido staff in Harold Boas Gardens.", "org_note": "Nido"},
        why: "Nido - End of year gathering. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Not public: City list describes it as a work function with food and drink. Not searched further." },
      { id: "EV-2026/55",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://events.humanitix.com/36th-march-against-domestic-and-family-violence", "price": "free", "about": "Annual stalls, rally and march through Perth against men's violence against women and children, opening 16 Days in WA.", "org_note": "Centre for Women's Safety and Wellbeing"},
        why: "March Against Domestic and Family Violence. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://events.humanitix.com/36th-march-against-domestic-and-family-violence shows Wednesday 25 November 2026, Forrest Place, stalls 10am, rally 11am, march 12noon, tickets not required." },
      { id: "EV-2026/357",
        set: {"public": false, "checked": "2026-11-04", "about": "A breathwork session for lawyers in Council House Gardens."},
        why: "A Christmas Reset - Breathwork for Lawyers. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Not public: City list describes it as a work function. Not searched further." },
      { id: "EV-2026/56",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://mhitrdownunder.com/", "price": "paid", "about": "Ticketed drum and bass show with Hedex & Eksman, Mozey, Simula and others, part of an Australia and New Zealand tour.", "org_note": "Higher Grnd"},
        why: "MHITR / HIGHER GRND 2026. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://mhitrdownunder.com/ lists '28.11.26 Perth, Langley Park', tickets on sale via each city's ticket agent; footer (c) 2026 Higher Grnd. Only 28 Nov is listed; the City list's 29 Nov is not on the organiser's page." },
      { id: "EV-2025/495",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://www.gloriaperth.com.au/", "about": "Christmas carols evening in Forrest Place with choirs, skits, dance and food, run by a Perth church.", "org_note": "Gloria Perth (linked to Perth Pentecostal Assembly)"},
        why: "Gloria Perth 2026. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: Search snippet of https://www.gloriaperth.com.au/ gives 28 November 2026, 5pm; the page would not render for WebFetch. Earlier editions at Forrest Place (perthisok.com/events/gloria-perth-carols 2024; ppachurch.au/gloria" },
      { id: "EV-2026/197",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://pridewa.com.au/pridefest-2026/", "price": "free", "about": "Pridefest street parade through Northbridge, followed by a free after party at Russell Square.", "org_note": "Pride WA"},
        why: "Pride Parade. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://pridewa.com.au/pridefest-2026/ shows Pridefest Parade 28 November 2026 through the streets of Northbridge and a free City of Perth after party at Russell Square. Times not on the page." },
      { id: "EV-2026/294",
        set: {"public": false, "checked": "2026-11-04", "about": "Christmas picnic for Intellect Systems staff and families.", "org_note": "Intellect Systems"},
        why: "Intellect Systems Staff Family Christmas Picnic. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Not public: City list describes it as a work function. Not searched further." },
      { id: "EV-2026/232",
        set: {"public": true, "checked": "2026-11-04", "org_url": "https://thecourt.com.au/pride-street-party/", "price": "paid", "about": "Ticketed 18+ Pride after party at The Court taking over James Street, with Blusher, Joanne and local drag acts.", "org_note": "The Court Hotel"},
        why: "Court Hotel Pride Street Party 2026. One-off research pass 4 Nov 2026 (manual, so the weekday run carries no backlog). Public: https://thecourt.com.au/pride-street-party/ shows 'Pride Street Party 2026', general admission tickets via Oztix, strictly 18+. Date not on the page; search snippets of the Oztix listing give Saturday 28 Nov 2026, 7pm. T" }
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
