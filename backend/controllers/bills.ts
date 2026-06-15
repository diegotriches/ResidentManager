import type { Request, Response } from "express";
import { initDB } from "../db.ts";

export const BillsController = {
  async read(req: Request, res: Response) {
    try {
      // 1. Extração dos Query Params que vieram da URL do Frontend
      const { month, year } = req.query;
      const db = await initDB();

      let query = "SELECT * FROM bills";
      const params: (string | number)[] = [];

      // 2. Lógica de negócio / Montagem da query com filtros
      if (month && year) {
        query += " WHERE month = ? AND year = ?";
        params.push(String(month), Number(year));
      }

      query += " ORDER BY createdAt DESC";

      // 3. Execução no banco de dados
      const bills = await db.all(query, params);

      // 4. Resposta JSON enviada de volta para o Service do Frontend
      return res.json(bills);
    } catch (error) {
      console.error("Erro ao listar contas:", error);
      return res.status(500).json({ error: "Erro ao buscar dados no banco." });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { month, year, bill, totalValue, unitValue } = req.body;
      const db = await initDB();
      const result = await db.run(
        "INSERT INTO bills (month, year, bill, totalValue, unitValue) VALUES (?, ?, ?, ?, ?)",
        [month, year, bill, totalValue, unitValue],
      );
      res
        .status(201)
        .json({ bill_id: result.lastID, bill, totalValue, unitValue });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao inserir conta" });
    }
  },

  async update(req: Request, res: Response) {
    const { month, year, bill, totalValue, unitValue } = req.body;
    const { id } = req.params;
    const db = await initDB();

    try {
      const result = await db.run(
        "UPDATE bills SET month = ?, year = ?, bill = ?, totalValue = ?, unitValue = ?, updatedAt = CURRENT_TIMESTAMP WHERE bill_id = ?",
        [month, year, bill, totalValue, unitValue, id],
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: "Conta não encontrada." });
      }

      res.json({ id, month, year, bill, totalValue, unitValue });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const db = await initDB();
      const result = (await db.run("DELETE FROM bills WHERE bill_id = ?", [
        id,
      ])) as { changes: number };

      if (result.changes > 0) {
        res.status(200).json({ message: "Conta removida com sucesso." });
      } else {
        res.status(404).json({
          error: "Conta não encontrada.",
          message: `Não foi possível remover: o ID ${id} não existe`,
        });
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      res.status(500).json({
        error: "Erro interno do servidor.",
        message: "Ocorreu um erro ao tentar acessaro o banco de dados.",
      });
    }
  },
};
