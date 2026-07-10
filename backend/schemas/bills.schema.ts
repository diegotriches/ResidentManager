import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { bills } from "../db/schema";

export const insertBillSchema = createInsertSchema(bills);
export const selectBillSchema = createSelectSchema(bills);