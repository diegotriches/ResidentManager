import { db } from "../db/index.ts";
import { apartments, meters, utilityBills, vouchers } from "../db/schema.ts";
import { eq, and, or, lt, desc, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";

export interface VoucherReport {
  apartmentId: number;
  apartment: string;
  waterCurrent: number;
  gasCurrent: number;
  waterPrevious: number;
  gasPrevious: number;
  isPaid: boolean;
  gasConsumption: number;
  waterPricePerM3: number;
  waterFeePerApartment: number;
  totalWaterValue: number;
}

export interface VoucherDTO {
  apartmentId: number;
  month: number;
  year: number;
  isPaid: boolean;
}

export const VouchersRepository = {
  async read(month: number, year: number): Promise<VoucherReport[]> {
    // 1. Criamos os dois aliases para a tabela 'meters' (m_atual e m_ant)
    const mAtual = alias(meters, "m_atual");
    const mAnt = alias(meters, "m_ant");

    const totalApts = sql<number>`(SELECT COUNT(*) FROM ${apartments})`;

    // 2. Subquery para buscar a fatura de água isolada do mês/ano
    const faturaSubquery = db
      .select({
        id: utilityBills.id,
        consumptionValue: utilityBills.consumptionValue,
        totalConsumption: utilityBills.totalConsumption,
        taxesValue: utilityBills.taxesValue,
        month: utilityBills.month,
        year: utilityBills.year,
      })
      .from(utilityBills)
      .where(
        and(
          eq(utilityBills.type, "water"),
          eq(utilityBills.month, month),
          eq(utilityBills.year, year),
        ),
      )
      .limit(1)
      .as("fatura");

    // 3. Montagem da Query Principal
    const result = await db
      .select({
        apartmentId: apartments.id,
        apartment: apartments.apartment,
        waterCurrent: sql<number>`IFNULL(${mAtual.water}, 0)`,
        gasCurrent: sql<number>`IFNULL(${mAtual.gas}, 0)`,
        waterPrevious: sql<number>`IFNULL(${mAnt.water}, 0)`,
        gasPrevious: sql<number>`IFNULL(${mAnt.gas}, 0)`,
        isPaid: sql<boolean>`IFNULL(${vouchers.isPaid}, 0)`,
        gasConsumption: sql<number>`
        CASE 
          WHEN ${mAtual.apartmentId} IS NOT NULL THEN (IFNULL(${mAtual.gas}, 0) - IFNULL(${mAnt.gas}, 0))
          ELSE 0 
        END
      `,
        waterPricePerM3: sql<number>`
        CASE 
          WHEN ${faturaSubquery.id} IS NOT NULL AND IFNULL(${faturaSubquery.totalConsumption}, 0) > 0 
          THEN (IFNULL(${faturaSubquery.consumptionValue}, 0) / ${faturaSubquery.totalConsumption})
          ELSE 0 
        END
      `,
        waterFeePerApartment: sql<number>`
        CASE 
          WHEN ${faturaSubquery.id} IS NOT NULL AND ${totalApts} > 0 
          THEN (IFNULL(${faturaSubquery.taxesValue}, 0) / ${totalApts})
          ELSE 0 
        END
      `,
        totalWaterValue: sql<number>`
        CASE 
          WHEN ${faturaSubquery.id} IS NOT NULL THEN 
            (IFNULL(${mAtual.water}, 0) - IFNULL(${mAnt.water}, 0)) * (
              CASE 
                WHEN IFNULL(${faturaSubquery.totalConsumption}, 0) > 0 
                THEN (IFNULL(${faturaSubquery.consumptionValue}, 0) / ${faturaSubquery.totalConsumption})
                ELSE 0 
              END
            ) + (
              CASE 
                WHEN ${totalApts} > 0 
                THEN (CAST(IFNULL(${faturaSubquery.taxesValue}, 0) AS REAL) / ${totalApts}) 
                ELSE 0 
              END
            )
          ELSE 0 
        END
      `,
      })
      .from(apartments)

      // 1. Leitura do mês atual
      .leftJoin(
        mAtual,
        and(
          eq(mAtual.apartmentId, apartments.id),
          eq(mAtual.month, month),
          eq(mAtual.year, year),
        ),
      )

      // 2. Leitura anterior cronológica
      .leftJoin(
        mAnt,
        and(
          eq(mAnt.apartmentId, apartments.id),
          eq(
            mAnt.id,
            db
              .select({ id: meters.id })
              .from(meters)
              .where(
                and(
                  eq(meters.apartmentId, apartments.id),
                  or(
                    lt(meters.year, year),
                    and(eq(meters.year, year), lt(meters.month, month)),
                  ),
                ),
              )
              .orderBy(desc(meters.year), desc(meters.month))
              .limit(1),
          ),
        ),
      )

      // 3. Fatura de água isolada
      .leftJoin(
        faturaSubquery,
        and(
          sql`1 = 1`,
          eq(faturaSubquery.year, year),
          eq(faturaSubquery.month, month),
        ),
      )

      // 4. Status de pagamento do voucher
      .leftJoin(
        vouchers,
        and(
          eq(vouchers.apartmentId, apartments.id),
          eq(vouchers.month, month),
          eq(vouchers.year, year),
        ),
      )

      .orderBy(apartments.apartment);

    return result;
  },

  async update(data: VoucherDTO) {
    const { apartmentId, month, year, isPaid } = data;

    const result = await db
      .insert(vouchers)
      .values({ apartmentId, month, year, isPaid })
      .onConflictDoUpdate({
        target: [vouchers.apartmentId, vouchers.month, vouchers.year],
        set: { isPaid },
      });

    return result.changes ?? 0;
  },
};
