/* Website embed side notes (2 Nov 2026, Jason's direction). When a Hub page is framed on
   eastperthcommunity.org.au and the frame is wide enough, the white margins either side of the
   tablet carry two notes: how to keep the Hub on a home screen, and the Business Spotlight
   invitation. Loaded by the three boards and the Newsletters, Support and Report pages. Does
   nothing unframed, so the standalone Hub and every phone view are unchanged.
   Text on white uses Petrol, Ink and Grey only (EPCG design system). No personal names on the
   Hub (committee, 27 Jul 2026): the contact is the Secretary mailbox. */
(function(){
  var root=document.documentElement;
  if(!root.classList.contains("embed")) return;
  var HUB="https://cocopug89.github.io/HelloEastPerth/";
  var MAIL="mailto:secretary.eastperthcommunity@gmail.com?subject="+encodeURIComponent("Business Spotlight on the East Perth Hub");
  var css=
    "@media(min-width:1800px){"+
    "html.embed body{max-width:1240px}"+
    "html.embed .emside{display:flex}"+
    "}"+
    ".emside{display:none;position:fixed;top:22px;bottom:32px;width:calc((100vw - 1240px)/2);flex-direction:column;justify-content:center;padding:0 40px;box-sizing:border-box;font-family:'Montserrat',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#12303F;z-index:5}"+
    ".emside.l{left:0;padding-right:44px}"+
    ".emside.r{right:0;padding-left:44px}"+
    ".emside .k{font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#5E7986;margin:0 0 8px}"+
    ".emside .h{font-size:21px;line-height:1.2;font-weight:800;color:#004F71;margin:0 0 14px;text-transform:none;letter-spacing:0}"+
    ".emside p{font-size:13.5px;line-height:1.55;margin:0 0 12px;color:#12303F}"+
    ".emside ol{margin:0 0 14px;padding:0;list-style:none;counter-reset:s}"+
    ".emside li{counter-increment:s;position:relative;padding:0 0 0 34px;margin:0 0 12px;font-size:13.5px;line-height:1.5}"+
    ".emside li::before{content:counter(s);position:absolute;left:0;top:-1px;width:23px;height:23px;border-radius:50%;background:#004F71;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center}"+
    ".emside li b{color:#004F71}"+
    ".emside .btn{display:inline-block;align-self:flex-start;background:#004F71;color:#fff;text-decoration:none;font-weight:700;font-size:13.5px;padding:10px 16px;border-radius:4px;margin-top:4px}"+
    ".emside .btn:hover{background:#12303F}"+
    ".emside .small{font-size:12px;color:#5E7986;margin-top:12px;overflow-wrap:anywhere}"+
    /* Keep the top bar on ONE row (Jason, 2 Nov 2026: "CENTRAL PERTH COMMUNITY HUB" wrapped the bar to two
       rows and pushed the map out of the tablet). The title is smaller and never wraps, and the brand side
       gives way before the tiles do. */
    "@media(min-width:768px){"+
    "html.embed #deskhead .hhead{flex-wrap:nowrap}"+
    "html.embed #deskhead .hbrand{min-width:0;flex:1 1 auto;overflow:hidden}"+
    "html.embed #deskhead .hbrand .btext{min-width:0}"+
    "html.embed #deskhead .hglance{flex:none}"+
    "html.embed #deskhead .hbrand h1{font-size:22px!important;letter-spacing:.6px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"+
    "html.embed #deskhead .dstamp{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"+
    "}";
  var st=document.createElement("style");
  st.textContent=css;
  document.head.appendChild(st);
  var here=location.href;
  /* Open full screen lives in the menu only (Jason, 2 Nov 2026); the left-margin note links it too. */
  var dm=document.getElementById("dmenu");
  if(dm){
    var m=document.createElement("a");
    m.href=here;
    m.target="_blank";
    m.rel="noopener";
    m.innerHTML='<span class="mi">&#8599;</span>Open full screen';
    dm.insertBefore(m,dm.firstChild);
  }
  function add(cls,html){
    var a=document.createElement("aside");
    a.className="emside "+cls;
    a.innerHTML=html;
    document.body.appendChild(a);
  }
  add("l",
    '<div class="k">On your iPad or phone</div>'+
    '<div class="h">Keep the Hub on your home screen</div>'+
    '<ol>'+
    '<li><a href="'+HUB+'" target="_blank" rel="noopener"><b>Open the Hub on its own</b></a>, not inside this page.</li>'+
    '<li><b>iPad or iPhone:</b> in Safari, tap Share, then <b>Add to Home Screen</b>.</li>'+
    '<li><b>Android:</b> in Chrome, tap the three-dot menu, then <b>Add to Home screen</b>.</li>'+
    '</ol>'+
    '<p>It opens full screen like an app and refreshes itself every weekday. An old iPad on the fridge makes a good East Perth noticeboard.</p>'+
    '<a class="btn" href="'+HUB+'" target="_blank" rel="noopener">Open the Hub</a>');
  add("r",
    '<div class="k">Local businesses</div>'+
    '<div class="h">Want to be in the Business Spotlight?</div>'+
    '<p>Each Hub board features a local business, with photos and a short write-up for the residents who use it every day.</p>'+
    '<p>If you run a business in East Perth or the city and would like to be featured, get in touch with the EPCG Secretary.</p>'+
    '<a class="btn" href="'+MAIL+'" target="_top">Email the Secretary</a>'+
    '<p class="small">secretary.eastperthcommunity@gmail.com</p>');
})();
