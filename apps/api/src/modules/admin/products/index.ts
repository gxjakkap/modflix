import { db } from "@modflix/db"
import { count, ilike } from "@modflix/db/orm"
import { title } from "@modflix/db/schema"
import Elysia from "elysia"
import { ErrorModel } from "@/schemas/error"
import { getProductsModel } from "./model"

export const productsModule = new Elysia({ prefix: "/products" }).get(
	"/",
	async ({ query }) => {
		const { page, limit, search } = query
		const offset = (page - 1) * limit

		const where = search ? ilike(title.name, `%${search}%`) : undefined

		const [rows, [{ total }]] = await Promise.all([
			db.select().from(title).limit(limit).offset(offset),
			db.select({ total: count() }).from(title).where(where),
		])

		return {
			data: rows,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
				hasNext: page * limit < total,
				hasPrev: page > 1,
			},
		}
	},
	{
		query: getProductsModel.query,
		response: {
			200: getProductsModel.response,
			404: ErrorModel,
			400: ErrorModel,
			500: ErrorModel,
		},
	},
)
