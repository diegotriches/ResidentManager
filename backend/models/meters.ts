import { initDB } from "../db.ts";

export async function createMetersTable() {
  const db = await initDB();

  await db.exec(`
        CREATE TABLE IF NOT EXISTS meters (
        meter_id INTEGER PRIMARY KEY AUTOINCREMENT,
        apartment INTEGER,
        water DECIMAL(4,3),
        gas DECIMAL(4,3),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (apartment) REFERENCES apartments(number)
        )`);
}
