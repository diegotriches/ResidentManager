import { z } from "zod";

export const billSchema = z.object({
  id: z.number().positive(),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(2100),
  bill: z.string().trim().min(1),
  totalValue: z.number().positive(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createBillSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(2100),
  bill: z.string().trim().min(1),
  totalValue: z.number().positive(),
});

export const billIdParamSchema = z.object({
  id: z.coerce.number().positive(),
});

export const billQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(2100),
});

export type BillsDTO = z.infer<typeof billSchema>;
