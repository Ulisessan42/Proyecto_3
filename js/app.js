import {
  criptomonedasSelect,
  monedaSelect,
  formulario,
  resultado,
  objBusqueda,
} from "./Variables.js";

const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);
  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

// Consulta la API para obtener un listado de Criptomonedas
async function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=1&tsym=USD";

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    const criptomonedas = await obtenerCriptomonedas(resultado.Data);
    selectCriptomonedas(criptomonedas);
  } catch (error) {
    console.log(error);
  }
}
// llena el select
function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    // insertar el HTML
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();

  // Extraer los valores
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  consultarAPI();
}

function mostrarAlerta(mensaje) {
  // Crea el div
  const divMensaje = document.createElement("div");
  divMensaje.classList.add("error");

  // Mensaje de error
  divMensaje.textContent = mensaje;

  // Insertar en el DOM
  formulario.appendChild(divMensaje);

  // Quitar el alert despues de 3 segundos
  setTimeout(() => {
    divMensaje.remove();
  }, 3000);
}

async function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  const respuesta = await fetch(url);
  const cotizacion = await respuesta.json();
  mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();

  console.log(cotizacion);
  const { PRICE } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El Precio es: <span> ${PRICE} </span>`;
  resultado.appendChild(precio);
}

function mostrarSpinner() {
  limpiarHTML();

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;

  resultado.appendChild(spinner);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

fetch(
  "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=mxn&days=2day"
)
  .then((response) => response.json())
  .then((data) => {
    // Obtener los precios y etiquetas de los datos
    const prices = data.prices;
    const labels = prices.map((price) =>
      new Date(price[0]).toLocaleDateString()
    );
    const values = prices.map((price) => price[1]);

    // Crear la gráfica utilizando Chart.js
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Precio de Bitcoin en MXN 24hrs",
            data: values,
            fill: false,
            borderColor: ["rgba(128, 0, 128, 1)"],
            borderWidth: 1.5,
          },
        ],
      },
    });
  })
  .catch((error) => {
    console.error(error);
  });
