/* reserve.js — counter omakase booking. Deterministic pre-booked slots (seeded hash),
   no backend; builds a live summary + confirmation. */
(function(){
  var root=document.getElementById('resv');
  if(!root)return;

  var TIMES=[
    {t:"17:30",s:"First seating"},{t:"18:00",s:"First seating"},
    {t:"18:30",s:"First seating"},{t:"19:30",s:"Second seating"},
    {t:"20:00",s:"Second seating"},{t:"20:30",s:"Second seating"}
  ];
  var DOW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  var state={date:null,time:null,seat:"counter",party:2};

  // deterministic "already booked" — counter has only 10 seats, so most slots fill
  function seed(s){var h=0;for(var i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))>>>0;}return h;}
  function gone(dateKey,time){
    var h=seed(dateKey+time+state.seat);
    return (h%10) < (state.seat==="counter"?5:3); // counter scarcer
  }

  var elDays=root.querySelector('#days'),
      elSlots=root.querySelector('#slots'),
      elSeats=root.querySelectorAll('.seat'),
      elParty=root.querySelector('#party'),
      elConfirm=root.querySelector('#confirm'),
      sum={date:root.querySelector('#s-date'),time:root.querySelector('#s-time'),
           seat:root.querySelector('#s-seat'),party:root.querySelector('#s-party'),
           price:root.querySelector('#s-price')};

  function fmtKey(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}

  function buildDays(){
    var now=new Date();now.setHours(0,0,0,0);
    var frag=document.createDocumentFragment();
    for(var i=1;i<=14;i++){
      var d=new Date(now);d.setDate(now.getDate()+i);
      // closed Mondays
      var closed=d.getDay()===1;
      var b=document.createElement('button');
      b.type='button';b.className='day';b.disabled=closed;
      if(closed)b.style.opacity='.35',b.style.cursor='not-allowed';
      b.innerHTML='<small>'+DOW[d.getDay()]+'</small><b>'+d.getDate()+'</b><em>'+MON[d.getMonth()]+(closed?' · closed':'')+'</em>';
      (function(d,b){b.addEventListener('click',function(){
        if(b.disabled)return;
        elDays.querySelectorAll('.day').forEach(function(x){x.classList.remove('sel');});
        b.classList.add('sel');state.date=d;state.time=null;buildSlots();render();
      });})(d,b);
      frag.appendChild(b);
    }
    elDays.appendChild(frag);
  }

  function buildSlots(){
    elSlots.innerHTML='';
    if(!state.date){elSlots.innerHTML='<p class="muted" style="grid-column:1/-1">Select a date to see seatings.</p>';return;}
    var key=fmtKey(state.date);
    TIMES.forEach(function(o){
      var g=gone(key,o.t);
      var s=document.createElement('button');
      s.type='button';s.className='slot'+(g?' gone':'');s.disabled=g;
      s.innerHTML=o.t+'<small>'+(g?'booked':o.s)+'</small>';
      if(!g)s.addEventListener('click',function(){
        elSlots.querySelectorAll('.slot').forEach(function(x){x.classList.remove('sel');});
        s.classList.add('sel');state.time=o.t;render();
      });
      elSlots.appendChild(s);
    });
    window.revealScan&&window.revealScan();
  }

  elSeats.forEach(function(el){
    el.addEventListener('click',function(){
      elSeats.forEach(function(x){x.classList.remove('sel');});
      el.classList.add('sel');state.seat=el.dataset.seat;state.time=null;buildSlots();render();
    });
  });

  root.querySelector('#p-dec').addEventListener('click',function(){state.party=Math.max(1,state.party-1);render();});
  root.querySelector('#p-inc').addEventListener('click',function(){state.party=Math.min(state.seat==='counter'?6:8,state.party+1);render();});

  function priceFor(){return state.seat==='counter'?245:185;}

  function render(){
    elParty.textContent=state.party;
    sum.date.textContent=state.date?DOW[state.date.getDay()]+' '+state.date.getDate()+' '+MON[state.date.getMonth()]:'—';
    sum.time.textContent=state.time||'—';
    sum.seat.textContent=state.seat==='counter'?'Counter Omakase':'Table Service';
    sum.party.textContent=state.party+(state.party>1?' guests':' guest');
    sum.price.textContent='$'+(priceFor()*state.party)+' ('+state.party+'×$'+priceFor()+')';
  }

  root.querySelector('#book').addEventListener('click',function(e){
    e.preventDefault();
    var name=root.querySelector('#name').value.trim();
    var email=root.querySelector('#email').value.trim();
    if(!state.date||!state.time){elConfirm.textContent='Please choose a date and seating time.';elConfirm.classList.add('show');return;}
    if(!name||!email){elConfirm.textContent='Please add your name and email to hold the seats.';elConfirm.classList.add('show');return;}
    elConfirm.innerHTML='席を確保しました — Thank you, '+name.split(' ')[0]+'. '+
      sum.party.textContent+' held for '+sum.date.textContent+' at '+state.time+
      ' ('+sum.seat.textContent+'). A confirmation has been sent to '+email+'. We look forward to your evening at HINATA.';
    elConfirm.classList.add('show');
    elConfirm.scrollIntoView({behavior:'smooth',block:'center'});
  });

  // marker seat preselect
  var c=root.querySelector('.seat[data-seat="counter"]');c&&c.classList.add('sel');
  buildDays();buildSlots();render();
})();
