import { config } from "dotenv"
import { drizzle } from "drizzle-orm/node-postgres/driver"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import pg from "pg"

config({ path: new URL("../../../.env", import.meta.url) })

const { Pool } = pg

const cred = {
	user: process.env.PG_USER || "",
	password: process.env.PG_PASSWORD || "",
	host: process.env.PG_HOST || "",
	port: Number(process.env.PG_PORT) || 5432,
	database: process.env.PG_DBNAME || "",
}

const pool = new Pool(cred)

const db = drizzle(pool)

async function runMigrations() {
	try {
		await migrate(db, { migrationsFolder: "./drizzle" })
		console.log("Migrations completed!")
		process.exit(0)
	} catch (error) {
		console.error("Migration error:", error)
		process.exit(1)
	}
}

runMigrations()
