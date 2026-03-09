import * as dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

dotenv.config()

export default defineConfig({
	out: "./drizzle",
	schema: "./src/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		user: process.env.PG_USER,
		password: process.env.PG_PASSWORD,
		host: process.env.PG_HOST || "",
		port: parseInt(process.env.PG_PORT || "5432", 10),
		database: process.env.PG_DBNAME || "",
	},
})
