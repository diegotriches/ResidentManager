import { z } from "zod";

// 1. Schema para CRIAÇÃO (POST / Formulário de Cadastro) - Sem ID
export const createApartmentSchema = z.object({
  apartment: z
    .string({ error: "O número/nome do apartamento é obrigatório." })
    .trim()
    .min(1, "O nome do apartamento não pode ficar em branco.")
    .max(20, "O nome do apartamento é muito longo."),

  ownerName: z.string().trim(),
});

// 2. Schema COMPLETO (Inclusão do ID) - Para Atualizações, Respostas ou Leitura
export const apartmentSchema = createApartmentSchema.extend({
  id: z
    .number({ error: "O ID deve ser um número." })
    .positive("O ID deve ser um número positivo."),
});

// 3. Tipos inferidos para exportar
export type CreateApartmentDTO = z.infer<typeof createApartmentSchema>;
export type Apartment = z.infer<typeof apartmentSchema>;
