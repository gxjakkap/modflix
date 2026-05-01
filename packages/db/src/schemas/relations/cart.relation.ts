import { relations } from "drizzle-orm"
import { cart } from "../tables/cart"
import { cartItem } from "../tables/cart-item"
import { user } from "../tables/user"

export const cartRelations = relations(cart, ({ one, many }) => ({
	user: one(user, { fields: [cart.userId], references: [user.id] }),
	items: many(cartItem),
}))
