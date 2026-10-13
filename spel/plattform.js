/* Gemensamt för plattformsspelen (Sagoriket och Sifferslottet): fysiken, styrningen, musikmotorn och djuret med trollstaven.
   Banor, rum, kamera, portar, kodlås och bossar ligger kvar i respektive spel. Rätta här, så gäller det båda spelen.

   MPPlatt.G                       fysikens värden (ruta 64 enheter)
   MPPlatt.kropp(x,y)              ny kropp (fötterna vid x,y); spelen får lägga till egna fält
   MPPlatt.steg(s,inp,dt,o)        ett tidssteg: inp {v,h,u}, o {fast(c,r), huvud(c,r)?, fjadrar?, plankor?}
                                   ger händelser: "hopp", "hopp2", "fjader"
   MPPlatt.styrning(IN,o)          tangenter och pekknappar (.ktrl button[data-k]) sätter IN.v/h/u/m; o {aktiv(), tangent(e)?}
                                   varje nytt tryck sätter också IN.uT/IN.mT, som spelet nollställer när trycket använts
   MPPlatt.musik(hamta)            egen musik med Web Audio; hamta() ger {lat, fart} eller null (tyst). Ger {ctx()}
   MPPlatt.djur()                  {bild: Image, svg: string} med elevens djur och trollstaven */
window.MPPlatt=(()=>{
  const T=64,G={grav:2600,hopp:930,hopp2:820,fart:330,acc:2400,b:40,hh:62,fjader:1450};
  const kropp=(x,y)=>({x,y,vx:0,vy:0,mark:false,hopp:0,coyote:0,buffert:0,uFor:false,riktning:1,paPl:null});
  // flyttar längs en axel och krockar mot rutnätet; huvud(c,r) anropas när huvudet slår i en ruta
  function flytta(s,dx,dy,o){const b=G.b/2;
    if(dx){const x=s.x+dx,top=s.y-G.hh+4,bot=s.y-2,kol=dx>0?Math.floor((x+b)/T):Math.floor((x-b)/T);
      for(let r=Math.floor(top/T);r<=Math.floor(bot/T);r++)if(o.fast(kol,r)){s.vx=0;s.x=dx>0?kol*T-b-.01:(kol+1)*T+b+.01;return;}s.x=x;return;}
    const y=s.y+dy,l=Math.floor((s.x-b+3)/T),rr=Math.floor((s.x+b-3)/T);
    if(dy>0){const r=Math.floor(y/T);for(let c=l;c<=rr;c++)if(o.fast(c,r)){s.vy=0;s.mark=true;s.y=r*T;return;}}
    else{const r=Math.floor((y-G.hh)/T);for(let c=l;c<=rr;c++)if(o.fast(c,r)){s.vy=0;if(o.huvud)o.huvud(c,r);s.y=(r+1)*T+G.hh;return;}}
    s.y=y;}
  function steg(s,inp,dt,o){const ev=[],mal=(inp.h?1:0)-(inp.v?1:0);if(mal)s.riktning=mal;
    s.vx+=Math.sign(mal*G.fart-s.vx)*Math.min(Math.abs(mal*G.fart-s.vx),G.acc*dt*(s.mark?1:.75));
    s.coyote=s.mark?.1:Math.max(0,s.coyote-dt);s.buffert=Math.max(0,s.buffert-dt);
    if((inp.u&&!s.uFor)||inp.uT){s.buffert=.12;inp.uT=false;}s.uFor=inp.u; // uT = tryck som hann släppas mellan två bilder
    if(s.buffert>0){if(s.coyote>0){s.vy=-G.hopp;s.hopp=1;s.coyote=0;s.buffert=0;s.mark=false;ev.push("hopp");}
      // dubbelhopp: bromsar aldrig (t.ex. direkt efter en fjäder)
      else if(s.hopp<2&&!s.mark){s.vy=Math.min(s.vy,-G.hopp2);s.hopp=2;s.buffert=0;ev.push("hopp2");}}
    if(!inp.u&&s.vy<-300)s.vy+=G.grav*dt*.9; // kort hopp om man släpper
    s.vy=Math.min(s.vy+G.grav*dt,1400);
    // rörliga plankor bär med sig den som står på dem
    const pl=o.plankor&&o.plankor.find(m=>s.paPl===m);if(pl)s.x+=pl.dx||0;
    const fore=s.y;s.mark=false;s.paPl=null;flytta(s,s.vx*dt,0,o);flytta(s,0,s.vy*dt,o);
    if(o.plankor&&s.vy>=0)o.plankor.forEach(m=>{if(fore<=m.y+4&&s.y>=m.y&&s.x>m.x-G.b/2+4&&s.x<m.x+m.w+G.b/2-4){s.y=m.y;s.vy=0;s.mark=true;s.paPl=m;}});
    if(s.mark)s.hopp=0;
    if(o.fjadrar)o.fjadrar.forEach(f=>{if(s.vy>=0&&Math.abs(s.x-(f.x*T+T/2))<T/2+G.b/2-14&&s.y>=f.y*T+T*.45&&s.y<=(f.y+1)*T+2){
      s.y=f.y*T+T*.45;s.vy=-G.fjader;s.hopp=1;s.mark=false;f.ut=.35;ev.push("fjader");}});
    return ev;}

  /* ---------- Styrning: ← → / A D springer, ↑ / W hoppar, mellanslag / X / Enter trollstaven, och pekknapparna ---------- */
  const TANG={ArrowLeft:"v",KeyA:"v",ArrowRight:"h",KeyD:"h",ArrowUp:"u",KeyW:"u",Space:"m",KeyX:"m",KeyK:"m",Enter:"m"};
  function styrning(IN,o){
    addEventListener("keydown",e=>{if(!o.aktiv())return;if(o.tangent&&o.tangent(e))return;const k=TANG[e.code];if(!k)return;e.preventDefault();if(!IN[k]&&!e.repeat)IN[k+"T"]=true;IN[k]=true;});
    addEventListener("keyup",e=>{const k=TANG[e.code];if(k)IN[k]=false;});
    document.querySelectorAll(".ktrl button").forEach(b=>{const k=b.dataset.k,ner=e=>{e.preventDefault();IN[k]=true;IN[k+"T"]=true;b.classList.add("pa");try{b.setPointerCapture(e.pointerId);}catch(_){}},
      upp=()=>{IN[k]=false;b.classList.remove("pa");};
      b.addEventListener("pointerdown",ner);b.addEventListener("pointerup",upp);b.addEventListener("pointercancel",upp);b.addEventListener("lostpointercapture",upp);});}
  const pek=matchMedia("(pointer:coarse)").matches||"ontouchstart" in window;

  /* ---------- Musik: 32 åttondelar per varv, melodi i MIDI-tal (0 = paus), bas på grundtonen, trummor ----------
     lat: {bpm, mel[32], bas[4], ton (melodins vågform), langd (tonlängd i åttondelar), vol, basTon, basVol, basDriv (bas på varje åttondel), trummor: "full"|"latt"} */
  function musik(hamta){const MU={ac:null,ut:null,steg:0,nasta:0,lat:null};
    const ctx=()=>{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
      if(!MU.ac){MU.ac=new AC();MU.ut=MU.ac.createGain();MU.ut.gain.value=.55;MU.ut.connect(MU.ac.destination);}if(MU.ac.state==="suspended")MU.ac.resume();return MU.ac;};
    const mf=m=>440*Math.pow(2,(m-69)/12);
    function ton(m,t,d,typ,v){const a=MU.ac,o=a.createOscillator(),g=a.createGain();o.type=typ;o.frequency.value=mf(m);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(MU.ut);o.start(t);o.stop(t+d+.05);}
    function trumma(t,hog){const a=MU.ac;if(hog){const o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);
        g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.0001,t+.14);o.connect(g);g.connect(MU.ut);o.start(t);o.stop(t+.16);}
      else{const n=a.createBufferSource(),b=a.createBuffer(1,a.sampleRate*.04,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
        const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=6000;const g=a.createGain();g.gain.value=.033;n.buffer=b;n.connect(f);f.connect(g);g.connect(MU.ut);n.start(t);}}
    setInterval(()=>{if(!MU.ac||document.hidden||(window.Ljud&&!Ljud.on))return;const h=hamta();if(!h||!h.lat)return;
      const lat=h.lat;if(MU.lat!==lat){MU.lat=lat;MU.steg=0;MU.nasta=0;}const sp=60/(lat.bpm*(h.fart||1))/2;
      while(MU.nasta<MU.ac.currentTime+.25){const t=Math.max(MU.nasta,MU.ac.currentTime+.03),i=MU.steg%32,j=i%8,b=lat.bas[Math.floor(i/8)];
        const m=lat.mel[i];if(m)ton(m,t,sp*(lat.langd||1),lat.ton||"square",lat.vol||.03);
        if(lat.basDriv)ton(j%2?b+12:b,t,sp*.9,lat.basTon||"triangle",lat.basVol||.1);
        else if(j===0||j===3||j===4||j===6)ton(j===4?b+12:b,t,sp*1.6,lat.basTon||"triangle",lat.basVol||.1);
        if(lat.trummor==="latt"){if(j===0)trumma(t,false);}else{if(j===0||j===4)trumma(t,true);if(j%2===1)trumma(t,false);}
        MU.steg++;MU.nasta=t+sp;}},90);
    return{ctx};}

  /* ---------- Elevens djur med trollstaven ---------- */
  function djur(){const cfg=Object.assign({},window.lasDjur?lasDjur():{},{hand:"trollstav"}),bild=new Image();
    bild.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(owlSVG(cfg,"",true));return{bild,svg:owlSVG(cfg)};}

  return{G,T,kropp,flytta,steg,styrning,pek,musik,djur};
})();
