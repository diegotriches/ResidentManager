import type { Request, Response } from "express";
import { ApartmentsRepository } from "../repositories/apartments.ts";

export const ApartmentsController = {
  async read(req: Request, res: Response) {
    try {
      const apartments = await ApartmentsRepository.read();
      return res.json(apartments);
    } catch (error) {
      console.error("Erro ao listar apartamentos:", error);
      return res.status(500).json({ error: "Erro ao buscar dados no banco." });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { apartment, ownerName } = req.body;
      const apt = await ApartmentsRepository.create({
        apartment,
        ownerName,
      });

      return res.status(201).json({ id: apt, apartment, ownerName });
    } catch (error: any) {
      if (
        error.code === "SQLITE_CONSTRAINT" ||
        error.message?.includes("UNIQUE")
      ) {
        return res.status(400).json({
          error: "Validação falhou.",
          message: "Este número de apartamento já esta cadastrado.",
        });
      }

      console.error("Erro ao criar apartamento:", error);
      return res.status(500).json({ error: "Erro ao criar apartamento." });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { apartment, ownerName } = req.body;
      const id = Number(req.params.id);

      const changes = await ApartmentsRepository.update(id, {
        apartment,
        ownerName,
      });

      if (changes === 0) {
        return res.status(404).json({ error: "Apartamento não encontrado." });
      }

      return res.json({ id, apartment, ownerName });
    } catch (error) {
      console.error("Erro ao atualizar apartamento:", error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const changes = await ApartmentsRepository.delete(id);

      if (changes > 0) {
        return res
          .status(200)
          .json({ message: "Apartamento removido com sucesso." });
      } else {
        return res.status(404).json({
          error: "Apartamento não encontrado.",
          message: `Não foi possível remover: o ID ${id} não existe.`,
        });
      }
    } catch (error) {
      console.error("Erro ao deletar apartamento:", error);
      return res.status(500).json({
        error: "Erro interno do servidor.",
        message: "Ocorreu um erro ao tentar acessar o banco de dados.",
      });
    }
  },
};
