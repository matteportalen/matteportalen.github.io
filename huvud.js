/* Gemensamt sidhuvud och bakåtknapp för Matte-Portalen.
   Laddas efter ljud.js och djur.js, före sidans eget skript:
     <script src="../huvud.js" data-titel="Klockan" data-ikon="🕒"></script>
   data-hem       väg till startsidan (standard "../")
   data-nav       "av" för sidor med egen historik (NP3 med #-adresser) eller utan skärmar (startsidan, Tiobas)
   data-helskarm  skärmar där sidhuvudet göms helt (spel med egen ✕), t.ex. "game mem bub"
   data-liggande  "ja": göm sidhuvudet på mobil i liggande läge (Tiobas)
   data-portal    "ovriga" på sidorna i Övriga ämnen (annan logga, färg och startsida). Standard: Matte-Portalen.
   Loggan är en hamburgerknapp (☰): den öppnar menyn med portalerna (startsidan och Övriga ämnen).
   Tillbaka-knappen (←) längst till vänster finns på alla sidor utom startsidorna: ett steg bakåt i sidan,
   och från sidans första skärm tillbaka dit man kom ifrån (eller till startsidan).
   Bara portaler med innehåll står i listan.
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
.mph-logo{position:relative;display:flex;align-items:center;gap:7px;font-weight:800;font-size:1.2rem!important;line-height:1;letter-spacing:-.3px;white-space:nowrap;min-height:44px;padding:3px 6px 3px 3px!important;border-radius:999px;background:rgba(255,255,255,.12)!important;flex:none;transition:background .2s}
.mph-logo b{color:#FFC93C}
.mph-burger em{display:none;font-style:normal;font-size:.9rem;font-weight:800;letter-spacing:0}
@media (min-width:700px){.mph-burger{padding:0 11px 0 9px}.mph-burger em{display:inline}}
.mph-logo .mph-mark{transition:transform .25s,filter .25s}
.mph-burger{min-width:28px;height:28px;border-radius:999px;gap:5px;grid-auto-flow:column;background:#FFC93C;color:#1D2B53;display:grid;place-items:center;font-size:1rem;line-height:1;box-shadow:0 2px 0 rgba(29,43,83,.25)}
.mph-logo::before{content:"";position:absolute;inset:-3px;border-radius:inherit;padding:3px;background:conic-gradient(from var(--mph-a,0deg),transparent 0 55%,rgba(255,201,60,.0) 58%,#FFC93C 74%,#fff 82%,rgba(255,255,255,0) 90%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .25s;pointer-events:none}
@property --mph-a{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes mph-varv{to{--mph-a:360deg}}
.mph-logo:hover,.mph-logo:focus-visible,.mph-logo[aria-expanded="true"]{background:rgba(255,255,255,.24)!important;outline:0}
.mph-logo:hover::before,.mph-logo:focus-visible::before,.mph-logo[aria-expanded="true"]::before,.mph-logo:active::before{opacity:1;animation:mph-varv 1.6s linear infinite}
.mph-logo:hover .mph-mark,.mph-logo:focus-visible .mph-mark{transform:rotate(-6deg) scale(1.08);filter:drop-shadow(0 0 6px rgba(255,255,255,.9)) drop-shadow(0 2px 0 rgba(29,43,83,.25))}
@media (prefers-reduced-motion:reduce){.mph-logo::before{animation:none!important}.mph-logo .mph-mark{transition:none}}
.mph-mark{width:34px;height:34px;display:block;flex:none;filter:drop-shadow(0 2px 0 rgba(29,43,83,.25))}
.mph-bk{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.95)!important;color:#1D2B53!important;font-weight:800;font-size:1.35rem!important;line-height:1;flex:none;box-shadow:0 3px 0 rgba(29,43,83,.25);display:grid;place-items:center}
.mph-bk:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(29,43,83,.25)}
.mph.mini .mph-bk{display:none}
.mph-x{display:none;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.95)!important;color:#1D2B53!important;font-weight:800;font-size:1.2rem;box-shadow:0 3px 0 rgba(29,43,83,.25)}
.mph-title{flex:1;min-width:0;font-weight:800;font-size:1.05rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.95}
.mph-sep{opacity:.6;margin:0 2px}
.mph-right{display:flex;align-items:center;gap:6px;flex:0 1 auto;min-width:0}
.mph-pet{min-width:0;display:flex;align-items:center;gap:4px;background:rgba(255,255,255,.18);border-radius:999px;padding:2px 10px 2px 2px;font-weight:800;min-height:40px}
.mph-pet svg{width:34px;height:auto;display:block;flex:none}
.mph-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:9em}
.mph-snd{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.18)!important;font-size:1.15rem;flex:none}
.mph.ovriga{background:linear-gradient(110deg,#157548 0%,#1E9E5E 55%,#17AFC4 100%)}
.mph-menu{position:absolute;top:calc(100% + 6px);left:10px;animation:mph-ner .18s ease-out;background:#fff;color:#1D2B53;border-radius:18px;padding:6px;box-shadow:0 10px 30px rgba(29,43,83,.25),0 3px 0 #C6D6F2;min-width:240px;z-index:30}
.mph-menu a{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;font-weight:800;font-size:1.1rem}
.mph-menu a:hover,.mph-menu a:focus-visible{background:#EAF3FF;outline:0}
.mph-menu a[aria-current="true"]::after{content:"✓";margin-left:auto;color:#1E9E5E}
.mph-menu .mph-mark{width:30px;height:30px;filter:none}
@keyframes mph-ner{from{opacity:0;transform:translateY(-8px)}}
.mph-menu small{display:block;font-weight:700;font-size:.8rem;color:#56668F}
.mph.mini .mph-logo,.mph.mini .mph-right,.mph.mini .mph-sep{display:none}
.mph.mini .mph-x{display:grid;place-items:center}
.mph.dold{display:none}
body.mph-mini #quit{display:none}
@media (max-width:520px){.mph-logo span.t{display:none}.mph-name{max-width:5em}.mph.has-title .mph-name{display:none}}
@media (max-width:360px){.mph-name{display:none}}
@media (orientation:landscape) and (max-height:500px){.mph.liggande{display:none}}
@media print{.mph{display:none}}`;
  /* Loggan: Mattenyckeln, fyra räknesätt i färgade rutor */
  const LOGO='<svg class="mph-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="2" width="96" height="96" rx="24" fill="#fff"/><rect x="12" y="12" width="35" height="35" rx="9" fill="#2BB673"/><rect x="53" y="12" width="35" height="35" rx="9" fill="#FF6B6B"/><rect x="12" y="53" width="35" height="35" rx="9" fill="#7B61FF"/><rect x="53" y="53" width="35" height="35" rx="9" fill="#FF9F43"/><g stroke="#fff" stroke-width="6" stroke-linecap="round"><path d="M29.5 21v17M21 29.5h17M62 29.5h17M23.5 64.5l12 12M35.5 64.5l-12 12M62 70.5h17"/></g><circle cx="70.5" cy="62" r="3.6" fill="#fff"/><circle cx="70.5" cy="79" r="3.6" fill="#fff"/></svg>';
  /* Loggan för Övriga ämnen: blad, vattendroppe, planet och sol i samma sorts rutor */
  const LOGO_NO='<svg class="mph-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="2" width="96" height="96" rx="24" fill="#fff"/><rect x="12" y="12" width="35" height="35" rx="9" fill="#2BB673"/><rect x="53" y="12" width="35" height="35" rx="9" fill="#3D8BFD"/><rect x="12" y="53" width="35" height="35" rx="9" fill="#7B61FF"/><rect x="53" y="53" width="35" height="35" rx="9" fill="#FF9F43"/><path d="M21 39C21 26 29 20 39 20C39 32 33 39 21 39Z" fill="#fff"/><path d="M21 39L31 29" stroke="#2BB673" stroke-width="2.5" stroke-linecap="round"/><path d="M70.5 19C70.5 19 61 30 61 35.5A9.5 9.5 0 0 0 80 35.5C80 30 70.5 19 70.5 19Z" fill="#fff"/><circle cx="29.5" cy="70.5" r="7.5" fill="#fff"/><ellipse cx="29.5" cy="70.5" rx="14" ry="4.5" fill="none" stroke="#fff" stroke-width="2.6" transform="rotate(-20 29.5 70.5)"/><circle cx="70.5" cy="70.5" r="7" fill="#fff"/><g stroke="#fff" stroke-width="3.2" stroke-linecap="round"><path d="M70.5 56v4M70.5 81v4M56 70.5h4M81 70.5h4M60.3 60.3l2.8 2.8M77.9 77.9l2.8 2.8M60.3 80.7l2.8-2.8M77.9 63.1l2.8-2.8"/></g></svg>';
  const PORTALER=[{id:'matte',a:'Matte-',b:'Portalen',sub:'Matte för åk 1–3',kort:'Matte',ikon:'🔢',href:'',logo:LOGO},{id:'ovriga',a:'Övriga ',b:'ämnen',sub:'NO och mer',kort:'Övriga ämnen',ikon:'🌍',href:'ovriga/',logo:LOGO_NO}];
  const PORTAL=PORTALER.find(p=>p.id===ds.portal)||PORTALER[0];
  window.MPLogo=PORTAL.logo;
  // loggan som ikon i webbläsarfliken
  if(!document.querySelector('link[rel="icon"]')){const l=document.createElement('link');l.rel='icon';l.type='image/svg+xml';l.href='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(PORTAL.logo.replace(' class="mph-mark"','').replace(' aria-hidden="true"',''));document.head.appendChild(l);}

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
    ['klockan','geometri','brak','uppstallning','hundraruta','tiotal','taluppfattning','sverigekartan','ordgomma','europa','varlden','talfoljd','rutjakten','brakbitar'].forEach(k=>{const d=get('mattespel-'+k+'-v1');n+=sum((d&&d.stars)||{});});
    const sj=get('mattespel-skattjakten-v1');n+=Object.values((sj&&sj.stars)||{}).reduce((a,b)=>a+(+b||0),0);
    return n;
  };
  function profilnamn(){try{const a=sessionStorage.getItem('mp-active');if(!a||a==='gast')return'';const p=(JSON.parse(localStorage.getItem('mp-profiles')||'[]')||[]).find(x=>x.id===a);return p?p.name:'';}catch(e){return''}}
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* ---------- Sidhuvudet ---------- */
  const hem=ds.hem||'../',titel=ds.titel||'',ikon=ds.ikon||'';
  if(!document.getElementById('mph-css')){const st=document.createElement('style');st.id='mph-css';st.textContent=CSS;document.head.appendChild(st);}
  const h=document.createElement('header');h.className='mph'+(titel?' has-title':'')+(ds.liggande==='ja'?' liggande':'')+(PORTAL.id!=='matte'?' '+PORTAL.id:'');
  const pet=window.lasDjur&&window.owlSVG?owlSVG(lasDjur()):'',namn=profilnamn();
  const hemUrl=new URL(hem+PORTAL.href,location.href),paStart=hemUrl.pathname.replace(/index\.html$/,'')===location.pathname.replace(/index\.html$/,'');
  h.innerHTML=`${paStart?'':'<button class="mph-bk" aria-label="Tillbaka">←</button>'}<button class="mph-x" aria-label="Avsluta">✕</button>
    <button class="mph-logo" aria-label="${PORTAL.a}${PORTAL.b}, meny" aria-haspopup="true" aria-expanded="false">${PORTAL.logo}<span class="t">${PORTAL.a}<b>${PORTAL.b}</b></span><span class="mph-burger" aria-hidden="true"><i style="font-style:normal">☰</i><em>Ämnen</em></span></button>
    <span class="mph-title">${titel?`<span class="mph-sep">›</span> ${ikon?ikon+' ':''}${esc(titel)}`:''}</span>
    <span class="mph-right"><a class="mph-pet" href="${hem}#garderob" aria-label="Ditt djur och dina stjärnor">${pet}${namn?`<span class="mph-name">${esc(namn)}</span>`:''}<span>⭐&nbsp;<span class="mph-n">${MPStjarnor()}</span></span></a><button class="mph-snd" aria-label="Ljud av eller på"></button></span>`;
  document.body.prepend(h);
  const snd=h.querySelector('.mph-snd'),label=()=>{snd.textContent=window.Ljud&&!Ljud.on?'🔇':'🔊';};label();
  snd.onclick=()=>{if(!window.Ljud)return;Ljud.set(!Ljud.on);label();if(Ljud.on&&Ljud.ok)Ljud.ok();document.dispatchEvent(new Event('mp-ljud'));};
  document.addEventListener('mp-ljud-andrat',label);
  h.querySelector('.mph-x').onclick=()=>history.back();
  // tillbaka: inne i sidan ett steg bakåt (sidans egna knappar trycks via historiken), annars dit man kom ifrån
  const bk=h.querySelector('.mph-bk');
  if(bk)bk.onclick=()=>{
    if(navOn&&cur.i>0){history.back();return;}
    let fran=null;try{fran=document.referrer?new URL(document.referrer):null;}catch(e){}
    if(fran&&fran.origin===location.origin&&fran.pathname!==location.pathname)history.back();else location.href=hemUrl.href;};
  // menyn bakom loggan
  const ptl=h.querySelector('.mph-logo');let meny=null;
  const stang=()=>{if(meny){meny.remove();meny=null;ptl.setAttribute('aria-expanded','false');}};
  ptl.onclick=e=>{e.stopPropagation();if(meny)return stang();
    meny=document.createElement('nav');meny.className='mph-menu';meny.setAttribute('aria-label','Meny');
    meny.innerHTML=PORTALER.map(p=>`<a href="${hem}${p.href}"${p===PORTAL?' aria-current="true"':''}>${p.logo}<span>${p===PORTAL?`🏠 Startsidan<small>${p.a}${p.b}</small>`:`${p.a}${p.b}<small>${p.sub}</small>`}</span></a>`).join('');
    h.appendChild(meny);ptl.setAttribute('aria-expanded','true');meny.querySelector('a').focus({preventScroll:true});};
  document.addEventListener('click',e=>{if(meny&&!meny.contains(e.target))stang();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')stang();});
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
