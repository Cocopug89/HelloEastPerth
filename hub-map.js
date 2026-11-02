/* East Perth Hub map. "2026-11-02 - Hub map consolidation plan (one map, Heritage Hunt style)", steps 1 and 2.
   ONE Map tab (the board's tab-disruptions section; "transport" is now an alias for it) shows road and footpath
   works, construction, events and Transperth stop changes together, from HUB.disruptions and PTA_DATA exactly
   as the Hub Editor shifts write them. No data file or scheduled role changes.
   Engine: MapLibre (maplibre-gl.js, vendored flat in this folder) on the EPCG basemap shared with the Heritage
   Hunt (hub-map-style.js). Pins: the glyph says WHAT it is, the colour says HOW MUCH it matters (three levels).
   One filter bar drives the map and the list together: When, Show (with transport modes), Area, "only what
   blocks the way", and search. The state lives in the address (#disruptions?when=..&what=..&area=..) so a link
   or bookmark opens the same view. This file builds the tab's controls itself; the boards only call
   HubMapTab.preset(name) and HubMapTab.show() from activateTab. */
(function(){
  var IMPACT={
    block:{c:"#D23F3F",g:"#FFFFFF",label:"Blocks the way"},
    slow:{c:"#F2A93B",g:"#12303F",label:"Slows you down"},
    info:{c:"#004F71",g:"#FFFFFF",label:"Good to know"}
  };
  var ORDER={info:0,slow:1,block:2};
  var GLYPH={
    cone:'<path d="M9.6 3.5h4.8l4.4 14.5H5.2z" fill="currentColor"/><rect x="3" y="18" width="18" height="2.6" rx="1.2" fill="currentColor"/>',
    crane:'<path d="M5.2 15.6a6.8 6.8 0 0 1 13.6 0z" fill="currentColor"/><path d="M10.6 6.2h2.8v5.4h-2.8z" fill="currentColor"/><rect x="3" y="16.6" width="18" height="2.8" rx="1.3" fill="currentColor"/>', /* hard hat: reads as construction at 16px */
    star:'<path d="M12 2.8l2.75 5.6 6.15.9-4.45 4.33 1.05 6.12L12 16.85l-5.5 2.9 1.05-6.12L3.1 9.3l6.15-.9z" fill="currentColor"/>',
    bus:'<path d="M6 17.5V6.5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v11M6 11.5h12M6 17.5h12M8.6 20.5v-3M15.4 20.5v-3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    train:'<path d="M7 15.5V6.5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zM7 10.5h10M9 21l1.6-3.5M15 21l-1.6-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  function svg(name,size){ return '<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" aria-hidden="true">'+GLYPH[name]+'</svg>'; }
  function esc(s){ return String(s==null?"":s); }

  /* What kind and how much. Disruptions: sev high = full closure (blocks), medium and low = lane, footpath
     or partial footpath (slows); events and construction are good to know. Transport: high = line or service
     suspended (blocks); a closed stop with a temporary one nearby slows you down. */
  function impactKey(d,kind){
    if(kind==="pta") return d.sev==="high"?"block":"slow";
    if(d.cat==="event"||d.cat==="infrastructure") return "info";
    return d.sev==="high"?"block":"slow";
  }
  function glyphOf(d,kind){
    if(kind==="pta") return d.mode==="train"?"train":"bus";
    if(d.cat==="infrastructure") return "crane";
    if(d.cat==="event") return "star";
    return "cone";
  }

  var css=
    "#map{overflow:hidden}"+
    ".hpin{position:relative;width:30px;height:30px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,40,60,.45);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;box-sizing:border-box}"+
    ".hpin.big{width:36px;height:36px}"+
    ".hpin.faded{opacity:.5}"+
    ".hpin::after{content:'';position:absolute;inset:-6px;border-radius:50%}"+
    ".hpin .n{position:absolute;top:-7px;right:-8px;min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:#12303F;color:#fff;border:2px solid #fff;font:800 10.5px/14px Montserrat,Arial,sans-serif;text-align:center;box-sizing:border-box}"+
    ".maplibregl-popup-content{border-radius:12px;padding:11px 13px;font-family:Montserrat,Arial,sans-serif;font-size:13px;line-height:1.4;color:#12212e;box-shadow:0 10px 26px rgba(0,20,35,.35)}"+
    ".maplibregl-popup-content h3{margin:2px 0 4px;font-size:14px;color:#004F71}"+
    ".maplibregl-popup-content .m{color:#5a6b7a;font-size:11.5px;margin-bottom:4px}"+
    ".maplibregl-popup-content .im{color:#7a5230;font-size:11.5px;margin-top:4px}"+
    ".maplibregl-popup-content .hk{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:800;letter-spacing:.3px;text-transform:uppercase;padding:2px 9px 2px 7px;border-radius:20px}"+
    ".maplibregl-popup-content .hgrp a{display:flex;align-items:center;gap:8px;padding:6px 2px;color:#12303F;text-decoration:none;font-weight:700;border-top:1px solid #e4edf3}"+
    ".maplibregl-popup-content .hgrp a:first-of-type{border-top:0}"+
    ".maplibregl-popup-content .hgrp i{flex:none;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center}"+
    ".maplibregl-popup-content .more{display:inline-block;margin-top:8px;color:#00A3E0;font-weight:800;text-decoration:none}"+
    ".lchip .hg{display:inline-flex;margin-right:6px;opacity:.95}"+
    ".lchip .ct{margin-left:7px;background:rgba(255,255,255,.2);border-radius:10px;font-size:11px;font-weight:800;padding:0 7px}"+
    ".mckey .hdot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px;vertical-align:-1px;border:1.5px solid #fff}"+
    "#hmModes[hidden]{display:none!important}"+
    "#disList .card{cursor:pointer}"+
    "#disList .card .kb{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;color:#fff;background:#004F71;padding:1px 8px;border-radius:20px;margin-right:6px}";
  var st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);

  /* ---- MapLibre, loaded once and only when the Map tab opens ---- */
  var libP=null;
  function lib(){
    if(window.maplibregl) return Promise.resolve(window.maplibregl);
    if(!libP) libP=new Promise(function(ok,no){
      var l=document.createElement("link"); l.rel="stylesheet"; l.href="maplibre-gl.css"; document.head.appendChild(l);
      var s=document.createElement("script"); s.src="maplibre-gl.js";
      s.onload=function(){ ok(window.maplibregl); };
      s.onerror=function(){ libP=null; s.remove(); no(); };
      document.head.appendChild(s);
    });
    return libP;
  }
  var styleP=null;
  function style(){
    if(!styleP) styleP=fetch(window.EPCG_MAP_STYLE.STYLE_URL).then(function(r){ return r.json(); }).then(window.EPCG_MAP_STYLE.restyle).catch(function(e){ styleP=null; throw e; });
    return styleP;
  }
  function webgl(){ try{ var c=document.createElement("canvas"); return !!(c.getContext("webgl2")||c.getContext("webgl")); }catch(e){ return false; } }
  var HOVER=!(window.matchMedia&&(window.matchMedia("(hover: none)").matches||window.matchMedia("(max-width: 600px)").matches));

  /* One map. cfg: container, status, center, items() -> [{id,lat,lng,glyph,impact,big,faded,html,title}],
     extent() -> [[lng,lat],...] to fit, onPick(id). Returns {render, refresh, refit, focus}. */
  function build(cfg){
    var statusEl=document.getElementById(cfg.status), box=document.getElementById(cfg.container);
    var ctl={render:function(){}, refresh:function(){}, refit:function(){}, focus:function(){}};
    function fail(msg){ if(statusEl){ statusEl.style.display=""; statusEl.innerHTML=msg; } }
    if(!webgl()){ fail("<b>This device can't draw the map.</b> The list below has everything, with the same filters."); return ctl; }
    if(statusEl) statusEl.innerHTML="Loading map...";
    Promise.all([lib(),style()]).then(function(r){
      var ml=r[0], sty=r[1], map;
      try{
        box.style.display="block";
        map=new ml.Map({container:box, style:sty, center:cfg.center, zoom:14, minZoom:11, maxZoom:18, dragRotate:false, pitchWithRotate:false, attributionControl:false, fadeDuration:0});
      }catch(e){ box.style.display="none"; fail("<b>This device can't draw the map.</b> The list below has everything, with the same filters."); return; }
      if(statusEl) statusEl.style.display="none";
      map.touchZoomRotate.disableRotation();
      map.addControl(new ml.NavigationControl({showCompass:false}),"top-left");
      /* The style carries its own OpenFreeMap / OpenStreetMap credits; keep them behind the (i) button. */
      map.addControl(new ml.AttributionControl({compact:true}),"bottom-right");
      map.on("load",function(){ var a=box.querySelector(".maplibregl-ctrl-attrib"); if(a) a.classList.remove("maplibregl-compact-show"); });
      map.on("error",function(){});
      var touched=false;
      map.on("dragstart",function(){ touched=true; });
      map.on("zoomstart",function(e){ if(e&&e.originalEvent) touched=true; });
      var markers=[], popup=new ml.Popup({closeButton:false, closeOnClick:true, offset:20, maxWidth:"300px"}), hideT=null, sticky=false;
      function hidePopup(){ clearTimeout(hideT); popup.remove(); sticky=false; }
      function hideSoon(){ clearTimeout(hideT); hideT=setTimeout(function(){ if(!sticky) popup.remove(); },260); }
      popup.on("open",function(){ var el=popup.getElement(); if(!el) return;
        el.addEventListener("mouseenter",function(){ clearTimeout(hideT); });
        el.addEventListener("mouseleave",function(){ if(!sticky) hideSoon(); });
        el.addEventListener("click",function(ev){ var a=ev.target.closest&&ev.target.closest("[data-pick]"); if(a){ ev.preventDefault(); var id=a.getAttribute("data-pick"); hidePopup(); cfg.onPick(id); } });
      });
      function groupHtml(g){
        if(g.items.length===1) return g.items[0].html;
        return '<div class="m"><b>'+g.items.length+' at this spot</b></div><div class="hgrp">'+g.items.map(function(x){ var I=IMPACT[x.impact]; return '<a href="#" data-pick="'+x.id+'"><i style="background:'+I.c+';color:'+I.g+'">'+svg(x.glyph,12)+'</i>'+x.title+'</a>'; }).join("")+'</div>';
      }
      function draw(){
        markers.forEach(function(m){ m.remove(); }); markers=[];
        var items=cfg.items(), groups={}, list=[];
        items.forEach(function(x){ var k=x.lat.toFixed(5)+","+x.lng.toFixed(5); if(!groups[k]){ groups[k]={lat:x.lat,lng:x.lng,items:[]}; list.push(groups[k]); } groups[k].items.push(x); });
        list.forEach(function(g){ g.items.sort(function(a,b){ return ORDER[b.impact]-ORDER[a.impact]; }); g.top=g.items[0]; g.faded=g.items.every(function(x){ return x.faded; }); });
        list.sort(function(a,b){ return ORDER[a.top.impact]-ORDER[b.top.impact]; });
        list.forEach(function(g){
          var t=g.top, I=IMPACT[t.impact];
          var el=document.createElement("button"); el.type="button";
          el.className="hpin"+(g.items.some(function(x){ return x.big; })?" big":"")+(g.faded?" faded":"");
          el.style.background=I.c; el.style.color=I.g;
          el.setAttribute("aria-label",g.items.length>1?(g.items.length+" items here"):(I.label+": "+t.title));
          el.innerHTML=svg(t.glyph,el.className.indexOf("big")>=0?19:16)+(g.items.length>1?'<span class="n">'+g.items.length+'</span>':"");
          el.addEventListener("mouseenter",function(){ if(!HOVER||sticky) return; clearTimeout(hideT); popup.setLngLat([g.lng,g.lat]).setHTML(groupHtml(g)).addTo(map); });
          el.addEventListener("mouseleave",function(){ if(HOVER&&!sticky) hideSoon(); });
          /* One item: go straight to its card. Several: a sticky list to choose from. */
          el.addEventListener("click",function(ev){ ev.stopPropagation();
            if(g.items.length===1){ hidePopup(); cfg.onPick(t.id); return; }
            sticky=true; clearTimeout(hideT); popup.setLngLat([g.lng,g.lat]).setHTML(groupHtml(g)).addTo(map); });
          markers.push(new ml.Marker({element:el, anchor:"center"}).setLngLat([g.lng,g.lat]).addTo(map));
        });
      }
      function fit(){
        var pts=cfg.extent(); if(!pts.length) return;
        var b=pts.reduce(function(bb,p){ return bb.extend(p); }, new ml.LngLatBounds(pts[0],pts[0]));
        map.resize(); map.fitBounds(b,{padding:44, maxZoom:16, animate:false});
      }
      ctl.render=function(){ hidePopup(); draw(); };
      ctl.refresh=function(){ map.resize(); if(!touched) fit(); };
      ctl.refit=function(){ touched=false; fit(); };
      ctl.focus=function(lng,lat){ touched=true; map.easeTo({center:[lng,lat], zoom:Math.max(map.getZoom(),16), duration:500}); };
      if("ResizeObserver" in window) new ResizeObserver(function(){ map.resize(); if(!touched) fit(); }).observe(box);
      map.once("style.load",function(){ draw(); fit(); });
      setTimeout(ctl.refresh,300); setTimeout(ctl.refresh,1200);
    }).catch(function(){ fail("<b>The map could not load.</b> Check your connection; the list below still works."); });
    return ctl;
  }

  /* ---- the Map tab ---- */
  var KINDS=[{v:"roads",label:"Roads &amp; footpaths",g:"cone"},{v:"construction",label:"Construction",g:"crane"},{v:"events",label:"Events",g:"star"},{v:"transport",label:"Public transport",g:"bus"}];
  var MODES=[{v:"train",label:"Train",g:"train"},{v:"bus",label:"Bus",g:"bus"},{v:"cat",label:"CAT",g:"bus"}];
  var AREAS=[{v:"east",label:"East"},{v:"central",label:"Central"},{v:"west",label:"West"},{v:"all",label:"Whole city"}];
  var CATL={obstruction:"Obstruction",event:"Event",roadclosure:"Road closure",infrastructure:"Construction"};
  var MODEL={train:"Train",bus:"Bus",cat:"CAT"};
  function zoneOfBoard(){ try{ return HZ; }catch(e){ return "east"; } }

  function pd(s){ if(!s) return null; var p=String(s).split("/"); if(p.length!==3) return null; return new Date(+p[2],+p[1]-1,+p[0]); }
  function mid(){ var t=new Date(); t.setHours(0,0,0,0); return t; }
  function onDay(r,t){ if(r.start&&r.start>t) return false; if(r.end&&r.end<t) return false; if(r.days&&r.days.indexOf(t.getDay())<0) return false; return true; }
  function past(r){ return !!(r.end&&r.end<mid()); }
  function inWeek(r){ var t=mid(); for(var i=0;i<7;i++){ var d=new Date(t); d.setDate(t.getDate()+i); if(onDay(r,d)) return true; } return false; }
  function badge(I,g){ return '<span class="hk" style="background:'+I.c+';color:'+I.g+'">'+svg(g,12)+I.label+'</span>'; }

  var recs=null;
  function records(){
    if(recs) return recs; recs=[];
    var H=window.HUB||{};
    (H.disruptions||[]).forEach(function(d){
      if(typeof d.lat!=="number"||typeof d.lng!=="number") return;
      var k=impactKey(d,"dis"), I=IMPACT[k], g=glyphOf(d,"dis"), s=pd(d.start), e=pd(d.end);
      var tag=d.cat==="event"?(d.recurring?" &middot; Recurring":" &middot; One-off"):((s&&e&&e>s)?" &middot; Ongoing":"");
      var meta=esc(d.id)+" &middot; "+esc(d.start)+" - "+esc(d.end)+(d.sched?" &middot; "+esc(d.sched):"")+tag;
      var body=(d.desc?"<div class='d'>"+esc(d.desc)+"</div>":"")+(d.impact?"<div class='im'>&#9650; "+esc(d.impact)+"</div>":"")+"<div class='m' style='margin-top:4px'>"+esc(d.loc)+"</div>";
      var id="d-"+d.id;
      recs.push({id:id, src:"dis", kind:d.cat==="event"?"events":d.cat==="infrastructure"?"construction":"roads", impact:k, glyph:g,
        big:d.sev==="major"||k==="block", title:esc(d.title), start:s, end:e, days:d.days||null, zones:[d.zone||"unknown"], pts:[[d.lat,d.lng]],
        text:(d.title+" "+d.loc+" "+d.desc+" "+d.id).toLowerCase(),
        card:"<div class='card' data-id='"+id+"' style='border-left-color:"+I.c+"'><div class='t'>"+esc(d.title)+"</div><div class='m'><span class='kb'>"+svg(g,11)+(CATL[d.cat]||"")+"</span>"+meta+"</div>"+body+
          "<div style='margin-top:5px'><a href='"+(d.url||"https://perth.wa.gov.au/public-notices/road-closures")+"' target='_blank' rel='noopener'>Official report &#8599;</a></div></div>",
        pop:function(){ return badge(I,g)+"<h3>"+esc(d.title)+"</h3><div class='m'>"+(CATL[d.cat]||"")+" &middot; "+meta+"</div>"+body; }});
    });
    var P=window.PTA_DATA; if(!P){ try{ P=PTA_ALL; }catch(x){ P=[]; } }
    (P||[]).forEach(function(d){
      var pts=(d.pts||(typeof d.lat==="number"?[[d.lat,d.lng,d.loc]]:[])).filter(function(p){ return typeof p[0]==="number"; });
      if(!pts.length) return;
      var k=impactKey(d,"pta"), I=IMPACT[k], g=glyphOf(d,"pta"), mode=MODEL[d.mode]||"";
      var when=d.ongoing?(esc(d.start)+" - until further notice"):(esc(d.start)+(d.end&&d.end!==d.start?" - "+esc(d.end):""));
      var body=(d.desc?"<div class='d'>"+esc(d.desc)+"</div>":"")+(d.impact?"<div class='im'>&#9650; "+esc(d.impact)+"</div>":"")+"<div class='m' style='margin-top:4px'><b>Affected:</b> "+esc(d.stops)+"</div><div class='m'>"+esc(d.loc)+"</div>";
      var id="p-"+d.id;
      recs.push({id:id, src:"pta", kind:"transport", mode:d.mode, impact:k, glyph:g, big:k==="block", title:esc(d.title),
        start:pd(d.start), end:d.ongoing?null:pd(d.end), days:null, zones:d.zones||["all"], pts:pts,
        text:(d.title+" "+d.routes+" "+d.stops+" "+d.loc+" "+(d.desc||"")).toLowerCase(),
        card:"<div class='card' data-id='"+id+"' style='border-left-color:"+I.c+"'><div class='t'>"+esc(d.title)+"</div><div class='m'><span class='kb'>"+svg(g,11)+mode+"</span>"+when+(d.ongoing?" &middot; Ongoing":"")+"</div>"+body+
          "<div style='margin-top:5px'><a href='"+esc(d.url)+"' target='_blank' rel='noopener'>Transperth details &#8599;</a></div></div>",
        pop:function(p){ return badge(I,g)+"<h3>"+esc(d.title)+"</h3><div class='m'>"+mode+" &middot; "+when+"</div><div class='m'><b>Stop:</b> "+esc(p[2]||d.loc)+"</div>"+(d.impact?"<div class='im'>&#9650; "+esc(d.impact)+"</div>":"")+"<a class='more' href='"+esc(d.url)+"' target='_blank' rel='noopener'>Transperth details &#8599;</a>"; }});
    });
    return recs;
  }
  function byId(id){ var r=records(); for(var i=0;i<r.length;i++) if(r[i].id===id) return r[i]; return null; }

  var S={when:"today", what:{roads:1,construction:1,events:1,transport:1}, modes:{train:1,bus:1,cat:1}, area:"east", block:false, q:""};
  function inArea(r){ return S.area==="all"||r.zones.indexOf(S.area)>=0||r.zones.indexOf("city")>=0||r.zones.indexOf("all")>=0; }
  function match(r,skip){
    if(past(r)) return false;
    if(skip!=="when"){ if(S.when==="today"&&!onDay(r,mid())) return false; if(S.when==="week"&&!inWeek(r)) return false; }
    if(skip!=="what"&&!S.what[r.kind]) return false;
    if(r.src==="pta"&&!S.modes[r.mode]) return false;
    if(!inArea(r)) return false;
    if(S.block&&r.impact!=="block") return false;
    if(S.q&&r.text.indexOf(S.q)<0) return false;
    return true;
  }

  var SKELETON=
    '<div class="mapwrap"><div id="status">Loading map...</div><div id="map" style="display:none"></div><button type="button" class="maphelp" aria-label="About this map" onclick="this.parentNode.querySelector(\'.maphelptip\').classList.toggle(\'open\')">?</button><div class="maphelptip">Roadworks, closures, construction, events and Transperth stop changes across the <b>City of Perth</b>. Pick an area, or the whole city. Tap a pin or a card for the detail. The filters work on the map and the list together.</div></div>'+
    '<div id="mapctl">'+
      '<div class="mcrow"><span class="mclabel">When</span><span class="seg" id="hmWhen"><button data-v="today">Today</button><button data-v="week">This week</button><button data-v="all">All current</button></span><span class="mccount" id="cnt"></span></div>'+
      '<div class="mcrow" id="hmWhat"><span class="mclabel">Show</span>'+KINDS.map(function(k){ return '<button class="lchip" data-v="'+k.v+'"><i class="hg">'+svg(k.g,15)+'</i>'+k.label+'<span class="ct"></span></button>'; }).join("")+'</div>'+
      '<div class="mcrow" id="hmModes"><span class="mclabel">Transport</span>'+MODES.map(function(m){ return '<button class="lchip" data-v="'+m.v+'"><i class="hg">'+svg(m.g,15)+'</i>'+m.label+'</button>'; }).join("")+'</div>'+
      '<div class="mcrow"><span class="mclabel">Area</span><span class="seg" id="hmArea">'+AREAS.map(function(a){ return '<button data-v="'+a.v+'">'+a.label+'</button>'; }).join("")+'</span><button class="tchip" id="hmBlock">Only what blocks the way</button></div>'+
      '<div class="mckey"><span><i class="hdot" style="background:'+IMPACT.block.c+'"></i>Blocks the way</span><span><i class="hdot" style="background:'+IMPACT.slow.c+'"></i>Slows you down</span><span><i class="hdot" style="background:'+IMPACT.info.c+'"></i>Good to know</span><span class="sep"></span><span>Faded pins are not on today</span></div>'+
    '</div>'+
    '<div class="controls" style="margin-top:12px"><input class="search" id="disSearch" aria-label="Search the map" placeholder="Search streets, events, routes or stops..."></div>'+
    '<div id="disList"></div>';

  var mapCtl=null, ready=false, skipPreset=false, lastArea=null, areaFromHash=false;
  function $(id){ return document.getElementById(id); }
  function syncUI(){
    $("hmWhen").querySelectorAll("button").forEach(function(b){ b.classList.toggle("on",b.dataset.v===S.when); });
    $("hmArea").querySelectorAll("button").forEach(function(b){ b.classList.toggle("on",b.dataset.v===S.area); });
    $("hmWhat").querySelectorAll(".lchip").forEach(function(b){ b.classList.toggle("off",!S.what[b.dataset.v]); });
    $("hmModes").querySelectorAll(".lchip").forEach(function(b){ b.classList.toggle("off",!S.modes[b.dataset.v]); });
    $("hmModes").hidden=!S.what.transport;
    $("hmBlock").classList.toggle("on",S.block);
    var s=$("disSearch"); if(s.value.toLowerCase()!==S.q) s.value=S.q;
  }
  function writeHash(){
    if(!ready) return; /* never overwrite the address before init has read it */
    var t=$("tab-disruptions"); if(!t||!t.classList.contains("active")) return;
    var w=KINDS.filter(function(k){ return S.what[k.v]; }).map(function(k){ return k.v; }).join(",")||"none";
    var qs="when="+S.when+"&what="+w+"&area="+S.area;
    var m=MODES.filter(function(x){ return S.modes[x.v]; }).map(function(x){ return x.v; });
    if(m.length<MODES.length) qs+="&modes="+(m.join(",")||"none");
    if(S.block) qs+="&block=1";
    if(S.q) qs+="&q="+encodeURIComponent(S.q);
    try{ history.replaceState(null,"","#disruptions?"+qs); }catch(e){}
  }
  function readHash(){
    var m=(location.hash||"").match(/^#(disruptions|transport)\?(.*)$/); if(!m) return false;
    var p={}; m[2].split("&").forEach(function(kv){ var i=kv.indexOf("="); if(i>0) p[kv.slice(0,i)]=decodeURIComponent(kv.slice(i+1)); });
    if(/^(today|week|all)$/.test(p.when||"")) S.when=p.when;
    if(p.what){ S.what={}; p.what.split(",").forEach(function(v){ S.what[v]=1; }); }
    if(p.modes){ S.modes={}; p.modes.split(",").forEach(function(v){ S.modes[v]=1; }); }
    if(/^(east|central|west|all)$/.test(p.area||"")){ S.area=p.area; areaFromHash=true; }
    S.block=p.block==="1"; S.q=(p.q||"").toLowerCase();
    return true;
  }
  function apply(){
    if(!ready) return;
    var all=records(), vis=all.filter(function(r){ return match(r); });
    $("hmWhat").querySelectorAll(".lchip").forEach(function(b){ var n=all.filter(function(r){ return r.kind===b.dataset.v&&match(r,"what"); }).length; b.querySelector(".ct").textContent=n; });
    $("cnt").textContent=vis.length+(S.when==="today"?" on today":S.when==="week"?" this week":" current or coming up");
    vis.sort(function(a,b){ return (ORDER[b.impact]-ORDER[a.impact])||((a.start||0)-(b.start||0)); });
    $("disList").innerHTML=vis.length?vis.map(function(r){ return r.card; }).join(""):"<div class='note'>Nothing matches these filters. Try All current, or the whole city.</div>";
    if(mapCtl){ mapCtl.render(); if(lastArea!==S.area){ lastArea=S.area; mapCtl.refit(); } }
    writeHash();
  }
  /* A pin was picked: widen only what hides that item, then show its card. */
  function pick(id){
    var r=byId(id); if(!r) return;
    if(!match(r)){
      if(!onDay(r,mid())&&S.when==="today") S.when=inWeek(r)?"week":"all";
      if(S.when==="week"&&!inWeek(r)) S.when="all";
      S.what[r.kind]=1; if(r.mode) S.modes[r.mode]=1;
      if(!inArea(r)) S.area="all";
      if(S.block&&r.impact!=="block") S.block=false;
      if(S.q&&r.text.indexOf(S.q)<0) S.q="";
      syncUI(); apply();
    }
    var card=document.querySelector('#disList .card[data-id="'+id+'"]');
    if(card){ card.scrollIntoView({behavior:"smooth",block:"center"}); card.classList.remove("flash"); void card.offsetWidth; card.classList.add("flash"); }
  }
  function bind(){
    $("hmWhen").addEventListener("click",function(e){ var b=e.target.closest("button"); if(!b) return; S.when=b.dataset.v; syncUI(); apply(); });
    $("hmArea").addEventListener("click",function(e){ var b=e.target.closest("button"); if(!b) return; S.area=b.dataset.v; syncUI(); apply(); });
    $("hmWhat").addEventListener("click",function(e){ var b=e.target.closest(".lchip"); if(!b) return; if(S.what[b.dataset.v]) delete S.what[b.dataset.v]; else S.what[b.dataset.v]=1; syncUI(); apply(); });
    $("hmModes").addEventListener("click",function(e){ var b=e.target.closest(".lchip"); if(!b) return; if(S.modes[b.dataset.v]) delete S.modes[b.dataset.v]; else S.modes[b.dataset.v]=1; syncUI(); apply(); });
    $("hmBlock").addEventListener("click",function(){ S.block=!S.block; syncUI(); apply(); });
    $("disSearch").addEventListener("input",function(){ S.q=(this.value||"").toLowerCase(); apply(); });
    $("disList").addEventListener("click",function(e){ if(e.target.closest("a")) return; var c=e.target.closest(".card"); if(!c||!mapCtl) return; var r=byId(c.dataset.id); if(r) mapCtl.focus(r.pts[0][1],r.pts[0][0]); });
  }

  /* Build the tab now (this script runs after the sections are parsed). The old Transport section goes; its
     links and the #transport address open this tab with only public transport shown. */
  var sec=document.getElementById("tab-disruptions");
  if(sec){
    sec.innerHTML=SKELETON;
    var old=document.getElementById("tab-transport"); if(old) old.parentNode.removeChild(old);
    bind();
    /* Read a saved view now, before the board's tab router runs activateTab (which would preset over it). */
    if(readHash()) skipPreset=true;
  }
  function init(){
    if(!sec) return;
    if(!areaFromHash) S.area=zoneOfBoard();
    lastArea=S.area;
    ready=true; syncUI(); apply();
    var bp=$("bPta"); if(bp) bp.textContent=records().filter(function(r){ return r.src==="pta"&&!past(r)&&r.zones.indexOf(zoneOfBoard())>=0; }).length;
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else setTimeout(init,0);

  window.HubMapTab={
    /* From activateTab: "transport" shows public transport only; "disruptions" shows everything. Keeps When and Area. */
    preset:function(name){
      if(skipPreset){ skipPreset=false; return; }
      if(name==="transport"){ S.what={transport:1}; S.modes={train:1,bus:1,cat:1}; }
      else S.what={roads:1,construction:1,events:1,transport:1};
      if(ready){ syncUI(); apply(); }
    },
    show:function(){
      if(!sec) return;
      if(!mapCtl){
        mapCtl=build({container:"map", status:"status", center:[115.8745,-31.956],
          items:function(){
            var out=[], t=mid();
            records().forEach(function(r){ if(!match(r)) return; var faded=S.when!=="today"&&!onDay(r,t);
              r.pts.forEach(function(p){ out.push({id:r.id, lat:p[0], lng:p[1], glyph:r.glyph, impact:r.impact, big:r.big, faded:faded, html:r.pop(p), title:r.title}); }); });
            return out;
          },
          extent:function(){ var o=[]; records().forEach(function(r){ if(past(r)||!inArea(r)) return; r.pts.forEach(function(p){ o.push([p[1],p[0]]); }); }); return o; },
          onPick:pick
        });
      } else mapCtl.refresh();
      writeHash();
    }
  };
  window.HubMap={ impactColor:function(d,kind){ return IMPACT[impactKey(d,kind)].c; } };
})();
