const BASE_PRICE = 3990;
let qty = 1;

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const totalEl = $('#total');
const qtyEl = $('#qty');

function compute() {
  const base = document.querySelector('input[name="base"]:checked');
  const protein = document.querySelector('input[name="protein"]:checked');
  const fills = $$('input[name="fill"]:checked');
  const sauces = $$('input[name="sauce"]:checked');
  const tops = $$('input[name="top"]:checked');

  const extra =
    parseInt(base.dataset.price) +
    parseInt(protein.dataset.price) +
    fills.reduce((s, i) => s + parseInt(i.dataset.price), 0) +
    sauces.reduce((s, i) => s + parseInt(i.dataset.price), 0) +
    tops.reduce((s, i) => s + parseInt(i.dataset.price), 0);

  const unit = BASE_PRICE + extra;
  const total = unit * qty;
  totalEl.textContent = unit.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'}) +
    ` x${qty} = ` + total.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'});
  return {unit, total, base, protein, fills, sauces, tops};
}

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
}
function setCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }

$('#minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); qtyEl.textContent = qty; compute(); });
$('#plus').addEventListener('click', () => { qty++; qtyEl.textContent = qty; compute(); });
$('#roll-builder').addEventListener('change', compute);

$('#addCart').addEventListener('click', () => {
  const c = compute();
  const details = [
    `Base: ${c.base.value}`,
    `Proteína: ${c.protein.value}`,
    `Rellenos: ${c.fills.map(f => f.value).join(', ')}`,
    `Salsas: ${c.sauces.map(f => f.value).join(', ')}`,
    `Toppings: ${c.tops.map(f => f.value).join(', ')}`
  ].join(' | ');

  const cart = getCart();
  cart.push({
    id: 'custom-' + Date.now(),
    name: 'Roll personalizado',
    price: c.unit,
    qty,
    note: details,
    custom: true
  });
  setCart(cart);
  alert('✅ Roll personalizado agregado al carrito');
});

compute();