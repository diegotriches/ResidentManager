import type { Request, Response } from "express";
import { HomeRepository } from "../repositories/home.ts";
import { homeQuerySchema } from "../../packages/shared/schemas/home.schema.ts";

export const HomeController = {
  async read(req: Request, res: Response) {
    try {
      const queryValidation = homeQuerySchema.safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          error: "Parâmetros de busca inválidos.",
          details: queryValidation.error.issues,
        });
      }

      const { month, year } = queryValidation.data;

      if (!month || !year) {
        return res
          .status(400)
          .json({ error: "Dados insuficientes para realizar essa busca." });
      }

      const pending = await HomeRepository.pendingApartments(month, year);

      return res.json(pending);
    } catch (error) {
      console.error("Erro ao buscar contas pendentes:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar contas pendentes." });
    }
  },
};
