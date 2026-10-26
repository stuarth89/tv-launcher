(function(){
  var GLYPHS = { /* simplified white monochrome marks (not official logos) */
    spotify:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><path d="M6 9c4-1.3 8.5-1 12 1M6.8 12.4c3.3-1 7-.7 9.8.9M7.5 15.6c2.7-.7 5.6-.5 7.8.8" fill="none" stroke="#000" stroke-opacity=".85" stroke-width="1.7" stroke-linecap="round"/></svg>',
    netflix:'<svg viewBox="0 0 24 24"><path d="M5 2h4l6 13V2h4v20h-4L9 9v13H5z"/></svg>',
    youtube:'<svg viewBox="0 0 24 24"><path d="M2 7.5C2 5.6 3.3 4.5 5 4.4 8 4.2 16 4.2 19 4.4c1.7.1 3 1.2 3 3.1v9c0 1.9-1.3 3-3 3.1-3 .2-11 .2-14 0-1.7-.1-3-1.2-3-3.1z"/><path d="M10 8.5v7l6-3.5z" fill="#000" fill-opacity=".8"/></svg>',
    apple:'<svg viewBox="0 0 24 24"><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-.8-3-.8C6.9 7.3 5.4 8.2 4.6 9.7c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8 2.1-1.2 2.9-2.3c.9-1.3 1.3-2.6 1.3-2.7 0 0-2.7-1-2.8-4.1zM14.1 5.4c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z"/></svg>',
    prime:'<svg viewBox="0 0 24 24"><path d="M2 14.5c5.6 3.4 13.4 3.6 19 .3l.7.9C16 20 7.6 19.7 1.5 15.3z"/><path d="M18.5 13.6l3.6-.3-.9 3.5-.8-.3.4-1.9-2.1.2z"/></svg>',
    disney:'<svg viewBox="0 0 24 24"><path d="M2.5 15.5C5 9 13.5 6 21 9.5l-.6 1C14 8 6.5 10.5 4.2 16z" /><path d="M17 13h2v2.5h2.5v2H19V20h-2v-2.5h-2.5v-2H17z"/></svg>',
    tving:'<svg viewBox="0 0 24 24"><path d="M3 4h18v4h-7v13h-4V8H3z"/></svg>',
    coupang:'<svg viewBox="0 0 24 24"><path d="M6 3.5 20 12 6 20.5z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/></svg>',
    wavve:'<svg viewBox="0 0 24 24"><path d="M1.5 6h3.3l2.4 8.5L10 6h4l2.8 8.5L19.2 6h3.3l-4.2 12h-3.2L12 9.8 9.1 18H5.8z"/></svg>'
  };
  var REMOTE=['https://raw.githubusercontent.com/stuarth89/tv-launcher/main/config.json',
              'https://cdn.jsdelivr.net/gh/stuarth89/tv-launcher@main/config.json'];
  var WALLS=[], cfg=null, apps=[], idx=0, zone='list', iconIdx=0, installed=null, panel=false, gridIdx=0, gridApps=[];
  var K={LEFT:37,UP:38,RIGHT:39,DOWN:40,ENTER:13,BACK:10009,ESC:27};
  var hasTizen=typeof tizen!=='undefined';
  var list=document.getElementById('list'), items=[], icons=[].slice.call(document.querySelectorAll('.ic'));

  function store(k,v){ try{ if(v===undefined) return localStorage.getItem(k); localStorage.setItem(k,v);}catch(e){} }
  var wi=0, rotTimer=null;
  function setWall(){ if(!WALLS.length) return; wi=wi%WALLS.length; document.getElementById('wall').style.backgroundImage='url("'+WALLS[wi]+'")'; store('wallIdx',String(wi)); }

  function toast(m){ var t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(function(){t.classList.remove('show');},2600); }

  function valid(c){ return c && c.apps && c.apps.length && typeof c.apps[0].name==='string'; }
  function applyConfig(c, source){
    if(!valid(c)) return false;
    cfg=c; window.LAUNCHER_CONFIG_SOURCE=source;
    apps=c.apps; list.innerHTML=''; items=[]; idx=Math.min(idx,apps.length-1);
    apps.forEach(function(a){
      var el=document.createElement('div'); el.className='item';
      var g=a.svg||GLYPHS[a.glyph]||(a.icon?'<img src="'+a.icon+'" style="width:88px;height:88px;object-fit:contain">':a.name.charAt(0));
      el.innerHTML='<div class="g">'+g+'</div><span class="n"></span>';
      el.querySelector('.n').textContent=a.name; list.appendChild(el); items.push(el);
    });
    var t=c.theme||{}, st=document.getElementById('themeStyle');
    if(!st){ st=document.createElement('style'); st.id='themeStyle'; document.head.appendChild(st); }
    var sc=t.scrim==null?0.62:+t.scrim, fs=+t.fontSize||110, dim=t.dimOpacity==null?0.6:+t.dimOpacity, rh=Math.round(fs*1.27);
    st.textContent='#scrim{background:linear-gradient(90deg,rgba(0,0,0,'+sc+') 0%,rgba(0,0,0,'+(sc*0.68).toFixed(2)+') 35%,rgba(0,0,0,'+(sc*0.2).toFixed(2)+') 60%,rgba(0,0,0,0) 75%),linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,0) 25%)}'+
      '.item{font-size:'+fs+'px;height:'+rh+'px;opacity:'+dim+'}.item .g,.item .g svg{width:'+Math.round(fs*0.8)+'px;height:'+Math.round(fs*0.8)+'px}';
    window.ROW_H=rh;
    WALLS=(c.wallpapers&&c.wallpapers.length)?c.wallpapers:['img/wall0.jpg'];
    var saved=parseInt(store('wallIdx'),10);
    wi = (c.wallpaper==='rotate') ? (isNaN(saved)?0:saved) : (typeof c.wallpaper==='number' ? c.wallpaper : (isNaN(saved)?0:saved));
    clearInterval(rotTimer);
    if(c.wallpaper==='rotate') rotTimer=setInterval(function(){ wi++; setWall(); }, (+c.rotateMinutes||10)*60000);
    setWall(); render(); loadInstalled(markMissing);
    return true;
  }

  function getJSON(url, ok, fail){
    try{ var x=new XMLHttpRequest(); x.open('GET', url+(url.indexOf('?')<0?'?':'&')+'t='+Date.now(), true); x.timeout=8000;
      x.onload=function(){ if(x.status>=200&&x.status<300){ try{ ok(JSON.parse(x.responseText)); }catch(e){ fail(); } } else fail(); };
      x.onerror=x.ontimeout=fail; x.send(); }catch(e){ fail(); }
  }
  function loadConfig(){
    // 1) last good remote config, 2) bundled config.json / apps.js, then 3) refresh from GitHub
    var cached=null; try{ cached=JSON.parse(store('cfgCache')||'null'); }catch(e){}
    if(!applyConfig(cached,'cache')){
      getJSON('config.json', function(c){ if(!cfg) applyConfig(c,'bundled'); }, function(){});
      if(window.LAUNCHER_APPS) applyConfig({apps:window.LAUNCHER_APPS, wallpapers:['img/wall0.jpg','img/wall1.jpg','img/wall2.jpg','img/wall3.jpg']},'bundled-js');
    }
    if(location.hash==='#offline') return;
    (function tryRemote(i){
      if(i>=REMOTE.length) return;
      getJSON(REMOTE[i], function(c){
        if(valid(c)){ var str=JSON.stringify(c); if(str!==JSON.stringify(cfg)||window.LAUNCHER_CONFIG_SOURCE!=='remote'){ store('cfgCache',str); applyConfig(c,'remote'); } }
        else tryRemote(i+1);
      }, function(){ tryRemote(i+1); });
    })(0);
  }

  function render(){
    items.forEach(function(t,j){ t.classList.toggle('focus', zone==='list'&&j===idx); });
    list.parentNode.classList.toggle('list-blur', zone!=='list');
    icons.forEach(function(t,j){ t.classList.toggle('focus', zone==='icons'&&j===iconIdx); });
    list.style.transform='translateY('+(-Math.max(0,idx-2)*(window.ROW_H||140))+'px)';
  }

  function loadInstalled(cb){
    if(!hasTizen){ installed=[]; cb&&cb(); return; }
    try{ tizen.application.getAppsInfo(function(l){installed=l;cb&&cb();},function(){installed=[];cb&&cb();}); }catch(e){installed=[];cb&&cb();}
  }
  function resolve(a){
    var ids=[]; if(a.id) ids.push(a.id); (a.alt||[]).forEach(function(x){ids.push(x);});
    if(installed&&installed.length){
      var hit=ids.filter(function(id){return installed.some(function(x){return x.id===id;});}); if(hit.length) return hit;
      var m=installed.filter(function(x){var n=(x.name||'').toLowerCase();return (a.match||[]).some(function(k){return n.indexOf(k)>=0;});});
      return m.length?[m[0].id]:[];
    }
    return ids;
  }
  function markMissing(){ if(!installed||!installed.length) return; apps.forEach(function(a,i){ items[i].classList.toggle('missing', !resolve(a).length); }); }
  function launchIds(name, ids){
    if(!hasTizen){ toast('Preview: would open '+name); return; }
    if(!ids.length){ toast(name+' isn\'t installed'); return; }
    (function next(k){ if(k>=ids.length){ toast('Couldn\'t open '+name+'. Check its ID in apps.js'); return; }
      try{ tizen.application.launch(ids[k],function(){},function(){next(k+1);}); }catch(e){next(k+1);} })(0);
  }
  function openSettings(){
    var s=(installed||[]).filter(function(x){return /settings|설정/i.test(x.name||'');});
    if(s.length) launchIds('Settings',[s[0].id]); else toast('Use the remote\'s Settings button');
  }

  function showGrid(){
    gridApps=(installed||[]).filter(function(x){return x.show!==false;}).sort(function(a,b){return (a.name||'').localeCompare(b.name||'');});
    var g=document.getElementById('grid'); g.innerHTML='';
    if(!gridApps.length) g.innerHTML='<div class="gi">App list is only available on the TV</div>';
    gridApps.forEach(function(x){ var d=document.createElement('div'); d.className='gi'; d.textContent=x.name; var s=document.createElement('small'); s.textContent=x.id; d.appendChild(s); g.appendChild(d); });
    gridIdx=0; panel=true; document.getElementById('panel').classList.remove('hidden'); renderGrid();
  }
  function renderGrid(){ [].forEach.call(document.querySelectorAll('.gi'),function(d,j){d.classList.toggle('focus',j===gridIdx);}); var f=document.querySelectorAll('.gi')[gridIdx]; f&&f.scrollIntoView({block:'nearest'}); }
  function hideGrid(){ panel=false; document.getElementById('panel').classList.add('hidden'); }

  function act(a){ if(a==='wall'){ wi=(wi+1)%WALLS.length; setWall(); } else if(a==='grid'){ loadInstalled(showGrid); } else openSettings(); }

  document.addEventListener('keydown',function(e){
    var c=e.keyCode;
    if(panel){
      var n=gridApps.length;
      if(c===K.BACK||c===K.ESC){hideGrid();e.preventDefault();}
      else if(c===K.RIGHT&&gridIdx<n-1)gridIdx++; else if(c===K.LEFT&&gridIdx>0)gridIdx--;
      else if(c===K.DOWN&&gridIdx+5<n)gridIdx+=5; else if(c===K.UP&&gridIdx>=5)gridIdx-=5;
      else if(c===K.ENTER&&n){launchIds(gridApps[gridIdx].name,[gridApps[gridIdx].id]);}
      renderGrid(); return;
    }
    if(zone==='list'){
      if(c===K.UP&&idx>0)idx--; else if(c===K.DOWN&&idx<apps.length-1)idx++;
      else if(c===K.RIGHT){zone='icons';iconIdx=0;}
      else if(c===K.ENTER)launchIds(apps[idx].name,resolve(apps[idx]));
    } else {
      if(c===K.RIGHT&&iconIdx<icons.length-1)iconIdx++;
      else if(c===K.LEFT){ if(iconIdx>0)iconIdx--; else zone='list'; }
      else if(c===K.DOWN)zone='list';
      else if(c===K.ENTER)act(icons[iconIdx].getAttribute('data-act'));
    }
    if(c===K.BACK||c===K.ESC){ e.preventDefault(); zone='list'; }
    render();
  });

  function tick(){ var d=new Date(); document.getElementById('clock').textContent=d.getHours()+':'+('0'+d.getMinutes()).slice(-2); }
  if(location.hash!=='#demo'){ tick(); setInterval(tick,10000); }
  loadConfig();
  document.addEventListener('visibilitychange',function(){ if(!document.hidden){ loadInstalled(markMissing); loadConfig(); } });
})();
