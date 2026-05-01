import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { file } from "./file"

export const media = pgTable("media", {
	id: uuid("id").primaryKey().defaultRandom(),
	fileId: uuid("file_id")
		.notNull()
		.references(() => file.id),
	duration: integer("duration").notNull(),
	createdBy: text("created_by").notNull(),
})
