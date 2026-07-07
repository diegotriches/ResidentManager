import { initDB } from "../db.ts";

export const HomeRepository = {
  async pendingApartments(month: string, year: number) {
    const db = await initDB();

    const result = await db.all (`
        SELECT a.apartment
        FROM apartments a
        LEFT JOIN vouchers v
         ON a.id = v.apartmentId
         AND v.month = ?
         AND v.year = ?
         WHERE v.apartmentId IS NULL OR is_paid = 0
        ORDER BY a.apartment ASC
    `, [month, year]);

    return result;
  },
};
