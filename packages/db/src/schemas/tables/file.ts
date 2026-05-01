import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const file = pgTable("file", {
	id: uuid("id").primaryKey().defaultRandom(),
	resourceType: text("resource_type").notNull(),
	addedDate: timestamp("added_date").notNull().defaultNow(),
	addedBy: text("added_by").notNull(),
	fileKey: text("file_key").notNull(),
	fileName: text("file_name").notNull(),
})
