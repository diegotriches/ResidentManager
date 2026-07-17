import { db } from "../db/index.ts";
import { bills } from "../db/schema.ts";
import { eq, and } from "drizzle-orm";

export interface BillDTO {
  month: number;
  year: number;
  bill: string;
  totalValue: number;
}

export const BillsRepository = {
  async read(month: number, year: number) {
    return await db
      .select()
      .from(bills)
      .where(and(eq(bills.month, month), eq(bills.year, year)));
  },

  async create(data: BillDTO) {
    const { month, year, bill, totalValue } = data;

    const result = await db.insert(bills).values({
      month,
      year,
      bill: bill?.trim(),
      totalValue,
    });

    return result.lastInsertRowid;
  },

  async update(id: number, data: BillDTO) {
    const { month, year, bill, totalValue } = data;

    const result = await db
      .update(bills)
      .set({ month, year, bill, totalValue })
      .where(eq(bills.id, id));

    return result.changes;
  },

  async delete(id: number) {
    const result = await db.delete(bills).where(eq(bills.id, id));

    return result.changes;
  },
};
