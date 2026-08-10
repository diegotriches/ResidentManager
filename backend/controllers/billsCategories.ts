import type { Request, Response } from "express";
import { BillsCategoryRepository } from "../repositories/billsCategories.ts";
import {
  createBillCategorySchema,
  billCategorySchema,
  billCategoryIdSchema,
} from "../../packages/shared/schemas/billsCategories.schema.ts";
import { z } from "zod";

export const BillsCategoriesController = {
  async read(req: Request, res: Response) {
    try {
      const billsCategories = await BillsCategoryRepository.read();

      const parsedBillsCategories = z
        .array(billCategorySchema)
        .safeParse(billsCategories);

      if (!parsedBillsCategories.success) {
        console.error(
          "Erro na validação do schema das categorias:",
          parsedBillsCategories.error,
        );
        return res.status(500).json({
          error: "Dados retornados do banco estão em formato inválido.",
        });
      }

      return res.json(parsedBillsCategories.data);
    } catch (error) {
      console.error("Erro ao listar categorias:", error);
      return res.status(500).json({ error: "Erro ao buscar dados no banco." });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const validation = createBillCategorySchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Validação falhou.",
          details: validation.error.issues,
        });
      }

      const { categoryName } = validation.data;

      const categoryId = await BillsCategoryRepository.create({
        categoryName,
      });

      return res.status(201).json({ id: categoryId, categoryName });
    } catch (error) {
      console.error("Erro ao inserir categoria:", error);
      return res.status(500).json({ error: "Erro ao inserir categoria." });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const paramValidation = billCategoryIdSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          error: "ID de categoria inválido.",
          details: paramValidation.error.issues,
        });
      }

      const validation = createBillCategorySchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Dados para atualização inválidos.",
          details: validation.error.issues,
        });
      }

      const { id } = paramValidation.data;
      const { categoryName } = validation.data;

      const changes = await BillsCategoryRepository.update(id, {
        categoryName,
      });

      if (changes === 0) {
        return res.status(404).json({ error: "Categoria não encontrada." });
      }

      return res.json({ id, categoryName });
    } catch (error) {
      console.error("Erro ao atualizar cadastro:", error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const paramValidation = billCategoryIdSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          error: "ID de categoria inválido.",
          details: paramValidation.error.issues,
        });
      }

      const { id } = paramValidation.data;
      const changes = await BillsCategoryRepository.delete(id);

      if (changes > 0) {
        return res
          .status(200)
          .json({ message: "Categoria removida com sucesso." });
      } else {
        return res.status(404).json({
          error: "Categoria não encontrada.",
          message: `Não foi possível remover: o ID ${id} não existe.`,
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
