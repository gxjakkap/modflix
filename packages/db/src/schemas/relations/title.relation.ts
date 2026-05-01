import { relations } from "drizzle-orm"
import { people } from "../tables/people"
import { title } from "../tables/title"
import { titleGenre } from "../tables/title-genre"
import { userLibrary } from "../tables/user-library"

export const titleRelations = relations(title, ({ many }) => ({
	titleGenres: many(titleGenre),
	userLibrary: many(userLibrary),
	people: many(people),
}))
