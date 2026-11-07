'use strict';
const captureMode=new URLSearchParams(location.search).has('capture');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
// Visible by default: enhancement must never hide the page if scripting fails.
if(!reduceMotion.matches&&'IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:0.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
// Contact submissions use the native HTML POST to FormSubmit; do not intercept submit.
const cursor=document.querySelector('.cursor');if(window.matchMedia('(hover: hover) and (pointer: fine)').matches&&!reduceMotion.matches){window.addEventListener('pointermove',event=>{cursor.style.left=event.clientX+'px';cursor.style.top=event.clientY+'px';cursor.classList.add('active');cursor.classList.toggle('hover',Boolean(event.target.closest('a,button,input,textarea')));},{passive:true});document.addEventListener('mouseleave',()=>cursor.classList.remove('active'));}
// Explicit capture mode is only for reproducible local review screenshots.
if(captureMode){document.documentElement.classList.remove('js-motion');window.addEventListener('load',()=>{setTimeout(()=>{document.documentElement.dataset.captureHeight=document.documentElement.scrollHeight;document.documentElement.dataset.captureWidth=window.innerWidth;},1500);});}
// v20261107a scroll motion: staggered reveals, progress bar, parallax, card tilt
(()=>{if(reduceMotion.matches||captureMode)return;
 document.querySelectorAll('.steps,.services').forEach(g=>g.querySelectorAll(':scope>.reveal:not(.section-heading)').forEach((el,i)=>el.style.setProperty('--d',(i*0.1)+'s')));
 const bar=document.createElement('div');bar.className='scroll-progress';bar.setAttribute('aria-hidden','true');document.body.prepend(bar);
 const imgs=[...document.querySelectorAll('.project .site-capture')];const proof=document.querySelector('.review-copy h2');let ticking=false;
 const update=()=>{ticking=false;const h=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';const vh=innerHeight;
  imgs.forEach(img=>{const r=img.closest('.screen').getBoundingClientRect();if(r.bottom<0||r.top>vh)return;const p=(r.top+r.height/2-vh/2)/vh;img.style.setProperty('--py',(p*-24).toFixed(1)+'px');});
  if(proof){const r=proof.getBoundingClientRect();if(r.bottom>0&&r.top<vh)proof.style.setProperty('--rp',((r.top-vh/2)*-0.08).toFixed(1)+'px');}};
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
 if(matchMedia('(hover: hover) and (pointer: fine)').matches)document.querySelectorAll('.project').forEach(p=>{const s=p.querySelector('.device-shell');
  p.querySelector('.preview-stage').addEventListener('pointermove',e=>{const r=s.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;s.style.transform='perspective(1400px) rotateX('+(-y*3).toFixed(2)+'deg) rotateY('+(x*3).toFixed(2)+'deg) translateY(-6px)';});
  p.querySelector('.preview-stage').addEventListener('pointerleave',()=>{s.style.transform='';});});
})();

// v20261107b count-up stats
(()=>{const els=document.querySelectorAll('[data-count]');if(reduceMotion.matches||captureMode||!('IntersectionObserver' in window))return;
 const fmt=(el,v)=>{const d=+(el.dataset.dec||0);el.innerHTML=(el.dataset.pre||'')+v.toFixed(d)+(el.dataset.suf||'');};
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target,end=+el.dataset.count,t0=performance.now(),dur=1600;
  const step=t=>{const k=Math.min(1,(t-t0)/dur);fmt(el,end*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step);else fmt(el,end);};requestAnimationFrame(step);}),{threshold:.4});
 els.forEach(el=>{fmt(el,0);io.observe(el);});})();
// v20261107c: scroll-scrubbed text, case study overlays
(()=>{const st=document.querySelectorAll('[data-scrub]');st.forEach(el=>{el.innerHTML=el.textContent.trim().split(/\s+/).map(w=>'<span>'+w+'</span>').join(' ');});
 if(reduceMotion.matches||captureMode){st.forEach(el=>el.classList.add('scrub-done'));}else{const run=()=>{st.forEach(el=>{const r=el.getBoundingClientRect(),vh=innerHeight;const p=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.35)));const w=el.children,n=Math.floor(p*w.length*1.05);for(let i=0;i<w.length;i++)w[i].classList.toggle('lit',i<n);});};addEventListener('scroll',()=>requestAnimationFrame(run),{passive:true});run();}
 let last=null;const open=id=>{const o=document.getElementById('case-'+id);if(!o)return;last=document.activeElement;o.hidden=false;document.documentElement.classList.add('cs-lock');requestAnimationFrame(()=>o.classList.add('open'));o.querySelector('.cs-scroll').scrollTop=0;o.querySelector('.cs-close').focus();
  o.querySelectorAll('.cs-block,.cs-metric').forEach(el=>el.classList.remove('in'));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);const b=e.target.querySelector('[data-count]');if(b&&!reduceMotion.matches){const end=+b.dataset.count,d=+(b.dataset.dec||0),t0=performance.now();const f=v=>b.innerHTML=(b.dataset.pre||'')+v.toFixed(d)+(b.dataset.suf||'');const s=t=>{const k=Math.min(1,(t-t0)/1400);f(end*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(s);};requestAnimationFrame(s);}}),{root:o.querySelector('.cs-scroll'),threshold:.3});
  o.querySelectorAll('.cs-block,.cs-metric').forEach(el=>io.observe(el));};
 const close=()=>{const o=document.querySelector('.case-overlay.open');if(!o)return;o.classList.remove('open');document.documentElement.classList.remove('cs-lock');setTimeout(()=>{o.hidden=true;},reduceMotion.matches?0:350);if(last)last.focus();};
 document.querySelectorAll('.case-open').forEach(b=>b.addEventListener('click',()=>open(b.dataset.case)));
 document.querySelectorAll('.cs-close').forEach(b=>b.addEventListener('click',close));
 document.querySelectorAll('.cs-cta').forEach(b=>b.addEventListener('click',close));
 document.addEventListener('keydown',e=>{const o=document.querySelector('.case-overlay.open');if(!o)return;if(e.key==='Escape'){close();return;}if(e.key==='Tab'){const f=[...o.querySelectorAll('button,a[href]')];const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}});
 window.__openCase=open;})();
// ambient motion layer (paused off-screen, off for reduced motion)
(()=>{if(reduceMotion.matches||captureMode)return;const hosts=document.querySelectorAll('.proof,.cs-result,.work .case-stack,.page-hero,.svc-proof');
 hosts.forEach(h=>{const a=document.createElement('div');a.className='ambient';a.setAttribute('aria-hidden','true');a.innerHTML='<i class="amb-ring r1"></i><i class="amb-ring r2"></i><i class="amb-blob b1"></i><i class="amb-blob b2"></i><i class="amb-line l1"></i>'+Array.from({length:14},(_,i)=>'<i class="amb-dot" style="--x:'+((i*37)%100)+'%;--y:'+((i*61)%100)+'%;--t:'+(9+i%6*2)+'s;--dl:-'+(i*1.3)+'s"></i>').join('');h.prepend(a);});
 const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('amb-on',e.isIntersecting)));document.querySelectorAll('.ambient').forEach(a=>io.observe(a));})();
// v20261107e mobile menu
(()=>{const t=document.querySelector('.menu-toggle');if(!t)return;const set=o=>{document.documentElement.classList.toggle('menu-open',o);t.setAttribute('aria-expanded',String(o));t.setAttribute('aria-label',o?'Close menu':'Open menu');};
 t.addEventListener('click',()=>set(!document.documentElement.classList.contains('menu-open')));
 document.querySelectorAll('#site-nav a').forEach(a=>a.addEventListener('click',()=>set(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.documentElement.classList.contains('menu-open')){set(false);t.focus();}});
 matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)set(false);});})();
