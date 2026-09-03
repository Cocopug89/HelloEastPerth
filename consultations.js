/* EAST PERTH HUB - consultations from OUTSIDE the City of Perth public-notices feed.
 *
 * GENERATED WEEKLY by the epcg-consultations-weekly task. Do not hand-edit.
 *
 * hub-data.js is rebuilt every weekday from the City's statutory public-notices list only,
 * so anything added there by hand is wiped. State-agency consultations (DPLH, DevelopmentWA)
 * and Your Say Perth items are not on that list and live here instead, like epcg-events.js.
 * The east-perth-disruptions-weekly task must NEVER rewrite this file.
 *
 * SCOPE: City of Perth sources -> everything. State sources -> only inside City of Perth
 * boundaries (Parliament House, Royal Perth Hospital, etc).
 */
/* The board reads this to show a freshness stamp in the header and to WARN when this
   feed has gone stale. A hand-typed date drifted before (the page claimed "8 Jul" while
   the data was from the 12th), so it is generated, never written by hand. */
window.CONSULTATIONS_GENERATED = "2026-08-31";

window.CONSULTATIONS = [
{"typ": "Community", "title": "Neighbourhood Events", "url": "https://yoursay.perth.wa.gov.au/neighbourhood-events", "pub": null, "close": "2026-08-31", "kind": "consultation", "src": "Your Say Perth"},
{"typ": "Infrastructure", "title": "Draft Community Infrastructure Plan 2026 - 2036", "url": "https://yoursay.perth.wa.gov.au/draft-community-infrastructure-plan-2026-2036", "pub": null, "close": "2026-09-07", "kind": "consultation", "src": "Your Say Perth"},
{"typ": "Community", "title": "Elders and Aboriginal Advisory Group Call For Nominations 2026", "url": "https://yoursay.perth.wa.gov.au/elders-and-aboriginal-advisory-group-call-nominations-2026", "pub": null, "close": "2026-09-13", "kind": "consultation", "src": "Your Say Perth"},
{"typ": "Planning", "title": "Local Planning Scheme No. 3", "url": "https://yoursay.perth.wa.gov.au/local-planning-scheme-no-3", "pub": null, "close": "2026-09-25", "kind": "consultation", "src": "Your Say Perth", "grp": "Local Planning Scheme No. 3"},
{"typ": "Planning", "title": "Designation of Heritage Areas and Local Planning Policies", "url": "https://yoursay.perth.wa.gov.au/lps3-heritage-areas", "pub": null, "close": "2026-09-25", "kind": "consultation", "src": "Your Say Perth", "grp": "Local Planning Scheme No. 3"},
{"typ": "Planning", "title": "LPS3 Local Planning Policies", "url": "https://yoursay.perth.wa.gov.au/lps3-local-planning-policies", "pub": null, "close": "2026-09-25", "kind": "consultation", "src": "Your Say Perth", "grp": "Local Planning Scheme No. 3"},
{"typ": "Planning", "title": "Character Area Local Planning Policies", "url": "https://yoursay.perth.wa.gov.au/character-area-local-planning-policies", "pub": null, "close": "2026-09-25", "kind": "consultation", "src": "Your Say Perth", "grp": "Local Planning Scheme No. 3"},
{"typ": "Planning", "title": "Redevelopment Area Local Planning Policies", "url": "https://yoursay.perth.wa.gov.au/redevelopment-area-local-planning-policies", "pub": null, "close": "2026-09-25", "kind": "consultation", "src": "Your Say Perth", "grp": "Local Planning Scheme No. 3"}
];

/* Collapse map: City notices that are really ONE consultation published as several
   documents. Key = notice title in HUB.notices, value = the row label. */
window.CONSULT_GROUPS = {
  "Local Planning Scheme No. 3 - Available for Inspection": "Local Planning Scheme No. 3",
  "Local Planning Policies and Designation of Heritage Areas - Available for Inspection": "Local Planning Scheme No. 3"
};
