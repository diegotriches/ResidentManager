import type { Request, Response } from "express";
import { initDB } from "../db.ts";

export const UtilityBillsController = {
  async read(req: Request, res: Response) {
    const { month, year } = req.query; // Captura o mês e ano enviados pelo frontend
    const db = await initDB();

    try {
      let query = "SELECT * FROM utility_bills";
      const params = [];

      // Se mês e ano forem enviados, filtra a busca
      if (month && year) {
        query += " WHERE month = ? AND year = ?";
        params.push(month, Number(year));
      }

      query += " ORDER BY createdAt DESC";
      const bills = await db.all(query, params);

      // Traduz o snake_case do banco para o camelCase que o frontend espera
      const billsInCamelCase = bills.map((bill) => ({
        id: bill.id,
        type: bill.type,
        month: bill.month,
        year: bill.year,
        totalConsumptionM3: bill.total_consumption_m3,
        consumptionValue: bill.consumption_value,
        taxesValue: bill.taxes_value,
        cylinderType: bill.cylinder_type,
        unitPrice: bill.unit_price,
        multiplierFactor: bill.multiplier_factor,
        splitCount: bill.split_count,
        updatedAt: bill.updatedAt,
      }));

      res.json(billsInCamelCase);
    } catch (error) {
      console.error("Erro ao listar contas:", error);
      res
        .status(500)
        .json({ error: "Erro ao buscar faturas de concessionária." });
    }
  },

  async create(req: Request, res: Response) {
    const {
      type,
      month,
      year,
      totalConsumptionM3,
      consumptionValue,
      taxesValue,
      cylinderType,
      unitPrice,
      multiplierFactor,
      splitCount,
    } = req.body;

    const db = await initDB();

    try {
      // Lógica de cálculo conforme sua solicitação:
      let calculated_unit_value = 0;

      if (type === "water") {
        // Valor do m³ = Valor do consumo / Consumo total (m³)
        // As taxas são armazenadas separadamente para o rateio fixo depois
        calculated_unit_value = consumptionValue / totalConsumptionM3;
      } else if (type === "gas") {
        // Definir peso baseado no tipo de botijão
        const weights: Record<string, number> = { P45: 45, P90: 90 };
        const weight = weights[cylinderType] || 45;

        // Valor do kg = (Preço pago / kg do tipo) * Fator de correção
        calculated_unit_value =
          (unitPrice / weight) * (multiplierFactor || 2.25);
      }

      await db.run(
        `INSERT INTO utility_bills (
        type,
        month,
        year,
        total_consumption_m3,
        consumption_value,
        taxes_value,
        cylinder_type,
        unit_price,
        multiplier_factor,
        split_count
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          type,
          month,
          year,
          totalConsumptionM3,
          consumptionValue,
          taxesValue,
          cylinderType,
          unitPrice,
          multiplierFactor,
          splitCount,
        ],
      );

      res.status(201).json({
        message: "Fatura salva com sucesso!",
        calculatedUnitValue: calculated_unit_value,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erro ao processar a fatura de concessionária." });
    }
  },

  async update(req: Request, res: Response) {
    const {
      type,
      month,
      year,
      totalConsumptionM3,
      consumptionValue,
      taxesValue,
      cylinderType,
      unitPrice,
      multiplierFactor,
      splitCount,
    } = req.body;
    const { id } = req.params;
    const db = await initDB();

    try {
      // 1. Recalcula o valor unitário baseado nas alterações enviadas
      let calculated_unit_value = 0;

      if (type === "water") {
        if (totalConsumptionM3 > 0) {
          calculated_unit_value = consumptionValue / totalConsumptionM3;
        } else {
          calculated_unit_value = 0;
        }
      } else if (type === "gas") {
        const weights: Record<string, number> = { P45: 45, P90: 90 };
        const weight = weights[cylinderType] || 45;

        if (weight > 0) {
          calculated_unit_value = (unitPrice / weight) * multiplierFactor;
        }
      }

      // 2. Executa o UPDATE incluindo a coluna correspondente ao cálculo
      const result = await db.run(
        `UPDATE utility_bills 
       SET type = ?,
           month = ?,
           year = ?, 
           total_consumption_m3 = ?, 
           consumption_value = ?, 
           taxes_value = ?, 
           cylinder_type = ?, 
           unit_price = ?, 
           multiplier_factor = ?, 
           split_count = ?, 
           updatedAt = CURRENT_TIMESTAMP 
       WHERE id = ?`,
        [
          type,
          month,
          year,
          totalConsumptionM3,
          consumptionValue,
          taxesValue,
          cylinderType,
          unitPrice,
          multiplierFactor,
          splitCount,
          id, // O ID deve ser sempre o último parâmetro por conta do WHERE id = ?
        ],
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: "Medição não encontrada." });
      }

      // 3. Retorna a resposta de sucesso em camelCase
      res.json({
        id: Number(id),
        type,
        month,
        year,
        totalConsumptionM3,
        consumptionValue,
        taxesValue,
        cylinderType,
        unitPrice,
        multiplierFactor,
        splitCount,
        calculatedUnitValue: calculated_unit_value,
      });
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);
      res.status(500).json({ error: "Erro ao atualizar banco de dados." });
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const db = await initDB();
      const result = (await db.run("DELETE FROM utility_bills WHERE id = ?", [
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
  },
};
