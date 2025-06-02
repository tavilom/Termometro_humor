'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import styles from './styles.module.css';

export default function HumorPage() {
  const [status, setStatus] = useState('');
  const [humorSelecionado, setHumorSelecionado] = useState('');
  const [enviadoHoje, setEnviadoHoje] = useState(false);

  const opcoes = [
    { label: 'Triste', emoji: '😢' },
    { label: 'Bravo', emoji: '😠' },
    { label: 'Feliz', emoji: '😄' },
    { label: 'Neutro', emoji: '😐' },
  ];

  useEffect(() => {
    const verificarEnvio = async () => {
      try {
        const agora = new Date();
        const offset = agora.getTimezoneOffset();
        const localDate = new Date(agora.getTime() - offset * 60 * 1000);
        const hoje = localDate.toISOString().slice(0, 10);

        const res = await fetch('http://localhost:3001/humores');
        const data = await res.json();

        const enviado = data.some((registro) => {
          const dataRegistro = registro.criado_em.slice(0, 10);
          return dataRegistro === hoje;
        });

        if (enviado) {
          setEnviadoHoje(true);
          setStatus('Você já enviou seu humor hoje.');

          Swal.fire({
            icon: 'info',
            title: 'Já enviado',
            text: 'Você já registrou seu humor hoje!',
            confirmButtonColor: '#3085d6',
          });
        }
      } catch (error) {
        setStatus('Erro ao verificar envio.');
      }
    };

    verificarEnvio();
  }, []);

  const handleClickHumor = (label) => {
    if (enviadoHoje) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Você já enviou seu humor hoje e não pode enviar novamente.',
        confirmButtonColor: '#d33',
      });
      return;
    }
    setHumorSelecionado(label);
  };

  const enviarHumor = async () => {
    if (!humorSelecionado) {
      setStatus('Selecione um humor antes de enviar.');
      return;
    }

    if (enviadoHoje) {
      setStatus('Você já enviou seu humor hoje.');
      return;
    }

    setStatus('Enviando...');

    try {
      const agora = new Date();
      const offset = agora.getTimezoneOffset();
      const localDate = new Date(agora.getTime() - offset * 60 * 1000);
      const criado_em = localDate.toISOString().slice(0, 19);

      const res = await fetch('http://localhost:3001/humores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ humor: humorSelecionado, criado_em }),
      });

      if (res.ok) {
        setStatus(`Humor "${humorSelecionado}" enviado com sucesso.`);
        setEnviadoHoje(true);
      } else {
        setStatus('Erro ao enviar humor.');
      }
    } catch (error) {
      setStatus('Erro ao conectar com o servidor.');
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Como você está se sentindo hoje?</h1>

      <div className={styles.buttons}>
        {opcoes.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => handleClickHumor(label)}
            className={`${styles.button} ${humorSelecionado === label ? styles.selected : ''}`}
          >
            <span className={`${styles.emoji} ${styles[label.toLowerCase()]}`}>
              {emoji}
            </span>
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={enviarHumor}
        disabled={!humorSelecionado || enviadoHoje}
        className={styles.sendButton}
      >
        Enviar
      </button>

      {status && <p className={styles.status}>{status}</p>}
    </main>
  );
}
