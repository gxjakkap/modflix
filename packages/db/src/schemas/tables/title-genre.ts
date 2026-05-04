import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core"
import { genre } from "./genre"
import { title } from "./title"

export const titleGenre = pgTable(
	"title_genre",
	{
		titleId: uuid("title_id")
			.notNull()
			.references(() => title.id),
		genreId: uuid("genre_id")
			.notNull()
			.references(() => genre.id),
	},
	(table) => [primaryKey({ columns: [table.titleId, table.genreId] })],
)
