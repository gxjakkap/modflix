import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: new URL("../../.env", import.meta.url) });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.PG_USER || "",
    password: process.env.PG_PASSWORD || "",
    host: process.env.PG_HOST || "",
    port: Number(process.env.PG_PORT) || 5432,
    database: process.env.PG_DBNAME || "",
  },
});
