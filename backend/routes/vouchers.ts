import express from "express";
import { initDB } from "../db.ts";

const router = express.Router();

// GET - Esta query busca a medição do mês escolhido e tenta achar a medição do mês imediatamente anterior para o mesmo apartamento.
router.get("/consumption-report", async (req, res) => {
  const { month, year } = req.query; // Recebe via query string: ?month=05&year=2026
  const db = await initDB();

  try {
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
      -- Busca medição do mês escolhido
      LEFT JOIN meters m_atual ON a.number = m_atual.apartment 
        AND strftime('%m', m_atual.createdAt) = ? 
        AND strftime('%Y', m_atual.createdAt) = ?
      -- Busca a última medição ANTES do mês escolhido
      LEFT JOIN meters m_ant ON a.number = m_ant.apartment 
        AND m_ant.createdAt < m_atual.createdAt
        AND m_ant.meter_id = (
          SELECT MAX(meter_id) FROM meters 
          WHERE apartment = a.number AND createdAt < m_atual.createdAt
        )
      ORDER BY a.number ASC
    `;

    const report = await db.all(query, [month, year]);
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar relatório de consumo." });
  }
});