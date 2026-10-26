(function(){
  var root=document.documentElement;root.classList.add('js');
  var h=document.getElementById('site-header'),t=document.querySelector('.nav-toggle'),n=document.getElementById('site-nav');
  function onScroll(){h.classList.toggle('scrolled',window.scrollY>20)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  function close(){n.classList.remove('open');h.classList.remove('menu-open');t.setAttribute('aria-expanded','false')}
  t.addEventListener('click',function(){var o=n.classList.toggle('open');h.classList.toggle('menu-open',o);t.setAttribute('aria-expanded',o)});
  n.addEventListener('click',function(e){if(e.target.closest('a'))close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&n.classList.contains('open')){close();t.focus()}});
  document.getElementById('year').textContent=new Date().getFullYear();
  // staggered bar animation
  document.querySelectorAll('.bars-viz i').forEach(function(b,i){b.style.setProperty('--d',i*80)});
  // reveal on scroll
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});
  // Placeholder form: validates locally, submits nowhere.
  var f=document.getElementById('contact-form'),s=f.querySelector('.form-status');
  f.addEventListener('submit',function(e){
    e.preventDefault();var ok=true;
    f.querySelectorAll('[required]').forEach(function(el){var v=el.checkValidity();el.setAttribute('aria-invalid',!v);if(!v&&ok){el.focus();ok=false}});
    s.textContent=ok?'Thanks! This form is a placeholder and is not connected yet.':'Please fill in the required fields.';
  });
})();
