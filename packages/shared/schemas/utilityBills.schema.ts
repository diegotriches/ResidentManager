import { z } from "zod";

export const createUtilityBillSchema = z.object({
  type: z.enum(["water", "gas"], {
    message: "O tipo deve ser 'water' ou 'gas'.",
  }),

  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(2100),

  // 💧 Campos de Água (Opcionais)
  totalConsumption: z.coerce.number().positive().optional(),
  consumptionValue: z.coerce.number().nonnegative().optional(),
  taxesValue: z.coerce.number().nonnegative().optional(),

  // 🔥 Campos de Gás (Opcionais)
  cylinderType: z
    .enum(["P45", "P90"], {
      message: "O tipo de cilindro deve ser 'P45' ou 'P90'.",
    }).optional(),
  unitPrice: z.coerce.number().nonnegative().optional(),
  multiplierFactor: z.coerce.number().positive().optional(),

  // Configuração global de rateio fixo
  splitCount: z.coerce.number().int().positive(),
});

export const utilityBillSchema = createUtilityBillSchema.extend({
  id: z.coerce
    .number({ message: "O ID deve ser um número." })
    .positive("O ID deve ser positivo."),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export const utilityBillIdParamSchema = z.object({
  id: z.coerce
    .number({ message: "O ID deve ser um número." })
    .positive("O ID deve ser positivo."),
});

export const utilityBillQuerySchema = z.object({
  month: z.coerce.number({ message: "O mês é obrigatório." }).min(1).max(12),

  year: z.coerce
    .number({ message: "O ano é obrigatório." })
    .min(1900)
    .max(2100),
});

export type CreateUtilityBillDTO = z.infer<typeof createUtilityBillSchema>;
export type UtilityBill = z.infer<typeof utilityBillSchema>;
