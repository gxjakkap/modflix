import { config } from "dotenv"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"

config({ path: new URL("../../../.env", import.meta.url) })

const { Pool } = pg

const pool = new Pool({
	user: process.env.PG_USER || "",
	password: process.env.PG_PASSWORD || "",
	host: process.env.PG_HOST || "",
	port: Number(process.env.PG_PORT) || 5432,
	database: process.env.PG_DBNAME || "",
})

export const db = drizzle(pool)
