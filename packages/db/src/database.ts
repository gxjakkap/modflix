import { resolve } from "node:path"
import * as dotenv from "dotenv"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"

dotenv.config({ path: resolve("../../.env") })

const { Pool } = pg

const pool = new Pool({
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	host: process.env.PG_HOST,
	port: parseInt(process.env.PG_PORT || "5432", 10),
	database: process.env.PG_DBNAME,
})

export const db = drizzle(pool)
