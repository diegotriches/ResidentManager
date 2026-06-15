import type { Request, Response } from "express";
import { initDB } from "../db.ts";

export const VouchersController = {
  async read(req: Request, res: Response) {
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
        IFNULL(vs.is_paid, 0) AS is_paid,
        
        -- Consumo de Gás bruto (mantido separado)
        CASE 
          WHEN m_atual.apartment IS NOT NULL THEN (IFNULL(m_atual.gas, 0) - IFNULL(m_ant.gas, 0))
          ELSE 0 
        END AS gas_consumption,

        -- 1. CÁLCULO DO PREÇO DO M³ DA ÁGUA: (Valor do Consumo / Consumo Total em m³)
        CASE 
          WHEN fatura.id IS NOT NULL AND IFNULL(fatura.total_consumption_m3, 0) > 0 
          THEN (IFNULL(fatura.consumption_value, 0) / fatura.total_consumption_m3)
          ELSE 0 
        END AS water_price_per_m3,

        -- 2. CÁLCULO DA TAXA INDIVIDUAL RATEADA POR APARTAMENTO
        CASE 
          WHEN fatura.id IS NOT NULL AND IFNULL(fatura.split_count, 0) > 0 
          THEN (IFNULL(fatura.taxes_value, 0) / fatura.split_count)
          ELSE 0 
        END AS water_fee_per_apartment,

        -- 3. VALOR TOTAL DA ÁGUA: (Consumo do Apto * Preço do m³ Calculado) + Taxa do Rateio
        CASE 
          WHEN m_atual.apartment IS NOT NULL THEN 
            -- Parte A: (Leitura Atual - Leitura Anterior) * (Valor Consumo / Consumo Total M³)
            (IFNULL(m_atual.water, 0) - IFNULL(m_ant.water, 0)) * (CASE 
                WHEN IFNULL(fatura.total_consumption_m3, 0) > 0 
                THEN (IFNULL(fatura.consumption_value, 0) / fatura.total_consumption_m3)
                ELSE 0 
              END
            ) + 
            -- Parte B: Taxa fixa rateada
            (CASE WHEN IFNULL(fatura.split_count, 0) > 0 THEN (CAST(IFNULL(fatura.taxes_value, 0) AS REAL) / fatura.split_count) ELSE 0 END)
          ELSE 0 
        END AS total_water_value

      FROM apartments a
      
      -- 1. Leitura do mês atual
      LEFT JOIN meters m_atual ON m_atual.apartment = a.number
        AND m_atual.month = ? 
        AND m_atual.year = ?
        
      -- 2. Leitura anterior cronológica
      LEFT JOIN meters m_ant ON m_ant.apartment = a.number
        AND m_ant.id = (
          SELECT id FROM meters 
          WHERE apartment = a.number 
            AND (year < ? OR (year = ? AND month < ?))
          ORDER BY year DESC, month DESC
          LIMIT 1
        )
        
      -- 3. Fatura de água isolada
      LEFT JOIN (
        SELECT id, consumption_value, total_consumption_m3, taxes_value, split_count, month, year 
        FROM utility_bills 
        WHERE type = 'water'
          AND month = ?
          AND year = ?
        LIMIT 1
      ) fatura ON fatura.year = m_atual.year
        
      -- 4. Status de pagamento do voucher (Movido para antes do ORDER BY)
      LEFT JOIN vouchers vs 
        ON vs.apartment = a.number 
        AND vs.month = m_atual.month 
        AND vs.year = m_atual.year
        
      ORDER BY a.number ASC
    `;

      const report = await db.all(query, [
        String(month).trim(),
        Number(year), // m_atual
        Number(year),
        Number(year),
        String(month).trim(), // subquery m_ant
        String(month).trim(),
        Number(year), // subquery fatura
      ]);

      res.json(report);
    } catch (error) {
      console.error("Erro no relatório de finanças:", error);
      res
        .status(500)
        .json({ error: "Erro interno ao gerar dados financeiros." });
    }
  },

  async update(req: Request, res: Response) {
    const { apartment, month, year, is_paid } = req.body;
    const db = await initDB();

    try {
      // Usamos INSERT OR REPLACE para criar se não existir ou atualizar se já existir
      const sql = `
      INSERT OR REPLACE INTO vouchers (apartment, month, year, is_paid)
      VALUES (?, ?, ?, ?);
    `;

      await db.run(sql, [
        String(apartment),
        String(month),
        Number(year),
        is_paid ? 1 : 0,
      ]);

      res.json({
        success: true,
        message: "Status de pagamento atualizado com sucesso!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar status de pagamento." });
    }
  },
};
