/* EAST PERTH HUB - Business Spotlight, per zone.
 *
 * WHY THIS FILE EXISTS
 * The spotlight used to be hardcoded into all three board HTML files, which meant (a) a West Perth
 * resident was shown an East Perth cafe, and (b) selling the slot meant hand-editing three pages
 * per advertiser. It is now data: pick a business per zone, and the board renders whichever one
 * matches its own zone (HZ). Revenue goes to EPCG regardless of which zone the business sits in.
 *
 * TO CHANGE AN ADVERTISER: edit this file only. Add the image to the Live Site folder (the deploy
 * enumerates the folder, so new images are picked up automatically). No HTML changes, ever.
 *
 * Fields:
 *   img       image filename in the Live Site folder            (required)
 *   alt       alt text for the image                            (required)
 *   name      business name                                     (required)
 *   blurb     one paragraph. Inline <b> is allowed - this file is ours, not user input.
 *   highlight optional callout line (the green bar)
 *   meta      address / hours line
 *   ctas      [{label, href, style:"b1"|"b2"}]  b1 = solid blue, b2 = outline
 *   offer     optional partner/member deal, rendered as a coupon block:
 *               { headline:  "20% off your initial consult",
 *                 how:       "Show this page at reception",      <- the redemption instruction
 *                 code:      "EPCG-JUL",                          <- OPTIONAL. See the warning below.
 *                 terms:     "EPCG members only. One per person.",
 *                 expires:   "2026-09-30" }                       <- REQUIRED. Auto-hides after this date.
 *
 *   *** MEMBERS-ONLY DEALS: READ THIS ***
 *   This board is PUBLIC. "Show this page to get the member price" gates nothing - anyone can open
 *   it. If a deal is genuinely members-only, the gate must be something only members hold: put a
 *   `code` in the newsletter (the push channel) and have the business ask for it. Leave `code` out
 *   and the offer is, in practice, open to everyone - which is fine, just be honest with the
 *   business about it. An offer the partner thinks is gated but isn't will sour the relationship.
 *
 *   `expires` is mandatory so a dead coupon cannot rot on the board the way the old hand-typed
 *   "updated 8 Jul" date did. After that date the offer block disappears; the business stays.
 *   ribbon    optional override of the corner label. Use "Sponsored" for a PAID placement -
 *             an unlabelled ad is the kind of thing that gets a community group in trouble.
 *
 * A zone set to null falls back to FALLBACK below, so no board is ever empty.
 */
(function(){
  var HANOI = {
    img:   "hanoi-soulmates.jpg",
    alt:   "Hanoi Soulmates rice bowl",
    name:  "Hanoi Soulmates",
    blurb: "Tucked away in Claisebrook opposite the IGA, this small family-run Vietnamese café is a local gem bringing authentic street-food flavours to the neighbourhood. Already a community favourite, especially for its <b>Banh Mi</b> and <b>Vietnamese coffee</b>.",
    highlight: "🍜 New after a recent menu refresh: <b>Bun Cha &amp; Rice Bowls</b>, an absolute must-try for your next lunch break.",
    meta:  "📍 88 Royal Street, East Perth &nbsp;&middot;&nbsp; ⏱ 7am-3pm Mon-Sat, 10am-3pm Sun",
    ctas:  [{label:"Follow @hanoi.soulmates", href:"https://www.instagram.com/hanoi.soulmates/", style:"b1"}]
  };


  /* MERCEDES COLLEGE - Mercy Scholarship. Live 31 Jul 2026, aligned with the July newsletter's
     Spotlight section. NOT a paid placement and NOT a business: the school approached EPCG and
     asked us to pass the news on, so the ribbon is overridden to "Neighbourhood Spotlight" rather
     than the default "Business Spotlight". Do not label it Sponsored - no money changed hands.
     Set on BOTH east and central: east is where newsletter readers land (that is the whole point
     of the alignment), and central was null, meaning central-zone visitors were being shown an
     East Perth cafe - the exact mismatch this file exists to fix. Mercedes sits on Victoria
     Square, so central is also the geographically honest home for it.
     RETIRE THIS AFTER 25 SEP 2026 - the closing date is baked into the artwork and the blurb, and
     unlike `offer` there is no auto-expiry on a spotlight. Put Hanoi Soulmates back on east. */
  var MERCEDES = {
    img:   "mercedes-scholarship.jpg",
    alt:   "Mercy Scholarship at Mercedes College - applications close 25 September 2026",
    /* ARTWORK: the school's own Mercy Scholarship banner, supplied to EPCG for the newsletter.
       It is 1180x664 LANDSCAPE and .spot-media crops with object-fit:cover into a ~0.84 PORTRAIT
       panel on desktop, which would have cut the student out of frame and clipped the wordmark.
       So it is padded to a square with SOLID bars in the artwork's own flat green, sampled as the
       median of its top and bottom fields - rgb(29,87,66). Artwork untouched, nothing overpainted.
       Do NOT edge-extend the rows to fill instead: that was tried first and smeared the chair in
       the bottom-left photo into a vertical streak. Any future spotlight image should be squarish for the same reason;
       a raw landscape banner will lose its sides. Mobile (<820px) uses a 130px landscape strip,
       where the padding is harmless. */
    name:  "Mercedes College - Mercy Scholarship",
    blurb: "On the edge of Victoria Square, just across the East Perth border, Mercedes College has been teaching girls in the city since the Sisters of Mercy founded it 180 years ago. Applications are open for the <b>Mercy Scholarship</b>, aimed at families who may have assumed a private girls' education was out of reach.",
    highlight: "\ud83c\udf93 Open to students starting <b>Years 8 to 11 in 2027</b>. Applicants show exceptional talent or potential in one of five areas: the arts, sport, academic excellence, community service, or leadership.",
    meta:  "\ud83d\udcc5 Applications close <b>25 September 2026</b> &nbsp;&middot;&nbsp; \ud83d\udccd Victoria Square, Perth",
    ribbon:"\ud83c\udf93 Neighbourhood Spotlight",
    ctas:  [{label:"Scholarship details", href:"https://www.mercedes.wa.edu.au/enrolments-private/scholarships/", style:"b1"}]
  };


  /* ---- TEMPLATE: East Perth Chiropractic (Alan Le) - NOT LIVE. Uncomment once agreed. ----
     Note the ribbon: no money changes hands, so "Sponsored" would be inaccurate. It is a partner
     offer. And note `code` - without it, the deal is open to the public, not to members.
  var CHIRO = {
    img:   "east-perth-chiro.jpg",             // add the image to the Live Site folder
    alt:   "East Perth Chiropractic",
    name:  "East Perth Chiropractic",
    blurb: "...Alan's blurb...",
    meta:  "\ud83d\udccd <address> &nbsp;&middot;&nbsp; \u23f1 <hours>",
    ribbon:"\ud83e\udd1d Member Offer",
    offer: {
      headline: "<the deal>",
      how:      "Quote the code from your EPCG newsletter",
      code:     "EPCG-<MONTH>",                // omit this and the offer is public, not members-only
      terms:    "EPCG members only. One per person.",
      expires:  "2026-12-31"                   // required - the offer auto-hides after this
    },
    ctas:  [{label:"Book an appointment", href:"https://...", style:"b1"}]
  };
  */

  /* EPCG 2026 AGM. Live 30 Aug 2026, aligned with the August newsletter, whose whole front
     half is the AGM - there is no Business Spotlight section this month. This is EPCG's own
     event, not a placement, so the ribbon is overridden and it is never labelled Sponsored.
     ARTWORK: agm-2026.jpg, the house AGM tile rebuilt square at 800x800 from
     `11 EPCG/.../2026 AGM/_build/build_tile_hub.py` with the confirmed venue and the
     post-nomination copy. The nominations-era tile is stale (it says "Location to be advised"
     and quotes the 20 Aug nomination deadline) - do not reuse it.
     RETIRE AFTER 17 SEP 2026: put MERCEDES back on east and central, and note that Mercedes
     itself expires 25 Sep 2026, after which east goes back to HANOI. */
  var AGM = {
    img:   "agm-2026.jpg",
    alt:   "EPCG Annual General Meeting, Thursday 17 September 2026, Common Ground East Perth",
    name:  "EPCG Annual General Meeting",
    blurb: "The group's AGM is on <b>Thursday 17 September</b> at Common Ground, 119 Hill St, from 5.30 pm for a 6 pm start. Hear what has been achieved this year, meet the incoming committee and help shape what the group works on next. Hosted with the support of Mission Australia and Common Ground.",
    highlight: "\ud83d\uddf3\ufe0f <b>Only paid-up Ordinary Members can vote.</b> If your membership is due, renew before the meeting. Nominations have closed, with valid nominations received for all four office bearer positions and five ordinary committee positions.",
    meta:  "\ud83d\udcc5 Thursday 17 September, 5.30 pm for a 6 pm start &nbsp;&middot;&nbsp; \ud83d\udccd Common Ground, 119 Hill St, East Perth",
    ribbon:"\ud83c\udf9f\ufe0f EPCG Event",
    /* CTA order set by the Treasurer, 30 Aug 2026: renewal leads, the ticket follows. Only paid-up
       Ordinary Members can vote, so a renewal is the thing a reader most needs to act on before
       17 Sep. The ticket link is kept as the second button rather than dropped - the AGM is
       capacity managed and this card is the only booking route on the board. The newsletter CTA
       came out to make room; it is already the feature card on newsletters.html. */
    ctas:  [{label:"Renew your membership to vote", href:"https://www.eastperthcommunity.org.au/new-membership-form", style:"b1"},
            {label:"Get your free ticket", href:"https://events.humanitix.com/east-perth-community-group-2026-agm", style:"b2"}]
  };


  /* THE PAVILION WACA GROUND - free community pool party, Sun 27 Sep 2026. Live 19 Sep 2026 as the
     highlight between the August newsletter and the next one (Jason). Someone else's event passed on,
     NOT a placement and NOT paid, so the ribbon is "Community Event" and it is never labelled Sponsored.
     ARTWORK: pool-party-2026-v2.jpg, 720x1200 PORTRAIT: the venue's own banner art (The Pavilion WACA
     Ground / BlueFit) rearranged, wordmark over the kids group, by
     `11 EPCG/East Perth Community Group/Communications/_build/build_hub_card_pool_v2.py`. Used with Jason's
     approval, 19 Sep 2026, credited in `meta`; a courtesy note to the venue was drafted for him to send.
     v1 (pool-party-2026.jpg, a text-only card) was pulled the same day: it only repeated the copy beside it.
     New filename on purpose, so no browser or CDN serves the v1 image from cache.
     The venue page says "Join us this October" above a 27 September date; the date is stated twice
     on that page and 27 Sep 2026 is a Sunday, so the copy here uses 27 Sep only.
     RETIRE AFTER 27 SEP 2026: east goes back to HANOI, FALLBACK back to HANOI. */
  var POOL = {
    img:   "pool-party-2026-v2.jpg",
    alt:   "Free community pool party at The Pavilion WACA Ground, Sunday 27 September 2026, 1 pm to 4 pm",
    name:  "Free Community Pool Party, The Pavilion WACA Ground",
    blurb: "The Pavilion at the WACA Ground is opening its doors for a <b>free</b> community pool party. Bring the family for splash and play in the pool, kids activities, and a look around the centre and its programs, right here in East Perth.",
    highlight: "\ud83c\udfca <b>Free entry</b>, Sunday 27 September, 1 pm to 4 pm. Check the venue's supervision rules for younger swimmers before you go.",
    meta:  "\ud83d\udcc5 Sunday 27 September, 1 pm to 4 pm &nbsp;&middot;&nbsp; \ud83d\udccd The Pavilion, WACA Ground, East Perth &nbsp;&middot;&nbsp; Artwork: The Pavilion WACA Ground",
    ribbon:"\ud83c\udf88 Community Event",
    ctas:  [{label:"Event details", href:"https://thepavilionwacaground.com.au/open-day", style:"b1"}]
  };


  /* MOON RISING CEREMONY, Matilda Bay, Mon 28 Sep 2026. Live 20 Sep 2026 on the WEST board only (Jason).
     Passed to Jason by a neighbouring group's counterpart; someone else's event, not a placement, never
     "Sponsored". ARTWORK: moon-rising-2026.jpg, the organisers' square poster at 720px wide, centred on a
     720x1200 portrait with a blurred, darkened copy of itself above and below, so it reads whole at the
     0.6 panel ratio seen at 1440px and loses only the info row's outer edges at 0.45. Source poster (from
     Jason's screenshot) in `11 EPCG/East Perth Community Group/Communications/_build/`. No public event
     link was supplied, so there is no CTA button; the renderer handles an empty ctas list.
     The poster carries the "Save Matilda Bay" campaign line. The card copy describes the event only.
     RETIRE AFTER 28 SEP 2026: set west back to null (falls back). */
  var MOON = {
    img:   "moon-rising-2026.jpg",
    alt:   "Moon Rising Ceremony with Elder Trevor Walley, Matilda Bay, Monday 28 September 2026",
    name:  "Moon Rising Ceremony at Matilda Bay",
    blurb: "Join <b>Elder Trevor Walley</b> for a relaxed evening on Whadjuk Noongar Country at Matilda Bay, watching the sun set and the moon rise over the river. Bring a picnic, a rug or a chair for an evening of Country, community and connection.",
    highlight: "\ud83c\udf15 <b>Monday 28 September.</b> Sunset 6.16 pm, moonrise 8.06 pm. Everyone welcome, bring your family and friends.",
    meta:  "\ud83d\udcc5 Monday 28 September, sunset 6.16 pm &nbsp;&middot;&nbsp; \ud83d\udccd Central Matilda Bay &nbsp;&middot;&nbsp; \ud83e\uddfa BYO picnic",
    ribbon:"\ud83c\udf15 Community Event",
    ctas:  []
  };


  window.SPOTLIGHT = {
    east:    POOL,      /* 19 Sep to 27 Sep 2026 (pool party), then HANOI. AGM retired 19 Sep. */
    central: MERCEDES,  /* until 25 Sep 2026 (scholarship closes), then null so it falls back */
    west:    MOON,      /* 20 Sep to 28 Sep 2026 (Moon Rising, Matilda Bay), then null so it falls back */
    FALLBACK: POOL      /* until 27 Sep 2026, then HANOI. Swap for an "advertise here" card once selling */
  };
})();
