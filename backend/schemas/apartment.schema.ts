import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { apartments } from "../db/schema";

// Schema do Zod baseado na tabela 'apartments' do Drizzle (para inserts no banco)
export const insertApartmentSchema = createInsertSchema(apartments);

// Schema do Zod baseado no retorno de consultas 'SELECT' da tabela
export const selectApartmentSchema = createSelectSchema(apartments);