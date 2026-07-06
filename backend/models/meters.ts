import { initDB } from "../db.ts";

export async function createMetersTable() {
  const db = await initDB();

  await db.exec(`
        CREATE TABLE IF NOT EXISTS meters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT NOT NULL,
        year INTEGER NOT NULL,
        apartment INTEGER NOT NULL,
        water DECIMAL(4,3) NOT NULL,
        gas DECIMAL(4,3) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (apartment) REFERENCES apartments(id),
        UNIQUE(apartment, month, year)
        )`);
}
