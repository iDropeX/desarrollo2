(() => {
  const CART_KEY = 'cart';
  const DELIVERY = 2000;

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmtCLP = (n) =>
    (Number(n) || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function updateBadge() {
    const badge = $('.cart-badge');
    if (!badge) return;
    const totalItems = getCart().reduce((a, it) => a + Number(it.quantity || 0), 0);
    badge.textContent = String(totalItems);
    badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
  }

  function calcTotals(cart) {
    const subtotal = cart.reduce((a, it) => a + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
    return { subtotal, total: subtotal + DELIVERY };
  }

  function rowTemplate(it, idx) {
    return `
      <div class="cart-row row" data-index="${idx}" data-pieces="${it.pieces || 10}">
        <img src="${it.img || 'img/placeholder.jpg'}" alt="${it.name}">
        <div class="info">
          <strong>${it.name}</strong>
          <div class="muted">${fmtCLP(it.price || 0)} c/u</div>
        </div>
        <div class="qty">
          <button data-action="decrease" aria-label="Disminuir">−</button>
          <span>${it.quantity || 1}</span>
          <button data-action="increase" aria-label="Aumentar">+</button>
        </div>
        <div class="price-tag">${fmtCLP((it.price || 0) * (it.quantity || 1))}</div>
        <button class="btn ghost danger" data-action="remove">Quitar</button>
      </div>
    `;
  }

  function render() {
    const list = $('#cart-list');
    const empty = $('#cart-empty');
    const cart = getCart();

    if (!list) return;

    if (!cart.length) {
      empty?.classList?.remove('hidden');
      list.innerHTML = '';
    } else {
      empty?.classList?.add('hidden');
      list.innerHTML = cart.map(rowTemplate).join('');
    }

    const { subtotal, total } = calcTotals(cart);
    $('#sum-sub') && ($('#sum-sub').textContent = fmtCLP(subtotal));
    $('#sum-del') && ($('#sum-del').textContent = fmtCLP(DELIVERY));
    $('#sum-total') && ($('#sum-total').textContent = fmtCLP(total));

    updateBadge();
  }

  function changeQty(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    const q = Math.max(1, (Number(cart[index].quantity) || 1) + delta);
    cart[index].quantity = q;
    saveCart(cart);
    render();
  }

  function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    render();
  }

  function emptyCart() {
    localStorage.setItem(CART_KEY, '[]');
    render();
  }

  document.addEventListener('click', (e) => {
    const row = e.target.closest('.cart-row');
    if (!row) return;

    const idx = Number(row.dataset.index);
    const act = e.target.getAttribute('data-action');

    if (act === 'increase')  { changeQty(idx, +1); return; }
    if (act === 'decrease')  { changeQty(idx, -1); return; }
    if (act === 'remove')    { removeItem(idx);    return; }
  });

  const btnVaciar = $('#btnVaciar');
  if (btnVaciar) btnVaciar.addEventListener('click', emptyCart);

  document.addEventListener('DOMContentLoaded', render);
  window.addEventListener('storage', (e) => { if (e.key === CART_KEY) render(); });
})();
