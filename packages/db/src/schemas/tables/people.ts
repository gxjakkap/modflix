import { pgTable, text, uuid } from "drizzle-orm/pg-core"
import { file } from "./file"

export const people = pgTable("people", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	imageId: uuid("image_id").references(() => file.id),
})
