import { z } from "zod";

export const voucherSchema = z.object({
  apartmentId: z.number().positive(),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(2100),
  isPaid: z.boolean().default(false),
});

export const voucherQuerySchema = z.object({
  month: z.coerce
    .number({ error: "O mês é obrigatório." })
    .min(1, "O mês não pode ficar em branco")
    .max(12, "O valor informado não é válido como um mês."),

  year: z.coerce
    .number({ error: "O ano é obrigatório." })
    .min(1900, "O ano não pode ficar em branco.")
    .max(2100, "O valor informado não é válido como um ano."),
});

export type VoucherDTO = z.infer<typeof voucherSchema>;
