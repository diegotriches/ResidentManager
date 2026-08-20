import { z } from "zod";

export const createMeterSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(2100),
  apartmentId: z.number().positive(),
  water: z.number().positive(),
  gas: z.number().positive(),
});

export const meterSchema = createMeterSchema.extend({
  id: z.number().positive(),
  apartment: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const meterConsumptionSchema = z.object({
  apartment: z.string(),
  waterCurrent: z.number(),
  gasCurrent: z.number(),
  waterPrevious: z.number(),
  gasPrevious: z.number(),
  waterConsumption: z.number(),
  gasConsumption: z.number(),
});

export const meterIdParamSchema = z.object({
  id: z.coerce.number().positive(),
});

export const meterQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(2100),
});

export type CreateBillDTO = z.infer<typeof createMeterSchema>;
