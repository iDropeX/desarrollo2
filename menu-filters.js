(function(){
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));

  function indexCards(){
    qsa('.section-title').forEach(h2 => {
      const cat = h2.textContent.trim().toLowerCase().replace(/^[^a-záéíóúñ]+/i,'');
      const car = h2.nextElementSibling;
      if(!car || !car.classList.contains('carousel')) return;
      car.querySelectorAll('.carousel-track .card').forEach(card => {
        const name = (card.querySelector('strong')?.textContent || '').trim().toLowerCase();
        const priceTxt = (card.querySelector('.chip')?.textContent || '0').replace(/[^\d]/g,'');
        const price = parseInt(priceTxt || '0', 10);
        const desc = (card.querySelector('.hint')?.textContent || '').toLowerCase();
        const tags = [];
        if(/spicy|picante|togarashi/.test(desc)) tags.push('spicy');
        if(/veggie|veget/i.test(desc)) tags.push('veggie');
        if(/salm[oó]n|salmon/.test(desc)) tags.push('salmón');
        if(/camar[oó]n|ebi/.test(desc)) tags.push('camarón');
        if(/empanad/.test(name) || /empanad/.test(desc)) tags.push('empanado');

        card.dataset.cat = cat;
        card.dataset.name = name;
        card.dataset.price = price;
        card.dataset.tags = tags.join(',');
      });
    });
  }

  function applyFilters(){
    const resultEl = qs('#filters-result');
    const q   = (qs('#f-q')?.value || '').trim().toLowerCase();
    const cat = (qs('#f-cat')?.value || '').trim().toLowerCase();
    const min = parseInt(qs('#f-min')?.value || '0', 10);
    const max = parseInt(qs('#f-max')?.value || '0', 10);
    const tagVals = qsa('.f-tag:checked').map(ch => ch.value.toLowerCase());

    const allCards = qsa('.carousel-track .card');
    let shown = 0;

    allCards.forEach(card => {
      const name = card.dataset.name || '';
      const desc = (card.querySelector('.hint')?.textContent || '').toLowerCase();
      const price = parseInt(card.dataset.price || '0', 10);
      const cardCat = (card.dataset.cat || '').toLowerCase();
      const tags = (card.dataset.tags || '').split(',').filter(Boolean);

      let ok = true;
      if (q && !(name.includes(q) || desc.includes(q))) ok = false;
      if (ok && cat && cardCat !== cat) ok = false;
      if (ok && min && price < min) ok = false;
      if (ok && max && price > max) ok = false;
      if (ok && tagVals.length && !tagVals.every(t => tags.includes(t))) ok = false;

      card.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });

    const total = allCards.length;
    if (resultEl){
      if (!q && !cat && !min && !max && tagVals.length===0){
        resultEl.textContent = `Mostrando todos los productos (${total})`;
      } else {
        resultEl.textContent = `Mostrando ${shown} de ${total} productos`;
      }
    }
  }

  function clearFilters(){
    ['#f-q','#f-cat','#f-min','#f-max'].forEach(id=>{
      const el = qs(id); if(el) el.value='';
    });
    qsa('.f-tag').forEach(ch => ch.checked=false);
    applyFilters();
  }

  function openDrawer(){ qs('#filters-drawer')?.classList.add('open'); }
  function closeDrawer(){ qs('#filters-drawer')?.classList.remove('open'); }

  document.addEventListener('DOMContentLoaded', () => {
    if (!qs('#filters-form')) return;

    indexCards();
    applyFilters();

    qs('#open-filters')?.addEventListener('click', openDrawer);
    qsa('[data-close-filters]')?.forEach(b => b.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => { if(e.key==='Escape') closeDrawer(); });

    qs('#f-apply')?.addEventListener('click', ()=>{ applyFilters(); closeDrawer(); });
    qs('#f-clear')?.addEventListener('click', clearFilters);

    qs('#f-q')?.addEventListener('input', ()=>{
      clearTimeout(window.__fDeb);
      window.__fDeb = setTimeout(applyFilters, 180);
    });

    ['change','input'].forEach(ev=>{
      qs('#f-cat')?.addEventListener(ev, applyFilters);
      qs('#f-min')?.addEventListener(ev, applyFilters);
      qs('#f-max')?.addEventListener(ev, applyFilters);
      qsa('.f-tag').forEach(ch => ch.addEventListener('change', applyFilters));
    });
  });
})();
