/* Träklossarna (tiobasmaterial) med spår som skolans, ritade i SVG.
   Används av Tiobas (verktyg) och Dela upp och dela. Inga kopior i sidorna.
   MPKlossar.e  ental 1×1, .t  tiostav 1×10 (stående), .h  hundraplatta, .th  tusenkub */
window.MPKlossar=(()=>{
const W="#EBCB94",WD="#B98A4E",GR="#C9A066",HL="#F6DFB4";
const grain=(w,h)=>`<path d="M${w*.15} ${h*.2} q${w*.2} ${h*.06} ${w*.4} 0 t${w*.4} 0 M${w*.1} ${h*.62} q${w*.25} ${-h*.05} ${w*.5} 0 t${w*.35} 0" fill="none" stroke="${GR}" stroke-width="${Math.min(w,h)*.02+.15}" opacity=".45"/>`;
return{
  e:`<svg viewBox="0 0 10 10" aria-hidden="true"><rect x=".4" y=".4" width="9.2" height="9.2" rx="1.2" fill="${W}" stroke="${WD}" stroke-width=".8"/><path d="M1.6 7.8 V1.6 H7.8" stroke="${HL}" stroke-width=".9" fill="none" stroke-linecap="round"/></svg>`,
  t:`<svg viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true"><rect x=".4" y=".4" width="9.2" height="99.2" rx="1.2" fill="${W}" stroke="${WD}" stroke-width=".8"/>${grain(10,100)}${Array.from({length:9},(_,i)=>`<line x1=".4" y1="${(i+1)*10}" x2="9.6" y2="${(i+1)*10}" stroke="${WD}" stroke-width=".7"/>`).join("")}<path d="M1.6 98 V1.6" stroke="${HL}" stroke-width=".9" stroke-linecap="round"/></svg>`,
  h:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect x=".6" y=".6" width="98.8" height="98.8" rx="2" fill="${W}" stroke="${WD}" stroke-width="1.2"/>${grain(100,100)}${Array.from({length:9},(_,i)=>`<line x1="${(i+1)*10}" y1=".6" x2="${(i+1)*10}" y2="99.4" stroke="${WD}" stroke-width=".7"/><line x1=".6" y1="${(i+1)*10}" x2="99.4" y2="${(i+1)*10}" stroke="${WD}" stroke-width=".7"/>`).join("")}<path d="M2.5 97 V2.5 H97" stroke="${HL}" stroke-width="1.2" fill="none"/></svg>`,
  th:(()=>{ /* tusenkuben snett framifrån: framsida, ovansida och höger sida, med spår */
    const s=80,d=24,F=`M0 ${d} h${s} v${s} h${-s}Z`,T=`M0 ${d} l${d} ${-d} h${s} l${-d} ${d}Z`,R=`M${s} ${d} l${d} ${-d} v${s} l${-d} ${d}Z`;let g="";
    for(let i=1;i<10;i++){const k=i*s/10,m=i*d/10;
      g+=`<line x1="${k}" y1="${d}" x2="${k}" y2="${d+s}"/><line x1="0" y1="${d+k}" x2="${s}" y2="${d+k}"/>`+
         `<line x1="${k}" y1="${d}" x2="${k+d}" y2="0"/><line x1="${m}" y1="${d-m}" x2="${m+s}" y2="${d-m}"/>`+
         `<line x1="${s}" y1="${d+k}" x2="${s+d}" y2="${k}"/><line x1="${s+m}" y1="${d-m}" x2="${s+m}" y2="${d-m+s}"/>`;}
    return`<svg viewBox="-1 -1 ${s+d+2} ${s+d+2}" aria-hidden="true"><path d="${F}" fill="${W}"/><path d="${T}" fill="#F3DAA9"/><path d="${R}" fill="#D9B377"/><g stroke="${WD}" stroke-width=".7">${g}</g><path d="${F} ${T} ${R}" fill="none" stroke="${WD}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;})()
};
})();
