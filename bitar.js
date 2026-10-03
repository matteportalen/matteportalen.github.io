/* Tangram för Matte-Portalen (Geometri). Sju bitar ur en kvadrat 4×4: två stora trianglar, en mellanstor,
   två små, en kvadrat och ett parallellogram. Bitarna vrids i steg om 45°, parallellogrammet kan vändas.
   (Filen hette från början mönsterbitar; Bygg bilden och fritt bygge togs bort, Tangram tränar samma sak bättre.)

   Koordinater: y uppåt. Liten triangel = (0,0),(2,0),(1,1).
   MPBitar.spel(host,{bild,tray,unik,tips,onDone}) bygger en spelplan: bitlåda, dra, vrid fritt (handtag, två fingrar,
   scrollhjul, dubbeltryck) med snäpp till 45° och till andra bitars och silhuettens hörn.
   tips:true ger knappen 💡 Tips: varje tryck visar var en bit ur lösningen ska ligga (streckad kontur, stora bitar
   först). Konturen ligger kvar tills biten ligger där. onDone({n,counts,tips}). */
(function(){
  const TYPES={
    tL:{n:"Stor triangel",col:"#E5484D",st:"#A8282D",v:[[0,0],[4,0],[2,2]],step:45},
    tL2:{n:"Stor triangel",col:"#FF9F43",st:"#C96A0C",v:[[0,0],[4,0],[2,2]],step:45},
    tM:{n:"Mellanstor triangel",col:"#7B61FF",st:"#5440C9",v:[[0,0],[2,0],[0,2]],step:45},
    tS:{n:"Liten triangel",col:"#2BB673",st:"#1A7E4E",v:[[0,0],[2,0],[1,1]],step:45},
    tS2:{n:"Liten triangel",col:"#FF5FA2",st:"#C2447C",v:[[0,0],[2,0],[1,1]],step:45},
    tQ:{n:"Kvadrat",col:"#F7C531",st:"#C99A0A",v:[[1,0],[2,1],[1,2],[0,1]],step:45},
    tP:{n:"Parallellogram",col:"#17AFC4",st:"#0E7F8E",v:[[0,0],[2,0],[3,1],[1,1]],step:45,flip:true}
  };
  // bitarnas hörn runt tyngdpunkten
  for(const t of Object.values(TYPES)){const cx=t.v.reduce((a,p)=>a+p[0],0)/t.v.length,cy=t.v.reduce((a,p)=>a+p[1],0)/t.v.length;t.loc=t.v.map(([x,y])=>[x-cx,y-cy]);}
  const sort=t=>t.replace(/2$/,""); // de två stora och de två små trianglarna är likadana
  // k = kategori i bildväljaren. Figurerna är klassiska tangrambilder (fritt ritade efter förebilder, kontrollerade: yta 16, inget överlapp)
  const TANGRAM_KAT=[["former","Former"],["djur","Djur"],["saker","Saker och människor"]];
  const TANGRAM=[
    {id:"kvadrat",n:"Kvadrat",k:"former",p:[["tL",0,0,0,0],["tL2",270,0,0,4],["tM",180,0,4,4],["tS",90,0,4,0],["tQ",0,0,2,1],["tS2",180,0,3,3],["tP",0,1,3,3]]},
    {id:"triangel",n:"Triangel",k:"former",p:[["tL",0,0,0,0],["tL2",90,0,4,0],["tM",0,0,4,0],["tQ",0,0,4,1],["tS",270,0,4,4],["tP",0,1,8,0],["tS2",0,0,5,1]]},
    {id:"rektangel",n:"Rektangel",k:"former",p:[["tL",45,0,0,0],["tL2",225,0,2.8284,2.8284],["tM",135,0,4.2426,1.4142],["tS",315,0,2.8284,2.8284],["tQ",45,0,4.9497,0.7071],["tP",45,1,5.6569,1.4142],["tS2",225,0,5.6569,1.4142]]},
    {id:"parallellogram",n:"Parallellogram",k:"former",p:[["tL",0,0,0,0],["tL2",90,0,4,0],["tS",270,0,4,2],["tQ",0,0,4,1],["tM",270,0,4,4],["tS2",180,0,7,3],["tP",0,0,5,3]]},
    {id:"trapets",n:"Trapets",k:"former",p:[["tL",225,0,2.8284,2.8284],["tL2",45,0,2.8284,0],["tS",225,0,4.2426,1.4142],["tQ",45,0,4.9497,-0.7071],["tM",225,0,5.6569,2.8284],["tS2",135,0,7.0711,0],["tP",135,0,8.4853,0]]},
    {id:"femhorning",n:"Femhörning",k:"former",p:[["tS",45,0,0,0],["tL",225,0,2.8284,4.2426],["tL2",135,0,5.6569,1.4142],["tM",225,0,1.4142,1.4142],["tP",135,0,4.2426,0],["tS2",315,0,2.8284,1.4142],["tQ",45,0,4.9497,-0.7071]]},
    {id:"sexhorning",n:"Sexhörning",k:"former",p:[["tL",90,0,2,0],["tM",90,0,4,0],["tL2",270,0,2,4],["tS",180,0,4,4],["tQ",0,0,3,2],["tP",90,1,5,3],["tS2",270,0,5,3]]},
    {id:"katt",n:"Katt",k:"djur",p:[["tQ",0,0,0,0],["tS",270,0,0,3],["tS2",90,0,2,1],["tL",270,0,1,0],["tM",315,0,-0.4142,-1.4142],["tL2",225,0,3,-2],["tP",0,0,3,-4.8284]]},
    {id:"kanin",n:"Kanin",k:"djur",p:[["tL",270,0,0,4],["tL2",0,0,0,0],["tM",180,0,4,2],["tQ",0,0,0,3],["tP",90,1,1,7],["tS",90,0,2,4],["tS2",270,0,4,2]]},
    {id:"hund",n:"Hund",k:"djur",p:[["tL",45,0,0,0],["tL2",225,0,4.2426,4.2426],["tQ",45,0,4.9497,2.1213],["tS2",45,0,4.2426,1.4142],["tS",90,0,5.2426,0.4142],["tM",225,0,5.6569,5.6569],["tP",135,0,0.7071,2.8284]]},
    {id:"fisk",n:"Fisk",k:"djur",p:[["tL",0,0,0,0],["tL2",180,0,4,0],["tM",270,0,0,2],["tQ",0,0,-2,-1],["tS",270,0,-3,1],["tS2",180,0,3,-2],["tP",180,0,6,0]]},
    {id:"gas",n:"Gås",k:"djur",p:[["tL",135,0,2.8284,0],["tL2",180,0,4,2.8284],["tM",315,0,-1.4142,1.4142],["tS",270,0,-1.4142,3.4142],["tQ",0,0,-1.4142,2.4142],["tP",90,0,0.5858,3.4142],["tS2",315,0,-1.8284,6.4142]]},
    {id:"kamel",n:"Kamel",k:"djur",p:[["tL",270,0,0,4],["tL2",315,0,1.1716,2.8284],["tM",225,0,2.5858,4.2426],["tQ",0,0,0,3],["tP",90,0,0,3],["tS",315,0,-1.4142,6.4142],["tS2",45,0,4,1.4142]]},
    {id:"ko",n:"Ko",k:"djur",p:[["tL",270,0,0,4],["tL2",90,0,4,0],["tM",45,0,2,2],["tQ",45,0,-0.7071,2.2929],["tS",225,0,-1.4142,5.8284],["tS2",135,0,1.4142,4.4142],["tP",90,0,5,1]]},
    {id:"krabba",n:"Krabba",k:"djur",p:[["tL",135,0,2.8284,1.4142],["tL2",315,0,1.4142,2.8284],["tQ",45,0,2.1213,2.1213],["tP",45,1,5.6569,4.2426],["tS2",135,0,5.6569,4.2426],["tM",315,0,-1.4142,4.2426],["tS",45,0,0,0]]},
    {id:"bjorn",n:"Björn",k:"djur",p:[["tL",90,0,0,0.2426],["tL2",45,0,0,1.4142],["tS",135,0,0.2426,0],["tM",90,0,2.8284,2.2426],["tQ",45,0,3.5355,2.1213],["tS2",135,0,5.6569,2.8284],["tP",135,0,4.2426,0.8284]]},
    {id:"val",n:"Val",k:"djur",p:[["tL",315,0,0,2.8284],["tL2",135,0,5.6569,0],["tP",135,0,2.8284,0],["tQ",0,0,4.6569,0],["tS",180,0,5.6569,2],["tS2",90,0,6.6569,1],["tM",45,0,6.6569,3]]},
    {id:"lejon",n:"Lejon",k:"djur",p:[["tL",45,0,0,0],["tS",0,0,0,0],["tM",90,0,4,2],["tL2",45,0,4,2],["tQ",0,0,5,2],["tS2",315,0,2.5858,2],["tP",45,1,0,2.8284]]},
    {id:"elefant",n:"Elefant",k:"djur",p:[["tL",45,0,0,0],["tL2",225,0,3.5355,3.5355],["tQ",45,0,2.8284,-1.4142],["tS",90,0,0,-1],["tM",135,0,4.9497,2.1213],["tP",45,1,6.364,2.1213],["tS2",135,0,6.364,2.1213]]},
    {id:"kanguru",n:"Känguru",k:"djur",p:[["tL",135,0,2.8284,3],["tS",225,0,0,7.2426],["tS2",90,0,0,2],["tM",180,0,3.4142,3],["tQ",0,0,0.4142,1],["tL2",0,0,0.4142,0],["tP",0,1,6.4142,0]]},
    {id:"groda",n:"Groda",k:"djur",p:[["tQ",45,0,0.8787,4.2929],["tS",45,0,2.4142,5],["tS2",225,0,3.8284,6.4142],["tM",225,0,2,5.4142],["tL2",180,0,4,4],["tL",0,0,1,1],["tP",0,0,1,0]]},
    {id:"hus",n:"Hus",k:"saker",p:[["tL",225,0,1.4142,5.6569],["tL2",135,0,4.2426,2.8284],["tM",135,0,1.4142,1.4142],["tS",315,0,0,2.8284],["tQ",45,0,2.1213,0.7071],["tP",45,1,2.8284,1.4142],["tS2",225,0,2.8284,1.4142]]},
    {id:"raket",n:"Raket",k:"saker",p:[["tL",90,0,0,0],["tL2",270,0,0,4],["tQ",0,0,-1,4],["tS",270,0,-2,2],["tS2",90,0,2,0],["tM",180,0,1,0],["tP",90,0,1,-4]]},
    {id:"pil",n:"Pil",k:"saker",p:[["tL",270,0,4,4],["tL2",0,0,0,1],["tM",270,0,0,3],["tS",180,0,4,3],["tS2",90,0,4,1],["tQ",0,0,-2,1],["tP",0,0,-3,0]]},
    {id:"ljus",n:"Ljus",k:"saker",p:[["tM",90,0,1,0],["tL",270,0,0,5],["tL2",90,0,2,3],["tS",270,0,0,7],["tQ",0,0,0,6],["tS2",0,0,1,0],["tP",90,1,2,3]]},
    {id:"bord",n:"Bord",k:"saker",p:[["tL",45,0,0,1.4142],["tQ",45,0,0.7071,-0.7071],["tS",225,0,1.4142,2.8284],["tM",225,0,2.8284,4.2426],["tL2",315,0,2.8284,4.2426],["tP",135,1,4.2426,2.8284],["tS2",135,0,5.6569,0]]},
    {id:"stol",n:"Stol",k:"saker",p:[["tS",45,0,0,5.6569],["tP",135,1,0,5.6569],["tM",315,0,0,5.6569],["tL",135,0,2.8284,1.4142],["tQ",45,0,0.7071,-0.7071],["tL2",315,0,1.4142,2.8284],["tS2",135,0,4.2426,0]]},
    {id:"trojan",n:"Tröja",k:"saker",p:[["tS",45,0,0,1.4142],["tM",225,0,1.4142,4.2426],["tS2",315,0,1.4142,4.2426],["tL",45,0,1.4142,0],["tQ",45,0,3.5355,2.1213],["tP",135,1,4.2426,4.2426],["tL2",225,0,4.2426,2.8284]]},
    {id:"person",n:"Person",k:"saker",p:[["tQ",45,0,1.4142,4.9497],["tL",135,0,2.8284,2.8284],["tL2",315,0,0,5.6569],["tS",45,0,0,1.4142],["tP",45,0,0,0],["tS2",45,0,1.4142,1.4142],["tM",315,0,1.4142,1.4142]]}
  ];

  /* ---------- Hjälpfunktioner ---------- */
  const rot=([x,y],d)=>{const a=d*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return[x*c-y*s,x*s+y*c];};
  function pieceVerts(p){return TYPES[p.t].loc.map(v=>{const [x,y]=rot(p.flip?[-v[0],v[1]]:v,p.ang);return[x+p.x,y+p.y];});}
  // snäpp: vinkel till steg, sedan ett hörn till andra bitars eller silhuettens hörn
  function snap(p,others,extraTargets){
    const st=TYPES[p.t].step;p.ang=((Math.round(p.ang/st)*st)%360+360)%360;
    const vs=pieceVerts(p);let best=null;
    const targets=(extraTargets||[]).slice();(others||[]).forEach(o=>{if(o!==p)pieceVerts(o).forEach(v=>targets.push(v));});
    for(const v of vs)for(const t of targets){const d=Math.hypot(t[0]-v[0],t[1]-v[1]);if(d<.3&&(!best||d<best.d-.02))best={dx:t[0]-v[0],dy:t[1]-v[1],d};}
    if(best){p.x+=best.dx;p.y+=best.dy;}
  }
  // ligger biten p precis på lösningens bit q? (samma sort och samma hörn, i vilken ordning som helst)
  function sameSpot(p,q){if(sort(p.t)!==sort(q.t))return false;const a=pieceVerts(p),b=pieceVerts(q);return b.every(v=>a.some(w=>Math.hypot(w[0]-v[0],w[1]-v[1])<.15));}

  /* ---------- Figurens form ---------- */
  function bildPolys(B){return B.extra.map(pieceVerts);}
  function bildBox(B){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;bildPolys(B).forEach(P=>P.forEach(([x,y])=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}));return{x0,y0,x1,y1};}
  const svgNS="http://www.w3.org/2000/svg",el=(n,a)=>{const e=document.createElementNS(svgNS,n);for(const k in a)e.setAttribute(k,a[k]);return e;};
  const ptsAttr=P=>P.map(([x,y])=>x.toFixed(3)+","+(-y).toFixed(3)).join(" ");
  // silhuetten som en enda form, så att inga skarvar mellan bitarna syns (de skulle avslöja lösningen)
  function silPath(B){return bildPolys(B).map(P=>"M"+P.map(([x,y])=>(+x.toFixed(4))+" "+(+(-y).toFixed(4))).join("L")+"Z").join("");}
  function thumb(B,col){const {x0,y0,x1,y1}=bildBox(B),pad=.25;return`<svg viewBox="${x0-pad} ${-(y1+pad)} ${x1-x0+2*pad} ${y1-y0+2*pad}" aria-hidden="true"><path d="${silPath(B)}" fill="${col||"#9AA7BF"}" stroke="${col||"#9AA7BF"}" stroke-width=".05" stroke-linejoin="round"/></svg>`;}

  /* ---------- Spelplanen ---------- */
  const TIPORD=["tL","tL2","tM","tP","tQ","tS","tS2"]; // stora bitar först, de är svårast att placera
  function spel(host,opts){
    opts=opts||{};const B=opts.bild,tray=opts.tray||Object.keys(TYPES);
    const box=bildBox(B),mx=2.2,my=1.2;
    const VB={x:box.x0-mx,y:-(box.y1+my),w:box.x1-box.x0+2*mx,h:box.y1-box.y0+2*my};
    host.innerHTML=`<div class="mb"><svg class="mb-board" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" role="img" aria-label="Tangram: ${B.n}"></svg>
      <div class="mb-tray">${tray.map(t=>`<button class="mb-t" data-t="${t}" aria-label="${TYPES[t].n}"><svg viewBox="${(m=>`${-m} ${-m} ${2*m} ${2*m}`)(Math.max(1.25,Math.max(...TYPES[t].loc.map(([x,y])=>Math.hypot(x,y)))*1.06))}"><polygon points="${ptsAttr(TYPES[t].loc)}" fill="${TYPES[t].col}" stroke="${TYPES[t].st}" stroke-width=".06" stroke-linejoin="round"/></svg></button>`).join("")}</div>
      <div class="mb-ctl"><button data-a="rot">↻ Vrid</button>${tray.some(t=>TYPES[t].flip)?'<button data-a="flip">⇋ Vänd</button>':""}<button data-a="del">🗑 Ta bort</button><button data-a="undo">↶ Ångra</button><button data-a="clear">Börja om</button>${opts.tips?'<button data-a="tip" class="tips">💡 Tips</button>':""}<span class="mb-info"></span></div></div>`;
    const svg=host.querySelector(".mb-board"),gS=el("g",{}),gT=el("g",{}),gP=el("g",{}),gH=el("g",{});svg.append(gS,gP,gT,gH);
    const info=host.querySelector(".mb-info");
    gS.append(el("path",{d:silPath(B),fill:"#C9D2E3",stroke:"#C9D2E3","stroke-width":".05","stroke-linejoin":"round"}));
    let pieces=[],sel=null,hist=[],done=false,tips=0;const shown=[]; // shown = lösningens bitar som visas som tips
    const sol=TIPORD.map(t=>B.extra.find(e=>e.t===t)).filter(Boolean);
    const tgt=bildPolys(B).flat(),snp=p=>snap(p,pieces,tgt); // figurens hörn är också snäppmål
    const save=()=>{hist.push(JSON.stringify(pieces));if(hist.length>60)hist.shift();};
    const toWorld=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(svg.getScreenCTM().inverse());return[q.x,-q.y];};
    function radius(p){return Math.max(...TYPES[p.t].loc.map(([x,y])=>Math.hypot(x,y)));}
    const placed=q=>pieces.some(p=>sameSpot(p,q));
    function draw(){
      gP.innerHTML="";gH.innerHTML="";
      pieces.forEach(p=>{const T=TYPES[p.t],poly=el("polygon",{points:ptsAttr(pieceVerts(p)),fill:T.col,stroke:p===sel?"#1D2B53":T.st,"stroke-width":p===sel?".09":".05","stroke-linejoin":"round",class:"mb-p"});poly._p=p;gP.append(poly);});
      // tips: konturen ligger ovanpå bitarna (utan att ta tryck) tills biten ligger rätt
      gT.innerHTML="";shown.forEach(q=>{if(placed(q))return;const T=TYPES[q.t];
        gT.append(el("polygon",{points:ptsAttr(pieceVerts(q)),fill:T.col,"fill-opacity":".28",stroke:T.st,"stroke-width":".08","stroke-dasharray":".22 .14","stroke-linejoin":"round","pointer-events":"none",class:"mb-tip"}));});
      if(sel&&!drag){const r=radius(sel)+.55,a=(sel.ang+90)*Math.PI/180,hx=sel.x+Math.cos(a)*r,hy=sel.y+Math.sin(a)*r;
        gH.append(el("line",{x1:sel.x,y1:-sel.y,x2:hx,y2:-hy,stroke:"#1D2B53","stroke-width":".04","stroke-dasharray":".12 .1","pointer-events":"none"})); // linjen får inte ta trycket från biten
        const h=el("g",{class:"mb-h",transform:`translate(${hx} ${-hy})`});h.append(el("circle",{r:".36",fill:"#FFC93C",stroke:"#1D2B53","stroke-width":".06"}));
        const t=el("text",{"text-anchor":"middle","dominant-baseline":"central","font-size":".46","font-weight":"800",fill:"#1D2B53"});t.textContent="↻";h.append(t);gH.append(h);}
      info.textContent=`Bitar: ${pieces.length} av 7`+(tips?` · Tips: ${tips}`:"");
      // varje bit finns bara en gång i lådan
      if(opts.unik)host.querySelectorAll(".mb-t").forEach(b=>b.classList.toggle("used",pieces.some(q=>q.t===b.dataset.t)));
    }
    // är figuren täckt? räknas i pixlar: täckt del, bitar utanför och bitar som ligger på varandra
    let cv=null;
    function check(){
      if(done)return;const S=22,W=Math.ceil(VB.w*S),H2=Math.ceil(VB.h*S);
      if(!cv){cv=document.createElement("canvas");cv.width=W;cv.height=H2;}
      const c=cv.getContext("2d",{willReadFrequently:true}),path=P=>{c.beginPath();P.forEach(([x,y],i)=>{const X=(x-VB.x)*S,Y=(-y-VB.y)*S;i?c.lineTo(X,Y):c.moveTo(X,Y);});c.closePath();};
      c.globalCompositeOperation="source-over";c.clearRect(0,0,W,H2);c.fillStyle="rgb(0,0,255)";bildPolys(B).forEach(P=>{path(P);c.fill();});
      c.globalCompositeOperation="lighter";c.fillStyle="rgb(60,0,0)";pieces.forEach(p=>{path(pieceVerts(p));c.fill();});
      const d=c.getImageData(0,0,W,H2).data;let sil=0,cov=0,out=0,ov=0;
      for(let i=0;i<d.length;i+=4){const inS=d[i+2]>160,r=d[i];if(inS){sil++;if(r>=25)cov++;}else if(r>=45&&d[i+2]<60)out++;if(r>=105)ov++;}
      const ok=sil&&cov/sil>.97&&out/sil<.02&&ov/sil<.03;
      if(ok){const counts={};pieces.forEach(p=>counts[p.t]=(counts[p.t]||0)+1);
        done=true;sel=null;shown.length=0;draw();opts.onDone&&opts.onDone({n:pieces.length,counts,tips});}
    }
    function change(){draw();check();}
    // nästa tips: första biten i lösningen som inte ligger rätt och inte redan visas
    function tip(){const q=sol.find(q=>!placed(q)&&!shown.includes(q));if(!q)return;shown.push(q);tips++;window.Ljud&&Ljud.pop&&Ljud.pop(3);draw();}
    // ---------- pekare ----------
    let drag=null;const pts=new Map();let lastTap={p:null,t:0};
    function turn(p,deg){p.ang=((p.ang+deg)%360+360)%360;}
    svg.addEventListener("pointerdown",e=>{
      if(done)return;e.preventDefault();pts.set(e.pointerId,toWorld(e));try{svg.setPointerCapture(e.pointerId);}catch(_){}
      if(pts.size===2&&sel){const [a,b]=[...pts.values()];drag={kind:"two",a0:Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI,ang0:sel.ang};return;}
      const h=e.target.closest(".mb-h");
      if(h&&sel){save();drag={kind:"rot",id:e.pointerId};return;}
      const poly=e.target.closest(".mb-p");
      if(poly){const p=poly._p,w=toWorld(e);
        if(lastTap.p===p&&performance.now()-lastTap.t<320){save();turn(p,TYPES[p.t].step);snp(p);lastTap={p:null,t:0};sel=p;change();return;}
        lastTap={p,t:performance.now()};save();sel=p;pieces=pieces.filter(q=>q!==p).concat([p]);drag={kind:"move",id:e.pointerId,dx:p.x-w[0],dy:p.y-w[1],moved:false};draw();return;}
      sel=null;draw();
    });
    svg.addEventListener("pointermove",e=>{
      if(!pts.has(e.pointerId))return;const w=toWorld(e);pts.set(e.pointerId,w);if(!drag)return;
      if(drag.kind==="two"&&pts.size===2){const [a,b]=[...pts.values()];sel.ang=drag.ang0+Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI-drag.a0;draw();return;}
      if(drag.kind==="rot"&&e.pointerId===drag.id){sel.ang=Math.atan2(w[1]-sel.y,w[0]-sel.x)*180/Math.PI-90;draw();return;}
      if(drag.kind==="move"&&e.pointerId===drag.id){drag.p=sel;sel.x=w[0]+drag.dx;sel.y=w[1]+drag.dy;drag.moved=true;draw();}
    });
    const up=e=>{
      pts.delete(e.pointerId);if(!drag)return;
      if(drag.kind==="two"&&pts.size>0)return;
      const d=drag;drag=null;
      const tr=host.querySelector(".mb-tray").getBoundingClientRect(),overTray=e.clientY>=tr.top&&e.clientY<=tr.bottom&&e.clientX>=tr.left&&e.clientX<=tr.right;
      // ett kort tryck i lådan: biten läggs på planen. En bit som släpps över lådan tas bort.
      if(d.fresh&&overTray){sel.x=VB.x+VB.w*(.2+.6*Math.random());sel.y=-(VB.y+VB.h*(.2+.6*Math.random()));} // utspridda, inte i en hög
      else if(d.kind==="move"&&d.moved&&overTray){pieces=pieces.filter(q=>q!==sel);sel=null;change();return;}
      if(sel){snp(sel);}change();
    };
    svg.addEventListener("pointerup",up);svg.addEventListener("pointercancel",up);
    let wheelT=0;svg.addEventListener("wheel",e=>{if(!sel||done)return;e.preventDefault();if(!wheelT)save();turn(sel,e.deltaY>0?15:-15);draw();clearTimeout(wheelT);wheelT=setTimeout(()=>{wheelT=0;snp(sel);change();},260);},{passive:false});
    // ny bit från lådan: dyker upp under fingret och följer med
    host.querySelector(".mb-tray").addEventListener("pointerdown",e=>{
      const b=e.target.closest(".mb-t");if(!b||done||b.classList.contains("used"))return;e.preventDefault();save();
      const w=toWorld(e),p={t:b.dataset.t,x:w[0],y:w[1],ang:0};pieces.push(p);sel=p;
      pts.set(e.pointerId,w);drag={kind:"move",id:e.pointerId,dx:0,dy:0,moved:true,fresh:true};
      try{svg.setPointerCapture(e.pointerId);}catch(_){}
      // reserv om pekaren inte fångas av planen
      const onUp=ev=>{document.removeEventListener("pointerup",onUp);if(drag&&drag.fresh&&ev.pointerId===e.pointerId)up(ev);};document.addEventListener("pointerup",onUp);
      draw();
    });
    document.addEventListener("pointermove",e=>{if(drag&&drag.fresh&&e.pointerId===drag.id){const w=toWorld(e);sel.x=w[0];sel.y=w[1];draw();}});
    host.querySelector(".mb-ctl").onclick=e=>{const a=e.target.closest("[data-a]");if(!a||done)return;const k=a.dataset.a;
      if(k==="rot"&&sel){save();turn(sel,TYPES[sel.t].step);snp(sel);change();}
      else if(k==="flip"&&sel&&TYPES[sel.t].flip){save();sel.flip=!sel.flip;snp(sel);change();}
      else if(k==="del"&&sel){save();pieces=pieces.filter(q=>q!==sel);sel=null;change();}
      else if(k==="undo"&&hist.length){pieces=JSON.parse(hist.pop());sel=null;change();}
      else if(k==="clear"&&pieces.length){save();pieces=[];sel=null;change();}
      else if(k==="tip")tip();};
    document.addEventListener("keydown",e=>{if(!host.isConnected||!sel||done)return;if(e.key==="r"||e.key==="R"){save();turn(sel,TYPES[sel.t].step);snp(sel);change();}else if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();save();pieces=pieces.filter(q=>q!==sel);sel=null;change();}});
    draw();
    return{get pieces(){return pieces;},set pieces(v){pieces=v;change();},get tips(){return tips;},tip,check,draw,VB};
  }
  TANGRAM.forEach(F=>{
    F.extra=F.p.map(([t,r,f,dx,dy])=>{const v=TYPES[t].v.map(([x,y])=>{const [a,b]=rot(f?[-x,y]:[x,y],r);return[a+dx,b+dy];}),cx=v.reduce((a,q)=>a+q[0],0)/v.length,cy=v.reduce((a,q)=>a+q[1],0)/v.length;return{t,x:cx,y:cy,ang:r,flip:!!f};});
  });
  // stilen för spelplanen, en gång per sida
  if(!document.getElementById("mb-css")){const st=document.createElement("style");st.id="mb-css";st.textContent=`
.mb{display:flex;flex-direction:column;gap:8px}
.mb-board{width:100%;height:auto;max-height:60vh;background:#fff;border-radius:18px;box-shadow:0 4px 0 #C6D6F2;touch-action:none;user-select:none;-webkit-user-select:none;display:block}
.mb-tray{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;background:#fff;border-radius:16px;padding:6px;box-shadow:0 3px 0 #C6D6F2;touch-action:none}
.mb-t{width:58px;height:58px;border-radius:12px;background:#F2F6FD;border:0;cursor:grab;touch-action:none}
.mb-t svg{width:100%;height:100%;display:block}
.mb-t.used{opacity:.25;cursor:default}
@media (max-width:899px){.mb-tray{flex-wrap:nowrap;gap:4px}.mb-t{flex:1 1 0;min-width:0;max-width:58px;width:auto;height:auto;aspect-ratio:1}}
.mb-ctl{display:flex;gap:6px;flex-wrap:wrap;align-items:center;justify-content:center}
.mb-ctl button{background:#fff;border:0;border-radius:12px;padding:6px 12px;font:inherit;font-weight:800;color:#1D2B53;box-shadow:0 3px 0 #C6D6F2;min-height:44px;cursor:pointer}
.mb-info{font-weight:800;color:#56668F;padding:0 6px}
.mb-p,.mb-h{cursor:grab}
.mb-ctl button.tips{background:#FFF4CC;box-shadow:0 3px 0 #E9CF7A}
@keyframes mbtip{from{opacity:0}to{opacity:1}}.mb-tip{animation:mbtip .4s ease-out}@media (prefers-reduced-motion:reduce){.mb-tip{animation:none}}
@media (min-width:900px){.mb{display:grid;grid-template-columns:1fr 84px;grid-template-areas:"board tray" "ctl ctl";align-items:start}.mb-board{grid-area:board;max-height:calc(100vh - 230px)}.mb-tray{grid-area:tray;flex-direction:column}.mb-ctl{grid-area:ctl}}`;document.head.appendChild(st);}
  window.MPBitar={TYPES,TANGRAM,TANGRAM_KAT,pieceVerts,snap,bildPolys,bildBox,thumb,spel};
})();
