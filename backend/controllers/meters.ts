import type { Request, Response } from "express";
import { initDB } from "../db.ts";

export const MetersController = {
  async read(req: Request, res: Response) {
    const { month, year } = req.query; // Pega os parâmetros da URL
    const db = await initDB();

    try {
      let query = "SELECT * FROM meters";
      const params = [];

      // Se mês e ano forem enviados, filtramos a busca
      if (month && year) {
        query += " WHERE month = ? AND year = ?";
        params.push(month, Number(year));
      }

      query += " ORDER BY createdAt DESC"; // Opcional: registros mais novos primeiro

      const meters = await db.all(query, params);
      res.json(meters);
    } catch (error) {
      console.error("Erro ao listar medições:", error);
      res.status(500).json({ error: "Erro ao buscar dados no banco." });
    }
  },

  async readConsumption(req: Request, res: Response) {
    const { month, year } = req.query;
    const db = await initDB();

    try {
      const query = `
        SELECT 
          a.number AS apartment,
          IFNULL(m_atual.water, 0) AS water_current,
          IFNULL(m_atual.gas, 0) AS gas_current,
          IFNULL(m_ant.water, 0) AS water_previous,
          IFNULL(m_ant.gas, 0) AS gas_previous,
          
          CASE 
            WHEN m_atual.apartment IS NOT NULL THEN (IFNULL(m_atual.water, 0) - IFNULL(m_ant.water, 0))
            ELSE 0 
          END AS water_consumption,
          
          CASE 
            WHEN m_atual.apartment IS NOT NULL THEN (IFNULL(m_atual.gas, 0) - IFNULL(m_ant.gas, 0))
            ELSE 0 
          END AS gas_consumption
        FROM apartments a
        
        -- Traz a leitura do mês selecionado
        LEFT JOIN meters m_atual ON a.number = m_atual.apartment 
          AND m_atual.month = ? 
          AND m_atual.year = ?
          
        -- Busca a leitura anterior baseando-se unicamente na data do registro, ignorando IDs
        LEFT JOIN meters m_ant ON a.number = m_ant.apartment 
          AND m_ant.id = (
            SELECT id FROM meters 
            WHERE apartment = a.number 
              AND (year < ? OR (year = ? AND month < ?))
            ORDER BY year DESC, month DESC
            LIMIT 1
          )
        ORDER BY a.number ASC
      `;

      const report = await db.all(query, [
        month,
        Number(year),
        Number(year),
        Number(year),
        month,
      ]);
      res.json(report);
    } catch (error: any) {
      console.error("❌ ERRO NO BACKEND:", error?.message || error);
      return res.status(500).json({
        error: "Erro na rota",
        detalhes: error?.message || error,
      });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { month, year, apartment, water, gas } = req.body;
      const db = await initDB();
      const result = await db.run(
        "INSERT INTO meters (month, year, apartment, water, gas) VALUES (?, ?, ?, ?, ?)",
        [month, year, apartment, water, gas],
      );
      res
        .status(201)
        .json({ id: result.lastID, month, year, apartment, water, gas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao inserir medição" });
    }
  },

  async update(req: Request, res: Response) {
    const { month, year, apartment, water, gas } = req.body;
    const { id } = req.params;
    const db = await initDB();

    try {
      const result = await db.run(
        "UPDATE meters SET month = ?, year = ?, apartment = ?, water = ?, gas = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [month, year, apartment, water, gas, id],
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: "Medição não encontrada." });
      }

      res.json({ id, month, year, apartment, water, gas });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const db = await initDB();
      const result = (await db.run("DELETE FROM meters WHERE id = ?", [
        id,
      ])) as {
        changes: number;
      };

      if (result.changes > 0) {
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
