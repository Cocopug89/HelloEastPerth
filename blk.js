
function htick(){var d=new Date();var h=d.getHours(),m=d.getMinutes();var c=document.getElementById("hclock");if(c)c.textContent=h+":"+(m<10?"0":"")+m;var dd=document.getElementById("hdate");if(dd)dd.textContent=d.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"});}
htick();setInterval(htick,10000);
(function(){var codes={0:["Clear","☀️"],1:["Mainly clear","🌤️"],2:["Partly cloudy","⛅"],3:["Overcast","☁️"],45:["Fog","🌫️"],48:["Fog","🌫️"],51:["Drizzle","🌦️"],61:["Rain","🌧️"],63:["Rain","🌧️"],65:["Heavy rain","🌧️"],80:["Showers","🌦️"],95:["Storm","⛈️"]};
function __loadWx(){fetch("https://api.open-meteo.com/v1/forecast?latitude=-31.955&longitude=115.875&current=temperature_2m,apparent_temperature,weather_code&timezone=Australia%2FPerth").then(function(r){return r.json();}).then(function(j){var c=j.current,info=codes[c.weather_code]||["",""];var te=document.getElementById("hwxTemp");if(te)te.innerHTML=Math.round(c.temperature_2m)+"&deg;";var co=document.getElementById("hwxCond");if(co)co.textContent=info[0]+" · feels "+Math.round(c.apparent_temperature)+"°";var ic=document.getElementById("hwxIco");if(ic&&info[1])ic.textContent=info[1];}).catch(function(){});}__loadWx();(function(){var n=new Date();var ms=(3600-(n.getMinutes()*60+n.getSeconds()))*1000-n.getMilliseconds();if(ms<1000)ms+=3600000;setTimeout(function tk(){__loadWx();setTimeout(tk,3600000);},ms);})();(function(){function armMid(){var n=new Date();var mid=new Date(n.getFullYear(),n.getMonth(),n.getDate()+1,0,0,15,0);setTimeout(function(){location.reload();},mid.getTime()-n.getTime());}armMid();})();})();
/* Fit guard (19 Jul 2026): at narrow desktop widths (e.g. a ~1024px non-maximised
   window) the home dashboard needs more height than the locked 100vh/min-height:820px
   layout gives it, and the hero cards painted over the navbar/footer. Measure the
   actual shortfall and grow body min-height so the page scrolls instead of overlapping.
   Re-runs on resize, font load, tab switch (body class) and data render (stage subtree). */
(function(){
var raf=null;
function fit(){
  raf=null;
  var b=document.body;
  if((window.innerWidth||0)<768||!b.classList.contains("on-home")){b.style.minHeight="";return;}
  var stage=document.querySelector("#tab-home .stage");
  if(!stage){b.style.minHeight="";return;}
  b.style.minHeight="";
  var deficit=stage.scrollHeight-stage.clientHeight;
  if(deficit>1)b.style.minHeight=(b.scrollHeight+deficit)+"px";
}
function queue(){if(raf!=null)return;raf=setTimeout(fit,40);}
addEventListener("resize",queue);
addEventListener("load",queue);
if(document.fonts&&document.fonts.ready&&document.fonts.ready.then)document.fonts.ready.then(queue);
if(window.MutationObserver){
  new MutationObserver(queue).observe(document.body,{attributes:true,attributeFilter:["class"]});
  var st=document.querySelector("#tab-home .stage");
  if(st)new MutationObserver(queue).observe(st,{childList:true,subtree:true});
}
setTimeout(queue,400);setTimeout(queue,1500);
queue();
})();

