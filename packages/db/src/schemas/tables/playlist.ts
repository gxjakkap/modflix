import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { playlistVisibilitySettings } from "../enums/playlist-visibility-settings.enum"
import { user } from "./user"

export const playlist = pgTable("playlist", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	owner: text("owner")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	visibility: playlistVisibilitySettings("visibility").notNull().default(playlistVisibilitySettings.enumValues[0]),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
