import type { Request, Response } from "express";
import { MetersRepository } from "../repositories/meters.ts";

export const MetersController = {
  async read(req: Request, res: Response) {
    try {
      const { month, year } = req.query; // Pega os parâmetros da URL

      // Se mês e ano forem enviados, filtramos a busca
      const meters = await MetersRepository.read(
        Number(month),
        Number(year),
      );

      res.json(meters);
    } catch (error) {
      console.error("Erro ao listar medições:", error);
      res.status(500).json({ error: "Erro ao buscar dados no banco." });
    }
  },

  async readConsumption(req: Request, res: Response) {
    try {
      const { month, year } = req.query;

      const meters = await MetersRepository.readConsumption(
        Number(month),
        Number(year),
      );

      res.json(meters);
    } catch (error) {
      console.error("ERRO NO BACKEND:", error);
      return res.status(500).json({
        error: "Erro na rota",
        detalhes: error,
      });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { month, year, apartmentId, water, gas } = req.body;
      const meter = await MetersRepository.create({
        month,
        year,
        apartmentId,
        water,
        gas,
      });

      res.status(201).json({ id: meter, month, year, apartmentId, water, gas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao inserir medição" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { month, year, apartmentId, water, gas } = req.body;
      const id = Number(req.params.id);

      const changes = await MetersRepository.update(id, {
        month,
        year,
        apartmentId,
        water,
        gas,
      });

      if (changes === 0) {
        return res.status(404).json({ error: "Conta não encontrada." });
      }

      res.json({ id, month, year, apartmentId, water, gas });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const changes = await MetersRepository.delete(id);

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
