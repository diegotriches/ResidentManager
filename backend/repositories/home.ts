import { initDB } from "../db.ts";

export const HomeRepository = {
  async pendingApartments(month: string, year: number) {
    const db = await initDB();

    const result = await db.all (`
        SELECT a.number AS apartment
        FROM apartments a
        LEFT JOIN vouchers v
         ON a.number = v.apartment
         AND v.month = ?
         AND v.year = ?
         WHERE v.apartment IS NULL OR is_paid = 0
        ORDER BY apartment ASC
    `, [month, year]);

    return result;
  },
};
