import type { Request, Response } from "express";
import { UtilityBillsRepository } from "../repositories/utilityBills.ts";

export const UtilityBillsController = {
  async read(req: Request, res: Response) {
    try {
      const { month, year } = req.query; // Captura o mês e ano enviados pelo frontend

      const bills = await UtilityBillsRepository.read(
        Number(month),
        Number(year),
      );

      res.json(bills);
    } catch (error) {
      console.error("Erro ao listar contas:", error);
      res
        .status(500)
        .json({ error: "Erro ao buscar faturas de concessionária." });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const {
        type,
        month,
        year,
        totalConsumption,
        consumptionValue,
        taxesValue,
        cylinderType,
        unitPrice,
        multiplierFactor,
        splitCount,
      } = req.body;

      const { id, calculatedUnitValue } = await UtilityBillsRepository.create({
        type: String(type),
        month: Number(month),
        year: Number(year),
        totalConsumption: Number(totalConsumption),
        consumptionValue: Number(consumptionValue),
        taxesValue: Number(taxesValue),
        cylinderType: String(cylinderType),
        unitPrice: Number(unitPrice),
        multiplierFactor: Number(multiplierFactor),
        splitCount: Number(splitCount),
      });

      return res.status(201).json({
        message: "Fatura salva com sucesso!",
        id,
        type,
        month,
        year,
        totalConsumption,
        consumptionValue,
        taxesValue,
        cylinderType,
        unitPrice,
        multiplierFactor,
        splitCount,
        calculatedUnitValue,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erro ao processar a fatura de concessionária." });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const {
        type,
        month,
        year,
        totalConsumption,
        consumptionValue,
        taxesValue,
        cylinderType,
        unitPrice,
        multiplierFactor,
        splitCount,
      } = req.body;
      const id = String(req.params.id);

      const { changes, calculatedUnitValue } =
        await UtilityBillsRepository.update(id, {
          type,
          month,
          year,
          totalConsumption,
          consumptionValue,
          taxesValue,
          cylinderType,
          unitPrice,
          multiplierFactor,
          splitCount,
        });

      if (changes === 0) {
        return res.status(404).json({ error: "Medição não encontrada." });
      }

      // 3. Retorna a resposta de sucesso em camelCase
      res.json({
        id: Number(id),
        type,
        month,
        year,
        totalConsumption,
        consumptionValue,
        taxesValue,
        cylinderType,
        unitPrice,
        multiplierFactor,
        splitCount,
        calculatedUnitValue,
      });
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);
      res.status(500).json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const changes = await UtilityBillsRepository.delete(id);

      if (changes > 0) {
        res.status(200).json({ message: "Medição removida com sucesso." });
      } else {
        res.status(404).json({
          error: "Medição não encontrada.",
          message: `Não foi possível remover: o ID ${id} não existe`,
        });
      }
    } catch (error) {
      console.error("Erro ao deletar medição:", error);
      res.status(500).json({
        error: "Erro interno do servidor.",
        message: "Ocorreu um erro ao tentar acessaro o banco de dados.",
      });
    }
  },
};
