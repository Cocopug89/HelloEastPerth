/* EAST PERTH HUB - City of Perth residential bulk verge collection.
 *
 * CURATED, like epcg-events.js and epcg-manual.js. No scrape produces this: the City publishes
 * the round inside an accordion on its waste page, one round at a time, with no feed and no
 * machine-readable date. The scrapers must never write to this file.
 *
 * SOURCE: https://www.perth.wa.gov.au/residents/rubbish-waste-and-recycling
 *         "Residential verge collection" accordion. Read 30 Aug 2026, which is what `checked`
 *         records. Quote the City's own words for what is and is not taken - this is their
 *         service and their accuracy risk, not ours. Same discipline as the fireworks tab.
 *
 * The collection is CITY-WIDE, so every board shows the same round. There is no zone field and
 * there should not be one.
 *
 * FIELDS, all dates ISO and all rendered by the page so no date is typed twice:
 *   setout_from / setout_to   the window residents may put material out, with its time as text
 *   starts                    the day collection commences (it runs on from there; the City does
 *                             not publish an end date, so none is stated)
 *   show_from / show_until    when the card appears and disappears. show_until is deliberately a
 *                             week after `starts`, because the City says the collection
 *                             "commences" on that day and gives no finish date - a card that
 *                             vanished on the Monday would go dark while trucks were still out.
 *
 * WHEN THE NEXT ROUND IS ANNOUNCED: add it to the front of `rounds` and leave the old one in
 * place if you like - the page shows the first round that has not passed its show_until.
 * The weekly community bulletin reads THIS FILE too (bulletin.py), so a round added here also
 * fires the bulletin's bulk block in the right week. One source, two surfaces.
 */
window.BULK_COLLECTION = {
  source:  "https://www.perth.wa.gov.au/residents/rubbish-waste-and-recycling",
  checked: "2026-08-30",
  rounds: [
    {
      id:          "2026-09",
      setout_from: "2026-09-12", setout_from_time: "6am",
      setout_to:   "2026-09-14", setout_to_time:   "6am",
      starts:      "2026-09-14",
      show_from:   "2026-08-15",
      show_until:  "2026-09-21",
      accepted: "Garden prunings up to 1.5 m long and 30 cm thick, clippings and leaves in boxes, e-waste and small appliances with the cords cut off, fridges, freezers and stoves with the doors and power removed, other white goods, mattresses, furniture and household items.",
      excluded: "No hazardous waste: no paint, chemicals, gas cylinders, tyres, construction waste, vehicle parts or batteries. Residents only, not commercial premises."
    }
  ]
};
