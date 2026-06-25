import type { Request, Response } from "express";
import { VouchersRepository } from "../repositories/vouchers.ts";

export const VouchersController = {
  async read(req: Request, res: Response) {
    try {
      const { month, year } = req.query;

      const vouchers = await VouchersRepository.read(
        month ? String(month) : undefined,
        year ? Number(year) : undefined,
      );

      res.json(vouchers);
    } catch (error) {
      console.error("Erro no relatório de finanças:", error);
      res
        .status(500)
        .json({ error: "Erro interno ao gerar dados financeiros." });
    }
  },

  async update(req: Request, res: Response) {
    try {
    const { apartment, month, year, is_paid } = req.body;

    await VouchersRepository.update({
      apartment: String(apartment),
      month: String(month),
      year: Number(year),
      isPaid: Boolean(is_paid),
    });

      return res.json({
        success: true,
        message: "Status de pagamento atualizado com sucesso!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar status de pagamento." });
    }
  },
};
