'use client';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>🌡️ Termômetro de Humor</div>
      <ul className={styles.navList}>
        <li>
          <Link href="/" className={styles.link}>Início</Link>
        </li>
        {/* Adicione mais links aqui se necessário */}
      </ul>
    </nav>
  );
}
