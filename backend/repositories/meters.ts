import { initDB } from "../db.ts";

export interface CreateMeterDTO {
  month: string;
  year: number;
  apartmentId: number;
  water: number;
  gas: number;
}

export const MetersRepository = {
  async read(month: string, year: number) {
    const db = await initDB();

    let query = `
    SELECT 
      m.id,  
      m.month,
      m.year,
      m.apartment AS apartmendId,
      m.water,
      m.gas,
      m.createdAt,
      m.updatedAt,
      a.number AS apartment -- Traz o número real do apartamento
    FROM meters m
    INNER JOIN apartments a ON m.apartment = a.id
    WHERE m.month = ? AND m.year = ?
    ORDER BY m.createdAt DESC
    `;

    return await db.all(query, [month, year]);
  },

  async readConsumption(month: string, year: number) {
    const db = await initDB();

    const query = `
        SELECT 
          a.number AS apartment,
          IFNULL(m_atual.water, 0) AS water_current,
          IFNULL(m_atual.gas, 0) AS gas_current,
          IFNULL(m_ant.water, 0) AS water_previous,
          IFNULL(m_ant.gas, 0) AS gas_previous,
          
          CASE 
            WHEN m_atual.apartment IS NOT NULL THEN (IFNULL(m_atual.water, 0) - IFNULL(m_ant.water, 0))
            ELSE 0 
          END AS water_consumption,
          
          CASE 
            WHEN m_atual.apartment IS NOT NULL THEN (IFNULL(m_atual.gas, 0) - IFNULL(m_ant.gas, 0))
            ELSE 0 
          END AS gas_consumption
        FROM apartments a
        
        -- Traz a leitura do mês selecionado
        LEFT JOIN meters m_atual ON a.id = m_atual.apartment 
          AND m_atual.month = ? 
          AND m_atual.year = ?
          
        -- Busca a leitura anterior baseando-se unicamente na data do registro, ignorando IDs
        LEFT JOIN meters m_ant ON a.id = m_ant.apartment 
          AND m_ant.id = (
            SELECT id FROM meters 
            WHERE apartment = a.id 
              AND (year < ? OR (year = ? AND month < ?))
            ORDER BY year DESC, month DESC
            LIMIT 1
          )
        ORDER BY a.number ASC
      `;

    return await db.all(query, [month, year, year, year, month]);
  },

  async create(data: CreateMeterDTO) {
    const db = await initDB();
    const { month, year, apartmentId, water, gas } = data;

    const result = await db.run(
      "INSERT INTO meters (month, year, apartment, water, gas) VALUES (?, ?, ?, ?, ?)",
      [month, year, apartmentId, water, gas],
    );

    return result.lastID;
  },

  async update(id: string | number, data: CreateMeterDTO) {
    const db = await initDB();
    const { month, year, apartmentId, water, gas } = data;

    const result = await db.run(
      "UPDATE meters SET month = ?, year = ?, apartment = ?, water = ?, gas = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [month, year, apartmentId, water, gas, id],
    );

    return result.changes ?? 0;
  },

  async delete(id: string | number) {
    const db = await initDB();

    const result = await db.run("DELETE FROM meters WHERE id = ?", [id]);

    return (result as { changes: number }).changes ?? 0;
  },
};
