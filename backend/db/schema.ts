import {
  sqliteTable,
  integer,
  text,
  real,
  unique,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// APARTAMENTOS
export const apartments = sqliteTable("apartments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  apartment: text("apartment").notNull().unique(),
  ownerName: text("owner_name").notNull(),
});

// CONTAS CONDOMINIO
export const bills = sqliteTable("bills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  bill: text("bill").notNull(),
  totalValue: real("total_value").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

// CONTAS CONSUMO (AGUA E GAS)
export const utilityBills = sqliteTable(
  "utility-bills",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type", { enum: ["water", "gas"] }).notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    totalConsumption: real("total_consumption"),
    consumptionValue: real("consumption_value"),
    taxesValue: real("taxes_value"),
    cylinderType: text("cylinder_type", { enum: ["P45", "P90"] }),
    unitPrice: real("unit_price"),
    multiplierFactor: real("multiplier_factor").default(2.25),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    typeMonthYearUnique: unique("unique_utility_bill").on(
      table.type,
      table.month,
      table.year,
    ),
  }),
);

// MEDIDORES
export const meters = sqliteTable(
  "meters",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    apartmentId: integer("apartment_id")
      .notNull()
      .references(() => apartments.id, { onDelete: "cascade" }),
    water: real("water").notNull(),
    gas: real("gas").notNull(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    apartmentMonthYearUnique: unique("meters_apartment_month_year_unique").on(
      table.apartmentId,
      table.month,
      table.year,
    ),
  }),
);

// COMPROVANTES
export const vouchers = sqliteTable(
  "vouchers",
  {
    apartmentId: integer("apartment_id")
      .notNull()
      .references(() => apartments.id, { onDelete: "cascade" }),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    isPaid: integer("is_paid", { mode: "boolean" }).default(false),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.apartmentId, table.month, table.year] }),
  }),
);

// CATEGORIAS
export const billsCategories = sqliteTable("billsCategories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryName: text("category_name").notNull(),
});
