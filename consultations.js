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
window.CONSULTATIONS_GENERATED = "2026-08-10";

window.CONSULTATIONS = [
{"typ": "Parks (BGPA)", "title": "Kings Park and Bold Park Master Plan - community vision to 2050", "url": "https://www.bgpa.wa.gov.au/future", "pub": "", "close": "2026-08-13", "kind": "consultation", "src": "BGPA"},
{"typ": "Infrastructure (City of Perth)", "title": "Perth Town Hall Undercroft Redevelopment", "url": "https://yoursay.perth.wa.gov.au/perth-town-hall-undercroft-redevelopment", "pub": "", "close": "2026-08-14", "kind": "consultation", "src": "Your Say Perth"},
{"typ": "Transport (City of Perth)", "title": "Connecting the City: Draft Transport Strategy", "url": "https://yoursay.perth.wa.gov.au/connecting-city-draft-transport-strategy", "pub": "", "close": "2026-08-21", "kind": "consultation", "src": "Your Say Perth"},
{"typ": "Planning (City of Perth)", "title": "Local Planning Scheme No. 3", "url": "https://yoursay.perth.wa.gov.au/local-planning-scheme-no-3", "pub": "", "close": "2026-09-25", "kind": "consultation", "src": "Your Say Perth", "grp": "Local Planning Scheme No. 3"},
{"typ": "Planning (City of Perth)", "title": "Designation of Heritage Areas and Local Planning Policies", "url": "https://yoursay.perth.wa.gov.au/lps3-heritage-areas", "pub": "", "close": "2026-09-25", "kind": "consultation", "src": "Your Say Perth", "grp": "Local Planning Scheme No. 3"},
{"typ": "Planning (City of Perth)", "title": "LPS3 Local Planning Policies", "url": "https://yoursay.perth.wa.gov.au/lps3-local-planning-policies", "pub": "", "close": "2026-09-25", "kind": "consultation", "src": "Your Say Perth", "grp": "Local Planning Scheme No. 3"},
{"typ": "Planning (City of Perth)", "title": "Character Area Local Planning Policies", "url": "https://yoursay.perth.wa.gov.au/character-area-local-planning-policies", "pub": "", "close": "2026-09-25", "kind": "consultation", "src": "Your Say Perth", "grp": "Local Planning Scheme No. 3"},
{"typ": "Planning (City of Perth)", "title": "Redevelopment Area Local Planning Policies", "url": "https://yoursay.perth.wa.gov.au/redevelopment-area-local-planning-policies", "pub": "", "close": "2026-09-25", "kind": "consultation", "src": "Your Say Perth", "grp": "Local Planning Scheme No. 3"}
];

/* Collapse map: City notices that are really ONE consultation published as several
   documents. Key = notice title in HUB.notices, value = the row label. */
window.CONSULT_GROUPS = {
  "Local Planning Scheme No. 3 - Available for Inspection": "Local Planning Scheme No. 3",
  "Local Planning Policies and Designation of Heritage Areas - Available for Inspection": "Local Planning Scheme No. 3"
};
