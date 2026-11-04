/* EAST PERTH PRECINCTS. Live 4 Nov 2026 (`8f47ace`): loaded by the East board, the phone home, report,
 * newsletters and support, never by the Central or West boards (see the Langley Park block at the foot).
 *
 * The five areas of the EPSN quarterly safety survey (question 2, "area where they spend most time";
 * `Working Group - Safety and Security/2026/Quarterly Survey Aug 2026/`), drawn as boundaries so the Hub
 * can tag every record with lat/lng, and every What's On venue it recognises, and filter by precinct.
 *
 * Geometry is the Hub's rotated street-grid frame (Tools/zone-boundaries.json, "transform"): Perth's grid
 * runs at 21.123 degrees, so in this frame each street below is a single straight value. rx grows east,
 * ry grows SOUTH. Street lines measured 4 Nov 2026 from OpenStreetMap (Nominatim) and the Hub's OSM
 * gazetteer. Map data (c) OpenStreetMap contributors (ODbL).
 *
 *   Victoria Ave rx 4250   Lord St rx 4320   Hill St rx 4547   Bennett St rx 4860   Plain St rx 5180
 *   Graham Farmer Fwy ry 1360   Royal St ry 2414   Wellington St ry 2822   Hay St ry 3096
 *   Adelaide Tce ry 3240   Terrace Rd ry 3440   river ry ~3650
 *
 * Precincts are independent of the Hub's zones: Langley Park is zone "central" (a postcode fact) but
 * it is in the Langley Park & Riverside precinct, which is the point.
 */
(function () {
  var T = { oLat: -31.916446392851135, oLon: 115.83570548259439, rot: 21.123 };
  var A = -T.rot * Math.PI / 180, COS0 = Math.cos(T.oLat * Math.PI / 180);

  function toGrid(lat, lng) {
    var mx = (lng - T.oLon) * 111320 * COS0, my = (T.oLat - lat) * 110540;
    return [mx * Math.cos(A) - my * Math.sin(A), mx * Math.sin(A) + my * Math.cos(A)];
  }
  function fromGrid(rx, ry) {
    var mx = rx * Math.cos(A) + ry * Math.sin(A), my = -rx * Math.sin(A) + ry * Math.cos(A);
    return [T.oLat - my / 110540, T.oLon + mx / (111320 * COS0)];
  }

  /* Each precinct is a union of grid rectangles [rxMin, rxMax, ryMin, ryMax). First match wins. */
  var P = [
    { id: "langley", name: "Langley Park & Riverside", survey: "Langley Park / Riverside Drive area",
      rects: [[4250, 5180, 3440, 3700],          /* south of Terrace Rd, Victoria Ave to Plain St */
              [5600, 6600, 3240, 3700]] },       /* the Causeway end and Heirisson Island, east of Ozone Reserve */
    /* Ozone Reserve is Terrace, not Langley (Jason, 4 Nov 2026): its events land on Queens Riverside and the
       Adelaide Tce towers. OSM outline rx 5201 to 5586, ry 3252 to 3574, so it crosses the Terrace Rd line. */
    { id: "terrace", name: "Queens Gardens & Terrace", survey: "Queens Gardens & Terrace precinct (Hay St, Adelaide Tce)",
      rects: [[4547, 6100, 2822, 3440],          /* south of Wellington St, Hill St to the river */
              [5180, 5600, 3440, 3700]] },       /* Ozone Reserve south of the Terrace Rd line, to the river */
    { id: "wellington", name: "Wellington Square", survey: "Wellington Square and surrounding streets",
      rects: [[4547, 5180, 2414, 2822]] },       /* Royal St to Wellington St, Hill St to Plain St */
    { id: "station", name: "Claisebrook Station & City Farm", survey: "Claisebrook Station / Perth City Farm / TAFE / Depts. Education & Health",
      rects: [[4320, 4547, 1360, 2822],          /* Lord St to Hill St, north of Wellington St */
              [4547, 4870, 1360, 2414]] },       /* north of Royal St, west of the head of the cove */
    { id: "cove", name: "Claisebrook Cove & Victoria Gardens", survey: "Victoria Gardens / Claisebrook Cove / Mardalup Park area",
      rects: [[5180, 6100, 1360, 2822],          /* north of Wellington St, east of Plain St */
              [4870, 5180, 1360, 2414]] }        /* the head of the cove, north of Royal St */
  ];

  function precinctOf(lat, lng) {
    if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) return null;
    var g = toGrid(lat, lng);
    for (var i = 0; i < P.length; i++)
      for (var j = 0; j < P[i].rects.length; j++) {
        var r = P[i].rects[j];
        if (g[0] >= r[0] && g[0] < r[1] && g[1] >= r[2] && g[1] < r[3]) return P[i].id;
      }
    return null;
  }

  /* What's On records carry a venue string but no coordinates: the same idea as the boards' Z(). */
  var VENUES = [
    ["terrace", ["ozone", "lake vasto"]],          /* ahead of Langley's "riverside drive" */
    ["langley", ["langley park", "shoppe on langley", "riverside drive"]],
    ["wellington", ["wellington square", "moort-ak waadiny"]],
    ["station", ["city farm", "claisebrook station", "royal street"]],
    ["cove", ["claisebrook cove", "royal on the waterfront", "victoria gardens", "mardalup", "gloucester park", "eastbrook"]],
    ["terrace", ["queens gardens", "adelaide terrace", "hay street, east perth", "waca"]]
  ];
  function precinctOfVenue(v) {
    v = (v || "").toLowerCase();
    for (var i = 0; i < VENUES.length; i++)
      for (var j = 0; j < VENUES[i][1].length; j++) if (v.indexOf(VENUES[i][1][j]) >= 0) return VENUES[i][0];
    return null;
  }

  /* Two neighbourhoods above the precincts. Jason, 4 Nov 2026: Wellington Street is the edge between
     Claisebrook (north) and East Perth (south) when locals talk about the two. Langley Park counts as
     East Perth here although its postcode is 6000. */
  var HOOD = { langley: "East Perth", terrace: "East Perth", wellington: "Claisebrook", station: "Claisebrook", cove: "Claisebrook" };

  /* Optus Stadium sits across the river in Burswood. Its event days reach the Hub as the City's own road
     closure and obstruction notices for East Perth streets (Jason, 4 Nov 2026: no separate fixture source
     is needed), and those are tagged by where the closure is, like any other record. Only a record that
     names the stadium and has no East Perth location falls back to every precinct its crowds load:
     Matagarup Bridge into Nile St and Sailani Ave (Cove), Nelson Ave, Plain St and Hay St east (Terrace),
     Riverside Dr and the Causeway (Langley). */
  var STADIUM = /optus stadium|perth stadium|stadium event/i;
  var STADIUM_AFFECTS = ["cove", "terrace", "langley"];

  /* Transperth, likewise (Jason, 4 Nov 2026): a train notice counts when it affects our stations. Notices
     are logged against Perth Station (zone central), but the Airport, Ellenbrook, Midland, Armadale and
     Thornlie-Cockburn lines all leave Perth through McIver and Claisebrook, so a disrupted section running
     east of Perth on those lines, or a notice naming Claisebrook, McIver or East Perth station, belongs to
     the Station precinct. Fremantle, Yanchep and Mandurah sections never touch East Perth. */
  var OUR_STATIONS = /claisebrook|mciver|east perth (station|terminal)/i;
  var EAST_OF_PERTH = /perth\s*-\s*(high wycombe|ellenbrook|midland|perth stadium|armadale|cockburn|thornlie|bayswater|claisebrook|mciver|burswood|victoria park|cannington|mount lawley|maylands|bassendean)/i;
  function trainAffectsUs(r) {
    if (r.mode !== "train") return false;
    var text = [r.title, r.stops, r.impact, r.loc].join(" ");
    return OUR_STATIONS.test(text) || EAST_OF_PERTH.test(text);
  }

  /* A Hub record's precincts, as an array (usually one). Only East-zone records get one, with one
     exception: Langley Park is zone "central" by postcode and still belongs to its precinct (609
     Wellington St, a central record on the Lord-to-Hill corridor, would otherwise read as Station).
     Transport records carry zones[] and stop points pts[[lat, lng, label]] instead of lat/lng. */
  function precinctsOfRecord(r) {
    if (!r) return [];
    var east = r.zone === "east" || (r.zones && r.zones.indexOf("east") >= 0);
    var found = [];
    var pts = r.pts && r.pts.length ? r.pts : [[r.lat, r.lng]];
    pts.forEach(function (p) {
      var id = precinctOf(p[0], p[1]);
      if (id && found.indexOf(id) < 0) found.push(id);
    });
    if (!found.length) { var v = precinctOfVenue(r.venue || r.loc); if (v) found.push(v); }
    found = found.filter(function (id) { return east || id === "langley"; });
    if (trainAffectsUs(r) && found.indexOf("station") < 0) found.push("station");
    if (!found.length && STADIUM.test([r.title, r.loc, r.venue, r.desc].join(" "))) return STADIUM_AFFECTS.slice();
    return found;
  }
  function precinctOfRecord(r) { return precinctsOfRecord(r)[0] || null; }

  window.EP_PRECINCTS = {
    list: P.map(function (p) { return { id: p.id, name: p.name, survey: p.survey, hood: HOOD[p.id] }; }),
    of: precinctOf, ofVenue: precinctOfVenue, ofRecord: precinctOfRecord, allOfRecord: precinctsOfRecord,
    hood: function (id) { return HOOD[id] || null; }, toGrid: toGrid, fromGrid: fromGrid,
    rects: P.map(function (p) { return { id: p.id, rects: p.rects }; })
  };

  /* LANGLEY PARK COUNTS AS EAST (Jason, 4 Nov 2026: "langley park should also get a special treatment to
     always appear in east zone"). Its records are zone "central" by postcode, so the East pages never
     showed them. THIS FILE IS LOADED ONLY BY EAST PERTH PAGES (the East board, the phone home, report,
     newsletters, support), so on load it re-zones every Langley Park & Riverside record to "east" for this
     page. The Central board does not load it and keeps them as central, so they appear on both. The
     original zone is kept in zone_was. Load it after hub-data.js, epcg-manual.js and fireworks-data.js. */
  function claim(list, venueKey) {
    (list || []).forEach(function (r) {
      if (!r || r.zone === "east") return;
      var p = (typeof r.lat === "number") ? precinctOf(r.lat, r.lng) : precinctOfVenue(r[venueKey] || r.loc);
      if (p === "langley") { r.zone_was = r.zone; r.zone = "east"; }
    });
  }
  var H = window.HUB || {};
  claim(H.disruptions, "loc");
  claim(H.events, "venue");
  var FW = window.FIREWORKS;
  claim(Array.isArray(FW) ? FW : (FW && FW.events), "venue");
})();
