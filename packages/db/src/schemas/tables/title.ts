import { sql } from "drizzle-orm"
import { check, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { titleTypeEnum } from "../enums/title-type.enum"
import { media } from "./media"

export const title = pgTable(
	"title",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		addedDate: timestamp("added_date", { withTimezone: true }).notNull().defaultNow(),
		releaseDate: timestamp("release_date", { withTimezone: true }).notNull(),
		type: titleTypeEnum("type").notNull(),
		mediaRef: uuid("media_ref").references(() => media.id),
		imageBanner: text("image_banner"),
		imagePoster: text("image_poster"),
	},
	(t) => [check("type_movie_media_ref_not_null", sql`(${t.type} != 'MOVIE' OR ${t.mediaRef} IS NOT NULL)`)],
)
