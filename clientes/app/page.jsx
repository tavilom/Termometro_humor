'use client';
import { useState } from 'react';
import styles from './styles.module.css';

export default function HumorPage() {
  const [status, setStatus] = useState('');
  const [humorSelecionado, setHumorSelecionado] = useState('');

  const opcoes = [
    { label: 'Triste', emoji: '😢' },
    { label: 'Bravo', emoji: '😠' },
    { label: 'Feliz', emoji: '😄' },
    { label: 'Neutro', emoji: '😐' },
  ];

  const enviarHumor = async () => {
    if (!humorSelecionado) return;

    setStatus('Enviando...');
    try {
      const res = await fetch('/api/humor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ humor: humorSelecionado }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(`Humor "${humorSelecionado}" enviado com sucesso.`);
        setHumorSelecionado('');
      } else {
        setStatus(data.error);
      }
    } catch (err) {
      setStatus('Erro ao enviar humor.');
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Como você está se sentindo hoje?</h1>
      
      <div className={styles.buttons}>
        {opcoes.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => setHumorSelecionado(label)}
            className={`${styles.button} ${humorSelecionado === label ? styles.selected : ''}`}
          >
            <span style={{ fontSize: '1.5rem' }}>{emoji}</span> {label}
          </button>
        ))}
      </div>

      <button
        onClick={enviarHumor}
        disabled={!humorSelecionado}
        className={styles.sendButton}
      >
        Enviar
      </button>

      {status && <p className={styles.status}>{status}</p>}
    </main>
  );
}
