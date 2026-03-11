import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const genre = pgTable("genre", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique()
})
