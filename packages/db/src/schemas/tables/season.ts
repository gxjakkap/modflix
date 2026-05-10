import { date, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { title } from "./title"

export const season = pgTable("season", {
	id: uuid("id").primaryKey().defaultRandom(),
	seasonNum: integer("season_num").notNull(),
	titleId: uuid("title_id")
		.notNull()
		.references(() => title.id), // TBA to erd
	releaseDate: date("release_date").notNull(),
	addedDate: timestamp("added_date", { withTimezone: true }).notNull().defaultNow(),
})
