'use client';

import { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';

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

import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function AdminDashboard() {
  const [respostas, setRespostas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar os dados da API (json-server ou outro)
  useEffect(() => {
    async function fetchRespostas() {
      try {
        const res = await fetch('http://localhost:3001/humores');
        const data = await res.json();
        setRespostas(data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRespostas();
  }, []);

  // Preparar dados para os gráficos
  // Contar quantas vezes cada humor aparece
  const contagemHumores = respostas.reduce((acc, item) => {
    acc[item.humor] = (acc[item.humor] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(contagemHumores);
  const dataValues = Object.values(contagemHumores);

  const pieData = {
    labels,
    datasets: [
      {
        label: 'Quantidade',
        data: dataValues,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverOffset: 30,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: 'Quantidade',
        data: dataValues,
        backgroundColor: '#36A2EB',
      },
    ],
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Dashboard de Humor</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <table border="1" cellPadding="10" className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Humor</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {respostas.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.humor}</td>
                  <td>{new Date(item.criado_em).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.graphContainer}>
            <section className={styles.graphSection}>
              <h2 className={styles.subtitle}>Gráfico de Pizza dos Humores</h2>
              <Pie data={pieData} />
            </section>

            <section className={styles.graphSection}>
              <h2 className={styles.subtitle}>Gráfico de Barras dos Humores</h2>
              <Bar data={barData} />
            </section>
          </div>
        </>
      )}
    </main>
  );
}
