import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core"

export const userLibrary = pgTable(
	"user_library",
	{
		userId: uuid("user_id").notNull(),
		titleId: uuid("title_id").notNull(),
		addedDate: timestamp("added_date").notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.titleId] })],
)
