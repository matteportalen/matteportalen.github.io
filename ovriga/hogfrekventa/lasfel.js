/* Hör även fel (MPLasfel): KB:s wav2vec2 (VoxRex, CTC) i webbläsaren, prövad i Läsfelslabbet (lasfel/).
   Modellen skriver bokstav för bokstav vad den hör och rättar inte till riktiga ord, så felläsningar syns.
   Ett ord bedöms genom att jämföra en tvingad anpassning av ordet (och dess uttalsformer) med modellens bästa väg.
   Inget ljud lämnar enheten. Modellen (ca 240 MB, q4) laddas ner en gång och sparas i webbläsaren.

   MPLasfel.ladda(onProgress)   onProgress(laddat, totalt) i byte
   MPLasfel.start(cb)           egen mikrofon och röstvakt; cb({heard, lp, t0, t1, n}) för varje bit tal
   MPLasfel.bedom(lp, ord, former)  {exakt, gop, ok}: ok = rätt eller troligen rätt (gop över gränsen)
   MPLasfel.stop(), .laddad, .lyssnar */
window.MPLasfel=(()=>{
  const TF="https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/dist/transformers.min.js";
  // lärarens egen kopia på Hugging Face (samma fil som originalet); går den inte att nå hämtas originalet
  const KALLOR=["hepsan/kb-wav2vec2-svenska-q4","FredrikKarlssonSpeech/wav2vec2-large-voxrex-swedish-onnx"],DTYPE="q4",GRANS=-0.25;
  let proc=null,model=null,vocab=null,laddar=null,kalla="";
  function ladda(onProgress){if(model)return Promise.resolve();if(laddar)return laddar;
    laddar=(async()=>{const T=await import(TF);T.env.allowLocalModels=false;
      let dev="wasm";try{const ad=navigator.gpu&&await navigator.gpu.requestAdapter();if(ad)dev="webgpu";}catch(e){}
      const filer={};const prog=x=>{if(x.status==="progress"&&x.total&&onProgress){filer[x.file]=[x.loaded,x.total];let a=0,b=0;for(const k in filer){a+=filer[k][0];b+=filer[k][1];}onProgress(a,b);}};
      let fel=null;for(const MODELL of KALLOR){try{
        proc=await T.AutoProcessor.from_pretrained(MODELL,{progress_callback:prog});
        try{model=await T.AutoModelForCTC.from_pretrained(MODELL,{device:dev,dtype:DTYPE,progress_callback:prog});}
        catch(e){if(dev!=="webgpu")throw e;model=await T.AutoModelForCTC.from_pretrained(MODELL,{device:"wasm",dtype:DTYPE,progress_callback:prog});}
        const vj=await (await fetch(`https://huggingface.co/${MODELL}/resolve/main/vocab.json`)).json();vocab=[];for(const k in vj)vocab[vj[k]]=k;kalla=MODELL;fel=null;break;
      }catch(e){fel=e;model=null;}}
      if(fel)throw fel;
      await run(new Float32Array(8000));})().catch(e=>{laddar=null;model=null;throw e;});
    return laddar;}
  async function run(audio){const out=await model(await proc(audio)),L=out.logits,[,TT,V]=L.dims,d=L.data,lp=new Array(TT);
    for(let t=0;t<TT;t++){let m=-1e9;for(let v=0;v<V;v++)m=Math.max(m,d[t*V+v]);let s=0;for(let v=0;v<V;v++)s+=Math.exp(d[t*V+v]-m);
      const ls=m+Math.log(s),row=new Float32Array(V);for(let v=0;v<V;v++)row[v]=d[t*V+v]-ls;lp[t]=row;}
    return lp;}
  const argmax=r=>{let b=0;for(let v=1;v<r.length;v++)if(r[v]>r[b])b=v;return b;};
  function greedy(lp){let out="",prev=-1;for(const r of lp){const b=argmax(r);if(b!==prev&&b!==0){const c=vocab[b];out+=c==="|"?" ":c.length===1?c:"";}prev=b;}return out.trim().toLowerCase();}
  // tvingad anpassning (Viterbi med CTC-blanktecken); tystnad runt ordet får vara blanktecken eller ordgränsen |
  function forced(lp,word){const ids=[...word.toUpperCase()].map(c=>vocab.indexOf(c)).filter(x=>x>0);if(!ids.length||!lp.length)return-1e9;
    const ext=[0];ids.forEach(x=>ext.push(x,0));const S=ext.length,NEG=-1e9,sil=r=>Math.max(r[0],r[4]);let a=new Float64Array(S).fill(NEG);a[0]=sil(lp[0]);a[1]=lp[0][ext[1]];
    for(let t=1;t<lp.length;t++){const r=lp[t],b=new Float64Array(S).fill(NEG);
      for(let s=0;s<S;s++){let m=a[s];if(s>0)m=Math.max(m,a[s-1]);if(s>1&&ext[s]!==0&&ext[s]!==ext[s-2])m=Math.max(m,a[s-2]);b[s]=m+(ext[s]===0?sil(r):r[ext[s]]);}a=b;}
    return Math.max(a[S-1],a[S-2]);}
  function bedom(lp,ord,former){const forms=[ord,...(former||[])],heard=greedy(lp).replace(/\s+/g,"");
    if(forms.includes(heard))return{exakt:true,gop:0,ok:true,heard};
    // bara en del av ordet hördes ("n" av "en"): början klipptes eller ordet var för svagt, räknas som hördes inte
    // ord med två bokstäver (en, i, på, om ...) är så korta att en del av ordet räcker: då räknas det som hört (lärarens val)
    if(heard&&forms.some(f=>f.length>heard.length&&f.includes(heard)))return{exakt:false,gop:0,ok:ord.length<=2,delvis:true,heard};
    if(!heard)return{exakt:false,gop:0,ok:false,delvis:true,heard};
    let best=0,tal=0;for(const r of lp){best+=Math.max(...r);const b=argmax(r);if(b!==0&&b!==4)tal++;}
    let top=-1e9;for(const f of forms)top=Math.max(top,forced(lp,f));
    const gop=(top-best)/Math.max(3,tal*3);return{exakt:false,gop,ok:gop>=GRANS,heard};}

  /* ---------- mikrofonen och röstvakten: en bit per ord eller ordgrupp (paus 0,35 s, högst 3 s) ---------- */
  const mic={ctx:null,strom:null};let cb=null,n=0,ko=[],upptagen=false;
  const V={golv:.004,tal:false,ljud:[],fore:[],tyst:0,ramar:0,t0:0};
  function ram(r){let s=0;for(const x of r)s+=x*x;const rms=Math.sqrt(s/r.length);
    if(!V.tal){V.golv=V.golv*.98+Math.min(rms,.05)*.02;V.fore.push(r);if(V.fore.length>8)V.fore.shift();
      if(rms>Math.max(V.golv*3.5,.012)){if(++V.ramar>=2){V.tal=true;V.ljud=[...V.fore];V.tyst=0;V.t0=performance.now()-V.ljud.length*20;}}else V.ramar=0;return;}
    V.ljud.push(r);if(rms<Math.max(V.golv*2,.008))V.tyst++;else V.tyst=0;
    if(V.tyst>=18||V.ljud.length>=150){V.tal=false;V.ramar=0;const a=new Float32Array(V.ljud.length*320);V.ljud.forEach((x,i)=>a.set(x,i*320));
      if(V.ljud.length>=12){ko.push({a,t0:V.t0,t1:performance.now(),n:++n});kor();}V.ljud=[];V.fore=[];}}
  async function kor(){if(upptagen||!ko.length||!model)return;upptagen=true;const b=ko.shift();
    try{const lp=await run(b.a),heard=greedy(lp);if(cb)cb({heard,lp,t0:b.t0,t1:b.t1,n:b.n});}catch(e){}
    upptagen=false;kor();}
  async function start(nyCb){cb=nyCb;await ladda();if(mic.strom)return;
    const strom=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
    if(!cb){strom.getTracks().forEach(t=>t.stop());return;}
    let ctx;try{ctx=new AudioContext({sampleRate:16000});}catch(e){ctx=new AudioContext();}
    const kod=`class R extends AudioWorkletProcessor{process(i){const c=i[0]&&i[0][0];if(c)this.port.postMessage(c.slice(0));return true}}registerProcessor("mp-lf",R);`;
    await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([kod],{type:"application/javascript"})));
    const src=ctx.createMediaStreamSource(strom),node=new AudioWorkletNode(ctx,"mp-lf");src.connect(node);
    const steg=ctx.sampleRate/16000;let buf=[];
    node.port.onmessage=e=>{const d=e.data;if(steg===1)for(const x of d)buf.push(x);else for(let i=0;i<d.length/steg;i++)buf.push(d[Math.floor(i*steg)]);
      while(buf.length>=320)ram(Float32Array.from(buf.splice(0,320)));};
    Object.assign(V,{tal:false,ljud:[],fore:[],tyst:0,ramar:0});mic.ctx=ctx;mic.strom=strom;}
  function stop(){cb=null;ko=[];try{mic.strom&&mic.strom.getTracks().forEach(t=>t.stop());}catch(e){}try{mic.ctx&&mic.ctx.close();}catch(e){}mic.ctx=null;mic.strom=null;}
  return{ladda,start,stop,bedom,lp:run,get laddad(){return !!model;},get kalla(){return kalla;},get lyssnar(){return !!mic.strom;}};
})();
