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
window.CONSULTATIONS_GENERATED = "2026-10-05";

window.CONSULTATIONS = [
{"typ": "Planning (City of Perth)", "title": "Draft Heritage List Policy", "url": "https://yoursay.perth.wa.gov.au/draft-heritage-list-policy", "pub": "2026-09-23", "close": "2026-10-15", "kind": "consultation", "src": "Your Say Perth"},
{"typ": "Planning (City of Perth)", "title": "Boorloo Perth 1829-2029: acknowledging the past, shaping our future", "url": "https://yoursay.perth.wa.gov.au/boorloo-perth-1829-2029-acknowledging-past-shaping-our-future", "pub": "2026-10-02", "close": "2026-11-15", "kind": "consultation", "src": "Your Say Perth"}
];

/* Collapse map: City notices that are really ONE consultation published as several
   documents. Key = notice title in HUB.notices, value = the row label. */
window.CONSULT_GROUPS = {
  "Local Planning Scheme No. 3 - Available for Inspection": "Local Planning Scheme No. 3",
  "Local Planning Policies and Designation of Heritage Areas - Available for Inspection": "Local Planning Scheme No. 3"
};
