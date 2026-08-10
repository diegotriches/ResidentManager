import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { billsCategories } from "../db/schema.ts";

export interface BillCategoryDTO {
  categoryName: string;
}

export const BillsCategoryRepository = {
  async read() {
    return await db.select().from(billsCategories);
  },

  async create(data: BillCategoryDTO) {
    const { categoryName } = data;
    const [inserted] = await db
      .insert(billsCategories)
      .values({
        categoryName,
      })
      .returning({ id: billsCategories.id });

    return inserted.id;
  },

  async update(id: number, data: BillCategoryDTO) {
    const { categoryName } = data;
    const result = await db
      .update(billsCategories)
      .set({ categoryName })
      .where(eq(billsCategories.id, id));

    return result.changes;
  },

  async delete(id: number) {
    const result = await db
      .delete(billsCategories)
      .where(eq(billsCategories.id, id));

    return result.changes;
  },
};
