/* ============================================================
   catalog.js — модуль каталога.
   Реализует алгоритмы поиска, фильтрации и сортировки объектов.
   ============================================================ */

const state = {
  deal:   'all',     // all | sale | rent
  type:   'all',     // all | flat | house | office
  legal:  'all',     // all | individual | legal
  query:  '',
  priceMin: null,
  priceMax: null,
  areaMin:  null,
  rooms:  [],        // массив выбранных значений комнатности
  sort:   'price_desc'
};

/* ---- Алгоритм поиска по подстроке (регистронезависимый) ----
   Возвращает true, если запрос встречается в названии/районе/метро. */
function matchesQuery(p, q){
  if (!q) return true;
  const hay = (p.title + ' ' + p.district + ' ' + p.metro).toLowerCase();
  return hay.indexOf(q.toLowerCase().trim()) !== -1;
}

/* ---- Алгоритм фильтрации табличных данных ----
   Последовательно применяет все активные критерии. O(n·k). */
function applyFilters(list){
  return list.filter(p => {
    if (state.deal  !== 'all' && p.deal  !== state.deal)  return false;
    if (state.type  !== 'all' && p.type  !== state.type)  return false;
    if (state.legal !== 'all' && p.legal !== state.legal) return false;
    if (state.priceMin !== null && p.price < state.priceMin) return false;
    if (state.priceMax !== null && p.price > state.priceMax) return false;
    if (state.areaMin  !== null && p.area  < state.areaMin)  return false;
    if (state.rooms.length && !state.rooms.includes(roomBucket(p.rooms))) return false;
    if (!matchesQuery(p, state.query)) return false;
    return true;
  });
}

/* Группировка комнатности: 4 = "4+" */
function roomBucket(r){ return r >= 4 ? 4 : r; }

/* ---- Алгоритм сортировки ----
   Компараторы для разных полей; Array.prototype.sort, O(n·log n). */
const comparators = {
  price_asc:  (a,b) => a.price - b.price,
  price_desc: (a,b) => b.price - a.price,
  area_desc:  (a,b) => b.area  - a.area,
  year_desc:  (a,b) => b.year  - a.year
};
function applySort(list){
  const cmp = comparators[state.sort] || comparators.price_desc;
  return [...list].sort(cmp);
}

/* ---- Главная функция отрисовки каталога ---- */
function renderCatalog(){
  const filtered = applySort(applyFilters(PROPERTIES));
  const grid  = document.getElementById('catalog-grid');
  const count = document.getElementById('result-count');
  count.innerHTML = `Найдено объектов: <b>${filtered.length}</b>`;
  if (!filtered.length){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <p>По заданным параметрам ничего не найдено.<br>Попробуйте смягчить фильтры.</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map(renderCard).join('');
  initReveal();
}

/* ---- Привязка элементов управления ---- */
function bindControls(){
  // сегменты "сделка / тип / лицо"
  document.querySelectorAll('[data-seg]').forEach(group=>{
    group.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        group.querySelectorAll('button').forEach(b=>b.classList.remove('on'));
        btn.classList.add('on');
        state[group.dataset.seg] = btn.dataset.val;
        renderCatalog();
      });
    });
  });
  // поиск
  const search = document.getElementById('f-query');
  search && search.addEventListener('input', e => { state.query = e.target.value; renderCatalog(); });
  // цена / площадь
  const bind = (id, key, parse) => {
    const el = document.getElementById(id);
    el && el.addEventListener('input', e => {
      const v = e.target.value.trim();
      state[key] = v === '' ? null : parse(v);
      renderCatalog();
    });
  };
  bind('f-price-min', 'priceMin', Number);
  bind('f-price-max', 'priceMax', Number);
  bind('f-area-min',  'areaMin',  Number);
  // комнатность
  document.querySelectorAll('[data-room]').forEach(chk=>{
    chk.addEventListener('change', ()=>{
      const val = Number(chk.dataset.room);
      if (chk.checked) state.rooms.push(val);
      else state.rooms = state.rooms.filter(r=>r!==val);
      renderCatalog();
    });
  });
  // сортировка
  const sort = document.getElementById('f-sort');
  sort && sort.addEventListener('change', e=>{ state.sort = e.target.value; renderCatalog(); });
  // сброс
  document.getElementById('f-reset')?.addEventListener('click', (e)=>{
    e.preventDefault();
    Object.assign(state,{deal:'all',type:'all',legal:'all',query:'',priceMin:null,priceMax:null,areaMin:null,rooms:[],sort:'price_desc'});
    document.querySelectorAll('[data-seg] button').forEach(b=>b.classList.toggle('on', b.dataset.val==='all'));
    document.querySelectorAll('.filters input').forEach(i=>{ if(i.type==='checkbox') i.checked=false; else i.value=''; });
    const ss=document.getElementById('f-sort'); if(ss) ss.value='price_desc';
    renderCatalog();
  });
}

/* ---- Применение параметров из URL (быстрый поиск с главной) ---- */
function applyUrlParams(){
  const q = new URLSearchParams(location.search);
  if (q.get('deal')) state.deal = q.get('deal');
  if (q.get('type')) state.type = q.get('type');
  if (q.get('q'))    { state.query = q.get('q'); const s=document.getElementById('f-query'); if(s) s.value=state.query; }
  document.querySelectorAll('[data-seg]').forEach(group=>{
    const key=group.dataset.seg;
    group.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.val===state[key]));
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  if (!document.getElementById('catalog-grid')) return;
  bindControls();
  applyUrlParams();
  renderCatalog();
});
