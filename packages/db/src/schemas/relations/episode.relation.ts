import { relations } from "drizzle-orm"
import { episode } from "../tables/episode"
import { season } from "../tables/season"

export const episodeRelations = relations(episode, ({ one }) => ({
	season: one(season, {
		fields: [episode.seasonId],
		references: [season.id],
	}),
}))
