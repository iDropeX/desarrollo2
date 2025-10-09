// =============== APP.JS ===============
// Controla el carrito, contador y notificaciones
document.addEventListener("DOMContentLoaded", () => {
  const cartBadge = document.getElementById("cart-badge");
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");

  // --- Recuperar carrito del localStorage ---
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    cart = [];
  }

  // --- Actualiza número en el ícono del carrito ---
  function updateCartBadge() {
    if (!cartBadge) return;
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalItems > 0) {
      cartBadge.textContent = totalItems;
      cartBadge.hidden = false;
    } else {
      cartBadge.hidden = true;
    }
  }

  // --- Guarda cambios en localStorage ---
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
  }

  // --- Muestra mini mensaje "agregado" ---
  function showToast(msg) {
    if (!toast) return;
    toastText.textContent = msg;
    toast.style.display = "flex";
    toast.classList.add("visible");
    setTimeout(() => {
      toast.classList.remove("visible");
      toast.style.display = "none";
    }, 2000);
  }

  // --- Agrega producto (evita duplicados) ---
  function addToCart(product) {
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart();
    showToast(`✅ ${product.name} agregado`);
  }

  // --- Detecta clics en botones "Agregar" ---
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price, 10),
      };
      addToCart(product);
    });
  });

  // --- Inicializa contador al cargar ---
  updateCartBadge();
});
