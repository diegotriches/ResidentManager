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
  totalConsumption?: number;
  consumptionValue?: number;
  taxesValue?: number;
  cylinderType?: "P45" | "P90";
  unitPrice?: number;
  multiplierFactor?: number;
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
      totalConsumption: row.totalConsumption ?? 0,
      consumptionValue: row.consumptionValue ?? 0,
      taxesValue: row.taxesValue ?? 0,
      cylinderType: row.cylinderType ?? undefined,
      unitPrice: row.unitPrice ?? 0,
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
      // 💧 Garante que se vier undefined, vira 0 para a conta não quebrar
      const currentTotalConsumption = totalConsumption ?? 0;
      const currentConsumptionValue = consumptionValue ?? 0;

      calculatedUnitValue =
        currentTotalConsumption > 0
          ? currentConsumptionValue / currentTotalConsumption
          : 0;
    } else if (type === "gas") {
      // 🔥 Mapeamento tipado estritamente com os seus tipos de cilindro
      const weights: Record<"P45" | "P90", number> = { P45: 45, P90: 90 };

      // Se cylinderType for undefined, o '?? "P45"' garante um valor padrão válido
      const weight = weights[cylinderType ?? "P45"];

      const currentUnitPrice = unitPrice ?? 0;
      const currentMultiplier = multiplierFactor ?? 2.25; // Mantém o seu padrão 2.25

      calculatedUnitValue =
        weight > 0 ? (currentUnitPrice / weight) * currentMultiplier : 0;
    }

    const result = await db.insert(utilityBills).values({
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
      // 💧 Garante que se vier undefined, vira 0 para a conta não quebrar
      const currentTotalConsumption = totalConsumption ?? 0;
      const currentConsumptionValue = consumptionValue ?? 0;

      calculatedUnitValue =
        currentTotalConsumption > 0
          ? currentConsumptionValue / currentTotalConsumption
          : 0;
    } else if (type === "gas") {
      // 🔥 Mapeamento tipado estritamente com os seus tipos de cilindro
      const weights: Record<"P45" | "P90", number> = { P45: 45, P90: 90 };

      // Se cylinderType for undefined, o '?? "P45"' garante um valor padrão válido
      const weight = weights[cylinderType ?? "P45"];

      const currentUnitPrice = unitPrice ?? 0;
      const currentMultiplier = multiplierFactor ?? 2.25; // Mantém o seu padrão 2.25

      calculatedUnitValue =
        weight > 0 ? (currentUnitPrice / weight) * currentMultiplier : 0;
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
