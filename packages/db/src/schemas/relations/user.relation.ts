import { relations } from "drizzle-orm"
import { account } from "../tables/account"
import { session } from "../tables/session"
import { user } from "../tables/user"
import { userLibrary } from "../tables/user-library"

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	userLibrary: many(userLibrary),
}))
