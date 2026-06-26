import type { Request, Response } from "express";
import { BillsRepository } from "../repositories/bills.ts";

export const BillsController = {
  async read(req: Request, res: Response) {
    try {
      const { month, year } = req.query;

      // O Repository cuida de montar e executar a busca
      const bills = await BillsRepository.read(
        month ? String(month) : undefined,
        year ? Number(year) : undefined
      );

      return res.json(bills);
    } catch (error) {
      console.error("Erro ao listar contas:", error);
      return res.status(500).json({ error: "Erro ao buscar dados no banco." });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { month, year, bill, totalValue, unitValue } = req.body;

      const billId = await BillsRepository.create({
        month,
        year: Number(year),
        bill,
        totalValue,
        unitValue
      });

      return res.status(201).json({ id: billId, bill, totalValue, unitValue });
    } catch (error) {
      console.error("Erro ao inserir conta:", error);
      return res.status(500).json({ error: "Erro ao inserir conta" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { month, year, bill, totalValue, unitValue } = req.body;
      const id = String(req.params.id);

      const changes = await BillsRepository.update(id, {
        month,
        year,
        bill,
        totalValue,
        unitValue
      });

      if (changes === 0) {
        return res.status(404).json({ error: "Conta não encontrada." });
      }

      return res.json({ id, month, year, bill, totalValue, unitValue });
    } catch (error) {
      console.error("Erro ao atualizar conta:", error);
      return res.status(500).json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

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