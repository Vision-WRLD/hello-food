/* reveal.js — opacity-only below-fold reveal. Heroes are NOT .reveal (stay static).
   LAW: never gate visible content behind IO alone — load + Date.now timer + setTimeout fallback. */
(function(){
  function show(el){el.classList.add('in');}
  var els=[].slice.call(document.querySelectorAll('.reveal'));

  // immediate reveal for anything already in view on load
  function inView(el){var r=el.getBoundingClientRect();return r.top < (innerHeight||document.documentElement.clientHeight)*0.92;}
  function scanNow(){els.forEach(function(el){if(!el.classList.contains('in')&&inView(el))show(el);});}

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.05});
    els.forEach(function(el){io.observe(el);});
  } else { els.forEach(show); }

  // belt + suspenders: reveal on load, and a hard force after 1.6s (bg-tab / stalled IO)
  scanNow();
  addEventListener('load',scanNow);
  var t0=Date.now();
  (function tick(){scanNow();if(Date.now()-t0<1700)requestAnimationFrame(tick);})();
  setTimeout(function(){els.forEach(show);},1700);

  // expose for dynamically injected nodes
  window.revealScan=function(){
    [].slice.call(document.querySelectorAll('.reveal:not(.in)')).forEach(function(el){if(inView(el))show(el);});
  };
})();
