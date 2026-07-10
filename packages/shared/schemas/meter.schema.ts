import { z } from "zod";

export const createMeterSchema = z.object({
  month: z
    .number({ error: "O mês é obrigatório." })
    .min(1, "O mês não pode ficar em branco")
    .max(12, "O valor informado não é válido como um mês."),

  year: z
    .number({ error: "O ano é obrigatório." })
    .min(1900, "O ano não pode ficar em branco.")
    .max(2100, "O valor informado não é válido como um ano."),

  apartment: z
    .string({ error: "O nome do apartamento é obrigatório." })
    .trim()
    .min(1, "O nome do apartamento não pode ficar em branco."),

  apartmentId: z
    .number({ error: "O ID deve ser um número." })
    .positive("O ID deve ser um número positivo."),

  water: z
    .number({ error: "O valor total deve ser um número." })
    .positive("O valor total deve ser maior que zero."),

  gas: z
    .number({ error: "O valor total deve ser um número." })
    .positive("O valor total deve ser maior que zero."),
});

export const meterSchema = createMeterSchema.extend({
  id: z
    .number({ error: "O ID deve ser um número." })
    .positive("O ID deve ser um número positivo."),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
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
