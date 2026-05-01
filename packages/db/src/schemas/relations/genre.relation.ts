import { relations } from "drizzle-orm"
import { genre } from "../tables/genre"
import { titleGenre } from "../tables/title-genre"

export const genreRelations = relations(genre, ({ many }) => ({
	titleGenres: many(titleGenre),
}))
