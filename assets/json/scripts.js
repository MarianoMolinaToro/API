// Obtener referencias HTML 
const form = document.getElementById('calculadora'); // referencia al form
const chart = document.getElementById('myChart'); // Referencia al gráfico
let myChart; // variable gráfico

// funcion asincrónica para obtener datos de la api
const obtenerDatosMoneda = async (moneda) => {
    try {
        const valores = await fetch(`https://mindicador.cl/api/${moneda}`);
        const resultados = await valores.json(); // Convertir la respuesta a json
        console.log(resultados); // Mostrar en la consola 
        return resultados.serie; // Devolver los datos de la serie de la moneda
    } catch (error) {
        alert(error.message); // Mostrar una alerta en caso de error
    }
};

// función para calcular el total en la moneda seleccionada
const calcularTotalEnMoneda = (valor, datos) => {
    const valorMoneda = datos[0].valor; // Obtener el valor actual 
    const total = valor / valorMoneda; // calcular el total 
    return Math.round(total * 100); // redondear y multiplicar por 100 para presentar como porcentaje
};

// funcion para mostrar el total en pantalla
const mostrarTotalEnPantalla = (total) => {
    document.getElementById('total-valor').innerHTML = total; // Mostrar el total en html
};

// Funcion para obtener los valores de la serie de datos
const obtenerValores = (datos) => {
    return datos.map((item) => item.valor); // mapear cada objeto y obtener el valor
};

// obtener las fechas de la serie de datos
const obtenerFechas = (datos) => {
    return datos.map((item) => new Date(item.fecha).toLocaleDateString('en-us')); // convertir y formatear fechas
};

// Función para destruir gráfico previo
const destruirGraficoAnterior = () => {
    if (myChart) {
        myChart.destroy(); // destruir el gráfico anterior
    }
};

// Función asincrónica para calcular el valor en la moneda y mostrar el gráfico
const calcularValorEnMoneda = async (valor, moneda) => {
    const datos = await obtenerDatosMoneda(moneda); // obtener datos de la moneda
    mostrarGrafico(datos, valor); // llamar a la función para mostrar el gráfico
};

// funcion para mostrar el gráfico y actualizar la pantalla
const mostrarGrafico = (datos, valor) => {
    const total = calcularTotalEnMoneda(valor, datos); // calcular el total
    mostrarTotalEnPantalla(total, datos); // Mostrar el total en pantalla

    const labels = obtenerFechas(datos); //eje X
    const values = obtenerValores(datos); // eje Y

    // Configuración gráfico
    const datasets = [
        {
            label: 'Moneda',
            borderColor: 'rgb(0, 123, 255)', 
            data: values, 
        },
    ];

    const config = {
        type: 'line',
        data: { labels, datasets }, 
    };

    destruirGraficoAnterior(); // destruir el gráfico anterior 

    //style grafico
    chart.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))';
    chart.style.borderRadius = '10px';

    myChart = new Chart(chart, config); // Crear y mostrar el gráfico
};

// Agregar un evento para formulario
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // evitar el comportamiento predeterminado del form

    const valor = form.elements['valor'].value; // obtener el valor 
    const moneda = form.elements['moneda'].value; // obtener la moneda 

    if (!valor) {
        alert('Ingrese un valor'); // Mostrar una alerta si no se ingreso un valor
        return;
    }

    await calcularValorEnMoneda(valor, moneda); // calcular el valor en la moneda y mostrar el gráfico
});
