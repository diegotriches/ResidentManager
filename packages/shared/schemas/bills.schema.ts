import { z } from "zod";

export const createBillSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(2100),
  bill: z.string().trim().min(1),
  totalValue: z.number().positive(),
});

export const billSchema = createBillSchema.extend({
  id: z
    .number({ error: "O ID deve ser um número." })
    .positive("O ID deve ser um número positivo."),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const billIdParamSchema = z.object({
  id: z.coerce
    .number({ error: "O ID deve ser um número." })
    .positive("O ID deve ser positivo."),
});

export const billQuerySchema = z.object({
  month: z.coerce
    .number({ error: "O mês é obrigatório." })
    .min(1, "O mês não pode ficar em branco")
    .max(12, "O valor informado não é válido como um mês."),

  year: z.coerce
    .number({ error: "O ano é obrigatório." })
    .min(1900, "O ano não pode ficar em branco.")
    .max(2100, "O valor informado não é válido como um ano."),
});

export type CreateBillDTO = z.infer<typeof createBillSchema>;
export type Bill = z.infer<typeof billSchema>;
