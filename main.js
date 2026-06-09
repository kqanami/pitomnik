import './style.css';
import { CATEGORIES, GALLERY_IMAGES, TESTIMONIALS } from './data.js';
import { initAnimations } from './animations.js';
import gsap from 'gsap';

// ─── Page detection ───
const page = document.body.dataset.page || 
  (location.pathname.includes('catalog') ? 'catalog' :
   location.pathname.includes('gallery') ? 'gallery' :
   location.pathname.includes('services') ? 'services' :
   location.pathname.includes('contacts') ? 'contacts' : 'home');

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  
  if (page === 'home') {
    initHome();
  }
  
  initAnimations();
  initScrollReveal();
  
  if (page === 'catalog') initCatalog();
  if (page === 'gallery') initGallery();
  if (page === 'services') initServices();
  if (page === 'contacts') initContacts();
});

// ═══════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('navDrawer');
  const overlay = document.getElementById('navOverlay');

  // Sticky nav
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    }, { passive: true });
    
    // Trigger on load in case we started halfway down
    if (window.scrollY > 50) nav.classList.add('nav-scrolled');
  }

  // Hamburger
  hamburger?.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    overlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  overlay?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  function closeDrawer() {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Active link
  const links = document.querySelectorAll('.nav-links a, .nav-drawer a');
  links.forEach(link => {
    if (link.getAttribute('href') === location.pathname || 
        (location.pathname === '/' && link.getAttribute('href') === '/') ||
        (location.pathname !== '/' && link.getAttribute('href')?.includes(location.pathname.replace('/','').split('.')[0]))) {
      link.classList.add('active');
    }
  });
}

// ═══════════════════════════════════════
// SCROLL REVEAL & PARALLAX
// ═══════════════════════════════════════
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Parallax effect for floating images
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    const floatImg = document.querySelector('.home-about__img-float');
    if (floatImg) {
      floatImg.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  }, { passive: true });
}

// ═══════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════
function initHome() {
  // Hero parallax background rotation
  const heroBg = document.getElementById('heroBg');
  const heroImages = [
    './images/04052018_261.jpg',
    './images/04052018_132.jpg',
    './images/Abies_koreana.jpg',
    './images/04052018_238.jpg',
  ];
  let heroIdx = 0;
  if (heroBg) {
    heroBg.style.backgroundImage = `url('${heroImages[0]}')`;
    setInterval(() => {
      heroIdx = (heroIdx + 1) % heroImages.length;
      heroBg.style.transition = 'opacity 1.5s ease';
      heroBg.style.opacity = '0';
      setTimeout(() => {
        heroBg.style.backgroundImage = `url('${heroImages[heroIdx]}')`;
        heroBg.style.opacity = '0.45';
      }, 1500);
    }, 6000);
  }

  // Categories grid
  const catGrid = document.getElementById('catGrid');
  if (catGrid) {
    CATEGORIES.forEach((cat, i) => {
      const card = document.createElement('a');
      card.href = `./catalog.html?cat=${cat.id}`;
      card.className = `cat-card reveal hover-glow delay-${i % 4}`;
      card.innerHTML = `
        <img src="${cat.groups && cat.groups[0] ? cat.groups[0].image : './images/04052018_261.jpg'}" alt="${cat.name}" class="cat-card__img" loading="${i < 2 ? 'eager' : 'lazy'}">
        <div class="cat-card__overlay"></div>
        <div class="cat-card__content">
          <div class="cat-card__label">Категория</div>
          <h3 class="cat-card__title">${cat.name}</h3>
          <p class="cat-card__count">${cat.groups ? cat.groups.length + ' групп растений' : 'Скоро в наличии'}</p>
        </div>
        <div class="cat-card__arrow">→</div>
      `;
      catGrid.appendChild(card);
    });
    // Re-observe new elements
    document.querySelectorAll('#catGrid .reveal').forEach(el => {
      new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
      }, { threshold: 0.1 }).observe(el);
    });
  }

  // Featured plants (plants with badge 'Хит')
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    const featured = [];
    CATEGORIES.forEach(cat => {
      cat.groups?.forEach(g => {
        g.varieties?.forEach(v => { 
          if (featured.length < 8 && Math.random() > 0.5) {
             featured.push({ ...v, catId: cat.id, groupId: g.id }); 
          }
        });
      });
    });
    
    // if not enough, just grab any
    if(featured.length < 8) {
      CATEGORIES.forEach(cat => cat.groups?.forEach(g => g.varieties?.forEach(v => {
        if(featured.length < 8 && !featured.find(f => f.id === v.id)) featured.push({ ...v, catId: cat.id, groupId: g.id });
      })));
    }

    featured.slice(0, 8).forEach((plant, i) => {
      const card = document.createElement('a');
      card.href = `./catalog.html?cat=${plant.catId}&group=${plant.groupId}&variety=${plant.id}`;
      card.className = `plant-card reveal hover-lift delay-${i % 5}`;
      card.innerHTML = `
        <div style="overflow:hidden; border-radius: 16px 16px 0 0;">
          <img src="${plant.image}" alt="${plant.name}" class="plant-card__img" loading="lazy">
        </div>
        <div class="plant-card__body">
          <div class="plant-card__name">${plant.name}</div>
          <div class="plant-card__latin">${plant.description ? plant.description.substring(0, 40) : ''}...</div>
        </div>
      `;
      featuredGrid.appendChild(card);
    });
    document.querySelectorAll('#featuredGrid .reveal').forEach(el => {
      new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
      }, { threshold: 0.1 }).observe(el);
    });
  }

  // Testimonials
  const testiGrid = document.getElementById('testiGrid');
  if (testiGrid) {
    TESTIMONIALS.forEach((t, i) => {
      const card = document.createElement('div');
      card.className = `testi-card reveal delay-${i}`;
      card.innerHTML = `
        <div class="testi-stars">★★★★★</div>
        <p class="testi-text">"${t.text}"</p>
        <div class="testi-author">
          <div class="testi-avatar" style="background:#e0e0e0; border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center; font-weight:bold; color:var(--clr-forest);">${t.name.charAt(0)}</div>
          <div>
            <div class="testi-name">${t.name}</div>
          </div>
        </div>
      `;
      testiGrid.appendChild(card);
    });
    document.querySelectorAll('#testiGrid .reveal').forEach(el => {
      new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
      }, { threshold: 0.1 }).observe(el);
    });
  }
}

// ═══════════════════════════════════════
// CATALOG PAGE
// ═══════════════════════════════════════
function initCatalog() {
  const params = new URLSearchParams(location.search);
  let activeCat = params.get('cat') || 'all';
  const initialGroup = params.get('group');
  const initialVariety = params.get('variety');

  const catNav = document.getElementById('catNav');
  const plantsGrid = document.getElementById('plantsGrid');
  const catHero = document.getElementById('catHero');
  const catTitle = document.getElementById('catTitle');
  const catDesc = document.getElementById('catDesc');
  const catCount = document.getElementById('catCount');
  const plantModal = document.getElementById('plantModal');

  let activeGroup = null;

  function renderCategory(catId) {
    activeCat = catId || 'all';
    activeGroup = null;

    catNav?.querySelectorAll('.cat-nav__btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === activeCat);
    });

    plantsGrid.innerHTML = '';

    if (activeCat === 'all') {
      if (catHero) catHero.style.backgroundImage = `url('./images/04052018_261.jpg')`;
      if (catTitle) catTitle.textContent = 'Все растения';
      if (catDesc) catDesc.textContent = 'Ознакомьтесь со всем ассортиментом нашего питомника';

      const allGroups = CATEGORIES.flatMap(c => c.groups ? c.groups.map(g => ({...g, parentCatId: c.id})) : []);
      catCount.textContent = `${allGroups.length} групп`;

      const url = new URL(location);
      url.searchParams.delete('cat');
      url.searchParams.delete('group');
      url.searchParams.delete('variety');
      history.replaceState({}, '', url);

      allGroups.forEach((group) => {
        const card = document.createElement('div');
        card.className = 'plant-card hover-lift';
        card.style.cursor = 'pointer';
        card.innerHTML = `
          <div style="overflow:hidden; border-radius: 16px 16px 0 0; position:relative;">
            <img src="${group.image || ''}" alt="${group.name}" class="plant-card__img" loading="lazy">
          </div>
          <div class="plant-card__body">
            <div class="plant-card__name">${group.name}</div>
            <div class="plant-card__latin">${group.varieties ? group.varieties.length + ' сортов' : ''}</div>
            <button class="btn btn-outline" style="width:100%; margin-top:1rem; padding:.6rem; font-size:.85rem;" onclick="renderGroup('${group.parentCatId}', '${group.id}')">Смотреть сорта →</button>
          </div>
        `;
        plantsGrid.appendChild(card);
      });

      gsap.fromTo(plantsGrid.children, 
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.05, ease: "back.out(1.2)" }
      );
      return;
    }

    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return;

    if (catHero) {
      catHero.style.backgroundImage = `url('${cat.groups && cat.groups[0] ? cat.groups[0].image : './images/04052018_261.jpg'}')`;
      if (catTitle) catTitle.textContent = cat.name;
      if (catDesc) catDesc.textContent = '';
    }

    plantsGrid.innerHTML = '';
    catCount.textContent = cat.groups ? `${cat.groups.length} групп` : 'Скоро в наличии';

    // Update nav buttons
    catNav?.querySelectorAll('.cat-nav__btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === catId);
    });

    // Update URL
    const url = new URL(location);
    url.searchParams.set('cat', catId);
    url.searchParams.delete('group');
    url.searchParams.delete('variety');
    history.replaceState({}, '', url);

    if (!plantsGrid) return;

    if (cat.coming_soon) {
      plantsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;"><svg style="margin-bottom:-3px; margin-right:4px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12v.01"/></svg> </div>
          <h3 style="font-size: 2rem; color: var(--clr-forest); margin-bottom: 1rem;">Скоро в наличии</h3>
          <p style="color: var(--clr-moss); max-width: 40ch; margin: 0 auto 2rem;">Раздел ягодных растений пополняется. Уточните актуальный ассортимент по телефону.</p>
          <a href="tel:+77022100042" class="btn btn-forest"><svg style="margin-bottom:-3px; margin-right:4px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> +7 (702) 210 00 42</a>
        </div>
      `;
      return;
    }

    cat.groups.forEach((group, i) => {
      const card = document.createElement('div');
      card.className = 'plant-card hover-lift';
      card.style.cursor = 'pointer';
      card.dataset.groupId = group.id;
      card.innerHTML = `
        <div style="overflow:hidden; border-radius: 16px 16px 0 0; position:relative;">
          <img src="${group.image || ''}" alt="${group.name}" class="plant-card__img" loading="lazy">
        </div>
        <div class="plant-card__body">
          <div class="plant-card__name">${group.name}</div>
          <div class="plant-card__latin">${group.varieties ? group.varieties.length + ' сортов' : ''}</div>
          <button class="btn btn-outline" style="width:100%; margin-top:1rem; padding:.6rem; font-size:.85rem;" onclick="renderGroup('${cat.id}', '${group.id}')">Смотреть сорта →</button>
        </div>
      `;
      plantsGrid.appendChild(card);
    });

    gsap.fromTo(plantsGrid.children, 
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.05, ease: "back.out(1.2)" }
    );
  }

  window.renderGroup = function(catId, groupId) {
    activeCat = catId;
    activeGroup = groupId;
    const cat = CATEGORIES.find(c => c.id === catId);
    const group = cat.groups.find(g => g.id === groupId);
    if (!group) return;

    plantsGrid.innerHTML = `
      <div style="grid-column: 1/-1; margin-bottom: 2rem; display:flex; flex-direction:column; align-items:flex-start;">
        <button class="btn btn-outline" onclick="renderCategory('${catId}')" style="margin-bottom:1rem; padding:0.5rem 1rem;">← Назад к разделу "${cat.name}"</button>
        <h2 style="color: var(--clr-forest); font-size: 2.5rem; margin-bottom:0.5rem;">${group.name}</h2>
      </div>
    `;

    group.varieties.forEach((variety, i) => {
      const card = document.createElement('div');
      card.className = 'plant-card hover-lift';
      card.style.cursor = 'pointer';
      card.dataset.varietyId = variety.id;
      card.innerHTML = `
        <div style="overflow:hidden; border-radius: 16px 16px 0 0; position:relative;">
          <img src="${variety.image}" alt="${variety.name}" class="plant-card__img" loading="lazy">
        </div>
        <div class="plant-card__body">
          <div class="plant-card__name" style="font-size:1.1rem;">${variety.name}</div>
          <p style="font-size:.85rem; color: var(--clr-moss); margin-top:.5rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${variety.description}</p>
          <button class="btn btn-outline" style="width:100%; margin-top:1rem; padding:.6rem; font-size:.85rem;" onclick="openVariety('${catId}', '${groupId}', '${variety.id}')">Характеристики →</button>
        </div>
      `;
      plantsGrid.appendChild(card);
    });

    gsap.fromTo(plantsGrid.children, 
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.05, ease: "back.out(1.2)" }
    );
  }

  // Build cat nav
  const allBtn = document.createElement('button');
  allBtn.className = 'cat-nav__btn';
  allBtn.dataset.cat = 'all';
  allBtn.textContent = 'Все';
  allBtn.addEventListener('click', () => renderCategory('all'));
  catNav?.appendChild(allBtn);

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-nav__btn';
    btn.dataset.cat = cat.id;
    btn.textContent = cat.name;
    btn.addEventListener('click', () => renderCategory(cat.id));
    catNav?.appendChild(btn);
  });

  if (initialVariety && initialGroup && activeCat !== 'all') {
    renderGroup(activeCat, initialGroup);
    setTimeout(() => openVariety(activeCat, initialGroup, initialVariety), 100);
  } else if (initialGroup && activeCat !== 'all') {
    renderGroup(activeCat, initialGroup);
  } else {
    renderCategory(activeCat);
  }

  // Variety modal
  window.openVariety = function(catId, groupId, varietyId) {
    const cat = CATEGORIES.find(c => c.id === catId);
    const group = cat?.groups.find(g => g.id === groupId);
    const variety = group?.varieties.find(v => v.id === varietyId);
    if (!variety || !plantModal) return;

    const chars = Object.entries(variety.characteristics || {})
      .map(([k, v]) => `<div class="char-item"><span class="char-key">${k}</span><span class="char-val">${v}</span></div>`)
      .join('');

    plantModal.innerHTML = `
      <div class="modal-backdrop" onclick="closePlant()"></div>
      <div class="modal-box">
        <button class="modal-close" onclick="closePlant()">✕</button>
        <div class="modal-img-wrap">
          <img src="${variety.image}" alt="${variety.name}" class="modal-img">
        </div>
        <div class="modal-body">
          <p class="modal-cat">${cat.name} / ${group.name}</p>
          <h2 class="modal-title">${variety.name}</h2>
          <p class="modal-desc" style="margin-bottom:1.5rem;">${variety.description}</p>
          ${chars ? `<div class="modal-section"><h4>Характеристики</h4><div class="char-grid">${chars}</div></div>` : ''}
          <div class="modal-actions" style="margin-top:2rem;">
            <a href="tel:+77022100042" class="btn btn-outline"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:-3px; margin-right:4px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> +7 (702) 210 00 42</a>
          </div>
        </div>
      </div>
    `;
    plantModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closePlant = function() {
    plantModal?.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePlant(); });
}

// ═══════════════════════════════════════
// GALLERY PAGE
// ═══════════════════════════════════════
function initGallery() {
  const grid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  let currentIdx = 0;

  GALLERY_IMAGES.forEach((imgObj, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${imgObj.src}" alt="${imgObj.name}" loading="lazy">
      <div class="gallery-item__overlay">🔍</div>
    `;
    item.addEventListener('click', () => openLightbox(i));
    grid?.appendChild(item);
  });

  let linkBtn = lightbox?.querySelector('.lb-link-btn');

  function openLightbox(idx) {
    currentIdx = idx;
    lbImg.src = GALLERY_IMAGES[idx].src;
    lbImg.alt = GALLERY_IMAGES[idx].name;
    
    if (lightbox) {
      if (!linkBtn) {
        linkBtn = document.createElement('a');
        linkBtn.className = 'btn btn-forest lb-link-btn';
        linkBtn.style.position = 'absolute';
        linkBtn.style.bottom = '3rem';
        linkBtn.style.left = '50%';
        linkBtn.style.transform = 'translateX(-50%)';
        linkBtn.style.zIndex = '1000';
        linkBtn.style.boxShadow = 'var(--shadow-lg)';
        linkBtn.textContent = 'К описанию сорта';
        lightbox.appendChild(linkBtn);
      }
      linkBtn.href = GALLERY_IMAGES[idx].link;
    }
    
    lightbox?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.closeLightbox = () => {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  };
  window.lightboxPrev = () => {
    openLightbox((currentIdx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };
  window.lightboxNext = () => {
    openLightbox((currentIdx + 1) % GALLERY_IMAGES.length);
  };

  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
  });
}

// ═══════════════════════════════════════
// SERVICES PAGE
// ═══════════════════════════════════════
function initServices() {
  // Form on services page
  const form = document.getElementById('serviceForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = '✓ Заявка отправлена!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'Отправить заявку'; btn.disabled = false; form.reset(); }, 3000);
  });
}

// ═══════════════════════════════════════
// CONTACTS PAGE
// ═══════════════════════════════════════
function initContacts() {
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = '✓ Сообщение отправлено!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'Отправить сообщение'; btn.disabled = false; form.reset(); }, 3000);
  });
}

// Expose functions to window for inline onclick handlers
window.renderCategory = renderCategory;
window.renderGroup = renderGroup;
window.openVariety = openVariety;
window.closePlant = closePlant;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.lightboxNext = lightboxNext;
window.lightboxPrev = lightboxPrev;
