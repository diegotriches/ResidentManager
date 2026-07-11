import { db } from "../db/index.ts";
import { apartments, vouchers } from "../db/schema.ts";
import { eq, and, isNull, or, asc } from "drizzle-orm";

export const HomeRepository = {
  async pendingApartments(month: number, year: number) {
    const result = await db
      .select({
        apartment: apartments.apartment,
      })
      .from(apartments)
      .leftJoin(
        vouchers,
        and(
          eq(apartments.id, vouchers.apartmentId),
          eq(vouchers.month, month),
          eq(vouchers.year, year)
        )
      )
      .where(
        or(
          isNull(vouchers.apartmentId),
          eq(vouchers.isPaid, false)
        )
      )
      .orderBy(asc(apartments.apartment));

    return result;
  },
};