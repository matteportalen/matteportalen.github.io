/* Gemensamt sidhuvud för Matte-Portalen (TEST, används bara av testsidorna än så länge).
   MPHuvud({hem, titel, ikon, avsluta, onPet}) lägger ett smalt fält överst: loggan (leder hem), sidans namn,
   elevens djur med stjärnor (leder till garderoben) och ljudknappen.
   .kompakt(true) under spel och räkning: bara ✕ (avsluta) och sidans namn, så att barnet behåller fokus.
   MPNav gör att webbläsarens och mobilens bakåtknapp går ett steg tillbaka inne i en övning
   i stället för att hoppa ut ur hela övningen. Kräver djur.js (lasDjur, owlSVG) och gärna ljud.js. */
(function(){
  const CSS=`
.mph{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:8px;min-height:52px;padding:calc(6px + env(safe-area-inset-top,0px)) 12px 6px;
  background:linear-gradient(110deg,#3D5AFE 0%,#3D8BFD 60%,#17AFC4 100%);color:#fff;font-family:"Baloo 2","Trebuchet MS",system-ui,sans-serif;box-shadow:0 3px 0 rgba(29,43,83,.18)}
.mph a{color:inherit;text-decoration:none}
.mph button{font:inherit;color:inherit;border:0;background:none;cursor:pointer;touch-action:manipulation}
.mph-logo{display:flex;align-items:center;gap:6px;font-weight:800;font-size:1.2rem;line-height:1;letter-spacing:-.3px;white-space:nowrap;min-height:44px}
.mph-logo b{color:#FFC93C}
.mph-mark{width:34px;height:34px;display:block;flex:none;filter:drop-shadow(0 2px 0 rgba(29,43,83,.25))}
.mph-x{display:none;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.95)!important;color:#1D2B53!important;font-weight:800;font-size:1.2rem;box-shadow:0 3px 0 rgba(29,43,83,.25)}
.mph-title{flex:1;min-width:0;font-weight:800;font-size:1.05rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.95}
.mph-sep{opacity:.6;margin:0 2px}
.mph-right{display:flex;align-items:center;gap:6px;flex:none}
.mph-pet{display:flex;align-items:center;gap:2px;background:rgba(255,255,255,.18);border-radius:999px;padding:2px 10px 2px 2px;font-weight:800;min-height:40px}
.mph-pet svg{width:34px;height:auto;display:block}
.mph-snd{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.18)!important;font-size:1.15rem}
.mph.mini .mph-logo,.mph.mini .mph-right,.mph.mini .mph-sep{display:none}
.mph.mini .mph-x{display:grid;place-items:center}
.mph.mini{min-height:50px}
@media (max-width:520px){.mph.has-title .mph-logo span.t{display:none}}
@media (max-width:340px){.mph-logo span.t{display:none}}
@media print{.mph{display:none}}`;
  /* Loggan: Mattenyckeln, fyra räknesätt i färgade rutor */
  const LOGO='<svg class="mph-mark" viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="2" width="96" height="96" rx="24" fill="#fff"/><rect x="12" y="12" width="35" height="35" rx="9" fill="#2BB673"/><rect x="53" y="12" width="35" height="35" rx="9" fill="#FF6B6B"/><rect x="12" y="53" width="35" height="35" rx="9" fill="#7B61FF"/><rect x="53" y="53" width="35" height="35" rx="9" fill="#FF9F43"/><g stroke="#fff" stroke-width="6" stroke-linecap="round"><path d="M29.5 21v17M21 29.5h17M62 29.5h17M23.5 64.5l12 12M35.5 64.5l-12 12M62 70.5h17"/></g><circle cx="70.5" cy="62" r="3.6" fill="#fff"/><circle cx="70.5" cy="79" r="3.6" fill="#fff"/></svg>';
  window.MPLogo=LOGO;
  const stars=()=>{try{const n=+localStorage.getItem('matteportalen-stjarnor');return isFinite(n)?n:0}catch(e){return 0}};
  window.MPHuvud=function(o){
    o=o||{};
    if(!document.getElementById('mph-css')){const st=document.createElement('style');st.id='mph-css';st.textContent=CSS;document.head.appendChild(st);}
    const h=document.createElement('header');h.className='mph'+(o.titel?' has-title':'');
    const pet=window.lasDjur&&window.owlSVG?owlSVG(lasDjur()):'';
    h.innerHTML=`<button class="mph-x" aria-label="Avsluta">✕</button>
      <a class="mph-logo" href="${o.hem||'./'}" aria-label="Till startsidan">${LOGO}<span class="t">Matte-<b>Portalen</b></span></a>
      <span class="mph-title">${o.titel?`<span class="mph-sep">›</span> ${o.ikon?o.ikon+' ':''}${o.titel}`:''}</span>
      <span class="mph-right"><a class="mph-pet" href="${(o.hem||'./')+'#garderob'}" aria-label="Ditt djur och dina stjärnor">${pet}<span>⭐ <span class="mph-n">${stars()}</span></span></a><button class="mph-snd" aria-label="Ljud av eller på"></button></span>`;
    document.body.prepend(h);
    const snd=h.querySelector('.mph-snd'),label=()=>{snd.textContent=window.Ljud&&!Ljud.on?'🔇':'🔊';};label();
    snd.onclick=()=>{if(!window.Ljud)return;Ljud.set(!Ljud.on);label();Ljud.ok&&Ljud.ok();};
    h.querySelector('.mph-x').onclick=()=>{o.avsluta?o.avsluta():history.back();};
    if(o.onPet)h.querySelector('.mph-pet').onclick=e=>{e.preventDefault();o.onPet();};
    return{
      el:h,
      kompakt(on){h.classList.toggle('mini',!!on);},
      stjarnor(n){h.querySelector('.mph-n').textContent=n;},
      ljud:label
    };
  };
  /* Bakåtknappen: varje skärm i en övning blir ett steg i webbläsarens historik. */
  window.MPNav={
    cur:null,
    start(id,onBack){this.cur=id;history.replaceState({mp:id},'');window.addEventListener('popstate',e=>{const s=e.state&&e.state.mp;if(s){this.cur=s;onBack(s);}});},
    go(id){this.cur=id;history.pushState({mp:id},'');},
    replace(id){this.cur=id;history.replaceState({mp:id},'');},
    back(){history.back();}
  };
})();
