import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement);

const PendapatanChart = () => {
  const [pendTerakhir, setPendTerakhir] = useState([]);

  const getPendapatanTerakhir = async () => {
    const response = await axios.get('http://localhost:5000/pendapatanterakhir');
    setPendTerakhir(response.data);
  };

  useEffect(() => {
    getPendapatanTerakhir();
  }, []);

  let data = {
    labels: pendTerakhir.map((x) => x.tanggal),
    datasets: [
      {
        label: 'Pendapatan Seminggu Terakhir',
        data: pendTerakhir.map((x) => x.jumlah),
        borderWidth: 1,
        backgroundColor: 'rgb(135, 255, 227, 0.7)',
      },
    ],
  };
  let options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
          },
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  useEffect(() => {
    Chart.register(Tooltip);
  }, []);

  return (
    <div>
      <Bar data={data} height={200} width={250} options={options} plugins={[Tooltip]} />
    </div>
  );
};

export default PendapatanChart;
