/* ============================================================
   valuation.js — модуль оценки рыночной стоимости.
   Сравнительный (рыночный) подход: базовая ставка за м² по
   району и типу, корректируемая поправочными коэффициентами.
   ============================================================ */

/* Базовая удельная цена, ₽ за м² (по типу объекта и классу района) */
const BASE_RATE = {
  flat:   { center:620000, mid:430000, outer:285000 },
  house:  { center:340000, mid:240000, outer:165000 },
  office: { center:520000, mid:360000, outer:240000 }
};

/* Зона района */
const DISTRICT_ZONE = {
  'Хамовники':'center','Якиманка':'center','Тверской':'center','Пресненский':'center',
  'Замоскворечье':'center','Басманный':'mid','Даниловский':'mid','Раменки':'mid',
  'Сокольники':'mid','Красногорск':'outer','Одинцовский':'outer','Рублёвка':'center'
};

/* Поправочные коэффициенты (мультипликаторы к базовой стоимости) */
function conditionFactor(c){ return ({ new:1.12, good:1.0, need_repair:0.84 })[c] || 1; }
function floorFactor(type, floor, floors){
  if (type !== 'flat') return 1;
  if (floor === 1) return 0.95;            // первый этаж дешевле
  if (floor === floors) return 0.97;       // последний — небольшая скидка
  return 1.0;
}
function ageFactor(year){
  const age = new Date().getFullYear() - year;
  if (age <= 3)  return 1.06;
  if (age <= 10) return 1.0;
  if (age <= 25) return 0.92;
  return 0.85;
}
function liquidityFactor(area, type){
  // очень большие площади менее ликвидны на 1 м²
  if (type === 'flat' && area > 110) return 0.96;
  if (type === 'office' && area > 300) return 0.94;
  return 1;
}

/* ---- Главный алгоритм оценки ---- */
function estimateValue(input){
  const zone = input.zone;
  const base = BASE_RATE[input.type][zone];
  const kCond  = conditionFactor(input.condition);
  const kFloor = floorFactor(input.type, input.floor, input.floors);
  const kAge   = ageFactor(input.year);
  const kLiq   = liquidityFactor(input.area, input.type);
  const ratePerM2 = base * kCond * kFloor * kAge * kLiq;
  const value = ratePerM2 * input.area;
  return {
    value: Math.round(value / 100000) * 100000,   // округление до 100 тыс.
    ratePerM2: Math.round(ratePerM2),
    low:  Math.round(value * 0.93 / 100000) * 100000,
    high: Math.round(value * 1.07 / 100000) * 100000,
    factors: { base, kCond, kFloor, kAge, kLiq }
  };
}

/* ---- Связь с интерфейсом ---- */
function readForm(){
  const g = id => document.getElementById(id);
  return {
    type:  g('v-type').value,
    zone:  g('v-zone').value,
    area:  Number(g('v-area').value),
    condition: g('v-condition').value,
    floor: Number(g('v-floor').value),
    floors:Number(g('v-floors').value),
    year:  Number(g('v-year').value)
  };
}

function nf(x){ return new Intl.NumberFormat('ru-RU').format(x); }

function recalc(){
  const input = readForm();
  // живые подписи слайдеров
  document.getElementById('v-area-val').textContent  = input.area + ' м²';
  document.getElementById('v-year-val').textContent  = input.year;
  document.getElementById('v-floor-val').textContent = input.floor + '/' + input.floors;
  if (!input.area){ return; }
  const r = estimateValue(input);
  document.getElementById('v-estimate').textContent = nf(r.value) + ' ₽';
  document.getElementById('v-range').textContent =
    'Диапазон: ' + nf(r.low) + ' – ' + nf(r.high) + ' ₽';
  document.getElementById('v-rate').textContent  = nf(r.ratePerM2) + ' ₽';
  document.getElementById('v-area-out').textContent = input.area + ' м²';
  document.getElementById('v-cond-out').textContent =
    ({ new:'×1.12', good:'×1.00', need_repair:'×0.84' })[input.condition];
  document.getElementById('v-age-out').textContent  = '×' + r.factors.kAge.toFixed(2);
}

document.addEventListener('DOMContentLoaded', ()=>{
  if (!document.getElementById('val-form')) return;
  ['v-type','v-zone','v-area','v-condition','v-floor','v-floors','v-year']
    .forEach(id => { const el=document.getElementById(id); el && el.addEventListener('input', recalc); });
  recalc();
});
