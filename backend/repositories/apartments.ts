import { db } from "../db/index.ts"; // 🔄 Importa a conexão do Drizzle que criamos no passo anterior
import { apartments } from "../db/schema.ts"; // 🔄 Importa a tabela do Schema
import { eq } from "drizzle-orm"; // 🔄 Importa o operador de igualdade do Drizzle

export interface ApartmentDTO {
  apartment: string;
  ownerName: string;
}

export const ApartmentsRepository = {
  // 1. LISTAR TODOS (Antes: db.all("SELECT * FROM apartments ORDER BY apartment ASC"))
  async read() {
    return await db.select().from(apartments).orderBy(apartments.apartment); // Já ordena em ordem crescente automaticamente
  },

  // 2. CRIAR UM NOVO (Antes: db.run("INSERT INTO apartments...", [apartment, ownerName]))
  async create(data: ApartmentDTO) {
    const result = await db.insert(apartments).values({
      apartment: data.apartment.trim(),
      ownerName: data.ownerName.trim(),
    });

    // O Drizzle retorna um objeto com informações sobre a execução.
    // Para o SQLite (better-sqlite3), o ID gerado fica em lastInsertRowid
    return result.lastInsertRowid;
  },

  // 3. ATUALIZAR (Antes: db.run("UPDATE apartments SET... WHERE id = ?"))
  async update(id: number, data: ApartmentDTO) {
    const result = await db
      .update(apartments)
      .set({
        apartment: data.apartment.trim(),
        ownerName: data.ownerName.trim(),
      })
      .where(eq(apartments.id, id)); // eq(coluna, valor) significa "coluna == valor"

    // Retorna a quantidade de linhas que foram alteradas (útil para o Controller saber se deu certo)
    return result.changes;
  },

  // 4. DELETAR (Antes: db.run("DELETE FROM apartments WHERE id = ?"))
  async delete(id: number) {
    const result = await db.delete(apartments).where(eq(apartments.id, id));

    return result.changes;
  },
};
