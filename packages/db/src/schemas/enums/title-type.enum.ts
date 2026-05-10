import { pgEnum } from "drizzle-orm/pg-core"

export const titleTypeEnum = pgEnum("title_type", ["MOVIE", "SERIES"])
