import { pgEnum } from "drizzle-orm/pg-core";

export const titleTypeEnum = pgEnum("type", ["MOVIE", "SERIES"])
