import { initDB } from "../db.ts";

export interface CreateBillDTO {
  month: string;
  year: number;
  bill: string;
  totalValue: number;
  unitValue: number;
}

export const BillsRepository = {
  async read(month?: string, year?: number) {
    const db = await initDB();
    let query = "SELECT * FROM bills";
    const params: (string | number)[] = [];

    if (month && year) {
      query += " WHERE month = ? AND year = ?";
      params.push(String(month), Number(year));
    }

    query += " ORDER BY createdAt DESC";
    return await db.all(query, params);
  },

  async create(data: CreateBillDTO) {
    const db = await initDB();
    const { month, year, bill, totalValue, unitValue } = data;

    const result = await db.run(
      "INSERT INTO bills (month, year, bill, totalValue, unitValue) VALUES (?, ?, ?, ?, ?)",
      [month, year, bill, totalValue, unitValue],
    );

    return result.lastID;
  },

  async update(id: string | number, data: CreateBillDTO) {
    const db = await initDB();
    const { month, year, bill, totalValue, unitValue } = data;

    const result = await db.run(
      "UPDATE bills SET month = ?, year = ?, bill = ?, totalValue = ?, unitValue = ?, updatedAt = CURRENT_TIMESTAMP WHERE bill_id = ?",
      [month, year, bill, totalValue, unitValue, id],
    );

    return result.changes ?? 0;
  },

  async delete(id: string | number) {
    const db = await initDB();

    const result = await db.run("DELETE FROM bills WHERE bill_id = ?", [id]);

    return (result as { changes: number }).changes ?? 0;
  },
};
