(function(){
"use strict";
/* ---------- helpers ---------- */
const $  = (s,c)=> (c||document).querySelector(s);
const $$ = (s,c)=> Array.prototype.slice.call((c||document).querySelectorAll(s));
const clamp = (v,a,b)=> Math.min(b, Math.max(a,v));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mqMobile = matchMedia('(max-width: 960px)');
const pad2 = n=> String(n).padStart(2,'0');
const pad3 = n=> String(n).padStart(3,'0');

function toast(msg, ms){
  const box = $('#toasts');
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  box.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=> t.remove(), 350); }, ms || 3000);
}

/* ---------- Oslo clock ---------- */
const clockEl = $('#clock');
function tickClock(){
  let s;
  try{ s = new Date().toLocaleTimeString('en-GB',{hour12:false,timeZone:'Europe/Oslo'}); }
  catch(e){ s = new Date().toLocaleTimeString('en-GB',{hour12:false}); }
  clockEl.textContent = 'OSLO ' + s;
}
tickClock(); setInterval(tickClock, 1000);

/* ---------- rosette path helper ---------- */
function starPath(cx,cy,R,r,n){
  let d = '';
  for(let i=0; i<n*2; i++){
    const rad = i%2 ? r : R;
    const a = Math.PI*i/n - Math.PI/2;
    d += (i ? 'L' : 'M') + (cx+Math.cos(a)*rad).toFixed(1) + ' ' + (cy+Math.sin(a)*rad).toFixed(1) + ' ';
  }
  return d + 'Z';
}
 $$('.tin-rose').forEach(el=> el.setAttribute('d', starPath(228, 282, 25, 15, 14)));

/* ---------- HERO: kinetic variable-font name ---------- */
const heroLetters = [];
let heroT0 = null, mx = -9999;

(function buildHero(){
  $$('.hline').forEach(line=>{
    const word = line.dataset.word || '';
    line.textContent = '';
    word.split('').forEach(ch=>{
      const s = document.createElement('span');
      s.className = 'hl'; s.textContent = ch;
      s.style.transform = 'translate3d(0,112%,0)';
      s.style.fontVariationSettings = "'wght' 100, 'wdth' 62";
      s.addEventListener('pointerdown', ()=>{
        s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump');
      });
      line.appendChild(s);
      heroLetters.push({ el:s, i:heroLetters.length, cx:0 });
    });
  });
  const measure = ()=> heroLetters.forEach(L=>{
    const r = L.el.getBoundingClientRect(); L.cx = r.left + r.width/2;
  });
  measure();
  addEventListener('resize', measure);
  addEventListener('pointermove', e=>{ mx = e.clientX; }, {passive:true});
  const start = ()=>{ if(heroT0 === null) heroT0 = performance.now()/1000; measure(); };
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(start).catch(start);
  setTimeout(start, 1600);
  if(RM){
    heroLetters.forEach(L=>{
      L.el.style.transform = 'none';
      L.el.style.fontVariationSettings = "'wght' 900, 'wdth' 118";
    });
  }
})();

function heroTick(t){
  if(heroT0 === null || RM) return;
  if(scrollY > innerHeight * 1.25) return;
  const et = t - heroT0;
  const back = x=>{ const c1=1.70158, c3=c1+1; return 1 + c3*Math.pow(x-1,3) + c1*Math.pow(x-1,2); };
  for(const L of heroLetters){
    const a = clamp((et - .15 - L.i*.06)/.9, 0, 1);
    const ease = 1 - Math.pow(1-a, 3);
    const b = a < 1 ? back(a) : 1;
    const g = a >= 1 ? Math.exp(-Math.pow((mx - L.cx)/140, 2)) : 0;
    const wave = a >= 1 ? Math.sin(t*1.7 - L.i*.55)*7 : 0;
    L.el.style.transform = 'translate3d(0,' + ((1-ease)*112 - g*1.6).toFixed(2) + '%,0)';
    const wd = clamp(62 + 63*b + wave + g*18, 62, 125);
    const wg = clamp(100 + 800*b, 100, 900);
    L.el.style.fontVariationSettings = "'wght' " + (wg|0) + ", 'wdth' " + (wd|0);
  }
}

/* ---------- RISOGRAPH CURSOR TRAIL ---------- */
const tc = $('#trail'), tx = tc.getContext('2d');
let dots = [];
function sizeTrail(){ tc.width = innerWidth; tc.height = innerHeight; }
sizeTrail(); addEventListener('resize', sizeTrail);
function mkDot(x, y){
  return { x:x, y:y, r:.8+Math.random()*2.6, a:.5,
           vx:(Math.random()-.5)*10, vy:(Math.random()-.5)*10-6,
           red: Math.random() < .8 };
}
if(!RM){
  addEventListener('pointermove', e=>{
    if(e.pointerType && e.pointerType !== 'mouse') return;
    if(Math.random() < .85) dots.push(mkDot(e.clientX, e.clientY));
    if(dots.length > 240) dots.splice(0, dots.length - 240);
  }, {passive:true});
  addEventListener('pointerdown', e=>{
    for(let i=0;i<14;i++){
      const a = Math.random()*6.283, d = Math.random()*34;
      dots.push(mkDot(e.clientX+Math.cos(a)*d, e.clientY+Math.sin(a)*d));
    }
  }, {passive:true});
}
function trailTick(dt){
  if(!dots.length){ return; }
  tx.clearRect(0, 0, tc.width, tc.height);
  for(let i=dots.length-1; i>=0; i--){
    const p = dots[i];
    p.a -= dt*.55;
    if(p.a <= 0){ dots.splice(i,1); continue; }
    p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 14*dt;
    tx.globalAlpha = Math.max(0, p.a)*.8;
    tx.fillStyle = p.red ? '#EE3A1C' : '#1C39BB';
    tx.beginPath(); tx.arc(p.x, p.y, p.r, 0, 6.283); tx.fill();
  }
  tx.globalAlpha = 1;
}

/* ---------- FILM STRIPS: scrub the inks ---------- */
class Filmstrip{
  constructor(spread){
    this.spread = spread;
    this.vp = $('.fs-vp', spread);
    this.track = $('.fs-track', spread);
    this.cur = $('.fs-cur', spread);
    this.chip = $('.chip', spread);
    this.data = JSON.parse(spread.dataset.palette);
    this.N = this.data.length;
    this.x = 0; this.v = 0; this.drag = false; this.snap = null; this.idx = -1; this.hover = false;
    let html = '';
    for(let c=0; c<4; c++){
      this.data.forEach((f,i)=>{
        html += '<div class="fs-frame"><div class="fs-color" style="background:'+f.h+'"></div>'+
                '<div class="fs-label"><span>'+pad2(i+1)+'</span><span>'+f.n+'</span></div></div>';
      });
    }
    this.track.innerHTML = html;
    this.metrics();
    this.bind();
    this.center(0, true);
    this.apply();
    this.vp.addEventListener('pointerenter', ()=> this.hover = true);
    this.vp.addEventListener('pointerleave', ()=> this.hover = false);
  }
  metrics(){
    const c = this.track.children;
    this.fw = c[1].offsetLeft - c[0].offsetLeft;
    this.W = this.fw * this.N;
    this.vw = this.vp.clientWidth;
  }
  bind(){
    const vp = this.vp;
    let lx = 0, moved = 0, lt = 0;
    vp.addEventListener('pointerdown', e=>{
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      this.drag = true; this.snap = null; this.v = 0;
      lx = e.clientX; moved = 0; lt = performance.now();
    });
    vp.addEventListener('pointermove', e=>{
      if(!this.drag) return;
      const now = performance.now(), dt = Math.max(8, now - lt); lt = now;
      const dx = e.clientX - lx; lx = e.clientX;
      this.x += dx; moved += Math.abs(dx);
      this.v = .8*this.v + .2*(dx/dt*1000);
      this.wrap(); this.apply();
    });
    const up = e=>{
      if(!this.drag) return;
      this.drag = false;
      if(moved < 6){ // a tap: snap the tapped frame to the playhead
        const r = vp.getBoundingClientRect();
        this.snapTo(this.x - (e.clientX - r.left - this.vw/2));
      } else if(Math.abs(this.v) < 140){
        this.snapNearest();
      }
    };
    vp.addEventListener('pointerup', up);
    vp.addEventListener('pointercancel', up);
  }
  wrap(){
    const min = this.vw - 4*this.W;
    let guard = 0;
    while(this.x > 0 && guard++ < 30) this.x -= this.W;
    while(this.x < min && guard++ < 60) this.x += this.W;
  }
  center(i, silent){
    this.x = this.vw/2 - this.fw/2 - (2*this.N + i)*this.fw;
    if(!silent){ this.wrap(); this.apply(); }
  }
  snapNearest(){
    const i = Math.round((this.vw/2 - this.fw/2 - this.x)/this.fw);
    this.snapTo(this.vw/2 - this.fw/2 - i*this.fw);
  }
  snapTo(target){ this.snap = target; }
  apply(){
    this.track.style.transform = 'translate3d(' + this.x.toFixed(2) + 'px,0,0)';
    const fi = (this.vw/2 - this.fw/2 - this.x)/this.fw;
    const i = ((Math.round(fi) % this.N) + this.N) % this.N;
    if(i !== this.idx){
      this.idx = i;
      const f = this.data[i];
      this.cur.textContent = pad2(i+1) + ' — ' + f.n + ' · ' + f.c;
      this.chip.style.background = f.h;
      this.spread.style.setProperty('--read', f.h);
    }
  }
  tick(dt){
    if(!this.spread.classList.contains('is-active')) return;
    if(this.snap !== null){
      const d = this.snap - this.x;
      this.x += d * Math.min(1, dt*8);
      if(Math.abs(d) < .5){ this.x = this.snap; this.snap = null; this.v = 0; }
      this.apply(); return;
    }
    if(this.drag) return;
    if(Math.abs(this.v) > 60){
      this.x += this.v*dt; this.v *= Math.exp(-3.2*dt);
      this.wrap(); this.apply();
      if(Math.abs(this.v) <= 60) this.snapNearest();
    } else if(!RM && !this.hover){
      this.x -= 9*dt; // projector idle drift
      this.wrap(); this.apply();
    }
  }
  resize(){ this.metrics(); this.wrap(); this.apply(); }
}
const strips = $$('.spread[data-palette]').map(sp=> new Filmstrip(sp));

/* ---------- WORK: scroll-driven spreads ---------- */
const work = $('#work');
const panels = $$('.spread');

function updateWork(){
  const vh = innerHeight;
  const r = work.getBoundingClientRect();
  const total = Math.max(1, work.offsetHeight - vh);
  const p = clamp(-r.top/total, 0, 1);
  const pos = p * (panels.length - 1);
  panels.forEach((el,i)=>{
    const t = i - pos, av = Math.abs(t);
    if(av > 1.06){
      if(el.style.visibility !== 'hidden'){ el.style.visibility = 'hidden'; el.classList.remove('is-active'); }
      return;
    }
    el.style.visibility = 'visible';
    el.style.opacity = clamp(1 - av*1.45, 0, 1).toFixed(3);
    el.style.transform = 'translate3d(' + (t*5).toFixed(2) + 'vw,0,0)';
    el.style.pointerEvents = av < .5 ? 'auto' : 'none';
    el.classList.toggle('is-active', av < .5);
  });
  return clamp(Math.round(pos), 0, panels.length-1);
}

/* cover index jumps */
 $$('.cv-item').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const i = +btn.dataset.i;
    const total = work.offsetHeight - innerHeight;
    scrollTo({ top: work.offsetTop + i/(panels.length-1)*total, behavior: RM ? 'auto' : 'smooth' });
  });
});

/* arrow keys turn the spreads */
addEventListener('keydown', e=>{
  if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const r = work.getBoundingClientRect();
  if(r.top > 0 || r.bottom < innerHeight) return;
  e.preventDefault();
  const total = work.offsetHeight - innerHeight;
  const cur = Math.round(clamp(-r.top/total, 0, 1) * (panels.length-1));
  const nxt = clamp(cur + (e.key === 'ArrowRight' ? 1 : -1), 0, panels.length-1);
  scrollTo({ top: work.offsetTop + nxt/(panels.length-1)*total, behavior: RM ? 'auto' : 'smooth' });
});

/* ---------- FOLIO / SECTION TRACKING ---------- */
const fPages = $('#fPages'), fSec = $('#fSec'), fBar = $('#fBar');
const SECT = [
  ['top','Cover',1,2],
  ['manifesto','Margin note',3,4],
  ['work',null,0,0],
  ['type','Type specimens',15,18],
  ['talks','Lectures & talks',19,22],
  ['contact','Colophon',23,24]
];
function render(){
  const idx = updateWork();
  const vh = innerHeight, mid = scrollY + vh*.5;
  let sec = 'top', name = 'Cover', pages = [1,2];
  for(const s of SECT){
    const el = document.getElementById(s[0]);
    if(el && el.offsetTop <= mid){
      sec = s[0];
      if(s[1]){ name = s[1]; pages = [s[2], s[3]]; }
    }
  }
  if(sec === 'work'){
    pages = [5 + idx*2, 6 + idx*2];
    name = 'Spread ' + pad2(idx) + '/04 — ' + panels[idx].dataset.title;
  }
  document.body.dataset.section = sec;
  fPages.textContent = 'P. ' + pad3(pages[0]) + (pages[1] !== pages[0] ? '–' + pad3(pages[1]) : '');
  fSec.textContent = name;
  const dh = document.documentElement.scrollHeight - vh;
  fBar.style.width = (dh > 0 ? scrollY/dh*100 : 0) + '%';
}
let pending = false;
addEventListener('scroll', ()=>{
  if(pending) return;
  pending = true;
  requestAnimationFrame(()=>{ render(); pending = false; });
}, {passive:true});
addEventListener('resize', ()=>{
  render();
  strips.forEach(s=> s.resize());
  layoutSheets();
});
render();

/* ---------- GROTESK: live glyph morph ---------- */
const gGlyph = $('#gGlyph'), gW = $('#gW'), gD = $('#gD');
function glyphTick(t){
  if(!gGlyph || RM) return;
  if(!$('#sp-grotesk').classList.contains('is-active')) return;
  const w = 900 - 800*(.5 + .5*Math.sin(t*.8));
  const d = 125 - 63*(.5 + .5*Math.sin(t*.53 + 1.4));
  gGlyph.style.fontVariationSettings = "'wght' " + (w|0) + ", 'wdth' " + (d|0);
  gW.textContent = String(w|0);
  gD.textContent = String(d|0);
}

/* ---------- SPECIMEN SHEETS: drag / pinch / ctrl+wheel ---------- */
const board = $('#board');
const wraps = $$('.sheet-wrap', board);
const sheetState = wraps.map(w=>({ w:w, x:0, y:0, s:1, r:0, ptrs:new Map(), drag:false, pinch:null }));

function writeSheet(st){
  if(!mqMobile.matches){
    st.w.style.transform = 'translate(' + st.x.toFixed(1) + 'px,' + st.y.toFixed(1) + 'px) rotate(' + st.r.toFixed(2) + 'deg) scale(' + st.s.toFixed(3) + ')';
  }
  const sc = $('.sh-scale', st.w);
  if(sc) sc.textContent = 'Scale ' + Math.round(st.s*100) + '%';
}
function fitSheet(st){
  const bw = board.clientWidth, bh = board.clientHeight;
  const sw = st.w.offsetWidth * st.s, sh = st.w.offsetHeight * st.s;
  st.x = clamp(st.x, -sw*.5, Math.max(-sw*.5, bw - sw*.55));
  st.y = clamp(st.y, -sh*.35, Math.max(-sh*.35, bh - sh*.5));
}
function layoutSheets(){
  sheetState.forEach(st=>{
    if(mqMobile.matches){ st.w.style.transform = ''; return; }
    st.x = parseFloat(st.w.dataset.x)/100 * board.clientWidth;
    st.y = parseFloat(st.w.dataset.y)/100 * board.clientHeight;
    st.r = parseFloat(st.w.dataset.r || 0);
    st.s = 1;
    writeSheet(st);
  });
}
layoutSheets();

wraps.forEach(wrap=>{
  const st = sheetState[wraps.indexOf(wrap)];
  wrap.addEventListener('pointerdown', e=>{
    if(mqMobile.matches) return;
    if(e.target.closest('button,a')) return;
    e.preventDefault();
    wrap.setPointerCapture(e.pointerId);
    st.ptrs.set(e.pointerId, {x:e.clientX, y:e.clientY});
    wraps.forEach(o=> o.style.zIndex = 1);
    wrap.style.zIndex = 2;
    wrap.classList.add('drag');
    if(st.ptrs.size === 2){
      const p = Array.from(st.ptrs.values());
      st.pinch = {
        d: Math.hypot(p[0].x-p[1].x, p[0].y-p[1].y),
        a: Math.atan2(p[1].y-p[0].y, p[1].x-p[0].x),
        s: st.s, r: st.r,
        cx: (p[0].x+p[1].x)/2, cy: (p[0].y+p[1].y)/2,
        ox: st.x, oy: st.y
      };
    } else {
      st.drag = true; st.px = e.clientX; st.py = e.clientY;
    }
  });
  wrap.addEventListener('pointermove', e=>{
    if(!st.ptrs.has(e.pointerId)) return;
    st.ptrs.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if(st.ptrs.size >= 2 && st.pinch){
      const p = Array.from(st.ptrs.values());
      const d = Math.hypot(p[0].x-p[1].x, p[0].y-p[1].y);
      const a = Math.atan2(p[1].y-p[0].y, p[1].x-p[0].x);
      st.s = clamp(st.pinch.s * d/st.pinch.d, .55, 1.9);
      st.r = clamp(st.pinch.r + (a - st.pinch.a)*180/Math.PI, -25, 25);
      const cx = (p[0].x+p[1].x)/2, cy = (p[0].y+p[1].y)/2;
      st.x = st.pinch.ox + cx - st.pinch.cx;
      st.y = st.pinch.oy + cy - st.pinch.cy;
      fitSheet(st); writeSheet(st);
    } else if(st.drag){
      st.x += e.clientX - st.px;
      st.y += e.clientY - st.py;
      st.px = e.clientX; st.py = e.clientY;
      fitSheet(st); writeSheet(st);
    }
  });
  const up = e=>{
    st.ptrs.delete(e.pointerId);
    if(st.ptrs.size < 2) st.pinch = null;
    if(st.ptrs.size === 1){ // back to one finger: keep dragging without a jump
      const p = Array.from(st.ptrs.values())[0];
      st.drag = true; st.px = p.x; st.py = p.y;
    }
    if(st.ptrs.size === 0){ st.drag = false; wrap.classList.remove('drag'); }
  };
  wrap.addEventListener('pointerup', up);
  wrap.addEventListener('pointercancel', up);
  wrap.addEventListener('wheel', e=>{
    if(mqMobile.matches) return;
    if(!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    st.s = clamp(st.s * (1 - e.deltaY*.002), .55, 1.9);
    writeSheet(st);
  }, {passive:false});
  wrap.addEventListener('dblclick', ()=>{
    if(mqMobile.matches) return;
    st.s = 1; st.r = parseFloat(wrap.dataset.r || 0);
    fitSheet(st); writeSheet(st);
    toast('Sheet reset — scale 100%');
  });
});

/* ---------- SPECIMEN PDF GENERATION ---------- */
const SPECS = {
  grotesk:{
    file:'VossFoundry_GroteskNor_Specimen.pdf', no:'01', name:'GROTESK NOR',
    fam:'Archivo', w:'900', giant:'Ag',
    sets:['ABCDEFGHIJKLMNOPQRSTUVWXYZ ÆØÅ','abcdefghijklmnopqrstuvwxyz æøå','0123456789 (!?&#@;:—/%)'],
    wf:[['Havnebrygg',72],['Tidevann',50],['Sjømerke',36],['Kai 12',26]],
    meta:'9 STYLES + VARIABLE · WDTH 62–125 · WGHT 100–900 · LATIN EXT · 2024',
    loads:['900 100px Archivo','700 100px Archivo']
  },
  tittel:{
    file:'VossFoundry_Tittel_Specimen.pdf', no:'02', name:'TITTEL',
    fam:'Fraunces', w:'900', giant:'Qh',
    sets:['ABCDEFGHIJKLMNOPQRSTUVWXYZ ÆØÅ','abcdefghijklmnopqrstuvwxyz æøå','0123456789 (?¡!;:¿—«»)'],
    wf:[['Ankerplass',66],['Fyrtårn',48],['Bølge',34],['Vind',24]],
    meta:'2 STYLES + ITALIC · OPTICAL 9–144 · WGHT 100–900 · 2023',
    loads:['900 100px Fraunces','italic 600 100px Fraunces']
  },
  mono:{
    file:'VossFoundry_KommentarMono_Specimen.pdf', no:'03', name:'KOMMENTAR MONO',
    fam:'"Space Mono"', w:'700', giant:'@{',
    sets:['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz','0123456789 {}[]<>=+*#%'],
    wf:[['if (ink > paper)',46],['mono 12 pt',34],['grid.lock()',26],['tab. 1998',20]],
    meta:'2 STYLES + ITALIC · FIXED 600 UPM · 2021',
    loads:['700 100px "Space Mono"','400 100px "Space Mono"']
  }
};

async function makePDF(key){
  const s = SPECS[key];
  if(!s) return;
  if(!window.jspdf){ toast('PDF engine offline — check connection'); return; }
  toast('Setting type — ' + s.name + '…');
  try{ await Promise.all(s.loads.map(f=> document.fonts.load(f))); }catch(e){}
  const W = 1191, H = 1684, SC = 1.6;
  const c = document.createElement('canvas');
  c.width = W*SC; c.height = H*SC;
  const x = c.getContext('2d');
  x.scale(SC, SC);
  x.fillStyle = '#F4F0E6'; x.fillRect(0, 0, W, H);
  // crop marks
  x.strokeStyle = '#17140E'; x.lineWidth = 1.4;
  const cm = (cx,cy,dx,dy)=>{ x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+dx*26,cy); x.moveTo(cx,cy); x.lineTo(cx,cy+dy*26); x.stroke(); };
  cm(48,48,1,1); cm(W-48,48,-1,1); cm(48,H-48,1,-1); cm(W-48,H-48,-1,-1);
  // header
  x.fillStyle = '#17140E'; x.font = '14px "Space Mono"'; x.textBaseline = 'alphabetic';
  x.fillText('VOSS FOUNDRY — TYPE SPECIMEN', 84, 104);
  x.textAlign = 'right'; x.fillText('OSLO · 2025', W-84, 104); x.textAlign = 'left';
  x.lineWidth = 2; x.beginPath(); x.moveTo(84,122); x.lineTo(W-84,122); x.stroke();
  // rosette
  x.fillStyle = '#EE3A1C';
  x.fill(new Path2D(starPath(W-130, 180, 44, 27, 16)));
  // name
  x.fillStyle = '#17140E'; x.font = s.w + ' 84px ' + s.fam;
  x.fillText(s.name, 84, 240);
  x.fillStyle = '#EE3A1C'; x.font = '13px "Space Mono"';
  x.fillText('SPECIMEN SHEET N°' + s.no, 84, 270);
  x.fillRect(84, 286, W-168, 5);
  // giant glyph with metric guides
  const gy = 760;
  x.strokeStyle = 'rgba(23,20,14,.3)'; x.lineWidth = 1;
  [[gy-330,'CAP 700'],[gy-150,'X 510'],[gy,'BASE 0'],[gy+92,'DESC −190']].forEach(g=>{
    x.beginPath(); x.moveTo(84, g[0]); x.lineTo(W-84, g[0]); x.stroke();
    x.fillStyle = 'rgba(23,20,14,.55)'; x.font = '11px "Space Mono"';
    x.fillText(g[1], W-170, g[0]-8);
  });
  x.fillStyle = '#EE3A1C'; x.font = s.w + ' 400px ' + s.fam;
  x.fillText(s.giant, 100, gy);
  // character sets
  let yy = 940;
  x.fillStyle = '#17140E';
  x.font = s.w + ' 34px ' + s.fam; x.fillText(s.sets[0], 84, yy); yy += 52;
  x.font = s.w + ' 26px ' + s.fam; x.fillText(s.sets[1], 84, yy); yy += 44;
  x.font = s.w + ' 20px ' + s.fam; x.fillText(s.sets[2], 84, yy); yy += 64;
  x.strokeStyle = 'rgba(23,20,14,.25)'; x.beginPath(); x.moveTo(84, yy-36); x.lineTo(W-84, yy-36); x.stroke();
  // waterfall
  s.wf.forEach(l=>{
    yy += l[1];
    if(yy > H-150) return;
    x.fillStyle = '#17140E'; x.font = s.w + ' ' + l[1] + 'px ' + s.fam;
    x.fillText(l[0], 84, yy);
    x.fillStyle = 'rgba(23,20,14,.5)'; x.font = '11px "Space Mono"'; x.textAlign = 'right';
    x.fillText(l[1] + ' PT', W-84, yy);
    x.textAlign = 'left'; yy += 10;
  });
  // footer + barcode
  x.strokeStyle = '#17140E'; x.lineWidth = 1.6;
  x.beginPath(); x.moveTo(84, H-96); x.lineTo(W-84, H-96); x.stroke();
  x.fillStyle = '#17140E'; x.font = '11px "Space Mono"';
  x.fillText(s.meta, 84, H-70);
  x.fillStyle = '#EE3A1C';
  x.fillText('P. 0' + (14 + +s.no), 84, H-50);
  x.fillStyle = '#17140E';
  let bx = W-320;
  for(let i=0; i<36; i++){ const w2 = (i*7)%3 + 1.2; x.fillRect(bx, H-92, w2, 24); bx += w2 + 2.4; }
  // to PDF
  const jsPDF = window.jspdf.jsPDF;
  const pdf = new jsPDF({ unit:'pt', format:'a4', orientation:'portrait' });
  pdf.addImage(c.toDataURL('image/jpeg', .92), 'JPEG', 0, 0, 595.28, 841.89);
  pdf.save(s.file);
  toast('Saved — ' + s.file);
}
 $$('.dl-btn').forEach(b=> b.addEventListener('click', ()=> makePDF(b.dataset.dl)));

/* ---------- VIDEO PLAYER ---------- */
(function(){
  const v = $('#vid'), poster = $('#poster');
  const pbPlay = $('#pbPlay'), icoPlay = $('#icoPlay'), icoPause = $('#icoPause');
  const fill = $('#pbFill'), track = $('#pbTrack'), time = $('#pbTime');
  const icoSnd = $('#icoSnd'), icoMut = $('#icoMut');
  const fmt = t=>{
    if(!isFinite(t)) return '00:00';
    t = Math.max(0, t|0);
    return pad2(t/60|0) + ':' + pad2(t%60);
  };
  function setPB(){
    if(v.duration) fill.style.width = (v.currentTime/v.duration*100) + '%';
    time.textContent = fmt(v.currentTime) + ' / ' + fmt(v.duration);
  }
  v.addEventListener('timeupdate', setPB);
  v.addEventListener('loadedmetadata', setPB);
  v.addEventListener('play', ()=>{ poster.classList.add('off'); icoPlay.style.display='none'; icoPause.style.display=''; });
  v.addEventListener('pause', ()=>{ icoPlay.style.display=''; icoPause.style.display='none'; });
  v.addEventListener('ended', ()=> poster.classList.remove('off'));
  const toggle = ()=>{ if(v.paused) v.play().catch(()=>{}); else v.pause(); };
  $('#ppPlay').addEventListener('click', toggle);
  pbPlay.addEventListener('click', toggle);
  v.addEventListener('click', toggle);
  function seek(e){
    const r = track.getBoundingClientRect();
    const f = clamp((e.clientX - r.left)/r.width, 0, 1);
    if(v.duration) v.currentTime = f * v.duration;
  }
  track.addEventListener('pointerdown', e=>{
    track.setPointerCapture(e.pointerId);
    seek(e);
    const mv = ev=> seek(ev);
    track.addEventListener('pointermove', mv);
    track.addEventListener('pointerup', ()=> track.removeEventListener('pointermove', mv), {once:true});
  });
  $('#pbMute').addEventListener('click', ()=>{
    v.muted = !v.muted;
    icoSnd.style.display = v.muted ? 'none' : '';
    icoMut.style.display = v.muted ? '' : 'none';
  });
  $('#pbFull').addEventListener('click', ()=>{
    const p = $('#player');
    if(document.fullscreenElement){ document.exitFullscreen(); }
    else if(p.requestFullscreen){ p.requestFullscreen().catch(()=>{}); }
  });
  $$('.talk-row').forEach(row=>{
    row.addEventListener('click', ()=>{
      $$('.talk-row').forEach(r=> r.classList.remove('active'));
      row.classList.add('active');
      v.src = row.dataset.src;
      $('#ppKick').textContent = row.dataset.kick;
      $('#ppTitle').innerHTML = row.dataset.title;
      $('#ppNote').textContent = row.dataset.note;
      poster.classList.remove('off');
      v.play().catch(()=>{});
      toast('Now showing — ' + row.querySelector('.t-title').textContent.toUpperCase());
      if(mqMobile.matches) $('#player').scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
})();

/* ---------- REVEALS ---------- */
const io = new IntersectionObserver(es=>{
  es.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, {threshold:.2});
 $$('.rv, .mani-line').forEach(el=> io.observe(el));

/* ---------- MAIN LOOP ---------- */
let last = performance.now();
function loop(now){
  const dt = Math.min(.05, (now - last)/1000);
  last = now;
  heroTick(now/1000);
  trailTick(dt);
  strips.forEach(s=> s.tick(dt));
  glyphTick(now/1000);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- intro hint ---------- */
setTimeout(()=> toast('Tip — drag the specimen sheets · pinch to resize'), 2600);
})();
