/* ============================================================
   app.js — общие модули сайта.
   Форматирование, рендер карточек, валидация формы, модальные окна,
   избранное, анимации появления.
   ============================================================ */

/* ---- Форматирование цены (числовой алгоритм) ---- */
function formatPrice(value, deal){
  const nf = new Intl.NumberFormat('ru-RU');
  if (deal === 'rent') return nf.format(value) + ' ₽/мес';
  return nf.format(value) + ' ₽';
}
function formatArea(a){ return a + ' м²'; }

/* ---- SVG-иконки ---- */
const ICONS = {
  area:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3h18v18H3z"/><path d="M3 9h18M9 3v18"/></svg>',
  rooms:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-6h6v6"/></svg>',
  floor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20h16M4 14h10M4 8h6"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.5 6 4.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 4.7 3.5 3.2 6.5C19 15.4 12 20 12 20z"/></svg>'
};

/* ---- Избранное (в памяти сессии) ---- */
const favorites = new Set();
function toggleFavorite(id, el){
  if (favorites.has(id)){ favorites.delete(id); el.classList.remove('on'); }
  else { favorites.add(id); el.classList.add('on'); }
}

/* ---- Рендер карточки объекта ---- */
function renderCard(p){
  const dealClass = p.deal === 'rent' ? 'rent' : '';
  return `
  <article class="card reveal" data-id="${p.id}">
    <div class="media">
      <img src="${p.img}" alt="${p.title}" loading="lazy">
      <span class="tag ${dealClass}">${DEAL_LABELS[p.deal]}</span>
      <button class="fav" aria-label="В избранное" onclick="toggleFavorite(${p.id}, this)">${ICONS.heart}</button>
    </div>
    <div class="body">
      <div class="price">${formatPrice(p.price, p.deal)}</div>
      <div class="title">${p.title}</div>
      <div class="addr">${ICONS.pin}<span>${p.district}${p.metro!=='—' ? ' · м. '+p.metro : ''}</span></div>
      <div class="specs">
        <span>${ICONS.area}<b>${p.area}</b> м²</span>
        ${p.rooms>0 ? `<span>${ICONS.rooms}<b>${p.rooms}</b> комн.</span>` : `<span>${TYPE_LABELS[p.type]}</span>`}
        <span>${ICONS.floor}<b>${p.floor}</b>/${p.floors} эт.</span>
      </div>
    </div>
  </article>`;
}

/* ---- Анимация появления при прокрутке ---- */
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((en,i)=>{
      if (en.isIntersecting){ setTimeout(()=>en.target.classList.add('in'), i*60); io.unobserve(en.target); }
    });
  }, { threshold:0.12 });
  els.forEach(e=>io.observe(e));
}

/* ---- Модальное окно заявки ---- */
function openModal(){ document.getElementById('lead-modal')?.classList.add('show'); }
function closeModal(){ document.getElementById('lead-modal')?.classList.remove('show'); }

/* ---- Валидация и отправка формы (имитация, без бэкенда) ---- */
function validatePhone(v){ return /^[\d\s+\-()]{10,18}$/.test(v.trim()); }
function validateName(v){ return v.trim().length >= 2; }

function handleLeadSubmit(formId, successId){
  const form = document.getElementById(formId);
  if (!form) return;
  const fields = form.querySelectorAll('[data-required]');
  let ok = true;
  fields.forEach(f=>{
    const wrap = f.closest('.field');
    let valid = f.value.trim().length > 0;
    if (f.name === 'phone') valid = validatePhone(f.value);
    if (f.name === 'name')  valid = validateName(f.value);
    wrap.classList.toggle('err', !valid);
    if (!valid) ok = false;
  });
  const consent = form.querySelector('[name="consent"]');
  if (consent && !consent.checked){ ok = false; consent.closest('.consent').style.color = '#b3433a'; }
  if (!ok) return;
  // Здесь в боевой версии — отправка на сервер (fetch POST). В демо — показ успеха.
  form.style.display = 'none';
  document.getElementById(successId)?.classList.add('show');
}

/* ---- Инициализация ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  initReveal();
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
});
