/* Mönsterbitar för Matte-Portalen: sexhörning, trapets, blå romb, triangel, kvadrat och smal romb.
   Används av Geometri ("Bygg bilden") och Verktygslådan (fritt bygge). En gemensam fil, inga kopior.

   Koordinater: 1 enhet = bitarnas sida. Triangelnätet: punkten L(a,b) = (a + b/2, b·h), h = √3/2, y uppåt.
   Bilderna ritas som "triangelpixlar" i ASCII: varje tecken är en liten triangel. Rad b räknas nerifrån,
   kolumn m = vänsterkanten i halva enheter. Triangeln pekar upp om (m − b) är jämnt, annars ner.
   Lösningen räknas fram automatiskt (sexhörningar först, sedan trapetser, romber och trianglar).

   MPBitar.spel(svg, opts) bygger en spelplan: bitlåda, dra, vrid fritt (handtag, två fingrar, scrollhjul,
   dubbeltryck) med snäpp till 60° (30° för kvadrat och smal romb) och till triangelnätet. */
(function(){
  const H=Math.sqrt(3)/2,C30=Math.sqrt(3)/2;
  const TYPES={
    hex:{n:"Sexhörning",col:"#F7C531",st:"#C99A0A",v:[[0,0],[1,0],[1.5,H],[1,2*H],[0,2*H],[-.5,H]],step:60,lat:true},
    trap:{n:"Trapets",col:"#E5484D",st:"#A8282D",v:[[0,0],[2,0],[1.5,H],[.5,H]],step:60,lat:true},
    romb:{n:"Romb",col:"#3D8BFD",st:"#1F5FC4",v:[[0,0],[1,0],[1.5,H],[.5,H]],step:60,lat:true},
    tri:{n:"Triangel",col:"#2BB673",st:"#1A7E4E",v:[[0,0],[1,0],[.5,H]],step:60,lat:true},
    sq:{n:"Kvadrat",col:"#FF9F43",st:"#C96A0C",v:[[0,0],[1,0],[1,1],[0,1]],step:30,lat:false},
    tan:{n:"Smal romb",col:"#E9D3A1",st:"#B08A4A",v:[[0,0],[1,0],[1+C30,.5],[C30,.5]],step:30,lat:false}
  };
  // bitarnas hörn runt tyngdpunkten
  for(const t of Object.values(TYPES)){const cx=t.v.reduce((a,p)=>a+p[0],0)/t.v.length,cy=t.v.reduce((a,p)=>a+p[1],0)/t.v.length;t.loc=t.v.map(([x,y])=>[x-cx,y-cy]);}
  const L=(a,b)=>[a+b/2,b*H];
  // en triangelpixel: rad b, kolumn m (vänsterkant i halva enheter)
  function triPts(b,m){const x=m/2,y0=b*H,y1=(b+1)*H;return((m-b)%2+2)%2===0?[[x,y0],[x+1,y0],[x+.5,y1]]:[[x,y1],[x+1,y1],[x+.5,y0]];}
  function parse(rows){
    const T=new Set(),n=rows.length;
    rows.forEach((row,i)=>{const b=n-1-i;for(let m=0;m<row.length;m++)if(row[m]==="#")T.add(b+","+m);});
    return T;
  }
  // lägg bitar: sexhörningar, trapetser, romber, trianglar (girigt, stora bitar först)
  function tile(T){
    const left=new Set(T),pieces=[],has=k=>left.has(k),take=ks=>ks.forEach(k=>left.delete(k));
    const keys=[...T].map(k=>k.split(",").map(Number)).sort((p,q)=>p[0]-q[0]||p[1]-q[1]);
    // sexhörning runt punkten (X,b): rad b−1 och b, kolumn X−2..X
    for(const [b,m] of keys){for(const X of [m+2,m+1,m]){if(((X-b)%2+2)%2)continue;const ks=[];for(const bb of [b-1,b])for(const mm of [X-2,X-1,X])ks.push(bb+","+mm);
      if(ks.every(has)){take(ks);pieces.push({t:"hex",ks});}}}
    for(const [b,m] of keys){const ks=[b+","+m,b+","+(m+1),b+","+(m+2)];if(ks.every(has)){take(ks);pieces.push({t:"trap",ks});}}
    for(const [b,m] of keys){if(!has(b+","+m))continue;const down=((m-b)%2+2)%2===1;
      const pair=[b+","+(m+1)].concat(down?[(b+1)+","+m]:[]).find(has);if(pair){take([b+","+m,pair]);pieces.push({t:"romb",ks:[b+","+m,pair]});}}
    for(const k of [...left]){pieces.push({t:"tri",ks:[k]});left.delete(k);}
    return pieces;
  }
  function bounds(T){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const k of T){const [b,m]=k.split(",").map(Number);for(const [x,y] of triPts(b,m)){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}}return{x0,y0,x1,y1};}
  // Bilderna (rad överst först). Varje tecken = en liten triangel.
  const BILDER=[
    {id:"hus",n:"Hus",rows:[
      "       #",
      "      ###",
      "     #####",
      "    #######",
      "   #########",
      "  ###########"],
      // kroppen av kvadrater under taket (taket slutar vid y = 0), dörr i mitten
      extra:[{t:"sq",x:2.5,y:-.5},{t:"sq",x:3.5,y:-.5},{t:"sq",x:4.5,y:-.5},{t:"sq",x:5.5,y:-.5},{t:"sq",x:2.5,y:-1.5},{t:"sq",x:5.5,y:-1.5}]},
    {id:"drake",n:"Drake",rows:[
      "      #",
      "   #####",
      "  #######",
      " #########",
      " #########",
      "  #######",
      "   #####",
      "    ###",
      "     #",
      "",
      "     #",
      "",
      "     #"]},
    {id:"fisk",n:"Fisk",rows:[
      "     ####     ",
      "#   ########  ",
      "############# ",
      "############# ",
      "#   ########  ",
      "     ####     "]},
    {id:"raket",n:"Raket",rows:[
      "    #    ",
      "   ###   ",
      "   ###   ",
      "   ###   ",
      "   ###   ",
      "  #####  ",
      " ### ### ",
      " #     # "]},
    {id:"bat",n:"Segelbåt",rows:[
      "       #",
      "      ###",
      "     #####",
      "    #######",
      "   #########",
      "      ###",
      " #############",
      "  ###########",
      "   #########"]},
    {id:"svamp",n:"Svamp",rows:[
      "    #####",
      "  #########",
      " ###########",
      "#############",
      "    #####",
      "    #####",
      "    #####",
      "   #######"]},
    {id:"gran",n:"Gran",rows:[
      "    #    ",
      "   ###   ",
      "  #####  ",
      "   ###   ",
      "  #####  ",
      " ####### ",
      "  #####  ",
      " ####### ",
      "#########",
      "   ###   ",
      "   ###   "]},
    {id:"stjarna",n:"Stjärna",rows:[
      "     #     ",
      "    ###    ",
      "###########",
      " ######### ",
      " ######### ",
      "###########",
      "    ###    ",
      "     #     "]},
    {id:"fjaril",n:"Fjäril",rows:[
      " #####   #####",
      "#######0#######",
      " #############",
      " #############",
      "#######0#######",
      " #####   #####"]},
    {id:"krona",n:"Krona",rows:[
      "#     #     #",
      "##   ###   ##",
      "###############",
      "###############",
      "###############"]},
    {id:"robot",n:"Robot",rows:[
      "    ###    ",
      "  #######  ",
      "  #######  ",
      "    ###    ",
      "###########",
      " ######### ",
      " ######### ",
      "  ##   ##  ",
      "  ##   ##  "]},
    {id:"hjarta",n:"Hjärta",rows:[
      " ####  ####",
      "###########",
      "###########",
      " ######### ",
      "  #######  ",
      "   #####   ",
      "    ###    ",
      "     #     "]},
    {id:"skoldpadda",n:"Sköldpadda",rows:[
      "     #####     ",
      "    #######    ",
      "## #########  ##",
      "################",
      "    #######   ",
      "   ##     ##  "]},
    {id:"tag",n:"Tåg",rows:[
      "##           ",
      "##   ########",
      "#############",
      "#############",
      " ###  ###  ### "]}
  ];
  BILDER.forEach(B=>{B.T=parse(B.rows);B.sol=tile(B.T);B.box=bounds(B.T);B.extra=(B.extra||[]).map(e=>Object.assign({ang:0},e));
    B.extra.forEach(e=>{B.sol.push({t:e.t,poly:null,piece:e});});});

  /* ---------- Hjälpfunktioner ---------- */
  const rot=([x,y],d)=>{const a=d*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return[x*c-y*s,x*s+y*c];};
  function pieceVerts(p){return TYPES[p.t].loc.map(v=>{const [x,y]=rot(v,p.ang);return[x+p.x,y+p.y];});}
  function nearestLattice(x,y){let best=null,bd=1e9;const b0=Math.round(y/H);for(let b=b0-1;b<=b0+1;b++){const a=Math.round(x-b/2);for(let aa=a-1;aa<=a+1;aa++){const [px,py]=L(aa,b),d=Math.hypot(px-x,py-y);if(d<bd){bd=d;best=[px,py];}}}return{p:best,d:bd};}
  // snäpp: vinkel till steg, sedan ett hörn till närmaste nätpunkt (eller till andra bitars hörn)
  function snap(p,others,extraTargets){
    const st=TYPES[p.t].step;p.ang=((Math.round(p.ang/st)*st)%360+360)%360;
    const vs=pieceVerts(p);let best=null;
    const targets=(extraTargets||[]).slice();(others||[]).forEach(o=>{if(o!==p)pieceVerts(o).forEach(v=>targets.push(v));});
    for(const v of vs){
      if(TYPES[p.t].lat){const {p:q,d}=nearestLattice(v[0],v[1]);if(d<.35&&(!best||d<best.d))best={dx:q[0]-v[0],dy:q[1]-v[1],d};}
      for(const t of targets){const d=Math.hypot(t[0]-v[0],t[1]-v[1]);if(d<.3&&(!best||d<best.d-.02))best={dx:t[0]-v[0],dy:t[1]-v[1],d};}
    }
    if(best){p.x+=best.dx;p.y+=best.dy;}
  }

  /* ---------- Bildens form: trianglar + extra bitar ---------- */
  function bildPolys(B){const out=[...B.T].map(k=>{const [b,m]=k.split(",").map(Number);return triPts(b,m);});B.extra.forEach(e=>out.push(pieceVerts(e)));return out;}
  function bildBox(B){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;bildPolys(B).forEach(P=>P.forEach(([x,y])=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}));return{x0,y0,x1,y1};}
  // lösningens bitar som polygoner (för linjerna i Lätt och för bildsamlingen)
  function solPolys(B){
    return B.sol.map(pc=>{if(pc.piece)return{t:pc.t,pts:pieceVerts(pc.piece)};
      // yttre kanter: kanter som bara en triangel i biten har
      const tris=pc.ks.map(k=>{const [b,m]=k.split(",").map(Number);return triPts(b,m);}),E=new Map(),key=(p,q)=>{const a=p.map(v=>v.toFixed(3)).join(),b=q.map(v=>v.toFixed(3)).join();return a<b?a+"|"+b:b+"|"+a;};
      tris.forEach(T=>T.forEach((p,i)=>{const q=T[(i+1)%3],k=key(p,q);E.set(k,E.has(k)?null:[p,q]);}));
      return{t:pc.t,edges:[...E.values()].filter(Boolean),tris};});
  }
  const svgNS="http://www.w3.org/2000/svg",el=(n,a)=>{const e=document.createElementNS(svgNS,n);for(const k in a)e.setAttribute(k,a[k]);return e;};
  const ptsAttr=P=>P.map(([x,y])=>x.toFixed(3)+","+(-y).toFixed(3)).join(" ");
  function thumb(B,col){const {x0,y0,x1,y1}=bildBox(B),pad=.25;return`<svg viewBox="${x0-pad} ${-(y1+pad)} ${x1-x0+2*pad} ${y1-y0+2*pad}" aria-hidden="true">${bildPolys(B).map(P=>`<polygon points="${ptsAttr(P)}" fill="${col||"#9AA7BF"}" stroke="${col||"#9AA7BF"}" stroke-width=".05" stroke-linejoin="round"/>`).join("")}</svg>`;}

  /* ---------- Spelplanen ----------
     opts: {bild, nivå: 1 lätt (linjer syns) | 2 mellan | 3 svår (högst N bitar), fri:true för fritt bygge, onDone(info)} */
  function spel(host,opts){
    opts=opts||{};const B=opts.bild,fri=!B,niva=opts.niva||2;
    const box=B?bildBox(B):(opts.box||{x0:0,y0:0,x1:14,y1:9}),mx=fri?0:2.2,my=fri?0:1.2;
    const VB={x:box.x0-mx,y:-(box.y1+my),w:box.x1-box.x0+2*mx,h:box.y1-box.y0+2*my};
    host.innerHTML=`<div class="mb"><svg class="mb-board" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" role="img" aria-label="${B?"Bygg bilden: "+B.n:"Fritt bygge"}"></svg>
      <div class="mb-tray">${(opts.tray||Object.keys(TYPES)).map(t=>`<button class="mb-t" data-t="${t}" aria-label="${TYPES[t].n}"><svg viewBox="-1.25 -1.25 2.5 2.5"><polygon points="${ptsAttr(TYPES[t].loc)}" fill="${TYPES[t].col}" stroke="${TYPES[t].st}" stroke-width=".06" stroke-linejoin="round"/></svg></button>`).join("")}</div>
      <div class="mb-ctl"><button data-a="rot">↻ Vrid</button><button data-a="del">🗑 Ta bort</button><button data-a="undo">↶ Ångra</button><button data-a="clear">Börja om</button><span class="mb-info"></span></div></div>`;
    const svg=host.querySelector(".mb-board"),gS=el("g",{}),gL=el("g",{}),gP=el("g",{}),gH=el("g",{});svg.append(gS,gL,gP,gH);
    const info=host.querySelector(".mb-info");
    // silhuetten (och linjerna i Lätt)
    if(B){bildPolys(B).forEach(P=>gS.append(el("polygon",{points:ptsAttr(P),fill:"#C9D2E3",stroke:"#C9D2E3","stroke-width":".05","stroke-linejoin":"round"})));
      if(niva===1)solPolys(B).forEach(sp=>{(sp.edges||[]).forEach(([p,q])=>gL.append(el("line",{x1:p[0],y1:-p[1],x2:q[0],y2:-q[1],stroke:"#fff","stroke-width":".06","stroke-linecap":"round"})));
        if(sp.pts)gL.append(el("polygon",{points:ptsAttr(sp.pts),fill:"none",stroke:"#fff","stroke-width":".06"}));});}
    const maxN=B?B.sol.length:Infinity;
    let pieces=[],sel=null,hist=[],done=false;
    const tg=B?bildPolys(B).flat():[],snp=p=>snap(p,pieces,tg); // bildens hörn är också snäppmål (för kvadraterna)
    const save=()=>{hist.push(JSON.stringify(pieces));if(hist.length>60)hist.shift();};
    const toWorld=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(svg.getScreenCTM().inverse());return[q.x,-q.y];};
    function radius(p){return Math.max(...TYPES[p.t].loc.map(([x,y])=>Math.hypot(x,y)));}
    function draw(){
      gP.innerHTML="";gH.innerHTML="";
      pieces.forEach(p=>{const T=TYPES[p.t],poly=el("polygon",{points:ptsAttr(pieceVerts(p)),fill:T.col,stroke:p===sel?"#1D2B53":T.st,"stroke-width":p===sel?".09":".05","stroke-linejoin":"round",class:"mb-p"});poly._p=p;gP.append(poly);});
      if(sel&&!drag){const r=radius(sel)+.55,a=(sel.ang+90)*Math.PI/180,hx=sel.x+Math.cos(a)*r,hy=sel.y+Math.sin(a)*r;
        gH.append(el("line",{x1:sel.x,y1:-sel.y,x2:hx,y2:-hy,stroke:"#1D2B53","stroke-width":".04","stroke-dasharray":".12 .1","pointer-events":"none"})); // linjen får inte ta trycket från biten
        const h=el("g",{class:"mb-h",transform:`translate(${hx} ${-hy})`});h.append(el("circle",{r:".36",fill:"#FFC93C",stroke:"#1D2B53","stroke-width":".06"}));
        const t=el("text",{"text-anchor":"middle","dominant-baseline":"central","font-size":".46","font-weight":"800",fill:"#1D2B53"});t.textContent="↻";h.append(t);gH.append(h);}
      if(B){const n=pieces.length;info.textContent=niva===3?`Bitar: ${n} (högst ${maxN})`:`Bitar: ${n}`;}else info.textContent=`Bitar: ${pieces.length}`;
    }
    // är bilden täckt? räknas i pixlar: täckt del, bitar utanför och bitar som ligger på varandra
    let cv=null;
    function check(){
      if(!B||done)return;const S=22,W=Math.ceil(VB.w*S),H2=Math.ceil(VB.h*S);
      if(!cv){cv=document.createElement("canvas");cv.width=W;cv.height=H2;}
      const c=cv.getContext("2d",{willReadFrequently:true}),path=P=>{c.beginPath();P.forEach(([x,y],i)=>{const X=(x-VB.x)*S,Y=(-y-VB.y)*S;i?c.lineTo(X,Y):c.moveTo(X,Y);});c.closePath();};
      c.globalCompositeOperation="source-over";c.clearRect(0,0,W,H2);c.fillStyle="rgb(0,0,255)";bildPolys(B).forEach(P=>{path(P);c.fill();});
      c.globalCompositeOperation="lighter";c.fillStyle="rgb(60,0,0)";pieces.forEach(p=>{path(pieceVerts(p));c.fill();});
      const d=c.getImageData(0,0,W,H2).data;let sil=0,cov=0,out=0,ov=0;
      for(let i=0;i<d.length;i+=4){const inS=d[i+2]>160,r=d[i];if(inS){sil++;if(r>=25)cov++;}else if(r>=45&&d[i+2]<60)out++;if(r>=105)ov++;}
      const ok=sil&&cov/sil>.97&&out/sil<.02&&ov/sil<.03;
      if(ok){const counts={};pieces.forEach(p=>counts[p.t]=(counts[p.t]||0)+1);
        if(niva===3&&pieces.length>maxN){info.textContent=`Bilden är klar med ${pieces.length} bitar. Klarar du den med högst ${maxN}?`;return;}
        done=true;sel=null;draw();opts.onDone&&opts.onDone({n:pieces.length,counts,max:maxN});}
    }
    function change(){draw();check();}
    // ---------- pekare ----------
    let drag=null;const pts=new Map();let lastTap={p:null,t:0};
    function rot(p,deg){p.ang=((p.ang+deg)%360+360)%360;}
    svg.addEventListener("pointerdown",e=>{
      if(done)return;e.preventDefault();pts.set(e.pointerId,toWorld(e));try{svg.setPointerCapture(e.pointerId);}catch(_){}
      if(pts.size===2&&sel){const [a,b]=[...pts.values()];drag={kind:"two",a0:Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI,ang0:sel.ang};return;}
      const h=e.target.closest(".mb-h");
      if(h&&sel){save();drag={kind:"rot",id:e.pointerId};return;}
      const poly=e.target.closest(".mb-p");
      if(poly){const p=poly._p,w=toWorld(e);
        if(lastTap.p===p&&performance.now()-lastTap.t<320){save();rot(p,TYPES[p.t].step);snp(p);lastTap={p:null,t:0};sel=p;change();return;}
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
      // ett kort tryck i lådan: biten läggs mitt på planen. En bit som släpps över lådan tas bort.
      if(d.fresh&&overTray){sel.x=VB.x+VB.w/2+(Math.random()-.5);sel.y=-(VB.y+VB.h/2)+(Math.random()-.5);}
      else if(d.kind==="move"&&d.moved&&overTray){pieces=pieces.filter(q=>q!==sel);sel=null;change();return;}
      if(sel){snp(sel);}change();
    };
    svg.addEventListener("pointerup",up);svg.addEventListener("pointercancel",up);
    let wheelT=0;svg.addEventListener("wheel",e=>{if(!sel||done)return;e.preventDefault();if(!wheelT)save();rot(sel,e.deltaY>0?15:-15);draw();clearTimeout(wheelT);wheelT=setTimeout(()=>{wheelT=0;snp(sel);change();},260);},{passive:false});
    // ny bit från lådan: dyker upp under fingret och följer med
    host.querySelector(".mb-tray").addEventListener("pointerdown",e=>{
      const b=e.target.closest(".mb-t");if(!b||done)return;e.preventDefault();save();
      const w=toWorld(e),p={t:b.dataset.t,x:w[0],y:w[1],ang:0};pieces.push(p);sel=p;
      pts.set(e.pointerId,w);drag={kind:"move",id:e.pointerId,dx:0,dy:0,moved:true,fresh:true};
      try{svg.setPointerCapture(e.pointerId);}catch(_){}
      // reserv om pekaren inte fångas av planen
      const onUp=ev=>{document.removeEventListener("pointerup",onUp);if(drag&&drag.fresh&&ev.pointerId===e.pointerId)up(ev);};document.addEventListener("pointerup",onUp);
      draw();
    });
    document.addEventListener("pointermove",e=>{if(drag&&drag.fresh&&e.pointerId===drag.id){const w=toWorld(e);sel.x=w[0];sel.y=w[1];drawLight();}});
    function drawLight(){draw();}
    host.querySelector(".mb-ctl").onclick=e=>{const a=e.target.closest("[data-a]");if(!a||done)return;const k=a.dataset.a;
      if(k==="rot"&&sel){save();rot(sel,TYPES[sel.t].step);snp(sel);change();}
      else if(k==="del"&&sel){save();pieces=pieces.filter(q=>q!==sel);sel=null;change();}
      else if(k==="undo"&&hist.length){pieces=JSON.parse(hist.pop());sel=null;change();}
      else if(k==="clear"&&pieces.length){save();pieces=[];sel=null;change();}};
    document.addEventListener("keydown",e=>{if(!host.isConnected||!sel||done)return;if(e.key==="r"||e.key==="R"){save();rot(sel,TYPES[sel.t].step);snp(sel);change();}else if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();save();pieces=pieces.filter(q=>q!==sel);sel=null;change();}});
    draw();
    return{get pieces(){return pieces;},set pieces(v){pieces=v;change();},check,draw,VB};
  }
  // stilen för spelplanen, en gång per sida
  if(!document.getElementById("mb-css")){const st=document.createElement("style");st.id="mb-css";st.textContent=`
.mb{display:flex;flex-direction:column;gap:8px}
.mb-board{width:100%;height:auto;max-height:60vh;background:#fff;border-radius:18px;box-shadow:0 4px 0 #C6D6F2;touch-action:none;user-select:none;-webkit-user-select:none;display:block}
.mb-tray{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;background:#fff;border-radius:16px;padding:6px;box-shadow:0 3px 0 #C6D6F2;touch-action:none}
.mb-t{width:58px;height:58px;border-radius:12px;background:#F2F6FD;border:0;cursor:grab;touch-action:none}
.mb-t svg{width:100%;height:100%;display:block}
@media (max-width:420px){.mb-t{width:50px;height:50px}.mb-tray{gap:4px}}
.mb-ctl{display:flex;gap:6px;flex-wrap:wrap;align-items:center;justify-content:center}
.mb-ctl button{background:#fff;border:0;border-radius:12px;padding:6px 12px;font:inherit;font-weight:800;color:#1D2B53;box-shadow:0 3px 0 #C6D6F2;min-height:44px;cursor:pointer}
.mb-info{font-weight:800;color:#56668F;padding:0 6px}
.mb-p,.mb-h{cursor:grab}
@media (min-width:900px){.mb{display:grid;grid-template-columns:1fr 84px;grid-template-areas:"board tray" "ctl ctl";align-items:start}.mb-board{grid-area:board;max-height:calc(100vh - 230px)}.mb-tray{grid-area:tray;flex-direction:column}.mb-ctl{grid-area:ctl}}`;document.head.appendChild(st);}
  window.MPBitar={TYPES,BILDER,L,triPts,parse,tile,bounds,pieceVerts,snap,H,bildPolys,bildBox,solPolys,thumb,spel};
})();
