/* Klockan för Matte-Portalen: klockbilden, tid på svenska, dra i visarna, färgad tårtbit och tidsblock.
   Används av Klockan (klockan/) och Verktygslådan (verktyg/klockan/). En gemensam fil, inga kopior.
   Tider räknas i minuter efter midnatt (T). Klockan visar T modulo 12 timmar. */
(function(){
  const HN=['tolv','ett','två','tre','fyra','fem','sex','sju','åtta','nio','tio','elva','tolv'];
  const NUM=['noll','en','två','tre','fyra','fem','sex','sju','åtta','nio','tio','elva','tolv','tretton','fjorton','femton','sexton','sjutton','arton','nitton','tjugo'];
  const hn=h=>HN[((h%12)+12)%12||12];
  const two=n=>String(n).padStart(2,'0');
  const dig=(h,m)=>`${two(h)}.${two(m)}`;
  const cap=s=>s[0].toUpperCase()+s.slice(1);
  const min=n=>`${NUM[n]} ${n===1?'minut':'minuter'}`;
  /* Klockslag i ord. Femminuterstiderna som i klassrummet (:20 tjugo över, :25 fem i halv, :35 fem över halv, :40 tjugo i).
     Övriga minuter: 1–19 över, 21–29 i halv, 31–39 över halv, 41–59 i. */
  function phrase(h,m){
    const a=hn(h),b=hn(h+1);
    const five={0:`klockan ${a}`,5:`fem över ${a}`,10:`tio över ${a}`,15:`kvart över ${a}`,20:`tjugo över ${a}`,25:`fem i halv ${b}`,
      30:`halv ${b}`,35:`fem över halv ${b}`,40:`tjugo i ${b}`,45:`kvart i ${b}`,50:`tio i ${b}`,55:`fem i ${b}`};
    if(m in five)return five[m];
    if(m<20)return`${min(m)} över ${a}`;
    if(m<30)return`${min(30-m)} i halv ${b}`;
    if(m<40)return`${min(m-30)} över halv ${b}`;
    return`${min(60-m)} i ${b}`;
  }
  function fmtDur(t){const h=Math.floor(t/60),m=t%60;const hs=h?`${h} ${h===1?'timme':'timmar'}`:'',ms=m?`${m} ${m===1?'minut':'minuter'}`:'';return hs&&ms?`${hs} och ${ms}`:hs||ms||'0 minuter';}
  const short=t=>{const h=Math.floor(t/60),m=t%60;return h?`${h} tim${m?` ${m} min`:''}`:`${m} min`;};

  /* ---------- Klockbilden ---------- */
  const P=(r,deg)=>[100+r*Math.sin(deg*Math.PI/180),100-r*Math.cos(deg*Math.PI/180)];
  // en ringbit mellan radierna r1 och r2 från vinkel a1 till a2 (grader medurs från 12)
  function band(r1,r2,a1,a2){
    if(a2-a1>=359.99){const m=a1+180;return band(r1,r2,a1,m)+band(r1,r2,m,a1+360);}
    const L=a2-a1>180?1:0,[x1,y1]=P(r2,a1),[x2,y2]=P(r2,a2),[x3,y3]=P(r1,a2),[x4,y4]=P(r1,a1);
    return`M${x1} ${y1}A${r2} ${r2} 0 ${L} 1 ${x2} ${y2}L${x3} ${y3}A${r1} ${r1} 0 ${L} 0 ${x4} ${y4}Z`;
  }
  function pie(r,a1,a2){if(a2-a1>=359.99)return`M${100-r} 100A${r} ${r} 0 1 1 ${100+r} 100A${r} ${r} 0 1 1 ${100-r} 100Z`;
    const [x1,y1]=P(r,a1),[x2,y2]=P(r,a2);return`M100 100L${x1} ${y1}A${r} ${r} 0 ${a2-a1>180?1:0} 1 ${x2} ${y2}Z`;}
  function clockSVG(h,m,o={}){
    const ah=o.hourAngle!=null?o.hourAngle:((h%12)+m/60)*30,am=o.minAngle!=null?o.minAngle:m*6,W=o.wide||22;
    let s=`<svg class="clock${o.small?' small':''}" viewBox="${-W} ${-W} ${200+2*W} ${200+2*W}" role="img" aria-label="Analog klocka">`;
    s+=`<g class="ring"></g><circle cx="100" cy="100" r="96" fill="#fff" stroke="#1D2B53" stroke-width="6"/><g class="wedge"></g>`;
    if(o.halves){
      s+=`<path d="M100 100L100 7A93 93 0 0 1 100 193Z" fill="#DDF5E7"/><path d="M100 100L100 193A93 93 0 0 1 100 7Z" fill="#FFE9D2"/>`;
      s+=`<text x="136" y="106" text-anchor="middle" font-size="15" font-weight="800" fill="#157548" stroke="#fff" stroke-width="4" paint-order="stroke">över</text><text x="64" y="106" text-anchor="middle" font-size="17" font-weight="800" fill="#C96A0C" stroke="#fff" stroke-width="4" paint-order="stroke">i</text>`;
    }
    if(o.wedge){const[m1,dm]=o.wedge;if(dm>=60)s+=`<circle cx="100" cy="100" r="92" fill="rgba(255,159,67,.28)"/>`;
      const rest=dm%60;if(rest)s+=`<path d="${pie(92,m1*6,(m1+rest)*6)}" fill="rgba(255,159,67,.45)"/>`;}
    for(let i=0;i<60;i++){const maj=i%5===0,[x1,y1]=P(maj?80:86,i*6),[x2,y2]=P(92,i*6);
      s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1D2B53" stroke-width="${maj?3:1.3}" stroke-linecap="round"/>`;}
    for(let i=1;i<=12;i++){const [x,y]=P(66,i*30);s+=`<text x="${x}" y="${y+7}" text-anchor="middle" font-size="21" font-weight="800" fill="#1D2B53">${i}</text>`;}
    if(o.ring){for(let i=0;i<12;i++){const [x,y]=P(110,i*30);s+=`<text x="${x}" y="${y+5}" text-anchor="middle" font-size="13" font-weight="800" fill="#3D5AFE">${two(i*5)}</text>`;}}
    if(o.mark!=null){const [x,y]=P(99,o.mark*6),[x2,y2]=P(78,o.mark*6);s+=`<g class="mark"><line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#E5484D" stroke-width="3.5" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="5" fill="#E5484D" stroke="#fff" stroke-width="1.5"/></g>`;}
    s+=`<g class="hh" transform="rotate(${ah} 100 100)"><line x1="100" y1="112" x2="100" y2="50" stroke="#1D2B53" stroke-width="9" stroke-linecap="round"/></g>`;
    s+=`<g class="mh" transform="rotate(${am} 100 100)"><line x1="100" y1="114" x2="100" y2="22" stroke="#3D5AFE" stroke-width="5.5" stroke-linecap="round"/></g>`;
    s+=`<circle cx="100" cy="100" r="7" fill="#FFC93C" stroke="#1D2B53" stroke-width="2"/></svg>`;
    return s;
  }
  // ställ visarna på en klocka som redan finns
  function setHands(svg,T){const h=Math.floor(T/60),m=T%60;svg.querySelector('.hh').setAttribute('transform',`rotate(${((h%12)+m/60)*30} 100 100)`);svg.querySelector('.mh').setAttribute('transform',`rotate(${m*6} 100 100)`);}
  /* Tårtbiten: hur långt minutvisaren har gått från start till T. Ett helt varv = en timme (hela urtavlan blir svagt färgad).
     Returnerar antal minuter. */
  function setWedge(svg,start,T,mod){
    const g=svg.querySelector('.wedge');if(start==null){g.innerHTML='';return 0;}
    const el=((T-start)%(mod||720)+(mod||720))%(mod||720),laps=Math.floor(el/60),rest=el%60,a=(start%60)*6;
    g.innerHTML=(laps?`<circle cx="100" cy="100" r="93" fill="rgba(255,159,67,${Math.min(.5,.22*laps)})"/>`:'')+
      (rest?`<path d="${pie(93,a,a+rest*6)}" fill="rgba(255,159,67,.5)"/>`:'')+
      `<line x1="100" y1="100" x2="${P(93,a)[0]}" y2="${P(93,a)[1]}" stroke="#C96A0C" stroke-width="2.5" stroke-dasharray="4 3"/>`;
    return el;
  }

  /* ---------- Dra i visarna ----------
     o: {get:()=>T, set:T=>{}, step:()=>1|5, mod:720|1440, busy:()=>bool, onMove:()=>{}}
     Man tar den visare man trycker närmast. Minutvisaren drar timvisaren med sig. */
  function drag(svg,o){
    const mod=o.mod||720,hh=svg.querySelector('.hh'),mh=svg.querySelector('.mh');
    const vb=svg.viewBox.baseVal;
    const pt=e=>{const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*vb.width+vb.x,y=(e.clientY-r.top)/r.height*vb.height+vb.y;
      const dx=x-100,dy=y-100;return{a:(Math.atan2(dx,-dy)*180/Math.PI+360)%360,dx,dy};};
    const segDist=(p,ang,len)=>{const a=ang*Math.PI/180,ux=Math.sin(a),uy=-Math.cos(a),t=Math.max(0,Math.min(len,p.dx*ux+p.dy*uy));return Math.hypot(p.dx-ux*t,p.dy-uy*t);};
    const nearest=p=>{const T=o.get(),h=Math.floor(T/60),m=T%60;return segDist(p,((h%12)+m/60)*30,50)<=segDist(p,m*6,78)?'h':'m';};
    let hand=null;
    const moveTo=p=>{const T=o.get(),m=T%60,st=o.step?o.step():5;
      if(hand==='m'){const nm=Math.round(p.a/(6*st))*st%60;const d=((nm-m)%60+90)%60-30;o.set(((T+d)%mod+mod)%mod);}
      else{const h=Math.floor(T/60),nh=((Math.round((p.a-m/2)/30))%12+12)%12;let NT=(h-h%12+nh)*60+m;const d=((NT-T)%720+1080)%720-360;o.set(((T+d)%mod+mod)%mod);}
      o.onMove&&o.onMove();};
    svg.addEventListener('pointerdown',e=>{if(o.busy&&o.busy())return;const p=pt(e);hand=nearest(p);(hand==='h'?hh:mh).classList.add('grab');try{svg.setPointerCapture(e.pointerId);}catch(_){}moveTo(p);});
    svg.addEventListener('pointermove',e=>{if(hand)moveTo(pt(e));});
    const end=()=>{hand=null;hh.classList.remove('grab');mh.classList.remove('grab');};svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  }

  /* ---------- Tidsblock ----------
     blocks(host,{svg,start,end,base,fixed,showSum,onChange}) lägger knappar för 1 tim, 30, 15, 10, 5 och 1 minut,
     en tidslinje och ringbitar runt klockan (svg). Blocken läggs efter varandra från start. Tryck på ett block för att ta bort det. */
  const SIZES=[[60,'1 tim','#7B61FF'],[30,'30','#3D5AFE'],[15,'15','#17AFC4'],[10,'10','#2BB673'],[5,'5','#FF9F43'],[1,'1','#E5484D']];
  const COL=Object.fromEntries(SIZES.map(s=>[s[0],s[2]])),LAB=Object.fromEntries(SIZES.map(s=>[s[0],s[1]]));
  function blocks(host,o){
    let list=[],locked=false;const base=o.base||101,BW=12,MAX=179;
    host.innerHTML=`<div class="kb"><div class="kb-line"></div><div class="kb-sum" aria-live="polite"></div><div class="kb-pal">${SIZES.map(([v,l,c])=>`<button data-v="${v}" style="--c:${c}" aria-label="Lägg ett block på ${v===60?'en timme':v===1?'en minut':v+' minuter'}">${l}</button>`).join('')}</div></div>`;
    const line=host.querySelector('.kb-line'),sumEl=host.querySelector('.kb-sum');
    const sum=()=>list.reduce((a,b)=>a+b,0);
    function drawRing(){
      const g=o.svg&&o.svg.querySelector('.ring');if(!g)return;let s='',t=0;const st=o.start%60;
      list.forEach((v,i)=>{let a=t,b=t+v;t=b;
        while(a<b){const lap=Math.floor(a/60),e=Math.min(b,(lap+1)*60),r1=base+lap*(BW+2),r2=r1+BW;if(lap>2)break;
          s+=`<path d="${band(r1,r2,(st+a)*6,(st+e)*6)}" fill="${COL[v]}" stroke="#fff" stroke-width="1.2" data-i="${i}"/>`;
          if(e-a>=1&&a===t-v){const mid=(st+(a+Math.min(e,a+v))/2)*6,[x,y]=P((r1+r2)/2,mid);s+=`<text x="${x}" y="${y+3}" text-anchor="middle" font-size="${e-a>=2?8:6.5}" font-weight="800" fill="#fff" pointer-events="none">${v===60?'1t':v}</text>`;}
          a=e;}
      });
      g.innerHTML=s;
    }
    function drawLine(){
      const S=o.start,end=o.end!=null?o.end:null,top=Math.max(S+sum(),end||0,S+1);
      const T0=Math.floor(S/60)*60,T1=Math.min(T0+180,Math.max(T0+60,Math.ceil(top/60)*60)),W=600,pad=16,k=(W-2*pad)/(T1-T0),X=t=>pad+(t-T0)*k;
      let s=`<svg viewBox="0 0 ${W} 92" class="kb-svg" role="img" aria-label="Tidslinje">`;
      // block
      let t=S;list.forEach((v,i)=>{const x=X(t),w=Math.max(1,v*k);s+=`<g class="kb-b" data-i="${i}"><rect x="${x}" y="10" width="${w}" height="30" rx="3" fill="${COL[v]}" stroke="#fff" stroke-width="1.5"/>${w>=14?`<text x="${x+w/2}" y="31" text-anchor="middle" font-size="${w>=30?15:11}" font-weight="800" fill="#fff" pointer-events="none">${LAB[v]}</text>`:''}</g>`;t+=v;});
      // linjal
      s+=`<line x1="${pad}" y1="50" x2="${W-pad}" y2="50" stroke="#1D2B53" stroke-width="2"/>`;
      for(let m=T0;m<=T1;m++){const x=X(m),hr=m%60===0,f=m%5===0;s+=`<line x1="${x}" y1="${hr?42:f?44:47}" x2="${x}" y2="${hr?58:f?56:53}" stroke="#1D2B53" stroke-width="${hr?2.5:f?1.6:.8}"/>`;
        if(hr)s+=`<text x="${x}" y="76" text-anchor="middle" font-size="17" font-weight="800" fill="#1D2B53">${(Math.floor(m/60)%24)}</text>`;
        else if(f&&k*5>=18)s+=`<text x="${x}" y="72" text-anchor="middle" font-size="11" font-weight="700" fill="#56668F">${m%60}</text>`;}
      const flag=(tm,col,txt)=>{const x=X(tm);return`<line x1="${x}" y1="4" x2="${x}" y2="58" stroke="${col}" stroke-width="3"/><text x="${Math.min(W-30,Math.max(30,x))}" y="90" text-anchor="middle" font-size="12" font-weight="800" fill="${col}">${txt}</text>`;};
      s+=flag(S,'#157548','Start '+dig(Math.floor(S/60)%24,S%60));
      if(end!=null)s+=flag(end,'#E5484D','Slut '+dig(Math.floor(end/60)%24,end%60));
      line.innerHTML=s+'</svg>';
      line.querySelectorAll('.kb-b').forEach(b=>b.onclick=()=>{if(!locked){list.splice(+b.dataset.i,1);change();}});
    }
    function change(){drawRing();drawLine();
      const n=sum();sumEl.innerHTML=list.length?list.map(v=>v===60?'1 tim':v).join(' + ')+(o.showSum?` = <b>${short(n)}</b>`:''):'<span class="kb-empty">Tryck på ett block för att lägga det på tidslinjen.</span>';
      o.onChange&&o.onChange(list.slice(),n);}
    host.querySelector('.kb-pal').onclick=e=>{const b=e.target.closest('[data-v]');if(!b||locked)return;const v=+b.dataset.v;if(sum()+v>MAX)return;list.push(v);window.Ljud&&Ljud.pop&&Ljud.pop(Math.min(6,list.length));change();};
    if(o.svg)o.svg.querySelector('.ring').addEventListener('click',e=>{const p=e.target.closest('[data-i]');if(p&&!locked){list.splice(+p.dataset.i,1);change();}});
    change();
    return{get list(){return list.slice();},get sum(){return sum();},clear(){list=[];change();},lock(){locked=true;host.querySelector('.kb').classList.add('locked');},
      setStart(s){o.start=s;change();},setEnd(e){o.end=e;change();},redraw:change};
  }
  // stilen, en gång per sida
  if(!document.getElementById('kb-css')){const st=document.createElement('style');st.id='kb-css';st.textContent=`
.kb{margin-top:6px}
.kb-svg{width:100%;height:auto;display:block;background:#fff;border-radius:14px;box-shadow:inset 0 0 0 2px #C6D6F2}
.kb-b{cursor:pointer}
.kb-sum{min-height:1.6em;font-weight:800;font-size:1.25rem;margin:6px 0;text-align:center;color:#1D2B53}
.kb-empty{font-weight:700;font-size:.95rem;color:#56668F}
.kb-pal{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
.kb-pal button{background:var(--c);color:#fff;border:0;border-radius:12px;min-height:48px;font:inherit;font-weight:800;font-size:1.1rem;box-shadow:0 3px 0 rgba(29,43,83,.35);cursor:pointer}
.kb-pal button:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(29,43,83,.35)}
.kb.locked .kb-pal{opacity:.4;pointer-events:none}
.clock .ring path{cursor:pointer}`;document.head.appendChild(st);}
  window.MPKlocka={HN,hn,two,dig,cap,phrase,fmtDur,short,clockSVG,setHands,setWedge,drag,blocks,SIZES};
})();
