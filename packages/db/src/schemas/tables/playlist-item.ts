import { sql } from "drizzle-orm"
import { check, integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core"
import { episode } from "./episode"
import { playlist } from "./playlist"
import { title } from "./title"

export const playlistItem = pgTable(
	"playlist_item",
	{
		playlistId: uuid("playlist_id")
			.notNull()
			.references(() => playlist.id, { onDelete: "cascade" }),
		order: integer("order").notNull(),
		titleId: uuid("title_id").references(() => title.id, { onDelete: "cascade" }),
		episodeId: uuid("episode_id").references(() => episode.id, { onDelete: "cascade" }),
	},
	(table) => [
		primaryKey({ columns: [table.playlistId, table.order] }),
		check(
			"is_either_movie_or_episode_not_both",
			sql`(${table.titleId} IS NOT NULL AND ${table.episodeId} IS NULL) OR (${table.titleId} IS NULL AND ${table.episodeId} IS NOT NULL)`,
		),
	],
)
