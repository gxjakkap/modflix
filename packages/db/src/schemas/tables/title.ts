import { sql } from "drizzle-orm"
import { check, date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { titleTypeEnum } from "../enums/title-type.enum"
import { file } from "./file"
import { media } from "./media"

export const title = pgTable(
	"title",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		addedDate: timestamp("added_date", { withTimezone: true }).notNull().defaultNow(),
		releaseDate: date("release_date").notNull(),
		type: titleTypeEnum("type").notNull(),
		mediaRef: uuid("media_ref").references(() => media.id),
		imageBannerId: uuid("image_banner_id").references(() => file.id),
		imagePosterId: uuid("image_poster_id").references(() => file.id),
	},
	(table) => [check("type_movie_media_ref_not_null", sql`(${table.type} != 'MOVIE' OR ${table.mediaRef} IS NOT NULL)`)],
)
