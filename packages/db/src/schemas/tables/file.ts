import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { user } from "./user"

export const file = pgTable("file", {
	id: uuid("id").primaryKey().defaultRandom(),
	resourceType: text("resource_type").notNull(),
	addedDate: timestamp("added_date", { withTimezone: true }).notNull().defaultNow(),
	addedBy: text("added_by")
		.notNull()
		.references(() => user.id),
	fileKey: text("file_key").notNull(),
	fileName: text("file_name").notNull(),
})
