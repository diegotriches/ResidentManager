import { z } from "zod";

export const createBillSchema = z.object({
  month: z
    .number({ error: "O mês é obrigatório." })
    .min(1, "O mês não pode ficar em branco")
    .max(12, "O valor informado não é válido como um mês."),

  year: z
    .number({ error: "O ano é obrigatório." })
    .min(1900, "O ano não pode ficar em branco.")
    .max(2100, "O valor informado não é válido como um ano."),

  bill: z
    .string({ error: "O nome/descrição da conta é obrigatório." })
    .trim()
    .min(1, "A descrição da conta não pode ficar em branco."),

  totalValue: z
    .number({ error: "O valor total deve ser um número." })
    .positive("O valor total deve ser maior que zero."),

  unitValue: z
    .number({ error: "O valor total deve ser um número." })
    .positive("O valor total deve ser maior que zero."),
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
