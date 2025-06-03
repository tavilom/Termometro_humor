'use client';

import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function HumorCharts() {
  const [dadosHumores, setDadosHumores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHumores() {
      try {
        const res = await fetch('http://localhost:3001/humores');
        const data = await res.json();
        setDadosHumores(data);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHumores();
  }, []);

  // Contar ocorrências de cada humor
  const contagemHumores = dadosHumores.reduce((acc, item) => {
    acc[item.humor] = (acc[item.humor] || 0) + 1;
    return acc;
  }, {});

  // Labels e dados para os gráficos
  const labels = Object.keys(contagemHumores);
  const dataValores = Object.values(contagemHumores);

  const cores = {
    Feliz: 'rgba(16, 185, 129, 0.7)',
    Bravo: 'rgba(239, 68, 68, 0.7)',
    Triste: 'rgba(59, 130, 246, 0.7)',
    Neutro: 'rgba(107, 114, 128, 0.7)',
  };

  const backgroundColors = labels.map(label => cores[label] || 'rgba(100,100,100,0.7)');

  const pieData = {
    labels,
    datasets: [
      {
        label: 'Humores',
        data: dataValores,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(c => c.replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: 'Quantidade de humores',
        data: dataValores,
        backgroundColor: backgroundColors,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribuição dos humores',
      },
    },
  };

  if (loading) return <p>Carregando gráficos...</p>;

  if (dadosHumores.length === 0) return <p>Nenhum dado de humor disponível.</p>;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '1rem' }}>
      <h2>Gráfico de Pizza dos Humores</h2>
      <Pie data={pieData} />

      <h2 style={{ marginTop: '3rem' }}>Gráfico de Barras dos Humores</h2>
      <Bar data={barData} options={barOptions} />
    </div>
  );
}
