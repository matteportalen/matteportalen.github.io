/* KB-Whisper i enheten: taligenkänning som körs i webbläsaren, inget ljud lämnar enheten.
   Modellen KBLab/kb-whisper-tiny (Kungliga biblioteket, svenska) laddas från Hugging Face en gång (ca 52 MB)
   och sparas sedan i webbläsarens cache. Räknar med grafikkortet (WebGPU) om det finns, annars med processorn.
   Mikrofonen stängs aldrig av medan man lyssnar; en enkel röstvakt delar ljudet vid pauser.
   Prövat i Mikrofonlabbet (miklabb/).

   MPWhisper.ladda(onProgress)  laddar modellen; onProgress(laddat, totalt) i byte
   MPWhisper.start(cb)          börjar lyssna; cb({text, final, seg}) för varje körning
                                (seg = numret på körningens första bit: preliminära körningar och den slutliga har samma nummer)
   MPWhisper.stop()             slutar lyssna
   MPWhisper.laddad, .backend ("grafikkortet"/"processorn"), .lyssnar */
window.MPWhisper=(()=>{
  const MODELL="KBLab/kb-whisper-tiny",TF="https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/dist/transformers.min.js";
  // ord som modellen ibland hittar på i tystnad eller brus
  const HALLU=/tack för att|textning|undertext|prenumerera|svensktextning|musik|♪/i;
  let pipe=null,laddar=null,backend="";
  function ladda(onProgress){if(pipe)return Promise.resolve(pipe);if(laddar)return laddar;
    laddar=(async()=>{const T=await import(TF);T.env.allowLocalModels=false;
      let dev="wasm",dtype={encoder_model:"q4f16",decoder_model_merged:"q4f16"};
      try{const ad=navigator.gpu&&await navigator.gpu.requestAdapter();if(ad){dev="webgpu";if(!ad.features.has("shader-f16"))dtype={encoder_model:"fp32",decoder_model_merged:"q4"};}}catch(e){}
      // på processorn räknas det i en egen tråd, så att sidan inte hackar
      if(dev==="wasm"){try{T.env.backends.onnx.wasm.proxy=true;}catch(e){}}
      const filer={};
      const p=await T.pipeline("automatic-speech-recognition",MODELL,{device:dev,dtype,progress_callback:x=>{
        if(x.status==="progress"&&x.total&&onProgress){filer[x.file]=[x.loaded,x.total];let a=0,b=0;for(const k in filer){a+=filer[k][0];b+=filer[k][1];}onProgress(a,b);}}});
      // första körningen är alltid långsam: värm upp med en halv sekund tystnad
      await p(new Float32Array(8000),{language:"swedish",task:"transcribe"});
      backend=dev==="webgpu"?"grafikkortet":"processorn";pipe=p;return p;})().catch(e=>{laddar=null;throw e;});
    return laddar;}

  /* ---------- körningar ---------- */
  // bitar som väntar körs tillsammans: en körning tar ungefär lika lång tid oavsett hur mycket ljud den har
  const ko=[];let upptagen=false,cb=null;
  async function kor(){if(upptagen||!pipe||!ko.length)return;upptagen=true;
    let bitar=ko.splice(0);bitar=bitar.some(b=>!b.prel)?bitar.filter(b=>!b.prel):[bitar[bitar.length-1]];
    const paus=3200;let n=0;bitar.forEach(b=>n+=b.ljud.length+paus);
    const all=new Float32Array(n);let o=0;for(const b of bitar){all.set(b.ljud,o);o+=b.ljud.length+paus;}
    try{const r=await pipe(all,{language:"swedish",task:"transcribe"});const text=(r.text||"").trim();
      // texten skickas en gång, med den första bitens nummer: bara den kan redan ha haft preliminära körningar
      // (en preliminär körning görs bara när inget annat väntar), så de ord som redan räknats står först i texten
      if(text&&!HALLU.test(text)&&cb)cb({text,final:!bitar[0].prel,seg:bitar[0].seg});}catch(e){}
    upptagen=false;kor();}

  /* ---------- mikrofonen och röstvakten ---------- */
  const mic={ctx:null,strom:null};
  const V={golv:.004,tal:false,ljud:[],fore:[],tyst:0,ramar:0,prel:0,seg:0};
  const hopa=r=>{const a=new Float32Array(r.length*320);r.forEach((x,i)=>a.set(x,i*320));return a;};
  function ram(r){let s=0;for(const x of r)s+=x*x;const rms=Math.sqrt(s/r.length);
    const pa=Math.max(V.golv*3.5,.012),av=Math.max(V.golv*2,.008);
    if(!V.tal){V.golv=V.golv*.98+Math.min(rms,.05)*.02;V.fore.push(r);if(V.fore.length>10)V.fore.shift();
      if(rms>pa){if(++V.ramar>=2){V.tal=true;V.seg++;V.ljud=[...V.fore];V.tyst=0;V.prel=V.ljud.length;}}else V.ramar=0;return;}
    V.ljud.push(r);if(rms<av)V.tyst++;else V.tyst=0;
    const slut=V.tyst>=15,lang=V.ljud.length>=300;// 0,3 s tystnad eller 6 s tal
    if(slut||lang){V.tal=false;V.ramar=0;if(V.ljud.length>=8){ko.push({ljud:hopa(V.ljud),seg:V.seg});kor();}
      // klipps ljudet mitt i tal tas de sista 0,3 s med i nästa bit, så att inget ord delas itu
      if(lang&&!slut){V.tal=true;V.seg++;V.ljud=V.ljud.slice(-15);V.prel=V.ljud.length;}else{V.ljud=[];V.fore=[];}}
    else if(!upptagen&&!ko.length&&V.ljud.length-V.prel>=40){// en sekund nytt tal: preliminär körning
      V.prel=V.ljud.length;ko.push({ljud:hopa(V.ljud),seg:V.seg,prel:true});kor();}}
  async function start(nyCb){cb=nyCb;await ladda();if(mic.strom)return;
    const strom=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
    if(!cb){strom.getTracks().forEach(t=>t.stop());return;}// stoppad medan den startade
    let ctx;try{ctx=new AudioContext({sampleRate:16000});}catch(e){ctx=new AudioContext();}
    const kod=`class R extends AudioWorkletProcessor{process(i){const c=i[0]&&i[0][0];if(c)this.port.postMessage(c.slice(0));return true}}registerProcessor("mp-rec",R);`;
    await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([kod],{type:"application/javascript"})));
    const src=ctx.createMediaStreamSource(strom),node=new AudioWorkletNode(ctx,"mp-rec");src.connect(node);
    const steg=ctx.sampleRate/16000;let buf=[];
    node.port.onmessage=e=>{const d=e.data;// gör om till 16 kHz om webbläsaren inte gick med på det
      if(steg===1)for(const x of d)buf.push(x);else for(let i=0;i<d.length/steg;i++)buf.push(d[Math.floor(i*steg)]);
      while(buf.length>=320)ram(Float32Array.from(buf.splice(0,320)));};
    Object.assign(V,{tal:false,ljud:[],fore:[],tyst:0,ramar:0});mic.ctx=ctx;mic.strom=strom;}
  function stop(){cb=null;ko.length=0;try{mic.strom&&mic.strom.getTracks().forEach(t=>t.stop());}catch(e){}try{mic.ctx&&mic.ctx.close();}catch(e){}mic.ctx=null;mic.strom=null;}
  return{ladda,start,stop,get laddad(){return !!pipe;},get backend(){return backend;},get lyssnar(){return !!mic.strom;}};
})();
