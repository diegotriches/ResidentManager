import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { utilityBills } from "../db/schema";

export const insertUtilityBillSchema = createInsertSchema(utilityBills);
export const selectUtilityBillSchema = createSelectSchema(utilityBills);