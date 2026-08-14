/* Purelane Dawn global behavior — derived from the 1,716-line prototype. */
(function(){
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.rv').forEach(function(el){
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
      },{rootMargin:'0px 0px -12% 0px',threshold:.12});
      io.observe(el);
    } else { el.classList.add('in'); }
  });

  var railLinks=[].slice.call(document.querySelectorAll('.rail a'));
  var targets=railLinks.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function syncRail(){
    if(!railLinks.length)return;
    var mid=(window.scrollY||0)+window.innerHeight*.42,idx=0;
    targets.forEach(function(t,i){if(t&&t.offsetTop<=mid)idx=i;});
    railLinks.forEach(function(a,i){a.classList.toggle('on',i===idx);});
  }

  var zones=[].slice.call(document.querySelectorAll('[data-scene]'));
  var scenes=[].slice.call(document.querySelectorAll('.scene'));
  var stage=document.getElementById('scenes'),current=0;
  function setScene(n){
    if(!n||n===current)return;
    current=n;
    scenes.forEach(function(s,i){s.classList.toggle('on',i+1===n);});
    if(stage)stage.setAttribute('data-d',String(n));
  }
  function pickScene(){
    var focus=(window.scrollY||0)+window.innerHeight*.5,n=1;
    zones.forEach(function(z){var r=z.getBoundingClientRect(),top=r.top+(window.scrollY||0);if(top<=focus)n=parseInt(z.getAttribute('data-scene'),10)||n;});
    setScene(n);
  }

  var hdr=document.getElementById('hdr'),prod=document.getElementById('heroProd'),raf=null,mx=0,my=0;
  function frame(){
    raf=null;var y=window.scrollY||0;
    if(hdr)hdr.classList.toggle('up',y>90);
    if(!reduce&&prod){
      var f=Math.min(y/700,1);
      prod.style.transform='translate3d('+(mx*-16).toFixed(2)+'px,'+(-f*54+my*-10).toFixed(2)+'px,0) scale('+(1-f*.06).toFixed(3)+')';
      prod.style.opacity=(1-f*.55).toFixed(3);
    }
    syncRail();pickScene();
  }
  function onScroll(){if(!raf)raf=requestAnimationFrame(frame);}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  if(!reduce&&window.matchMedia('(min-width:1024px)').matches){
    window.addEventListener('mousemove',function(e){
      mx=(e.clientX/window.innerWidth-.5)*2;my=(e.clientY/window.innerHeight-.5)*2;onScroll();
    },{passive:true});
  }

  var rot=document.querySelector('[data-pl-hero-rotator]');
  if(rot){
    var slides=[].slice.call(rot.querySelectorAll('.pl-hero-slide'));
    var buttons=[].slice.call(rot.querySelectorAll('[data-slide-button]'));
    var i=0,timer=null;
    function go(n){
      i=(n+slides.length)%slides.length;
      slides.forEach(function(s,j){s.classList.toggle('is-active',j===i);});
      buttons.forEach(function(b,j){b.classList.toggle('is-active',j===i);b.setAttribute('aria-selected',j===i?'true':'false');});
    }
    function play(){if(reduce||timer)return;timer=setInterval(function(){go(i+1);},3800);}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    buttons.forEach(function(b,j){b.addEventListener('click',function(){stop();go(j);play();});});
    rot.addEventListener('mouseenter',stop);rot.addEventListener('mouseleave',play);
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?play():stop();});},{threshold:.2}).observe(rot);
    else play();
  }
  frame();
})();