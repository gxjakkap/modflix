import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core"
import { people } from "./people"
import { title } from "./title"

export const titlePeople = pgTable(
	"title_people",
	{
		titleId: uuid("title_id")
			.notNull()
			.references(() => title.id),
		peopleId: uuid("people_id")
			.notNull()
			.references(() => people.id),
		role: text("role").notNull(),
	},
	(table) => [primaryKey({ columns: [table.titleId, table.peopleId, table.role] })],
)
