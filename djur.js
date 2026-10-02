/* Matte-Portalen: elevens djur från Garderoben.
   Delas av startsidan, Spelhörnan, Geometri och Bråk. Ändras ett djur eller en klädsel räcker det att ändra här.
   WARD = allt som finns i Garderoben (need = antal stjärnor som krävs), owlSVG = ritar djuret med kläderna. */
const WARD={
  animal:{name:"Djur",items:[
    {id:"uggla",name:"Uggla",need:0},{id:"katt",name:"Katt",need:0},{id:"kanin",name:"Kanin",need:0},
    {id:"rav",name:"Räv",need:5},{id:"panda",name:"Panda",need:10},{id:"pingvin",name:"Pingvin",need:15},
    {id:"robot",name:"Robot",need:25},{id:"drake",name:"Drake",need:40},{id:"enhorning",name:"Enhörning",need:55}]},
  color:{name:"Färg",items:[
    {id:"natur",name:"Naturlig",need:0},
    {id:"lila",name:"Lila",need:0,c:["#8A6BC6","#6B4E9B"]},{id:"bla",name:"Blå",need:2,c:["#4F8DF5","#2F63C9"]},
    {id:"gron",name:"Grön",need:6,c:["#3FBF7F","#258A58"]},{id:"rosa",name:"Rosa",need:12,c:["#FF7EB6","#D94F8E"]},
    {id:"orange",name:"Orange",need:20,c:["#FFA24C","#D9772A"]},{id:"rymd",name:"Rymd",need:35,c:["#2B3A67","#141D3D"]},
    {id:"guld",name:"Guld",need:60,c:["#F2C230","#C99A0A"]}]},
  glasses:{name:"Glasögon",items:[
    {id:"runda",name:"Runda",need:0},{id:"inga",name:"Inga",need:0},{id:"stjarn",name:"Stjärnor",need:8},
    {id:"sol",name:"Solglasögon",need:15},{id:"hjarta",name:"Hjärtan",need:40}]},
  hat:{name:"Hatt",items:[
    {id:"ingen",name:"Ingen",need:0},{id:"keps",name:"Keps",need:3},{id:"mossa",name:"Mössa",need:10},
    {id:"party",name:"Partyhatt",need:16},{id:"troll",name:"Trollkarl",need:28},{id:"krona",name:"Krona",need:50}]},
  neck:{name:"Halsband",items:[
    {id:"ingen",name:"Inget",need:0},{id:"rosett",name:"Rosett",need:4},{id:"halsduk",name:"Halsduk",need:14},{id:"medalj",name:"Medalj",need:24}]}
};
/* Djurens egna färger när man väljer "Naturlig" */
const NATUR={uggla:["#8A6BC6","#6B4E9B"],katt:["#F4A259","#C9772E"],kanin:["#D9D2E9","#A99CC9"],rav:["#FF7A3D","#C4531F"],panda:["#FFFFFF","#2B2B3A"],
  pingvin:["#2B3A67","#141D3D"],robot:["#AEB9CC","#6B7894"],drake:["#3FBF7F","#258A58"],enhorning:["#FFFFFF","#E0D8F5"]};
const itemOf=(slot,id)=>WARD[slot].items.find(x=>x.id===id)||WARD[slot].items[0];
function owlSVG(cfg,cls,standalone){
  const an=cfg.animal||"uggla",ci=itemOf("color",cfg.color),[c1,c2]=ci.c||NATUR[an]||NATUR.uggla,dark=["rymd"].includes(cfg.color)||(ci.id==="natur"&&an==="pingvin");
  const L=`stroke="#1D2B53" stroke-width="2" stroke-linejoin="round"`;
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -20 120 140"${standalone?' width="240" height="280"':` class="owl ${cls||""}" role="img" aria-label="Avatar"`}>`;
  s+=`<ellipse cx="60" cy="112" rx="34" ry="5" fill="rgba(0,0,0,.18)"/>`;
  // bakom kroppen: svansar och vingar
  if(an==="katt")s+=`<path d="M92 92 Q116 88 108 58 Q104 50 100 58 Q106 80 88 84Z" fill="${c1}"/><path d="M106 60 L102 68 M104 70 L98 74" stroke="${c2}" stroke-width="3"/>`;
  if(an==="rav")s+=`<path d="M90 96 Q122 96 114 60 Q98 70 88 86Z" fill="${c1}"/><path d="M114 60 Q116 70 108 76 Q104 68 114 60Z" fill="#fff"/>`;
  if(an==="drake")s+=`<path d="M26 64 L4 44 L12 70 L0 72 L22 82Z" fill="${c2}"/><path d="M94 64 L116 44 L108 70 L120 72 L98 82Z" fill="${c2}"/><path d="M90 98 Q116 104 112 84 L118 80 L108 78 Q106 94 88 90Z" fill="${c1}"/>`;
  if(an==="enhorning")s+=`<path d="M86 94 Q118 104 110 78 Q100 90 88 86Z" fill="#FF7EB6"/><path d="M88 90 Q112 96 108 84" stroke="#7B61FF" stroke-width="4" fill="none"/>`;
  // öron
  if(an==="uggla")s+=`<path d="M24 44 L30 16 L46 34 Z" fill="${c2}"/><path d="M96 44 L90 16 L74 34 Z" fill="${c2}"/>`;
  if(an==="katt")s+=`<path d="M24 46 L28 12 L52 32Z" fill="${c1}"/><path d="M30 38 L31 20 L44 32Z" fill="#FFB3C7"/><path d="M96 46 L92 12 L68 32Z" fill="${c1}"/><path d="M90 38 L89 20 L76 32Z" fill="#FFB3C7"/>`;
  if(an==="rav")s+=`<path d="M22 50 L26 6 L54 30Z" fill="${c1}"/><path d="M26 10 L25 22 L34 16Z" fill="#1D2B53"/><path d="M98 50 L94 6 L66 30Z" fill="${c1}"/><path d="M94 10 L95 22 L86 16Z" fill="#1D2B53"/>`;
  if(an==="kanin")s+=`<ellipse cx="44" cy="4" rx="10" ry="28" fill="${c1}" transform="rotate(-10 44 30)"/><ellipse cx="44" cy="6" rx="5" ry="20" fill="#FFB3C7" transform="rotate(-10 44 30)"/><ellipse cx="76" cy="4" rx="10" ry="28" fill="${c1}" transform="rotate(10 76 30)"/><ellipse cx="76" cy="6" rx="5" ry="20" fill="#FFB3C7" transform="rotate(10 76 30)"/>`;
  if(an==="panda")s+=`<circle cx="30" cy="32" r="12" fill="${c2}"/><circle cx="90" cy="32" r="12" fill="${c2}"/>`;
  if(an==="robot")s+=`<line x1="60" y1="26" x2="60" y2="6" stroke="#56668F" stroke-width="3"/><circle cx="60" cy="5" r="5" fill="#FF6B6B"/><rect x="14" y="50" width="10" height="22" rx="3" fill="${c2}"/><rect x="96" y="50" width="10" height="22" rx="3" fill="${c2}"/>`;
  if(an==="drake")s+=`<path d="M40 30 L34 8 L48 26Z" fill="#FFC93C"/><path d="M80 30 L86 8 L72 26Z" fill="#FFC93C"/>`;
  if(an==="enhorning")s+=`<path d="M30 40 L32 18 L46 32Z" fill="${c1}" ${L}/><path d="M90 40 L88 18 L74 32Z" fill="${c1}" ${L}/>`;
  if(an==="pingvin")s+=``;
  // kroppen
  const bodyStroke=an==="panda"||an==="enhorning"?` stroke="#D5DDEC" stroke-width="2"`:"";
  if(an==="robot")s+=`<rect x="22" y="28" width="76" height="80" rx="18" fill="${c1}"${bodyStroke}/>`;
  else s+=`<ellipse cx="60" cy="68" rx="40" ry="42" fill="${c1}"${bodyStroke}/>`;
  // mage
  if(an==="uggla")s+=`<ellipse cx="60" cy="80" rx="26" ry="28" fill="${dark?"#DDE3F5":"#F3E8FF"}"/><path d="M44 74q4 4 8 0M56 82q4 4 8 0M68 74q4 4 8 0M50 92q4 4 8 0M62 92q4 4 8 0" stroke="rgba(0,0,0,.14)" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  else if(an==="pingvin")s+=`<ellipse cx="60" cy="78" rx="28" ry="32" fill="#fff"/>`;
  else if(an==="robot")s+=`<rect x="38" y="78" width="44" height="22" rx="5" fill="#E8EDF7"/><circle cx="48" cy="89" r="3.5" fill="#FF6B6B"/><circle cx="60" cy="89" r="3.5" fill="#FFC93C"/><circle cx="72" cy="89" r="3.5" fill="#2BB673"/>`;
  else if(an==="drake")s+=`<ellipse cx="60" cy="82" rx="24" ry="26" fill="#FFE58A"/><path d="M40 76H80M38 86H82M42 96H78" stroke="rgba(0,0,0,.14)" stroke-width="2.5"/>`;
  else if(an==="panda")s+=`<ellipse cx="60" cy="84" rx="24" ry="24" fill="#F3F5FA"/>`;
  else s+=`<ellipse cx="60" cy="84" rx="24" ry="24" fill="rgba(255,255,255,.75)"/>`;
  if(an==="katt")s+=`<path d="M52 30 L54 40 M60 28 L60 40 M68 30 L66 40" stroke="${c2}" stroke-width="3" stroke-linecap="round"/>`;
  if(an==="drake")s+=`<path d="M46 28 L50 18 L54 28 M56 26 L60 14 L64 26 M66 28 L70 18 L74 28" fill="${c2}"/>`;
  if(an==="enhorning")s+=`<path d="M78 30 Q98 36 98 60 Q92 48 84 46 Q96 66 90 82 Q86 64 78 58Z" fill="#FF7EB6"/><path d="M80 34 Q94 40 94 56" stroke="#FFC93C" stroke-width="4" fill="none"/><path d="M82 44 Q90 52 88 70" stroke="#7B61FF" stroke-width="4" fill="none"/>`;
  // armar, vingar, fötter
  if(an==="uggla")s+=`<path d="M22 72q-10 10 -2 24q8-6 10-16z" fill="${c2}"/><path d="M98 72q10 10 2 24q-8-6-10-16z" fill="${c2}"/>`;
  if(an==="pingvin")s+=`<path d="M22 66 Q8 84 20 98 Q24 84 30 76Z" fill="${c2}"/><path d="M98 66 Q112 84 100 98 Q96 84 90 76Z" fill="${c2}"/>`;
  if(an==="panda")s+=`<ellipse cx="24" cy="80" rx="9" ry="16" fill="${c2}" transform="rotate(20 24 80)"/><ellipse cx="96" cy="80" rx="9" ry="16" fill="${c2}" transform="rotate(-20 96 80)"/>`;
  const foot=an==="uggla"||an==="pingvin"?"#FF9F43":an==="panda"?c2:an==="robot"?"#56668F":c2;
  if(an==="uggla"||an==="pingvin")s+=`<path d="M46 108h8M66 108h8" stroke="${foot}" stroke-width="5" stroke-linecap="round"/>`;
  else s+=`<ellipse cx="46" cy="107" rx="10" ry="6" fill="${foot}"/><ellipse cx="74" cy="107" rx="10" ry="6" fill="${foot}"/>`;
  // ögonplättar
  if(an==="panda")s+=`<ellipse cx="42" cy="52" rx="14" ry="17" fill="${c2}" transform="rotate(-20 42 52)"/><ellipse cx="78" cy="52" rx="14" ry="17" fill="${c2}" transform="rotate(20 78 52)"/>`;
  if(an==="rav")s+=`<path d="M22 60 Q40 74 56 62 Q48 82 26 70Z" fill="#fff"/><path d="M98 60 Q80 74 64 62 Q72 82 94 70Z" fill="#fff"/>`;
  // ögon (samma plats för alla, så att glasögonen passar)
  if(cfg.glasses==="sol"){
    s+=`<rect x="24" y="38" width="34" height="24" rx="10" fill="#1D2B53"/><rect x="62" y="38" width="34" height="24" rx="10" fill="#1D2B53"/><path d="M56 46h8" stroke="#1D2B53" stroke-width="4"/><path d="M30 44l8-4M68 44l8-4" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round"/>`;
  }else{
    const r=an==="uggla"?16:an==="robot"?13:12;
    if(an==="robot")s+=`<rect x="${42-r}" y="${50-r}" width="${2*r}" height="${2*r}" rx="5" fill="#1D2B53"/><rect x="${78-r}" y="${50-r}" width="${2*r}" height="${2*r}" rx="5" fill="#1D2B53"/><circle cx="42" cy="50" r="6" fill="#7CF0B1"/><circle cx="78" cy="50" r="6" fill="#7CF0B1"/>`;
    else s+=`<circle cx="42" cy="50" r="${r}" fill="#fff"/><circle cx="78" cy="50" r="${r}" fill="#fff"/><circle cx="45" cy="52" r="7" fill="#1D2B53"/><circle cx="75" cy="52" r="7" fill="#1D2B53"/><circle cx="47.5" cy="49.5" r="2.4" fill="#fff"/><circle cx="77.5" cy="49.5" r="2.4" fill="#fff"/>`;
    if(cfg.glasses==="runda")s+=`<circle cx="42" cy="50" r="17" fill="none" stroke="#FFC93C" stroke-width="4"/><circle cx="78" cy="50" r="17" fill="none" stroke="#FFC93C" stroke-width="4"/><line x1="59" y1="50" x2="61" y2="50" stroke="#FFC93C" stroke-width="4"/>`;
    if(cfg.glasses==="stjarn"){const star=(cx,cy)=>{let p=[];for(let i=0;i<10;i++){const rr=i%2?11:22,a=-Math.PI/2+i*Math.PI/5;p.push((cx+rr*Math.cos(a)).toFixed(1)+","+(cy+rr*Math.sin(a)).toFixed(1))}return`<polygon points="${p.join(" ")}" fill="none" stroke="#FF5FA2" stroke-width="3.5" stroke-linejoin="round"/>`};s+=star(42,51)+star(78,51)}
    if(cfg.glasses==="hjarta"){const heart=cx=>`<path d="M${cx} 66 C${cx-26} 50 ${cx-18} 30 ${cx} 42 C${cx+18} 30 ${cx+26} 50 ${cx} 66Z" fill="none" stroke="#E5484D" stroke-width="3.5"/>`;s+=heart(42)+heart(78)}
  }
  // näbb, nos och mun
  if(an==="uggla"||an==="pingvin")s+=`<path d="M55 62 L65 62 L60 71 Z" fill="#FF9F43"/>`;
  else if(an==="katt"||an==="kanin")s+=`<path d="M56 63 L64 63 L60 68Z" fill="#FF7EB6"/><path d="M60 68 Q56 73 52 70 M60 68 Q64 73 68 70" stroke="#1D2B53" stroke-width="2" fill="none" stroke-linecap="round"/>`+(an==="katt"?`<path d="M30 64 L48 66 M30 70 L48 69 M90 64 L72 66 M90 70 L72 69" stroke="#1D2B53" stroke-width="1.5"/>`:`<rect x="56.5" y="70" width="3" height="5" fill="#fff" stroke="#1D2B53" stroke-width="1"/><rect x="60.5" y="70" width="3" height="5" fill="#fff" stroke="#1D2B53" stroke-width="1"/>`);
  else if(an==="rav")s+=`<ellipse cx="60" cy="66" rx="5" ry="4" fill="#1D2B53"/><path d="M60 70 Q56 75 52 72 M60 70 Q64 75 68 72" stroke="#1D2B53" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else if(an==="panda")s+=`<ellipse cx="60" cy="65" rx="5" ry="3.5" fill="#1D2B53"/><path d="M60 68 Q56 73 52 70 M60 68 Q64 73 68 70" stroke="#1D2B53" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else if(an==="robot")s+=`<rect x="48" y="66" width="24" height="7" rx="2" fill="#1D2B53"/><path d="M54 66V73M60 66V73M66 66V73" stroke="#7CF0B1" stroke-width="1.5"/>`;
  else if(an==="drake")s+=`<ellipse cx="60" cy="67" rx="12" ry="7" fill="${c2}"/><circle cx="56" cy="66" r="1.8" fill="#1D2B53"/><circle cx="64" cy="66" r="1.8" fill="#1D2B53"/>`;
  else if(an==="enhorning")s+=`<ellipse cx="60" cy="68" rx="13" ry="8" fill="#FFD6E7"/><circle cx="56" cy="67" r="1.8" fill="#1D2B53"/><circle cx="64" cy="67" r="1.8" fill="#1D2B53"/><path d="M60 26 L54 6 L66 6Z" fill="#FFC93C" ${L}/><path d="M55 12H65M56 18H64" stroke="#C99A0A" stroke-width="1.5"/>`;
  // halsband
  if(cfg.neck==="rosett")s+=`<path d="M60 80 L46 72 L46 88 Z M60 80 L74 72 L74 88 Z" fill="#E5484D"/><circle cx="60" cy="80" r="4.5" fill="#B8323A"/>`;
  if(cfg.neck==="halsduk")s+=`<path d="M26 74 Q60 90 94 74 L94 83 Q60 99 26 83 Z" fill="#3D8BFD"/><path d="M70 86 L78 110 L88 106 L80 84 Z" fill="#3D8BFD"/><path d="M36 80 Q60 93 84 80" stroke="#fff" stroke-width="2.5" fill="none" stroke-dasharray="4 5"/>`;
  if(cfg.neck==="medalj")s+=`<path d="M46 72 L60 92 L74 72" stroke="#3D5AFE" stroke-width="6" fill="none"/><circle cx="60" cy="96" r="9" fill="#F2C230" stroke="#C99A0A" stroke-width="2"/><path d="M60 90l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z" fill="#fff"/>`;
  // hatt
  if(cfg.hat==="keps")s+=`<path d="M34 32 Q60 0 86 32 Z" fill="#E5484D"/><path d="M58 30 Q86 25 104 32 Q88 38 58 34 Z" fill="#B8323A"/><circle cx="60" cy="13" r="3" fill="#B8323A"/>`;
  if(cfg.hat==="mossa")s+=`<path d="M33 34 Q60 -6 87 34 Z" fill="#2BB673"/><rect x="31" y="27" width="58" height="10" rx="5" fill="#1E9E5E"/><circle cx="60" cy="12" r="8" fill="#fff"/>`;
  if(cfg.hat==="party")s+=`<path d="M44 32 L60 -14 L76 32 Z" fill="#FFC93C"/><path d="M50 16 L70 16 M47 25 L73 25 M54 5 L66 5" stroke="#FF5FA2" stroke-width="3.5"/><circle cx="60" cy="-16" r="5" fill="#FF5FA2"/>`;
  if(cfg.hat==="troll")s+=`<path d="M40 30 L66 -18 L80 30 Z" fill="#3D5AFE"/><ellipse cx="60" cy="31" rx="32" ry="6" fill="#2A44C9"/><path d="M58 6l1.5 3 3.3.4-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.4z M68 18l1.2 2.4 2.6.3-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.3z" fill="#FFC93C"/>`;
  /* kockmössa: bara för Bageriet i Multiplikation, går inte att välja i Garderoben */
  if(cfg.hat==="kock")s+=`<rect x="34" y="22" width="52" height="13" rx="3" fill="#fff" stroke="#C6D6F2" stroke-width="2"/><circle cx="42" cy="12" r="12" fill="#fff" stroke="#C6D6F2" stroke-width="2"/><circle cx="78" cy="12" r="12" fill="#fff" stroke="#C6D6F2" stroke-width="2"/><circle cx="60" cy="4" r="15" fill="#fff" stroke="#C6D6F2" stroke-width="2"/><rect x="36" y="14" width="48" height="12" fill="#fff"/><path d="M48 24 V31 M60 24 V31 M72 24 V31" stroke="#E6ECF7" stroke-width="2"/>`;
  /* konduktörsmössa: bara för Stationen i Klockan, går inte att välja i Garderoben */
  if(cfg.hat==="konduktor")s+=`<path d="M36 31 L37 13 Q60 5 83 13 L84 31 Z" fill="#1D2B53"/><rect x="36" y="24" width="48" height="6" fill="#F2B707"/><path d="M30 31 Q60 26 90 31 Q88 39 60 37 Q32 39 30 31 Z" fill="#0E1735"/><circle cx="60" cy="17" r="5" fill="#F2B707" stroke="#C99A0A" stroke-width="1.5"/>`;
  /* bygghjälm: bara för kranföraren i Tornbygget, går inte att välja i Garderoben */
  if(cfg.hat==="bygg")s+=`<path d="M37 31 Q37 7 60 7 Q83 7 83 31 Z" fill="#FFC93C"/><rect x="31" y="27" width="58" height="7" rx="3.5" fill="#F2B707"/><rect x="56.5" y="7" width="7" height="22" rx="3.5" fill="#FFE07A"/><path d="M45 12 Q41 20 41 29 M75 12 Q79 20 79 29" stroke="#E0A800" stroke-width="2" fill="none"/>`;
  if(cfg.hat==="krona")s+=`<path d="M38 33 L38 12 L49 22 L60 4 L71 22 L82 12 L82 33 Z" fill="#F2C230" stroke="#C99A0A" stroke-width="2.5" stroke-linejoin="round"/><circle cx="60" cy="26" r="4" fill="#E5484D"/><circle cx="47" cy="27" r="3" fill="#3D8BFD"/><circle cx="73" cy="27" r="3" fill="#2BB673"/>`;
  return s+"</svg>";
}

/* Djuret i bestämd form, för texter som "Kaninens egen skylt" */
const PETNAME={uggla:"Ugglan",katt:"Katten",kanin:"Kaninen",rav:"Räven",panda:"Pandan",pingvin:"Pingvinen",robot:"Roboten",drake:"Draken",enhorning:"Enhörningen"};
/* Läser elevens djur. Saknas det eller är datan trasig blir det ugglan. */
function lasDjur(){
  const std={animal:"uggla",color:"lila",glasses:"runda",hat:"ingen",neck:"ingen"};
  try{return Object.assign(std,JSON.parse(localStorage.getItem("matteportalen-uggla")||"{}")||{});}catch(e){return std;}
}
