import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { user } from "./user"

export const cart = pgTable("cart", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	lastUpdated: timestamp("last_updated", { withTimezone: true }).notNull().defaultNow(),
})
