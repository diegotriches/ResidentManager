import { z } from "zod";

// Dados enviados pelo formulário
export const createApartmentSchema = z.object({
  apartment: z
    .string({ error: "O número/nome do apartamento é obrigatório." })
    .trim()
    .min(1, "O nome do apartamento não pode ficar em branco.")
    .max(20, "O nome do apartamento é muito longo."),

  ownerName: z.string().trim(),
});

// Registro completo retornado pelo banco/API
export const apartmentSchema = createApartmentSchema.extend({
  id: z
    .number({ error: "O ID deve ser um número." })
    .positive("O ID deve ser um número positivo."),
});

// Parâmetro da URL: /apartments/:id
export const apartmentIdSchema = z.object({
  id: z.coerce
    .number({ error: "O ID deve ser um número." })
    .positive("O ID deve ser um número positivo."),
});

export type CreateApartmentDTO = z.infer<typeof createApartmentSchema>;
export type Apartment = z.infer<typeof apartmentSchema>;
export type ApartmentIdParams = z.infer<typeof apartmentIdSchema>;