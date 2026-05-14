import express from "express";
import { initDB } from "../db.ts";

const router = express.Router();

router.post("/utility-bills", async (req, res) => {
  const { 
    month, 
    year, 
    type, 
    // Dados de Água
    total_consumption_m3, 
    consumption_value, 
    taxes_value,
    // Dados de Gás
    cylinder_type, 
    unit_price, 
    multiplier_factor,
    split_count 
  } = req.body;

  const db = await initDB();

  try {
    // Lógica de cálculo conforme sua solicitação:
    let calculated_unit_value = 0;

    if (type === 'water') {
      // Valor do m³ = Valor do consumo / Consumo total (m³)
      // As taxas são armazenadas separadamente para o rateio fixo depois
      calculated_unit_value = consumption_value / total_consumption_m3;
    } else if (type === 'gas') {
      // Definir peso baseado no tipo de botijão
      const weights: Record<string, number> = { 'P20': 20, 'P45': 45, 'P90': 90 };
      const weight = weights[cylinder_type] || 45;
      
      // Valor do kg = (Preço pago / kg do tipo) * Fator de correção
      calculated_unit_value = (unit_price / weight) * (multiplier_factor || 2.25);
    }

    await db.run(
      `INSERT INTO utility_bills (
        month, year, type, 
        total_consumption_m3, consumption_value, taxes_value,
        cylinder_type, unit_price, multiplier_factor, split_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(month, year, type) DO UPDATE SET
        total_consumption_m3 = excluded.total_consumption_m3,
        consumption_value = excluded.consumption_value,
        taxes_value = excluded.taxes_value,
        cylinder_type = excluded.cylinder_type,
        unit_price = excluded.unit_price,
        multiplier_factor = excluded.multiplier_factor,
        split_count = excluded.split_count,
        updatedAt = CURRENT_TIMESTAMP`,
      [
        month, year, type, 
        total_consumption_m3, consumption_value, taxes_value,
        cylinder_type, unit_price, multiplier_factor, split_count
      ]
    );

    res.json({ 
      message: "Fatura salva com sucesso!", 
      calculatedUnitValue: calculated_unit_value 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar a fatura de concessionária." });
  }
});

export default router;