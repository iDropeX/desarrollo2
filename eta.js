(() => {
  const BASE_PREP_MIN   = 5;   // mínimo por preparación
  const MIN_PER_KM      = 3;   // minutos por kilómetro
  const RUSH_MULTIPLIER = 1.5; // hora punta

  const sel = (root, s) => root.querySelector(s);
  const parseNum = (v) => {
    if (typeof v !== 'string') v = String(v ?? '');
    const m = v.replace(',', '.').match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : 0;
  };

  const box = document.getElementById('tiempo') || document;

  const distInput =
      sel(box, '#etaKm') ||
      sel(box, '#distancia') ||
      sel(box, 'input[name="distancia"]') ||
      sel(box, 'input[data-eta-km]') ||
      sel(box, 'input[type="number"]');

  const rushInput =
      sel(box, '#etaRush') ||
      sel(box, '#hora-punta') ||
      sel(box, 'input[data-eta-rush]');

  const outEl =
      sel(box, '#etaOut') ||
      sel(box, '#resultado') ||
      sel(box, '[data-eta-out]');

  const btnCalc =
      sel(box, '#etaCalc') ||
      sel(box, '#btnRecalc') ||
      sel(box, '[data-eta-calc]');

  const btnNear =
      sel(box, '#etaNear') ||
      sel(box, '#btnCerca') ||
      sel(box, '[data-km="2"]');

  const btnMid  =
      sel(box, '#etaMid') ||
      sel(box, '#btnMedio') ||
      sel(box, '[data-km="5"]');

  const btnFar  =
      sel(box, '#etaFar') ||
      sel(box, '#btnLejos') ||
      sel(box, '[data-km="9"]');

  if (!outEl) {
    console.warn('[ETA] No encontré el elemento de salida (#etaOut / #resultado).');
  }

  function computeETA(km, rush) {
    km = Math.max(0, km);
    let t = Math.max(BASE_PREP_MIN, km * MIN_PER_KM);
    if (rush) t *= RUSH_MULTIPLIER;
    const lo = Math.max(1, Math.round(t));
    const hi = lo + 1;
    return { lo, hi };
  }

  function setOutput(text) {
    if (!outEl) return;
    outEl.innerHTML = `Entrega estimada: <strong>${text}</strong>`;
  }

  function currentKm() {
    if (!distInput) return 0;
    return parseNum(distInput.value ?? distInput.textContent ?? 0);
  }

  function isRush() {
    return !!(rushInput && rushInput.checked);
  }

  function recalc() {
    const km = currentKm();
    const r  = isRush();
    const { lo, hi } = computeETA(km, r);
    setOutput(`${lo}–${hi} min`);
  }

  if (distInput) {
    distInput.addEventListener('input',  recalc);
    distInput.addEventListener('change', recalc);
  }
  if (rushInput) {
    rushInput.addEventListener('change', recalc);
  }
  if (btnCalc) {
    btnCalc.addEventListener('click', (e) => { e.preventDefault(); recalc(); });
  }

  function attachQuick(btn) {
    if (!btn || !distInput) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const km = btn.dataset.km ? parseNum(btn.dataset.km) : parseNum(btn.textContent);
      distInput.value = km;
      recalc();
    });
  }
  attachQuick(btnNear);
  attachQuick(btnMid);
  attachQuick(btnFar);

  document.addEventListener('DOMContentLoaded', recalc);
  setTimeout(recalc, 100);
})();
