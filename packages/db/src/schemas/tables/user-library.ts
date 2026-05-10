import { pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { title } from "./title"
import { user } from "./user"

export const userLibrary = pgTable(
	"user_library",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id),
		titleId: uuid("title_id")
			.notNull()
			.references(() => title.id),
		addedDate: timestamp("added_date", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.titleId] })],
)
