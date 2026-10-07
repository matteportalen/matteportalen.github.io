/* Gemensam bråkkod (MPBrak): färger per nämnare och bråkräkning med heltalspar.
   Används av Bråkväggen (verktyg/brakvaggen/), Bråkbitarna (brakbitar/) och Rutjaktens bråkvariant.
   Ett bråk är alltid [täljare, nämnare] med heltal, aldrig ett decimaltal, så att inga avrundningsfel uppstår. */
(function(){
  // klassiska bråkstavsfärger: 1 röd, ½ rosa, ⅓ orange, ¼ gul, ⅕ grön, ⅙ turkos, ⅛ blå, 1/10 lila, 1/12 grå
  const COL={1:"#E5484D",2:"#FF5FA2",3:"#FF9F43",4:"#F2B707",5:"#2BB673",6:"#17AFC4",8:"#3D5AFE",10:"#7B61FF",12:"#56668F"};
  const DEN=[1,2,3,4,5,6,8,10,12];
  const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;};
  const lcm=(a,b)=>a/gcd(a,b)*b;
  const red=([n,d])=>{const g=gcd(n,d);return[n/g,d/g];};
  const add=(x,y)=>red([x[0]*y[1]+y[0]*x[1],x[1]*y[1]]);
  const sub=(x,y)=>red([x[0]*y[1]-y[0]*x[1],x[1]*y[1]]);
  const cmp=(x,y)=>x[0]*y[1]-y[0]*x[1];            // <0 mindre, 0 lika, >0 större
  const eq=(x,y)=>cmp(x,y)===0;
  const sum=list=>list.reduce((a,b)=>add(a,b),[0,1]);
  // text: staplat bråk i HTML (d = 1 visas som heltal)
  const html=(n,d)=>d===1?String(n):`<span class="fr"><span>${n}</span><span>${d}</span></span>`;
  // decimal med komma; ≈ om det inte går jämnt ut på två decimaler
  const dec=(n,d)=>{const v=n/d,r=Math.round(v*100)/100;return(Math.abs(v*100-Math.round(v*100))>1e-9?"≈ ":"")+String(r).replace(".",",");};
  const pct=(n,d)=>{const v=n/d*100,r=Math.round(v);return(Math.abs(v-r)>1e-9?"≈ ":"")+r+" %";};
  // etikett efter visningsläge: "frac" | "dec" | "pct" | "none"
  const label=(n,d,mode)=>mode==="none"?"":mode==="dec"?dec(n,d):mode==="pct"?pct(n,d):html(n,d);
  // mörk text på den gula biten, vit på de andra
  const ink=d=>d===4?"#4A3500":"#fff";
  window.MPBrak={COL,DEN,gcd,lcm,red,add,sub,cmp,eq,sum,html,dec,pct,label,ink};
})();
