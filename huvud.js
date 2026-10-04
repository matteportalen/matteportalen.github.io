/* Gemensamt sidhuvud och bakåtknapp för Matte-Portalen.
   Laddas efter ljud.js och djur.js, före sidans eget skript:
     <script src="../huvud.js" data-titel="Klockan" data-ikon="🕒"></script>
   data-hem       väg till startsidan (standard "../")
   data-nav       "av" för sidor med egen historik (NP3 med #-adresser) eller utan skärmar (startsidan, Tiobas)
   data-helskarm  skärmar där sidhuvudet göms helt (spel med egen ✕), t.ex. "game mem bub"
   data-liggande  "ja": göm sidhuvudet på mobil i liggande läge (Tiobas)
   Sidan anropar MPS.visa(id) varje gång den byter skärm (i sin show-funktion).

   Sidhuvudet: loggan Mattenyckeln (leder hem), sidans namn, profilens namn med elevens djur och stjärnor
   (leder till garderoben) och ljudknappen. Under räkning (skärmen "game") krymper det till ✕ och sidans namn.
   Stjärnorna räknas här (MPStjarnor) med samma regler som startsidan och uppdateras direkt när något sparas.

   Bakåtknappen: varje skärm i en övning blir ett steg i webbläsarens historik (hem 0, val/lägen 1, spel och
   resultat 2). Går man bakåt trycker sidhuvudet på skärmens egen tillbaka-knapp (#quit, [data-home], #rModes …),
   så sidornas egna knappar fungerar som förut. Kräver djur.js (lasDjur, owlSVG); ljud.js för ljudknappen. */
(function(){
  const me=document.currentScript,ds=(me&&me.dataset)||{};
  const CSS=`
.mph{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:8px;min-height:52px;padding:calc(6px + env(safe-area-inset-top,0px)) 12px 6px;
  background:linear-gradient(110deg,#3D5AFE 0%,#3D8BFD 60%,#17AFC4 100%);color:#fff;font-family:"Baloo 2","Trebuchet MS",system-ui,sans-serif;box-shadow:0 3px 0 rgba(29,43,83,.18);line-height:1.2;font-size:18px}
.mph a{color:inherit;text-decoration:none}
.mph button{font:inherit;color:inherit;border:0;background:none;cursor:pointer;touch-action:manipulation;padding:0}
.mph-logo{display:flex;align-items:center;gap:7px;font-weight:800;font-size:1.2rem;line-height:1;letter-spacing:-.3px;white-space:nowrap;min-height:44px}
.mph-logo b{color:#FFC93C}
.mph-mark{width:34px;height:34px;display:block;flex:none;filter:drop-shadow(0 2px 0 rgba(29,43,83,.25))}
.mph-x{display:none;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.95)!important;color:#1D2B53!important;font-weight:800;font-size:1.2rem;box-shadow:0 3px 0 rgba(29,43,83,.25)}
.mph-title{flex:1;min-width:0;font-weight:800;font-size:1.05rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.95}
.mph-sep{opacity:.6;margin:0 2px}
.mph-right{display:flex;align-items:center;gap:6px;flex:none}
.mph-pet{display:flex;align-items:center;gap:4px;background:rgba(255,255,255,.18);border-radius:999px;padding:2px 10px 2px 2px;font-weight:800;min-height:40px}
.mph-pet svg{width:34px;height:auto;display:block;flex:none}
.mph-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:9em}
.mph-snd{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.18)!important;font-size:1.15rem;flex:none}
.mph.mini .mph-logo,.mph.mini .mph-right,.mph.mini .mph-sep{display:none}
.mph.mini .mph-x{display:grid;place-items:center}
.mph.dold{display:none}
body.mph-mini #quit{display:none}
@media (max-width:520px){.mph.has-title .mph-logo span.t{display:none}.mph-name{max-width:5em}}
@media (max-width:360px){.mph-logo span.t,.mph-name{display:none}}
@media (orientation:landscape) and (max-height:500px){.mph.liggande{display:none}}
@media print{.mph{display:none}}`;
  /* Loggan: Mattenyckeln, fyra räknesätt i färgade rutor */
  const LOGO='<svg class="mph-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="2" width="96" height="96" rx="24" fill="#fff"/><rect x="12" y="12" width="35" height="35" rx="9" fill="#2BB673"/><rect x="53" y="12" width="35" height="35" rx="9" fill="#FF6B6B"/><rect x="12" y="53" width="35" height="35" rx="9" fill="#7B61FF"/><rect x="53" y="53" width="35" height="35" rx="9" fill="#FF9F43"/><g stroke="#fff" stroke-width="6" stroke-linecap="round"><path d="M29.5 21v17M21 29.5h17M62 29.5h17M23.5 64.5l12 12M35.5 64.5l-12 12M62 70.5h17"/></g><circle cx="70.5" cy="62" r="3.6" fill="#fff"/><circle cx="70.5" cy="79" r="3.6" fill="#fff"/></svg>';
  window.MPLogo=LOGO;
  // loggan som ikon i webbläsarfliken
  if(!document.querySelector('link[rel="icon"]')){const l=document.createElement('link');l.rel='icon';l.type='image/svg+xml';l.href='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(LOGO.replace(' class="mph-mark"','').replace(' aria-hidden="true"',''));document.head.appendChild(l);}

  /* ---------- Stjärnor: samma regler som startsidan ---------- */
  const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
  const sum=o=>Object.values(o||{}).reduce((s,v)=>s+(typeof v==='number'?v:sum(v)),0);
  const T10=[1,2,3,4,5,6,7,8,9,10];
  function medalsFrom(h){
    const lv=(a,b)=>{const x=h(a,b);if(!x.length)return 0;const l=x.slice(-2);if(l.length===2&&l[0][0]&&l[1][0])return(l[0][1]<3000&&l[1][1]<3000)?3:2;return 1};
    return T10.map(T=>{if(T10.every(n=>lv(n,T)===3))return 3;if(T10.every(n=>lv(n,T)>=2))return 2;if(T10.every(n=>h(n,T).some(x=>x[0])))return 1;return 0});
  }
  window.MPStjarnor=function(){
    let n=0;
    const mu=get('mattespel-multiplikation-v1');if(mu&&mu.facts)n+=medalsFrom((a,b)=>mu.facts[Math.min(a,b)+'x'+Math.max(a,b)]||[]).reduce((a,b)=>a+b,0);
    const dv=get('mattespel-division-v1');if(dv&&dv.facts)n+=medalsFrom((q,d)=>dv.facts[d+':'+q+':0']||[]).reduce((a,b)=>a+b,0);
    const sp=get('mattespel-spel-v1')||{};
    n+=['fly','mem','car','space','frog','tower','skatt','kiosk','bubbel','tug'].flatMap(k=>Object.values(sp[k]||{})).reduce((a,r)=>a+((r&&r.stars)||0),0);
    ['klockan','geometri','brak','uppstallning','hundraruta','tiotal','taluppfattning'].forEach(k=>{const d=get('mattespel-'+k+'-v1');n+=sum((d&&d.stars)||{});});
    const sj=get('mattespel-skattjakten-v1');n+=Object.values((sj&&sj.stars)||{}).reduce((a,b)=>a+(+b||0),0);
    return n;
  };
  function profilnamn(){try{const a=sessionStorage.getItem('mp-active');if(!a||a==='gast')return'';const p=(JSON.parse(localStorage.getItem('mp-profiles')||'[]')||[]).find(x=>x.id===a);return p?p.name:'';}catch(e){return''}}
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* ---------- Sidhuvudet ---------- */
  const hem=ds.hem||'../',titel=ds.titel||'',ikon=ds.ikon||'';
  if(!document.getElementById('mph-css')){const st=document.createElement('style');st.id='mph-css';st.textContent=CSS;document.head.appendChild(st);}
  const h=document.createElement('header');h.className='mph'+(titel?' has-title':'')+(ds.liggande==='ja'?' liggande':'');
  const pet=window.lasDjur&&window.owlSVG?owlSVG(lasDjur()):'',namn=profilnamn();
  h.innerHTML=`<button class="mph-x" aria-label="Avsluta">✕</button>
    <a class="mph-logo" href="${hem}" aria-label="Matte-Portalen, till startsidan">${LOGO}<span class="t">Matte-<b>Portalen</b></span></a>
    <span class="mph-title">${titel?`<span class="mph-sep">›</span> ${ikon?ikon+' ':''}${esc(titel)}`:''}</span>
    <span class="mph-right"><a class="mph-pet" href="${hem}#garderob" aria-label="Ditt djur och dina stjärnor">${pet}${namn?`<span class="mph-name">${esc(namn)}</span>`:''}<span>⭐&nbsp;<span class="mph-n">${MPStjarnor()}</span></span></a><button class="mph-snd" aria-label="Ljud av eller på"></button></span>`;
  document.body.prepend(h);
  const snd=h.querySelector('.mph-snd'),label=()=>{snd.textContent=window.Ljud&&!Ljud.on?'🔇':'🔊';};label();
  snd.onclick=()=>{if(!window.Ljud)return;Ljud.set(!Ljud.on);label();if(Ljud.on&&Ljud.ok)Ljud.ok();document.dispatchEvent(new Event('mp-ljud'));};
  document.addEventListener('mp-ljud-andrat',label);
  h.querySelector('.mph-x').onclick=()=>history.back();
  // stjärnorna uppdateras när något sparas (i den här fliken eller en annan)
  let tmr=0;const upd=()=>{clearTimeout(tmr);tmr=setTimeout(()=>{h.querySelector('.mph-n').textContent=MPStjarnor();},60);};
  try{const orig=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){orig.call(this,k,v);if(this===window.localStorage&&/^(mattespel-|np3)/.test(k))upd();};}catch(e){}
  window.addEventListener('storage',upd);
  window.addEventListener('pageshow',()=>{upd();label();});

  /* ---------- Bakåtknappen ---------- */
  const helskarm=(ds.helskarm||'').split(/\s+/).filter(Boolean);
  const djup=id=>id==='home'||id==='menu'||id==='start'?0:['game','result','mem','bub','win','tug','paint','pbplay'].includes(id)?2:1;
  const BACK=['#quit','[data-home]','#toolBack','#rModes','#rHome','#rChoose','#backMenu','#memQuit','#bubQuit','#wHome','#tugQuit','#tugBack','.back:not(a)'];
  const navOn=ds.nav!=='av';
  let cur={mp:'home',d:0,i:0},st=[0],ign=0,fix=null,popping=false;
  if(navOn)history.replaceState(cur,'');
  function mode(id){const full=helskarm.includes(id);h.classList.toggle('dold',full);h.classList.toggle('mini',id==='game'&&!full);document.body.classList.toggle('mph-mini',id==='game'&&!full);}
  function tryckTillbaka(){
    const sc=document.getElementById(cur.mp);if(!sc)return false;
    for(const sel of BACK){const b=sc.querySelector(sel);if(b){b.click();return true;}}
    return false;
  }
  window.MPS={
    huvud:h,
    /* Direktlänk (t.ex. från Verktygslådan): skärmen id blir sidans första steg, så att bakåt lämnar sidan
       i stället för att landa på sidans egen startskärm. Anropas före show(id). */
    start(id){if(!navOn)return;const d=djup(id);cur={mp:id,d,i:0};st=[d];history.replaceState(cur,'');},
    visa(id){
      mode(id);if(!navOn)return;
      const d=djup(id);
      if(popping){cur={mp:id,d,i:cur.i};return;}
      if(d>cur.d){cur={mp:id,d,i:cur.i+1};st.length=cur.i;st.push(d);history.pushState(cur,'');}
      else if(d===cur.d){cur={mp:id,d,i:cur.i};history.replaceState(cur,'');}
      else{
        // sidans egen tillbaka-knapp: gå bakåt i historiken till steget med rätt nivå
        let j=cur.i-1;while(j>0&&st[j]>d)j--;if(j<0)j=0;
        const steps=cur.i-j;cur={mp:id,d,i:j};st.length=j+1;st[j]=d;
        if(steps>0){fix=cur;ign++;history.go(-steps);}else history.replaceState(cur,'');
      }
    }
  };
  if(navOn)window.addEventListener('popstate',e=>{
    const s=e.state;if(!s||s.mp==null)return;
    if(ign){ign--;if(fix)history.replaceState(fix,'');fix=null;return;}
    if(s.i>cur.i){ign++;fix=cur;history.go(cur.i-s.i);return;} // framåt går inte: stanna kvar
    // bakåt: tryck på skärmens egen tillbaka-knapp tills vi är på rätt nivå
    popping=true;
    for(let k=0;k<4&&cur.d>s.d;k++){const was=cur.mp;if(!tryckTillbaka()||cur.mp===was)break;}
    popping=false;
    st.length=s.i+1;st[s.i]=cur.d;cur={mp:cur.mp,d:cur.d,i:s.i};history.replaceState(cur,'');
  });
})();
