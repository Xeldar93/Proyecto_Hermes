//DonutChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DonutChart = ({ ingresos, gastos }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Gastos', 'Ingresos'],
        datasets: [{
          label: 'Gastos' | 'Ingresos',
          data: [gastos, ingresos],
          backgroundColor: [
            'rgba(255, 99, 132, 0.3)',
            'rgba(75, 192, 192, 0.3)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Balance del mes',
            color: 'white', // Cambiar el color del título a blanco
            font: {
              size: 20
            }
          }
        },
        elements: {
          text: {
            color: 'white' // Cambiar el color de los labels a blanco
          }
        }
      }
    });

    // Guarda la instancia de la gráfica en el ref
    chartRef.current.chartInstance = chartInstance;

    // Cleanup function
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [ingresos, gastos]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default DonutChart;