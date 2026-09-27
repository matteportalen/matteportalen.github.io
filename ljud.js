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
    stopLoops(){this.engine.stop();this.space.stop();}
  };
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
