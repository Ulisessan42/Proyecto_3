//
const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};
const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart();
export {
  criptomonedasSelect,
  monedaSelect,
  formulario,
  resultado,
  objBusqueda,
};
