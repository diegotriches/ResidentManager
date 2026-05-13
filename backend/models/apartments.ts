import { initDB } from "../db.ts";

export async function createApartmentsTable() {
  const db = await initDB();

  // 1. Cria a tabela
  await db.exec(`
    CREATE TABLE IF NOT EXISTS apartments (
      number INTEGER PRIMARY KEY,
      owner_name TEXT
    )
  `);

  // 2. Verifica se a tabela já tem dados (para não repetir o processo)
  const count = await db.get("SELECT COUNT(*) as total FROM apartments");

  if (count.total === 0) {
    console.log("Populando tabela de apartamentos...");
    
    // 3. Lógica para gerar os números (Andares 2 ao 8, aptos 01 a 03)
    const apartments = [];
    for (let floor = 2; floor <= 8; floor++) {
      for (let unit = 1; unit <= 3; unit++) {
        const aptNumber = floor * 100 + unit; // Ex: 201, 202, 203...
        apartments.push(aptNumber);
      }
    }

    // 4. Inserção em massa
    const insertStmt = await db.prepare("INSERT INTO apartments (number) VALUES (?)");
    for (const num of apartments) {
      await insertStmt.run(num);
    }
    await insertStmt.finalize();
    
    console.log(`${apartments.length} apartamentos inseridos com sucesso.`);
  }
}