import { initDB } from "../db.ts";

export async function createUtilityBillsTable() {
  const db = await initDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS utility_bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT CHECK(type IN ('water', 'gas')) NOT NULL,
      month TEXT NOT NULL,
      year INTEGER NOT NULL,
      
      -- Campos para Água
      total_consumption_m3 REAL, 
      consumption_value REAL,
      taxes_value REAL,
      
      -- Campos para Gás
      cylinder_type TEXT CHECK(cylinder_type IN ('P45', 'P90')),
      unit_price REAL,
      multiplier_factor REAL DEFAULT 2.25,
      
      -- Configuração de Rateio
      split_count INTEGER DEFAULT 21,
      
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(type, month, year) -- Evita duplicar a conta de água ou gás no mesmo mês
    )`);
}