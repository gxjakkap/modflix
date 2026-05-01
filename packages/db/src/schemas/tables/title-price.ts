import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { title } from "./title"

export const titlePrice = pgTable("title_price", {
	id: uuid("id").primaryKey().defaultRandom(),
	titleId: uuid("title_id")
		.notNull()
		.references(() => title.id),
	price: numeric("price").notNull(),
	currenct: text("currency").notNull().default("THB"),
	addedDate: timestamp("added_date").notNull().defaultNow(),
	startDate: timestamp("start_date").notNull(),
	expiresDate: timestamp("expires_date"),
})
