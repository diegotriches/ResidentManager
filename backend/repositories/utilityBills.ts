import { initDB } from "../db.ts";

export interface UtilityBill {
  id: number;
  type: string;
  month: string;
  year: number;
  totalConsumptionM3: number;
  consumptionValue: number;
  taxesValue: number;
  cylinderType: string | null;
  unitPrice: number;
  multiplierFactor: number;
  splitCount: number;
  updatedAt: string;
}

export interface UpdateUtilityBillDTO {
  type: string;
  month: string;
  year: number;
  totalConsumptionM3: number;
  consumptionValue: number;
  taxesValue: number;
  cylinderType: string | null;
  unitPrice: number;
  multiplierFactor: number;
  splitCount: number;
}

export const UtilityBillsRepository = {
  async read(month?: string, year?: number): Promise<UtilityBill[]> {
    const db = await initDB();
    let query = "SELECT * FROM utility_bills";
    const params: (string | number)[] = [];

    if (month && year) {
      query += " WHERE month = ? AND year = ?";
      params.push(month, Number(year));
    }

    query += " ORDER BY createdAt DESC";
    const rows = await db.all(query, params);

    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      month: row.month,
      year: row.year,
      totalConsumptionM3: row.total_consumption_m3,
      consumptionValue: row.consumption_value,
      taxesValue: row.taxes_value,
      cylinderType: row.cylinder_type,
      unitPrice: row.unit_price,
      multiplierFactor: row.multiplier_factor,
      splitCount: row.split_count,
      updatedAt: row.updatedAt,
    }));
  },

  async create(
    data: UpdateUtilityBillDTO,
  ): Promise<{ id: number; calculatedUnitValue: number }> {
    const db = await initDB();
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
    } = data;

    let calculatedUnitValue = 0;

    if (type === "water") {
      calculatedUnitValue =
        totalConsumptionM3 > 0 ? consumptionValue / totalConsumptionM3 : 0;
    } else if (type === "gas") {
      const weights: Record<string, number> = { P45: 45, P90: 90 };
      const weight = weights[cylinderType || ""] || 45;

      calculatedUnitValue =
        weight > 0 ? (unitPrice / weight) * (multiplierFactor || 2.25) : 0;
    }

    const result = await db.run(
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

    return {
      id: Number(result.lastID),
      calculatedUnitValue: calculatedUnitValue,
    };
  },

  async update(
    id: string | number,
    data: UpdateUtilityBillDTO,
  ): Promise<{ changes: number; calculatedUnitValue: number }> {
    const db = await initDB();
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
    } = data;

    let calculatedUnitValue = 0;

    if (type === "water") {
      calculatedUnitValue =
        totalConsumptionM3 > 0 ? consumptionValue / totalConsumptionM3 : 0;
    } else if (type === "gas") {
      const weights: Record<string, number> = { P45: 45, P90: 90 };
      const weight = weights[cylinderType || ""] || 45;
      calculatedUnitValue =
        weight > 0 ? (unitPrice / weight) * multiplierFactor : 0;
    }

    const result = await db.run(
      `UPDATE utility_bills 
       SET type = ?, month = ?, year = ?, total_consumption_m3 = ?, 
           consumption_value = ?, taxes_value = ?, cylinder_type = ?, 
           unit_price = ?, multiplier_factor = ?, split_count = ?, 
           calculated_unit_value = ?, updatedAt = CURRENT_TIMESTAMP 
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
        calculatedUnitValue,
        id,
      ],
    );

    return { changes: result.changes ?? 0, calculatedUnitValue };
  },

  async delete(id: string | number) {
    const db = await initDB();

    const result = await db.run("DELETE FROM utility_bills WHERE id = ?", [id]);

    return (result as { changes: number }).changes ?? 0;
  },
};
