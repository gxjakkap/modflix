import { relations } from "drizzle-orm"
import { season } from "../tables/season"
import { title } from "../tables/title"

export const seasonRelations = relations(season, ({ one }) => ({
	title: one(title, {
		fields: [season.titleId],
		references: [title.id],
	}),
}))
