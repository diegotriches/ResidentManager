import { z } from "zod";

export const createMeterSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(2100),
  apartmentId: z.number().positive(),
  water: z.number().positive(),
  gas: z.number().positive(),
});

export const meterSchema = createMeterSchema.extend({
  id: z
    .number({ error: "O ID deve ser um número." })
    .positive("O ID deve ser um número positivo."),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export const meterIdParamSchema = z.object({
  id: z.coerce
    .number({ error: "O ID deve ser um número." })
    .positive("O ID deve ser positivo."),
});

export const meterQuerySchema = z.object({
  month: z.coerce
    .number({ error: "O mês é obrigatório." })
    .min(1, "O mês não pode ficar em branco")
    .max(12, "O valor informado não é válido como um mês."),

  year: z.coerce
    .number({ error: "O ano é obrigatório." })
    .min(1900, "O ano não pode ficar em branco.")
    .max(2100, "O valor informado não é válido como um ano."),
});

export type CreateBillDTO = z.infer<typeof createMeterSchema>;
export type Bill = z.infer<typeof meterSchema>;
