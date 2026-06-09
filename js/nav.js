/* nav.js — shrink-on-scroll + mobile burger. Open via forced reflow, not rAF (LAW). */
(function(){
  var nav=document.querySelector('.nav');
  if(!nav)return;
  var burger=nav.querySelector('.nav__burger');
  var links=nav.querySelector('.nav__links');

  function onScroll(){nav.classList.toggle('shrink',scrollY>30);}
  onScroll();addEventListener('scroll',onScroll,{passive:true});

  if(burger){
    burger.addEventListener('click',function(){
      var open=nav.classList.contains('open');
      void nav.offsetWidth;            // force reflow before toggling
      nav.classList.toggle('open',!open);
      burger.setAttribute('aria-expanded',String(!open));
    });
    links&&links.addEventListener('click',function(e){
      if(e.target.tagName==='A'){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');}
    });
  }
})();
