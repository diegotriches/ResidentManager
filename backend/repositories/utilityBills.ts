import { db } from "../db/index.ts";
import { utilityBills } from "../db/schema.ts";
import { eq, and } from "drizzle-orm";

export interface UtilityBill extends UtilityBillDTO {
  id: number;
  updatedAt: string;
}

export interface UtilityBillDTO {
  type: "water" | "gas";
  month: number;
  year: number;
  totalConsumption: number;
  consumptionValue: number;
  taxesValue: number;
  cylinderType: "P45" | "P90";
  unitPrice: number;
  multiplierFactor: number;
  splitCount: number;
}

export const UtilityBillsRepository = {
  async read(month: number, year: number): Promise<UtilityBill[]> {
    const rows = await db
      .select()
      .from(utilityBills)
      .where(and(eq(utilityBills.month, month), eq(utilityBills.year, year)));

    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      month: row.month,
      year: row.year,
      totalConsumption: row.totalConsumption,
      consumptionValue: row.consumptionValue,
      taxesValue: row.taxesValue,
      cylinderType: row.cylinderType,
      unitPrice: row.unitPrice,
      multiplierFactor: row.multiplierFactor ?? 0,
      splitCount: row.splitCount ?? 0,
      updatedAt: row.updatedAt ?? "",
    }));
  },

  async create(
    data: UtilityBillDTO,
  ): Promise<{ id: number; calculatedUnitValue: number }> {
    const {
      type,
      month,
      year,
      totalConsumption,
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
        totalConsumption > 0 ? consumptionValue / totalConsumption : 0;
    } else if (type === "gas") {
      const weights: Record<string, number> = { P45: 45, P90: 90 };
      const weight = weights[cylinderType || ""] || 45;

      calculatedUnitValue =
        weight > 0 ? (unitPrice / weight) * (multiplierFactor || 2.25) : 0;
    }

    const result = await db.insert(utilityBills).values({
      type: type ? "water" : "gas",
      month,
      year,
      totalConsumption,
      consumptionValue,
      taxesValue,
      cylinderType: cylinderType ? "P45" : "P90",
      unitPrice,
      multiplierFactor,
      splitCount,
    });

    return {
      id: Number(result.lastInsertRowid),
      calculatedUnitValue: calculatedUnitValue,
    };
  },

  async update(
    id: number,
    data: UtilityBillDTO,
  ): Promise<{ changes: number; calculatedUnitValue: number }> {
    const {
      type,
      month,
      year,
      totalConsumption,
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
        totalConsumption > 0 ? consumptionValue / totalConsumption : 0;
    } else if (type === "gas") {
      const weights: Record<string, number> = { P45: 45, P90: 90 };
      const weight = weights[cylinderType || ""] || 45;
      calculatedUnitValue =
        weight > 0 ? (unitPrice / weight) * (multiplierFactor ?? 1) : 0;
    }

    const result = await db
      .update(utilityBills)
      .set({
        type,
        month,
        year,
        totalConsumption,
        consumptionValue,
        taxesValue,
        cylinderType,
        unitPrice,
        multiplierFactor,
        splitCount,
      })
      .where(eq(utilityBills.id, id));

    return { changes: result.changes ?? 0, calculatedUnitValue };
  },

  async delete(id: number) {
    const result = await db.delete(utilityBills).where(eq(utilityBills.id, id));

    return result.changes;
  },
};
