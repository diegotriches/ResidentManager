import { initDB } from "../db.ts";

export interface CreateApartmentDTO {
  number: number;
  ownerName: string;
}

export const ApartmentsRepository = {
  async read() {
    const db = await initDB();
    const query = "SELECT id, number, owner_name AS ownerName FROM apartments";

    return await db.all(query);
  },

  async create(data: CreateApartmentDTO) {
    const db = await initDB();
    const { number, ownerName } = data;

    const result = await db.run(
      "INSERT INTO apartments (number, owner_name) VALUES (?, ?)",
      [number, ownerName],
    );

    return result.lastID;
  },

  async update(id: number, data: CreateApartmentDTO) {
    const db = await initDB();
    const { number, ownerName } = data;

    const result = await db.run(
      "UPDATE apartments SET number = ?, owner_name = ? WHERE id = ?",
      [number, ownerName, id],
    );

    return result.changes;
  },

  async delete(id: number) {
    const db = await initDB();

    const result = await db.run("DELETE FROM apartments WHERE id = ?", [id]);

    return (result as { changes: number }).changes ?? 0;
  },
};
