import { z } from "zod";

export const createBillCategorySchema = z.object({
  categoryName: z.string().trim().min(1),
});

export const billCategorySchema = createBillCategorySchema.extend({
  id: z.number().positive(),
});

export const billCategoryIdSchema = z.object({
  id: z.coerce.number().positive()
});