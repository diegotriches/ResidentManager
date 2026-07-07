import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const apartments = sqliteTable("apartments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  apartment: text("apartment").notNull().unique(),
  ownerName: text("owner_name").notNull(),
});
