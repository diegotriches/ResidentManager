import { z } from "zod";

export const homeQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(2100),
});

export type HomeQueryDTO = z.infer<typeof homeQuerySchema>;