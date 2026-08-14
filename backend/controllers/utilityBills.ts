import type { Request, Response } from "express";
import { UtilityBillsRepository } from "../repositories/utilityBills.ts";
import {
  utilityBillSchema,
  utilityBillQuerySchema,
  utilityBillIdParamSchema,
} from "../../packages/shared/schemas/utilityBills.schema.ts";

export const UtilityBillsController = {
  async read(req: Request, res: Response) {
    try {
      const queryValidation = utilityBillQuerySchema.safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          error: "Parâmetros de busca inválidos.",
          details: queryValidation.error.issues,
        });
      }

      const { month, year } = queryValidation.data;

      const bills = await UtilityBillsRepository.read(month, year);

      return res.json(bills);
    } catch (error) {
      console.error("Erro ao listar contas:", error);
      res
        .status(500)
        .json({ error: "Erro ao buscar faturas de concessionária." });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const validation = utilityBillSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Validação falhou.",
          details: validation.error.issues,
        });
      }

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
      } = validation.data;

      const { id, calculatedUnitValue } = await UtilityBillsRepository.create({
        type,
        month,
        year,
        totalConsumption,
        consumptionValue,
        taxesValue,
        cylinderType,
        unitPrice,
        multiplierFactor,
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
        calculatedUnitValue,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao processar a fatura de concessionária." });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const paramValidation = utilityBillIdParamSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          error: "ID da conta inválido.",
          details: paramValidation.error.issues,
        });
      }

      const validation = utilityBillSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Dados para atualização inválidos.",
          details: validation.error.issues,
        });
      }

      const { id } = paramValidation.data;

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
      } = validation.data;

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
        });

      if (changes === 0) {
        return res.status(404).json({ error: "Conta não encontrada." });
      }

      return res.json({
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
        calculatedUnitValue,
      });
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const paramValidation = utilityBillIdParamSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          error: "ID da conta inválido.",
          details: paramValidation.error.issues,
        });
      }

      const { id } = paramValidation.data;

      const changes = await UtilityBillsRepository.delete(id);

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
