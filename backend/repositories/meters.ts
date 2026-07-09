import { db } from "../db/index.ts";
import { apartments, meters } from "../db/schema.ts";
import { eq, and, or, lt, desc, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";

export interface MeterDTO {
  month: number;
  year: number;
  apartmentId: number;
  water: number;
  gas: number;
}

export const MetersRepository = {
  async read(month: number, year: number) {
    const result = await db
      .select({
        id: meters.id,
        month: meters.month,
        year: meters.year,
        apartmentId: meters.apartmentId,
        water: meters.water,
        gas: meters.gas,
        createdAt: meters.createdAt,
        updatedAt: meters.updatedAt,
        apartment: apartments.apartment,
      })
      .from(meters)
      .innerJoin(apartments, eq(meters.apartmentId, apartments.id))
      .where(and(eq(meters.month, month), eq(meters.year, year)))
      .orderBy(desc(meters.createdAt));

    return result;
  },

  async readConsumption(month: number, year: number) {
    const mAtual = alias(meters, "m_atual");
    const mAnt = alias(meters, "m_ant");

    const result = await db
      .select({
        apartment: apartments.apartment,
        waterCurrent: sql<number>`IFNULL(${mAtual.water}, 0)`,
        gasCurrent: sql<number>`IFNULL(${mAtual.gas}, 0)`,
        waterPrevious: sql<number>`IFNULL(${mAnt.water}, 0)`,
        gasPrevious: sql<number>`IFNULL(${mAnt.gas}, 0)`,
        waterConsumption: sql<number>`
        CASE 
          WHEN ${mAtual.apartmentId} IS NOT NULL THEN (IFNULL(${mAtual.water}, 0) - IFNULL(${mAnt.water}, 0))
          ELSE 0 
        END
      `,
        gasConsumption: sql<number>`
        CASE 
          WHEN ${mAtual.apartmentId} IS NOT NULL THEN (IFNULL(${mAtual.gas}, 0) - IFNULL(${mAnt.gas}, 0))
          ELSE 0 
        END
      `,
      })
      .from(apartments)
      .leftJoin(
        mAtual,
        and(
          eq(apartments.id, mAtual.apartmentId),
          eq(mAtual.month, month),
          eq(mAtual.year, year),
        ),
      )
      .leftJoin(
        mAnt,
        and(
          eq(apartments.id, mAnt.apartmentId),
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
      .orderBy(apartments.apartment);

    return result;
  },

  async create(data: MeterDTO) {
    const { month, year, apartmentId, water, gas } = data;

    const result = await db
      .insert(meters)
      .values({ month, year, apartmentId, water, gas });

    return result.lastInsertRowid;
  },

  async update(id: number, data: MeterDTO) {
    const { month, year, apartmentId, water, gas } = data;

    const result = await db
      .update(meters)
      .set({ month, year, apartmentId, water, gas })
      .where(eq(meters.id, id));

    return result.changes ?? 0;
  },

  async delete(id: number) {
    const result = await db.delete(meters).where(eq(meters.id, id));

    return result.changes;
  },
};
