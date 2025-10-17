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

    let tiempo = km * 3;

    if (tiempo < 5) tiempo = 5;

    if (horaPunta.checked) tiempo *= 1.5;

    const min = Math.round(tiempo);
    const max = Math.round(tiempo + 1);

    salida.innerHTML = `Entrega estimada: <strong>${min}–${max} min</strong>`;
  }

  btnRecalc.addEventListener("click", calcular);
  distInput.addEventListener("input", calcular);
  horaPunta.addEventListener("change", calcular);

  btnCerca.addEventListener("click", () => { distInput.value = 2; calcular(); });
  btnMedio.addEventListener("click", () => { distInput.value = 5; calcular(); });
  btnLejos.addEventListener("click", () => { distInput.value = 9; calcular(); });

  calcular();
});
