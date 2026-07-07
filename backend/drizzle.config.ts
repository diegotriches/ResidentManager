import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle", // Pasta onde ele criará o histórico de alterações (caso queira gerar sql automático)
  schema: "./db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "database.db", // O nome do seu arquivo de banco novamente
  },
});