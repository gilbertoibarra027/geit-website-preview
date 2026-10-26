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
  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(b){
    b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',o);document.getElementById(b.getAttribute('aria-controls')).hidden=!o;b.closest('.faq-item').classList.toggle('open',o)});
  });
  // Contact form: sends via FormSubmit to Gilberto's inbox (temporary until GEIT email is set up).
  var FORM_ENDPOINT='https://formsubmit.co/ajax/gilbertoibarra027@gmail.com';
  var f=document.getElementById('contact-form'),s=f.querySelector('.form-status'),btn=f.querySelector('button[type=submit]');
  f.addEventListener('submit',function(e){
    e.preventDefault();var ok=true;
    f.querySelectorAll('[required]').forEach(function(el){var v=el.checkValidity();el.setAttribute('aria-invalid',!v);if(!v&&ok){el.focus();ok=false}});
    if(!ok){s.textContent='Please fill in the required fields.';return}
    var d=new FormData(f);if(d.get('_honey'))return;
    d.append('_subject','New inquiry from geitdigital.com');d.append('_template','table');d.append('_captcha','false');
    btn.disabled=true;s.textContent='Sending...';
    fetch(FORM_ENDPOINT,{method:'POST',headers:{'Accept':'application/json'},body:d})
      .then(function(r){return r.json().then(function(j){if(!r.ok||String(j.success)==='false')throw 0})})
      .then(function(){f.reset();s.textContent="Thanks! Your message is in. We'll get back to you soon."})
      .catch(function(){s.textContent='Something went wrong. Please try again in a moment.'})
      .finally(function(){btn.disabled=false});
  });
  // One-page site: all in-page links scroll smoothly and keep a clean URL (no #slugs).
  document.querySelectorAll('a[href="/"], a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){
    var h=a.getAttribute('href');var el=h==='/'?null:document.querySelector(h);if(h!=='/'&&!el)return;
    e.preventDefault();var nav=document.querySelector('.nav-open, [data-open="true"]');
    if(el){el.scrollIntoView({behavior:'smooth'});if(h!=='#main'){el.setAttribute('tabindex','-1');el.focus({preventScroll:true});}}else window.scrollTo({top:0,behavior:'smooth'});
    history.replaceState(null,'','/');});});
  if(location.hash){history.replaceState(null,'','/');}
})();
