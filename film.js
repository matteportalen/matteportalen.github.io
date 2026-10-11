/* Instruktionsfilmer (MPFilm): samma mall för alla filmer "🎬 Se hur man gör" (lärarens beslut okt 2026).
   Animation i sidan utan röst: en scen 360 × 560 som skalas efter skärmen, korta undertexter ord för ord (🔊 läser dem),
   ljudeffekter ur ljud.js, kontrollerna ⏮ ⏸ ⏭ och prickar per scen. Varje scen är en async-funktion; för att hoppa till en scen
   byggs scenen om och de tidigare scenerna körs direkt utan tid (F.instant), sedan spelas resten.
   Används av Dela upp och dela och Kort division.

   const F=MPFilm.make({section, goText, onGo, onClose, speak});   section = <section class="screen" id="film">
   F.build=F=>{...}   bygger scenens figurer (bakgrund, undertext och likhetsrad finns redan)
   F.scenes=[async()=>{...}, ...]
   F.open()  spelar från början;  F.stop()
   Verktyg för scenerna: F.el(cls,html,{x,y,r,sc,o}), F.to(el,{x,y,...},ms,{arc,delay,ease,spin}), F.A(el,keyframes,opt),
   F.wait(ms), F.sfx(namn,ms,arg), F.cap(text), F.eq(html,cls), F.sparks(x,y,färg,n), F.tf, F.BOUNCE */
window.MPFilm=(()=>{
  const CSS=`
.filmpill{margin-left:auto;flex:none;font-family:inherit;font-size:.95rem;font-weight:800;line-height:1.2;color:#fff;background:linear-gradient(135deg,#3D5AFE,#7B61FF);border-radius:999px;padding:7px 12px;box-shadow:0 3px 0 #2A3DB8;letter-spacing:0}
.filmpill:active{transform:translateY(2px);box-shadow:0 1px 0 #2A3DB8}
.mpfilm{padding-top:4px}
.mpfilm .ftop{display:flex;justify-content:space-between;align-items:center}
.mpfilm .ftop .info{font-weight:800;font-size:1.1rem}
.mpfilm .fbox{margin:6px auto 0;position:relative;border-radius:26px;overflow:hidden;box-shadow:0 6px 0 var(--line),0 18px 40px rgba(29,43,83,.12)}
.mpfilm .stage{position:absolute;left:0;top:0;width:360px;height:560px;transform-origin:0 0;overflow:hidden;background:linear-gradient(170deg,#F4F8FF 0%,#EAF3FF 55%,#FFF6E6 100%);font-family:var(--font);color:var(--ink)}
.mpfilm .fbg i{position:absolute;border-radius:50%;filter:blur(18px);opacity:.55;animation:fdrift 14s ease-in-out infinite alternate}
.mpfilm .fbg i:nth-child(1){width:180px;height:180px;left:-50px;top:60px;background:#CFE0FF}
.mpfilm .fbg i:nth-child(2){width:150px;height:150px;right:-40px;top:200px;background:#FFE3B8;animation-duration:17s}
.mpfilm .fbg i:nth-child(3){width:200px;height:200px;left:90px;bottom:-90px;background:#DCD2FF;animation-duration:20s}
@keyframes fdrift{to{transform:translate(30px,-25px) scale(1.15)}}
.mpfilm .fcap{position:absolute;left:14px;right:14px;top:12px;min-height:62px;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:800;font-size:21px;line-height:1.2;padding:0 30px}
.mpfilm .fcap span{display:inline-block}
.mpfilm .fspk{position:absolute;right:8px;top:18px;width:38px;height:38px;border-radius:50%;background:#fff;box-shadow:0 3px 0 var(--line);font-size:1.05rem;z-index:3}
.mpfilm .feq{position:absolute;left:0;right:0;top:82px;height:70px;display:flex;align-items:center;justify-content:center;gap:5px;font-weight:800;font-size:25px}
.mpfilm .feq .q{color:#AFC4EA}.mpfilm .feq .n{color:var(--good-dark,#157548)}
.mpfilm .fe{position:absolute;left:0;top:0;will-change:transform,opacity}
.mpfilm .fk svg{width:100%;height:100%;display:block}
.mpfilm .fk.warn{filter:drop-shadow(0 0 6px #FF5A6E) drop-shadow(0 0 2px #FF5A6E)}
.mpfilm .fsp{width:8px;height:8px;border-radius:50%}
.mpfilm .fflash{width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,#FFF7C2 0%,rgba(255,210,80,.6) 45%,rgba(255,210,80,0) 70%)}
.mpfilm .ftag{font-weight:800;font-size:15px;color:#C0283C;background:#FFE3E7;border-radius:10px;padding:2px 8px;white-space:nowrap}
.mpfilm .fctl{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:12px}
.mpfilm .fctl button{width:52px;height:52px;border-radius:50%;background:var(--card);box-shadow:0 4px 0 var(--line);font-size:1.3rem}
.mpfilm .fctl .fplay{width:62px;height:62px;background:var(--accent);color:#fff;box-shadow:0 4px 0 #2A3DB8;font-size:1.5rem}
.mpfilm .fctl button:active{transform:translateY(3px);box-shadow:0 1px 0 var(--line)}
.mpfilm .fdots{display:flex;justify-content:center;gap:7px;margin-top:10px}
.mpfilm .fdots button{width:12px;height:12px;border-radius:50%;background:#C6D6F2;padding:0}
.mpfilm .fdots button.on{background:var(--accent);transform:scale(1.25)}.mpfilm .fdots button.past{background:#8FA6E8}
.mpfilm .fend{display:grid;gap:10px;margin-top:12px}
.mpfilm .fend .go,.mpfilm .fend .big{margin-top:0}`;
  let injected=false;
  function make(o){
    if(!injected){const st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);injected=true;}
    const sec=o.section;sec.classList.add("mpfilm");
    sec.innerHTML=`<div class="ftop"><button class="back" data-f="close">← Tillbaka</button><span class="info">🎬 Se hur man gör</span></div>
      <div class="fbox"><div class="stage"></div></div>
      <div class="fctl"><button data-f="prev" aria-label="Förra steget">⏮</button><button class="fplay" data-f="play" aria-label="Pausa">⏸</button><button data-f="next" aria-label="Nästa steg">⏭</button></div>
      <div class="fdots"></div>
      <div class="fend" hidden><button class="go" data-f="go">${o.goText||"Nu provar jag! →"}</button><button class="big" data-f="again">↺ Se filmen igen</button></div>`;
    const q=s=>sec.querySelector(s),ST=q(".stage"),BOX=q(".fbox"),PLAY=q('[data-f="play"]'),END=q(".fend"),DOTS=q(".fdots");
    const BOUNCE="cubic-bezier(.34,1.56,.64,1)",SOFT="cubic-bezier(.3,.7,.2,1)";
    const F={run:0,paused:false,instant:false,ended:false,anims:new Set(),scene:0,capText:"",k:matchMedia("(prefers-reduced-motion: reduce)").matches?.35:1,
      scenes:[],build:null,BOUNCE,SOFT,stage:ST};
    const tf=s=>`translate(${s.x}px,${s.y}px) rotate(${s.r||0}deg) scale(${s.sc==null?1:s.sc})`;F.tf=tf;
    F.A=(e,kf,op)=>{const a=e.animate(kf,Object.assign({fill:"forwards",easing:SOFT},op,{duration:F.instant?0:(op.duration||0),delay:F.instant?0:(op.delay||0)}));
      F.anims.add(a);if(F.paused)a.pause();a.finished.then(()=>F.anims.delete(a),()=>F.anims.delete(a));return a;};
    F.to=(e,ns,dur,op={})=>{const f=Object.assign({},e.s),t=Object.assign({},e.s,ns);e.s=t;
      const kf=[{transform:tf(f),opacity:f.o}];
      if(op.arc)kf.push({transform:tf(Object.assign({},t,{x:(f.x+t.x)/2,y:Math.min(f.y,t.y)-op.arc,r:(t.r||0)+(op.spin||0)})),offset:.5});
      kf.push({transform:tf(t),opacity:t.o});
      return F.A(e,kf,{duration:(dur||600)*F.k,delay:(op.delay||0)*F.k,easing:op.ease||SOFT});};
    F.el=(cls,html,st)=>{const e=document.createElement("div");e.className="fe "+cls;e.innerHTML=html||"";e.s=Object.assign({x:0,y:0,r:0,sc:1,o:1},st);
      e.style.transform=tf(e.s);e.style.opacity=e.s.o;ST.appendChild(e);return e;};
    F.wait=ms=>{if(F.instant)return Promise.resolve();const tok=F.run;
      return new Promise((res,rej)=>{let left=ms*F.k,last=performance.now();
        (function f(now){if(tok!==F.run)return rej("stopp");if(!F.paused)left-=now-last;last=now;if(left<=0)res();else requestAnimationFrame(f);})(last);});};
    F.sfx=(name,ms,arg)=>{if(F.instant)return;const tok=F.run;setTimeout(()=>{if(tok===F.run&&!F.paused&&window.Ljud&&Ljud[name])Ljud[name](arg);},(ms||0)*F.k);};
    F.cap=t=>{F.capText=t;const c=ST.querySelector(".fcap");c.innerHTML="<div>"+t.split(" ").map(w=>`<span>${w}</span>`).join(" ")+"</div>";
      c.querySelectorAll("span").forEach((w,i)=>F.A(w,[{opacity:0,transform:"translateY(14px)"},{opacity:1,transform:"none"}],{duration:380,delay:i*70,easing:BOUNCE}));};
    F.eq=(html,cls)=>{const e=ST.querySelector(".feq");e.className="feq"+(cls?" "+cls:"");e.innerHTML=html;F.A(e,[{opacity:0,transform:"translateY(10px) scale(.96)"},{opacity:1,transform:"none"}],{duration:420});};
    F.sparks=(x,y,col,n)=>{n=n||10;for(let i=0;i<n;i++){const a=Math.PI*2*i/n,r=34+Math.random()*24,d=F.el("fsp","",{x,y,sc:1});d.style.background=col||"#F2B707";
      F.to(d,{x:x+Math.cos(a)*r,y:y+Math.sin(a)*r,sc:.2,o:0},700,{ease:"cubic-bezier(.1,.7,.3,1)"});}};
    function base(){ST.innerHTML='<div class="fbg"><i></i><i></i><i></i></div><div class="fcap"></div><button class="fspk" aria-label="Läs upp">🔊</button><div class="feq"></div>';
      ST.querySelector(".fspk").onclick=()=>o.speak&&o.speak(F.capText);if(F.build)F.build(F);}
    function dots(){DOTS.innerHTML=F.scenes.map((_,i)=>`<button class="${i===F.scene?"on":i<F.scene?"past":""}" data-s="${i}" aria-label="Steg ${i+1}"></button>`).join("");}
    F.stop=()=>{F.run++;F.anims.forEach(a=>{try{a.cancel()}catch(e){}});F.anims.clear();};
    F.play=async k=>{F.stop();const tok=F.run;F.paused=false;F.ended=false;PLAY.textContent="⏸";END.hidden=true;
      base();F.instant=true;for(let i=0;i<k;i++)await F.scenes[i]();F.instant=false;
      for(let i=k;i<F.scenes.length;i++){if(tok!==F.run)return;F.scene=i;dots();
        try{await F.scenes[i]();if(i<F.scenes.length-1)await F.wait(500);}catch(e){return;}}
      if(tok===F.run){END.hidden=false;PLAY.textContent="▶";F.ended=true;}};
    function fit(){const w=Math.min(sec.clientWidth||360,560),h=innerHeight-BOX.getBoundingClientRect().top-150,sc=Math.max(.6,Math.min(w/360,h/560));
      BOX.style.width=360*sc+"px";BOX.style.height=560*sc+"px";ST.style.transform=`scale(${sc})`;}
    F.open=()=>{F.ended=false;fit();F.play(0);};
    sec.addEventListener("click",e=>{const b=e.target.closest("[data-f],[data-s]");if(!b)return;
      if(b.dataset.s!=null)return F.play(+b.dataset.s);
      const a=b.dataset.f;
      if(a==="close"){F.stop();o.onClose&&o.onClose();}
      else if(a==="play"){if(F.ended)return F.play(0);F.paused=!F.paused;F.anims.forEach(x=>F.paused?x.pause():x.play());PLAY.textContent=F.paused?"▶":"⏸";}
      else if(a==="prev")F.play(Math.max(0,F.scene-1));
      else if(a==="next"){if(F.scene<F.scenes.length-1)F.play(F.scene+1);}
      else if(a==="again")F.play(0);
      else if(a==="go"){F.stop();o.onGo&&o.onGo();}});
    addEventListener("resize",()=>{if(!sec.hidden)fit();});
    document.addEventListener("visibilitychange",()=>{if(document.hidden&&!sec.hidden&&!F.paused&&!F.ended)PLAY.click();});
    return F;}
  return{make};
})();
