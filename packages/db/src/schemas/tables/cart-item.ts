import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core"
import { cart } from "./cart"
import { title } from "./title"
import { titlePrice } from "./title-price"

export const cartItem = pgTable(
	"cart_item",
	{
		cartId: uuid("cart_id")
			.notNull()
			.references(() => cart.id),
		titleId: uuid("title_id")
			.notNull()
			.references(() => title.id),
		priceId: uuid("price_id")
			.notNull()
			.references(() => titlePrice.id),
		addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.cartId, table.titleId] })],
)
