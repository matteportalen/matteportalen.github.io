/* Matte-Portalen: elevens djur från Garderoben.
   Delas av startsidan, Spelhörnan, Geometri och Bråk. Ändras ett djur eller en klädsel räcker det att ändra här.
   WARD = allt som finns i Garderoben (need = antal stjärnor som krävs), owlSVG = ritar djuret med kläderna. */
const WARD={
  animal:{name:"Djur",items:[
    {id:"uggla",name:"Uggla",need:0,pris:0},{id:"katt",name:"Katt",need:0,pris:0},{id:"kanin",name:"Kanin",need:0,pris:0},
    {id:"rav",name:"Räv",need:5,pris:20},{id:"panda",name:"Panda",need:10,pris:40},{id:"pingvin",name:"Pingvin",need:15,pris:60},
    {id:"robot",name:"Robot",need:25,pris:100},{id:"drake",name:"Drake",need:40,pris:160},{id:"enhorning",name:"Enhörning",need:55,pris:220},
    {id:"groda",name:"Groda",pris:120},{id:"hund",name:"Hund",pris:150},{id:"bjorn",name:"Björn",pris:200}]},
  color:{name:"Färg",items:[
    {id:"natur",name:"Naturlig",need:0,pris:0},
    {id:"lila",name:"Lila",need:0,pris:0,c:["#8A6BC6","#6B4E9B"]},{id:"bla",name:"Blå",need:2,pris:8,c:["#4F8DF5","#2F63C9"]},
    {id:"gron",name:"Grön",need:6,pris:24,c:["#3FBF7F","#258A58"]},{id:"rosa",name:"Rosa",need:12,pris:48,c:["#FF7EB6","#D94F8E"]},
    {id:"orange",name:"Orange",need:20,pris:80,c:["#FFA24C","#D9772A"]},{id:"rymd",name:"Rymd",need:35,pris:140,c:["#2B3A67","#141D3D"]},
    {id:"guld",name:"Guld",need:60,pris:240,c:["#F2C230","#C99A0A"]}]},
  glasses:{name:"Glasögon",items:[
    {id:"runda",name:"Runda",need:0,pris:0},{id:"inga",name:"Inga",need:0,pris:0},{id:"stjarn",name:"Stjärnor",need:8,pris:32},
    {id:"sol",name:"Solglasögon",need:15,pris:60},{id:"hjarta",name:"Hjärtan",need:40,pris:160},
    {id:"dyk",name:"Dykarmask",pris:80},{id:"cool",name:"Coola glasögon",pris:120}]},
  hat:{name:"Hatt",items:[
    {id:"ingen",name:"Ingen",need:0,pris:0},{id:"keps",name:"Keps",need:3,pris:12},{id:"mossa",name:"Mössa",need:10,pris:40},
    {id:"party",name:"Partyhatt",need:16,pris:64},{id:"troll",name:"Trollkarl",need:28,pris:112},{id:"krona",name:"Krona",need:50,pris:200},
    {id:"horlurar",name:"Hörlurar",pris:60},{id:"hjalm",name:"Cykelhjälm",pris:50},{id:"blomkrans",name:"Blomkrans",pris:70},{id:"pirat",name:"Pirathatt",pris:90},
    {id:"cowboy",name:"Cowboyhatt",pris:90},{id:"astronaut",name:"Rymdhjälm",pris:300},
    {id:"tomteluva",name:"Tomteluva",pris:80,s:"jul"},{id:"haxhatt",name:"Häxhatt",pris:90,s:"halloween"},{id:"harora",name:"Haröron",pris:70,s:"pask"},
    {id:"solhatt",name:"Solhatt",pris:60,s:"sommar"},{id:"hjartband",name:"Hjärtdiadem",pris:60,s:"hjarta"}]},
  neck:{name:"Halsband",items:[
    {id:"ingen",name:"Inget",need:0,pris:0},{id:"rosett",name:"Rosett",need:4,pris:16},{id:"halsduk",name:"Halsduk",need:14,pris:56},{id:"medalj",name:"Medalj",need:24,pris:96}]},
  hand:{name:"I handen",items:[
    {id:"ingen",name:"Inget",pris:0},{id:"flagga",name:"Flagga",pris:30},{id:"ballong",name:"Ballong",pris:40},{id:"glass",name:"Glass",pris:40},
    {id:"pensel",name:"Pensel",pris:50},{id:"mikrofon",name:"Mikrofon",pris:80},{id:"fiskespo",name:"Fiskespö",pris:100},{id:"svard",name:"Träsvärd",pris:120},
    {id:"trollstav",name:"Trollstav",pris:150},
    {id:"polkagris",name:"Polkagris",pris:50,s:"jul"},{id:"pumpa",name:"Pumpalykta",pris:60,s:"halloween"},{id:"pagg",name:"Påskägg",pris:50,s:"pask"},
    {id:"badboll",name:"Badboll",pris:50,s:"sommar"},{id:"hjartballong",name:"Hjärtballong",pris:50,s:"hjarta"}]},
  back:{name:"På ryggen",items:[
    {id:"ingen",name:"Inget",pris:0},{id:"ryggsack",name:"Ryggsäck",pris:60},{id:"mantel",name:"Mantel",pris:140},{id:"vingar",name:"Fjärilsvingar",pris:250},
    {id:"jetpack",name:"Jetpack",pris:600},
    {id:"fladder",name:"Fladdermusvingar",pris:150,s:"halloween"}]}
};
/* Säsonger (fas 3): saker med s:"jul" osv. går bara att köpa under säsongen, köpta saker behålls för alltid.
   Påsken räknas fram: två veckor före påskdagen till annandag påsk. Testa en säsong med ?sasong=jul (?sasong=av tar bort). */
const SASONGER={hjarta:{namn:"Alla hjärtans dag",ikon:"💖",fran:[2,1],till:[2,14]},pask:{namn:"Påsk",ikon:"🐣"},
  sommar:{namn:"Sommarlov",ikon:"☀️",fran:[6,1],till:[8,15]},halloween:{namn:"Halloween",ikon:"🎃",fran:[10,1],till:[11,7]},
  jul:{namn:"Jul",ikon:"🎄",fran:[12,1],till:[1,6]}};
function paskdag(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
  h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),n=h+l-7*m+114;
  return new Date(y,Math.floor(n/31)-1,n%31+1);}
// {id, slut: Date} för säsongen som pågår, annars null
function sasongNu(nu){
  try{const q=(location.search.match(/[?&]sasong=(\w+)/)||[])[1];if(q){if(q==="av")sessionStorage.removeItem("mp-sasong");else sessionStorage.setItem("mp-sasong",q);}
    const t=sessionStorage.getItem("mp-sasong");if(t&&SASONGER[t])return{id:t,slut:new Date(2099,0,1),test:true};}catch(e){}
  const d=nu||new Date(),y=d.getFullYear(),dag=new Date(y,d.getMonth(),d.getDate());
  for(const [id,v] of Object.entries(SASONGER)){let a,b;
    if(id==="pask"){const p=paskdag(y);a=new Date(y,p.getMonth(),p.getDate()-14);b=new Date(y,p.getMonth(),p.getDate()+1);}
    else{a=new Date(y,v.fran[0]-1,v.fran[1]);b=new Date(y,v.till[0]-1,v.till[1]);if(b<a){if(dag<=b)a=new Date(y-1,v.fran[0]-1,v.fran[1]);else b=new Date(y+1,v.till[0]-1,v.till[1]);}}
    if(dag>=a&&dag<=b)return{id,slut:b};}
  return null;}
const sasongSlut=sn=>sn.test?"(test)":"till "+sn.slut.getDate()+" "+["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"][sn.slut.getMonth()];
/* Djurens egna färger när man väljer "Naturlig" */
const NATUR={uggla:["#8A6BC6","#6B4E9B"],katt:["#F4A259","#C9772E"],kanin:["#D9D2E9","#A99CC9"],rav:["#FF7A3D","#C4531F"],panda:["#FFFFFF","#2B2B3A"],
  pingvin:["#2B3A67","#141D3D"],robot:["#AEB9CC","#6B7894"],drake:["#3FBF7F","#258A58"],enhorning:["#FFFFFF","#E0D8F5"],
  groda:["#5BC46A","#3A9A4A"],hund:["#D49A5A","#9A6534"],bjorn:["#9A6534","#5C3A1B"]};
const itemOf=(slot,id)=>WARD[slot].items.find(x=>x.id===id)||WARD[slot].items[0];
function owlSVG(cfg,cls,standalone){
  const an=cfg.animal||"uggla",ci=itemOf("color",cfg.color),[c1,c2]=ci.c||NATUR[an]||NATUR.uggla,dark=["rymd"].includes(cfg.color)||(ci.id==="natur"&&an==="pingvin");
  const L=`stroke="#1D2B53" stroke-width="2" stroke-linejoin="round"`;
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -20 120 140"${standalone?' width="240" height="280"':` class="owl ${cls||""}" role="img" aria-label="Avatar"`}>`;
  s+=`<ellipse cx="60" cy="112" rx="34" ry="5" fill="rgba(0,0,0,.18)"/>`;
  // på ryggen (bakom kroppen)
  const bk=cfg.back;
  if(bk==="mantel")s+=`<path d="M32 40 Q12 80 10 112 L110 112 Q108 80 88 40 Z" fill="#7B61FF"/><path d="M10 112 L110 112" stroke="#5B43D6" stroke-width="3"/>`;
  if(bk==="vingar"){const w=`<path d="M34 62 C4 18 -6 64 24 78 C0 90 8 116 36 94 Z" fill="#FF9FD0" stroke="#D94F8E" stroke-width="2"/><circle cx="18" cy="56" r="5" fill="#FFC93C"/><circle cx="20" cy="94" r="4" fill="#7B61FF"/>`;s+=w+`<g transform="translate(120 0) scale(-1 1)">${w}</g>`;}
  if(bk==="ryggsack")s+=`<rect x="12" y="56" width="96" height="46" rx="16" fill="#E5484D"/><rect x="12" y="56" width="96" height="10" rx="5" fill="#B8323A"/>`;
  if(bk==="fladder"){const w=`<path d="M36 60 L6 34 L10 52 L0 60 L12 66 L4 80 L18 80 L14 94 L36 86 Z" fill="#3B2B5C" stroke="#241A3A" stroke-width="2" stroke-linejoin="round"/>`;s+=w+`<g transform="translate(120 0) scale(-1 1)">${w}</g>`;}
  if(bk==="jetpack"){const t=x=>`<path d="M${x+2} 98 L${x+8} 120 L${x+14} 98 Z" fill="#FF9F43"/><path d="M${x+5} 98 L${x+8} 112 L${x+11} 98 Z" fill="#FFE07A"/><rect x="${x}" y="48" width="16" height="50" rx="7" fill="#AEB9CC" stroke="#6B7894" stroke-width="2"/><rect x="${x}" y="48" width="16" height="10" rx="5" fill="#E5484D"/>`;s+=t(6)+t(98);}
  // bakom kroppen: svansar och vingar
  if(an==="katt")s+=`<path d="M92 92 Q116 88 108 58 Q104 50 100 58 Q106 80 88 84Z" fill="${c1}"/><path d="M106 60 L102 68 M104 70 L98 74" stroke="${c2}" stroke-width="3"/>`;
  if(an==="rav")s+=`<path d="M90 96 Q122 96 114 60 Q98 70 88 86Z" fill="${c1}"/><path d="M114 60 Q116 70 108 76 Q104 68 114 60Z" fill="#fff"/>`;
  if(an==="drake")s+=`<path d="M26 64 L4 44 L12 70 L0 72 L22 82Z" fill="${c2}"/><path d="M94 64 L116 44 L108 70 L120 72 L98 82Z" fill="${c2}"/><path d="M90 98 Q116 104 112 84 L118 80 L108 78 Q106 94 88 90Z" fill="${c1}"/>`;
  if(an==="hund")s+=`<path d="M92 92 Q112 82 106 64 Q100 62 100 70 Q102 82 88 86Z" fill="${c1}"/>`;
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
  if(an==="bjorn")s+=`<circle cx="30" cy="32" r="12" fill="${c1}"/><circle cx="30" cy="32" r="6" fill="${c2}"/><circle cx="90" cy="32" r="12" fill="${c1}"/><circle cx="90" cy="32" r="6" fill="${c2}"/>`;
  if(an==="groda")s+=`<circle cx="42" cy="36" r="17" fill="${c1}"/><circle cx="78" cy="36" r="17" fill="${c1}"/>`;
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
  if(an==="hund")s+=`<path d="M30 30 Q12 34 16 68 Q26 70 36 46Z" fill="${c2}"/><path d="M90 30 Q108 34 104 68 Q94 70 84 46Z" fill="${c2}"/>`;
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
  if(cfg.glasses==="cool"){
    s+=`<path d="M22 40 H58 L55 58 Q40 64 26 58 Z" fill="#2B1B4D"/><path d="M62 40 H98 L94 58 Q80 64 65 58 Z" fill="#2B1B4D"/><path d="M22 40 H98" stroke="#FF5FA2" stroke-width="4"/><path d="M28 46 L36 42 M68 46 L76 42" stroke="rgba(255,255,255,.7)" stroke-width="3" stroke-linecap="round"/>`;
  }else if(cfg.glasses==="sol"){
    s+=`<rect x="24" y="38" width="34" height="24" rx="10" fill="#1D2B53"/><rect x="62" y="38" width="34" height="24" rx="10" fill="#1D2B53"/><path d="M56 46h8" stroke="#1D2B53" stroke-width="4"/><path d="M30 44l8-4M68 44l8-4" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round"/>`;
  }else{
    const r=an==="uggla"?16:an==="robot"?13:12;
    if(an==="robot")s+=`<rect x="${42-r}" y="${50-r}" width="${2*r}" height="${2*r}" rx="5" fill="#1D2B53"/><rect x="${78-r}" y="${50-r}" width="${2*r}" height="${2*r}" rx="5" fill="#1D2B53"/><circle cx="42" cy="50" r="6" fill="#7CF0B1"/><circle cx="78" cy="50" r="6" fill="#7CF0B1"/>`;
    else s+=`<circle cx="42" cy="50" r="${r}" fill="#fff"/><circle cx="78" cy="50" r="${r}" fill="#fff"/><circle cx="45" cy="52" r="7" fill="#1D2B53"/><circle cx="75" cy="52" r="7" fill="#1D2B53"/><circle cx="47.5" cy="49.5" r="2.4" fill="#fff"/><circle cx="77.5" cy="49.5" r="2.4" fill="#fff"/>`;
    if(cfg.glasses==="runda")s+=`<circle cx="42" cy="50" r="17" fill="none" stroke="#FFC93C" stroke-width="4"/><circle cx="78" cy="50" r="17" fill="none" stroke="#FFC93C" stroke-width="4"/><line x1="59" y1="50" x2="61" y2="50" stroke="#FFC93C" stroke-width="4"/>`;
    if(cfg.glasses==="stjarn"){const star=(cx,cy)=>{let p=[];for(let i=0;i<10;i++){const rr=i%2?11:22,a=-Math.PI/2+i*Math.PI/5;p.push((cx+rr*Math.cos(a)).toFixed(1)+","+(cy+rr*Math.sin(a)).toFixed(1))}return`<polygon points="${p.join(" ")}" fill="none" stroke="#FF5FA2" stroke-width="3.5" stroke-linejoin="round"/>`};s+=star(42,51)+star(78,51)}
    if(cfg.glasses==="dyk")s+=`<path d="M16 46 H22 M98 46 H104" stroke="#1D2B53" stroke-width="5"/><rect x="22" y="33" width="76" height="32" rx="15" fill="rgba(140,210,255,.45)" stroke="#FF9F43" stroke-width="4"/><path d="M30 40 Q36 36 44 37" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if(cfg.glasses==="hjarta"){const heart=cx=>`<path d="M${cx} 66 C${cx-26} 50 ${cx-18} 30 ${cx} 42 C${cx+18} 30 ${cx+26} 50 ${cx} 66Z" fill="none" stroke="#E5484D" stroke-width="3.5"/>`;s+=heart(42)+heart(78)}
  }
  // näbb, nos och mun
  if(an==="uggla"||an==="pingvin")s+=`<path d="M55 62 L65 62 L60 71 Z" fill="#FF9F43"/>`;
  else if(an==="katt"||an==="kanin")s+=`<path d="M56 63 L64 63 L60 68Z" fill="#FF7EB6"/><path d="M60 68 Q56 73 52 70 M60 68 Q64 73 68 70" stroke="#1D2B53" stroke-width="2" fill="none" stroke-linecap="round"/>`+(an==="katt"?`<path d="M30 64 L48 66 M30 70 L48 69 M90 64 L72 66 M90 70 L72 69" stroke="#1D2B53" stroke-width="1.5"/>`:`<rect x="56.5" y="70" width="3" height="5" fill="#fff" stroke="#1D2B53" stroke-width="1"/><rect x="60.5" y="70" width="3" height="5" fill="#fff" stroke="#1D2B53" stroke-width="1"/>`);
  else if(an==="rav")s+=`<ellipse cx="60" cy="66" rx="5" ry="4" fill="#1D2B53"/><path d="M60 70 Q56 75 52 72 M60 70 Q64 75 68 72" stroke="#1D2B53" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else if(an==="panda")s+=`<ellipse cx="60" cy="65" rx="5" ry="3.5" fill="#1D2B53"/><path d="M60 68 Q56 73 52 70 M60 68 Q64 73 68 70" stroke="#1D2B53" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else if(an==="hund"||an==="bjorn")s+=`<ellipse cx="60" cy="67" rx="13" ry="9" fill="${an==="hund"?"#F3E2CC":"#D4A373"}"/><ellipse cx="60" cy="63" rx="5.5" ry="4" fill="#1D2B53"/><path d="M60 67 Q56 73 52 70 M60 67 Q64 73 68 70" stroke="#1D2B53" stroke-width="2" fill="none" stroke-linecap="round"/>`+(an==="hund"?`<path d="M57 72 Q60 80 63 72Z" fill="#FF7EB6"/>`:"");
  else if(an==="groda")s+=`<path d="M42 68 Q60 82 78 68" stroke="#1D2B53" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="36" cy="68" r="5" fill="#FF9FB8" opacity=".7"/><circle cx="84" cy="68" r="5" fill="#FF9FB8" opacity=".7"/>`;
  else if(an==="robot")s+=`<rect x="48" y="66" width="24" height="7" rx="2" fill="#1D2B53"/><path d="M54 66V73M60 66V73M66 66V73" stroke="#7CF0B1" stroke-width="1.5"/>`;
  else if(an==="drake")s+=`<ellipse cx="60" cy="67" rx="12" ry="7" fill="${c2}"/><circle cx="56" cy="66" r="1.8" fill="#1D2B53"/><circle cx="64" cy="66" r="1.8" fill="#1D2B53"/>`;
  else if(an==="enhorning")s+=`<ellipse cx="60" cy="68" rx="13" ry="8" fill="#FFD6E7"/><circle cx="56" cy="67" r="1.8" fill="#1D2B53"/><circle cx="64" cy="67" r="1.8" fill="#1D2B53"/><path d="M60 26 L54 6 L66 6Z" fill="#FFC93C" ${L}/><path d="M55 12H65M56 18H64" stroke="#C99A0A" stroke-width="1.5"/>`;
  // halsband
  if(cfg.neck==="rosett")s+=`<path d="M60 80 L46 72 L46 88 Z M60 80 L74 72 L74 88 Z" fill="#E5484D"/><circle cx="60" cy="80" r="4.5" fill="#B8323A"/>`;
  if(cfg.neck==="halsduk")s+=`<path d="M26 74 Q60 90 94 74 L94 83 Q60 99 26 83 Z" fill="#3D8BFD"/><path d="M70 86 L78 110 L88 106 L80 84 Z" fill="#3D8BFD"/><path d="M36 80 Q60 93 84 80" stroke="#fff" stroke-width="2.5" fill="none" stroke-dasharray="4 5"/>`;
  // förkläde: bara i Affären (som bygghjälmen i Tornbygget), finns inte i Garderoben
  if(cfg.neck==="forklade")s+=`<path d="M42 84 L78 84 L84 106 Q60 116 36 106 Z" fill="#fff" stroke="#E5484D" stroke-width="2" stroke-linejoin="round"/><path d="M42 84 Q60 76 78 84" stroke="#E5484D" stroke-width="3" fill="none"/><rect x="52" y="93" width="16" height="9" rx="2" fill="none" stroke="#E5484D" stroke-width="1.8"/>`;
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
  if(cfg.hat==="horlurar")s+=`<path d="M24 52 Q24 8 60 8 Q96 8 96 52" fill="none" stroke="#1D2B53" stroke-width="6" stroke-linecap="round"/><rect x="12" y="40" width="17" height="28" rx="8" fill="#E5484D" stroke="#1D2B53" stroke-width="2"/><rect x="91" y="40" width="17" height="28" rx="8" fill="#E5484D" stroke="#1D2B53" stroke-width="2"/>`;
  if(cfg.hat==="hjalm")s+=`<path d="M30 36 Q30 4 60 4 Q90 4 90 36 Z" fill="#3D8BFD"/><path d="M46 8 L44 30 M60 5 V30 M74 8 L76 30" stroke="#BFD6FF" stroke-width="3"/><path d="M28 36 H92" stroke="#2A62C0" stroke-width="4" stroke-linecap="round"/>`;
  if(cfg.hat==="blomkrans"){let f="";[[30,34,"#FF7EB6"],[40,26,"#FFC93C"],[50,22,"#7B61FF"],[60,21,"#FF7EB6"],[70,22,"#FFC93C"],[80,26,"#7B61FF"],[90,34,"#FF7EB6"]].forEach(([x,y,c])=>{f+=`<circle cx="${x}" cy="${y}" r="6" fill="${c}"/><circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`;});
    s+=`<path d="M26 36 Q60 12 94 36" stroke="#2BB673" stroke-width="4" fill="none"/>`+f;}
  if(cfg.hat==="pirat")s+=`<path d="M26 34 Q60 -6 94 34 Q60 22 26 34 Z" fill="#1D2B53"/><path d="M22 35 Q60 26 98 35 Q60 42 22 35 Z" fill="#2B2B3A"/><circle cx="60" cy="18" r="5.5" fill="#fff"/><circle cx="58" cy="17.5" r="1.4" fill="#1D2B53"/><circle cx="62" cy="17.5" r="1.4" fill="#1D2B53"/><path d="M54 25 L66 29 M66 25 L54 29" stroke="#fff" stroke-width="2"/>`;
  if(cfg.hat==="cowboy")s+=`<ellipse cx="60" cy="32" rx="46" ry="7" fill="#8B5A2B"/><path d="M38 32 Q38 4 50 8 Q60 13 70 8 Q82 4 82 32 Z" fill="#A86B35"/><rect x="38" y="25" width="44" height="5" fill="#5C3A1B"/>`;
  if(cfg.hat==="astronaut")s+=`<circle cx="60" cy="50" r="42" fill="rgba(190,225,255,.28)" stroke="#E8EDF7" stroke-width="5"/><path d="M28 34 Q34 18 50 12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="92" rx="30" ry="6" fill="none" stroke="#AEB9CC" stroke-width="5"/>`;
  if(cfg.hat==="tomteluva")s+=`<path d="M34 30 Q40 -2 70 -6 Q94 -6 100 16 L93 19 Q86 6 72 8 Q64 18 86 30 Z" fill="#E5484D"/><rect x="30" y="25" width="60" height="11" rx="5.5" fill="#fff"/><circle cx="98" cy="20" r="7" fill="#fff"/>`;
  if(cfg.hat==="haxhatt")s+=`<ellipse cx="60" cy="32" rx="44" ry="7" fill="#3B2B5C"/><path d="M40 31 L60 -8 Q66 -20 74 -14 Q66 -10 68 2 L80 31 Z" fill="#4A3670"/><rect x="42" y="23" width="37" height="6" fill="#FF9F43"/><rect x="56" y="22" width="9" height="8" rx="1.5" fill="none" stroke="#FFE07A" stroke-width="2"/>`;
  if(cfg.hat==="harora"){const ora=(x,r)=>`<g transform="rotate(${r} ${x} 26)"><ellipse cx="${x}" cy="0" rx="9" ry="25" fill="#fff" stroke="#E6DDF0" stroke-width="2"/><ellipse cx="${x}" cy="2" rx="4" ry="17" fill="#FFB3D1"/></g>`;
    s+=ora(46,-12)+ora(74,12)+`<path d="M30 32 Q60 14 90 32" stroke="#FF7EB6" stroke-width="5" fill="none" stroke-linecap="round"/>`;}
  if(cfg.hat==="solhatt")s+=`<ellipse cx="60" cy="30" rx="48" ry="8" fill="#F3D58A" stroke="#D9B35F" stroke-width="1.5"/><path d="M40 30 Q40 6 60 6 Q80 6 80 30 Z" fill="#F7E1A6"/><rect x="40" y="21" width="40" height="6" fill="#FF7EB6"/><circle cx="78" cy="22" r="5" fill="#FFC93C"/><circle cx="78" cy="22" r="2" fill="#E07A4E"/>`;
  if(cfg.hat==="hjartband"){const hj=(x,y)=>`<path d="M${x} ${y+6} C${x-10} ${y} ${x-7} ${y-8} ${x} ${y-3} C${x+7} ${y-8} ${x+10} ${y} ${x} ${y+6}Z" fill="#E5484D"/>`;
    s+=`<path d="M44 24 Q42 12 44 4 M60 20 V-2 M76 24 Q78 12 76 4" stroke="#1D2B53" stroke-width="1.5" fill="none"/>`+hj(44,2)+hj(60,-4)+hj(76,2)+`<path d="M30 32 Q60 16 90 32" stroke="#FF7EB6" stroke-width="5" fill="none" stroke-linecap="round"/>`;}
  // i handen (till höger om kroppen)
  const hd=cfg.hand;
  if(hd==="flagga")s+=`<path d="M104 104 V36" stroke="#8B5A2B" stroke-width="3" stroke-linecap="round"/><path d="M104 36 H120 L114 44 L120 52 H104 Z" fill="#2BB673"/>`;
  if(hd==="ballong")s+=`<path d="M100 98 Q112 74 104 46" stroke="#56668F" stroke-width="1.5" fill="none"/><ellipse cx="106" cy="30" rx="12" ry="15" fill="#FF5FA2"/><path d="M103 45 L109 45 L106 49 Z" fill="#D94F8E"/><ellipse cx="101" cy="24" rx="3" ry="5" fill="#fff" opacity=".6"/>`;
  if(hd==="glass")s+=`<path d="M94 80 L112 80 L103 106 Z" fill="#E8B878" stroke="#C4904E" stroke-width="1.5"/><path d="M97 86 L109 92 M99 94 L107 86" stroke="#C4904E" stroke-width="1.2"/><circle cx="99" cy="76" r="7" fill="#FF9FD0"/><circle cx="108" cy="76" r="7" fill="#9EE6C9"/><circle cx="103.5" cy="68" r="7" fill="#FFF3B0"/>`;
  if(hd==="pensel")s+=`<path d="M98 106 L112 66" stroke="#C98A4E" stroke-width="5" stroke-linecap="round"/><path d="M110 70 L114 62" stroke="#AEB9CC" stroke-width="6"/><path d="M112 64 Q116 50 120 58 Q118 64 112 64Z" fill="#3D8BFD"/>`;
  if(hd==="mikrofon")s+=`<path d="M100 104 L108 74" stroke="#1D2B53" stroke-width="6" stroke-linecap="round"/><circle cx="109" cy="66" r="9" fill="#56668F"/><path d="M103 62 H115 M102 67 H116 M104 72 H114" stroke="#AEB9CC" stroke-width="1.5"/>`;
  if(hd==="fiskespo")s+=`<path d="M96 106 L114 26" stroke="#8B5A2B" stroke-width="3" stroke-linecap="round"/><path d="M114 26 V62" stroke="#56668F" stroke-width="1"/><path d="M106 68 Q112 60 119 68 Q112 76 106 68 Z" fill="#FF9F43"/><path d="M107 68 L101 63 L101 73 Z" fill="#FF9F43"/><circle cx="115" cy="67" r="1.2" fill="#1D2B53"/>`;
  if(hd==="svard")s+=`<path d="M106 36 L110 36 L110 84 L106 84 Z" fill="#D9B377" stroke="#9A6534" stroke-width="1.5"/><path d="M106 36 L108 30 L110 36 Z" fill="#D9B377"/><rect x="99" y="84" width="18" height="5" rx="2" fill="#9A6534"/><rect x="105.5" y="89" width="5" height="14" rx="2" fill="#5C3A1B"/>`;
  if(hd==="trollstav")s+=`<path d="M98 104 L112 64" stroke="#1D2B53" stroke-width="4" stroke-linecap="round"/><path d="M112 64 L114 70" stroke="#fff" stroke-width="4"/><path d="M113 46 l3 7 7.5.6-5.7 4.9 1.8 7.4-6.6-4-6.6 4 1.8-7.4-5.7-4.9 7.5-.6z" fill="#F2C230" stroke="#C99A0A" stroke-width="1.5"/><circle cx="102" cy="48" r="1.8" fill="#FFC93C"/><circle cx="120" cy="40" r="1.5" fill="#FF7EB6"/><circle cx="118" cy="72" r="1.5" fill="#7B61FF"/>`;
  if(hd==="polkagris")s+=`<path d="M104 106 V56 Q104 44 112 44 Q120 44 120 54" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M104 106 V56 Q104 44 112 44 Q120 44 120 54" stroke="#E5484D" stroke-width="7" fill="none" stroke-dasharray="4 5"/>`;
  if(hd==="pumpa")s+=`<path d="M106 64 V58" stroke="#2BB673" stroke-width="3"/><ellipse cx="106" cy="78" rx="14" ry="12" fill="#FF8A1F"/><path d="M100 67 Q96 78 100 89 M112 67 Q116 78 112 89" stroke="#E06A00" stroke-width="1.5" fill="none"/><path d="M99 74 l3 -3 l3 3z M108 74 l3 -3 l3 3z M99 82 Q106 88 113 82 Q106 85 99 82z" fill="#FFE07A"/>`;
  if(hd==="pagg")s+=`<ellipse cx="106" cy="80" rx="11" ry="14" fill="#FFC93C"/><path d="M95 78 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l2 2" stroke="#FF5FA2" stroke-width="2.5" fill="none"/><circle cx="102" cy="88" r="2" fill="#3D8BFD"/><circle cx="110" cy="88" r="2" fill="#2BB673"/><circle cx="106" cy="70" r="2" fill="#3D8BFD"/>`;
  if(hd==="badboll")s+=`<circle cx="106" cy="80" r="14" fill="#fff"/><path d="M106 80 L106 66 A14 14 0 0 1 120 80Z" fill="#E5484D"/><path d="M106 80 L120 80 A14 14 0 0 1 106 94Z" fill="#3D8BFD"/><path d="M106 80 L106 94 A14 14 0 0 1 92 80Z" fill="#FFC93C"/><circle cx="106" cy="80" r="14" fill="none" stroke="#AEB9CC" stroke-width="1.2"/><circle cx="106" cy="80" r="2.5" fill="#fff"/>`;
  if(hd==="hjartballong")s+=`<path d="M100 98 Q112 74 105 50" stroke="#56668F" stroke-width="1.5" fill="none"/><path d="M106 50 C88 38 94 14 106 26 C118 14 124 38 106 50Z" fill="#E5484D"/><ellipse cx="100" cy="28" rx="2.5" ry="4" fill="#fff" opacity=".6"/>`;
  if(bk==="ryggsack")s+=`<path d="M32 46 Q28 70 34 96" stroke="#B8323A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M88 46 Q92 70 86 96" stroke="#B8323A" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  return s+"</svg>";
}

/* Djuret i bestämd form, för texter som "Kaninens egen skylt" */
const PETNAME={uggla:"Ugglan",katt:"Katten",kanin:"Kaninen",rav:"Räven",panda:"Pandan",pingvin:"Pingvinen",robot:"Roboten",drake:"Draken",enhorning:"Enhörningen",groda:"Grodan",hund:"Hunden",bjorn:"Björnen"};
/* Läser elevens djur. Saknas det eller är datan trasig blir det ugglan. */
function lasDjur(){
  const std={animal:"uggla",color:"lila",glasses:"runda",hat:"ingen",neck:"ingen",hand:"ingen",back:"ingen"};
  try{return Object.assign(std,JSON.parse(localStorage.getItem("matteportalen-uggla")||"{}")||{});}catch(e){return std;}
}
