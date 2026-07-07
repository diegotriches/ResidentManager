import { initDB } from "../db.ts";

export interface CreateApartmentDTO {
  apartment: string;
  ownerName: string;
}

export const ApartmentsRepository = {
  async read() {
    const db = await initDB();
    const query = "SELECT id, apartment, owner_name AS ownerName FROM apartments";

    return await db.all(query);
  },

  async create(data: CreateApartmentDTO) {
    const db = await initDB();
    const { apartment, ownerName } = data;

    const result = await db.run(
      "INSERT INTO apartments (apartment, owner_name) VALUES (?, ?)",
      [apartment, ownerName],
    );

    return result.lastID;
  },

  async update(id: number, data: CreateApartmentDTO) {
    const db = await initDB();
    const { apartment, ownerName } = data;

    const result = await db.run(
      "UPDATE apartments SET apartment = ?, owner_name = ? WHERE id = ?",
      [apartment, ownerName, id],
    );

    return result.changes;
  },

  async delete(id: number) {
    const db = await initDB();

    const result = await db.run("DELETE FROM apartments WHERE id = ?", [id]);

    return result.changes ?? 0;
  },
};
