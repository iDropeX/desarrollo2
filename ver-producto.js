document.addEventListener("DOMContentLoaded", () => {

  let modal = document.getElementById("producto-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "producto-modal";
    modal.innerHTML = `
      <div class="pm-backdrop"></div>
      <div class="pm-dialog">
        <button class="pm-close">✕</button>
        <div class="pm-content">
          <img class="pm-img" src="" alt="">
          <div class="pm-info">
            <h3 class="pm-title"></h3>
            <p class="pm-desc"></p>
            <p class="pm-price"></p>
            <button class="btn primary pm-add">Agregar al carrito</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const backdrop = modal.querySelector(".pm-backdrop");
  const closeBtn = modal.querySelector(".pm-close");
  const img = modal.querySelector(".pm-img");
  const title = modal.querySelector(".pm-title");
  const desc = modal.querySelector(".pm-desc");
  const price = modal.querySelector(".pm-price");
  const addBtn = modal.querySelector(".pm-add");

  function openModal(data) {
    img.src = data.img;
    img.alt = data.title;
    title.textContent = data.title;
    desc.textContent = data.desc;
    price.textContent = `Precio: $${data.price.toLocaleString("es-CL")}`;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    addBtn.onclick = () => {
      if (typeof addToCart === "function") addToCart(data);
      modal.classList.remove("open");
      document.body.style.overflow = "";
    };
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  document.body.addEventListener("click", e => {
    const btn = e.target.closest(".card .btn:not(.primary)");
    if (btn && btn.textContent.trim().toLowerCase() === "ver") {
      e.preventDefault();
      const card = btn.closest(".card");
      if (!card) return;
      const data = {
        title: card.querySelector("strong")?.textContent || "",
        desc: card.querySelector(".hint")?.textContent || "",
        img: card.querySelector("img")?.src || "",
        price: Number(card.dataset.price || 0),
        cat: card.dataset.cat || "",
      };
      openModal(data);
    }
  });
});
