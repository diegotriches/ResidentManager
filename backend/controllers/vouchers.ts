import type { Request, Response } from "express";
import { VouchersRepository } from "../repositories/vouchers.ts";
import {
  voucherSchema,
  voucherQuerySchema,
} from "../../packages/shared/schemas/vouchers.schema.ts";

export const VouchersController = {
  async read(req: Request, res: Response) {
    try {
      const queryValidation = voucherQuerySchema.safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          error: "Parâmetros de busca inválidos.",
          details: queryValidation.error.issues,
        });
      }

      const { month, year } = queryValidation.data;

      const vouchers = await VouchersRepository.read(month, year);

      return res.json(vouchers);
    } catch (error) {
      console.error("Erro no relatório de finanças:", error);
      res
        .status(500)
        .json({ error: "Erro interno ao gerar dados financeiros." });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const validation = voucherSchema.safeParse(req.body);
      
            if (!validation.success) {
              return res.status(400).json({
                error: "Dados para atualização inválidos.",
                details: validation.error.issues,
              });
            }

      const { apartmentId, month, year, isPaid } = validation.data;

      await VouchersRepository.update({
        apartmentId: Number(apartmentId),
        month,
        year,
        isPaid: Boolean(isPaid),
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
