//BarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

function BarChart({ ingresos, gastos }) {
  // Función para agrupar los datos por mes y calcular los totales
  const agruparPorMes = (items) => {
    const agrupados = {};
    // Filtramos los items para incluir solo los del último año
    const unAñoAtras = new Date();
    unAñoAtras.setFullYear(unAñoAtras.getFullYear() - 1);
    const itemsDelUltimoAño = items.filter(item => new Date(item.fecha) >= unAñoAtras);
    itemsDelUltimoAño.forEach((item) => {
      const fecha = new Date(item.fecha);
      const mes = `${fecha.getMonth() + 1}-${fecha.getFullYear()}`; // Formato: mes-año
      if (!agrupados[mes]) {
        agrupados[mes] = { totalIngresos: 0, totalGastos: 0 };
      }
      agrupados[mes].totalIngresos += item.total_ingresos || 0;
      agrupados[mes].totalGastos += item.total_gastos || 0;
    });
    return agrupados;
  };

  // Agrupar ingresos y gastos por mes y calcular totales
  const ingresosAgrupados = agruparPorMes(ingresos);
  const gastosAgrupados = agruparPorMes(gastos);

  // Obtener los meses y los totales de ingresos y gastos
  const meses = Object.keys(ingresosAgrupados).sort((a, b) => {
    // Convertir las cadenas de fecha en objetos Date
    const [mesA, añoA] = a.split('-').map(Number);
    const [mesB, añoB] = b.split('-').map(Number);
    const fechaA = new Date(añoA, mesA - 1);
    const fechaB = new Date(añoB, mesB - 1);
    // Comparar las fechas
    return fechaA - fechaB;
  });
  const totalesIngresos = meses.map((mes) => ingresosAgrupados[mes].totalIngresos);
  const totalesGastos = meses.map((mes) => gastosAgrupados[mes].totalGastos);

  // Configuración del gráfico
  const data = {
    labels: meses,
    datasets: [
      {
        label: 'Ingresos',
        data: totalesIngresos,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Gastos',
        data: totalesGastos,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center fw-bold mb-4 text-white">Progresión de ingresos y gastos por mes en el último año</div>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default BarChart;
