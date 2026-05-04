import { pgTable, text, uuid } from "drizzle-orm/pg-core"

export const people = pgTable("people", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	imageUrl: text("image_url"),
})
