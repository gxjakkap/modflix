import { relations } from "drizzle-orm"
import { title } from "../tables/title"
import { user } from "../tables/user"
import { userLibrary } from "../tables/user-library"

export const userLibraryRelations = relations(userLibrary, ({ one }) => ({
	title: one(title, { fields: [userLibrary.titleId], references: [title.id] }),
	user: one(user, { fields: [userLibrary.userId], references: [user.id] }),
}))
