/* ============================================================
   Aircry JDM — Sistema de carrito básico con localStorage
   ============================================================ */
(() => {
  const CART_KEY = 'cart';
  const PIEZAS_POR_ROLL = 10;

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  function updateBadge() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    const total = getCart().reduce((a, it) => a + (it.quantity || 0), 0);
    badge.textContent = total;
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  }

  // Mostrar feedback visual al agregar
  function toast(msg) {
    let t = document.querySelector('.toast-cart');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast-cart';
      Object.assign(t.style, {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#222',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '12px',
        fontWeight: '600',
        zIndex: '9999',
        boxShadow: '0 8px 20px rgba(0,0,0,.4)',
        opacity: '0',
        transition: 'opacity .25s ease, transform .25s ease'
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => { t.style.opacity = '1'; });
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 250); }, 1800);
  }

  // Función para agregar un producto al carrito
  function addToCart(card) {
    const name  = card.querySelector('strong')?.textContent.trim() || 'Producto';
    const price = Number(card.dataset.price || 0);
    const img   = card.querySelector('img')?.getAttribute('src');
    const pieces = Number(card.dataset.pieces || PIEZAS_POR_ROLL);

    let cart = getCart();
    const existing = cart.find(p => p.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price, img, quantity: 1, pieces });

    saveCart(cart);
    updateBadge();
    toast(`✅ ${name} agregado`);
  }

  // Detectar clicks en los botones “Agregar”
  document.addEventListener('click', e => {
    const btn = e.target.closest('button.btn');
    if (!btn) return;
    const texto = (btn.textContent || '').toLowerCase();
    if (!texto.includes('agregar')) return;
    const card = btn.closest('.card');
    if (!card) return;
    addToCart(card);
  });

  document.addEventListener('DOMContentLoaded', updateBadge);
})();
