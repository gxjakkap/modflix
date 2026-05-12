import { relations } from "drizzle-orm"
import { people } from "../tables/people"
import { title } from "../tables/title"
import { titlePeople } from "../tables/title-people"

export const titlePeopleRelations = relations(titlePeople, ({ one }) => ({
	title: one(title, { fields: [titlePeople.titleId], references: [title.id] }),
	people: one(people, {
		fields: [titlePeople.peopleId],
		references: [people.id],
	}),
}))
