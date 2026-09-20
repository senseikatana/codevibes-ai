(function(){
  "use strict";
  var video = document.getElementById('film');
  var track = document.getElementById('track');
  var panels = Array.prototype.slice.call(track.querySelectorAll('.panel'));
  var ghosts = Array.prototype.slice.call(track.querySelectorAll('.ghost'));
  var label = document.getElementById('chapterLabel');
  var dotsWrap = document.getElementById('dots');
  var fill = document.getElementById('progressFill');
  var tcNow = document.getElementById('tcNow');
  var tcDur = document.getElementById('tcDur');
  var hint = document.getElementById('hint');
  var idx = document.getElementById('idx');
  var idxNum = document.getElementById('idxNum');
  var idxTitle = document.getElementById('idxTitle');
  var loader = document.getElementById('loader');
  var lbar = loader.querySelector('.lbar i');
  var lpct = loader.querySelector('small');
  var docEl = document.documentElement;

  var titles = panels.map(function(p){ return p.dataset.title || ''; });
  var vh = window.innerHeight, trackH = 1, panelTops = [], ghostData = [];
  var duration = 30, ready = false, failed = false, curIdx = -1, loaderDone = false;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var K = reduced ? 1 : 0.12;

  var route = 'home';
  var pageIds = { home:'page-home', about:'page-about', contact:'page-contact' };
  var pageTitles = { home:'SINGHA — Nacida del Oro', about:'Nosotros — SINGHA', contact:'Contacto — SINGHA' };
  var pageLabels = { home:'Intro', about:'La casa', contact:'Contacto' };
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

  function currentRoute(){
    var h = (location.hash || '').replace(/^#\/?/, '').toLowerCase();
    if (h === 'nosotros' || h === 'about') return 'about';
    if (h === 'contacto' || h === 'contact') return 'contact';
    return 'home';
  }

  function measure(){
    vh = window.innerHeight;
    panelTops = panels.map(function(p){ return p.offsetTop; });
    trackH = Math.max(track.offsetHeight - vh, 1);
    ghostData = ghosts.map(function(g){ return { el:g, top:g.closest('.panel').offsetTop }; });
  }
  window.addEventListener('resize', measure, { passive:true });
  window.addEventListener('load', measure);
  measure();

  panels.forEach(function(p, i){
    var b = document.createElement('button');
    b.dataset.label = titles[i];
    b.setAttribute('aria-label', 'Ir a ' + titles[i]);
    b.addEventListener('click', function(){
      window.scrollTo({ top: panelTops[i] + 1, behavior: reduced ? 'auto' : 'smooth' });
    });
    dotsWrap.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function fmt(s){
    s = Math.max(0, Math.floor(s));
    return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
  }
  function setChapter(i){
    curIdx = i;
    label.style.opacity = 0;
    setTimeout(function(){ label.textContent = titles[i]; label.style.opacity = 1; }, 180);
    dots.forEach(function(d, j){ d.classList.toggle('act', j === i); });
    idxNum.textContent = String(i+1).padStart(2,'0');
    idxTitle.textContent = titles[i].toUpperCase();
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('on'); runCounters(e.target); }
      else e.target.classList.remove('on');
    });
  }, { threshold: 0.28, rootMargin: '-6% 0px -6% 0px' });
  panels.forEach(function(p){ io.observe(p); });

  var io2 = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('on'); runCounters(e.target); }
      else e.target.classList.remove('on');
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.page:not(#page-home) .rv').forEach(function(el){ io2.observe(el); });

  function runCounters(scope){
    var list = [];
    if (scope.hasAttribute && scope.hasAttribute('data-count')) list.push(scope);
    scope.querySelectorAll('[data-count]').forEach(function(el){ list.push(el); });
    list.forEach(function(el){
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var end = parseFloat(el.dataset.count);
      var dec = +(el.dataset.dec || 0);
      var t0 = performance.now(), dur = 1400;
      (function tick(now){
        var k = Math.min((now - t0) / dur, 1);
        var e = 1 - Math.pow(1 - k, 3);
        var val = (end * e).toFixed(dec);
        if (el.dataset.sep) val = val.replace('.', ',');
        el.textContent = val;
        if (k < 1) requestAnimationFrame(tick);
        else { val = end.toFixed(dec); if (el.dataset.sep) val = val.replace('.', ','); el.textContent = val; }
      })(t0);
    });
  }

  document.querySelectorAll('.bubbles').forEach(function(box){
    var n = +box.dataset.n || 16;
    for (var i = 0; i < n; i++){
      var b = document.createElement('i');
      var s = 6 + Math.random() * 22;
      b.style.cssText = 'left:' + (Math.random()*100).toFixed(1) + '%;width:' + s.toFixed(0) + 'px;height:' + s.toFixed(0) + 'px;animation-duration:' + (8 + Math.random()*10).toFixed(1) + 's;animation-delay:' + (-Math.random()*18).toFixed(1) + 's;';
      box.appendChild(b);
    }
  });

  function hideLoader(){
    if (loaderDone) return;
    loaderDone = true;
    loader.classList.add('done');
    setTimeout(function(){ if (loader.parentNode) loader.parentNode.removeChild(loader); }, 900);
  }
  function maybeReady(){
    if (loaderDone || !duration) return;
    var pct = 0;
    try { var b = video.buffered; if (b.length) pct = b.end(b.length - 1) / duration * 100; } catch(err){}
    lbar.style.width = Math.min(100, pct) + '%';
    lpct.textContent = 'Cargando la leyenda · ' + Math.min(100, Math.round(pct)) + '%';
    if (pct >= 55 || video.readyState >= 4){ ready = true; hideLoader(); syncVideoMode(); }
  }
  video.addEventListener('loadedmetadata', function(){
    duration = video.duration || 30;
    tcDur.textContent = fmt(duration);
    video.pause();
    ready = video.readyState >= 2;
    try { video.playbackRate = 16; MAX_RATE = Math.min(Math.max(video.playbackRate, 1), 8); video.playbackRate = 1; } catch(err){ MAX_RATE = 2; }
    maybeReady();
  });
  var MAX_RATE = 2;
  video.addEventListener('progress', maybeReady);
  video.addEventListener('canplaythrough', maybeReady);
  video.addEventListener('error', function(){
    failed = true; document.body.classList.add('no-video');
    lpct.textContent = 'Modo ambiente'; tcDur.textContent = fmt(duration); hideLoader();
  });
  setTimeout(function(){
    if (!loaderDone){ if (video.readyState >= 2){ ready = true; hideLoader(); syncVideoMode(); } else { failed = true; document.body.classList.add('no-video'); hideLoader(); } }
  }, 10000);

  ['waiting','stalled'].forEach(function(ev){ video.addEventListener(ev, function(){ document.body.classList.add('is-buffering'); }); });
  ['playing','canplay','seeked','pause'].forEach(function(ev){ video.addEventListener(ev, function(){ document.body.classList.remove('is-buffering'); }); });

  var seeking = false, pendingSeek = null, seekGuard = null;
  function clampT(t){ return Math.min(Math.max(t, 0), Math.max(duration - 0.05, 0)); }
  function applySeek(t){
    t = clampT(t); if (seeking){ pendingSeek = t; return; }
    if (Math.abs(t - video.currentTime) < 0.02) return;
    seeking = true; clearTimeout(seekGuard); seekGuard = setTimeout(flushSeek, 320);
    if (Math.abs(t - video.currentTime) > 1.2 && 'fastSeek' in video){ try { video.fastSeek(t); return; } catch(err){} }
    video.currentTime = t;
  }
  function flushSeek(){ seeking = false; if (pendingSeek !== null){ var t = pendingSeek; pendingSeek = null; applySeek(t); } }
  video.addEventListener('seeked', function(){ clearTimeout(seekGuard); flushSeek(); });

  function updateVideo(t){
    if (!ready || failed) return;
    var diff = t - video.currentTime; var ad = Math.abs(diff);
    if (ad < 0.02){ if (!video.paused) video.pause(); return; }
    if (ad > 1.6){ if (!video.paused) video.pause(); applySeek(t); return; }
    if (diff > 0 && ad > 0.12){
      var rate = Math.min(Math.max(ad * 5, 0.6), MAX_RATE);
      if (video.paused) video.play().catch(function(){});
      if (Math.abs(video.playbackRate - rate) > 0.04){ try { video.playbackRate = rate; } catch(err){} }
      return;
    }
    if (!video.paused) video.pause();
    if (ad > 0.035) applySeek(t);
  }

  function syncVideoMode(){
    if (route === 'home'){ video.loop = false; try { video.playbackRate = 1; } catch(e){} video.pause(); }
    else { video.loop = true; try { video.playbackRate = 1; } catch(e){} if (!failed && (ready || video.readyState >= 2)) video.play().catch(function(){}); }
  }

  function setRoute(r){
    route = r; document.body.dataset.route = r;
    Object.keys(pageIds).forEach(function(k){ document.getElementById(pageIds[k]).classList.toggle('active', k === r); });
    window.scrollTo(0, 0); requestAnimationFrame(measure);
    navLinks.forEach(function(a){ a.classList.toggle('act', a.dataset.route === r); });
    label.textContent = pageLabels[r]; document.title = pageTitles[r]; curIdx = -1; syncVideoMode();
  }
  window.addEventListener('hashchange', function(){ setRoute(currentRoute()); });

  document.getElementById('ctaTop').addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
  document.getElementById('brandTop').addEventListener('click', function(ev){
    ev.preventDefault(); if (currentRoute() !== 'home') location.hash = '#/'; else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  var form = document.getElementById('cform');
  var fwrap = document.getElementById('formWrap');
  function fieldOf(id){ return document.getElementById('f-' + id); }
  function setErr(id, on){ var f = fieldOf(id); if (f) f.classList.toggle('err', on); }
  form.addEventListener('submit', function(ev){
    ev.preventDefault(); var ok = true;
    var name = document.getElementById('fname'), email = document.getElementById('femail'), subj = document.getElementById('fsubject'), msg = document.getElementById('fmsg'), age = document.getElementById('fage');
    var b1 = name.value.trim().length < 2; setErr('fname', b1); ok = ok && !b1;
    var b2 = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()); setErr('femail', b2); ok = ok && !b2;
    var b3 = !subj.value; setErr('fsubject', b3); ok = ok && !b3;
    var b4 = msg.value.trim().length < 10; setErr('fmsg', b4); ok = ok && !b4;
    var b5 = !age.checked; document.getElementById('ageRow').classList.toggle('err', b5); ok = ok && !b5;
    if (ok) fwrap.classList.add('done');
    else { var firstErr = form.querySelector('.field.err input, .field.err select, .field.err textarea'); if (firstErr) firstErr.focus(); }
  });
  ['fname','femail','fsubject','fmsg'].forEach(function(id){
    document.getElementById(id).addEventListener('input', function(){ setErr(id, false); });
    document.getElementById(id).addEventListener('change', function(){ setErr(id, false); });
  });
  document.getElementById('fage').addEventListener('change', function(){ document.getElementById('ageRow').classList.remove('err'); });
  document.getElementById('againBtn').addEventListener('click', function(){ fwrap.classList.remove('done'); form.reset(); });

  document.querySelectorAll('.q').forEach(function(q){
    var btn = q.querySelector('button'), a = q.querySelector('.a');
    btn.addEventListener('click', function(){
      var open = q.classList.contains('open');
      document.querySelectorAll('.q.open').forEach(function(o){ o.classList.remove('open'); o.querySelector('button').setAttribute('aria-expanded','false'); o.querySelector('.a').style.maxHeight = null; });
      if (!open){ q.classList.add('open'); btn.setAttribute('aria-expanded','true'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  var smooth = 0, tcKey = -1, lastP = -1;
  function activeIdx(){ var y = window.scrollY + vh * 0.5, i = 0; for (var j = 0; j < panelTops.length; j++) if (panelTops[j] <= y) i = j; return i; }
  function loop(){
    if (route === 'home'){
      var target = Math.min(Math.max(window.scrollY / trackH, 0), 1);
      smooth += (target - smooth) * K;
      if (Math.abs(target - smooth) < 0.0004) smooth = target;
      if (Math.abs(smooth - lastP) > 0.0006){ docEl.style.setProperty('--p', smooth.toFixed(4)); lastP = smooth; }
      var t = smooth * Math.max(duration - 0.06, 0); updateVideo(t);
      if (!failed){ var key = Math.floor(video.currentTime * 4); if (key !== tcKey){ tcKey = key; tcNow.textContent = fmt(video.currentTime); } }
      else tcNow.textContent = fmt(smooth * duration);
      fill.style.transform = 'scaleX(' + smooth.toFixed(4) + ')';
      var i = activeIdx(); if (i !== curIdx) setChapter(i);
      hint.classList.toggle('hide', smooth > 0.02); idx.classList.toggle('show', smooth > 0.02);
      var sy = window.scrollY;
      for (var g = 0; g < ghostData.length; g++){
        var dist = sy - ghostData[g].top;
        if (dist < -vh * 1.6 || dist > vh * 1.6) continue;
        ghostData[g].el.style.transform = 'translate3d(0, calc(-50% + ' + (dist * -0.14).toFixed(1) + 'px), 0)';
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  setRoute(currentRoute());
})();
