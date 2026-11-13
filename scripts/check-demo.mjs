// Smoke tests de la demo estática, sin dependencias de npm.
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";

const code = readFileSync(new URL("../docs/app.js", import.meta.url), "utf8");
const listeners = {};
const nodes = new Map();
const storage = new Map();
let currentHash = "#inicio";
const location = {
  get hash() { return currentHash; },
  set hash(v) { currentHash = v; (listeners.hashchange || []).forEach(fn => fn()); }
};
function el(sel) {
  if (!nodes.has(sel)) nodes.set(sel, {
    innerHTML: "", textContent: "", value: "",
    classList: { add(){}, remove(){}, toggle(){} },
    setAttribute(){}, removeAttribute(){}, focus(){}, addEventListener(){},
    showModal(){ this.open = true; }, close(){ this.open = false; },
    querySelector(){ return null; }, open: false
  });
  return nodes.get(sel);
}
const document = {
  title:"", activeElement:{tagName:"BODY"},
  querySelector:el, querySelectorAll:()=>[],
  addEventListener: (event,cb)=>((listeners[event] ??= []).push(cb))
};
const window = { addEventListener: (event,cb)=>((listeners[event] ??= []).push(cb)) };
const localStorage = {
  getItem:k=>storage.get(k)??null,
  setItem:(k,v)=>storage.set(k,String(v))
};
const history = {replaceState:(_a,_b,hash)=>{currentHash=hash;}};
runInNewContext(code,{ document,window,localStorage,history,location,Intl,Date,Math,Number,String,
  Object,Array,JSON,RegExp,Map,Set,Boolean,Symbol,isNaN,console,setTimeout,clearTimeout });
const view = ()=>el("#view").innerHTML;
assert.match(view(),/Book Recommendation/);
assert.match(view(),/Book Category/);
assert.match(view(),/discover-search-form/);
assert.match(view(),/covers\.openlibrary\.org/);
function route(hash,required) {
  location.hash=hash;
  assert.match(view(),required,hash);
}
route("#libros",/Explora nuestra biblioteca/);
route("#libros/1",/La sombra del viento/);
assert.match(view(),/Historial de préstamos/);
assert.match(view(),/Registrar préstamo/);
route("#prestamos",/Control de préstamos/);
route("#prestamos/1",/Seguimiento del préstamo/);
assert.match(view(),/Lucía Martínez/);
route("#usuarios/1",/Historial de lectura/);
route("#eventos",/Eventos que nos reúnen/);
route("#eventos/1",/Personas inscritas/);
route("#libros/9999",/Esta ficha no existe/);
// Control de favoritos y filtros sin modificar el backend.
route("#libros/1",/Guardar/);
const button = {dataset:{action:"favorite",id:"1"},disabled:false};
(listeners.click || []).forEach(fn => fn({
  target: {closest:sel=>sel==="[data-action]"?button:null}
}));
assert.match(view(),/Guardado/);
assert.equal(JSON.parse(storage.get("mrbibliomante-demo-v1")).favorites[0],1);
route("#libros",/Explora nuestra biblioteca/);
const filterBtn={dataset:{filter:"favoritos"}};
(listeners.click || []).forEach(fn=>fn({target:{
  closest:sel=>sel==="[data-filter]"?filterBtn:null
}}));
assert.match(view(),/La sombra del viento/);
assert.doesNotMatch(view(),/Cien años de soledad/);
console.log("✓ Discover, portadas ISBN, navegación, fichas, favoritos y filtros: OK");
