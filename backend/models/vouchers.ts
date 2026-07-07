import { initDB } from "../db.ts";

export async function createVouchersTable() {
    const db = await initDB();

    await db.exec(`
    CREATE TABLE IF NOT EXISTS vouchers (
    apartmentId INTEGER NOT NULL,
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    is_paid INTEGER DEFAULT 0, -- 0 para Falso, 1 para Verdadeiro
    PRIMARY KEY (apartmentId, month, year)
);
  `);
}