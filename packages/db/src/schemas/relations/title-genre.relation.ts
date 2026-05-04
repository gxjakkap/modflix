import { relations } from "drizzle-orm"
import { genre } from "../tables/genre"
import { title } from "../tables/title"
import { titleGenre } from "../tables/title-genre"

export const titleGenreRelations = relations(titleGenre, ({ one }) => ({
	title: one(title, { fields: [titleGenre.titleId], references: [title.id] }),
	genre: one(genre, { fields: [titleGenre.genreId], references: [genre.id] }),
}))
