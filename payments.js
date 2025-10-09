/* payments.js — Pago seguro (simulado con handoff a gateway) */
(function(){
  const fmt = n => n.toLocaleString('es-CL',{style:'currency',currency:'CLP'}).replace(/\s/g,'');
  const toInt = n => Math.max(0, parseInt(n||0,10) || 0);

  // Intentamos leer carrito de distintas claves por compatibilidad
  function readCart(){
    const raw = localStorage.getItem('aircry_cart') || localStorage.getItem('cart') || '[]';
    try{ return JSON.parse(raw) }catch{ return [] }
  }

  // Fallback de precios si no existe PRODUCTS global
  const PRICE_MAP = {
    empanado: 7990, ebi: 7990, spicy: 7490, veggie: 5990, nikkei: 6990,
    salmon: 6990, atun: 6490, 'handroll-salmon': 4990, 'handroll-camaron': 5490
  };

  function getItemInfo(item){
    // Si app.js expone PRODUCTS, úsalo; si no, usamos fallback
    const byId = (window.PRODUCTS || []).find(p => p.id === item.id);
    const name = byId?.name || item.name || item.id;
    const price = toInt(byId?.price || item.price || PRICE_MAP[item.id] || 0);
    const qty = toInt(item.qty || item.quantity || 1);
    return { id:item.id, name, price, qty };
  }

  function renderSummary(){
    const ul = document.getElementById('summary-list');
    if(!ul) return;

    const cart = readCart().map(getItemInfo).filter(x=>x.qty>0 && x.price>0);
    ul.innerHTML = '';
    if(cart.length === 0){
      ul.innerHTML = `<li class="muted">Tu carrito está vacío</li>`;
    }else{
      cart.forEach(it=>{
        const li = document.createElement('li');
        li.innerHTML = `<span>${it.qty}× ${it.name}</span><span>${fmt(it.price*it.qty)}</span>`;
        ul.appendChild(li);
      });
    }

    const subtotal = cart.reduce((a,b)=> a + b.price*b.qty, 0);
    const delivery = cart.length ? 2000 : 0;
    const total = subtotal + delivery;

    document.getElementById('sum-subtotal')?.replaceChildren(document.createTextNode(fmt(subtotal)));
    document.getElementById('sum-delivery')?.replaceChildren(document.createTextNode(fmt(delivery)));
    document.getElementById('sum-total')?.replaceChildren(document.createTextNode(fmt(total)));

    // Guardamos total por si el gateway lo requiere
    sessionStorage.setItem('checkout_total', String(total));
    sessionStorage.setItem('checkout_payload', JSON.stringify({items:cart, subtotal, delivery, total}));
  }

  function getSelectedPM(){
    const r = document.querySelector('input[name="pm"]:checked');
    return r ? r.value : null;
  }

  function validateForm(){
    const need = ['ck-name','ck-email','ck-phone','ck-address'];
    for(const id of need){
      const el = document.getElementById(id);
      if(!el || !el.value.trim()){ alert('Completa todos los campos de contacto/entrega'); return false; }
    }
    const email = document.getElementById('ck-email').value.trim();
    if(!/^\S+@\S+\.\S+$/.test(email)){ alert('Correo inválido'); return false; }
    return true;
  }

  function pay(){
    if(!validateForm()) return;
    const cart = readCart();
    if(cart.length===0){ alert('Tu carrito está vacío'); return; }

    const pm = getSelectedPM();
    const payload = JSON.parse(sessionStorage.getItem('checkout_payload')||'{}');
    // Normalmente aquí llamarías a tu backend para crear la transacción:
    // POST /api/checkout {pm, payload, customer:{...}}
    // y tu backend responde con la URL del gateway (Webpay/MercadoPago).
    // Por ahora haremos un handoff simulado:

    if(pm === 'webpay'){
      alert('Redirigiendo a Webpay (simulado)…');
      // window.location.href = 'https://webpay.cl/...'; // en producción
      window.location.href = 'success.html?pm=webpay';
    }else if(pm === 'mercadopago'){
      alert('Redirigiendo a MercadoPago (simulado)…');
      // window.location.href = 'https://mercadopago.com/...'
      window.location.href = 'success.html?pm=mercadopago';
    }else{
      // Efectivo
      alert('Pedido confirmado. Pagarás en efectivo al recibir.');
      window.location.href = 'success.html?pm=efectivo';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Solo en checkout.html
    if(!document.getElementById('pay-btn')) return;
    renderSummary();
    document.getElementById('pay-btn').addEventListener('click', pay);
  });
})();
