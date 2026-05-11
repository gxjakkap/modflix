import { title } from "@modflix/db/schema"
import { createSelectSchema } from "drizzle-typebox"
import { t } from "elysia"

const titleSchema = createSelectSchema(title)

export const getProductsModel = {
	query: t.Object({
		page: t.Numeric({ default: 1, minimum: 1 }),
		limit: t.Numeric({ default: 20, minimum: 1, maximum: 100 }),
		search: t.Optional(t.String()),
	}),
	response: t.Object({
		data: t.Array(titleSchema),
		pagination: t.Object({
			page: t.Number(),
			limit: t.Number(),
			total: t.Number(),
			totalPages: t.Number(),
			hasNext: t.Boolean(),
			hasPrev: t.Boolean(),
		}),
	}),
}
