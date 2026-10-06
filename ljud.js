/* Matte-Portalen: gemensamma ljud för alla övningar.
   Ljuden skapas direkt i webbläsaren, så inga ljudfiler behövs.
   Ljudet slås på och av på startsidan och gäller sedan överallt. */
(function(){
  const KEY='matteportalen-ljud';
  let ctx=null;
  const isOn=()=>{try{return localStorage.getItem(KEY)!=='av'}catch(e){return true}};
  function ac(){
    if(!ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ctx=new A();}
    if(ctx.state==='suspended')ctx.resume();
    return ctx;
  }
  function tone(freq,start,dur,type,vol,slideTo){
    const c=ac();if(!c)return;
    const t=c.currentTime+start,o=c.createOscillator(),g=c.createGain();
    o.type=type||'sine';o.frequency.setValueAtTime(freq,t);
    if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.15,t+.015);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+.05);
  }
  const Ljud={
    get on(){return isOn()},
    set(v){try{localStorage.setItem(KEY,v?'på':'av')}catch(e){}if(!v)this.stopLoops();},
    /* Rätt svar: ett glatt litet pling */
    ok(){if(!isOn())return;tone(880,0,.12,'sine',.16);tone(1320,.08,.18,'sine',.14);},
    /* Fel svar: ett mjukt, snällt "boop" */
    bad(){if(!isOn())return;tone(330,0,.22,'triangle',.12,220);},
    /* Rekord, medalj eller alla rätt: en liten fanfar */
    fanfare(){if(!isOn())return;[523,659,784].forEach((f,i)=>tone(f,i*.11,.16,'triangle',.14));tone(1047,.33,.5,'triangle',.16);tone(1319,.33,.5,'sine',.07);},
    /* Nytt klistermärke eller ny sak i garderoben */
    magic(){if(!isOn())return;[1047,1319,1568,2093].forEach((f,i)=>tone(f,i*.07,.25,'sine',.09));},

    /* ---------- Spelljud ---------- */
    /* Vingslag: två snabba puffar av filtrerat brus */
    flap(){if(!isOn())return;const c=ac();if(!c)return;[0,.09].forEach(d=>noiseBurst(c,d,.11,700,1.2,.22));},
    /* Laser: en snabb nedåtgående svepton */
    laser(){if(!isOn())return;tone(1500,0,.16,'square',.045,180);tone(900,0,.12,'sawtooth',.03,120);},
    /* Turbo: stigande sus */
    whoosh(){if(!isOn())return;const c=ac();if(!c)return;noiseBurst(c,0,.45,500,.8,.18,3000);tone(200,0,.4,'sawtooth',.03,700);},
    /* Motorljud som går hela tiden: start(), set(0–1), stop() */
    engine:{
      start(){if(!isOn()||this.o)return;const c=ac();if(!c)return;
        const o=c.createOscillator(),o2=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain(),lfo=c.createOscillator(),lg=c.createGain();
        o.type='sawtooth';o2.type='square';o.frequency.value=55;o2.frequency.value=27.5;f.type='lowpass';f.frequency.value=420;f.Q.value=4;
        lfo.frequency.value=18;lg.gain.value=4;lfo.connect(lg);lg.connect(o.frequency);
        g.gain.setValueAtTime(0.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.05,c.currentTime+.4);
        o.connect(f);o2.connect(f);f.connect(g).connect(c.destination);o.start();o2.start();lfo.start();Object.assign(this,{o,o2,f,g,lfo});},
      set(v){if(!this.o)return;const c=ac(),t=c.currentTime,base=50+v*80;
        this.o.frequency.setTargetAtTime(base,t,.15);this.o2.frequency.setTargetAtTime(base/2,t,.15);this.f.frequency.setTargetAtTime(350+v*900,t,.15);this.lfo.frequency.setTargetAtTime(14+v*20,t,.2);},
      stop(){if(!this.o)return;const c=ac(),t=c.currentTime,{o,o2,lfo,g}=this;g.gain.setTargetAtTime(0.0001,t,.12);[o,o2,lfo].forEach(x=>{try{x.stop(t+.5)}catch(e){}});this.o=null;}
    },
    /* Rymdljud i bakgrunden: mjuka toner och svagt brus */
    space:{
      start(){if(!isOn()||this.g)return;const c=ac();if(!c)return;
        const g=c.createGain();g.gain.setValueAtTime(0.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.05,c.currentTime+2);g.connect(c.destination);
        const nodes=[];[55,82.4,110.3,164.8].forEach((fr,i)=>{const o=c.createOscillator(),og=c.createGain(),l=c.createOscillator(),lg=c.createGain();
          o.type='sine';o.frequency.value=fr*(1+(i%2?.003:-.003));og.gain.value=[.5,.35,.2,.12][i];l.frequency.value=.05+i*.03;lg.gain.value=og.gain.value*.6;
          l.connect(lg);lg.connect(og.gain);o.connect(og).connect(g);o.start();l.start();nodes.push(o,l);});
        const n=c.createBufferSource();n.buffer=noiseBuf(c);n.loop=true;const nf=c.createBiquadFilter();nf.type='bandpass';nf.frequency.value=400;nf.Q.value=.6;
        const ng=c.createGain();ng.gain.value=.12;n.connect(nf).connect(ng).connect(g);n.start();nodes.push(n);
        Object.assign(this,{g,nodes});},
      stop(){if(!this.g)return;const c=ac(),t=c.currentTime;this.g.gain.setTargetAtTime(0.0001,t,.3);this.nodes.forEach(x=>{try{x.stop(t+1.5)}catch(e){}});this.g=null;}
    },
    /* Kiosken: kassaapparat */
    kaching(){if(!isOn())return;const c=ac();if(!c)return;noiseBurst(c,0,.08,3000,1,.12);tone(1760,.06,.35,'triangle',.12);tone(2637,.1,.45,'sine',.09);},
    /* Tornbygget: klossen landar */
    clonk(){if(!isOn())return;const c=ac();if(!c)return;tone(180,0,.22,'triangle',.22,110);tone(360,0,.08,'square',.05,200);noiseBurst(c,0,.12,900,1,.12);},
    /* Kloss som ramlar ner */
    fall(){if(!isOn())return;tone(700,0,.5,'sine',.08,120);},
    /* Fåglar som kvittrar */
    chirp(){if(!isOn())return;const b=2600+Math.random()*900;for(let i=0;i<3;i++)tone(b,i*.09,.07,'sine',.05,b*1.35);},
    /* Grodan: studsigt hopp */
    hop(){if(!isOn())return;tone(260,0,.18,'sine',.14,720);tone(520,0,.12,'triangle',.05,1100);},
    /* Grodan kväker: två korta, raspiga "kvack" */
    croak(n){if(!isOn())return;const c=ac();if(!c)return;for(let i=0;i<(n||2);i++)croakPulse(c,i*.16);},
    /* Plask när näckrosbladet sjunker */
    splash(){if(!isOn())return;const c=ac();if(!c)return;noiseBurst(c,0,.5,1400,.9,.3,180);tone(400,.02,.25,'sine',.06,90);},
    /* Bubbeljakten: plopp (stiger i ton när många spricker) och skott */
    pop(i){if(!isOn())return;const c=ac();if(!c)return;const f=520*Math.pow(1.07,Math.min(i||0,14));tone(f,0,.09,'sine',.17,f*2.2);noiseBurst(c,0,.04,2600,1,.05);},
    shoot(){if(!isOn())return;tone(240,0,.14,'triangle',.09,560);},
    /* Dragkampen: ett ryck i repet */
    drag(){if(!isOn())return;const c=ac();if(!c)return;noiseBurst(c,0,.16,700,1,.13,220);tone(170,0,.2,'triangle',.13,110);},
    /* Klockan (Stationen): tågets tuta och stationens pling-plong */
    toot(){if(!isOn())return;[0,.42].forEach((d,i)=>{const L=i?.55:.28;tone(370,d,L,'sawtooth',.045,360);tone(466,d,L,'sawtooth',.04,455);tone(554,d,L,'triangle',.05,545);});},
    chime(){if(!isOn())return;[[784,0],[659,.32],[523,.64]].forEach(([f,d])=>{tone(f,d,.7,'sine',.11);tone(f*2,d,.25,'sine',.02);});},
    /* Tungan fångar en fluga */
    slurp(){if(!isOn())return;tone(500,0,.1,'sine',.1,1400);tone(1400,.1,.08,'sine',.06,700);},
    /* Vattenporl i bakgrunden med små bubblor */
    water:{
      start(){if(!isOn()||this.g)return;const c=ac();if(!c)return;
        const g=c.createGain();g.gain.setValueAtTime(0.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.06,c.currentTime+1.5);g.connect(c.destination);
        const n=c.createBufferSource();n.buffer=noiseBuf(c);n.loop=true;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=520;
        const l=c.createOscillator(),lg=c.createGain();l.frequency.value=.18;lg.gain.value=220;l.connect(lg);lg.connect(f.frequency);
        n.connect(f).connect(g);n.start();l.start();
        const bub=()=>{if(!this.g)return;const t=c.currentTime,o=c.createOscillator(),bg=c.createGain(),fr=500+Math.random()*700;
          o.type='sine';o.frequency.setValueAtTime(fr,t);o.frequency.exponentialRampToValueAtTime(fr*2.2,t+.06);
          bg.gain.setValueAtTime(0.0001,t);bg.gain.exponentialRampToValueAtTime(.05,t+.01);bg.gain.exponentialRampToValueAtTime(0.0001,t+.08);
          o.connect(bg).connect(c.destination);o.start(t);o.stop(t+.1);this.timer=setTimeout(bub,700+Math.random()*1600);};
        Object.assign(this,{g,nodes:[n,l]});this.timer=setTimeout(bub,900);},
      stop(){if(!this.g)return;clearTimeout(this.timer);const c=ac(),t=c.currentTime;this.g.gain.setTargetAtTime(0.0001,t,.25);this.nodes.forEach(x=>{try{x.stop(t+1.2)}catch(e){}});this.g=null;}
    },
    /* Bakgrundsljud för Skattjakten och Bubbeljakten: start('tradgarden' | 'grottan' | 'vintern' | 'havet' | 'djungel' | 'godis' | 'vulkan' | 'slott'), stop() */
    ambient:{
      start(kind){if(!isOn())return;this.stop(true);const c=ac();if(!c)return;
        const g=c.createGain();g.gain.setValueAtTime(0.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(1,c.currentTime+2);g.connect(c.destination);
        const nodes=[],self=this;this.g=g;this.nodes=nodes;this.kind=kind;
        const later=(fn,min,max)=>{self.timer=setTimeout(()=>{if(self.g!==g)return;fn();later(fn,min,max);},min+Math.random()*(max-min));};
        /* brus genom ett filter, med en långsam svängning: vind */
        const wind=(type,freq,q,vol,lfoHz,lfoAmt)=>{const n=c.createBufferSource();n.buffer=noiseBuf(c);n.loop=true;const f=c.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;
          const wg=c.createGain();wg.gain.value=vol;const l=c.createOscillator(),lg=c.createGain();l.frequency.value=lfoHz;lg.gain.value=lfoAmt;l.connect(lg);lg.connect(f.frequency);
          const l2=c.createOscillator(),lg2=c.createGain();l2.frequency.value=lfoHz*.7;lg2.gain.value=vol*.6;l2.connect(lg2);lg2.connect(wg.gain);
          n.connect(f).connect(wg).connect(g);n.start();l.start();l2.start();nodes.push(n,l,l2);};
        const blip=(fr,t0,dur,vol,to,dest)=>{const t=c.currentTime+t0,o=c.createOscillator(),bg=c.createGain();o.type='sine';o.frequency.setValueAtTime(fr,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);
          bg.gain.setValueAtTime(0.0001,t);bg.gain.exponentialRampToValueAtTime(vol,t+.012);bg.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(bg).connect(dest||g);o.start(t);o.stop(t+dur+.05);};
        if(kind==='tradgarden'){
          wind('lowpass',500,.7,.025,.08,180);
          later(()=>{const b=2300+Math.random()*1400,n=2+Math.floor(Math.random()*4);for(let i=0;i<n;i++)blip(b*(1+Math.random()*.12),i*.11,.08,.035,b*1.4);},1800,5200);
        }else if(kind==='grottan'){
          [55,82.4].forEach((fr,i)=>{const o=c.createOscillator(),og=c.createGain();o.type='sine';o.frequency.value=fr;og.gain.value=i?.012:.02;o.connect(og).connect(g);o.start();nodes.push(o);});
          wind('lowpass',260,.5,.02,.05,80);
          /* droppar med eko */
          const d=c.createDelay(1.5),fb=c.createGain(),eg=c.createGain();d.delayTime.value=.42;fb.gain.value=.38;eg.gain.value=.6;d.connect(fb).connect(d);d.connect(eg).connect(g);
          later(()=>{const fr=1300+Math.random()*900;blip(fr,0,.09,.06,fr*.45);blip(fr,0,.09,.05,fr*.45,d);},1400,4200);
        }else if(kind==='djungel'){
          /* Bubbeljakten i djungeln: varm vind, många fåglar och ibland ett dovt hoande */
          wind('lowpass',650,.7,.025,.09,200);
          later(()=>{const b=1800+Math.random()*2200,n=2+Math.floor(Math.random()*5);for(let i=0;i<n;i++)blip(b*(1+Math.random()*.2),i*.09,.07,.03,b*(Math.random()<.5?1.5:.7));},900,3200);
          later(()=>{blip(330,0,.35,.03,270);blip(330,.45,.35,.025,270);},7000,15000);
        }else if(kind==='godis'){
          /* Godislandet: en speldosa som spelar lugna toner */
          const N=[523.3,587.3,659.3,784,880,1046.5,1174.7];
          later(()=>{const f=N[Math.floor(Math.random()*N.length)];blip(f,0,.9,.02);if(Math.random()<.4)blip(f*1.5,.25,.7,.012);},500,1300);
        }else if(kind==='vulkan'){
          /* Vulkanön: mullrande djup ton och knastrande glöd */
          [41,55].forEach((fr,i)=>{const o=c.createOscillator(),og=c.createGain();o.type='sine';o.frequency.value=fr;og.gain.value=i?.02:.03;o.connect(og).connect(g);o.start();nodes.push(o);});
          wind('lowpass',180,.6,.05,.07,90);
          later(()=>{const n=2+Math.floor(Math.random()*5);for(let i=0;i<n;i++)blip(2500+Math.random()*2500,i*.04+Math.random()*.03,.02,.02);},400,1600);
        }else if(kind==='slott'){
          /* Slottet: vind runt tornen och facklor som sprakar */
          wind('bandpass',520,.7,.03,.08,220);
          later(()=>{const n=1+Math.floor(Math.random()*4);for(let i=0;i<n;i++)blip(1800+Math.random()*2200,i*.05,.025,.015);},600,2200);
        }else if(kind==='havet'){
          /* Bubbeljakten under vatten: dovt brus som sväller och små bubblor */
          wind('lowpass',300,.6,.035,.06,110);
          later(()=>{const n=1+Math.floor(Math.random()*4);for(let i=0;i<n;i++){const fr=420+Math.random()*600;blip(fr,i*.09,.07,.02,fr*2.1);}},1500,4500);
        }else{
          wind('bandpass',700,.8,.05,.11,450);
          later(()=>{const fr=2800+Math.random()*1600;blip(fr,0,.5,.012);blip(fr*1.5,.07,.45,.008);},4000,9000);
        }},
      stop(quick){clearTimeout(this.timer);if(!this.g)return;const c=ac(),t=c.currentTime,g=this.g;g.gain.setTargetAtTime(0.0001,t,quick?.05:.4);this.nodes.forEach(x=>{try{x.stop(t+(quick?.3:2))}catch(e){}});this.g=null;}
    },
    /* Rymdmatta för 3D-solsystemet: djupa toner, långsamma svävande ackord och lite glitter med eko */
    rymd:{
      start(){if(!isOn()||this.g)return;const c=ac();if(!c)return;
        const g=c.createGain();g.gain.setValueAtTime(0.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.55,c.currentTime+4);g.connect(c.destination);
        const nodes=[],self=this;this.g=g;this.nodes=nodes;
        /* eko för ackord och glitter */
        const d=c.createDelay(2),fb=c.createGain(),eg=c.createGain();d.delayTime.value=.6;fb.gain.value=.45;eg.gain.value=.5;d.connect(fb).connect(d);d.connect(eg).connect(g);
        /* djup grundton som andas långsamt */
        const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=240;lp.Q.value=.6;const dg=c.createGain();dg.gain.value=.05;lp.connect(dg).connect(g);
        [55,55.4,82.4].forEach(fr=>{const o=c.createOscillator();o.type='triangle';o.frequency.value=fr;o.connect(lp);o.start();nodes.push(o);});
        const l=c.createOscillator(),lg=c.createGain();l.frequency.value=.05;lg.gain.value=140;l.connect(lg).connect(lp.frequency);l.start();nodes.push(l);
        /* ackord som kommer och går (Am9, Fmaj7, Cmaj7, Em7) */
        const CH=[[220,261.6,329.6,493.9],[174.6,220,261.6,329.6],[130.8,196,246.9,329.6],[164.8,196,246.9,293.7]];let k=0;
        const pad=()=>{if(self.g!==g)return;const t=c.currentTime;CH[k++%CH.length].forEach((fr,i)=>{[0,4].forEach(det=>{const o=c.createOscillator(),og=c.createGain();o.type='sine';o.frequency.value=fr*(1+det/1200);
            og.gain.setValueAtTime(0.0001,t);og.gain.exponentialRampToValueAtTime(.018,t+3+i*.3);og.gain.exponentialRampToValueAtTime(0.0001,t+10);o.connect(og);og.connect(g);og.connect(d);o.start(t);o.stop(t+10.2);});});
          self.timer=setTimeout(pad,8000);};
        pad();
        /* glitter: höga, mjuka toner med eko */
        const glit=()=>{if(self.g!==g)return;const t=c.currentTime,fr=[1318.5,1568,1760,1975.5,2349.3][Math.floor(Math.random()*5)],o=c.createOscillator(),og=c.createGain();o.type='sine';o.frequency.value=fr;
          og.gain.setValueAtTime(0.0001,t);og.gain.exponentialRampToValueAtTime(.012,t+.02);og.gain.exponentialRampToValueAtTime(0.0001,t+1.6);o.connect(og);og.connect(d);og.connect(g);o.start(t);o.stop(t+1.7);
          self.timer2=setTimeout(glit,2500+Math.random()*5000);};
        self.timer2=setTimeout(glit,3000);},
      stop(){clearTimeout(this.timer);clearTimeout(this.timer2);if(!this.g)return;const c=ac(),t=c.currentTime;this.g.gain.setTargetAtTime(0.0001,t,.6);this.nodes.forEach(x=>{try{x.stop(t+3)}catch(e){}});this.g=null;}
    },
    stopLoops(){this.engine.stop();this.space.stop();this.water.stop();this.ambient.stop(true);this.rymd.stop();}
  };
  function croakPulse(c,start){
    const t=c.currentTime+start,o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain(),am=c.createOscillator(),ag=c.createGain();
    o.type='sawtooth';o.frequency.setValueAtTime(115,t);o.frequency.exponentialRampToValueAtTime(80,t+.12);
    f.type='bandpass';f.frequency.value=650;f.Q.value=2.5;
    am.frequency.value=38;ag.gain.value=.5;am.connect(ag);ag.connect(g.gain);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(.35,t+.015);g.gain.exponentialRampToValueAtTime(0.0001,t+.13);
    o.connect(f).connect(g).connect(c.destination);o.start(t);am.start(t);o.stop(t+.16);am.stop(t+.16);
  }
  let nb=null;
  function noiseBuf(c){if(nb)return nb;nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return nb;}
  function noiseBurst(c,start,dur,freq,q,vol,toFreq){
    const t=c.currentTime+start,src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
    src.buffer=noiseBuf(c);f.type='bandpass';f.frequency.setValueAtTime(freq,t);if(toFreq)f.frequency.exponentialRampToValueAtTime(toFreq,t+dur);f.Q.value=q;
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.02);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    src.connect(f).connect(g).connect(c.destination);src.start(t);src.stop(t+dur+.05);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)Ljud.stopLoops();});
  window.Ljud=Ljud;
})();
