document.addEventListener("DOMContentLoaded", () => {
  const distInput = document.querySelector("#distancia");
  const horaPunta = document.querySelector("#hora-punta");
  const salida = document.querySelector("#resultado");
  const btnRecalc = document.querySelector("#btnRecalc");
  const btnCerca = document.querySelector("#btnCerca");
  const btnMedio = document.querySelector("#btnMedio");
  const btnLejos = document.querySelector("#btnLejos");

  function calcular() {
    let km = parseFloat(distInput.value) || 0;
    if (km < 0) km = 0;

    // Tiempo base: 3 min por km
    let tiempo = km * 3;

    // Mínimo 5 min aunque sea 0 km (preparación)
    if (tiempo < 5) tiempo = 5;

    // Hora punta: aumenta 50 %
    if (horaPunta.checked) tiempo *= 1.5;

    // Rango de presentación
    const min = Math.round(tiempo);
    const max = Math.round(tiempo + 1);

    salida.innerHTML = `Entrega estimada: <strong>${min}–${max} min</strong>`;
  }

  // Eventos
  btnRecalc.addEventListener("click", calcular);
  distInput.addEventListener("input", calcular);
  horaPunta.addEventListener("change", calcular);

  btnCerca.addEventListener("click", () => { distInput.value = 2; calcular(); });
  btnMedio.addEventListener("click", () => { distInput.value = 5; calcular(); });
  btnLejos.addEventListener("click", () => { distInput.value = 9; calcular(); });

  calcular(); // inicial
});