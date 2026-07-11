import type { Request, Response } from "express";
import { BillsRepository } from "../repositories/bills.ts";
import {
  createBillSchema,
  billSchema,
  billQuerySchema,
  billIdParamSchema
} from "../../packages/shared/schemas/bills.schema.ts";
import { z } from "zod";

export const BillsController = {
  async read(req: Request, res: Response) {
    try {
      const queryValidation = billQuerySchema.safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          error: "Parâmetros de busca inválidos.",
          details: queryValidation.error.issues,
        });
      }

      const { month, year } = queryValidation.data;

      const bills = await BillsRepository.read(month, year);

      const parsedBills = z.array(billSchema).safeParse(bills);

      if (!parsedBills.success) {
        console.error(
          "Erro na validação do schema das contas:",
          parsedBills.error,
        );
        return res.status(500).json({
          error: "Dados retornados do banco estão em formato inválido.",
        });
      }

      return res.json(parsedBills.data);
    } catch (error) {
      console.error("Erro ao listar contas:", error);
      return res.status(500).json({ error: "Erro ao buscar dados no banco." });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const validation = createBillSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Validação falhou.",
          details: validation.error.issues,
        });
      }

      const { month, year, bill, totalValue, unitValue } = validation.data;

      const billId = await BillsRepository.create({
        month,
        year,
        bill,
        totalValue,
        unitValue,
      });

      return res
        .status(201)
        .json({ id: billId, month, year, bill, totalValue, unitValue });
    } catch (error) {
      console.error("Erro ao inserir conta:", error);
      return res.status(500).json({ error: "Erro ao inserir conta" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const paramValidation = billSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          error: "ID de apartamento inválido.",
          details: paramValidation.error.issues,
        });
      }

      const validation = billSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Dados para atualização inválidos.",
          details: validation.error.issues,
        });
      }

      const { id } = paramValidation.data;
      const { month, year, bill, totalValue, unitValue } = validation.data;

      const changes = await BillsRepository.update(id, {
        month,
        year,
        bill,
        totalValue,
        unitValue,
      });

      if (changes === 0) {
        return res.status(404).json({ error: "Conta não encontrada." });
      }

      return res.json({ id, month, year, bill, totalValue, unitValue });
    } catch (error) {
      console.error("Erro ao atualizar conta:", error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const paramValidation = billIdParamSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          error: "ID de apartamento inválido.",
          details: paramValidation.error.issues,
        });
      }

      const { id } = paramValidation.data;

      const changes = await BillsRepository.delete(id);

      if (changes > 0) {
        return res.status(200).json({ message: "Conta removida com sucesso." });
      } else {
        return res.status(404).json({
          error: "Conta não encontrada.",
          message: `Não foi possível remover: o ID ${id} não existe`,
        });
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      return res.status(500).json({
        error: "Erro interno do servidor.",
        message: "Ocorreu um erro ao tentar acessar o banco de dados.",
      });
    }
  },
};
