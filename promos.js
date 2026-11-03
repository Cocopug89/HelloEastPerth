/* EPCG's own time-boxed promotions for the Hub (hand-kept, 3 Nov 2026). Read by the three boards' ticker,
   the phone home ticker (index.html) and the Support page. Each entry shows only from `from` to `to`
   inclusive, in Perth dates, so nothing needs taking down. Keep this for EPCG's own asks; it is not an
   advertising slot.
   Entertainment Membership fundraiser, ID 96u9181: double-donation weeks as set out in the treasurer's
   newsletter post of 28 Oct 2026 (19 Oct to 2 Nov, 16 to 22 Nov, 14 to 27 Dec 2026). */
(function(){
  var ENT="https://subscribe.entertainment.com.au/fundraiser/96u9181?utm_source=East+Perth+Community&utm_campaign=96u9181&utm_medium=Hub&utm_id=144178";
  window.HUB_ENT_URL=ENT;
  window.HUB_PROMOS=[
    {from:"2026-11-16", to:"2026-11-22", em:"&#127903;&#65039;", label:"Entertainment Membership:", text:"double donation to the EPCG this week. Buy through our link.", href:ENT},
    {from:"2026-12-14", to:"2026-12-27", em:"&#127903;&#65039;", label:"Entertainment Membership:", text:"double donation to the EPCG until 27 December. Buy through our link.", href:ENT}
  ];
  function today(){ var t=new Date(); return t.getFullYear()+"-"+("0"+(t.getMonth()+1)).slice(-2)+"-"+("0"+t.getDate()).slice(-2); }
  window.hubPromosActive=function(){ var d=today(); return window.HUB_PROMOS.filter(function(p){ return d>=p.from&&d<=p.to; }); };
})();
