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
window.CONSULTATIONS_GENERATED = "2026-11-23";

window.CONSULTATIONS = [
{"typ": "Community", "title": "City of Perth Local History Service", "url": "https://yoursay.perth.wa.gov.au/city-perth-local-history-service", "pub": "2026-10-30", "close": "2026-11-27", "kind": "consultation", "src": "Your Say Perth"},
{"typ": "Planning (DPLH)", "title": "Draft Station Precincts Improvement Scheme No. 1 (WAPC) - includes the Claisebrook precinct", "url": "https://haveyoursay.dplh.wa.gov.au/stationprecincts-is", "pub": "2026-11-05", "close": "2027-02-12", "kind": "consultation", "src": "DPLH"}
];

/* Collapse map: City notices that are really ONE consultation published as several
   documents. Key = notice title in HUB.notices, value = the row label. */
window.CONSULT_GROUPS = {
  "Local Planning Scheme No. 3 - Available for Inspection": "Local Planning Scheme No. 3",
  "Local Planning Policies and Designation of Heritage Areas - Available for Inspection": "Local Planning Scheme No. 3"
};
