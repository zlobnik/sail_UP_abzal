/* ============================================================
   data.js — модуль данных. Каталог объектов недвижимости.
   Используется каталогом, поиском и блоком "избранные объекты".
   ============================================================ */

const PROPERTIES = [
  { id:1,  deal:"sale", type:"flat",    title:"3-комн. квартира в ЖК «Садовые кварталы»",
    district:"Хамовники", metro:"Фрунзенская", price:48900000, area:96,  rooms:3, floor:7,  floors:9,  year:2019, img:"assets/img/prop1.svg", legal:"individual", featured:true },
  { id:2,  deal:"sale", type:"office",  title:"Офисное помещение класса B+ в бизнес-центре",
    district:"Пресненский", metro:"Деловой центр", price:72500000, area:184, rooms:0, floor:14, floors:32, year:2016, img:"assets/img/prop2.svg", legal:"legal", featured:true },
  { id:3,  deal:"sale", type:"house",   title:"Загородный дом с участком 12 соток",
    district:"Одинцовский р-н", metro:"—", price:39200000, area:240, rooms:5, floor:1, floors:2, year:2021, img:"assets/img/prop3.svg", legal:"individual", featured:true },
  { id:4,  deal:"rent", type:"flat",    title:"2-комн. квартира с дизайнерским ремонтом",
    district:"Якиманка", metro:"Полянка", price:185000, area:64, rooms:2, floor:5, floors:12, year:2018, img:"assets/img/prop4.svg", legal:"individual", featured:true },
  { id:5,  deal:"sale", type:"house",   title:"Таунхаус в коттеджном посёлке",
    district:"Красногорск", metro:"Мякинино", price:27800000, area:158, rooms:4, floor:1, floors:3, year:2020, img:"assets/img/prop5.svg", legal:"individual", featured:false },
  { id:6,  deal:"rent", type:"office",  title:"Open-space офис 320 м² в БЦ класса A",
    district:"Тверской", metro:"Маяковская", price:980000, area:320, rooms:0, floor:9, floors:18, year:2015, img:"assets/img/prop6.svg", legal:"legal", featured:true },
  { id:7,  deal:"sale", type:"flat",    title:"Студия в новостройке у метро",
    district:"Даниловский", metro:"Тульская", price:12400000, area:31, rooms:1, floor:11, floors:24, year:2023, img:"assets/img/prop7.svg", legal:"individual", featured:false },
  { id:8,  deal:"sale", type:"office",  title:"Торговое помещение с отдельным входом",
    district:"Басманный", metro:"Бауманская", price:54300000, area:142, rooms:0, floor:1, floors:7, year:2012, img:"assets/img/prop8.svg", legal:"legal", featured:false },
  { id:9,  deal:"rent", type:"flat",    title:"1-комн. квартира рядом с парком",
    district:"Сокольники", metro:"Сокольники", price:72000, area:42, rooms:1, floor:3, floors:9, year:2017, img:"assets/img/prop9.svg", legal:"individual", featured:false },
  { id:10, deal:"sale", type:"flat",    title:"4-комн. квартира с видом на реку",
    district:"Раменки", metro:"Раменки", price:63700000, area:128, rooms:4, floor:18, floors:25, year:2022, img:"assets/img/prop1.svg", legal:"individual", featured:false },
  { id:11, deal:"rent", type:"house",   title:"Дом в аренду для посольства, охрана 24/7",
    district:"Рублёвка", metro:"—", price:1450000, area:420, rooms:6, floor:1, floors:2, year:2019, img:"assets/img/prop3.svg", legal:"legal", featured:false },
  { id:12, deal:"sale", type:"office",  title:"Готовый арендный бизнес — помещение с арендатором",
    district:"Замоскворечье", metro:"Павелецкая", price:91000000, area:265, rooms:0, floor:1, floors:9, year:2014, img:"assets/img/prop2.svg", legal:"legal", featured:false }
];

const TYPE_LABELS  = { flat:"Квартира", house:"Дом", office:"Коммерция" };
const DEAL_LABELS  = { sale:"Продажа", rent:"Аренда" };
const LEGAL_LABELS = { individual:"Физ. лицо", legal:"Юр. лицо" };
