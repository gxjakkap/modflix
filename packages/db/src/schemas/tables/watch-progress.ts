import { integer, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core"
import { media } from "./media"
import { user } from "./user"

export const watchProgress = pgTable(
	"watch_progress",
	{
		mediaId: uuid("media_id")
			.notNull()
			.references(() => media.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		progress: integer("progress").notNull().default(0),
		lastViewed: timestamp("last_viewed").notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.mediaId, table.userId] })],
)
