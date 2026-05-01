import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { user } from "./user"

export const cart = pgTable("cart", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => user.id),
	lastUpdated: timestamp("last_updated").notNull().defaultNow(),
})
