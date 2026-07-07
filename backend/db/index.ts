import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema.ts";

// Altere "database.db" para o nome exato do seu arquivo de banco atual (ex: "banco.db")
const sqlite = new Database("database.db"); 

export const db = drizzle(sqlite, { schema });