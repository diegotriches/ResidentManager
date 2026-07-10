import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { meters } from "../db/schema";

export const insertMeterSchema = createInsertSchema(meters);
export const selectMeterSchema = createSelectSchema(meters);