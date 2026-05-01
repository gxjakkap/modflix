import { relations } from "drizzle-orm"
import { cart } from "../tables/cart"
import { cartItem } from "../tables/cart-item"
import { title } from "../tables/title"

export const cartItemRelations = relations(cartItem, ({ one }) => ({
	cart: one(cart, {
		fields: [cartItem.cartId],
		references: [cart.id],
	}),
	title: one(title, {
		fields: [cartItem.titleId],
		references: [title.id],
	}),
}))
