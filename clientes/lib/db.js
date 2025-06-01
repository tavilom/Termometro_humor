import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const dbPromise = open({
  filename: './humor.db',
  driver: sqlite3.Database,
});

export const db = {
  run: async (query, params) => {
    const db = await dbPromise;
    return db.run(query, params);
  },
  all: async (query, params) => {
    const db = await dbPromise;
    return db.all(query, params);
  },
  get: async (query, params) => {
    const db = await dbPromise;
    return db.get(query, params);
  },
};

// Criação da tabela (roda uma vez no setup)
(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS humores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      humor TEXT NOT NULL,
      criado_em TEXT NOT NULL
    )
  `);
})();
