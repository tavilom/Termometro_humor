'use client';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          <img src="./logo.png" alt="Logo" className={styles.logoImage} />
          <h1 className={styles.logo.h1}><span>🌡️</span> Termômetro de Humor</h1>
        </Link>
      </div>
      <ul className={styles.navList}>
        <li>
          <Link href="/" className={styles.link}>Voltar</Link>
        </li>
      </ul>
    </nav >
  );
}
