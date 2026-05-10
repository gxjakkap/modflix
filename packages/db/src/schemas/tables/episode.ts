import { date, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { media } from "./media"
import { season } from "./season"

export const episode = pgTable("episode", {
	id: uuid("id").primaryKey().defaultRandom(),
	episodeNum: integer("episode_num").notNull(),
	seasonId: uuid("season_id")
		.notNull()
		.references(() => season.id), // TBA to erd
	name: text("name").notNull(),
	description: text("description"),
	releaseDate: date("release_date").notNull(),
	addedDate: timestamp("added_date", { withTimezone: true }).notNull().defaultNow(),
	mediaId: uuid("media_id")
		.notNull()
		.references(() => media.id),
})
