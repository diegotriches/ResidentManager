import type { Request, Response } from "express";
import { MetersRepository } from "../repositories/meters.ts";
import {
  createMeterSchema,
  meterSchema,
  meterQuerySchema,
  meterIdParamSchema
} from "../../packages/shared/schemas/meter.schema.ts";

export const MetersController = {
  async read(req: Request, res: Response) {
    try {
      const queryValidation = meterQuerySchema.safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          error: "Parâmetros de busca inválidos.",
          details: queryValidation.error.issues,
        });
      }

      const { month, year } = queryValidation.data;

      const meters = await MetersRepository.read(month, year);

      return res.json(meters);
    } catch (error) {
      console.error("Erro ao listar medições:", error);
      return res.status(500).json({ error: "Erro ao buscar dados no banco." });
    }
  },

  async readConsumption(req: Request, res: Response) {
    try {
      const queryValidation = meterQuerySchema.safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          error: "Parâmetros de busca inválidos.",
          details: queryValidation.error.issues,
        });
      }

      const { month, year } = queryValidation.data;

      const meters = await MetersRepository.readConsumption(month, year);

      return res.json(meters);
    } catch (error) {
      console.error("Erro ao ler consumo:", error);
      return res.status(500).json({
        error: "Erro interno do servidor.",
        message:
          "Ocorreu um erro ao tentar buscar os dados de consumo no banco.",
      });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const validation = createMeterSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Validação falhou.",
          details: validation.error.issues,
        });
      }

      const { month, year, apartmentId, water, gas } = validation.data;

      const meter = await MetersRepository.create({
        month,
        year,
        apartmentId,
        water,
        gas,
      });

      return res
        .status(201)
        .json({ id: meter, month, year, apartmentId, water, gas });
    } catch (error) {
      console.error("Erro ao inserir medição:", error);
      return res.status(500).json({ error: "Erro ao inserir medição" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const paramValidation = meterSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          error: "ID de apartamento inválido.",
          details: paramValidation.error.issues,
        });
      }

      const validation = meterSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Dados para atualização inválidos.",
          details: validation.error.issues,
        });
      }

      const { id } = paramValidation.data;

      const { month, year, apartmentId, water, gas } = validation.data;

      const changes = await MetersRepository.update(id, {
        month,
        year,
        apartmentId,
        water,
        gas,
      });

      if (changes === 0) {
        return res.status(404).json({ error: "Medição não encontrada." });
      }

      return res.json({ id, month, year, apartmentId, water, gas });
    } catch (error) {
      console.error("Erro ao atualizar medição:", error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const paramValidation = meterIdParamSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          error: "ID de apartamento inválido.",
          details: paramValidation.error.issues,
        });
      }

      const { id } = paramValidation.data;

      const changes = await MetersRepository.delete(id);

      if (changes > 0) {
        return res
          .status(200)
          .json({ message: "Medição removida com sucesso." });
      } else {
        return res.status(404).json({
          error: "Medição não encontrada.",
          message: `Não foi possível remover: o ID ${id} não existe`,
        });
      }
    } catch (error) {
      console.error("Erro ao deletar medição:", error);
      return res.status(500).json({
        error: "Erro interno do servidor.",
        message: "Ocorreu um erro ao tentar acessaro o banco de dados.",
      });
    }
  },
};
