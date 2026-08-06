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

  window.SPOTLIGHT = {
    east:    MERCEDES,  /* until 25 Sep 2026, then back to HANOI */
    central: MERCEDES,  /* was null and falling back to an East Perth cafe */
    west:    null,      /* no advertiser yet - falls back */
    FALLBACK: MERCEDES  /* swap this for an "advertise here" card once you start selling */
  };
})();
