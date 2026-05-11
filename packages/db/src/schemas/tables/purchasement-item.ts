import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core"
import { purchasement } from "./purchasement"
import { title } from "./title"
import { titlePrice } from "./title-price"

export const purchasementItem = pgTable(
	"purchasement_item",
	{
		purchasementId: uuid("purchasement_id")
			.notNull()
			.references(() => purchasement.id),
		titleId: uuid("title_id")
			.notNull()
			.references(() => title.id),
		priceId: uuid("price_id")
			.notNull()
			.references(() => titlePrice.id),
	},
	(table) => [primaryKey({ columns: [table.purchasementId, table.titleId] })],
)
