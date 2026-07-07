import { initDB } from "../db.ts";

export async function createApartmentsTable() {
  const db = await initDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS apartments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      apartment TEXT UNIQUE,
      owner_name TEXT
    )
  `);
}