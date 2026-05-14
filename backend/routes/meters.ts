import express from "express";
import { initDB } from "../db.ts";

const router = express.Router();

// GET - listas dados
// GET - lista dados filtrados por mês e ano
router.get("/", async (req, res) => {
  const { month, year } = req.query; // Pega os parâmetros da URL
  const db = await initDB();

  try {
    let query = "SELECT * FROM meters";
    const params = [];

    // Se mês e ano forem enviados, filtramos a busca
    if (month && year) {
      query +=
        " WHERE strftime('%m', createdAt) = ? AND strftime('%Y', createdAt) = ?";
      params.push(month, year);
    }

    query += " ORDER BY createdAt DESC"; // Opcional: registros mais novos primeiro

    const meters = await db.all(query, params);
    res.json(meters);
  } catch (error) {
    console.error("Erro ao listar medições:", error);
    res.status(500).json({ error: "Erro ao buscar dados no banco." });
  }
});

// GET - para filtrar os consumos e passar para vouchers
router.get("/report/consumption", async (req, res) => {
  const { month, year } = req.query;
  const db = await initDB();

  try {
    // Esta query é o "coração" do sistema de vouchers
    const query = `
      SELECT 
        a.number AS apartment,
        m_atual.water AS water_current,
        m_atual.gas AS gas_current,
        IFNULL(m_ant.water, 0) AS water_previous,
        IFNULL(m_ant.gas, 0) AS gas_previous,
        (IFNULL(m_atual.water, 0) - IFNULL(m_ant.water, 0)) AS water_consumption,
        (IFNULL(m_atual.gas, 0) - IFNULL(m_ant.gas, 0)) AS gas_consumption
      FROM apartments a
      LEFT JOIN meters m_atual ON a.number = m_atual.apartment 
        AND strftime('%m', m_atual.createdAt) = ? 
        AND strftime('%Y', m_atual.createdAt) = ?
      LEFT JOIN meters m_ant ON a.number = m_ant.apartment 
        AND m_ant.createdAt < m_atual.createdAt
        AND m_ant.meter_id = (
          SELECT MAX(meter_id) FROM meters 
          WHERE apartment = a.number AND (createdAt < m_atual.createdAt OR m_atual.createdAt IS NULL)
        )
      ORDER BY a.number ASC
    `;

    const report = await db.all(query, [month, year]);
    res.json(report);
  } catch (error) {
    console.error("Erro no relatório:", error);
    res.status(500).json({ error: "Erro interno ao gerar consumos." });
  }
});

// POST - criar novo
router.post("/", async (req, res) => {
  try {
    const { apartment, water, gas } = req.body;
    const db = await initDB();
    const result = await db.run(
      "INSERT INTO meters (apartment, water, gas) VALUES (?, ?, ?)",
      [apartment, water, gas],
    );
    res.status(201).json({ meter_id: result.lastID, apartment, water, gas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao inserir medição" });
  }
});

// PUT - atualizar
router.put("/:id", async (req, res) => {
  const { apartment, water, gas } = req.body;
  const { id } = req.params;
  const db = await initDB();

  try {
    const result = await db.run(
      "UPDATE meters SET apartment = ?, water = ?, gas = ?, updatedAt = CURRENT_TIMESTAMP WHERE meter_id = ?",
      [apartment, water, gas, id],
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Medição não encontrada." });
    }

    res.json({ id, apartment, water, gas });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar banco de dados." });
  }
});

// DELETE - remover
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await initDB();
    const result = (await db.run("DELETE FROM meters WHERE meter_id = ?", [
      id,
    ])) as { changes: number };

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
});

export default router;
