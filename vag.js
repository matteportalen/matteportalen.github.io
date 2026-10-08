/* Balansvågen (MPVag): ritas i SVG och används av Vågen (vagen/) och Gömda tal (gomda/).
   En vågskål är en lista med klossgrupper:
     {t:"n", n, c, rods, ghost, tag}  n klossar i färgen c: små tal i staplar om fem, tiotal som stavar (rods),
                                       ghost = så många av de sista som är streckade (subtraktion), tag = emoji ovanför
     {t:"m", a, b, c}                  a grupper med b klossar (multiplikation)
     {t:"q"}                           streckad ruta med ?
     {t:"s", e, c}                     en gömd sak: ruta med emoji, kanten i färgen c */
(function(){
  const COLS=["#3D8BFD","#FF9F43","#7B61FF","#17AFC4"];
  const PX=220,PY=176,ARM=113,FONT='font-family="Baloo 2, Trebuchet MS, sans-serif"';
  function prep(cl){cl.forEach(c=>{if(c.w!=null)return;
    if(c.t==="n"){const n=Math.max(0,Math.min(c.n,150));c.n=n;
      if(c.rods){c.r=Math.floor(n/10);c.u=n%10;c.w=c.r+Math.ceil(c.u/5);c.h=c.r?10:Math.min(5,c.u);}
      else{c.w=Math.ceil(n/5);c.h=Math.min(5,n);}
      if(!c.w){c.w=.4;c.h=0;}
      if(c.tag)c.w=Math.max(c.w,1.6);}
    else if(c.t==="m"){c.a=Math.min(c.a,12);c.b=Math.min(c.b,12);c.w=c.a+(c.a-1)*.3;c.h=c.b;}
    else if(c.t==="s"){c.w=2.4;c.h=2.4;}
    else{c.w=3;c.h=3;}});return cl;}
  const panW=cl=>prep(cl).reduce((s,c)=>s+c.w,0)+Math.max(0,cl.length-1)*.7;
  const panH=cl=>Math.max(1,...prep(cl).map(c=>c.h+(c.ghost||c.tag?1.6:0)));
  function cube(x,y,u,col,ghost){const s=u-1.4,r=Math.max(1.5,u*.18);
    return ghost?`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${r}" fill="#fff" fill-opacity=".6" stroke="${col}" stroke-width="1.3" stroke-dasharray="2.5 2"/>`
               :`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${r}" fill="${col}"/><rect x="${x+1.2}" y="${y+1.2}" width="${s-2.4}" height="${s*.32}" rx="${r*.6}" fill="#fff" opacity=".28"/>`;}
  function drawPan(cl,u){let x=-panW(cl)*u/2,h="";
    cl.forEach(c=>{
      if(c.t==="n"){let col=0;const units=c.rods?c.u:c.n,cw=(c.rods?c.r:0)+Math.ceil(units/5),x0=x+(c.w-cw)*u/2;
        if(c.rods)for(let i=0;i<c.r;i++){const rx=x0+col*u,s=u-1.4;h+=`<rect x="${rx}" y="${-10*u}" width="${s}" height="${10*u-1.4}" rx="${Math.max(1.5,u*.18)}" fill="${c.c}"/>`;
          for(let j=1;j<10;j++)h+=`<line x1="${rx+1}" x2="${rx+s-1}" y1="${-j*u-.7}" y2="${-j*u-.7}" stroke="#000" stroke-opacity=".18" stroke-width="1"/>`;
          h+=`<rect x="${rx+1.2}" y="${-10*u+1.2}" width="${s*.3}" height="${10*u-4}" rx="1" fill="#fff" opacity=".25"/>`;col++;}
        for(let i=0;i<units;i++){const cc=col+Math.floor(i/5),rr=i%5,g=c.ghost&&i>=units-c.ghost;h+=cube(x0+cc*u,-(rr+1)*u,u,c.c,g);}
        if(c.ghost)h+=`<text x="${x+c.w*u/2}" y="${-c.h*u-5}" text-anchor="middle" font-size="${Math.max(11,u*1.1)}" font-weight="800" fill="#B8323A" ${FONT}>−${c.ghost}</text>`;
        if(c.tag)h+=`<text x="${x+c.w*u/2}" y="${-c.h*u-4}" text-anchor="middle" font-size="${Math.max(12,u*1.3)}">${c.tag}</text>`;}
      else if(c.t==="m"){for(let a=0;a<c.a;a++){const gx=x+a*1.3*u;for(let b=0;b<c.b;b++)h+=cube(gx,-(b+1)*u,u,c.c);}}
      else if(c.t==="s"){const s=c.w*u-2,y=-c.h*u;h+=`<rect x="${x+1}" y="${y+1}" width="${s-2}" height="${s-2}" rx="${u*.45}" fill="#fff" stroke="${c.c}" stroke-width="2.4"/><text x="${x+s/2}" y="${y+s*.72}" text-anchor="middle" font-size="${u*1.55}">${c.e}</text>`;}
      else{const s=3*u-2,y=-3*u;h+=`<rect x="${x+1}" y="${y+1}" width="${s-2}" height="${s-2}" rx="${u*.5}" fill="#EEF2FF" stroke="#3D5AFE" stroke-width="2" stroke-dasharray="5 4"/><text x="${x+s/2}" y="${y+s*.7}" text-anchor="middle" font-size="${u*2}" font-weight="800" fill="#3D5AFE" ${FONT}>?</text>`;}
      x+=(c.w+.7)*u;});
    return h;}
  // klossarnas storlek: samma för alla vågskålar som skickas in, så att storleken inte hoppar när ett svar visas
  const fitU=pans=>Math.min(13,...pans.map(c=>Math.min(170/Math.max(panW(c),1),122/panH(c))));
  // toppen av bilden beskärs efter de högsta klossarna, så att det inte blir tomt ovanför små tal
  const fitTop=(pans,u)=>Math.max(-18,Math.min(PY-80,PY-19-22-Math.max(...pans.map(panH))*u-18));
  function fit(pans){const u=fitU(pans);return{u,top:fitTop(pans,u)};}
  function svg(L,R,o){o=o||{};const th=o.th||0,f=o.u==null?fit([L,R]):o,u=f.u,top=f.top;
    const rad=th*Math.PI/180,dx=ARM*Math.cos(rad),dy=ARM*Math.sin(rad);
    const pan=(ex,ey,cl)=>`<g transform="translate(${ex.toFixed(2)} ${ey.toFixed(2)})"><line x1="0" y1="0" x2="0" y2="-12" stroke="#56668F" stroke-width="4" stroke-linecap="round"/><rect x="-94" y="-19" width="188" height="8" rx="4" fill="#C9A26B"/><rect x="-94" y="-19" width="188" height="3" rx="1.5" fill="#E2C391"/><g transform="translate(0 -19)">${drawPan(cl,u)}</g></g>`;
    return `<svg viewBox="0 ${top.toFixed(1)} 440 ${(248-top).toFixed(1)}" role="img" aria-label="En balansvåg">
    <ellipse cx="${PX}" cy="243" rx="80" ry="6" fill="#1D2B53" opacity=".08"/>
    <path d="M${PX} ${PY} L${PX-26} 238 L${PX+26} 238 Z" fill="#7B8AB0"/><rect x="${PX-48}" y="234" width="96" height="9" rx="4.5" fill="#56668F"/>
    <g transform="rotate(${th.toFixed(2)} ${PX} ${PY})"><rect x="${PX-ARM-6}" y="${PY-4.5}" width="${2*ARM+12}" height="9" rx="4.5" fill="#56668F"/><rect x="${PX-ARM-6}" y="${PY-4.5}" width="${2*ARM+12}" height="3" rx="1.5" fill="#8E9BBE"/></g>
    <circle cx="${PX}" cy="${PY}" r="7" fill="#F2B707" stroke="#1D2B53" stroke-width="2"/>
    ${pan(PX-dx,PY-dy,L)}${pan(PX+dx,PY+dy,R)}
    ${o.lock?`<text x="${PX}" y="${PY-16}" text-anchor="middle" font-size="22">🔒</text>`:""}</svg>`;}
  // lutning i grader: den tyngre sidan går ner
  const tilt=(l,r)=>l===r?0:Math.sign(r-l)*Math.min(11,4+Math.abs(r-l)*.7);
  // fjädern: vågen gungar lite innan den stannar; draw(th) anropas för varje bild
  function spring(draw){const S={th:0,v:0,t:0,raf:0};
    const reduced=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
    function step(){S.v+=(S.t-S.th)*.045;S.v*=.86;S.th+=S.v;
      if(Math.abs(S.v)<.004&&Math.abs(S.t-S.th)<.01){S.th=S.t;S.v=0;S.raf=0;draw(S.th);return;}
      draw(S.th);S.raf=requestAnimationFrame(step);}
    S.to=t=>{S.t=t;if(reduced()){S.th=t;S.v=0;draw(t);return;}if(!S.raf)S.raf=requestAnimationFrame(step);};
    S.reset=()=>{S.th=S.v=S.t=0;};
    return S;}
  window.MPVag={COLS,svg,fit,tilt,spring};
})();
