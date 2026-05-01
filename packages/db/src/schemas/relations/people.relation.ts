import { relations } from "drizzle-orm"
import { people } from "../tables/people"
import { titlePeople } from "../tables/title-people"

export const peopleRelations = relations(people, ({ many }) => ({
	titlePeople: many(titlePeople),
}))
