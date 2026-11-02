/* East Perth Hub maps. Step 1 of "2026-11-02 - Hub map consolidation plan (one map, Heritage Hunt style)".
   One engine for the Disruptions and Transport maps on all three boards: MapLibre (maplibre-gl.js, vendored
   flat in this folder) on the EPCG basemap shared with the Heritage Hunt (hub-map-style.js).
   One pin system: the glyph says WHAT it is, the colour says HOW MUCH it matters (three levels only).
   Same-address items share one pin with a count. Items not on today are faded when "All current" is shown.
   It reads each board's own globals and filter controls (DATA, PTA, mapTimeMode, ptaTimeMode, the chips and
   search boxes), so the boards keep their filters and no data file or scheduled role changes. Step 2 merges
   the two tabs and replaces the two filter bars with one. */
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
  var CAT_GLYPH={roadclosure:"cone",obstruction:"cone",event:"star",infrastructure:"crane"};
  var MODE_GLYPH={train:"train",bus:"bus",cat:"bus"};

  var css=
    "#map,#ptaMap{overflow:hidden}"+
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
    ".mckey .hdot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px;vertical-align:-1px;border:1.5px solid #fff}";
  var st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);

  /* The filter chips and the key speak the new language: glyphs on the chips, the three impact colours in the key. */
  function dressControls(){
    document.querySelectorAll("#legend .lchip").forEach(function(c){ var b=c.querySelector("b"); var g=CAT_GLYPH[c.dataset.cat]; if(b&&g){ var i=document.createElement("i"); i.className="hg"; i.innerHTML=svg(g,15); b.replaceWith(i);} });
    document.querySelectorAll("#ptalegend .lchip").forEach(function(c){ var b=c.querySelector("b"); var g=MODE_GLYPH[c.dataset.mode]; if(b&&g){ var i=document.createElement("i"); i.className="hg"; i.innerHTML=svg(g,15); b.replaceWith(i);} });
    function dot(k){ return '<span><i class="hdot" style="background:'+IMPACT[k].c+'"></i>'+IMPACT[k].label+'</span>'; }
    var k1=document.querySelector("#mapctl .mckey"); if(k1) k1.innerHTML=dot("block")+dot("slow")+dot("info")+'<span class="sep"></span><span>Faded pins are not on today</span>';
    var k2=document.querySelector("#ptamapctl .mckey"); if(k2) k2.innerHTML=dot("block")+dot("slow")+'<span class="sep"></span><span>Each pin is an affected stop</span>';
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",dressControls); else dressControls();

  /* ---- MapLibre, loaded once and only when a map tab opens ---- */
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
     extent() -> [[lng,lat],...] for the first fit, onPick(id). Returns {render, refresh}. */
  function build(cfg){
    var statusEl=document.getElementById(cfg.status), box=document.getElementById(cfg.container);
    var ctl={render:function(){}, refresh:function(){}};
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
          /* One item: go straight to its card (as before). Several: a sticky list to choose from. */
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
      if("ResizeObserver" in window) new ResizeObserver(function(){ map.resize(); if(!touched) fit(); }).observe(box);
      map.once("style.load",function(){ draw(); fit(); });
      setTimeout(ctl.refresh,300); setTimeout(ctl.refresh,1200);
    }).catch(function(){ fail("<b>The map could not load.</b> Check your connection; the list below still works."); });
    return ctl;
  }

  function q(id){ var e=document.getElementById(id); return ((e&&e.value)||"").toLowerCase(); }
  function chipState(sel,key){ var s={}; document.querySelectorAll(sel+" .lchip").forEach(function(c){ s[c.dataset[key]]=!c.classList.contains("off"); }); return s; }
  function esc(s){ return String(s==null?"":s); }

  /* Disruptions tab (board globals: DATA, mapTimeMode, isPast, activeToday, goToDetails). */
  function disItem(d){
    var k=impactKey(d,"dis"), I=IMPACT[k], cat={obstruction:"Obstruction",event:"Event",roadclosure:"Road closure",infrastructure:"Construction"}[d.cat]||"";
    var html='<span class="hk" style="background:'+I.c+';color:'+I.g+'">'+svg(glyphOf(d,"dis"),12)+I.label+'</span>'+
      "<h3>"+esc(d.title)+"</h3><div class='m'>"+cat+" &middot; "+esc(d.id)+" &middot; "+esc(d.start)+" - "+esc(d.end)+"</div>"+
      (d.sched?"<div class='m'>"+esc(d.sched)+"</div>":"")+"<div>"+esc(d.desc)+"</div>"+(d.impact?"<div class='im'>&#9650; "+esc(d.impact)+"</div>":"")+"<div class='m' style='margin-top:4px'>"+esc(d.loc)+"</div>";
    return {id:d.id, lat:d.lat, lng:d.lng, glyph:glyphOf(d,"dis"), impact:k, big:(d.sev==="major"||k==="block"), faded:(mapTimeMode!=="today"&&!activeToday(d)), html:html, title:esc(d.title)};
  }
  function dis(){
    var c=build({container:"map", status:"status", center:[115.8745,-31.956],
      items:function(){
        var cats=chipState("#legend","cat"), s=q("disSearch"), out=[];
        DATA.forEach(function(d){
          if(typeof d.lat!=="number"||isPast(d)) return;
          if(mapTimeMode==="today"&&!activeToday(d)) return;
          if(!cats[d.cat]) return;
          if(s&&(d.title+" "+d.loc+" "+d.desc+" "+d.id).toLowerCase().indexOf(s)===-1) return;
          out.push(disItem(d));
        });
        var cnt=document.getElementById("cnt"); if(cnt){ var t=new Date().toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short",year:"numeric"}); cnt.textContent=mapTimeMode==="today"?(out.length+" active today ("+t+")"):(out.length+" current/upcoming"); }
        return out;
      },
      extent:function(){ var v=DATA.filter(function(d){ return typeof d.lat==="number"&&!isPast(d); }); return (v.length?v:DATA).map(function(d){ return [d.lng,d.lat]; }); },
      onPick:function(id){ goToDetails(id); }
    });
    window.disMapRender=function(){ c.render(); }; invalidate=function(){ c.refresh(); }; /* late-bound: the real ones arrive when the map has loaded */
  }

  /* Transport tab (board globals: PTA, ptaTimeMode, ptaIsPast, ptaActiveToday, goToPta). One pin per affected stop. */
  function pta(){
    var c=build({container:"ptaMap", status:"ptaStatus", center:[115.86,-31.953],
      items:function(){
        var modes=chipState("#ptalegend","mode"), s=q("ptaSearch"), out=[], ids={};
        PTA.forEach(function(d){
          if(ptaIsPast(d)) return;
          if(ptaTimeMode==="today"&&!ptaActiveToday(d)) return;
          if(!modes[d.mode]) return;
          if(s&&(d.title+" "+d.routes+" "+d.stops+" "+d.loc+" "+d.desc).toLowerCase().indexOf(s)===-1) return;
          var k=impactKey(d,"pta"), I=IMPACT[k], mode={train:"Train",bus:"Bus",cat:"CAT"}[d.mode]||"";
          var when=d.ongoing?(d.start+" - until further notice"):(d.start+(d.end&&d.end!==d.start?" - "+d.end:""));
          var pts=d.pts||(typeof d.lat==="number"?[[d.lat,d.lng,d.loc]]:[]);
          pts.forEach(function(p){
            var html='<span class="hk" style="background:'+I.c+';color:'+I.g+'">'+svg(glyphOf(d,"pta"),12)+I.label+'</span>'+
              "<h3>"+esc(d.title)+"</h3><div class='m'>"+mode+" &middot; "+when+"</div><div class='m'><b>Stop:</b> "+esc(p[2]||d.loc)+"</div>"+(d.desc?"<div>"+esc(d.desc)+"</div>":"")+
              (d.impact?"<div class='im'>&#9650; "+esc(d.impact)+"</div>":"")+"<a class='more' href='"+d.url+"' target='_blank' rel='noopener'>Transperth details &#8599;</a>";
            out.push({id:d.id, lat:p[0], lng:p[1], glyph:glyphOf(d,"pta"), impact:k, big:k==="block", faded:false, html:html, title:esc(d.title)});
          });
          ids[d.id]=1;
        });
        var el=document.getElementById("ptaCnt"); if(el){ var n=Object.keys(ids).length; el.textContent=ptaTimeMode==="today"?(n+" active today"):(n+" current / upcoming"); }
        return out;
      },
      extent:function(){ var o=[]; PTA.forEach(function(d){ if(ptaIsPast(d)) return; (d.pts||(typeof d.lat==="number"?[[d.lat,d.lng]]:[])).forEach(function(p){ o.push([p[1],p[0]]); }); }); return o; },
      onPick:function(id){ goToPta(id); }
    });
    window.ptaMapRender=function(){ c.render(); }; ptaInvalidate=function(){ c.refresh(); };
  }

  window.HubMap={ impactColor:function(d,kind){ return IMPACT[impactKey(d,kind)].c; } };
  window.HubBoardMaps={ dis:dis, pta:pta };
})();
