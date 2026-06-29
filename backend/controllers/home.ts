import type { Request, Response } from "express";
import { HomeRepository } from "../repositories/home.ts";

export const HomeController = {
  async read(req: Request, res: Response) {
    try {
      const { month, year } = req.query;

      if (!month || !year) {
        return res
          .status(400)
          .json({ error: "Dados insuficientes para realizar essa busca." });
      }

      const pendingApartments = await HomeRepository.pendingApartments(
        String(month),
        Number(year),
      );

      res.json(pendingApartments);
    } catch (error) {
      console.error("Erro ao buscar contas pendentes:", error);
      res
        .status(500)
        .json({ error: "Erro interno ao buscar contas pendentes." });
    }
  },
};
