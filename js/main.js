/* MRK Tiles CO. — main.js */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(()=> loader && loader.classList.add('hide'), 400);
  });
  setTimeout(()=> loader && loader.classList.add('hide'), 1800); // fallback

  /* ---------- Hero tile bg generator ---------- */
  const tileBg = document.querySelector('.tile-bg');
  if (tileBg) {
    for (let i = 0; i < 48; i++) {
      const s = document.createElement('span');
      s.style.animationDelay = (Math.random()*4)+'s';
      tileBg.appendChild(s);
    }
  }

  /* ---------- Scroll progress + navbar state + back to top ---------- */
  const progress = document.getElementById('scroll-progress');
  const navbar = document.querySelector('.navbar');
  const topBtn = document.querySelector('.fab.top');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop)/((h.scrollHeight - h.clientHeight)||1)*100;
    if (progress) progress.style.width = pct+'%';
    if (navbar) navbar.classList.toggle('scrolled', h.scrollTop > 40);
    if (topBtn) topBtn.classList.toggle('show', h.scrollTop > 480);
  });

  /* ---------- Mobile menu ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks && navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open'); navLinks.classList.remove('open');
  }));

  /* ---------- Active nav link ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  /* ---------- Dark mode toggle ---------- */
  const themeBtn = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('mrk-theme');
  if (saved === 'dark') { root.setAttribute('data-theme','dark'); setIcon(true); }
  themeBtn && themeBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) { root.removeAttribute('data-theme'); localStorage.setItem('mrk-theme','light'); setIcon(false); }
    else { root.setAttribute('data-theme','dark'); localStorage.setItem('mrk-theme','dark'); setIcon(true); }
  });
  function setIcon(dark){
    if(!themeBtn) return;
    themeBtn.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }

  /* ---------- Button ripple ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const r = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.className='ripple';
      r.style.width = r.style.height = size+'px';
      r.style.left = (e.clientX - rect.left - size/2)+'px';
      r.style.top = (e.clientY - rect.top - size/2)+'px';
      this.appendChild(r);
      setTimeout(()=>r.remove(),650);
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
  }, {threshold:.15});
  revealEls.forEach(el=>io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.counter-num');
  const cio = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        animateCounter(en.target);
        cio.unobserve(en.target);
      }
    });
  },{threshold:.5});
  counters.forEach(c=>cio.observe(c));
  function animateCounter(el){
    const target = parseInt(el.dataset.target,10);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target/60));
    const t = setInterval(()=>{
      cur += step;
      if(cur >= target){ cur = target; clearInterval(t); }
      el.textContent = cur;
    }, 25);
  }

  /* ---------- Testimonial carousel ---------- */
  const track = document.querySelector('.testi-track');
  if (track) {
    const slides = track.children.length;
    const dotsWrap = document.querySelector('.testi-dots');
    let idx = 0;
    for(let i=0;i<slides;i++){
      const d = document.createElement('button');
      if(i===0) d.classList.add('active');
      d.addEventListener('click', ()=>go(i));
      dotsWrap.appendChild(d);
    }
    function go(i){
      idx = i;
      track.style.transform = `translateX(-${idx*100}%)`;
      dotsWrap.querySelectorAll('button').forEach((d,n)=>d.classList.toggle('active', n===idx));
    }
    let auto = setInterval(()=> go((idx+1)%slides), 5000);
    track.parentElement.addEventListener('mouseenter', ()=>clearInterval(auto));
    track.parentElement.addEventListener('mouseleave', ()=> auto = setInterval(()=> go((idx+1)%slides), 5000));
  }

  /* ---------- Product search (home / products) ---------- */
  const search = document.querySelector('.search-bar input');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll('.product-card').forEach(card=>{
        const name = card.dataset.name.toLowerCase();
        card.classList.toggle('hidden', !name.includes(q));
      });
    });
  }

  /* ---------- Project filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn=>{
      btn.addEventListener('click', () => {
        filterBtns.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        document.querySelectorAll('.gallery-grid .gallery-item').forEach(item=>{
          item.classList.toggle('hidden', cat!=='all' && item.dataset.cat!==cat);
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    document.querySelectorAll('.gallery-grid .gallery-item').forEach(item=>{
      item.addEventListener('click', () => {
        lightbox.querySelector('.lb-title').textContent = item.dataset.title || '';
        lightbox.querySelector('.lb-loc').textContent = item.dataset.loc || '';
        lightbox.classList.add('open');
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', ()=>lightbox.classList.remove('open'));
    lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) lightbox.classList.remove('open'); });
  }

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      
      let valid = true;
      const fields = [
        {id:'fullname', test:v=>v.trim().length>2},
        {id:'phone', test:v=>/^[0-9+\-\s]{7,15}$/.test(v.trim())},
        {id:'email', test:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())},
        {id:'service', test:v=>v!==''},
        {id:'message', test:v=>v.trim().length>5},
      ];
      fields.forEach(f=>{
        const el = document.getElementById(f.id);
        const wrap = el.closest('.field');
        const ok = f.test(el.value);
        wrap.classList.toggle('invalid', !ok);
        if(!ok) valid = false;
      });
      if (valid) {

    fetch("/contact.html", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(new FormData(form)).toString()
    })
    .then(() => {
        form.reset();
        document.querySelector(".form-success").classList.add("show");

        setTimeout(() => {
            document.querySelector(".form-success").classList.remove("show");
        }, 5000);
    })
    .catch(() => {
        alert("Failed to send enquiry.");
    });

}
    });
  }

  /* ---------- Back to top click ---------- */
  topBtn && topBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  /* ---------- Lazy load images (if any real <img class="lazy">) ---------- */
  document.querySelectorAll('img.lazy').forEach(img=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(en=>{
        if(en.isIntersecting){
          en.target.src = en.target.dataset.src;
          en.target.classList.add('loaded');
          obs.unobserve(en.target);
        }
      });
    });
    obs.observe(img);
  });

});