import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { vouchers } from "../db/schema";

export const insertVouchersSchema = createInsertSchema(vouchers);
export const selectVouchersSchema = createSelectSchema(vouchers);