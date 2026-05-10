import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { purchasementStatus } from "../enums/purchasement-status.enum"
import { title } from "./title"
import { user } from "./user"

export const purchasement = pgTable("purchasement", {
	id: uuid("id").primaryKey().defaultRandom(),
	titleId: uuid("title_id")
		.notNull()
		.references(() => title.id),
	purchaser: text("purchaser")
		.notNull()
		.references(() => user.id),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	status: purchasementStatus("status").notNull().default(purchasementStatus.enumValues[0]),
})
