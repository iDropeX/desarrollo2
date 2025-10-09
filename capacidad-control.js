/* ============================================================
   Aircry JDM — Control de capacidad (compatible total)
   No bloquea el evento original. 
   Solo actúa después de agregar.
   ============================================================ */
(() => {
  const MAX_PIEZAS = 50;
  const PIEZAS_POR_ROLL = 10;

  /* ---------- util: leer carrito ---------- */
  function readCart() {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  }
  function getTotalPiezas() {
    return readCart().reduce(
      (a, it) => a + (Number(it.quantity || 0) * Number(it.pieces || PIEZAS_POR_ROLL)),
      0
    );
  }
  function updateBadge() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    const count = readCart().reduce((a, it) => a + Number(it.quantity || 0), 0);
    badge.textContent = count;
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  }

  /* ---------- feedback visual ---------- */
  function showAlert(msg = '⚠️ Control de capacidad: no puedes superar las 50 piezas.') {
    let t = document.querySelector('.toast-capacidad');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast-capacidad';
      Object.assign(t.style, {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#111',
        color: '#fff',
        border: '1px solid #ff1f1f',
        padding: '10px 16px',
        borderRadius: '12px',
        fontWeight: '700',
        zIndex: '9999',
        boxShadow: '0 10px 30px rgba(0,0,0,.4)',
        opacity: '0',
        transition: 'opacity .25s ease, transform .25s ease',
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(-4px)';
    });
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(6px)';
      setTimeout(() => t.remove(), 250);
    }, 2500);
  }

  function highlightButton(btn) {
    if (!btn) return;
    btn.style.transition = 'background 0.3s, color 0.3s';
    const originalBg = btn.style.background;
    const originalColor = btn.style.color;
    btn.style.background = '#ff1f1f';
    btn.style.color = '#fff';
    btn.style.transform = 'scale(1.05)';
    setTimeout(() => {
      btn.style.background = originalBg || '';
      btn.style.color = originalColor || '';
      btn.style.transform = 'scale(1)';
    }, 800);
  }

  /* ============================================================
     MENÚ — observa los botones después de click
     ============================================================ */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn, button');
    if (!btn) return;
    const texto = (btn.textContent || '').toLowerCase();
    if (!texto.includes('agregar') && !texto.includes('añadir')) return;

    // Espera a que se ejecute tu addToCart (200 ms)
    setTimeout(() => {
      const total = getTotalPiezas();
      if (total >= MAX_PIEZAS) {
        showAlert('⚠️ Control de capacidad: no puedes agregar más de 50 piezas.');
        highlightButton(btn);
      } else {
        updateBadge();
      }
    }, 200);
  });

  /* ============================================================
     CARRITO — controla el botón "+"
     ============================================================ */
  document.addEventListener('click', (e) => {
    const plus = e.target.closest('.qty button');
    if (!plus) return;
    if (!plus.textContent.includes('+')) return;

    setTimeout(() => {
      const total = getTotalPiezas();
      if (total >= MAX_PIEZAS) {
        showAlert('⚠️ Control de capacidad: alcanzaste el máximo de 49 piezas.');
        highlightButton(plus);
      } else {
        updateBadge();
      }
    }, 200);
  });

  document.addEventListener('DOMContentLoaded', updateBadge);
})();
