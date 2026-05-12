import { initDB } from "../db.ts";

export async function createBillsTable() {
  const db = await initDB();

  await db.exec(`
        CREATE TABLE IF NOT EXISTS bills (
        bill_id INTEGER PRIMARY KEY AUTOINCREMENT,
        bill VARCHAR(50),
        totalValue DECIMAL(5,2),
        unitValue DECIMAL(5,2),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
}
